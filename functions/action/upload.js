const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const readFile = require("./readFile")
const { toArray } = require("./toArray")
const { storeFile } = require("./storage")

module.exports = async ({ _window, lookupActions, stack, address, id, req, res, e, __, upload, ...params }) => {
        
  var promises = []
  var global = _window ? _window.global : window.global
  var alldata = toArray(upload.data || []), uploads = []
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])
  var storage = upload.storage || "storage"
  
  // headers
  var headers = upload.headers || {}
  headers.project = headers.project || global.manifest.projectID
  headers = { ...headers, timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()) }
  
  promises.push(...([...files]).map(async (f, i) => {

    if (typeof f === "string") f = { file: f, type }

    var upload = {}
    var data = alldata[i] || {}
    var file = await readFile(f)
    
    upload.doc = f.id || f.doc || docs[i] || generate({ length: 20 })
    data.name = f.name || data.name || generate({ length: 20 })
    
    // get file type
    var type = data.type || f.type
    
    // get regex exp
    var regex = new RegExp(`^data:${type};base64,`, "gi")
    file = file.replace(regex, "")

    // data
    upload.data = clone(data)
    upload.file = file

    if (_window) {
      
      var data = await storeFile({ req, upload })

      uploads.push(data)
      return data

    } else {

      var { data } = await axios.post(`/${storage}`, { upload }, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })

      uploads.push(data)
      return data
    }
  }))

  await Promise.all(promises)
  
  // await
  require("./toAwait").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __, _: uploads.length === 1 ? uploads[0] : uploads, ...params })
}