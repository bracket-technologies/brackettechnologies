const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { toHtml } = require("./toHtml")
const { toArray } = require("./toArray")

const createTags = ({ _window, id, req, res }) => {

  const { createElement } = require("./createElement")
  var views = _window ? _window.views : window.views, view = views[id]
  if (!view) return

  // null data
  if (view.data === null) view.data = 0

  if (view.mapType) {
    
    // data mapType
    var data = Array.isArray(view.data) ? view.data : (typeof view.data === "object" ? Object.keys(view.data) : [])
    var isObject = (typeof view.data === "object" && !Array.isArray(view.data)) ? true : false
    var type = views[view.parent].children[view.index].type.replace("[", "").replace("]", "")
    if (type.includes("?data=")) type = type.split("?data=")[0] + "?" + type.split("?data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";data=")) type = type.split(";data=")[0] + ";" + type.split(";data=").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes("?Data=")) type = type.split("?Data=")[0] + "?" + type.split("?Data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";Data=")) type = type.split(";Data=")[0] + ";" + type.split(";Data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";Data;")) type = type.split(";Data;")[0] + ";" + type.split(";Data;").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?Data;")) type = type.split("?Data;")[0] + ";" + type.split("?Data;").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes(";Data")) type = type.split(";Data")[0]
    /*if (type.includes("?doc=")) type = type.split("?doc=")[0] + "?" + type.split("?doc=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";doc=")) type = type.split(";doc=")[0] + ";" + type.split(";doc=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";doc;")) type = type.split(";doc;")[0] + ";" + type.split(";doc;").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?doc;")) type = type.split("?doc;")[0] + ";" + type.split("?doc;").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes(";doc")) type = type.split(";doc")[0]
    if (type.includes("child:")) type = type.split("child:")[0] + "" + type.split("child:").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes("children:")) type = type.split("children:")[0] + "" + type.split("children:").slice(1).join("").split(";").slice(1).join(";") 
    */
    if (type.includes("?id=")) type = type.split("?id=")[0] + "?" + type.split("?id=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";id=")) type = type.split(";id=")[0] + ";" + type.split(";id=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?path=")) type = type.split("?path=")[0] + "?" + type.split("?path=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";path=")) type = type.split(";path=")[0] + ";" + type.split(";path=").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes(";arrange=")) type = type.split(";arrange=")[0] + ";" + type.split(";arrange=").slice(1).join("").split(";").slice(1).join(";")
    if (type.split("?")[2]) type = type.split("?").slice(0, 2).join("?")
    view.length = data.length || 1

    // arrange
    if (view.arrange || view.sort) data = arrange({ data, arrange: view.arrange, id, _window })

    delete views[id]
    delete view.mapType
    
    if (data.length > 0) {
      return data.map((_data, index) => {
        
        var id = generate()
        var mapIndex = index
        var lastEl = isObject ? _data : index
        var derivations = clone(view.derivations)
        var data = clone(isObject ? view.data[_data] : _data)
        derivations.push(lastEl)
        
        var _view = clone({ ...view, id, type, data, mapIndex, derivations, children: clone(views[view.parent].children[view.index].children || []) })
        
        views[id] = _view
        return createElement({ _window, id, req, res })

      }).join("")

    } else {
        
      var id = generate()
      var mapIndex = 0
      var lastEl = isObject ? "" : 0
      var derivations = clone(view.derivations)
      var data = clone(view.data ? view.data[lastEl] : view.data)
      derivations.push(lastEl)

      var _view = clone({ ...view, id, type, data, mapIndex, derivations, children: clone(views[view.parent].children[view.index].children || []) })
      
      views[id] = _view
      return createElement({ _window, id, req, res })
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
      
      view.symbol = {}
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
    if (view.accept !== undefined) view.input.accept = view.input.accept
    if (view.multiple !== undefined) view.input.multiple = true
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
