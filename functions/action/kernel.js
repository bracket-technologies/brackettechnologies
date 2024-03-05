const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { isEqual } = require("./isEqual")
const { capitalizeFirst, capitalize } = require("./capitalize")
const { clone } = require("./clone")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { exportJson } = require("./exportJson")
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")
const { note } = require("./note")
const { isParam } = require("./isParam")
const { lengthConverter, resize } = require("./resize")
const { qr } = require("./qr")
const { replaceNbsps } = require("./replaceNbsps")
const { vcard } = require("./vcard")
const { colorize } = require("./colorize")
const { override } = require("./merge")
const { nthParent, nthNext, nthPrev } = require("./getView")
const { decode } = require("./decode")
const { searchParams } = require("./searchParams")
const { fileReader } = require("./fileReader")
const { executable } = require("./executable")
const { toEvent } = require("./toEvent")
const { isEvent } = require("./isEvent")
const { isCondition } = require("./isCondition")
const { isCalc } = require("./isCalc")
const { toCode } = require("./toCode")
const { logger } = require("./logger")
const { openStack, clearStack, endStack } = require("./stack")
const { getJsonFiles } = require("./jsonFiles")
const Input = require("../view/Input")
const { watch } = require("./watch")
const { isArabic } = require("./isArabic")
const cssStyleKeyNames = require("./cssStyleKeyNames")
const events = require("./events.json")

var actions = {
    "caret()": ({ o }) => ({ index: getCaretIndex(o) }),
    "toInt()": ({ o }) => {

        if (!isNumber(o)) return
        var integer = o
        return Math.round(toNumber(integer))
    },
    "clicked()": ({ global }) => {

        return global.__clicked__
    },
    "focused()": ({ global }) => {

        return global.__focused__
    },
    "click()": ({ _window, global, o, view, pathJoined }) => {

        if (!o.__view__ || !o.__rendered__) return

        if (_window) return view.__controls__.push({
            event: `loaded?${pathJoined}`
        })

        global.__clicked__ = o
        o.__element__.click()
    },
    "focus()": ({ _window, o, view, pathJoined }) => {

        if (!o.__view__) return

        if (_window) return view.__controls__.push({
            event: `loaded?${pathJoined}`
        })

        focus({ id: o.id })
    },
    "blur()": ({ _window, o, view, pathJoined }) => {

        if (!o.__view__) return

        if (_window) return view.__controls__.push({
            event: `loaded?${pathJoined}`
        })

        o.__element__.blur()
    },
    "mousedown()": ({ o }) => {

        if (!o.__view__) return
        var mousedownEvent = new Event("mousedown")
        o.__element__.dispatchEvent(mousedownEvent)
    },
    "mouseup()": ({ o }) => {
        if (!o.__view__) return
        var mouseupEvent = new Event("mouseup")
        o.__element__.dispatchEvent(mouseupEvent)
    },
    "mouseenter()": ({ o }) => {

        if (!o.__view__) return
        var mouseenterEvent = new Event("mouseenter")
        o.__element__.dispatchEvent(mouseenterEvent)
    },
    "mouseleave()": ({ o }) => {

        if (!o.__view__) return
        var mouseleaveEvent = new Event("mouseleave")
        o.__element__.dispatchEvent(mouseleaveEvent)
    },
    "keyup()": ({ o }) => {
        if (!o.__view__) return
        var keyupevent = new Event("keyup")
        o.__element__.dispatchEvent(keyupevent)
    },
    "keydown()": ({ o }) => {
        if (!o.__view__) return
        var keyupevent = new Event("keydown")
        o.__element__.dispatchEvent(keyupevent)
    },
    "device()": ({ global }) => global.manifest.device.device,
    "mobile()": ({ global }) => global.manifest.device.device.type === "smartphone",
    "desktop()": ({ global }) => global.manifest.device.device.type === "desktop",
    "tablet()": ({ global }) => global.manifest.device.device.type === "tablet",
    "stack()": ({ stack }) => stack,
    "name()": ({ _window, id, e, object, args, o }) => {

        var name = toValue({ _window, id, e, object, value: args[1], __ })
        if (name === o.__name__) return o
        var children = getDeepChildren({ _window, id: o.id })
        return children.find(view => view.__name__ === name)

    },
    "names()": ({ _window, id, e, object, args, o }) => {

        var name = toValue({ _window, id, e, object, value: args[1], __ })
        var children = getDeepChildren({ _window, id: o.id })
        return children.filter(view => view.__name__ === name)

    },
    "display()": ({ o }) => {

        if (!o.__view__) return
        o.__element__.style.display = "flex"

    },
    "hide()": ({ o }) => {

        if (!o.__view__) return
        o.__element__.style.display = "none"

    },
    "style()": ({ req, res, _window, lookupActions, stack, id, e, __, args, o, pathJoined }) => {

        if (!o.__view__) return
        if (!args[1]) {
            if (!o.__element__) {
                o.style = o.style || {}
                return o.style
            } return o.__element__.style
        }

        var styles = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

        if (Object.keys(styles).length > 0) {

            var obj = o.__element__ ? o.__element__ : o
            if (obj.__view__) obj.style = obj.style || {}

            Object.entries(styles).map(([key, value]) => {
                obj.style[key] = value
            })
        }

    },
    "qr()": ({ req, res, _window, lookupActions, stack, id, e, __, args, o }) => {

        // wait address
        var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, action: "qr()", object, lookupActions, __, id })
        qr({ _window, id, req, res, data, e, __, stack, address, lookupActions })

    },
    "contact()": ({ req, res, _window, lookupActions, stack, id, e, __, args, o }) => {

        var data = toValue({ req, res, _window, id, e, __, data: args[1] })
        if (typeof data !== "obejct") return o

        vcard({ _window, id, req, res, data, e, __ })

    },
    "bracket()": ({ o }) => {

        if (typeof o === "object") return require("./jsonToBracket").jsonToBracket(o)

    },
    "inputs()": ({ _window, lookupActions, stack, o }) => {

        if (!o.__view__) return
        var inputs = [], textareas = [], editables = []

        inputs = o.__element__.getElementsByTagName("INPUT")
        textareas = o.__element__.getElementsByTagName("TEXTAREA")
        editables = getDeepChildren({ _window, lookupActions, stack, id: o.id }).filter(view => view.editable)
        if (o.editable) editables.push(o)

        return [...inputs, ...textareas, ...editables].map(o => views[o.id])

    },
    "input()": ({ req, res, _window, lookupActions, stack, id, e, __, args, o }) => {

        if (!o.__view__) return
        var inputs = [], textareas = [], editables = []

        inputs = o.__element__.getElementsByTagName("INPUT")
        textareas = o.__element__.getElementsByTagName("TEXTAREA")
        editables = getDeepChildren({ _window, lookupActions, stack, id: o.id }).filter(view => view.editable)
        if (o.editable) editables.push(o)

        if ([...inputs, ...textareas, ...editables].length === 0) return
        answer = views[[...inputs, ...textareas, ...editables][0].id]

    },
    "px()": ({ req, res, _window, lookupActions, stack, id, e, __, args, o }) => {

        if (args[1]) return lengthConverter(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] }))
        return lengthConverter(o)

    },
    "touchable()": ({ _window, global }) => {

        if (_window) return global.manifest.device.device.type === "smartphone"
        else return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))

    },
    "className()": ({ req, res, _window, lookupActions, stack, id, e, __, args, o }) => {

        if (!o.__view__) return
        var className = toValue({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })

        var answer = [...o.__element__.getElementsByClassName(className)]
        return answer.map(o => window.views[o.id])

    }, "classList()": ({ o }) => {

        if (!o.__view__) return
        return [...o.__element__.classList]

    }
}

