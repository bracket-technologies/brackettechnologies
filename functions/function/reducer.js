const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { isEqual } = require("./isEqual")
const { capitalize, capitalizeFirst } = require("./capitalize")
const { clone } = require("./clone")
const { toNumber } = require("./toNumber")
const { toPrice } = require("./toPrice")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { decode } = require("./decode")
const { exportJson } = require("./exportJson")
const { importJson } = require("./importJson")
const { toId } = require("./toId")
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")
const { toApproval } = require("./toApproval")
const { toCode } = require("./toCode")

const reducer = ({ _window, id, path, value, key, params, object, index = 0, _, e, req, res, mount }) => {
    
    const { remove } = require("./remove")
    const { toValue, calcSubs } = require("./toValue")
    const { execute } = require("./execute")
    const { toParam } = require("./toParam")

    var local = _window ? _window.children[id] : window.children[id], breakRequest, coded, mainId = id
    var global = _window ? _window.global : window.global

    // path is a string
    if (typeof path === "string") path = path.split(".")
    // path is a number
    if (typeof path === "number") path = [path]

    // ||
    if (path.join(".").includes("||")) {
        var args = path.join(".").split("||")
        var answer
        args.map(value => {
            if (answer === undefined || answer === "") answer = toValue({ _window, value, params, _, id, e, req, res })
        })
        return answer
    }

    if (path.join(".").includes("=") || path.join(".").includes(";")) return toParam({ req, res, _window, id, e, string: path.join("."), _, object, mount })

    // path[0] = path0:args
    var path0 = path[0] ? path[0].toString().split(":")[0] : ""

    // addition
    if (path.join(".").includes("+")) {
  
      var values = path.join(".").split("+").map(value => toValue({ _window, value, params, _, id, e, req, res, object }))
      var answer = values[0]
      values.slice(1).map(val => answer += val)
      return answer
    }

    // subtraction
    if (path.join(".").includes("-")) {
  
        var _value = calcSubs({ _window, value: path.join("."), params, _, id, e, req, res, object })
        if (_value !== path.join(".")) return _value
    }

    // codeds
    if (path0.slice(0, 7) === "coded()" && path.length === 1) {
        
        coded = true
        return toValue({ req, res, _window, object, id, value: global.codes[path[0]], params, _, e })
    }
    
    // if
    if (path0 === "if()") {
        
        var args = path[0].split(":")
        var approved = toApproval({ _window, e, string: args[1], id, _, req, res })
        
        if (!approved) {
            
            if (args[3]) return toValue({ req, res, _window, id, value: args[3], params, index, _, e, object, mount })

            if (path[1] && path[1].includes("else()")) return toValue({ req, res, _window, id, value: path[1].split(":")[1], index, params, _, e, object, mount })

            if (path[1] && (path[1].includes("elseif()") || path[1].includes("elif()"))) {

                var _path = path.slice(2)
                _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
                var _ds = reducer({ _window, id, value, key, index, path: _path, params, object, params, _, e, req, res, mount })
                return _ds

            } else return 

        } else {

            object = toValue({ req, res, _window, id, value: args[2], params, index, _, e, object, mount })
            path.shift()
            while (path[0] && (path[0].includes("else()") || path[0].includes("elseif()") || path[0].includes("elif()"))) {
                path.shift()
            }
            path0 = path[0] || ""
        }
    }
    
    if (path0 === ")(") {

        var args = path[0].split(":")

        if (args[2]) {
            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, index, _, e, req, res }), _timer)
        }

        var state = toValue({ req, res, _window, id, e, value: args[1], params, _, object })
        if (state === undefined) state = args[1]
        if (state) path.splice(1, 0, state)
        path[0] = ")("
    }
    
    // ():id:timer:conditions
    if (path0.slice(0, 2) === "()") {

        var args = path[0].split(":")

        if (args[1] || args[2] || args[3]) {

            // timer
            if (args[2]) {
                var _timer = parseInt(args[2])
                args[2] = ""
                path[0] = args.join(":")
                return setTimeout(() => reducer({ _window, id, path, value, key, params, object, index, _, e, req, res }), _timer)
            }

            // conditions
            if (args[3]) {
                var approved = toApproval({ _window, e, string: args[3], id, _, req, res })
                if (!approved) return
            }

            // id
            var _id = toValue({ req, res, _window, id, e, value: args[1], params, _, object })
            if (_id) local = _window ? _window.children[_id] : window.children[_id]
            
            path[0] = path0 = "()"
        }
    }
