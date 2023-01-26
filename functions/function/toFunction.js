const { func } = require("./func")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { isParam } = require("./isParam")
const { toValue } = require("./toValue")
const { toParam } = require("./toParam")
const _functions = require("./function")

const toFunction = ({ _window, id, req, res, _, __, ___, e, path, path0, condition, params, mount, asyncer, createElement, executer, object }) => {

    var global = _window ? _window.global : window.global
    var views = _window ? _window.views : window.views
    var view = views[id], backendFn = false, isFn = false

    if (path.length === 1 && path0.slice(-2) === "()" && !_functions[path0.slice(-2)] && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {
    
      view && clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) {
            isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
            isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })
          }
        }
      })
      
      // global functions
      if (!isFn) {

        isFn = Object.keys(global.openFunctions || {}).find(fn => fn === path0.slice(0, -2))
        if (isFn) {
          isFn = toCode({ _window, id, string: (global.openFunctions)[isFn] })
          isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })
        }
      }
      
      if (!isFn) {

        isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
        if (isFn) backendFn = true
      }
    }
  
    if (isFn) {
        
        var _params = path[0].split(":")[1], args = path[0].split(":")

        if (backendFn) {
        
            if (isParam({ _window, string: args[1] })) {

                var _await = ""
                var _data = toParam({ req, res, _, __, ___, e, _window, id, string: args[1], condition })
                var _func = { function: isFn, data: _data }
                if (args[2]) _await = global.codes[args[2]]
                
                return func({ _window, id, e, _, __, ___, req, res, func: _func, asyncer: true, await: _await })
            }
            
            var _data = toValue({ req, res, _window, id, e, _, __, ___, value: args[1], params, condition })
            var _func = { function: isFn, data: _data }
            if (args[2]) _await = global.codes[args[2]]

            return func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
        }

        if (_params) {

            if (isParam({ _window, string: _params })) _params = toParam({ req, res, _window, id, e, _, __, ___, string: _params, condition })
            else _params = toValue({ req, res, _window, id, e, _, __, ___, value: _params, condition })
        }

        if (!condition) return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), asyncer, createElement, params, executer, condition })
        else return toApproval({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i })
    
    } else return "__CONTINUE__"
  }

  module.exports = { toFunction }