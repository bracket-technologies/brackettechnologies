// const functions = require("firebase-functions")
const express = require("express")
const device = require('express-device')
const cookieParser = require('cookie-parser')
const firebase = require("firebase-admin")
const sls = require("serverless-http")
const Global = {
  today: (new Date()).getDay(),
  functions: {}
}
// require("firebase/firestore")

// var bracketDomains = ["bracketjs.com", "localhost", "bracket.localhost"]

// config
require('dotenv').config()

// firebase
firebase.initializeApp({
  credential: firebase.credential.cert(JSON.parse(process.env.FBSA)), 
  databaseURL: process.env.DBU,
  apiKey: process.env.AK,
  authDomain: process.env.AD,
  storageBucket: process.env.SB,
  messagingSenderId: process.env.MSI,
  projectId: process.env.PI,
  appId: process.env.AI
})

var db = firebase.firestore()
var realtimedb = firebase.database()
var storage = firebase.storage()

// realtimedb.ref("view-bracketjs").set({ type: "View" })

/* 
realtimedb.ref("view-bracketjs").once("value").then(function(snapshot) {
  console.log( snapshot.val() )
}) 
*/

var { getdb, postdb, deletedb } = require("./function/database")
var { getFile, postFile, deleteFile } = require("./function/storage")
var { createDocument } = require("./function/createDocument")
var { sendConfirmationEmail } = require("./function/sendConfirmationEmail")
var { execFunction } = require("./function/execFunction")

var app = express()

app.use(device.capture())
app.use(express.static("browser", { redirect: false }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.json({ limit: '50mb' }))

app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.set('Access-Control-Allow-Origin', '*')
  /*
    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
  
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, project")
  
    res.setHeader("Access-Control-Allow-Credentials", "true")
  */
  // Pass to next layer of middleware
  next()
})

app.listen(8080, () => console.log("Server Listening to Port 8080"))

// exports.app = functions.https.onRequest(app)
module.exports.app = sls(app)

// post
app.post("*", (req, res) => {

  req.db = db
  req.global = Global
  req.storage = storage
  req.realtimedb = realtimedb
  req.cookies = JSON.parse(req.cookies.__session || "{}")
  var path = req.url.split("/"), i = 1

  // bracket
  /*if (req.headers.project === "bracket") {

    // storage
    if (path[i] === "storage") return require("./function/storageLocal").postFile({ req, res })

    // database
    if (path[i] === "database") return require("./function/databaseLocal").postdb({ req, res })
  }*/
  
  // function
  if (path[i] === "action") return execFunction({ req, res })

  // confirmEmail
  if (path[i] === "confirmEmail") return sendConfirmationEmail({ req, res })

  // storage
  if (path[i] === "storage") return postFile({ req, res })

  // database
  if (path[i] === "database") return postdb({ req, res })
})

// delete
app.delete("*", (req, res) => {

  req.db = db
  req.global = Global
  req.storage = storage
  req.realtimedb = realtimedb
  req.cookies = JSON.parse(req.cookies.__session || "{}")
  var path = req.url.split("/"), i = 1

  // bracket
  /*if (req.headers.project === "bracket") {

    // storage
    if (path[i] === "storage") return require("./function/storageLocal").deleteFile({ req, res })

    // database
    if (path[i] === "database") return require("./function/databaseLocal").deletedb({ req, res })
  }*/

  // storage
  if (path[i] === "storage") return deleteFile({ req, res })

  // database
  if (path[i] === "database") return deletedb({ req, res })
})

// get
app.get("*", async (req, res) => {

  res.status(200)
  req.db = db
  req.global = Global
  req.storage = storage
  req.realtimedb = realtimedb
  req.cookies = JSON.parse(req.cookies.__session || "{}")
  var path = req.url.split("/"), i = 1
  /*var host = req.headers["x-forwarded-host"] || req.headers["host"]
  
    // bracket
  if (myHost.includes(host)) {
    
    // storage & resources
    if (path[1] === "storage") return require("./function/storageLocal").getFile({ req, res })

    // database
    if (path[1] === "database") return require("./function/databaseLocal").getdb({ req, res })
  }*/
  
  // resources
  if (path[i] === "resources") return require("./function/storageLocal").getFile({ req, res })

  // storage
  // if (path[i] === "image") return require("./function/getImage").getImage({ req, res })

  // storage
  if (path[i] === "storage") return getFile({ req, res })

  // database
  if (path[i] === "database") return getdb({ req, res })

  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)

  // respond
  return createDocument({ req, res })
})

// book a ticket
// require("./function/bookFlyBaghdad")()

// AOU
// require("./function/aou")()

// create new flight
// require("./flybaghdad/newFlight")(db)

/*var pages = require("../sss.json")
Object.entries(pages).map(([doc, data]) => {

  db.collection("page-alsabil-trips").doc(doc.toString()).set(data).then(() => {

    console.log(`Page saved successfuly!`)

  }).catch(error => {

    console.log(error)
  })
})

var views = require("../zzz.json")
Object.entries(views).map(([doc, data]) => {

  db.collection("view-alsabil-trips").doc(doc.toString()).set(data).then(() => {

    console.log(`View saved successfuly!`)

  }).catch(error => {

    console.log(error)
  })
})*/

/*
// create alsabil tourism clone project

Object.entries(require("./pages.json")).map(([key, data]) => {

  db.collection("page-alsabil").doc(key).set(data).then(() => {console.log(key + " page saved successfully!")})
})

Object.entries(require("./views.json")).map(([key, data]) => {

  db.collection("view-alsabil").doc(key).set(data).then(() => {console.log(key + " view saved successfully!")})
})

db.collection("_project_").doc("alsabil").set(require("./project.json")).then(() => {console.log("alsabil project saved successfully!")})

Object.entries(require("./users.json")).map(([key, data]) => {

  db.collection("user-alsabil").doc(key).set(data).then(() => {console.log(key + " user saved successfully!")})
})

Object.entries(require("./agents.json")).map(([key, data]) => {

  db.collection("agent-alsabil").doc(key).set(data).then(() => {console.log(key + " agent saved successfully!")})
})

Object.entries(require("./collections.json")).map(([key, data]) => {

  db.collection("collection-alsabil").doc(key).set(data).then(() => {console.log(key + " collection saved successfully!")})
})

*/