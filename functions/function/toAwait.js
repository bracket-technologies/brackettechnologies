module.exports = {
  toAwait: ({ id, e, params = {} }) => {

    const { execute } = require("./execute")
    const { toParam } = require("./toParam")
    
    if (!params.asyncer) return
    var awaiter = params.awaiter, awaits = params.await, _params

    delete params.asyncer
    delete params.awaiter
    delete params.await

    // get params
    awaits = require("./toCode").toCode({ string: awaits, e })
    if (awaits && awaits.length > 0) _params = toParam({ id, e, string: awaits, asyncer: true })
    if (_params && _params.break) return

    // override params
    if (_params) params = { ...params, ..._params }
    if (awaiter) execute({ id, e, actions: awaiter, params })
  }
}
