const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")
const { toArray } = require("./toArray")
const { createHtml } = require("./createHtml")
const { override } = require("./merge")
const { toAction } = require("./toAction")
const { lineInterpreter } = require("./lineInterpreter")
const builtInViews = require("../view/views")

const toView = async ({ _window, lookupActions, stack, id, req, res, import: _import, params: inheritedParams = {}, __, viewer = "view" }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id], tags = ""
  var parent = views[view.parent] || {}

  // use view instead of type
  if (view.view) view.type = view.view
  view.__view__ = true

  // view is empty
  if (!view.type) return ""

  // set map view path
  if (!view.__mapViewsPath__) view.__mapViewsPath__ = [...(parent.__mapViewsPath__ || [])]

  // view type (page|view)
  view.viewType = viewer = view.viewType || parent.viewType || viewer || "view"

  // encode
  view.type = toCode({ _window, id, string: toCode({ _window, id, string: view.type, start: "'" }) })

  // inherit data
  view.doc = view.doc || parent.doc
  view.derivations = view.derivations || [...(parent.derivations || [])]

  // action
  if (view.type.split(".")[0].split(":")[0].slice(-2) === "()") {
    var action = toAction({ _window, lookupActions, stack, id, req, res, __, path: view.type.split("."), path0: view.type.split(".")[0].split(":")[0] })
    if (action !== "__CONTINUE__") return action
  }

  // 
  var type = view.type.split("?")[0]
  var params = view.type.split("?")[1]
  var conditions = view.type.split("?")[2]
  var subParams = type.split(":")[1] || ""
  type = type.split(":")[0]

  // view name is a global var
  if (subParams.includes("()")) {
    type = type + ":" + subParams
    subParams = ""
  }

  // loop over view
  var loop = type.charAt(0) === "@" && type.length == 6

  // header
  _import = view.id === "html" || (parent.id === "html" && (["link", "meta", "title", "script", "style"]).includes(type.toLowerCase()))
  
  // view name
  view.__name__ = type = toValue({ req, res, _window, id, data: type, __ })

  // sub params
  if (subParams) {

    var { success, data = {} } = lineInterpreter({ _window, lookupActions, stack, id, data: subParams, req, res, __ })
    if (!success) {
      delete views[id]
      return ""
    } else subParams = data
  }

  // [View]
  if (loop) {

    var data = subParams || {}

    // mount
    if (!data.preventDefault && (data.doc || data.path)) data.mount = true

    // path
    if (!data.path) data.path = []

    // split path
    data.path = Array.isArray(data.path) ? data.path : data.path.split(".")

    if (data.data) {

      data.doc = data.doc || generate()
      global[data.doc] = global[data.doc] || data.data || {}
      data.derivations = data.path

    } else {

      data.derivations = [...(data.doc ? [] : view.derivations), ...data.path]
      data.doc = data.doc || view.doc || generate()
      global[data.doc] = global[data.doc] || {}
    }

    var { doc, data = {}, derivations = [], mount, path, keys, preventDefault, ...myparams } = data
    
    // data
    data = reducer({ _window, lookupActions, stack, id, data: derivations, object: global[doc], req, res, __ })

    var loopData = Object.keys(keys ? data : toArray(data)), values = keys ? data : toArray(data)
    if (keys) loopData = sortAndArrange({ data: loopData, sort: myparams.sort, arrange: myparams.arrange })

    // view
    var tags = await Promise.all(loopData.map(async index => {

      if (!isNaN(index) && index !== "") index = parseInt(index)

      var _id_ = view.id + "_" + index
      var _type_ = type + "?" + view.type.split("?").slice(1).join("?")
      var _view_ = clone({ ...view, ...myparams, id: _id_, view: _type_, i: index })
      if (!preventDefault && mount) _view_ = { ..._view_, doc, derivations: [...derivations, index] }

      if (!preventDefault) {

        if (type === "Chevron") _view_.direction = values[index]
        else if (type === "Icon") _view_.name = values[index]
        else if (type === "Image") _view_.src = values[index]
        else if (type === "Text") _view_.text = values[index]
        else if (type === "Checkbox") _view_.label = { text: values[index] }
      }

      views[_id_] = _view_
      return await toView({ _window, lookupActions, stack, id: _id_, req, res, __: [values[index], ...__], viewer })
    }))

    delete views[view.id]
    return tags.join("")
  }

  // subparam is id
  if (typeof subParams === "object") inheritedParams = { ...inheritedParams, ...subParams }
  else if (subParams && typeof subParams === "string") {

    if (views[subParams] && view.id !== subParams) view.id = subParams + generate()
    else view.id = id = subParams
  }

  view.id = id = view.id || generate()
  views[id] = view

  // init view
  if (!_import) {

    view.style = view.style || {}
    view.class = view.class || ""
    view.doc = view.doc || parent.doc
    view.derivations = view.derivations || [...(parent.derivations || [])]
    view.controls = toArray(view.controls) || []
    view.status = "Loading"
    view.__childrenID__ = []
    view.__timers__ = []
    view.__stacks__ = {}
    view.__ = __
    views[id] = view
  }

  // events
  if (view.event) {
    toArray(view.event).map(event => view.controls.push({ event }))
    delete view.event
  }

  // conditions
  var approved = toApproval({ _window, lookupActions, stack, data: conditions, id, req, res, __ })
  if (!approved) {
    delete views[id]
    return ""
  }

  // params
  if (params) {

    params = toValue({ _window, lookupActions, stack, data: params, id, req, res, mount: true, toView: true, __ })
    if (typeof params !== "object") params = { [params]: generate() }

    if (params.id && params.id !== id) {

      if (views[params.id] && typeof views[params.id] === "object") params.id += generate()
      delete Object.assign(views, { [params.id]: views[id] })[id]
      id = params.id
      view = views[id]
    }

  } else params = {}

  // inherited params
  if (Object.keys(inheritedParams).length > 0) override(view, inheritedParams)

  // head links
  if (_import) return await createHtml({ _window, lookupActions, stack, id, req, res, import: _import, __ })

  // custom View
  if (global.data[viewer][view.__name__]) {

    var newView = clone(global.data[viewer][view.__name__])

    view.__mapViewsPath__.push(view.__name__)

    // id exists
    if (newView.id && views[newView.id]) newView.id += generate()

    views[id] = { ...view, ...newView, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)] }

    return await toView({ _window, lookupActions, stack, id, req, res, __: [...(Object.keys(params).length > 0 ? [params] : []), ...__], viewer })
  }

  // data
  view.data = reducer({ _window, lookupActions, stack, id, data: view.derivations, value: view.data, key: true, object: global[view.doc] || {}, req, res, __ })

  // doc
  if (!global[view.doc] && view.data) global[view.doc] = view.data

  // components
  componentModifier({ _window, id })

  if (builtInViews[view.__name__]) {

    views[id] = view = builtInViews[view.__name__](view)

    var { data } = lineInterpreter({ _window, lookupActions, stack, data: view.view, id, req, res, mount: true, toView: true, __, index: 1 })
    view.__name__ = view.view.split("?")[0]

    if (data.id) {

      delete Object.assign(views, { [data.id]: views[id] })[id]
      id = data.id
    }

    componentModifier({ _window, id })
  }

  return await createHtml({ _window, lookupActions, stack, id, req, res, __, viewer })
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

module.exports = { toView }