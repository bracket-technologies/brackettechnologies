const { getCookie } = require("./cookie");

const route = async ({ _window, lookupActions, stack, address, id, req, __, res, e, data: { type, route = {} } }) => {

  // headers
  var headers = { ...(route.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }

  // route
  headers.cookies = JSON.stringify(getCookie())
  var { data } = await require("axios").post(`/route`, { server: "render", type, data: route }, { headers })
  
  // await
  require("./kernel").toAwait({ _window, lookupActions, address, stack, id, e, req, res, _: data, __ })
}

module.exports = { route }