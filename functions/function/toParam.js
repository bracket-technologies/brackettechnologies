const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { decode } = require("./decode")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { isParam } = require("./isParam")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, string, e, id = "", req, res, mount, object, _, __, _i, asyncer, createElement, params = {}, executer }) => {
  const { toApproval } = require("./toApproval")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  params = object || params

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // condition not param
  if (string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, __, _i, object })

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

    // await
    if ((asyncer || executer) && (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():")) {

      var awaiter = param.split(":").slice(1)
      if (asyncer) {
        if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
        var _params = toParam({ _window, string: awaiter[0], e, id, req, res, mount })
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
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.mouseenter = view.mouseenter || ""
      return view.mouseenter += `${param};`
    }

    // click
    if (param.slice(0, 6) === "click." || param.slice(0, 6) === "click:") {

      param = param.slice(6)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.click = view.click || ""
      return view.click += `${param};`
    }

    // change
    if (param.slice(0, 6) === "change") {

      param = param.slice(7)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.change = view.change || ""
      return view.change += `${param};`
    }

    // mouseleave
    if (param.slice(0, 10) === "mouseleave") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.mouseleave = view.mouseleave || ""
      return view.mouseleave += `${param};`
    }

    // mouseover
    if (param.slice(0, 9) === "mouseover") {

      param = param.slice(10)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.mouseover = view.mouseover || ""
      return view.mouseover += `${param};`
    }

    // mousedown
    if (param.slice(0, 9) === "mousedown") {

      param = param.slice(10)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.mousedown = view.mousedown || ""
      return view.mousedown += `${param};`
    }

    // mouseup
    if (param.slice(0, 7) === "mouseup") {

      param = param.slice(8)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.mouseup = view.mouseup || ""
      return view.mouseup += `${param};`
    }

    // keypress
    if (param.slice(0, 8) === "keypress") {

      param = param.slice(9)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.keypress = view.keypress || ""
      return view.keypress += `${param};`
    }

    // keyup
    if (param.slice(0, 5) === "keyup") {

      param = param.slice(6)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.keyup = view.keyup || ""
      return view.keyup += `${param};`
    }

    // keydown
    if (param.slice(0, 7) === "keydown") {

      param = param.slice(8)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.keydown = view.keydown || ""
      return view.keydown += `${param};`
    }

    // loaded
    if (param.slice(0, 6) === "loaded") {

      param = param.slice(7)
      if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
      view.loaded = view.loaded || ""
      return view.loaded += `${param};`
    }
  }

    // show loader
    if (param === "loader.show") {
      document.getElementsByClassName("loader-container")[0].style.display = "flex"
      return sleep(10)
    }
    
    // hide loader
    if (param === "loader.hide") {
      document.getElementsByClassName("loader-container")[0].style.display = "none"
      return sleep(10)
    }

    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res, _, __ })

    id = viewId

    var path = typeof key === "string" ? key.split(".") : [], timer, isFn = false, path0 = path[0].split(":")[0]

    // function
    if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && view) clone(view["my-views"]).reverse().map(view => {
      if (!isFn) {
        isFn = Object.keys(global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
        if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        // console.log(isFn, key, view, global.data.view);
      }
    })

    if (isFn) {
      var _params = path[0].split(":")[1]
      if (_params) {
        if (isParam({ _window, string: _params }))
          _params = toParam({ req, res, _window, id, e, _, __, _i, string: _params })
        else _params = toValue({ req, res, _window, id, e, _, __, _i, value: _params })
      }
      return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), _i, asyncer, createElement, params, executer })
    }

    // object structure
    if (path.length > 1 || path[0].includes("()") || path[0].includes(")(") || object) {
      
      // break
      if (key === "break()" && value !== false) return view.break = true
      var _path = clone(params.path)
      delete params.path
      
      // mount state & value
      if ((path[0].includes("()") && (path0.slice(-2) === "()")) || path[0].slice(-3) === ":()"  || path[0].includes(")(") || path[0].includes("_") || object) {

        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res, _, __, _i, object, mount, createElement })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(view[path.join(".")])
          view[path.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && view && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, __, _i, mount, object, createElement })
        reducer({ _window, id, path, value, key, params, e, req, res, _, __, _i, mount, object: params })
      }
      if (!params.path && _path !== undefined) params.path = _path
      
    } else if (key) {
      
      if (mount) view[key] = value
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
      if (mount && !mountPathUsed && params.path && createElement) {

        mountPathUsed = true
        
        // path & derivations
        var path = (typeof view.path === "string" || typeof view.path === "number") ? view.path.toString().split(".") : params.path || []
            
        if (path.length > 0) {
          
          if (!view.Data) {

            view.Data = generate()
            global[view.Data] = view.data || {}
          }

          view.derivations.push(...path)
        }
      }
    }
  
    //////////////////////////////////////////////////////// End /////////////////////////////////////////////////////////
  })

  return params
}

module.exports = { toParam }
