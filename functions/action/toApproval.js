const { decode } = require("./decode")
const { isEqual } = require("./isEqual")

const toApproval = ({ _window, lookupActions, stack, e, data: string, id, __, req, res, object }) => {

  const { toAction } = require("./toAction")
  const { toValue } = require("./toValue")

  // no string but object exists
  if (!string)
    if (object) return true
    else if (object !== undefined) return false

  // no string
  if (!string || typeof string !== "string") return true

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id], approval = true
  
  if ((stack.returns && stack.returns[0] || {}).returned) return

  // coded
  if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data

  // ==
  string = string.replace("==", "=")

  string.split(";").map(condition => {

    // no condition
    if (condition === "") return true
    if (!approval) return false

    if (condition.charAt(0) === "#") return

    // or
    if (condition.includes("||")) {
      
      var conditions = condition.split("||"), i = 0
      var key = conditions[0].split("=")[0]
      if (key.at(-1) === "!") key = key.slice(0, -1)
      approval = false

      while (!approval && conditions[i] !== undefined) {
        if (conditions[i].charAt(0) === "=" || conditions[i].slice(0, 2) === "!=") conditions[i] = key + conditions[i]
        approval = toApproval({ _window, lookupActions, stack, e, data: conditions[i], id, __, req, res, object })
        i += 1
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

    var key = condition[0] || ""
    var value = condition[1]
    var notEqual

    // get value
    if (value) value = toValue({ _window, lookupActions, stack, id, data: value, e, __, req, res, condition: true })

    // encoded
    if (key.charAt(0) === "@" && key.length == 6 && global.__refs__[key].type === "text") {
      if (value === undefined) return approval = global.__refs__[key].data ? true : false
      else return approval = global.__refs__[key].data === value
    }
    
    if (key.charAt(0) === "@" && key.length == 6) key = global.__refs__[key].data

    // operator has !
    if (key.at(0) === "!" || key.at(-1) === "!") {
      if (key.at(-1) === "!") {

        if (condition[1]) {
          notEqual = true
          key = key.split("!")[0]
        }

      } else {

        key = key.split("!")[1]
        notEqual = true
      }
    }

    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0]

    // action
    if (path0.slice(-2) === "()") {
      var isAction = toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { action: path[0] }, condition: true });
      if (isAction !== "__continue__") return approval = notEqual ? !isAction : isAction
    }

    // get key
    if (object || key.includes("()")) key = toValue({ _window, lookupActions, stack, id, data: key, e, __, req, res, object, condition: true })
    else key = toValue({ _window, lookupActions, stack, id, data: key, e, __, req, res, object: object !== undefined ? object : view, condition: true })

    // evaluate
    if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !key : (key === 0 ? true : key)
    else {
      
      if (equalOp) approval = notEqual ? !isEqual(key, value) : isEqual(key, value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(key) > parseFloat(value)) : (parseFloat(key) > parseFloat(value))
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(key) < parseFloat(value)) : (parseFloat(key) < parseFloat(value))
    }
  })
  return approval
}

module.exports = { toApproval }
