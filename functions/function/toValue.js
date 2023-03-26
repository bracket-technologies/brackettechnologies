const { clone } = require("./clone");
const { generate } = require("./generate")
const { isParam } = require("./isParam")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, lookupActions, awaits, value, params = {}, _, __, ___, id, e, req, res, object, mount, asyncer, toView, executer, condition }) => {

  const { toFunction } = require("./toFunction")
  const { toParam } = require("./toParam")

  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global
  
  if (!value || value === " ") return value
  
  // coded
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]

  // no value
  else if (value === "()") return view
  else if (value === undefined) return generate()
  else if (value === "undefined") return undefined
  else if (value === "false") return false
  else if (value === "true") return true
  else if (value === "null") return null
  else if (value === "_") return _
  else if (value === "__") return __
  else if (value === "___") return ___
  else if (value === "_string") return ""
  
  // break & return
  if (params && params["return()"] !== undefined) return params["return()"]
  if (params["break()"]) return params
  
  // string
  if (value.split("'").length > 1) value = toCode({ _window, lookupActions, awaits, string: value, start: "'", end: "'" })
  while (value.includes('codedS()') && value.length === 13) {
    
    if (!object) return global.codes[value]
    else value = global.codes[value]
  }

  // create function: coded()xxxxx() => [params that inherited function attributes in underscore]()
  /*if (value.slice(0, 7) === 'coded()' && value.length === 14 && value.slice(-2) === "()") value = "function():" + value.slice(0, 12)
    
  // promise: coded()xxxxx:coded()xxxxx => promise():[]:[]
  else if (value.length === 25 && value.split("coded()") === 2 && value.slice(0, 7) === 'coded()') value = "promise():" + value*/

  // (...)
  /*var valueParanthes = value.split("()").join("")
  if (valueParanthes.includes("(") && valueParanthes.includes(")") && valueParanthes.split("(").slice(1).find(string => string.split(")")[0] && string.split(")")[0].length > 0 && (string.split(")")[0].includes("-") || string.split(")")[0].includes("+") || string.split(")")[0].includes("*")))) { // (...)
    
    value = toCode({ _window, lookupActions, awaits, string: value, e, start: "(", end: ")" })
  }*/

  // show loader
  if (value === "loader.show") {
    document.getElementById("loader-container").style.display = "flex"
    return sleep(10)
  }
  
  // hide loader
  if (value === "loader.hide") {
    document.getElementById("loader-container").style.display = "none"
    return sleep(10)
  }
  
  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, awaits, e, string: value, _, __, ___, object, mount, params, toView, condition })

  // or
  if (value.includes("||")) {
    var answer
    value.split("||").map(value => {
      if (answer === undefined) answer = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, mount, condition })
    })
    return answer
  }
  
  if (value.includes("+")) { // addition

    // increment
    if (value.slice(-2) === "++") {
      
      value = value.slice(0, -2)
      value = `${value}=${value}+1`
      toParam({ req, res, _window, lookupActions, id, e, string: value, _, __, ___, object, mount, params, toView, condition })
      return (toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, mount, condition }) - 1)

    } else {

      var allAreNumbers = true
      var values = value.split("+").map(value => {
        var _value = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, mount, condition })
        if (allAreNumbers) {
          if (!isNaN(_value) && !emptySpaces(_value)) allAreNumbers = true
          else allAreNumbers = false
        }
        return _value
      })
      
      if (allAreNumbers) {
        var newVal = parseFloat(values[0]) || 0
        values.slice(1).map(val => newVal += (parseFloat(val) || 0))
      } else {
        var newVal = values[0]
        values.slice(1).map(val => newVal += val)
      }
      return value = newVal
    }
  }
  
  if (value.includes("-")) { // subtraction

    var _value = calcSubs({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
    if (_value !== value) return _value
  }
  
  if (value.includes("*") && value.split("*")[1] !== "") { // multiplication

    var values = value.split("*").map(value => toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, mount, condition }))
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
  
  if (value.includes("/") && value.split("/")[1] !== "") { // division

    var _value = calcDivision({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
    if (_value !== value && _value !== undefined) return _value
  }
  
  if (value.includes("%") && value.split("%")[1] !== "") { // modulo

    var _value = calcModulo({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
    if (_value !== value && _value !== undefined) return _value
  }

  if (value === "()") return view

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  // string
  // if (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") return value = value.slice(1, -1)

  var path = typeof value === "string" ? value.split(".") : [], path0 = path[0].split(":")[0]
  
  // function
  var isFn = toFunction({ _window, lookupActions, awaits, id, req, res, _, __, ___, e, path, path0, condition, mount, asyncer, toView, executer, object })
  if (isFn !== "__CONTINUE__") return isFn

  /* value */
  if (!isNaN(value) && !emptySpaces(value) && (value.toString().length > 1 ? value.toString().charAt(0) !== "0" : true)) value = parseFloat(value)
  else if (value === " ") return value
  else if (value.slice(3, 10) === "coded()" && value.slice(0, 3) === "min") value = "min(" + global.codes[value.slice(3, 15)] + ")"
  else if (value.slice(3, 10) === "coded()" && value.slice(0, 3) === "max") value = "max(" + global.codes[value.slice(3, 15)] + ")"
  else if (value.slice(4, 11) === "coded()" && value.slice(0, 4) === "calc") value = "calc(" + global.codes[value.slice(4, 16)] + ")"
  else if (value.slice(5, 12) === "coded()" && value.slice(0, 5) === "clamp") value = "clamp(" + global.codes[value.slice(5, 17)] + ")"
  else if (value.slice(5, 12) === "coded()" && value.slice(0, 5) === "scale") value = "scale(" + global.codes[value.slice(5, 17)] + ")"
  else if (value.slice(6, 13) === "coded()" && value.slice(0, 6) === "rotate") value = "rotate(" + global.codes[value.slice(6, 18)] + ")"
  else if (value.slice(9, 16) === "coded()" && value.slice(0, 9) === "translate") value = "translate(" + global.codes[value.slice(9, 21)] + ")"
  else if (value.slice(10, 17) === "coded()" && value.slice(0, 10) === "translateX") value = "translateX(" + global.codes[value.slice(10, 22)] + ")"
  else if (value.slice(10, 17) === "coded()" && value.slice(0, 10) === "translateY") value = "translateY(" + global.codes[value.slice(10, 22)] + ")"
  else if (value.slice(15, 22) === "coded()" && value.slice(0, 15) === "linear-gradient") value = "linear-gradient(" + global.codes[value.slice(15, 27)] + ")"
  else if (object) value = reducer({ _window, lookupActions, awaits, id, object, path, value, params, _, __, ___, e, req, res, mount, condition })
  else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, lookupActions, awaits, id, object, path, value, params, _, __, ___, e, req, res, mount, condition })
  else if (path[0].includes("()") && path.length === 1) {

    var val0 = value.split("coded()")[0]
    if (value.includes('coded()') && !val0.includes("()") && !val0.includes("_map") && !val0.includes("_array") && !val0.includes("_list")) {

      value.split("coded()").slice(1).map(val => {
        val0 += toValue({ _window, lookupActions, awaits, value: global.codes[`coded()${val.slice(0, 5)}`], params, _, __, ___, id, e, req, res, object, mount, condition })
        val0 += val.slice(5)
      })
      value = val0

    } else value = reducer({ _window, lookupActions, awaits, id, object, path, value, params, _, __, ___, e, req, res, mount, condition })
  } else if (path[1] || path[0].includes(")(") || path[0].includes("()")) value = reducer({ _window, lookupActions, awaits, id, object, path, value, params, _, __, ___, e, req, res, mount, condition })
  else if (path[0].includes("_array") || path[0].includes("_map") || path[0].includes("_list")) value = reducer({ _window, lookupActions, awaits, id, e, path, params, object, _, __, ___, req, res, mount, condition })
  else if (value.includes(":") && value.split(":")[1].slice(0, 7) === "coded()") {

    var args = value.split(":")
    var key = toValue({ _window, lookupActions, awaits, value: args[0], params, _, __, ___, id, e, req, res, object, mount, condition })

    value = args.slice(1).map(arg => reducer({ _window, lookupActions, awaits, id, params, path: arg, object: key, e, req, res, _, __, ___, mount, condition }))
  } 

  return value
}

const emptySpaces = (string) => {
  if (typeof string === "string") {
    var empty = true
    while (string.length > 0) {

      if (string.charAt(0) === " ") empty = true
      else empty = false
      string = string.slice(1)
    }
    return empty
  }
  return false
}

const calcSubs = ({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => value -= parseFloat(val))
      // console.log(value);
      return value

    } else if (value.split("-").length > 2) {

      var allAreNumbers = true
      var _value = value.split("-").slice(0, 2).join("-")
      var _values = value.split("-").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
          if (!isNaN(num) && num !== " " && num !== "") return num
          else allAreNumbers = false
        }
      })

      if (allAreNumbers) {

        value = parseFloat(values[0])
        values.slice(1).map(val => value -= parseFloat(val))
        // console.log(value);
        return value
  
      } else if (value.split("-").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("-").slice(0, 3).join("-")
        var _values = value.split("-").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
            if (!isNaN(num) && num !== " " && num !== "") return num
            else allAreNumbers = false
          }
        })

        if (allAreNumbers) {

          value = parseFloat(values[0])
          values.slice(1).map(val => value -= parseFloat(val))
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}

