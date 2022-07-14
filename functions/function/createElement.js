const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")

const myViews = [
  "View",
  "Text",
  "Icon",
  "Image",
  "Input",
  "Video",
  "Entry",
  "Map",
  "Swiper",
  "Switch",
  "Checkbox",
  "Swiper",
  "List",
  "Item"
]

const createElement = ({ _window, id, req, res }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  
  var view = views[id]
  var parent = views[view.parent]
  
  // html
  if (view.html) return view.html

  // merge to another view
  /*if (view.view) {

    if (!global.data.view[view.view]) {
      
      global.unloadedViews.push({ id, parent: view.parent, view: view.view, index: view.index })
      return ""
    }

    var viewId = view.view
    delete view.view
    view = { ...view, ...clone(global.data.view[viewId]) }
  }*/

  // view is empty
  if (!view.type) return

  // code []
  view.type = toCode({ _window, string: view.type })
  
  // code ''
  if (view.type.split("'").length > 2) view.type = toCode({ _window, string: view.type, start: "'", end: "'" })

  // destructure type, params, & conditions from type
  
  var type = view.type.split("?")[0]
  var params = view.type.split("?")[1]
  var conditions = view.type.split("?")[2]

  // [type]
  if (!view.duplicatedElement && type.includes("coded()")) view.mapType = true
  type = view.type = toValue({ _window, value: type, id, req, res })

  // style
  view.style = view.style || {}

  // id
  var priorityId = false
  if (view.type.split(":")[1]) priorityId = true
  id = view.id = view.type.split(":")[1] || id
  view.type = view.type.split(":")[0]
  view.id = view.id || generate()
  id = view.id

  // class
  view.class = view.class || ""
  
  // Data
  view.Data = view.Data || parent.Data

  // derivations
  view.derivations = view.derivations || [...(parent.derivations || [])]

  // controls
  view.controls = view.controls || []

  // status
  view.status = "Loading"

  // first mount of view
  views[id] = view

  /////////////////// approval & params /////////////////////

  // approval
  var approved = toApproval({ _window, string: conditions, id, req, res })
  if (!approved) {
    delete views[id]
    return ""
  }

  // push destructured params from type to view
  if (params) {
    
    params = toParam({ _window, string: params, id, req, res, mount: true, createElement: true })
    
    if (params.id && params.id !== id && !priorityId) {

      if (view[params.id] && typeof view[params.id] === "object") {
        
        view[params.id]["id-repetition-counter"] = (view[params.id]["id-repetition-counter"] || 0) + 1
        params.id = params.id + `-${view[params.id]["id-repetition-counter"]}`
      }
      
      delete Object.assign(views, { [params.id]: views[id] })[id]
      id = params.id

    } else if (priorityId) view.id = id // we have View:id & an id parameter. the priority is for View:id

    // view
    if (params.view || (!myViews.includes(view.type) && global.data.view[view.type])) {

      /* if (!global.data.view[view.view]) {

        global.unloadedViews.push({ id, parent: view.parent, view: view.view, index: view.index })
        return ""
      } */

      var viewId = params.view || view.type
      delete view.view
      views[id] = { ...view, ...clone(global.data.view[viewId]) }
      return createElement({ _window, id, req, res })
    }
  }
  
  // for droplist
  if (parent.unDeriveData || view.unDeriveData) {

    view.data = view.data || ""
    view.unDeriveData = true

  } else view.data = reducer({ _window, id, path: view.derivations, value: view.data, key: true, object: global[view.Data], req, res })
  
  return createTags({ _window, id, req, res })
}

module.exports = { createElement }
