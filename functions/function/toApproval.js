const { isEqual } = require("./isEqual")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const actions = require("./actions.json")

const toApproval = ({ _window, e, string, id = "root", _, __, ___, req, res, object, _i, elser }) => {

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

    if (condition.charAt(0) === "#") {
      if (elser) return approval = false
      else return
    }

    // or
    if (condition.includes("||")) {
      var conditions = condition.split("||"), _i = 0
      approval = false
      while (!approval && conditions[_i] !== undefined) {
        approval = toApproval({ _window, e, string: conditions[_i], id, _, __, ___, req, res, object, elser: true })
        _i += 1
      }
      return approval
    }

    condition = condition.split("=")
    var equalOp = condition.length > 1
    var greaterOp = condition[0].split(">")[1] !== undefined
    if (greaterOp) {
      condition[1] = condition[1] || condition[0].split(">")[1]
      condition[0] = condition[0].split(">")[0]
    }
    var lessOp = condition[0].split("<")[1] !== undefined
    if (lessOp) {
      condition[1] = condition[1] || condition[0].split("<")[1]
      condition[0] = condition[0].split("<")[0]
    }

    var key = condition[0]
    var value = condition[1]
    var notEqual

    // /////////////////// value /////////////////////

    if (value) value = toValue({ _window, id: mainId, value, e, _, __, ___, req, res, condition: true })

    // /////////////////// key /////////////////////

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]
    if (key && key.includes('codedS()') && key.length === 13) return approval = global.codes[key] ? true : false

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

    var myKey
    /*if (!key && object !== undefined) myKey = object
    else myKey = toValue({ _window, id: mainId, value: key, e, _, __, ___, req, res, object: object || view, condition: true })
    console.log(condition, key, myKey, object);*/

    // to path
    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0], backendFn = false, isFn = false

    // function
    if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && !_functions[path0.slice(-2)] /*&& !actions.includes(path0)*/ && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

      clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) {
            isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
            isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })
          }
        }
      })
      
      // global functions
      if (!isFn) {
        isFn = Object.keys(global.openFunctions || {}).find(fn => fn === path0.slice(0, -2))
        if (isFn) {
          isFn = toCode({ _window, id, string: (global.openFunctions)[isFn] })
          isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })
        }
      }

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
          var _data = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
          var _func = { function: isFn, data: _data }
          if (args[2]) _await = global.codes[args[2]]
          
          return require("./func").func({ _window, id, e, _, __, ___, _i, req, res, func: _func, asyncer: true, await: _await })
        }
        
        var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
  
        return require("./func").func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
      }

      if (_params) {
        if (isParam({ _window, string: _params }))
          _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: _params })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
      }
      return approval = toApproval({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i })
    }

    if (!key && object !== undefined) myKey = object
    else if (key === "false" || key === "undefined") myKey = false
    else if (key === "true") myKey = true
    else if (key === "mobile()" || key === "phone()") myKey = global.device.type === "phone"
    else if (key === "desktop()") myKey = global.device.type === "desktop"
    else if (key === "tablet()") myKey = global.device.type === "tablet"
    else if (key === "_") myKey = _
    else if (key === "__") myKey = __
    else if (key === "___") myKey = ___
    else if (object || path[0].includes("()") || path[0].includes(")(") || (path[1] && path[1].includes("()"))) myKey = reducer({ _window, id, path, e, _, __, ___, req, res, object, condition: true })
    else myKey = reducer({ _window, id, path, e, _, __, ___, req, res, object: object ? object : view, condition: true })
    // else myKey = key

    if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !myKey : (myKey === 0 ? true : myKey)
    else {
      if (equalOp) approval = notEqual ? !isEqual(myKey, value) : isEqual(myKey, value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(myKey) > parseFloat(value)) : (parseFloat(myKey) > parseFloat(value))
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(myKey) < parseFloat(value)) : (parseFloat(myKey) < parseFloat(value))
    }
  })

  return approval
}

module.exports = { toApproval }