const calcDivision = ({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }) => {
  
  if (value.split("/").length > 1) {

    var allAreNumbers = true
    var values = value.split("/").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => {
        if (!isNaN(value) && !isNaN(val)) value /= val
        else if (isNaN(value) && !isNaN(val)) {
          while (val > 1) {
            value -= value
            val -= 1
          }
        } else if (!isNaN(value) && isNaN(val)) {
          var index = value
          value = val
          while (index > 1) {
            value -= value
            index -= 1
          }
        }
      })
      // console.log(value);
      return value

    } else if (value.split("/").length > 2) {

      var allAreNumbers = true
      var _value = value.split("/").slice(0, 2).join("/")
      var _values = value.split("/").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
          if (!isNaN(num) && num !== " " && num !== "") return num
          else allAreNumbers = false
        }
      })

      if (allAreNumbers) {

        value = parseFloat(values[0])
        values.slice(1).map(val => {
          if (!isNaN(value) && !isNaN(val)) value /= val
          else if (isNaN(value) && !isNaN(val)) {
            while (val > 1) {
              value -= value
              val -= 1
            }
          } else if (!isNaN(value) && isNaN(val)) {
            var index = value
            value = val
            while (index > 1) {
              value -= value
              index -= 1
            }
          }
        })
        // console.log(value);
        return value
  
      } else if (value.split("/").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("/").slice(0, 3).join("/")
        var _values = value.split("/").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
            if (!isNaN(num) && num !== " " && num !== "") return num
            else allAreNumbers = false
          }
        })

        if (allAreNumbers) {

          value = parseFloat(values[0])
          values.slice(1).map(val => {
            if (!isNaN(value) && !isNaN(val)) value /= val
            else if (isNaN(value) && !isNaN(val)) {
              while (val > 1) {
                value -= value
                val -= 1
              }
            } else if (!isNaN(value) && isNaN(val)) {
              var index = value
              value = val
              while (index > 1) {
                value -= value
                index -= 1
              }
            }
          })
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}


