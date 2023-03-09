const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const toAwait = ({ _window, lookupActions, awaits = [], myawait, id, e, req, res, _, __, ___, asyncer, awaiter }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!asyncer) return
  var _params, keepGoingOn = true
console.log("here", myawait, awaits.findIndex(item => item.await === myawait), clone(awaits));
  var _await_ = toCode({ _window, string: toCode({ _window, string: myawait }), start: "'", end: "'" })
  _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, _, __, ___, req, res })
  awaits.splice(awaits.findIndex(item => item.await === myawait), 1)

  // get params
  if (!awaits.find(item => item.hold)) {
    toArray(awaits).map((_await, i) => {
      
      if (keepGoingOn) {

        var _await_ = toCode({ _window, string: toCode({ _window, string: _await.await }), start: "'", end: "'" })
        _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, _, __, ___, req, res })
        
        var index = toArray(awaits).findIndex(item => item.await === _await.await)
        if (index !== -1) toArray(awaits).splice(index, 1)
        if (index !== i) keepGoingOn = false
        console.log("here", index, _await, clone(awaits));
      }
    })
  }

  if (_params && _params.break) return

  // override params
  if (awaiter) execute({ _window, lookupActions, awaits, id, e, actions: awaiter, params: _params, _, __, ___, req, res})
}

module.exports = {toAwait}