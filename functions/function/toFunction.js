const { func } = require("./func")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { isParam } = require("./isParam")
const { toValue } = require("./toValue")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const actions = require("./actions.json")
const { generate } = require("./generate")

const toFunction = ({ _window, id, req, res, _, __, ___, e, path, path0, condition, params = {}, mount, asyncer, toView, executer, object, lookupActions = {}, awaits = [], isView = false }) => {

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id], backendFn = false, isFn = false
  
  if (path.length === 1 && path0.slice(-2) === "()" && !actions.includes(path0) && path0.slice(0, 7) !== "coded()") {
    
    var newLookupActions
    var myViews = view["my-views"] || []
    
    // lookup in open actions
    if (lookupActions.fn) {
      
      var fn = lookupActions.fn
      clone(fn).reverse().map((myfn, i) => {

        if (!isFn) {

          var functions = clone(lookupActions.view === "_project_" ? global.data.project.functions : global.data[lookupActions.viewType][lookupActions.view].functions) || {}
          isFn = Object.keys(clone(fn).slice(0, fn.length - i).reduce((o, k) => o[k] || {}, functions)).find(fn => fn === path0.slice(0, -2))

          if (isFn) {

            isFn = fn.slice(0, fn.length - i).reduce((o, k) => o[k], functions)[isFn]
            if (typeof isFn === "object" && isFn._) {

              isFn = isFn._ || ""
              newLookupActions = { view: lookupActions.view, fn: [...fn, path0.slice(0, -2)], viewType: lookupActions.viewType || "view" }
            }
          }
        }
      })
    }

    // lookup in view actions
    if (!isFn) {

      clone(["_project_", ...myViews]).reverse().map((myview, i) => {
        if (!isFn) {
          
          var functions = myview === "_project_" ? global.functions : (global.data[i === myViews.length - 1 ? "page" : view.viewType][myview].functions) || {}
          isFn = (Array.isArray(functions) ? functions : Object.keys(functions)).find(fn => fn === path0.slice(0, -2))
          if (isFn) {

            if (myview === "_project_") {
              
              // backend function
              backendFn = true
              newLookupActions = { view: myview, fn: [isFn] }

            } else {

              if (!isView && typeof functions[isFn] === "object") {

                isFn = functions[isFn]._ || ""
                newLookupActions = { view: myview, fn: [path0.slice(0, -2)], viewType: i === myViews.length - 1 ? "page" : view.viewType }

              } else isFn = functions[isFn]
            }
          }
        }
      })
    }

    if (isFn) {
      
      var _params, args = path[0].split(":")
      
      if (backendFn) {
      
        var _data
        if (isParam({ _window, string: args[1] })) _data = toParam({ req, res, _, __, ___, e, _window, id, string: args[1], params, condition, lookupActions })
        else _data = toValue({ req, res, _window, id, e, _, __, ___, value: args[1], params, condition, lookupActions })

        var _func = { function: isFn, data: _data, log: { action: params.func, send: global.func } }
        var _await = global.codes[args[2]], myawait = { id: generate(), hold: false, await: _await, action: path0, passGlobalFuncData: _window ? true: false, log: { action: path0, await: _await, data: _params, success: true, message: "Action executed successfully!", path: (newLookupActions ? newLookupActions : lookupActions).fn || [] }, params: { e, id, mount, object, asyncer, toView, executer, condition, lookupActions } }
    
        if (_await) awaits.unshift(myawait)
        if (global.__waiters__.length > 0) myawait.waiter = global.__waiters__[0]
        
        console.log("ACTION " + path0);
        var answer = func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, awaits, myawait, params, lookupActions: newLookupActions ? newLookupActions : lookupActions })
        
        return answer
      }

      if (args[1]) {

        if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, string: args[1], params, lookupActions/*, condition*/ })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, value: args[1], params, lookupActions/*, condition*/ })
      }
      
      if (isFn) {

        // await
        var answer, _await = global.codes[args[2]], myawait = { id: generate(), await: _await, action: path0, log: { action: path0, await: _await, data: _params, success: true, message: "Action executed successfully!", path: (newLookupActions ? newLookupActions : lookupActions).fn }, params: {e, id, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), asyncer, toView, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions} }
        awaits.unshift(myawait)
        if (global.__waiters__.length > 0) myawait.waiter = global.__waiters__[0]
        
        console.log("ACTION " + path0);

        if (!isView) {

          isFn = toCode({ _window, id, string: toCode({ _window, id, string: isFn, start: "'", end: "'" }) })

          if (isFn.includes('coded()') && isFn.length === 12) isFn = global.codes[isFn]
          
          var conditions = isFn.split("?")[1]
          if (conditions) {
            var approved = toApproval({ _window, string: conditions, e, id, req, res, params, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), awaits, lookupActions: newLookupActions ? newLookupActions : lookupActions })
            if (!approved) return
          }

          isFn = isFn.split("?")[0]

        } else {

          var view = views[id]
          if (typeof isFn === "object") views[id] = { ...view, ...isFn }
          else view.view = view.type = isFn
          
          view.view = view.type = toCode({ _window, id, string: toCode({ _window, id, string: view.view, start: "'", end: "'" }) })
        }
        
        if (!condition) {
          
          if (isView) 
            answer = require("./toView").toView({ _window, lookupActions, id, req, res, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), awaits, lookupActions: newLookupActions ? newLookupActions : lookupActions })
          else if (isParam({ _window, string: isFn }))
            answer = toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), asyncer, awaits, toView, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions })
          else {
            answer = toValue({ _window, value: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), asyncer, awaits, toView, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions })
          }
        } else answer = toApproval({ _window, string: isFn, e, id, req, res, mount, params, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), awaits, lookupActions: newLookupActions ? newLookupActions : lookupActions })
        
        // await params
        if (awaits.findIndex(i => i.id === myawait.id) === 0) {

          if (_await) {

            require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, myawait, awaits, req, res, _: global.search, __: _, ___: __ })

          } else {

            awaits.splice(awaits.findIndex(i => i.id === myawait.id), 1)
            console.log({ action: path0, data: _params, success: true, message: "Action executed successfully!", path: (newLookupActions ? newLookupActions : lookupActions).fn || [] })
          }
        }

        return answer
      }
    }
  }

  return "__CONTINUE__"
}

module.exports = { toFunction }