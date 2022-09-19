const { createElement } = require("./createElement");
const { getJsonFiles } = require("./jsonFiles");
const fs = require("fs");
const { generate } = require("./generate");
const { toArray } = require("./toArray");
const { toParam } = require("./toParam");
const { toCode } = require("./toCode");
const { clone } = require("./clone");
const { toApproval } = require("./toApproval");
//
require("dotenv").config();

const createDocument = async ({ req, res }) => {
  
  // Create a cookies object
  var host = req.headers["x-forwarded-host"] || req.headers["host"], db = req.db
  if (req.url.split("/")[1] === "undefined") return res.send("")

  // current page
  var currentPage = req.url.split("/")[1] || "", promises = []
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
    innerHTML: {},
    codes: {},
    host,
    currentPage,
    path: req.url,
    device: req.device,
    unloadedViews: [],
    public: getJsonFiles({ search: { collection: "public" } }),
    os: req.headers["sec-ch-ua-platform"],
    browser: req.headers["sec-ch-ua"],
    country: req.headers["x-country-code"],
    headers: req.headers,
    promises: [],
    functions: []
  };

  var views = {
    body: {
      id: "body",
    },
    root: {
      id: "root",
      type: "Box",
      parent: "body",
      "my-views": [],
      style: { backgroundColor: "#fff" },
    },
    public: {
      id: "public",
      type: "Box",
      parent: "body",
      "my-views": [],
      children: Object.values(global.public),
    }
  }

  var bracketDomains = ["bracketjs.com", "localhost", "bracket.localhost"];

  // is brakcet domain
  var isBracket = bracketDomains.includes(host);
  if (!isBracket) {
    isBracket = host.includes(".loca.lt");
    if (isBracket) host = "bracketjs.com";
  }

  console.log("Document started loading:");

  console.log("before project", new Date().getTime() - global.timer);

  // get project
  var project = db
    .collection("_project_")
    .where("domains", "array-contains", host)
    .get()
    .then((doc) => {
      if (doc.docs[0] && doc.docs[0].exists)
        global.data.project = project = doc.docs[0].data();
        global.functions = Object.keys(project.functions || {})
        // global.projectFunctions = project.functions || {}
        console.log("after project", new Date().getTime() - global.timer);
    })

  await Promise.resolve(project);

  // project not found
  if (!project) return res.send("Project not found!");
  global.projectId = project.id

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
*/

  }
  
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
      page = realtimedb.ref(`page-${project.id}`).once("value").then(snapshot => {
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
        if (!global.data.page[currentPage]) return res.send("Page not found!");
      }))


      /*
      view = realtimedb.ref(`view-${project.id}`).once("value").then(snapshot => {
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
    
    /*if (global.data.page[currentPage].views.length > 0) {

      var docs = global.data.page[currentPage].views,
        _docs = [],
        index = 1,
        length = Math.floor(docs.length / 10) + (docs.length % 10 > 0 ? 1 : 0);

      while (index <= length) {
        _docs.push(docs.slice((index - 1) * 10, index * 10));
        index += 1;
      }
      
      await Promise.all(
        _docs.map(async (docList) => {
          await db
            .collection(`view-${project.id}`)
            .where("id", "in", docList)
            .get()
            .then((docs) => {
              success = true
              docs.forEach((doc) => global.data.view[doc.id] = doc.data())
              message = `Documents mounted successfuly!`
            })
            .catch((error) => {
              success = false
              message = `An error Occured!`
            })
        })
      )
      console.log("after view", new Date().getTime() - global.timer);
    }*/
  }

  await Promise.all(promises)
  
  // realtimedb.ref("view-alsabil-tourism").set(global.data.view)
  // realtimedb.ref("page-alsabil-tourism").set(global.data.page)

  // mount globals
  /*if (global.data.page[currentPage].global)
    Object.entries(global.data.page[currentPage].global).map(
      ([key, value]) => (global[key] = value)
    )*/
    
  // controls & views
  views.root.controls = clone(global.data.page[currentPage].controls || [])
  views.root.children = clone([global.data.view[global.data.page[currentPage].view]])

  // inherit view name
  views.root["my-views"] = [global.data.page[currentPage].view]
  
  var _window = { global, views, db }

  // controls
  /*toArray(views.root.controls).map((controls = {}) => {
    var event = toCode({ _window, string: controls.event || "" })
    if (event.split("?")[0].split(";").find(event => event.slice(0, 7) === "beforeLoading") && toApproval({ _window, req, res, string: event.split('?')[2] }))
      toParam({ _window, string: event.split("?")[1], req, res })
  })*/

  // meta
  global.data.page[currentPage].meta = global.data.page[currentPage].meta || {}

  // viewport
  var viewport = global.data.page[currentPage].meta.viewport
  viewport = viewport !== undefined ? viewport : "width=device-width, initial-scale=1.0"

  // language & direction
  var language = global.language = global.data.page[currentPage].language || "en"
  var direction = language === "ar" || language === "fa" ? "rtl" : "ltr"

  // controls
  toArray(views.root.controls).map((controls = {}) => {

    var event = toCode({ _window, string: controls.event || "" })
    if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ id: "root", req, res, _window, string: event.split('?')[2] })) {
      toParam({ id: "root", req, res, _window, string: event.split("?")[1], req, res })
    }
  })

  await Promise.all(global.promises)
  await Promise.all(global.promises)
  await Promise.all(global.promises)
  
  // create html
  var rootInnerHTML = createElement({ _window, id: "root", req, res })
  var publicInnerHTML = createElement({ _window, id: "public", req, res })

  if (global.innerHTML.root) rootInnerHTML = global.innerHTML.root
  if (global.innerHTML.public) publicInnerHTML = global.innerHTML.public

  var innerHTML = rootInnerHTML + publicInnerHTML
  delete global.innerHTML

  global.idList = innerHTML.split("id='").slice(1).map((id) => id.split("'")[0])
  
  await Promise.all(global.promises)
  await Promise.all(global.promises)
  await Promise.all(global.promises)
  await Promise.all(global.promises)
  
  console.log("Document Ready.");

  if (global.promises.length > 0) {
    var { promises, ..._global } = global
    global = { ..._global }
  }

  delete global.headers
  delete global.data.project;

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
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="yes">
        <meta name="apple-mobile-web-app-title" content="${global.data.page[currentPage].title}">
        <title>${global.data.page[currentPage].title}</title>
        <link rel="stylesheet" href="/resources/index.css"/>
        <link rel="icon" type="image/x-icon" href="${project.favicon || ""}"/>
        <link rel="stylesheet" href="/resources/Tajawal/index.css"/>
        <link rel="stylesheet" href="/resources/Lexend+Deca/index.css"/>
        <link rel="stylesheet" href="/resources/bootstrap-icons/font/bootstrap-icons.css"/>
        <link rel="manifest" href="/resources/manifest.webmanifest" />
      </head>
      <body>
        ${innerHTML}
        <div class="loader-container"><div class="loader"></div></div>
        <script id="views" type="application/json">${JSON.stringify(views)}</script>
        <script id="global" type="application/json">${JSON.stringify(global)}</script>
        <script src="/index.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/xlsx.full.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      </body>
    </html>`
  );
};

/*
<link rel="stylesheet" href="/resources/google-icons/material-icons/material-icons.css"/>
<link rel="stylesheet" href="/resources/google-icons/material-icons-outlined/material-icons-outlined.css"/>
<link rel="stylesheet" href="/resources/google-icons/material-icons-round/material-icons-round.css"/>
<link rel="stylesheet" href="/resources/google-icons/material-icons-sharp/material-icons-sharp.css"/>
<link rel="stylesheet" href="/resources/google-icons/material-icons-two-tones/material-icons-two-tones.css"/>
*/
module.exports = { createDocument };
