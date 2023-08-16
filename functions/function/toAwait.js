const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const toAwait = ({ _window, lookupActions, awaits = [], myawait, id, e, req, res, _, __, ___, asyncer, awaiter, ...params }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!asyncer) return
  var keepGoingOn = true
  var global = _window ? _window.global : window.global

  if (myawait && myawait.await) awaitHandler({_window, myawait, req, res, lookupActions, awaits, id, e, _, __, ___, ...params })

  // get params
  while (awaits.length > 0 && keepGoingOn) {
  
    var _await = awaits[0]
    if (keepGoingOn) keepGoingOn = !_await.hold
    if (keepGoingOn) {

      if (_await.await) {

        var _await_ = toCode({ _window, string: toCode({ _window, string: _await.await }), start: "'", end: "'" })
        var __params = _await.passGlobalFuncData ? { _: global.func ? global.func : _, __: global.func ? _ : __, ___: global.func ? __ : ___ } : { _, __, ___ }

        var conditions = _await_.split("?")[1], approved = true
        if (conditions) approved = toApproval({ _window, string: conditions, e, id, req, res, _, __, ___, awaits, lookupActions })

        _await_ = _await_.split("?")[0]

        if (approved) toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, ...__params, req, res, ...(_await.params || {}) })
      
        if (_await.log) console.log(_await.log);
      }
      
      var index = toArray(awaits).findIndex(item => item.id === _await.id)
      if (index !== -1) toArray(awaits).splice(index, 1)
      if (index !== 0) keepGoingOn = false

      if (_await.waiter) console.log("STACK", awaits.map(z => ([z.action, "id: " + z.id, "waiter: " + z.waiter])));
      if (_await.waiter && awaits.length > 0 && awaits[0].id === _await.waiter) awaits[0].hold = false
   }
  }

  // override params
  if (awaiter) execute({ _window, lookupActions, awaits, id, e, actions: awaiter, params: _params, _, __, ___, req, res})
}

const awaitHandler = ({_window, req, res, myawait, lookupActions, awaits, id, e, _, __, ___, ...params }) => {
  
  const { toParam } = require("./toParam")

  if (!myawait.await) return
  var _params, _await_ = toCode({ _window, string: toCode({ _window, string: myawait.await, start: "'", end: "'" }) })

  var conditions = _await_.split("?")[1], approved = true
  if (conditions) {
    approved = toApproval({ _window, string: conditions, e, id, req, res, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), awaits, lookupActions, ...params })
  }

  _await_ = _await_.split("?")[0]
  
  var index = awaits.findIndex(item => item.id === myawait.id)
  if (index !== -1) {

    if (awaits[index].log) console.log(awaits[index].log);
    awaits.splice(index, 1)
  }
  
  if (approved) _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, _, __, ___, req, res, ...params, ...((awaits.find(item => item.id === myawait.id) || {}).params || {}) })

  if (myawait.waiter) console.log("STACK", awaits.map(z => ([z.action, "id: " + z.id, "waiter: " + z.waiter])));
  if (myawait.waiter && awaits.length > 0 && awaits[0].id === myawait.waiter) {
    awaits[0].hold = false
  }
}

module.exports = {toAwait}