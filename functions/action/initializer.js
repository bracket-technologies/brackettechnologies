const { parseCookies } = require('./cookie');
const { lookup } = require('geoip-lite');
const { checkHost } = require('./kernel');

// config
require('dotenv').config()

const detector = new (require('node-device-detector'))({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

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

module.exports = { initializer }