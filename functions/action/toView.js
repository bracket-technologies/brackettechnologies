const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { toValue, isNumber } = require("./toValue")
const { toArray } = require("./toArray")
const { override } = require("./merge")
const { toLine } = require("./toLine")
const { initView, removeView, getViewParams } = require("./view")
const { addresser, printAddress } = require("./addresser")
const { toAwait } = require("./toAwait")
const { kernel } = require("./kernel")
const { isParam } = require("./isParam")
const { executable } = require("./executable")
const { logger } = require("./logger")
const { replaceNbsps } = require("./replaceNbsps")
const { colorize } = require("./colorize")
const { getJsonFiles } = require("./jsonFiles")
const { toParam } = require("./toParam")
const { closePublicViews } = require("./closePublicViews")
const { starter } = require("./starter")
const cssStyleKeyNames = require("./cssStyleKeyNames")
const Input = require("../view/Input")

const toView = ({ _window, lookupActions, stack, address, req, res, __, id, data = {} }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  var view = data.view || views[id]

  // interpret view
  if (!view.__interpreted__) {

    // init view
    var details = initView({ views, global, id, parent: data.parent, ...(data.view || {}), __ })
    view = details.view
    id = details.id
    
    // no view
    if (!view.view) return removeView({ _window, lookupActions, stack, id, address, __ })

    // encode
    view.__name__ = toCode({ _window, id, string: toCode({ _window, id, string: view.__name__, start: "'" }) })

    // 
    var name = view.__name__.split("?")[0]
    var params = view.__name__.split("?")[1]
    var conditions = view.__name__.split("?")[2]
    var subParams = name.split(":").slice(1).join(":") || ""
    view.__name__ = name.split(":")[0]

    // global:()
    if (subParams.includes("()") || view.__name__.includes("()")) {
      view.__name__ = view.__name__ + ":" + subParams
      subParams = ""
    }

    // action view
    if (isParam({ _window, string: view.__name__ })) {

      view.__name__ = "Action"
      conditions = params
      params = subParams
      subParams = ""
    }

    // loop
    var loop = view.__name__.charAt(0) === "@" && view.__name__.length == 6

    // view name
    view.__name__ = toValue({ _window, id, req, res, data: view.__name__, __, stack })

    // no view
    if (!view.__name__ || typeof view.__name__ !== "string" || view.__name__.charAt(0) === "#") return removeView({ _window, id, stack, address })
    else views[id] = view

    // executable view name
    if (executable({ _window, string: view.__name__ })) {
      toValue({ _window, id, req, res, data: view.__name__, lookupActions, __, stack })
      view.__name__ = "Action"
    }

    // interpret subparams
    if (subParams) {

      var { data = {}, conditionsNotApplied } = toLine({ _window, lookupActions, stack, id, data: { string: subParams }, req, res, __ })
      if (conditionsNotApplied) return removeView({ _window, id, stack, address })
      else subParams = data
    }

    // [View]
    if (loop) return loopOverView({ _window, id, stack, lookupActions, __, address, data: subParams || {}, req, res })


    // subparam is params or id
    if (typeof subParams === "object") {

      my__ = [subParams, ...__]
      override(view, subParams)

    } else if (subParams && typeof subParams === "string" && subParams !== id) {

      var newID = subParams
      if (views[newID] && view.id !== newID) newID += "_" + generate()

      delete Object.assign(views, { [newID]: views[id] })[id]
      id = newID
      views[id].id = id
      view = views[id]
      view.__customID__ = true
    }

    // conditions
    var approved = toApproval({ _window, lookupActions, stack, data: conditions, id, req, res, __ })
    if (!approved) return removeView({ _window, id, stack, address })
    
    // params
    if (params) {
      
      toParam({ _window, lookupActions, stack, data: params, id, req, res, mount: true, __ })

      if (view.id !== id) {

        view.__customID__ = true
        delete views[id]
        id = view.id
      }
    }
    
    // data
    view.data = kernel({ _window, id, stack, lookupActions, data: { path: view.__dataPath__, data: global[view.doc] || {}, value: view.data, key: true }, __ })

    // prepare for toHTML
    componentModifier({ _window, id })

    // built-in view
    if (view.__name__ === "Input" && !view.__templated__) var { id, view } = builtInViewHandler({ _window, lookupActions, stack, id, req, res, __ })

    // set interpreted
    view.__interpreted__ = true
    
    // maybe update in params or root
    if (address.blocked) return// toAwait({ _window, lookupActions, stack, address, id, req, res, __ })
    
    // asynchronous actions within view params
    if (address.hold) return addresser({ _window, id, stack, switchWithAddress: address, type: "function", function: "toView", __, lookupActions, stack, data: { view } })
  }

  // custom View
  if (global.data.views.includes(view.__name__)) {

    // query custom view
    if (!global.__queries__.views.includes(view.__name__) && !global.data.view[view.__name__]) {
      
      address.interpreting = false
      address.status = "Wait"
      address.data = { view }
      
      var { address, data } = addresser({ _window, id, stack, nextAddress: address, __, lookupActions, stack, type: "data", action: "search()", status: "Start", asynchronous: true, params: `loader.show;collection=view;doc=${view.__name__}`, waits: `loader.hide;__queries__:().views.push():[${view.__name__}];data:().view.${view.__name__}=_.data` })
      return require("./search").search({ _window, lookupActions, stack, address, id, __, req, res, data })
    }

    // continue to custom view
    else {
      
      var newView = {
        ...global.data.view[view.__name__],
        __interpreted__: false,
        __customView__: view.__name__,
        __viewPath__: [view.__name__],
        __customViewPath__: [...view.__customViewPath__, view.__name__],
        __lookupViewActions__: [...view.__lookupViewActions__, { type: "customView", view: view.__name__ }]
      }

      // id
      if (newView.id && views[newView.id] && newView.id !== id) newView.id += "_" + generate()
      else if (newView.id) newView.__customID__ = true
      else if (!newView.id) newView.id = id

      var child = { ...view, ...newView }
      views[child.id] = child

      var data = getViewParams({ view })

      // document
      if (view.__name__ === "document") {

        // log start document
        logger({ _window, data: { key: "documenter", start: true } })

        // address: document
        address = addresser({ _window, id: child.id, nextAddress: address, type: "function", file: "toView", function: "documenter", stack, __, logger: { key: "documenter", end: true } }).address

        // get shared public views
        Object.entries(getJsonFiles({ search: { collection: "public/view" } })).map(([doc, data]) => {

          global.data.view[doc] = { ...data, id: doc }
          global.data.views.push(doc)
          global.__queries__.views.push(doc)
        })

        address = addresser({ _window, stack, status: "Start", type: "function", function: "toView", nextAddress: address, lookupActions, __ }).address
      }
      
      // address
      return toView({ _window, stack, address, req, res, lookupActions, __: [...(Object.keys(data).length > 0 ? [data] : []), ...__], data: { view: child, parent: view.__parent__ } })
    }
  }
  
  // render children
  if (view.children.length > 0) {

    // html address
    address = addresser({ _window, id, stack, type: "function", function: "toHTML", file: "toView", __, lookupActions, nextAddress: address }).address

    var lastIndex = view.children.length - 1;

    // address children
    [...view.children].reverse().map((child, index) => {

      var childID = child.id || generate()
      views[childID] = { ...child, id: childID, __view__: true, __parent__: id, __viewPath__: [...view.__viewPath__, "children", lastIndex - index], __childIndex__: lastIndex - index }

      // address
      address = addresser({ _window, index, id: childID, stack, type: "function", function: "toView", __, lookupActions, nextAddress: address, data: { view: views[childID] } }).address
    
    })//.reverse().map(address => !address.hold && toView({ _window, lookupActions, stack, id, req, res, address, ...(address.params || {}), data: address.data, __ }))
  
  } else toHTML({ _window, id, stack, __ })

  // address
  toAwait({ _window, lookupActions, stack, address, id, req, res, __ })
}

