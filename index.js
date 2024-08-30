const http = require('node:http')
// const EasyTunnel = require("./functions/easy-tunnel")
const { getData, start, postData, database } = require("./functions/kernel")
const router = require('./functions/router')
const { generate } = require('./functions/generate')
const networkInterfaces = require('os').networkInterfaces()
const { connectToWebSocket, createWebSocket } = require('./functions/websocket')

// config
require('dotenv').config()

// project DB
var bracketDB = process.env.BRACKETDB

// get private ip
// var ip = { private: (networkInterfaces.Ethernet || networkInterfaces["Wi-Fi 2"]).find(add => add.family === "IPv4").address }
var serverID = global.serverID = process.argv[3]

// port
var port = parseInt(process.argv[2])

// get hosts => run applications
if (!port) {

  createWebSocket()

  // get hosts
  var { data: hosts } = database({ action: "search()", data: { db: bracketDB, collection: "host", find: { port: { gte: 80 } } } })
  return Object.values(hosts).map(host => host.port.map(port => start(port, generate({ unique: true }))))
}

// Connect to the WebSocket server
const ws = connectToWebSocket({ serverID, port })

// create app
const app = (req, res) => {

  // parse body
  res.statusCode = 200
  req.body = []
  req
    .on('data', chunk => req.body.push(chunk))
    .on('end', () => {

      //req.ip = ip
      res.serverID = serverID
      req.ws = ws
      req.body = JSON.parse(Buffer.concat(req.body).toString() || "{}")
      router({ req, res })
    })
}

const server = http.createServer(app)

server.listen(port, [], () => {

  console.log(`Server Listening to Port ${port}`)
  // new EasyTunnel(port, "brc" + host.subdomain).start()
})