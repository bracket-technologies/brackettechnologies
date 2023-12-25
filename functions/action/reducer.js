const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { isEqual } = require("./isEqual")
const { capitalize, capitalizeFirst } = require("./capitalize")
const { clone } = require("./clone")
const { toNumber } = require("./toNumber")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { exportJson } = require("./exportJson")
const { importJson } = require("./importJson")
const { toId } = require("./toId")
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")
const { toApproval } = require("./toApproval")
const { toCode } = require("./toCode")
const { note } = require("./note")
const { isParam } = require("./isParam")
const { toAwait } = require("./toAwait")
const { lengthConverter } = require("./resize")
const { qr } = require("./qr")
const { replaceNbsps } = require("./replaceNbsps")
const { addresser } = require("./addresser")
const { vcard } = require("./vcard")
const { lineInterpreter } = require("./lineInterpreter")
const { colorize } = require("./colorize")
const actions = require("./actions.json")
const events = require("./events.json")

const reducer = ({ _window, lookupActions = [], stack = {}, id = "root", data: path, value, key, params = {}, object, __, e, req, res, mount, condition, toView, _object }) => {

    const { remove } = require("./remove")
    const { toValue, calcSubs, calcDivision, calcModulo } = require("./toValue")
    const { toParam } = require("./toParam")
    const { insert } = require("./insert")
    const { toAction } = require("./toAction")

    if (stack.terminated) return

    var views = _window ? _window.views : window.views
    var view = views[id], breakRequest, mainId = id
    var global = _window ? _window.global : window.global

    if ((stack.returns && stack.returns[0] || {}).returned) return

    // path is a string
    if (typeof path === "string") path = path.split(".")
    // path is a number
    if (typeof path === "number") path = [path]

    var pathJoined = path.join(".")

    // ||
    if (pathJoined.includes("||") && !pathJoined.includes("||=")) {
        var args = pathJoined.split("||")
        var answer
        args.map(value => {
            if (!answer) answer = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object })
        })
        return answer
    }

    // init
    var path0 = path[0] ? path[0].toString().split(":")[0] : "", args
    if (path[0] !== undefined) args = path[0].toString().split(":")
    
    // toParam
    if (isParam({ _window, string: pathJoined })) return toParam({ req, res, _window, lookupActions, stack, id, e, data: pathJoined, __, object, mount, toView })

    // flat()
    if (pathJoined.slice(0, 3) === "...") {

        var _data = toValue({ req, res, _window, lookupActions, stack, object, id, data: pathJoined.slice(3), __, e })
        _object = _object || object || (mount ? view : {})
        if (typeof _data === "object" && typeof _object === "object") {
            Object.entries(_data).map(([key, value]) => _object[key] = value)
        }
        path.splice(0, 4)
    }

    // [actions?conditions?elseActions]():[params]:[waits]
    if (path0.length === 8 && path0.slice(-2) === "()" && path0.charAt(0) === "@") {

        var { address, __: my__ } = addresser({ _window, stack, args, requesterID: id, action: "[...]()", __, lookupActions, id, _object, object })
        
        var { data } = lineInterpreter({ _window, lookupActions, stack, address, id, data: path0.slice(0, -2), key, object, __: my__, e, dblExecute: true, req, res, mount, condition, toView })

        _object = data
        path0 = (path[1] || "").split(":")[0]
        path.splice(0, 1)
    }

    // division
    if (pathJoined.includes("/") && pathJoined.split("/")[1] !== "" && !key) {

        var _value = calcDivision({ _window, lookupActions, stack, value: pathJoined, __, id, e, req, res, object, condition })
        if (_value !== value && _value !== undefined) return _value
    }

    // modulo
    if (pathJoined.includes("%") && pathJoined.split("%")[1] !== "" && !key) {

        var _value = calcModulo({ _window, lookupActions, stack, value: pathJoined, __, id, e, req, res, object, condition })
        if (_value !== value && _value !== undefined) return _value
    }

    // multiplication
    if (pathJoined.includes("*") && !key) {

        var values = pathJoined.split("*").map(value => toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount }))
        var newVal = values[0]
        values.slice(1).map(val => {
            if (!isNaN(newVal) && !isNaN(val)) newVal *= val
            else if (isNaN(newVal) && !isNaN(val)) {
                while (val > 1) {
                    newVal += newVal
                    val -= 1
                }
            } else if (!isNaN(newVal) && isNaN(val)) {
                var index = newVal
                newVal = val
                while (index > 1) {
                    newVal += newVal
                    index -= 1
                }
            }
        })
        return newVal
    }

    // addition
    if (pathJoined.includes("+") && !key) {

        // increment
        if (pathJoined.slice(-2) === "++") {

            return toValue({ req, res, _window, lookupActions, stack, id, e, data: pathJoined.slice(0, -2) + "1", __, object, mount, condition })

        } else {

            var values = pathJoined.split("+").map(value => toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object }))
            var answer = values[0]
            values.slice(1).map(val => answer += val)
            return answer
        }
    }

    // subtraction
    if (pathJoined.includes("-") && !key) {

        var _value = calcSubs({ _window, lookupActions, stack, value: pathJoined, __, id, e, req, res, object })
        if (_value !== pathJoined) return _value
    }

    // if
    if (path0 === "if()") {

        var approved = toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })

        if (!approved) {

            if (args[3]) {

                if (condition) return toApproval({ _window, lookupActions, stack, e, data: args[3], id, __, req, res, object })
                if (path[1]) _object = toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object, mount, toView })
                else return toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object, mount, toView })
            }

            if (!path[1]) return

            if (path[1].includes("else()")) {

                if (path[2]) _object = toValue({ req, res, _window, lookupActions, stack, id, data: path[1].split(":")[1], __, e, object, mount })
                else return toValue({ req, res, _window, lookupActions, stack, id, data: path[1].split(":")[1], __, e, object, mount })

            } else if (path[1].includes("elif()")) {

                var _path = path.slice(2)
                _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
                return reducer({ _window, lookupActions, stack, id, value, key, data: _path, object, __, e, req, res, mount, condition })
            }

            path.shift()
            path0 = path[0].split(":")[0] || ""
            args = path[0].split(":")

        } else {
            
            if (condition) return toApproval({ _window, lookupActions, stack, e, data: args[2], id, __, req, res, object, toView })
            if (path[1]) _object = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount, toView })
            else return toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount, toView })

            path.shift()

            // remove elses and elifs
            while (path[0] && (path[0].includes("else()") || path[0].includes("elif()"))) { path.shift() }

            if (path[0]) {

                // update args and path0
                path0 = path[0].split(":")[0] || ""
                args = path[0].split(":")

            } else return _object
        }
    }

    // while
    if (path0 === "while()") {

        while (toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })) {
            toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount, toView })
        }
        // path = path.slice(1)
        return global.return = false
    }

    // globalVariable:()
    if (path0 && args[1] === "()" && !args[2]) {

        var globalVariable = toValue({ req, res, _window, id, e, data: args[0], __, stack, lookupActions})
        if (path.length === 1 && key && globalVariable) return global[globalVariable] = value

        if (globalVariable) path.splice(1, 0, globalVariable)
        path[0] = path0 = "global()"
    }

    // view => ():id
    if (path0 === "()" && args[1]) {

        // id
        var _id = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __, object })
        if (_id || args[1]) _object = views[_id || args[1]]
        path.splice(0, 1)
        path0 = path[0]
    }

    // .keyName => [object||view].keyName
    if (path[0] === "" && path.length > 1) {
        if (isNaN(path[1].charAt(0)) || path[1].includes("()")) {
            path.splice(0, 1)
            _object = _object || object || view
        } else return path.join(".")
    }

    if (!view) view = views[id]

    // initialize by methods
    if (actions.includes(path0)) {

        if (path0 === "getChildrenByClassName()" || path0 === "className()") {

            if (!object) {
                path.unshift("document()")
                path0 = "document()"
            }

        } else {

            var __o = ((typeof object === "object" && object.__view__) ? object : views[id]) || {}
            if (path0.toLowerCase().includes("prev") || path0.toLowerCase().includes("next") || path0.toLowerCase().includes("parent")) {

                if (__o.__labeled__ && __o.__templated__) path = ["2ndParent()", ...path]
                else if ((__o.__labeled__ && !__o.__templated__) || __o.__templated__ || __o.link) path.unshift("parent()")

            } else if (__o && path0 === "txt()" || path0 === "val()" || path0 === "min()" || path0 === "max()") {

                if (__o.__islabel__ || __o.__templated__ || __o.link || __o.__labeled__) path.unshift("input()")
            }
        }
    }

    // assign reserved vars
    var reservedVars = {
        keys: ["()", "global()", "e()", "console()", "document()", "window()", "win()", "history()", "navigator()", "nav()", "request()", "response()", "req()", "res()", "math()"],
        "()": view || views[id],
        "global()": _window ? _window.global : window.global,
        "e()": e,
        "console()": console,
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
    var reservedVar = false
    var underScored0 = path0 && path0.charAt(0) === "_" && !path0.split("_").find(i => i !== "_" && i !== "")
    if (reservedVars.keys.includes(path0) || underScored0) {

        if (reservedVars.keys.includes(path0)) _object = reservedVars[path0]
        else _object = __[path0.split("_").length - 2]

        path.splice(0, 1)
        reservedVar = true

    } else _object = _object !== undefined ? _object : object

    // still no _object
    if (_object === undefined && !reservedVar) {
        
        if (path[0]) {

            if (path0 === "undefined") return undefined
            else if (path0 === "false") return false
            else if (path0 === "true") return true
            else if (path0 === "desktop()") return global.manifest.device.device.type === "desktop"
            else if (path0 === "tablet()") return global.manifest.device.device.type === "tablet"
            else if (path0 === "mobile()") return global.manifest.device.device.type === "phone"
            else if (path0 === "clicked()") _object = global.clicked
            else if (path0 === "log()") {

                var _log = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, stack, id, data: arg || "here", params, __, e, object }))
                console.log("LOG", ..._log)
                stack.logs.push("LOG " + _log.join(" "))
                path = path.slice(1)
                path0 = (path[1] || "").split(":")[0]
            }

            else if (path0.charAt(0) === "@" && path[0].length === 6) {
                
                _object = toValue({ req, res, _window, lookupActions, stack, object, id, data: global.__refs__[path0].data, params, __, e })
            }

            else if (path0 === "today()") _object = new Date()
            else if (path0 === "_array" || path0 === "_list" || (!path0 && path[0].charAt(0) === ":")) {

                _object = []
                path[0].split(":").slice(1).map(el => {

                    if (isParam({ _window, string: el })) el = toParam({ req, res, stack, lookupActions, _window, id, e, __, data: el })
                    else el = toValue({ req, res, _window, stack, lookupActions, id, __, e, data: el, params })
                    _object.push(el)
                })
            }
            else if (path0 === "_map") {

                var __object = {}
                if (isParam({ _window, string: args[1] })) {

                    return args.slice(1).map(arg => reducer({ _window, lookupActions, stack, id, params, data: arg, object: __object, e, req, res, __, mount }))

                } else {

                    var args = path[0].split(":").slice(1)
                    args.map((arg, i) => {

                        if (i % 2) return
                        var f = toValue({ req, res, _window, id, __, e, data: arg, params })
                        var v
                        if (isParam({ _window, string: args[i + 1] })) v = toParam({ req, res, _window, id, e, __, data: args[i + 1]/*, object*/ })
                        else v = toValue({ req, res, _window, id, __, e, data: args[i + 1], params, object })
                        if (v !== undefined) __object[f] = v

                    })
                }

            } else if (mount) {
    
                _object = view
                path.unshift("()")
            }
        }

        if (_object !== undefined) path.splice(0, 1)
        else {
            if (path0 && path0.includes("()")) {
                _object = view
            } else if (path[1] && path[1].toString().includes("()")) {

                _object = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: path[0], params }) || {}
                path = path.slice(1)

            } else return pathJoined
        }
    }
    
    var lastIndex = path.length - 1
    var answer = path.reduce((o, k, i) => {

        if (k === undefined) return console.log(view, id, path)

        k = k.toString()
        var k0 = k.split(":")[0]
        var args = k.split(":")

        // get underscores
        var underScored = 0, k00 = k0
        while (k00.charAt(0) === "_") {
            underScored += 1
            k00 = k00.slice(1)
        }

        // fake lastIndex
        if (lastIndex !== path.length - 1) {
            if (key === true) key = false
            lastIndex = path.length - 1
        }

        // break
        if (breakRequest === true || breakRequest >= i) return o

        if (k0 === "else()" || k0 === "or()") {

            var args = k.split(":").slice(1)
            if (o || o === 0 || o === "") answer = o
            else if (args[0]) {
                args.map(arg => {
                    if (!answer) answer = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: arg, __, e })
                })
            }
            return answer
        }

        if (k === "undefined()" || k === "isundefined()" || k === "isUndefined()") return answer = o === undefined

        // isEmpty
        if (k === "isEmpty()") return answer = o === "" ? true : false

        // isnotEmpty
        if (k === "isnotEmpty()") return (answer = o !== "" && typeof o === "string") ? true : false

        // notExist
        if (k === "notexist()" || k === "doesnotexist()" || k === "doesnotExist()" || k === "notExist()")
            return answer = !o ? true : false

        // log
        if (k0.includes("log()")) {

            var tolog
            if (k0[0] === "_") tolog = o

            var _log = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, stack, id, e, __: tolog ? [tolog, ...__] : __, data: arg, object: k0[0] !== "_" ? o : object }))

            console.log("LOG", ..._log)
            stack.logs.push("LOG " + _log.join(" "))

            return o
        }

        if ((o === undefined || o === null) && k0 !== "push()") return o

        if (k0 !== "data()" && k0 !== "Data()" && k0 !== "doc()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {

            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: k, params })

            if (Array.isArray(o)) {
                if (isNaN(el)) {
                    if (o[0] && o[0][el]) {
                        delete o[0][el]
                        return o
                    } else return o
                }
                o.splice(el, 1)
            } else delete o[el]

            return o

        } else if (k0 === "del()") {

            if (args[1]) {
                var myparam = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                delete o[myparam]
            }

            return o

        } else if (k0 === "while()") {

            while (toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })) {
                toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e })
            }

        } else if (underScored && !k00 && o.__) { // _ || __ || ___ ...

            if (o.__view__) return o.__[underScored - 1]
            if (value !== undefined && key && i === lastIndex) answer = o[__[underScored - 1]] = value
            else if (typeof o === "object") answer = o[__[underScored - 1]]

        } else if (k.charAt(0) === "@" && k.length === 6) { // k not k0

            var data
            if (k0.charAt(0) === "@" && global.__refs__[k0].type === "text") data = global.__refs__[k0].data
            else data = toValue({ req, res, _window, lookupActions, stack, id, e, data: global.__refs__[k0].data, __, object })

            if (typeof data !== "object") {
                if (i === lastIndex && key && value !== undefined) answer = o[data] = value
                else if (key && value !== undefined && o[data] === undefined) {

                    if (!isNaN(toValue({ req, res, _window, lookupActions, stack, id, data: path[i + 1], __, e, object }))) answer = o[data] = []
                    else answer = o[data] = {}
                }
                else answer = o[data]
            } else answer = data

        } else if (k0 === "data()") {

            var _o = o.type ? o : view
            var _params = {}

            if (!o) return
            if (_o.type) breakRequest = true

            if (args[1]) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            // just get data()
            if (!_o.derivations) {

                var _path = _params.path || views[id].derivations || []
                var _data
                if (_params.data) _data = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: _path, object: _params.data || global[views[id].doc], __ })
                else {

                    _path.unshift(`${views[id].doc}:()`)
                    _data = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: _path, object, __ })
                }
                return answer = _o[_data]
            }

            if (_params.path) return answer = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: _params.path, object: _params.data || object, __ })
            var _derivations = _params.path || _o.derivations || []

            if (path[i + 1] !== undefined) {

                if (!_o.doc) return
                var _path = [..._derivations, ...path.slice(i + 1)]
                _path.unshift(`${_o.doc}:()`)
                answer = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: _path, object, __ })

            } else {

                var _path = [..._derivations]
                _path.unshift(`${_o.doc}:()`)
                answer = reducer({ req, res, _window, lookupActions, stack, id, value, key: path[i + 1] === undefined ? key : false, data: _path, object, __, e })
            }

        } else if (k0 === "Data()" || k0 === "doc()") {

            breakRequest = true
            var doc = o.__view__ ? o.doc : views[id].doc

            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    args[1] = _params.path || _params.derivations || []
                    if (typeof args[1] === "string") args[1] = args[1].split(".")

                    return answer = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: [`${doc}:()`, ...args[1], ...path.slice(i + 1)], object, __ })
                }

                if (args[1].charAt(0) === "@") args[1] = global.__refs__[args[1]].data
                args[1] = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                if (typeof args[1] === "string") args[1] = args[1].split(".")

                return answer = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: [`${doc}:()`, ...args[1], ...path.slice(i + 1)], object, __ })
            }
            
            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].charAt(0) === "@") path[i + 1] = toValue({ req, res, _window, lookupActions, stack, id, data: global.__refs__[path[i + 1]].data, __, e })
                answer = reducer({ req, res, _window, lookupActions, stack, id, e, value, key, data: [`${doc}:()`, ...path.slice(i + 1)], object, __ })
                
            } else if (key && value !== undefined) {
                answer = global[doc] = value
            } else answer = global[doc]
            
        } else if (k0 === "removeAttribute()") {

            var _o, _params
            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else _params = { att: toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) }

            _params.att = _params.att || _params.attribute

            if (_params.id) _o = views[_params.id].element
            else if (_params.view) _o = _params.view.element
            else if (_params.element || _params.el) _o = _params.element || _params.el
            else if (typeof o === "object" && o.element) _o = o.element
            else if (o.nodeType === Node.ELEMENT_NODE) _o = o
            answer = _o.removeAttribute(_params.att)

        } else if (k0 === "parent()") {

            var _o, _parent, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (typeof _o === "object") {

                if (_o.status === "Mounted") _parent = views[_o.element.parentNode.id]
                else _parent = views[_o.parent]
            }

            answer = _parent

        } else if (k0 === "2ndParent()" || k0 === "grandParent()") {

            var _o, _parent, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (typeof _o === "object") {

                if (_o.status === "Mounted") {
                    if (_o.element.parentNode && _o.element.parentNode.parentNode) return answer = views[_o.element.parentNode.parentNode.id]
                } else {
                    if (views[_o.parent] && views[_o.parent].parent) return answer = views[views[_o.parent].parent]
                }
            }

        } else if (k0 === "3rdParent()") {

            var _o, _parent, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (typeof _o === "object") {

                if (_o.status === "Mounted") {
                    if (_o.element.parentNode && _o.element.parentNode.parentNode && _o.element.parentNode.parentNode.parentNode)
                        return answer = views[_o.element.parentNode.parentNode.parentNode.id]
                } else {
                    if (views[_o.parent] && views[_o.parent].parent && views[views[_o.parent].parent].parent) return answer = views[views[views[_o.parent].parent].parent]
                }
            }

        } else if (k0 === "siblings()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var _parent = views[window.views[_o.id].parent]
            answer = [..._parent.element.children].map(el => {

                var _id = el.id, _view = views[_id]
                if (!_view) return
                if (_view.component === "Input") {

                    _id = (_view).element.getElementsByTagName("INPUT")[0].id
                    return _view

                } else return _view
            })

        } else if (k0 === "next()" || k0 === "nextSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            if (!element) return
            var nextSibling = element.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]

        } else if (k0 === "2ndNext()" || k0 === "2nd()" || k0 === "2ndNextSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[_o.parent].element

            if (!element.nextElementSibling || !element.nextElementSibling.nextElementSibling) return
            var nextSibling = element.nextElementSibling.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]

        } else if (k0 === "3rdNext()" || k0 === "3rd()" || k0 === "3rdNextSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[_o.parent].element

            if (!element.nextElementSibling || !element.nextElementSibling.nextElementSibling || !element.nextElementSibling.nextElementSibling.nextElementSibling) return
            var nextSibling = element.nextElementSibling.nextElementSibling.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]

        } else if (k0 === "nextSiblings()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var nextSiblings = [], nextSibling
            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[_o.parent].element

            var nextSibling = element.nextElementSibling
            if (!nextSibling) return

            while (nextSibling) {
                var _id = nextSibling.id
                nextSiblings.push(views[_id])
                nextSibling = (views[_id]).element.nextElementSibling
            }
            answer = nextSiblings

        } else if (k0 === "last()" || k0 === "lastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (Array.isArray(_o)) return answer = _o[_o.length - 1]
            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (Array.isArray(_o)) {

                if (value !== undefined && key) answer = _o[_o.length - 1] = value
                answer = _o[_o.length - 1]

            } else if (_o.type && _o.id) {

                var element = _o.element
                // if (_o.__templated__ || _o.link) element = views[o.parent].element
                var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
                var _id = lastSibling.id
                answer = views[_id]
            }

        } else if (k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (Array.isArray(_o)) return answer = _o[_o.length - 2]
            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = views[_id]

        } else if (k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[o.parent].element
            var thirdlastSibling = element.parentNode.children[element.parentNode.children.length - 3]
            var _id = thirdlastSibling.id
            answer = views[_id]

        } else if (k0 === "1stSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[o.parent].element
            var firstSibling = element.parentNode.children[0]
            var _id = firstSibling.id
            answer = views[_id]

        } else if (k0 === "2ndSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.__templated__ || _o.link) element = views[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = views[_id]

        } else if (k0 === "prev()" || k0 === "prevSibling()" || k0 === "1stPrev()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element, _el = _o.element
            // if (_o.__templated__ || _o.link) _el = views[_o.parent]

            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) element = _el
            else if (_el) element = _el.element
            else return

            var previousSibling = element.previousSibling
            if (!previousSibling) return

            var _id = previousSibling.id
            answer = views[_id]

        } else if (k0 === "2ndPrev()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var _element, _el = _o.element, previousSibling
            // if (_o.__templated__ || _o.link) _el = views[_o.parent]

            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) _element = _el
            else if (_el) _element = _el.element
            else return

            if (_element.previousSibling && _element.previousSibling.previousSibling)
                previousSibling = _element.previousSibling.previousSibling

            if (!previousSibling) return
            var _id = previousSibling.id
            return views[_id]

        } else if (k0 === "3rdPrev()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var _element, _el = _o.element, previousSibling
            // if (_o.__templated__ || _o.link) _el = views[_o.parent]

            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) _element = _el
            else if (_el) _element = _el.element
            else return

            if (_element.previousSibling && _element.previousSibling.previousSibling && _element.previousSibling.previousSibling.previousSibling)
                previousSibling = _element.previousSibling.previousSibling.previousSibling

            if (!previousSibling) return
            var _id = previousSibling.id
            return views[_id]

        } else if (k0 === "1stChild()" || k0 === "child()") {// o could be a string or element or view

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[0]) return
            var _id = _o.element.children[0].id

            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[0] }

        } else if (k0 === "grandChild()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[0] && !_o.element.children[0].children[0]) return
            var _id = _o.element.children[0].children[0].id

            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[0].children[0] }

        } else if (k0 === "grandChildren()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[0] && !_o.element.children[0].children[0]) return
            var _children = [..._o.element.children[0].children]

            var _views = []
            _children.map(child => {
                _views.push(views[child.id])
            })

            answer = _views

        } else if (k0 === "2ndChild()") {// o could be a string or element or view
            
            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[1]) return
            var _id = _o.element.children[1].id

            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[1] }

        } else if (k0 === "3rdChild()") {// o could be a string or element or view

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[2]) return
            var _id = _o.element.children[2].id

            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[2] }

        } else if (k0 === "3rdLastChild()") { // o could be a string or element or view

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[_o.element.children.length - 3]) return
            var _id = _o.element.children[_o.element.children.length - 3].id

            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[_o.element.children.length - 3] }

        } else if (k0 === "2ndLastChild()") { // o could be a string or element or view

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[_o.element.children.length - 2]) return
            var _id = _o.element.children[_o.element.children.length - 2].id

            answer = views[_id]

        } else if (k0 === "lastChild()") {  // o could be a string or element or view

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[_o.element.children.length - 1]) return
            var _id = _o.element.children[_o.element.children.length - 1].id

            answer = views[_id]

        } else if (k0 === "children()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (!_o.element) return
            answer = [..._o.element.children].map(el => {

                var _id = el.id, _view = views[_id]
                if (!_view) return

                if (_view.component === "Input") {

                    _id = (_view).element.getElementsByTagName("INPUT")[0].id
                    return _view

                } else return _view
            })

        } else if (k0 === "display()") {

            var _i
            if (typeof o === "object") _id = o.id
            else if (typeof o === "string") _id = o

            if (args[1]) {
                var _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                if (typeof _o === "object") _id = _o.id
                else if (typeof _o === "string") _id = _o
            }

            toParam({ req, res, _window, lookupActions, stack, id: _id, e, __, data: `style().display=flex` })

        } else if (k0 === "hide()") {

            var _i
            if (typeof o === "object") _id = o.id
            else if (typeof o === "string") _id = o

            if (args[1]) {
                var _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                if (typeof _o === "object") _id = _o.id
                else if (typeof _o === "string") _id = _o
            }

            toParam({ req, res, _window, lookupActions, stack, id: _id, e, __, data: `style().display=none` })

        } else if (k0 === "style()") { // style():key || style():[key=value;id|el|view|element]

            var _o, _params = {}

            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                else _params = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

                if (!_params) return
                _o = _params.view || _params.id || _params.el || _params.element// || o
                if (!_o) {
                    if (!o.element) _o = views[id]
                    else _o = o
                }

            } else {

                if (!o.element) _o = views[id]
                else _o = o
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            // get element
            if (_o.nodeType && _o.nodeType === Node.ELEMENT_NODE) answer = _o.style
            else if (typeof _o === "object") {

                if (_o.element) answer = _o.element.style
                else answer = _o.style = _o.style || {}
            }
            
            if (Object.keys(_params).length > 0) {

                Object.entries(_params).map(([key, value]) => {
                    answer[key] = value
                })
            }

        } else if (k0 === "qr()") {

            // wait address
            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "qr()", object, toView, _object, lookupActions, __, id })
            
            qr({ _window, id, req, res, data, e, __, stack, address, lookupActions })

        } else if (k0 === "contact()") {

            var data = toValue({ req, res, _window, id, e, __, data: args[1] })
            if (typeof data !== "obejct") return o

            vcard({ _window, id, req, res, data, e, __ })

        } else if (k0 === "bracket()") {

            if (typeof o === "object") answer = require("./jsonToBracket").jsonToBracket(o)

        } else if (k0 === "getTagElements()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

        } else if (k0 === "getTagElement()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]

        } else if (k0 === "getTags()" || k0 === "tags()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => views[o.id])

        } else if (k0 === "getTag()" || k0 === "tag()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]
            answer = window.views[answer.id]

        } else if (k0 === "getInputs()" || k0 === "inputs()") {

            var _input, _textarea, _editables, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) {

                _input = _o.getElementsByTagName("INPUT")
                _textarea = _o.getElementsByTagName("TEXTAREA")

            } else {

                _input = _o.element && _o.element.getElementsByTagName("INPUT")
                _textarea = _o.element && _o.element.getElementsByTagName("TEXTAREA")
                _editables = getDeepChildren({ _window, lookupActions, stack, id: _o.id }).filter(view => view.editable)
                if (_o.editable) _editables.push(_o)
            }
            answer = [..._input, ..._textarea, ..._editables].map(o => views[o.id])

        } else if (k0 === "getInput()" || k0 === "input()") {

            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) __o = views[_o.id]
            else __o = _o

            if (!__o) return
            if (__o.type !== "Input") {
                if (__o.element.getElementsByTagName("INPUT")[0]) answer = views[__o.element.getElementsByTagName("INPUT")[0].id]
                else if (__o.element.getElementsByTagName("TEXTAREA")[0]) answer = views[__o.element.getElementsByTagName("TEXTAREA")[0].id]
                else {
                    var deepChildren = getDeepChildren({ _window, lookupActions, stack, id: __o.id })
                    if (__o.editable || deepChildren.find(view => view.editable)) {
                        answer = __o.editable ? __o : deepChildren.find(view => view.editable)
                    } else return
                }
            } else answer = __o

        } else if (k0 === "getEntry()" || k0 === "entry()") {

            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) __o = views[_o.id]
            else __o = _o

            if (!__o) return
            if (__o.type !== "Entry") {

                var _elements, _entry
                if (__o.element.getElementsByTagName("P")[0]) _elements = [...__o.element.getElementsByTagName("P")]
                answer = _entry = _elements.find(el => views[el.id].type === "Entry")

            } else answer = __o

        } else if (k0 === "getEntries()" || k0 === "entries()") {

            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) __o = views[_o.id]
            else __o = _o

            if (!__o) return
            if (__o.type !== "Entry") {

                var _elements, _entry
                if (__o.element.getElementsByTagName("P")[0]) _elements = [...__o.element.getElementsByTagName("P")]
                answer = _entry = _elements.filter(el => views[el.id].type === "Entry")

            } else answer = [__o]

        } else if (k0 === "px()") {

            if (args[1]) {
                return lengthConverter(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }))
            }
            return lengthConverter(o)

        } else if (k0 === "touchable()") {

            if (_window) {

                return req.device.type === "phone" || req.device.type === "tablet"

            } else return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));

        } else if (k0 === "getChildrenByClassName()" || k0 === "className()") {

            var className, _params = {}, _o
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || o
                className = _params.className || _params.class

            } else {
                className = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                _o = o
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (className) {
                if (typeof _o === "object" && _o.element) answer = [..._o.element.getElementsByClassName(className)]
                else if (_o.nodeType === Node.ELEMENT_NODE) answer = [..._o.element.getElementsByClassName(className)]
            } else answer = []

            answer = answer.map(o => window.views[o.id])

        } else if (k0 === "name()") {

            var _o
            if (o.__view__) _o = o
            else _o = views[id]
            var _name = toValue({ req, res, _window, id, e, __, data: args[1] })
            if (_o.__name__ === _name) return _o
            else {
                var children_ = getDeepChildren({ _window, id: _o.id })
                return children_.find(child => child.__name__ === _name)
            }

        } else if (k0 === "names()") {

            var _o
            if (o.__view__) _o = o
            else _o = views[id]
            var _name = toValue({ req, res, _window, id, e, __, data: args[1] }), _views_ = []
            if (_o.__name__ === _name) _views_.push(_o)
            else {
                var children_ = getDeepChildren({ _window, id: _o.id })
                _views_.push(...children_.filter(child => child.__name__ === _name))
            }
            return _views_

        } else if (k0 === "classlist()" || k0 === "classList()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (typeof _o === "object" && _o.element) answer = [..._o.element.classList]
            else if (_o.nodeType === Node.ELEMENT_NODE) answer = [..._o.classList]

        } else if (k0 === "getElementsByClassName()" || k0 === "class()") {

            // map not loaded yet
            if (view.status === "Loading") {
                view.controls = toArray(view.controls)
                return view.controls.push({
                    event: `loaded?${key}`
                })
            }

            var className, _params = {}
            if (args[1]) className = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            if (className && o.element) answer = [...o.element.getElementsByClassName(className)]
            else answer = []

            answer = answer.map(el => views[el.id])
            if ([...o.element.classList].includes(className)) answer.unshift(o)

        } else if (k0 === "toInteger()") {

            var integer
            if (args[1]) integer = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            else integer = o
            answer = Math.round(toNumber(integer))

        } else if (k0 === "click()") {
            
            if (_window) return view.controls.push({
                event: `loaded?${pathJoined}`
            })

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            } else _o = o.__view__ ? o : views[id]

            if (typeof _o === "string" && views[_o]) views[_o].element.click()
            else if (_o.nodeType === Node.ELEMENT_NODE) _o.click()
            else if (typeof _o === "object" && _o.element) _o.element.click()

        } else if (k0 === "dblclick()") {

            if (_window) return view.controls.push({
                event: `loaded?${pathJoined}`
            })

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) views[_o].element.click()
            else if (_o.nodeType === Node.ELEMENT_NODE) _o.click()
            else if (typeof _o === "object" && _o.element) _o.element.click()

            setTimeout(() => {
                if (typeof _o === "string" && views[_o]) views[_o].element.click()
                else if (_o.nodeType === Node.ELEMENT_NODE) _o.click()
                else if (typeof _o === "object" && _o.element) _o.element.click()
            }, 0)

        } else if (k0 === "focus()") {

            if (_window) return view.controls.push({
                event: `loaded?${pathJoined}`
            })

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            focus({ id: _o.id })

        } else if (k0 === "blur()") { // blur

            if (_window) return view.controls.push({
                event: `loaded?${pathJoined}`
            })

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            _o.element.blur()

        } else if (k0 === "axios()") {

            var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            require("./axios").axios({ id, lookupActions, stack, e, __, params: _params })

        } else if (k0 === "getElementById()") {

            var _params = {}, _od
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.element || o
                    _id = _params.id

                } else _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            } else _o = o

            answer = _o.getElementById(_id)

        } else if (k0 === "mousedown()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                    _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    _o = views[_id]
                }
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mousedownEvent = new Event("mousedown")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mousedownEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseup()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                    _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    _o = views[_id]
                }
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseupEvent = new Event("mouseup")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseupEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseupEvent)

        } else if (k0 === "mouseenter()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                    _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    _o = views[_id]
                }
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseenterEvent = new Event("mouseenter")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseenterEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                    _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    _o = views[_id]
                }
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseleaveEvent = new Event("mouseleave")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseleaveEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseleaveEvent)

        } else if (k0 === "keyup()") {

            var _params = {}, _o, _id
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                    _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    _o = views[_id]
                }

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var keyupevent = new Event("keyup")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(keyupevent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(keyupevent)

        } else if (k0 === "keydown()") {

            var _params = {}, _o, _id
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                    _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    _o = views[_id]
                }

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var keyupevent = new Event("keydown")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(keyupevent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(keyupevent)

        } else if (k0 === "device()") {

            answer = global.manifest.device.type

        } else if (k0 === "mobile()" || k0 === "phone()") {

            answer = global.manifest.device.type === "phone"

        } else if (k0 === "desktop()") {

            answer = global.manifest.device.type === "desktop"

        } else if (k0 === "tablet()") {

            answer = global.manifest.device.type === "tablet"

        } else if (k0 === "installApp()") {

            const installApp = async () => {

                global.__installApp__.prompt();
                const { outcome } = await global.__installApp__.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
            }

            installApp()

        } else if (k0 === "clearTimeout()" || k0 === "clearTimer()") {

            var _params = {}, _o, _timer
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _timer = _params.timer

                } else {
                    return args.slice(1).map(arg => {

                        _timer = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg, params })
                        clearTimeout(_timer)
                    })
                }
            } else _timer = o

            clearTimeout(_timer)

        } else if (k0 === "clearInterval()") {

            var _params = {}, _onterval
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _interval = _params.interval

                } else {
                    return args.slice(1).map(arg => {

                        _timer = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg, params })
                        clearInterval(_timer)
                    })
                }
            } else _interval = o

            answer = clearInterval(_interval)

        } else if (k0 === "interval()") {

            if (!isNaN(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e }))) { // interval():params:timer

                var _timer = parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e }))
                var myFn = () => toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], mount: true })
                answer = setInterval(myFn, _timer)

            } else if (isParam({ _window, string: args[1] }) && !args[2]) { // interval():[params;timer]

                var _params
                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], mount: true })
                var myFn = () => toValue({ req, res, _window, lookupActions, stack, id, data: _params.params || _params.parameters, __, e })
                answer = setInterval(myFn, _params.timer)
            }

            if (o.type && o.id) o[generate() + "-timer"] = answer

        } else if (k0 === "repeat()") {

            var _data_ = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object })
            var times = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })
            var loop = []
            for (var i = 0; i < times; i++) {
                loop.push(_data_)
            }
            return loop

        } else if (k0 === "timer()" || k0 === "setTimeout()") {

            // timer():params:timer:repeats
            var _timer = args[2] ? parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })) : 0
            var _repeats = args[3] ? parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object })) : false
            var myFn = () => { toParam({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object, toView }) }
            
            if (typeof _repeats === "boolean") {

                if (_repeats === true) answer = setInterval(myFn, _timer)
                else if (_repeats === false) answer = setTimeout(myFn, _timer)

            } else if (typeof _repeats === "number") {
                
                answer = []
                answer.push(setTimeout(myFn, _timer))
                if (_repeats > 1) {
                    for (let index = 0; index < _repeats; index++) {
                        answer.push(setTimeout(myFn, _timer))
                    }
                }
            }

            if (o.__view__) toArray(answer).map(timer => o[generate() + "-timer"] = timer)

        } /*else if (k0 === "path()") {

            var _path = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            if (typeof _path === "string") _path = _path.split(".")
            _path = [..._path, ...path.slice(i + 1)]
            answer = reducer({ req, res, _window, lookupActions, stack, id, path: _path, value, key, object: o, __, e })
            
        } */else if (k0 === "pop()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            else _o = o

            _o.pop()
            answer = _o

        } else if (k0 === "shift()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            else _o = o

            _o.shift()
            answer = _o

        } else if (k0 === "slice()") { // slice by text or slice by number

            if (!Array.isArray(o) && typeof o !== "string" && typeof o !== "number") return
            var _start, _end, _params

            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _o = _params.object || _params.map || o
                _start = _params.start
                _end = _params.end

            } else {

                _start = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __, object })
                _end = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[2], __, object })
            }

            if (_end !== undefined) {

                if (!isNaN(_end)) {

                    if (!isNaN(_start)) answer = o.slice(parseInt(_start), parseInt(_end))
                    else {
                        answer = o.split(_start)[1]
                        answer = answer.slice(0, _end)
                    }

                } else {

                    if (!isNaN(_start)) answer = o.slice(parseInt(_start))
                    else answer = o.split(_start)[1]
                    answer = answer.split(_end)[0]
                }

            } else {

                if (!isNaN(_start)) answer = o.slice(parseInt(_start) || 0)
                else answer = o.split(_start)[1]
            }

        } else if (k0 === "reduce()") {

            var _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

                } else _params.path = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            }

            answer = reducer({ _window, lookupActions, stack, id, data: _params.path, object: o, e, req, res, __, mount, key: _params.value !== undefined ? true : key, value: _params.value !== undefined ? _params.value : value })

        } else if (k0 === "derivations()" || k0 === "path()") {

            var _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

                } else _params.path = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            }

            _o = _params.object || _params.map || o
            if (_params.index) return _o.derivations[_params.index]

            if ((key && value !== undefined && lastIndex) || _params.value !== undefined) {

                if (_params.path !== undefined) return toArray(_params.path).reduce((o, k, i) => {
                    if (i === _params.path.length - 1) return o[k] = _params.value !== undefined ? _params.value : value
                    else return o[k]
                }, _o)

                else return _o.derivations

            } else {

                if (_params.path !== undefined) return toArray(_params.path).reduce((o, k) => o[k], _o)
                else return _o.derivations
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else if (k0 === "_array" || k0 === "_list") {

            answer = []
            k.split(":").slice(1).map(el => {
                el = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: el, params })
                answer.push(el)
            })

        } else if (k0 === "_map") {

            answer = {}
            if (isParam({ _window, string: args[1] })) {

                return args.slice(1).map(arg => reducer({ _window, lookupActions, stack, id, data: arg, object: answer, e, req, res, __, mount }))
            } else {

                k.split(":").slice(1).map((el, i) => {

                    if (i % 2) return
                    var f = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: el, params })
                    var v = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args[i + 1], params })
                    if (v !== undefined) answer[f] = v
                })
            }

        } else if (k0 === "_semi" || k0 === ";") {

            answer = o + ";"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_quest" || k0 === "?") {

            answer = o + "?"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_dot" || k0 === ".") {

            answer = o + "."
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_space" || k0 === " ") {

            answer = o = o + " "
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_equal" || k0 === "=") {

            answer = o + "="
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_comma" || k0 === ",") {

            answer = o + ","
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "return()") {

            stack.returns[0].data = answer = toValue({ _window, data: args[1], e, id, object, __, stack, lookupActions })
            stack.returns[0].returned = true

        } else if (k0 === "reload()") {

            document.location.reload(true)

        } else if (k0 === "same()" || k0 === "isSame()") {

            var _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
                answer = _next === o

        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
                answer = _next !== o

        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
                answer = _next.contains(o) || _next === o

        } else if (k0 === "contains()" || k0 === "contain()") {

            var _first, _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e })
            if (!_next) return
            if (_next.nodeType === Node.ELEMENT_NODE) { }
            else if (typeof _next === "object") _next = _next.element
            else if (typeof _next === "string" && views[_next]) _next = views[_next].element

            if (o.nodeType === Node.ELEMENT_NODE) _first = o
            else if (typeof o === "object") _first = o.element
            else if (typeof o === "string" && views[o]) _first = views[o].element

            if (!_first || !_next) return
            if (_first.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE) {
                answer = _first.contains(_next)
                if (!answer) answer = _first.id === _next.id
            }
                
        } else if (k0 === "in()" || k0 === "inside()") {

            var _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e })
            if (_next) {
                if (typeof o === "string" || Array.isArray(o) || typeof o === "number") return answer = _next.includes(o)
                else if (typeof o === "object") answer = _next[o] !== undefined
                else if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE) return answer = _next.contains(o)
            } else return false

        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
                answer = !_next.contains(o) && _next !== o

        } else if (k0 === "doesnotContain()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: args[1], __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
                answer = !o.contains(_next)

        } else if (k0 === "then()") {

            var args = k.split(":").slice(1)

            if (args[0]) {
                args.map(arg => {
                    toValue({ req, res, _window, lookupActions, stack, id: mainId, data: arg, __, e })
                })
            }

        } else if (k0 === "and()") {

            if (!o) {
                answer = false
            } else {
                var args = k.split(":").slice(1)
                if (args[0]) {
                    args.map(arg => {
                        if (answer) answer = toValue({ req, res, _window, lookupActions, stack, id: mainId, data: arg, __, e })
                    })
                }
            }

        } else if (k0 === "isEqual()" || k0 === "is()") {

            var args = k.split(":")
            var b = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            // console.log(`'${o}'`, `'${b}'`);
            answer = isEqual(o, b)
            // console.log(answer, o[3] === b[3], o == b);

        } else if (k0 === "greater()" || k0 === "isgreater()" || k0 === "isgreaterthan()" || k0 === "isGreaterThan()") {

            var args = k.split(":")
            var b = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = parseFloat(o) > parseFloat(b)

        } else if (k0 === "less()" || k0 === "isless()" || k0 === "islessthan()" || k0 === "isLessThan()") {

            var args = k.split(":")
            var b = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = parseFloat(o) < parseFloat(b)

        } else if (k0 === "isNot()" || k0 === "isNotEqual()" || k0 === "not()" || k0 === "isnot()") {

            var args = k.split(":")
            var isNot = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = !isEqual(o, isNot)

        } else if (k0 === "isTrue()") {

            answer = o === true

        } else if (k0 === "isFalse()") {

            answer = o === false

        } else if (k0 === "notundefined()" || k0 === "isdefined()") {

            answer = o !== undefined

        } else if (k0 === "opposite()" || k0 === "opp()") {

            if (typeof o === "number") answer = -1 * o
            else if (typeof o === "boolean") answer = !o
            else if (typeof o === "string" && o === "true" || o === "false") {
                if (o === "true") answer = false
                else answer = true
            }

        } else if (k0 === "negative()" || k0 === "neg()") {

            answer = o < 0 ? o : -o

        } else if (k0 === "positive()" || k0 === "pos()") {

            answer = o > 0 ? o : o < 0 ? -o : o

        } else if (k0 === "abs()") {

            o = o.toString()

            var isPrice
            if (o.includes(",")) isPrice = true
            o = toNumber(o)

            answer = Math.abs(o)
            if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "dividedBy()" || k0 === "divide()" || k0 === "divided()" || k0 === "divideBy()" || k0 === "/()") {

            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, lookupActions, stack, id, data: arg, __, e })

                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()

                if (answer.includes(",") || b.includes(",")) isPrice = true

                b = toNumber(b)
                answer = toNumber(answer)

                answer = answer % b === 0 ? answer / b : answer * 1.0 / b
            })
            if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "times()" || k0 === "multiplyBy()" || k0 === "multiply()" || k0 === "mult()" || k0 === "x()" || k0 === "*()") {

            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, lookupActions, stack, id, data: arg, __, e })

                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()

                if (answer.includes(",") || b.includes(",")) isPrice = true

                if (typeof b === "number") {

                    b = toNumber(b)
                    answer = toNumber(answer)

                    answer = answer * b

                } else if (typeof answer !== "number") {

                    var textt = ""
                    for (var i = 0; i < b; i++) {
                        textt += answer
                    }
                    return textt
                }
            })
            if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "add()" || k0 === "plus()" || k0 === "+()") {

            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, lookupActions, stack, id, data: arg, __, e })

                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                var space = answer.slice(-1) === " " || b.slice(-1) === " "

                if (answer.includes(",") || b.includes(",")) isPrice = true

                b = toNumber(b)
                answer = toNumber(answer)

                answer = space ? answer + " " + b : answer + b
            })
            if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "subs()" || k0 === "minus()" || k0 === "-()") {

            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {

                var b = toValue({ req, res, _window, lookupActions, stack, id, data: arg, e, __ })

                answer = answer.toString()
                b = b.toString()

                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true

                b = toNumber(b)
                answer = toNumber(answer)

                if (!isNaN(o) && !isNaN(b)) answer = answer - b
                else answer = answer.split(b)[0] - answer.split(b)[1]
            })

            if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "mod()") {

            var b = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })

            /*o = o === 0 ? o : (o || "")
            b = b === 0 ? b : (b || "")
            o = o.toString()
            b = b.toString()
            
            var isPrice
            if (o.includes(",") || b.includes(",")) isPrice = true*/

            b = toNumber(b)
            o = toNumber(o)

            answer = o % b
            //if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "sum()") {

            answer = o.reduce((o, k) => o + toNumber(k), 0)

        } else if (k0 === "src()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            else _o = o

            if (typeof _o === "object" && views[_o]) _o = views[_o]

            var __o
            if (_o.type !== "Image") {

                var imageEl = _o.element.getElementsByTagName("IMG")[0]
                if (imageEl) __o = views[imageEl.id]
                else return

            } else __o = _o

            if (__o.element) {

                if (key && value !== undefined) answer = __o.element.src = value
                else answer = __o.element.src

            } else if (__o.nodeType === Node.ELEMENT_NODE) answer = __o.src = value

        } else if (k0 === "fileReader()") {

            var _files = [], _params = args[1]
            if (args.length === 2 && e.target && e.target.files) {

                // fileReader():actions
                _files = [...e.target.files]

            } else {

                // fileReader():file:actions
                if (isParam({ _window, string: args[1] })) {
                    _params = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                    _files = _params.files ? _params.files : (_params.file ? toArray(_params.file) : [])
                } else _files = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                _params = args[2]
            }

            if (!_files || (Array.isArray(_files) && _files.length === 0)) return
            if (typeof _files !== "object") _files = [_files]
            _files = [..._files]
            global.fileReader = []
            var __key = generate()
            global.__COUNTER__ = global.__COUNTER__ || {}
            global.__COUNTER__[__key] = {
                length: _files.length,
                count: 0
            }

            _files.map(file => {

                var reader = new FileReader()
                reader.onload = (e) => {
                    global.__COUNTER__[__key].count++;
                    global.fileReader.push({
                        readAsDataURL: true,
                        type: file.type,
                        lastModified: file.lastModified,
                        name: file.name,
                        size: file.size,
                        file: e.target.result,
                        url: e.target.result
                    })
                    if (global.__COUNTER__[__key].count === global.__COUNTER__[__key].length) {
                        global.file = global.fileReader[0]
                        global.files = global.fileReader
                        console.log(global.files);
                        toParam({ req, res, _window, lookupActions, stack, id, e, __: [(global.files.length > 1 ? global.files : global.file), ...__], data: _params })
                    }
                }

                reader.readAsDataURL(file)
            })

        } else if (k0 === "clear()") {

            o.element.value = null

        } else if (k0 === "list()") {

            answer = toArray(o)
            answer = [...answer]

        } else if (k0 === "json") {

            answer = o + ".json"

        } else if (k0 === "notification()" || k0 === "notify()") {

            var notify = () => {
                if (isParam({ _window, string: args[1] })) {

                    var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    new Notification(_params.title || "", _params)

                } else {

                    var title = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                    new Notification(title || "")
                }
            }

            if (!("Notification" in window)) {
                // Check if the browser supports notifications
                alert("This browser does not support notification");
            } else if (Notification.permission === "granted") {
                // Check whether notification permissions have already been granted;
                // if so, create a notification
                notify()
                // …
            } else if (Notification.permission !== "denied") {

                // We need to ask the user for permission
                Notification.requestPermission().then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        notify()
                        // …
                    }
                });
            }

        } else if (k0 === "exists()") {

            answer = o !== undefined ? true : false

        } else if (k0 === "alert()") {

            var text = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            alert(text)

        } else if (k0 === "clone()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            else _o = o
            answer = clone(_o)

        } else if (k0 === "override()") {

            var args = k.split(":"), _obj, _o
            if (args[2]) {

                _o = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                _obj = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e })

            } else {

                _o = o
                _obj = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            }

            if (Array.isArray(_o)) {

                if (Array.isArray(_obj)) answer = _o = [..._o, ..._obj]
                else if (typeof _obj === "object") answer = _o = [..._o, ...Object.values(_obj)]

            } else if (typeof _o === "object") {

                if (typeof _obj === "object") answer = _o = { ..._o, ..._obj }
                else if (Array.isArray(_obj)) {
                    var __obj = {}
                    _obj.map(obj => __obj[obj.id] = obj)
                    answer = _o = { ..._o, ...__obj }
                }
            } else answer = _o = _obj

        } else if (k0 === "text()" || k0 === "val()" || k0 === "txt()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            else _o = o

            var el
            if (typeof _o === "string" && views[_o]) el = views[_o].element
            else if (_o.nodeType === Node.ELEMENT_NODE) el = _o
            else if (_o.element) el = _o.element

            var _view
            if (el) _view = views[el.id]

            if (_view && (_view.__islabel__ || _view.__labeled__) && el && _view.__name__ !== "Input") el = el.getElementsByTagName("INPUT")[0]
            else if (_view && _view.editable) el = _view.element

            if (value) value = replaceNbsps(value)

            if (el) {
                if (window.views[el.id].__name__ === "Input") {

                    answer = el.value
                    if (i === lastIndex && key && value !== undefined && o.element) answer = el.value = value
                    else if (path[i + 1] === "del()") {
                        breakRequest = i + 1
                        answer = el.value = ""
                    }

                } else {

                    answer = (el.textContent === undefined) ? el.innerText : el.textContent
                    if (i === lastIndex && key && value !== undefined) answer = el.innerHTML = value
                    else if (path[i + 1] === "del()") {
                        breakRequest = i + 1
                        answer = el.innerHTML = ""
                    }
                }

                if (views[el.id].required) answer = answer.slice(0, -1)

            } else if (view && view.__name__ === "Input") {

                if (i === lastIndex && key && value !== undefined) answer = _o[view.element.value] = value
                else if (path[i + 1] === "del()") {
                    breakRequest = i + 1
                    answer = _o[view.element.value] = ""
                }
                else return answer = _o[view.element.value]

            } else if (view && view.__name__ !== "Input") {

                if (i === lastIndex && key && value !== undefined) answer = _o[view.element.innerHTML] = value
                else if (path[i + 1] === "del()") {
                    breakRequest = i + 1
                    answer = _o[view.element.innerHTML] = ""
                }
                answer = (view.element.textContent === undefined) ? view.element.innerText : view.element.textContent
            }

        } else if (k0 === "min()") {

            var el
            if (o.nodeType === Node.ELEMENT_NODE) el = o
            else if (o.element) el = o.element

            if (el) answer = el.min
            if (i === lastIndex && key && value !== undefined) el.min = value

        } else if (k0 === "max()") {

            var el
            if (o.nodeType === Node.ELEMENT_NODE) el = o
            else if (o.element) el = o.element

            if (el) answer = el.max
            if (i === lastIndex && key && value !== undefined) el.max = value

        } else if (k0 === "field()") {

            var fields = k.split(":").slice(1)
            fields.map((field, i) => {
                if (i % 2) return
                var f = toValue({ req, res, _window, lookupActions, stack, id, data: field, __, e })
                var v = toValue({ req, res, _window, lookupActions, stack, id, data: fields[i + 1], __, e })
                o[f] = v
            })
            answer = o

        } /*else if (k0 === "object()" || k0 === "{}") {
            
            answer = {}
            if (args[1]) {

                var fv = args.slice(1)
                fv.map((_fv) => {

                    var isValue = _i % 2
                    if (isValue) return

                    var f = toValue({ req, res, _window, lookupActions, stack, id, value: _fv, __, e })
                    var v = toValue({ req, res, _window, lookupActions, stack, id, value: fv[_i + 1], __, e })
                    answer[f] = v
                })
            }
            
        } */else if (k0 === "unshift()" || k0 === "pushFirst()" || k0 === "pushStart()") { // push to the begining, push first, push start

            var _item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object })
            var _index = 0
            if (_index === undefined) _index = o.length

            if (Array.isArray(_item)) {

                _item.map(_item => {
                    o.splice(_index, 0, _item)
                    _index += 1
                })

            } else if (Array.isArray(o)) o.splice(_index, 0, _item)
            answer = o

        } else if (k0.includes("push()")) {

            if (!Array.isArray(o))
                o = reducer({ req, res, _window, id, data: path.slice(0, i), value: [], key: true, __, e, object: _object })

            var _item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object })
            var _index = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })

            if (_index === undefined) _index = o.length

            if (Array.isArray(_item)) {

                _item.map(_item => {
                    o.splice(_index, 0, _item)
                    _index += 1
                })

            } else if (Array.isArray(o)) o.splice(_index, 0, _item)

            answer = o

        } else if (k0 === "pushItems()") {

            args.slice(1).map(arg => {
                arg = toValue({ req, res, _window, id, data: args[1], __, e, object })
                o.splice(o.length, 0, arg)
            })

        } else if (k0 === "pull()") { // pull by index or by conditions

            // if no index pull the last element
            var _last = 1, _text
            var _first
            if (!isParam({ _window, id, string: args[1] })) _first = args[1] !== undefined ? toValue({ _window, id, data: args[1], __, e, object, lookupActions, stack }) : 0
            if (args[2]) _last = toValue({ _window, id, data: args[2], __, e, object, lookupActions, stack })

            if (typeof _first !== "number") {

                var _items = o.filter(o => toApproval({ _window, e, data: args[1], id, object: o, __, lookupActions, stack }))
                
                _items.filter(data => data !== undefined && data !== null).map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })

                return answer = o
            }

            o.splice(_first, _last || 1)
            answer = o

        } else if (k0 === "pullItem()") { // pull item

            var _item = toValue({ _window, id, data: args[1], __, e, object })
            var _index = o.findIndex(item => isEqual(item, _item))
            if (_index !== -1) o.splice(_index, 1)
            answer = o

        } else if (k0 === "pullLast()") {

            // if no it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o

        } else if (k0 === "findItems()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = o.filter(item => isEqual(item, _item))

        } else if (k0 === "findItem()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = o.find(item => isEqual(item, _item))

        } else if (k0 === "findItemIndex()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = o.findIndex(item => isEqual(item, _item))

        } else if (k0 === "filterItems()") {

            var _items

            if (k[0] === "_") _items = o.filter(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
            else _items = o.filter(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, object: o, req, res, __ }))

            _items.map(_item => {
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index, 1)
            })

            answer = o

        } else if (k0 === "filterItem()") {

            var _index

            if (k[0] === "_") _index = o.findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
            else _index = o.findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, object: o, req, res, __ }))

            if (_index !== -1) o.splice(_index, 1)
            answer = o

        } else if (k0 === "splice()") {

            // push at a specific index / splice():value:index
            var _value = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            var _index = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e })
            if (_index === undefined) _index = o.length - 1
            // console.log(clone(o), _valuendex);
            o.splice(parseInt(_index), 0, _value)
            answer = o

        } else if (k0 === "remove()" || k0 === "rem()") {

            views.tooltip.element.style.opacity = "0"

            if (args[1] && !isParam({ _window, string: args[1] })) {

                var _id = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                return remove({ id: _id })

            } else if (args[1] && isParam({ _window, string: args[1] })) {

                var params = toParam({ req, res, _window, lookupActions, stack, e, id, data: args[1], __ })
                return remove({ id: params.id || o.id, data: params, __ })
            }

            var _id = typeof o === "string" ? o : o.id

            remove({ id: o.id, __ })
            return true

        } else if (k0 === "scrollTo()") {

            var _x = toValue({ req, res, _window, lookupActions, stack, e, id, data: args[1], __, params })
            var _y = toValue({ req, res, _window, lookupActions, stack, e, id, data: args[2], __, params })
            window.scrollTo(_x, _y)

        } else if (k0 === "droplist()") {

            var _params = toParam({ req, res, _window, lookupActions, stack, e, id, data: args[1], __, params })
            require("./droplist").droplist({ id, e, droplist: _params, __, stack, lookupActions })

        } else if (k0 === "keys()") {

            answer = Object.keys(o)

        } else if (k0 === "key()") {

            if (i === lastIndex && value !== undefined && key) answer = Object.keys(o)[0] = value
            else answer = Object.keys(o)[0]

        } else if (k0 === "values()") { // values in an object

            if (Array.isArray(o)) answer = o
            else answer = Object.values(o)

        } else if (k0 === "value()") { // value 0 in an object

            if (i === lastIndex && value !== undefined && key) answer = o[Object.keys(o)[0]] = value
            else answer = Object.values(o)[0]

        } else if (k0 === "toId()") {

            var checklist = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()" || k0 === "gen()") {

            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _params.length = _params.length || _params.len || 5
                _params.number = _params.number || _params.num
                answer = generate(_params)

            } else {

                var length = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }) || 5
                answer = generate({ length })
            }

        } else if (k0 === "includes()" || k0 === "inc()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            if (typeof o === "string") {
                answer = o.split(_item).length > 1
            } else if (Array.isArray(o)) {
                answer = o.find(item => isEqual(item, _item)) ? true : false
            }

        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {

            var _include = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            answer = !o.includes(_include)

        } else if (k0 === "capitalize()") {

            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                if (_params.all) answer = capitalize(o)
                else answer = capitalizeFirst(o)

            } else answer = capitalize(o)

        } else if (k0 === "capitalizeFirst()") {

            answer = capitalizeFirst(o)

        } else if (k0 === "uncapitalize()") {

            answer = capitalize(o, true)

        } else if (k0 === "uppercase()" || k0 === "toUpperCase()" || k0 === "touppercase()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            else _o = o
            answer = typeof _o === "string" ? _o.toUpperCase() : _o

        } else if (k0 === "lowercase()" || k0 === "toLowerCase()" || k0 === "tolowercase()") {

            answer = o.toLowerCase()

        } else if (k0 === "len()" || k0 === "length()") {

            if (Array.isArray(o)) answer = o.length
            else if (typeof o === "string") answer = o.split("").length
            else if (typeof o === "object") answer = Object.keys(o).length

        } else if (k0 === "promise()") {

            async () => {
                var _params = await new Promise((res) => {
                    toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
                })
                toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1], __: [_params, ...__] })
            }

        } else if (k0 === "resolve()") {

            res(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }))

        } else if (k0 === "require()") {

            require(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }))

        } else if (k0 === "new()") {

            var myparams = [], _className = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            args.slice(1).map(arg => {
                myparams.push(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg || "", params }))
            })
            if (_className && typeof (new [_className]()) === "object") answer = new [_className](...myparams)

        } else if (k0 === "today()") {

            answer = new Date()

        } else if (k0 === "todayEnd()") {

            answer = new Date()
            answer.setUTCHours(23, 59, 59, 999)

        } else if (k0 === "timezone()") {

            var _date = new Date()
            var timeZone = Math.abs(_date.getTimezoneOffset()) * 60 * 1000
            return timeZone

        } else if (k0 === "toClock()") { // dd:hh:mm:ss

            /*
            if (args[1]) days_ = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            if (args[2]) hours_ = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[2], __ })
            if (args[3]) mins_ = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[3], __ })
            if (args[4]) secs_ = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[4], __ })
            */
            var _params = toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            if (!_params.timestamp) _params.timestamp = o

            answer = toClock(_params)

        } else if (k0 === "toSimplifiedDateAr()") {

            answer = toSimplifiedDate({ timestamp: o, lang: "ar" })

        } else if (k0 === "toSimplifiedDateTimeAr()") {

            answer = toSimplifiedDate({ timestamp: o, lang: "ar", time: true })

        } else if (k0 === "toSimplifiedDate()" || k0 === "toSimplifiedDateEn()") {

            answer = toSimplifiedDate({ timestamp: o, lang: "en" })

        } else if (k0 === "toSimplifiedDateTime()" || k0 === "toSimplifiedDateTimeEn()") {

            answer = toSimplifiedDate({ timestamp: o, lang: "en", time: true })

        } else if (k0 === "ar()" || k0 === "arabic()") {
            //
            if (Array.isArray(o)) answer = o.map(o => o.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))
            else answer = o.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

        } else if (k0 === "date()" || k0 === "toDate()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            else _o = o

            if (!isNaN(_o) && typeof _o === "string") _o = parseInt(_o)
            answer = new Date(_o)

        } else if (k0 === "toDateFormat()") { // returns date for input

            if (isParam({ _window, string: args[1] })) {

                var _options = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var format = _options.format, day = 0, month = 0, year = 0, hour = 0, sec = 0, min = 0

                if (typeof o === "string") {

                    if (format.split("/").length > 1) {

                        var _date = o.split("/")
                        format.split("/").map((format, i) => {
                            if (format === "dd") day = _date[i]
                            else if (format === "mm") month = _date[i]
                            else if (format === "yyyy") year = _date[i]
                            else if (format === "hh") hour = _date[i]
                            else if (format === "mm") min = _date[i]
                            else if (format === "ss") sec = _date[i]
                        })
                    }

                    return new Date(year, month, day, hour, min, sec)

                } else if (_options.excel && typeof o === "number") {

                    function ExcelDateToJSDate(serial) {

                        var utc_days = Math.floor(serial - 25569)
                        var utc_value = utc_days * 86400
                        var date_info = new Date(utc_value * 1000)

                        var fractional_day = serial - Math.floor(serial) + 0.0000001

                        var total_seconds = Math.floor(86400 * fractional_day)

                        var seconds = total_seconds % 60

                        total_seconds -= seconds

                        var hours = Math.floor(total_seconds / (60 * 60))
                        var minutes = Math.floor(total_seconds / 60) % 60

                        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)
                    }

                    return ExcelDateToJSDate(o)
                }

            } else {

                var format = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ }) || "format1"

                if (!isNaN(o) && typeof o === "string") o = parseInt(o)
                var _date = new Date(o)
                var _year = _date.getFullYear()
                var _month = _date.getMonth() + 1
                var _day = _date.getDate()
                var _dayofWeek = _date.getDay()
                var _hour = _date.getHours()
                var _mins = _date.getMinutes()
                var _daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                var monthsCode = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

                if (format.replace(" ", "") === "format1") return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}${args[1] === "time" ? ` ${_hour.toString().length === 2 ? _hour : `0${_hour}`}:${_mins.toString().length === 2 ? _mins : `0${_mins}`}` : ""}`
                else if (format.replace(" ", "") === "format2") return `${_year.toString()}-${_month.toString().length === 2 ? _month : `0${_month}`}-${_day.toString().length === 2 ? _day : `0${_day}`}`
                else if (format.replace(" ", "") === "format3") return `${_day.toString().length === 2 ? _day : `0${_day}`}${monthsCode[_month - 1]}${_year.toString().slice(2)}`
                else if (format.replace(" ", "") === "format4") return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}${` | ${_hour.toString().length === 2 ? _hour : `0${_hour}`}:${_mins.toString().length === 2 ? _mins : `0${_mins}`}`}`
            }

        } else if (k0 === "toDateInputFormat()" || k0 === "formatDate()") { // returns date for input in a specific format

            var _params = {}
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            } else if (args[1]) {
                _params = { date: toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ }) }
            } else _params = { date: o }

            var format = _params.format || "yyyy-mm-dd"
            var date = new Date(_params.date || o)
            if (!date) return

            var day = 0, month = 0, year = 0, hour = 0, sec = 0, min = 0
            var newDate = ""

            if (format.split("/").length === 3) {

                format.split("/").map((format, i) => {
                    if (i !== 0) newDate += "-"
                    format = format.toLowerCase()
                    if (format === "dd") {
                        day = date.getDate()
                        newDate += day.toString().length === 2 ? day : `0${day}`
                    } else if (format === "mm") {
                        month = date.getMonth() + 1
                        newDate += month.toString().length === 2 ? month : `0${month}`
                    } else if (format === "yyyy") {
                        year = date.getFullYear()
                        newDate += year
                    } else if (format === "hh") {
                        hour = date.getHours() || 0
                        newDate += hour.toString().length === 2 ? hour : `0${hour}`
                    } else if (format === "mm") {
                        min = date.getMinutes() || 0
                        newDate += min.toString().length === 2 ? min : `0${min}`
                    } else if (format === "ss") {
                        sec = date.getSeconds() || 0
                        newDate += sec.toString().length === 2 ? sec : `0${sec}`
                    } else if (format === "hh:mm:ss") {
                        hour = date.getHours() || 0
                        min = date.getMinutes() || 0
                        sec = date.getSeconds() || 0
                        newDate += (hour.toString().length === 2 ? hour : `0${hour}`) + ":" + (min.toString().length === 2 ? min : `0${min}`) + ":" + (sec.toString().length === 2 ? sec : `0${sec}`)
                    } else if (format === "hh:mm") {
                        hour = date.getHours() || 0
                        min = date.getMinutes() || 0
                        newDate += (hour.toString().length === 2 ? hour : `0${hour}`) + ":" + (min.toString().length === 2 ? min : `0${min}`)
                    }
                })

            } else if (format.split("T").length === 2 || format.split("T")[0].split("-").length === 3) {

                var length = format.split("T").length
                format.split("T").map((format, i) => {
                    format.split("-").map((format, i) => {
                        format = format.toLowerCase()
                        if (i !== 0) newDate += "-"
                        if (format === "dd") {
                            day = date.getDate()
                            newDate += day.toString().length === 2 ? day : `0${day}`
                        } else if (format === "mm") {
                            month = date.getMonth() + 1
                            newDate += month.toString().length === 2 ? month : `0${month}`
                        } else if (format === "yyyy") {
                            year = date.getFullYear()
                            newDate += year
                        } else if (format === "hh") {
                            hour = date.getHours() || 0
                            newDate += (hour.toString().length === 2 ? hour : `0${hour}`)
                        } else if (format === "mm") {
                            min = date.getMinutes() || 0
                            newDate += (min.toString().length === 2 ? min : `0${min}`)
                        } else if (format === "ss") {
                            sec = date.getSeconds() || 0
                            newDate += (sec.toString().length === 2 ? sec : `0${sec}`)
                        } else if (format === "hh:mm:ss") {
                            hour = date.getHours() || 0
                            min = date.getMinutes() || 0
                            sec = date.getSeconds() || 0
                            newDate += (hour.toString().length === 2 ? hour : `0${hour}`) + ":" + (min.toString().length === 2 ? min : `0${min}`) + ":" + (sec.toString().length === 2 ? sec : `0${sec}`)
                        } else if (format === "hh:mm") {
                            hour = date.getHours() || 0
                            min = date.getMinutes() || 0
                            newDate += (hour.toString().length === 2 ? hour : `0${hour}`) + ":" + (min.toString().length === 2 ? min : `0${min}`)
                        }
                    })
                    if (length === 2 && i === 0) newDate += "T"
                })

            }/* else {

                if (!isNaN(o) && typeof o === "string") o = parseInt(o)
                var _date = new Date(o)
                var _year = _date.getFullYear()
                var _month = _date.getMonth() + 1
                var _day = _date.getDate()
                var _hour = _date.getHours() || 0
                var _min = _date.getMinutes() || 0
                
                // T${_hour.toString().length === 1 ? `0${_hour}` :_hour}:${_min.toString().length === 1 ? `0${_min}` :_min}
                return `${_year}-${_month.toString().length === 2 ? _month : `0${_month}`}-${_day.toString().length === 2 ? _day : `0${_day}`}`
            }*/

            return newDate

        } else if (k0 === "toUTCString()") {

            if (!isNaN(o) && (parseFloat(o) + "").length === 13) o = new Date(parseFloat(o))
            answer = o.toUTCString()

        } else if (k0 === "getGeoLocation") {

            navigator.geolocation.getCurrentPosition((position) => { console.log(position); global.geolocation = position })

        } else if (k0 === "counter()") {

            var _options = {}
            if (isParam({ _window, string: args[1] })) _options = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else _options = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })

            _options.counter = _options.counter || _options.start || _options.count || 0
            _options.length = _options.length || _options.len || _options.maxLength || 0
            _options.end = _options.end || _options.max || _options.maximum || 999999999999
            //_options.timer = _options.timer || (new Date(_date.setHours(0,0,0,0))).getTime()

            answer = require("./counter").counter({ ..._options })

        } else if (k0 === "time()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1] || "", __ })
            else _o = o

            if (parseInt(_o)) {

                var _1Day = 24 * 60 * 60 * 1000, _1Hr = 60 * 60 * 1000, _1Min = 60 * 1000
                o = parseInt(o)

                var _days = Math.floor(o / _1Day).toString()
                _days = _days.length === 1 ? ("0" + _days) : _days

                var _hrs = Math.floor(o % _1Day, _1Hr).toString()
                _hrs = _hrs.length === 1 ? ("0" + _hrs) : _hrs

                var _mins = Math.floor(o % _1Hr, _1Min).toString()
                _mins = _mins.length === 1 ? ("0" + _mins) : _mins

                answer = _days + ":" + _hrs + ":" + _mins
            }

        } else if (k0 === "setTime()") {

            answer = new Date().setTime(o)

        } else if (k0 === "getTime()" || k0 === "timestamp()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1] || "", __ })
            else _o = o

            if (_o instanceof Date) answer = _o.getTime()
            else if (_o.length === 5 && _o.split(":").length === 2) {

                var _hrs = parseInt(_o.split(":")[0]) * 60 * 60 * 1000
                var _mins = parseInt(_o.split(":")[1]) * 60 * 1000
                answer = _hrs + _mins

            } else if (_o.length === 8 && _o.split(":").length === 3) {

                var _days = parseInt(_o.split(":")[0]) * 24 * 60 * 60 * 1000
                var _hrs = parseInt(_o.split(":")[1]) * 60 * 60 * 1000
                var _mins = parseInt(_o.split(":")[2]) * 60 * 1000
                answer = _days + _hrs + _mins

            } else {

                _o = new Date(_o)
                if (_o.getTime()) return answer = _o.getTime()
                _o = new Date()
                answer = _o.getTime()
            }

        } else if (k0 === "getDateTime()") {

            answer = getDateTime(o)

        } else if (k0 === "getDaysInMonth()") {

            answer = getDaysInMonth(o)

        } else if (k0 === "1MonthLater()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var month = _date.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            answer = new Date(_date.setYear(year)).setMonth(month, _date.getDays())

        } else if (k0 === "2MonthLater()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var month = _date.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(_date.setYear(year)).setMonth(month, _date.getDays())

        } else if (k0 === "3MonthLater()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var month = _date.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(_date.setYear(year)).setMonth(month, _date.getDays())

        } else if (k0 === "1MonthEarlier") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            answer = new Date(_date.setYear(year)).setMonth(month, _date.getDays())

        } else if (k0 === "2MonthEarlier") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(_date.setYear(year)).setMonth(month, _date.getDays())

        } else if (k0 === "3MonthEarlier") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(_date.setYear(year)).setMonth(month, _date.getDays())

        } else if (k0 === "todayStart()" || k0 === "today()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = _date.setHours(_hrs, _min, 0, 0)

        } else if (k0 === "todayEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = _date.setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "monthStart()" || k0 === "month()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(_date.getMonth(), 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "monthEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(_date.getMonth(), getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "nextMonthStart()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "nextMonthEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "2ndNextMonthStart()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = o.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "2ndNextMonthEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() + 1 > 11 ? 1 : _date.getMonth() + 1
            var year = (month === 1 ? _date.getYear() + 1 : _date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "prevMonthStart()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "prevMonthEnd()") {

            var _date
            if (typeof _date.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "2ndPrevMonthStart()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "2ndPrevMonthEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = _date.getMonth() - 1 < 0 ? 11 : _date.getMonth() - 1
            var year = (month === 11 ? _date.getYear() - 1 : _date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "yearStart()" || k0 === "year()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "yearEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "nextYearStart()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "nextYearEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "prevYearStart()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "removeDuplicates()") {

            if (!Array.isArray(o)) return o
            var removeDuplicates = (array) => {
                for (let i = 0; i < array.length; i++) {
                    if (array.filter(el => isEqual(el, array[i])).length > 1) {

                        array.splice(i, 1);
                        removeDuplicates(array);
                        break;
                    }
                }
            }

            removeDuplicates(o);
            return o

        } /*else if (k0 === "duplicate()") {

            var _id = args[1] ? toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }) : o.id
            require("./duplicate").duplicate({ _window, lookupActions, stack, __, id: _id })
            return true

          } */else if (k0 === "stopWatchers()") {

            var _view
            if (args[1]) _view = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            else _view = o
            if (typeof o === "string") o = views[id]

            // clear time out
            Object.entries(o).map(([k, v]) => {

                if (k.includes("-timer")) clearTimeout(v)
            })

        } else if (k0 === "prevYearEnd()") {

            var _date
            if (typeof o.getMonth === 'function') _date = o
            else _date = new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "exist()" || k0 === "exists()") {

            answer = o !== undefined ? true : false

        } /*else if (k0 === "open()") {
            
          var _url
          if (args[1]) _url = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
          else _url = o
          open(_url)
          
        } */else if (k0 === "removeMapping()") {

            if (o.type.slice(0, 1) === "[") {
                var _type = o.type.slice(1).split("]")[0]
                o.type = _type + o.type.split("]").slice(1).join("]")
            }
            answer = o

        } else if (k0 === "files()") {

            if (e) answer = [...e.target.files]

        } else if (k0 === "replace()") { //replace():prev:new

            if (!Array.isArray(o) && typeof o !== "string") {
                o = reducer({ req, res, _window, id, data: path.slice(0, i), value: [], key: true, __, e, object: _object })
            }

            var rec0, rec1

            rec0 = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "", params })
            rec1 = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2] || "", params })

            if (typeof o === "string") {

                if (rec1 !== undefined) answer = o.replace(rec0, rec1)
                else answer = o.replace(rec0)

            } else if (Array.isArray(o)) {

                var _itemIndex = o.findIndex(item => isEqual(item, rec0)), rec2 = rec1 || rec0 // replace():rec0:rec1 || replace():rec0 (if rec0 doesnot exist push it)
                if (_itemIndex >= 0) o[_itemIndex] = rec2
                else o.push(rec2)
                return o
            }

        } else if (k0 === "replaceItem()") {

            if (!Array.isArray(o)) return
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _path = _params.path, _data = _params.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, stack, id, data: _path || [], value, __: [o, ...__], e, object: item }), reducer({ req, res, _window, lookupActions, stack, id, data: _path || [], value, __: [o, ...__], e, object: _data })))
                if (_index >= 0) o[_index] = _data
                else o.push(_data)

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

                if (typeof o[0] === "object" || (typeof o[0] === "undefined" && typeof _data === "object")) {

                    var _index = o.findIndex(item => item.id === _data.id)
                    if (_index >= 0) o[_index] = _data
                    else o.push(_data)

                } else if ((typeof o[0] === "undefined" && typeof _data !== "object") || typeof o[0] === "number" || typeof o[0] === "string") {

                    var _index = o.findIndex(item => item === _data)
                    if (_index < 0) o.push(_data)
                }
            }

        } else if (k0 === "replaceItems()") {

            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _path = _params.path, _data = _params.data.filter(data => data !== undefined && data !== null)
                toArray(_data).map(_data => {

                    var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, stack, id, data: _path || [], value, __: [o, ...__], e, object: item }), reducer({ req, res, _window, lookupActions, stack, id, data: _path || [], value, __: [o, ...__], e, object: _data })))
                    if (_index >= 0) o[_index] = _data
                    else o.push(_data)
                })

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }).filter(data => data !== undefined && data !== null)
                if (typeof o[0] === "object") {

                    toArray(_data).map(_data => {

                        var _index = o.findIndex(item => item.id === _data.id)
                        if (_index >= 0) o[_index] = _data
                        else o.push(_data)
                    })

                } else if (typeof o[0] === "number" || typeof o[0] === "string") {

                    toArray(_data).map(_data => {

                        var _index = o.findIndex(item => item === _data)
                        if (_index >= 0) o[_index] = _data
                        else o.push(_data)
                    })
                }
            }

        } else if (k0 === "findAndReplaceItem()") {

            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _path = _params.path, _data = _params.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, stack, id, data: _path || [], value, __: [o, ...__], e, object: item }), reducer({ req, res, _window, lookupActions, stack, id, data: _path || [], value, __: [o, ...__], e, object: _data })))
                if (_index >= 0) o[_index] = _data

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                var _index = o.findIndex(item => item.id === _data.id)
                if (_index >= 0) o[_index] = _data
            }

        } else if (k0 === "replaceLast()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 1] = _item
                return o
            }

        } else if (k0 === "replaceSecondLast()" || k0 === "replace2ndLast()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 2] = _item
                return o
            }

        } else if (k0 === "replaceFirst()" || k0 === "replace1st()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "", params })
            if (Array.isArray(o)) {

                o[0] = _item
                return o
            }

        } else if (k0 === "replaceSecond()" || k0 === "replace2nd()") {

            var _item = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "", params })
            if (Array.isArray(o)) {

                o[1] = _item
                return o
            }

        } else if (k0 === "import()") {

            // wait address
            var address = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "import()", object, toView, _object, lookupActions, __, id })
            var { address, data } = address

            if (data.type === "json") importJson({ req, res, _window, address, lookupActions, stack, id, e, __ })
            else require(toValue({ req, res, _window, lookupActions, stack, address, id, e, __, data: args[1] }))

            return true

        } else if (k0 === "export()") {

            var data = toParam({ req, res, _window, id, e, __, data: args[1] })
            if (data.json) data.type = "json"
            if (data.type === "json") exportJson(data)

        } else if (k0 === "flat()") {

            if (typeof o === "object") {
                if (Array.isArray(o)) {
                    o = [...o]
                    answer = o.flat()
                } else {
                    //_object = {..._object, ...o}
                    if (typeof _object === "object") {
                        Object.entries(o).map(([key, value]) => _object[key] = value)
                    }
                    return _object
                }
            } else return o

        } else if (k0 === "getDeepChildrenId()") {

            answer = getDeepChildrenId({ _window, id: o.id })

        } else if (k0 === "deep()" || k0 === "deepChildren()") {

            answer = getDeepChildren({ _window, id: o.id })

        } else if (k0.includes("filter()")) {

            var args = k.split(":").slice(1), isnot
            if (!args[0]) isnot = true

            if (isnot) answer = toArray(o).filter(o => o !== "" && o !== undefined && o !== null)
            else args.map(arg => {

                if (k[0] === "_") answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, e, data: arg, id, __: [o, ...__], req, res }))
                else answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, e, data: arg, id, object: o, req, res, __ }))
            })

        } else if (k0.includes("find()")) {


            if (i === lastIndex && key && value !== undefined) {

                var _index
                if (k[0] === "_") _index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
                else _index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object: o }))
                if (_index !== undefined && _index !== -1) o[_index] = answer = value

            } else {

                if (k[0] === "_") answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
                else answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object: o }))
            }

        } else if (k0 === "sort()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            if (!data.data) data.data = o

            // else return o
            data.data = answer = require("./sort").sort({ _window, lookupActions, stack, __, sort: data, id, e })

            return answer

        } else if (k0.includes("findIndex()")) {

            if (typeof o !== "object") return

            if (k[0] === "_") answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
            else answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object: o }))

        } else if (k0 === "_()" || k0 === "__()" || k0 === "()") { // map()

            var notArray = false
            if (args[1] && args[1].charAt(0) === "@" && args[1].length == 6) args[1] = global.__refs__[args[1]].data
            if (typeof o === "object" && !Array.isArray(o)) notArray = true

            if (k0 === "_()") {

                toArray(o).map(o => reducer({ req, res, _window, lookupActions, stack, id, data: args[1] || [], value, __: [o, ...__], e, object, toView }))
                answer = o

            } else if (k0 === "__()") {

                toArray(o).map((o, index) => reducer({ req, res, _window, lookupActions, stack, id, data: args[1] || [], value, __: [o, index, ...__], e, object, toView }))
                answer = o

            } else {
                answer = toArray(o).map(o => reducer({ req, res, _window, lookupActions, stack, id, data: args[1] || [], object: o, value, __, e, toView }))
            }

            if (notArray) return o

        } else if (k0 === "index()") {

            var element = views[o.parent].element
            if (!element) answer = o.mapIndex
            else {
                var children = [...element.children]
                var index = children.findIndex(child => child.id === o.id)
                if (index > -1) answer = index
                else answer = 0
            }

        } else if (k0 === "html2pdf()") {

            window.devicePixelRatio = 2
            var _params = {}, _el, once
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                _el = _params.element || _params.id || _params.view || o

            } else if (args[1]) _el = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else if (o) _el = o

            var opt = {
                margin: [0.1, 0.1],
                filename: _params.name || generate({ length: 20 }),
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, dpi: 300 },
                jsPDF: { unit: 'in', format: _params.size || 'A4', orientation: 'portrait' },
                execludeImages: _params.execludeImages || false
            }

            var _await = "", address = { id: generate(), params: { __ } }
            if (args[2]) {
                _await = global.__refs__[args[2]].data
                address = { id: generate(), asynchronous: true, await: _await, action: "html2pdf()", params: { __ } }
                stack.addresses.unshift(address)
            }

            var pages = _params.pages || [_el], _elements = []
            console.log("here", _params.pages);
            pages.map(page => {

                var _element
                if (typeof page === "object" && page.id) _element = views[page.id].element
                else if (page.nodeType === Node.ELEMENT_NODE) _element = page
                else if (typeof page === "string") _element = views[page].element

                _elements.push(_element)
                var images = [..._element.getElementsByTagName("IMG")]

                if (images.length > 0) {

                    images.map((image, i) => {
                        toDataURL(image.src).then(dataUrl => {

                            image.src = dataUrl
                            if (images.length === i + 1) {

                                if (!once && pages.length > 1 && pages.length === _elements.length) {

                                    once = true
                                    exportHTMLToPDF({ _window, pages: _elements, opt, lookupActions, stack, address, req, res, id, e, __, args })

                                } else if (pages.length === 1) html2pdf().set(opt).from(_element).toPdf().get('pdf').then(pdf => {

                                    var totalPages = pdf.internal.getNumberOfPages()

                                    for (i = 1; i <= totalPages; i++) {

                                        pdf.setPage(i)
                                        pdf.setFontSize(9)
                                        pdf.setTextColor(150)
                                        pdf.text('page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() / 1.1), (pdf.internal.pageSize.getHeight() - 0.08))
                                    }

                                }).save().then((pdf) => {

                                    // await params
                                    if (args[2]) require("./toAwait").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __: [pdf, ...__] })
                                    window.devicePixelRatio = 1
                                })
                            }
                        })
                    })

                } else html2pdf().set(opt).from(_element).save().then((pdf) => {


                    // await params
                    if (args[2]) require("./toAwait").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __: [pdf, ...__] })
                    window.devicePixelRatio = 1
                })
            })

            document.getElementById("loader-container").style.display = "none"
            sleep(10)

        } else if (k0 === "share()") {

            if (isParam({ _window, string: args[1] })) { // share():[text;title;url;files]

                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) || {}, images = []
                _params.files = toArray(_params.file || _params.files) || []
                if (_params.image || _params.images) _params.images = toArray(_params.image || _params.images)

                var getFileFromUrl = async (url, name) => {

                    const response = await fetch(url)
                    const blob = await response.blob()
                    images.push(new File([blob], 'rick.jpg', { type: blob.type }))

                    if (images.length === _params.images.length)
                        await navigator.share({ title: _params.title, text: _params.text, url: _params.url, files: images })
                }

                if (_params.images) _params.images.map(async url => getFileFromUrl(url, _params.title))
                else {
                    console.log(_params);
                    navigator.share(_params)
                }

            } else if (args[1]) { // share():url
                navigator.share({ url: toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) })
            }

        } else if (k0 === "loader()") {

            var _params = {}
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                if (_params.hide) _params.show = false

            } else {

                if (args[1] === "show") _params.show = true
                else if (args[1] === "hide") _params.show = false
            }

            var _o
            if (_params.id) _o = views[_params.id]
            else if (_params.window) _o = views["root"]
            else _o = o

            if (typeof _o !== "object") return
            if (_o.status === "Loading") {
                _o.controls = toArray(_o.controls)
                return _o.controls.push({
                    event: "loaded?" + k
                })
            }

            if (_params.show) {

                var lDiv = document.createElement("div")
                document.body.appendChild(lDiv)
                lDiv.classList.add("loader-container")
                lDiv.setAttribute("id", _o.id + "-loader")
                if (_o.id !== "root") {

                    lDiv.style.position = "absolute"
                    var coords = require("./getCoords")({ id: _o.id || id })
                    lDiv.style.top = coords.top + "px"
                    lDiv.style.bottom = coords.bottom + "px"
                    lDiv.style.height = coords.height + "px"
                    lDiv.style.left = coords.left + "px"
                    lDiv.style.right = coords.right + "px"
                    lDiv.style.width = coords.width + "px"
                }

                var loader = document.createElement("div")
                lDiv.appendChild(loader)
                loader.classList.add("loader")
                lDiv.style.display = "flex"

                if (_params.style) {
                    Object.entries(_params.style).map(([key, value]) => {
                        loader.style[key] = value
                    })
                }

                if (_params.background && _params.background.style) {
                    Object.entries(_params.background.style).map(([key, value]) => {
                        lDiv.style[key] = value
                    })
                }

                return sleep(10)

            } else if (_params.show === false) {

                var lDiv = document.getElementById(_o.id + "-loader")
                if (lDiv) lDiv.parentNode.removeChild(lDiv)
                else console.log("Loader doesnot exist!")
            }

        } else if (k0 === "typeof()" || k0 === "type()") {

            if (args[1]) answer = getType(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }))
            else answer = getType(o)

        } else if (k0 === "coords()") {

            var _id = o.id
            if (args[1]) _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            require("./getCoords")({ id: _id || id })

        } else if (k0 === "function()") {

            answer = (...my_) => {

                if (my_.length === 0) toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], object })
                else if (my_.length === 1) toParam({ req, res, _window, lookupActions, stack, id, e, __: [my_[0], ...__], data: args[1], object })
                else toParam({ req, res, _window, lookupActions, stack, id, e, __: [my_, ...__], data: args[1], object })
            }

        } else if (k0 === "exec()") {

            answer = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], object })

        } else if (k0 === "exportCSV()") {

            var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], object })
            require("./toCSV").toCSV(_params)

        } else if (k0 === "exportExcel()") {

            var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], object })
            require("./toExcel").toExcel(_params)

        } else if (k0 === "exportPdf()") {

            var options = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], object })
            require("./toPdf").toPdf({ options })

        } else if (k0 === "toPrice()" || k0 === "price()") {

            var _price
            if (args[1]) _price = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else _price = o
            answer = parseFloat(_price);//.toLocaleString()
            answer = formatter.format(answer).slice(1)

            /*var realnumbers = answer.toString().split(".")[1]
            if (realnumbers) {
              realnumbers.toString().split
            }
            var afterDigits = (answer.toString().split(".")[1] || []).length
            while (afterDigits < decimalDigits) {
                if (afterDigits === 0) answer += '.'
                answer += '0'
                afterDigits += 1
            }*/

        } else if (k0 === "bool()") {

            answer = typeof o === "boolean" ? o : (o === "true" ? true : o === "false" ? false : undefined)

        } else if (k0 === "num()") {

            answer = toNumber(o)

        } else if (k0 === "isNaN()") {

            answer = isNaN(o)
            // console.log(answer, o);

        } else if (k0 === "round()") {

            if (!isNaN(o)) {
                var nth = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) || 2
                answer = parseFloat(o || 0).toFixed(nth)
            }

        } else if (k0 === "toString()" || k0 === "string()" || k0 === "str()") {

            if (args[1]) {
                var number = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                answer = number + ""
            } else {
                if (typeof o !== "object") answer = o + ""
                else answer = toString(o)
            }

        } else if (k0 === "1stElement()" || k0 === "1stEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[0] = value
            answer = o[0]

        } else if (k0 === "2ndElement()" || k0 === "2ndEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[1] = value
            answer = o[1]

        } else if (k0 === "3rdElement()" || k0 === "3rdEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[2] = value
            answer = o[2]

        } else if (k0 === "3rdLastElement()" || k0 === "3rdLastEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[o.length - 3] = value
            answer = o[o.length - 3]

        } else if (k0 === "2ndLastElement()" || k0 === "2ndLastEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[o.length - 2] = value
            answer = o[o.length - 2]

        } else if (k0 === "lastElement()" || k0 === "lastEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[o.length - 1] = value
            answer = o[o.length - 1]

        } else if (k0 === "lastIndex()") {

            answer = o.length ? o.length - 1 : 0

        } else if (k0 === "2ndLastIndex()") {

            answer = o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

        } else if (k0 === "element()" || k0 === "el()") {

            answer = o.element

        } else if (k0 === "checked()") {

            var _o
            if (typeof o === "string") _o = views[o]
            else if (o.nodeType === Node.ELEMENT_NODE) _o = views[o.id]
            else _o = o

            if (value !== undefined && key) answer = _o.checked.checked = _o.element.checked = value
            else answer = _o.checked.checked || _o.element.checked || false

        } else if (k0 === "check()") {

            breakRequest = true
            var _o
            if (typeof o === "string") _o = views[o]
            else if (o.nodeType === Node.ELEMENT_NODE) _o = views[o.id]
            else _o = o

            answer = _o.checked.checked = _o.element.checked = true

        } else if (k0 === "checker()") {

            breakRequest = true
            var _o
            if (typeof o === "string") _o = views[o]
            else if (o.nodeType === Node.ELEMENT_NODE) _o = views[o.id]
            else _o = o

            if (_o.checked.checked || _o.element.checked) answer = _o.checked.checked = _o.element.checked = false
            else answer = _o.checked.checked = _o.element.checked = true

        } else if (k0 === "parseFloat()") {

            answer = parseFloat(o)

        } else if (k0 === "parseInt()") {

            answer = parseInt(o)

        } else if (k0 === "stringify()") {

            answer = JSON.stringify(o)

        } else if (k0 === "parse()") {

            answer = JSON.parse(o)

        } else if (k0 === "getCookie()") {

            // if (_window) return views.root.controls.push({ event: `loading?${pathJoined}` })

            // getCookie():name
            if (isParam({ _window, string: args[1], req, res })) {

                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                return getCookie({ ..._params, req, res, _window })
            }

            var _name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            var _cookie = getCookie({ name: _name, req, res, _window })
            return _cookie

        } else if (k0 === "eraseCookie()") {

            if (_window) return views.root.controls.push({ event: `loading?${pathJoined}` })

            // getCookie():name
            if (isParam({ _window, req, res, string: args[1] })) {
                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                return eraseCookie({ ..._params, req, res, _window })
            }
            var _name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            var _cookie = eraseCookie({ name: _name, req, res, _window })
            return _cookie

        } else if (k0 === "setCookie()") {

            if (_window) return views.root.controls.push({ event: `loading?${pathJoined}` })

            // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
            var cookies = []
            if (isParam({ _window, req, res, string: args[1] })) {

                args.slice(1).map(arg => {

                    var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: arg })
                    setCookie({ ..._params, req, res, _window })

                    cookies.push(_params)
                })

            } else {

                var _name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _value = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2] })
                var _expiryDate = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[3] })

                setCookie({ name: _name, value: _value, expires: _expiryDate, req, res, _window })
            }


            if (cookies.length === 1) return cookies[0]
            else return cookies

        } else if (path0 === "cookie()") {

            var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            if (_window && params.method === "post" || params.method === "delete") return views.root.controls.push({ event: `loading?${pathJoined}` })
            if (params.method === "post") return setCookie({ ..._params, req, res, _window })
            if (params.method === "delete") return eraseCookie({ ..._params, req, res, _window })
            if (params.method === "get") return getCookie({ ..._params, req, res, _window })

        } else if (k0 === "split()") {

            var splited = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            answer = o.split(splited)

        } else if (k0 === "join()") {

            var joiner = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1] || "", __ })
            answer = o.join(joiner)

        } else if (k0 === "clean()") {

            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")

        } else if (k0 === "colorize()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1] || "", __ })
            answer = colorize({ _window, string: o, ...data })

        } else if (k0 === "route()") {

            if (isParam({ _window, string: args[1] })) {

                var route = toParam({ req, res, _window, id, e, data: args[1] || "", __ })
                require("./route").route({ _window, lookupActions, stack, req, res, id, route, __ })

            } else {

                // route():page:path
                var _page = toValue({ req, res, _window, id, e, data: args[1] || "", __ })
                var _path = toValue({ req, res, _window, id, e, data: args[2] || "", __ })
                require("./route").route({ _window, lookupActions, stack, id, req, res, route: { path: _path, page: _page }, __ })
            }

        } else if (k0 === "toggleView()") {

            var toggle = {}
            if (isParam({ _window, string: args[1] })) {

                toggle = toParam({ req, res, _window, id, e, data: args[1] || "", __ })

            } else toggle = { view: toValue({ req, res, _window, id, e, data: args[1] || "", __ }) }

            require("./toggleView").toggleView({ _window, lookupActions, stack, req, res, toggle, id: o.id, __ })

        } else if (k0 === "deepChildren()") {

            answer = getDeepChildren({ _window, lookupActions, stack, id: o.id })

        } else if (k0 === "view()") {

            var _o
            if (typeof o === "object" && o.type && o.id) _o = o
            else _o = view

            var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            _params.parent = _params.parent || _o.id
            _params.id = _params.id || generate()
            if (!_params.type && _params.text) _params.type = _params.type = "Text"
            views[_params.id] = _params
            var _view = require("./toHTML")({ _window, lookupActions, stack, id: _params.id })
            return _view

        } else if (k0 === "note()") { // note

            if (isParam({ _window, string: args[1] })) {
                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                note({ note: _params })
            } else {
                var text = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
                var type = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2], params })
                note({ note: { text, type } })
            }
            return true

        } else if (k0 === "mininote()") {

            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: _text, params })
            var mininoteControls = toCode({ _window, id, string: `():mininote-text.txt()=${_text};clearTimer():[mininote-timer:()];():mininote.style():[opacity=1;transform=scale(1)];mininote-timer:()=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            toParam({ _window, lookupActions, stack, data: mininoteControls, e, id, req, res, __ })
            return true

        } else if (k0 === "tooltip()") {

            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: _text, params })
            var mininoteControls = toCode({ _window, id, string: `():tooltip-text.txt()=${_text};clearTimer():[tooltip-timer:()];():tooltip.style():[opacity=1;transform=scale(1)];tooltip-timer:()=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            toParam({ _window, lookupActions, stack, data: mininoteControls, e, id, req, res, __ })
            return true

        } else if (k0 === "readonly()") {
          
            if (!o__view__) return
            var children = getDeepChildren({ _window, id: o.id })

            children.map(child => {
                
                child.element.setAttribute("readOnly", true)
                child.readonly = true

                child.element.setAttribute("contenteditable", false)
                child.editable = false
            })

        } else if (k0 === "editable()") {
          
            if (!o__view__) return
            var children = getDeepChildren({ _window, id: o.id })

            children.map(child => {
                
                child.element.setAttribute("readOnly", false)
                child.readonly = false

                child.element.setAttribute("contenteditable", true)
                child.editable = true
            })

        } else if (k0 === "range()") {

            var args = k.split(":").slice(1)
            var _index = 0, _range = []
            var _startIndex = args[1] ? toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[0], params }) : 0 || 0
            var _endIndex = args[1] ? toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params }) : toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[0], params })
            var _steps = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2], params }) || 1
            var _lang = args[3] || ""
            _index = _startIndex
            while (_index <= _endIndex) {
                if ((_index - _startIndex) % _steps === 0) {
                    _range.push(_index)
                    _index += _steps
                }
            }
            if (_lang === "ar") _range = _range.map(num => num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))
            answer = _range

        } else if (k0 === "wait()") {

            var _params = { await: args.join(":"), awaiter: `wait():${args.slice(1).map(() => "nothing").join(":")}` }
            toAwait({ id, e, params: _params, lookupActions })

        } else if (k0 === "update()") {
            
            if (_window) return view.controls.push({
                event: `loaded?${pathJoined}`
            })
            
            var { address } = addresser({ _window, stack, args, asynchronous: true, interpreting: true, requesterID: o.id, action: "update()", object, toView, _object, lookupActions, __, id })
            require("./update").update({ _window, lookupActions, stack, req, res, id: o.id, mainId: id, address, __ })
            
            return true

        } else if (k0 === "updateSelf()") {

            if (_window) return view.controls.push({
                event: `loaded?${pathJoined}`
            })

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "updateSelf()", object, toView, _object, lookupActions, __, id })
            require("./updateSelf").updateSelf({ _window, lookupActions, stack, req, res, id: data.id, address, __ })
            return true

        } else if (k0 === "upload()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "upload()", object, toView, _object, lookupActions, __, id })
            require("./upload")({ _window, lookupActions, stack, req, res, id, e, upload: data, __ })
``
        } else if (k0 === "confirmEmail()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "confirmEmail()", object, toView, _object, lookupActions, __, id })
            data.store = "confirmEmail"
            require("./save").save({ id, lookupActions, stack, address, e, __, save: data })

        } else if (k0 === "insert()") {

            if (!o.__view__) return o

            // wait address
            var { address, data } = addresser({ _window, stack, args, asynchronous: true, interpreting: true, requesterID: o.id, action: "insert()", toView, _object, lookupActions, __, id })

            insert({ id: o.id, insert: data, lookupActions, stack, address, __ })
            return true

        } else if (k0 === "mail()") {

            if (!o.__view__) return o

            // wait address
            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "mail()", object, toView, _object, lookupActions, __, id })

            require("./mail").mail({ req, res, _window, lookupActions, stack, address, id, e, __, data })
            return true

        } else if (k0 === "print()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "print()", object, toView, _object, lookupActions, __, id })

            require("./print").print({ id, options: data, lookupActions, stack, address, id, e, __, req, res })

        } else if (k0 === "read()") {

            var _params = {}
            if (isParam({ _window, string: args[1] }))
                _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else _params.file = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })

            _params.files = (_params.file ? toArray(_params.file) : _params.files) || []

            //_params.files = [..._params.files]
            global.fileReader = []
            var __key = generate()
            global.__COUNTER__ = global.__COUNTER__ || {}
            global.__COUNTER__[__key] = {
                length: _params.files.length,
                count: 0
            };

            ([..._params.files]).map(file => {

                var reader = new FileReader()
                reader.onload = (e) => {

                    global.__COUNTER__[__key].count++;
                    global.fileReader.push({
                        type: file.type,
                        lastModified: file.lastModified,
                        name: file.name,
                        size: file.size,
                        url: e.target.result
                    })

                    if (global.__COUNTER__[__key].count === global.__COUNTER__[__key].length) {

                        global.file = global.fileReader[0]
                        global.files = global.fileReader
                        console.log(global.files, global.file);
                        var my_ = { success: true, data: global.files.length === 1 ? global.files[0] : global.files }
                        toParam({ req, res, _window, lookupActions, stack, id, e, __: [my_, ...__], data: args[2] })
                    }
                }

                try {
                    reader.readAsDataURL(file)
                } catch (er) {
                    document.getElementById("loader-container").style.display = "none"
                }
            })

        } else if (k0 === "search()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "search()", mount, object, toView, _object, lookupActions, __, id })
            
            // print collection with action name
            address.action += " " + data.collection

            require("./search").search({ _window, lookupActions, stack, address, id, e, __, req, res, search: data })
            return true

        } else if (k0 === "erase()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "erase()", mount, object, toView, _object, lookupActions, __, id })
                        
            // print collection with action name
            address.action += " " + data.collection

            require("./erase").erase({ _window, lookupActions, stack, address, id, e, __, req, res, erase: data })
            return true

        } else if (k0 === "save()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, requesterID: o.id, action: "save()", mount, object, toView, _object, lookupActions, __, id })
                        
            // print collection with action name
            address.action += " " + data.collection

            require("./save").save({ _window, lookupActions, stack, address, id, e, __, req, res, save: data })
            return true

        } else if (k0 === "fetch()") {

            

        } else if (k0 === "send()") {
            
            breakRequest = true
            if (!res || res.headersSent) return

            var executionDuration = (new Date()).getTime() - stack.executionStartTime, respond

            if (isParam({ _window, string: args[1] })) {

                respond = toParam({ req, res, _window, lookupActions, id, e, __, data: args[1] })
                respond.success = respond.success !== undefined ? respond.success : true
                respond.message = respond.message || respond.msg || "Action executed successfully!"
                respond.executionDuration = executionDuration
                delete respond.msg

            } else {

                var data = toValue({ req, res, _window, lookupActions, id, e, __, data: args[1] })
                respond = { success: true, message: "Action executed successfully!", data, executionDuration }
            }

            // clear stack
            //stack.terminated = true
            //stack.addresses = []
            
            var log = "SEND " + executionDuration
            stack.logs.push(log)

            console.log(log, respond)
            respond.logs = stack.logs

            res.send(respond)

        } else if (k0 === "sent()") {

            if (!res || res.headersSent) return true
            else return false

        } else if (k0.length === 8 && k0.slice(-2) === "()" && k0.charAt(0) === "@") { // [actions?conditions]():[params]:[stack]


        } else if (k0 === "setPosition()" || k0 === "position()") {

            var position = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            return require("./setPosition").setPosition({ position, id: o.id || id, e })

        } else if (k0 === "refresh()") {

            

        } else if (k0 === "csvToJson()") {

            var file = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            require("./csvToJson").csvToJson({ id, lookupActions, stack, e, file, onload: args[2] || "", __ })

        } else if (k0 === "copyToClipBoard()") {

            var text
            if (args[1]) text = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], params })
            else text = o

            if (navigator.clipboard) answer = navigator.clipboard.writeText(text)
            else {
                var textArea = document.createElement("textarea")
                textArea.value = text
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                textArea.setSelectionRange(0, 99999)
                if (navigator.clipboard) navigator.clipboard.writeText(text)
                else document.execCommand("copy")
                document.body.removeChild(textArea)
            }

        } else if (k0 === "addClass()") {
            if (!o.__view__) return o

            var _class = toValue({ req, res, _window, lookupActions, stack, id, e, __: [o, ...__], data: args[1], params })

            if (o.element) answer = o.element.classList.add(_class)

        } else if (k0 === "removeClass()" || k0 === "remClass()") {
            if (!o.__view__) return o
            
            var _class = toValue({ req, res, _window, lookupActions, stack, id, e, __: [o, ...__], data: args[1], params })

            if (o.element) answer = o.element.classList.remove(_class)

        } else if (k0 === "encodeURI()") {

            answer = encodeURI(o)

        } else if (k0 === "decodeURI()") {

            answer = decodeURI(o)

        } else if (k0.includes("()") && typeof o[k0.slice(0, -2)] === "function") {

            var myparams = []
            args.slice(1).map(arg => {
                myparams.push(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg || "" }))
            })

            answer = o[k0.slice(0, -2)](...myparams)

        } else if (k0.slice(-2) === "()") {
            
            if (k0.charAt(0) === "@" && k0.length == 6) k0 = toValue({ req, res, _window, id, e, __, data: k0, object })

            if (k0.charAt(0) === "_") {
                answer = toAction({ _window, lookupActions, stack, id, req, res, __: [o, ...__], e, path: [k], path0: k0, condition, mount, toView, object })
            } else {
                answer = toAction({ _window, lookupActions, stack, id, req, res, __, e, path: [k], path0: k0, condition, mount, toView, object: object || o })
            }
            
        } else if (k.includes(":@")) {

            breakRequest = true

            // decode
            if (k0.charAt(0) === "@" && k0.length == 6) k0 = global.__refs__["@" + k0.slice(-5)].data
            
            o[k0] = o[k0] || {}
            
            if (toView && events.includes(k0)) {

                if (!o.__view__) return
                
                var data = global.__refs__["@" + args[1].slice(-5)].data
                views[id].controls = toArray(views[id].controls)
                
                return views[id].controls.push({
                    "event": k0 + (o.id !== id ? (":" + o.id) : "") + "?" + data, 
                    __, lookupActions
                })
            }
            
            args[1] = ((global.__refs__["@" + args[1].slice(-5)] || {}).data || "").split(".")
            if (args[1]) answer = reducer({ req, res, _window, lookupActions, stack, id, e, key, data: [...args.slice(1).flat(), ...path.slice(i + 1)], object: o[k0], __ })
            else return

        } else if (key && value !== undefined && i === lastIndex) {

            if (Array.isArray(o)) {
                if (isNaN(k)) {
                    if (o.length === 0) o.push({})
                    o = o[0]
                }
            }

            answer = o[k] = value

        } else if (key && o[k] === undefined && i !== lastIndex) {

            if (!isNaN(path[i + 1]) || (path[i + 1] || "").slice(0, 4) === "_():" || (path[i + 1] || "").slice(0, 3) === "():" || (path[i + 1] || "").includes("find()") || (path[i + 1] || "").includes("filter()")) answer = o[k] = []
            else {

                if (Array.isArray(o)) {
                    if (isNaN(k)) {
                        if (o.length === 0) o.push({})
                        o = o[0]
                    }
                }
                answer = o[k] = {}
            }

        } else {
            
            if (Array.isArray(o)) {
                if (isNaN(k) && o.length === 0) {

                    if (o.length === 0) o.push({})
                    o = o[0]

                } else k = parseFloat(k)
            }

            answer = o[k]
        }

        return answer

    }, _object)
    
    return answer
}

