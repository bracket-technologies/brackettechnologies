const { createElement } = require("./createElement")
// const { toParam } = require("./toParam")
const { toArray } = require("./toArray")
const { controls } = require("./controls")
const { getJsonFiles } = require("./getJsonFiles")
const { toApproval } = require("./toApproval")
const { capitalize } = require("./capitalize")
const { toCode } = require("./toCode")
//
require('dotenv').config()

const createDocument = async ({ req, res, db }) => {

    // Create a cookies object
    var domain = req.headers["x-forwarded-host"]
    var host = req.headers["host"]
    
    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    var promises = [], user, page, view, css, js, project, editorAuth
    
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
        domain: domain || host,
        currentPage,
        path: req.url,
        cookies: req.cookies,
        device: req.device,
        headers: req.headers,
        public: getJsonFiles("public"),
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

    // get project data
    project = db
        .collection("project").where("domains", "array-contains", domain || host)
        .get().then(doc => {

            if (doc.docs[0] && doc.docs[0].exists) {
                global.data.project = doc.docs[0].data()
                global.data.project.id = doc.docs[0].id
            }
        })

    // get editor project data
    if (currentPage === "developer-editor") {

        var projectID = req.url.split("/")[2]
        
        editorAuth = db
            .collection("authentication").doc(projectID)
            .get().then(doc => {

                if (doc.exists) global.auth = doc.data().code
            })
    }

    promises.push(project)
    promises.push(editorAuth)
    await Promise.all(promises)

    // project not found
    if (Object.keys(global.data.project).length === 0) return res.send("Project not found!")

    // get user
    user = db
        .collection("user").where("project-id", "array-contains", global.data.project.id)
        .get().then(doc => { 
            
            if (doc.docs[0].exists) {
                global.data.user = doc.docs[0].data()
                global.data.user.id = doc.docs[0].id
            }
        })

    // get page
    page = db
        .collection(`page-${global.data.project.id}`)
        .get().then(q => q.forEach(doc => global.data.page[doc.id] = doc.data() ))

    // get view
    view = db
        .collection(`view-${global.data.project.id}`)
        .get().then(q => q.forEach(doc => global.data.view[doc.id] = doc.data()))

    promises.push(js)
    promises.push(css)
    promises.push(page)
    promises.push(view)
    promises.push(user)
    
    await Promise.all(promises)
    
    // user not found
    if (!global.data.user) return res.send("User not found")

    // page doesnot exist
    if (!global.data.page[currentPage]) return res.send(`${capitalize(currentPage)} page does not exist!`)

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
            <link rel="stylesheet" href="/index.css"/>
            <link rel="stylesheet" href="/resources/bootstrap-icons/font/bootstrap-icons.css"/>
            <link rel="stylesheet" href="/resources/Tajawal/index.css"/>
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
