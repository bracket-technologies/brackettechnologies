const wait = async ({ id, e, ...params }) => {

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, e, params })
}

module.exports = { wait }