//const functions = require("firebase-functions")
const express = require("express")
const sls = require("serverless-http")
const cookieParser = require('cookie-parser')
const device = require('express-device')
const firebase = require("firebase-admin")
const api = require("./function/api")
//require("firebase/firestore")

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
db.settings({ ignoreUndefinedProperties: true })

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
// steps: api gateway --> router --> initialize --> get project --> interpret --> generate app --> send to client
// exports.app = functions.https.onRequest(app)
exports.app = sls(app)

api({ app, db, storage, rdb })

/*db.collection("flight-booking-alsabil-tourism").where("issuing-day", ">=", 1668038400000).limit(500).get().then((query) => {
  console.log(query.docs.length)
  query.docs.forEach(doc => {
    var data = doc.data()
    data["issuing-day"] = data["issue-day"]
    delete data["issue-day"]
    db.collection("flight-booking-alsabil-tourism").doc(data.id.toString()).set(data).then(() => console.log("Success"))
  })
})*/