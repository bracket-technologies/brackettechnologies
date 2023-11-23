const axios = require("axios");
const { clone } = require("./clone");
const { deleteData } = require("./database");
const { toArray } = require("./toArray");
const { jsonToBracket } = require("./jsonToBracket")

const erase = async ({ _window, lookupActions, awaits, req, res, id, e, __, ...params }) => {

  var global = _window ? _window.global : window.global
  var view = _window ? _window.views[id] : window.views[id]
  var erase = params.erase || {}
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId
  var store = erase.store || "database"
  
  erase.docs = toArray(erase.doc || erase.docs || erase.id || (erase.data && clone(toArray(erase.data.map(data => data.id)))))

  if (_window) {
    
    var data = await deleteData({ _window, req, res, erase })
    
    view.erase = global.erase = clone(data)
    console.log("erase", data)
  
    if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req , res, id, e, _: data, __: [data, ...(params.myawait.__ || __)], ...params })

  } else {

    // erase
    headers.erase = encodeURI(jsonToBracket({ erase }))

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
  
    if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req , res, id, e, _: data, __, ...params })
  }
}

module.exports = { erase }