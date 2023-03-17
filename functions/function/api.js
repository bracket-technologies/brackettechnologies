const { getdb, postdb, deletedb } = require("./database")
const { getFile, postFile, deleteFile } = require("./storage")
const { sendConfirmationEmail } = require("./sendConfirmationEmail")
const { execFunction } = require("./execFunction")
const { generate } = require("./generate")
const { authorizer } = require("./authorizer")
const DeviceDetector = require('node-device-detector')
const router = require('./router')
const Global = { today: (new Date()).getDay(), functions: {} }

require("dotenv").config();

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  // ... all options scroll to Setter/Getter/Options
});

/*const deviceDetector = (details) => {

  var device = {
    os: {},
    client: {},
    device: {}
  }

  if (details.includes("Mobile")) device.device.type = "mobile"
  else device.device.type = "desktop"
  return device
}*/

const initialize = ({ req, res, id }) => {
  console.log(req.headers['user-agent']);
  return {
    global: { 
      timer: new Date().getTime(),
      codes: {}, 
      promises: {}, 
      innerHTML: {}, 
      breakCreateElement: {}, 
      host: req.headers.host || req.headers.referer,
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
        var _window = initialize({ req, res, id })
        console.log("POST", path); 
  
        // authorize
        if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })
        var {success, message, error} = await authorizer({ window: _window, req })
        if (!success) return res.send({ success, message, error })

        // bracket
        /*if (req.headers.project === "bracket") {

        // storage
        if (path[i] === "storage") return require("./storageLocal").postFile({ req, res })

        // database
        if (path[i] === "database") return require("./databaseLocal").postdb({ req, res })
        }*/
        
        // action
        if (path[i] === "action") return execFunction({ _window, req, res, id })

        // confirmEmail
        if (path[i] === "confirmEmail") return sendConfirmationEmail({ _window, req, res, id })

        // storage
        if (path[i] === "storage") return postFile({ _window, req, res, id })

        // database
        if (path[i] === "database") return postdb({ _window, req, res, id })
    })

    // delete
    app.delete("*", async (req, res) => {

        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        var path = req.url.split("/"), i = 1, id = generate()
        var _window = initialize({ req, res, id })
        console.log("DELETE", path);
  
        // authorize
        if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })
        var {success, message, error} = await authorizer({ window: _window, req })
        if (!success) return res.send({ success, message, error })

        // bracket
        /*if (req.headers.project === "bracket") {

        // storage
        if (path[i] === "storage") return require("./storageLocal").deleteFile({ req, res })

        // database
        if (path[i] === "database") return require("./databaseLocal").deletedb({ req, res })
        }*/

        // storage
        if (path[i] === "storage") return deleteFile({ _window, req, res, id })

        // database
        if (path[i] === "database") return deletedb({ _window, req, res, id })
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

        // favicon
        if (req.url === "/favicon.ico") return res.sendStatus(204)

        /*var host = req.headers["x-forwarded-host"] || req.headers["host"]
        
        // bracket
        if (myHost.includes(host)) {
        
        // storage & resources
        if (path[1] === "storage") return require("./storageLocal").getFile({ req, res })

        // database
        if (path[1] === "database") return require("./databaseLocal").getdb({ req, res })
        }*/

        // resources
        if (path[i] === "resources") return require("./storageLocal").getFile({ _window, req, res, id })
  
        // authorize
        if (!_window.global.host) return res.send({ success: false, message: "Host does not exist!" })
        var {success, message, error} = await authorizer({ window: _window, req })
        if (!success) return res.send({ success, message, error })

        // storage
        if (path[i] === "storage") return getFile({ _window, req, res, id })

        // database
        if (path[i] === "database") return getdb({ _window, req, res, id })
        
        // respond
        return router.app({ _window, req, res, id })
    })
}