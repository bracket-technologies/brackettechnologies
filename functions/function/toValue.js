const { clone } = require("./clone");
const { generate } = require("./generate")
const { isParam } = require("./isParam")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const actions = require("./actions.json")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount, asyncer, createElement, executer }) => {

  const { toParam } = require("./toParam")

  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global
  var _functions = require("./function")

  // no value
  if (!value || value === " ") return value
  
  // break & return
  if (view && (view.break || view.return)) return
  if (view && (view["break()"] || view["return()"])) return
  
  // coded
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  
  // string
  if (value.split("'").length > 1) value = toCode({ _window, string: value, start: "'", end: "'" })
  if (value.includes('codedS()') && value.length === 13) {
    
    if (!object) return global.codes[value]
    else value = global.codes[value]
  }

  // (...)
  var valueParanthes = value.split("()").join("")
  if (valueParanthes.includes("(") && valueParanthes.includes(")") && valueParanthes.split("(").slice(1).find(string => string.split(")")[0] && string.split(")")[0].length > 0 && (string.split(")")[0].includes("-") || string.split(")")[0].includes("+") || string.split(")")[0].includes("*")))) { // (...)
    
    value = toCode({ _window, string: value, e, start: "(", end: ")" })
  }

  // show loader
  if (value === "loader.show") {
    document.getElementsByClassName("loader-container")[0].style.display = "flex"
    return sleep(10)
  }
  
  // hide loader
  if (value === "loader.hide") {
    document.getElementsByClassName("loader-container")[0].style.display = "none"
    return sleep(10)
  }

  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, e, string: value, _, __, ___, _i, object, mount, params, createElement })

  // or
  if (value.includes("||")) {
    var answer
    value.split("||").map(value => {
      if (!answer) answer = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount })
    })
    return answer
  }
  
  if (value.includes("+")) { // addition

    // increment
    if (value.slice(-2) === "++") {
      
      value = value.slice(0, -2)
      value = `${value}=${value}+1`
      toParam({ req, res, _window, id, e, string: value, _, __, ___, _i, object, mount, params, createElement })

    } else {

      var values = value.split("+").map(value => toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount }))
      var newVal = values[0]
      values.slice(1).map(val => newVal += val)
      return value = newVal
    }
  }
  
  if (value.includes("-")) { // subtraction

    var _value = calcSubs({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
    if (_value !== value) return _value
  }
  
  if (value.includes("*")) { // multiplication

    var values = value.split("*").map(value => toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount }))
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
  
  if (value.includes("/")) { // division

    var _value = calcDivision({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
    if (_value !== value) return _value
  }

  if (value === "()") return view

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  // string
  // if (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") return value = value.slice(1, -1)

  var path = typeof value === "string" ? value.split(".") : [], isFn = false, backendFn = false, path0 = path[0].split(":")[0]
  
  // function
  if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

    view && clone(view["my-views"] || []).reverse().map(view => {
      if (!isFn) {
        isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
        if (isFn) {
          isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn], start: "'", end: "'" })
          isFn = toCode({ _window, id, string: isFn })
        }
      }
    })
      
    // global functions
    if (!isFn) {
      isFn = Object.keys(global.openFunctions || {}).find(fn => fn === path0.slice(0, -2))
      if (isFn) {
        isFn = toCode({ _window, id, string: (global.openFunctions)[isFn] })
        isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })
      }
    }

    // backend function
    if (!isFn) {
      isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
      if (isFn) backendFn = true
    }
  }
  
  if (isFn) {
    var _params = path[0].split(":")[1], args = path[0].split(":")

    if (backendFn) {
      
      if (isParam({ _window, string: args[1] })) {

        var _await = ""
        var _data = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
        
        return require("./func").func({ _window, id, e, _, __, ___, _i, req, res, func: _func, asyncer: true, await: _await })
      }
      
      var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
      var _func = { function: isFn, data: _data }
      if (args[2]) _await = global.codes[args[2]]

      return require("./func").func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
    }

    if (_params) {
      if (isParam({ _window, string: _params }))
        _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: _params })
      else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
    }
    return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i, asyncer, createElement, params, executer })
  }
  // if (isFn) return toParam({ req, res, _window, id, e, string: isFn, _, __, ___, _i, object, mount, params, createElement })

  /* value */
  if (!isNaN(value) && value !== " " && (value.length > 1 ? value.toString().charAt(0) !== "0" : true)) value = parseFloat(value)
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
  else if (object) {
    //value = value + ".clone()"
    value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  } else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  else if (path[0].includes("()") && path.length === 1) {

    var val0 = value.split("coded()")[0]
    if (value.includes('coded()') && !val0.includes("()") && !val0.includes("_map") && !val0.includes("_array") && !val0.includes("_list")) {

      value.split("coded()").slice(1).map(val => {
        val0 += toValue({ _window, value: global.codes[`coded()${val.slice(0, 5)}`], params, _, __, ___, _i, id, e, req, res, object, mount })
        val0 += val.slice(5)
      })
      value = val0

    } else value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  } else if (path[1] || path[0].includes(")(") || path[0].includes("()")) value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  else if (path[0].includes("_array") || path[0].includes("_map") || path[0].includes("_list")) value = reducer({ _window, id, e, path, params, object, _, __, ___, _i, req, res, mount })
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
    var key = toValue({ _window, value: args[0], params, _, __, ___, _i, id, e, req, res, object, mount })

    value = args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: key, e, req, res, _, __, ___, _i, mount }))
  } 

  // _string
  else if (value === "_string") return ""
  return value
}

const calcSubs = ({ _window, value, params, _, __, ___, _i, id, e, req, res, object }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
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
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
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
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
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

const calcDivision = ({ _window, value, params, _, __, ___, _i, id, e, req, res, object }) => {
  
  if (value.split("/").length > 1) {

    var allAreNumbers = true
    var values = value.split("/").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
        if (typeof num !== "number" || num === "") allAreNumbers = false
        return num
      }
    })
    
    if (allAreNumbers) {

      value = values[0]
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
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
          if (typeof num !== "number" || num === "") allAreNumbers = false
          return num
        }
      })

      if (allAreNumbers) {

        value = values[0]
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
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
            if (typeof num !== "number" || num === "") allAreNumbers = false
            return num
          }
        })

        if (allAreNumbers) {

          value = values[0]
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

module.exports = { toValue, calcSubs, calcDivision }
