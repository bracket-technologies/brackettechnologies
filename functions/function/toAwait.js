const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const toAwait = ({ _window, lookupActions, awaits = [], myawait, id, e, req, res, _, __, ___, asyncer, awaiter }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!asyncer) return
  var _params, keepGoingOn = true
  var global = _window ? _window.global : window.global

  if (myawait) {
    
    var _await_ = toCode({ _window, string: toCode({ _window, string: myawait.await }), start: "'", end: "'" })

    var conditions = _await_.split("?")[1], approved = true
    if (conditions) {
      approved = toApproval({ _window, string: conditions, e, id, req, res, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), awaits, lookupActions })
    }

    _await_ = _await_.split("?")[0]

    if (approved) _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, _, __, ___, req, res, ...((awaits.find(item => item.id === myawait.id) || {}).params || {}) })

    var index = awaits.findIndex(item => item.id === myawait.id)
    if (index !== -1) {

      if (awaits[index].log) console.log(awaits[index].log);
      awaits.splice(index, 1)
    }
  }

  // get params
  while (awaits.length > 0 && keepGoingOn) {
  
    var _await = awaits[0]
    if (keepGoingOn) keepGoingOn = !_await.hold
    if (keepGoingOn) {

      if (_await.await) {

        var _await_ = toCode({ _window, string: toCode({ _window, string: _await.await }), start: "'", end: "'" })
        var __params = _await.passGlobalFuncData ? { _: global.func ? global.func : _, __: global.func ? _ : __, ___: global.func ? __ : ___ } : { _, __, ___ }

        var conditions = _await_.split("?")[1], approved = true
        if (conditions)
          approved = toApproval({ _window, string: conditions, e, id, req, res, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), awaits, lookupActions })

        _await_ = _await_.split("?")[0]

        if (approved) _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, ...__params, req, res, ...(_await.params || {}) })
      }
      
      if (_await.log) console.log(_await.log);
      
      var index = toArray(awaits).findIndex(item => item.id === _await.id)
      if (index !== -1) toArray(awaits).splice(index, 1)
      if (index !== 0) keepGoingOn = false
    }
  }

  if (_params && _params.break) return

  // override params
  if (awaiter) execute({ _window, lookupActions, awaits, id, e, actions: awaiter, params: _params, _, __, ___, req, res})
}

module.exports = {toAwait}