const sortAndArrange = ({ data, sort, arrange }) => {

  var index = 0

  if (sort) {

    var _sorted = data.slice(index).sort()
    data = data.slice(0, index)
    data.push(..._sorted)
  }

  if (arrange) toArray(arrange).map(el => {

    var _index = data.findIndex(_el => _el == el)
    if (_index > -1) {

      var _el = data[index]
      data[index] = el
      data[_index] = _el
      index += 1
    }
  })

  return data
}

const componentModifier = ({ _window, id }) => {

  var view = _window ? _window.views[id] : window.views[id]

  // icon
  if (view.__name__ === "Icon") {

    view.icon = view.icon || {}
    view.icon.name = view.name || view.icon.name || (typeof view.data === "string" && view.data) || ""
    if ((view.icon.google || view.google) && (!view.google.symbol && !view.symbol)) {

      view.symbol = {}
      view.google.symbol = {}
      if (view.google.outlined) view.outlined = true
      else if (view.google.filled) view.filled = true
      else if (view.google.rounded) view.rounded = true
      else if (view.google.sharp) view.sharp = true
      else if (view.google.twoTone) view.twoTone = true
      else view.google = {}

    } else if ((view.icon.google || view.google) && (view.symbol || view.google.symbol)) {

      view.symbol = view.google.symbol = {}
      if (view.google.symbol) view.symbol.outlined = true
      else if (view.google.symbol.filled) view.symbol.filled = true
      else if (view.google.symbol.rounded) view.symbol.rounded = true
      else if (view.google.symbol.sharp) view.symbol.sharp = true
      else if (view.google.symbol.twoTone) view.symbol.twoTone = true
      else view.google = {}

    } else {

      view.symbol = {}
    }
  }

  // textarea
  else if (view.textarea && !view.__templated__) {

    view.style = view.style || {}
    view.input = view.input || {}
    view.input.style = view.input.style || {}
    view.input.style.height = "fit-content"
  }

  // input
  else if (view.__name__ === "Input") {

    view.input = view.input || {}
    if (view.value) view.input.value = view.input.value || view.value
    if (view.checked !== undefined) view.input.checked = view.checked
    if (view.max !== undefined) view.input.max = view.max
    if (view.min !== undefined) view.input.min = view.min
    if (view.name !== undefined) view.input.name = view.name
    if (view.accept !== undefined) view.input.accept = view.input.accept
    if (view.multiple !== undefined) view.input.multiple = true
    if (view.input.placeholder) view.placeholder = view.input.placeholder
    view.text = view.input.value

  } else if (view.__name__ === "Image") {

    view.src = view.src || (typeof view.data === "string" && view.data) || ""

  } else if (view.__name__ === "Text") {

    view.text = view.text !== undefined ? view.text : ((typeof view.data === "string" && view.data) || "")
  }
}

