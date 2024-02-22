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
  
  var folder = req.url.split("/")[2]
  var path = req.url.split(`${folder}/`)[1]
  
  var docType = path.split(".").slice(-1)[0].split("?")[0]
  var type = mime[docType]
  var file = fs.createReadStream(`${folder}/${path}`)
  
  file.on("open", () => {
    res.setHeader("Content-Type", type)
    file.pipe(res)
  })
}

const postFile = ({  req, res, save = {} }) => {
  //
}

const deleteFile = ({  req, res, erase = {} }) => {
  //
}

module.exports = { getLocalFile, postFile, deleteFile }