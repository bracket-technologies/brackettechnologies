const fs = require("fs")
const { generate } = require("./generate")
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

const postFile = async ({ req, res, storage, db }) => {

  var file = req.body.file, url
  var upload = req.body.upload
  var collection = upload.collection
  collection += `-${req.headers["project"]}`
  var data = upload.data
  
  // file Type
  data.type = data.type.split("-").join("/")
  // convert base64 to buffer
  var buffer = Buffer.from(file, "base64")
  
  await storage.bucket().file(`${collection}/${upload.doc}`).save(buffer, { contentType: data.type }, async () => {
    url = await storage.bucket().file(`${collection}/${upload.doc}`).getSignedUrl({ action: 'read', expires: '03-09-3000' })
  })
  
  // post api
  data = {
    url: url[0],
    id: upload.doc,
    name: data.name,
    description: data.description || "",
    type: data.type,
    tags: data.tags || [],
    title: data.title || data.type.toUpperCase(),
    "creation-date": (new Date).getTime()
  }
  
  await db.collection(collection).doc(upload.doc).set(data).then(() => {

    success = true
    message = `Document saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ data, success, message })
}

const deleteFile = async ({ _window, req, res, storage, db }) => {
  
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var erase = params.erase || {}

  var collection = erase.collection
  collection += `-${req.headers["project"]}`

  await storage.bucket().file(`${collection}/${erase.doc}`).delete()

  await db.collection(collection).doc(erase.doc.toString()).delete().then(() => {

    success = true,
    message = `Document erased successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ success, message })
}

module.exports = { getFile, postFile, deleteFile }