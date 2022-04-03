const axios = require("axios");
const { toString } = require("./toString")
const { toAwait } = require("./toAwait")

const erase = async ({ id, e, erase = {}, ...params }) => {

  var local = window.value[id]
  var collection = erase.collection = erase.collection || erase.path

  // no id
  if (!erase.id && !erase.doc) return
  erase.doc = erase.doc || erase.id
  
  var { data } = await axios.delete(`https://us-central1-bracketjs.cloudfunctions.net/api/${collection}?${encodeURI(toString({ erase }))}`)
  
  local.erase = data

  console.log(data)

  toAwait({ id, e, params })
}

module.exports = { erase }

/*
const { toAwait } = require("./toAwait")

module.exports = {
  erase: async ({ erase = {}, id, e, ...params }) => {
        
    var local = window.value[id]
    var global = window.global

    var collection = erase.path
    var ref = global.db.collection(collection)

    if (!erase.id) return
    
    ref.doc(erase.id).delete().then(async () => {

      local.erase = {
        success: true,
        message: `Data erased successfuly!`,
      }
      
      if (erase.type === 'file') await global.storage.child(`images/${erase.id}`).delete()
            
      console.log(local.erase)
                  
      // await params
      toAwait({ id, e, params })

    }).catch(error => {

      local.erase = {
          success: false,
          message: error,
      }
      
      console.log(local.erase)
    })
  }
}
*/