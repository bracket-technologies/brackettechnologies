const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const execFunction = async ({ req, res, id = generate() }) => {
  
    var db = req.db, id = "backend"
    var success = true, message, functions = {}
    var data = req.body.data
    var func = req.body.function
    var ref = db.collection("_project_")
    var project = req.headers["project"]
    var _window = { global: { codes: {}, promises: [] }, views: { backend: {}, "my-views": [] } }
    var global = _window.global
    
    if (Object.keys(req.cookies).length === 0 && req.body.cookies) req.cookies = req.body.cookies || {}
    if (!project) return res.send({ success: false, message: "You are not recognized!" })
  
    // if (!req.global.functions[project]) {

    await ref.doc(project).get().then(doc => {

      success = true
      // req.global.functions[project] = doc.data()
      var _data = doc.data()
      if (_data.functions) {

        global.data = { project: _data }
        functions = _data.functions
        _window.global.functions = Object.keys(functions)
        message = "Function executed successfully!"
      }

    }).catch(error => {

        success = false
        message = `An error Occured!`
    })
    // }
    
    if (!success) return res.send({ success, message })
    if (!functions[func]) return res.send({ success, message: "Function does not exist!" })
    
    var sendExists = functions[func].includes("send()")
    var func = toCode({ _window, id, string: functions[func] })
    toParam({ _window, id, string: func, req, res, _: data, mount: true })
    
    if (!sendExists) res.send({ success, message, data })
}

module.exports = { execFunction }