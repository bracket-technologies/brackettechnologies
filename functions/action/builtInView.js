const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const builtInViews = require("../view/views")

module.exports = {
  builtInView: ({ _window, lookupActions, stack, id, __ }) => {
    
    var views = _window ? _window.views : window.views
    var view = views[id], parent = view.parent
    
    views[id] = view = builtInViews[view.__name__](view)
    view.__builtInViewMounted__ = true
    
    // my views
    if (!view.__path__) view.__path__ = [...views[view.parent].__path__]

    view.type = view.view
    
    // 
    view.type = toCode({ _window, id, string: toCode({ _window, id, string: view.type, start: "'", end: "'" }) })
    
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]
    var elseParams = view.type.split("?")[3]

    // type
    view.__name__ = type
    view.parent = parent

    // approval
    var approved = toApproval({ _window, lookupActions, stack, data: conditions, id, __ })
    if (!approved) {
      if (elseParams) params = otherParams
      else return delete views[id]
    }

    // push destructured params from type to view
    if (params) {
      
      params = toParam({ _window, lookupActions, stack, data: params, id, mount: true, toView: true, __ })

      if (params.id) {
        
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
    }
  }
}
