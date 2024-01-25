const { toValue } = require('./toValue');
const { toCode } = require('./toCode');
const { generate } = require('./generate');

const detector = new (require('node-device-detector'))({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

const initializer = ({ req, res, stack, data: { db, storage, rdb } }) => {

    console.log(req.method, req.url);

    req.db = db
    req.storage = storage
    req.rdb = rdb
    req.cookies = JSON.parse(req.cookies.__session || "{}")

    // 
    var id = generate()
    var path = decodeURI(req.url).split("/")
    var page = path[1] || "main"
    var host = req.headers['x-forwarded-host'] || req.headers.host || req.headers.referer

    var global = {
        __: [],
        __refs__: {},
        __events__: {},
        __calcTests__: {},
        __serverActions__: {},
        __frequentLogs__: {},
        __prevPage__: ["main"],
        __page__: page,
        __prevPath__: ["/"],
        __html__: { body: "", head: "" },
        manifest: {
            id,
            path,
            host,
            page,
            os: req.headers["sec-ch-ua-platform"],
            browser: req.headers["sec-ch-ua"],
            country: req.headers["x-country-code"],
            headers: req.headers,
            cookies: req.cookies,
            device: detector.detect(req.headers['user-agent'])
        },
        data: {
            view: {
                root: {
                    view: "View:root",
                    children: [{
                        view: "manifest:().page"
                    }]
                },
                middleware: {
                    view: "View:middleware",
                    children: [{
                        view: "manifest:().action"
                    }]
                }
            },
            collection: {}
        },
        path: path.join("/"),
        promises: {},
        breakCreateElement: {},
    }

    var views = { [id]: { id } }
    var _window = { views, global }

    // __
    var data = toCode({ _window, id, string: toCode({ _window, id, string: decodeURI(req.url), start: "'" }) })
    global.__.push(toValue({ _window, data: data.split("/").pop(), req, res, stack, id, __: [] }))

    return _window
}

module.exports = { initializer }