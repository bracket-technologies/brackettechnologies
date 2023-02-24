const wait = async ({ id, e, lookupActions, ...params }) => {

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, lookupActions, e, params })
}

module.exports = { wait }