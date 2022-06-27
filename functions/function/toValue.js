const { generate } = require("./generate")
const { isParam } = require("./isParam")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")

const toValue = ({ _window, value, params, _, __, id, e, req, res, object, mount }) => {

  const { toParam } = require("./toParam")

  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global

  // no value
  if (!value) return value

  // coded
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  
  // string
  if (value.split("'").length > 1) value = toCode({ _window, string: value, start: "'", end: "'" })
  if (value.includes('codedS()') && value.length === 13) return value = global.codes[value]

  // (...)
  var valueParanthes = value.split("()").join("")
  if (valueParanthes.includes("(") && valueParanthes.includes(")") && valueParanthes.split("(").slice(1).find(string => string.split(")")[0] && string.split(")")[0].length > 0 && (string.split(")")[0].includes("-") || string.split(")")[0].includes("+") || string.split(")")[0].includes("*")))) { // (...)
    
    value = toCode({ _window, string: value, e, start: "(", end: ")" })
  } 
  
  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, e, string: value, _, __, object, mount, params })

  // or
  if (value.includes("||")) {
    var answer
    value.split("||").map(value => {
      if (!answer) answer = toValue({ _window, value, params, _, __, id, e, req, res, object, mount })
    })
    return answer
  }
  
  if (value.includes("+")) { // addition
    
    var values = value.split("+").map(value => toValue({ _window, value, params, _, __, id, e, req, res, object, mount }))
    var newVal = values[0]
    values.slice(1).map(val => newVal += val)
    return value = newVal

  } else if (value.includes("-")) { // subtraction

    var _value = calcSubs({ _window, value, params, _, __, id, e, req, res, object })
    if (_value !== value) return _value

  } else if (value.includes("*")) { // multiplication

    var values = value.split("*").map(value => toValue({ _window, value, params, _, __, id, e, req, res, object, mount }))
    var newVal = values[0]
    values.slice(1).map(val => {
      if (!isNaN(newVal) && !isNaN(val)) newVal *= val
      else if (isNaN(newVal) && !isNaN(val)) {
        while (val > 1) {
          newVal += newVal
          val -= 1
        }
      } else if (!isNaN(newVal) && isNaN(val)) {
        var index = newVal
        newVal = val
        while (index > 1) {
          newVal += newVal
          index -= 1
        }
      }
    })
    return value = newVal
  } 

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  // string
  // if (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") return value = value.slice(1, -1)

  var path = typeof value === "string" ? value.split(".") : []

  /* value */
  if (!isNaN(value) && value !== " ") value = parseFloat(value)
  else if (value === " ") return value
  else if (value.slice(4, 11) === "coded()" && value.slice(0, 4) === "calc") value = "calc(" + global.codes[value.slice(4, 16)] + ")"
  else if (value.slice(5, 12) === "coded()" && value.slice(0, 5) === "scale") value = "scale(" + global.codes[value.slice(5, 17)] + ")"
  else if (value.slice(6, 13) === "coded()" && value.slice(0, 6) === "rotate") value = "rotate(" + global.codes[value.slice(6, 18)] + ")"
  else if (value.slice(9, 16) === "coded()" && value.slice(0, 9) === "translate") value = "translate(" + global.codes[value.slice(9, 21)] + ")"
  else if (value.slice(10, 17) === "coded()" && value.slice(0, 10) === "translateX") value = "translateX(" + global.codes[value.slice(10, 22)] + ")"
  else if (value.slice(10, 17) === "coded()" && value.slice(0, 10) === "translateY") value = "translateY(" + global.codes[value.slice(10, 22)] + ")"
  else if (value === ")(" || value === ":()") value = _window ? _window.global : window.global
  else if (object) value = reducer({ _window, id, object, path, value, params, _, __, e, req, res, mount })
  else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, __, e, req, res, mount })
  else if (path[0].includes("()") && path.length === 1) {

    var val0 = value.split("coded()")[0]
    if (value.includes('coded()') && !val0.includes("()") && !val0.includes("_map") && !val0.includes("_array") && !val0.includes("_list")) {

      value.split("coded()").slice(1).map(val => {
        val0 += toValue({ _window, value: global.codes[`coded()${val.slice(0, 5)}`], params, _, __, id, e, req, res, object, mount })
        val0 += val.slice(5)
      })
      value = val0

    } else value = reducer({ _window, id, e, path, params, object, _, __, req, res })
  } else if (path[1] || path[0].includes(")(") || path[0].includes("()")) value = reducer({ _window, id, object, path, value, params, _, __, e, req, res, mount })
  else if (path[0].includes("_array") || path[0].includes("_map") || path[0].includes("_list")) value = reducer({ _window, id, e, path, params, object, _, __, req, res, mount })
  else if (value === "()") value = view
  else if (typeof value === "boolean") { }
  else if (value === undefined || value === "generate") value = generate()
  else if (value === "undefined") value = undefined
  else if (value === "false") value = false
  else if (value === "true") value = true
  else if (value === "null") value = null
  else if (value === "_") value = _
  else if (value.includes(":") && value.split(":")[1].slice(0, 7) === "coded()") {

    var args = value.split(":")
    var key = args[0]

    value = args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: key, e, req, res, _, __, mount }))
  }

  // _string
  else if (value === "_string") return ""
  return value
}

const calcSubs = ({ _window, value, params, _, __, id, e, req, res, object }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : true)) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, value, params, _, __, id, e, req, res, object })
        if (typeof num !== "number" || num === "") allAreNumbers = false
        return num
      }
    })
    
    if (allAreNumbers) {

      value = values[0]
      values.slice(1).map(val => value -= val)
      // console.log(value);
      return value

    } else if (value.split("-").length > 2) {

      var allAreNumbers = true
      var _value = value.split("-").slice(0, 2).join("-")
      var _values = value.split("-").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : true)) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, __, id, e, req, res, object })
          if (typeof num !== "number" || num === "") allAreNumbers = false
          return num
        }
      })

      if (allAreNumbers) {

        value = values[0]
        values.slice(1).map(val => value -= val)
        // console.log(value);
        return value
  
      } else if (value.split("-").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("-").slice(0, 3).join("-")
        var _values = value.split("-").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : true) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, value, params, _, __, id, e, req, res, object })
            if (typeof num !== "number" || num === "") allAreNumbers = false
            return num
          }
        })

        if (allAreNumbers) {

          value = values[0]
          values.slice(1).map(val => value -= val)
          // console.log(value);
          return value
    
        }
      }
    }
  }
  return value
}

module.exports = { toValue, calcSubs }