const kernel = ({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: _object, path, pathJoined, value, key, object } }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = views[id]

    var pathJoined = pathJoined || path.join("."), breakRequest

    // no path but there is value
    if (path.length === 0 && key && value !== undefined) return value

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

            var logs = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, stack, id, e, __: underScored ? [o, ...__] : __, data: arg, object: underScored ? object : (i === 0 ? ((pathJoined || "").split(".")[0] !== k ? o : undefined) : o) }))
            if (args.slice(1).length === 0 && pathJoined !== "log()") logs = [o]

            console.log("LOG:" + (o.id || id), decode({ _window, string: pathJoined }), ...logs)
            stack.logs.push(stack.logs.length + " LOG:" + (o.id || id) + " " + logs.join(" "))

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

            if (data.path) return answer = kernel({ req, res, _window, lookupActions, stack, id, e, data: { data: data.data || global[data.doc || o.doc], value, key, path: data.path, object }, __ })

            if (!o.doc) return

            answer = kernel({ req, res, _window, lookupActions, stack, id, data: { path: [...o.__dataPath__, ...path.slice(i + 1)], object, data: global[o.doc], value, key }, __, e })

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

            if (!o.__view__ || !o.id) return
            var nth = toValue({ _window, id, e, lookupActions, stack, __, data: args[1] })
            return nthParent({ _window, nth, o })

        } else if (k0 === "prevSiblings()") {

            if (!o.__view__ || !o.id) return o
            return views[o.__parent__].__childrenRef__.slice(0, o.__index__ + 1).map(({ id }) => views[id])

        } else if (k0 === "nextSiblings()") {

            if (!o.__view__ || !o.id) return o
            return views[o.__parent__].__childrenRef__.slice(o.__index__ + 1).map(({ id }) => views[id])

        } else if (k0 === "siblings()") {

            if (!o.__view__ || !o.id) return o
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

            if (!o.__view__ || !o.id) return
            var nth = toValue({ _window, __, value: args[1], e, id, lookupActions, stack })
            return nthNext({ _window, nth, o })

        } else if (k0 === "last()") {

            if (!o.__view__ || !o.id) return
            return views[views[o.__parent__].__childrenRef__.slice(-1)[0].id]

        } else if (k0 === "2ndLast()") {

            if (!o.__view__ || !o.id) return
            return views[views[o.__parent__].__childrenRef__.slice(-2)[0].id]

        } else if (k0 === "3rdLast()") {

            if (!o.__view__ || !o.id) return
            return views[views[o.__parent__].__childrenRef__.slice(-3)[0].id]

        } else if (k0 === "nthLast()") {

            if (!o.__view__ || !o.id) return
            var nth = toValue({ _window, __, value: args[1], e, id, lookupActions, stack })
            if (!isNumber(nth)) return
            return views[views[o.__parent__].__childrenRef__.slice(-1 * nth)[0].id]

        } else if (k0 === "1stSibling()") {

            if (!o.__view__ || !o.id) return o
            return views[views[o.__parent__].__childrenRef__[0].id]

        } else if (k0 === "2ndSibling()") {

            if (!o.__view__ || !o.id) return o
            return views[views[o.__parent__].__childrenRef__[1].id]

        } else if (k0 === "3rdSibling()") {

            if (!o.__view__ || !o.id) return o
            return views[views[o.__parent__].__childrenRef__[2].id]

        } else if (k0 === "nthSibling()") {

            if (!o.__view__ || !o.id) return o
            var nth = toValue({ _window, id, e, __, value: args[1], lookupActions, stack })
            return views[views[o.__parent__].__childrenRef__[nth - 1].id]

        } else if (k0 === "grandChild()") {

            if (!o.__view__ || !o.id) return
            return views[views[o.__childrenRef__[0].id].__childrenRef__[0].id]

        } else if (k0 === "grandChildren()") {

            if (!o.__view__ || !o.id) return
            return views[o.__childrenRef__[0].id].__childrenRef__.map(({ id }) => views[id])

        } else if (k0 === "prev()") {

            return nthPrev({ _window, nth: 1, o })

        } else if (k0 === "2ndPrev()") {

            return nthPrev({ _window, nth: 2, o })

        } else if (k0 === "3rdPrev()") {

            return nthPrev({ _window, nth: 3, o })

        } else if (k0 === "nthPrev()") {

            if (!o.__view__ || !o.id) return
            var nth = toValue({ _window, id, e, __, value: args[1], lookupActions, stack })
            return nthPrev({ _window, nth, o })

        } else if (k0 === "1stChild()" || k0 === "child()") {

            if (!o.__view__ || !o.id || !o.__childrenRef__[0]) return
            return views[o.__childrenRef__[0].id]

        } else if (k0 === "2ndChild()") {

            if (!o.__view__ || !o.id || !o.__childrenRef__[1]) return
            return views[o.__childrenRef__[1].id]

        } else if (k0 === "3rdChild()") {

            if (!o.__view__ || !o.id || !o.__childrenRef__[2]) return
            return views[o.__childrenRef__[2].id]

        } else if (k0 === "nthChild()") {

            if (!o.__view__ || !o.id) return
            var nth = toValue({ _window, __, value: args[1], e, id, stack, lookupActions })
            if (!isNumber(nth)) return
            if (!o.__childrenRef__[nth - 1]) return
            return views[o.__childrenRef__[nth - 1].id]

        } else if (k0 === "3rdLastChild()") {

            if (!o.__view__ || !o.id) return
            return views[o.__childrenRef__.slice(-3)[0].id]

        } else if (k0 === "2ndLastChild()") {

            if (!o.__view__ || !o.id) return
            return views[o.__childrenRef__.slice(-2)[0].id]

        } else if (k0 === "lastChild()") {

            if (!o.__view__ || !o.id) return
            return views[o.__childrenRef__.slice(-1)[0].id]

        } else if (k0 === "nthLastChild()") {

            if (!o.__view__ || !o.id) return
            var nth = toValue({ _window, __, value: args[1], e, id })
            if (!isNumber(nth)) return
            return views[o.__childrenRef__.slice(-1 * nth)[0].id]

        } else if (k0 === "children()") {

            if (!o.__view__ || !o.id) return
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
        }

        // OOP
        else if (actions[k0]) return actions[k0]({ _window, req, res, global, views, view, o, stack, pathJoined, lookupActions, id, e, __, args })


        else if (k0 === "installApp()") {

            const installApp = async () => {

                global.__installApp__.prompt();
                const { outcome } = await global.__installApp__.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
            }

            installApp()

        } else if (k0 === "clearTimer()") {

            var timer = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e }) || o
            answer = clearTimeout(timer)

        } else if (k0 === "clearInterval()") {

            var timer = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e }) || o
            answer = clearInterval(timer)

        } else if (k0 === "interval()") {

            if (!o.__view__) return
            if (!isNaN(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e }))) { // interval():params:timer

                var timer = parseInt(toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e }))
                var myFn = () => toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1], object })
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
            var myFn = () => { toParam({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object }) }

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

        } else if (k0 === "reduce()") { // o.reduce():[path=]

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, data: args[1], __ })
            if (Array.isArray(data)) data = { path: data }
            answer = reducer({ _window, lookupActions, stack, id, data: { path: data.path, object: o, key: data.data !== undefined ? true : key, value: data.data !== undefined ? data.data : value }, e, req, res, __ })

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

            if (!Array.isArray(o)) o = kernel({ req, res, _window, id, data: { data: _object, path: path.slice(0, i), value: [], key: true, object }, __, e })

            var item = toValue({ req, res, _window, lookupActions, stack, id, data: args[1], __, e, object })
            var index = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })

            if (!Array.isArray(o)) return
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

        } else if (k0 === "pullIndex()") { // pull by index

            // if no index pull the last element
            var lastIndex = 1, firstIndex = 0
            if (args[1]) firstIndex = toValue({ _window, id, data: args[1], __, e, object, lookupActions, stack })
            if (args[2]) lastIndex = toValue({ _window, id, data: args[2], __, e, object, lookupActions, stack })

            o.splice(firstIndex, lastIndex || 1)
            answer = o

        } else if (k0 === "pull()") { // pull by conditions

            var items = o.filter(o => toApproval({ _window, e, data: args[1], id, object: o, __, lookupActions, stack }))

            items.filter(data => data !== undefined && data !== null).map(_item => {
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index, 1)
            })

            return answer = o

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

        } else if (k0 === "removeDuplicates()") { // without condition and by condition. ex: removeDuplicates():number (it will remove items that has the same number value)

            if (args[1]) {

                var keys = toValue({ _window, e, data: args[1], id, __, lookupActions, stack })
                var list = []

                toArray(keys).map(key => {

                    var seen = new Set()

                    o.map(item => {
                        if (!seen.has(item[key])) {
                            seen.add(item[key])
                            list.push(item)
                        }
                    })
                })

                return answer = o = list

            } else {

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
            }

        } else if (k0 === "replace()") { // replace():prev:new

            if (!Array.isArray(o) && typeof o !== "string") o = kernel({ req, res, _window, id, data: { data: _object, path: path.slice(0, i), value: [], key: true, object }, __, e })

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
                var _index = o.findIndex((item, index) => isEqual(kernel({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], key, value, data: item }, e, __: [o, ...__] }), kernel({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], key, value, data: _data }, __: [o, ...__], e })))
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

                    var _index = o.findIndex((item, index) => isEqual(kernel({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], data: item }, __: [o, ...__], e }), kernel({ req, res, _window, lookupActions, stack, id, data: { path: _path || [], data: _data }, __: [o, ...__], e })))
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

        } else if (k0 === "toggleMode()") {

            document.documentElement.classList.toggle("darkmode")

        } else if (k0 === "export()") {

            var data = toLine({ _window, req, res, _window, id, e, __, data: { string: args[1] } }).data

            if (data.json) data.type = "json"
            if (data.csv) data.type = "csv"
            if (data.excel) data.type = "excel"
            if (data.pdf) data.type = "pdf"

            if (data.type === "json") exportJson(data)
            else if (data.type === "csv") require("./toCSV").toCSV(data)
            else if (data.type === "excel") require("./toExcel").toExcel(data)
            else if (data.type === "pdf") require("./toPdf").toPdf(data)

        } else if (k0 === "flat()") {

            if (typeof o === "object") {
                if (Array.isArray(o)) {
                    o = [...o]
                    answer = o.flat()
                } else {

                    if (typeof _object === "object") Object.entries(o).map(([key, value]) => _object[key] = value)
                    return _object
                }
            } else return o

        } else if (k0 === "action()") {

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            if (typeof data.path === "string") data.path = data.path.split(".")
            toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { path: data.path || data.action.split("."), view: data.view, data: data.data }, condition, object })

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

                toArray(o).map(o => toValue({ req, res, _window, lookupActions, stack, id, data: args[1] || "", object, __: [o, ...__], e }))
                answer = o

            } else if (args[1]) {

                answer = toArray(o).map(o => toValue({ req, res, _window, lookupActions, stack, id, data: args[1] || "", object: o, __, e }))

            } else if (args[2] && underScored) {

                breakRequest = true
                var address;
                ([...toArray(o)]).reverse().map(o => {
                    // address
                    address = addresser({ _window, id, stack, nextAddress: address, __: [o, ...__], lookupActions, data: { string: args[2] }, object }).address
                })

                // address
                if (address) toAwait({ _window, id, lookupActions, stack, address, __, req, res })

            } else if (args[2]) {

                breakRequest = true
                var address;
                ([...toArray(o)]).reverse().map(o => {
                    // address
                    address = addresser({ _window, id, stack, nextAddress: address, __, lookupActions, data: { string: args[2] }, object: o }).address
                })

                // address
                if (address) toAwait({ _window, id, lookupActions, stack, address, __, req, res })
            }

            stack.loop = false
            stack.broke = false

            if (notArray) return o

        } else if (k0 === "html2pdf()") {

            var { address, data } = addresser({ _window, stack, args, asynchronous: true, id: o.id, status: "Start", action: "html2pdf()", object, lookupActions, __, id })

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
                                    if (args[2]) require("./kernel").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __: [pdf, ...__] })
                                    window.devicePixelRatio = 1
                                })
                            }
                        })
                    })

                } else html2pdf().set(opt).from(_element).save().then((pdf) => {


                    // await params
                    if (args[2]) require("./kernel").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __: [pdf, ...__] })
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
            else if (data.window) _o = views.body
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
                if (_o.id !== "body") {

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

            if (!o.__view__) return
            require("./getCoords")({ id: o.id })

        } else if (k0 === "price()") {

            if (!isNumber(o)) return

            var data = toParam({ req, res, _window, lookupActions, stack, id, e, __, data: args[1] })
            if (!data.decimal) data.decimal = 2
            var formatter = new Intl.NumberFormat("en", {
                style: 'decimal',
                decimal: data.decimal,
            })

            answer = formatter.format(parseFloat(o))

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

            if (!o.__indexed__ && o.__loop__) answer = o.__loopIndex__
            else if (!o.__indexed__) answer = o.__childIndex__
            else answer = o.__index__

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

        } else if (k0 === "droplist()") {

            var { address, data } = addresser({ _window, stack, args, id: o.id, interpreting: true, status: "Start", action: "droplist()", object, lookupActions, __, id })
            require("./droplist").droplist({ id, e, data, __, stack, lookupActions, address })

        } else if (k0 === "route()") {

            var { address, data } = addresser({ _window, stack, args, interpreting: true, status: "Start", type: "action", asynchronous: true, id: o.id, action: "route()", object, lookupActions, __, id })
            if (typeof data === "string") data = { route: data }

            require("./route").route({ _window, lookupActions, stack, address, id, req, res, data: { type: "route", route: { __: data.data !== undefined ? [data.data] : [] } }, __ })

        } else if (k0 === "root()") {

            var { address, data } = addresser({ _window, stack, args, interpreting: true, status: "Start", type: "action", dataInterpretAction: "toValue", blockable: false, renderer: true, id: o.id, action: "root()", object, lookupActions, __, id })
            if (typeof data === "string") data = { page: data }

            require("./root").root({ _window, lookupActions, stack, address, id, req, res, root: data, __ })

        } else if (k0 === "update()") {

            if (!o.__view__) return o

            var { address, data = {} } = addresser({ _window, stack, args, interpreting: true, status: "Start", type: "action", dataInterpretAction: "toValue", renderer: true, blockable: false, id: o.id, action: "update()", object, lookupActions, __, id })
            update({ _window, lookupActions, stack, req, res, id, address, __, data: { id: data.id || o.id, ...data } })

        } else if (k0 === "insert()") {

            if (!o.__view__) return o

            // wait address
            var { address, data = {} } = addresser({ _window, stack, args, interpreting: true, status: "Start", type: "action", renderer: true, id: o.id, action: "insert()", lookupActions, __, id })
            insert({ id, lookupActions, stack, address, __, insert: { ...data, parent: o.id } })

        } else if (k0 === "confirmEmail()") {

            var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, action: "confirmEmail()", object, lookupActions, __, id })
            data.store = "confirmEmail"
            require("./save").save({ id, lookupActions, stack, address, e, __, save: data })

        } else if (k0 === "mail()") {

            if (!o.__view__) return o

            // wait address
            var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, action: "mail()", object, lookupActions, __, id })

            require("./mail").mail({ req, res, _window, lookupActions, stack, address, id, e, __, data })
            return true

        } else if (k0 === "print()") {

        } else if (k0 === "files()") {

            return [...(o.__element__.files || [])]

        } else if (k0 === "file()") {

            return (o.__element__.files || [])[0]

        } else if (k0 === "read()") {

            // wait address
            var { address, data, action } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, action: "mail()", object, lookupActions, __, id, dataInterpretAction: "conditional" })

            if (!data) return
            if (action === "toValue") data.file = data

            fileReader({ req, res, _window, lookupActions, stack, address, id, e, __, data })

        } else if (k0 === "upload()") {

            var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, type: "Data", action: "upload()", object, lookupActions, __, id })
            require("./upload")({ _window, lookupActions, stack, address, req, res, id, e, upload: data, __ })

        } else if (k0 === "search()") {

            var { address, data } = addresser({ _window, stack, args, req, res, status: "Start", asynchronous: true, id: o.id, type: "Data", action: "search()", object, lookupActions, __, id })
            // var data = searchParams({ _window, lookupActions, stack, address, id, e, __, req, res, string: args[1], object })
            require("./search").search({ _window, lookupActions, stack, address, id, e, __, req, res, data })
            return true

        } else if (k0 === "erase()") {

            var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, type: "Data", action: "erase()", object, lookupActions, __, id })
            require("./erase").erase({ _window, lookupActions, stack, address, id, e, __, req, res, erase: data })
            return true

        } else if (k0 === "save()") {

            var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, type: "Data", action: "save()", object, lookupActions, __, id })
            require("./save").save({ _window, lookupActions, stack, address, id, e, __, req, res, save: data })
            return true

        } else if (k0 === "start()") {

            var address = stack.addresses.find(address => address.id === stack.interpretingAddressID)
            address.starter = true
            var startID = generate()
            global.__startAddresses__[startID] = { id: startID, address }

            stack.logs.push(`${stack.logs.length} Starter STACK ${stack.id} ${stack.event.toUpperCase()} ${stack.string}`)

            return startID

        } else if (k0 === "end()") {

            var { data = {} } = toLine({ req, res, _window, lookupActions, stack, id, e, __, data: { string: args[1] }, action: "toParam" })
            endAddress({ req, res, _window, lookupActions, stack, id, e, __, data })

        } else if (k0 === "send()") {

            breakRequest = true
            if (!res || res.headersSent) return

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

            stack.terminated = true

            // logs
            console.log("Send " + stack.route + " (" + executionDuration + ")")
            stack.logs.push(stack.logs.length + " Send " + stack.route + " (" + executionDuration + ")")
            response.logs = stack.logs

            // respond
            res.setHeader('Content-Type', 'application/json')
            res.write(JSON.stringify(response));
            res.end()

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

        } else if (k0 === "toggleClass()") {

            if (!o.__view__) return o
            var _class = toValue({ req, res, _window, lookupActions, stack, id, e, __: [o, ...__], data: args[1] })
            if (o.__element__) answer = o.__element__.classList.toggle(_class)

        } else if (k0 === "encodeURI()") {

            answer = encodeURI(o)

        } else if (k0 === "preventDefault()") {

            e.preventDefault()

        } else if (k0 === "decodeURI()") {

            answer = decodeURI(o)

        } else if (k0.slice(-2) === "()" && typeof o[k0.slice(0, -2)] === "function") {

            var data = []
            args.slice(1).map(arg => {
                data.push(toValue({ req, res, _window, lookupActions, stack, id, e, __, data: arg || "" }))
            })

            answer = o[k0.slice(0, -2)](...data)

        } else if (k0.slice(-2) === "()") { // action_name()

            if (k0.charAt(0) === "@" && k0.length == 6) k0 = toValue({ req, res, _window, id, e, __, data: k0, object })

            if (underScored) {
                answer = toAction({ _window, lookupActions, stack, id, req, res, __: [o, ...__], e, data: { action: k }, condition, object })
            } else {
                answer = toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { action: k }, condition, object: object || o })
            }

        } else if (k.includes(":@")) {

            breakRequest = true

            // decode
            if (k0.charAt(0) === "@" && k0.length == 6) k0 = global.__refs__["@" + k0.slice(-5)].data

            o[k0] = o[k0] || {}

            if (events.includes(k0)) {

                if (!o.__view__) return

                var data = global.__refs__["@" + args[1].slice(-5)].data

                /*if (views[id].__status__ === "Mounted") return require("./event").addEventListener({ event: k0 + "?" + data, id, __, lookupActions, eventID: o.id })
                else*/ return views[id].__controls__.push({ event: k0 + "?" + data, id, __, lookupActions, eventID: o.id })
            }

            args[1] = (global.__refs__[args[1]].data || "").split(".")
            if (args[1]) answer = reducer({ req, res, _window, lookupActions, stack, id, e, data: { path: [...args.slice(1).flat(), ...path.slice(i + 1)], object: o[k0] }, __ })
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

const toValue = ({ _window, lookupActions = [], stack = {}, data: value, __, id, e, req, res, object, mount, condition, isValue }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global

    if (!value) return value

    // coded
    if (value.charAt(0) === "@" && value.length == 6 && global.__refs__[value].type === "text") return global.__refs__[value].data
    if (value.charAt(0) === "@" && value.length == 6) value = global.__refs__[value].data

    // value is a param it has key=value
    if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, stack, e, data: value, __, object, mount: !isValue && mount, condition })

    // value?condition?value
    if (value.split("?").length > 1) return toLine({ _window, lookupActions, stack, id, e, data: { string: value }, req, res, mount, __, condition, object, action: "toValue" }).data

    // no value
    if (value === "()") return views[id]
    else if (value === ".") return object !== undefined ? object : views[id]
    else if (value === undefined) return generate()
    else if (value === "undefined") return undefined
    else if (value === "false") return false
    else if (value === "true") return true
    else if (value === "device()") return global.manifest.device.device
    else if (value === "desktop()") return global.manifest.device.device.type === "desktop"
    else if (value === "tablet()") return global.manifest.device.device.type === "tablet"
    else if (value === "mobile()") return global.manifest.device.device.type === "smartphone"
    else if (value === "tv()") return global.manifest.device.device.type === "tv"
    else if (value === "clicked()") return global.__clicked__
    else if (value === "focused()") return global.__focused__
    else if (value === "today()") return new Date()
    else if (value === "null") return null
    else if (value.charAt(0) === "_" && !value.split("_").find(i => i !== "_" && i !== "")) return __[value.split("_").length - 2]
    else if (value === "[]") return ({})
    else if (value === ":[]") return ([{}])
    else if (value === " ") return value
    else if (value === ":") return ([])
    else if (value.charAt(0) === ":") return value.split(":").slice(1).map(item => toValue({ req, res, _window, id, stack, lookupActions, __, e, data: item })) // :item1:item2

    // show loader
    if (value === "loader.show") {
        document.getElementById("loader-container").style.display = "flex"
        return sleep(10)
    }

    // hide loader
    if (value === "loader.hide") {
        document.getElementById("loader-container").style.display = "none"
        return sleep(10)
    }

    if (value.includes("||")) { // or
        var answer
        value.split("||").map(value => {
            if (!answer) {
                answer = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount, condition })
            }
        })
        return answer
    }

    // calculations
    if (global.__calcTests__[value] !== false) {

        if (value.includes("+")) { // addition

            // increment
            if (value.slice(-2) === "++") {

                value = value.slice(0, -2)
                value = `${value}=${value}+1`
                toParam({ req, res, _window, lookupActions, id, e, data: value, __, object, mount, condition })
                return (toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount, condition }) - 1)

            } else {

                var allAreNumbers = true, allAreArrays = true, allAreObjects = true
                var values = value.split("+").map(value => {

                    var _value = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount })

                    if (allAreNumbers) {

                        allAreArrays = false
                        allAreObjects = false
                        if (isNumber(value) || (executable({ _window, string: value }) && typeof _value === "number")) allAreNumbers = true
                        else allAreNumbers = false

                    } else if (allAreArrays) {

                        allAreNumbers = false
                        allAreObjects = false
                        if (Array.isArray(_value)) allAreNumbers = true
                        else allAreArrays = false

                    } else if (allAreObjects) {

                        allAreNumbers = false
                        allAreArrays = false
                        if (typeof _value === "object") allAreNumbers = true
                        else allAreObjects = false
                    }

                    return _value
                })

                if (allAreNumbers) {

                    var value = 0
                    values.map(val => value += (parseFloat(val) || 0))
                    return value

                } else if (allAreArrays) {

                    var array = []
                    values.map(arr => array = array.concat(arr))
                    return array

                } else if (allAreObjects) {

                    var object = {}
                    values.map(obj => object = { ...object, ...obj })
                    return object

                } else {

                    var value = ""
                    values.map(val => value += val + "")
                    return value
                }
            }
        }

        if (value.includes("-")) { // subtraction

            var _value = calcSubs({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition })
            if (_value !== value) return _value
        }

        if (value.includes("*") && value.split("*")[1] !== "") { // multiplication

            var values = value.split("*").map(value => toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, mount, condition }))
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
            return value = newVal
        }

        if (value.includes("/") && value.split("/")[1] !== "") { // division

            var _value = calcDivision({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition })
            if (_value !== value && _value !== undefined) return _value
        }

        if (value.includes("%") && value.split("%")[1] !== "") { // modulo

            var _value = calcModulo({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition })
            if (_value !== value && _value !== undefined) return _value
        }
    }

    var path = typeof value === "string" ? value.split(".") : []

    /* value */
    if (isNumber(value)) value = parseFloat(value)
    else if (object || path[0].includes(":") || path[0].includes("()") || path[0].includes("@") || path[1])
        value = reducer({ _window, lookupActions, stack, id, data: { path, value, object }, __, e, req, res, mount })

    return value
}

