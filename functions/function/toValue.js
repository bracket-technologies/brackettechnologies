const { generate } = require("./generate")
const { reducer } = require("./reducer")

const toValue = ({ _window, value, params, _, id, e, req, res, object }) => {

  const { toApproval } = require("./toApproval")
  const { toParam } = require("./toParam")

  var local = _window ? _window.value[id] : window.value[id]
  var global = _window ? _window.global : window.global

  if (!value) return value

  // value is a param it has key=value
  if (value.includes("=") || value.includes(";")) return toParam({ req, res, _window, id, e, string: value, _, object })

  // coded
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]

  // conditions
  if (value.includes("<<")) {

    var condition = value.split("<<")[1]
    var approved = toApproval({ _window, id, e, string: condition, _, req, res })
    if (!approved) return "*return*"
    value = value.split("<<")[0]
  }

  // addition
  if (value.includes("+")) {

    var values = value.split("+").map(value => toValue({ _window, value, params, _, id, e, req, res, object }))
    var newVal = values[0]
    values.slice(1).map(val => newVal += val)
    return value = newVal
    
  } else if (value.includes("-")) {

    var allAreNumbers = true
      var values = value.split("-").map(value => {

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, id, e, req, res, object })
          if (isNaN(num) || num === "") allAreNumbers = false
          return num
        }
      })
      
      if (allAreNumbers) {
        value = values[0]
        values.slice(1).map(val => value -= val)
        console.log(value);
        return value
      }

  }
  
  if (value.split("const.")[1] !== undefined && !value.split("const.")[0]) return value.split("const.")[1]

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  var path = typeof value === "string" ? value.split(".") : []
  
  /* value */
  if (value === "global()" || value === ")(") value = _window ? _window.global : window.global
  else if (object) value = reducer({ _window, id, object, path, value, params, _, e, req, res })
  else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, e, req, res  })
  else if ((path[0].includes("()")) && path.length === 1) {

    var val0 = value.split("coded()")[0]
    if (value.includes('coded()') && !val0.includes("()") && !val0.includes("_map") && !val0.includes("_array") && !val0.includes("_arr")) {
    
      value.split("coded()").slice(1).map(val => {
        val0 += toValue({ _window, value: global.codes[`coded()${val.slice(0, 5)}`], params, _, id, e, req, res, object })
        val0 += val.slice(5)
      })
      value = val0
      
    } else value = reducer({ _window, id, e, path, params, object, _, req, res })
  } else if (path[1] || path[0].includes(")(")) value = reducer({ _window, id, object, path, value, params, _, e, req, res  })
  else if (path[0].includes("_array") || path[0].includes("_map")) value = reducer({ _window, id, e, path, params, object, _, req, res })
  else if (value === "()") value = local
  else if (typeof value === "boolean") {}
  else if (!isNaN(value) && value !== " ") value = parseFloat(value)
  else if (value === undefined || value === "generate") value = generate()
  else if (value === "e()" || value === "event()") value = e
  else if (value === "today()") value = new Date()
  else if (value === "keys()") value = Object.keys(value)
  else if (value === "values()") value = Object.values(value)
  else if (value === "undefined") value = undefined
  else if (value === "false") value = false
  else if (value === "true") value = true
  else if (value === "_") value = _
  else if (value.includes(":") && value.split(":")[1].slice(0, 7) === "coded()") {
        
    var args = value.split(":")
    var key = args[0]

    value = args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: key, e, req, res, _ }))

  }

  // _string
  else if (value === "_string") return ""
/*
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
*/
  return value
}

module.exports = { toValue }
