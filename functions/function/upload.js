const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")

const upload = async ({ id, e, ...params }) => {
        
  var upload = params.upload
  var global = window.global
  var view = window.views[id]
  var data = upload.data || {}

  var headers = clone(upload.headers) || {}
  headers.project = headers.project || global.projectId
  delete upload.headers
  upload.doc = upload.doc || upload.id || generate(20)
  data.name = data.name || data.upload[0].name || (new Date()).getTime()

  // file
  var file = await readFile(upload.file)
  delete upload.file
  
  // get file type
  var type = file.substring("data:".length, file.indexOf(";base64"))
  data.type = type.split("/").join("-")

  // get regex exp
  var regex = new RegExp(`^data:${type};base64,`, "gi")
  file = file.replace(regex, "")
  
  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]
  
  var { data } = await axios.post(`/storage`, { upload, file }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  view.upload = data
  console.log(data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, e, params })
}
  
const readFile = (file) => {
  return new Promise(res => {

    let myReader = new FileReader()
    myReader.onloadend = () => res(myReader.result)
    myReader.readAsDataURL(file)
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