const { toView } = require("./toView");
const { clone } = require("./clone");
const { getJsonFiles } = require("./jsonFiles");

require("dotenv").config();

const initializer = ({ _window }) => {

    _window.views = {
        html: {
            id: "html",
            __childrenID__: []
        },
        body: {
            id: "body",
            view: "View",
            parent: "html",
        },
        root: {
            id: "root",
            view: "View",
            parent: "body",
            style: { backgroundColor: "#fff", position: "relative" },
        },
        public: {
            id: "public",
            view: "View",
            parent: "body"
        }
    }
}

const getProject = async ({ _window, req }) => {

    var global = _window.global, promises = [], timer = (new Date()).getTime()

    // get shared public views
    Object.entries(getJsonFiles({ search: { collection: "public" } })).map(([doc, data]) => {
        global.data.view[doc] = { ...data, id: doc }
    })

    // views
    promises.push(req.db
        .collection(`view-${global.data.project.id}`)
        .get()
        .then(q => {
            q.forEach(doc => {
                global.data.view[doc.id] = { ...doc.data(), id: doc.id }
            })
            console.log("VIEW", new Date().getTime() - timer)
        }))

    // collections
    promises.push(req.db
        .collection(`collection-${global.data.project.id}`)
        .get()
        .then(q => {
            q.forEach(doc => {
                global.data.collection[doc.id] = { ...doc.data(), id: doc.id }
            })
            console.log("COLLECTION", new Date().getTime() - timer)
        }))

    return await Promise.all(promises)
}

const interpreter = async ({ _window, req, res, stack, __ }) => {

    var { global, views } = _window, currentPage = global.manifest.currentPage, timer = (new Date()).getTime()

    if (!global.data.view[currentPage]) return res.send("Page not found!")

    // views
    views.root.children = [{ view: currentPage }]
    views.public.children = Object.values(global.data.view).filter(view => view.__public__).map(publicView => ({ view: publicView.id }))
    views.body.children = [views.public, views.root]

    // tags
    global.data.project.browser = global.data.project.browser || {}
    global.data.project.browser.children = global.data.project.browser.children || []
    global.data.project.browser.view = global.data.project.browser.view || global.data.project.browser.type || "html"

    views.html = { ...views.html, ...global.data.project.browser }

    // tags
    await toView({ _window, id: "html", req, res, stack, __ })

    // views
    var innerHTML = await toView({ _window, id: "body", req, res, stack, __ })

    console.log("RENDER", (new Date()).getTime() - timer)

    // html was updated by update or route
    if (!global.__html__) global.__html__ = innerHTML

    return innerHTML
}

const documenter = async ({ _window: { global, views }, res, stack }) => {

    var currentPage = global.manifest.currentPage
    var view = views[global.manifest.currentPage] || {}

    global.promises = {}

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

    // id list
    global.__ids__ = global.__html__.split("id='").slice(1).map((id) => id.split("'")[0])

    delete global.data.project

    // logs
    global.__logs__ = stack.logs

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
                ${global.__updateLocation__ ? `<script defer>window.history.replaceState({}, "${title}", "/${currentPage === "main" ? "" : currentPage}")</script>` : ""}
                
                <!-- head tags -->
                ${global.__tags__.head || ""}
            </head>
            <body>
                <!-- body tags -->
                ${global.__tags__.body || ""}

                <!-- html -->
                ${global.__html__ || ""}

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
            </body>
        </html>`
    )
}

const projector = async ({ _window, req, res, stack, __ }) => {

    var timer = (new Date()).getTime()

    initializer({ _window })
    if (res.headersSent) return
    await getProject({ _window, req, res, stack, __ })
    if (res.headersSent) return
    await interpreter({ _window, req, res, stack, __ })
    if (res.headersSent) return
    await documenter({ _window, req, res, stack, __ })

    console.log("DOCUMENTATION", (new Date()).getTime() - timer);
}

module.exports = { getProject, initializer, interpreter, projector }