/*   
    if (path && (path.includes("equal()") || path.includes("equals()") || path.includes("eq()") || path.includes("=()"))) {
        
        var _index = path.findIndex(k => k && (k.includes("equal()") || k.includes("equals()") || k.includes("eq()") || path.includes("=()")))
        if (_index !== -1 && _index === path.length - 2) {
            
            key = true
            var args = path[_index].split(":")

            if (path[_index][0] === "_")
            _ = reducer({ req, res, _window, id, path: path.slice(0, _index).join("."), params, object, _, e, mount })

            value = toValue({ req, res, _window, id, _, e, value: args[1], params, object, mount })
            path = path.slice(0, _index)
        }
    }
*/
    if (path0 === "while()") {
            
        var args = path[0].split(":")
        while (toValue({ req, res, _window, id, value: args[1], params, _, e, object, mount })) {
            toValue({ req, res, _window, id, value: args[2], params, _, e, object, mount })
        }
        path = path.slice(1)
    }

    // initialize by methods
    if (!object && (path0 === "data()" || path0 === "Data()" || path0 === "style()" || path0 === "getChildrenByClassName()" || path0 === "deepChildren()" || path0 === "children()" || path0 === "1stChild()" || path0 === "lastChild()" || path0 === "2ndChild()" || path0 === "3rdChild()" || path0 === "3rdLastChild()" || path0 === "2ndLastChild()" || path0 === "parent()" || path0 === "next()" || path0 === "text()" || path0 === "val()" || path0 === "txt()" || path0 === "element()" || path0 === "el()" || path0 === "prev()" || path0 === "format()" || path0 === "lastSibling()" || path0 === "1stSibling()" || path0 === "derivations()" || path0 === "mouseenter()" || path0 === "copyToClipBoard()" || path0 === "mininote()" || path0 === "tooltip()" || path0 === "update()" || path0 === "refresh()" || path0 === "save()" || path0 === "override()" || path0 === "click()" || path0 === "is()" || path0 === "setPosition()" || path0 === "gen()" || path0 === "generate()" || path0 === "route()" || path0 === "getInput()" || path0 === "toggleView()" || path0 === "clearTimer()" || path0 === "timer()")) {
        if (path0 === "getChildrenByClassName()") {

            path.unshift("doc()")
            path0 = "doc()"

        } else {
            path.unshift("()")
            path0 = "()"
        }
    }
    
    object = path0 === "()" ? local
    : path0 === "index()" ? index
    : (path0 === "global()" || path0 === ")(")? _window ? _window.global : window.global
    : path0 === "e()" ? e
    : path0 === "_" ? _
    : (path0 === "document()" || path0 === "doc()") ? document
    : (path0 === "window()" || path0 === "win()") ? _window || window
    : path0 === "history()" ? history
    : (path0 === "navigator()" || path0 === "nav()") ? navigator
    : object

    if (path0 === "()" || path0 === "index()" || path0 === "global()" || path0 === ")(" || path0 === "e()" || path0 === "_" || path0 === "document()" || path0 === "doc()" || path0 === "window()" || path0 === "win()" || path0 === "history()") path = path.slice(1)
        
    if (!object && object !== 0 && object !== false) {

        if (path[0]) {

            if (path0 === "undefined") undefined
            else if (path0 === "false") false
            else if (path0 === "true") true
            else if (path0 === "desktop()") return global.device.type === "desktop"
            else if (path0 === "tablet()") return global.device.type === "tablet"
            else if (path0 === "mobile()" || path0 === "phone()") return global.device.type === "phone"

            else if (path0 === "log()") {

                var args = path[0].split(":").slice(1)
                return args.map(arg => {

                    var _log = toValue({ req, res, _window, id, value: arg, params, _, e })
                    console.log(_log)
                })
            }

            else if (path0.slice(0, 7) === "coded()") {

                coded = true
                object = toValue({ req, res, _window, object, id, value: global.codes[path0], params, _, e })
            }

            else if (path0 === "getCookie()") {

                // getCookie():name
                var _name, args = path[0].split(":")
                if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

                object = getCookie({ name: _name, req, res })
                if (!object) return
                
            } else if (path0 === "eraseCookie()") {

                // eraseCookie():name
                var _name, args = path[0].split(":")
                if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

                return eraseCookie({ name: _name })
                
            } else if (path0 === "setCookie()") {
    
                var cname, cvalue, exdays, args = path[0].split(":")
                // setCookie():value:name:expiry-date
                if (args[1]) cvalue = toValue({ req, res, _window, id, e, _, params, value: args[1] })
                else cvalue = o

                if (args[2]) cname = toValue({ req, res, _window, id, e, _, params, value: args[2] })
                if (args[3]) exdays = toValue({ req, res, _window, id, e, _, params, value: args[3] })
    
                return setCookie({ name: cname, value: cvalue, expiry: exdays, req, res })
    
            } else if (path0 === "action()") {

                var args = path[0].split(":")
                var actions = toValue({ req, res, _window, id, value: args[1], params, _, e })
                return execute({ _window, id, actions, params, e })

            }
            
            else if (path0 === "today()") object = new Date()
            else if (path0 === "" || path0 === "_dots") object = "..."
            else if (path0 === "" || path0 === "_string") object = ""
            else if (path0 === "'" || path0 === "_quotation") object = "'"
            else if (path0 === `"` || path0 === "_quotations") object = `"`
            else if (path0 === ` ` || path0 === "_space") object = " "
            else if (path0 === "_number") object = 0
            else if (path0 === "_index") object = index
            else if (path0 === "_boolearn") object = true
            else if (path0 === "_array" || path0 === "_list" || path0 === "_arr") {

                object = []
                var args = path[0].split(":").slice(1)
                args.map(el => {
                    el = toValue({ req, res, _window, id, _, e, value: el, params })
                    object.push(el)
                })
                
            } else if (path0 === "{}" || path0 === "_map" || path0 === "_object") {

                object = {}
                var args = path[0].split(":").slice(1)
                args.map((arg, i) => {

                    if (i % 2) return
                    var f = toValue({ req, res, _window, id, _, e, value: arg, params })
                    var v = toValue({ req, res, _window, id, _, e, value: args[i + 1], params })
                    object[f] = v

                })
                
            } else if (mount) {
                object = local
                path.unshift("()")
            }
        }

        if (object || object === "" || object === 0 || coded) path = path.slice(1)
        else {

            if (path[1] && path[1].includes("()")) {
                
                object = path[0]
                path = path.slice(1)

            } else return decode({ _window, string: path.join(".") })
        }
    }
    
    var lastIndex = path.length - 1, k0
    
    var answer = path.reduce((o, k, i) => {
        
        if (k === undefined) console.log(path)

        k = k.toString()
        k0 = k.split(":")[0]
        var args = k.split(":")
        
        // fake lastIndex
        if (lastIndex !== path.length - 1) {
            if (key === true) key = false
            lastIndex = path.length - 1
        }
                    
        // break
        if (breakRequest === true || breakRequest >= i) return o
        
        // equal
        if ((path[i + 1] + "") && ((path[i + 1] + "").includes("equal()") || (path[i + 1] + "").includes("equals()") || (path[i + 1] + "").includes("=()") || (path[i + 1] + "").includes("eq()"))) {
            
            key = true
            var args = path[i + 1].split(":")
            if (path[i + 1][0] === "_")
                _ = reducer({ req, res, _window, id, path: [k], params, object: o, _, e })
            value = toValue({ req, res, _window, id, _, e, value: args[1], params })
            breakRequest = i + 1
            lastIndex = i
        }
        
        if (k0 === "else()" || k0 === "or()") {
            
            var args = k.split(":").slice(1)
            if (o || o === 0 || o === "") answer = o
            else if (args[0]) {
                args.map(arg => {
                    if (!answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, e })
                })
            }
            return answer
        }
        
        // if():conds:ans.else():ans || if():conds:ans.elif():conds:ans
        if (k0 === "if()") {
        
            var args = k.split(":")
            var approved = toApproval({ req, res, _window, id, value: args[1], params, index, _, e })
        
            if (!approved) {
                
                if (args[3]) return answer = toValue({ req, res, _window, id, value: args[3], params, index, _, e })

                else if (path[i + 1] && path[i + 1].includes("else()")) 
                    return answer = toValue({ req, res, _window, id, value: path[i + 1].split(":")[1], index, params, _, e })
    
                else if (path[i + 1] && (path[i + 1].includes("elseif()") || path[i + 1].includes("elif()"))) {
    
                    breakRequest = i + 1
                    var _path = path.slice(i + 2)
                    _path.unshift(`if():${path[i + 1].split(":").slice(1).join(":")}`)
                    return answer = reducer({ _window, id, path: _path, value, key, params, object: o, index, _, e, req, res })
    
                } else return
    
            } else {
    
                answer = toValue({ req, res, _window, id, value: args[2], params, index, _, e })
                breakRequest = i
                while (path[breakRequest + 1] && (path[breakRequest + 1].includes("else()") || path[breakRequest + 1].includes("elseif()") || path[breakRequest + 1].includes("elif()"))) {
                    breakRequest = breakRequest + 1
                }
            }
        }
        
        if (k === "undefined()" || k === "isundefined()" || k === "isUndefined()") return answer = o === undefined
        
        // isEmpty
        if (k === "isEmpty()") return answer = o === "" ? true : false

        // isnotEmpty
        if (k === "isnotEmpty()") return (answer = o !== "" && typeof o === "string") ? true : false
        
        // notExist
        if (k === "notexist()" || k === "doesnotexist()" || k === "doesnotExist()" || k === "notExist()" || (k === "not()" && (!path[i + 1] || (path[i + 1].includes("()") && !path[i + 1].includes("coded()"))))) 
        return answer = !o ? true : false

        // log
        if (k0.includes("log()")) {

            var args = k.split(":"), __
            if (k0[0] === "_") __ = o
            var _log = toValue({ req, res, _window, id, e, _: __ ? __ : _, value: args[1], params })
            if (_log === undefined) _log = o !== undefined ? o : "here"
            console.log(_log)
            return o
        }

        if (o === undefined) return o

        else if (k0 !== "data()" && k0 !== "Data()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, id, e, _, value: k, params })
            if (Array.isArray(o)) o.splice(el, 1)
            else delete o[el]
            return
            
        } else if (k0 === "while()") {
            
            var args = k.split(":")
            while (toValue({ req, res, _window, id, value: args[1], params, _, e })) {
                toValue({ req, res, _window, id, value: args[2], params, _, e })
            }
            
        } else if (k0 === "_()") {

            var args = k.split(":").slice(1)
            if (args.length > 0)
            args.map(arg => {
                answer = toValue({ req, res, _window, id, e, value: arg, params, _: o })
            })
            else _ = o
            return answer = o
            
        } else if (k0 === "_") {

            if (typeof o === "object") answer = o[_]
            else answer = _

        } else if (k0 === ")(") {

            var _state = k.split(":").slice(1)
            toValue({ req, res, _window, id, value: _state, params, _, e })
            answer = global[_state]

        } else if (k0.slice(0, 7) === "coded()") {
            
            breakRequest = true
            var newValue = toValue({ req, res, _window, id, e, value: global.codes[k], params, _ })
            newValue = newValue !== undefined ? [ ...toArray(newValue), ...path.slice(i + 1)] : path.slice(i + 1)
            answer = reducer({ req, res, _window, id, e, value, key, path: newValue, object: o, params, _ })
            
        } else if (k0 === "data()") {
            
            breakRequest = true
            var args = k.split(":").slice(1)
            args = args.map(arg => toValue({ req, res, _window, id, e, value: arg, params, _ }))
            if (args.length > 0) args = args.flat()
            if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, e })
            answer = reducer({ req, res, _window, id, e, value, key, path: [...(o.derivations || []), ...args, ...path.slice(i + 1)], object: global[o.Data], params, _ })

            delete local["data()"]

        } else if (k0 === "Data()") {

            breakRequest = true
            var args = k.split(":").slice(1)
            args = args.map(arg => toValue({ req, res, _window, id, e, value: arg, params, _ }))
            if (args.length > 0) args = args.flat()
            if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, e })
            answer = reducer({ req, res, _window, id, e, value, key, path: [...args, ...path.slice(i + 1)], object: global[o.Data], params, _ })

        } else if (k0 === "removeAttribute()") {

            var args = k.split(":")
            var removed = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.removeAttribute(removed)

        } else if (k0 === "parent()") {

            var _parent, _o
            
            if (o.status === "Mounted") _parent = o.element.parentNode.id
            else _parent = o.parent
            _parent = _window ? _window.children[_parent] : window.children[_parent]

            if (o.templated || o.link) {
                
                _parent = _parent.element.parentNode.id
                _parent = _window ? _window.children[_parent] : window.children[_parent]
                _parent = _window ? _window.children[_parent] : window.children[_parent]
            }
            
            answer = _parent
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))
            
        } else if (k0 === "siblings()") {
            
            var _parent = _window ? _window.children[o.element.id] : window.children[o.element.id]
            answer = [..._parent.element.children].map(el => {
                
                var _id = el.id
                if ((_window ? _window.children[_id] : window.children[_id]).component === "Input") {

                    _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
                    return _window ? _window.children[_id] : window.children[_id]

                } else return _window ? _window.children[_id] : window.children[_id]
            })

            answer = answer.filter(_o => _o.id !== o.id)

        } else if (k0 === "next()" || k0 === "nextSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            
            var nextSibling = element.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "nextSiblings()") {

            var nextSiblings = [], nextSibling
            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element

            var nextSibling = element.nextElementSibling
            if (!nextSibling) return
            while (nextSibling) {
                var _id = nextSibling.id
                nextSiblings.push(_window ? _window.children[_id] : window.children[_id])
                nextSibling = (_window ? _window.children[_id] : window.children[_id]).element.nextElementSibling
            }
            answer = nextSiblings

        } else if (k0 === "last()" || k0 === "lastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
            var _id = lastSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2ndlast()" || k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "3rdlast()" || k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            var thirdlastSibling = element.parentNode.children[element.parentNode.children.length - 3]
            var _id = thirdlastSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "1st()" || k0 === "first()" || k0 === "firstSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            var firstSibling = element.parentNode.children[0]
            var _id = firstSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2nd()" || k0 === "second()" || k0 === "secondSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "prev()" || k0 === "prevSibling()") {

            var element, _el = o.element
            if (o.templated || o.link) _el = _window ? _window.children[o.parent] : window.children[o.parent]
            
            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) element = _el
            else if (_el) element = _el.element
            else return
            
            var previousSibling = element.previousElementSibling
            if (!previousSibling) return
            var _id = previousSibling.id
            answer = _window ? _window.children[_id] : window.children[_id]
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "1stChild()") {
            
            if (!o.element) return
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[0].id
            if ((_window ? _window.children[_id] : window.children[_id]).component === "Input") 
            _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.children[_id] : window.children[_id]
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2ndChild()") {
            
            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[1] || o.element.children[0]).id
            if ((_window ? _window.children[_id] : window.children[_id]).component === "Input") 
            _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "3rdChild()") {

            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[2] || o.element.children[1] || o.element.children[0]).id
            if ((_window ? _window.children[_id] : window.children[_id]).component === "Input")
            _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "3rdlastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 3].id
            if ((_window ? _window.children[_id] : window.children[_id]).component === "Input")
            _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2ndlastChild()" || k0 === "2ndLastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 2].id
            if ((_window ? _window.children[_id] : window.children[_id]).component === "Input")
            _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "lastChild()") {

            if (!o.element) return
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 1].id
            if ((_window ? _window.children[_id] : window.children[_id]).component === "Input")
            _id = (_window ? _window.children[_id] : window.children[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.children[_id] : window.children[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "children()") {
            
            if (!o.element) return
            answer = [...o.element.children].map(el => {
                
                var _id = el.id, _local = _window ? _window.children[_id] : window.children[_id]
                if (!_local) return
                if (_local.component === "Input") {

                    _id = (_local).element.getElementsByTagName("INPUT")[0].id
                    return _local

                } else return _local
            })
            answer = answer.filter(comp => comp && comp.id)
            
        } else if (k0 === "style()") {
            
            if (o.nodeType && o.nodeType === Node.ELEMENT_NODE) answer = o.style
            else if (typeof o === "object") {
                if (o.element) answer = o.element.style
                else answer = o.style
            }
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))
            
        } else if (k0 === "getTagElements()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)
            else answer = o.element && o.element.getElementsByTagName(_tag_name)

        } else if (k0 === "getTagElement()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)[0]
            else answer = o.element && o.element.getElementsByTagName(_tag_name)[0]

        } else if (k0 === "getTags()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)
            else answer = o.element && o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => window.children[o.id])

        } else if (k0 === "getTag()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)[0]
            else answer = o.element && o.element.getElementsByTagName(_tag_name)[0]
            answer = window.children[answer.id]

        } else if (k0 === "getInputs()" || k0 === "inputs()") {
            
            var _input, _textarea
            if (o.nodeType === Node.ELEMENT_NODE) {
                _input = o.getElementsByTagName("INPUT")
                _textarea = o.getElementsByTagName("TEXTAREA")
            } else {
                _input = o.element && o.element.getElementsByTagName("INPUT")
                _textarea = o.element && o.element.getElementsByTagName("TEXTAREA")
            }
            answer = [..._input, ..._textarea].map(o => window.children[o.id])

        } else if (k0 === "getInput()") {
            
            var _value = _window ? _window.children : window.children
            if (o.nodeType === Node.ELEMENT_NODE) {
                if (_value[o.id].type === "Input") answer = o
                else answer = o.getElementsByTagName("INPUT")[0]
            } else {
                if (o.type === "Input") answer = o
                else answer = o.element && o.element.getElementsByTagName("INPUT")[0]
            }
            answer = _value[answer.id]

        } else if (k0 === "position()") {

            var args = k.split(":")
            var relativeTo = _window ? _window.children["root"].element : window.children["root"].element
            if (args[1]) 
                relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "relativePosition()") {

            var args = k.split(":")
            var relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "getChildrenByClassName()") {

            var args = k.split(":")
            var className = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

            answer = answer.map(o => window.children[o.id])

        } else if (k0 === "getElementsByClassName()") {

            var args = k.split(":")
            var className = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

        } else if (k0 === "getElementsByTagName()") {

            var args = k.split(":")
            var tagName = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (tagName) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByTagName(tagName)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByTagName(tagName)]
            } else answer = []

        } else if (k0 === "toInteger()") {

            answer = Math.round(toNumber(o))

        } else if (k0 === "click()") {

            if (o.nodeType === Node.ELEMENT_NODE) o.click()
            else if (typeof o === "object" && o.element) o.element.click()

        } else if (k0 === "focus()") {

            focus({ id: o.id })

        } else if (k0 === "mouseenter()") {

            var mouseenterEvent = new Event("mouseenter")

            if (o.nodeType === Node.ELEMENT_NODE) o.dispatchEvent(mouseenterEvent)
            else if (typeof o === "object" && o.element) o.element.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            var mouseleaveEvent = new Event("mouseleave")

            if (o.nodeType === Node.ELEMENT_NODE) o.dispatchEvent(mouseleaveEvent)
            else if (typeof o === "object" && o.element) o.element.dispatchEvent(mouseleaveEvent)

        } else if (k0 === "device()") {

            answer = global.device.type

        } else if (k0 === "mobile()" || k0 === "phone()") {

            answer = global.device.type === "phone"

        } else if (k0 === "desktop()") {

            answer = global.device.type === "desktop"

        } else if (k0 === "tablet()") {

            answer = global.device.type === "tablet"

        } else if (k0 === "child()") {

            var args = k.split(":")
            var child = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.child(child)
            
        } else if (k0 === "clearTimeout()" || k0 === "clearTimer()") {
            
            var args = k.split(":")
            var _timer = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = clearTimeout(_timer)
            
        } else if (k0 === "clearInterval()") {
            
            answer = clearInterval(o)
            
        } else if (k0 === "setInterval()") {
            
            var args = k.split(":")
            var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
            var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = setInterval(myFn, _timer)

        } else if (k0 === "timer()" || k0 === "setTimeout()") {
            
            var args = k.split(":")
            var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
            var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = setTimeout(myFn, _timer)

        } else if (k0 === "path()") {

            var args = k.split(":")
            var _path = toValue({ req, res, _window, id, value: args[1], params, _, e })
            if (typeof _path === "string") _path = _path.split(".")
            _path = [..._path, ...path.slice(i + 1)]
            answer = reducer({ req, res, _window, id, path: _path, value, key, params, object: o, _, e })
            
        } else if (k0 === "pop()") {

            o.pop()
            answer = o
            
        } else if (k0 === "shift()") {

            answer = o.shift()

        } else if (k0 === "slice()") {

            // slice():start:end
            var args = k.split(":")
            var _start = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            var _end = toValue({ req, res, _window, id, e, value: args[2], params, _ })
            if (_end !== undefined) answer = o.slice(parseInt(_start), parseInt(_end))
            else answer = o.slice(parseInt(_start))
            
        } else if (k0 === "derivations()") {

            answer = o.derivations

        } else if (k0 === "replaceState()") {

            // replaceState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _ }) || global.data.page[global.currentPage].title
            answer = o.replaceState(null, title, _url)

        } else if (k0 === "pushState()") {

            // pushState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _ }) || global.data.page[global.currentPage].title
            answer = o.pushState(null, title, _url)

        } else if (k0 === "_index") {
            
            answer = index

        } else if (k0 === "format()") {
            
            var args = k.split(":")
            answer = global.codes[args[1]]
           
        } else if (k0 === "_array" || k0 === "_list") {
            
            answer = []
            var args = k.split(":").slice(1)
            args.map(el => {
                el = toValue({ req, res, _window, id, _, e, value: el, params })
                answer.push(el)
            })

        } else if (k0 === "_object" || k0 === "_map" || k0 === "{}") {
            
            answer = {}
            var args = k.split(":").slice(1)
            args.map((el, i) => {

                if (i % 2) return
                var f = toValue({ req, res, _window, id, _, e, value: el, params })
                var v = toValue({ req, res, _window, id, _, e, value: args[i + 1], params })
                answer[f] = v
            })

        } else if (k0 === "_semi" || k0 === ";") {
  
            answer = o + ";"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_quest" || k0 === "?") {
            
            answer = o + "?"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_dot" || k0 === ".") {

            answer = o + "."
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_space" || k0 === " ") {

            answer = o = o + " "
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_equal" || k0 === "=") {
            
            answer = o + "="
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_comma" || k0 === ",") {
            
            answer = o + ","
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "return()") {

            var args = k.split(":")
            answer = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            
        } else if (k0 === "reload()") {

            document.location.reload(true)
            
        } else if (k0 === "isSameNode()" || k0 === "isSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next === o
            
        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next !== o
            
        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o) || _next === o
            
        } else if (k0 === "contains()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = o.contains(_next)
            
        } else if (k0 === "in()" || k0 === "inside()") {
            
            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (typeof o === "string" || Array.isArray(o)) return answer = _next.includes(o)
            else if (typeof o === "object") answer = _next[o] !== undefined
            else if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE) return answer = _next.contains(o)

        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.contains(o) && _next !== o
            
        } else if (k0 === "doesnotContain()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !o.contains(_next)
            
        } else if (k0 === "then()") {

            var args = k.split(":").slice(1)
            
            if (args[0]) {
                args.map(arg => {
                    toValue({ req, res, _window, id: mainId, value: arg, params, _, e })
                })
            }
            
        } else if (k0 === "and()") {
            
            if (!o) {
                answer = false
            } else {
                var args = k.split(":").slice(1)
                if (args[0]) {
                    args.map(arg => {
                        if (answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, e })
                    })
                }
            }
            
        } else if (k0 === "isEqual()" || k0 === "is()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = isEqual(o, b)
            
        } else if (k0 === "greater()" || k0 === "isgreater()" || k0 === "isgreaterthan()" || k0 === "isGreaterThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = parseFloat(o) > parseFloat(b)
            
        } else if (k0 === "less()" || k0 === "isless()" || k0 === "islessthan()" || k0 === "isLessThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = parseFloat(o) < parseFloat(b)
            
        } else if (k0 === "isNot()" || k0 === "isNotEqual()" || k0 === "not()" || k0 === "isnot()") {
            
            var args = k.split(":")
            var isNot = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = !isEqual(o, isNot)
            
        } else if (k0 === "true()" || k0 === "istrue()" || k0 === "isTrue()") {

            answer = o === true

        } else if (k0 === "false()" || k0 === "falsy()" || k0 === "isfalse()" || k0 === "isFalse()") {

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
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "dividedBy()" || k0 === "divide()" || k0 === "divided()" || k0 === "divideBy()" || k0 === "/()") {
            
            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
            
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = answer % b === 0 ? answer / b : answer * 1.0 / b
            })
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "times()" || k0 === "multiplyBy()" || k0 === "multiply()" || k0 === "mult()" || k0 === "x()" || k0 === "*()") {
            
            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = answer * b
            })
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "add()" || k0 === "plus()" || k0 === "+()") {
            
            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
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
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "subs()" || k0 === "minus()" || k0 === "-()") {
            
            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {

                var b = toValue({ req, res, _window, id, value: arg, params, e, _ })
            
                answer = answer.toString()
                b = b.toString()
                
                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)
                
                if (!isNaN(o) && !isNaN(b)) answer = answer - b
                else answer = answer.split(b)[0] - answer.split(b)[1]
            })

            if (isPrice) answer = answer.toLocaleString()

        } else if (k0 === "mod()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            
            o = o === 0 ? o : (o || "")
            b = b === 0 ? b : (b || "")
            o = o.toString()
            b = b.toString()
            
            var isPrice
            if (o.includes(",") || b.includes(",")) isPrice = true
            
            b = toNumber(b)
            o = toNumber(o)

            answer = o % b
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "sum()") {
            
            answer = o.reduce((o, k) => o + toNumber(k), 0)

        } else if (k0 === "src()") {
            
            if (o.element) {

                if (key && value !== undefined) answer = o.element.src = value
                else answer = o.element.src

            } else if (o.nodeType === Node.ELEMENT_NODE) answer = o.src = value

        } else if (k0 === "FileReader()" || k0 === "fileReader()") {
            
            // fileReader():file:function
            var args = k.split(":")
            var _file = toValue({ req, res, _window, id, value: args[1], params, _, e })

            var reader = new FileReader()
            reader.onload = (e) => toValue({ req, res, _window, id, value: args[2], params, _, e })
            reader.readAsDataURL(_file)

        } else if (k0 === "toArray()" || k0 === "arr()") {
            
            answer = toArray(o)

        } else if (k0 === "json") {
            
            answer = o + ".json"

        } else if (k0 === "exists()") {
            
            answer = o !== undefined ? true : false

        } else if (k0 === "clone()") {
            
            answer = clone(o)

        } else if (k0 === "override()") {
            
            var args = k.split(":"), _obj, _o
            if (args[2]) {

                _o = toValue({ req, res, _window, id, value: args[1], params, _, e })
                _obj = toValue({ req, res, _window, id, value: args[2], params, _, e })

            } else {

                _o = o
                _obj = toValue({ req, res, _window, id, value: args[1], params, _, e })
            }

            if (Array.isArray(_o)) {

                if (Array.isArray(_obj)) answer = _o = [..._o, ..._obj]
                else if (typeof _obj === "object") answer = _o = [..._o, ...Object.values(_obj)]

            } else if (typeof _o === "object") {
                
                if (typeof _obj === "object") answer = _o = {..._o, ..._obj}
                else if (Array.isArray(_obj)) {
                    var __obj = {}
                    _obj.map(obj => __obj[obj.id] = obj)
                    answer = _o = {..._o, ...__obj}
                }
            } else answer = _o = _obj

        } else if (k0 === "text()" || k0 === "val()" || k0 === "txt()") {
            
            var el
            if (o.nodeType === Node.ELEMENT_NODE) el = o
            else if (o.element) el = o.element
            
            if (el)
            if (window.children[el.id].type === "Input") {

                answer = el.value
                if (i === lastIndex && key && value !== undefined) el.value = value

            } else {

                answer = el.innerHTML
                if (i === lastIndex && key && value !== undefined) el.innerHTML = value
            }
 
        } else if (k0 === "field()") {
            
            var fields = k.split(":").slice(1)
            fields.map((field, i) => {
                if (i % 2) return
                var f = toValue({ req, res, _window, id, value: field, params, _, e })
                var v = toValue({ req, res, _window, id, value: fields[i + 1], params, _, e })
                o[f] = v
            })
            answer = o
            
        } else if (k0 === "object()" || k0 === "{}") {
            
            answer = {}
            var args = k.split(":")
            if (args[1]) {

                var fv = args.slice(1)
                fv.map((_fv, _i) => {

                    var isValue = _i % 2
                    if (isValue) return

                    var f = toValue({ req, res, _window, id, value: _fv, params, _, e })
                    var v = toValue({ req, res, _window, id, value: fv[_i + 1], params, _, e })
                    answer[f] = v
                })
            }
            
        } else if (k0 === "unshift()") {
            
            o.unshift()
            answer = o
            
        } else if (k0 === "push()") {
            
            var args = k.split(":")
            var _item = toValue({ req, res, _window, id, value: args[1], params, _ ,e })
            var _index = toValue({ req, res, _window, id, value: args[2], params, _ ,e })
            if (_index === undefined) _index = o.length
            o.splice(_index, 0, _item)
            answer = o
            
        } else if (k0 === "pull()") {

            // if no index, it pulls the last element
            var args = k.split(":")
            var _pull = args[1] !== undefined ? toValue({ req, res, _window, id, value: args[1], params, _ ,e }) : o.length - 1
            if (_pull === undefined) return undefined
            o.splice(_pull,1)
            answer = o
            
        } else if (k0 === "pullItems()") {

            var args = k.split(":")
            var _item = toValue({ req, res, _window, id, value: args[1], params, _ ,e })
            answer = o = o.filter(item => item !== _item)
            
        } else if (k0 === "pullItem()") {

            var args = k.split(":")
            var _item = toValue({ req, res, _window, id, value: args[1], params, _ ,e })
            var _index = o.findIndex(item => item === _item)
            o.splice(_index,1)
            answer = o
            
        } else if (k0 === "pullLastElement()" || k0 === "pullLast()") {

            // if no index, it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o
            
        } else if (k0 === "splice()") {

            // push at a specific index / splice():value:index
            var args = k.split(":")
            var _value = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
            var _index = toValue({ req, res, _window, id, value: args[2], params,_ ,e })
            if (_index === undefined) _index = o.length - 1
            o.splice(parseInt(_index), 0, _value)
            answer = o
            
        } else if (k0 === "remove()" || k0 === "rem()") {

            var _id = typeof o === "string" ? o : o.id
            var _value = _window ? _window.children : window.children
            if (!_value[_id]) return console.log("Element doesnot exist!")
            remove({ id: o.id })

        } else if (k0 === "charAt()") {

            var args = k.split(":")
            var _index = toValue({ req, res, _window, e, id, value: args[1], _, params })
            answer = o.charAt(0)

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
            
        } else if (k0 === "entries()") {
            
            answer = Object.entries(o)

        } else if (k0 === "toLowerCase()") {
            
            answer = o.toLowerCase()

        } else if (k0 === "toId()") {
            
            var args = k.split(":")
            var checklist = toValue({ req, res, _window, id, e, _, value: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()" || k0 === "gen()") {
            
            var args = k.split(":")
            var length = toValue({ req, res, _window, id, e, _, value: args[1], params }) || 5
            answer = generate(length)

        } else if (k0 === "includes()" || k0 === "inc()") {
            
            var args = k.split(":")
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.includes(_include)
            
        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {
            
            var args = k.split(":")
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = !o.includes(_include)
            
        } else if (k0 === "capitalize()") {
            
            answer = capitalize(o)
            
        } else if (k0 === "capitalizeFirst()") {
            
            answer = capitalizeFirst(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()" || k0 === "toUpperCase()") {
            
            answer = o.toUpperCase()
            
        } else if (k0 === "lowercase()" || k0 === "toLowerCase()") {
            
            answer = o.toLowerCase()
            
        } else if (k0 === "len()" || k0 === "length()") {
            
            if (Array.isArray(o)) answer = o.length
            else if (typeof o === "string") answer = o.split("").length
            else if (typeof o === "object") answer = Object.keys(o).length
            
        } else if (k0 === "today()") {
            
            answer = new Date()

        } else if (k0 === "toClock()") {
            
            answer = toClock({ timestamp: o })

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
            answer = o.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])

        } else if (k0 === "date()" || k0 === "toDate()") {

            if (!isNaN(o) && typeof o === "string") o = parseInt(o)
            answer = new Date(o)

        } else if (k0 === "toUTCString()") {
            
            if (!isNaN(o) && (parseFloat(o) + "").length === 13) o = new Date(parseFloat(o))
            answer = o.toUTCString()
            
        } else if (k0 === "setTime()") {
            
            answer = new Date().setTime(o)
            
        } else if (k0 === "getTime()" || k0 === "timestamp()") {
            
            if (o instanceof Date) answer = o.getTime()
            else {
                o = new Date(o)
                answer = o.getTime()
            }
            
        } else if (k0 === "getDateTime()") {
            
            answer = getDateTime(o)

        } else if (k0 === "getDaysInMonth()") {
            
            answer = getDaysInMonth(o)

        } else if (k0 === "getDayBeginning()" || k0 === "getDayStart()") {
            
            answer = o.setHours(0,0,0,0)
            
        } else if (k0 === "getDayEnd()" || k0 === "getDayEnding()") {
            
            answer = o.setHours(23,59,59,999)
            
        } else if (k0 === "getNextMonth()" || k0 === "get1MonthLater()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get2ndNextMonth()" || k0 === "get2MonthLater()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get3rdNextMonth()" || k0 === "get3MonthLater()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "getPrevMonth()" || k0 === "get1MonthEarlier") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get2ndPrevMonth()" || k0 === "get2MonthEarlier") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "get3rdPrevMonth()" || k0 === "get3MonthEarlier") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(o.setYear(year)).setMonth(month, o.getDays())

        } else if (k0 === "getMonthBeginning()" || k0 === "getMonthStart()") {
            
            answer = new Date(o.setMonth(o.getMonth(), 1)).setHours(0,0,0,0)

        } else if (k0 === "getMonthEnding()" || k0 === "getMonthEnd()") {
            
            answer = new Date(o.setMonth(o.getMonth(), getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "getNextMonthBeginning()" || k0 === "getNextMonthStart()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)
            
        } else if (k0 === "getNextMonthEnding()" || k0 === "getNextMonthEnd()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "get2ndNextMonthBeginning()" || k0 === "get2ndNextMonthStart()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)

        } else if (k0 === "get2ndNextMonthEnding()" || k0 === "get2ndNextMonthEnd()") {
            
            var month = o.getMonth() + 1 > 11 ? 1 : o.getMonth() + 1
            var year = (month === 1 ? o.getYear() + 1 : o.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "getPrevMonthBeginning()" || k0 === "getPrevMonthStart()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)

        } else if (k0 === "getPrevMonthEnding()" || k0 === "getPrevMonthEnd()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "get2ndPrevMonthBeginning()" || k0 === "get2ndPrevMonthStart()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, 1)).setHours(0,0,0,0)

        } else if (k0 === "get2ndPrevMonthEnding()" || k0 === "get2ndPrevMonthEnd()") {
            
            var month = o.getMonth() - 1 < 0 ? 11 : o.getMonth() - 1
            var year = (month === 11 ? o.getYear() - 1 : o.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(o.setYear(year)).setMonth(month, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "getYearBeginning()" || k0 === "getYearStart()") {
            
            answer = new Date(o.setMonth(0, 1)).setHours(0,0,0,0)

        } else if (k0 === "getYearEnding()" || k0 === "getYearEnd()") {
            
            answer = new Date(o.setMonth(0, getDaysInMonth(o))).setHours(23,59,59,999)

        } else if (k0 === "doesnotHasNestedArray()") {
            
            answer = !hasNestedArray(o) || false

        } else if (k0 === "hasNestedArray()") {
            
            answer = hasNestedArray(o) || false
            
        } else if (k0 === "doesnotHasEmptyField()") {
            
            answer = !hasEmptyField(o) || false
            
        } else if (k0 === "hasEmptyField()") {
            
            answer = hasEmptyField(o) || false
            
        } else if (k0 === "exist()" || k0 === "exists()") {
            
            answer = o !== undefined ? true : false
            
        } else if (k0 === "removeMapping()") {
            
            if (o.type.slice(0, 1) === "[") {
                var _type = o.type.slice(1).split("]")[0]
                o.type = _type + o.type.split("]").slice(1).join("]")
            }
            answer = o
            
        } else if (k0 === "replace()") { // replaces a word in a string
            
            var args = k.split(":") //replace():prev:new
            var rec0 = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var rec1 = toValue({ req, res, _window, id, e, _, value: args[2], params })
            if (rec1) answer = o.replace(rec0, rec1)
            else answer = o.replace(rec0)
            
        } else if (k0 === "importJson()") {
        
            answer = importJson()
        
        } else if (k0 === "exportJson()") {
            
            var args = k.split(":")
            var _name = toValue({ req, res, _window, id, e, _, value: args[1], params })
            exportJson({ data: o, filename: _name})
            
        } else if (k0 === "flat()") {
            
            answer = Array.isArray(o) ? o.flat() : o
            
        } else if (k0 === "deep()" || k0 === "getDeepChildrenId()") {
            
            answer = getDeepChildrenId({ _window, id: o.id })
            
        } else if (k0 === "deepChildren()" || k0 === "getDeepChildren()") {
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0.includes("filter()")) {
            
            var args = k.split(":").slice(1), isnot
            if (!args[0]) isnot = true
            
            if (isnot) answer = toArray(o).filter(o => o !== "" && o !== undefined && o !== null)
            else args.map(arg => {
                
                if (k[0] === "_") answer = toArray(o).filter(o => toApproval({ _window, e, string: arg, id, _: o, req, res }) )
                else answer = toArray(o).filter(o => toApproval({ _window, e, string: arg, id, object: o, req, res, _ }))
            })
            
        } else if (k0.includes("filterById()")) {

            var args = k.split(":")
            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, id, e, _, value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } else if (k0.includes("find()")) {
            
            var arg = k.split(":")[1]
            if (k[0] === "_") answer = toArray(o).find(o => toApproval({ _window, e, string: arg, id, _: o, req, res }) )
            else answer = toArray(o).find(o => toApproval({ _window, e, string: arg, id, _, req, res, object: o }) )
            
        } else if (k0.includes("findIndex()")) {
            
            var arg = k.split(":")[1]
            if (k[0] === "_") answer = o.findIndex(o => toApproval({ _window, e, string: arg, id, _: o, req, res }) )
            else answer = o.findIndex(o => toApproval({ _window, e, string: arg, id, _, req, res, object: o }) )
            
        } else if (k0.includes("map()")) {
            
            var args = k.split(":").slice(1)
            args.map(arg => {

                if (k[0] === "_") answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: arg, value, key, params, index, _: o, e }) )
                else answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: arg, object: o, value, key, params, index, _, e }) )
            })

        } else if (k0 === "index()") {
            
            var element = _window ? _window.children[o.parent].element : window.children[o.parent].element
            if (!element) answer = o.mapIndex
            else { 
                var children = [...element.children]
                var index = children.findIndex(child => child.id === o.id)
                if (index > -1) answer = index
                else answer = 0
            }
            
        } else if (k0 === "typeof()" || k0 === "type()") {

            answer = getType(o)

        } else if (k0 === "action()") {
            
            answer = o.derivations
            
        } else if (k0 === "action()") {
            
            answer = execute({ _window, id, actions: path[i - 1], params, e })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            answer = o = toPrice(toNumber(o))
            
        } else if (k0 === "toBoolean()" || k0 === "boolean()" || k0 === "bool()") {

            answer = true ? o === "true" : false
            
        } else if (k0 === "toNumber()" || k0 === "number()" || k0 === "num()") {

            answer = toNumber(o)
            
        } else if (k0 === "toString()" || k0 === "string()" || k0 === "str()") {
            
            answer = o + ""
            
        } else if (k0 === "1stElement()" || k0 === "1stEl()") {
            
            if (value !== undefined && key) answer = o[0] = value
            answer = o[0]
            
        } else if (k0 === "2ndElement()" || k0 === "2ndEl()") {
            
            if (value !== undefined && key) answer = o[1] = value
            answer = o[1]

        } else if (k0 === "3rdElement()" || k0 === "3rdEl()") {
            
            if (value !== undefined && key) answer = o[2] = value
            answer = o[2]

        } else if (k0 === "3rdLastElement()" || k0 === "3rdLastEl()") {

            if (value !== undefined && key) answer = o[o.length - 3] = value
            answer = o[o.length - 3]
            
        } else if (k0 === "2ndLastElement()" || k0 === "2ndLastEl()") {

            if (value !== undefined && key) answer = o[o.length - 2] = value
            answer = o[o.length - 2]
            
        } else if (k0 === "lastElement()" || k0 === "lastEl()") {

            if (value !== undefined && key) answer = o[o.length - 1] = value
            answer = o[o.length - 1]
            
        } else if (k0 === "lastIndex()") {

            answer = o.length ? o.length - 1 : 0

        } else if (k0 === "2ndLastIndex()") {

            answer = o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

        } else if (k0 === "element()" || k0 === "el()") {
          
            answer = o.element

        } else if (k0 === "()") { // map method
            
            var args = k.split(":").slice(1)
            args.map(arg => answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: arg, object: o, value, key, params, index, _, e }) ))

        } else if (k0 === "parseFloat()") {
            
            answer = parseFloat(o)

        } else if (k0 === "parseInt()") {
            
            answer = parseInt(o)

        } else if (k0 === "stringify()") {
            
            answer = JSON.stringify(o)

        } else if (k0 === "parse()") {
            
            answer = JSON.parse(o)

        } else if (k0 === "getCookie()") {

            var args = k.split(":")
            var cname = toValue({ req, res, _window, id, e, _, params, value: args[1] })
            answer = getCookie({ name: cname, req, res })
        
        } else if (k0 === "eraseCookie()") {

            // eraseCookie():name
            var _name, args = k.split(":")
            if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

            eraseCookie({ name: _name })
            return o
            
        } else if (k0 === "setCookie()") {

            // setCookie:name:expdays
            var args = k.split(":")
            var cvalue = o
            var cname = toValue({ req, res, _window, id, e, _, params, value: args[1] })
            var exdays = toValue({ req, res, _window, id, e, _, params, value: args[2] })

            setCookie({ name: cname, value: cvalue, expiry: exdays })

        } else if (k0 === "split()") {
            
            var args = k.split(":")
            var splited = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = o.split(splited)

        } else if (k0 === "join()") {
            
            var args = k.split(":")
            var joiner = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
            answer = o.join(joiner)

        } else if (k0 === "clean()") {
            
            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")
            
        } else if (k0 === "removeDuplicates()") {
            
            var args = k.split(":")
            var _array = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
            if (!_array) _array = o
            answer = [...new Set(_array)]
            
        } else if (k0 === "route()") {

            // route():page:path
            var args = k.split(":")
            var _page = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
            var _path = toValue({ req, res, _window, id, e, value: args[2] || "", params, _ })
            require("./route").route({ route: { page: _page, path: _path } })

        } else if (k0 === "toggleView()") {
          
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
            var _view = toValue({ req, res, _window, id, e, value: args[2] || "", params, _ })
            var _page = toValue({ req, res, _window, id, e, value: args[3] || "", params, _ })
            var _timer = toValue({ req, res, _window, id, e, value: args[4] || "", params, _ })
            require("./toggleView").toggleView({ _window, toggle: { id: _id, view: _view, page: _page, timer: _timer }, id })

        } else if (k0 === "preventDefault()") {
            
            answer = o.preventDefault()

        } else if (k0 === "isChildOf()") {
            
            var args = k.split(":")
            var el = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            answer = isEqual(el, o)

        } else if (k0 === "isChildOfId()") {
            
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)

        } else if (k0 === "isnotChildOfId()") {
            
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)
            answer = answer ? false : true

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of local element and children elements in object formula
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0 === "mininote()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, value: _text, params })
            var mininoteControls = toCode({ string: `():mininote-text.txt()=${_text};)(:mininote-timer.clearTimer();():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _ })

        } else if (k0 === "tooltip()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, value: _text, params })
            var mininoteControls = toCode({ string: `():tooltip-text.txt()=${_text};)(:tooltip-timer.clearTimer();():tooltip.style():[opacity=1;transform=scale(1)];)(:tooltip-timer=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _ })

        } else if (k0 === "mouseenter()") {
          
            answer = o.mouseenter

        } else if (k0 === "range()") {
          
            var args = k.split(":").slice(1)
            var _index = 0, _range = []
            var _startIndex = toValue({ req, res, _window, id, e, _, value: args[0], params }) || 0
            var _endIndex = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var _steps = toValue({ req, res, _window, id, e, _, value: args[2], params }) || 1
            _index = _startIndex
            while (_index < _endIndex) {
                if ((_index - _startIndex) % _steps === 0) {
                    _range.push(_index)
                    _index += 1
                }
            }
            answer = _range
            console.log(_range);

        } else if (k0 === "update()") {
          
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, _, value: args[1], params }) || id
            return require("./update").update({ id: _id })

        } else if (k0 === "save()") {
          
            var args = k.split(":")
            var _collection = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var _doc = toValue({ req, res, _window, id, e, _, value: args[2], params })
            var _data = toValue({ req, res, _window, id, e, _, value: args[3], params })
            var _save = { collection: _collection, doc: _doc, data: _data }

            return require("./save").save({ id, e, save: _save })

        } else if (k0 === "setPosition()") {
          
            // setPosition():toBePositioned:positioner:placement:align
            var args = k.split(":") 
            var toBePositioned = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var positioner = toValue({ req, res, _window, id, e, _, value: args[2], params }) || id
            var placement = toValue({ req, res, _window, id, e, _, value: args[3], params })
            var align = toValue({ req, res, _window, id, e, _, value: args[4], params })
            var position = { positioner, placement, align }

            return require("./setPosition").setPosition({ position, id: toBePositioned, e })

        } else if (k0 === "refresh()") {
          
            var args = k.split(":")
            var _id = toValue({ req, res, _window, id, e, _, value: args[1], params }) || id
            return require("./refresh").refresh({ id: _id })

        } else if (k0 === "copyToClipBoard()") {
          
            var text = k.split(":")[1]
            text = toValue({ req, res, _window, id, e, _: o, value: text, params })
            if (navigator.clipboard) answer = navigator.clipboard.writeText(text)
            else {
                var textArea = document.createElement("textarea")
                textArea.value = text
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.body.removeChild(textArea)
            }

        } else if (k0 === "addClass()") {
            
            var args = k.split(":")
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.add(_class)
            else answer = o.classList.add(_class)

        } else if (k0 === "removeClass()") {
            
            var args = k.split(":")
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.remove(_class)
            else if(o.nodeType) answer = o.classList.remove(_class)

        } else if (k.includes(":coded()")) {
            
            breakRequest = true
            o[k0] = o[k0] || {}
            answer = reducer({ req, res, _window, id, e, value, key, path: [...args.slice(1), ...path.slice(i + 1)], object: o[k0], params, _ })

        } else if (key && value !== undefined && i === lastIndex) {

            if (k.includes("coded()")) {

                var _key = k.split("coded()")[0]
                k.split("coded()").slice(1).map(code => {
                    _key += toValue({ _window, value: global.codes[`coded()${code.slice(0, 5)}`], params, _, id, e, req, res, object })
                    _key += code.slice(5)
                })
                k = _key
            }
            
            answer = o[k] = value

        } else if (k0 === "target" && !o[k] && i === 0) {
    
            answer = o["currentTarget"]
    
        } else if (k.includes("coded()")) {

            var _key = k.split("coded()")[0]
            k.split("coded()").slice(1).map(code => {
                _key += toValue({ _window, value: global.codes[`coded()${code.slice(0, 5)}`], params, _, id, e, req, res, object })
                _key += code.slice(5)
            })
            k = _key

            if (key && o[k] === undefined && i !== lastIndex) {

                if (!isNaN(path[i + 1])) answer = o[k] = []
                else answer = o[k] = {}
    
            } else answer = o[k]
        
        } else if (key && o[k] === undefined && i !== lastIndex) {

            if (!isNaN(path[i + 1])) answer = o[k] = []
            else answer = o[k] = {}

        } else answer = o[k]
        
        return answer

    }, object)
    
    return answer
}