const getDeepChildren = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    var all = [view]
    if (!view) return []

    if (view.__childrenID__ && view.__childrenID__.length > 0)
        view.__childrenID__.map(id => {

            var _view = views[id]
            
            if (_view.__childrenID__ && _view.__childrenID__.length > 0)
                all.push(...getDeepChildren({ _window, id }))

            else all.push(_view)
        })

    return all
}

const getDeepChildrenId = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    var all = [id]
    if (!view) return []

    if (view.__childrenID__ && view.__childrenID__.length > 0)
        view.__childrenID__.map(id => {

            var _view = views[id]

            if (_view.__childrenID__ && _view.__childrenID__.length > 0)
                all.push(...getDeepChildrenId({ _window, id }))

            else all.push(id)
        })

    return all
}

const getDeepParentId = ({ _window, lookupActions, stack, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    if (!view.element.parentNode || view.element.parentNode.nodeName === "BODY") return []

    var parentId = view.element.parentNode.id
    var all = [parentId]

    all.push(...getDeepParentId({ _window, lookupActions, stack, id: parentId }))

    return all
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const exportHTMLToPDF = async ({ _window, pages, opt, lookupActions, stack, address, req, res, id, e, __ }) => {

    const { jsPDF } = jspdf
    const doc = new jsPDF(opt.jsPDF)
    const pageSize = jsPDF.getPageSize(opt.jsPDF)

    if (opt.execludeImages) {

        var promises = []
        pages.map(page => { promises.push(html2pdf().from(page).set(opt).outputImg()) })
        await Promise.all(promises)

        promises.map((pageImage, i) => {
            console.log(i + 1);
            if (i != 0) { doc.addPage() }
            doc.addImage(pageImage._result.src, 'jpeg', 0.1, 0.1, pageSize.width - 0.2, pageSize.height - 0.2);
        })

    } else {

        for (let i = 0; i < pages.length; i++) {

            const page = pages[i]
            const pageImage = await html2pdf().from(page).set(opt).outputImg()
            console.log(i + 1);
            if (i != 0) { doc.addPage() }
            doc.addImage(pageImage.src, 'jpeg', 0.1, 0.1, pageSize.width - 0.2, pageSize.height - 0.2);
        }
    }

    doc.save(opt.filename)

    // await params
    if (args[2]) require("./toAwait").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __ })
}

const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

module.exports = { reducer, getDeepChildren, getDeepChildrenId }