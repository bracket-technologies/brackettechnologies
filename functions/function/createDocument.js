const { createElement } = require("./createElement")
const { toArray } = require("./toArray")
const { controls } = require("./controls")
const { getJsonFiles } = require("./jsonFiles")
const { toApproval } = require("./toApproval")
const { toCode } = require("./toCode")
//
require('dotenv').config()

const createDocument = async ({ req, res, db }) => {

    // Create a cookies object
    var host = req.headers["x-forwarded-host"] || req.headers["host"]
    
    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    var promises = [], user, page, view, project
    
    // get assets & views
    var global = {
        data: {
            user: {},
            view: {},
            page: {},
            editor: {},
            project: {}
        },
        codes: {},
        host,
        domain: host,
        currentPage,
        path: req.url,
        cookies: req.cookies,
        device: req.device,
        headers: req.headers,
        public: getJsonFiles({ search: { collection: "public" } }),
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"]
    }
    
    var value = {
        body: { 
            id: "body" 
        },
        root: {
            id: "root",
            type: "View",
            parent: "body",
            style: { backgroundColor: "#fff" }
        },
        public: {
            id: "public",
            type: "View",
            parent: "body",
            children: Object.values(global.public)
        }
    }

    var bracketDomains = [
        "bracketjs.com",
        "localhost",
        "bracketjs.localhost"
    ]

    // is brakcet domain
    var isBracket = bracketDomains.includes(host)
    
    if (isBracket) {

        project = getJsonFiles({ search: { collection: "project", fields: { domains: { "array-contains": host } } } })
        if (project) global.data.project = project = project[0]

    } else {

        // get project data
        project = db
        .collection("project").where("domains", "array-contains", host)
        .get().then(doc => {

            if (doc.docs[0] && doc.docs[0].exists) {
                global.data.project = doc.docs[0].data()
                global.data.project.id = doc.docs[0].id
            }
        })
    }

    promises.push(project)
    await Promise.all(promises)

    // project not found
    if (Object.keys(global.data.project).length === 0) return res.send("Project not found!")
    project = global.data.project
    global.projectId = project.id
    
    if (isBracket) {

        // get user
        user = getJsonFiles({ search: { collection: "user", fields: { "project-id": { "array-contains": project.id } } } })
        if (user) global.data.user = user = user[0]

        // get page
        global.data.page = page = getJsonFiles({ search: { collection: `page-${project.id}` } })

        // get view
        global.data.view = view = getJsonFiles({ search: { collection: `view-${project.id}` } })

    } else {

        // get user
        user = db
        .collection("user").where("project-id", "array-contains", project.id)
        .get().then(doc => {
            
            if (doc.docs[0].exists) {
                global.data.user = doc.docs[0].data()
                global.data.user.id = doc.docs[0].id
            }
        })

        // get page
        page = db
            .collection(`page-${project.id}`)
            .get().then(q => q.forEach(doc => global.data.page[doc.id] = doc.data() ))

        // get view
        view = db
            .collection(`view-${project.id}`)
            .get().then(q => q.forEach(doc => global.data.view[doc.id] = doc.data()))

    }

    promises.push(page)
    promises.push(view)
    promises.push(user)
    
    await Promise.all(promises)
    
    // user not found
    if (!global.data.user) return res.send("User not found")
    global.data.user = user = global.data.user
    
    // page doesnot exist
    if (!global.data.page[currentPage]) return res.send("Page not found!")

    // mount globals
    if (global.data.page[currentPage].global)
    Object.entries(global.data.page[currentPage].global).map(([key, value]) => global[key] = value)
    
    // controls & children
    value.root.controls = global.data.page[currentPage].controls
    value.root.children = global.data.page[currentPage]["view-id"].map(view => global.data.view[view])

    // forward
    if (global.data.page[currentPage].forward) {

        var forward = global.data.page[currentPage].forward
        forward = toCode({ _window, id, string: forward }).split("?")
        var params = forward[1]
        var conditions = forward[2]
        forward = forward[0]

        var approved = toApproval({ _window: { global, value }, string: conditions, id: "root", req, res })
        if (approved) {
            global.path = forward
            global.currentPage = currentPage = global.path.split("/")[1]
        }
    }

    // onloading
    if (global.data.page[currentPage].controls) {
        global.data.page[currentPage].controls = toArray(global.data.page[currentPage].controls)
        var loadingEventControls = global.data.page[currentPage].controls.find(controls => controls.event.split("?")[0].includes("loading"))
        if (loadingEventControls) controls({ _window: { global, value }, id: "root", req, res, controls: loadingEventControls })
    }

    // create html
    var innerHTML = ""
    innerHTML = createElement({ _window: { global, value }, id: "root", req, res })
    innerHTML += createElement({ _window: { global, value }, id: "public", req, res })
    global.idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])

    // meta
    global.data.page[currentPage].meta = global.data.page[currentPage].meta || {}

    // viewport
    var viewport = global.data.page[currentPage].meta.viewport
    viewport = viewport !== undefined ? viewport : "width=device-width, initial-scale=1.0"

    // language
    var language = global.data.page[currentPage].language || "en"
    var direction = (language === "ar" || language === "fa") ? "rtl" : "ltr"
    
    res.send(
    `<!DOCTYPE html>
    <html lang="${language}" dir="${direction}" class="html">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="${viewport}">
            <meta name="keywords" content="${global.data.page[currentPage].meta.keywords}">
            <meta name="description" content="${global.data.page[currentPage].meta.description || ""}">
            <meta name="title" content="${global.data.page[currentPage].meta.title || ""}">
            <title>${global.data.page[currentPage].title}</title>
            <link rel="stylesheet" href="/resources/Tajawal/index.css"/>
            <link rel="stylesheet" href="/index.css"/>
            <link rel="stylesheet" href="/resources/bootstrap-icons/font/bootstrap-icons.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons/material-icons.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-outlined/material-icons-outlined.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-round/material-icons-round.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-sharp/material-icons-sharp.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-two-tones/material-icons-two-tones.css"/>
            <link rel="stylesheet" href="/resources/Lexend+Deca/index.css"/>
        </head>
        <body>
            ${innerHTML}
            <script id="value" type="application/json">${JSON.stringify(value)}</script>
            <script id="global" type="application/json">${JSON.stringify(global)}</script>
            <script src="/index.js"></script>
        </body>
    </html>`)
}

module.exports = { createDocument }
