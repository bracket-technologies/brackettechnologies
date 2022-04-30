const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const _method = require("./function")
const { toCode } = require("./toCode")
const { toAwait } = require("./toAwait")
const { toValue } = require("./toValue")

const execute = ({ _window, controls, actions, e, id, params }) => {

  var local = (_window ? _window.value[id] : window.value[id]) || {}
  var _params = params, localId = id

  if (controls) actions = controls.actions
  if (local) local.break = false

  // execute actions
  toArray(actions).map(_action => {
    _action = toCode({ _window, string: _action, e })
    
    var awaiter = ""
    
    // stop after actions
    if (local && local.break) return

    var approved = true
    var actions = _action.split("?")
    var params = actions[1]
    var conditions = actions[2]
    var idList = actions[3] || localId

    // id list
    if (actions[3]) idList = toValue({ _window, id, value: idList, e })
    
    actions = actions[0].split(";")

    // approval
    if (conditions) approved = toApproval({ _window, string: conditions, params, id: localId, e })
    if (!approved) return

    // params
    params = toParam({ _window, string: params, e, id: localId })
    if (_params) params = {..._params, ...params}

    // break
    local.break = params.break
    delete params.break

    // action does not exist
    actions.map(action => {

      if (action.includes("async():")) {
        
        var _actions = action.split(":").slice(1)
        action = _actions[0]
        params.awaiter = params.awaiter || ""
        if (_actions.slice(1)[0]) params.awaiter += `async():${_actions.slice(1).join(":")}`
        params.asyncer = true
      }

      // action is coded
      if (action.slice(0, 7) === "coded()") return execute({ _window, actions: global.codes[action], e, id, params })
      
      // action === name:id:timer<<condition
      var caseCondition = action.split('<<')[1]
      var name = action.split('<<')[0]
      var actionid = name.split(":")[1]
      var timer = name.split(":")[2] || ""
      name = name.split(':')[0]
      
      // timer
      var isInterval = false
      if (timer.includes("i")) isInterval = params.isInterval = true
      timer = timer.split("i")[0]
      if (timer) timer = parseInt(timer)
      
      if (actionid) actionid = toValue({ _window, value: actionid, params, id: localId, e })
      
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
        if (caseCondition) approved = toApproval({ _window, string: caseCondition, params, id: localId, e })
        if (!approved) return toAwait({ id, e, params })
        
        if (_method[name]) toArray(actionid ? actionid : idList).map(async id => {
          
          if (typeof id !== "string") return

          // id = value.path
          if (id.indexOf(".") > -1) id = toValue({ _window, value: id, e, id: localId })
          
          // component does not exist
          if (!id || !window.value[id]) return

          if (isAsyncer) {
            params.awaiter = awaiter
            params.asyncer = isAsyncer
          }
          
          await _method[name]({ _window, ...params, e, id })
          if (name !== "search" && name !== "save" && name !== "erase" && name !== "searchArduino" && name !== "importJson" && name !== "upload") toAwait({ id, e, params })
        })
      }

      if (timer || timer === 0) {

        if (local) {

          var _name = name.split('.')[1] || name.split('.')[0]
          if (isInterval) {
            myFn()
            local[`${_name}-timer`] = setInterval(() => myFn(), timer)
          } else local[`${_name}-timer`] = setTimeout(myFn, timer)

        } else {

          if (params["setInterval()"]) setInterval(myFn, timer)
          else setTimeout(myFn, timer)
        }

      } else myFn()
    })
  })
}

module.exports = { execute }
