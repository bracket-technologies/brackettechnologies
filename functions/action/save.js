const axios = require('axios')
const { postData } = require('./database')

module.exports = {
  save: async ({ _window, lookupActions, stack, address, id = "root", req, res, e, __, save = {} }) => {
      
    var global = _window ? _window.global : window.global

    var data
    var headers = save.headers || {}
    var store = save.store || "database"
    headers.project = headers.project || global.manifest.projectID

    if (!save.collection) return console.log("No collection!")

    // headers
    headers = { ...headers, timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }
    
    if (_window) {
      
      data = await postData({ _window, req, res, save })

    } else {

      var response = await axios.post(save.url || `/${store}`, { save }, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })

      data = response.data
    }

    // console.log("SAVE", (new Date()).getTime() - headers.timestamp, save.collection, data)
    
    // await
    require("./toAwait").toAwait({ _window, lookupActions, stack, id, address, e, req, res, _: data, __ })
  }
}