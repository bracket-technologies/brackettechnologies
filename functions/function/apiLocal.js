const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const axios = require("axios")
const { getJsonFiles, postJsonFiles, removeJsonFiles, uploadJsonFile } = require("./jsonFiles")
const { toString } = require("./toString")
var _window = { children: {}, global: { codes: {} } }

var getApi = async ({ req, res }) => {
  
  // database/collection?params?conditions
  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var string = decodeURI(req.headers.search), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search
  var success, message, data
  search.collection = collection
  
  if (search.url) {

    var url = search.url
    delete search.url
    url +=`/${toString(search)}`
    if (url.slice(-1) === "/") url = url.slice(0, -1)
    data = await axios.get(url, {
      timeout: 1000 * 10
    })
    data = data.data
    if (typeof data === "string") {
      data = `{ ${data.split("{").slice(1).join("{")}`
      data = JSON.parse(data)
    }
    
  } else data = await getJsonFiles({ search })

  success = true
  message = `File/s mounted successfuly!`
    
  return res.send({ data, success, message })
}

var postApi = async ({ req, res }) => {

  var data = req.body.data
  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var save = req.body.save
  var success, message

  save.data = data
  save.collection = collection
  await postJsonFiles({ save })

  success = true
  message = `File/s saved successfuly!`
    
  return res.send({ data, success, message })
}

var deleteApi = async ({ req, res }) => {

  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  if (string) params = toParam({ _window, string, id: "" })
  var erase = params.erase
  var success, message

  erase.collection = collection
  await removeJsonFiles({ erase })
  
  success = true
  message = `File/s erased successfuly!`

  return res.send({ success, message })
}

const uploadApi = async ({ req, res }) => {
      
  var file = req.body.file, url
  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var upload = req.body.upload
  
  // post api
  var data = {
    url,
    id: upload.doc,
    name : upload.name,
    description: upload.description,
    type: upload.type,
    tags: upload.tags,
    title : upload.title
  }

  upload.file = file
  upload.data = data
  upload.collection = collection
  uploadJsonFile({ upload })
  
  success = true
  message = `File/s uploaded successfuly!`

  return res.send({ data, success, message })
}
module.exports = { getApi, postApi, deleteApi, uploadApi }

/*
Query operators:
  1. < less than
  2. <= less than or equal to
  3. == equal to
  4. > greater than
  5. >= greater than or equal to
  6. != not equal to
  7. array-contains (search an array by 1 choice)
  8. array-contains-any (search an array by multiple choices)
  9. in (search a string by multiple choices)
  10. not-in (search a string by multiple !choices)

reference: https://firebase.google.com/docs/firestore/query-data/queries
*/

/*
Pagination: ref.orderBy('createdAt').startAfter(x).limit(x)
*/