const toParam = ({ _window, lookupActions, stack = {}, data: string, e, id, req, res, mount, object, __, condition }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = views[id] || { id, __view__: true }

    var params = object || {}

    // returned
    if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.broke || stack.blocked) return

    if (typeof string !== "string" || !string) return string || {}

    // decode
    if (string.charAt(0) === "@" && string.length == 6 && global.__refs__[string].type === "text") return global.__refs__[string].data
    if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data

    // check event else interpret
    if (string.split("?").length > 1) {

        // check if event
        if (isEvent({ _window, string })) return toEvent({ _window, string, id, __, lookupActions })

        // line interpreter
        return toLine({ _window, lookupActions, stack, id, e, data: { string }, req, res, mount, __, condition, object, action: "toParam" }).data
    }

    // conditions
    if (condition || isCondition({ _window, string })) return toApproval({ id, lookupActions, stack, e, data: string, req, res, _window, __, object })

    string.split(";").map(param => {

        // case id was changed during rendering
        id = view.id

        // no param || returned || comment
        if (!param || (stack.returns && stack.returns[0] || {}).returned || param.charAt(0) === "#" || stack.terminated || stack.broke || stack.blocked) return

        var key, value

        // =
        if (param.includes("=")) {

            key = param.split("=")[0]
            value = param.substring(key.length + 1)

        } else key = param

        // key = key1 = ... = value
        if (value && value.includes("=")) {

            value = param.split("=").at(-1)
            param = param.slice(0, value.length * (-1) - 1)

            var newParam = key + "=" + value
            param.split("=").slice(1).map(key => { newParam += ";" + key + "=" + value })
            return params = { ...params, ...toParam({ _window, lookupActions, stack, data: param, e, id, req, res, mount, object, __, condition }) }
        }

        // increment
        if (key && value === undefined && key.slice(-2) === "++") {
            key = key.slice(0, -2)
            value = parseFloat(toValue({ _window, lookupActions, stack, req, res, id, e, data: key, __, condition, object }) || 0) + 1
        }

        // decrement
        else if (key && value === undefined && key.slice(-2) === "--") {
            key = key.slice(0, -2)
            value = parseFloat(toValue({ _window, lookupActions, stack, req, res, id, e, data: key, __, condition, object }) || 0) - 1
        }

        // ||=
        else if (key && value && key.slice(-2) === "||") {
            key = key.slice(0, -2)
            value = `${key}||${value}`
        }

        // +=
        else if (key && value && key.slice(-1) === "+") {

            key = key.slice(0, -1)
            var myVal = (key.slice(0, 2) === "()" || key.slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
            var data = `[${myVal}||[if():[type():[${value}]=number]:0.elif():[type():[${value}]=map]:[].elif():[type():[${value}]=list]:[:]:'']]`
            data = toCode({ _window, id, string: toCode({ _window, id, string: data, start: "'" }) })
            value = `${data}+${value}`
        }

        // -=
        else if (key && value && key.slice(-1) === "-") {

            key = key.slice(0, -1)
            var myVal = (key.slice(0, 2) === "()" || key.slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
            var data = toCode({ _window, id, string: `[${myVal}||0]` })
            var data1 = toCode({ _window, id, string: `[${value}||0]` })
            value = `${data}-${data1}`
        }

        // *=
        else if (key && value && key.slice(-1) === "*") {

            key = key.slice(0, -1)
            var myVal = (key.slice(0, 2) === "()" || key.slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
            var data = toCode({ _window, id, string: `[${myVal}||0]` })
            value = `${data}*${value}`
        }

        // !key
        if (param.slice(0, 1) === "!" && value === undefined) {
            value = false
            key = key.slice(1)
        }

        // show loader
        if (param === "loader.show" && !_window) {
            if (!document.getElementById("loader-container") || document.getElementById("loader-container").style.display === "flex") return
            document.getElementById("loader-container").style.display = "flex"
            return sleep(30)
        }

        // hide loader
        if (param === "loader.hide" && !_window) {
            if (!document.getElementById("loader-container")) return
            document.getElementById("loader-container").style.display = "none"
            return
        }

        var path = typeof key === "string" ? key.split(".") : [], args = path[0].split(":"), path0 = path[0].split(":")[0]

        // .value => inherit object
        var inheritObject = false
        if (typeof value === "string" && value.charAt(0) === "." && (value.includes("()") || isNaN(value.charAt(1)))) inheritObject = true

        // interpret value
        if (typeof value === "string") {

            value = toValue({ _window, lookupActions, stack, req, res, id, e, data: value, __, condition, object: inheritObject ? object : undefined, isValue: true, key, param })
            if (value && typeof value === "string") value = replaceNbsps(value)

        } else if (value === undefined) value = generate()

        // :@1asd1
        if (path0 === "") return

        // action()
        if (path0.slice(-2) === "()") {
            var action = toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { action: path[0] }, condition, mount, object })
            if (action !== "__continue__" && typeof action === "object" && !Array.isArray(action)) override(params, action)
            if (action !== "__continue__") return
        }

        // if()
        if (path0 === "if()") {

            var data = {}
            var approved = toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })

            if (!approved) {

                if (args[3]) {

                    data = toParam({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object, mount })
                    path.shift()

                } else if (path[1] && path[1].includes("elif()")) {

                    path.shift()
                    path[0] = path[0].slice(2)
                    data = toParam({ _window, lookupActions, stack, id, data: path.join("."), __, e, req, res, mount, condition })
                }

                if (data) params = override(params, data)
                return data

            } else {

                data = toParam({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object, mount })

                path.shift()

                // remove elses and elifs
                while (path[0] && path[0].includes("elif()")) { path.shift() }

                // empty path
                if (!path[0]) return params = override(params, data)
            }

            return kernel({ _window, lookupActions, stack, id, __, e, req, res, mount, condition, data: { data, path, value, key, object, pathJoined: param } })
        }

        // reduce
        if (path0.slice(-2) === "()" || path[0].slice(-3) === ":()" || path[0].slice(0, 3) === "():" || path[0].includes("_") || object)
            reducer({ _window, lookupActions, stack, id, data: { path, value, key, object }, e, req, res, __, mount, condition, action: "toParam" })
        else kernel({ _window, lookupActions, stack, id, data: { path, value, key, data: (mount ? view : params) }, e, req, res, __, mount, condition, action: "toParam" })

        /////////////////////////////////////////// path & data & doc ///////////////////////////////////////////////

        if (mount) {

            // mount data directly when found
            if (key === "doc" || key === "data") {

                view.__dataPath__ = []
                view.doc = view.doc || generate()
                global[view.doc] = view.data = global[view.doc] || {}
            }

            // mount path directly when found
            else if (key === "path" && view.path.toString().charAt(0) !== "/") {

                var dataPath = view.path

                // setup doc
                if (!view.doc) {

                    view.doc = generate()
                    global[view.doc] = view.data || {}
                }

                // list path
                var myPath = (typeof dataPath === "string" || typeof dataPath === "number") ? dataPath.toString().split(".") : dataPath || []

                // push path to __dataPath__
                view.__dataPath__.push(...myPath)
                view.data = kernel({ _window, id, stack, __, lookupActions, data: { path: view.__dataPath__, data: global[view.doc], value: view.data, key: true } })

            } else if (view.id !== id) {

                if (views[view.id]) views[view.id] += "_" + generate()
                Object.assign(views, { [view.id]: views[id] })
                id = view.id
            }
        }
    })

    return params
}

const reducer = ({ _window, lookupActions = [], stack = {}, id, data: { path, value, key, object }, __, e, req, res, condition, action }) => {

    if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.blocked || stack.broke) return

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = views[id] || { id, __view__: true }

    // path is a string
    if (typeof path === "string") path = path.split(".")
    // path is a number
    if (typeof path === "number") path = [path]

    var pathJoined = path.join(".")

    // init
    var path0 = path[0] ? path[0].toString().split(":")[0] : "", args
    if (path[0] !== undefined) args = path[0].toString().split(":")

    // toParam
    if (isParam({ _window, string: pathJoined })) return toParam({ req, res, _window, lookupActions, stack, id, e, data: pathJoined, __, object })

    // toValue
    if (isCalc({ _window, string: pathJoined }) && !key) return toValue({ _window, lookupActions, stack, data: pathJoined, __, id, e, req, res, object, condition })

    // [actions?conditions?elseActions]():[params]:[waits]
    else if (path0.length === 8 && path0.slice(-2) === "()" && path0.charAt(0) === "@") {

        var { address, data } = addresser({ _window, stack, args, id, type: "action", action: "[...]()", data: { string: global.__refs__[path0.slice(0, -2)].data, dblExecute: true }, __, lookupActions, id, object })

        return toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: data }).data
    }

    // if()
    else if (path0 === "if()") {

        var data
        var approved = toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })

        if (!approved) {

            if (args[3]) {

                if (condition) return toApproval({ _window, lookupActions, stack, e, data: args[3], id, __, req, res, object })
                else return toValue({ req, res, _window, lookupActions, stack, id, data: args[3], __, e, object })

            } else if (path[1] && path[1].includes("elif()")) {

                path.shift()
                path[0] = path[0].slice(2)
                return reducer({ _window, lookupActions, stack, id, data: { path, object, value, key }, __, e, req, res, condition })

            } else return data

        } else {

            if (condition) return toApproval({ _window, lookupActions, stack, e, data: args[2], id, __, req, res, object })
            if (path[1]) data = toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })
            else return toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })

            path.shift()

            // remove elses and elifs
            while (path[0] && path[0].includes("elif()")) { path.shift() }

            // empty path
            if (!path[0]) return data
        }

        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data, path, value, key, object, pathJoined } })
    }

    // while()
    else if (path0 === "while()") {

        while (toApproval({ _window, lookupActions, stack, e, data: args[1], id, __, req, res, object })) {
            toValue({ req, res, _window, lookupActions, stack, id, data: args[2], __, e, object })
        }
        // path = path.slice(1)
        return global.return = false
    }

    // global:()
    else if (path0 && args[1] === "()" && !args[2]) {

        const globalVariable = toValue({ req, res, _window, id, e, data: args[0], __, stack, lookupActions })
        if (path.length === 1 && key && globalVariable) return global[globalVariable] = value

        path.splice(0, 1, globalVariable)
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: global, path, value, key, object, pathJoined } })
    }

    // view => ():id
    else if (path0 === "()" && args[1]) {

        // id
        var customID = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __, object })
        path.shift()
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: views[customID || args[1] || id], path, value, key, object, pathJoined } })
    }

    // .keyName => [object||view].keyName
    else if (path[0] === "" && path.length > 1) {

        if (isNaN(path[1].charAt(0)) || path[1].includes("()")) {

            path.shift()
            return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: object || view, path, value, key, object, pathJoined } })

        } else return path.join(".")
    }

    // @coded
    else if (path0.charAt(0) === "@" && path[0].length === 6) {

        var data

        // text in square bracket
        if (global.__refs__[path[0]].type === "text") return global.__refs__[path[0]].data
        else data = toLine({ _window, req, res, lookupActions, stack, object, id, data: { string: global.__refs__[path[0]].data }, __, e }).data

        if (path[1] === "flat()") {

            if (Array.isArray(data)) {

                data = [...data]
                return data.flat()

            } else {

                if (typeof object === "object") return override(object, data)
                return object
            }

        } else {

            if (!path[1] && typeof object === "object" && key && value !== undefined) {

                object[data] = value
                return object[data]

            } else if (path[1]) {

                path.splice(0, 1)
                return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data, path, value, key, object, pathJoined } })

            } else return data
        }
    }

    // action()
    else if (path0.slice(-2) === "()") {

        var action = toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { action: path[0] }, condition, object })
        if (action !== "__continue__") {

            path.shift()
            return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: action, path, value, key, object, pathJoined } })
        }
    }

    if (path0 === "className()") {
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: views.document, path, value, key, object, pathJoined } })
    } else {
        var __o = ((typeof object === "object" && object.__view__) ? object : view) || {}
        if (__o.__labeled__ && (path0.toLowerCase().includes("prev") || path0.toLowerCase().includes("next") || path0.toLowerCase().includes("parent"))) {

            if (__o.__featured__) path = ["2ndParent()", ...path]
            else path.unshift("parent()")

        } else if (__o.__islabel__ && path0 === "txt()" || path0 === "min()" || path0 === "max()" || path0 === "readonly()" || path0 === "editable()") path.unshift("input()")
    }

    // assign reserved vars
    var reservedVars = {
        keys: ["()", "global()", "e()", "console()", "string()", "object()", "array()", "document()", "window()", "win()", "history()", "navigator()", "nav()", "request()", "response()", "req()", "res()", "math()"],
        "()": view,
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

    // assign
    var underScored = path0 && path0.charAt(0) === "_" && !path0.split("_").find(i => i !== "_" && i !== "")
    if (reservedVars.keys.includes(path0) || underScored) {

        var data
        if (reservedVars.keys.includes(path0)) data = reservedVars[path0]
        else data = __[path0.split("_").length - 2]

        path.shift()
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data, path, value, key, object, pathJoined } })

    } else if (object) return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: object, path, value, key, object, pathJoined } })

    // still no data
    if ((path[0] && object && object.__view__) || (path0 && path0.includes("()"))) {

        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: view, path, value, key, object, pathJoined } })

    } else if (path[1] && path[1].toString().includes("()")) {

        var data = toValue({ req, res, _window, lookupActions, stack, id, __, e, data: path[0] }) || {}
        path.shift()
        return kernel({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data, path, value, key, object, pathJoined } })

    } else return pathJoined
}

