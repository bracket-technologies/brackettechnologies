const firebase = require("firebase-admin")
const functions = require("firebase-functions")
const { MongoClient, ServerApiVersion } = require('mongodb')
const http = require('node:http')
require("firebase/firestore")
var EasyTunnel = require("./action/easy-tunnel")
const fs = require("fs")
const { getData } = require("./action/database")
const { generate } = require("./action/generate")
const { compress, decompress } = require("compress-json")
const { collection } = require("firebase/firestore")
const networkInterfaces = require('os').networkInterfaces()
var network = require("./network.json")

// config
require('dotenv').config();

// main
var data = {}
/*
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
*/

// get private ip
network.private = (networkInterfaces.Ethernet || networkInterfaces["Wi-Fi 2"]).find(add => add.family === "IPv4").address;
// get public ip
require('http').get({ 'host': 'api.ipify.org', 'port': 80, 'path': '/' }, (resp) => {
  resp.on('data', (ip) => {
    network.public = ip.toString()
    console.log(`private: ${network.private} | public: ${network.public}`);
  })
})

// app
const app = (req, res) => {

  // parse body
  res.statusCode = 200
  req.body = []
  req
    .on('data', chunk => req.body.push(chunk))
    .on('end', () => {

      req.network = network
      req.body = JSON.parse(Buffer.concat(req.body).toString() || "{}")

      try {
        require("./action/router")({ req, res, data })
      } catch (err) {
        require("./action/router")({ req, res, data })
      }
    })
}

// run servers
network.servers.map(server => {

  http.createServer(app).listen(server.port, ["localhost"], () => {
    console.log(`Server Listening to Port ${server.port}`)
    new EasyTunnel(server.port, server.Tsubdomain).start()
  })
})

// exports.app = functions.https.onRequest((req, res) => require("./action/router")({ req, res, data }))

// require("./action/moveData")(data);

var test0 = () => {

  for (let index = 409041; index <= 1000000; index++) {
    fs.writeFileSync(`bracketDB/test/test/test${index}.json`, JSON.stringify({ __props__: { doc: `test${index}` } }, null, 2))
    if (index === 1000000) console.log("done");
  }
}
//test0()

var test1 = async () => {
  var timer = new Date().getTime()
  fs.readdirSync(`bracketDB/test/test`)
  var timer1 = new Date().getTime()
  console.log("docs", timer1 - timer);
  JSON.parse(fs.readFileSync(`bracketDB/test/test/test100000.json`))
  var timer2 = new Date().getTime()
  console.log("direct readFileSync", timer2 - timer1);
  //await getData({ search: { datastore: "bracketDB", db: "test", collection: "test", find: { "__props__.doc": "test900000" }}})
  var timer3 = new Date().getTime()
  console.log("find", timer3 - timer2);
  await getData({ search: { datastore: "bracketDB", db: "test", collection: "test", doc: "settings" } })
  var timer4 = new Date().getTime()
  console.log("settings", timer4 - timer3);
}
//test1()

var test2 = async () => {
  var data = {}

  for (let index = 0; index < 10000; index++) {
    var id = generate()
    data[id] = {
      id,
      creationDate: new Date(),
      counter: index,
      name: "counasdasfsater" + index,
      id1: id,
      creationDate1: new Date(),
      counter1: index,
      name1: "counxcbvcgfhter" + index,
      id2: id,
      creationDate2: new Date(),
      counter2: index,
      name2: "cofdhshsdunter" + index,
      id3: id,
      creationDate3: new Date(),
      counter3: index,
      name3: "coucvnbn fxgb sdnter" + index,
      id4: id,
      creationDate4: new Date(),
      counter4: index,
      name4: "countwer efdsf asdfasfer" + index,
      test: [{
        afdfc: id,
        dfsdfsdf: new Date(),
        safsd: index,
        nagfdgdfge4: "counasdfsfaveqwerter" + index,
      }, {
        idss4: id,
        creatiosfdgdsfnDate4: new Date(),
        coufddnter4: index,
        namasdfe4: "counter" + index,
      }, {
        idsdf4: id,
        creatsdfsionDate4: new Date(),
        cosdfudfnter4: index,
        nasdfme4: "counter" + index,
      }, {
        idsdfsd4: id,
        dfsd: new Date(),
        cofsdfunter4: index,
        nagvcbme4: "counter" + index,
      }],
      fghfg: [{
        id4hgjg: id,
        crehationDate4: new Date(),
        cohmbnmbme4: "counter" + index,
      }, {
        ivbnvd4: id,
        crnvbeationDate4: new Date(),
        bn: index,
        vbnbmhgj: "counter" + index,
      }, {
        nmbnm: id,
        fghfg: new Date(),
        vnv: index,
        fghfg: "counter" + index,
      }, {
        rtyrt: id,
        crehfghfationDate4: new Date(),
        name4: "counter" + index,
      }]
    }
  }
  fs.writeFileSync(`bracketDB/test/test/settings.json`, JSON.stringify(data, null, 2))
  var compressed = compress(data)
  fs.writeFileSync(`bracketDB/test/test/compressed.json`, JSON.stringify(compressed))
}
//test2()

