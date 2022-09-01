var { clone } = require("./clone")

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
    
    var collection = save.collection, success, message
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  
    var ref = req.db.collection(collection)
    if (Array.isArray(save.data)) {

      save.data.map(data => {

        global.promises.push(ref.doc(data.id.toString()).set(data).then(() => {

          success = true
          message = `Document saved successfuly!`
    
        }).catch(error => {
    
          success = false
          message = error
        }))
      })

    } else if (save.doc) {

      global.promises.push(ref.doc(save.doc.toString() || save.id.toString() || save.data.id.toString()).set(save.data).then(() => {

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
    
    var { data: _data } = await require("axios").post(`/${store}`, { save, data: _data }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })
  }

  if (!view) return
  if (store === "confirmEmail") view.confirmEmail = _data
  else view.save = global.save = _data

  if (!_window) console.log(_data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, params })
}

module.exports = { save }