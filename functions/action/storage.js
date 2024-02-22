const fs = require("fs")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
var _window = { global: {}, views: {} }
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

const storage = async ({ req, res }) => {

  var upload = req.body.upload
  var data = await storeFile({ req, upload })
  res.send(data)
}

const storeFile = async ({ req, upload }) => {

  var db = req.db.firebaseDB
  var storage = req.storage.firebaseStorage
  var file = upload.file
  var data = upload.data, url
  
  // convert base64 to buffer
  var buffer = Buffer.from(file, "base64")
  
  // 
  upload.doc = upload.doc || generate({length: 20})

  var collection = `storage-${req.headers["project"]}`
  
  await storage.bucket().file(`${collection}/${upload.doc}`).save(buffer, { contentType: data.type }, async () => {
    url = await storage.bucket().file(`${collection}/${upload.doc}`).getSignedUrl({ action: 'read', expires: '03-09-3000' })
  })
  
  // post api
  data = {
    ...data,
    url: url[0],
    id: upload.doc,
    name: data.name,
    description: data.description || "",
    type: data.type,
    tags: data.tags || [],
    title: data.title || data.type.toUpperCase(),
    "creation-date": parseInt(req.headers.timestamp)
  }
  
  await db.collection(collection).doc(upload.doc).set(data).then(() => {

    success = true
    message = `Document saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return ({ data, success, message })
}

const deleteFile = async ({ req, res }) => {
  
  var db = req.db.firebaseDB
  var storage = req.storage.firebaseStorage
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, data: string, id: "" })
  var erase = params.erase || {}

  var collection = `storage-${req.headers["project"]}`

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

module.exports = { storeFile, deleteFile, storage }