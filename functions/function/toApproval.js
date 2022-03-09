const { isEqual } = require("./isEqual")
const { generate } = require("./generate")
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")

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

    // ex: key1=string1=string2=string3
    if (condition[2]) {

      condition[1] = condition[1].split("||")

      // ex: key1=value1||key2=value2||key3=value3
      if (condition[1].length > 1) {

        condition[2] = condition.slice(2, condition.length).join("=")
        approval = toApproval({ _window, e, string: `${condition[0]}=${condition[1][0]}`, id, _, req, res })
        if (approval) return

        // approval isn't true yet => keep trying
        key = condition[1][1]
        value = condition.slice(2).join("=")
        string = `${key}=${value}`
        return approval = toApproval({ _window, e, string, id, _, req, res })
      }

      // ex: key=value1=value2=value3
      else {
        condition[2] = condition.slice(2, condition.length).join("=")

        // key!=value1!=value2!=value3
        if (key.slice(-1) === "!") {
          if (condition[2].slice(-1) === "!") {
            condition[2] = condition[2].slice(0, -1)
          }
        }

        approval = toApproval({ _window, e, string: `${key}=${condition[2]}`, id, _, req, res })
        if (!approval) return

        // approval is true till now => keep going
        if (key.slice(-1) === "!" && value.slice(-1) === "!") value = value.slice(0, -1)
      }

    } else if (value) {

      value = value.split("||")

      if (value.length === 1) value = value[0]
      else if (value[1]) {

        // ex: key1=value1||key2=value2...
        if (value[1].includes("=")) {

          var string = `${key}=${value[0]}`
          approval = toApproval({ _window, e, string, id, _, req, res })
          if (approval) return

          string = value.slice(1).join("||")
          return (approval = toApproval({ _window, e, string, id, _, req, res }))
        }

        // ex: key=value1||value2||value3
        value[1] = value.slice(1, value.length).join("||")
        var string = `${key}=${value[1]}`
        approval = toApproval({ _window, e, string, id, _, req, res })
        if (approval) return

        // approval isn't true yet => keep trying
        value = value[0]
      }
    }

    if (key) {

      key = key.split("||")

      if (key.length === 1) key = key[0]
      // ex. key1||key2||key3=value
      else if (key[1]) {

        key[1] = key.slice(1, key.length).join("||")
        var string = `${key[1]}${value ? `=${value}` : ""}`
        approval = toApproval({ _window, e, string, id, _, req, res })
        if (approval) return

        // approval isn't true yet => keep trying
        key = key[0]
      }
    }

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

    // id
    if (key.slice(0, 3) === "():") {
      
      var newId = key.split(":")[1]
      key = key.split(":")[0]

      // id
      var _id = toValue({ _window, id, value: newId, e, _, req, res })
      if (_id) id = _id
    }

    var keygen = generate()
    var local = _window ? _window.value[id] : window.value[id]

    if (!local) return approval = false
    
    // to path
    key = toCode({ _window, id, string: key, e })
    var path = typeof key === "string" ? key.split(".") : []
    
    // const
    if (key === "false" || key === "undefined") local[keygen] = false
    else if (key === "true") local[keygen] = true
    else if (key === "mobile()" || key === "phone()") local[keygen] = global.device.type === "phone"
    else if (key === "desktop()") local[keygen] = global.device.type === "desktop"
    else if (key === "tablet()") local[keygen] = global.device.type === "tablet"
    else if (path[1] || path[0].includes("()")) local[keygen] = reducer({ _window, id, path, value, e, _, req, res })
    else local[keygen] = local[key]
    
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
