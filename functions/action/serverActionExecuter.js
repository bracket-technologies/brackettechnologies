const { clone } = require("./clone")
const { addresser } = require("./addresser")
const { printStack } = require("./stack")
const { toAwait } = require("./toAwait")

const serverActionExecuter = async ({ _window, stack, req, res, id, __, dots }) => {
  
  var global = _window.global
  var path = global.manifest.path

  // action request as get request
  if (req.method === "GET") req.body.action = { name: path[2], __, dots }

  // action
  var action = req.body.action

  // modify stack
  stack.action = action

  // cookies
  if (Object.keys(req.cookies).length === 0 && req.body.cookies) req.cookies = req.body.cookies || {}

  var data = executeServerAction({ _window, stack, id, action, req, res, __: action.__, dots })

  printStack({ stack, end: true })

  // respond
  if (stack.addresses.length === 0) return res.send({ ...data, logs: stack.logs })

  // request timeout
  setTimeout(() => { if (!res.headersSent) return res.send({ success: false, message: `Action request timeout!`, executionDuration: 10000, logs: stack.logs }) }, 40000)
}

const executeServerAction = ({ _window, lookupActions = [], stack, action, id, req, res, __, dots }) => {

  var global = _window.global
  var project = global.data.project
  var { name, actions } = action

  // action does not exist
  if (!project.functions[name] && !actions) return ({ success: false, message: "No action found to execute!" })

  // mount action
  var string = actions || clone(project.functions[name])

  // map action
  if (typeof string === "object") {
    string = string._ || ""
    lookupActions.unshift({ view: "_project_", actionPath: [name] })
  }

  var address = addresser({ _window, stack, status: "Wait", action: name + "()", __, dots, id, lookupActions, mount: true, data: { string } }).address

  // interpret line
  return toAwait({ _window, lookupActions, stack, address, id, req, res, __, dots })
}

module.exports = { serverActionExecuter, executeServerAction }