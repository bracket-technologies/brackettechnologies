const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")

const toParam = ({ _window, string, e, id = "", req, res, mount, object, _, createElement, asyncer, eventParams }) => {
  const { toApproval } = require("./toApproval")

  var localId = id, mountDataUsed = false, mountPathUsed = false
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  var params = {}

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // condition not param
  if (string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, object })

  string.split(";").map(param => {
    
    var key, value, id = localId
    var local = _window ? _window.children[id] : window.children[id]

    // break
    if (params.break || local && local.break) return

    if (param.slice(0, 2) === "#:") return
    
    // split
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // await
    if (key.slice(0, 8) === "async():") {

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
        if (awaiter[0]) return params.await += `async():${awaiter.join(":")};`
        else if (awaiter.length === 0) return
      }
    }

    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = params.await || ""
      return params.await += `${awaiter};`
    }
    
    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res, _ })

    // condition not approved
    if (value === "*return*") return

    id = localId

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
          clearTimeout(local[path.join(".")])
          local[path.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && local && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, mount })
        reducer({ _window, id, path, value, key, params, e, req, res, _, mount, object: params })
      }
      
    } else if (key) {
      
      if (mount) local[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    // mount data directly when found
    if (createElement && mount && !mountDataUsed && ((params.data !== undefined && !local.Data) || params.Data || (local.data !== undefined && !local.Data))) {

      mountDataUsed = true
      local.Data = local.Data || generate()
      global[local.Data] = local.data = local.data !== undefined ? local.data : (global[local.Data] !== undefined ? global[local.Data] : {})

      // duplicated element
      if (local.duplicatedElement) {

        delete local.path
        delete local.data
      }
    }
  
    // mount path directly when found
    if (createElement && mount && !mountPathUsed && params.path) {

      mountPathUsed = true

      // path & derivations
      var path = (typeof local.path === "string" || typeof local.path === "number") ? local.path.toString().split(".") : []
          
      if (path.length > 0) {
        if (!local.Data) {

          local.Data = generate()
          global[local.Data] = local.data || {}
        }

        local.derivations.push(...path)
      }
    }
  
    //////////////////////////////////////////////////////// End /////////////////////////////////////////////////////////
  })

  return params
}

module.exports = { toParam }
