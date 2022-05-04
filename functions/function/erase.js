const axios = require("axios");
const { toString } = require("./toString")
const { toAwait } = require("./toAwait")

const erase = async ({ id, e, ...params }) => {

  var erase = params.erase || {}
  var local = window.children[id]
  var collection = erase.collection = erase.collection || erase.path
  erase.headers = erase.headers || {}
  erase.headers.project = erase.headers.project || global.data.project.id

  // no id
  if (!erase.id && !erase.doc && !erase.docs) return
  erase.doc = erase.doc || erase.id
  if (erase.doc === undefined) delete erase.doc

  var { data } = await axios.delete(`/api/${collection}?${encodeURI(toString({ erase }))}`, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...erase.headers
    }
  })

  local.erase = data
  console.log(data)

  toAwait({ id, e, params })
}

module.exports = { erase }