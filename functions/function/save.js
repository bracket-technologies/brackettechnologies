const save = async ({ id, e, ...params }) => {

  var global = window.global
  var save = params.save || {}
  var local = window.views[id]
  var _data = require("./clone").clone(save.data)
  var headers = require("./clone").clone(save.headers) || {}

  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]

  if (!save.doc && !save.id && (!_data || (_data && !_data.id))) return
  save.doc = save.doc || save.id || _data.id
  delete save.data
  
  var { data } = await require("axios").post(`/database`, { save, data: _data }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  local.save = data
  console.log(data)

  // await params
  require("./toAwait").toAwait({ id, e, params })
}

module.exports = { save }