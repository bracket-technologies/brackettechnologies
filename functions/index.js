var functions = require("firebase-functions")
var express = require("express")
var device = require('express-device')
var cookieParser = require('cookie-parser')
var firebase = require("firebase-admin")
// require("firebase/firestore")

// var bracketDomains = ["bracketjs.com", "localhost", "bracket.localhost"]

// config
require('dotenv').config({ path: '.env' })
var fbConfig = { "type": "service_account", "project_id": "bracketjs", "private_key_id": "dbb6b504587a2dc87f79f45910a5beaad2bafd84", "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNY6gHNayJb2U/\nMBtuZkGeikqvQV7sLfUr88BTjVY4cGBniYNizHt3f4A5HQooSQmF4XAlSEZypcr+\ndzepMAz3x2ADfYvFjc6H/mKpZDZpoQAkiEWdLt/xV6NNVlV1080BZ5spIJ/U2ILw\n2VahadUFwAWtaaIDHFbxbFOVH4jP0wIdIGTyfpxDsmBkIGRYQUb95w99uT58/ESm\nifCzC+gJMLQhfAavCYFD0MKnHV4TcaDPy9yb5G4HDLIcjaFSEz1aym81jiPbVOTU\nyrdHjspN3TLnGjbWx96xAAtoho6Qgtmmt54L7WXcElC4zai3+kTzTqBCYWWbu6sa\nr1/oydQHAgMBAAECggEAA3eEZbtCW7EEqW4D+4JzpFI/suVIe+7Ma5AtSEN1cBDG\nabWlMLnB2nhcg2wiGWS2rTsWU07nWGEORZ1DeOX9Bp0ieP8rtyw0vs0duvAK84RN\n0WzWHb7bEGn+RkFr2NS/QSZDX/JbixJeSKRPXvz9G/cm5hYVKRGh/dxW9g8VY64Q\nkTBGvTlguqUnyMPBMBUCmobG8CrTWQWMQPzjlTDXVTbDOXajUZYoTRwttyt3Ovo7\ngR547QM+Ie4GX7GD/nkLKUviUNctBHDvynCocAPZ+er/fMrfywh11HOvEjqfalZ6\nz/HkxxZn77TqTzs350Mj7yK/AY6rWcEbpw/NDEp4CQKBgQC+8uE5gwvoAG0saJFs\np3oFJ7bN7Oc8uh6uknJCHels/4uHAJycgO/EKimNIE2p+BIFJI9yJ0l5hTVvSYIa\nU2K3mEByaBKwDYvyg3h5O2mbbCuMv8lMngPl2jQHAdectYPrxIhNRA2AkabQ3WrB\ngD7EMg6rc+YPDnYPyj5VeIvuSQKBgQC9jpIrTs2xA7sVx8BL3hMkcw4jaZ2SStWR\nAGU58m0Nr7Oac25mfwbTXaSdFtqULiwXX2jt9GPSlapUrKYJBccqROsxvdb1lojB\nxoEqvmqGd8JizkEGFVEQoHoCBoAfcy04krNcacJNqTA4DjS4VkD9204MWKAkVFOT\npq52Yr7vzwKBgAwpT+rny8RU8p8Xcduntv/JDb2Dzx5xBC8+KITJfupwRCSvB0p4\nc8zcmpTgb9HZeNxW/cPZeLaCo2qZFe4zTWBAFCq1MiuAUV96vBuMiydY9lUaiemV\nTs4+3X1swpy6etJzS/MP2IRNwoAe+gOk9Vptjb2hvg9Lbn2G9f1flhnxAoGBAKEu\nzS3UOWVuxbOUgfhBIsfYqcoE8b7GsWk2C91FPePoZnFL/DFdjEFInEQTfdOIm2dY\nctH8ALG9H/QWRqzfY+aWaeOHCHUWBr22/HiLJ+ulg/4eYf45PBBGVNjKDEIx3t7/\nJ1LKfzUoS18u/TdN6L+zrl8jMTETH2oqzqjN+IvTAoGAWr6Kwcng3cf0JKLWf5mJ\n1mo2OY1rIQucZ4M4q6dVPtEfdMTpa+q3Ex+bRImv6mGpL3VUun1hIzTBpmeVDBXW\n916SYgXYa5vlOOKZe8D/Ayp9dm7F00uyXOJgQe4Zn0ixBpUjRTe+SxOc4udWCTCA\njrRs0pTdR9b2A1GFnUr0aWU=\n-----END PRIVATE KEY-----\n", "client_email": "firebase-adminsdk-3gkdr@bracketjs.iam.gserviceaccount.com", "client_id": "114637322767200692754", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3gkdr%40bracketjs.iam.gserviceaccount.com" }

// firebase
firebase.initializeApp({ 
  credential: firebase.credential.cert(fbConfig), 
  databaseURL: "https://bracketjs-default-rtdb.firebaseio.com" 
})
var db = firebase.firestore()
var realtimedb = firebase.database()

// realtimedb.ref("view-bracketjs").set({ type: "View" })

/* 
realtimedb.ref("view-bracketjs").once("value").then(function(snapshot) {
  console.log( snapshot.val() )
}) 
*/

var { getdb, postdb, deletedb } = require("./function/database")
var { getFile, postFile, deleteFile } = require("./function/storage")
var { createDocument } = require("./function/createDocument")
const { generate } = require("./function/generate")

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

  // bracket
  if (req.headers.project === "bracket") {

    // storage
    if (path[1] === "storage") return require("./function/storageLocal").postFile({ req, res })

    // database
    if (path[1] === "database") return require("./function/databaseLocal").postdb({ req, res })
  }

  // storage
  if (path[1] === "storage") return postFile({ req, res, storage })

  // database
  if (path[1] === "database") return postdb({ req, res, db, realtimedb })
})

