const { getdb, postdb, deletedb } = require("./database")
const { getFile, postFile, deleteFile } = require("./storage")
const { sendConfirmationEmail } = require("./sendConfirmationEmail")
const { execFunction } = require("./execFunction")
const { generate } = require("./generate")
const { authorizer } = require("./authorizer")
const { projector } = require('./projector')
const { contactNumberHandler, generateQRCode } = require("./contactNumberHandler")
const { toCode } = require("./toCode")
const { isParam } = require("./isParam")
const { toParam } = require("./toParam")
const { getLocalFile } = require("./storageLocal")

require("dotenv").config();

const detector = new (require('node-device-detector'))({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const initialize = ({ req, res, id }) => {

  return {
    global: {
      timer: new Date().getTime(),
      __firstLoad__: true,
      __waiters__: [],
      __actionReturns__: [],
      __codes__: {},
      __timeOnServer__: {
        ref: (new Date()).getDay(),
        start: 0,
      },
      __package__: {},
      promises: {},
      breakCreateElement: {},
      host: req.headers['x-forwarded-host'] || req.headers.host,
      data: { project: {}, server: {} },
      device: detector.detect(req.headers['user-agent'])
    },
    views: { backend: {}, "my-views": [], [id]: {} }
  }
}

module.exports = ({ app, db, storage, rdb }) => {

  // post
  app.post("*", async (req, res) => {

    var path = req.url.split("/")
    console.log("POST", path);

    var id = generate()
    var _window = initialize({ req, res, id }), __ = []

    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // check host
    if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })

    // authorize
    var { success, message, error } = await authorizer({ window: _window, req })
    if (!success) return res.send({ success, message, error })

    // action
    if (path[1] === "action") return execFunction({ _window, req, res, id, __ })

    // confirmEmail
    if (path[1] === "confirmEmail") return sendConfirmationEmail({ _window, req, res, id, __ })

    // storage
    if (path[1] === "storage") return postFile({ _window, req, res, id, __ })

    // database
    if (path[1] === "database") return postdb({ _window, req, res, id, __ })
  })

  // delete
  app.delete("*", async (req, res) => {

    var path = req.url.split("/")
    console.log("DELETE", path);

    var id = generate()
    var _window = initialize({ req, res, id }), __ = []

    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // check host
    if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })

    // authorize
    var { success, message, error } = await authorizer({ window: _window, req })
    if (!success) return res.send({ success, message, error })

    // storage
    if (path[1] === "storage") return deleteFile({ _window, req, res, id, __ })

    // database
    if (path[1] === "database") return deletedb({ _window, req, res, id, __ })
  })

  // get
  app.get("*", async (req, res) => {

    var path = req.url.split("/")
    console.log("GET", path);

    var id = generate()
    var _window = initialize({ req, res, id })

    res.status(200)
    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    if (path[1] === "generateQRCode") return generateQRCode({ req, res, _window })

    if (path[1] === "contactNumber") return contactNumberHandler({ req, res, _window })

    // favicon
    if (path[1] === "favicon.ico") return res.sendStatus(204)

    // resources
    if (path[1] === "resources") return getLocalFile({ _window, req, res, id })

    // check host
    if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })

    // authorize
    var { success, message, error } = await authorizer({ window: _window, req })
    if (!success) return res.send({ success, message, error })

    // init __
    var __ = []
    var encodedPath = toCode({ _window, string: toCode({ _window, string: decodeURI(req.url), start: "'", end: "'" }) })
    var encodedPathList = encodedPath.split("/")
    if (isParam({ _window, string: encodedPathList[encodedPathList.length - 1] }))
      __ = [toParam({ _window, string: encodedPathList[encodedPathList.length - 1], req, res, id })]

    // storage
    if (path[1] === "storage") return getFile({ _window, req, res, id, __ })

    // database
    if (path[1] === "database") return getdb({ _window, req, res, id, __ })

    // projector
    return projector({ _window, req, res, id, __ })
  })
}