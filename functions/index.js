var functions = require("firebase-functions")
var express = require("express")
var device = require('express-device')
var cookieParser = require('cookie-parser')
var firebase = require("firebase")
require("firebase/firestore")

// config
require('dotenv').config()

// firebase
firebase.initializeApp({"apiKey": "AIzaSyB6fGcnoqzRjUUytNv6R05euQ6RYsBJK3o", "authDomain": "bracketjs.firebaseapp.com", "projectId": "bracketjs", "storageBucket": "bracketjs.appspot.com", "messagingSenderId": "869789439383", "appId": "1:869789439383:web:09ed5cda97e32200bba0d2"})
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

  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.listen(80, () => console.log("Server Listening to Port 80"))

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
  
  // متابعتها لاحقا
  if (path.includes("_string") || path.includes("undefined")) return res.send("Wrong")

  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)

  // api: bracketjs
  if (req.headers.project === "bracketjs") return require("./function/apiLocal").getApi({ req, res, db })

  // api
  if (path[1] === "api") return getApi({ req, res, db })
  
  // respond
  return createDocument({ req, res, db })
})