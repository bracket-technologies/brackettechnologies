const { getdb, postdb, deletedb } = require("./database")
const { getFile, postFile, deleteFile } = require("./storage")
const { serverActionExecuter } = require("./serverActionExecuter")
const { generate } = require("./generate")
const { authorizer } = require("./authorizer")
const { projector } = require('./projector')
const { toCode } = require("./toCode")
const { getLocalFile } = require("./storageLocal")
const { toValue } = require("./toValue")

require("dotenv").config();

const detector = new (require('node-device-detector'))({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const initialize = ({ req, res, id }) => {

  var _window = {
    global: {
      __: [],
      __waitAdds__: [],
      __returnAdds__: [],
      __refs__: {},
      __package__: {},
      __path__: decodeURI(req.url).split("/"),
      __events__: {},
      promises: {},
      breakCreateElement: {},
      host: req.headers['x-forwarded-host'] || req.headers.host,
      data: { project: {}, server: {} },
      device: detector.detect(req.headers['user-agent'])
    },
    views: { [id]: { id } }
  }

  // init __
  var data = toCode({ _window, id, string: toCode({ _window, id, string: decodeURI(req.url), start: "'" }) })
  _window.global.__.unshift(toValue({ _window, data: data.split("/").pop(), req, res, id }))

  return _window
}

module.exports = ({ app, db, storage, rdb }) => {

  // post
  app.post("*", async (req, res) => {

    console.log("POST", req.url);

    var id = generate()
    var _window = initialize({ req, res, id })
    var { __path__: path, __ } = _window.global

    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // check host
    if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })

    // authorize
    var { success, message, error } = await authorizer({ _window, req })
    if (!success) return res.send({ success, message, error })

    // action
    if (path[1] === "action") return serverActionExecuter({ _window, req, res, id, __ })

    // storage
    if (path[1] === "storage") return postFile({ _window, req, res, id, __ })

    // database
    if (path[1] === "database") return postdb({ _window, req, res, id, __ })
  })

  // delete
  app.delete("*", async (req, res) => {

    console.log("DELETE", req.url);

    var id = generate()
    var _window = initialize({ req, res, id })
    var { __path__: path, __ } = _window.global

    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // check host
    if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })

    // authorize
    var { success, message, error } = await authorizer({ _window, req })
    if (!success) return res.send({ success, message, error })

    // storage
    if (path[1] === "storage") return deleteFile({ _window, req, res, id, __ })

    // database
    if (path[1] === "database") return deletedb({ _window, req, res, id, __ })
  })

  // get
  app.get("*", async (req, res) => {

    console.log("GET", req.url);

    var id = generate(), __ = []
    var _window = initialize({ req, res, id })
    var { __path__: path, __ } = _window.global

    // find host
    if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })

    // favicon
    if (path[1] === "favicon.ico") return res.sendStatus(204)

    // resource
    if (path[1] === "resource") return getLocalFile({ req, res, id })

    res.status(200)
    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // authorize
    var { success, message, error } = await authorizer({ _window, req })
    if (!success) return res.send({ success, message, error })

    // action
    if (path[1] === "action") return serverActionExecuter({ _window, req, res, id, __, getRequest: true })

    // storage
    if (path[1] === "storage") return getFile({ _window, req, res, id, __ })

    // database
    if (path[1] === "database") return getdb({ _window, req, res, id, __ })

    // projector
    return projector({ _window, req, res, id, __ })
  })
}