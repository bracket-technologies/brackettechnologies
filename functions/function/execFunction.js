const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")

const execFunction = async ({ _window, lookupActions, req, res, id = generate() }) => {

  var func = req.body.function
  var data = req.body.data
  var actions = req.body.actions
  var global = _window.global
  var project = global.data.project
  _window.function = true
  
  if (Object.keys(req.cookies).length === 0 && req.body.cookies) req.cookies = req.body.cookies || {}

  // function does not exist
  if (!project.functions[func] && !actions) return res.send({ success, message: `Action ${func} does not exist!` })

  // interpret
  if (!actions) lookupActions = { view: "_project_", fn: [func] }

  var isFn = "", myfn = actions || project.functions[func]
  if (typeof myfn === "object") isFn = myfn._
  else isFn = myfn

  /*require("./requires.json").map(package => {
    _window.__PACKAGE__[package] = require(package)
  })*/

  interpret({ _window, lookupActions, awaits: [], id, string: isFn, req, res, _: data })
  
  global.timeout = req.body.timeout || project.timeout || 40000
  setTimeout(() => { if (!res.headersSent) return res.send({ success: false, message: `Action ${func} request timeout` }) }, global.timeout)
}

const interpret = ({ _window, lookupActions, awaits, id, string, req, res, _, __, ___ }) => {

  string = toCode({ _window, id, string: toCode({ _window, id, string }), start: "'", end: "'" })
  
  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  var conditions = string.split("?")[1]
  if (conditions) {
    var approved = toApproval({ _window, string: conditions, id, req, res, _, __, ___, awaits, lookupActions })
    if (!approved) return res.send({ success: true, message: `Action ${func} conditions not applied!` })
  }
  
  string = string.split("?")[0]

  toParam({ _window, lookupActions, awaits, id, string, req, res, _, __, ___, mount: true })
}

module.exports = { execFunction }