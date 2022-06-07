var functions = require("firebase-functions")
var express = require("express")
var device = require('express-device')
var cookieParser = require('cookie-parser')
var firebase = require("firebase-admin")
// require("firebase/firestore")

// var bracketDomains = ["bracketjs.com", "localhost", "bracket.localhost"]

// config
require('dotenv').config({ path: '.env' })

// firebase
firebase.initializeApp({ 
  credential: firebase.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)), 
  databaseURL: "https://bracketjs-default-rtdb.firebaseio.com" 
})
var db = firebase.firestore()
var realtimedb = firebase.database()

// realtimedb.ref("view-bracketjs").set({ type: "View" })

/* 
realtimedb.ref("view-bracketjs").once("value").then(function(snapshot) {
  console.log( snapshot.val() )
}) 
*/

var { getdb, postdb, deletedb } = require("./function/database")
var { getFile, postFile, deleteFile } = require("./function/storage")
var { createDocument } = require("./function/createDocument")

var app = express()

app.use(device.capture())
app.use(express.static("browser", { redirect: false }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false, limit: "50mb" }))

app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*")
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

app.listen(80, () => console.log("Server Listening to Port 80"))

exports.app = functions.https.onRequest(app)

// post
app.post("*", (req, res) => {
  var path = req.url.split("/")

  // bracket
  if (req.headers.project === "bracket") {

    // storage
    if (path[1] === "storage") require("./function/storageLocal").postFile({ req, res })

    // database
    if (path[1] === "database") require("./function/databaseLocal").postdb({ req, res })
  }

  // storage
  if (path[1] === "storage") return postFile({ req, res, storage })

  // database
  if (path[1] === "database") return postdb({ req, res, db, realtimedb })
})

// delete
app.delete("*", (req, res) => {
  var path = req.url.split("/")

  // bracket
  if (req.headers.project === "bracket") {

    // storage
    if (path[1] === "storage") require("./function/storageLocal").deleteFile({ req, res })

    // database
    if (path[1] === "database") require("./function/databaseLocal").deletedb({ req, res })
  }

  // storage
  if (path[1] === "storage") return deleteFile({ req, res, storage })

  // database
  if (path[1] === "database") return deletedb({ req, res, db, realtimedb })
})

// get
app.get("*", async (req, res) => {
  var path = req.url.split("/")

  /*
    // var host = req.headers["x-forwarded-host"] || req.headers["host"]
  
    // bracket
    if (req.headers.project === "bracket") {
    
      // storage & resources
      if (path[1] === "storage" || path[1] === "resources") return require("./function/storageLocal").getFile({ req, res })
  
      // database
      if (path[1] === "database") return require("./function/databaseLocal").getdb({ req, res })
    }
  */

  // resources
  if (path[1] === "resources") return require("./function/storageLocal").getFile({ req, res })

  // storage
  if (path[1] === "storage") return getFile({ req, res, storage })

  // database
  if (path[1] === "database") return getdb({ req, res, db, realtimedb })

  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)

  // respond
  return createDocument({ req, res, db, realtimedb })
})

// book a ticket
// require("./function/bookFlyBaghdad")()

// AOU
// require("./function/aou")()

// create new flight
// require("./flybaghdad/newFlight")(db)