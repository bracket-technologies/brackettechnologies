const axios = require("axios");
const { toString } = require("./toString")
const { toAwait } = require("./toAwait")

const erase = async ({ id, e, ...params }) => {

  var erase = params.erase || {}
  var local = window.value[id]
  var collection = erase.collection = erase.collection || erase.path
  erase.headers = erase.headers || {}

  // no id
  if (!erase.id && !erase.doc && !erase.docs) return
  erase.doc = erase.doc || erase.id
  if (erase.doc === undefined) delete erase.doc

  var { data } = await axios.delete(`https://us-central1-bracketjs.cloudfunctions.net/app/api/${collection}?${encodeURI(toString({ erase }))}`, {
    headers: {
      "project": window.global.data.project.id,
      ...erase.headers
    }
  })

  local.erase = data
  console.log(data)

  toAwait({ id, e, params })
}

module.exports = { erase }