//
var params = {};
const { createElement } = require("./createElement");
const { clone } = require("./clone");
const { getJsonFiles } = require("./jsonFiles");
const bracketDomains = ["bracketjs.com", "localhost:8080", "bracket.localhost:8080"];

require("dotenv").config();

const project = ({ req, res }) => {
    
    return new Promise (async resolve => {

        var { currentPage, global, db, host } = params, promises = [], project
        if (!host) return res.send("Project cannot be found!")
        
        // is brakcet domain
        var isBracket = bracketDomains.includes(host);
        if (!isBracket) {
            isBracket = host.includes(".loca.lt") || host.includes("amazonaws");
            if (isBracket) host = "bracketjs.com";
        }
        
        global.data.public = getJsonFiles({ search: { collection: "public" } })

        console.log("Document started loading:");
        console.log("before project", new Date().getTime() - global.timer);
        
        // get project
        promises.push(db
          .collection("_project_")
          .where("domains", "array-contains", host)
          .get()
          .then((doc) => {
              if (doc.docs[0] && doc.docs[0].exists) {
                  global.data.project = project = doc.docs[0].data()
                  global.projectId = global.data.project.id
                  global.functions = Object.keys(project.functions || {})
              }
              console.log("after project", new Date().getTime() - global.timer);
          }))

        await Promise.all(promises)
        if (!project) return res.send("Project cannot found!")
        /* 
        if (global) {

        } else {
            // session
            /* global.session = {
            id: generate({ length: 20 }),
            "creation-date": (new Date()).getTime(),
            "expiry-date": (new Date()).getTime() + 1800000,
            "host": host,
            "counter": 0 // max requests (max requests depends on project session max requests data)
            }
            db.collection("_session_").doc(global.session.id).set(global.session)

        }*/

        /*promises.push(db
        .collection("_function_")
        .doc(project.id)
        .get()
        .then((doc) => {
            if (doc.data()) {
            // req.global.functions[project.id] = doc.data() || {}
            global.functions = Object.keys(doc.data() || {})
            global.projectFunctions = doc.data() || {}
            } else global.functions = []
            console.log("after functions", new Date().getTime() - global.timer);
        }))*/

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

        } else {

            // get page
            /*
            page = rdb.ref(`page-${project.id}`).once("value").then(snapshot => {
                global.data.page = snapshot.val()
                console.log("after page", new Date().getTime() - global.timer);
            })
            */
            console.log("before page / firestore", new Date().getTime() - global.timer);

            /*if (host.includes("localhost")) {
            if (!fs.existsSync(`database/page-${project.id}`)) fs.mkdirSync(`database/page-${project.id}`)
            if (!fs.existsSync(`database/view-${project.id}`)) fs.mkdirSync(`database/view-${project.id}`)
            }*/

            promises.push(db
                .collection(`page-${project.id}`)
                .get()
                .then(q => {
                    q.forEach(doc => {
                        global.data.page[doc.id] = doc.data()
                        // if (host.includes("localhost")) require("fs").writeFileSync(`database/page-${project.id}/${doc.data().id}.json`, JSON.stringify(doc.data(), null, 2))
                    })
                    console.log("after page", new Date().getTime() - global.timer)
                    
                    // page doesnot exist
                    if (!global.data.page[currentPage]) return res.send("Page not found!")
                }))

            /*
            view = rdb.ref(`view-${project.id}`).once("value").then(snapshot => {
                global.data.view = snapshot.val()
                console.log("after view", new Date().getTime() - global.timer);
            })
            */

            // load views
            console.log("before view / firestore", new Date().getTime() - global.timer);

            promises.push(db
                .collection(`view-${project.id}`)
                .get()
                .then(q => {
                    q.forEach(doc => {
                        global.data.view[doc.id] = doc.data()
                        // if (host.includes("localhost")) require("fs").writeFileSync(`database/view-${project.id}/${doc.data().id}.json`, JSON.stringify(doc.data(), null, 2))
                    })
                    console.log("after view", new Date().getTime() - global.timer);
                }))
        }
        
        await Promise.all(promises)
        resolve()
    })
}

