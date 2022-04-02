const { isEqual } = require("./isEqual")
const { generate } = require("./generate")
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")

const toApproval = ({ _window, e, string, id, _, req, res }) => {

  // no string
  if (!string || typeof string !== "string") return true

  var global = _window ? _window.global : window.global
  var mainId = id, approval = true

  string.split(";").map(condition => {

    // no condition
    if (condition === "") return true
    if (!approval) return false

    id = mainId
    var local = _window ? _window.value[id] : window.value[id]

    if (condition.includes("#()")) {
      local["#"] = toArray(local["#"])
      return local["#"].push(condition.slice(4))
    }

    condition = condition.split("=")
    var key = condition[0]
    var value = condition[1]
    var notEqual

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]

    // operator has !
    if (key.includes("!")) {
      if (key.split("!")[0]) {

        if (value) notEqual = true
        if (notEqual) key = key.split("!")[0]

      } else {

        // !key => study key without value
        value = undefined
        key = key.split("!")[1]
        notEqual = true
      }
    }

    // /////////////////// value /////////////////////

    if (value && value !== "undefined" && value !== "false") value = toValue({ _window, id: mainId, value, e, _, req, res })

    // /////////////////// key /////////////////////

    id = mainId

    var keygen = generate()
    var local = _window ? _window.value[id] : window.value[id]

    if (!local) return approval = false
    
    // to path
    var path = typeof key === "string" ? key.split(".") : []
    
    // const
    if (key === "false" || key === "undefined") local[keygen] = false
    else if (key === "true") local[keygen] = true
    else if (key === "mobile()" || key === "phone()") local[keygen] = global.device.type === "phone"
    else if (key === "desktop()") local[keygen] = global.device.type === "desktop"
    else if (key === "tablet()") local[keygen] = global.device.type === "tablet"
    else if (path[1] || path[0].includes("()") || path[0].includes(")(")) local[keygen] = reducer({ _window, id, path, value, e, _, req, res })
    else local[keygen] = key
    
    if (value === undefined) {
      approval = notEqual ? !local[keygen] : (local[keygen] === 0 ? true : local[keygen])

    } else {

      if (value === "undefined") value = undefined
      if (value === "false") value = false
      if (value === "true") value = true
      approval = notEqual ? !isEqual(local[keygen], value) : isEqual(local[keygen], value)
    }

    delete local[keygen]

  })

  return approval
}

module.exports = { toApproval }
