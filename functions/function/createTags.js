const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { createHtml } = require("./createHtml")
const { toArray } = require("./toArray")

const createTags = ({ _window, lookupActions, awaits, id: _id, req, res, _, __, ___ }) => {

  const { createElement } = require("./createElement")
  return new Promise (async resolve => {

    var views = _window ? _window.views : window.views, id = _id, view = views[id], tags = ""
    var global = _window ? _window.global : window.global
    if (!view) return

    // null data
    if (view.data === null) view.data = 0

    // mapper
    if (view.type === "Chevron" && Array.isArray(view.direction)) view["mapType"] = ["direction"]
    else if (view.type === "Icon" && Array.isArray(view.name)) view["mapType"] = ["name"]
    else if (view.type === "Image" && Array.isArray(view.src))view["mapType"] = ["src"]
    else if (view.type === "Text" && Array.isArray(view.text)) view["mapType"] = ["text"]
    else if (view.type === "Checkbox" && Array.isArray(view.label.text)) view["mapType"] = ["label", "text"]

    var mapType = clone(view.mapType)

    if (mapType) {

      var viewData = mapType.reduce((o, k) => o[k], view)
      var data = Array.isArray(viewData) ? viewData : (typeof viewData === "object" ? Object.keys(viewData) : [])
      var isObject = (typeof viewData === "object" && !Array.isArray(viewData)) ? true : false
      var myView = views[view.parent].children[view.index]
      if (myView.view) myView.type = myView.view

      var type = myView.type.replace("[", "").replace("]", "")
      
      // data
      if (type.includes("?data=")) type = type.split("?data=")[0] + "?" + type.split("?data=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";data=")) type = type.split(";data=")[0] + ";" + type.split(";data=").slice(1).join("").split(";").slice(1).join(";")
      // Data
      if (type.includes("?Data=")) type = type.split("?Data=")[0] + "?" + type.split("?Data=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes("?Data;")) type = type.split("?Data;")[0] + "?" + type.split("?Data;").slice(1).join("")
      if (type.includes(";Data=")) type = type.split(";Data=")[0] + ";" + type.split(";Data=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";Data;")) type = type.split(";Data;")[0] + ";" + type.split(";Data;").slice(1).join("")
      if (type.includes(";Data")) type = type.split(";Data")[0]
      // doc
      if (type.includes("?doc=")) type = type.split("?doc=")[0] + "?" + type.split("?doc=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes("?doc;")) type = type.split("?doc;")[0] + "?" + type.split("?doc;").slice(1).join("")
      if (type.includes(";doc=")) type = type.split(";doc=")[0] + ";" + type.split(";doc=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";doc;")) type = type.split(";doc;")[0] + ";" + type.split(";doc;").slice(1).join("")
      if (type.includes(";doc")) type = type.split(";doc")[0]
      // id
      if (type.includes("?id=")) type = type.split("?id=")[0] + "?" + type.split("?id=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";id=")) type = type.split(";id=")[0] + ";" + type.split(";id=").slice(1).join("").split(";").slice(1).join(";")
      // path
      if (type.includes("?path=")) type = type.split("?path=")[0] + "?" + type.split("?path=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";path=")) type = type.split(";path=")[0] + ";" + type.split(";path=").slice(1).join("").split(";").slice(1).join(";")
      // arrange
      if (type.includes(";arrange=")) type = type.split(";arrange=")[0] + ";" + type.split(";arrange=").slice(1).join("").split(";").slice(1).join(";")
      // conditions
      if (type.split("?")[2]) type = type.split("?").slice(0, 2).join("?")

      // components
      if (view.type === "Chevron" && Array.isArray(view.direction)) {

        if (type.includes("?direction=")) type = type.split("?direction=")[0] + "?" + type.split("?direction=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";direction=")) type = type.split(";direction=")[0] + ";" + type.split(";direction=").slice(1).join("").split(";").slice(1).join(";")
      
      } else if (view.type === "Icon" && Array.isArray(view.name)) {

        if (type.includes("?name=")) type = type.split("?name=")[0] + "?" + type.split("?name=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";name=")) type = type.split(";name=")[0] + ";" + type.split(";name=").slice(1).join("").split(";").slice(1).join(";")
      
      } else if (view.type === "Image" && Array.isArray(view.src)) {

        if (type.includes("?src=")) type = type.split("?src=")[0] + "?" + type.split("?src=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";src=")) type = type.split(";src=")[0] + ";" + type.split(";src=").slice(1).join("").split(";").slice(1).join(";")

      } else if (view.type === "Text" && Array.isArray(view.text)) {

        if (type.includes("?text=")) type = type.split("?text=")[0] + "?" + type.split("?text=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";text=")) type = type.split(";text=")[0] + ";" + type.split(";text=").slice(1).join("").split(";").slice(1).join(";")

      } else if (view.type === "Checkbox" && typeof view.label === "object" && Array.isArray(view.label.text)) {

        if (type.includes("label.text=")) type = type.split("label.text=")[0] + "" + type.split("label.text=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes("[text=")) type = type.split("[text=")[0] + "[" + type.split("[text=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";text=")) type = type.split(";text=")[0] + ";" + type.split(";text=").slice(1).join("").split(";").slice(1).join(";")
      }

      view.length = data.length || 1

      // arrange
      if ((view.arrange || view.sort) && !Array.isArray(viewData)) data = arrange({ data, arrange: view.arrange, id, _window })

      delete views[id]
      delete view.mapType
      
      if (data.length > 0) {

        tags = await Promise.all(data.map(async (_data, index) => {
          
          var id = view.id + generate()
          var mapIndex = index
          var lastEl = isObject ? _data : index
          var derivations = clone(view.derivations)
          var data = clone(isObject ? viewData[_data] : _data)
          
          var _view = clone({ ...view, id, view: type, mapIndex, derivations, children: clone(myView.children || []) })
          mapType.reduce((o, k, i) => {
            if (i !== mapType.length - 1) return o[k]
            else o[k] = data
          }, _view)

          if (mapType[0] === "data") _view.derivations.push(lastEl)
         
          views[id] = _view
          return await createElement({ _window, lookupActions, awaits, id, req, res, _, __, ___ })
        }))

        tags = tags.join("")

      } else {
          
        var id = generate()
        var mapIndex = 0
        var lastEl = isObject ? "" : 0
        var derivations = clone(view.derivations)
        var data = clone(viewData ? viewData[lastEl] : viewData)
          
        var _view = clone({ ...view, id, view: type, mapIndex, derivations, children: clone(myView.children || []) })
        mapType.reduce((o, k, i) => {
          if (i !== mapType.length - 1) return o[k]
          else o[k] = data
        }, _view)

        if (mapType[0] === "data") _view.derivations.push(lastEl)
        
        views[id] = _view
        tags = await createElement({ _window, lookupActions, awaits, id, req, res, _, __, ___ })
      }

    } else tags = await createTag({ _window, lookupActions, awaits, id, req, res, _, __, ___ })
    
    resolve(tags)
  })
}

const createTag = async ({ _window, lookupActions, awaits, id, req, res, _, __, ___ }) => {
  
  // components
  componentModifier({ _window, lookupActions, awaits, id })
  createComponent({ _window, lookupActions, awaits, id, req, res, _, __, ___ })
  componentModifier({ _window, lookupActions, awaits, id })
  
  return await createHtml({ _window, lookupActions, awaits, id, req, res, _, __, ___ })
}

const componentModifier = ({ _window, lookupActions, awaits, id }) => {

  var view = _window ? _window.views[id] : window.views[id]

  if (!view) return console.log(id)

  // chevron
  if (view.type === "Chevron") {
    if (view.right) view.direction = "right"
    else if (view.left) view.direction = "left"
  }

  // icon
  else if (view.type === "Icon") {

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

  } else if (view.type === "Image") {
    
    view.src = view.src || (typeof view.data === "string" && view.data) || ""

  } else if (view.type === "Text") {
    
    view.text = view.text !== undefined ? view.text : ((typeof view.data === "string" && view.data) || "")
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
