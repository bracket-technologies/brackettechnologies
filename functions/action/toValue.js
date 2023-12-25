const { generate } = require("./generate")
const { isParam } = require("./isParam")
const { reducer } = require("./reducer");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, lookupActions = [], stack = {}, data: value, params = {}, __, id, e, req, res, object, _object, mount, toView, condition }) => {

  const { toAction } = require("./toAction")
  const { toParam } = require("./toParam")
  
  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global

  // if ((stack.returns && stack.returns[0] || {}).returned) return
  
  if (!value) return value

  // coded
  if (value.charAt(0) === "@" && value.length == 6 && global.__refs__[value].type === "text") return global.__refs__[value].data
  if (value.charAt(0) === "@" && value.length == 6) value = global.__refs__[value].data

  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, stack, e, data: value, _object, __, object, mount, toView, condition })

  // no value
  if (value === "()") return view
  else if (value === ".") return object !== undefined ? object : view
  else if (value === undefined) return generate()
  else if (value === "undefined") return undefined
  else if (value === "false") return false
  else if (value === "true") return true
  else if (value === "null") return null
  else if (value.charAt(0) === "_" && !value.split("_").find(i => i !== "_" && i !== "")) return __[value.split("_").length - 2] // _ or __ or ___ or ____
  else if (value === "_string") return ""
  else if (value === "[]" || value === "_map") return ({})
  else if (value === ":[]") return ([{}])
  else if (value === " ") return value
  else if (value === ":" || value === "_list") return ([])
  else if (value.charAt(0) === ":") return value.split(":").slice(1).map(item =>  toValue({ req, res, _window, id, stack, lookupActions, __, e, data: item })) // :item1:item2

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

  if (value.includes("||")) { // or
    var answer
    value.split("||").map(value => {
      if (!answer) { // or answer === undefined ?????
        answer = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, mount, condition })
        //console.log(value, answer);
      }
    })
    return answer
  }
  
  if (value.includes("+")) { // addition

    // increment
    if (value.slice(-2) === "++") {
      
      value = value.slice(0, -2)
      value = `${value}=${value}+1`
      toParam({ req, res, _window, lookupActions, id, e, data: value, __, object, mount, params, toView, condition })
      return (toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, mount, condition }) - 1)

    } else {

      var allAreNumbers = true
      var values = value.split("+").map(value => {
        
        var _value = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, mount/*, condition*/ })
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

    var _value = calcSubs({ _window, lookupActions, stack, value, params, __, id, e, req, res, object, condition })
    if (_value !== value) return _value
  }
  
  if (value.includes("*") && value.split("*")[1] !== "") { // multiplication

    var values = value.split("*").map(value => toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, mount, condition }))
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

    var _value = calcDivision({ _window, lookupActions, stack, value, params, __, id, e, req, res, object, condition })
    if (_value !== value && _value !== undefined) return _value
  }
  
  if (value.includes("%") && value.split("%")[1] !== "") { // modulo

    var _value = calcModulo({ _window, lookupActions, stack, value, params, __, id, e, req, res, object, condition })
    if (_value !== value && _value !== undefined) return _value
  }

  if (value === "()") return view

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]

  var path = typeof value === "string" ? value.split(".") : [], path0 = path[0].split(":")[0]

  // action
  if (path0.slice(-2) === "()") {
    var action = toAction({ _window, lookupActions, stack, id, req, res, __, e, path: [path[0]], path0, condition, mount, toView, object })
    if (action !== "__continue__") {
      if (path.length > 1) {
        path.splice(0, 1)
        return reducer({ _window, lookupActions, stack, id, object, data: path, value, __, e, req, res, mount, toView, _object: action })
      }
      else return action
    }
  }
  
  /* value */
  if (!isNaN(value) && !emptySpaces(value) && (value.length > 1 ? value.charAt(0) !== "0" : true)) value = parseFloat(value)
  else if (value === " ") return value
  else if (object || path[0].includes(":") || path[1] || path[0].includes("()") || path[0].includes("@"))
    value = reducer({ _window, lookupActions, stack, id, object, data: path, value, __, e, req, res, mount, toView })
  
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

const calcSubs = ({ _window, lookupActions, stack, value, params, __, id, e, req, res, object, condition }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
        if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
          if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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

const calcDivision = ({ _window, lookupActions, stack, value, params, __, id, e, req, res, object, condition }) => {
  
  if (value.split("/").length > 1) {

    var allAreNumbers = true
    var values = value.split("/").map(value => {
      if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
        if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
          if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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

const calcModulo = ({ _window, lookupActions, stack, value, params, __, id, e, req, res, object, condition }) => {
  
  if (value.split("%").length > 1) {

    var allAreNumbers = true
    var values = value.split("%").map(value => {
      if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
        if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
          if (value.charAt(0) !== "@" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, stack, data: value, params, __, id, e, req, res, object, condition })
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
