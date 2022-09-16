const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { getCookie } = require("./cookie")

const func = async ({ _window, id = "", req, _, __, res, e, ...params }) => {
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id], data = {}
  var func = params.func || {}
  var headers = clone(func.headers || {})
  headers.project = headers.project || global.projectId
  delete func.headers
  if (!_window && getCookie()) func.cookies = getCookie()
  
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (_window) {

    var functions = global.data.project.functions
    if (!functions[func.function]) return
    if (functions[func.function].includes("send()"))
      functions[func.function] = functions[func.function].replace("send()", "")

    var _func = toCode({ _window, string: functions[func.function] })
    toParam({ _window, string: _func, req, res, _: func.data, __ })

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

  if (data.params) {
    data.params = toCode({ _window, string: data.params, e })
    params = { ...toParam({ _window, id, e, string: data.params, asyncer: true, _, __, req, res }), params }
  }
  
  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res }) 
}

module.exports = { func }