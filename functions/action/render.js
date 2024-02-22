const { toView } = require("./toView");
const { addresser } = require("./addresser");
const { logger } = require("./logger");
const { toAwait } = require("./toAwait");
const { getData } = require("./database");
const cssStyleKeyNames = require("./cssStyleKeyNames")

require("dotenv").config();

const render = async ({ _window, id, req, res, stack, address, lookupAction, data }) => {

    var global = _window.global
    var __ = global.__

    // get route view from database
    if (data.view === "route") {

        // views
        var { data: view } = await getData({ _window, req, res, search: { collection: "view", doc: "route" } })
        global.data.view[view.id] = view
    }
    
    // view does not exist
    if (!data.view || !global.data.view[data.view]) return res.end("Page not found!")

    // view
    var view = global.data.view[data.view]

    // log start render
    if (data.view === "route") {

        logger({ _window, data: { key: "render", start: true } })

        // address: log end render
        address = addresser({ _window, id, type: "function", file: "logger", function: "logger", headAddress: address, stack, __, data: { key: "render", end: true } }).address

        view = { ...view, __customView__: "route", __viewPath__: ["route"], __customViewPath__: ["route"], __lookupViewActions__: [{ type: "customView", view: "route" }] }
    }

    // address: start toView
    address = addresser({ _window, id, type: "function", status: "Start", function: "toView", headAddress: address, stack, renderer: true, __ }).address

    toView({ _window, req, res, stack, __, address, lookupAction, data: { view, parent: data.parent } })
}

const document = async ({ _window, res, stack, address, __ }) => {

    var { global, views } = _window
    var page = global.manifest.page
    var view = views[global.manifest.page] || {}

    // head tags
    var language = global.language = view.language || view.lang || "en"
    var direction = view.direction || view.dir || (language === "ar" || language === "fa" ? "rtl" : "ltr")
    var title = view.title || "Bracket App Title"

    // favicon
    var favicon = views.document.favicon && views.document.favicon.url
    var faviconType = favicon && views.document.favicon.type

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

    logger({ _window, data: { key: "document", end: true } })

    toAwait({ _window, stack, address })

    // clear secure view actions
    Object.values(global.data.view).map(view => {
        if (view._secure_) {
            view.view = ""
            view.children = []
            clearActions(view.functions)
        }
    })
    
    res.end(
        `<!DOCTYPE html>
        <html lang="${language}" dir="${direction}" class="html">
            <head>
                <!-- css -->
                <link rel="stylesheet" href="/route/resource/index.css"/>
                ${views.document.stylesheet ? `
                    <style>
                    ${Object.entries(views.document.stylesheet).map(([key, value]) => typeof value === "object" && !Array.isArray(value)
                    ? `${key}{
                        ${Object.entries(value).map(([key, value]) => `${cssStyleKeyNames[key] || key}: ${value.toString().replace(/\\/g, '')}`).join(`;
                        `)};
                    }` : "").filter(style => style).join(`
                    `)}
                    </style>` : ""}
                
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
                
                <!-- head tags -->
                ${(views.document.links || []).map(link => !link.body ? `<link ${link.rel ? `rel="${link.rel}"` : ""} ${link.type ? `type="${link.type}"` : ""} href="${link.href}" />` : "").join("")}

            </head>
            <body>
                <!-- body tags -->
                ${(views.document.links || []).map(link => link.body ? `<link ${link.rel ? `rel="${link.rel}"` : ""} ${link.type ? `type="${link.type}"` : ""} href="${link.href}" />` : "").join("")}

                <!-- html -->
                ${views.body.__html__ || ""}

                <!-- engine -->
                <script src="/route/resource/engine.js"></script>

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

const clearActions = (data) => {
    if (typeof data !== "object") return
    Object.entries(data || {}).map(([action, mapAction]) => {
        if (typeof mapAction === "object") return clearActions(mapAction)
        data[action] = ""
    })
}

module.exports = { render, document, clearActions }

/* 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.min.js"></script>
*/