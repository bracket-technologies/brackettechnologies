const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const toParam = ({ _window, string, e, id = "", req, res, mount, object, _, createElement }) => {
  const { toApproval } = require("./toApproval")

  var localId = id, mountDataUsed = false, mountPathUsed = false
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  var params = {}

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // condition not approval
  if (string.includes("==")) return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _ })

  string.split(";").map(param => {
    
    var key, value, id = localId
    var local = _window ? _window.children[id] : window.children[id]

    // break
    if (params.break || local && local.break) return

    if (param.slice(0, 2) === "#:") {
      local["#"] = toArray(local["#"])
      return local["#"].push(param.slice(2))
    }
    
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // await
    if (key.slice(0, 8) === "async():") {

      var awaiter = param.split(":").slice(1)
      if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
      var _params = toParam({ _window, string: awaiter[0], e, id, req, res, mount, createElement })
      params = { ...params, ..._params }
      params.await = params.await || ""
      if (awaiter.slice(1)[0]) return params.await += `async():${awaiter.slice(1).join(":")};`
    }

    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = params.await || ""
      return params.await += `${awaiter};`
    }

    if (local && local.status === "Loading") {
      if (key.includes("parent()") || key.includes("children()") || key.includes("next()")) {

        params.await = params.await || ""
        return params.await += `${param};`
      }
    }

    // event
    if (key.includes("event.") && !key.split("event.")[0]) {
      
      var event = key.split("event.")[1].split(".")[0]
      var _params = key.split("event.")[1].split(`${event}.`)[1]
      return local.controls.push({
        "event": `${event}?${_params}`
      })
    }
    
    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res, _ })

    // condition not approved
    if (value === "*return*") return

    id = localId

    var keys = typeof key === "string" ? key.split(".") : [], timer

    // conditions
    if (key && key.includes("<<")) {
      
      var condition = key.split("<<")[1]
      var approved = toApproval({ id, e, string: condition, req, res, _window, _ })
      if (!approved) return
      key = key.split("<<")[0]
    }

    var path = typeof key === "string" ? key.split(".") : []
    
    // break
    if (key === "break" || key === "break()") {

      params.break = true
      return params
    }
    
    // reload
    if (key === "reload()") document.location.reload(true)

    // object structure
    if (path.length > 1 || path[0].includes("()") || path[0].includes(")(") || object) {
      
      // mount state & value
      if (path[0].includes("()") || path[0].includes(")(") || path[0].includes("_") || object) {
        
        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res, _, object, mount })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(local[keys.join(".")])
          local[keys.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && local && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, mount })

        path.reduce((obj, key, index) => {

          if (obj[key] !== undefined) {
            if (index === path.length - 1) {

              // if key=value exists => mount the existing to local, then mount the new value to params
              path.reduce((o, k, i) => {

                if (i === path.length - 1) return o[k] = value
                return o[k] || {}

              }, _window ? _window.children[id] : window.children[id])

              return obj[key] = value
            }

          } else {

            if (index === path.length - 1) return obj[key] = value
            else obj[key] = {}
          }

          return obj[key]
        }, params)

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