const toApproval = ({ _window, lookupActions, stack, e, data: string, id, __, req, res, object }) => {

    // no string but object exists
    if (!string)
        if (object) return true
        else if (object !== undefined) return false

    // no string
    if (!string || typeof string !== "string") return true

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = views[id], approval = true

    if ((stack.returns && stack.returns[0] || {}).returned) return

    // coded
    if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data

    // ==
    string = string.replace("==", "=")

    string.split(";").map(condition => {

        // no condition
        if (condition === "") return true
        if (!approval) return false

        if (condition.charAt(0) === "#") return

        // or
        if (condition.includes("||")) {

            var conditions = condition.split("||"), i = 0
            var key = conditions[0].split("=")[0]
            if (key.at(-1) === "!") key = key.slice(0, -1)
            approval = false

            while (!approval && conditions[i] !== undefined) {
                if (conditions[i].charAt(0) === "=" || conditions[i].slice(0, 2) === "!=") conditions[i] = key + conditions[i]
                approval = toApproval({ _window, lookupActions, stack, e, data: conditions[i], id, __, req, res, object })
                i += 1
            }

            return approval
        }

        condition = condition.split("=")
        var equalOp = condition.length > 1
        var greaterOp = condition[0].split(">")[1] !== undefined
        if (greaterOp) {
            condition[1] = condition[1] || condition[0].split(">")[1]
            condition[0] = condition[0].split(">")[0]
        }
        var lessOp = condition[0].split("<")[1] !== undefined
        if (lessOp) {
            condition[1] = condition[1] || condition[0].split("<")[1]
            condition[0] = condition[0].split("<")[0]
        }

        var key = condition[0] || ""
        var value = condition[1]
        var notEqual

        // get value
        if (value) value = toValue({ _window, lookupActions, stack, id, data: value, e, __, req, res, condition: true })

        // encoded
        if (key.charAt(0) === "@" && key.length == 6 && global.__refs__[key].type === "text") {
            if (value === undefined) return approval = global.__refs__[key].data ? true : false
            else return approval = global.__refs__[key].data === value
        }

        if (key.charAt(0) === "@" && key.length == 6) key = global.__refs__[key].data

        // operator has !
        if (key.at(0) === "!" || key.at(-1) === "!") {
            if (key.at(-1) === "!") {

                if (condition[1]) {
                    notEqual = true
                    key = key.split("!")[0]
                }

            } else {

                key = key.split("!")[1]
                notEqual = true
            }
        }

        var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0]

        // action
        if (path0.slice(-2) === "()") {
            var isAction = toAction({ _window, lookupActions, stack, id, req, res, __, e, data: { action: path[0] }, condition: true });
            if (isAction !== "__continue__") return approval = notEqual ? !isAction : isAction
        }

        // get key
        if (object || key.includes("()")) key = toValue({ _window, lookupActions, stack, id, data: key, e, __, req, res, object, condition: true })
        else key = toValue({ _window, lookupActions, stack, id, data: key, e, __, req, res, object: object !== undefined ? object : view, condition: true })

        // evaluate
        if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !key : (key === 0 ? true : key)
        else {

            if (equalOp) approval = notEqual ? !isEqual(key, value) : isEqual(key, value)
            if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(key) > parseFloat(value)) : (parseFloat(key) > parseFloat(value))
            if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(key) < parseFloat(value)) : (parseFloat(key) < parseFloat(value))
        }
    })
    return approval
}

const toAction = ({ _window, id, req, res, __, e, data: { action, path, view: customViewName, data: passedData }, condition, mount, object, lookupActions = {}, stack }) => {

    const global = _window ? _window.global : window.global
    const views = _window ? _window.views : window.views
    var view = views[id]

    var serverAction = false, actionFound = false, serverActionView
    var action0 = path ? (path.at(-1) + "()") : action.split(":")[0], name = action0.slice(0, -2)

    if (path || (action0.slice(-2) === "()" && action0 !== "()" && action0 !== "_()" && !require("./actions.json").includes(action0) && action0.charAt(0) !== "@")) {

        if (!view) return
        var newLookupActions

        // call by action():[path;view;data]
        if (path) {

            // no view name
            if (!customViewName || global.data.view[customViewName]) return

            if (!global.data.view[customViewName].__secure__) {

                var actions = (global.data.view[customViewName] || {}).functions
                actionFound = clone(path).reduce((o, k) => o && o[k], actions)

                // action doesnot exist
                if (actionFound === undefined) return

                if (typeof actionFound === "object" && actionFound._) {

                    actionFound = actionFound._ || ""
                    newLookupActions = [{ type: "customView", view: viewAction, path }]

                } else if (path.length > 1) newLookupActions = [{ type: "customView", view: viewAction, path: path.slice(0, -1) }]

                if (toArray(lookupActions).length > 1) newLookupActions = [...newLookupActions, ...toArray(lookupActions)]

                //
                action = action0

            } else {

                // server action
                serverAction = true
                serverActionView = customViewName
                newLookupActions = []
            }
        }

        // lookup through parent map actions
        if (!actionFound) {
            toArray(lookupActions).map((lookupActions, indexx) => {

                if (lookupActions.path) {

                    var path = lookupActions.path
                    clone(path).reverse().map((x, i) => {

                        if (!actionFound) {

                            var actions = global.data.view[lookupActions.view].functions || {}
                            actionFound = clone(path.slice(0, path.length - i).reduce((o, k) => o[k], actions)[name])

                            if (actionFound) {

                                if (typeof actionFound === "object" && actionFound._) {

                                    actionFound = actionFound._ || ""
                                    newLookupActions = [{ type: "customView", view: lookupActions.view, path: [...path.slice(0, path.length - i), name] }]
                                    if (toArray(lookupActions).length > 1) newLookupActions = [...newLookupActions, ...toArray(lookupActions).slice(indexx)]

                                } else if (toArray(lookupActions).length > 1) toArray(lookupActions).slice(indexx)

                            }
                        }
                    })
                }
            })
        }

        // lookup through head customView actions => server actions
        if (!actionFound) {
            clone(view.__lookupViewActions__).reverse().map(lookupViewActions => {

                if (!actionFound) {

                    var actions = {}
                    if (lookupViewActions.type === "customView") {

                        var customView = global.data.view[lookupViewActions.view]

                        actions = customView.functions || {}

                        if (name in actions) {

                            if (customView._secure_ && !stack.server) {

                                // server action
                                actionFound = true
                                serverAction = true
                                serverActionView = lookupViewActions.view
                                newLookupActions = []

                            } else {

                                actionFound = clone(actions[name])

                                if (typeof actionFound === "object") {

                                    actionFound = actionFound._ || ""
                                    newLookupActions = [{ type: lookupViewActions.type, view: lookupViewActions.view, path: [name] }]
                                }
                            }
                        }

                    } else if (lookupViewActions.type === "view") { }
                }
            })
        }

        if (actionFound) {

            var { address, data } = addresser({ _window, req, res, stack, args: action.split(":"), newLookupActions: newLookupActions || lookupActions, asynchronous: serverAction, e, id, data: { string: serverAction ? "" : actionFound }, action: action0, __, id, object, mount, condition, lookupActions })

            // data passed from action():[action;path;data]
            if (passedData !== undefined) data = passedData

            // server action
            if (serverAction) {

                address.status = "Start"
                var route = { action: action0, customView: serverActionView, __: data !== undefined ? [data] : [], lookupActions: [], stack: [], condition, object }
                return require("./route").route({ _window, req, res, id, e, data: { type: "action", route }, __, stack, lookupActions, address })
            }

            return toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: data }).data
        }
    }

    return "__continue__"
}

const toLine = ({ _window, lookupActions, stack, address = {}, id, e, data: { string, dblExecute, index: i = 0, splitter = "?" }, req, res, __, mount, condition, object, action }) => {

    const global = _window ? _window.global : window.global
    var view = _window ? _window.views[id] : window.views[id]

    // missing stack or __
    if (!stack) stack = { addresses: [], returns: [] }
    if (!__) __ = view.__

    var startTime = (new Date()).getTime(), success = true, data, returnForWaitActionExists = false, conditionsNotApplied = false, message = ""

    // splitter is for ? or :
    // i is for using name?params?conditions?elseparams

    var terminator = ({ data, order }) => {

        if (stack.terminated || !address.id) return data

        address.interpreting = false

        // execute waits
        toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: returnForWaitActionExists ? data.data : undefined })

        return data
    }

    if (stack.terminated || stack.broke || stack.blocked) return terminator({ data: { success: false, message: `Action terminated!`, executionDuration: 0 }, order: 0 })
    if (!string) return terminator({ data: { success: true, message: `No action to execute!`, executionDuration: 0 }, order: 1 })

    // encode
    string = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    // decode
    if (string.charAt(0) === "@" && string.length === 6) {

        // data is text
        if (global.__refs__[string].type === "text")
            return terminator({ data: { data: global.__refs__[string].data, success: true, message: `No action to execute!`, executionDuration: 0 }, order: 2 })

        string = global.__refs__[string].data
        if (action) object = {}
    }

    // check event
    if (string.split("?").length > 1 && isEvent({ _window, string })) return toEvent({ _window, string, id, __, lookupActions })

    // subparams
    if (i === 1) {

        // list
        var substring = string.split(splitter)[0]
        if (!substring) return terminator({ data: { success: false, message: `Missing name!`, executionDuration: 0 }, order: 3 })

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // name has subparams => interpret
        if (substring.includes("?")) {

            var data = toLine({ lookupActions, stack, id, e, data: { string: substring, i: 1 }, req, res, __, mount, condition, object })
            if (data.conditionsNotApplied) return terminator({ data, order: 4 })
        }
    }

    var stringList = string.split(splitter)
    var elseIfList = string.split("??")

    if (splitter === "?" && elseIfList[1]) {

        // case: key=value??elseValue (condition is the key)
        if (elseIfList[1] && !elseIfList[0].split("?")[1] && elseIfList[0].split("=")[1]) {

            var key = elseIfList[0].split("=")[0]
            string = toCode({ _window, id, string: key + "=[" + elseIfList[0].split("=").slice(1).join("=") + "?" + key + "?" + elseIfList.slice(1).join("?") + "]" })

            // case: key=value?condition??value1?condition1??value2?condition2 (?? is elseif)
        } else if (elseIfList[1] && elseIfList[0].split("?")[1]) {

            string = elseIfList.at(-1)
            elseIfList.slice(0, -1).reverse().map(elseIf => string = elseIf + "?[" + string + "]")
            console.log(string);
            string = toCode({ _window, id, string })
        }

        stringList = string.split("?")
    }

    var conditions = stringList[i + 1]
    var elseParams = stringList[i + 2]
    string = stringList[i + 0]

    var approved = toApproval({ _window, data: conditions || "", id, e, req, res, __, stack, lookupActions, object })

    if (!approved && elseParams) {

        string = elseParams
        message = "Else actions executed!"
        conditionsNotApplied = true

    } else if (!approved) return ({ success, message: `Conditions not applied!`, conditionsNotApplied: true, executionDuration: (new Date()).getTime() - startTime })
    else message = `Action executed successfully!`

    var actionReturnID = generate(), data
    stack.returns.unshift({ id: actionReturnID })

    // no params
    if (!string) message = "No actions to execute!"

    if (!action || condition) {

        action = "toValue"
        if (!dblExecute && (condition || isCondition({ _window, string: data }))) action = "toApproval"
        else if (!dblExecute && mount) action = "toParam"

    } else if (action === "conditional") {

        if (isParam({ _window, string })) action = "toParam"
        else action = "toValue"
    }

    if (action === "toValue") data = toValue({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object })
    else if (action === "toApproval") data = toApproval({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object })
    else if (action === "toParam") data = toParam({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object })

    if (dblExecute && executable({ _window, string: data }))
        data = toLine({ _window, lookupActions, stack, id, e, data: { string: data }, req, res, __, mount, condition, object }).data

    if (stack.returns && stack.returns[0].returned) {
        returnForWaitActionExists = true
        data = stack.returns[0].data
    }

    // remove return address
    stack.returns.splice(stack.returns.findIndex(ret => ret.id === actionReturnID), 1)

    return terminator({ data: { success, message, data, action, conditionsNotApplied, executionDuration: (new Date()).getTime() - startTime }, order: 5 })
}

const addresser = ({ _window, addressID = generate(), index = 0, switchWithAddress, switchWithRunningAddress, stack = [], args = [], req, res, e, type = "action", status = "Wait", file, data = "", waits, hasWaits, params, function: func, newLookupActions, nextAddressID, nextAddress = {}, blocked, blockable = true, dataInterpretAction, asynchronous = false, interpreting = false, renderer = false, action, __, id, object, mount, lookupActions, condition }) => {

    if (switchWithAddress) {

        nextAddressID = switchWithAddress.nextAddressID
        hasWaits = switchWithAddress.hasWaits
        switchWithAddress.nextAddressID = addressID
        switchWithAddress.hasWaits = false
        switchWithAddress.interpreting = false
        // switchWithAddress.status = "Wait"

    } else if (switchWithRunningAddress) {

        nextAddressID = switchWithRunningAddress.nextAddressID
        hasWaits = switchWithRunningAddress.hasWaits
        switchWithRunningAddress.nextAddressID = addressID
        switchWithRunningAddress.hasWaits = false
    }

    // find nextAddress by nextAddressID
    if (nextAddressID && !nextAddress.id) nextAddress = stack.addresses.find(nextAddress => nextAddress.id === nextAddressID) || {}

    // waits
    waits = waits || args[2], params = params || args[1] || ""

    // address waits
    if (waits) nextAddress = addresser({ _window, stack, req, res, e, type: "waits", action: action + "::[...]", data: { string: waits }, nextAddress, blockable, __, id, object, mount, lookupActions, condition }).address

    var address = { id: addressID, stackID: stack.id, viewID: id, type, data, status, file, function: func, hasWaits: hasWaits !== undefined ? hasWaits : (waits ? true : false), nextAddressID: nextAddress.id, blocked, blockable, index: stack.addresses.length, action, asynchronous, interpreting, renderer, executionStartTime: (new Date()).getTime() }
    var stackLength = stack.addresses.length

    // find and lock the head address
    if (stackLength > 0 && !nextAddress.id) {

        var nextAddressIndex = 0

        // nextAddress is interpreting or renderer
        while (nextAddressIndex < stackLength && !stack.addresses[nextAddressIndex].interpreting && !stack.addresses[nextAddressIndex].renderer) { nextAddressIndex += 1 }

        // there exist a head address
        if (nextAddressIndex < stackLength) {

            address.nextAddressID = stack.addresses[nextAddressIndex].id

            // get head address
            nextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID)
        }
    }

    // set all head addresses asynchronous
    if (asynchronous) {

        var nextAddressID = address.stackID === stack.id && address.nextAddressID
        while (nextAddressID) {

            var holdnextAddress = stack.addresses.find(nextAddress => nextAddress.id === nextAddressID)
            if (holdnextAddress) {
                holdnextAddress.hold = true
                nextAddressID = holdnextAddress.stackID === stack.id && holdnextAddress.nextAddressID
            } else nextAddressID = false
        }
    }

    // data
    var { data, executionDuration, action: interpretAction } = toLine({ _window, lookupActions, stack, req, res, id, e, __, data: { string: params }, action: dataInterpretAction })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, object, mount, lookupActions: newLookupActions || lookupActions, condition }

    // push to stack
    if (index) stack.addresses.splice(index, 0, address)
    else stack.addresses.unshift(address)

    if (action === "search()" || action === "erase()" || action === "save()") address.action += ":" + data.collection + (data.doc || "")

    // log
    if (address.status !== "Wait") printAddress({ stack, address, nextAddress, newAddress: true })

    return { address, data, stack, action: interpretAction, __: [...(data !== undefined ? [data] : []), ...__] }
}

