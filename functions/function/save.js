var { clone } = require("./clone")
const { toParam } = require("./toParam")
const { generate } = require("./generate")
const { schematize } = require("./schematize")
const { toArray } = require("./toArray")

const save = async ({ _window, req, res, id, e, _, __, ___, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var save = params.save || {}
  var view = views[id]
  var _data
  var headers = clone(save.headers) || {}
  var store = save.store || "database"

  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]
  if (save.map && typeof save.map === 'object') {
    
    save.idList = []
    save.data = []
    Object.entries(save.map).map(([doc, data]) => {
      save.data.push(data)
      save.idList.push(doc)
    })
    _data = save.data
  }

  if (!Array.isArray(save.data)) {
    save.doc = save.doc || save.id || save.data.id || generate({ length: 20 })
  } else {
    toArray(save.data).map(data => {
      data.id = data.id || generate({ length: 20 })
    })
  }
  /*if (save.doc || save.id || (typeof save.data === "object" && !Array.isArray(save.data) && save.data.id)) save.doc = save.doc || save.id || save.data.id
  if (!save.doc && (Array.isArray(save.data) ? save.data.find(data => !data.id) : false)) return*/

  // schema
  if (save.schematize && (save.doc || save.schema)) {

    var schema = save.doc ? global[`${save.doc}-schema`] : save.schema
    if (!save.schema) return toParam({ _window, string: "note():[text=Schema does not exist!;type=danger]" })
    if (Array.isArray(save.data)) save.data = save.data.map(data => schematize({ data, schema }))
    else save.data = schematize({ data: save.data, schema })
  }

  if (_window) {
    
    var collection = save.collection, success, message, project = headers.project || req.headers.project, schema
    if (_window.global.data.project.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`
    
    // get schema
    if (save.schematize) {
      await req.db.collection(`schema-${project}`).doc(save.collection).get().then(doc => {

        success = true
        schema = doc.data()

      }).catch(error => {

        success = false
        message = error
      })

      if (!schema) return
      if (Array.isArray(save.data)) save.data = save.data.map(data => schematize({ data, schema }))
      save.data = schematize({ data: save.data, schema })
    }

    global.promises[id] = toArray(global.promises[id])
    var ref = req.db.collection(collection)

    if (Array.isArray(save.data)) {

      /*var idList = save.idList || []
      if (idList) {

        var batch = req.db.batch()
        save.data.map((data, i) => {
          
          if (idList[i]) {
            
            // if (!data.id) data.id = generate({ length: 20 })
            if (!data["creation-date"]) {
              data["creation-date"] = (new Date()).getTime()
              data.timezone = "GMT"
            }


            batch.set(req.db.collection(collection).document(idList[i]), data)
      
            // Commit the batch
            global.promises[id].push(batch.commit().then(() => {
      
              success = true
              message = `Document saved successfuly!`
              
            }).catch(error => {
        
              success = false
              message = error
            }))
          }
        })

      } else {*/

        save.data.map((data, i) => {

          if (!data.id) data.id = generate({ length: 20 })
          if (!data["creation-date"]) {
            data["creation-date"] = (new Date()).getTime()
            data.timezone = "GMT"
          }

          global.promises[id].push(ref.doc(data.id.toString()).set(data).then(() => {

            success = true
            message = `Document saved successfuly!`
      
          }).catch(error => {
      
            success = false
            message = error
          }))
        })
      //}

    } else if (save.doc) {

      var data = save.data
      if (!data.id && !save.doc && !save.id) data.id = generate({ length: 20 })
      if (!data["creation-date"]) {
        data["creation-date"] = (new Date()).getTime()
        data.timezone = "GMT"
      }
      
      global.promises[id].push(ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`

      }).catch(error => {

        success = false
        message = error
      }))
    }
    
    await Promise.all((global.promises[id] || []))
    delete global.promises[id]

    _data = { data: save.data, success, message }

  } else {
    
    var _data_ = clone(save.data), data
    delete save.data
    
    headers.timestamp = (new Date()).getTime()
    var { data } = await require("axios").post(`/${store}`, { save, data: _data_ }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })
    
    _data = data
  }

  view.save = global.save = _data
  if (store === "confirmEmail") view.confirmEmail = _data

  /*if (!_window) */console.log("save", _data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, _: _data, __: _, ___: __, params })
}

module.exports = { save }