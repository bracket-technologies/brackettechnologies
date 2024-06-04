const { clone } = require("./clone")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { storeFile } = require("./storage")
const { getCookie } = require("./cookie")

module.exports = async ({ _window, lookupActions, stack, address, id, req, res, e, __, upload, ...params }) => {

  var promises = []
  var alldata = toArray(upload.data || []), uploads = []
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])

  // headers
  var headers = { ...(upload.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }

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

      headers.cookies = JSON.stringify(getCookie())
      var { data } = await require("axios").post(`/`, { server: "storage", action: "storage", data: upload }, { headers })

      uploads.push(data)
      return data
    }
  }))

  await Promise.all(promises)

  // await
  require("./kernel").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __, _: uploads.length === 1 ? uploads[0] : uploads, ...params })
}

const readFile = (file) => new Promise(res => {

  var myFile = file.file || file.url
  if (typeof myFile === "string" && myFile.slice(0, 5) === "data:") res(myFile)
  else if (typeof file === "object" && file["readAsDataURL"]) res()
  else {
    let myReader = new FileReader()
    myReader.onloadend = () => res(myReader.result)
    myReader.readAsDataURL(file)
  }
})