const toAwait = ({ _window, req, res, address = {}, addressID, lookupActions, stack, id, e, _, __, action }) => {

    const global = _window ? _window.global : window.global

    if (addressID && !address.id) address = stack.addresses.find(address => address.id === addressID)
    if (!address.id || stack.terminated || address.hold || address.starter || address.end) return

    // params
    address.params = address.params || {}

    // modify underscores
    var my__ = _ !== undefined ? [_, ...(address.params.__ || __)] : (address.params.__ || __)

    // unblock stack
    if (stack.blocked && !address.blocked) stack.blocked = false

    // address
    var nextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID) || {}

    if (address.blocked || address.status === "Start") {

        address.status = address.blocked ? "Block" : "End"
        address.end = true
        address.interpreting = false
        printAddress({ stack, address, nextAddress })

        // remove address
        var index = stack.addresses.findIndex(waitingAddress => waitingAddress.id === address.id)
        if (index !== -1) stack.addresses.splice(index, 1)

        // pass underscores to waits
        if (address.hasWaits && nextAddress.params) nextAddress.params.__ = my__

        // logger
        if (address.logger && address.logger.end) logger({ _window, data: { key: address.logger.key, end: true } })

    } else if (address.status === "Wait") {

        address.status = "Start"
        address.interpreting = true
        printAddress({ stack, address, nextAddress })

        stack.interpretingAddressID = address.id

        // logger
        if (address.logger && address.logger.start) logger({ _window, data: { key: address.logger.key, start: true } })

        if (address.function) {

            var func = address.function || "toLine"
            var file = address.file || func
            var data = { _window, lookupActions, stack, id, e, req, res, address, nextAddress, ...(address.params || {}), data: address.data, __: my__, action }

            if (func === "toView") toView(data)
            else if (func === "toHTML") toHTML(data)
            else if (func === "update") update(data)
            else if (func === "documenter") documenter(data)

            address.interpreting = false

            return !address.asynchronous && toAwait({ _window, lookupActions, stack, address, id, e, req, res, __: my__, action })

        } else if (address.type === "line" || address.type === "waits" || address.type === "action") return toLine({ _window, lookupActions, address, stack, id, e, req, res, ...(address.params || {}), data: address.data, __: my__, action })
    }

    if (stack.terminated) return

    // asynchronous unholds nextAddresses
    if (address.nextAddressID && !nextAddress.interpreting && (nextAddress.stackID || nextAddress.hold || nextAddress.status === "Wait")) {

        var otherWaiting = stack.addresses.findIndex(waitingAddress => waitingAddress.nextAddressID === address.nextAddressID)

        if (otherWaiting === -1 || (otherWaiting > -1 && !stack.addresses.find(waitingAddress => waitingAddress.nextAddressID === address.nextAddressID && !address.blocked))) {

            nextAddress.hold = false
            return toAwait({ _window, lookupActions, stack, address: nextAddress, id, req, res, __, action, e })
        }
    }

    endStack({ _window, stack, end: true })

    // address is for another stack
    address.stackID !== stack.id && global.__stacks__[address.stackID] && toAwait({ _window, lookupActions, stack: global.__stacks__[address.stackID], address, id, e, req, res, __, action })
}

const insert = async ({ lookupActions, stack, __, address, id, insert }) => {

    var { index, view, path, data, doc, viewPath = [], parent, preventDefault } = insert

    const views = window.views
    const global = window.global
    var parent = views[parent]
    var passData = {}
    var __childIndex__

    if (insert.__view__) {

        view = insert

    } else if (!view) {

        var childrenRef = parent.__childrenRef__.find(({ id: viewID }) => viewID === id || getDeepChildrenId({ id: viewID }).includes(id))

        if (childrenRef) view = insert = views[childrenRef.id]
        else view = insert = views[parent.__childrenRef__[0].id]
    }

    // clone
    if (view.__view__) {

        // id
        id = view.id

        // childIndex
        __childIndex__ = view.__childIndex__

        // index
        index = index !== undefined ? index : (view.__index__ + 1)

        if (!preventDefault) {

            // path
            path = [...(path || view.__dataPath__)]
            doc = doc || view.doc

            // increment data index
            if (isNumber(path[path.length - 1])) path[path.length - 1] += 1

            // increment next views dataPath index
            var itemIndex = view.__dataPath__.length - 1
            if (index < parent.__childrenRef__.length)
                parent.__childrenRef__.slice(index).map(viewRef => updateDataPath({ id: viewRef.id, index: itemIndex, increment: true }))

            // get data
            passData.data = insert.__view__ ? (typeof insert.data === "object" ? {} : "") : (insert.view && data !== undefined ? data : undefined)

            // mount data
            passData.data !== undefined && path.reduce((o, k, i) => {

                if (i === itemIndex - 1) o[k].splice(path[itemIndex], 0, passData.data)
                else if (i >= itemIndex) return
                else return o[k]

            }, global[doc])
        }

        // inserted view params
        passData = {
            __: view.__loop__ && view.__mount__ ? [passData.data, ...view.__.slice(1)] : view.__,
            __viewPath__: [...view.__viewPath__, ...viewPath],
            __customViewPath__: [...view.__customViewPath__],
            __lookupViewActions__: [...view.__lookupViewActions__],
            passData: {
                __loop__: view.__loop__,
                __mount__: view.__mount__,
            }
        }

        // get raw view
        view = clone(([...view.__viewPath__, ...viewPath]).reduce((o, k) => o[k], global.data.view))

    } else { // new View

        var genView = generate()
        if (typeof view !== "string") global.data.view[genView] = clone(view)
        else genView = clone((viewPath).reduce((o, k) => o[k], view))

        passData = {
            __viewPath__: [genView, ...viewPath],
            __customViewPath__: [...parent.__customViewPath__, genView],
            __lookupViewActions__: [...parent.__lookupViewActions__, { type: "customView", view: genView }]
        }
    }

    if (typeof view !== "object") return console.log("Missing View!")

    // index
    if (index === undefined) index = parent.__element__.children.length

    // remove loop
    if (view.view.charAt(0) === "[") {
        view.view = toCode({ id, string: toCode({ id, string: view.view, start: "'" }) })
        view.view = global.__refs__[view.view.slice(0, 6)].data + "?" + decode({ string: view.view.split("?").slice(1).join("?") })
    }

    update({ lookupActions, stack, address, id, __, data: { view: { ...clone(view), __inserted__: true }, id, path, data, doc, __childIndex__, __index__: index, insert: true, __parent__: parent.id, action: "INSERT", ...passData } })
}

const toView = ({ _window, lookupActions, stack, address, req, res, __, id, data = {} }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = data.view || views[id]

    // interpret view
    if (!view.__interpreted__) {

        // init view
        var details = initView({ views, global, id, parent: data.parent, ...(data.view || {}), __ })
        view = details.view
        id = details.id

        // no view
        if (!view.view) return removeView({ _window, global, views, lookupActions, stack, id, address, __ })

        // encode
        view.__name__ = toCode({ _window, id, string: toCode({ _window, id, string: view.__name__, start: "'" }) })

        // 
        var name = view.__name__.split("?")[0]
        var params = view.__name__.split("?")[1]
        var conditions = view.__name__.split("?")[2]
        var subParams = name.split(":").slice(1).join(":") || ""
        view.__name__ = name.split(":")[0]

        // global:()
        if (subParams.includes("()") || view.__name__.includes("()")) {
            view.__name__ = view.__name__ + ":" + subParams
            subParams = ""
        }

        // action view
        if (isParam({ _window, string: view.__name__ })) {

            view.__name__ = "Action"
            conditions = params
            params = subParams
            subParams = ""
        }

        // loop
        var loop = view.__name__.charAt(0) === "@" && view.__name__.length == 6

        // view name
        view.__name__ = toValue({ _window, id, req, res, data: view.__name__, __, stack })

        // no view
        if (!view.__name__ || typeof view.__name__ !== "string" || view.__name__.charAt(0) === "#") return removeView({ _window, global, views, id, stack, address })
        else views[id] = view

        // executable view name
        if (executable({ _window, string: view.__name__ })) {
            toValue({ _window, id, req, res, data: view.__name__, lookupActions, __, stack })
            view.__name__ = "Action"
        }

        // interpret subparams
        if (subParams) {

            var { data = {}, conditionsNotApplied } = toLine({ _window, lookupActions, stack, id, data: { string: subParams }, req, res, __ })
            if (conditionsNotApplied) return removeView({ _window, global, views, id, stack, address })
            else subParams = data
        }

        // [View]
        if (loop) return loopOverView({ _window, id, stack, lookupActions, __, address, data: subParams || {}, req, res })

        // subparam is params or id
        if (typeof subParams === "object") {

            my__ = [subParams, ...__]
            override(view, subParams)

        } else if (subParams && typeof subParams === "string" && subParams !== id) {

            var newID = subParams
            if (views[newID] && view.id !== newID) newID += "_" + generate()

            delete Object.assign(views, { [newID]: views[id] })[id]
            id = newID
            views[id].id = id
            view = views[id]
            view.__customID__ = true
        }

        // conditions
        var approved = toApproval({ _window, lookupActions, stack, data: conditions, id, req, res, __ })
        if (!approved) return removeView({ _window, global, views, id, stack, address })

        // params
        if (params) {

            toParam({ _window, lookupActions, stack, data: params, id, req, res, mount: true, __ })

            if (view.id !== id) {

                view.__customID__ = true
                delete views[id]
                id = view.id
            }
        }

        // data
        view.data = kernel({ _window, id, stack, lookupActions, data: { path: view.__dataPath__, data: global[view.doc] || {}, value: view.data, key: true }, __ })

        // prepare for toHTML
        componentModifier({ _window, id })

        // built-in view
        if (view.__name__ === "Input" && !view.__templated__) var { id, view } = builtInViewHandler({ _window, lookupActions, stack, id, req, res, __ })

        // set interpreted
        view.__interpreted__ = true

        // maybe update in params or root
        if (address.blocked) return// toAwait({ _window, lookupActions, stack, address, id, req, res, __ })

        // asynchronous actions within view params
        if (address.hold) return addresser({ _window, id, stack, switchWithAddress: address, type: "function", function: "toView", __, lookupActions, stack, data: { view } })
    }

    // custom View
    if (global.data.views.includes(view.__name__)) {

        // query custom view
        if (!global.__queries__.views.includes(view.__name__) && !global.data.view[view.__name__]) {

            address.interpreting = false
            address.status = "Wait"
            address.data = { view }

            var { address, data } = addresser({ _window, id, stack, nextAddress: address, __, lookupActions, stack, type: "data", action: "search()", status: "Start", asynchronous: true, params: `loader.show;collection=view;doc=${view.__name__}`, waits: `loader.hide;__queries__:().views.push():[${view.__name__}];data:().view.${view.__name__}=_.data` })
            return require("./search").search({ _window, lookupActions, stack, address, id, __, req, res, data })
        }

        // continue to custom view
        else {

            var newView = {
                ...global.data.view[view.__name__],
                __interpreted__: false,
                __customView__: view.__name__,
                __viewPath__: [view.__name__],
                __customViewPath__: [...view.__customViewPath__, view.__name__],
                __lookupViewActions__: [...view.__lookupViewActions__, { type: "customView", view: view.__name__ }]
            }

            // id
            if (newView.id && views[newView.id] && newView.id !== id) newView.id += "_" + generate()
            else if (newView.id) newView.__customID__ = true
            else if (!newView.id) newView.id = id

            var child = { ...view, ...newView }
            views[child.id] = child

            var data = getViewParams({ view })

            // document
            if (view.__name__ === "document") {

                // log start document
                logger({ _window, data: { key: "documenter", start: true } })

                // address: document
                address = addresser({ _window, id: child.id, nextAddress: address, type: "function", file: "toView", function: "documenter", stack, __, logger: { key: "documenter", end: true } }).address

                // get shared public views
                Object.entries(getJsonFiles({ search: { collection: "public/view" } })).map(([doc, data]) => {

                    global.data.view[doc] = { ...data, id: doc }
                    global.data.views.push(doc)
                    global.__queries__.views.push(doc)
                })

                address = addresser({ _window, stack, status: "Start", type: "function", function: "toView", nextAddress: address, lookupActions, __ }).address
            }

            // address
            return toView({ _window, stack, address, req, res, lookupActions, __: [...(Object.keys(data).length > 0 ? [data] : []), ...__], data: { view: child, parent: view.__parent__ } })
        }
    }

    // render children
    if (view.children.length > 0) {

        // html address
        address = addresser({ _window, id, stack, type: "function", function: "toHTML", file: "toView", __, lookupActions, nextAddress: address }).address

        var lastIndex = view.children.length - 1;

        // address children
        [...view.children].reverse().map((child, index) => {

            var childID = child.id || generate()
            views[childID] = { ...child, id: childID, __view__: true, __parent__: id, __viewPath__: [...view.__viewPath__, "children", lastIndex - index], __childIndex__: lastIndex - index }

            // address
            address = addresser({ _window, index, id: childID, stack, type: "function", function: "toView", __, lookupActions, nextAddress: address, data: { view: views[childID] } }).address

        })//.reverse().map(address => !address.hold && toView({ _window, lookupActions, stack, id, req, res, address, ...(address.params || {}), data: address.data, __ }))

    } else toHTML({ _window, id, stack, __ })

    // address
    toAwait({ _window, lookupActions, stack, address, id, req, res, __ })
}

