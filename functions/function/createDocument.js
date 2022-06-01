const { createElement } = require("./createElement")
const { toArray } = require("./toArray")
const { controls } = require("./controls")
const { getJsonFiles } = require("./jsonFiles")
const { toApproval } = require("./toApproval")
const { toCode } = require("./toCode")
//
require('dotenv').config()

const createDocument = async ({ req, res, db, realtimedb }) => {

    // Create a cookies object
    var host = req.headers["x-forwarded-host"] || req.headers["host"]
    
    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    var user, page, view, project
    
    // get assets & views
    var global = {
        timer: new Date().getTime(),
        data: {
            user: {},
            view: {},
            page: {},
            editor: {},
            project: {}
        },
        codes: {},
        host,
        currentPage,
        path: req.url,
        device: req.device,
        public: getJsonFiles({ search: { collection: "public" } }),
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"]
    }
    
    var views = {
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

    var bracketDomains = [ "bracketjs.com", "localhost", "bracket.localhost" ]

    // is brakcet domain
    var isBracket = bracketDomains.includes(host)
    if (!isBracket) {
        isBracket = host.includes(".loca.lt")
        if (isBracket) host = "bracketjs.com"
    }
    
    console.log("Document started loading:");
    
    console.log("before project", new Date().getTime() - global.timer);
    
    // get project
    if (isBracket) global.data.project = project = Object.values(getJsonFiles({ search: { collection: "_project_", fields: { domains: { "array-contains": host } } } }))[0]    
    else {
        // get project data
        project = db
        .collection("_project_").where("domains", "array-contains", host)
        .get().then(doc => {

            if (doc.docs[0] && doc.docs[0].exists)
            global.data.project = project = doc.docs[0].data()
            console.log("after project", new Date().getTime() - global.timer);
        })
    }

    await Promise.resolve(project)
    
    // project not found
    if (!project) return res.send("Project not found!")
    global.projectId = project.id
    
    if (isBracket) {
        
        if (isBracket) {

            console.log("before user", new Date().getTime() - global.timer);
            global.data.user = user = Object.values(getJsonFiles({ search: { collection: "_user_", fields: { projects: { "array-contains": project.id } } } }))[0]
            console.log("after user", new Date().getTime() - global.timer);

        }/* else {

            // get user (for bracket users only)
            console.log("before user / firestore", new Date().getTime() - global.timer);

            user = db
            .collection("_user_").where("projects", "array-contains", project.id)
            .get().then(doc => {
                
                if (doc.docs[0].exists)
                global.data.user = user = doc.docs[0].data()
                console.log("after user", new Date().getTime() - global.timer);
            })
        }*/
        
        console.log("before page", new Date().getTime() - global.timer);

        // get page
        global.data.page = page = getJsonFiles({ search: { collection: `page-${project.id}` } })
        console.log("after page", new Date().getTime() - global.timer);
        
        console.log("before view", new Date().getTime() - global.timer);

        // get view
        global.data.view = view = getJsonFiles({ search: { collection: `view-${project.id}` } })
        console.log("after view", new Date().getTime() - global.timer);
        
    } else {

        // do not send project details
        delete global.data.project

        console.log("before user", new Date().getTime() - global.timer);

        // do not send user details
        console.log("after user", new Date().getTime() - global.timer);
        
        console.log("before page / firestore", new Date().getTime() - global.timer);

        // get page
        /*
        page = realtimedb.ref(`page-${project.id}`).once("value").then(snapshot => {
            global.data.page = snapshot.val()
            console.log("after page", new Date().getTime() - global.timer);
        })
        */
        page = db
        .collection(`page-${project.id}`)
        .get().then(q => {
                q.forEach(doc => {
                global.data.page[doc.id] = doc.data() 
            })
            console.log("after page", new Date().getTime() - global.timer);
        })

        console.log("before view / firestore", new Date().getTime() - global.timer);

        // get view
        /*
        view = realtimedb.ref(`view-${project.id}`).once("value").then(snapshot => {
            global.data.view = snapshot.val()
            console.log("after view", new Date().getTime() - global.timer);
        })
        */
        view = db
        .collection(`view-${project.id}`)
        .get().then(q => {
                q.forEach(doc => {
                global.data.view[doc.id] = doc.data()
            })
            console.log("after view", new Date().getTime() - global.timer);
        })
    }
    
    await Promise.resolve(page)
    await Promise.resolve(view)
    await Promise.resolve(user)
    
    console.log("Document Ready.");
    // realtimedb.ref("view-alsabil-tourism").set(global.data.view)
    // realtimedb.ref("page-alsabil-tourism").set(global.data.page)
    
    // user not found
    if (!global.data.user) return res.send("User not found!")
    user = global.data.user
    
    // page doesnot exist
    if (!global.data.page[currentPage]) return res.send("Page not found!")

    // mount globals
    if (global.data.page[currentPage].global)
    Object.entries(global.data.page[currentPage].global).map(([key, value]) => global[key] = value)
    
    // controls & views
    views.root.controls = global.data.page[currentPage].controls
    views.root.children = global.data.page[currentPage]["views"].map(view => global.data.view[view])

    var _window = { global, views }
/*
    // forward
    if (global.data.page[currentPage].forward) {

        var forward = global.data.page[currentPage].forward
        forward = toCode({ _window, id, string: forward }).split("?")
        var params = forward[1]
        var conditions = forward[2]
        forward = forward[0]

        var approved = toApproval({ _window, string: conditions, id: "root", req, res })
        if (approved) {
            global.path = forward
            global.currentPage = currentPage = global.path.split("/")[1]
        }
    }

    // onloading
    if (global.data.page[currentPage].controls) {
        global.data.page[currentPage].controls = toArray(global.data.page[currentPage].controls)
        var loadingEventControls = global.data.page[currentPage].controls.find(controls => controls.event.split("?")[0].includes("loading"))
        if (loadingEventControls) controls({ _window, id: "root", req, res, controls: loadingEventControls })
    }
*/
    // create html
    var innerHTML = ""
    innerHTML += createElement({ _window, id: "root", req, res })
    innerHTML += createElement({ _window, id: "public", req, res })

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
            <meta name="keywords" content="${global.data.page[currentPage].meta.keywords || ""}">
            <meta name="description" content="${global.data.page[currentPage].meta.description || ""}">
            <meta name="title" content="${global.data.page[currentPage].meta.title || ""}">
            <title>${global.data.page[currentPage].title}</title>
            <link rel="stylesheet" href="/resources/index.css"/>
            <link rel="icon" type="image/x-icon" href="${project.favicon || ""}"/>
            <link rel="stylesheet" href="/resources/Tajawal/index.css"/>
            <link rel="stylesheet" href="/resources/Lexend+Deca/index.css"/>
            <link rel="stylesheet" href="/resources/bootstrap-icons/font/bootstrap-icons.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons/material-icons.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-outlined/material-icons-outlined.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-round/material-icons-round.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-sharp/material-icons-sharp.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-two-tones/material-icons-two-tones.css"/>
        </head>
        <body>
            ${innerHTML}
            <script id="views" type="application/json">${JSON.stringify(views)}</script>
            <script id="global" type="application/json">${JSON.stringify(global)}</script>
            <script src="/index.js"></script>
        </body>
    </html>`)
}

module.exports = { createDocument }