const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { addresser } = require("./addresser")
const actions = require("./actions.json")
const { lineInterpreter } = require("./lineInterpreter")

const toAction = ({ _window, id, req, res, __, e, path, path0, condition, mount, toView, object, lookupActions = {}, stack }) => {

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id], callServerAction = false, actionFound = false

  if (path.length === 1 && path0.slice(-2) === "()" && path0 !== "()" && path0 !== "_()" && !actions.includes(path0) && path0.charAt(0) !== "@") {
    
    var newLookupActions
    var parentViews = (view || {}).__viewsPath__ || []

    // lookup through parent map actions
    toArray(lookupActions).map((lookupActions, indexx) => {

      if (lookupActions.fn) {
        
        var fn = lookupActions.fn
        clone(fn).reverse().map((myfn, i) => {

          if (!actionFound) {
            
            var actions = clone(lookupActions.view === "_project_" ? global.data.project.functions : global.data.view[lookupActions.view].functions) || {}
            actionFound = Object.keys(clone(fn).slice(0, fn.length - i).reduce((o, k) => o[k] || {}, actions)).find(fn => fn === path0.slice(0, -2))

            if (actionFound) {

              actionFound = fn.slice(0, fn.length - i).reduce((o, k) => o[k], actions)[actionFound]
              if (typeof actionFound === "object" && actionFound._) {

                actionFound = actionFound._ || ""
                newLookupActions = { view: lookupActions.view, fn: [...fn, path0.slice(0, -2)] }
                if (toArray(lookupActions).length > 1) newLookupActions = [newLookupActions, ...toArray(lookupActions).slice(indexx)]

              } else if (toArray(lookupActions).length > 1) toArray(lookupActions).slice(indexx)
            }
          }
        })
      }
    })

    // lookup through parent views actions => server actions
    if (!actionFound) {

      clone(["_project_", ...parentViews]).reverse().map((myview, i) => {

        if (!actionFound) {

          if (myview !== "_project_" && !global.data.view[myview]) return
          var actions = myview === "_project_" ? (stack.server ? global.data.project.functions : global.__serverActions__) : (global.data.view[myview].functions) || {}
          actionFound = (Array.isArray(actions) ? actions : Object.keys(actions)).find(fn => fn === path0.slice(0, -2))
          
          if (actionFound) {
            
            if (myview === "_project_" && !stack.server) {
              
              // server action & now we are not on server
              callServerAction = true
              newLookupActions = []

            } else {

              if (typeof actions[actionFound] === "object") {

                actionFound = actions[actionFound]._ || ""
                newLookupActions = { view: myview, fn: [path0.slice(0, -2)] }

              } else actionFound = actions[actionFound]
            }
          }
        }
      })
    }

    if (actionFound) {
      
      var address = addresser({ _window, req, res, stack, args: path[0].split(":"), asynchronous: callServerAction && true, e, hold: true, requesterID: id, action: path0, __, id, object, mount, toView, condition, lookupActions })
      var { address, data } = address

      var my__ = [...(data !== undefined ? [data] : []), ...__]

      // lookupActions
      newLookupActions = newLookupActions || lookupActions

      if (callServerAction) {

        var action = { name: actionFound, __: my__, lookupActions: [], stack: [], condition, object }
        return require("./action").action({ _window, req, res, id, e, action, __, stack, lookupActions, address })
      }
      
      // interpret
      var { data } = lineInterpreter({ _window, lookupActions: newLookupActions, stack, address, id, e, data: actionFound, req, res, mount, __: my__, condition, object, toView })

      return data
    }
  }

  return "__continue__"
}

module.exports = { toAction }