const update = ({ _window, id, lookupActions, stack, address, req, res, __, data = {} }) => {

    // address.blockable = false
    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global

    var view = views[data.id]

    if (!data.postUpdate) {

        var parent = views[data.__parent__ || view.__parent__]
        var __index__ = data.__index__
        var __childIndex__ = data.__childIndex__ !== undefined ? data.__childIndex__ : view.__childIndex__
        var __viewPath__ = [...(data.__viewPath__ || view.__viewPath__)]
        var __customViewPath__ = [...(data.__customViewPath__ || view.__customViewPath__)]
        var __lookupViewActions__ = [...(data.__lookupViewActions__ || view.__lookupViewActions__)]
        var my__ = data.__ || view.__

        var elements = []
        var timer = (new Date()).getTime()

        if (!view) return

        // close publics
        closePublicViews({ _window, id: data.id, __, stack, lookupActions })

        // get view to be rendered
        var reducedView = {
            ...(data.view ? data.view : clone(__viewPath__.reduce((o, k) => o[k], global.data.view))),
            __index__,
            __childIndex__,
            __view__: true,
            __viewPath__,
            __customViewPath__,
            __lookupViewActions__,
            ...(data.passData || {}),
        }

        // data
        if (data.data) {

            reducedView.data = clone(data.data)
            reducedView.doc = data.doc || parent.doc || generate()
            global[reducedView.doc] = global[reducedView.doc] || reducedView.data

        } else if (data.doc) {

            reducedView.doc = data.doc
            global[reducedView.doc] = global[reducedView.doc] || reducedView.data || {}
        }

        // path
        if (data.path !== undefined) reducedView.__dataPath__ = (Array.isArray(data.path) ? data.path : typeof data.path === "number" ? [data.path] : data.path.split(".")) || []

        // remove views
        if (!data.insert && parent.__rendered__) parent.__childrenRef__.filter(({ childIndex }) => childIndex === __childIndex__).map(({ id }) => elements.push(removeView({ _window, global, views, id, stack, main: true, insert: data.insert })))
        else if (!parent.__rendered__) removeView({ _window, global, views, id: data.id, stack, main: true })

        // address for post update
        addresser({ _window, id, stack, switchWithAddress: address, type: "function", function: "update", file: "toView", __, lookupActions, stack, data: { ...data, childIndex: __childIndex__, elements, timer, parent, postUpdate: true } })

        // address
        address = addresser({ _window, id, stack, status: "Start", type: "function", function: "toView", __: my__, lookupActions: __lookupViewActions__, nextAddress: address, data: { view: reducedView, parent: parent.id } }).address

        // render
        toView({ _window, lookupActions: __lookupViewActions__, stack, req, res, address, __: my__, data: { view: reducedView, parent: parent.id } })

    } else { // post update

        var { childIndex, elements, root, timer, parent, ...data } = data

        // tohtml parent
        toHTML({ _window, lookupActions, stack, __, id: parent.id })

        var renderedRefView = parent.__childrenRef__.filter(({ id, childIndex: chdIndex }) => chdIndex === childIndex && !views[id].__rendered__ && views[id])

        var updatedViews = [], idLists = [], innerHTML = ""

        // insert absolutely
        renderedRefView.map(({ id }) => {

            var { __idList__, __html__ } = views[id]

            // push to html
            innerHTML += __html__

            // _.data
            updatedViews.push(views[id])

            // start
            idLists.push(...[id, ...__idList__])
        })

        // browser actions
        if (!_window) {

            var lDiv = document.createElement("div")
            document.body.appendChild(lDiv)
            lDiv.style.position = "absolute"
            lDiv.style.opacity = "0"
            lDiv.style.left = -1000
            lDiv.style.top = -1000
            lDiv.innerHTML = innerHTML
            lDiv.children[0].style.opacity = "0"

            // remove prev elements
            elements.map(element => element.remove())

            // innerHTML
            renderedRefView.map(({ index }) => {

                if (index >= parent.__element__.children.length || parent.__element__.children.length === 0) parent.__element__.appendChild(lDiv.children[0])
                else parent.__element__.insertBefore(lDiv.children[0], parent.__element__.children[index])
            })

            // start
            var relatedEvents = idLists.map(id => starter({ _window, lookupActions, address, stack, __, id }))

            // related events: assign to others
            relatedEvents.map(relatedEvents => {
                Object.entries(relatedEvents).map(([eventID, address]) => {
                    Object.values(address).map(address => views[eventID] && views[eventID].__element__.addEventListener(address.event, address.eventListener))
                })
            })

            // display
            updatedViews.map(({ id }) => views[id].__element__.style.opacity = "1")

            // rout
            if (updatedViews[0].id === "root") {

                document.body.scrollTop = document.documentElement.scrollTop = 0
                var title = root.title || views[global.manifest.page].title
                var path = root.path || views[global.manifest.page].path

                history.pushState(null, title, path)
                document.title = title
            }

            if (lDiv) {

                document.body.removeChild(lDiv)
                lDiv = null
            }
        }

        console.log((data.action || "UPDATE") + ":" + updatedViews[0].id, (new Date()).getTime() - timer)

        var data = { view: updatedViews.length === 1 ? updatedViews[0] : updatedViews, message: "View updated successfully!", success: true }

        toParam({ _window, data: "loader.hide" })

        if (address) {

            address.params.__ = [data, ...address.params.__]
            address.params.id = views[address.params.id] ? address.params.id : updatedViews[0].id
        }
    }
}

const addEventListener = ({ event, id, __, stack, lookupActions, address, eventID: mainEventID }) => {

    const views = window.views
    const global = window.global
    var view = views[id]

    if (!view || !event) return

    // inherit from view
    if (!__) __ = view.__
    if (!lookupActions) lookupActions = view.__lookupViewActions__

    var mainString = toCode({ id, string: toCode({ id, string: event, start: "'" }) })

    mainString.split("?")[0].split(";").map(substring => {

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // event:id
        var { data: eventID } = toLine({ id, data: { string: substring.split("?")[0].split(":")[1] } })
        eventID = eventID || mainEventID || id

        toArray(eventID).map(eventID => {

            if (typeof eventID === "object" && eventID.__view__) eventID = eventID.id

            // modify
            var { event, string } = modifyEvent({ eventID, event: substring, string: mainString })

            // watch
            if (event === "watch") return watch({ lookupActions, __, stack, address, string, id })

            // loaded event
            if (event === "loaded") return eventExecuter({ string, event, eventID, id, address, stack, lookupActions, __ })

            // event id
            var genID = generate()
            var eventAddress = { genID, event, eventListener: (e) => eventExecuter({ string, event, eventID, id, stack, lookupActions, __, address, e }) }

            //
            if (id !== eventID) {

                global.__events__[eventID] = global.__events__[eventID] || {}
                global.__events__[eventID][genID] = eventAddress

                // relate event
                views[id].__relEvents__[eventID] = views[id].__relEvents__[eventID] || {}
                views[id].__relEvents__[eventID][genID] = eventAddress

            } else {

                views[eventID].__events__.unshift(eventAddress)
                views[eventID].__element__.addEventListener(event, eventAddress.eventListener)
            }
        })
    })
}

/////////////////////////////////////////////////////// Sub Actions ////////////////////////////////////////////////////

const getDeepChildren = ({ _window, id }) => {

    const views = _window ? _window.views : window.views
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

    const views = _window ? _window.views : window.views
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

    const views = _window ? _window.views : window.views
    var view = views[id]

    if (!view) return []
    if (!view.__element__.parentNode || view.__element__.parentNode.nodeName === "BODY") return []

    var parentId = view.__element__.parentNode.id
    var all = [parentId]

    all.push(...getDeepParentId({ _window, lookupActions, stack, id: parentId }))

    return all
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
    if (args[2]) require("./kernel").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __ })
}

const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

const sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const isNumber = (value) => {
    return !isNaN(value) && !emptySpaces(value)
}

const emptySpaces = (string) => {
    if (typeof string === "string") {
        var empty = true
        while (string.length > 0) {

            if (string.charAt(0) === " ") empty = true
            else empty = false
            string = string.slice(1)
        }
        return empty
    }
    return false
}

const calcSubs = ({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index = 1 }) => {

    var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
    if (value.split("-").length > index) {

        var _value = value.split("-").slice(0, index).join("-")
        var _values = value.split("-").slice(index)
        _values.unshift(_value)

        var values = _values.map(value => {

            if (!allAreNumbers) return
            if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

            if (allAreNumbers) {

                var num = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object, condition })
                if (!isNaN(num) && num !== " " && num !== "") return num
                else allAreNumbers = false
            }
        })

        if (allAreNumbers) {

            value = parseFloat(values[0])
            values.slice(1).map(val => value -= parseFloat(val))
            global.__calcTests__[test] = true

        } else value = calcSubs({ _window, lookupActions, stack, value, __, id, e, req, res, object: value.charAt(0) === "." && object, condition, index: index + 1 })

    } else return value

    if (value === test) global.__calcTests__[test] = false
    return value
}

const calcDivision = ({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index = 1 }) => {

    var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
    if (value.split("/").length > index) {

        var _value = value.split("/").slice(0, index).join("/")
        var _values = value.split("/").slice(index)
        _values.unshift(_value)

        var values = _values.map(value => {

            if (!allAreNumbers) return
            if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

            if (allAreNumbers) {

                var num = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object: value.charAt(0) === "." && object, condition })
                if (!isNaN(num) && num !== " " && num !== "") return num
                else allAreNumbers = false
            }
        })

        if (allAreNumbers) {

            value = parseFloat(values[0])
            values.slice(1).map(val => {
                if (isNumber(value) && isNumber(val)) value /= val
            })

            // push 
            global.__calcTests__[test] = true

        } else calcDivision({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index: index + 1 })
    }

    if (value === test) global.__calcTests__[test] = false
    return value
}

const calcModulo = ({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index = 1 }) => {

    var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
    if (value.split("%").length > index) {

        var _value = value.split("%").slice(0, index).join("%")
        var _values = value.split("%").slice(index)
        _values.unshift(_value)

        var values = _values.map(value => {

            if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

            if (allAreNumbers) {

                var num = toValue({ _window, lookupActions, stack, data: value, __, id, e, req, res, object: value.charAt(0) === "." ? object : undefined, condition })

                if (!isNaN(num) && num !== " " && num !== "") return num
                else allAreNumbers = false
            }
        })

        if (allAreNumbers) {

            value = parseFloat(values[0])
            values.slice(1).map(val => value %= val)

            global.__calcTests__[test] = true

        } else value = calcModulo({ _window, lookupActions, stack, value, __, id, e, req, res, object, condition, index: index + 1 })
    }

    if (value === test) global.__calcTests__[test] = false
    return value
}

const endAddress = ({ _window, stack, data, req, res, id, e, __, lookupActions }) => {

    const { toAwait } = require("./kernel");
    const global = _window ? _window.global : window.global

    var executionDuration = (new Date()).getTime() - stack.executionStartTime

    data.success = data.success !== undefined ? data.success : true
    data.message = data.message || data.msg || "Action ended successfully!"
    data.executionDuration = executionDuration
    delete data.msg

    var starter = false, nextAddressID = stack.interpretingAddressID, currentStackID = stack.id
    var address = stack.addresses.find(address => address.id === nextAddressID)

    var endStarterAddress = ({ address, stack }) => {

        address.starter = false

        // get start nextAddress to push data to its underscores
        var starternextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID)
        if (starternextAddress) {

            // start again from the current interpreting address to reach nextAddress to set blocked
            var stack = global.__stacks__[currentStackID], blockedAddress = true
            nextAddressID = stack.interpretingAddressID

            while (blockedAddress && nextAddressID && nextAddressID !== starternextAddress.id) {

                blockedAddress = stack.addresses.find(address => address.id === nextAddressID)
                if (blockedAddress) {
                    blockedAddress.blocked = true
                    nextAddressID = blockedAddress.nextAddressID

                    stack.blocked = true

                    // address coming from different stack
                    if (blockedAddress.stackID !== stack.id) stack = global.__stacks__[blockedAddress.stackID]
                }
            }

            toAwait({ req, res, _window, lookupActions, stack: global.__stacks__[starternextAddress.stackID], address, id, e, __, _: data })
        }
    }

    if (data.id) {

        if (!global.__startAddresses__[data.id]) return
        var stack = global.__stacks__[global.__startAddresses__[data.id].address.stackID]
        var address = global.__startAddresses__[data.id].address

        delete data.id
        delete global.__startAddresses__[data.id]

        endStarterAddress({ address, stack })

    } else {

        while (!starter && nextAddressID && stack) {

            // start from self address (by interpretingAddressID) to reach the start head address
            var address = stack.addresses.find(address => address.id === nextAddressID)

            if (address.starter) {

                starter = true
                endStarterAddress({ address, stack })
            }

            // move to head address
            nextAddressID = address.nextAddressID

            // reached index 0 address => check stack if it has nextAddress
            if (address.stackID !== stack.id) stack = global.__stacks__[address.stackID]
        }
    }
}

const printAddress = ({ stack, address, nextAddress = {}, newAddress }) => {

    if (newAddress) stack.logs.push(`${stack.logs.length} ${address.status} ${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action}${nextAddress.id ? ` => ${nextAddress.id || ""} ${nextAddress.index !== undefined ? nextAddress.index : ""} ${nextAddress.type === "function" ? nextAddress.function : nextAddress.action || ""}` : ""}`)
    else stack.logs.push(`${stack.logs.length} ${address.status}${address.status === "End" ? (" (" + ((new Date()).getTime() - address.executionStartTime) + ") ") : " "}${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action}${nextAddress.id ? ` => ${nextAddress.id || ""} ${nextAddress.index !== undefined ? nextAddress.index : ""} ${nextAddress.type === "function" ? nextAddress.function : nextAddress.action || ""}` : ""}`)
    // console.log(stack.logs.at(-1));
}

const resetAddress = ({ address, ...data }) => {

    Object.entries(data || {}).map(([key, value]) => {
        address[key] = value
    })
}

const closePublicViews = ({ _window, id, __, lookupActions }) => {

    if (_window) return

    // close droplist
    if (id !== "droplist")
        toLine({ id: "droplist", data: { string: "__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()" }, __, lookupActions })

    // close tooltip
    toLine({ id: "tooltip", data: { string: "clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0" }, __, lookupActions })

    // close mininote
    toLine({ id: "mininote", data: { string: "():mininote.style():[opacity=0;transform=scale(0)]" }, __, lookupActions })
}

const remove = ({ _window, stack, data = {}, id, __, lookupActions }) => {

    const global = window.global
    const views = window.views
    var view = window.views[id]

    var path = data.path, __dataPath__ = []

    if (path) __dataPath__ = path
    else __dataPath__ = clone(view.__dataPath__) || []

    if (__dataPath__.length > 0 && !data.preventDefault) {

        var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1)
        var parentData = toLine({ id, data: { string } })

        // remove data
        if (Array.isArray(parentData) && parentData.length === 0) {

            var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1) + "=:"
            toLine({ id, data: { string }, __, lookupActions })

        } else {

            var string = `${view.doc}:().` + __dataPath__.join(".") + ".del()"
            toLine({ id, data: { string }, __, lookupActions })
        }
    }

    // close publics
    closePublicViews({ _window, id, __, stack, lookupActions })

    // no data
    if (__dataPath__.length === 0) return removeView({ id, global, views, stack, main: true }).remove()

    // reset length and __dataPath__
    var itemIndex = view.__dataPath__.length - 1
    var parent = views[view.__parent__]

    // update data path
    parent.__childrenRef__.slice(view.__index__ + 1).map(({ id }) => updateDataPath({ id, index: itemIndex, decrement: true }))
    removeView({ id, global, views, stack, main: true }).remove()
    console.log("REMOVE:" + id)
}

const updateDataPath = ({ id, index, decrement, increment }) => {

    const views = window.views
    var view = views[id]

    if (!view) return
    if (!isNumber(view.__dataPath__[index])) return

    if (decrement) view.__dataPath__[index] -= 1
    else if (increment) view.__dataPath__[index] += 1

    view.__childrenRef__.map(({ id }) => updateDataPath({ id, index, decrement, increment }))
}

const sortAndArrange = ({ data, sort, arrange }) => {

    var index = 0

    if (sort) {

        var _sorted = data.slice(index).sort()
        data = data.slice(0, index)
        data.push(..._sorted)
    }

    if (arrange) toArray(arrange).map(el => {

        var _index = data.findIndex(_el => _el == el)
        if (_index > -1) {

            var _el = data[index]
            data[index] = el
            data[_index] = _el
            index += 1
        }
    })

    return data
}

const componentModifier = ({ _window, id }) => {

    var view = _window ? _window.views[id] : window.views[id]

    // icon
    if (view.__name__ === "Icon") {

        view.icon = view.icon || {}
        view.icon.name = view.name || view.icon.name || (typeof view.data === "string" && view.data) || ""
        if ((view.icon.google || view.google) && (!view.google.symbol && !view.symbol)) {

            view.symbol = {}
            view.google.symbol = {}
            if (view.google.outlined) view.outlined = true
            else if (view.google.filled) view.filled = true
            else if (view.google.rounded) view.rounded = true
            else if (view.google.sharp) view.sharp = true
            else if (view.google.twoTone) view.twoTone = true
            else view.google = {}

        } else if ((view.icon.google || view.google) && (view.symbol || view.google.symbol)) {

            view.symbol = view.google.symbol = {}
            if (view.google.symbol) view.symbol.outlined = true
            else if (view.google.symbol.filled) view.symbol.filled = true
            else if (view.google.symbol.rounded) view.symbol.rounded = true
            else if (view.google.symbol.sharp) view.symbol.sharp = true
            else if (view.google.symbol.twoTone) view.symbol.twoTone = true
            else view.google = {}

        } else {

            view.symbol = {}
        }
    }

    // textarea
    else if (view.textarea && !view.__templated__) {

        view.style = view.style || {}
        view.input = view.input || {}
        view.input.style = view.input.style || {}
        view.input.style.height = "fit-content"
    }

    // input
    else if (view.__name__ === "Input") {

        view.input = view.input || {}
        if (view.value) view.input.value = view.input.value || view.value
        if (view.checked !== undefined) view.input.checked = view.checked
        if (view.max !== undefined) view.input.max = view.max
        if (view.min !== undefined) view.input.min = view.min
        if (view.name !== undefined) view.input.name = view.name
        if (view.accept !== undefined) view.input.accept = view.input.accept
        if (view.multiple !== undefined) view.input.multiple = true
        if (view.input.placeholder) view.placeholder = view.input.placeholder
        view.text = view.input.value

    } else if (view.__name__ === "Image") {

        view.src = view.src || (typeof view.data === "string" && view.data) || ""

    } else if (view.__name__ === "Text") {

        view.text = view.text !== undefined ? view.text : ((typeof view.data === "string" && view.data) || "")
    }
}

