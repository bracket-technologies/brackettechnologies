const action = async ({ _window, lookupActions, stack, address, id = "root", req, __, res, e, action = {}, ...params }) => {

  var global = _window ? _window.global : window.global

  // headers
  var headers = action.headers || {}
  var store = action.store || "action"
  headers.project = headers.project || global.projectID

  // headers
  headers = { ...headers, timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }

  var { data } = await require("axios").post(`/${store}`, { action }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  console.log("SERVER", (new Date()).getTime() - headers.timestamp, action.name + "()", data)
  
  // await
  require("./toAwait").toAwait({ _window, lookupActions, address, stack, id, e, req, res, _: data, __, ...params })
}

module.exports = { action }