const { isParam } = require("./isParam")
const { addresser } = require("./addresser")
const { lineInterpreter } = require("./lineInterpreter")
const { isCalc } = require("./isCalc")
const { kernel } = require("./kernel")
const { decode } = require("./decode")
const { toAwait } = require("./toAwait")

const reducer = ({ _window, lookupActions = [], stack = {}, id, data: { path, value, key, object, _object }, __, e, req, res, mount, condition, toView }) => {

    const { toValue } = require("./toValue")
    const { toParam } = require("./toParam")
    const { toAction } = require("./toAction")
    const { toApproval } = require("./toApproval")

    if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.returned || stack.broke) return

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]

    // path is a string
    if (typeof path === "string") path = path.split(".")
    // path is a number
    if (typeof path === "number") path = [path]

    var pathJoined = path.join(".")
    
    // init
    var path0 = path[0] ? path[0].toString().split(":")[0] : "", args
    if (path[0] !== undefined) args = path[0].toString().split(":")

    // toParam
    if (isParam({ _window, string: pathJoined })) return toParam({ req, res, _window, lookupActions, stack, id, e, data: pathJoined, __, object, mount, toView })

    // toValue
    if (isCalc({ _window, string: pathJoined }) && !key) return toValue({ _window, lookupActions, stack, data: pathJoined, __, id, e, req, res, object, _object, mount, toView, condition })

    // [actions?conditions?elseActions]():[params]:[waits]
    else if (path0.length === 8 && path0.slice(-2) === "()" && path0.charAt(0) === "@") {
        
        var { address, data } = addresser({ _window, stack, args, id, status: "Wait", type: "action", action: "[...]()", data: { string: global.__refs__[path0.slice(0, -2)].data, dblExecute: true }, __, lookupActions, id, _object, object })

        return toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: data }).data
    }

    // if()
    else if (path0 === "if()") {

        var approved = toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })

        if (!approved) {

            if (args[3]) {

                if (condition) return toApproval({ _window, lookupActions, stack, e, data: args[3], id, __, req, res, object })
                if (path[1]) _object = toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object, mount, toView })
                else return toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object, mount, toView })

                path.shift()

            } else if (path[1] && path[1].includes("elif()")) {

                path.shift()
                path[0] = path[0].slice(2)
                return reducer({ _window, lookupActions, stack, id, data: { path, object, value, key }, __, e, req, res, mount, condition })

            } else return

        } else {

            if (condition) return toApproval({ _window, lookupActions, stack, e, data: args[2], id, __, req, res, object, toView })
            if (path[1]) _object = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount, toView })
            else return toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount, toView })
            
            path.shift()

            // remove elses and elifs
            while (path[0] && path[0].includes("elif()")) { path.shift() }
            
            // empty path
            if (!path[0]) return _object
        }

        return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, value, key, object, pathJoined } })
    }

    // while()
    else if (path0 === "while()") {

        while (toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })) {
            toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount, toView })
        }
        // path = path.slice(1)
        return global.return = false
    }

    // global:()
    else if (path0 && args[1] === "()" && !args[2]) {

        var globalVariable = toValue({ req, res, _window, id, e, data: args[0], __, stack, lookupActions })
        if (path.length === 1 && key && globalVariable) return global[globalVariable] = value

        path.splice(0, 1, globalVariable)
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object: global, path, value, key, object, pathJoined } })
    }

    // view => ():id
    else if (path0 === "()" && args[1]) {

        // id
        var _id = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __, object })
        path.shift()
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object: views[_id || args[1] || id], path, value, key, object, pathJoined } })
    }

    // .keyName => [object||view].keyName
    else if (path[0] === "" && path.length > 1) {
        if (isNaN(path[1].charAt(0)) || path[1].includes("()")) {
            path.shift()
            _object = object || _object || view
            return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, value, key, object, pathJoined } })
        } else return path.join(".")
    }

    // @coded
    else if (path0.charAt(0) === "@" && path[0].length === 6) {
        var data = lineInterpreter({ _window, req, res, lookupActions, stack, object, id, data: { string: path[0] }, __, e }).data

        if (path[1] === "flat()") {

            if (Array.isArray(data)) {

                data = [...data]
                return data.flat()

            } else {

                if (typeof object === "object") Object.entries(data || {}).map(([key, value]) => object[key] = value)
                return object
            }

        } else {

            if (!path[1] && typeof object === "object" && key && value !== undefined) {

                object[data] = value
                return object[data]

            } else if (path[1]) {

                _object = data
                path.splice(0, 1)
                return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, value, key, object, pathJoined } })

            } else return data
        }
    }

    // action()
    else if (path0.slice(-2) === "()") {

        var action = toAction({ _window, lookupActions, stack, id, req, res, __, e, path: [path[0]], path0, condition, mount, toView, object })
        if (action !== "__continue__") {
                
            path.shift()
            return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object: action, path, value, key, object, pathJoined } })
        }
    }

    if (!view) view = views[id]

    if (path0 === "className()") {
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object: views.document, path, value, key, object, pathJoined } })
    } else {
        var __o = ((typeof object === "object" && object.__view__) ? object : views[id]) || {}
        if (__o.__labeled__ && (path0.toLowerCase().includes("prev") || path0.toLowerCase().includes("next") || path0.toLowerCase().includes("parent"))) {

            if (__o.__featured__) path = ["2ndParent()", ...path]
            else path.unshift("parent()")

        } else if (__o.__islabel__ && path0 === "txt()" || path0 === "min()" || path0 === "max()" || path0 === "readonly()" || path0 === "editable()") path.unshift("input()")
    }

    // assign reserved vars
    var reservedVars = {
        keys: ["()", "global()", "e()", "console()", "string()", "object()", "array()", "document()", "window()", "win()", "history()", "navigator()", "nav()", "request()", "response()", "req()", "res()", "math()"],
        "()": view || views[id],
        "global()": _window ? _window.global : window.global,
        "e()": e,
        "console()": console,
        "string()": String,
        "object()": Object,
        "array()": Array,
        "document()": _window ? {} : document,
        "window()": _window || window,
        "win()": _window || window,
        "history()": _window ? {} : history,
        "nav()": _window ? {} : navigator,
        "navigator()": _window ? {} : navigator,
        "request()": req,
        "req()": req,
        "response()": res,
        "res()": res,
        "math()": Math
    }

    // assign _object
    var underScored = path0 && path0.charAt(0) === "_" && !path0.split("_").find(i => i !== "_" && i !== "")
    if (reservedVars.keys.includes(path0) || underScored) {

        if (reservedVars.keys.includes(path0)) _object = reservedVars[path0]
        else _object = __[path0.split("_").length - 2]

        path.shift()
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, value, key, object, pathJoined } })

    } else _object = _object !== undefined ? _object : object

    // still no _object
    if (_object === undefined) {

        if ((path[0] && mount) || (path0 && path0.includes("()"))) {

            return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object: view, path, value, key, object, pathJoined } })

        } else if (path[1] && path[1].toString().includes("()")) {

            _object = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: path[0] }) || {}
            path.shift()
            return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, value, key, object, pathJoined }})

        } else return pathJoined
    }

    return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, value, key, object, pathJoined }})
}
module.exports = { reducer }