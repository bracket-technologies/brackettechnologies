const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const toParam = ({ _window, string, e, id = "", req, res, mount }) => {
  const { toApproval } = require("./toApproval")

  var localId = id

  if (typeof string !== "string" || !string) return string || {}
  var params = {}

  string.split(";").map((param) => {
    
    var key, value, id = localId
    var local = _window ? _window.value[id] : window.value[id]

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
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = toArray(params.await) || []
      return params.await.push(awaiter)
    }

    if (local && local.status === "Loading") {
      if (key.includes("parent()") || key.includes("children()") || key.includes("next()")) {

        params.await = toArray(params.await) || []
        return params.await.push(param)
      }
    }

    // await
    /* if (value && value.includes("await.")) {
      
      var _value = value.split("await.")[1]
      params.await = toArray(params.await) || []
      return params.await.push(`${key}=${_value}`)
    } */

    // event
    if (key.includes("event.") && !key.split("event.")[0]) {
      
      var event = key.split("event.")[1].split(".")[0]
      var _params = key.split("event.")[1].split(`${event}.`)[1]
      return local.controls.push({
        "event": `${event}?${_params}`
      })
    }
    
    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res })

    // condition not approved
    if (value === "*return*") return

    id = localId

    var keys = typeof key === "string" ? key.split(".") : [], timer

    // id
    /* if (key && key.slice(0, 3) === "():") {

      var key0 = key.split(".")[0]
      var newId = key0.split(":")[1]
      timer = key0.split(":")[2]
      key = `${key.split(".")[0].split(":")[0]}.${key.split(".").slice(1).join(".")}`
      keys = key.split(".")
      
      // id
      var _id = toValue({ _window, id, value: newId, params, e, req, res })
      if (_id) id = _id
    }

    // local
    var local = _window ? _window.value[id] : window.value[id]
    */

    // array id
    /*if (Array.isArray(id)) {

      id.slice(1).map(id => {
        var state = generate()
        global[state] = value
        toParam({ id, e, string: `${key}=global().${state}`, req, res })
      })

      id = id[0]
    }*/

    // conditions
    if (key && key.includes("<<")) {
      
      var condition = key.split("<<")[1]
      var approved = toApproval({ id, e, string: condition, req, res })
      if (!approved) return
      key = key.split("<<")[0]
    }

    var path = typeof key === "string" ? key.split(".") : []
    
    // break
    if (key === "break" || key === "break()") {

      params.break = true
      return params
    }

    // object structure
    if (path.length > 1 || path[0].includes("()")) {
      
      // mount state & value
      if (path[0].includes("()")) {
      
        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(local[keys.join(".")])
          local[keys.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && local && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res })

        path.reduce((obj, key, index) => {

          if (obj[key] !== undefined) {
            if (index === path.length - 1) {

              // if key=value exists => mount the existing to local, then mount the new value to params
              path.reduce((o, k, i) => {

                if (i === path.length - 1) return o[k] = value
                return o[k] || {}

              }, _window ? _window.value[id] : window.value[id])

              return obj[key] = value
            }

          } else {

            if (index === path.length - 1) return obj[key] = value
            else obj[key] = {}
          }

          return obj[key]
        }, params)

      }
      
      key = path[0]
      
    } else {

      if (id && local && mount) local[key] = value
      params[key] = value
    }
  })

  return params
}

module.exports = { toParam }
