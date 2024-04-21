const { parseCookies } = require('./cookie');
const { lookup } = require('geoip-lite');

// config
require('dotenv').config()

const detector = new (require('node-device-detector'))({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

const initializer = ({ id, req, res, path, data: { firebaseDB, firebaseStorage, mongoDB } }) => {

    req.datastore = { firebaseDB, mongoDB }
    req.storage = { firebaseStorage }

    // parse cookies (req.headers.cookies coming from client request)
    parseCookies(req)
    req.cookies = JSON.parse(req.headers.cookies || req.headers.cookie || "{}")

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

    // privateIP:port
    if (host.split(":")[0] === req.network.private)
        host = req.network.servers.find(server => server.port === parseInt(host.split(":")[1] || "80")).Lhost

    // subdomain.loca.lt
    else if (req.network.servers.find(server => server.Thost === host))
        host = req.network.servers.find(server => server.Thost === host).Lhost

    var global = {
        __,
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
            type,
            server,
            host,
            page,
            path,
            route,
            action: type === "action" && req.body.data.action.slice(0, -2),
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

    // log
    console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + req.method, path.join("/"), req.body.route.action || "");

    return _window
}

module.exports = { initializer }