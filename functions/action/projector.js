const { toView } = require("./toView");
const { clone } = require("./clone");
const { getJsonFiles } = require("./jsonFiles");
const { stacker } = require("./stack");

require("dotenv").config();

const initializer = ({ window, __ }) => {
  
    // Create a cookies object
    var { req, res } = window, host = req.headers.host || req.headers.referer
    if (!host && req.headers.host && req.headers.host.includes("localhost")) host = req.headers.host
    if (!host) return res.send("Project cannot be found!")

    // current page
    var currentPage = window.global.__path__[1] || "main"
    
    // get assets & views
    window.global = {
        __html__: "",
        __waitAdds__: [],
        __returnAdds__: [],
        __firstLoad__: true,
        __tags__: {
            body: "",
            head: ""
        },
        host,
        __prevPage__: ["main"],
        __currentPage__: currentPage,
        __prevPath__: ["/"],
        path: req.url,
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"],
        headers: req.headers,
        cookies: req.cookies,
        promises: {},
        breaktoView: {},
        actions: [],
        ...window.global,
        data: {
          account: {},  
          view: {},
          page: {},
          public: {},
          editor: {},
          project: {},
          collection: {},
          ...window.global.data,
      }
    };

    window.views = {
        html: {
            id: "html",
            __childrenID__: []
        },
        body: {
            id: "body",
            view: "View",
            parent: "html",
            __childrenID__: []
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

const getProject = ({ window }) => {
    
    return new Promise (async resolve => {

        var { req, res, global } = window, db = req.db, promises = [], project = global.data.project, host = global.host
        if (!host) return res.send("Project not found!")
        
        // get shared public views
        Object.entries(getJsonFiles({ search: { collection: "public" } })).map(([doc, data]) => {
            global.data.view[doc] = { ...data, id: doc, __mapViewsPath__: [doc] }
        })

        var timer = (new Date()).getTime()
        
        promises.push(db
            .collection(`page-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.page[doc.id] = { ...doc.data(), id: doc.id }
                })
                console.log("PAGE", new Date().getTime() - timer)
                
                // page doesnot exist
                if (!global.data.page[global.__currentPage__]) return res.send("Page not found!")
            }))

        promises.push(db
            .collection(`view-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.view[doc.id] = { ...doc.data() }
                })
                console.log("VIEW", new Date().getTime() - timer)
            }))

        promises.push(db
            .collection(`public-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.view[doc.id] = { ...doc.data(), __mapViewsPath__: [doc.id], id: doc.id }
                })
                console.log("PUBLIC", new Date().getTime() - timer)
            }))

        promises.push(db
            .collection(`collection-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.collection[doc.id] = { ...doc.data(), __mapViewsPath__: [doc.id], id: doc.id }
                })
                console.log("COLLECTION", new Date().getTime() - timer)
            }))
        
        await Promise.all(promises)
        resolve()
    })
}

const interpreter = ({ window: _window, __ }) => {

    return new Promise(async resolve => {
      
        var { req, res, global, views } = _window
        if (res.headersSent) return

        var currentPage = global.__currentPage__
        if (!global.data.page[currentPage]) return res.send("Page not found!")

        // views
        views.root.children = clone([{ ...global.data.page[currentPage], id: currentPage, __mapViewsPath__: [currentPage] }])
        views.public.children = Object.values(global.data.view).filter(view => view.__public__)
        views.body.children = [views.public, views.root]
        
        // tags
        global.data.project.browser = global.data.project.browser || {}
        global.data.project.browser.children = global.data.project.browser.children || []
        global.data.project.browser.view = global.data.project.browser.view || global.data.project.browser.type || "html"
        
        views.html = { ...views.html, ...global.data.project.browser }

        // stack
        var stack = stacker({ _window, event: "render", id: "body" })
        var timer = (new Date()).getTime()
        
        // tags
        await toView({ _window, id: "html", req, res, __, stack })
        
        // views
        var innerHTML = await toView({ _window, id: "body", req, res, __, stack })

        console.log("RENDER", (new Date()).getTime() - timer)
        
        // html was updated by update or route
        if (!global.__html__) global.__html__ = innerHTML
        
        // get IDs
        global.__IDList__ = global.__html__.split("id='").slice(1).map((id) => id.split("'")[0])
        
        resolve()
    })
}

const documenter = ({ window }) => {

    var { global, views, res } = window
    
    var currentPage = global.__currentPage__
    var view = views[global.__currentPage__] || {}
    
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
    
    delete global.data.project
    delete global.__firstLoad__
    
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
                ${favicon ? `<link rel="icon" type="image/${faviconType || "x-icon"}" href="${favicon}"/>` : ""}
                
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

const projector = async ({ _window: window, req, res, __ }) => {
    
    window.req = req
    window.res = res
    
    var timer = (new Date()).getTime()

    initializer({ window, __ })
    if (res.headersSent) return
    await getProject({ window, __ })
    if (res.headersSent) return
    await interpreter({ window, __ })
    if (res.headersSent) return
    documenter({ window, __ })
    
    console.log("DOCUMENTATION", (new Date()).getTime() - timer);
}

module.exports = { getProject, initializer, interpreter, projector }