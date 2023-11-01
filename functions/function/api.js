const { getdb, postdb, deletedb } = require("./database")
const { getFile, postFile, deleteFile } = require("./storage")
const { sendConfirmationEmail } = require("./sendConfirmationEmail")
const { execFunction } = require("./execFunction")
const { generate } = require("./generate")
const { authorizer } = require("./authorizer")
const DeviceDetector = require('node-device-detector')
const router = require('./router')
const { contactNumberHandler, generateQRCode } = require("./contactNumberHandler")
const { toCode } = require("./toCode")
const { isParam } = require("./isParam")
const { toParam } = require("./toParam")
const Global = { today: (new Date()).getDay(), functions: {} }

require("dotenv").config();

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const initialize = ({ req, res, id }) => {
  console.log(req.headers['user-agent']);
  return {
    global: { 
      timer: new Date().getTime(),
      __waiters__: [],
      __actionReturns__: [],
      codes: {}, 
      promises: {}, 
      innerHTML: {}, 
      breakCreateElement: {}, 
      host: req.headers['x-forwarded-host'] || req.headers.host,
      data: { project: {}, server: {} },
      device: /*deviceDetector(req.headers['user-agent'])*/detector.detect(req.headers['user-agent'])
    }, 
    views: { backend: {}, "my-views": [], [id]: {} },
    __PACKAGE__: {},
    actions: {},
  }
}

module.exports = ({ app, db, storage, rdb }) => {

    // post
    app.post("*", async (req, res) => {
        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        var path = req.url.split("/"), i = 1, id = generate()
        var _window = initialize({ req, res, id }), __ = []
        console.log("POST", path); 
  
        // authorize
        if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })
        var {success, message, error} = await authorizer({ window: _window, req })
        if (!success) return res.send({ success, message, error })
        
        // action
        if (path[i] === "action") return execFunction({ _window, req, res, id, __ })

        // confirmEmail
        if (path[i] === "confirmEmail") return sendConfirmationEmail({ _window, req, res, id, __ })

        // storage
        if (path[i] === "storage") return postFile({ _window, req, res, id, __ })

        // database
        if (path[i] === "database") return postdb({ _window, req, res, id, __ })
    })

    // delete
    app.delete("*", async (req, res) => {

        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        var path = req.url.split("/"), i = 1, id = generate()
        var _window = initialize({ req, res, id }), __ = []
        console.log("DELETE", path);
  
        // authorize
        if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })
        var {success, message, error} = await authorizer({ window: _window, req })
        if (!success) return res.send({ success, message, error })

        // storage
        if (path[i] === "storage") return deleteFile({ _window, req, res, id, __ })

        // database
        if (path[i] === "database") return deletedb({ _window, req, res, id, __ })
    })

    // get
    app.get("*", async (req, res) => {
 
        res.status(200)
        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        
        var path = req.url.split("/"), i = 1, id = generate()
        var _window = initialize({ req, res, id })
        console.log("GET", path);

        if (path[1] === "generateQRCode") return generateQRCode({ req, res, _window })

        if (path[1] === "contactNumber") return contactNumberHandler({ req, res, _window })

        // favicon
        if (req.url === "/favicon.ico") return res.sendStatus(204)

        // resources
        if (path[i] === "resources") return require("./storageLocal").getFile({ _window, req, res, id })
  
        // authorize
        if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })
        var {success, message, error} = await authorizer({ window: _window, req })
        if (!success) return res.send({ success, message, error })

        var __ = [], encodedPath = toCode({ _window, string: toCode({ _window, string: decodeURI(req.url), start: "'", end: "'" }) }), encodedPathList = encodedPath.split("/")
        if (isParam({ _window, string: encodedPathList[encodedPathList.length - 1] })) {
          __ = [toParam({ _window, string: encodedPathList[encodedPathList.length - 1], req, res, id })]
        }

        // storage
        if (path[i] === "storage") return getFile({ _window, req, res, id, __ })

        // database
        if (path[i] === "database") return getdb({ _window, req, res, id, __ })
        
        // respond
        return router.app({ _window, req, res, id, __ })
    })
}