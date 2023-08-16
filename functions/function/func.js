const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { getCookie } = require("./cookie")
const { toArray } = require("./toArray")

const func = async ({ _window, lookupActions, awaits, myawait, oldlookupActions, id = "root", req, _, __, ___, res, e, ...params }) => {
  
  const { toParam } = require("./toParam")
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
    
    var myfn = func.actions || clone(global.data.project.functions[func.function])

    if (!myfn) return
    
    if (typeof myfn === "object") myfn = myfn._ || ""
    var _func = toCode({ _window, string: toCode({ _window, string: myfn }), start: "'", end: "'" })
    toParam({ _window, lookupActions, awaits, id, string: _func, req, res, _: func.data ? func.data : _, __: func.data ? _ : __, ___: func.data ? __ : ___ })

    // await params
    if (awaits.findIndex(i => i.id === myawait.id) === 0) {

      if (myawait) {

        require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, myawait, awaits, req, res,  _: global.func ? global.func : _, __: global.func ? _ : __, ___: global.func ? __ : ___ })

      } else {

        awaits.splice(awaits.findIndex(i => i.id === myawait.id), 1)
        console.log(myawait.log)
      }
    }
    
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
        if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions: oldlookupActions, myawait, awaits, id, e, ...params, req, res,  _: global.func, __: _, ___: __ })
        resolve()
      })
    )
  }
}

module.exports = { func }