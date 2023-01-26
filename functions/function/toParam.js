const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { decode } = require("./decode")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { isParam } = require("./isParam")
const { toArray } = require("./toArray")
const actions = require("./actions.json")
const { getType } = require("./getType")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, string, e, id = "root", req, res, mount, object, _, __, ___, _i, asyncer, createElement, params = {}, executer, condition }) => {
  
  const { toFunction } = require("./toFunction")
  const { toApproval } = require("./toApproval")
  var _functions = require("./function")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  params = object || params

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]
  if (string.includes('codedS()') && string.length === 13) return global.codes[string]

  // condition not param
  if (!createElement && string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, __, ___, _i, object })
  // if (createElement) _ = views[id]._
  
  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = views[id]
    if (param === "") return

    // break
    if (view && (view.break || view.return)) return
    if (view && (view["break()"] || view["return()"])) return

    if (param.charAt(0) === "#") return
    
    // split
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else {
      key = param
    
      // execute function: coded()xxxxx() => [params that inherited function attributes in underscore]()
      if (key.length === 14 && key.slice(-2) === "()" && key.slice(0, 7) === 'coded()') key = global.codes[key.slice(0, 12)]
    
      // promise: coded()xxxxx:coded()xxxxx => promise():[]:[]
      else if (key.length === 25 && key.split("coded()") === 2 && key.slice(0, 7) === 'coded()') key = "promise():" + key
    }

    // increment
    if (key && value === undefined && key.slice(-2) === "++") {
      key = key.slice(0, -2)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||0`
      value = `coded()${_key}+1`
    }

    // --
    else if (key && value === undefined && key.slice(-2) === "--") {
      key = key.slice(0, -2)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||0`
      value = `coded()${_key}-1`
    }

    // ||=
    else if (key && value && key.slice(-2) === "||") {
      key = key.slice(0, -2)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||${value}`
      value = `coded()${_key}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}+coded()${_key0}`*/
    }

    // +=
    else if (key && value && key.slice(-1) === "+") {
      key = key.slice(0, -1)
      var _key = generate(), _key0 = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") ? key : (`().` + key)
      global.codes[`coded()${_key}`] = toCode({ _window, id, string: `${myVal}||[if():[type():[${value}]=number]:0:_string]` })
      value = `coded()${_key}+${value}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}+coded()${_key0}`*/
    }

    // -=
    else if (key && value && key.slice(-1) === "-") {
      key = key.slice(0, -1)
      var _key = generate(), _key0 = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") ? key : (`().` + key)
      global.codes[`coded()${_key}`] = `${myVal}||0`
      global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}-coded()${_key0}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}-coded()${_key0}`*/
    }

    // *=
    else if (key && value && key.slice(-1) === "*") {
      key = key.slice(0, -1)
      var _key = generate(), _key0 = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") ? key : (`().` + key)
      global.codes[`coded()${_key}`] = `${myVal}||0`
      value = `coded()${_key}*${value}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}*coded()${_key0}`*/
    }

    // await
    if ((asyncer || executer) && (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():")) {

      var awaiter = param.split(":").slice(1)
      if (asyncer) {
        if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
        var _params = toParam({ _window, string: awaiter[0], e, id, req, res, mount, _, __, ___, })
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
      return sleep(10)
    }
    
    // hide loader
    if (!_window && param === "loader.hide") {
      document.getElementById("loader-container").style.display = "none"
      return sleep(10)
    }

    // beforeLoading
    if (param.slice(0, 14) === "beforeLoading:") {

      param = param.slice(14)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.controls = toArray(view.controls)
      view.controls.push({ event: `beforeLoading?${param}` })
      return
    }

    // controls
    if (param.slice(0, 9) === "controls:") {

      var _controls = []
      param = param.slice(9)
      param.split(":").map(param => {

        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        _controls.push({ event: param })
      })

      view.controls = toArray(view.controls)
      view.controls.unshift(..._controls)
      return //view.controls
    }

    // children
    if (param.slice(0, 9) === "children:") {

      var _children = []
      param = param.slice(9)
      param.split(":").map(param => {

        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        _children.push({ view: param })
      })

      view.children = toArray(view.children)
      view.children.unshift(..._children)
      if (_) {
        view._ = _
        view.passToChildren = view.passToChildren || {}
        view.passToChildren._ = _
      }
      return //view.children
    }

    // children
    if (param.slice(0, 6) === "child:") {

      var _children = []
      param = param.slice(6)
      param.split(":").map(param => {

        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        _children.push({ view: param })
      })

      view.children = toArray(view.children)
      view.children.unshift(..._children)
      
      if (_) {
        view._ = _
        view.passToChildren = view.passToChildren || {}
        view.passToChildren._ = _
      }
      return //view.children
    }
    
    if (value === undefined) value = generate();
    else value = toValue({ _window, req, res, id, e, value, params, _, __, ___, condition })
    if (typeof value === "string" && value.includes("&nbsp;")) value = value.replace("&nbsp;", " ")

    id = viewId
    
    var path = typeof key === "string" ? key.split(".") : [], isFn = false, backendFn = false, i = path[0].split(":").length - 1, path0 = path[0].split(":")[0], pathi = path[0].split(":")[i]

    // :coded()1asd1
    if (path0 === "") return

    // function
    var isFn = toFunction({ _window, id, req, res, _, __, ___, e, path, path0, condition, params, mount, asyncer, createElement, executer, object })
    if (isFn !== "__CONTINUE__") return isFn
    else isFn = false
    
    // field:action()
    if (path[0] && pathi.slice(-2) === "()" && !path0.includes("()") && !_functions[pathi.slice(-2)] && !actions.includes(pathi)) {

      view && clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === pathi.slice(0, -2))
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
      
      // backend functions
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === pathi.slice(0, -2))
        if (isFn) backendFn = true
      }
    }

    if (isFn) {

      var _field = path[0].split(":")[0]
      var _key = generate()
      global.codes[`coded()${_key}`] = isFn

      // if (backendFn) return require("./func").func({ _window, req, res, id, e, func: `${_field}:coded()${_key}`, _, __, ___, asyncer: true })
      return toParam({ _window, string: `${_field}:coded()${_key}`, e, id, req, res, mount: true, object, _, __, ___, _i, asyncer, createElement, params, executer })
    }

    ////////////////////////////////// end of function /////////////////////////////////////////
    
    // object structure
    if (path.length > 1 || path[0].includes("()") || path[0].includes(")(") || object) {
      
      // break
      if (key === "break()" && value !== false) return view.break = true
      var _path = clone(params.path)
      delete params.path
      
      // mount state & value
      if ((path[0].includes("()") && (path0.slice(-2) === "()")) || path[0].slice(-3) === ":()"  || path[0].includes(")(") || path[0].includes("_") || object) {
        
        reducer({ _window, id, path, value, key, params, e, req, res, _, __, ___, _i, object, mount, createElement, condition })

      } else {
        
        if (id && view && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, __, ___, _i, mount, object, createElement, condition })
        reducer({ _window, id, path, value, key, params, e, req, res, _, __, ___, _i, mount, object: params, createElement, condition })
      }
      
      if (!params.path && _path !== undefined) params.path = _path
      
    } else if (key) {
      
      if (key === "_" && _) return _ = value
      if (id && view && mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    if (mount && createElement) {
      
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

            var _type = i === 0 ? o : (o.type || [])
            if (i !== 0  && !o.type) o.type = _type
            if (!isNaN(k) && k !== " " && (k.length > 1 ? k.toString().charAt(0) !== "0" : true)) {
              
              o.isArray = true
              return o
            }

            if (_type.find(o => o.path === k)) {

              var _schema = _type.find(o => o.path === k)
              if (i === lastIndex) view.schema = _schema = { ..._schema, ...schema, path: k }
              if (_schema.type === "array") _schema.isArray = true
              _schema.type = (i !== lastIndex && !Array.isArray(_schema.type)) ? [] : (_schema.type || "any")
              return _schema
              
            } else {

              var _schema = { path: k }
              if (i === lastIndex) view.schema = _schema = { ..._schema, ...schema, path: k }
              if (_schema.type === "array") _schema.isArray = true
              _schema.type = (i !== lastIndex && !Array.isArray(_schema.type)) ? [] : (_schema.type || "any")

              // if (params.data && i === lastIndex) _schema.value = params.data
              _type.push(_schema)
              return _schema
            }
          }, mainSchema)
        }

        if (typeof schema === "object" ? Array.isArray(schema) : true) myFnn({ path: schema, derivations: view.derivations, mainSchema: global[`${view.Data}-schema`]})
        else if (schema.path) myFnn({ path: clone(schema.path), derivations: view.derivations, mainSchema: global[`${view.Data}-schema`], schema })

        // reducer({ _window, id, path: view.derivations, value: view.path, key: true, params, e, req, res, _, __, ___, _i, mount, object: global[`${view.Data}-schema`] })

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

  if (params["return()"]) return params["return()"]
  return params
}

module.exports = { toParam }
