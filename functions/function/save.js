var { clone } = require("./clone")
const { generate } = require("./generate")

const save = async ({ _window, req, res, id, e, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var save = params.save || {}
  var view = views[id]
  var _data = clone(save.data)
  var headers = clone(save.headers) || {}
  var store = save.store || "database"

  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (save.doc || save.id || (typeof _data === "object" && !Array.isArray(_data) && _data.id)) save.doc = save.doc || save.id || _data.id
  if (!save.doc && (Array.isArray(_data) ? _data.find(data => !data.id) : false)) return
    
  if (_window) {
    
    var collection = save.collection, success, message, project = headers.project || req.headers.project
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`

    var ref = req.db.collection(collection)
    if (Array.isArray(save.data)) {

      save.data.map(data => {

        if (!data.id) data.id = generate({ length: 20 })
        if (!data["creation-date"]) {
          data["creation-date"] = (new Date()).getTime()
          data.timezone = "GMT"
        }

        global.promises.push(ref.doc(data.id.toString()).set(data).then(() => {

          success = true
          message = `Document saved successfuly!`
    
        }).catch(error => {
    
          success = false
          message = error
        }))
      })

    } else if (save.doc) {

      var data = save.data
      if (!data.id && !save.doc && !save.id) data.id = generate({ length: 20 })
      if (!data["creation-date"]) {
        data["creation-date"] = (new Date()).getTime()
        data.timezone = "GMT"
      }

      global.promises.push(ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`

      }).catch(error => {

        success = false
        message = error
      }))
    }
    
    await global.promises[global.promises.length - 1]
    _data = { data: save.data, success, message }

  } else {
    
    delete save.data
    
    headers.timestamp = (new Date()).getTime()
    var { data: _data } = await require("axios").post(`/${store}`, { save, data: _data }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })
  }

  view.save = global.save = _data
  if (store === "confirmEmail") view.confirmEmail = _data

  if (!_window) console.log(_data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, params })
}

module.exports = { save }