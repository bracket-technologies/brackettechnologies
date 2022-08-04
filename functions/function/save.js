var { clone } = require("./clone")

const save = async ({ id, e, ...params }) => {

  var global = window.global
  var save = params.save || {}
  var view = window.views[id]
  var _data = clone(save.data)
  var headers = clone(save.headers) || {}
  var store = save.store || "database"

  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]

  if (!save.doc && !save.id && (!_data || (_data && !_data.id)) && (Array.isArray(data) ? !data.find(data => !data.id) : true)) return
    
  var { data } = await require("axios").post(`/${store}`, { save: { ...save, data: undefined }, data: _data }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  if (store === "confirmEmail") view.confirmEmail = data
  else view.save = global.save = data

  console.log(data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, e, params })
}

module.exports = { save }