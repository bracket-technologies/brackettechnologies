//
const { createElement } = require("./createElement");
const { clone } = require("./clone");
const { getJsonFiles } = require("./jsonFiles");
const { authorizer } = require("./authorizer");
const fs = require("fs");
const bracketDomains = ["bracketjs.com", "localhost:8080", "bracket.localhost:8080"];

require("dotenv").config();

const getProject = ({ window }) => {
    
    return new Promise (async resolve => {

        var { req, res, global } = window, db = req.db, promises = [], project = global.data.project, host = global.host
        if (!host) return res.send("Project cannot be found!")

        // is brakcet domain
        var isBracket = bracketDomains.includes(host)
        if (!isBracket) {
            isBracket = host.includes(".loca.lt") || host.includes("amazonaws")
            if (isBracket) host = "bracketjs.com"
        }
        
        // get local public views
        global.data.public = getJsonFiles({ search: { collection: "public" } })

        // get local collections
        global.data.collection = getJsonFiles({ search: { collection: "collection" } })

        console.log("Document started loading:")
        
        if (isBracket) {

          // get page
          console.log("before page", new Date().getTime() - global.timer);
          global.data.page = getJsonFiles({
              search: { collection: `page-${project.id}` },
          });
          console.log("after page", new Date().getTime() - global.timer);

          // get view
          console.log("before view", new Date().getTime() - global.timer);
          global.data.view = getJsonFiles({
              search: { collection: `view-${project.id}` },
          });
          console.log("after view", new Date().getTime() - global.timer);

          // get collection
          console.log("before collection", new Date().getTime() - global.timer);
          global.data.collection = getJsonFiles({
              search: { collection: `collection-${project.id}` },
          });
          console.log("after collection", new Date().getTime() - global.timer);

        } else {

            /*if (host.includes("localhost") && project.id === "malik") {
              if (!fs.existsSync(`database/page-${project.id}`)) fs.mkdirSync(`database/page-${project.id}`)
              if (!fs.existsSync(`database/view-${project.id}`)) fs.mkdirSync(`database/view-${project.id}`)
              if (!fs.existsSync(`database/collection-${project.id}`)) fs.mkdirSync(`database/collection-${project.id}`)
            }*/

            // get page
            /*
            page = rdb.ref(`page-${project.id}`).once("value").then(snapshot => {
                global.data.page = snapshot.val()
                console.log("after page", new Date().getTime() - global.timer);
            })
            */
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

            /*
            view = rdb.ref(`view-${project.id}`).once("value").then(snapshot => {
                global.data.view = snapshot.val()
                console.log("after view", new Date().getTime() - global.timer);
            })
            */

            /*promises.push(db
              .collection(`collection-${project.id}`)
              .get()
              .then(q => {
                  q.forEach(doc => {
                  global.data.view[doc.id] = { ...doc.data() }
                      if (host.includes("localhost") && project.id === "malik") 
                      require("fs").writeFileSync(`database/collection-${project.id}/${doc.id}.json`, JSON.stringify(doc.data(), null, 2))
                  })
              }))*/

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
                      global.data.public[doc.id] = global.data.view[doc.id] = { ...doc.data(), "my-views": [doc.id], id: doc.id }
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
        }
        
        await Promise.all(promises)
        resolve()
    })
}

const status = (window = {}) => {

    var { global } = window

    if (!global.data.project || !global.data.project.id) return "Project not found!"
    if (!global.data.page) return "No pages found!"
    if (!global.data.page[global.currentPage]) return "Page not found!"
    if (!global.data.view) return "No views found!"
    if (!global.data.public) return "No public views found!"
    return "Document is ready!"
}

const initializer = ({ window }) => {
  
    // Create a cookies object
    var { req, res } = window, host = req.headers.host || req.headers.referer
    if (!host && req.headers.host && req.headers.host.includes("localhost")) host = req.headers.host
    if (!host) return res.send("Project cannot be found!")
    
    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    // get assets & views
    window.global = {
        children: { head: "", body: "" },
        innerHTML: {},
        codes: {},
        host,
        prevPage: ["main"],
        currentPage,
        prevPath: ["/"],
        path: req.url,
        device: req.device,
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"],
        headers: req.headers,
        cookies: req.cookies,
        promises: {},
        breakCreateElement: {},
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
        body: {
            id: "body",
            childrenID: []
        },
        root: {
            id: "root",
            type: "View",
            "my-views": [],
            derivations: [],
            childrenID: [],
            style: { backgroundColor: "#fff", position: "relative" },
        },
        public: {
            id: "public",
            type: "Box",
            parent: "body",
            "my-views": [],
            childrenID: []
        }
    }
}

