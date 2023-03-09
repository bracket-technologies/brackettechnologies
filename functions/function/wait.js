const wait = async ({ id, e, lookupActions, awaits, ...params }) => {

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, lookupActions, awaits, e, params })
}

module.exports = { wait }