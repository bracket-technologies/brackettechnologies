const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue, isNumber } = require("./toValue")
const { toArray } = require("./toArray")
const { override } = require("./merge")
const { lineInterpreter } = require("./lineInterpreter")
const { initView, removeView, getViewParams } = require("./view")
const { addresser } = require("./addresser")
const { toAwait } = require("./toAwait")
const builtInViews = require("../view/views")
const { kernel } = require("./kernel")
const { isParam } = require("./isParam")

const toView = ({ _window, lookupActions, stack, address, req, res, __, id, data = {} }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  // init view
  var { id, view } = initView({ views, global, id, parent: data.parent, ...(data.view || {}), __lookupActions__: lookupActions, __ })

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
  if (subParams.includes("()")) {
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
  var loop = view.__name__ === "Action" ? false : view.__name__.charAt(0) === "@" && view.__name__.length == 6

  // view name
  view.__name__ = toValue({ _window, id, req, res, data: view.__name__, __, stack })

  // no view
  if (!view.__name__ || view.__name__.charAt(0) === "#") return removeView({ _window, id, stack })
  else views[id] = view
  
  // sub params
  if (subParams) {

    var { data = {}, conditionsNotApplied } = lineInterpreter({ _window, lookupActions, stack, id, data: { string: subParams }, req, res, __ })

    if (conditionsNotApplied) return removeView({ _window, id, stack })
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
  }

  // conditions
  var approved = toApproval({ _window, lookupActions, stack, data: conditions, id, req, res, __ })
  if (!approved) return removeView({ _window, id, stack })
  
  // params
  if (params) {

    lineInterpreter({ _window, lookupActions, stack, data: { string: params }, id, req, res, mount: true, toView: true, __, action: "toParam" }).data

    if (view.id !== id) {
      
      if (views[view.id]) view.id += "_" + generate()
      delete Object.assign(views, { [view.id]: views[id] })[id]
      id = view.id
    }
  }
  
  // maybe update in params or route
  if (address.blocked) return

  // children renderer
  if (stack.addresses[0].asynchronous) {
    
    // address toHTML
    var headAddress = addresser({ _window, id, stack, renderer: true, headAddressID: address.headAddressID, type: "render", action: "continue()", function: "continueToView", file: "toView", __, lookupActions, stack }).address
    return address.headAddressID = headAddress.id
  }

  continueToView({ _window, id, stack, __, address, lookupActions, req, res })
}

const continueToView = ({ _window, id, stack, __, address, lookupActions, req, res }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id]

  // custom View
  if (global.data.view[view.__name__]) return customView({ _window, id, lookupActions, address, stack, __, req, res })
  
  // data
  view.data = kernel({ _window, id, stack, lookupActions, data: { path: view.__dataPath__, data: global[view.doc] || {}, value: view.data, key: true }, __ })
  
  // components
  componentModifier({ _window, id })

  // build-in view
  if (builtInViews[view.__name__] && !view.__templated__) var { id, view } = builtInViewHandler({ _window, lookupActions, stack, id, req, res, __ })

  // address toHTML
  var address = addresser({ _window, id, stack, headAddress: address, type: "render", action: "html()", function: "toHTML", __, lookupActions, stack }).address
  var lastIndex = view.children.length - 1;

  ([...toArray(view.children)]).reverse().map(async (child, index) => {
    
    var childID = child.id || generate()
    views[childID] = { ...clone(child), id: childID, __view__: true, __parent__: id, __viewPath__: [...view.__viewPath__, "children", lastIndex - index], __childIndex__: lastIndex - index }

    // address
    address = addresser({ _window, id: childID, stack, type: "render", action: "view()", function: "toView", headAddress: address, __, lookupActions, data: { view: views[childID] } }).address
  })
  
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

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
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
    
    address = addresser({ _window, id: params.id, stack, type: "render", function: "toView", renderer: true, blockable: false, action: "view()", __: [values[key], ...__], lookupActions, data: { view: views[params.id] } }).address
  })
  
  // 
  removeView({ _window, id, stack });

  // awaits
  toAwait({ _window, id: address.viewID, lookupActions, stack, address, __, req, res })

  // log loop
  stack.logs.push([stack.logs.length, "LOOP end", (new Date()).getTime() - timer, loopID].join(" ")); 
}

const customView = ({ _window, id, lookupActions, stack, __, address, req, res }) => {
  
  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id]

  var newView = { ...clone(global.data.view[view.__name__]), __view__: true, __viewPath__: [view.__name__] }

  view.__customViewPath__.push(view.__name__)
  view.__customView__ = view.__name__
  
  // id
  if (newView.id && views[newView.id] && newView.id !== id) newView.id += "_" + generate()
  else if (!newView.id) newView.id = id

  var child = { ...view, ...newView }
  views[child.id] = child

  var data = getViewParams({ view })

  toView({ _window, lookupActions, stack, address, req, res, __: [...(Object.keys(data).length > 0 ? [data] : []), ...__], data: { view: views[child.id], parent: view.__parent__ } })
}

const builtInViewHandler = ({ _window, lookupActions, stack, id, req, res, __ }) => {
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id]

  views[id] = builtInViews[view.__name__](view)
  var { id, view } = initView({ views, global, parent: views[id].__parent__, ...views[id] })

  lineInterpreter({ _window, lookupActions, stack, data: { string: view.view, id, index: 1}, req, res, mount: true, toView: true, __ })
  view.__name__ = view.view.split("?")[0]

  if (view.id !== id) {

    delete Object.assign(views, { [view.id]: views[id] })[id]
    id = view.id
  }
  
  componentModifier({ _window, id })

  return { id, view }
}

module.exports = { toView, continueToView }