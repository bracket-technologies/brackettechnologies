const http = require('node:http')
const EasyTunnel = require("./functions/easy-tunnel")
const { getData, start } = require("./functions/kernel")
const { toArray } = require('./functions/toArray')
const router = require('./functions/router')
const { generate } = require('./functions/generate')
const networkInterfaces = require('os').networkInterfaces()

// config
require('dotenv').config()

// project DB
var bracketDB = process.env.BRACKETDB

// get private ip
var ip = { private: (networkInterfaces.Ethernet || networkInterfaces["Wi-Fi 2"]).find(add => add.family === "IPv4").address }
var serverID = generate({ unique: true })

// app
const app = (req, res) => {

  // parse body
  res.statusCode = 200
  req.body = []
  req
    .on('data', chunk => req.body.push(chunk))
    .on('end', () => {

      req.ip = ip
      res.serverID = serverID
      req.body = JSON.parse(Buffer.concat(req.body).toString() || "{}")
      router({ req, res })
    })
}

// port
var port = parseInt(process.argv[2])
if (port) {
  
  const server = http.createServer(app)

  server.listen(port, [], () => {
    console.log(`Server Listening to Port ${port}`)
    //new EasyTunnel(port, "brc" + host.subdomain).start()
  })
  server.on("error", (err) => {console.log("Error running server!", err);})
  
} else {

  // get hosts
  var {data: hosts} = getData({ search: { db: bracketDB, collection: "host", find: { port: { gte: 80 } } } })
  Object.values(hosts).map(host => host.port.map(port => start(port)))
}