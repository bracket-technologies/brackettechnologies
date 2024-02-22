const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { addresser } = require("./addresser")
// const actions = require("./actions.json")
const { toAwait } = require("./toAwait")

const toAction = ({ _window, id, req, res, __, e, data: { action, path, view: customViewName, data: passedData }, condition, mount, object, lookupActions = {}, stack }) => {

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id]

  var serverAction = false, actionFound = false, serverActionView
  var action0 = path ? (path.at(-1) + "()") : action.split(":")[0], name = action0.slice(0, -2)

  if (path || (action0.slice(-2) === "()" && action0 !== "()" && action0 !== "_()" && !require("./actions.json").includes(action0) && action0.charAt(0) !== "@")) {

    if (!view) return
    var newLookupActions

    // call by action():[path;view;data]
    if (path) {

      // no view name
      if (!customViewName || global.data.view[customViewName]) return

      if (!global.data.view[customViewName].__secure__) {

        var actions = (global.data.view[customViewName] || {}).functions
        actionFound = clone(path).reduce((o, k) => o && o[k], actions)

        // action doesnot exist
        if (actionFound === undefined) return

        if (typeof actionFound === "object" && actionFound._) {

          actionFound = actionFound._ || ""
          newLookupActions = [{ type: "customView", view: viewAction, path }]

        } else if (path.length > 1) newLookupActions = [{ type: "customView", view: viewAction, path: path.slice(0, -1) }]

        if (toArray(lookupActions).length > 1) newLookupActions = [...newLookupActions, ...toArray(lookupActions)]

        //
        action = action0

      } else {

        // server action
        serverAction = true
        serverActionView = customViewName
        newLookupActions = []
      }
    }
    
    // lookup through parent map actions
    if (!actionFound) {
      toArray(lookupActions).map((lookupActions, indexx) => {

        if (lookupActions.path) {

          var path = lookupActions.path
          clone(path).reverse().map((x, i) => {
            
            if (!actionFound) {

              var actions = global.data.view[lookupActions.view].functions || {}
              actionFound = clone(path.slice(0, path.length - i).reduce((o, k) => o[k], actions)[name])

              if (actionFound) {

                if (typeof actionFound === "object" && actionFound._) {

                  actionFound = actionFound._ || ""
                  newLookupActions = [{ type: "customView", view: lookupActions.view, path: [...path.slice(0, path.length - i), name] }]
                  if (toArray(lookupActions).length > 1) newLookupActions = [...newLookupActions, ...toArray(lookupActions).slice(indexx)]

                } else if (toArray(lookupActions).length > 1) toArray(lookupActions).slice(indexx)

              }
            }
          })
        }
      })
    }

    // lookup through head customView actions => server actions
    if (!actionFound) {
      clone(view.__lookupViewActions__).reverse().map(lookupViewActions => {
        
        if (!actionFound) {

          var actions = {}
          if (lookupViewActions.type === "customView") {

            var customView = global.data.view[lookupViewActions.view]
            
            actions = customView.functions || {}
            
            if (name in actions) {
              
              if (customView._secure_ && !stack.server) {

                // server action
                actionFound = true
                serverAction = true
                serverActionView = lookupViewActions.view
                newLookupActions = []

              } else {

                actionFound = clone(actions[name])

                if (typeof actionFound === "object") {

                  actionFound = actionFound._ || ""
                  newLookupActions = [{ type: lookupViewActions.type, view: lookupViewActions.view, path: [name] }]
                }
              }
            }

          } else if (lookupViewActions.type === "view") { }
        }
      })
    }

    if (actionFound) {
      
      var { address, data } = addresser({ _window, req, res, stack, args: action.split(":"), newLookupActions: newLookupActions || lookupActions, asynchronous: serverAction, e, id, data: { string: serverAction ? "" : actionFound }, action: action0, __, id, object, mount, condition, lookupActions })

      // data passed from action():[action;path;data]
      if (passedData !== undefined) data = passedData

      // server action
      if (serverAction) {

        address.status = "Start"
        var action = { name: action0, customView: serverActionView, __: data !== undefined ? [data] : [], lookupActions: [], stack: [], condition, object }
        return require("./action").action({ _window, req, res, id, e, action, __, stack, lookupActions, address })
      }

      return toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: data }).data
    }
  }

  return "__continue__"
}

module.exports = { toAction }