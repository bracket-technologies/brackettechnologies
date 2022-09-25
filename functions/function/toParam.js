const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { decode } = require("./decode")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { isParam } = require("./isParam")
const { toArray } = require("./toArray")
const actions = require("./actions.json")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, string, e, id = "", req, res, mount, object, _, __, ___, _i, asyncer, createElement, params = {}, executer }) => {
  
  const { toApproval } = require("./toApproval")
  var _functions = require("./function")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  params = object || params

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // condition not param
  if (string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, __, ___, _i, object })

  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = views[id]
    
    // break
    if (view && (view.break || view.return)) return
    if (view && (view["break()"] || view["return()"])) return

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
      value = `${key}+1`
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

    // events attached to type
    if (createElement) {

      // mouseenter
      if (param.slice(0, 10) === "mouseenter") {

        param = param.slice(11)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseenter = view.mouseenter || ""
        return view.mouseenter += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // click
      if (param.slice(0, 6) === "click." || param.slice(0, 6) === "click:") {

        param = param.slice(6)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.click = view.click || ""
        return view.click += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // change
      if (param.slice(0, 6) === "change") {

        param = param.slice(7)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.change = view.change || ""
        return view.change += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // mouseleave
      if (param.slice(0, 10) === "mouseleave") {

        param = param.slice(11)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseleave = view.mouseleave || ""
        return view.mouseleave += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // mouseover
      if (param.slice(0, 9) === "mouseover") {

        param = param.slice(10)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseover = view.mouseover || ""
        return view.mouseover += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // mousedown
      if (param.slice(0, 9) === "mousedown") {

        param = param.slice(10)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mousedown = view.mousedown || ""
        return view.mousedown += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // mouseup
      if (param.slice(0, 7) === "mouseup") {

        param = param.slice(8)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseup = view.mouseup || ""
        return view.mouseup += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // keypress
      if (param.slice(0, 8) === "keypress") {

        param = param.slice(9)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keypress = view.keypress || ""
        return view.keypress += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // keyup
      if (param.slice(0, 5) === "keyup") {

        param = param.slice(6)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keyup = view.keyup || ""
        return view.keyup += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // keydown
      if (param.slice(0, 7) === "keydown") {

        param = param.slice(8)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keydown = view.keydown || ""
        return view.keydown += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // loaded
      if (param.slice(0, 6) === "loaded") {

        param = param.slice(7)
        var conditions = param.split(":")[1]
        if (conditions) param = param.split(":")[0]
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.loaded = view.loaded || ""
        return view.loaded += `${conditions ? `if():${conditions}:[` : ""}${param}${conditions ? "]" : ""};`
      }

      // children
      if (param.slice(0, 8) === "children") {

        var _children = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ type: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        return view.children
      }

      // controls
      if (param.slice(0, 8) === "controls") {

        var _controls = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _controls.push({ event: param })
        })

        view.controls = toArray(view.controls)
        view.controls.unshift(..._controls)
        return view.controls
      }

      // children
      if (param.slice(0, 5) === "child") {

        var _children = []
        param = param.slice(6)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ type: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        return view.children
      }
    }

    // show loader
    if (!_window && param === "loader.show") {
      document.getElementsByClassName("loader-container")[0].style.display = "flex"
      return sleep(10)
    }
    
    // hide loader
    if (!_window && param === "loader.hide") {
      document.getElementsByClassName("loader-container")[0].style.display = "none"
      return sleep(10)
    }

    if (value === undefined) value = generate()
    else value = toValue({ _window, req, res, id, e, value, params, _, __, ___ })

    id = viewId
    
    var path = typeof key === "string" ? key.split(".") : [], timer, isFn = false, backendFn = false, i = path[0].split(":").length - 1, path0 = path[0].split(":")[0], pathi = path[0].split(":")[i]

    ////////////////////////////////// function /////////////////////////////////////////

    if (path.length === 1 && path0.slice(-2) === "()" /*&& !path0.includes(":")*/ && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

      clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })
      
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
        if (isFn) backendFn = true
      }

    } // else if (!path0.includes("()") && path[0].split(":").length === 2 && path0.slice(-2) === "()" )

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

        var _key = generate()
        global.codes[`coded()${_key}`] = _params
        if (isParam({ _window, string: _params })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: `coded()${_key}` })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
      }
      
      return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i, asyncer, createElement, params, executer })
    }
    
    // field:action()
    if (view && path[0] && pathi.slice(-2) === "()" && !path0.includes("()") && !_functions[pathi.slice(-2)] && !actions.includes(pathi)) {

      clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view].functions || {}).find(fn => fn === pathi.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })
      
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

        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res, _, __, ___, _i, object, mount, createElement })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(view[path.join(".")])
          view[path.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && view && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, __, ___, _i, mount, object, createElement })
        reducer({ _window, id, path, value, key, params, e, req, res, _, __, ___, _i, mount, object: params })
      }
      
      if (!params.path && _path !== undefined) params.path = _path
      
    } else if (key) {
      
      if (id && view && mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    if (mount) {
      
      if (view && view.doc) view.Data = view.doc
      if (params.doc) params.Data = params.doc

      // mount data directly when found
      if (mount && !mountDataUsed && ((params.data !== undefined && (!view.Data || !global[view.Data])) || params.Data || (view && view.data !== undefined && !view.Data))) {

        if (params.Data || (params.data !== undefined && !view.Data)) view.derivations = []
        mountDataUsed = true
        params.Data = view.Data = params.Data || view.Data || generate()
        params.data = global[view.Data] = view.data = view.data !== undefined ? view.data : (global[view.Data] !== undefined ? global[view.Data] : {})

        // duplicated element
        if (view.duplicatedElement) {

          delete view.path
          delete view.data
        }
      }
    
      // mount path directly when found
      if (mount && !mountPathUsed && (params.path || params.schema) && createElement) {

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
          // console.log(schema, path,derivations, lastIndex);
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
