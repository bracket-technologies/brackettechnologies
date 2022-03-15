const axios = require("axios")
const { clone } = require("./clone")
const { toAwait } = require("./toAwait")

const save = async ({ id, e, save = {}, ...params }) => {
        
  var local = window.value[id]
  var collection = save.collection = save.collection || save.path
  var _data = clone(save.data)
  delete save.data

  if (!save.doc && !save.id && (!_data || (_data && !_data.id))) return
  save.doc = save.doc || save.id || _data.id

  var { data } = await axios.post(`https://us-central1-bracketjs.cloudfunctions.net/app/api/${collection}`, { data:_data, save })

  local.save = data

  console.log(data)

  // await params
  toAwait({ id, e, params })
}

module.exports = { save }
/*
const { capitalize } = require("./capitalize")
const { toAwait } = require("./toAwait")
const { toArray } = require("./toArray")
const { clone } = require("./clone")

module.exports = {
  save: async ({ save = {}, id, e, ...params }) => {
        
    var local = window.value[id]
    var global = window.global

    if (!save.id && (!save.data || (save.data && !save.data.id))) return
    
    var collection = save.path
    var ref = global.db.collection(collection)
    
    toArray(save.data).map(data => {

      ref.doc(save.id || data.id).set(data).then(() => {
        var _params = clone(params)

        local.save = {
          data,
          success: true,
          message: `${capitalize(collection)} saved successfuly!`,
        }
              
        console.log(local.save)
                    
        // await params
        toAwait({ id, e, params: _params })
      })
      .catch(error => {

        local.save = {
            success: false,
            message: error,
        }
        
        console.log(local.save)
      })
    })
  }
}
*/