// delete
app.delete("*", (req, res) => {
  var path = req.url.split("/")

  // bracket
  if (req.headers.project === "bracket") {

    // storage
    if (path[1] === "storage") return require("./function/storageLocal").deleteFile({ req, res })

    // database
    if (path[1] === "database") return require("./function/databaseLocal").deletedb({ req, res })
  }

  // storage
  if (path[1] === "storage") return deleteFile({ req, res, storage })

  // database
  if (path[1] === "database") return deletedb({ req, res, db, realtimedb })
})

// get
app.get("*", async (req, res) => {
  var path = req.url.split("/")

  /*
    // var host = req.headers["x-forwarded-host"] || req.headers["host"]
  
    // bracket
    if (req.headers.project === "bracket") {
    
      // storage & resources
      if (path[1] === "storage" || path[1] === "resources") return require("./function/storageLocal").getFile({ req, res })
  
      // database
      if (path[1] === "database") return require("./function/databaseLocal").getdb({ req, res })
    }
  */

  // resources
  if (path[1] === "resources") return require("./function/storageLocal").getFile({ req, res })

  // storage
  if (path[1] === "storage") return getFile({ req, res, storage })

  // database
  if (path[1] === "database") return getdb({ req, res, db, realtimedb })

  // favicon
  if (req.url === "/favicon.ico") return res.sendStatus(204)

  // respond
  return createDocument({ req, res, db, realtimedb })
})

// book a ticket
// require("./function/bookFlyBaghdad")()

// AOU
// require("./function/aou")()

