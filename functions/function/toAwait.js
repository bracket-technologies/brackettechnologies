const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { decode } = require("./decode")

const toAwait = ({ _window, lookupActions, awaits = [], myawait, id, e, req, res, _, __, ___, asyncer, awaiter }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!asyncer) return
  var _params, keepGoingOn = true

  if (myawait) {

    var _await_ = toCode({ _window, string: toCode({ _window, string: myawait }), start: "'", end: "'" })
    _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, _, __, ___, req, res })
    if (awaits.findIndex(item => item.await === myawait) !== -1) console.log(awaits.find(item => item.await === myawait).log);
    awaits.splice(awaits.findIndex(item => item.await === myawait), 1)
  }

  // get params
  toArray(awaits).map((_await, i) => {
  
    if (keepGoingOn) keepGoingOn = !_await.hold

    if (keepGoingOn) {

      if (_await.log) console.log(_await.log);

      var _await_ = toCode({ _window, string: toCode({ _window, string: _await.await }), start: "'", end: "'" })
      _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, _, __, ___, req, res, ...(_await.params || {}) })
      
      var index = toArray(awaits).findIndex(item => item.await === _await.await)
      if (index !== -1) toArray(awaits).splice(index, 1)
      if (index !== i) keepGoingOn = false
    }
  })

  if (_params && _params.break) return

  // override params
  if (awaiter) execute({ _window, lookupActions, awaits, id, e, actions: awaiter, params: _params, _, __, ___, req, res})
}

module.exports = {toAwait}