const wait = async ({ id, e, lookupActions, stack, ...params }) => {

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, lookupActions, stack, e, params })
}

module.exports = { wait }