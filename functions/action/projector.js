const { toView } = require("./toView");
const { getJsonFiles } = require("./jsonFiles");
const { toArray } = require("./toArray");
const { addresser } = require("./addresser");
const { timerLogger } = require("./logger");

require("dotenv").config();

const initViews = ({ _window }) => {

    _window.views = {
        document: {
            id: "document",
            __indexing__: 0,
            __childrenRef__: [],
            __viewPath__: []
        },
        body: {
            id: "body",
            view: "View",
            __parent__: "document",
            __indexing__: 0,
            __childrenRef__: [],
            __viewPath__: [],
            children: [...toArray((_window.global.data.project.browser || {}).children), { view: "root" }]
        }
    }
}

const getProject = async ({ _window, req }) => {

    var { global } = _window
    var promises = []
    timerLogger({ _window, data: { key: "view", start: true } })
    timerLogger({ _window, data: { key: "collection", start: true } })

    // views
    promises.push(req.db
        .collection(`view-${global.data.project.id}`)
        .get()
        .then(q => {
            q.forEach(doc => {
                global.data.view[doc.id] = { ...doc.data(), id: doc.id }
            })
            timerLogger({ _window, data: { key: "view", end: true } })
        }))

    // collections
    promises.push(req.db
        .collection(`collection-${global.data.project.id}`)
        .get()
        .then(q => {
            q.forEach(doc => {
                global.data.collection[doc.id] = { ...doc.data(), id: doc.id }
            })
            timerLogger({ _window, data: { key: "collection", end: true } })
        }))

    await Promise.all(promises)

    // get shared public views
    Object.entries(getJsonFiles({ search: { collection: "public" } })).map(([doc, data]) => {
        
        if (global.data.view[doc]) return
        global.data.view[doc] = { ...data, id: doc }
        global.data.view.root.children.unshift({ view: doc })
    })
}

const renderer = ({ _window, req, res, stack, __ }) => {

    var { global, views } = _window, page = global.manifest.page, dots = global.__dots__

    timerLogger({ _window, data: { key: "render", start: true } })

    if (!global.data.view[page]) return res.send("Page not found!")

    // documenter
    addresser({ _window, id: "document", type: "function", status: "Wait", file: "projector", function: "documenter", stack, renderer: true, action: "documenter()", __, dots }).address

    var address = addresser({ _window, id: "document", type: "function", status: "Wait", file: "logger", function: "timerLogger", stack, __, dots, data: { key: "render", end: true } }).address
    
    // render
    toView({ _window, req, res, stack, __, dots, address, data: { view: views.body, parent: "document" } })
}

const documenter = async ({ _window, res, stack }) => {

    var { global, views } = _window
    var page = global.manifest.page
    var view = views[global.manifest.page] || {}

    // head tags
    var favicon = global.data.project.favicon
    var faviconType = global.data.project.faviconType
    var language = global.language = view.language || view.lang || "en"
    var direction = view.direction || view.dir || (language === "ar" || language === "fa" ? "rtl" : "ltr")
    var title = view.title || "Bracket App Title"

    // meta
    view.meta = view.meta || {}
    var metaHTTPEquiv = view.meta["http-equiv"] || view.meta["httpEquiv"] || {}
    if (typeof metaHTTPEquiv !== "object") metaHTTPEquiv = {}
    if (!metaHTTPEquiv["content-type"]) metaHTTPEquiv["content-type"] = "text/html; charset=UTF-8"
    var metaKeywords = view.meta.keywords || ""
    var metaDescription = view.meta.description || ""
    var metaTitle = view.meta.title || view.title || ""
    var metaViewport = view.meta.viewport || ""

    delete global.data.project

    // logs
    global.__server__.logs = stack.logs

    timerLogger({ _window, data: { key: "documentation", end: true } })

    res.send(
        `<!DOCTYPE html>
        <html lang="${language}" dir="${direction}" class="html">
            <head>
                <!-- css -->
                <link rel="stylesheet" href="/resource/index.css"/>
                <link rel="manifest" href="/resource/manifest.json" mimeType="application/json; charset=UTF-8"/>
                
                <!-- Font -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400&display=swap">
                
                <!-- title -->
                <title>${title}</title>
                
                <!-- meta -->
                ${metaHTTPEquiv ? Object.entries(metaHTTPEquiv).map(([key, value]) => `<meta http-equiv="${key}" content="${value}">
                `) : ""}
                <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                <meta name="viewport" content= "width=device-width, initial-scale=1.0">
                ${metaViewport ? `<meta name="viewport" content="${metaViewport}">` : ""}
                ${metaKeywords ? `<meta name="keywords" content="${metaKeywords}">` : ""}
                ${metaDescription ? `<meta name="description" content="${metaDescription}">` : ""}
                ${metaTitle ? `<meta name="title" content="${metaTitle}">` : ""}
                
                <!-- favicon -->
                ${favicon ? `<link rel="icon" type="image/${faviconType || "x-icon"}" href="${favicon}"/>` : `<link rel="icon" href="data:,">`}
                
                <!-- views & global -->
                <script id="views" type="application/json">${JSON.stringify(views)}</script>
                <script id="global" type="application/json">${JSON.stringify(global)}</script>
                
                <!-- Location -->
                ${global.__updateLocation__ ? `<script defer>window.history.replaceState({}, "${title}", "/${page === "main" ? "" : page}")</script>` : ""}
                
                <!-- head tags -->
                ${global.__html__.head || ""}
            </head>
            <body>
                <!-- body tags -->
                ${global.__html__.body || ""}

                <!-- html -->
                ${views.root.__html__ || ""}

                <!-- engine -->
                <script src="/resource/engine.js"></script>

                <!-- google icons -->
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"/>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

                <!-- html2pdf -->
                <script src="https://cdn.jsdelivr.net/npm/js-html2pdf@1.1.4/lib/html2pdf.min.js"></script>
            </body>
        </html>`
    )
}

const projector = async ({ _window, req, res, stack, __ }) => {
    
    timerLogger({ _window, data: { key: "documentation", start: true } })
    
    initViews({ _window })
    await getProject({ _window, req, res, stack, __ })
    
    if (res.headersSent) return
    renderer({ _window, req, res, stack, __ })
}

module.exports = { getProject, initViews, renderer, projector, documenter }

/* 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.min.js"></script>
*/