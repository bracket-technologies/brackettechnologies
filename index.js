const http = require('node:http')
const EasyTunnel = require("./action/easy-tunnel")
const { getData, start } = require("./action/kernel")
const { toArray } = require('./action/toArray')
const router = require('./action/router')
const { generate } = require('./action/generate')
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
      req.body = JSON.parse(Buffer.concat(req.body).toString() || "{}")
      // server id
      res.serverID = serverID

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
  server.on("error", () => {console.log("Error running server!");})

} else {

  // get hosts
  getData({ search: { db: bracketDB, collection: "host", find: { port: { gte: 80 } } } }).then(({ data }) => {

    hosts = Object.values(data)
    if (!hosts[0]) return
    
    hosts.map(host => {
      toArray(host.port).map(async port => start(port))
    })
  })
}