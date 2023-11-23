const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const toAwait = ({ _window, lookupActions, awaits = [], myawait, id, e, req, res, __, _, asyncer, awaiter, ...params }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!asyncer) return
  var keepGoingOn = true
  var global = _window ? _window.global : window.global

  if (myawait && myawait.await) awaitHandler({ _window, myawait, req, res, lookupActions, awaits, id, e, _, __, ...params })

  // get params
  while (awaits.length > 0 && keepGoingOn) {
  
    var _await = awaits[0]
    if (keepGoingOn) keepGoingOn = !_await.hold
    if (keepGoingOn) {

      if (_await.await) {

        var _await_ = toCode({ _window, string: toCode({ _window, string: _await.await }), start: "'", end: "'" })
        var my__ = _await.params.__ || __
        //var my__ = _await.passGlobalFuncData ? [...(global.func ? [global.func] : []), ...((_await.params || {}).__ || __)] : ((_await.params || {}).__ || __)

        var conditions = _await_.split("?")[1], approved = true
        if (conditions) approved = toApproval({ _window, string: conditions, e, id, req, res, __: my__, awaits, lookupActions })

        _await_ = _await_.split("?")[0]

        if (_await.waiter) global.__waiters__.unshift(_await.waiter)
        if (approved) toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, req, res, ...(_await.params || {}), __: my__ })
        if (_await.waiter) global.__waiters__.splice(0, 1)

        if (_await.log) console.log(_await.log);
      }
      
      var index = toArray(awaits).findIndex(item => item.id === _await.id)
      if (index !== -1) toArray(awaits).splice(index, 1)
      if (index !== 0) keepGoingOn = false

      if (_await.waiter) console.log("STACK", _await.action, clone(awaits).reverse().map((z, i) => ([i, z.action, "hold: " + (z.hold || "false"), "wait: " + (z.await || "X"), "id: " + z.id, "waiter: " + (z.waiter || "X")])));
      //if (_await.waiter && awaits.length > 0 && awaits[0].id === _await.waiter) awaits[0].hold = false
   }
  }

  // override params
  if (awaiter) execute({ _window, lookupActions, awaits, id, e, actions: awaiter, params, __, req, res})
}

const awaitHandler = ({_window, req, res, myawait, lookupActions, awaits, id, e, _, __, ...params }) => {
  
  var global = _window ? _window.global : window.global
  const { toParam } = require("./toParam")

  if (myawait.await) {
    var _params, _await_ = toCode({ _window, string: toCode({ _window, string: myawait.await, start: "'", end: "'" }) })
    var my__ = (!myawait.passGlobalFuncData && _ !== undefined) ? [_, ...(myawait.params.__ || __)] : (myawait.params.__ || __)

    var conditions = _await_.split("?")[1], approved = true
    if (conditions) approved = toApproval({ _window, string: conditions, e, id, req, res, awaits, lookupActions, ...params, ...(myawait.params || {}), __: my__ })

    _await_ = _await_.split("?")[0]
    var _params = myawait.params
    var index = awaits.findIndex(item => item.id === myawait.id)

    if (index !== -1) {

      if (awaits[index].log) console.log(awaits[index].log);
      awaits.splice(index, 1)
    }
    
    if (myawait.waiter) global.__waiters__.unshift(myawait.waiter)
    if (approved) _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, req, res, ...params, ...(myawait.params || {}), __: my__ })
    if (myawait.waiter) global.__waiters__.splice(0, 1)
  }

  console.log("STACK", myawait.action, clone(awaits).reverse().map((z, i) => ([i, z.action, "hold: " + (z.hold || "false"), "wait: " + (z.await || "X"), "id: " + z.id, "waiter: " + (z.waiter || "X")])));
  //if (myawait.waiter && awaits.length > 0 && awaits[0].id === myawait.waiter) { awaits[0].hold = false }
}

module.exports = { toAwait }