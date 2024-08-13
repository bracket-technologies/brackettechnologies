const { authorizer } = require("./authorizer")
const { getLocalFile } = require("./storageLocal")
const { openStack, endStack } = require("./stack")
const { database, isNumber, respond, actions } = require("./kernel")
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

module.exports = ({ req, res }) => {

  var path = decodeURI(req.url).split("/"), id = "server"

  // storage/resources
  if (path[1] === "storage") return getLocalFile({ req, res })

  // initialize
  var { _window, success, message } = initializer({ id, req, res, path })
  if (!success) return respond({ res, __, response: { success, message } }) // wrong host

  var global = _window.global, __ = global.__

  // authorize
  var { success, message, error } = authorizer({ _window, req, res })
  if (!success) return respond({ res, __, response: { success, message, error } }) // not auth

  // open stack
  var {stack, address} = openStack({ _window, id, event: req.method.toLowerCase(), server: global.manifest.server, action: global.manifest.action })

  // get view view
  var { data } = database({ _window, req, res, stack, props: {}, action: "search()", preventDefault: true, data: { collection: "view", doc: "server" } })
  
  // init view
  var view = { ...data, __customView__: "server", __viewPath__: ["server"], __customViewPath__: ["server"] }

  // lookup actions
  view.__lookupActions__ = [...global.__lookupActions__, { doc: "server", collection: "view" }]

  // log start render
  logger({ _window, data: { key: "server", start: true } })

  // address toView
  var address = actions["addresser()"]({ _window, id, status: "Start", type: "function", function: "toView", stack, nextAddress: address, props: {}, __, data: { view }, logger: { key: "server", end: true } }).address

  // render view
  actions["view()"]({ _window, req, res, stack, props: { rendering: true }, __, address, lookupActions: view.__lookupActions__, data: { view } })

  // end stack
  endStack({ _window, stack })
}

const checkHost = ({ _window, global, host }) => {
  
  // host is ip:port
  if (host.split(":")[1]) {

    var port = host.split(":")[1]
    if (isNumber(port)) port = parseInt(port)
    else return ({ success: false, message: "Wrong port number!" })

    global.manifest.port = port

    // get host
    var { data: host } = database({ _window, action: "search()", data: { db: bracketDB, collection: "host", findOne: { port } } })
    
    // wrong port
    if (!host) return ({ success: false, message: "Port number is not registered!" })
  }

  // check host
  else {

    // get host
    var { data: host } = database({ _window, action: "search()", data: { db: bracketDB, collection: "host", findOne: { localhost: host } } })
    
    // not registered host
    if (!host) return ({ success: false, message: "Host is not registered!" })
  }

  // publicID
  global.manifest.publicID = host.publicID
  if (host.dev) global.manifest.dev = true

  return { success: true }
}

const initializer = ({ id, req, res }) => {

  // parse cookies (req.headers.cookies coming from client request)
  var host = req.headers['x-forwarded-host'] || req.headers.host || req.headers.referer
  var __ = req.body.data !== undefined ? [req.body.data] : []
  var props = req.body.__props__ || {}
  var lookupServerActions = props.lookupServerActions ? req.body.data : false
  var lookupActions = props.lookupActions || []
  var path = props.path || decodeURI(req.url).split("/")
  var page = props.page || path[1] || "main"
  var server = props.server || "renderer"
  var action = req.body.action || "document()"

  // cookies
  parseCookies(req, host)

  var global = {
      __,
      __lookupActions__: lookupActions,
      __authorized__: {},
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
          lookupServerActions,
          os: req.headers["sec-ch-ua-platform"],
          browser: req.headers["sec-ch-ua"],
          cookies: req.cookies,
          device: detector.detect(req.headers['user-agent']),
          // geo: lookup(req.network.public)
      },
      data: { view: {} }
  }

  var views = { [id]: { id } }
  var _window = { views, global }

  // check host
  var { success, message } = checkHost({ host, _window, global })
  if (!success) return ({ success, message })

  // log
  console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + req.method, path.join("/"), action || "");

  return { _window, success: true }
}