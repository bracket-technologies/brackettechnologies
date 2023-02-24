const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

module.exports = async ({ _window, lookupActions, id, req, res, e, _, __, ___, ...params }) => {
        
  var upload = params.upload, promises = []
  var global = _window ? _window.global : window.global
  var view = _window ? _window.views : window.views[id]
  var alldata = toArray(upload.data || []), uploadedData = [], local = false
  var headers = clone(upload.headers) || {}
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])
  var collection = upload.collection || "storage"
  if (_window) collection += `-${req.headers["project"]}`
  
  if (!headers.project) headers.project = global.projectId;
  
  promises.push(...([...files]).map(async (f, i) => {

    if (typeof f === "string") f = { file: f }

    var upload = {collection}
    var data = alldata[i] || {}
    var file = await readFile(f)

    upload.doc = f.id || f.doc || docs[i] || generate({ length: 20 })
    data.name = f.name || data.name || generate({ length: 20 })
    
    // get file type
    var type = data.type = f.type
    
    // get regex exp
    var regex = new RegExp(`^data:${type};base64,`, "gi")
    file = file.replace(regex, "")
    
    // access key
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

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
        "creation-date": (new Date).getTime()
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

      local = true
      return await axios.post(`/storage`, { upload, file }, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })
    }
  }))

  await Promise.all(promises)
  if (local) uploadedData.push(promises.map(({ data }) => data))

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
  if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, req, res, id, e, _: global.uploads.length === 1 ? global.uploads[0] : global.uploads, __: _, ___: __, params })
  
}

const readFile = (file) => {
  
  return new Promise(res => {

    var myFile = file.file || file.url
    if (typeof myFile === "string" && myFile.slice(0, 5) === "data:") res(myFile)
    else if (typeof file === "object" && file["readAsDataURL"]) res()
    else {
      let myReader = new FileReader()
      myReader.onloadend = () => res(myReader.result)
      myReader.readAsDataURL(file)
    }
  })
}

/* const { capitalize } = require("./capitalize")
const { save } = require("./save")
const { toAwait } = require("./toAwait")

module.exports = {
    upload: async ({ id, e, upload = {}, ...params }) => {

        var global = window.global
        var value = window.views
        var view = value[id]
        var storage = global.storage
        
        upload.save = upload.save !== undefined ? upload.save : true
        
        await storage.child(`images/${view.file.fileName}.${view.file.fileType}`).put(view.file.src)
        await storage.child(`images/${view.file.fileName}.${view.file.fileType}`).getDownloadURL().then(url => view.file.url = url)
        
        view.file.id = `${view.file.fileName}.${view.file.fileType}`
        var _save = { path: "image", data: {
            "creation-date": new Date().getTime() + 10800000 + "", name: `${view.file.fileName}.${view.file.fileType}`, id: `${view.file.fileName}.${view.file.fileType}`, url: view.file.url, description: `${capitalize(view.file.fileName.split('-')[0])} Image`, active: true
        }}

        upload.save && await save({ ...params, save: _save, id, e })

        !upload.save && toAwait({ id, params, e })
    }
}*/