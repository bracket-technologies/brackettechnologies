const { getSession } = require("./kernel")
const { logger } = require("./logger")

// config
require('dotenv').config()

const authorizer = ({ _window, req, res }) => {

  var global = _window.global, success, message, error

  logger({ _window, data: { key: "authorization", start: true } })

  var { data, success, message } = getSession({ _window, req, res })
  global.manifest.session = data

  logger({ _window, data: { key: "authorization", end: true } })

  return { success, message, error }
}

module.exports = { authorizer }