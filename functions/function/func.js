const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const func = async ({ _window, id = "", req, res, e, ...params }) => {
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id], data = {}
  var func = params.func || {}
  var headers = clone(func.headers || {})
  var project = headers.project = headers.project || global.projectId
  delete func.headers
  
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (_window) {
    
    if (!global.projectFunctions[func.function]) return
    if (global.projectFunctions[func.function].includes("send()"))
      global.projectFunctions[func.function] = global.projectFunctions[func.function].replace("send()", "")

    var _func = toCode({ _window, string: global.projectFunctions[func.function] })
    toParam({ _window, string: _func, req, res, _: func.data })

  } else {
    
    var { data: _data } = await require("axios").post(`/function`, func, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })

    data = _data
  }

  if (view) view.function = view.func = clone(data)
  global.function = global.func = clone(data)
  console.log(data)
  if (data.message === "Force reload!") return location.reload()
  
  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res }) 
}

module.exports = { func }