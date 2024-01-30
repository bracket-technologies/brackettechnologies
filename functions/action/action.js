const action = async ({ _window, lookupActions, stack, address, id = "root", req, __, res, e, action = {} }) => {

  var global = _window ? _window.global : window.global

  // headers
  var headers = action.headers || {}
  var store = action.store || "action"
  headers.project = headers.project || global.manifest.projectID

  // headers
  headers = { ...headers, timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }

  var { data } = await require("axios").post(`/${store}`, { action }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })
  
  // await
  require("./toAwait").toAwait({ _window, lookupActions, address, stack, id, e, req, res, _: data, __ })
}

module.exports = { action }