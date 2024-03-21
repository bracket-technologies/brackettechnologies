const firebase = require("firebase-admin")
const functions = require("firebase-functions")
const { MongoClient, ServerApiVersion } = require('mongodb')
const http = require('node:http')
require("firebase/firestore")

// config
require('dotenv').config();

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

// acc server
http.createServer(server).listen(80, ["localhost", "192.168.10.204"], () => console.log("Server Listening to Port 80"))

// bracket server
http.createServer(server).listen(8080, ["localhost", "192.168.10.204"], () => console.log("Server Listening to Port 8080"))

exports.app = functions.https.onRequest((req, res) => require("./action/router")({ req, res, data }))

require("./action/moveData")(data)