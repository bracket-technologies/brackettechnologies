const { toCode } = require("./toCode")

const toAwait = ({ _window, id, e, params = {}, req, res, _, __, ___ }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!params.asyncer) return
  var awaiter = params.awaiter, awaits = params.await, _params

  delete params.asyncer
  delete params.awaiter
  delete params.await

  // get params
  awaits = toCode({ _window, string: awaits, e })
  awaits = toCode({ _window, string: awaits, e, start: "'", end: "'" })
  if (awaits && awaits.length > 0) _params = toParam({ _window, id, e, string: awaits, asyncer: true, _, __, ___, req, res })
  if (_params && _params.break) return

  // override params
  if (_params) params = { ...params, ..._params }
  if (awaiter) execute({ _window, id, e, actions: awaiter, params, _, __, ___, req, res})
}

module.exports = {toAwait}