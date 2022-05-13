const axios = require("axios")
const { toAwait } = require("./toAwait")

const upload = async ({ id, e, ...params }) => {
        
  var upload = params.upload
  var local = window.children[id]
  var collection = upload.collection = upload.collection || upload.path

  var headers = clone(upload.headers) || {}
  headers.project = headers.project || global.projectId
  delete upload.headers
  upload.doc = upload.doc || upload.id
  upload.name = upload.name || global.upload[0].name

  // file
  var file = await readFile(upload.file)
  delete upload.file
  
  // get file type
  var type = file.substring("data:".length, file.indexOf(";base64"))
  upload.type = type.split("/").join("-")

  // get regex exp
  var regex = new RegExp(`^data:${type};base64,`, "gi")
  file = file.replace(regex, "")
  
  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]
  
  var { data } = await axios.post(`/storage/${collection}`, { upload, file }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  local.upload = data
  console.log(data)

  // await params
  toAwait({ id, e, params })
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
        var value = window.children
        var local = value[id]
        var storage = global.storage
        
        upload.save = upload.save !== undefined ? upload.save : true
        
        await storage.child(`images/${local.file.fileName}.${local.file.fileType}`).put(local.file.src)
        await storage.child(`images/${local.file.fileName}.${local.file.fileType}`).getDownloadURL().then(url => local.file.url = url)
        
        local.file.id = `${local.file.fileName}.${local.file.fileType}`
        var _save = { path: "image", data: {
            "creation-date": new Date().getTime() + 10800000 + "", name: `${local.file.fileName}.${local.file.fileType}`, id: `${local.file.fileName}.${local.file.fileType}`, url: local.file.url, description: `${capitalize(local.file.fileName.split('-')[0])} Image`, active: true
        }}

        upload.save && await save({ ...params, save: _save, id, e })

        !upload.save && toAwait({ id, params, e })
    }
}*/