const loopOverView = ({ _window, id, stack, lookupActions, __, address, data = {}, req, res }) => {

  const global = _window ? _window.global : window.global
  const views = _window ? _window.views : window.views
  var view = views[id]

  // mount
  if (!data.preventDefault && (data.doc || data.path)) data.mount = true

  // path
  data.path = data.path || []

  // split path
  data.path = Array.isArray(data.path) ? data.path : data.path !== undefined ? (data.path || "").split(".") : []

  if (data.data) {

    data.doc = data.doc || generate()
    global[data.doc] = global[data.doc] || data.data || {}
    data.__dataPath__ = data.path

  } else {

    data.__dataPath__ = [...(data.doc ? [] : view.__dataPath__), ...data.path]
    data.doc = data.doc || view.doc || generate()
    global[data.doc] = global[data.doc] || {}
  }

  var { doc, data = {}, __dataPath__ = [], mount, path, keys, preventDefault, ...myparams } = data

  // data
  data = kernel({ _window, lookupActions, stack, id, data: { path: __dataPath__, data: global[doc] }, req, res, __ })

  var loopData = []
  var isObj = !Array.isArray(data) && typeof data === "object"
  if (isObj && keys) loopData = Object.keys(data)
  else if (Array.isArray(data)) {
    if (data.length === 1) loopData = ["0"]
    else loopData = Object.keys(data)
  } else if (isObj) loopData = ["0"]

  var values = keys ? data : toArray(data), address = {}
  if (keys && !Array.isArray(data)) loopData = sortAndArrange({ data: loopData, sort: myparams.sort, arrange: myparams.arrange })

  var lastIndex = loopData.length - 1;

  // view
  [...loopData].reverse().map((key, index) => {

    view.__looped__ = true
    index = lastIndex - index

    var params = { i: index, __loopIndex__: index, view: view.__name__ + "?" + view.view.split("?").slice(1).join("?"), id: `${view.id}_${index}` }
    key = isNumber(key) ? parseInt(key) : key
    if (!preventDefault && mount) params = { ...params, doc, __dataPath__: [...__dataPath__, key] }

    views[params.id] = { __view__: true, __loop__: true, __mount__: mount, ...clone(view), ...myparams, ...params }

    address = addresser({ _window, id: params.id, stack, nextAddress: address, type: "function", function: "toView", renderer: true, blockable: false, __: [values[key], ...__], lookupActions, data: { view: views[params.id] } }).address

  })//.reverse().map(address => !stack.addresses[0].asynchronous && toView({ _window, lookupActions, stack, req, res, address, ...(address.params || {}), data: address.data, __ }))

  toAwait({ _window, lookupActions, stack, address, id, req, res, __ })
  removeView({ _window, id, stack, address })
}

