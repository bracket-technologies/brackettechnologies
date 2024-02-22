const { parseCookies } = require('./cookie');

const detector = new (require('node-device-detector'))({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

const initializer = ({ id, req, res, path, data: { firebaseDB, firebaseStorage, mongoDB } }) => {

    req.db = { firebaseDB, mongoDB }
    req.storage = { firebaseStorage }

    // parse cookies
    parseCookies(req)
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // action
    req.body.action = req.body.action || {}

    // path
    path = decodeURI(req.url).split("/")
    
    // 
    var page = path[1] || "main"
    var host = req.headers['x-forwarded-host'] || req.headers.host || req.headers.referer
    var __ = req.body.action.__ || []
    var action = path[1] === "route"

        // action is database()
        ? (path[2] === "database" ? "database()"  

        // action is storage()
        : path[2] === "storage" ? "storage()"  
        
        // action is action_name()
        : path[2] === "action" ? req.body.action.name
        
        // action is render()
        : path[2] === "render" ? req.body.action.name : "") 
        
        // view is document
        : "document"

    var global = {
        __,
        __queries__: { views: [] },
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
            host,
            page,
            path,
            action,
            os: req.headers["sec-ch-ua-platform"],
            browser: req.headers["sec-ch-ua"],
            country: req.headers["x-country-code"],
            headers: req.headers,
            cookies: req.cookies,
            device: detector.detect(req.headers['user-agent'])
        },
        data: { view: {} }
    }

    var views = { [id]: { id } }
    var _window = { views, global }

    // log
    console.log(req.method, path.join("/"), req.body.action.name || "");

    return _window
}

module.exports = { initializer }