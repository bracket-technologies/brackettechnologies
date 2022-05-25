const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")

var createElement = ({ _window, id, req, res }) => {

  var views = _window ? _window.views : window.views
  var view = views[id]
  var global = _window ? _window.global : window.global
  var parent = views[view.parent]
  
  // html
  if (view.html) return view.html

  // merge to another view
  if (view.view && global.data.view[view.view]) view = clone(global.data.view[view.view])

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
  if (!approved) return

  // push destructured params from type to view
  if (params) {
    
    params = toParam({ _window, string: params, id, req, res, mount: true })
    
    if (params.id && params.id !== id) {

      delete Object.assign(views, { [params.id]: views[id] })[id]
      id = params.id
    }

    // view
    if (params.view) {

      var _view = clone(global.data.view[view.view])
      if (_view) {

        delete view.type
        delete view.view
        
        views[id] = { ...view, ..._view}
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
