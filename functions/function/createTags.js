const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { toHtml } = require("./toHtml")
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")

const createTags = ({ _window, id, req, res }) => {

  var views = _window ? _window.views : window.views, view = views[id]
  if (!view) return

  view.length = 1
  
  // data mapType
  var data = Array.isArray(view.data) ? view.data : typeof view.data === "object" ? Object.keys(view.data) : []
  var isObject = !Array.isArray(view.data)
  view.length = data.length || 1
  
  if (view.mapType) {
    if (data.length > 0) {

      data = arrange({ data, arrange: view.arrange, id, _window })
      delete views[id]
      
      return data.map((_data, index) => {
        
        var id = generate()
        var _view = clone(view)

        views[id] = _view

        _view.id = id
        _view.mapIndex = index
        _view.data = isObject ? _view.data[_data] : _data
        _view.derivations = isObject ? [..._view.derivations, _data] : [..._view.derivations, index]

        // check approval again for last time
        var conditions = views[view.parent].children[view.index]
        var approved = toApproval({ _window, string: conditions, id, req, res })
        if (!approved) return
        
        return createTag({ _window, id, req, res })

      }).join("")

    } else {

      view.mapIndex = 0
      view.derivations = isObject ? [...view.derivations, ""] : [...view.derivations, 0]
      
      // check approval again for last time
      var conditions = views[view.parent].children[view.index].type.split("?")[2]
      var approved = toApproval({ _window, string: conditions, id, req, res })
      if (!approved) return
      
      return createTag({ _window, id, req, res })
    }
  }

  return createTag({ _window, id, req, res })
}

const createTag = ({ _window, id, req, res }) => {

  const {execute} = require("./execute")

  var view = _window ? _window.views[id] : window.views[id]
  
  // components
  componentModifier({ _window, id })
  createComponent({ _window, id, req, res })

  if (view.actions) execute({ _window, actions: view.actions, id, req, res })
  return toHtml({ _window, id, req, res })
}

const componentModifier = ({ _window, id }) => {

  var view = _window ? _window.views[id] : window.views[id]

  // icon
  if (view.type === "Icon") {

    view.icon = view.icon || {}
    view.icon.name = view.name || view.icon.name || ""
    if (view.icon.google || view.google) {
      
      if (view.google.outlined) view.outlined = true
      else if (view.google.filled) view.filled = true
      else if (view.google.rounded) view.rounded = true
      else if (view.google.sharp) view.sharp = true
      else if (view.google.twoTone) view.twoTone = true
      else view.google = true
    }
  }

  // textarea
  else if (view.textarea && !view.templated) {

    view.style = view.style || {}
    view.input = view.input || {}
    view.input.style = view.input.style || {}
    view.input.style.height = "fit-content"
  }

  // input
  else if (view.type === "Input") {

    view.input = view.input || {}
    if (view.value) view.input.value = view.input.value || view.value
    if (view.checked !== undefined) view.input.checked = view.checked
    if (view.max !== undefined) view.input.max = view.max
    if (view.min !== undefined) view.input.min = view.min
    if (view.name !== undefined) view.input.name = view.name
    if (view.input.placeholder) view.placeholder = view.input.placeholder
    
  } else if (view.type === "Item") {

    var parent = _window ? _window.views[view.parent] : window.views[view.parent]

    if (view.index === 0) {

      view.state = generate()
      parent.state = view.state
      
    } else view.state = parent.state
  }
}

const arrange = ({ data, arrange, id, _window }) => {

  var views = _window ? _window.views : window.views
  var view = views[id], index = 0

  if (view) {
    if (view.arrange) toArray(arrange).map(el => {

      var _index = data.findIndex(_el => _el == el)
      if (_index > -1) {

        var _el = data[index]
        data[index] = el
        data[_index] = _el
        index += 1
      }
    })
    
    if (view.sort) {
      
      var _sorted = data.slice(index).sort()
      data = data.slice(0, index)
      data.push(..._sorted)
    }
  }
  return data
}

module.exports = { createTags }
