const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const readFile = require("./readFile")
const { toArray } = require("./toArray")

module.exports = async ({ _window, lookupActions, awaits, id, req, res, e, __, ...params }) => {
        
  var upload = params.upload, promises = []
  var global = _window ? _window.global : window.global
  var view = _window ? _window.views : window.views[id]
  var alldata = toArray(upload.data || []), uploadedData = [], local = false
  var headers = clone(upload.headers) || {}
  var files = toArray(/*upload.data.file || */upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])
  var collection = upload.collection || "storage"
  if (_window) collection += `-${req.headers["project"]}`
  
  if (!headers.project) headers.project = global.projectId;
  
  promises.push(...([...files]).map(async (f, i) => {

    if (typeof f === "string") f = { file: f, type }

    var upload = {collection}
    var data = alldata[i] || {}
    var file = await readFile(f)
if (!data) return console.log("Data does not exist!");
    upload.doc = f.id || f.doc || docs[i] || generate({ length: 20 })
    data.name = f.name || data.name || generate({ length: 20 })
    
    // get file type
    var type = data.type || f.type
    
    // get regex exp
    var regex = new RegExp(`^data:${type};base64,`, "gi")
    file = file.replace(regex, "")

    // data
    upload.data = clone(data)

    if (_window) {

      var db = req.db
      var storage = req.storage

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
        "creation-date": parseInt(req.headers.timestamp)
      }

      return await db.collection(collection).doc(upload.doc).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`
        uploadedData.push({ success, message, data })

      }).catch(error => {

        success = false
        message = error
      })

    } else {

      headers["timestamp"] = (new Date()).getTime()
      headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

      local = true
      delete upload.data.url
      delete upload.data.file
      var {data} = await axios.post(`/storage`, { upload, file }, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })

      uploadedData.push(data)
      return data
    }
  }))

  await Promise.all(promises)
  //if (local) uploadedData = uploadedData.map(({ data }) => data)
  
  view.uploads = []
  global.uploads = []

  uploadedData.map(data => {

    view.upload = clone(data)
    view.uploads.push(clone(data))

    if (files.length > 1) console.log(view.uploads)
    else console.log(view.upload)
    
    global.upload = clone(data)
    global.uploads.push(clone(data))
  })
  
  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req, res, id, e, __: [global.uploads.length === 1 ? global.uploads[0] : global.uploads, ...__], ...params })
}