const status = () => {

    var { global, currentPage } = params

    if (!global.data.project || !global.data.project.id) return "Project not found!"
    if (!global.data.page) return "No pages found!"
    if (!global.data.page[currentPage]) return "Page not found!"
    if (!global.data.view) return "No views found!"
    return "Document is ready!"
}

const initialize = ({ req, res }) => {
  
    // Create a cookies object
    var host = req.headers.host || req.headers.referer// || req.headers["x-forwarded-host"]
    if (!host && req.headers.host && req.headers.host.includes("localhost")) host = req.headers.host
    if (req.url.split("/")[1] === "undefined") return res.send("")
    if (!host) return res.send("Project cannot be found!")
    
    // current page
    var currentPage = req.url.split("/")[1] || "", db = req.db
    currentPage = currentPage || "main"
    
    // get assets & views
    var global = {
        timer: new Date().getTime(),
        data: {
            account: {},  
            view: {},
            page: {},
            editor: {},
            project: {},
        },
        children: { head: "", body: "" },
        innerHTML: {},
        codes: {},
        host,
        currentPage,
        path: req.url,
        device: req.device,
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"],
        headers: req.headers,
        cookies: req.cookies,
        promises: {},
        breakCreateElement: {},
        functions: []
    };

    var views = {
        body: {
            id: "body",
        },
        root: {
            id: "root",
            type: "View",
            "my-views": [],
            derivations: [],
            style: { backgroundColor: "#fff" },
        },
        public: {
            id: "public",
            type: "Box",
            parent: "body",
            "my-views": []
        }
    }

    params = { req, res, currentPage, global, views, db, host }
    return { global, views }
}

const interpret = () => {

    return new Promise(async resolve => {

        var { req, res, global, views } = params
        var _window = { global, views }
        if (res.headersSent) return

        var currentPage = global.currentPage
        if (!global.data.page[currentPage]) return res.send("Page does not exist!")
        
        // controls & views
        views.root.children = clone([{ ...global.data.page[currentPage], id: currentPage }])
        views.public.children = Object.values(global.data.public)

        if (!global.data.project) return res.send("Project does not exist or something went wrong! Refresh")

        // project children
        if (global.data.project.children) {

          var __window = { views: { body: { id: "body", type: "View", children: global.data.project.children } }, global }
          console.log("Create headers started!");
          await createElement({ _window: __window, global: {}, id: "body", req, res, import: true })
          console.log("Create headers ended!");
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

const app = async ({ req, res }) => {

    var { global, views } = initialize({ req, res })
    if (res.headersSent) return
    await project({ req, res })
    if (res.headersSent) return
    await interpret({ req, res })
    if (res.headersSent) return
    
    var currentPage = global.currentPage, innerHTML = global.innerHTML, view = views[global.currentPage]

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
    
    console.log("Document is ready!");
    
    res.send(
      `<!DOCTYPE html>
      <html lang="${language}" dir="${direction}" class="html">
        <head>
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
          <link rel="stylesheet" href="/resources/index.css"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500&display=swap">
          <link rel="manifest" href="/resources/manifest.json" mimeType="application/json; charset=UTF-8"/>
          <script id="views" type="application/json">${JSON.stringify(views)}</script>
          <script id="global" type="application/json">${JSON.stringify(global)}</script>
          ${global.updateLocation ? `<script defer>window.history.replaceState({}, "${title}", "/${currentPage === "main" ? "" : currentPage}")</script>` : ""}
        </head>
        <body>
          ${children.body}
          ${innerHTML}
          <script src="/index.js"></script>
          <div class="loader-container"><div class="loader"></div></div>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
        </body>
      </html>`
    )
}

module.exports = { status, project, initialize, interpret, app }