// const functions = require("firebase-functions")
const express = require("express")
const sls = require("serverless-http")
const cookieParser = require('cookie-parser')
const device = require('express-device')
const firebase = require("firebase-admin")
const api = require("./api")
// require("firebase/firestore")

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

const db = firebase.firestore()
const rdb = firebase.database()
const storage = firebase.storage()

// rdb.ref("view-bracketjs").set({ type: "View" })

/* 
rdb.ref("view-bracketjs").once("value").then(function(snapshot) {
  console.log( snapshot.val() )
}) 
*/

const app = express()

app.use(device.capture())
app.use(express.static("browser", { redirect: false }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.json({ limit: '50mb' }))

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*")
  next()
})

app.listen(8080, () => console.log("Server Listening to Port 8080"))

// exports.app = functions.https.onRequest(app)
module.exports.app = sls(app)
api({ app, db, storage, rdb })

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