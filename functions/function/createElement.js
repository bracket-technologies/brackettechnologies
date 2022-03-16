const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { override } = require("./merge")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")

var createElement = ({ _window, id, req, res }) => {

  var value = _window ? _window.value : window.value
  var local = value[id]
  var global = _window ? _window.global : window.global
  var parent = value[local.parent]

  // html
  if (local.html) return local.html

  // view value
  if (local.view && global.data.view[local.view]) local = clone(global.data.view[local.view])

  // no value
  if (!local.type) return

  // destructure type, params, & conditions from type
  local.type = local.type.split("/?").join("_question")
  var type = local.type.split("?")[0]
  var params = local.type.split("?")[1]
  var conditions = local.type.split("?")[2]

  // [type]
  if (type.slice(0, 1) === "[" && type.slice(-1) === "]") {
    type = type.slice(1).slice(0, -1)
    if (!local.duplicatedElement) local.mapType = true
  }
  local.type = type

  // parent
  local.parent = parent.id

  // style
  local.style = local.style || {}

  // id
  local.id = local.id || generate()
  id = local.id

  // class
  local.class = local.class || ""

  // Data
  local.Data = parent.Data

  // derivations
  local.derivations = local.derivations || [...(parent.derivations || [])]

  // controls
  local.controls = local.controls || []

  // status
  local.status = "Loading"

  // first mount of local
  value[id] = local

  // ///////////////// approval & params /////////////////////

  // approval
  var approved = toApproval({ _window, string: conditions, id, req, res })
  if (!approved) return

  // push destructured params from type to local
  if (params) {
    
    params = toParam({ _window, string: params, id, req, res, mount: true })
    // value[id] = local = override(local, params)
    
    if (params.id) {

      delete Object.assign(value, {[params.id]: value[id]})[id]
      id = params.id
    }

    if (params.data !== undefined || params.Data) {

      local.Data = local.Data || generate()
      global[local.Data] = clone(local.data !== undefined ? local.data : (global[local.Data] !== undefined ? global[local.Data] : {}))
      local.data = global[local.Data]
    }

    // view
    if (params.view) {

      var _local = clone(global.data.view[local.view])
      if (_local) {

        delete local.type
        delete local.view
        
        value[id] = override(_local, local)
        return createElement({ _window, id, req, res })
      }
    }
  }

  // pass values To Children
  // if (parent.passToChildren) local = override(local, parent.passToChildren)

  // duplicated element
  if (local.duplicatedElement) {

    delete local.path
    delete local.data
  }

  // path & derivations
  var path = (typeof local.path === "string" || typeof local.path === "number") ? local.path.toString().split(".") : []
      
  if (path.length > 0) {
    if (!local.Data) {

      local.Data = generate()
      global[local.Data] = local.data || {}
    }

    local.derivations.push(...path)
  }

  // data
  if (parent.unDeriveData || local.unDeriveData) {

    local.data = local.data || ""
    local.unDeriveData = true

  } else local.data = reducer({ _window, id, path: local.derivations, value: local.data, key: true, object: global[local.Data], req, res })
  
  return createTags({ _window, id, req, res })
}

module.exports = { createElement }
