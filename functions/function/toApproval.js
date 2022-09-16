const { isEqual } = require("./isEqual")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const actions = require("./actions.json")

const toApproval = ({ _window, e, string, id = "", _, __, req, res, object, _i }) => {

  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")
  const { toParam } = require("./function")
  var _functions = require("./function")

  // no string but object exists
  if (!string)
    if (object) return true
    else if (object !== undefined) return false

  // no string
  if (!string || typeof string !== "string") return true

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var mainId = id, approval = true

  // coded
  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // ==
  string = string.replace("==", "=")

  string.split(";").map(condition => {

    // no condition
    if (condition === "") return true
    if (!approval) return false

    id = mainId
    var view = views[id] || {}

    if (condition.charAt(0) === "#") return

    // or
    if (condition.includes("||")) {
      var conditions = condition.split("||"), _i = 0
      approval = false
      while (!approval && conditions[_i] !== undefined) {
        approval = toApproval({ _window, e, string: conditions[_i], id, _, __, req, res, object })
        _i += 1
      }
      return approval
    }

    condition = condition.split("=")
    var equalOp = condition.length > 1
    var greaterOp = condition[0].split(">")[1] && true
    if (greaterOp) {
      condition[1] = condition[1] || condition[0].split(">")[1]
      condition[0] = condition[0].split(">")[0]
    }
    var lessOp = condition[0].split("<")[1] && true
    if (lessOp) {
      condition[1] = condition[1] || condition[0].split("<")[1]
      condition[0] = condition[0].split("<")[0]
    }

    var key = condition[0]
    var value = condition[1]
    var notEqual

    // /////////////////// value /////////////////////

    if (value) value = toValue({ _window, id: mainId, value, e, _, __, req, res })

    // /////////////////// key /////////////////////

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]

    // operator has !
    if (key.includes("!")) {
      if (key.split("!")[0]) {

        if (condition[1]) {
          notEqual = true
          key = key.split("!")[0]
        }

      } else {

        key = key.split("!")[1]
        notEqual = true
      }
    }
    
    // to path
    var keygen = generate(), isFn
    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0], backendFn = false, isFn = false

    // function
    if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

      clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })

      // backend function
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
        if (isFn) backendFn = true
      }
    }

    if (isFn) {
      var _params = path[0].split(":")[1], args = path[0].split(":")
      if (backendFn) {
        
        if (isParam({ _window, string: args[1] })) {
  
          var _await = ""
          var _data = toParam({ req, res, _window, id, e, _, __, _i, string: args[1] })
          var _func = { function: isFn, data: _data }
          if (args[2]) _await = global.codes[args[2]]
          
          return require("./func").func({ _window, id, e, _, __, _i, req, res, func: _func, asyncer: true, await: _await })
        }
        
        var _data = toValue({ req, res, _window, id, e, _, __, _i, value: args[1], params })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
  
        return require("./func").func({ _window, req, res, id, e, func: _func, _, __, asyncer: true, await: _await })
      }

      if (_params) {
        if (isParam({ _window, string: _params }))
          _params = toParam({ req, res, _window, id, e, _, __, _i, string: _params })
        else _params = toValue({ req, res, _window, id, e, _, __, _i, value: _params })
      }
      return approval = toApproval({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), _i })
    }

    if (!key && object !== undefined) view[keygen] = object
    else if (key === "false" || key === "undefined") view[keygen] = false
    else if (key === "true") view[keygen] = true
    else if (key === "mobile()" || key === "phone()") view[keygen] = global.device.type === "phone"
    else if (key === "desktop()") view[keygen] = global.device.type === "desktop"
    else if (key === "tablet()") view[keygen] = global.device.type === "tablet"
    else if (key === "_") view[keygen] = _
    else if (key === "__") view[keygen] = __
    else if (object || path[0].includes("()") || path[0].includes(")(") || (path[1] && path[1].includes("()"))) view[keygen] = reducer({ _window, id, path, e, _, __, req, res, object, condition: true })
    else view[keygen] = reducer({ _window, id, path, e, _, __, req, res, object: object ? object : view, condition: true })
    // else view[keygen] = key
    
    if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !view[keygen] : (view[keygen] === 0 ? true : view[keygen])
    else {
      if (equalOp) approval = notEqual ? !isEqual(view[keygen], value) : isEqual(view[keygen], value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(view[keygen]) > parseFloat(value)) : (parseFloat(view[keygen]) > parseFloat(value))
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(view[keygen]) < parseFloat(value)) : (parseFloat(view[keygen]) < parseFloat(value))
    }

    delete view[keygen]
  })

  return approval
}

module.exports = { toApproval }
