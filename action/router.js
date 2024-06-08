const { authorizer } = require("./authorizer")
const { getLocalFile } = require("./storageLocal")
const { openStack, endStack } = require("./stack")
const { toView, database, addresser, isNumber, getData } = require("./kernel")
const { logger } = require("./logger")
const { parseCookies } = require("./cookie")
// config
require('dotenv').config()

// project DB
var bracketDB = process.env.BRACKETDB

const detector = new (require('node-device-detector'))({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
})

module.exports = async ({ req, res }) => {

  var path = decodeURI(req.url).split("/"), id = "router"

  // resource
  if (path[2] === "resource") return getLocalFile({ req, res })

  // initialize
  var { _window, success, message } = await initializer({ id, req, res, path })
  if (!success) return respond({ res, success, message }) // wrong host

  // authorize
  var { success, message, error } = await authorizer({ _window, req, res })
  if (!success) return respond({ res, success, message, error }) // not auth

  var global = _window.global

  // open stack
  var stack = openStack({ _window, id, event: req.method.toLowerCase(), server: global.manifest.server, action: global.manifest.action })

  // get router view
  var { data } = await database({ _window, req, res, stack, action: "search()", preventDefault: true, data: { collection: "view", doc: "router" } })
  global.__queries__.view.router = data
  
  // init view
  var view = { ...data, __customView__: "router", __viewPath__: ["router"], __customViewPath__: ["router"] }

  // lookup actions
  view.__lookupActions__ = [...global.__lookupActions__, { doc: "router", collection: "view" }]

  // log start render
  logger({ _window, data: { key: "router", start: true } })

  // address toView
  var address = addresser({ _window, id, status: "Start", type: "function", function: "toView", stack, __: global.__, data: { view }, logger: { key: "router", end: true } }).address

  // render router
  toView({ _window, req, res, stack, __: global.__, address, lookupActions: view.__lookupActions__, data: { view } })

  // end stack
  endStack({ _window, stack })
}

const checkHost = async ({ global, host }) => {
  
  // host is ip:port
  if (host.split(":")[1]) {

    var port = host.split(":")[1]
    if (isNumber(port)) port = parseInt(port)
    else return ({ success: false, message: "Wrong port number!" })

    global.manifest.port = port

    // get host
    var { data } = await getData({ search: { db: bracketDB, collection: "host", find: { port: { inc: port } }, limit: 1 } })
    
    // wrong port
    if (!Object.values(data || {})[0]) return ({ success: false, message: "Port number is not registered!" })
  }

  // check host
  else {

    // get host
    var { data } = await getData({ search: { db: bracketDB, collection: "host", find: { localhost: host }, limit: 1 } })
    
    // not registered host
    if (!Object.values(data || {})[0]) return ({ success: false, message: "Host is not registered!" })
  }

  var host = Object.values(data || {})[0]

  // publicID
  global.manifest.publicID = host.publicID
  if (host.dev) global.manifest.dev = true

  return { success: true }
}

const initializer = async ({ id, req, res }) => {

  // parse cookies (req.headers.cookies coming from client request)
  parseCookies(req)
  req.cookies = JSON.parse(req.headers.cookies || req.headers.cookie || "{}")
  
  var __ = req.body.data && (req.body.data.data !== undefined ? [req.body.data.data] : []) || []
  var __lookupActions__ = req.body.data && req.body.data.lookupActions || []

  // 
  var host = req.headers['x-forwarded-host'] || req.headers.host || req.headers.referer
  var path = req.body.path || decodeURI(req.url).split("/")
  var page = req.body.page || path[1] || "main"
  var server = req.body.server || "render"
  var action = req.body.action || "document"

  var global = {
      __,
      __lookupActions__,
      __queries__: { view: {} },
      __stacks__: {},
      __refs__: {},
      __events__: {},
      __calcTests__: {},
      __startAddresses__: {},
      __page__: page,
      __prevPage__: ["main"],
      __prevPath__: ["/"],
      __document__: { body: "", head: "" },
      __server__: { startTime: (new Date()).getTime() },

      //
      path: path.join("/"),
      manifest: {
          datastore: "bracketDB",
          server,
          host,
          page,
          path,
          action,
          os: req.headers["sec-ch-ua-platform"],
          browser: req.headers["sec-ch-ua"],
          cookies: req.cookies,
          device: detector.detect(req.headers['user-agent']),
          // geo: lookup(req.network.public)
      },
      data: { view: {} }
  }

  // check host
  var { success, message } = await checkHost({ host, global })
  if (!success) return ({ success, message })

  var views = { [id]: { id } }
  var _window = { views, global }

  // log
  console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + req.method, path.join("/"), action || "");

  return { _window, success: true }
}

const respond = ({ res, success, message, error }) => {
  
  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success, message, error }))
  return res.end()
}