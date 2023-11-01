const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { getCookie } = require("./cookie")
const { toArray } = require("./toArray")

const func = async ({ _window, lookupActions, awaits, myawait, id = "root", req, __, res, e, ...params }) => {
  
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
    global.__waiters__.unshift(myawait.id)
    toParam({ _window, lookupActions, awaits, id, string: _func, req, res, __: [...(func.data ? [func.data] : []), ...__] })
    global.__waiters__.splice(0, 1)
    myawait.hold = false

    // await params
    if (awaits.findIndex(i => i.id === myawait.id) === 0) {
      
      if (myawait) {

        require("./toAwait").toAwait({ _window, lookupActions: myawait.lookupActions, id, e, asyncer: true, myawait, awaits, req, res,  __: [...(global.data ? [global.data] : []), ...__] })

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
  
        console.log(params.func, global.func, awaits, myawait)
        
        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions: myawait.lookupActions, myawait, awaits, id, e, ...params, req, res, __: [global.func, ...__] })
        resolve()
      })
    )
  }
}

module.exports = { func }