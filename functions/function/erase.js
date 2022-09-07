const axios = require("axios");
const { clone } = require("./clone");
const { toArray } = require("./toArray");
const { toString } = require("./toString")

const erase = async ({ _window, req, res, id, e, ...params }) => {

  var global = window.global
  var erase = params.erase || {}
  var view = window.views[id]
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId
  var store = erase.store || "database"
  
  erase.docs = toArray(erase.doc || erase.docs || erase.id || (erase.data && clone(toArray(erase.data.map(data => data.id)))))
  // if (erase.docs.length === 0) return
  // delete erase.data

  // erase
  headers.erase = encodeURI(toString({ erase }))
  headers.timestamp = (new Date()).getTime()

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  var { data } = await axios.delete(`/${store}`, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  view.erase = global.erase = clone(data)
  if (!_window) console.log(data)

  if (params.asyncer) require("./toAwait").toAwait({ _window, req , res, id, e, params })
}

module.exports = { erase }