var express = require("express")
var device = require('express-device')
var cookieParser = require('cookie-parser')

// config
require('dotenv').config()

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

// post
app.post("*", (req, res) => {

  var path = req.url.split("/")

  if (path[1] === "api") {
    if (path[2] === "file") return uploadApi({ req, res })
    return postApi({ req, res })
  }
})

// delete
app.delete("*", (req, res) => {
  var path = req.url.split("/")

  if (path[1] === "api") return deleteApi({ req, res })
})

// get
app.get("*", (req, res) => {
  var path = req.url.split("/")
  
  // api
  if (path[1] === "api") return getApi({ req, res })
  
  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)
  
  // respond
  return createDocument({ req, res })
})

app.listen(80, () => console.log("Server listening to Port 80"))