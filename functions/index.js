const functions = require("firebase-functions")
const device = require('express-device')
const firebase = require("firebase-admin")
const express = require("express")
const cookieParser = require('cookie-parser')
const { postJsonFiles, getJsonFiles } = require("./action/jsonFiles")
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

// db.collection(`_project_`).where("id", "==", "brackettechnologies").get().then(query => query.forEach(doc => postJsonFiles({ save: { data: doc.data(), collection: "test1", doc: doc.id } })))
/*var project = getJsonFiles({ search: { collection: "test1", doc: "brackettechnologies" } })
db.collection(`view-brackettechnologies`).get().then(query => query.forEach(doc => { 
  project.datastore.views.push(doc.id); 
  postJsonFiles({ save: { data: project, collection: "test1", doc: "brackettechnologies" } }) 

  db.collection(`view-brackettechnologies`).doc("route").set(getJsonFiles({ search: { collection: "test1", doc: "route" } }))
  db.collection(`view-brackettechnologies`).doc("document").set(getJsonFiles({ search: { collection: "test1", doc: "document" } }))
  db.collection(`view-acc`).doc("route").set(getJsonFiles({ search: { collection: "test", doc: "route" } }))
  db.collection(`view-acc`).doc("document").set(getJsonFiles({ search: { collection: "test", doc: "document" } }))
  db.collection(`_project_`).doc("brackettechnologies").set(getJsonFiles({ search: { collection: "test1", doc: "brackettechnologies" } }))
}))*/

// db.collection(`_project_`).doc("brackettechnologies").set(getJsonFiles({ search: { collection: "test1", doc: "brackettechnologies" } }))