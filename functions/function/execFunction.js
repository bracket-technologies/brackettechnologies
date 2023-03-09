const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const execFunction = async ({ _window, lookupActions, awaits, req, res, id = generate() }) => {

  var data = req.body.data
  var func = req.body.function
  var global = _window.global
  var project = global.data.project
  _window.function = true
  
  if (Object.keys(req.cookies).length === 0 && req.body.cookies) req.cookies = req.body.cookies || {}

  // function does not exist
  if (!project.functions[func]) return res.send({ success, message: `Action ${func} does not exist!` })

  // interpret
  lookupActions = { view: "_project_", fn: [func] }
  interpret({ _window, lookupActions, awaits, id, string: project.functions[func], req, res, _: data })
  
  global.timeout = req.body.timeout || project.timeout || 40000
  setTimeout(() => { if (!res.headersSent) return res.send({ success: false, message: `Action ${func} request timeout` }) }, global.timeout)
}

const interpret = ({ _window, lookupActions, awaits, id, string, req, res, _, __, ___ }) => {

  string = toCode({ _window, id, string: toCode({ _window, id, string }), start: "'", end: "'" })
  toParam({ _window, lookupActions, awaits, id, string, req, res, _, __, ___, mount: true })
}

module.exports = { execFunction }