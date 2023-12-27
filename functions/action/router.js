const { getdb, postdb, deletedb } = require("./database")
const { getFile, postFile, deleteFile } = require("./storage")
const { serverActionExecuter } = require("./serverActionExecuter")
const { authorizer } = require("./authorizer")
const { projector } = require('./projector')
const { getLocalFile } = require("./storageLocal")
const { initializer } = require("./initializer")
const { stacker } = require("./stack")

require("dotenv").config();

module.exports = (data) => {
  
  data.server.all("*", async (req, res) => {
    
    if (req.url === "/favicon.ico") return res.send()

    // stack
    var stack = stacker({ event: req.method.toLowerCase(), server: true })

    var _window = initializer({ req, res, data, stack })
    var { manifest: { path, id }, __ } = _window.global

    // headers sent
    if (res.headersSent) return

    // resource
    if (path[1] === "resource") return getLocalFile({ req, res, id })

    // authorize
    var { success, message, error } = await authorizer({ _window, req })

    // not authorized
    if (!success) return res.send({ success, message, error })

    if (req.method === "GET") {

      // if (path[1] === "storage") return getFile({ _window, req, res, id, __ })

      if (path[1] === "database") return getdb({ _window, req, res, id, __ })

    } else if (req.method === "POST") {

      // if (path[1] === "storage") return postFile({ _window, req, res, id, __ })

      if (path[1] === "database") return postdb({ _window, req, res, id, __ })

    } else if (req.method === "DELETE") {

      // if (path[1] === "storage") return deleteFile({ _window, req, res, id, __ })
  
      if (path[1] === "database") return deletedb({ _window, req, res, id, __ })
    }

    // action
    if (path[1] === "action") return serverActionExecuter({ _window, req, res, id, stack, __ })

    // document
    return projector({ _window, req, res, id, stack, __ })
  })
}