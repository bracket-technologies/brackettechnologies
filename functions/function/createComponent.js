const { clone } = require("./clone")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
// const { override } = require("./merge")

const component = require("../component/component")
const { toCode } = require("./toCode")

module.exports = {
  createComponent: ({ _window, id, req, res }) => {
    
    var value = _window ? _window.value : window.value
    var global = _window ? _window.global : window.global
    var local = value[id], parent = local.parent

    if (!component[local.type]) return
    value[id] = local = component[local.type](local)

    // destructure type, params, & conditions from type
    local.type = toCode({ _window, id, string: local.type })

    // 'string'
    if (local.type.split("'").length > 2) local.type = toCode({ _window, string: local.type, start: "'", end: "'" })
    
    var type = local.type.split("?")[0]
    var params = local.type.split("?")[1]
    var conditions = local.type.split("?")[2]

    // type
    local.type = type
    local.parent = parent

    // approval
    var approved = toApproval({ _window, string: conditions, id, req, res })
    if (!approved) return

    // push destructured params from type to local
    if (params) {
      
      params = toParam({ _window, string: params, id, req, res, mount: true })
      // value[id] = local = override(local, params)

      if (params.id) {
        
        delete Object.assign(value, { [params.id]: value[id] })[id]
        id = params.id
      }
      
      if (params.data && (!local.Data || params.Data)) {

        local.Data = local.Data || generate()
        var state = local.Data
        global[state] = clone(local.data || global[state])
        global[`${state}-options`] = global[`${state}-options`] || {}
      }
    }

    // value[id] = local
  }
}
