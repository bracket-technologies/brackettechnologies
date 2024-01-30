const axios = require('axios')
const { jsonToBracket } = require('./jsonToBracket')
const { getData } = require('./database')

module.exports = {
  search: async ({ _window, lookupActions, stack, id = "root", req, res, e, __, data: search = {}, address }) => {
      
    var global = _window ? _window.global : window.global
    var store = search.store || "database", data

    if (!search.collection) return console.log("No collection!")

    // headers
    var headers = search.headers || {}
    headers.project = headers.project || global.manifest.projectID
    headers = { ...headers, search: encodeURI(jsonToBracket({ search })), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }
    
    if (_window) {

      data = await getData({ _window, req, res, search })

    } else {

      var response = await axios.get(search.url || `/${store}`, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })

      data = response.data
    }

    // console.log("SEARCH", (new Date()).getTime() - headers.timestamp, search.collection, data)

    // await params
    require("./toAwait").toAwait({ _window, lookupActions, stack, id, e, address, req, res, _: data, __ })
  }
}