const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const upload = async ({ id, _window, req, res, e, ...params }) => {
        
  var upload = params.upload, promises = []
  var global = window.global
  var view = window.views[id]
  var alldata = toArray(upload.data || [])
  var headers = clone(upload.headers) || {}
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])

  upload.collection = upload.collection || "storage"
  headers.project = headers.project || global.projectId

  delete upload.headers

  files.map(async (f, i) => {

    if (upload.file) delete upload.file
    if (upload.files) delete upload.files

    var data = alldata[i] || {}
    var file = await readFile(f)
    upload.doc = docs[i] || generate({ length: 20 })
    data.name = data.name || generate({ length: 20 })

    // get file type
    var type = files[i].type
    data.type = type.split("/").join("-")
    
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

      promises.map(({ data }, i) => {

        if (!view) return
        if (i === 0) {
          view.uploads = []
          global.uploads = []
        }
        
        view.uploads.push(clone(data))
        global.uploads.push(clone(data))
        
        view.upload = clone(data)
        global.upload = clone(data)
    
        if (files.length > 1) console.log(view.uploads)
        else console.log(view.upload)
    
      })
    
      // await params
      if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, params })
    }
  })
}

const readFile = (file) => {
  return new Promise(res => {

    if (typeof file === "string" && file.slice(0, 5) === "data:") res(file)
    else { 
      let myReader = new FileReader()
      myReader.onloadend = () => res(myReader.result)
      myReader.readAsDataURL(file)
    }
  })
}

module.exports = { upload }

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