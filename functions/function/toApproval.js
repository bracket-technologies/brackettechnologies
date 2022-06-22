const { isEqual } = require("./isEqual")
const { generate } = require("./generate")

const toApproval = ({ _window, e, string, id, _, __, req, res, object }) => {

  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")

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

    if (condition.includes("#()") || condition.includes("#:")) {
      view["#"] = toArray(view["#"])
      return view["#"].push(condition.slice(4))
    }

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
    var keygen = generate()
    var path = typeof key === "string" ? key.split(".") : []

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
