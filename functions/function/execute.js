const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const _method = require("./function")
const { toCode } = require("./toCode")
const { toAwait } = require("./toAwait")
const { toValue } = require("./toValue")

const execute = ({ _window, controls, actions, e, id, params }) => {

  var views = _window ? _window.views : window.views
  var view = views[id] || {}
  var _params = params, viewId = id

  if (controls) actions = controls.actions

  // execute actions
  toArray(actions).map(_action => {
    _action = toCode({ _window, string: _action, e })

    // 'string'
    if (_action.split("'").length > 2) _action = toCode({ _window, string: _action, start: "'", end: "'" })

    var awaiter = ""
    var approved = true
    var actions = _action.split("?")
    var params = actions[1]
    var conditions = actions[2]
    
    actions = actions[0].split(";")

    // approval
    if (conditions) approved = toApproval({ _window, string: conditions, params, id: viewId, e })
    if (!approved) return toAwait({ id, e, params: _params })

    // params
    params = toParam({ _window, string: params, e, id: viewId })
    if (_params) params = {..._params, ...params}

    // break
    view.break = params.break
    delete params.break

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
      
      // action === name:id:timer:condition
      var name = action.split(':')[0]
      var caseCondition = action.split(":")[3]

      params.action = params.action || {}
      
      // timer
      var isInterval = false
      var timer = params.action.timer
      if (timer === undefined || timer === false) timer = action.split(":")[2] || ""
      if (timer.includes("i")) isInterval = params.isInterval = true
      timer = timer.split("i")[0]
      if (timer) timer = parseInt(timer)
      

      var actionid = params.action.id
      if (action.split(":")[1]) actionid = toValue({ _window, value: action.split(":")[1], params, id: viewId, e })
      
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
        if (caseCondition) approved = toApproval({ _window, string: caseCondition, params, id: viewId, e })
        if (!approved) return toAwait({ id, e, params })
        
        if (_method[name]) toArray(actionid ? actionid : viewId).map(async id => {
          
          if (typeof id !== "string") return

          // id = value.path
          if (id.indexOf(".") > -1) id = toValue({ _window, value: id, e, id: viewId })
          
          // component does not exist
          if (!id || !views[id]) return

          if (isAsyncer) {
            params.awaiter = awaiter
            params.asyncer = isAsyncer
          }
          
          await _method[name]({ _window, ...params, e, id })
          if (name !== "search" && name !== "save" && name !== "erase" && name !== "importJson" && name !== "upload") toAwait({ id, e, params })
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