const loopOverView = ({ _window, id, stack, lookupActions, __, address, data = {}, req, res }) => {

    const global = _window ? _window.global : window.global
    const views = _window ? _window.views : window.views
    var view = views[id]

    // mount
    if (data.doc || data.path) data.mount = true

    // path
    data.path = data.path || []

    // split path
    data.path = Array.isArray(data.path) ? data.path : data.path !== undefined ? (data.path || "").split(".") : []

    if (data.data) {

        data.doc = data.doc || generate()
        global[data.doc] = global[data.doc] || data.data || {}
        data.__dataPath__ = data.path

    } else {

        data.__dataPath__ = [...(data.doc ? [] : view.__dataPath__), ...data.path]
        data.doc = data.doc || view.doc || generate()
        global[data.doc] = global[data.doc] || {}
    }

    var { doc, data = {}, __dataPath__ = [], mount, path, keys, preventDefault, ...myparams } = data

    // data
    data = kernel({ _window, lookupActions, stack, id, data: { path: __dataPath__, data: global[doc] }, req, res, __ })

    var loopData = []
    var isObj = !Array.isArray(data) && typeof data === "object"
    if (isObj && keys) loopData = Object.keys(data)
    else if (Array.isArray(data)) {
        if (data.length === 1) loopData = ["0"]
        else loopData = Object.keys(data)
    } else if (isObj) loopData = ["0"]

    var values = keys ? data : toArray(data), address = {}
    if (keys && !Array.isArray(data)) loopData = sortAndArrange({ data: loopData, sort: myparams.sort, arrange: myparams.arrange })

    var lastIndex = loopData.length - 1;

    // view
    [...loopData].reverse().map((key, index) => {

        view.__looped__ = true
        index = lastIndex - index

        var params = { i: index, __loopIndex__: index, view: view.__name__ + "?" + view.view.split("?").slice(1).join("?"), id: `${view.id}_${index}` }
        key = isNumber(key) ? parseInt(key) : key
        if (mount) params = { ...params, doc, __dataPath__: [...__dataPath__, key] }

        views[params.id] = { __view__: true, __loop__: true, __mount__: mount, ...clone(view), ...myparams, ...params }

        address = addresser({ _window, id: params.id, stack, nextAddress: address, type: "function", function: "toView", renderer: true, blockable: false, __: [values[key], ...__], lookupActions, data: { view: views[params.id] } }).address

    })//.reverse().map(address => !stack.addresses[0].asynchronous && toView({ _window, lookupActions, stack, req, res, address, ...(address.params || {}), data: address.data, __ }))

    toAwait({ _window, lookupActions, stack, address, id, req, res, __ })
    removeView({ _window, global, views, id, stack, address })
}

const builtInViewHandler = ({ _window, lookupActions, stack, id, req, res, __ }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = views[id]

    views[id] = Input(view)
    var { id, view } = initView({ views, global, parent: views[id].__parent__, ...views[id] })

    toLine({ _window, lookupActions, stack, data: { string: view.view, id, index: 1 }, req, res, mount: true, __ })
    view.__name__ = view.view.split("?")[0]

    if (view.id !== id) {

        delete Object.assign(views, { [view.id]: views[id] })[id]
        id = view.id
    }

    componentModifier({ _window, id })

    return { id, view }
}

const toHTML = ({ _window, id, stack, __ }) => {

    const views = _window ? _window.views : window.views

    var view = views[id], parent = views[view.__parent__]
    var name = view.__name__, html = ""

    // remove view
    delete view.view
    delete view.children
    delete view.functions

    if (name === "Action") return

    // linkable
    //if (view.link && !view.__linked__) return link({ _window, id, stack, __ })

    // text
    var text = typeof view.text !== "object" && view.text !== undefined ? view.text : ((view.editable || view.__name__ === "Input" || view.__name__ === "Text") && typeof view.data !== "object" && view.data !== undefined) ? view.data : ""

    // replace encoded spaces
    if (text) text = replaceNbsps(text)

    // html
    var innerHTML = (view.__childrenRef__.map(({ id }) => views[id].__html__).join("") || text || "") + ""

    // required
    if (view.required && name === "Text") {

        if (typeof view.required === "string") view.required = {}
        name = "View"
        view.style.display = "block"
        innerHTML += `<span style='color:red; font-size:${(view.required.style && view.required.style.fontSize) || "1.6rem"}; padding:${(view.required.style && view.required.style.padding) || "0 0.4rem"}'>*</span>`
    }

    // html attributes
    var atts = Object.entries(view.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

    // styles
    view.__htmlStyles__ = ""
    if (view.style) {
        Object.entries(view.style).map(([style, value]) => {
            view.__htmlStyles__ += `${cssStyleKeyNames[style] || style}:${value}; `
        })

        view.__htmlStyles__ = view.__htmlStyles__.slice(0, -2)
    }

    // colorize
    if (view.colorize) {

        innerHTML = toCode({ _window, id, string: toCode({ _window, id, string: innerHTML, start: "'" }) })
        innerHTML = colorize({ _window, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
    }

    if (name === "View") {
        html = `<div ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ''} spellcheck='false' ${view.editable && !view.readonly ? 'contenteditable' : ''} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML || view.text || ''}</div>`
    } else if (name === "Image") {
        html = `<img ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' alt='${view.alt || ''}' id='${view.id}' style='${view.__htmlStyles__}' ${view.src ? `src='${view.src}'` : ""}></img>`
    } else if (name === "Text") {
        if (view.h1) {
            html = `<h1 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h1>`
        } else if (view.h2) {
            html = `<h2 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h2>`
        } else if (view.h3) {
            html = `<h3 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h3>`
        } else if (view.h4) {
            html = `<h4 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h4>`
        } else if (view.h5) {
            html = `<h5 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h5>`
        } else if (view.h6) {
            html = `<h6 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h6>`
        } else {
            html = `<p ${atts} ${view.editable ? "contenteditable " : ""}class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${text}</p>`
        }
    } else if (name === "Icon") {
        html = `<i ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined" : (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || "" || ""} ${view.icon.name}' id='${view.id}' style='${view.__htmlStyles__}${_window ? "; opacity:0; transition:.2s" : ""}'>${view.google ? view.icon.name : ""}</i>`
    } else if (name === "Textarea") {
        html = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""}>${text || ""}</textarea>`
    } else if (name === "Input") {
        if (view.textarea) {
            html = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""}>${text}</textarea>`
        } else {
            html = `<input ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} ${view.multiple ? "multiple" : ""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' ${view.input.type ? `type="${view.input.type}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.name || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${text !== undefined ? `value="${text}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.checked ? "checked" : ""} ${view.disabled ? "disabled" : ''}/>`
        }
    } else if (name === "Video") {
        html = `<video ${atts} style='${view.__htmlStyles__}' controls>
        ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>` : "")}
        ${view.alt || view.message || ""}
      </video>`
    } else return html = `<></>`

    // indexing
    var index = 0
    if (!view.__indexed__) {

        // find index
        if (view.__index__ === undefined) while (parent.__childrenRef__[index] && ((parent.__childrenRef__[index].childIndex < view.__childIndex__) || (!view.__inserted__ && parent.__childrenRef__[index].childIndex === view.__childIndex__ && parent.__childrenRef__[index].initialIndex < view.__initialIndex__))) { index++ }
        else index = view.__index__

        // set index
        view.__index__ = index

        // increment next children index
        parent.__childrenRef__.slice(index).map(viewRef => {
            viewRef.index++
            views[viewRef.id].__index__ = viewRef.index
            views[viewRef.id].__rendered__ && views[viewRef.id].__element__.setAttribute("index", viewRef.index)
        })

        // push id to parent children ids
        parent.__childrenRef__.splice(index, 0, { id, index, childIndex: view.__childIndex__, initialIndex: view.__initialIndex__ })

        view.__indexed__ = true
        // var index = parent ? indexing({ views, id, view, parent }) : 0
    }

    // init element
    view.__element__ = view.__element__ || { text, id, innerHTML, index }

    // label
    // if (view.label && !view.__labeled__) html = labelHandler({ _window, id, tag })

    view.__innerHTML__ = innerHTML
    view.__html__ = html

    // id list
    view.__idList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
}

const link = ({ _window, id, stack, __ }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global

    var view = views[id]

    var link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.manifest.host)
    var linkView = typeof view.link === "string" ? { link } : { ...view.link, link, __name__: "A" }

    // link
    var { view: linkView, id: linkID } = initView({ views, global, parent: view.__parent__, ...linkView, __, __controls__: [{ event: `click?root():'${view.link.path}'?${view.link.path || "false"};${view.link.preventDafault ? "false" : "true"}` }] })
    toHTML({ _window, id: linkID, stack, __ })

    // view
    view.__parent__ = linkID
    view.__linked__ = true
    toHTML({ _window, id, stack, __ })
}

const documenter = ({ _window, res, stack, address, __ }) => {

    var { global, views } = _window
    var page = global.manifest.page
    var view = views[page] || {}

    // head tags
    var language = global.language = view.language || view.lang || "en"
    var direction = view.direction || view.dir || (language === "ar" || language === "fa" ? "rtl" : "ltr")
    var title = view.title || "Bracket App Title"

    // favicon
    var favicon = views.document.favicon && views.document.favicon.url
    var faviconType = favicon && views.document.favicon.type

    // meta
    view.meta = view.meta || {}
    var metaHTTPEquiv = view.meta["http-equiv"] || view.meta["httpEquiv"] || {}
    if (typeof metaHTTPEquiv !== "object") metaHTTPEquiv = {}
    if (!metaHTTPEquiv["content-type"]) metaHTTPEquiv["content-type"] = "text/html; charset=UTF-8"
    var metaKeywords = view.meta.keywords || ""
    var metaDescription = view.meta.description || ""
    var metaTitle = view.meta.title || view.title || ""
    var metaViewport = view.meta.viewport || ""

    delete global.data.project

    // logs
    global.__server__.logs = stack.logs

    // clear secure view actions
    Object.values(global.data.view).map(view => {
        if (view._secure_) {
            view.view = ""
            view.children = []
            clearActions(view.functions)
        }
    })

    toAwait({ _window, stack, address, __ })

    res.end(
        `<!DOCTYPE html>
        <html lang="${language}" dir="${direction}" class="html">
            <head>
                <!-- css -->
                <link rel="stylesheet" href="/route/resource/index.css"/>
                ${views.document.stylesheet ? `
                    <style>
                    ${Object.entries(views.document.stylesheet).map(([key, value]) => typeof value === "object" && !Array.isArray(value)
            ? `${key}{
                        ${Object.entries(value).map(([key, value]) => `${cssStyleKeyNames[key] || key}: ${value.toString().replace(/\\/g, '')}`).join(`;
                        `)};
                    }` : "").filter(style => style).join(`
                    `)}
                    </style>` : ""}
                
                <!-- Font -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400&display=swap">
                
                <!-- title -->
                <title>${title}</title>
                
                <!-- meta -->
                ${metaHTTPEquiv ? Object.entries(metaHTTPEquiv).map(([key, value]) => `<meta http-equiv="${key}" content="${value}">
                `) : ""}
                <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                <meta name="viewport" content= "width=device-width, initial-scale=1.0">
                ${metaViewport ? `<meta name="viewport" content="${metaViewport}">` : ""}
                ${metaKeywords ? `<meta name="keywords" content="${metaKeywords}">` : ""}
                ${metaDescription ? `<meta name="description" content="${metaDescription}">` : ""}
                ${metaTitle ? `<meta name="title" content="${metaTitle}">` : ""}
                
                <!-- favicon -->
                ${favicon ? `<link rel="icon" type="image/${faviconType || "x-icon"}" href="${favicon}"/>` : `<link rel="icon" href="data:,">`}
                
                <!-- views & global -->
                <script id="views" type="application/json">${JSON.stringify(views)}</script>
                <script id="global" type="application/json">${JSON.stringify(global)}</script>
                
                <!-- head tags -->
                ${(views.document.links || []).map(link => !link.body ? `<link ${link.rel ? `rel="${link.rel}"` : ""} ${link.type ? `type="${link.type}"` : ""} href="${link.href}" />` : "").join("")}
  
            </head>
            <body>
                <!-- body tags -->
                ${(views.document.links || []).map(link => link.body ? `<link ${link.rel ? `rel="${link.rel}"` : ""} ${link.type ? `type="${link.type}"` : ""} href="${link.href}" />` : "").join("")}
  
                <!-- html -->
                ${views.body.__html__ || ""}
  
                <!-- engine -->
                <script src="/route/resource/engine.js"></script>
  
                <!-- google icons -->
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"/>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
  
                <!-- html2pdf -->
                <script src="https://cdn.jsdelivr.net/npm/js-html2pdf@1.1.4/lib/html2pdf.min.js"></script>
            </body>
        </html>`
    )
}

const clearActions = (data) => {
    if (typeof data !== "object") return
    Object.entries(data || {}).map(([action, mapAction]) => {
        if (typeof mapAction === "object") return clearActions(mapAction)
        data[action] = ""
    })
}

const initView = ({ views, global, id = generate(), doc, children = [], parent, __parent__, __status__ = "Loading", __dataPath__, __controls__ = [], ...data }) => {

    var parentView = (parent || __parent__ ? views[parent || __parent__] : {}) || {}

    views[id] = {
        ...data,
        id,
        children,
        doc: doc || parentView.doc,
        __status__,
        __view__: true,
        __parent__: parent || __parent__,
        __dataPath__: __dataPath__ || [...(parentView.__dataPath__ || [])],
        __indexing__: 0,
        __name__: data.view,
        __controls__,
        __events__: [],
        __relEvents__: {},
        __childrenRef__: [],
        __timers__: [],
        __rendered__: false,
        __initialIndex__: parentView.__indexing__ || 0,
        __viewPath__: [...(data.__viewPath__ || [])],
        __lookupViewActions__: [...(data.__lookupViewActions__ || parentView.__lookupViewActions__ || [])],
        __customViewPath__: [...(data.__customViewPath__ || parentView.__customViewPath__ || [])]
    }

    if (parentView.__indexing__ > -1) parentView.__indexing__ += 1

    return { id, view: views[id] }
}

const getViewParams = ({ view }) => {

    var { id, doc, data, view, children, __lookupViewActions__, __element__, __dataPath__, __childrenRef__, __index__, __relEvents__,
        __viewPath__, __customViewPath__, __indexing__, __childIndex__, __initialIndex__, __customView__, __htmlStyles__, __events__,
        __parent__, __controls__, __status__, __rendered__, __timers__, __view__, __name__, __customID__, __interpreted__, __, ...params } = view

    return params
}

