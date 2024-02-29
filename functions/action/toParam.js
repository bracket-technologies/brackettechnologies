const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { replaceNbsps } = require("./replaceNbsps")
const { isCondition } = require("./isCondition")
const { toLine } = require("./toLine")
const { isEvent } = require("./isEvent")
const { override } = require("./merge")
const { toEvent } = require("./toEvent")
const { kernel } = require("./kernel")
const { decode } = require("./decode")

const toParam = ({ _window, lookupActions, stack = {}, data: string, e, id, req, res, mount, object, __, condition }) => {

  const { toAction } = require("./toAction")
  const { toApproval } = require("./toApproval")

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  var view = views[id] || { id, __view__:true }

  var params = object || {}

  // returned
  if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.broke || stack.blocked) return

  if (typeof string !== "string" || !string) return string || {}

  // decode
  if (string.charAt(0) === "@" && string.length == 6 && global.__refs__[string].type === "text") return global.__refs__[string].data
  if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data

  // check event else interpret
  if (string.split("?").length > 1) {

    // check if event
    if (isEvent({ _window, string })) return toEvent({ _window, string, id, __, lookupActions })

    // line interpreter
    return toLine({ _window, lookupActions, stack, id, e, data: { string }, req, res, mount, __, condition, object, action: "toParam" }).data
  }

  // conditions
  if (condition || isCondition({ _window, string })) return toApproval({ id, lookupActions, stack, e, data: string, req, res, _window, __, object })

  string.split(";").map(param => {

    // case id was changed during rendering
    id = view.id

    // no param || returned || comment
    if (!param || (stack.returns && stack.returns[0] || {}).returned || param.charAt(0) === "#" || stack.terminated || stack.broke || stack.blocked) return

    var key, value

    // =
    if (param.includes("=")) {

      key = param.split("=")[0]
      value = param.substring(key.length + 1)

    } else key = param

    // key = key1 = ... = value
    if (value && value.includes("=")) {

      value = param.split("=").at(-1)
      param = param.slice(0, value.length * (-1) - 1)

      var newParam = key + "=" + value
      param.split("=").slice(1).map(key => { newParam += ";" + key + "=" + value })
      return params = { ...params, ...toParam({ _window, lookupActions, stack, data: param, e, id, req, res, mount, object, __, condition }) }
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
      var myVal = (key.slice(0, 2) === "()" || key.slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
      var data = `[${myVal}||[if():[type():[${value}]=number]:0.elif():[type():[${value}]=map]:[].elif():[type():[${value}]=list]:[:]:'']]`
      data = toCode({ _window, id, string: toCode({ _window, id, string: data, start: "'" }) })
      value = `${data}+${value}`
    }

    // -=
    else if (key && value && key.slice(-1) === "-") {

      key = key.slice(0, -1)
      var myVal = (key.slice(0, 2) === "()" || key.slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
      var data = toCode({ _window, id, string: `[${myVal}||0]` })
      var data1 = toCode({ _window, id, string: `[${value}||0]` })
      value = `${data}-${data1}`
    }

    // *=
    else if (key && value && key.slice(-1) === "*") {

      key = key.slice(0, -1)
      var myVal = (key.slice(0, 2) === "()" || key.slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
      var data = toCode({ _window, id, string: `[${myVal}||0]` })
      value = `${data}*${value}`
    }

    // !key
    if (param.slice(0, 1) === "!" && value === undefined) {
      value = false
      key = key.slice(1)
    }

    // show loader
    if (param === "loader.show" && !_window) {
      if (!document.getElementById("loader-container") || document.getElementById("loader-container").style.display === "flex") return
      document.getElementById("loader-container").style.display = "flex"
      return sleep(30)
    }

    // hide loader
    if (param === "loader.hide" && !_window) {
      if (!document.getElementById("loader-container")) return
      document.getElementById("loader-container").style.display = "none"
      return 
    }

    var path = typeof key === "string" ? key.split(".") : [], args = path[0].split(":"), path0 = path[0].split(":")[0]

    // .value => inherit object
    var inheritObject = false
    if (typeof value === "string" && value.charAt(0) === "." && (value.includes("()") || isNaN(value.charAt(1)))) inheritObject = true

    // interpret value
    if (typeof value === "string") {

      value = toValue({ _window, lookupActions, stack, req, res, id, e, data: value, __, condition, object: inheritObject ? object : undefined, isValue: true, key, param })
      if (value && typeof value === "string") value = replaceNbsps(value)

    } else if (value === undefined) value = generate()

    // :@1asd1
    if (path0 === "") return

    // action()
    if (path0.slice(-2) === "()") {
      var action = toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { action: path[0] }, condition, mount, object })
      if (action !== "__continue__" && typeof action === "object" && !Array.isArray(action)) override(params, action)
      if (action !== "__continue__") return
    }

    // if()
    if (path0 === "if()") {

      var data = {}
      var approved = toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })

      if (!approved) {

        if (args[3]) {

          data = toParam({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object, mount })
          path.shift()

        } else if (path[1] && path[1].includes("elif()")) {

          path.shift()
          path[0] = path[0].slice(2)
          data = toParam({ _window, lookupActions, stack, id, data: path.join("."), __, e, req, res, mount, condition })
        }
        
        if (data) params = override(params, data)
        return data

      } else {

        data = toParam({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount })

        path.shift()

        // remove elses and elifs
        while (path[0] && path[0].includes("elif()")) { path.shift() }

        // empty path
        if (!path[0]) return params = override(params, data)
      }

      return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, data: { data, path, value, key, object, pathJoined: param } })
    } 

    // reduce
    if (path0.slice(-2) === "()" || path[0].slice(-3) === ":()" || path[0].slice(0, 3) === "():" || path[0].includes("_") || object)
      reducer({ _window, lookupActions, stack, id, data: { path, value, key, object }, e, req, res, __, mount, condition, action: "toParam" })
    else kernel({ _window, lookupActions, stack, id, data: { path, value, key, data: (mount ? view : params) }, e, req, res, __, mount, condition, action: "toParam" })

    /////////////////////////////////////////// path & data & doc ///////////////////////////////////////////////

    if (mount) {
      
      // mount data directly when found
      if (key === "doc" || key === "data") {

        view.__dataPath__ = []
        view.doc = view.doc || generate()
        global[view.doc] = view.data = global[view.doc] || {}
      }

      // mount path directly when found
      else if (key === "path" && view.path.toString().charAt(0) !== "/") {

        var dataPath = view.path

        // setup doc
        if (!view.doc) {

          view.doc = generate()
          global[view.doc] = view.data || {}
        }

        // list path
        var myPath = (typeof dataPath === "string" || typeof dataPath === "number") ? dataPath.toString().split(".") : dataPath || []

        // push path to __dataPath__
        view.__dataPath__.push(...myPath)
        view.data = kernel({ _window, id, stack, __, lookupActions, data: { path: view.__dataPath__, data: global[view.doc], value: view.data, key: true } })
      
      } else if (view.id !== id) {
        
        if (views[view.id]) views[view.id] += "_" + generate()
        Object.assign(views, { [view.id]: views[id] })
        id = view.id
      }
    }
  })

  return params
}

const sleep = (milliseconds) => {

  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = { toParam }