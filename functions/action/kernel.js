const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { isEqual } = require("./isEqual")
const { capitalizeFirst, capitalize } = require("./capitalize")
const { clone } = require("./clone")
const { toNumber } = require("./toNumber")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { exportJson } = require("./exportJson")
const { importFile } = require("./importJson")
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")
const { note } = require("./note")
const { isParam } = require("./isParam")
const { lengthConverter } = require("./resize")
const { qr } = require("./qr")
const { replaceNbsps } = require("./replaceNbsps")
const { addresser } = require("./addresser")
const { vcard } = require("./vcard")
const { lineInterpreter } = require("./lineInterpreter")
const { colorize } = require("./colorize")
const { override } = require("./merge")
const { nthParent, nthNext, nthPrev } = require("./getView")
const { remove } = require("./remove")
const events = require("./events.json")
const { decode } = require("./decode")
const { toAwait } = require("./toAwait")
const { operatorToText } = require("./operatorToText")

const kernel = ({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, toView, data: { _object, path, pathJoined, value, key, object } }) => {

    const { toValue, isNumber } = require("./toValue")
    const { toParam } = require("./toParam")
    const { toAction } = require("./toAction")
    const { toApproval } = require("./toApproval")
    const { reducer } = require("./reducer")

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]

    var pathJoined = pathJoined || path.join("."), breakRequest
    
    // no path but there is value
    if (path.length === 0 && key && value !== undefined) return _object = value

    var answer = path.reduce((o, k, i) => {

        var lastIndex = path.length - 1

        if (k === undefined) return //console.log(view, id, path)

        k = k.toString()
        var k0 = k.split(":")[0]
        var args = k.split(":")

        // get underscores
        var underScored = 0
        while (k0.charAt(0) === "_") {
            underScored += 1
            k0 = k0.slice(1)
            k = k.slice(1)
        }

        if (underScored && k0 && !k0.includes("()")) {
            while (underScored > 0) {
                k0 = "_" + k0
                k = "_" + k
                underScored -= 1
            }
        }

        // break
        if (breakRequest === true || breakRequest >= i) return o

        if ((o === undefined || o === null) && k0 !== "push()" && k0 !== "replace()") return o

        if (k0 === "log()") { // log
            
            var logs = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, stack, id, e, __: underScored ? [o, ...__] : __, data: arg, object: underScored ? object : (o.__view__ && o.id !== id && o || undefined) }))
            if (args.slice(1).length === 0 && pathJoined !== "log()") logs = [o]
            
            console.log("LOG", decode({ _window, string: pathJoined }), ...logs)
            stack.logs.push(stack.logs.length + " LOG " + logs.join(" "))

            return o
        } else if (k0 !== "data()" && k0 !== "doc()" && path[i + 1] === "del()") {

            breakRequest = i + 1
            if (k.charAt(0) === "@" && k.length === 6) k = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: k, object })

            if (Array.isArray(o)) {
                if (!isNumber(k)) {
                    if (o[0] && o[0][k]) {
                        delete o[0][k]
                        return o
                    } else return o
                }
                o.splice(k, 1)
            } else delete o[k]

            return o

        } else if (k0 === "while()") {

            while (toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })) {
                toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e })
            }

        } else if (underScored && !k0) { // _
            
            if (o.__view__) {

                if (value !== undefined && key && i === lastIndex) answer = o.__[underScored - 1] = value
                else answer = o.__[underScored - 1]

            } else {

                var underscores = ""
                while (underScored > 0) {
                    underscores += "_"
                    underScored -= 1
                }

                if (value !== undefined && key && i === lastIndex) answer = o[underscores] = value
                else answer = o[underscores]
            }

        } else if (k.charAt(0) === "@" && k.length === 6) { // k not k0

            var data
            if (k0.charAt(0) === "@" && global.__refs__[k0].type === "text") data = global.__refs__[k0].data
            else data = toValue({ req, res, _window, lookupActions, stack, id, e, data: global.__refs__[k0].data, __, object })

            if (typeof data !== "object") {

                if (Array.isArray(o) && isNumber(data) && data < 0) { // negative index

                    var item = o[o.length + data]

                    if (i === lastIndex && key && value !== undefined) {
                        o.splice(o.length + data, 1, value)
                        answer = value
                    } else answer = item

                } else if (i === lastIndex && key && value !== undefined) answer = o[data] = value
                else if (i !== lastIndex && key && value !== undefined && o[data] === undefined) {

                    if (isNumber(toValue({ req, res, _window, lookupActions, stack, id, data: path[i + 1], __, e, object }))) answer = o[data] = []
                    else answer = o[data] = {}
                }
                else answer = o[data]
            } else answer = data

        } else if (k0 === "data()") {

            if (!o.__view__) return

            breakRequest = true

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "" })

            if (data.path) return answer = kernel({ req, res, _window, lookupActions, stack, id, e, data: { _object: data.data || global[data.doc || o.doc], value, key, path: data.path, object }, __ })

            if (!o.doc) return

            answer = kernel({ req, res, _window, lookupActions, stack, id, data: { path: [...o.__dataPath__, ...path.slice(i + 1)], object, _object: global[o.doc], value, key }, __, e })

        } else if (k0 === "doc()") {

            breakRequest = true
            var doc = o.__view__ ? o.doc : views[id].doc

            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    args[1] = data.path || data.__dataPath__ || []
                    if (typeof args[1] === "string") args[1] = args[1].split(".")

                    return answer = reducer({ req, res, _window, lookupActions, stack, id, e, data: { value, key, path: [`${doc}:()`, ...args[1], ...path.slice(i + 1)], object }, __ })
                }

                if (args[1].charAt(0) === "@") args[1] = global.__refs__[args[1]].data
                args[1] = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
                if (typeof args[1] === "string") args[1] = args[1].split(".")

                return answer = reducer({ req, res, _window, lookupActions, stack, id, e, data: { value, key, path: [`${doc}:()`, ...args[1], ...path.slice(i + 1)], object }, __ })
            }

            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].charAt(0) === "@") path[i + 1] = toValue({ req, res, _window, lookupActions, stack, id, data: global.__refs__[path[i + 1]].data, __, e })
                answer = reducer({ req, res, _window, lookupActions, stack, id, e, data: { value, key, path: [`${doc}:()`, ...path.slice(i + 1)], object }, __ })

            } else if (key && value !== undefined) {
                answer = global[doc] = value
            } else answer = global[doc]

        } else if (k0 === "parent()") {

            return nthParent({ _window, nth: 1, o })

        } else if (k0 === "2ndParent()") {
    
            return nthParent({ _window, nth: 2, o })

        } else if (k0 === "3rdParent()") {
            
            return nthParent({ _window, nth: 3, o })
            
        } else if (k0 === "nthParent()") {

            if (!o.__view__) return
            var nth = toValue({ _window, id, e, lookupActions, stack, __, data: args[1] })
            return nthParent({ _window, nth, o })

        } else if (k0 === "prevSiblings()") {
            
            if (!o.__view__) return o
            return views[o.__parent__].__childrenRef__.slice(0, o.__index__ + 1).map(({ id }) => views[id])

        } else if (k0 === "nextSiblings()") {
            
            if (!o.__view__) return o
            return views[o.__parent__].__childrenRef__.slice(o.__index__ + 1).map(({ id }) => views[id])

        } else if (k0 === "siblings()") {
            
            if (!o.__view__) return o
            var children = clone(views[o.__parent__].__childrenRef__)
            children.splice(o.__index__, 1)
            return children.map(({ id }) => views[id])

        } else if (k0 === "next()") {

            return nthNext({ _window, nth: 1, o })

        } else if (k0 === "2ndNext()") {

            return nthNext({ _window, nth: 2, o })

        } else if (k0 === "3rdNext()") {

            return nthNext({ _window, nth: 3, o })

        } else if (k0 === "nthNext()") {

            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id, lookupActions, stack })
            return nthNext({ _window, nth, o })

        } else if (k0 === "last()") {
            
            if (!o.__view__) return
            return views[views[o.__parent__].__childrenRef__.slice(-1)[0].id]

        } else if (k0 === "2ndLast()") {
            
            if (!o.__view__) return
            return views[views[o.__parent__].__childrenRef__.slice(-2)[0].id]

        } else if (k0 === "3rdLast()") {
            
            if (!o.__view__) return
            return views[views[o.__parent__].__childrenRef__.slice(-3)[0].id]

        } else if (k0 === "nthLast()") {

            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id, lookupActions, stack })
            if (!isNumber(nth)) return
            return views[views[o.__parent__].__childrenRef__.slice(-1 * nth)[0].id]

        } else if (k0 === "1stSibling()") {
            
            if (!o.__view__) return o
            return views[views[o.__parent__].__childrenRef__[0].id]

        } else if (k0 === "2ndSibling()") {
            
            if (!o.__view__) return o
            return views[views[o.__parent__].__childrenRef__[1].id]

        } else if (k0 === "3rdSibling()") {
            
            if (!o.__view__) return o
            return views[views[o.__parent__].__childrenRef__[2].id]

        } else if (k0 === "nthSibling()") {
            
            if (!o.__view__) return o
            var nth = toValue({ _window, id, e, __, value: args[1], lookupActions, stack })
            return views[views[o.__parent__].__childrenRef__[nth - 1].id]

        } else if (k0 === "grandChild()") {
              
            if (!o.__view__) return
            return views[views[o.__childrenRef__[0].id].__childrenRef__[0].id]
            
        } else if (k0 === "grandChildren()") {
              
            if (!o.__view__) return
            return views[o.__childrenRef__[0].id].__childrenRef__.map(({ id }) => views[id])
          
        } else if (k0 === "prev()") {

            return nthPrev({ _window, nth: 1, o })

        } else if (k0 === "2ndPrev()") {

            return nthPrev({ _window, nth: 2, o })

        } else if (k0 === "3rdPrev()") {

            return nthPrev({ _window, nth: 3, o })

        } else if (k0 === "nthPrev()") {

            if (!o.__view__) return
            var nth = toValue({ _window, id, e, __, value: args[1], lookupActions, stack })
            return nthPrev({ _window, nth, o })

        } else if (k0 === "1stChild()" || k0 === "child()") {
            
            if (!o.__view__ || !o.__childrenRef__[0]) return
            return views[o.__childrenRef__[0].id]

        } else if (k0 === "2ndChild()") {
            
            if (!o.__view__ || !o.__childrenRef__[1]) return
            return views[o.__childrenRef__[1].id]

        } else if (k0 === "3rdChild()") {
            
            if (!o.__view__ || !o.__childrenRef__[2]) return
            return views[o.__childrenRef__[2].id]

        } else if (k0 === "nthChild()") {

            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id, stack, lookupActions })
            if (!isNumber(nth)) return
            if (!o.__childrenRef__[nth - 1]) return
            return views[o.__childrenRef__[nth - 1].id]

        } else if (k0 === "3rdLastChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenRef__.slice(-3)[0].id]

        } else if (k0 === "2ndLastChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenRef__.slice(-2)[0].id]

        } else if (k0 === "lastChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenRef__.slice(-1)[0].id]

        } else if (k0 === "nthLastChild()") {
            
            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id })
            if (!isNumber(nth)) return
            return views[o.__childrenRef__.slice(-1 * nth)[0].id]

        } else if (k0 === "children()") {
            
            if (!o.__view__) return
            return o.__childrenRef__.map(({ id }) => views[id])

        } else if (k0 === "lastEl()") {
            return o[o.length - 1]
        } else if (k0 === "2ndLastEl()") {
            return o[o.length - 2]
        } else if (k0 === "3rdLastEl()") {
            return o[o.length - 3]
        } else if (k0 === "nthLastEl()") {
            var nth = toValue({ _window, __, value: args[1], e, id, lookupActions, stack })
            return o[o.length - nth]
        } else if (k0 === "name()") {

            var name = toValue({ _window, id, e, object, value: args[1], __ })
            if (name === o.__name__) return o
            var children = getDeepChildren({ _window, id: o.id })
            return children.find(view => view.__name__ === name)

        } else if (k0 === "names()") {

            var name = toValue({ _window, id, e, object, value: args[1], __ })
            var children = getDeepChildren({ _window, id: o.id })
            return children.filter(view => view.__name__ === name)

        } else if (k0 === "display()") {

            if (!o.__view__) return
            o.__element__.style.display = "flex"

        } else if (k0 === "hide()") {
            
            if (!o.__view__) return
            o.__element__.style.display = "none"

        } else if (k0 === "style()") {

            if (!o.__view__) return
            if (!args[1]) {
                if (!o.__element__) return o.style
                return o.__element__.style
            }

            var styles = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            if (Object.keys(styles).length > 0) {

                var obj = o.__element__ ? o.__element__ : o
                if (obj.__view__) obj.style = obj.style || {}
                
                Object.entries(styles).map(([key, value]) => {
                    obj.style[key] = value
                })
            }

        } else if (k0 === "qr()") {

            // wait address
            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, action: "qr()", object, toView, _object, lookupActions, __, id })

            qr({ _window, id, req, res, data, e, __, stack, address, lookupActions })

        } else if (k0 === "contact()") {

            var data = toValue({ req, res, _window, id, e, __, data: args[1] })
            if (typeof data !== "obejct") return o

            vcard({ _window, id, req, res, data, e, __ })

        } else if (k0 === "bracket()") {

            if (typeof o === "object") answer = require("./jsonToBracket").jsonToBracket(o)

        } else if (k0 === "inputs()") {

            if (!o.__view__) return
            var inputs = [], textareas = [], editables = []

            inputs = o.__element__.getElementsByTagName("INPUT")
            textareas = o.__element__.getElementsByTagName("TEXTAREA")
            editables = getDeepChildren({ _window, lookupActions, stack, id: o.id }).filter(view => view.editable)
            if (o.editable) editables.push(o)

            answer = [...inputs, ...textareas, ...editables].map(o => views[o.id])

        } else if (k0 === "input()") {

            if (!o.__view__) return
            var inputs = [], textareas = [], editables = []

            inputs = o.__element__.getElementsByTagName("INPUT")
            textareas = o.__element__.getElementsByTagName("TEXTAREA")
            editables = getDeepChildren({ _window, lookupActions, stack, id: o.id }).filter(view => view.editable)
            if (o.editable) editables.push(o)
            
            if ([...inputs, ...textareas, ...editables].length === 0) return
            answer = views[[...inputs, ...textareas, ...editables][0].id]

        } else if (k0 === "px()") {

            if (args[1]) return lengthConverter(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }))
            return lengthConverter(o)

        } else if (k0 === "touchable()") {

            if (_window) return global.manifest.device.device.type === "smartphone"
            else return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))

        } else if (k0 === "className()") {

            if (!o.__view__) return
            var className = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            answer = [...o.__element__.getElementsByClassName(className)]
            answer = answer.map(o => window.views[o.id])

        } else if (k0 === "classList()") {

            if (!o.__view__) return
            answer = [...o.__element__.classList]

        } else if (k0 === "toInt()") {
            
            if (!isNumber(o)) return
            var integer = o
            answer = Math.round(toNumber(integer))

        } else if (k0 === "clicked()") {

            return global.__clicked__

        } else if (k0 === "click()") {
 
            if (!o.__view__) return

            if (_window) return view.__controls__.push({
                event: `loaded?${pathJoined}`
            })

            o.__element__.click()

        } else if (k0 === "focus()") {

            if (!o.__view__) return

            if (_window) return view.__controls__.push({
                event: `loaded?${pathJoined}`
            })

            focus({ id: o.id })

        } else if (k0 === "blur()") { // blur

            if (!o.__view__) return

            if (_window) return view.__controls__.push({
                event: `loaded?${pathJoined}`
            })

            o.__element__.blur()

        } else if (k0 === "mousedown()") {

            if (!o.__view__) return
            var mousedownEvent = new Event("mousedown")
            o.__element__.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseup()") {
            
            if (!o.__view__) return
            var mouseupEvent = new Event("mouseup")
            o.__element__.dispatchEvent(mouseupEvent)

        } else if (k0 === "mouseenter()") {

            if (!o.__view__) return
            var mouseenterEvent = new Event("mouseenter")
            o.__element__.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            if (!o.__view__) return
            var mouseleaveEvent = new Event("mouseleave")
            o.__element__.dispatchEvent(mouseleaveEvent)

        } else if (k0 === "keyup()") {

            if (!o.__view__) return
            var keyupevent = new Event("keyup")
            o.__element__.dispatchEvent(keyupevent)

        } else if (k0 === "keydown()") {

            if (!o.__view__) return
            var keyupevent = new Event("keydown")
            o.__element__.dispatchEvent(keyupevent)

        } else if (k0 === "device()") {

            answer = global.manifest.device.device

        } else if (k0 === "mobile()") {

            answer = global.manifest.device.device.type === "smartphone"

        } else if (k0 === "desktop()") {

            answer = global.manifest.device.device.type === "desktop"

        } else if (k0 === "tablet()") {

            answer = global.manifest.device.device.type === "tablet"

        } else if (k0 === "stack()") {

            answer = stack

        } else if (k0 === "installApp()") {

            const installApp = async () => {

                global.__installApp__.prompt();
                const { outcome } = await global.__installApp__.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
            }

            installApp()

        } else if (k0 === "clearTimer()") {

            answer = clearTimeout(o)

        } else if (k0 === "clearInterval()") {

            answer = clearInterval(o)

        } else if (k0 === "interval()") {

            if (!o.__view__) return
            if (!isNaN(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e }))) { // interval():params:timer

                var timer = parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e }))
                var myFn = () => toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], mount: true })
                answer = setInterval(myFn, timer)
            }

        } else if (k0 === "repeat()") {

            var item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object })
            var times = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })
            var loop = []
            for (var i = 0; i < times; i++) {
                loop.push(item)
            }
            return loop

        } else if (k0 === "timer()") { // timer():params:timer:repeats

            var timer = args[2] ? parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })) : 0
            var repeats = args[3] ? parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object })) : false
            var myFn = () => { toParam({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object, toView, mount }) }

            if (typeof repeats === "boolean") {

                if (repeats === true) answer = setInterval(myFn, timer)
                else if (repeats === false) answer = setTimeout(myFn, timer)

            } else if (typeof repeats === "number") {

                answer = []
                answer.push(setTimeout(myFn, timer))
                if (repeats > 1) {
                    for (let index = 0; index < repeats; index++) {
                        answer.push(setTimeout(myFn, timer))
                    }
                }
            }

            if (o.__view__) toArray(answer).map(timer => o.__timers__.push(timer))

        } else if (k0 === "slice()") { // slice by text or by number

            if (!Array.isArray(o) && typeof o !== "string" && typeof o !== "number") return

            var start = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __, object })
            var end = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[2], __, object })

            if (end !== undefined) {

                if (!isNaN(end)) {

                    if (!isNaN(start)) answer = o.slice(parseInt(start), parseInt(end))
                    else {
                        answer = o.split(start)[1]
                        answer = answer.slice(0, end)
                    }

                } else {

                    if (!isNaN(start)) answer = o.slice(parseInt(start))
                    else answer = o.split(start)[1]
                    answer = answer.split(end)[0]
                }

            } else {

                if (!isNaN(start)) answer = o.slice(parseInt(start) || 0)
                else answer = o.split(start)[1]
            }

        } else if (k0 === "reduce()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            answer = reducer({ _window, lookupActions, stack, id, data: { path: data.path, object: o, key: data.value !== undefined ? true : key, value: data.value !== undefined ? data.value : value }, e, req, res, __, mount })

        } else if (k0 === "path()") {

            var data = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

                } else data.path = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            }

            if ((key && value !== undefined && lastIndex) || data.value !== undefined) {

                if (data.path !== undefined) return toArray(data.path).reduce((o, k, i) => {
                    if (i === data.path.length - 1) return o[k] = data.value !== undefined ? data.value : value
                    else return o[k]
                }, o)

                else return o.__dataPath__

            } else {

                if (data.path !== undefined) return toArray(data.path).reduce((o, k) => o[k], o)
                else return o.__dataPath__
            }
        
        } else if (k0 === "reload()") {

            document.location.reload(true)

        } else if (k0 === "contains()") {

            var first = o, next = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            if (!first || !next) return
            
            if (typeof first === "string") first = views[first]
            if (typeof next === "string") next = views[next]
            
            if (first.nodeType === Node.ELEMENT_NODE) first = views[first.id]
            if (next.nodeType === Node.ELEMENT_NODE) next = views[next.id]

            if (!first.__view__ || !next.__view__) return
            
            if (first.__element__.nodeType === Node.ELEMENT_NODE && next.__element__.nodeType === Node.ELEMENT_NODE) {
                answer = first.__element__.contains(next.__element__)
                if (!answer) answer = first.__element__.id === next.__element__.id
            }

        } else if (k0 === "in()") {

            var next = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            
            if (next) {
                if (typeof o === "string" || Array.isArray(o) || typeof o === "number") return answer = next.includes(o)
                else if (typeof o === "object") answer = next[o] !== undefined
                else if (o.nodeType === Node.ELEMENT_NODE && next.nodeType === Node.ELEMENT_NODE) return answer = next.contains(o)
            } else return false

        } else if (k0 === "is()") {

            var b = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            answer = isEqual(o, b)

        } else if (k0 === "opp()") {

            if (typeof o === "number") answer = -1 * o
            else if (typeof o === "boolean") answer = !o
            else if (typeof o === "string" && o === "true" || o === "false") {
                if (o === "true") answer = false
                else answer = true
            }

        } else if (k0 === "neg()") {

            answer = o < 0 ? o : -o

        } else if (k0 === "pos()") {

            answer = o > 0 ? o : o < 0 ? -o : o

        } else if (k0 === "sum()") {

            answer = o.reduce((o, k) => o + toNumber(k), 0)

        } else if (k0 === "src()") {

            if (!o.__view__) return

            if (lastIndex && key && value !== undefined) answer = o.__element__.src = value
            else answer = o.__element__.src

        } else if (k0 === "clear()") {

            if (!o.__view__) return
            o.__element__.value = null
            o.__element__.text = null
            o.__element__.files = null

        } else if (k0 === "list()") {

            answer = toArray(o)
            answer = [...answer]

        } else if (k0 === "notify()") {

            var notify = () => {
                if (isParam({ _window, string: args[1] })) {

                    var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                    new Notification(_params.title || "", _params)

                } else {

                    var title = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
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

        } else if (k0 === "alert()") {

            var text = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            alert(text)

        } else if (k0 === "clone()") {

            answer = clone(o)

        } else if (k0 === "override()") {

            var obj1 = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e })
            override(o, obj1)

        } else if (k0 === "txt()") {

            if (!o.__view__) return
            
            var el
            if ((o.__islabel__ || o.__labeled__) && o.__name__ !== "Input") el = o.__element__.getElementsByTagName("INPUT")[0]
            else if (views[o.id].__status__ === "Mounted") el = o.__element__

            if (value) value = replaceNbsps(value)

            if (el) {

                if (views[el.id].__name__ === "Input") {

                    answer = el.value
                    if (i === lastIndex && key && value !== undefined && o.__element__) answer = el.value = value
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

            } else {

                if (i === lastIndex && key && value !== undefined) answer = views[o.id].text = value
                else if (path[i + 1] === "del()") {
                    breakRequest = i + 1
                    answer = views[o.id].text = ""
                }
                answer = views[o.id].text
            }

        } else if (k0 === "min()") {

            if (!o.__view__) return

            answer = o.min
            if (i === lastIndex && key && value !== undefined) o.min = value

        } else if (k0 === "max()") {

            if (!o.__view__) return

            answer = o.max
            if (i === lastIndex && key && value !== undefined) o.max = value

        } else if (k0 === "push()") {

            if (!Array.isArray(o)) o = kernel({ req, res, _window, id, data: { path: path.slice(0, i), value: [], key: true, object, _object }, __, e })

            var item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object })
            var index = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })

            if (index === undefined) index = o.length || 0
            
            if (Array.isArray(item)) {

                item.map(item => {
                    o.splice(index, 0, item)
                    index += 1
                })

            } else if (Array.isArray(o)) o.splice(index, 0, item)

            answer = o

        } else if (k0 === "pushItems()") {

            args.slice(1).map(arg => {
                arg = toValue({ req, res, _window, id, data: args[1], __, e, object })
                o.splice(o.length, 0, arg)
            })

        } else if (k0 === "pull()") { // pull by index or by conditions

            // if no index pull the last element
            var lastIndex = 1, firstIndex
            if (!isParam({ _window, id, string: args[1] })) firstIndex = args[1] !== undefined ? toValue({ _window, id, data: args[1], __, e, object, lookupActions, stack }) : 0
            if (args[2]) lastIndex = toValue({ _window, id, data: args[2], __, e, object, lookupActions, stack })

            if (typeof firstIndex !== "number") { // first is a condition

                var items = o.filter(o => toApproval({ _window, e, data: args[1], id, object: o, __, lookupActions, stack }))

                items.filter(data => data !== undefined && data !== null).map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })

                return answer = o
            }

            o.splice(firstIndex, lastIndex || 1)
            answer = o

        } else if (k0 === "pullItem()") { // pull by item

            var item = toValue({ _window, id, data: args[1], __, e, object })
            var index = o.findIndex(_item => isEqual(_item, item))
            if (index !== -1) o.splice(index, 1)
            answer = o

        } else if (k0 === "pullLast()") {

            // if no it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o

        } else if (k0 === "rem()") {
            
            if (!o.__view__) return
            remove({ id: o.id, __, stack })

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

        } else if (k0 === "gen()") {

            if (isParam({ _window, string: args[1] })) {

                data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                data.length = data.length || data.len || 5
                data.number = data.number || data.num
                answer = generate(data)

            } else {

                var length = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) || 5
                answer = generate({ length })
            }

        } else if (k0 === "inc()") {

            var item = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })

            if (typeof o === "string") answer = o.split(item).length > 1
            else if (Array.isArray(o)) answer = o.find(_item => isEqual(_item, item)) ? true : false

        } else if (k0 === "incAny()") {

            var items = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            answer = false

            if (typeof o === "string") {

                items.map(item => {

                    if (answer) return
                    answer = o.split(item).length > 1
                })

            } else if (Array.isArray(o)) {

                items.map(item => {

                    if (answer) return
                    answer = o.find(_item => isEqual(_item, item)) ? true : false
                })
            }

        } else if (k0 === "capitalize()") {

            answer = capitalize(o)

        } else if (k0 === "capitalizeFirst()") {

            answer = capitalizeFirst(o)

        } else if (k0 === "len()") {

            if (Array.isArray(o)) answer = o.length
            else if (typeof o === "string") answer = o.split("").length
            else if (typeof o === "object") answer = Object.keys(o).length

        } else if (k0 === "require()") {

            require(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }))

        } else if (k0 === "new()") {

            var data = [], className = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            args.slice(1).map(arg => {
                data.push(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg || "" }))
            })
            if (className && typeof (new [className]()) === "object") answer = new [className](...data)

        } else if (k0 === "today()" || k0 === "now()") {

            answer = new Date()

        } else if (k0 === "todayEnd()") {

            answer = new Date()
            answer.setUTCHours(23, 59, 59, 999)

        } else if (k0 === "timezone()") {

            var _date = new Date()
            var timeZone = Math.abs(_date.getTimezoneOffset()) * 60 * 1000
            return timeZone

        } else if (k0 === "clock()") { // dd:hh:mm:ss
            
            var data = toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            if (!data.timestamp) data.timestamp = o

            answer = toClock(data)

        } else if (k0 === "toSimplifiedDate()") {

            var data = toParam({ _window, req, res, lookupActions, stack, id, e, data: args[1], __ })
            answer = toSimplifiedDate({ timestamp: o, lang: data.lang || "en", timer: data.time || false })

        } else if (k0 === "ar()") {
            //
            if (Array.isArray(o)) answer = o.map(o => o.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))
            else answer = o.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

        } else if (k0 === "date()") {

            var data = toValue({ _window, id, data: args[1], __, e, object, lookupActions, stack })
            if (isNumber(data) && typeof data === "string") data = parseInt(data)
            answer = new Date(data)

        } else if (k0 === "toDateFormat()") { // returns date for input

            if (isParam({ _window, string: args[1] })) {

                var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var format = data.format, day = 0, month = 0, year = 0, hour = 0, sec = 0, min = 0

                if (typeof o === "string") {

                    if (format.split("/").length > 1) {

                        var date = o.split("/")
                        format.split("/").map((format, i) => {
                            if (format === "dd") day = date[i]
                            else if (format === "mm") month = date[i]
                            else if (format === "yyyy") year = date[i]
                            else if (format === "hh") hour = date[i]
                            else if (format === "mm") min = date[i]
                            else if (format === "ss") sec = date[i]
                        })
                    }

                    return new Date(year, month, day, hour, min, sec)

                } else if (data.excel && typeof o === "number") {

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
                var date = new Date(o)
                var _year = date.getFullYear()
                var _month = date.getMonth() + 1
                var _day = date.getDate()
                var _dayofWeek = date.getDay()
                var _hour = date.getHours()
                var _mins = date.getMinutes()
                var _daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                var monthsCode = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

                if (format.replace(" ", "") === "format1") return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}${args[1] === "time" ? ` ${_hour.toString().length === 2 ? _hour : `0${_hour}`}:${_mins.toString().length === 2 ? _mins : `0${_mins}`}` : ""}`
                else if (format.replace(" ", "") === "format2") return `${_year.toString()}-${_month.toString().length === 2 ? _month : `0${_month}`}-${_day.toString().length === 2 ? _day : `0${_day}`}`
                else if (format.replace(" ", "") === "format3") return `${_day.toString().length === 2 ? _day : `0${_day}`}${monthsCode[_month - 1]}${_year.toString().slice(2)}`
                else if (format.replace(" ", "") === "format4") return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}${` | ${_hour.toString().length === 2 ? _hour : `0${_hour}`}:${_mins.toString().length === 2 ? _mins : `0${_mins}`}`}`
            }

        } else if (k0 === "toDateInputFormat()") { // returns date for input in a specific format

            var data = {}
            if (isParam({ _window, string: args[1] })) {

                data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            } else if (args[1]) {
                data = { date: toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ }) }
            } else data = { date: o }

            var format = data.format || "yyyy-mm-dd"
            var date = new Date(data.date || o)
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

            }

            return newDate

        } else if (k0 === "getGeoLocation") {

            navigator.geolocation.getCurrentPosition((position) => { answer = position })

        } else if (k0 === "counter()") {

            var data = {}
            if (isParam({ _window, string: args[1] })) data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else data = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })

            data.counter = data.counter || data.start || data.count || 0
            data.length = data.length || data.len || data.maxLength || 0
            data.end = data.end || data.max || data.maximum || 999999999999

            answer = require("./counter").counter({ ...data })

        } else if (k0 === "time()") {

            if (isNumber(o)) {

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

        } else if (k0 === "timestamp()") {
            
            if (o instanceof Date) answer = o.getTime()
            else if (o.length === 5 && o.split(":").length === 2) {

                var _hrs = parseInt(o.split(":")[0]) * 60 * 60 * 1000
                var _mins = parseInt(o.split(":")[1]) * 60 * 1000
                answer = _hrs + _mins

            } else if (o.length === 8 && o.split(":").length === 3) {

                var _days = parseInt(o.split(":")[0]) * 24 * 60 * 60 * 1000
                var _hrs = parseInt(o.split(":")[1]) * 60 * 60 * 1000
                var _mins = parseInt(o.split(":")[2]) * 60 * 1000
                answer = _days + _hrs + _mins

            } else {

                o = new Date(o)
                if (o.getTime()) return answer = o.getTime()
                o = new Date()
                answer = o.getTime()
            }

        } else if (k0 === "getDateTime()") {

            var format = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            answer = getDateTime(o, format)

        } else if (k0 === "getDaysInMonth()") {

            if (o instanceof Date) answer = new Date(o.getFullYear(), o.getMonth() + 1, 0).getDate()

        } else if (k0 === "1MonthLater()") {

            var date = o instanceof Date ? o : new Date()
            var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900

            answer = new Date(date.setYear(year)).setMonth(month, date.getDays())

        } else if (k0 === "2MonthLater()") {

            var date = o instanceof Date ? o : new Date()
            var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year

            answer = new Date(date.setYear(year)).setMonth(month, date.getDays())

        } else if (k0 === "3MonthLater()") {

            var date = o instanceof Date ? o : new Date()

            var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(date.setYear(year)).setMonth(month, date.getDays())

        } else if (k0 === "1MonthEarlier") {

            var date = o instanceof Date ? o : new Date()

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            answer = new Date(date.setYear(year)).setMonth(month, date.getDays())

        } else if (k0 === "2MonthEarlier") {

            var date = o instanceof Date ? o : new Date()

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(date.setYear(year)).setMonth(month, date.getDays())

        } else if (k0 === "3MonthEarlier") {

            var date = o instanceof Date ? o : new Date()

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(date.setYear(year)).setMonth(month, date.getDays())

        } else if (k0 === "todayStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = date.setHours(_hrs, _min, 0, 0)

        } else if (k0 === "todayEnd()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = date.setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "monthStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = _date.getTimezoneOffset() % 60
            var _hrs = (_date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(_date.setMonth(_date.getMonth(), 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "monthEnd()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(date.getMonth(), getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "nextMonthStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
            answer = new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "nextMonthEnd()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
            answer = new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "2ndNextMonthStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = o.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "2ndNextMonthEnd()") {

            var date
            if (typeof o.getMonth === 'function') date = o
            else date = new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
            var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
            month = month + 1 > 11 ? 1 : month + 1
            year = month === 1 ? year + 1 : year
            answer = new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "prevMonthStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            answer = new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "prevMonthEnd()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            answer = new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "2ndPrevMonthStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "2ndPrevMonthEnd()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
            var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
            month = month - 1 < 0 ? 11 : month - 1
            year = month === 11 ? year - 1 : year
            answer = new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "yearStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "yearEnd()") {

            var date
            if (typeof o.getMonth === 'function') date = o
            else date = new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(0, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "nextYearStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "nextYearEnd()") {

            var date
            if (typeof o.getMonth === 'function') date = o
            else date = new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(0, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

        } else if (k0 === "prevYearStart()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

        } else if (k0 === "prevYearEnd()") {

            var date = o instanceof Date ? o : new Date()

            var _min = date.getTimezoneOffset() % 60
            var _hrs = (date.getTimezoneOffset() / 60) - _min

            if (_hrs < 0) {
                _hrs = _hrs * -1
                _min = _min * -1
            }

            answer = new Date(date.setMonth(0, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

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

        } else if (k0 === "replace()") { // replace():prev:new

            if (!Array.isArray(o) && typeof o !== "string") o = reducer({ req, res, _window, id, data: { path: path.slice(0, i), value: [], key: true, object: _object }, __, e })

            var rec0, rec1

            rec0 = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] || "" })
            rec1 = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2] || "" })

            if (typeof o === "string") {

                if (rec1 !== undefined) answer = o.replace(rec0, rec1)
                else answer = o.replace(rec0)

            } else if (Array.isArray(o)) {

                var _itemIndex = o.findIndex(item => isEqual(item, rec0)), rec2 = rec1 || rec0 // replace():rec0:rec1 || replace():rec0 (if rec0 doesnot exist push it)
                if (_itemIndex >= 0) o[_itemIndex] = rec2
                else o.push(rec2)
                return o
            }

        } else if (k0 === "replaceItem()") { // replace by condition

            if (!Array.isArray(o)) return
            if (isParam({ _window, string: args[1] })) {

                var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _path = data.path, _data = data.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], key, value, object: item }, e, __: [o, ...__] }), reducer({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], key, value, object: _data }, __: [o, ...__], e })))
                if (_index >= 0) o[_index] = _data
                else o.push(_data)

            } else if (args[1]) {

                var data = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

                if (typeof o[0] === "object" || (typeof o[0] === "undefined" && typeof data === "object")) {

                    var _index = o.findIndex(item => item.id === data.id)
                    if (_index >= 0) o[_index] = data
                    else o.push(data)

                } else if ((typeof o[0] === "undefined" && typeof data !== "object") || typeof o[0] === "number" || typeof o[0] === "string") {

                    var _index = o.findIndex(item => item === data)
                    if (_index < 0) o.push(data)
                }
            }

        } else if (k0 === "replaceItems()") {

            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _path = _params.path, _data = _params.data.filter(data => data !== undefined && data !== null)
                toArray(_data).map(_data => {

                    var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], value, object: item }, __: [o, ...__], e }), reducer({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], value, object: _data }, __: [o, ...__], e })))
                    if (_index >= 0) o[_index] = _data
                    else o.push(_data)
                })

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }).filter(data => data !== undefined && data !== null)
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

        } else if (k0 === "terminate()") {

            stack.terminated = true

        } else if (k0 === "break()") {

            if (stack.loop) stack.broke = true

        } else if (k0 === "return()") {

            stack.returns[0].data = answer = toValue({ _window, data: args[1], e, id, object, __, stack, lookupActions })
            stack.returns[0].returned = true

        } else if (k0 === "export()") {

            var data = lineInterpreter({ _window, req, res, _window, id, e, __, data: { string: args[1] } }).data

            if (data.json) data.type = "json"
            if (data.csv) data.type = "csv"
            if (data.excel) data.type = "excel"
            if (data.pdf) data.type = "pdf"

            if (data.type === "json") exportJson(data)
            else if (data.type === "csv") require("./toCSV").toCSV(data)
            else if (data.type === "excel") require("./toExcel").toExcel(data)
            else if (data.type === "pdf") require("./toPdf").toPdf(data)

        } else if (k0 === "import()") {

            // wait address
            var address = addresser({ _window, stack, args, asynchronous: true, id: o.id, action: "import()", object, toView, _object, lookupActions, __, id })
            var { address, data } = address

            if (data.json) data.type = "json"
            importFile({ req, res, _window, address, lookupActions, stack, id, e, __, data })

            return true

        } else if (k0 === "flat()") {

            if (typeof o === "object") {
                if (Array.isArray(o)) {
                    o = [...o]
                    answer = o.flat()
                } else {
                    //_object = {..._object, ...o}
                    if (typeof _object === "object") Object.entries(o).map(([key, value]) => _object[key] = value)
                    return _object
                }
            } else return o

        } else if (k0 === "getDeepChildrenId()") {

            answer = getDeepChildrenId({ _window, id: o.id })

        } else if (k0 === "deep()" || k0 === "deepChildren()") {

            answer = getDeepChildren({ _window, id: o.id })

        } else if (k0 === "filter()") {

            var args = k.split(":").slice(1), isnot
            if (!args[0]) isnot = true

            if (isnot) answer = toArray(o).filter(o => o !== "" && o !== undefined && o !== null)
            else args.map(arg => {

                if (underScored) answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, e, data: arg, id, __: [o, ...__], req, res }))
                else answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, e, data: arg, id, object: o, req, res, __ }))
            })

        } else if (k0 === "find()") {
            
            if (i === lastIndex && key && value !== undefined) {

                var index
                if (underScored) index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
                else index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object: o }))
                if (index !== undefined && index !== -1) o[index] = answer = value

            } else {

                if (underScored) answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
                else answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object: o }))
            }

        } else if (k0 === "sort()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            if (!data.data) data.data = o

            // else return o
            data.data = answer = require("./sort").sort({ _window, lookupActions, stack, __, sort: data, id, e })

            return answer

        } else if (k0 === "findIndex()") {

            if (typeof o !== "object") return

            if (underScored) answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __: [o, ...__], req, res }))
            else answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object: o }))

        } else if (k0 === "()") { // map()

            var notArray = false
            if (args[1] && args[1].charAt(0) === "@" && args[1].length == 6) args[1] = global.__refs__[args[1]].data
            if (args[2] && args[2].charAt(0) === "@" && args[2].length == 6) args[2] = global.__refs__[args[2]].data

            if (typeof o === "object" && !Array.isArray(o)) notArray = true

            stack.loop = true

            if (args[1] && underScored) {

                toArray(o).map(o => reducer({ req, res, _window, lookupActions, stack, id, data: { path: args[1] || [], object, value }, __: [o, ...__], e, toView }))
                answer = o

            } else if (args[1]) {

                answer = toArray(o).map(o => reducer({ req, res, _window, lookupActions, stack, id, data: { path: args[1] || [], object: o, value }, __, e, toView }))
            
            } else if (args[2] && underScored) {

                breakRequest = true
                var address;
                ([...toArray(o)]).reverse().map(o => {
                    // address
                    address = addresser({ _window, id, stack, headAddress: address, type: "function", status: "Wait", action: "loop()", function: "reducer", __: [o, ...__], lookupActions, mount, data: { path: args[2] || [], value, object } }).address
                })
                
                // address
                if (address) toAwait({ _window, id, lookupActions, stack, address, __, req, res })

            } else if (args[2]) {

                breakRequest = true
                var address;
                ([...toArray(o)]).reverse().map(o => {
                    // address
                    address = addresser({ _window, id, stack, headAddress: address, type: "function", status: "Wait", action: "loop()", function: "reducer", __, lookupActions, mount, data: { path: args[2] || [], value, object: o } }).address
                })

                // address
                if (address) toAwait({ _window, id, lookupActions, stack, address, __, req, res })
            } 

            stack.loop = false
            stack.broke = false

            if (notArray) return o

        } else if (k0 === "html2pdf()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, action: "html2pdf()", mount, object, toView, _object, lookupActions, __, id })

            var options = {
                margin: .25,
                filename: data.name || generate({ length: 20 }),
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, dpi: 300, letterRendering: true },
                jsPDF: { unit: 'mm', format: data.format || 'a4', orientation: 'portrait' }
            }

            data.view = data.view || o
            var exporter = new html2pdf(data.view.__element__, options)

            exporter.getPdf(true).then((pdf) => {
                console.log('pdf file downloaded')
            })

            /*exporter.getPdf(false).then((pdf) => {
                console.log('doing something before downloading pdf file');
                pdf.save();
              });*/
            
            /*pages.map(page => {

                var _element
                if (typeof page === "object" && page.id) _element = views[page.id].__element__
                else if (page.nodeType === Node.ELEMENT_NODE) _element = page
                else if (typeof page === "string") _element = views[page].__element__

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
            })*/

        } else if (k0 === "share()") {

            if (isParam({ _window, string: args[1] })) { // share():[text;title;url;files]

                var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) || {}, images = []
                data.files = toArray(data.file || data.files) || []
                if (data.image || data.images) data.images = toArray(data.image || data.images)

                var getFileFromUrl = async (url, name) => {

                    const response = await fetch(url)
                    const blob = await response.blob()
                    images.push(new File([blob], 'rick.jpg', { type: blob.type }))

                    if (images.length === data.images.length)
                        await navigator.share({ title: data.title, text: data.text, url: data.url, files: images })
                }

                if (data.images) data.images.map(async url => getFileFromUrl(url, data.title))
                else {
                    console.log(data);
                    navigator.share(data)
                }

            } else if (args[1]) { // share():url
                navigator.share({ url: toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) })
            }

        } else if (k0 === "loader()") {

            var data = {}

            if (isParam({ _window, string: args[1] })) {

                data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                if (data.hide) data.show = false

            } else {

                var show = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                if (show === "show") data.show = true
                else if (show === "hide") data.show = false
            }

            var _o
            if (data.id) _o = views[data.id]
            else if (data.window) _o = views["root"]
            else _o = o

            if (typeof _o !== "object") return
            if (_o.__status__ === "Loading") {
                return _o.__controls__.push({
                    event: "loaded?" + k
                })
            }

            if (data.show) {

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

                if (data.style) {
                    Object.entries(data.style).map(([key, value]) => {
                        loader.style[key] = value
                    })
                }

                if (data.background && data.background.style) {
                    Object.entries(data.background.style).map(([key, value]) => {
                        lDiv.style[key] = value
                    })
                }

                return sleep(10)

            } else if (data.show === false) {

                var lDiv = document.getElementById(_o.id + "-loader")
                if (lDiv) lDiv.parentNode.removeChild(lDiv)
                else console.log("Loader doesnot exist!")
            }

        } else if (k0 === "type()") {

            if (args[1]) answer = getType(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }))
            else answer = getType(o)

        } else if (k0 === "coords()") {

            var _id = o.id
            if (args[1]) _id = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            require("./getCoords")({ id: _id || id })

        } else if (k0 === "price()") {

            var _price
            if (args[1]) _price = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else _price = o
            answer = parseFloat(_price);
            answer = formatter.format(answer).slice(1)

        } else if (k0 === "bool()") {

            answer = typeof o === "boolean" ? o : (o === "true" ? true : o === "false" ? false : undefined)

        } else if (k0 === "num()") {

            answer = toNumber(o)

        } else if (k0 === "isNum()") {

            answer = isNumber(o)

        } else if (k0 === "round()") {

            if (isNumber(o)) {
                var nth = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) || 2
                answer = parseFloat(o || 0).toFixed(nth)
            }

        } else if (k0 === "str()") {

            if (typeof o !== "object") answer = o + ""
            else answer = toString(o)

        } else if (k0 === "lastIndex()") {

            answer = o.length ? o.length - 1 : 0

        } else if (k0 === "2ndLastIndex()") {

            answer = o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

        } else if (k0 === "2ndLastIndex()") {

            answer = o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

        } else if (k0 === "nthLastIndex()") {

            answer = o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

        } else if (k0 === "el()") {

            answer = o.__element__

        } else if (k0 === "index()") {

            answer = o.__index__

        } else if (k0 === "checked()") {

            if (!o.__view__) return

            if (value !== undefined && key) answer = o.checked.checked = o.__element__.checked = value
            else answer = o.checked.checked || o.__element__.checked || false

        } else if (k0 === "check()") {

            breakRequest = true
            if (!o.__view__) return

            answer = o.checked.checked = o.__element__.checked = value || false

        } else if (k0 === "parseFloat()") {

            answer = parseFloat(o)

        } else if (k0 === "parseInt()") {

            answer = parseInt(o)

        } else if (k0 === "stringify()") {

            answer = JSON.stringify(o)

        } else if (k0 === "parse()") {

            answer = JSON.parse(o)

        } else if (k0 === "getCookie()") {

            // getCookie():name
            if (isParam({ _window, string: args[1], req, res })) {

                var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                return getCookie({ ...data, req, res, _window })
            }

            var _name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            var _cookie = getCookie({ name: _name, req, res, _window })
            return _cookie

        } else if (k0 === "eraseCookie()") {

            if (_window) return views.root.__controls__.push({ event: `loading?${pathJoined}` })

            // getCookie():name
            if (isParam({ _window, req, res, string: args[1] })) {
                var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                return eraseCookie({ ...data, req, res, _window })
            }
            var _name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            var _cookie = eraseCookie({ name: _name, req, res, _window })
            return _cookie

        } else if (k0 === "setCookie()") {

            if (_window) return views.root.__controls__.push({ event: `loading?${pathJoined}` })

            // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
            var cookies = []
            if (isParam({ _window, req, res, string: args[1] })) {

                args.slice(1).map(arg => {

                    var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: arg })
                    setCookie({ ...data, req, res, _window })

                    cookies.push(data)
                })

            } else {

                var _name = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                var _value = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2] })
                var _expiryDate = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[3] })

                setCookie({ name: _name, value: _value, expires: _expiryDate, req, res, _window })
            }


            if (cookies.length === 1) return cookies[0]
            else return cookies

        } else if (k0 === "cookie()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            if (_window && data.method === "post" || data.method === "delete") return views.root.__controls__.push({ event: `loading?${pathJoined}` })
            if (data.method === "post") return setCookie({ ...data, req, res, _window })
            if (data.method === "delete") return eraseCookie({ ...data, req, res, _window })
            if (data.method === "get") return getCookie({ ...data, req, res, _window })

        } else if (k0 === "clean()") {

            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")

        } else if (k0 === "colorize()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1] || "", __ })
            answer = colorize({ _window, string: o, ...data })

        } else if (k0 === "deepChildren()") {

            answer = getDeepChildren({ _window, lookupActions, stack, id: o.id })

        } else if (k0 === "note()") { // note

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            note({ note: data })

        } else if (k0 === "readonly()") {

            if (!o.__view__) return
            var children = getDeepChildren({ _window, id: o.id })

            children.map(child => {

                child.__element__.setAttribute("readOnly", true)
                child.readonly = true

                child.__element__.setAttribute("contenteditable", false)
                child.editable = false
            })

        } else if (k0 === "editable()") {

            if (!o.__view__) return
            var children = getDeepChildren({ _window, id: o.id })

            children.map(child => {

                child.__element__.setAttribute("readOnly", false)
                child.readonly = false

                child.__element__.setAttribute("contenteditable", true)
                child.editable = true
            })

        } else if (k0 === "range()") {

            var index = 0
            var range = []
            var startIndex = args[2] ? toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }) : 0 || 0
            var endIndex = args[2] ? toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[2] }) : toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            var steps = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[3] }) || 1
            var lang = args[4] || ""
            index = startIndex

            while (index <= endIndex) {
                if ((index - startIndex) % steps === 0) {
                    range.push(index)
                    index += steps
                }
            }

            if (lang === "ar") range = range.map(num => num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))
            answer = range

        } else if (k0 === "view()") {

            if (!o.__view__) return
            
            var { address, data = {} } = addresser({ _window, stack, args, type: "render", interpreting: true, renderer: true, id: o.id, action: "view()", object, toView, _object, lookupActions, __, id })
            data.view = data.view || o
            
            require("./toView").toView({ _window, id: o.id, e, __, stack, address, lookupActions, data, req, res })

        } else if (k0 === "html()") {
            
            if (!o.__view__) return
            
            require("./toHTML").toHTML({ _window, id: o.id, type: "render", e, __, stack, lookupActions, data })

        } else if (k0 === "droplist()") {

            var { address, data } = addresser({ _window, stack, args, id: o.id, action: "droplist()", object, toView, _object, lookupActions, __, id })
            require("./droplist").droplist({ id, e, data, __, stack, lookupActions, address })

        } else if (k0 === "route()") {

            var { address, data } = addresser({ _window, stack, args, type: "action", interpretByValue: true, blockable: false, renderer: true, id: o.id, action: "route()", object, toView, _object, lookupActions, __, id })
            if (typeof data === "string") data = { page: data }
            require("./route").route({ _window, lookupActions, stack, address, id, req, res, route: data, __ })

        } else if (k0 === "update()") {

            if (!o.__view__) return o

            var { address, data = {} } = addresser({ _window, stack, args, type: "action", interpretByValue: true, renderer: true, blockable: false, id: o.id, action: "update()", object, toView, _object, lookupActions, __, id })
            require("./update").update({ _window, lookupActions, stack, req, res, id, address, __, data: { id: data.id || o.id, ...data } })

        } else if (k0 === "insert()") {

            if (!o.__view__) return o

            // wait address
            var { address, data = {} } = addresser({ _window, stack, args, type: "action", renderer: true, id: o.id, action: "insert()", toView, _object, lookupActions, __, id })
            if (data.__view__) data = { view: data }
            data.parent = o.id

            require("./insert").insert({ id, insert: data, lookupActions, stack, address, __ })

        } else if (k0 === "confirmEmail()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, action: "confirmEmail()", object, toView, _object, lookupActions, __, id })
            data.store = "confirmEmail"
            require("./save").save({ id, lookupActions, stack, address, e, __, save: data })

        } else if (k0 === "mail()") {

            if (!o.__view__) return o

            // wait address
            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, action: "mail()", object, toView, _object, lookupActions, __, id })

            require("./mail").mail({ req, res, _window, lookupActions, stack, address, id, e, __, data })
            return true

        } else if (k0 === "print()") {

        } else if (k0 === "read()") {

            var data = {}
            if (isParam({ _window, string: args[1] }))
                data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            else data.file = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

            data.files = (data.file ? toArray(data.file) : data.files) || []

            //data.files = [...data.files]
            global.fileReader = []
            var __key = generate()
            global.__COUNTER__ = global.__COUNTER__ || {}
            global.__COUNTER__[__key] = {
                length: data.files.length,
                count: 0
            };

            ([...data.files]).map(file => {

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

        } else if (k0 === "upload()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, type: "async", action: "upload()", object, toView, _object, lookupActions, __, id })
            require("./upload")({ _window, lookupActions, stack, address, req, res, id, e, upload: data, __ })
                
        } else if (k0 === "search()") {

            var { address, data } = addresser({ _window, stack, args, req, res, asynchronous: true, id: o.id, type: "async", action: "search()", mount, object, toView, _object, lookupActions, __, id })
            // var data = operatorToText({ _window, lookupActions, stack, address, id, e, __, req, res, string: args[1], object })

            address.action += " " + data.collection
            require("./search").search({ _window, lookupActions, stack, address, id, e, __, req, res, data })
            return true

        } else if (k0 === "erase()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, type: "async", action: "erase()", mount, object, toView, _object, lookupActions, __, id })

            address.action += " " + data.collection
            require("./erase").erase({ _window, lookupActions, stack, address, id, e, __, req, res, erase: data })
            return true

        } else if (k0 === "save()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, type: "async", action: "save()", mount, object, toView, _object, lookupActions, __, id })

            address.action += " " + data.collection
            require("./save").save({ _window, lookupActions, stack, address, id, e, __, req, res, save: data })
            return true

        } else if (k0 === "send()") {

            breakRequest = true
            if (!res || res.headersSent) return
            
            if (!args[1]) return stack.addresses.find(address => address.id === stack.interpretingAddressID).sender = true

            var executionDuration = (new Date()).getTime() - stack.executionStartTime, response

            if (isParam({ _window, string: args[1] })) {

                response = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
                response.success = response.success !== undefined ? response.success : true
                response.message = response.message || response.msg || "Action executed successfully!"
                response.executionDuration = executionDuration
                delete response.msg

            } else {

                var data = toValue({ req, res, _window, lookupActions, id, e, __, data: args[1] })
                response = { success: true, message: "Action executed successfully!", data, executionDuration }
            }

            var sender = false, headAddressID = stack.interpretingAddressID, respond = false
            var address = stack.addresses.find(address => address.id === headAddressID)
            if (!address) headAddressID = (stack.addresses.find(address => address.interpreting) || {}) .id

            while (!sender && headAddressID) {

                var address = stack.addresses.find(address => address.id === headAddressID)
                
                if (address.sender) {

                    sender = true

                    var headAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID)
                    if (headAddress) {

                        // push response to address underscores
                        address.params.__ = [response, ...address.params.__]

                        // block self and headAddresses
                        headAddressID = stack.interpretingAddressID

                        while (headAddressID !== headAddress.id) {
                            address = stack.addresses.find(address => address.id === headAddressID)
                            address.blocked = true
                            headAddressID = address.headAddressID
                        }
                        
                    } else respond = true
                }

                headAddressID = address.headAddressID
            }
            
            if (!sender || respond) {

                stack.terminated = true

                // logs
                console.log("SEND (" + executionDuration + ")")
                stack.logs.push(stack.logs.length + " SEND (" + executionDuration + ")")
                response.logs = stack.logs

                // respond
                res.send(response)
            }

        } else if (k0 === "sent()") {

            if (!res || res.headersSent) return true
            else return false

        } else if (k0 === "setPosition()" || k0 === "position()") {

            var position = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            return require("./setPosition").setPosition({ position, id: o.id || id, e })

        } else if (k0 === "csvToJson()") {

            var file = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            require("./csvToJson").csvToJson({ id, lookupActions, stack, e, file, onload: args[2] || "", __ })

        } else if (k0 === "copyToClipBoard()") {

            var text
            if (args[1]) text = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
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
            var _class = toValue({ req, res, _window, lookupActions, stack, id, e, __: [o, ...__], data: args[1] })
            if (o.__element__) answer = o.__element__.classList.add(_class)

        } else if (k0 === "remClass()") {

            if (!o.__view__) return o
            var _class = toValue({ req, res, _window, lookupActions, stack, id, e, __: [o, ...__], data: args[1] })
            if (o.__element__) answer = o.__element__.classList.remove(_class)

        } else if (k0 === "encodeURI()") {

            answer = encodeURI(o)

        } else if (k0 === "decodeURI()") {

            answer = decodeURI(o)

        } else if (k0.slice(-2) === "()" && typeof o[k0.slice(0, -2)] === "function") {

            var data = []
            args.slice(1).map(arg => {
                data.push(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg || "" }))
            })

            answer = o[k0.slice(0, -2)](...data)

        } else if (k0.slice(-2) === "()") {

            if (k0.charAt(0) === "@" && k0.length == 6) k0 = toValue({ req, res, _window, id, e, __, data: k0, object })

            if (underScored) {
                answer = toAction({ _window, lookupActions, stack, id, req, res, __: [o, ...__], e, path: [k], path0: k0, condition, mount, toView, object })
            } else {
                answer = toAction({ _window, lookupActions, stack, id, req, res, __, e, path: [k], path0: k0, condition, mount, toView, object: object || o })
            }

        } else if (k.includes(":@")) {

            breakRequest = true

            // decode
            if (k0.charAt(0) === "@" && k0.length == 6) k0 = global.__refs__["@" + k0.slice(-5)].data

            o[k0] = o[k0] || {}

            if (mount && events.includes(k0)) {

                if (!o.__view__) return

                var data = global.__refs__["@" + args[1].slice(-5)].data
                
                if (views[id].__status__ === "Mounted") return require("./event").addEventListener({ event: k0 + "?" + data, id, __, lookupActions, eventID: o.id })
                else return views[id].__controls__.push({ event: k0 + "?" + data, id, __, lookupActions, eventID: o.id })
            }

            args[1] = ((global.__refs__["@" + args[1].slice(-5)] || {}).data || "").split(".")
            if (args[1]) answer = reducer({ req, res, _window, lookupActions, stack, id, e, data: { path: [...args.slice(1).flat(), ...path.slice(i + 1)], object: o[k0], key }, __ })
            else return

        } else if (key && value !== undefined && i === lastIndex) {

            if (Array.isArray(o)) {
                if (!isNumber(k)) {
                    if (o.length === 0) o.push({})
                    o = o[0]
                }
            }
            answer = o[k] = value

        } else if (key && o[k] === undefined && i !== lastIndex) {

            var path1 = path[i + 1]
            if (path1 && (isNumber(path1) || path1.slice(0, 3) === "():" || path1.includes("find()") || path1.includes("filter()") || path1.includes("push()"))) answer = o[k] = []
            else {

                if (Array.isArray(o)) {
                    if (isNaN(k)) {
                        if (o.length === 0) o.push({})
                        o = o[0]
                    }
                }
                answer = o[k] = {}
            }
        } else answer = o[k]
        
        return answer

    }, _object)

    return answer
}

const getDeepChildren = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    var all = [view]
    if (!view) return []

    if (view.__childrenRef__.length > 0)
        view.__childrenRef__.map(({ id }) => {

            var _view = views[id]
            if (!_view) return

            if (_view.__childrenRef__.length > 0)
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

    if (view.__childrenRef__.length > 0)
        view.__childrenRef__.map(({ id }) => {

            var _view = views[id]
            if (!_view) return

            if (_view.__childrenRef__.length > 0)
                all.push(...getDeepChildrenId({ _window, id }))

            else all.push(id)
        })

    return all
}

const getDeepParentId = ({ _window, lookupActions, stack, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]

    if (!view) return []
    if (!view.__element__.parentNode || view.__element__.parentNode.nodeName === "BODY") return []

    var parentId = view.__element__.parentNode.id
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
})

module.exports = { kernel, getDeepChildren, getDeepChildrenId }