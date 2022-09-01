const axios = require("axios");
const { toString } = require("./toString")

const erase = async ({ _window, req, res, id, e, ...params }) => {

  var global = window.global
  var erase = params.erase || {}
  var view = window.views[id]
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId
  var store = erase.store || "database"
  
  erase.doc = erase.doc || erase.id || (erase.data && erase.data.id)
  if (erase.doc === undefined) return
  delete erase.data

  // erase
  headers.erase = encodeURI(toString({ erase }))

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  var { data } = await axios.delete(`/${store}`, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  if (!view) return
  view.erase = global.erase = data
  console.log(data)

  if (params.asyncer) require("./toAwait").toAwait({ _window, req , res, id, e, params })
}

module.exports = { erase }