const axios = require('axios')
const { postData } = require('./database')
const { getCookie, setCookie } = require('./cookie')

module.exports = {
  save: async ({ _window, lookupActions, stack, address, id, req, res, e, __, save = {} }) => {

    var data

    // headers
    var headers = { ...(save.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }
    
    if (_window) {
      
      data = await postData({ _window, req, res, save })

    } else {

      headers.cookies = JSON.stringify(getCookie())
      var response = await axios.post(`/`, { server: "database", type: "save", data: save }, { headers })

      data = response.data
    }

    // console.log("SAVE", (new Date()).getTime() - headers.timestamp, save.collection, data)
    
    // await
    require("./kernel").toAwait({ _window, lookupActions, stack, id, address, e, req, res, _: data, __ })
  }
}