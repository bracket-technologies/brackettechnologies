const { decode } = require("./decode");
const { executable } = require("./executable");
const { generate } = require("./generate")
const { isParam } = require("./isParam");
const { lineInterpreter } = require("./lineInterpreter");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, lookupActions = [], stack = {}, data: value, __, id, e, req, res, object, mount, toView, condition, isValue }) => {

  const { reducer } = require("./reducer")
  const { toParam } = require("./toParam")
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  
  if (!value) return value

  // coded
  if (value.charAt(0) === "@" && value.length == 6 && global.__refs__[value].type === "text") return global.__refs__[value].data
  if (value.charAt(0) === "@" && value.length == 6) value = global.__refs__[value].data

  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, stack, e, data: value, __, object, mount: !isValue && mount, toView, condition })

  // value?condition?value
  if (value.split("?").length > 1) return lineInterpreter({ _window, lookupActions, stack, id, e, data: {string: value}, req, res, mount, __, condition, object, toView, action: "toValue" }).data

  // no value
  if (value === "()") return views[id]
  else if (value === ".") return object !== undefined ? object : views[id]
  else if (value === undefined) return generate()
  else if (value === "undefined") return undefined
  else if (value === "false") return false
  else if (value === "true") return true
  else if (value === "device()") return global.manifest.device.device
  else if (value === "desktop()") return global.manifest.device.device.type === "desktop"
  else if (value === "tablet()") return global.manifest.device.device.type === "tablet"
  else if (value === "mobile()") return global.manifest.device.device.type === "smartphone"
  else if (value === "tv()") return global.manifest.device.device.type === "tv"
  else if (value === "clicked()") return global.__clicked__
  else if (value === "mouseentered()") return global.__mouseentered__
  else if (value === "mouseleaved()") return global.__mouseleaved__
  else if (value === "focused()") return global.__focused__
  else if (value === "today()") return new Date()
  else if (value === "null") return null
  else if (value.charAt(0) === "_" && !value.split("_").find(i => i !== "_" && i !== "")) return __[value.split("_").length - 2]
  else if (value === "[]") return ({})
  else if (value === ":[]") return ([{}])
  else if (value === " ") return value
  else if (value === ":") return ([])
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
      if (!answer) {
        answer = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount, condition })
      }
    })
    return answer
  }
  
  // calculations
  if (global.__calcTests__[value] !== false) {

    if (value.includes("+")) { // addition

      // increment
      if (value.slice(-2) === "++") {
        
        value = value.slice(0, -2)
        value = `${value}=${value}+1`
        toParam({ req, res, _window, lookupActions, id, e, data: value, __, object, mount, toView, condition })
        return (toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount, condition }) - 1)

      } else {

        var allAreNumbers = true, allAreArrays = true, allAreObjects = true
        var values = value.split("+").map(value => {
          
          var _value = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount })
          
          if (allAreNumbers) {

            allAreArrays = false
            allAreObjects = false
            if (isNumber(value) || (executable({ _window, string: value }) && typeof _value === "number")) allAreNumbers = true
            else allAreNumbers = false

          } else if (allAreArrays) {

            allAreNumbers = false
            allAreObjects = false
            if (Array.isArray(_value)) allAreNumbers = true
            else allAreArrays = false

          } else if (allAreObjects) {
            
            allAreNumbers = false
            allAreArrays = false
            if (typeof _value === "object") allAreNumbers = true
            else allAreObjects = false
          }

          return _value
        })
        
        if (allAreNumbers) {

          var value = 0
          values.map(val => value += (parseFloat(val) || 0))
          return value

        } else if (allAreArrays) {

          var array = []
          values.map(arr => array = array.concat(arr))
          return array

        } else if (allAreObjects) {

          var object = {}
          values.map(obj => object = { ...object, ...obj })
          return object

        } else {
          
          var value = ""
          values.map(val => value += val + "")
          return value
        }
      }
    }
    
    if (value.includes("-")) { // subtraction

      var _value = calcSubs({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition })
      if (_value !== value) return _value
    }
    
    if (value.includes("*") && value.split("*")[1] !== "") { // multiplication

      var values = value.split("*").map(value => toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount, condition }))
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

      var _value = calcDivision({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition })
      if (_value !== value && _value !== undefined) return _value
    }
    
    if (value.includes("%") && value.split("%")[1] !== "") { // modulo

      var _value = calcModulo({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition })
      if (_value !== value && _value !== undefined) return _value
    }
  }

  var path = typeof value === "string" ? value.split(".") : []
  
  /* value */
  if (isNumber(value)) value = parseFloat(value)
  else if (object || path[0].includes(":") || path[0].includes("()") || path[0].includes("@") || path[1])
    value = reducer({ _window, lookupActions, stack, id, data: { path, value, object }, __, e, req, res, mount, toView })

  return value
}

const isNumber = (value) => {
  return !isNaN(value) && !emptySpaces(value)
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

const calcSubs = ({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index = 1 }) => {
  
  var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
  if (value.split("-").length > index) {

    var _value = value.split("-").slice(0, index).join("-")
    var _values = value.split("-").slice(index)
    _values.unshift(_value)

    var values = _values.map(value => {

      if (!allAreNumbers) return
      if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

      if (allAreNumbers) {

        var num = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => value -= parseFloat(val))
      global.__calcTests__[test] = true

    } else value = calcSubs({ _window, lookupActions, stack, value, __, id, e, req, res, object: value.charAt(0) === "." && object, condition, index: index + 1 })
    
  } else return value
  
  if (value === test) global.__calcTests__[test] = false
  return value
}

const calcDivision = ({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index = 1 }) => {
  
  var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
  if (value.split("/").length > index) {

    var _value = value.split("/").slice(0, index).join("/")
    var _values = value.split("/").slice(index)
    _values.unshift(_value)

    var values = _values.map(value => {

      if (!allAreNumbers) return
      if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object: value.charAt(0) === "." && object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => {
        if (isNumber(value) && isNumber(val)) value /= val
      })

      // push 
      global.__calcTests__[test] = true

    } else calcDivision({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index: index + 1 })
  }
  
  if (value === test) global.__calcTests__[test] = false
  return value
}

const calcModulo = ({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index = 1 }) => {
  
  var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
  if (value.split("%").length > index) {

    var _value = value.split("%").slice(0, index).join("%")
    var _values = value.split("%").slice(index)
    _values.unshift(_value)

    var values = _values.map(value => {
      
      if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object: value.charAt(0) === "." ? object : undefined, condition })

        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })

    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => value %= val)

      global.__calcTests__[test] = true

    } else value = calcModulo({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index: index + 1 })
  }
  
  if (value === test) global.__calcTests__[test] = false
  return value
}

module.exports = { toValue, calcSubs, calcDivision, calcModulo, emptySpaces, isNumber }
