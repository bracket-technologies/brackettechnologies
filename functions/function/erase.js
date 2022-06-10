const axios = require("axios");
const { toString } = require("./toString")

const erase = async ({ id, e, ...params }) => {

  var global = window.global
  var erase = params.erase || {}
  var view = window.views[id]
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId

  // erase
  headers.erase = encodeURI(toString({ erase }))

  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]
  
  // no id
  if (!erase.id && !erase.doc && !erase.docs) return
  erase.doc = erase.doc || erase.id
  if (erase.doc === undefined) delete erase.doc

  var { data } = await axios.delete(`/database`, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  view.erase = data
  console.log(data)

  require("./toAwait").toAwait({ id, e, params })
}

module.exports = { erase }