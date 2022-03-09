const { clone } = require("./clone")
const { override } = require("./merge")

module.exports = {
  toAwait: ({ id, e, params = {} }) => {

    const { execute } = require("./execute")
    const { toParam } = require("./toParam")

    if (!params.asyncer) return
    
    var awaiter = clone(params.awaiter), awaits = clone(params.await), _params

    delete params.asyncer
    delete params.awaiter
    delete params.await
    
    // get params
    if (awaits && awaits.length > 0) _params = toParam({ id, e, string: awaits.join(";"), mount: true })
    if (_params.break) return

    // override params
    if (_params) params = override(params, _params)


    if (awaiter) execute({ id, e, actions: awaiter, params })
  }
}
