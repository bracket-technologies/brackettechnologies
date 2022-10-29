const { getdb, postdb, deletedb } = require("./database")
const { getFile, postFile, deleteFile } = require("./storage")
const router = require('./router')
const { sendConfirmationEmail } = require("./sendConfirmationEmail")
const { execFunction } = require("./execFunction")
const Global = { today: (new Date()).getDay(), functions: {} }

module.exports = ({ app, db, storage, rdb }) => {

    // post
    app.post("*", (req, res) => {

        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        var path = req.url.split("/"), i = 1

        // bracket
        /*if (req.headers.project === "bracket") {

        // storage
        if (path[i] === "storage") return require("./storageLocal").postFile({ req, res })

        // database
        if (path[i] === "database") return require("./databaseLocal").postdb({ req, res })
        }*/
        
        // function
        if (path[i] === "action") return execFunction({ req, res })

        // confirmEmail
        if (path[i] === "confirmEmail") return sendConfirmationEmail({ req, res })

        // storage
        if (path[i] === "storage") return postFile({ req, res })

        // database
        if (path[i] === "database") return postdb({ req, res })
    })

    // delete
    app.delete("*", (req, res) => {

        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        var path = req.url.split("/"), i = 1

        // bracket
        /*if (req.headers.project === "bracket") {

        // storage
        if (path[i] === "storage") return require("./storageLocal").deleteFile({ req, res })

        // database
        if (path[i] === "database") return require("./databaseLocal").deletedb({ req, res })
        }*/

        // storage
        if (path[i] === "storage") return deleteFile({ req, res })

        // database
        if (path[i] === "database") return deletedb({ req, res })
    })

    // get
    app.get("*", async (req, res) => {

        res.status(200)
        req.db = db
        req.global = Global
        req.storage = storage
        req.rdb = rdb
        
        req.cookies = JSON.parse(req.cookies.__session || "{}")
        
        var path = req.url.split("/"), i = 1
        /*var host = req.headers["x-forwarded-host"] || req.headers["host"]
        
        // bracket
        if (myHost.includes(host)) {
        
        // storage & resources
        if (path[1] === "storage") return require("./storageLocal").getFile({ req, res })

        // database
        if (path[1] === "database") return require("./databaseLocal").getdb({ req, res })
        }*/
        
console.log(path);
        // resources
        if (path[i] === "resources") return require("./storageLocal").getFile({ req, res })
        
        // storage
        // if (path[i] === "image") return require("./getImage").getImage({ req, res })

        // storage
        if (path[i] === "storage") return getFile({ req, res })

        // database
        if (path[i] === "database") return getdb({ req, res })

        // favicon
        if (req.url === "/favicon.ico") return res.sendStatus(204)
        
        // respond
        return router.app({ req, res })
    })
}