var test3 = () => {
  var data = {}
  for (let index = 0; index <= 1000000; index++) {
    data[`test1${index}`] = { __props__: { doc: `test1${index}` } }
  }
  fs.writeFileSync(`bracketDB/test1/test1/test1.json`, JSON.stringify(data, null, 2))
}
//test3()

var test4 = async () => {

  var timer3 = new Date().getTime()
  var { data } = await getData({ search: { datastore: "bracketDB", db: "test", collection: "test", doc: "settings" } })
  var stats = fs.statSync("bracketDB/test/test/settings.json")
  var fileSizeInBytes = stats.size;
  var timer4 = new Date().getTime()
  console.log("uncompressed", fileSizeInBytes, timer4 - timer3);

  var data = fs.readFileSync(`bracketDB/test/test/compressed.json`)
  var stats = fs.statSync("bracketDB/test/test/compressed.json")
  var fileSizeInBytes = stats.size;
  data = decompress(data)
  var timer6 = new Date().getTime()
  console.log("compressed", fileSizeInBytes, timer6 - timer4);

  var data = fs.readFileSync(`bracketDB/test/test/brotli.bin`)
  data = brotli.decompress(data)
  var timer7 = new Date().getTime()
  console.log("brotli", data.toString().length, timer7 - timer6);
}
//test4()

var test5 = async () => {
  ["a1t7U0H8A8y877a0A1t9O05879", "01I7C0K8W8X8h720t1U9P123p6"].map(db => {
    var collections = fs.readdirSync("bracketDB/" + db)
    collections.map(collection => {
      if (!fs.existsSync(`bracketDB/${db}/${collection}`) || collection === "__props__") return
      var props = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/__props__.json`)))
      props.dirTree = []
      fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compress(props)))
    })
  })
}
//test5()

var scaleData = async () => {

  ["a1t7U0H8A8y877a0A1t9O05879", "01I7C0K8W8X8h720t1U9P123p6"].map(db => {

    var collections = fs.readdirSync("bracketDB/" + db)

    var dbProps = {
      creationDate: new Date().getTime(),
      collectionsLength: collections.length,
      docsLength: 0,
      reads: 0,
      writes: 0,
      deletes: 0,
      size: 0,
      payloadIn: 0,
      payloadOut: 0
    }

    collections.map(collection => {

      if (collection === "__props__") return
      var collectionData = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/chunk0.json`)))
      var docs = Object.keys(collectionData)

      /*docs.map(doc => {

        var query = JSON.parse(fs.readFileSync("bracketDB/" + db + "/" + collection + "/" + doc))
        fs.unlinkSync("bracketDB/" + db + "/" + collection + "/" + doc)
        doc = doc.split(".json")[0]
        collectionData[doc] = query
      })*/

      // chunk
      var size = Buffer.byteLength(JSON.stringify(collectionData))
      /*var collectionProps = {
        creationDate: new Date().getTime(),
        collection,
        chunkMaxSizeMB: 20,
        lastChunk: 0,
        docsLength: docs.length,
        counter: docs.length,
        reads: 0,
        writes: 0,
        deletes: 0,
        size,
        payloadIn: size,
        payloadOut: 0,
        chunks: [{ creationDate: new Date().getTime(), size, docsLength: docs.length }]
      }*/

      // db props
      dbProps.size += size
      dbProps.payloadIn += size
      dbProps.docsLength += docs.length

      // compress
      //var compressed = compress(collectionData)

      // compress
      //var compressedCollectionProps = compress(collectionProps)

      // save chunk, collection __props__, and db props
      //fs.writeFileSync(`bracketDB/${db}/${collection}/chunk0.json`, JSON.stringify(compressed))
      //fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compressedCollectionProps))
    })

    // compress
    var compressedDbProps = compress(dbProps)

    // db props
    fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compressedDbProps))
  })
}
//scaleData()

var createPlugin = async () => {

  // get project
  var { data } = await getData({ _window, req, search: { db: bracketDB, collection: "project", find: { "__props__.doc": { equal: "acc" } } } })
  var project = Object.values(data || {})[0]

  // get account
  var { data } = await getData({ _window, req, search: { db: bracketDB, collection: "account", find: { "__props__.id": { equal: project.accountID } } } })
  var account = Object.values(data || {})[0]

  // plugin
  var plugin = {
    name: "Travel Accounting Platform",
    accountID: account.__props__.id,
    projectID: project.__props__.id,
    plugins: [{
      type: "project",
      db: project.db,
      collections: true,
      docs: true
    }],
    price: 100,
    unit: "TOKEN",
    freeTierDuration: 1296000000, // 15 days
    subscriptionDuration: 2592000000, // 1 month
    releaseDate: new Date().getTime(),
    expiryDate: 9999999999999,
    status: "Confirmed",
    approved: true
  }

  // save plugin
  postData({ _window, req, res, save: { db: bracketDB, collection: "plugin", data: plugin } })
}