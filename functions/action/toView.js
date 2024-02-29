const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { toValue, isNumber } = require("./toValue")
const { toArray } = require("./toArray")
const { override } = require("./merge")
const { toLine } = require("./toLine")
const { initView, removeView, getViewParams } = require("./view")
const { addresser } = require("./addresser")
const { toAwait } = require("./toAwait")
const { kernel } = require("./kernel")
const { isParam } = require("./isParam")
const { executable } = require("./executable")
const { logger } = require("./logger")
const { replaceNbsps } = require("./replaceNbsps")
const { colorize } = require("./colorize")
const builtInViews = require("../view/views")
const { getJsonFiles } = require("./jsonFiles")
const cssStyleKeyNames = require("./cssStyleKeyNames")
const { toParam } = require("./toParam")

const toView = ({ _window, lookupActions, stack, address, req, res, __, id, data = {} }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global

  // init view
  var { id, view } = initView({ views, global, id, parent: data.parent, ...(data.view || {}), __ })

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

  // loop over view
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

    address.interpreting = true
    var { data = {}, conditionsNotApplied } = toLine({ _window, lookupActions, stack, id, data: { string: subParams }, req, res, __ })
    address.interpreting = false

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
    
    address.interpreting = true
    toParam({ _window, lookupActions, stack, data: params, id, req, res, mount: true, __ })
    address.interpreting = false

    if (view.id !== id) {

      view.__customID__ = true
      delete views[id]
      id = view.id
    }
  }

  // maybe update in params or root
  if (address.blocked) return

  // asynchronous actions within view params
  if (stack.addresses[0].asynchronous) {

    var headAddress = addresser({ _window, id, stack, headAddressID: address.headAddressID, hold: true, type: "function", function: "continueToView", file: "toView", __, lookupActions, stack }).address
    return address.headAddressID = headAddress.id
  }

  continueToView({ _window, id, stack, __, address, lookupActions, req, res })
}

