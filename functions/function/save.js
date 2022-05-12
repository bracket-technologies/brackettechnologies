const axios = require("axios")
const { clone } = require("./clone")
const { toAwait } = require("./toAwait")

const save = async ({ id, e, ...params }) => {

  var save = params.save || {}
  var local = window.children[id]
  var collection = save.collection = save.collection || save.path
  var _data = clone(save.data)
  var headers = clone(save.headers) || {}
  headers.project = headers.project || global.data.project.id
  delete save.headers

  if (!save.doc && !save.id && (!_data || (_data && !_data.id))) return
  save.doc = save.doc || save.id || _data.id
  delete save.data
console.log(headers, collection);
  var { data } = await axios.post(`/database/${collection}`, { save, data: _data }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  local.save = data
  console.log(data)

  // await params
  toAwait({ id, e, params })
}

module.exports = { save }