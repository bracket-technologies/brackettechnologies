const { getCookie, setCookie } = require('./cookie')

module.exports = {
  search: async ({ _window, lookupActions, stack, id, req, res, e, __, data: search = {}, address }) => {
    
    var data

    // headers
    var headers = { ...(search.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }
    
    if (_window) {

      data = await require('./database').getData({ _window, req, res, search })

    } else {

      headers.cookies = JSON.stringify(getCookie())
      var response = await require('axios').post(`/`, { server: "database", type: "search", data: search }, { headers })

      data = response.data
    }
    
    // await params
    require("./kernel").toAwait({ _window, lookupActions, stack, id, e, address, req, res, _: data, __ })
  }
}