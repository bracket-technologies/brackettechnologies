const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const axios = require("axios")
const { getJsonFiles, postJsonFiles, removeJsonFiles } = require("./jsonFiles")
const { jsonToBracket } = require("./jsonToBracket")

var getdb = async ({ req, res }) => {
  
  var collection = req.url.split("/")[2]
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  // string => search
  var string = decodeURI(req.headers.search), params = {}
  string = toCode({ _window, string })
  if (string) params = toParam({ _window, data: string, id: "" })

  var search = params.search
  var success, message, data
  search.collection = collection
  
  if (search.url) {

    var url = search.url
    delete search.url
    url +=`/${jsonToBracket(search)}`
    if (url.slice(-1) === "/") url = url.slice(0, -1)
    data = await axios.get(url, {
      timeout: 1000 * 40
    })
    data = data.data
    if (typeof data === "string") {
      data = `{ ${data.split("{").slice(1).join("{")}`
      data = JSON.parse(data)
    }
    
  } else data = await getJsonFiles({ search })

  success = false
  message = `Your are not verified!`
  /*
  Promise.all(promises)
  if (project["accesskey"] !== accessKey) return res.send({ success, message })
  */
  success = true
  message = `File/s mounted successfuly!`
  
  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

var postdb = async ({ req, res }) => {

  var data = req.body.data
  var collection = req.url.split("/")[2]
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  var save = req.body.save
  var success, message

  save.data = data
  save.collection = collection
  await postJsonFiles({ save })

  success = true
  message = `File/s saved successfuly!`

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

var deletedb = async ({ _window, req, res }) => {

  var collection = req.url.split("/")[2]
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  if (string) params = toParam({ _window, data: string, id: "" })
  var erase = params.erase
  var success, message

  erase.collection = collection
  removeJsonFiles({ erase })
  
  success = true
  message = `File/s erased successfuly!`


  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success, message }))
  res.end()
}

module.exports = { getdb, postdb, deletedb }