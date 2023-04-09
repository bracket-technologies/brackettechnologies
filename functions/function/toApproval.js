const { isEqual } = require("./isEqual")

const toApproval = ({ _window, lookupActions, awaits, e, string, params = {}, id = "root", _, __, ___, req, res, object, elser }) => {

  const { toFunction } = require("./toFunction")
  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")

  if (params && params["return()"] !== undefined) return params["return()"]
  else if (params["break()"]) return params

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
        if (conditions[_i].slice(0,2) === "=") conditions[_i] = conditions[0] + conditions[_i]
        approval = toApproval({ _window, lookupActions, awaits, e, string: conditions[_i], id, _, __, ___, params, req, res, object, elser: true })
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

    if (value) value = toValue({ _window, lookupActions, awaits, id: mainId, value, e, _, __, ___, req, res, params, condition: true })

    // /////////////////// key /////////////////////

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]
    if (key && key.includes('codedS()') && key.length === 13) {
      if (value === undefined) return approval = global.codes[key] ? true : false
      else return approval = global.codes[key] === value
    }

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

    //
    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0], myKey

    // function
    var isFn = toFunction({ _window, lookupActions, awaits, id, req, res, _, __, ___, e, path, path0, condition: true });
    if (isFn !== "__CONTINUE__") return approval = notEqual ? !isFn : isFn

    if (!key && object !== undefined) myKey = object
    else if (key === "undefined") myKey = undefined
    else if (key === "false") myKey = false
    else if (key === "true") myKey = true
    else if (key === "desktop()") myKey = global.device.device.type === "desktop"
    else if (key === "tablet()") myKey = global.device.device.type === "tablet"
    else if (key === "mobile()") myKey = global.device.device.type === "smartphone"
    else if (key === "_") myKey = _
    else if (key === "__") myKey = __
    else if (key === "___") myKey = ___
    else if (object || path[0].includes("()") || path[0].includes(")(") || (path[1] && path[1].includes("()"))) myKey = reducer({ _window, lookupActions, awaits, id, path, e, _, __, ___, params, req, res, object, condition: true })
    else myKey = reducer({ _window, lookupActions, awaits, id, path, e, _, __, ___, req, res, params, object: object ? object : view, condition: true })
    // else myKey = key

    if (params["return()"] !== undefined) {

      approval = params["return()"]

    } else if (!equalOp && !greaterOp && !lessOp) {

      approval = notEqual ? !myKey : (myKey === 0 ? true : myKey)

    } else {
      
      if (equalOp) approval = notEqual ? !isEqual(myKey, value) : isEqual(myKey, value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(myKey) > parseFloat(value)) : (parseFloat(myKey) > parseFloat(value))
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(myKey) < parseFloat(value)) : (parseFloat(myKey) < parseFloat(value))
    }
  })

  return approval
}

module.exports = { toApproval }