const getDeepChildren = ({ _window, id }) => {

    var local = _window ? _window.children[id] : window.children[id]
    var all = [local]
    if (!local) return []
    
    if ([...local.element.children].length > 0) 
    ([...local.element.children]).map(el => {

        var _local = _window ? _window.children[el.id] : window.children[el.id]
        
        if ([..._local.element.children].length > 0) 
            all.push(...getDeepChildren({ id: el.id }))

        else all.push(_local)
    })

    return all
}

const getDeepChildrenId = ({ _window, id }) => {

    var local = _window ? _window.children[id] : window.children[id]
    var all = [id]
    if (!local) return []
    
    if ([...local.element.children].length > 0) 
    ([...local.element.children]).map(el => {
        
        var _local = _window ? _window.children[el.id] : window.children[el.id]

        if ([..._local.element.children].length > 0) 
            all.push(...getDeepChildrenId({ id: el.id }))

        else all.push(el.id)
    })

    return all
}

const getDeepParentId = ({ _window, id }) => {

    var local = _window ? _window.children[id] : window.children[id]
    if (!local.element.parentNode || local.element.parentNode.nodeName === "BODY") return []

    var parentId = local.element.parentNode.id
    var all = [parentId]
    
    all.push(...getDeepParentId({ _window, id: parentId }))

    return all
}

const hasNestedArray = (o) => {
    
    var _nested = false
    if (Array.isArray(o)) {

        o.map(o => {

            if (_nested) return
            if (Array.isArray(o)) _nested = true
            else hasNestedArray(o)
        })

    } else if (typeof o === "object") {

        Object.values(o).map(o => hasNestedArray(o))
    }

    return _nested
}

const hasEmptyField = (o) => {
    
    var _hasEmptyField = false
    if (Array.isArray(o)) {

        o.map(o => hasEmptyField(o))

    } else if (typeof o === "object") {

        Object.entries(o).map(([k, o]) => {

            if (_hasEmptyField) return
            if (k === "") _hasEmptyField = true
            else hasEmptyField(o)
        })
    }
    
    return _hasEmptyField
}

module.exports = { reducer, getDeepChildren, getDeepChildrenId }