const removeView = ({ _window, global, views, id, stack, self = true, main, insert }) => {

    var view = views[id]
    if (!view) return
    var parent = views[view.__parent__], element = {}

    // remove events
    view.__events__.map(event => view.__element__.removeEventListener(event.event, event.eventListener))

    // remove related events
    Object.entries(view.__relEvents__).map(([eventID, addresses]) => {
        Object.entries(addresses).map(([genID, address]) => {
            views[eventID] && views[eventID].__element__.removeEventListener(address.event, address.eventListener)
            delete global.__events__[eventID][genID]
        })
    })

    view.__childrenRef__.map(({ id }) => id).map(id => removeView({ _window, global, views, id, stack, insert }))

    if (!self) return element

    view.__timers__.map(timerID => clearTimeout(timerID))

    var index = parent.__childrenRef__.findIndex(({ id }) => id === view.id)

    if (index >= 0) {
        main && parent.__childrenRef__.slice(index).map(viewRef => {

            viewRef.index--
            views[viewRef.id].__index__ = viewRef.index
            views[viewRef.id].__rendered__ && views[viewRef.id].__element__.setAttribute("index", viewRef.index)
        })
        parent.__childrenRef__.splice(index, 1)
    }

    if (main) element = view.__element__

    blockRelatedAddressesByViewID({ stack, id })

    // deepDelete({ obj: global.__events__, key: id })
    // Object.keys(view).map(key => delete view[key])

    delete views[id]

    return element
}

const deepDelete = ({ obj, key }) => {

    if (typeof obj !== "object") return obj
    if (typeof obj[key] === "object")
        Object.keys(obj[key]).map(key => {
            deepDelete({ obj: obj[key], key })
        })

    delete obj[key]
}

const blockRelatedAddressesBynextAddress = ({ stack, index }) => {

    var address = stack.addresses[index]
    address.interpreting = false

    // block nextAddress
    if (address.blockable) stack.addresses[index].blocked = true

    // remove child addresses
    var index = stack.addresses.findIndex(({ nextAddressID, blocked, blockable }) => blockable && !blocked && nextAddressID === address.id)
    if (index !== -1) blockRelatedAddressesBynextAddress({ stack, index })
}

const blockRelatedAddressesByViewID = ({ stack, id }) => {

    // delete addresses
    var index = stack.addresses.findIndex(({ viewID, blocked }) => !blocked && viewID === id)
    if (index !== -1) blockRelatedAddressesBynextAddress({ stack, index })
}

const launcher = () => {

    window.views = JSON.parse(document.getElementById("views").textContent)
    window.global = JSON.parse(document.getElementById("global").textContent)

    //
    const views = window.views
    const global = window.global

    views.document.__element__ = document

    // app default event listeneres
    defaultAppEvents()

    // start app
    var relatedEvents = views.document.__idList__.map(id => starter({ id }))

    // document built-in events
    views.document.__controls__.map(controls => addEventListener({ id: "document", ...controls, event: controls.event }))

    // related events
    relatedEvents.map(relatedEvents => {
        Object.entries(relatedEvents).map(([eventID, addresses]) => {
            Object.values(addresses).map(address => views[eventID] && views[eventID].__element__.addEventListener(address.event, address.eventListener))
        })
    })

    // window
    initView({ views, global, id: "window" })

    // load arabic font
    var arDiv = document.createElement("P")
    arDiv.innerHTML = "مرحبا"
    arDiv.classList.add("ar")
    arDiv.style.position = "absolute"
    arDiv.style.top = "-1000px"
    views.body.__element__.appendChild(arDiv)
}

const eventExecuter = ({ event, eventID, id, lookupActions, e, string, stack: headStack, address: nextAddress, __ }) => {

    const views = window.views
    const global = window.global

    var view = views[id]

    // view doesnot exist
    if (!view || !views[eventID]) return

    if (event === "click" || event === "mousedown" || event === "mouseup") {
        global.__clicked__ = views[((e || window.event).target || e.currentTarget).id]
    }

    // prevent unrelated droplists
    if (eventID === "droplist" && id !== "droplist" && (!global.__droplistPositioner__ || !views[global.__droplistPositioner__] || !views[global.__droplistPositioner__].__element__.contains(view.__element__))) return

    // init stack
    var stack = openStack({ event, id, eventID, string, headStack, nextAddress, e })

    // address line
    var address = addresser({ stack, id, status: "Start", type: "line", event: "click", interpreting: true, lookupActions, __, nextAddress: address }).address

    // main params
    toParam({ lookupActions, stack, id, e, address, data: string, __, mount: true })

    endStack({ stack, end: true })
}

const defaultEventHandler = ({ id }) => {

    const views = window.views
    var view = views[id]

    view.focused = false
    view.touchstarted = false
    view.mouseentered = false
    view.mousedowned = false

    // linkable
    if (view.link && typeof view.link === "object" && view.link.preventDefault)
        view.__element__.addEventListener("click", (e) => { e.preventDefault() })

    // input
    if (view.__name__ === "Input" || view.editable) {

        defaultInputHandlerByEvent({ views, view, id, event: "focus", keyName: "focused", value: true })
        defaultInputHandlerByEvent({ views, view, id, event: "blur", keyName: "focused", value: false })
    }

    defaultInputHandlerByEvent({ views, view, id, event: "mouseenter", keyName: "mouseentered", value: true })
    defaultInputHandlerByEvent({ views, view, id, event: "mouseleave", keyName: "mouseentered", value: false })

    defaultInputHandlerByEvent({ views, view, id, event: "mousedown", keyName: "mousedowned", value: true })
    defaultInputHandlerByEvent({ views, view, id, event: "mouseup", keyName: "mousedowned", value: false })
}

const defaultInputHandlerByEvent = ({ views, view, id, event, keyName, value }) => {

    // function
    var fn = (e) => { if (views[id]) view[keyName] = value }
    view.__element__.addEventListener(event, fn)
}

const modifyEvent = ({ eventID, string, event }) => {

    var view = window.views[eventID]
    var subparams = event.split("?")[1] || ""
    var subconditions = event.split("?")[2] || ""
    event = event.split("?")[0].split(":")[0]

    string = string.split("?").slice(1)
    var conditions = string[1] || ""

    if (event === "change" && (view.editable || view.input.type === "text" || view.input.type === "number")) {
        event = "keyup"
    } else if (event === "entry") {
        event = "input"
    } else if (event === "enter") {

        event = "keyup"
        conditions += "e().key=Enter||e().keyCode=13"

    } else if (event === "ctrl") {

        event = "keydown"
        conditions += "e().ctrlKey"

    } else if (event === "dblclick") {

    }

    string = `${subparams};${string[0]}?${subconditions};${conditions}?${string[2] || ""}`
    while (string.slice(-1) === "?") string = string.slice(0, -1)

    return { string, event }
}

const starter = ({ lookupActions, stack, __, address, id }) => {

    var view = window.views[id]
    var global = window.global
    if (!view) return

    // status
    view.__status__ = "Mounted"
    view.__rendered__ = true

    view.__element__ = document.getElementById(id)
    if (!view.__element__) return delete window.views[id]
    view.__element__.setAttribute("index", view.__index__)

    // default input handlers
    defaultInputHandler({ id })

    // status
    //view.__status__ = "Mounting Events"

    // lunch auto controls
    Object.entries(require("../event/event")).map(([eventName, events]) => {

        if (view[eventName]) view.__controls__.push(...events({ id, data: view[eventName] }))
    })

    // events
    view.__controls__.map(data => addEventListener({ lookupActions, stack, address, __, id, ...data, event: data.event }))

    // related events
    global.__events__[id] && Object.values(global.__events__[id]).map(address => view.__element__.addEventListener(address.event, address.eventListener))

    return view.__relEvents__ || {}
}

const defaultInputHandler = ({ id }) => {

    const views = window.views
    const global = window.global
    var view = views[id]

    if (!view) return
    if (view.__name__ !== "Input" && !view.editable) return

    view.__element__.addEventListener("focus", (e) => { if (view) global.__focused__ = view })

    if (view.preventDefault) return

    // resize input height on loaded
    if (view.__name__ === "Input" && (view.input || view).type === "text") resize({ id })

    // checkbox input
    if ((view.input || view).type === "checkbox") {

        if (view.data === true) view.__element__.checked = true

        var changeEventHandler = (e) => {

            // view doesnot exist
            if (!window.views[id]) return e.target.removeEventListener("change", myFn)

            var data = e.target.checked
            view.data = data

            if (global[view.doc] && view.__dataPath__[0] !== "") {

                // reset Data
                setData({ id, data })
            }
        }

        return view.__element__.addEventListener("change", changeEventHandler)
    }

    // mousewheel
    if ((view.input || view).type === "number") view.__element__.addEventListener("mousewheel", (e) => e.target.blur())

    // readonly
    if (view.readonly) return

    /*view.__element__.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && !e.shiftKey) e.preventDefault()
    })*/

    if (view.__name__ === "Input") view.prevValue = view.__element__.value
    else if (view.editable) view.prevValue = (view.__element__.textContent === undefined) ? view.__element__.innerText : view.__element__.textContent

    var inputEventHandler = async (e) => {

        e.preventDefault()

        var value
        if (view.__name__ === "Input") value = e.target.value
        else if (view.editable) value = (e.target.textContent === undefined) ? e.target.innerText : e.target.textContent

        // views[id] doesnot exist
        if (!window.views[id]) {
            if (e.target) e.target.removeEventListener("input", myFn)
            return
        }

        // contentfull
        if ((view.input || view).type === "text") {

            value = replaceNbsps(value.replace('&amp;', '&'))
            e.target.value = value
        }

        if (view.__name__ === "Input") {

            if (view.input.type === "number") {

                if (e.data !== ".") {

                    if (isNaN(value)) value = value.toString().slice(0, -1)
                    if (!value) value = 0
                    if (value.toString().charAt(0) === "0" && value.toString().length > 1) value = value.toString().slice(1)
                    if (view.input.min && view.input.min > parseFloat(value)) value = view.input.min
                    if (view.input.max && view.input.max < parseFloat(value)) value = view.input.max
                    value = parseFloat(value)
                    view.__element__.value = value.toString()

                } else value = parseFloat(value + ".0")
            }
        }

        if (view.doc) setData({ id, data: { value }, __: view.__ })

        // resize
        resize({ id })

        // arabic values
        // isArabic({ id, value })

        console.log(value, global[view.doc], view.__dataPath__)

        view.prevValue = value
    }

    var blurEventHandler = (e) => {

        var value
        if (view.__name__ === "Input") value = view.__element__.value
        else if (view.editable) value = (view.__element__.textContent === undefined) ? view.__element__.innerText : view.__element__.textContent

        // colorize
        if (view.colorize) {

            var _value = toCode({ id, string: toCode({ id, string: value, start: "'" }) })
            if (view.__name__ === "Input") e.target.value = colorize({ string: _value, ...(typeof view.colorize === "object" ? view.colorize : {}) })
            else e.target.innerHTML = colorize({ string: _value, ...(typeof view.colorize === "object" ? view.colorize : {}) })

            /*
            var sel = window.getSelection()
            var selected_node = sel.anchorNode
            
            var prevValue = view.prevValue.split("")
            var position = value.split("").findIndex((char, i) => char !== prevValue[i])
      
            sel.collapse(selected_node, position + 1)
            */
        }

        // 
        if (value !== view.prevContent && global.__ISBRACKET__) {
            global.redo = []
            global.undo.push({
                collection: global["open-collection"],
                doc: global["open-doc"],
                path: view.__dataPath__,
                value: view.prevContent,
                id: view.__element__.parentNode.parentNode.parentNode.parentNode.id
            })
        }
    }

    var focusEventHandler = (e) => {

        var value = ""
        if (view.__name__ === "Input") value = view.__element__.value
        else if (view.editable) value = (view.__element__.textContent === undefined) ? view.__element__.innerText : view.__element__.textContent

        view.prevContent = value
    }

    var fileEventHandler = (e) => {

        view.__file__ = e.target.files[0]
        return view.__files__ = [...e.target.files]
    }

    (view.input ? view.input.type !== "file" : true) && view.__element__.addEventListener("input", inputEventHandler)
    view.__element__.addEventListener("blur", blurEventHandler)
    view.__element__.addEventListener("focus", focusEventHandler)
    view.input && view.input.type === "file" && view.__element__.addEventListener("change", fileEventHandler)
}

const getCaretIndex = (view) => {

    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
        const selection = window.getSelection();
        if (selection.rangeCount !== 0) {
            const range = window.getSelection().getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(view.__element__);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }
    }
    return position + 1;
}

const toNumber = (string) => {

    if (!string) return string
    if (typeof string === 'number') return string
    if (isNumber(string)) return parseFloat(string)
    return string
}

const defaultAppEvents = () => {

    const views = window.views
    const global = window.global

    // document default event listeners

    // clicked element
    document.addEventListener('mousedown', e => {

        // droplist
        global.__clicked__ = views[e.target.id]
        if (global.__clicked__ && views.droplist.__element__.contains(global.__clicked__.__element__)) global["droplist-txt"] = global.__clicked__.__element__.innerHTML
    })

    // clicked element
    document.addEventListener('mouseup', e => {

        // droplist
        global.__clicked__ = views[e.target.id]
        if (global.__clicked__ && views.droplist.__element__.contains(global.__clicked__.__element__)) global["droplist-txt"] = global.__clicked__.__element__.innerHTML
    })

    // clicked element
    document.addEventListener('focus', e => {
        global.__focused__ = views[e.target.id]
    })

    // window default event listeners

    window.addEventListener("focus", (e) => {

        views.root.__element__.click()
        document.activeElement.blur()
    })

    // show icons
    window.addEventListener("load", () => {

        var icons = views.document.__html__.split("id='").slice(1).map((id) => id.split("'")[0]).filter(id => views[id] && views[id].__name__ === "Icon").map(id => views[id])

        icons.map(view => {
            if (view.__element__) {
                view.__element__.style.opacity = view.style.opacity !== undefined ? view.style.opacity : "1"
                view.__element__.style.transition = view.style.transition !== undefined ? view.style.transition : "none"
            }
        })
    })

    window.addEventListener('beforeinstallprompt', function (e) {

        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        console.log('👍', 'beforeinstallprompt', e);

        // Stash the event so it can be triggered later.
        window.global.__installApp__ = e
        //setTimeout(() => { console.log(window.global.__installApp__); window.global.__installApp__.prompt() }, 1000)
    })

    window.addEventListener('appinstalled', () => {
        // Log install to analytics
        console.log('INSTALL: Success')
    })
}

const setData = ({ id, data, __, stack = {} }) => {

    var view = window.views[id]
    const global = window.global

    if (!global[view.doc]) return

    // defualt value
    var defValue = data.value
    if (defValue === undefined) defValue = ""

    // path
    var path = data.path
    if (path) path = path.split(".")
    else path = []

    // convert string numbers paths to num
    path = path.map((k) => {
        if (!isNaN(k)) k = parseFloat(k)
        return k
    })

    // keys
    var __dataPath__ = clone(view.__dataPath__)
    var keys = [...__dataPath__, ...path]

    // set value
    kernel({ id, data: { data: global[view.doc], path: keys, value: defValue, key: true }, stack, __ })
}

module.exports = {
    kernel, toValue, toParam, reducer, toApproval, toAction, toLine, addresser, toAwait, insert, toView, update, addEventListener,
    getDeepChildren, getDeepChildrenId, calcSubs, calcDivision, calcModulo, emptySpaces, isNumber, printAddress, endAddress, resetAddress,
    closePublicViews, updateDataPath, remove, toHTML, documenter, initView, getViewParams, removeView, launcher, defaultEventHandler,
    toNumber, defaultAppEvents
}