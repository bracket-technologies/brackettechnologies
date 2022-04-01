const { generate } = require("./generate")
const { reducer } = require("./reducer")

const toValue = ({ _window, value, params, _, id, e, req, res, object }) => {

  const { toApproval } = require("./toApproval")

  var local = _window ? _window.value[id] : window.value[id]
  var global = _window ? _window.global : window.global

  if (!value) return value

  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  
  // return const value
  if (value.split("const.")[1] !== undefined && !value.split("const.")[0])
  return value.split("const.")[1]

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0])
  return value.split("await().")[1]

  // _
  if (value === "_") return _

  // auto space
  if (value === "") return ""

  // auto comma
  if (value === "_comma") return ","

  // _quotation
  if (value === "_quotation") return `'`

  // _quotations
  if (value === "_quotations") return `"`

  // _array
  if (value === "_array") return []

  // _map
  if (value === "_map" || value === "_object") return {}

  // _string
  if (value === "_string") return ""

  // _quest
  if (value === "_quest") return "?"

  // _space
  if (value === "_space" || value === " ") return " "

  // _semi
  if (value === "_semi") return ";"

  // _dot
  if (value === "_dot") return "."

  // _dots
  if (value === "_dots") return "..."

  // _equal
  if (value === "_equal") return "="

  // _equals
  if (value === "_equals") return "=="

  // _equal_equal
  if (value === "_equal_equal") return "=="

  // auto space
  if (value === "&nbsp") return "&nbsp;"
    
  // auto question
  if (value.includes("_question")) value = value.split("_question").join("?")
  
  // auto question
  if (value.includes("_quest")) value = value.split("_quest").join("?")

  // auto equal
  if (value.includes("_equal")) value = value.split("_equal").join("=")

  // auto semicolon
  if (value.includes("_semi")) value = value.split("_semi").join(";")
  
  // auto comma
  if (value.includes("_comma")) value = value.split("_comma").join(",")
  
  // auto currency
  if (value.includes("_currency")) value = value.split("_currency").join(global.currency || "$")

  /*
  // id
  if (value.slice(0, 3) === "():") {

    var newId = value.split(":")[1]
    var _id = toValue({ _window, value: newId, params, _, id, e, req, res })
    if (_id) id = _id
    value = `().${value.split(".").slice(1).join(".")}`
  }
*/
  //var local = _window ? _window.value[id] : window.value[id]

  // conditions
  if (value.includes("<<")) {

    var condition = value.split("<<")[1]
    var approved = toApproval({ _window, id, e, string: condition, _, req, res })
    if (!approved) return "*return*"
    value = value.split("<<")[0]
  }

  var path = typeof value === "string" ? value.split(".") : []
  
  /* value */
  if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, e, req, res  })
  else if (path[0].includes("()") && path.length === 1) value = reducer({ _window, id, e, path, params, object: object || (_window ? _window.value : window.value), _, req, res })
  else if (path[1] || path[0].includes(")(")) value = reducer({ _window, id, object, path, value, params, _, e, req, res  })
  else if (path[0].includes("_array") || path[0].includes("_map")) value = reducer({ _window, id, e, path, params, object, _, req, res })
  else if (value === "()") value = local
  else if (value === "global()" || value === ")(") value = _window ? _window.global : window.global
  else if (typeof value === "boolean") {}
  else if (!isNaN(value)) value = parseFloat(value)
  else if (value === undefined || value === "generate") value = generate()
  else if (value === "e()" || value === "event()") value = e
  else if (value === "today()") value = new Date()
  else if (value === "keys()") value = Object.keys(value)
  else if (value === "values()") value = Object.values(value)
  else if (value === "undefined") value = undefined
  else if (value === "false") value = false
  else if (value === "true") value = true
  else if (value === "_") value = _

  return value
}

module.exports = { toValue }
