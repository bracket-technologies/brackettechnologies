const fs = require("fs")
const { toArray } = require("./toArray")
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

var getFile = ({ req, res, storage }) => {
  //
}

const postFile = async ({ req, res, storage }) => {

  var collection = req.url.split("/")[2]
  // if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  collection += `-${req.headers["project"]}`
  var file = req.body.file, url
  var upload = req.body.upload
  var ref = db.collection(collection)

  // file Type
  upload.type = upload.type.split("-").join("/")
  // convert base64 to buffer
  var buffer = Buffer.from(file, "base64")

  await storage.ref().child(`${collection}/${upload.doc}`).put(buffer, { contentType: upload.type })
    .then(async snapshot => {

      url = await snapshot.ref.getDownloadURL()

    }).catch(error => {

      success = false
      message = error
    })

  // post api
  var data = {
    url,
    id: upload.doc,
    name: upload.name,
    description: upload.description || "",
    type: upload.type,
    tags: upload.tags,
    title: upload.title
  }

  await ref.doc(data.id).set(data).then(() => {

    success = true
    message = `${collection} saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ data, success, message })
}

const deleteFile = ({ erase = {} }) => {
  //
}

module.exports = { getFile, postFile, deleteFile }