const interpreter = ({ window: _window }) => {

    return new Promise(async resolve => {
      
        var { req, res, global, views } = _window
        if (res.headersSent) return

        var currentPage = global.currentPage
        if (!global.data.page[currentPage]) return res.send("Page does not exist!")

        // controls & views
        views.root.children = clone([{ ...global.data.page[currentPage], id: currentPage }])
        // views.root.children.push(...Object.values(global.data.public))
        views.public.children = Object.values(global.data.public)
        // views.root.children[0].children = toArray(views.root.children[0].children)

        if (!global.data.project) return res.send("Project does not exist or something went wrong! Refresh")

        // project children
        if (global.data.project.children) {

          var __window = { views: { body: { id: "body", type: "View", children: global.data.project.children } }, global }
          console.log("Create headers started!")
          await createElement({ _window: __window, global: {}, id: "body", req, res, import: true })
          console.log("Create headers ended!")
        }

        // create views
        console.log("Create views started!")

        var publicInnerHTML = await createElement({ _window, id: "public", req, res })
        var rootInnerHTML = await createElement({ _window, id: "root", req, res })

        console.log("Create views ended!")
        
        if (global.innerHTML.root) rootInnerHTML = global.innerHTML.root
        if (global.innerHTML.public) publicInnerHTML = global.innerHTML.public
    
        var innerHTML = rootInnerHTML + publicInnerHTML
        global.idList = innerHTML.split("id='").slice(1).map((id) => id.split("'")[0])
        global.innerHTML = innerHTML

        resolve()
    })
}

const app = async ({ _window: window, req, res }) => {
    
    window.req = req
    window.res = res
    initializer({ window })
    if (res.headersSent) return
    await getProject({ window })
    if (res.headersSent) return
    await interpreter({ window })
    if (res.headersSent) return

    var { global, views } = window
    
    var currentPage = global.currentPage
    var innerHTML = global.innerHTML
    var view = views[global.currentPage] || {}
    
    // main head tags
    var favicon = global.data.project.favicon
    var language = global.language = view.language || "en"
    var direction = language === "ar" || language === "fa" ? "rtl" : "ltr"
    var title = view.title || "My App Title"
    var children = clone(global.children)
  
    // meta
    view.meta = view.meta || {}
    global.promises = {}
    global.breakCreateElement = {}
    var metaKeywords = view.meta.keywords || ""
    var metaDescription = view.meta.keywords || ""
    var metaTitle = view.meta.title || view.title || ""
    var metaViewport = view.meta.viewport || "width=device-width, initial-scale=1.0"
  
    delete global.children;
    delete global.innerHTML;
    delete global.data.project;
    // test
    console.log("Document is ready!");
    
    res.send(
      `<!DOCTYPE html>
      <html lang="${language}" dir="${direction}" class="html">
        <head>
          <link rel="stylesheet" href="/resources/index.css"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400&display=swap">
          ${children.head}
          <title>${title}</title>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          ${metaViewport ? `<meta name="viewport" content="${metaViewport}">`: "" }
          ${metaKeywords ? `<meta name="keywords" content="${metaKeywords}">` : ""}
          ${metaDescription ? `<meta name="description" content="${metaDescription}">` : ""}
          ${metaTitle ? `<meta name="title" content="${metaTitle}">` : ""}
          ${favicon ? `<link rel="icon" type="image/x-icon" href="${favicon}"/>` : ""}
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link rel="manifest" href="/resources/manifest.json" mimeType="application/json; charset=UTF-8"/>
          <script id="views" type="application/json">${JSON.stringify(views)}</script>
          <script id="global" type="application/json">${JSON.stringify(global)}</script>
          ${global.updateLocation ? `<script defer>window.history.replaceState({}, "${title}", "/${currentPage === "main" ? "" : currentPage}")</script>` : ""}
        </head>
        <body>
          ${children.body}
          ${innerHTML}
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

module.exports = { status, getProject, initializer, interpreter, app }