const builtInViewHandler = ({ _window, lookupActions, stack, id, req, res, __ }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  var view = views[id]

  views[id] = Input(view)
  var { id, view } = initView({ views, global, parent: views[id].__parent__, ...views[id] })

  toLine({ _window, lookupActions, stack, data: { string: view.view, id, index: 1 }, req, res, mount: true, __ })
  view.__name__ = view.view.split("?")[0]

  if (view.id !== id) {

    delete Object.assign(views, { [view.id]: views[id] })[id]
    id = view.id
  }

  componentModifier({ _window, id })

  return { id, view }
}

const toHTML = ({ _window, id, stack, __ }) => {

  const views = _window ? _window.views : window.views

  var view = views[id], parent = views[view.__parent__]
  var name = view.__name__, html = ""

  // remove view
  delete view.view
  delete view.children
  delete view.functions
  
  if (name === "Action") return

  // linkable
  //if (view.link && !view.__linked__) return link({ _window, id, stack, __ })

  // text
  var text = typeof view.text !== "object" && view.text !== undefined ? view.text : ((view.editable || view.__name__ === "Input" || view.__name__ === "Text") && typeof view.data !== "object" && view.data !== undefined) ? view.data : ""

  // replace encoded spaces
  if (text) text = replaceNbsps(text)

  // html
  var innerHTML = (view.__childrenRef__.map(({ id }) => views[id].__html__).join("") || text || "") + ""

  // required
  if (view.required && name === "Text") {

    if (typeof view.required === "string") view.required = {}
    name = "View"
    view.style.display = "block"
    innerHTML += `<span style='color:red; font-size:${(view.required.style && view.required.style.fontSize) || "1.6rem"}; padding:${(view.required.style && view.required.style.padding) || "0 0.4rem"}'>*</span>`
  }

  // html attributes
  var atts = Object.entries(view.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

  // styles
  view.__htmlStyles__ = ""
  if (view.style) {
    Object.entries(view.style).map(([style, value]) => {
      view.__htmlStyles__ += `${cssStyleKeyNames[style] || style}:${value}; `
    })

    view.__htmlStyles__ = view.__htmlStyles__.slice(0, -2)
  }

  // colorize
  if (view.colorize) {

    innerHTML = toCode({ _window, id, string: toCode({ _window, id, string: innerHTML, start: "'" }) })
    innerHTML = colorize({ _window, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
  }

  if (name === "View") {
    html = `<div ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ''} spellcheck='false' ${view.editable && !view.readonly ? 'contenteditable' : ''} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML || view.text || ''}</div>`
  } else if (name === "Image") {
    html = `<img ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' alt='${view.alt || ''}' id='${view.id}' style='${view.__htmlStyles__}' ${view.src ? `src='${view.src}'` : ""}></img>`
  } else if (name === "Text") {
    if (view.h1) {
      html = `<h1 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h1>`
    } else if (view.h2) {
      html = `<h2 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h2>`
    } else if (view.h3) {
      html = `<h3 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h3>`
    } else if (view.h4) {
      html = `<h4 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h4>`
    } else if (view.h5) {
      html = `<h5 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h5>`
    } else if (view.h6) {
      html = `<h6 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h6>`
    } else {
      html = `<p ${atts} ${view.editable ? "contenteditable " : ""}class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${text}</p>`
    }
  } else if (name === "Icon") {
    html = `<i ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined" : (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || "" || ""} ${view.icon.name}' id='${view.id}' style='${view.__htmlStyles__}${_window ? "; opacity:0; transition:.2s" : ""}'>${view.google ? view.icon.name : ""}</i>`
  } else if (name === "Textarea") {
    html = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""}>${text || ""}</textarea>`
  } else if (name === "Input") {
    if (view.textarea) {
      html = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""}>${text}</textarea>`
    } else {
      html = `<input ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} ${view.multiple ? "multiple" : ""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' ${view.input.type ? `type="${view.input.type}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.name || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${text !== undefined ? `value="${text}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.checked ? "checked" : ""} ${view.disabled ? "disabled" : ''}/>`
    }
  } else if (name === "Video") {
    html = `<video ${atts} style='${view.__htmlStyles__}' controls>
      ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>` : "")}
      ${view.alt || view.message || ""}
    </video>`
  } else return html = `<></>`

  // indexing
  var index = 0
  if (!view.__indexed__) {

    // find index
    if (view.__index__ === undefined) while (parent.__childrenRef__[index] && ((parent.__childrenRef__[index].childIndex < view.__childIndex__) || (!view.__inserted__ && parent.__childrenRef__[index].childIndex === view.__childIndex__ && parent.__childrenRef__[index].initialIndex < view.__initialIndex__))) { index++ }
    else index = view.__index__

    // set index
    view.__index__ = index

    // increment next children index
    parent.__childrenRef__.slice(index).map(viewRef => {
      viewRef.index++
      views[viewRef.id].__index__ = viewRef.index
      views[viewRef.id].__rendered__ && views[viewRef.id].__element__.setAttribute("index", viewRef.index)
    })

    // push id to parent children ids
    parent.__childrenRef__.splice(index, 0, { id, index, childIndex: view.__childIndex__, initialIndex: view.__initialIndex__ })

    view.__indexed__ = true
    // var index = parent ? indexing({ views, id, view, parent }) : 0
  }

  // init element
  view.__element__ = view.__element__ || { text, id, innerHTML, index }

  // label
  // if (view.label && !view.__labeled__) html = labelHandler({ _window, id, tag })

  view.__innerHTML__ = innerHTML
  view.__html__ = html

  // id list
  view.__idList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
}

const link = ({ _window, id, stack, __ }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global

  var view = views[id]

  var link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.manifest.host)
  var linkView = typeof view.link === "string" ? { link } : { ...view.link, link, __name__: "A" }

  // link
  var { view: linkView, id: linkID } = initView({ views, global, parent: view.__parent__, ...linkView, __, __controls__: [{ event: `click?root():'${view.link.path}'?${view.link.path || "false"};${view.link.preventDafault ? "false" : "true"}` }] })
  toHTML({ _window, id: linkID, stack, __ })

  // view
  view.__parent__ = linkID
  view.__linked__ = true
  toHTML({ _window, id, stack, __ })
}

