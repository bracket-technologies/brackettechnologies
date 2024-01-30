const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { addresser } = require("./addresser")
const actions = require("./actions.json")
const { toAwait } = require("./toAwait")

const toAction = ({ _window, id, req, res, __, e, path, path0, condition, mount, toView, object, lookupActions = {}, stack }) => {

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id], asynchronous = false, actionFound = false

  if (path.length === 1 && path0.slice(-2) === "()" && path0 !== "()" && path0 !== "_()" && !actions.includes(path0) && path0.charAt(0) !== "@") {
    
    var newLookupActions
    var myCustomViews = (view || {}).__customViewPath__ || []

    // lookup through parent map actions
    toArray(lookupActions).map((lookupActions, indexx) => {

      if (lookupActions.actionPath) {
        
        var actionPath = lookupActions.actionPath
        clone(actionPath).reverse().map((x, i) => {

          if (!actionFound) {
            
            var actions = (lookupActions.view === "_project_" ? global.data.project.functions : global.data.view[lookupActions.view].functions) || {}
            actionFound = Object.keys(clone(actionPath).slice(0, actionPath.length - i).reduce((o, k) => o && o[k], actions) || {}).find(actionPath => actionPath === path0.slice(0, -2))

            if (actionFound) {

              actionFound = actionPath.slice(0, actionPath.length - i).reduce((o, k) => o[k], actions)[actionFound]
              if (typeof actionFound === "object" && actionFound._) {

                actionFound = actionFound._ || ""
                newLookupActions = { view: lookupActions.view, actionPath: [...actionPath, path0.slice(0, -2)] }
                if (toArray(lookupActions).length > 1) newLookupActions = [newLookupActions, ...toArray(lookupActions).slice(indexx)]

              } else if (toArray(lookupActions).length > 1) toArray(lookupActions).slice(indexx)
            }
          }
        })
      }
    })

    // lookup through parent views actions => server actions
    if (!actionFound) {

      clone(["_project_", ...myCustomViews]).reverse().map((myview, i) => {

        if (!actionFound) {

          if (myview !== "_project_" && !global.data.view[myview]) return
          var actions =( myview === "_project_" ? (stack.server ? global.data.project.functions : global.__serverActions__) : (global.data.view[myview].functions)) || {}
          actionFound = (Array.isArray(actions) ? actions : Object.keys(actions)).find(action => action === path0.slice(0, -2))
          
          if (actionFound) {
            
            if (myview === "_project_" && !stack.server) {
              
              // server action & now we are not on server
              asynchronous = true
              newLookupActions = []

            } else {

              if (typeof actions[actionFound] === "object") {

                actionFound = actions[actionFound]._ || ""
                newLookupActions = { view: myview, actionPath: [path0.slice(0, -2)] }

              } else actionFound = actions[actionFound]
            }
          }
        }
      })
    }
    
    if (actionFound) {

      var address = addresser({ _window, req, res, stack, status: "Wait", args: path[0].split(":"), newLookupActions: newLookupActions || lookupActions, asynchronous, e, id, data: { string: !asynchronous ? actionFound : "" }, action: path0, __, id, object, mount, toView, condition, lookupActions })
      var { address, data } = address
      
      // lookupActions
      newLookupActions = newLookupActions || lookupActions

      if (asynchronous) {

        address.status = "Start"
        var action = { name: actionFound, __: data !== undefined ? [data] : [], lookupActions: [], stack: [], condition, object }
        return require("./action").action({ _window, req, res, id, e, action, __, stack, lookupActions, address })
      }

      return toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: data }).data
    }
  }

  return "__continue__"
}

module.exports = { toAction }