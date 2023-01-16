const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

module.exports = async ({ id, _window, req, res, e, _, __, ___, ...params }) => {
        
  var upload = params.upload, promises = []
  var global = window.global
  var view = window.views[id]
  var alldata = toArray(upload.data || [])
  var headers = clone(upload.headers) || {}
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])
  var collection = upload.collection || "storage"
  
  if (!headers.project) headers.project = global.projectId;
  
  ([...files]).map(async (f, i) => {

    /*if (upload.file) delete upload.file
    if (upload.files) delete upload.files*/
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
    
    if (!view) return
    promises.push(await axios.post(`/storage`, { upload, file }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    }))

    if (promises.length === files.length) {

      view.uploads = []
      global.uploads = []

      promises.map(({ data }, i) => {

        if (!view) return
        
        view.upload = clone(data)
        view.uploads.push(clone(data))
        
        global.upload = clone(data)
        global.uploads.push(clone(data))
    
        if (files.length > 1) console.log(view.uploads)
        else console.log(view.upload)
      })
    
      // await params
      if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, _: global.uploads.length > 0 ? global.uploads : global.upload, __: _, ___: __, params })
    }
  })
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