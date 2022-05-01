var functions = require("firebase-functions")
var express = require("express")
var device = require('express-device')
var cookieParser = require('cookie-parser')
var firebase = require("firebase-admin")
// require("firebase/firestore")

// config
require('dotenv').config({ path: '.env' })

// firebase
firebase.initializeApp({ credential: firebase.credential.cert(JSON.parse(process.env.FB_CONFIG)) })
var db = firebase.firestore()
var storage = firebase.storage()

var { getApi, postApi, deleteApi, uploadApi } = require("./function/api")
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

  if (path[1] === "api") {

    // upload api
    if (path[2] === "file") {
  
      // api: bracketjs
      if (req.headers.project === "bracketjs") return require("./function/apiLocal").uploadApi({ req, res })
      
      return uploadApi({ req, res, storage, db })
    }
  
    // api: bracketjs
    if (req.headers.project === "bracketjs") return require("./function/apiLocal").postApi({ req, res })

    return postApi({ req, res, db })
  }
})

// delete
app.delete("*", (req, res) => {
  var path = req.url.split("/")
  
  // api: bracketjs
  if (req.headers.project === "bracketjs") return require("./function/apiLocal").deleteApi({ req, res })

  if (path[1] === "api") return deleteApi({ req, res, db })
})

// get
app.get("*", (req, res) => {
  var path = req.url.split("/")
  
  // متابعتها لاحقا
  if (path.includes("_string") || path.includes("undefined")) return res.send("Wrong")

  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)
  
  // api: bracketjs
  if (req.headers.project === "bracketjs") return require("./function/apiLocal").getApi({ req, res })
  
  // api
  if (path[1] === "api") return getApi({ req, res, db })
  
  // respond
  return createDocument({ req, res, db })
})