// create new flight
// require("./flybaghdad/newFlight")(db)
/*
var whatsapp = async () => {

  const { Client, LocalAuth } = require('whatsapp-web.js');

  const qrcode = require('qrcode-terminal');
  
  const client = new Client({ authStrategy: new LocalAuth({ clientId: "client-one" }) })
  var messages = [], calls = [], myMessages = [], simplified = []

  client.on('qr', (qr) => {
      // Generate and scan this code with your phone
      qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
      console.log('Client is ready!');
  });

  client.on('message', msg => {

    messages.push({
      ack: msg.ack,
      author: msg.author,
      body: msg.body,
      broadcast: msg.broadcast,
      deviceType: msg.deviceType,
      duration: msg.duration,
      forwardingScore: msg.forwardingScore,
      from: msg.from.split("@")[0],
      fromMe: msg.fromMe,
      hasMedia: msg.hasMedia,
      hasQuotedMsg: msg.hasQuotedMsg,
      id: msg.id.id,
      inviteV4: msg.inviteV4,
      isEphemeral: msg.isEphemeral,
      isStatus: msg.isStatus,
      isStarred: msg.isStarred,
      isGif: msg.isGif,
      links: msg.links,
      location: msg.location,
      mediaKey: msg.mediaKey,
      mentionedIds: msg.mentionedIds,
      orderId: msg.orderId,
      timestamp: msg.timestamp,
      to: msg.to.split("@")[0],
      token: msg.token,
      type: msg.type,
      vCards: msg.vCards
    })

    require("fs").writeFileSync(`whatsapp/messages.json`, JSON.stringify(messages, null, 2))

    simplified.push({
      body: msg.body,
      from: msg.from.split("@")[0],
      to: msg.to.split("@")[0],
      timestamp: msg.timestamp,
      type: msg.type,
      date: new Date(msg.timestamp * 1000)
    })

    // chats by number messages
    require("fs").writeFileSync(`whatsapp/contact/${msg.from.split("@")[0]}.json`, JSON.stringify(simplified, null, 2))

    // text
    if (msg.body == 'زوجي') client.sendMessage(msg.from, 'اه حبيبتي');
    else if (msg.body == 'كيفك؟' || msg.body == 'كيفك حبب' || msg.body == 'kfk?' || msg.body == 'kfk' || msg.body == 'kfk hbb' || msg.body == 'kfk 7bb') client.sendMessage(msg.from, 'تمام حبب إنت كيفك؟');
    else if (msg.body == 'شو أخبارك؟' || msg.body == 'شو أخبارك' || msg.body == 'shu a5brk' || msg.body == 'shu a5barak' || msg.body == 'shu a5barak?') client.sendMessage(msg.from, 'حبب كلو تمام، إنت وين أيامك');
    else if (msg.body == 'bro') client.sendMessage(msg.from, 'Hello bro, Eh 7bb elle?');
    else if (msg.body == 'slm' || msg.body == 'salam' || msg.body == 'سلام') client.sendMessage(msg.from, 'هلا حبب وعليكم السلام، كيفك؟');

  });

  // calls
  client.on('incoming_call', call => {

    calls.push({
      from: call.from.split("@")[0],
      fromMe: call.fromMe,
      id: call.id,
      isGroup: call.isGroup,
      isVideo: call.isVideo,
      participants: call.participants,
      timestamp: call.timestamp,
      outgoing: call.outgoing,
      webClientShouldHandle: call.webClientShouldHandle
    })

    require("fs").writeFileSync(`whatsapp/chat.json`, JSON.stringify(calls, null, 2))

    simplified.push({
      from: msg.from.split("@")[0],
      to: msg.to.split("@")[0],
      timestamp: msg.timestamp,
      type: "call",
      date: new Date(msg.timestamp * 1000)
    })

    // chats by number messages
    require("fs").writeFileSync(`whatsapp/contact/${msg.from.split("@")[0]}.json`, JSON.stringify(simplified, null, 2))
  })

  // calls
  client.on('call', call => {

    console.log(call);
    calls.push(call)
    require("fs").writeFileSync(`whatsapp/calls.json`, JSON.stringify(calls, null, 2))
  })

  // created messages
  client.on('message_create', msg => {

    var type = msg.type
    if (msg.type === "ptt") type = "call"

    myMessages.push({
      ack: msg.ack,
      author: msg.author,
      body: msg.body,
      broadcast: msg.broadcast,
      deviceType: msg.deviceType,
      duration: msg.duration,
      forwardingScore: msg.forwardingScore,
      from: msg.from.split("@")[0],
      fromMe: msg.fromMe,
      hasMedia: msg.hasMedia,
      hasQuotedMsg: msg.hasQuotedMsg,
      id: msg.id.id,
      inviteV4: msg.inviteV4,
      isEphemeral: msg.isEphemeral,
      isStatus: msg.isStatus,
      isStarred: msg.isStarred,
      isGif: msg.isGif,
      links: msg.links,
      location: msg.location,
      mediaKey: msg.mediaKey,
      mentionedIds: msg.mentionedIds,
      orderId: msg.orderId,
      timestamp: msg.timestamp,
      to: msg.to.split("@")[0],
      token: msg.token,
      type: msg.type,
      vCards: msg.vCards
    })

    require("fs").writeFileSync(`whatsapp/messages.json`, JSON.stringify(myMessages, null, 2))
    
    simplified.push({
      body: msg.body,
      from: msg.from.split("@")[0],
      to: msg.to.split("@")[0],
      timestamp: msg.timestamp,
      type,
      date: new Date(msg.timestamp * 1000)
    })

    // chats by number messages
    require("fs").writeFileSync(`whatsapp/contact/${msg.from.split("@")[0]}.json`, JSON.stringify(simplified, null, 2))
  })

  /* // send image base64
  sendMedia
  const media = new MessageMedia('image/png', base64Image);
  chat.sendMessage(media);
  */

  /* // send image from path
  const media = MessageMedia.fromFilePath('./path/to/image.png');
  chat.sendMessage(media);
  */

  /* // send image from URL
  const media = MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
  chat.sendMessage(media);
  */
/*
  client.initialize();
}

whatsapp()
*/