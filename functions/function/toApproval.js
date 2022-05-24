const { isEqual } = require("./isEqual")
const { generate } = require("./generate")

const toApproval = ({ _window, e, string, id, _, req, res, object }) => {

  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")

  // no string but object exists
  if (!string)
    if (object) return true
    else if (object !== undefined) return false

  // no string
  if (!string || typeof string !== "string") return true

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
    var view = _window ? _window.views[id] : window.views[id] || {}

    if (condition.includes("#()")) {
      view["#"] = toArray(view["#"])
      return view["#"].push(condition.slice(4))
    }

    // or
    if (condition.includes("||")) {
      var conditions = condition.split("||"), _i = 0
      approval = false
      while (!approval && conditions[_i] !== undefined) {
        approval = toApproval({ _window, e, string: conditions[_i], id, _, req, res, object })
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

    if (value) value = toValue({ _window, id: mainId, value, e, _, req, res })

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
    else if (object || path[0].includes("()") || path[0].includes(")(")) view[keygen] = reducer({ _window, id, path, e, _, req, res, object })
    else view[keygen] = reducer({ _window, id, path, e, _, req, res, object: object ? object : view })
    // else view[keygen] = key

    if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !view[keygen] : (view[keygen] === 0 ? true : view[keygen])
    else {
      if (equalOp) approval = notEqual ? !isEqual(view[keygen], value) : isEqual(view[keygen], value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(view[keygen] > value) : (view[keygen] > value)
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(view[keygen] < value) : (view[keygen] < value)
    }

    delete view[keygen]
  })

  return approval
}

module.exports = { toApproval }
