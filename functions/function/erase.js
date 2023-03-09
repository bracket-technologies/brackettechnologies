const axios = require("axios");
const { clone } = require("./clone");
const { deleteData } = require("./database");
const { toArray } = require("./toArray");
const { toString } = require("./toString")

const erase = async ({ _window, lookupActions, req, res, id, e, _, __, ___, ...params }) => {

  var global = _window ? _window.global : window.global
  var view = _window ? _window.views[id] : window.views[id]
  var erase = params.erase || {}
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId
  var store = erase.store || "database"
  
  erase.docs = toArray(erase.doc || erase.docs || erase.id || (erase.data && clone(toArray(erase.data.map(data => data.id)))))

  if (_window) {
    
    var data = await deleteData({ req, res, erase })

    view.erase = global.erase = clone(data)
    console.log("erase", data)
  
    if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req , res, id, e, _: data, __: _, ___: __, ...params })

  } else {

    // erase
    headers.erase = encodeURI(toString({ erase }))

    headers["timestamp"] = (new Date()).getTime()
    headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

    // access key
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

    var { data } = await axios.delete(`/${store}`, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })

    view.erase = global.erase = clone(data)
    console.log("erase", data)
  
    if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req , res, id, e, _: data, __: _, ___: __, ...params })
  }
}

module.exports = { erase }