const { clone } = require("./clone")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")

const component = require("../component/component")
const { toCode } = require("./toCode")

module.exports = {
  createComponent: ({ _window, lookupActions, awaits, id, req, res, _, __, ___ }) => {
    
    var views = _window ? _window.views : window.views
    var view = views[id], parent = view.parent
    
    if (!component[view.type]) return
    views[id] = view = component[view.type](view)
    
    // my views
    if (!view["my-views"]) view["my-views"] = [...views[view.parent]["my-views"]]

    // use view instead of type
    if (view.view) view.type = view.view
    
    // 
    view.type = toCode({ _window, lookupActions, awaits, string: view.type })
    view.type = toCode({ _window, lookupActions, awaits, id, string: view.type, start: "'", end: "'" })
    
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]

    // type
    view.type = type
    view.parent = parent

    // approval
    var approved = toApproval({ _window, lookupActions, awaits, string: conditions, id, req, res, _, __, ___ })
    if (!approved) return

    // push destructured params from type to view
    if (params) {
      
      params = toParam({ _window, lookupActions, awaits, string: params, id, req, res, mount: true, createElement: true, _, __, ___ })

      if (params.id) {
        
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
    }
  }
}
