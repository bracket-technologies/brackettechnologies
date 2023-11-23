const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const actions = require("./actions.json")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, lookupActions, awaits = [], string, e, id = "root", req, res, mount, object, __, _i, asyncer, toView, params = {}, executer, condition }) => {

  const { toAction } = require("./toAction")
  const { toApproval } = require("./toApproval")
  var _functions = require("./function")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  
  if ((global.__actionReturns__[0] || {}).returned) return

  if (typeof string !== "string" || !string) return string || {}
  params = object || params

  while (string.includes('coded@') && string.length === 11) { string = global.__codes__[string] }
  if (string.includes('codedT@') && string.length === 12) return global.__codes__[string]

  // condition not param
  if (!toView && string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, lookupActions, awaits, e, string: string.replace("==", "="), req, res, _window, __, _i, object })
  // if (toView) _ = views[id]._
  
  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = views[id]
    if (param === "") return
    
    if ((global.__actionReturns__[0] || {}).returned) return

    if (param.charAt(0) === "#") return

    // split
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // increment
    if (key && value === undefined && key.slice(-2) === "++") {
      key = key.slice(0, -2)
      value = parseFloat(toValue({ _window, lookupActions, awaits, req, res, id, e, value: key, params, __, condition, object }) || 0) + 1
    }

    // decrement
    else if (key && value === undefined && key.slice(-2) === "--") {
      key = key.slice(0, -2)
      value = parseFloat(toValue({ _window, lookupActions, awaits, req, res, id, e, value: key, params, __, condition, object }) || 0) - 1
    }

    // ||=
    else if (key && value && key.slice(-2) === "||") {
      key = key.slice(0, -2)
      var _key = generate()
      global.__codes__[`coded@${_key}`] = `${key}||${value}`
      value = `coded@${_key}`
    }

    // +=
    else if (key && value && key.slice(-1) === "+") {

      key = key.slice(0, -1)
      var _key = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      global.__codes__[`coded@${_key}`] = toCode({ _window, string: `${myVal}||[if():[type():[${value}]=number]:0:'']` })
      value = `coded@${_key}+${value}`
      /*global.__codes__[`coded@${_key0}`] = `${value}||0`
      value = `coded@${_key}+coded@${_key0}`*/
    }

    // -=
    else if (key && value && key.slice(-1) === "-") {

      key = key.slice(0, -1)
      var _key = generate(), __key = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      global.__codes__[`coded@${_key}`] = toCode({ _window, string: `${myVal}||0` })
      global.__codes__[`coded@${__key}`] = toCode({ _window, string: `${value}||0` })
      value = `coded@${_key}-coded@${__key}`
      /*global.__codes__[`coded@${_key0}`] = `${value}||0`
      value = `coded@${_key}-coded@${_key0}`*/
    }

    // *=
    else if (key && value && key.slice(-1) === "*") {

      key = key.slice(0, -1)
      var _key = generate(), _key0 = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      global.__codes__[`coded@${_key}`] = `${myVal}||0`
      value = `coded@${_key}*${value}`
      /*global.__codes__[`coded@${_key0}`] = `${value}||0`
      value = `coded@${_key}*coded@${_key0}`*/
    }

    // await
    if ((asyncer || executer) && (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():")) {

      var awaiter = param.split(":").slice(1)
      if (asyncer) {
        if (awaiter[0].slice(0, 6) === "coded@") awaiter[0] = global.__codes__[awaiter[0]]
        var _params = toParam({ _window, lookupActions, awaits, string: awaiter[0], e, id, req, res, mount, __, })
        params = { ...params, ..._params }
        awaiter = awaiter.slice(1)
      }

      params.await = params.await || ""
      if (awaiter[0]) return params.await += `wait():${awaiter.join(":")};`
      else if (awaiter.length === 0) return
    }
    
    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = params.await || ""
      return params.await += `${awaiter};`
    }

    // !attribute ---> attribute = false
    if (param.slice(0, 1) === "!" && value === undefined) {
      value = false
      key = key.slice(1)
    }

    // show loader
    if (!_window && param === "loader.show") {
      document.getElementById("loader-container").style.display = "flex"
      return sleep(20)
    }
    
    // hide loader
    if (!_window && param === "loader.hide") {
      document.getElementById("loader-container").style.display = "none"
      return sleep(20)
    }

    if (toView) {

      // children
      if (param.slice(0, 9) === "children:") {

        var _children = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 6) === "coded@" && param.length === 11) param = global.__codes__[param]
          _children.push({ view: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }

      // children
      if (param.slice(0, 6) === "child:") {

        var _children = []
        param = param.slice(6)
        param.split(":").map(param => {

          if (param.slice(0, 6) === "coded@" && param.length === 11) param = global.__codes__[param]
          _children.push({ view: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }

      // siblings
      if (param.slice(0, 9) === "siblings:") {

        var siblings = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 6) === "coded@" && param.length === 11) param = global.__codes__[param]
          siblings.push({ view: param })
        })

        view.siblings = toArray(view.siblings)
        view.siblings.unshift(...siblings)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }

      // sibling
      if (param.slice(0, 8) === "sibling:") {

        var siblings = []
        param = param.slice(8)
        param.split(":").map(param => {

          if (param.slice(0, 6) === "coded@" && param.length === 11) param = global.__codes__[param]
          siblings.push({ view: param })
        })

        view.siblings = toArray(view.siblings)
        view.siblings.unshift(...siblings)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }
    }

    var path = typeof key === "string" ? key.split(".") : [], isFn = false, i = path[0].split(":").length - 1, path0 = path[0].split(":")[0], pathi = path[0].split(":")[i]

    var sendObject = false
    if (typeof value === "string" && value.charAt(0) === "." && (value.includes("()") || isNaN(value.charAt(1)))) sendObject = true

    if (typeof value === 'string') value = toValue({ _window, lookupActions, awaits, req, res, id, e, value, __, condition, object: sendObject ? object : undefined })
    else if (value === undefined) value = generate()
    
    if (typeof value === "string" && value.includes("&nbsp;")) value = value.replace("&nbsp;", " ")

    id = viewId
    
    // :coded@1asd1
    if (path0 === "" && param.slice(0, 3) !== "...") return

    // function
    if (path0.slice(-2) === "()") {

      var isFn = toAction({ _window, lookupActions, awaits, id, req, res, __, e, path, path0, condition, mount, asyncer, toView, executer, object })
      if (isFn !== "__CONTINUE__") return isFn
      else isFn = false
      
      // field:action()
      if (path[0] && pathi.slice(-2) === "()" && !path0.includes("()") && !path0.includes("coded@") && !_functions[pathi.slice(-2)] && !actions.includes(pathi)) {

        view && clone(view["my-views"] || []).reverse().map(myview => {
          if (!isFn) {
            isFn = Object.keys(global.data[view.viewType][myview] && global.data[view.viewType][myview].functions || {}).find(fn => fn === pathi.slice(0, -2))
            if (isFn) {
              isFn = toCode({ _window, id, string: (global.data[view.viewType][myview].functions || {})[isFn], start: "'", end: "'" })
              isFn = toCode({ _window, id, string: isFn })
            }
          }
        })
        
        // backend functions
        if (!isFn) {
          isFn = (global.functions || []).find(fn => fn === pathi.slice(0, -2))
          if (isFn) backendFn = true
        }
      }

      if (isFn) {

        var _field = path[0].split(":")[0]
        var _key = generate()
        global.__codes__[`coded@${_key}`] = isFn

        return toParam({ _window, lookupActions, awaits, string: `${_field}:coded@${_key}`, e, id, req, res, mount: true, object, __, _i, asyncer, toView, executer })
      }
    }
    
    // object structure
    if (path.length > 1 || path[0].includes("()") || object  || path[0].includes("@")) {
      
      // break
      // if (key === "break()" && value !== false) return view.break = true
      var _path
      if (toView && params.path) {
        _path = clone(params.path)
        delete params.path
      }
      
      // mount state & value
      if ((path[0].includes("()") && (path0.slice(-2) === "()")) || path[0].slice(-3) === ":()"  || /*path[0].includes("@") || */path[0].includes("_") || object) {
        
        reducer({ _window, lookupActions, awaits, id, path, value, key, e, req, res, __, _i, object, mount, toView, condition })

      } else {
        
        if (mount) reducer({ _window, lookupActions, awaits, id, path, value, key, params, e, req, res, __, _i, mount, object: view, toView, condition })
        reducer({ _window, lookupActions, awaits, id, path, value, key, params, e, req, res, __, _i, mount, object, _object: params, toView, condition })
      }
      
      if (!params.path && _path !== undefined) params.path = _path
      
    } else if (key) {
      
      if (key === "_" && __[0]) return __[0] = value
      if (id && view && mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    if (mount && toView) {
      
      if (view && view.doc) view.Data = view.doc
      if (params.doc) params.Data = params.doc

      // mount data directly when found
      if (!mountDataUsed && ((params.data !== undefined && (!view.Data || !global[view.Data])) || params.Data || (view && view.data !== undefined && !view.Data))) {

        if (params.Data || (params.data !== undefined && !view.Data)) view.derivations = []
        mountDataUsed = true
        params.Data = view.Data = params.Data || view.Data || generate()
        params.data = global[view.Data] = params.data !== undefined ? params.data : (global[view.Data] !== undefined ? global[view.Data] : {})

        // duplicated element
        if (view.duplicatedElement) {

          delete view.path
          delete view.data
        }
      }
    
      // mount path directly when found
      if (!mountPathUsed && (params.path || params.schema) && view.parent !== "root") {

        var schema = clone(params.path || params.schema)
        mountPathUsed = true
        
        if (!view.Data) {

          view.Data = generate()
          global[view.Data] = view.data || {}
        }

        if (!global[`${view.Data}-schema`]) global[`${view.Data}-schema`] = []
        if (typeof schema === "object" && schema.value || schema.data) view.data = schema.value = schema.value || schema.data

        var myFnn = ({ path, derivations, mainSchema = [], schema = {}, value }) => {

          if (value !== undefined) schema.value = value

          // path
          var myPath = (typeof path === "string" || typeof path === "number") ? path.toString().split(".") : path || []
          derivations.push(...myPath)
          var lastIndex = derivations.length - 1
          
          derivations.reduce((o, k, i) => {
            return  o ? o[k] : o
          }, mainSchema)
        }

        if (typeof schema === "object" ? Array.isArray(schema) : true) myFnn({ path: schema, derivations: view.derivations, mainSchema: global[`${view.Data}-schema`]})
        else if (schema.path) myFnn({ path: clone(schema.path), derivations: view.derivations, mainSchema: global[`${view.Data}-schema`], schema })

        if (typeof view.data === "object" && !Array.isArray(view.data)) {

          Object.entries(view.data).map(([k, v]) => {
            myFnn({ path: k, derivations: view.derivations || [], mainSchema: view.schema })
          })
        }

        // console.log("data schema", view.Data, global[`${view.Data}-schema`])
      }
    }
  
    //////////////////////////////////////////////////////// End /////////////////////////////////////////////////////////
  })
  
  //if (mount && toView && views[id]) override(views[id], params)

  if (params["return()"] !== undefined) return params["return()"]
  return params
}

module.exports = { toParam }