const documenter = ({ _window, res, stack, address, __ }) => {

  var { global, views } = _window
  var page = global.manifest.page
  var view = views[page] || {}

  // head tags
  var language = global.language = view.language || view.lang || "en"
  var direction = view.direction || view.dir || (language === "ar" || language === "fa" ? "rtl" : "ltr")
  var title = view.title || "Bracket App Title"

  // favicon
  var favicon = views.document.favicon && views.document.favicon.url
  var faviconType = favicon && views.document.favicon.type

  // meta
  view.meta = view.meta || {}
  var metaHTTPEquiv = view.meta["http-equiv"] || view.meta["httpEquiv"] || {}
  if (typeof metaHTTPEquiv !== "object") metaHTTPEquiv = {}
  if (!metaHTTPEquiv["content-type"]) metaHTTPEquiv["content-type"] = "text/html; charset=UTF-8"
  var metaKeywords = view.meta.keywords || ""
  var metaDescription = view.meta.description || ""
  var metaTitle = view.meta.title || view.title || ""
  var metaViewport = view.meta.viewport || ""

  delete global.data.project

  // logs
  global.__server__.logs = stack.logs

  // clear secure view actions
  Object.values(global.data.view).map(view => {
    if (view._secure_) {
      view.view = ""
      view.children = []
      clearActions(view.functions)
    }
  })

  toAwait({ _window, stack, address, __ })

  res.end(
    `<!DOCTYPE html>
      <html lang="${language}" dir="${direction}" class="html">
          <head>
              <!-- css -->
              <link rel="stylesheet" href="/route/resource/index.css"/>
              ${views.document.stylesheet ? `
                  <style>
                  ${Object.entries(views.document.stylesheet).map(([key, value]) => typeof value === "object" && !Array.isArray(value)
      ? `${key}{
                      ${Object.entries(value).map(([key, value]) => `${cssStyleKeyNames[key] || key}: ${value.toString().replace(/\\/g, '')}`).join(`;
                      `)};
                  }` : "").filter(style => style).join(`
                  `)}
                  </style>` : ""}
              
              <!-- Font -->
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400&display=swap">
              
              <!-- title -->
              <title>${title}</title>
              
              <!-- meta -->
              ${metaHTTPEquiv ? Object.entries(metaHTTPEquiv).map(([key, value]) => `<meta http-equiv="${key}" content="${value}">
              `) : ""}
              <meta http-equiv="content-type" content="text/html; charset=utf-8" />
              <meta name="viewport" content= "width=device-width, initial-scale=1.0">
              ${metaViewport ? `<meta name="viewport" content="${metaViewport}">` : ""}
              ${metaKeywords ? `<meta name="keywords" content="${metaKeywords}">` : ""}
              ${metaDescription ? `<meta name="description" content="${metaDescription}">` : ""}
              ${metaTitle ? `<meta name="title" content="${metaTitle}">` : ""}
              
              <!-- favicon -->
              ${favicon ? `<link rel="icon" type="image/${faviconType || "x-icon"}" href="${favicon}"/>` : `<link rel="icon" href="data:,">`}
              
              <!-- views & global -->
              <script id="views" type="application/json">${JSON.stringify(views)}</script>
              <script id="global" type="application/json">${JSON.stringify(global)}</script>
              
              <!-- head tags -->
              ${(views.document.links || []).map(link => !link.body ? `<link ${link.rel ? `rel="${link.rel}"` : ""} ${link.type ? `type="${link.type}"` : ""} href="${link.href}" />` : "").join("")}

          </head>
          <body>
              <!-- body tags -->
              ${(views.document.links || []).map(link => link.body ? `<link ${link.rel ? `rel="${link.rel}"` : ""} ${link.type ? `type="${link.type}"` : ""} href="${link.href}" />` : "").join("")}

              <!-- html -->
              ${views.body.__html__ || ""}

              <!-- engine -->
              <script src="/route/resource/engine.js"></script>

              <!-- google icons -->
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"/>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"/>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp"/>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"/>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/>
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"/>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

              <!-- html2pdf -->
              <script src="https://cdn.jsdelivr.net/npm/js-html2pdf@1.1.4/lib/html2pdf.min.js"></script>
          </body>
      </html>`
  )
}

