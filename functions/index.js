const functions = require("firebase-functions")
const device = require('express-device')
const firebase = require("firebase-admin")
const express = require("express")
const cookieParser = require('cookie-parser')
require("firebase/firestore")

// config
require('dotenv').config()

// database
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

const db = firebase.firestore()
const rdb = firebase.database()
const storage = firebase.storage()
db.settings({ ignoreUndefinedProperties: true })

// server
const server = express()

server.use(device.capture())
server.use(express.static("browser", { redirect: false }))
server.use(cookieParser())
server.use(express.urlencoded({ extended: true, limit: "50mb" }))
server.use(express.json({ limit: '50mb' }))

server.listen(80, () => console.log("Server Listening to Port 80"))
exports.app = functions.https.onRequest(server)

require("./action/router")({ server, db, storage, rdb })