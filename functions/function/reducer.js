const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { isEqual } = require("./isEqual")
const { capitalize } = require("./capitalize")
const { clone } = require("./clone")
const { toNumber } = require("./toNumber")
const { toPrice } = require("./toPrice")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { position } = require("./position")
const { decode } = require("./decode")
const { exportJson } = require("./exportJson")
const { importJson } = require("./importJson")
const { toId } = require("./toId")
const { setCookie, getCookie } = require("./cookie")
const { override } = require("./merge")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")

const reducer = ({ _window, id, path, value, key, params, object, index = 0, _, e, req, res }) => {
    
    const { remove } = require("./remove")
    const { toValue } = require("./toValue")
    const { execute } = require("./execute")

    var local = _window ? _window.value[id] : window.value[id], breakRequest, coded, mainId = id
    var global = _window ? _window.global : window.global

    // ?
    if (path[0]) {
        // if (path.length === 1 && (path[0].toString().indexOf("[") === -1 || path[0].toString().indexOf("]") === -1)) {}
        /* else */ path = toCode({ _window, id, string: toArray(path).join("."), e }).split(".")
    }

    // path[0] = path0:args
    var path0 = path[0] ? path[0].split(":")[0] : ""

    // coded
    if (path0.slice(0, 7) === "coded()" && path.length === 1) {

        coded = true
        return toValue({ req, res, _window, object, id, value: global.codes[path[0]], params, _, e })
    }

    // reload
    if (path0 === "reload()") document.location.reload(true)
    
    // if
    if (path0 === "if()") {
        
        var args = path[0].split(":")
        var approved = toValue({ req, res, _window, id, value: args[1], params, index, _, e })
    
        if (!approved) {
            
            if (path[1] && path[1].includes("else()")) return toValue({ req, res, _window, id, value: path[1].split(":")[1], index, params, _, e })

            if (path[1] && (path[1].includes("elseif()") || path[1].includes("elif()"))) {

                var _path = path.slice(2)
                _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
                var _ds = reducer({ _window, id, value, key, index, path: _path, params, object, params, _, e, req, res })
                return _ds

            } else return 

        } else {

            object = toValue({ req, res, _window, id, value: args[2], params, index, _, e })
            path.shift()
            while (path[0] && (path[0].includes("else()") || path[0].includes("elseif()") || path[0].includes("elif()"))) {
                path.shift()
            }
            path0 = path[0] || ""
        }
    }
    
    // ():id || ():id.once()
    if (path0.slice(0, 2) === "()") {

        var args = path[0].split(":")

        if (args[2]) {
            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, index, _, e, req, res }), _timer)
        }

        var _id = toValue({ req, res, _window, id, e, value: args[1], params, _ })
        if (_id) local = _window ? _window.value[_id] : window.value[_id]

        var _once = path[1] === "once()"
        if (_once) path = path.slice(1)
        else if (_id) id = _id
        
        // path = path.slice(1)
        path[0] = "()"
    }
    
    if (path && (path.includes("equal()") || path.includes("equals()"))) {
        
        var _index = path.findIndex(k => k && (k.includes("equal()") || k.includes("equals()")))
        if (_index !== -1 && _index === path.length - 2) {
            
            key = true
            var args = path[_index].split(":")

            if (path[_index][0] === "_")
            _ = reducer({ req, res, _window, id, path: path.slice(0, _index).join("."), params, object, _, e })

            value = toValue({ req, res, _window, id, _, e, value: args[1], params })
            path = path.slice(0, _index)
        }
    }

    if (path0 === "while()") {
            
        var args = path[0].split(":")
        while (toValue({ req, res, _window, id, value: args[1], params, _, e })) {
            toValue({ req, res, _window, id, value: args[2], params, _, e })
        }
        path = path.slice(1)
    }

    if (path0 === "timer()") {
            
        var args = path[0].split(":")
        var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
        var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
        return object = setTimeout(myFn, _timer)
    }

    if (path0 === "setInterval()") {
            
        var args = path[0].split(":")
        if (path.length === 1) {
            if (params) return params["setInterval()"] = generate()
            return "setInterval()"
        }
        var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, e })
        var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, e }))
        return object = setInterval(myFn, _timer)
    }
    
    if (!object && object !== 0 && object !== false) {

        object = path0 === "()" ? local
        : path0 === "index()" ? index
        : path0 === "global()" ? _window ? _window.global : window.global
        : (path0 === "e()" || path0 === "event()") ? e
        : path0 === "undefined" ? undefined
        : path0 === "false" ? false
        : path0 === "true" ? true
        : path0 === "_" ? _
        : path0 === "params()" ? params
        : path0 === "params" ? params
        : path0 === "document()" ? document
        : path0 === "window()" ? _window || window
        : path0 === "history()" ? history
        : false
        
        if (!object && path[0]) {
            
            if (path0 === "desktop()") return global.device.type === "desktop"
            if (path0 === "tablet()") return global.device.type === "tablet"
            if (path0 === "mobile()" || path0 === "phone()") return global.device.type === "phone"

            if (path0 === "log()") {

                var args = path[0].split(":").slice(1)
                return args.map(arg => {

                    var _log = toValue({ req, res, _window, id, value: arg, params, _, e })
                    console.log(_log)
                })
            }

            if (path0.includes("coded()")) {

                coded = true
                object = toValue({ req, res, _window, object, id, value: global.codes[path0], params, _, e })
            }

            else if (path0 === "getCookie()") {

                // getCookie():name
                var _name, args = path[0].split(":")
                if (args[1]) _name = toValue({ req, res, _window, id, e, _, params, value: args[1] })

                object = getCookie({ name: _name, req, res })
                if (!object) return 
                
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
            else if (path0 === "_array" || path0 === "_list") {

                object = []
                var args = path[0].split(":").slice(1)
                args.map((el, i) => {
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
                
            } else if (path0 === "[{}]") object = [{}]
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
    
    var answer = path.length === 0 ? object : path.reduce((o, k, i) => {
        
        k = k.toString()
        k0 = k.split(":")[0]
        
        // fake lastIndex
        if (lastIndex !== path.length - 1) {
            if (key === true) key = false
            lastIndex = path.length - 1
        }
                    
        // break
        if (breakRequest === true || breakRequest >= i) return o
        
        // equal
        if ((path[i + 1] + "") && ((path[i + 1] + "").includes("equal()") || (path[i + 1] + "").includes("equals()"))) {
            
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
        
        // if():conds:ans.else():ans || if():conds:ans.elseif():conds:ans
        if (k0 === "if()") {
        
            var args = k.split(":")
            var approved = toValue({ req, res, _window, id, value: args[1], params, index, _, e })
        
            if (!approved) {
                
                if (path[i + 1] && path[i + 1].includes("else()")) 
                    return answer = toValue({ req, res, _window, id, value: path[i + 1].split(":")[1], index, params, _, e })
    
                if (path[i + 1] && (path[i + 1].includes("elseif()") || path[i + 1].includes("elseif()"))) {
    
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

        if (k0 === "_quotation" || k0 === "'") {
            
            answer = "'"

        } else if (k0 === "_quotations" || k0 === `"`) {
            
            answer = `"`

        } else if (k0 === "_string" || k0 === "''") {
            
            answer = ""

        } else if (k0 === "_dots" || k0 === "...") {
            
            answer = "..."

        } else if (k0 === "_dot") {
            
            answer = "."

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

        else if (k !== "data()" && k !== "Data()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, id, e, _, value: k, params })
            if (Array.isArray(o)) o.splice(el, 1)
            else delete o[el]
            return
            
        } else if (k === "while()") {
            
            var args = k.split(":")
            while (toValue({ req, res, _window, id, value: args[1], params, _, e })) {
                toValue({ req, res, _window, id, value: args[2], params, _, e })
            }
            
        } else if (k0 === "_()") {

            var args = k.split(":").slice(1)
            args.map(arg => {
                answer = toValue({ req, res, _window, id, e, value: arg, params, _: o })
            })
            
        } else if (k0 === "_") {

            answer = _

        } else if (k0 === "global()") {

            answer = global

        } else if (k0.includes("coded()")) {
            
            var newValue = toValue({ req, res, _window, id, e, value: global.codes[k], params, _ })
            newValue = newValue !== undefined ? [ newValue.toString(), ...path.slice(i + 1)] : path.slice(i + 1)
            answer = reducer({ req, res, _window, id, e, value, key, path: newValue, object: o, params, _ })
            
        } else if (k0 === "data()") {
            
            breakRequest = true
            answer = reducer({ req, res, _window, id, e, value, key, path: [...(o.derivations || []), ...path.slice(i + 1)], object: global[o.Data], params, _ })

            delete local["data()"]

        } else if (k0 === "Data()") {

            answer = global[local.Data]

        } else if (k0 === "removeAttribute()") {

            var args = k.split(":")
            var removed = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.removeAttribute(removed)

        } else if (k0 === "parent()") {

            var _parent, _o

            if (local.status === "Mounted") _parent = o.element.parentNode.id
            else _parent = o.parent
            _parent = _window ? _window.value[_parent] : window.value[_parent]

            if (o.templated || o.link) {
                _parent = _parent.element.parentNode.id
                _parent = _window ? _window.value[_parent] : window.value[_parent]
                _o = _window ? _window.value[_parent] : window.value[_parent]
            }

            answer = _parent
            
        } else if (k0 === "siblings()") {
            
            var _parent = _window ? _window.value[o.element.id] : window.value[o.element.id]
            answer = [..._parent.element.children].map(el => {
                
                var _id = el.id
                if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") {

                    _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
                    return _window ? _window.value[_id] : window.value[_id]

                } else return _window ? _window.value[_id] : window.value[_id]
            })

            answer = answer.filter(_o => _o.id !== o.id)

        } else if (k0 === "next()" || k0 === "nextSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element

            var nextSibling = element.nextSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "nextSiblings()") {

            var nextSiblings = [], nextSibling
            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element

            var nextSibling = element.nextSibling
            while (nextSibling) {
                var _id = nextSibling.id
                nextSiblings.push(_window ? _window.value[_id] : window.value[_id])
                nextSibling = (_window ? _window.value[_id] : window.value[_id]).element.nextSibling
            }
            answer = nextSiblings

        } else if (k0 === "last()" || k0 === "lastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
            var _id = lastSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "2ndlast()" || k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "3rdlast()" || k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var thirdlastSibling = element.parentNode.children[element.parentNode.children.length - 3]
            var _id = thirdlastSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "1st()" || k0 === "first()" || k0 === "firstSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var firstSibling = element.parentNode.children[0]
            var _id = firstSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "2nd()" || k0 === "second()" || k0 === "secondSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.value[o.parent].element : window.value[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "prev()" || k0 === "prevSibling()") {

            var element, _el = o.element
            if (o.templated || o.link) _el = _window ? _window.value[o.parent] : window.value[o.parent]

            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) element = _el
            else if (_el) element = _el.element
            else return
            
            var previousSibling = element.previousSibling
            if (!previousSibling) return
            var _id = previousSibling.id
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "1stChild()") {
            
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[0].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") 
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]
            
        } else if (k0 === "2ndChild()") {
            
            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[1] || o.element.children[0]).id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") 
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "3rdChild()") {

            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[2] || o.element.children[1] || o.element.children[0]).id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "3rdlastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 3].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "2ndlastChild()" || k0 === "2ndLastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 2].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "lastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 1].id
            if ((_window ? _window.value[_id] : window.value[_id]).component === "Input")
            _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = _window ? _window.value[_id] : window.value[_id]

        } else if (k0 === "children()") {
            
            answer = [...o.element.children].map(el => {
                
                var _id = el.id
                if ((_window ? _window.value[_id] : window.value[_id]).component === "Input") {

                    _id = (_window ? _window.value[_id] : window.value[_id]).element.getElementsByTagName("INPUT")[0].id
                    return _window ? _window.value[_id] : window.value[_id]

                } else return _window ? _window.value[_id] : window.value[_id]
            })
            
        } else if (k0 === "style()") {
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.style
            else if (typeof o === "object") answer = o.element.style
            
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

            answer = [...answer].map(o => window.value[o.id])

        } else if (k0 === "getTag()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)[0]
            else answer = o.element && o.element.getElementsByTagName(_tag_name)[0]
            answer = window.value[answer.id]

        } else if (k0 === "getInputs()") {
            
            var _input, _textarea
            if (o.nodeType === Node.ELEMENT_NODE) {
                _input = o.getElementsByTagName("INPUT")
                _textarea = o.getElementsByTagName("TEXTAREA")
            } else {
                _input = o.element && o.element.getElementsByTagName("INPUT")
                _textarea = o.element && o.element.getElementsByTagName("TEXTAREA")
            }
            
            answer = [..._input, ..._textarea].map(o => window.value[o.id])

        } else if (k0 === "getInput()") {
            
            var _value = _window ? _window.value : window.value
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
            var relativeTo = _window ? _window.value["root"].element : window.value["root"].element
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

            answer = answer.map(o => window.value[o.id])

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
            
        } else if (k0 === "clearTimeout()") {
            
            answer = clearTimeout(o)
            
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
            if (_end !== undefined) answer = o.slice(_start, _end)
            else answer = o.slice(_start)
            
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
            answer = _next.isSameNode(o)
            
        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.isSameNode(o)
            
        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o) || _next.isSameNode(o)
            
        } else if (k0 === "contains()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = o.contains(_next)
            
        } else if (k0 === "in()" || k0 === "inside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o)
            
        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.contains(o) && !_next.isSameNode(o)
            
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
                breakRequest = true
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
            
        } else if (k0 === "dividedBy()" || k0 === "divide()" || k0 === "divided()" || k0 === "divideBy()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            
            o = o.toString()
            b = b.toString()

            var isPrice
            if (o.includes(",") || b.includes(",")) isPrice = true

            b = toNumber(b)
            o = toNumber(o)

            answer = o / b
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "times()" || k0 === "multiplyBy()" || k0 === "multiply()" || k0 === "mult()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, e })
            
            o = o.toString()
            b = b.toString()
            
            var isPrice
            if (o.includes(",") || b.includes(",")) isPrice = true
            
            b = toNumber(b)
            o = toNumber(o)

            answer = o * b
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "add()" || k0 === "plus()") {
            
            var args = k.split(":").slice(1)
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                var space = answer.slice(-1) === " " || b.slice(-1) === " "
                
                var isPrice
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = space ? answer + " " + b : answer + b
            })
            if (isPrice) answer = answer.toLocaleString()
            
        } else if (k0 === "subs()" || k0 === "minus()") {
            
            var args = k.split(":").slice(1)
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
            
            answer = o.reduce((o, k) => o + k, 0)

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
            
            var args = k.split(":")
            var _override = toValue({ req, res, _window, id, value: args[1], params, _, e })
            answer = override(o, _override)

        } else if (k0 === "text()" || k0 === "val()") {
            
            var el
            if (o.nodeType === Node.ELEMENT_NODE) el = o
            else if (o.element) el = o.element
            
            if (window.value[el.id].type === "Input") {

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
            var _push = toValue({ req, res, _window, id, value: args[1], params, _ ,e })
            o.push(_push)
            answer = o
            
        } else if (k0 === "pull()") {

            // if no index, it pulls the last element
            var args = k.split(":")
            var _pull = args[1] !== undefined ? toValue({ req, res, _window, id, value: args[1], params, _ ,e }) : o.length - 1
            if (_pull === undefined) return undefined
            o.splice(_pull,1)
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
            o.splice(_index, 0, _value)
            answer = o
            
        } else if (k0 === "remove()") {

            var _id = typeof o === "string" ? o : o.id
            var _value = _window ? _window.value : window.value
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
            
            answer = Object.entries(o).map(([k, v]) => ({ [k]: v }))

        } else if (k0 === "toLowerCase()") {
            
            answer = o.toLowerCase()

        } else if (k0 === "toId()") {
            
            var args = k.split(":")
            var checklist = toValue({ req, res, _window, id, e, _, value: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()") {
            
            answer = generate()

        } else if (k0 === "includes()") {
            
            var args = k.split(":")
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.includes(_include)
            
        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {
            
            var args = k.split(":")
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = !o.includes(_include)
            
        } else if (k0 === "capitalize()") {
            
            answer = capitalize(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()" || k0 === "toUpperCase()") {
            
            answer = o.toUpperCase()
            
        } else if (k0 === "lowercase()" || k0 === "toLowerCase()") {
            
            answer = o.toLowerCase()
            
        } else if (k0 === "length()") {
            
            if (Array.isArray(o)) answer = o.length
            else if (typeof o === "string") answer = o.split("").length
            else if (typeof o === "object") answer = Object.keys(o).length
            
        } else if (k0 === "today()") {
            
            answer = new Date()

        } else if (k0 === "toSimplifiedDateAr()") {
            
            answer = toSimplifiedDate({ timestamp: o, lang: "ar" })

        } else if (k0 === "toSimplifiedDate()" || k0 === "toSimplifiedDateEn()") {
            
            answer = toSimplifiedDate({ timestamp: o, lang: "en" })

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
            
            answer = o.getTime()
            
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
            
            var args = k.split(":")
            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e,  _: o, value: args[1], params }))
            } else {
                var cond = toValue({ req, res, _window, id, e, value: path[1], params, _ })
                if (!cond) answer = o.filter(o => o !== undefined)
                else answer = o.filter(o => o === cond)
            }
            
        } else if (k0.includes("filterById()")) {

            var args = k.split(":")
            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, id, e, _, value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } else if (k0.includes("find()")) {
            
            var args = k.split(":")
            if (k[0] === "_") answer = o.find(o => toValue({ req, res, _window, id, e,  _: o, value: args[1], params }))
            else answer = o.find(o => reducer({ req, res, _window, id, path: [args[1]], value, key, params, index, _, e, object: o }))
            
        } else if (k0.includes("findIndex()")) {

            var args = k.split(":")
            if (k[0] === "_") answer = o.findIndex(o => toValue({ req, res, _window, id, e,  _: o, value: args[1], params }))
            else answer = o.findIndex(o => reducer({ req, res, _window, id, path: [args[1]], value, key, params, index, _, e, object: o }))
            
        } else if (k0.includes("map()")) {
            
            var args = k.split(":").slice(1)
            args.map(arg => {

                if (k[0] === "_") {

                    var _path = global.codes[arg] ? global.codes[arg].split(".") : [arg]
                    answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: _path, value, key, object: o, params, index, _: o, e }) )
            
                } else {

                    var _path = global.codes[arg] ? global.codes[arg].split(".") : [arg]
                    answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: _path, object: o, value, key, params, index, _, e }) )
                }
            })

        } else if (k0 === "index()") {
            
            var element = _window ? _window.value[o.parent].element : window.value[o.parent].element
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
            
            answer = execute({ _window, id, actions: path[i - 1], params, e })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            answer = o = toPrice(toNumber(o))
            
        } else if (k0 === "toBoolean()" || k0 === "boolean()" || k0 === "bool()") {

            answer = true ? o === "true" : false
            
        } else if (k0 === "toNumber()" || k0 === "number()" || k0 === "num()") {

            answer = toNumber(o)
            
        } else if (k0 === "toString()" || k0 === "string()" || k0 === "str()") {
            
            answer = o + ""
            
        } else if (k0 === "1stIndex()" || k0 === "firstIndex()" || k0 === "1stElement()" || k0 === "1stEl()") {
            
            if (value !== undefined && key) answer = o[0] = value
            answer = o[0]
            
        } else if (k0 === "2ndIndex()" || k0 === "secondIndex()" || k0 === "2ndElement()" || k0 === "2ndEl()") {
            
            if (value !== undefined && key) answer = o[1] = value
            answer = o[1]

        } else if (k0 === "3rdIndex()" || k0 === "thirdIndex()" || k0 === "3rdElement()" || k0 === "3rdEl()") {
            
            if (value !== undefined && key) answer = o[2] = value
            answer = o[2]

        } else if (k0 === "3rdLastIndex()" || k0 === "3rdlastIndex()" || k0 === "3rdLastElement()" || k0 === "3rdLastEl()") {

            if (value !== undefined && key) answer = o[o.length - 3] = value
            answer = o[o.length - 3]
            
        } else if (k0 === "2ndLastIndex()" || k0 === "2ndlastIndex()" || k0 === "2ndLastElement()" || k0 === "2ndLastEl()") {

            if (value !== undefined && key) answer = o[o.length - 2] = value
            answer = o[o.length - 2]
            
        } else if (k0 === "lastIndex()" || k0 === "lastElement()" || k0 === "lastEl()") {

            if (value !== undefined && key) answer = o[o.length - 1] = value
            answer = o[o.length - 1]
            
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

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of local element and children elements in object formula
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0 === "addClass()") {
            
            var args = k.split(":")
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.add(_class)
            else answer = o.classList.add(_class)

        } else if (k0 === "removeClass()") {
            
            var args = k.split(":")
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.remove(_class)
            else answer = o.classList.remove(_class)

        } else if (k0 === "element" && local && local.status === "Loading") {

            breakRequest = true
            local.controls = toArray(local.controls) || []
            if (value !== undefined) return local.controls.push({
                event: `loaded?${key}=${value}`
            })
            
        } else if (k0 === "length" && !local.length && i === 0) {
            
            var _parent = _window ? _window.value[local.parent] : window.value[local.parent]
            answer = _parent.element.children.length

        } else if (key && value !== undefined && i === lastIndex) {

            answer = o[k] = value
            if (k0 === "display" && local && local.status === "Element Loaded" && local.element.style.display !== "none" && local.style && (local.style.width === "available-width" || local.style.maxWidth === "available-width")) {
                setTimeout(() => {

                    var _idlistParent = getDeepParentId({ _window, id })
                    var padding = ""

                    _idlistParent.map(id => {

                        var _local = _window ? _window.value[id] : window.value[id]
                        if (_local.element && _local.element.style.padding) {

                            var _padding = _local.element.style.padding.split(" ")
                            if (_padding.length === 1) padding += ` - ${_padding[0]}`
                            else if (_padding.length === 2) padding += ` - ${_padding[1]}`
                            else if (_padding.length === 4) padding += ` - ${_padding[1]}`
                        }
                    })
                        
                    var left = local.element.getBoundingClientRect().left
                    var windowWidth = window.innerWidth
                    var setWidth = (windowWidth - left) + "px"
                    local.element.style.maxWidth = `calc(${setWidth}${padding})`
                }, 0)
            }

        } else if (key && o[k] === undefined && i !== lastIndex) {

            if (!isNaN(path[i + 1])) answer = o[k] = []
            else answer = o[k] = {}

        } else if (k0 === "target" && !o[k] && i === 0) {
    
            answer = o["currentTarget"]
    
        } else answer = o[k]
        
        return answer

    }, object)
    
    return answer
}

const getDeepChildren = ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    var all = [local]
    if (!local) return []
    
    if ([...local.element.children].length > 0) 
    ([...local.element.children]).map(el => {

        var _local = _window ? _window.value[el.id] : window.value[el.id]

        if ([..._local.element.children].length > 0) 
            all.push(...getDeepChildren({ id: el.id }))

        else all.push(_local)
    })

    return all
}

const getDeepChildrenId = ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
    var all = [id]
    if (!local) return []
    
    if ([...local.element.children].length > 0) 
    ([...local.element.children]).map(el => {
        
        var _local = _window ? _window.value[el.id] : window.value[el.id]

        if ([..._local.element.children].length > 0) 
            all.push(...getDeepChildrenId({ id: el.id }))

        else all.push(el.id)
    })

    return all
}

const getDeepParentId = ({ _window, id }) => {

    var local = _window ? _window.value[id] : window.value[id]
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