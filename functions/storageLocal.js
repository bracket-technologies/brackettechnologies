const fs = require("fs")
const mime = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  png: "image/png",
  svg: "image/svg+xml",
  json: "application/json",
  woff: "application/font-woff",
  woff2: "font/woff2",
  js: "application/javascript",
  ico: "image/x-icon"
}

var getLocalFile = ({ req, res }) => {
  
  var folder = req.url.split("/")[1]
  var path = req.url.split("/")[2].split("?")[0]
  var timer = new Date().getTime()
  var docType = path.split(".").slice(-1)[0]
  var type = mime[docType]
  var file = fs.createReadStream(`${folder}/${path}`)
  
  res.setHeader('Cache-Control', 'max-age=604800')
  res.setHeader("Expires", new Date(Date.now() + 604800000).toUTCString())

  file.on("open", () => {
    
    res.setHeader("Content-Type", type)
    var stream = file.pipe(res)
    stream.on("finish", () => {
  
      console.log(path, new Date().getTime() - timer);
    })
  })
}

const postFile = ({  req, res, save = {} }) => {
  //
}

const deleteFile = ({  req, res, erase = {} }) => {
  //
}

module.exports = { getLocalFile, postFile, deleteFile }