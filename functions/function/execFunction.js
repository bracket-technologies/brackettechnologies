const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const execFunction = async ({ req, res, id = generate() }) => {

  var db = req.db
  var success = true, message, functions = {}
  var data = req.body.data
  var func = req.body.function
  var ref = db.collection("_project_")
  var project = req.headers["project"]
  var _window = { function: true, global: { codes: {}, promises: {}, innerHTML: {}, breakCreateElement: {} }, views: { backend: {}, "my-views": [], [id]: {} } }
  var global = _window.global
  
  if (Object.keys(req.cookies).length === 0 && req.body.cookies) req.cookies = req.body.cookies || {}
  if (!project) return res.send({ success: false, message: "You are not recognized!" })

  await ref.doc(project).get().then(doc => {

    success = true
    var _data = doc.data()
    
    if (_data.functions) {

      global.data = { project: { ..._data, id: project } }
      functions = _data.functions
      _window.global.functions = Object.keys(functions)
      message = `Action ${func} executed successfully!`
    }

  }).catch(error => {

      success = false
      message = `An error Occured!`
  })

  if (!success) return res.send({ success, message })
  if (!functions[func]) return res.send({ success, message: `Action ${func} does not exist!` })
  
  var _func = toCode({ _window, id, string: functions[func] })
  _func = toCode({ _window, id, string: _func, start: "'", end: "'" })
  toParam({ _window, id, string: _func, req, res, _: data, mount: true })
  
  setTimeout(() => { if (!res.headersSent) return res.send({ success: false, message: `Action ${func} request timeout` }) }, req.body.timeout || 40000)
}

module.exports = { execFunction }