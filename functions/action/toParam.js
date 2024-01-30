const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { replaceNbsps } = require("./replaceNbsps")
const { isCondition } = require("./isCondition")
const { lineInterpreter } = require("./lineInterpreter")
const { isEvent } = require("./isEvent")
const { override } = require("./merge")
const { toEvent } = require("./toEvent")
const { kernel } = require("./kernel")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, lookupActions, stack = {}, data: string, e, id = "root", req, res, mount, object, __, toView, executer, condition }) => {

  const { toAction } = require("./toAction")
  const { toApproval } = require("./toApproval")

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var params = object || {}
  
  // returned
  if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.broke || stack.returned) return

  if (typeof string !== "string" || !string) return string || {}

  // decode
  if (string.charAt(0) === "@" && string.length == 6 && global.__refs__[string].type === "text") return global.__refs__[string].data
  if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data

  if (string.split("?").length > 1) {

    // check if event
    if (isEvent({ _window, string })) return toEvent({ _window, string, id, __, lookupActions })

    // line interpreter
    return lineInterpreter({ _window, lookupActions, stack, id, e, data: {string, action: "toParam"}, req, res, mount, __, condition, object, toView }).data
  }

  // conditions
  if (condition || isCondition({ _window, string })) return toApproval({ id, lookupActions, stack, e, data: string, req, res, _window, __, object })

  string.split(";").map(param => {
    
    // no param || returned || comment
    if (!param || (stack.returns && stack.returns[0] || {}).returned || param.charAt(0) === "#" || stack.terminated || stack.broke || stack.returned) return
    
    var key, value
    var view = views[id]

    // =
    if (param.includes("=")) {

      key = param.split("=")[0]
      value = param.substring(key.length + 1)

    } else key = param

    // key = key1 = ... = value
    if (value && value.includes("=")) {
      value = param.split("=").at(-1)
      param = param.slice(0, lastValue.length * (-1) - 1)
      var newParam = key + "=" + value
      param.split("=").slice(1).map(key => { newParam += ";" + key + "=" + value })
      return params = { ...params, ...toParam({ _window, lookupActions, stack, data: param, e, id, req, res, mount, object, __, toView, executer, condition }) }
    }

    // increment
    if (key && value === undefined && key.slice(-2) === "++") {
      key = key.slice(0, -2)
      value = parseFloat(toValue({ _window, lookupActions, stack, req, res, id, e, data: key, __, condition, object }) || 0) + 1
    }

    // decrement
    else if (key && value === undefined && key.slice(-2) === "--") {
      key = key.slice(0, -2)
      value = parseFloat(toValue({ _window, lookupActions, stack, req, res, id, e, data: key, __, condition, object }) || 0) - 1
    }

    // ||=
    else if (key && value && key.slice(-2) === "||") {
      key = key.slice(0, -2)
      value = `${key}||${value}`
    }

    // +=
    else if (key && value && key.slice(-1) === "+") {

      key = key.slice(0, -1)
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      var data = toCode({ _window, id, string: `[${myVal}||[if():[type():[${value}]=number]:0.elif():[type():[${value}]=map]:[].elif():[type():[${value}]=list]:[:]:]]` })
      value = `${data}+${value}`
    }

    // -=
    else if (key && value && key.slice(-1) === "-") {

      key = key.slice(0, -1)
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      var data = toCode({ _window, id, string: `[${myVal}||0]` })
      var data1 = toCode({ _window, id, string: `[${value}||0]` })
      value = `${data}-${data1}`
    }

    // *=
    else if (key && value && key.slice(-1) === "*") {

      key = key.slice(0, -1)
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      var data = toCode({ _window, id, string: `[${myVal}||0]` })
      value = `${data}*${value}`
    }

    // !key
    if (param.slice(0, 1) === "!" && value === undefined) {
      value = false
      key = key.slice(1)
    }

    // show loader
    if (param === "loader.show") {
      if (_window || !document.getElementById("loader-container")) return
      document.getElementById("loader-container").style.display = "flex"
      return sleep(30)
    }
    
    // hide loader
    if (param === "loader.hide") {
      if (_window || !document.getElementById("loader-container")) return
      document.getElementById("loader-container").style.display = "none"
      return sleep(20)
    }

    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0]

    // .value => inherit object
    var inheritObject = false
    if (typeof value === "string" && value.charAt(0) === "." && (value.includes("()") || isNaN(value.charAt(1)))) inheritObject = true

    // interpret value
    if (typeof value === "string") {

      value = toValue({ _window, lookupActions, stack, req, res, id, e, data: value, __, condition, object: inheritObject ? object : undefined, isValue: true })
      if (value && typeof value === "string") value = replaceNbsps(value)

    } else if (value === undefined) value = generate()
    
    // :@1asd1
    if (path0 === "") return

    // action()
    if (path0.slice(-2) === "()") {
      var action = toAction({ _window, lookupActions, stack, id, req, res, __, e, path, path0, condition, mount, toView, executer, object })
      if (action !== "__continue__") {
        if (typeof action === "object") override(params, action)
        return action
      }
    }
    
    // interpret key
    if (path.length > 1 || path[0].includes("()") || object  || path[0].includes("@")) {
      
      var dataPath
      if (toView && params.path) {
        dataPath = clone(params.path)
        delete params.path
      }
      
      // interpret key
      if ((path[0].includes("()") && (path0.slice(-2) === "()")) || path[0].slice(-3) === ":()"  || path[0].includes("_") || object) {
        
        reducer({ _window, lookupActions, stack, id, data: { path, value, key, object }, e, req, res, __, mount, toView, condition })

      } else {

        mount
        ? reducer({ _window, lookupActions, stack, id, data: { path, value, key, object: view }, e, req, res, __, mount, toView, condition })
        : reducer({ _window, lookupActions, stack, id, data: { path, value, key, object: params }, e, req, res, __, mount, toView, condition })
      }

      if (!params.path && dataPath !== undefined) params.path = dataPath
      
    } else if (key) {
      
      if (key === "_" && __[0]) return __[0] = value
      if (id && view && mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// path & data & doc ///////////////////////////////////////////////

    if (mount && toView) {

      // mount data directly when found
      if (key === "doc" || key === "data") {

        view.__dataPath__ = []
        view.doc = view.doc || generate()
        global[view.doc] = view.data = global[view.doc] || {}
      }
    
      // mount path directly when found
      else if (key === "path" && params.path.toString().charAt(0) !== "/") {

        var dataPath = params.path

        // setup doc
        if (!view.doc) {

          view.doc = generate()
          global[view.doc] = view.data || {}
        }
        
        // list path
        var myPath = (typeof dataPath === "string" || typeof dataPath === "number") ? dataPath.toString().split(".") : dataPath || []
        
        // push path to __dataPath__
        view.__dataPath__.push(...myPath)
        view.data = kernel({ _window, id, stack, lookupActions, data: { path: view.__dataPath__, _object: global[view.doc], value: view.data, key: true } })
      }
    }
  })

  return params
}

module.exports = { toParam }