const clearActions = (data) => {
  if (typeof data !== "object") return
  Object.entries(data || {}).map(([action, mapAction]) => {
    if (typeof mapAction === "object") return clearActions(mapAction)
    data[action] = ""
  })
}

const update = ({ _window, id, lookupActions, stack, address, req, res, __, data = {} }) => {

  // address.blockable = false
  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global

  var view = views[data.id]

  if (!data.postUpdate) {

    var parent = views[data.__parent__ || view.__parent__]
    var __index__ = data.__index__
    var __childIndex__ = data.__childIndex__ !== undefined ? data.__childIndex__ : view.__childIndex__
    var __viewPath__ = [...(data.__viewPath__ || view.__viewPath__)]
    var __customViewPath__ = [...(data.__customViewPath__ || view.__customViewPath__)]
    var __lookupViewActions__ = [...(data.__lookupViewActions__ || view.__lookupViewActions__)]
    var my__ = data.__ || view.__

    var elements = []
    var timer = (new Date()).getTime()

    if (!view) return

    // close publics
    closePublicViews({ _window, id: data.id, __, stack, lookupActions })

    // get view to be rendered
    var reducedView = {
      ...(data.view ? data.view : clone(__viewPath__.reduce((o, k) => o[k], global.data.view))),
      __index__,
      __childIndex__,
      __view__: true,
      __viewPath__,
      __customViewPath__,
      __lookupViewActions__
    }

    // data
    if (data.data) {

      reducedView.data = clone(data.data)
      reducedView.doc = data.doc || parent.doc || generate()
      global[reducedView.doc] = global[reducedView.doc] || reducedView.data

    } else if (data.doc) {

      reducedView.doc = data.doc
      global[reducedView.doc] = global[reducedView.doc] || reducedView.data || {}
    }

    // path
    if (data.path !== undefined) reducedView.__dataPath__ = (Array.isArray(data.path) ? data.path : typeof data.path === "number" ? [data.path] : data.path.split(".")) || []

    // remove views
    if (!data.insert && parent.__rendered__) parent.__childrenRef__.filter(({ childIndex }) => childIndex === __childIndex__).map(({ id }) => elements.push(removeView({ _window, id, stack, main: true, insert: data.insert })))
    else if (!parent.__rendered__) removeView({ _window, id: data.id, stack, main: true })

    // address for post update
    addresser({ _window, id, stack, switchWithAddress: address, type: "function", function: "update", file: "toView", __, lookupActions, stack, data: { ...data, childIndex: __childIndex__, elements, timer, parent, postUpdate: true } })

    // address
    address = addresser({ _window, id, stack, status: "Start", type: "function", function: "toView", __: my__, lookupActions: __lookupViewActions__, nextAddress: address, data: { view: reducedView, parent: parent.id } }).address
    
    // render
    toView({ _window, lookupActions: __lookupViewActions__, stack, req, res, address, __: my__, data: { view: reducedView, parent: parent.id } })
    
  } else { // post update

    var { childIndex, elements, root, timer, parent, ...data } = data

    // tohtml parent
    toHTML({ _window, lookupActions, stack, __, id: parent.id })

    var renderedRefView = parent.__childrenRef__.filter(({ id, childIndex: chdIndex }) => chdIndex === childIndex && !views[id].__rendered__ && views[id])

    var updatedViews = [], idLists = [], innerHTML = ""

    // insert absolutely
    renderedRefView.map(({ id }) => {

      var { __idList__, __html__ } = views[id]

      // push to html
      innerHTML += __html__

      // _.data
      updatedViews.push(views[id])

      // start
      idLists.push(...[id, ...__idList__])
    })
    
    // browser actions
    if (!_window) {

      var lDiv = document.createElement("div")
      document.body.appendChild(lDiv)
      lDiv.style.position = "absolute"
      lDiv.style.opacity = "0"
      lDiv.style.left = -1000
      lDiv.style.top = -1000
      lDiv.innerHTML = innerHTML
      lDiv.children[0].style.opacity = "0"

      // remove prev elements
      elements.map(element => element.remove())

      // innerHTML
      renderedRefView.map(({ index }) => {

        if (index >= parent.__element__.children.length || parent.__element__.children.length === 0) parent.__element__.appendChild(lDiv.children[0])
        else parent.__element__.insertBefore(lDiv.children[0], parent.__element__.children[index])
      })

      idLists.map(id => starter({ _window, lookupActions, address, stack, __, id }))

      // display
      updatedViews.map(({ id }) => views[id].__element__.style.opacity = "1")

      // rout
      if (updatedViews[0].id === "root") {

        document.body.scrollTop = document.documentElement.scrollTop = 0
        var title = root.title || views[global.manifest.page].title
        var path = root.path || views[global.manifest.page].path

        history.pushState(null, title, path)
        document.title = title
      }

      if (lDiv) {

        document.body.removeChild(lDiv)
        lDiv = null
      }
    }

    console.log((data.action || "UPDATE") + ":" + updatedViews[0].id, (new Date()).getTime() - timer)

    var data = { view: updatedViews.length === 1 ? updatedViews[0] : updatedViews, message: "View updated successfully!", success: true }

    toParam({ _window, data: "loader.hide" })

    if (address) {

      address.params.__ = [data, ...address.params.__]
      address.params.id = views[address.params.id] ? address.params.id : updatedViews[0].id
    }
  }
}

module.exports = { toView, toHTML, documenter, update }