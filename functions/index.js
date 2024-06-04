const http = require('node:http')
const EasyTunnel = require("./action/easy-tunnel")
const { getData, start } = require("./action/kernel")
const { toArray } = require('./action/toArray')
const router = require('./action/router')
const networkInterfaces = require('os').networkInterfaces()

// config
require('dotenv').config()

// project DB
var bracketDB = process.env.BRACKETDB

// get public ip
/*http.get({ 'host': 'api.ipify.org', 'port': 80, 'path': '/' }, (res) => {
  res.on('data', (publicIP) => {
    ip.public = publicIP.toString()
    port === 80 && console.log(`private: ${ip.private} | public: ${ip.public}`);
  })
})*/

// get private ip
var ip = { private: (networkInterfaces.Ethernet || networkInterfaces["Wi-Fi 2"]).find(add => add.family === "IPv4").address }

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
  server.on("error", () => {console.log("here");})

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