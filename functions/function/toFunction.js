const { func } = require("./func")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { isParam } = require("./isParam")
const { toValue } = require("./toValue")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const actions = require("./actions.json")

const toFunction = ({ _window, id, req, res, _, __, ___, e, path, path0, condition, params = {}, mount, asyncer, createElement, executer, object, lookupActions = {} }) => {

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id], backendFn = false, isFn = false
  
  if (path.length === 1 && path0.slice(-2) === "()" && !actions.includes(path0) && path0 !== "if()" && path0 !== "while()") {
    
    var newLookupActions
    var functions = (_window ? global.data.project.functions : global.data.view[lookupActions.view].functions) || {}
    var myViews = (_window ? ["_project_"] : view["my-views"]) || []
    
    // lookup in open actions
    if (lookupActions.fn) {
        
      var fn = lookupActions.fn
      fn.map((myfn, i) => {

        isFn = Object.keys(fn.slice(0, fn.length - i).reduce((o, k) => o[k], functions)).find(fn => fn === path0.slice(0, -2))
        if (isFn) {

          isFn = fn.reduce((o, k) => o[k], functions)[isFn]
          if (typeof isFn === "object") isFn = isFn._
          newLookupActions = { view: lookupActions.view, fn: [...fn, path0.slice(0, -2)] }
        }
      })
    }

    // lookup in view actions
    if (!isFn) {

      clone(myViews).reverse().map(view => {
        if (!isFn) {

          isFn = Object.keys(functions).find(fn => fn === path0.slice(0, -2))
          if (isFn) {

            // backend function
            isFn = functions[isFn]
            if (typeof isFn === "object") isFn = isFn._ || ""
            newLookupActions = { view, fn: [path0.slice(0, -2)] }
            if (view === "_project_") backendFn = true
          }
        }
      })
    }

    if (isFn) {
      
      var _params = "", args = path[0].split(":")

      if (backendFn) {
      
        var _data, _await = ""
        if (isParam({ _window, string: args[1] })) _data = toParam({ req, res, _, __, ___, e, _window, id, string: args[1], params, condition, lookupActions })
        else _data = toValue({ req, res, _window, id, e, _, __, ___, value: args[1], params, condition, lookupActions })

        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]

        var answer = func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await, params, lookupActions: newLookupActions ? newLookupActions : lookupActions })
        
        return answer
      }

      if (args[1]) {

        if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, string: args[1], params, lookupActions/*, condition*/ })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, value: args[1], params, lookupActions/*, condition*/ })
      }
      
      if (isFn) {

        isFn = toCode({ _window, id, string: isFn })
        isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })

        var answer//, awaits = `():${id}.my-actions.pull():${lastEl}`
        if (!condition) answer = toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), asyncer, createElement, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions })
        else answer = toApproval({ _window, string: isFn, e, id, req, res, mount, params, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), lookupActions: newLookupActions ? newLookupActions : lookupActions })

        console.log({ action: path0, data: _params, success: true, message: "Action executed!", path: (newLookupActions ? newLookupActions : lookupActions).fn });
        return answer
      }
    }
  }

  return "__CONTINUE__"
}

module.exports = { toFunction }