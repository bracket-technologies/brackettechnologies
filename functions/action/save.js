const axios = require('axios')
const { postData } = require('./database')

module.exports = {
  save: async ({ _window, lookupActions, stack, address, id, req, res, e, __, save = {} }) => {

    var data
    var headers = save.headers || {}

    if (!save.collection) return console.log("No collection!")

    // headers
    headers = { ...headers, timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }
    
    if (_window) {
      
      data = await postData({ _window, req, res, save })

    } else {

      var response = await axios.post(save.url || `/route/database`, { save }, {
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