const continueToView = ({ _window, id, stack, __, address, lookupActions, req, res }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  var view = views[id]

  // customView
  if (global.data.views.includes(view.__name__)) {

    // query custom view
    if (!global.__queries__.views.includes(view.__name__) && !global.data.view[view.__name__]) {

      address = addresser({ _window, id, stack, headAddress: address, type: "function", function: "customView", file: "toView", __, lookupActions, stack }).address
      var { address, data } = addresser({ _window, id, stack, headAddress: address, type: "data", action: "search()", status: "Start", asynchronous: true, params: `loader.show;collection=view;doc=${view.__name__}`, waits: `loader.hide;__queries__:().views.push():[${view.__name__}];data:().view.${view.__name__}=_.data`, __, lookupActions, stack })
      return require("./search").search({ _window, lookupActions, stack, address, id, __, req, res, data })
    }

    // continue to custom view
    else {
      
      var newView = {
        ...global.data.view[view.__name__],
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
      
      // address
      return toView({ _window, stack, address, req, res, lookupActions, __: [...(Object.keys(data).length > 0 ? [data] : []), ...__], data: { view: child, parent: view.__parent__ } })
    }
  }

  // data
  view.data = kernel({ _window, id, stack, lookupActions, data: { path: view.__dataPath__, data: global[view.doc] || {}, value: view.data, key: true }, __ })

  // components
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
  } else if (view.textarea && !view.__templated__) {

    view.style = view.style || {}
    view.input = view.input || {}
    view.input.style = view.input.style || {}
    view.input.style.height = "fit-content"
  } else if (view.__name__ === "Input") {

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

  // built-in view
  if (builtInViews[view.__name__] && !view.__templated__) var { id, view } = builtInViewHandler({ _window, lookupActions, stack, id, req, res, __ })

  // address toHTML
  address = addresser({ _window, id, stack, headAddress: address, blocked: view.__name__ === "Action", type: "function", function: "toHTML", file: "toView", hold: true, __, lookupActions, stack }).address

  // push action view id to lookup actions
  if (view.__customID__) view.__lookupViewActions__.unshift({ type: "view", id })

  // 
  var lastIndex = view.children.length - 1;

  [...view.children].reverse().map(async (child, index) => {

    var childID = child.id || generate()
    views[childID] = { ...child, id: childID, __view__: true, __parent__: id, __viewPath__: [...view.__viewPath__, "children", lastIndex - index], __childIndex__: lastIndex - index }

    // address
    address = addresser({ _window, id: childID, stack, type: "function", function: "toView", headAddress: address, __, lookupActions, data: { view: views[childID] } }).address
  })

  delete view.view
  delete view.children
  delete view.functions

  // awaits
  toAwait({ _window, id, lookupActions, stack, address, __, req, res })
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

const loopOverView = ({ _window, id, stack, lookupActions, __, address, data = {}, req, res }) => {

  const global = _window ? _window.global : window.global
  const views = _window ? _window.views : window.views
  var view = views[id]

  var timer = (new Date()).getTime(), loopID = generate()
  stack.logs.push([stack.logs.length, "LOOP start", loopID, JSON.stringify(data)].join(" "));

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
  ([...loopData]).reverse().map(async (key, index) => {

    view.__looped__ = true
    index = lastIndex - index

    var params = { i: index, __loopIndex__: index, view: view.__name__ + "?" + view.view.split("?").slice(1).join("?"), id: `${view.id}_${index}` }
    key = isNumber(key) ? parseInt(key) : key
    if (!preventDefault && mount) params = { ...params, doc, __dataPath__: [...__dataPath__, key] }

    views[params.id] = { __view__: true, __loop__: true, __mount__: mount, ...clone(view), ...myparams, ...params }

    address = addresser({ _window, id: params.id, stack, type: "function", function: "toView", renderer: true, blockable: false, __: [values[key], ...__], lookupActions, data: { view: views[params.id] } }).address
  })

  // 
  removeView({ _window, id, stack });

  // awaits
  toAwait({ _window, id: address.viewID, lookupActions, stack, address, __, req, res })

  // log loop
  stack.logs.push([stack.logs.length, "LOOP end", (new Date()).getTime() - timer, loopID].join(" "));
}

const customView = ({ _window, id, lookupActions, stack, __, address, req, res }) => {

  const global = _window ? _window.global : window.global
  const views = _window ? _window.views : window.views
  var view = views[id]
  
  var newView = {
    ...global.data.view[view.__name__],
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
    logger({ _window, data: { key: "document", start: true } })

    // address: document
    address = addresser({ _window, id: child.id, headAddress: address, type: "function", file: "render", function: "document", stack, __ }).address

    // get shared public views
    Object.entries(getJsonFiles({ search: { collection: "public/view" } })).map(([doc, data]) => {

      global.data.view[doc] = { ...data, id: doc }
      global.data.views.push(doc)
      global.__queries__.views.push(doc)
    })

    address = addresser({ _window, stack, status: "Start", type: "function", function: "toView", headAddress: address, lookupActions, __ }).address
  }
  
  // address
  toView({ _window, stack, address, req, res, lookupActions, __: [...(Object.keys(data).length > 0 ? [data] : []), ...__], data: { view: child, parent: view.__parent__ } })
}

const builtInViewHandler = ({ _window, lookupActions, stack, id, req, res, __ }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  var view = views[id]

  views[id] = builtInViews[view.__name__](view)
  var { id, view } = initView({ views, global, parent: views[id].__parent__, ...views[id] })

  toLine({ _window, lookupActions, stack, data: { string: view.view, id, index: 1 }, req, res, mount: true, __ })
  view.__name__ = view.view.split("?")[0]

  if (view.id !== id) {

    delete Object.assign(views, { [view.id]: views[id] })[id]
    id = view.id
  }

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
  } else if (view.textarea && !view.__templated__) {

    view.style = view.style || {}
    view.input = view.input || {}
    view.input.style = view.input.style || {}
    view.input.style.height = "fit-content"
  } else if (view.__name__ === "Input") {

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

  return { id, view }
}

const toHTML = ({ _window, id, stack, __ }) => {

  const views = _window ? _window.views : window.views

  var view = views[id], parent = views[view.__parent__]
  var name = view.__name__, html = ""

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
  } else return removeView({ _window, stack, id })

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

module.exports = { toView, continueToView, toHTML, customView }