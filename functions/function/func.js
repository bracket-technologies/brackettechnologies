const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { getCookie } = require("./cookie")
const { toAwait } = require("./toAwait")
const { toArray } = require("./toArray")

const func = async ({ _window, lookupActions, awaits, oldlookupActions, id = "root", req, _, __, ___, res, e, ...params }) => {
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id]
  var func = params.func || {}
  var headers = clone(func.headers || {})
  headers.project = headers.project || global.projectId

  headers["timestamp"] = (new Date()).getTime()
  headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

  delete func.headers
  if (!_window && getCookie()) func.cookies = getCookie()
  global.promises[id] = toArray(global.promises[id])
  
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (_window) {
    
    var functions = global.data.project.functions
    var myfn = clone(functions[func.function])
    
    if (!myfn) return
    
    if (typeof myfn === "object") myfn = myfn._ || ""
    var _func = toCode({ _window, string: toCode({ _window, string: myfn }), start: "'", end: "'" })
    toParam({ _window, lookupActions, awaits, id, string: _func, req, res, _: func.data ? func.data : _, __: func.data ? _ : __, ___: func.data ? __ : ___ })
    
    await Promise.all(global.promises[id] || [])
    await Promise.all(global.promises[id] || [])
    await Promise.all(global.promises[id] || [])
    await Promise.all(global.promises[id] || [])
    
    // await params
  
    console.log(params.func, global.func)
    if (params.asyncer) toAwait({ _window, lookupActions: oldlookupActions, awaits, id, e, ...params, req, res,  _: global.func ? global.func : _, __: global.func ? _ : __, ___: global.func ? __ : ___ }) 

  } else {
    
    global.promises[id].push(
      new Promise(async (resolve) => {

        console.log("Action execution requested!");
        
        var { data } = await require("axios").post(`/action`, func, {
          headers: {
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
            ...headers
          }
        })

        if (view) view.function = view.func = clone(data)
        global.function = global.func = clone(data)
  
        console.log(params.func, global.func, awaits)
    
        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions: oldlookupActions, awaits, id, e, ...params, req, res,  _: global.func, __: _, ___: __ })
        resolve()
      })
    )
  }

  /*if (data.params) {
    data.params = toCode({ _window, lookupActions, awaits, string: data.params, e })
    params = { ...toParam({ _window, lookupActions, awaits, id, e, string: data.params, asyncer: true, _: data, __: _, ___: __, req, res }), params }
  }*/
}

module.exports = { func }