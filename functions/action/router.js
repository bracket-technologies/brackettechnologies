const { authorizer } = require("./authorizer")
const { render } = require('./render')
const { getLocalFile } = require("./storageLocal")
const { initializer } = require("./initializer")
const { openStack, endStack } = require("./stack")

require("dotenv").config();

module.exports = (data) => {
  
  data.server.all("*", async (req, res) => {

    var path = decodeURI(req.url).split("/"), id = "route"

    // resource
    if (path[2] === "resource") return getLocalFile({ req, res })

    // initialize
    var _window = initializer({ id, req, res, path, data })

    // authorize
    var { success, message, error } = await authorizer({ _window, req })

    // not authorized
    if (!success) return res.send({ success, message, error })

    // open stack
    var stack = openStack({ _window, id, event: req.method.toLowerCase(), server: true, action: _window.global.manifest.action })

    // render
    await render({ _window, req, res, stack, id, data: { view: "route" } })

    // end stack
    endStack({ _window, stack, end: true })
  })
}