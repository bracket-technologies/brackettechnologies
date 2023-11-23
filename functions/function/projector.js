//
const { toView } = require("./toView");
const { clone } = require("./clone");
const { getJsonFiles } = require("./jsonFiles");
const bracketDomains = ["brackettechnologies.com", "localhost", "brackettechnologies.localhost", "bracket-technologies.web.app"];

require("dotenv").config();

const getProject = ({ window }) => {
    
    return new Promise (async resolve => {

        var { req, res, global } = window, db = req.db, promises = [], project = global.data.project, host = global.host
        if (!host) return res.send("Project cannot be found!")

        // is brakcet domain
        var isBracket = bracketDomains.includes(host)
        
        // get local public views
        global.data.public = getJsonFiles({ search: { collection: "public" } })
        Object.entries(global.data.public).map(([doc, data]) => {
            data["my-views"] = ["main", doc]
            data.id = doc
        })

        // get local collections
        global.data.collection = getJsonFiles({ search: { collection: "collection" } })

        console.log("Document started loading:")

        console.log("before page / firestore", new Date().getTime() - global.timer);
        
        promises.push(db
            .collection(`page-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.page[doc.id] = { ...doc.data(), id: doc.id }
                })
                console.log("after page", new Date().getTime() - global.timer)
                
                // page doesnot exist
                if (!global.data.page[global.currentPage]) return res.send("Page not found!")
            }))

        // load views
        console.log("before view / firestore", new Date().getTime() - global.timer)

        promises.push(db
            .collection(`view-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.view[doc.id] = { ...doc.data() }
                })
                console.log("after view", new Date().getTime() - global.timer)
            }))

        // load public views
        console.log("before public / firestore", new Date().getTime() - global.timer)

        promises.push(db
            .collection(`public-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.public[doc.id] = global.data.view[doc.id] = { ...doc.data(), "my-views": ["main", doc.id], id: doc.id }
                })
                console.log("after public", new Date().getTime() - global.timer)
            }))

        // load collections
        console.log("before collection / firestore", new Date().getTime() - global.timer)

        promises.push(db
            .collection(`collection-${project.id}`)
            .get()
            .then(q => {
                q.forEach(doc => {
                    global.data.collection[doc.id] = { ...doc.data() }
                })
                console.log("after collection", new Date().getTime() - global.timer)
            }))
        
        await Promise.all(promises)
        resolve()
    })
}

const initializer = ({ window, __ }) => {
  
    // Create a cookies object
    var { req, res } = window, host = req.headers.host || req.headers.referer
    if (!host && req.headers.host && req.headers.host.includes("localhost")) host = req.headers.host
    if (!host) return res.send("Project cannot be found!")

    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    // get assets & views
    window.global = {
        //children: { head: "", body: "" },
        __html__: {},
        __waiters__: [],
        __actionReturns__: [],
        __tags__: {
            body: "",
            head: ""
        },
        host,
        prevPage: ["main"],
        currentPage,
        prevPath: ["/"],
        path: req.url,
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"],
        headers: req.headers,
        cookies: req.cookies,
        promises: {},
        breaktoView: {},
        functions: [],
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
            parent: "html",
            id: "body",
            view: "View",
            __childrenID__: []
        },
        root: {
            id: "root",
            __,
            parent: "body",
            view: "View",
            "my-views": [],
            derivations: [],
            __childrenID__: [],
            style: { backgroundColor: "#fff", position: "relative" },
        },
        public: {
            id: "public",
            parent: "body",
            view: "Box",
            parent: "body",
            "my-views": [],
            __childrenID__: []
        }
    }
}

const interpreter = ({ window: _window, __ }) => {

    return new Promise(async resolve => {
      
        var { req, res, global, views } = _window
        if (res.headersSent) return

        var currentPage = global.currentPage
        if (!global.data.page[currentPage]) return res.send("Page not found!")

        // controls & views
        views.root.children = clone([{ ...global.data.page[currentPage], id: currentPage, ["my-views"]: [currentPage] }])
        views.public.children = Object.keys(global.data.public).map(view => ({ view }))
        views.body.children = [...views.public.children, ...views.root.children]

        if (!global.data.project) return res.send("Project does not exist or something went wrong! Refresh")

        // create browser document
        global.data.project.browser = global.data.project.browser || {}
        global.data.project.browser.children = global.data.project.browser.children || []
        global.data.project.browser.view = global.data.project.browser.view || global.data.project.browser.type || "html"
        
        views.html = { ...views.html, ...global.data.project.browser }

        // create views
        console.log("Create document started!")

        await toView({ _window, id: "html", req, res, __ })
        
        var publicInnerHTML = await toView({ _window, id: "public", req, res, viewer: "public", __ })
        var rootInnerHTML = await toView({ _window, id: "root", req, res, __ })

        console.log("Create document ended!")
        
        if (global.__html__.root) rootInnerHTML = global.__html__.root
    
        global.__html__ = rootInnerHTML + publicInnerHTML
        global.idList = global.__html__.split("id='").slice(1).map((id) => id.split("'")[0])
        
        resolve()
    })
}

const projector = async ({ _window: window, req, res, __ }) => {
    
    window.req = req
    window.res = res
    initializer({ window, __ })
    if (res.headersSent) return
    await getProject({ window, __ })
    if (res.headersSent) return
    await interpreter({ window, __ })
    if (res.headersSent) return

    var { global, views } = window
    
    var currentPage = global.currentPage
    var innerHTML = global.__html__
    var html = views.html
    var view = views[global.currentPage] || {}
    
    global.promises = {}
    global.breaktoView = {}
    
    // head tags
    var favicon = global.data.project.favicon
    var faviconType = global.data.project.faviconType
    var language = global.language = view.language || view.lang || html.lang || html.language || "en"
    var direction = view.direction || view.dir || html.direction || html.dir || (language === "ar" || language === "fa" ? "rtl" : "ltr")
    var title = view.title || html.title || "Bracket App Title"
    var tags = clone(global.__tags__ || {})
  
    // meta
    view.meta = view.meta || {}
    var metaHTTPEquiv = view.meta["http-equiv"] || view.meta["httpEquiv"] || {}
    if (typeof metaHTTPEquiv !== "object") metaHTTPEquiv = {}
    if (!metaHTTPEquiv["content-type"]) metaHTTPEquiv["content-type"] = "text/html; charset=UTF-8"
    var metaKeywords = view.meta.keywords || ""
    var metaDescription = view.meta.description || ""
    var metaTitle = view.meta.title || view.title || ""
    var metaViewport = view.meta.viewport || ""
  
    delete global.__tags__;
    delete global.__html__;
    delete global.data.project;
    delete global.__firstLoad__;
    
    console.log("Document is ready!");
    
    res.send(
    `<!DOCTYPE html>
        <html lang="${language}" dir="${direction}" class="html">
            <head>
                <link rel="stylesheet" href="/resources/index.css"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400&display=swap">
                <title>${title}</title>
                ${metaHTTPEquiv ? Object.entries(metaHTTPEquiv).map(([key, value]) => `<meta http-equiv="${key}" content="${value}">
                `) : ""}
                <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                <meta name="viewport" content= "width=device-width, initial-scale=1.0">
                ${metaViewport ? `<meta name="viewport" content="${metaViewport}">` : ""}
                ${metaKeywords ? `<meta name="keywords" content="${metaKeywords}">` : ""}
                ${metaDescription ? `<meta name="description" content="${metaDescription}">` : ""}
                ${metaTitle ? `<meta name="title" content="${metaTitle}">` : ""}
                ${favicon ? `<link rel="icon" type="image/${faviconType || "x-icon"}" href="${favicon}"/>` : ""}
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link rel="manifest" href="/resources/manifest.json" mimeType="application/json; charset=UTF-8"/>
                <script id="views" type="application/json">${JSON.stringify(views)}</script>
                <script id="global" type="application/json">${JSON.stringify(global)}</script>
                ${global.updateLocation ? `<script defer>window.history.replaceState({}, "${title}", "/${currentPage === "main" ? "" : currentPage}")</script>` : ""}
                ${tags.head || ""}
            </head>
            <body>
                ${tags.body || ""}
                ${innerHTML || ""}
                <script src="/index.js"></script>
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

// <meta http-equiv="X-UA-Compatible" content="IE=edge">
module.exports = { getProject, initializer, interpreter, projector }