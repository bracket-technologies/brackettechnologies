const { parseCookies } = require('./cookie');

const detector = new (require('node-device-detector'))({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

const initializer = ({ id, req, res, path, data: { firebaseDB, firebaseStorage, mongoDB } }) => {

    req.datastore = { firebaseDB, mongoDB }
    req.storage = { firebaseStorage }
    
    // parse cookies
    parseCookies(req)
    req.cookies = JSON.parse(req.headers.cookies || req.cookies.__session || "{}")

    // action
    req.body.route = req.body.route || {}

    // path
    path = decodeURI(req.url).split("/")
    
    // 
    var host = req.headers['x-forwarded-host'] || req.headers.host || req.headers.referer
    var page = path[1] || "main"

    var __ = (req.body.data || {}).__ || []
    var server = req.body.server || "render"
    var type = req.body.type
    var route = type === "action" ? req.body.data.action
        
        // route to view
        : type === "route" ? req.body.data.route

        // documenter
        : "document"

    if (host === "192.168.10.204") host = "acc.localhost"
    else if (host === "192.168.10.204:8080") host = "localhost"

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
            datastore: "bracketDB",
            type,
            server,
            host,
            page,
            path,
            route,
            action: type === "action" && req.body.data.action,
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
    console.log(req.method, path.join("/"), req.body.route.action || "");

    return _window
}

module.exports = { initializer }