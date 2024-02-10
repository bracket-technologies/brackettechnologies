const { getdb, postdb, deletedb } = require("./database")
const { serverActionExecuter } = require("./serverActionExecuter")
const { authorizer } = require("./authorizer")
const { render } = require('./render')
const { getLocalFile } = require("./storageLocal")
const { initializer } = require("./initializer")
const { stacker } = require("./stack")
const { generate } = require("./generate")

require("dotenv").config();

module.exports = (data) => {
  
  data.server.all("*", async (req, res) => {

    var path = decodeURI(req.url).split("/"), id = generate()

    // resource
    if (path[1] === "resource") return getLocalFile({ req, res })

    // initialize
    var _window = initializer({ id, req, res, path, data })

    // authorize
    var { success, message, error } = await authorizer({ _window, req })

    // not authorized
    if (!success) return res.send({ success, message, error })

    // database
    if (path[1] === "database") {

      if (req.method === "GET") {

        return getdb({ _window, req, res, id })

      } else if (req.method === "POST") {

        return postdb({ _window, req, res, id })

      } else if (req.method === "DELETE") {
    
        return deletedb({ _window, req, res, id })
      }
    }

    // stack
    var stack = stacker({ _window, id, path, event: req.method.toLowerCase(), server: true })

    // action
    if (path[1] === "action") return serverActionExecuter({ _window, req, res, id, stack })

    // set stack type
    stack.type = "render"

    // render
    return render({ _window, req, res, id, stack })
  })
}