var functions = require("firebase-functions")
var express = require("express")
var device = require('express-device')
var cookieParser = require('cookie-parser')
var firebase = require("firebase")
require("firebase/firestore")

// config
require('dotenv').config()
var config = JSON.parse(process.env.FIREBASE_CONFIG)

// firebase
firebase.initializeApp(config)
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
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.listen(5000, () => console.log("Server Listening to Port 5000"))

exports.app = functions.https.onRequest(app)

// post
app.post("*", (req, res) => {

  var path = req.url.split("/")

  if (path[1] === "api") {
    if (path[2] === "file") return uploadApi({ req, res, storage, db })
    return postApi({ req, res, db })
  }
})

// delete
app.delete("*", (req, res) => {
  var path = req.url.split("/")

  if (path[1] === "api") return deleteApi({ req, res, db })
})

// get
app.get("*", (req, res) => {
  var path = req.url.split("/")
  
  // api
  if (path[1] === "api") return getApi({ req, res, db })
  
  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)
  
  // respond
  return createDocument({ req, res, db })
})