const calcModulo = ({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }) => {
  
  if (value.split("%").length > 1) {

    var allAreNumbers = true
    var values = value.split("%").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => {
        if (!isNaN(value) && !isNaN(val)) value %= val
        else if (isNaN(value) && !isNaN(val)) {
          while (val > 1) {
            value -= value
            val -= 1
          }
        } else if (!isNaN(value) && isNaN(val)) {
          var index = value
          value = val
          while (index > 1) {
            value -= value
            index -= 1
          }
        }
      })
      // console.log(value);
      return value

    } else if (value.split("%").length > 2) {

      var allAreNumbers = true
      var _value = value.split("%").slice(0, 2).join("%")
      var _values = value.split("%").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
          if (!isNaN(num) && num !== " " && num !== "") return num
          else allAreNumbers = false
        }
      })

      if (allAreNumbers) {

        value = parseFloat(values[0])
        values.slice(1).map(val => {
          if (!isNaN(value) && !isNaN(val)) value %= val
          else if (isNaN(value) && !isNaN(val)) {
            while (val > 1) {
              value -= value
              val -= 1
            }
          } else if (!isNaN(value) && isNaN(val)) {
            var index = value
            value = val
            while (index > 1) {
              value -= value
              index -= 1
            }
          }
        })
        // console.log(value);
        return value
  
      } else if (value.split("%").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("%").slice(0, 3).join("%")
        var _values = value.split("%").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, awaits, value, params, _, __, ___, id, e, req, res, object, condition })
            if (!isNaN(num) && num !== " " && num !== "") return num
            else allAreNumbers = false
          }
        })

        if (allAreNumbers) {

          value = parseFloat(values[0])
          values.slice(1).map(val => {
            if (!isNaN(value) && !isNaN(val)) value %= val
            else if (isNaN(value) && !isNaN(val)) {
              while (val > 1) {
                value -= value
                val -= 1
              }
            } else if (!isNaN(value) && isNaN(val)) {
              var index = value
              value = val
              while (index > 1) {
                value -= value
                index -= 1
              }
            }
          })
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}

module.exports = { toValue, calcSubs, calcDivision, calcModulo, emptySpaces }
