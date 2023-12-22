const { generate } = require("./generate")
const { clone } = require("./clone")
const { lineInterpreter } = require("./lineInterpreter")
const { stacker } = require("./stack")
const { addresser } = require("./addresser")

const serverActionExecuter = async ({ _window, req, res, id = generate(), __, getRequest }) => {
  
  var global = _window.global

  // action request as get request
  if (getRequest) req.body.action = { name: path[2] }

  var path = global.__path__
  var action = req.body.action
  var stack = stacker({ _window, id, event: "action", name: action.name })

  // cookies
  if (Object.keys(req.cookies).length === 0 && req.body.cookies) req.cookies = req.body.cookies || {}

  var data = executeServerAction({ _window, stack, id, action, req, res, __: action.__ })

  // respond
  if (stack.addresses.length === 0) return res.send(data)

  // request timeout
  setTimeout(() => { if (!res.headersSent) return res.send({ success: false, message: `Action request timeout!`, executionDuration: 40000 }) }, 40000)
}

const executeServerAction = ({ _window, lookupActions = [], stack, action, id, req, res, __ }) => {

  var global = _window.global
  var project = global.data.project
  var { name, actions } = action

  // action does not exist
  if (!project.functions[name] && !actions) actions = `send():[${name}()]`

  // mount action
  var string = actions || clone(project.functions[name])

  // map action
  if (typeof string === "object") {
    string = string._ || ""
    lookupActions.unshift({ view: "_project_", fn: [name] })
  }

  addresser({ _window, stack, action: name, __, id, lookupActions })
  
  // interpret line
  return lineInterpreter({ _window, lookupActions, stack, id, data: string, req, res, __, mount: true })
}

module.exports = { serverActionExecuter, executeServerAction }