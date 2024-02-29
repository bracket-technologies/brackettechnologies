const firebase = require("firebase-admin")
const functions = require("firebase-functions")
const { MongoClient, ServerApiVersion } = require('mongodb')
const http = require('node:http')
require("firebase/firestore")

// config
require('dotenv').config()

// main
var data = {}

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

data.firebaseDB = firebase.firestore()
data.firebaseDB.settings({ ignoreUndefinedProperties: true })
data.firebaseStorage = firebase.storage()

// mongodb
const uri = `mongodb+srv://${process.env.MONGODBUSER}:${encodeURIComponent(process.env.MONGODBPASS)}@brackettechnologies.xbtdjdj.mongodb.net/?retryWrites=true&w=majority`
data.mongoDB = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const server = (req, res) => {

  // parse body
  res.statusCode = 200
  req.body = []
  req
    .on('data', chunk => req.body.push(chunk))
    .on('end', () => {
      req.body = JSON.parse(Buffer.concat(req.body).toString() || "{}")
      require("./action/router")({ req, res, data })
    })
}

http.createServer(server).listen(80, "localhost", () => console.log("Server Listening to Port 80"))

exports.app = functions.https.onRequest((req, res) => require("./action/router")({ req, res, data }))

//require("./action/router")(data)

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

// require("./action/moveData")(data)