const axios = require("axios")
const { deleteData } = require("./database")
const { jsonToBracket } = require("./jsonToBracket")

const erase = async ({ _window, lookupActions, stack, req, res, id, e, __, erase = {}, ...params }) => {

  var global = _window ? _window.global : window.global

  var data
  var headers = erase.headers || {}
  var store = erase.store || "database"
  headers.project = headers.project || global.projectID

  if (!erase.collection) return console.log("No collection!")

  // headers
  headers = { ...headers, erase: encodeURI(jsonToBracket({ erase })), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }
  
  if (_window) {

    data = await deleteData({ _window, req, res, erase })

  } else {

    var response = await axios.delete(`/${store}`, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })

    data = response.data
  }

  // console.log("ERASE", (new Date()).getTime() - headers.timestamp, erase.collection, data)

  // stack
  require("./toAwait").toAwait({ _window, lookupActions, stack, id, e, ...params, req, res, _: data, __ })
}

module.exports = { erase }