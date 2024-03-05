const axios = require("axios")
const { deleteData } = require("./database")

const erase = async ({ _window, lookupActions, stack, req, res, id, e, __, erase = {}, ...params }) => {

  var data

  if (!erase.collection) return console.log("No collection!")

  // headers
  var headers = { ...(erase.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }
  
  if (_window) {

    data = await deleteData({ _window, req, res, erase })

  } else {

    var response = await axios.post(`/`, { server: "database", type: "erase", data: erase }, { headers })
    data = response.data
  }

  // console.log("ERASE", (new Date()).getTime() - headers.timestamp, erase.collection, data)

  // stack
  require("./kernel").toAwait({ _window, lookupActions, stack, id, e, ...params, req, res, _: data, __ })
}

module.exports = { erase }