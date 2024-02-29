const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const _method = require("./function")
const { toCode } = require("./toCode")
const { toAwait } = require("./toAwait")
const { toValue } = require("./toValue")
const { isParam } = require("./isParam")

const execute = ({ _window, lookupActions, stack, controls, actions, e, id, params, __ }) => {

  const views = _window ? _window.views : window.views
  var view = views[id] || {}
  const global = window.global
  var _params = params, viewId = id

  if (controls) actions = controls.actions || controls.action

  // execute actions
  toArray(actions).map(_action => {

    _action = toCode({ _window, id, string: toCode({ _window, id, string: _action, start: "'", end: "'" }) })

    var awaiter = ""
    var approved = true
    var actions = _action.split("?")
    var params = actions[1]
    var conditions = actions[2]
    
    actions = actions[0].split(";")

    // approval
    if (conditions) approved = toApproval({ _window, lookupActions, stack, data: conditions, params, id: viewId, e, __ })
    if (!approved) return toAwait({ id, lookupActions, stack, e, params: _params, __ })

    // params
    params = toParam({ _window, lookupActions, stack, data: params, e, id: viewId, executer: true, mount: true, __ })
    if (_params) params = {..._params, ...params}

    // break
    if (view["break()"]) delete view["break()"]
    if (view["return()"]) return delete view["return()"]

    actions.map(action => {

      if (action.includes("async():") || action.includes("wait():")) {
        
        var _actions = action.split(":").slice(1)
        action = _actions[0]
        params.awaiter = params.awaiter || ""
        if (_actions.slice(1)[0]) params.awaiter += `wait():${_actions.slice(1).join(":")}`
        params.asyncer = true
      }
      
      // action is coded
      if (action.charAt(0) === "@") return execute({ _window, lookupActions, stack, actions: global.__refs__[action].data, e, id, params, __ })
      
      var name, caseCondition, timer = "", isInterval = false, actionid, args = action.split(':'), name = args[0], __params = {}

      if (isParam({ _window, lookupActions, stack, string: args[1] }) || (args[2] && isNaN(args[2].split("i")[0]) && !args[3])) { // action:[params]:[conditions]

        __params = toParam({ _window, lookupActions, stack, id: viewId, e, data: args[1], mount: true, __ })

        // break
        if (view["break()"]) delete view["break()"]
        if (view["return()"]) return delete view["return()"]

        actionid = toArray(__params.id || viewId) // id
        if (__params.timer !== undefined) timer = __params.timer.toString() // timer
        if (args[2]) caseCondition = args[2]

      } else { // action:id:timer:condition

        actionid = toArray(args[1] ? toValue({ _window, lookupActions, stack, data: args[1], params, id: viewId, e, __ }) : viewId) // timer
        if (args[2]) timer = args[2] // timer
        if (args[3]) caseCondition = args[3] // conditions
      }

      // is interval
      if (timer.includes("i")) isInterval = params.isInterval = true
      timer = timer.split("i")[0]
      if (timer) timer = parseInt(timer)
      
      actionid = toArray(actionid).map(id => {
        if (typeof id === "object" && id.id) return id.id
        else return id
      })

      const myFn = () => {
        var approved = true

        // asyncer & awaiter
        var keys = name.split("."), isAwaiter, isAsyncer
        if (keys.length > 1) keys.map(k => {
  
          if (k === "async()") isAsyncer = true
          else if (k === "await()") {
            isAwaiter = true
            awaiter += action.split("await().")[1] + ";"
          }
        })

        if (isAwaiter || isAsyncer) name = name.split(".")[1]
        if (isAwaiter) return

        // case condition approval
        if (caseCondition) approved = toApproval({ _window, lookupActions, stack, data: caseCondition, params, id: viewId, e, __ })
        if (!approved) return toAwait({ id, lookupActions, stack, e, params, __ })
        
        if (_method[name]) actionid.map(async id => {
          
          if (typeof id !== "string") return

          // id = value.path
          if (id.indexOf(".") > -1) id = toValue({ _window, lookupActions, stack, data: id, e, id: viewId, __ })
          
          // component does not exist
          if (!id || !views[id]) return

          if (isAsyncer) {
            params.awaiter = awaiter
            params.asyncer = isAsyncer
          }
          
          await _method[name]({ _window, lookupActions, stack, ...params, ...__params, e, id })
          if (name !== "SEARCH" && name !== "save" && name !== "erase" && name !== "importJson" && name !== "upload" && name !== "wait") toAwait({ id, lookupActions, stack, e, params, __ })
        })
      }

      if (timer || timer === 0) {

        if (view) {

          var _name = name.split('.')[1] || name.split('.')[0]
          if (isInterval) {
            myFn()
            view[`${_name}-timer`] = setInterval(() => myFn(), timer)
          } else view[`${_name}-timer`] = setTimeout(myFn, timer)

        } else {

          if (params["setInterval()"]) setInterval(myFn, timer)
          else setTimeout(myFn, timer)
        }

      } else myFn()
    })
  })
}

module.exports = { execute }
