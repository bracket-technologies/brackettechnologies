const axios = require("axios")
const { clone } = require("./clone")
const { toAwait } = require("./toAwait")

const save = async ({ id, e, ...params }) => {
        
  var save = params.save || {}
  var local = window.value[id]
  var collection = save.collection = save.collection || save.path
  var _data = clone(save.data)

  if (!save.doc && !save.id && (!_data || (_data && !_data.id))) return
  save.doc = save.doc || save.id || _data.id

  var { data } = await axios.post(`/api/${collection}`, { save, data:_data })

  local.save = data
  console.log(data)

  // await params
  toAwait({ id, e, params })
}

module.exports = { save }