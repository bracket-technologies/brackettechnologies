const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")

const toParam = ({ _window, string, e, id = "", req, res, mount, object, _, createElement, asyncer, eventParams }) => {
  const { toApproval } = require("./toApproval")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  var params = {}

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // condition not param
  if (string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, object })

  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = _window ? _window.views[id] : window.views[id]

    // break
    //if (params.break || view && view.break) return

    if (param.slice(0, 2) === "#:") return
    
    // split
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // await
    if (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():") {

      if (eventParams) {

        var asyncers = param.split(":").slice(1)
        var promises = []
        asyncers.map(async asyncer => {
          promises.push(await toParam({ _window, string: asyncer, e, id, req, res, mount, createElement }))
          await Promise.all(promises)
        })

        return

      } else {

        var awaiter = param.split(":").slice(1)
        if (asyncer) {
          if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
          var _params = toParam({ _window, string: awaiter[0], e, id, req, res, mount, createElement })
          params = { ...params, ..._params }
          awaiter = awaiter.slice(1)
        }

        params.await = params.await || ""
        if (awaiter[0]) return params.await += `wait():${awaiter.join(":")};`
        else if (awaiter.length === 0) return
      }
    }

    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = params.await || ""
      return params.await += `${awaiter};`
    }

    // mouseenter
    if (param.slice(0, 10) === "mouseenter") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.mouseenter = view.mouseenter || ""
      return view.mouseenter += `${param};`
    }

    // mouseleave
    if (param.slice(0, 10) === "mouseleave") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.mouseleave = view.mouseleave || ""
      return view.mouseleave += `${param};`
    }

    // mouseover
    if (param.slice(0, 10) === "mouseover") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.mouseover = view.mouseover || ""
      return view.mouseover += `${param};`
    }

    // keyup
    if (param.slice(0, 10) === "keyup") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.keyup = view.keyup || ""
      return view.keyup += `${param};`
    }

    // keydown
    if (param.slice(0, 10) === "keydown") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.keydown = view.keydown || ""
      return view.keydown += `${param};`
    }
    
    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res, _ })

    // condition not approved
    if (value === "*return*") return

    id = viewId

    var path = typeof key === "string" ? key.split(".") : [], timer

    // object structure
    if (path.length > 1 || path[0].includes("()") || path[0].includes(")(") || object) {
      
      // mount state & value
      if (path[0].includes("()") || path[0].includes(")(") || path[0].includes("_") || object) {
        
        var _object
        if (path[0].split(":")[0] === "if()") _object = params
        else _object = object

        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res, _, object, mount })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(view[path.join(".")])
          view[path.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && view && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, mount })
        reducer({ _window, id, path, value, key, params, e, req, res, _, mount, object: params })
      }
      
    } else if (key) {
      
      if (mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    // mount data directly when found
    if (createElement && mount && !mountDataUsed && ((params.data !== undefined && !view.Data) || params.Data || (view.data !== undefined && !view.Data))) {

      mountDataUsed = true
      view.Data = view.Data || generate()
      global[view.Data] = view.data = view.data !== undefined ? view.data : (global[view.Data] !== undefined ? global[view.Data] : {})

      // duplicated element
      if (view.duplicatedElement) {

        delete view.path
        delete view.data
      }
    }
  
    // mount path directly when found
    if (createElement && mount && !mountPathUsed && params.path) {

      mountPathUsed = true

      // path & derivations
      var path = (typeof view.path === "string" || typeof view.path === "number") ? view.path.toString().split(".") : []
          
      if (path.length > 0) {
        if (!view.Data) {

          view.Data = generate()
          global[view.Data] = view.data || {}
        }

        view.derivations.push(...path)
      }
    }
  
    //////////////////////////////////////////////////////// End /////////////////////////////////////////////////////////
  })

  return params
}

module.exports = { toParam }
