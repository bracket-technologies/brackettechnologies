const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")

const createElement = async ({ _window, id, req, res }) => {

  var views = _window ? _window.views : window.views
  var view = views[id]
  var global = _window ? _window.global : window.global
  var parent = views[view.parent]
  
  // html
  if (view.html) return view.html

  // merge to another view
  if (view.view) {
    
    if (_window) {

      var promise = _window.db.collection(`view-${global.projectId}`).doc(global.currentPage).get().then(doc => {

        global.data.view[doc.id] = doc.data()
        console.log("view", new Date().getTime() - global.timer);
      })

      await Promise.resolve(promise)

    } else {
      
      await require("./search").search({ id: "root", search: { collection: "view", doc: view.view } })
      global.data.view[views.root.search.data.id] = view = views.root.search.data
    }
    
    delete view.view
    view = { ...view, ...clone(global.data.view[view.view]) }
  }

  // view is empty
  if (!view.type) return

  view.type = toCode({ _window, string: view.type })
  
  // 'string'
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

  // ///////////////// approval & params /////////////////////

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

      if (view[params.id]) {
        view[params.id]["id-repetition-counter"] = (view[params.id]["id-repetition-counter"] || 0) + 1
        params.id = params.id + `-${view[params.id]["id-repetition-counter"]}`
      }
      delete Object.assign(views, { [params.id]: views[id] })[id]
      id = params.id

    } else if (priorityId) view.id = id // we have View:id & an id parameter. the priority is for View:id

    // view
    if (params.view) {

      // merge to another view
      if (view.view) {

        if (!global.data.view[view.view]) {

          if (_window) {

            var promise = _window.db.collection(`view-${global.projectId}`).doc(global.currentPage).get().then(doc => {
              
              global.data.view[doc.id] = doc.data()
              console.log("view", new Date().getTime() - global.timer);
            })

            await Promise.resolve(promise)
            
          } else {

            await require("./search").search({ id: "root", search: { collection: "view", doc: view.view } })
            global.data.view[views.root.search.data.id] = views.root.search.data
          }
        }

        delete view.view
        views[id] = view = { ...view, ...clone(global.data.view[view.view]) }
        return createElement({ _window, id, req, res })
      }
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
