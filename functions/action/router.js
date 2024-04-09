const { authorizer } = require("./authorizer")
const { getLocalFile } = require("./storageLocal")
const { initializer } = require("./initializer")
const { openStack, endStack } = require("./stack")
const { getData } = require("./database")
const { toView } = require("./kernel")
const { addresser } = require("./kernel")
const { logger } = require("./logger")

module.exports = async ({ req, res, data }) => {

  var path = decodeURI(req.url).split("/"), id = "route"

  // resource
  if (path[2] === "resource") return getLocalFile({ req, res })

  // initialize
  var _window = initializer({ id, req, res, path, data })

  // authorize
  var { success, message, error } = await authorizer({ _window, req, res })
  
  // not authorized
  if (!success) {
    // respond
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ success, message, error }))
    return res.end()
  }

  var global = _window.global

  // database
  if (global.manifest.server === "database") return require("./database").database({ _window, req, res, id })

  // storage
  if (global.manifest.server === "storage") return require("./storage").storage({ _window, req, res, id })

  // open stack
  var stack = openStack({ _window, id, event: req.method.toLowerCase(), server: global.manifest.server, route: global.manifest.route })

  // get route view
  var { data } = await getData({ _window, req, res, search: { collection: "view", doc: "route" } })
  global.data.view.route = data

  // init view
  var view = { ...global.data.view.route, __customView__: "route", __viewPath__: ["route"], __customViewPath__: ["route"], __lookupActions__: [{ type: "customView", view: "route" }] }

  // log start render
  logger({ _window, data: { key: "route", start: true } })

  // address toView
  var address = addresser({ _window, id, status: "Start", type: "function", function: "toView", stack, __: global.__, data: { view }, logger: { key: "route", end: true } }).address

  // render route
  toView({ _window, req, res, stack, __: global.__, address, lookupActions: view.__lookupActions__, data: { view } })

  // end stack
  endStack({ _window, stack })
}