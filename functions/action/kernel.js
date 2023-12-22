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
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")
const { toApproval } = require("./toApproval")
const { toCode } = require("./toCode")
const { note } = require("./note")
const { isParam } = require("./isParam")
const { lengthConverter } = require("./resize")
const { func } = require("./func")
const { setData } = require("./setData")
const { override } = require("./merge")
const { createDoc } = require("./createDoc")
const { nthParent, getAllParents, nthNext, nthPrev } = require("./getView")
const { decode } = require("./decode")
const { executable } = require("./executable")
const { kernel } = require("./kernel")
const { toAwait } = require("./toAwait")
const { remove } = require("./remove")
const { insert } = require("./insert")
const { toValue } = require("./toValue")
const { toParam } = require("./toParam")
const { toAction } = require("./toAction")
const { addresser } = require("./addresser")
const { checkUnexecutedAwait } = require("./checkUnexecutedAwait")

const kernel = ({ _window, lookupActions, stack = {}, id = "root", path, value, key, object, __, e, mount, condition, toView, _object }) => {
    
    if (_object === undefined) return

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], _object, lastIndex = path.length - 1

    var answer = path.reduce((o, k, i) => {

        // break
        if (breakRequest === true || breakRequest >= i) return o

        k = k.toString()
        var viewPath = k.split("@")[1] // for calling another view
        k = k.split("@")[0]
        var k0 = k.split(":")[0]
        var args = k.split(":")

        // get underscores
        var underScored = 0
        while (k0.charAt[0] === "_") {
            underScored += 1
            k0 = k0.slice(1)
            k = k.slice(1)
        }
        
        // reset lastIndex
        if (lastIndex !== path.length - 1) {
            if (key === true) key = false
            lastIndex = path.length - 1
        }

        if (o === undefined || o === null && k0 !== "push()") return o
        
        if (k0 === "log()" || k0 === "lg()") { // log()

            var my__
            if (underScored) my__ = [o, ...__]
            else my__ = __

            var logs = args.slice(1).map(arg => toValue({ _window, id, e, __: my__, value: arg, object: o }))
            if (logs.length === 0) logs.push("here")

            console.log(o, ...logs)
            return o

        } else if (path[i + 1] === "del()" && k0 !== "data()" && k0 !== "doc()") { // del()
            
            var el = k
            breakRequest = i + 1
            el = toValue({ _window, id, e, __, value: k })
            
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
            
        } else if (k0 === "while()") {

            var my__ = underScored ? [o, ...__] : __
            
            while (toApproval({ _window, lookupActions, stack, id, string: args[1], __: my__, e, object: underScored ? object : o })) {
                toValue({ _window, lookupActions, stack, id, value: args[2], __, e, object: underScored ? object : o })
            }

            if (args[3]) toValue({ _window, lookupActions, stack, id, value: args[3], __,  e, object: underScored ? object : o, mount, toView })

            return o
            
        } else if (underScored && !k0) { // _ || __ || ___ ...
            
            if (value !== undefined && key && i === lastIndex) answer = o[__[underScored - 1]] = value
            else if (typeof o === "object") answer = o[__[underScored - 1]]

        } else if ((k0.slice(0, 6) === "coded@" && k.length === 11) || (k0.slice(0, 7) === "codedT@" && k.length === 12)) { // .coded@12345.
            
            var _coded, my__
            if (underScored) my__ = [o, ...__]
            else my__ = __

            if (k0.slice(0, 6) === "coded@") _coded = toValue({ _window, lookupActions, stack, id, e, value: global.__refs__[k0], __: my__, object })
            else if (k0.slice(0, 7) === "codedT@") _coded = global.__refs__[k0]

            if (i === lastIndex && key && value !== undefined) answer = o[_coded] = value
            else if (key && value !== undefined && o[_coded] === undefined) {
              
              if (!isNaN(toValue({ _window, lookupActions, stack, id, value: path[i + 1], __, e }))) answer = o[_coded] = []
              else answer = o[_coded] = {}
            }

            else answer = o[_coded]
            
        } else if (k0 === "data()") {

            var _o = o.__view__ ? o : views[id]
            var _params = {}

            if (args[1]) _params = toParam({ _window, lookupActions, stack, id, e, __, string: args[1] })
            if (_params.path) _params.path = Array.isArray(_params.path) ? _params.path : _params.path.split(".")
            else _params.path = []

            _params.path = [_o.__dataPath__, ..._params.path]

            // get data
            var _data
            if (_params.data) _data = _params.data
            else if (_params.doc) _data = global[_params.doc]
            else if (_o.doc) _data = global[_o.doc]
            else return console.log("No data to reduce!")

            if (path[i + 1] === "del()") {
                _params.path.push("del()")
                breakRequest = i + 1
            }

            return reducer({ _window, id, e, path: _params.path, object: _data, __, value, key })
            
        } else if (k0 === "doc()") {

            var _o = o.__view__ ? o : views[id], _doc

            var _params = {}
            if (args[1]) _params = toParam({ _window, id, e, __, string: args[1] })
            if (_params.path) _params.path = Array.isArray(_params.path) ? _params.path : _params.path.split(".")
            else _params.path = []

            if (_params.doc) _doc = global[_params.doc]
            else if (_o.doc) _doc = global[_o.doc]
            else return console.log("No document data to reduce!")

            if (path[i + 1] === "del()") {
                _params.path.push("del()")
                breakRequest = i + 1
            }

            return reducer({ _window, id, e, path: _params.path, object: _doc, __, value, key })

        } else if (k0 === "parent()") {

            return nthParent({ _window, nth: 1, o })

        } else if (k0 === "2ndParent()") {

            return nthParent({ _window, nth: 2, o })

        } else if (k0 === "3rdParent()") {

            return nthParent({ _window, nth: 3, o })
            
        } else if (k0 === "nthParent()") {

            if (!o.__view__) return
            var nth = toValue({ _window, id, e, __, value: args[1] })
            return nthParent({ _window, nth, o })

        } else if (k0 === "parents()") {

            answer = getAllParents({ _window, id: o.__view__ ? o.id : id })
            
        } else if (k0 === "next()") {

            return nthNext({ _window, nth: 1, o })

        } else if (k0 === "2ndNext()") {

            return nthNext({ _window, nth: 2, o })

        } else if (k0 === "3rdNext()") {

            return nthNext({ _window, nth: 3, o })

        } else if (k0 === "nthNext()") {

            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id })
            return nthNext({ _window, nth, o })

        } else if (k0 === "prev()") {

            return nthPrev({ _window, nth: 1, o })

        } else if (k0 === "2ndPrev()") {

            return nthPrev({ _window, nth: 2, o })

        } else if (k0 === "3rdPrev()") {

            return nthPrev({ _window, nth: 3, o })

        } else if (k0 === "nthPrev()") {

            if (!o.__view__) return
            var nth = toValue({ _window, id, e, __, value: args[1] })
            return nthPrev({ _window, nth, o })

        } else if (k0 === "prevSiblings()") {
            
            if (!o.__view__) return o
            return views[o.parent].__childrenID__.slice(0, o.index).map(sibling => views[sibling])

        } else if (k0 === "nextSiblings()") {
            
            if (!o.__view__) return o
            return views[o.parent].__childrenID__.slice(o.index).map(sibling => views[sibling])

        } else if (k0 === "siblings()") {
            
            if (!o.__view__) return o
            return clone(views[o.parent].__childrenID__).splice(o.index, 1).map(sibling => views[sibling])

        } else if (k0 === "last()") {
            
            if (!o.__view__) return o
            return views[views[o.parent].__childrenID__.slice(-1)[0]]

        } else if (k0 === "2ndLast()") {
            
            if (!o.__view__) return o
            return views[views[o.parent].__childrenID__.slice(-2)[0]]
            
        } else if (k0 === "3rdLast()") {
            
            if (!o.__view__) return o
            return views[views[o.parent].__childrenID__.slice(-3)[0]]

        } else if (k0 === "nthLast()") {

            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id })
            if (isNaN(nth)) return
            return views[views[o.parent].__childrenID__.slice(-1 * nth)[0]]

        } else if (k0 === "1st()") {
            
            if (!o.__view__) return o
            return views[views[o.parent].__childrenID__[0]]

        } else if (k0 === "2nd()") {
            
            if (!o.__view__) return o
            return views[views[o.parent].__childrenID__[1]]

        } else if (k0 === "3rd()") {
            
            if (!o.__view__) return o
            return views[views[o.parent].__childrenID__[2]]

        } else if (k0 === "nth()") {

            if (!o.__view__) return
            var nth = toValue({ _window, id, e, __, value: args[1] })
            return views[views[o.parent].__childrenID__[nth - 1]]

        } else if (k0 === "grandChild()") {
              
            if (!o.__view__) return
            return views[views[o.__childrenID__[0]].__childrenID__[0]]
            
        } else if (k0 === "grandChildren()") {
              
            if (!o.__view__) return
            return views[o.__childrenID__[0]].__childrenID__.map(childID => views[childID])
          
        } else if (k0 === "2ndGrandChildren()") {
              
            if (!o.__view__) return
            return views[o.__childrenID__[1]].__childrenID__.map(childID => views[childID])
          
        } else if (k0 === "1stChild()" || k0 === "child()") {
            
            if (!o.__view__) return
            return views[o.__childrenID__[0]]
            
        } else if (k0 === "2ndChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenID__[1]]

        } else if (k0 === "3rdChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenID__[2]]

        } else if (k0 === "nthChild()") {
            
            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id })
            return views[o.__childrenID__[nth - 1]]
            
        } else if (k0 === "3rdLastChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenID__.slice(-3)[0]]

        } else if (k0 === "2ndLastChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenID__.slice(-2)[0]]

        } else if (k0 === "lastChild()") {
            
            if (!o.__view__) return
            return views[o.__childrenID__.slice(-1)[0]]

        } else if (k0 === "nthLastChild()") {
            
            if (!o.__view__) return
            var nth = toValue({ _window, __, value: args[1], e, id })
            if (isNaN(nth)) return
            return views[o.__childrenID__.slice(-1 * nth)[0]]

        } else if (k0 === "children()") {
            
            if (!o.__view__) return
            return o.__childrenID__.map(child => views[child])
        
        } else if (k0 === "name()") {

            var myview
            if (o.__view__) myview = o
            else myview = views[id]
            var name = toValue({ _window, id, e, object, value: args[1], __ })
            if (name === myview.name) return myview
            var children = getDeepChildren({ _window, id: myview.id })
            return children.find(view => view.name === name)

        } else if (k0 === "names()") {

            var myview
            if (o.__view__) myview = o
            else myview = views[id]
            var name = toValue({ _window, id, e, object, value: args[1], __ })
            var childrenWithSameName = []
            if (name === myview.name) childrenWithSameName.push(myview)
            var children = getDeepChildren({ _window, id: myview.id })
            childrenWithSameName.push(...children.filter(view => name === view.name))

        } else if (k0 === "clicked()") {
            return global["clicked()"]
        } else if (k0 === "show()") {
            
            if (!o.__view__) return
            o.element.style.display = "flex"
            
        } else if (k0 === "hide()") {
            
            if (!o.__view__) return
            o.element.style.display = "none"
            
        } else if (k0 === "style()") {
            
            var _o, _params = {}
            if (args[1]) _params = toParam({ _window, id, e, __, string: args[1] })
            
            if (typeof o === "object" && o.__view__) _o = o
            else return console.log("Cannot style non view")
            
            // get element
            if (_o.element) answer = _o.element.style
            else answer = _o.style = _o.style || {}

            var styles = {}
            if (Object.keys(_params).length > 0) {

              Object.entries(_params).map(([key, value]) => {
                  answer[key] = value
                  styles[key] = value
              })
            }

            return styles
            
        } else if (k0 === "tags()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ _window, lookupActions, stack, id, e, __, string: args[1] })
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ _window, lookupActions, stack, id, e, __, value: args[1] })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => views[o.id])

        } else if (k0 === "inputs()") {
            
            var _input, _textarea, _editables, _params = {}, _o = o.__view__ ? o : views[id]
            if (args[1]) _params = toParam({ _window, id, e, __, string: args[1] })

            if (!_o.element) return console.log("No element in view")

            _input = _o.element.getElementsByTagName("INPUT")
            _textarea = _o.element.getElementsByTagName("TEXTAREA")
            _editables = getDeepChildren({ _window, id: _o.id }).filter(view => view.editable)
            if (_o.editable) _editables.push(_o)

            return [..._input, ..._textarea, ..._editables].map(o => views[o.id])

        } else if (k0 === "input()") {
            
            var _input, _textarea, _editables, _params = {}, _o = o.__view__ ? o : views[id]
            if (args[1]) _params = toParam({ _window, id, e, __, string: args[1] })

            if (!_o.element) return console.log("No element in view")

            _input = _o.element.getElementsByTagName("INPUT")
            _textarea = _o.element.getElementsByTagName("TEXTAREA")
            _editables = getDeepChildren({ _window, id: _o.id }).filter(view => view.editable)
            if (_o.editable) _editables.push(_o)

            answer = [..._input, ..._textarea, ..._editables].map(o => views[o.id])
            return answer[0]

        } else if (k0 === "px()") {

          if (args[1]) return lengthConverter(toValue({ _window, lookupActions, stack, id, e, __, value: args[1] }))
          return lengthConverter(o)

        } else if (k0 === "touchable()") {

          if (_window) {
            
            return req.device.type === "phone" || req.device.type === "tablet"
 
          } else return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));

        } else if (k0 === "display()") { // class
            
            var _o = o.__view__ ? o : views[id]

            if (args[1]) {
            
                var children = getDeepChildren({ _window, id: _o.id })
                var className = toValue({ _window, id, e, __, value: args[1] }) || ""
                answer = children.find(child => child.display.includes(className))

            } else {

                if (key) _o.element.classList.add(value)
                return [..._o.element.classList].join("")
            }
            
        } else if (k0 === "remDisplay()") {

            var _o = o.__view__ ? o : views[id]
            var _display = toValue({ _window, id, e, __, value: args[1] }) || ""
            if (_display) _o.element.classList.rem(value)

        } else if (k0 === "displays()") { // get classes
            
            var _o = o.__view__ ? o : views[id]
            var children = getDeepChildren({ _window, id: _o.id })

            if (args[1]) {
            
                var className = toValue({ _window, id, e, __, value: args[1] }) || ""
                answer = children.filter(child => child.display.includes(className))

            } else answer = []
            
        } else if (k0 === "int()") {

            var integer
            if (args[1]) integer = toValue({ _window, id, e, __, value: args[1] })
            else integer = o
            answer = Math.round(toNumber(integer))

        } else if (k0 === "click()") { // click
            
          if (_window) return view.__events__.push({
            event: `loaded?${pathJoined}`
          })

          if (!o.__view__) return true

          if (args[1]) {
            var _params = toParam({ _window, lookupActions, stack, id, e, __, string: args[1] })
            o.__temporaryParams__ = underScored ? [o, _params] : [_params]
          }

          o.element.click()

        } else if (k0 === "focus()") { // focus
            
            if (_window) return view.__events__.push({
                event: `loaded?${pathJoined}`
            })

            if (!o.__view__) return true
            
            focus({ id: o.id })

        } else if (k0 === "blur()") { // blur
            
          if (_window) return view.__events__.push({
            event: `loaded?${pathJoined}`
          })

          if (!o.__view__) return true
            
            o.element.blur()

        } else if (k0 === "mousedown()") {

            if (!o.__view__) return true

            var mousedownEvent = new Event("mousedown")
            o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseup()") {

            if (!o.__view__) return true

            var mousedownEvent = new Event("mouseup")
            o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseenter()") {

            if (!o.__view__) return true

            var mousedownEvent = new Event("mouseenter")
            o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseleave()") {

            if (!o.__view__) return true

            var mousedownEvent = new Event("mouseleave")
            o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "keyup()") {

            if (!o.__view__) return true

            var mousedownEvent = new Event("keyup")
            o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "keydown()") {

            if (!o.__view__) return true

            var mousedownEvent = new Event("keydown")
            o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "installApp()") {

          const installApp = async () => {

            global["installApp"].prompt();
            const { outcome } = await global["installApp"].userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
          }

          installApp()

        } else if (k0 === "clear()") {

            if (o.__view__) {
                o.element.value = null
                o.element.innerHTML = null
                if(o.doc) reducer({ _window, id: o.id, object: global[o.doc], path: [...o.__dataPath__, "del()"] })
            }

        } else if (k0 === "clearTimer()") {

            var _params = {}, _timer
            if (args[1]) _timer = toValue({ _window, lookupActions, stack, id, e, __, value: arg })
            else _timer = o
            
            clearTimeout(_timer)
            
        } else if (k0 === "timer()") {
            
            // timer():params:timer:repeat
            var myFn = () => { toParam({ _window, lookupActions, stack, id, string: args[1], __, e, object, toView }) }
            var _timer = args[2] ? parseInt(toValue({ _window, id, value: args[2], __, e, object })) : 0
            var _repeats = args[3] ? toValue({ _window, id, value: args[3], __, e, object }) : false

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
            
            if (o._view_) toArray(answer).map(timer => o[generate() + "-timer"] = timer)

        } else if (k0 === "path()") {

            if (key && value !== undefined && lastIndex) {

                o.__dataPath__ = Array.isArray(value) ? value : value.split(".")
                if (o.doc) o.data = setData({ id, data: { value }, __ })
                else {
                    o.doc = generate()
                    global[o.doc] = typeof o.__dataPath__[0] === "number" ? [] : {}
                    o.data = setData({ id, data: { value }, __ })
                }

            } else return o.__dataPath__

        } else if (k0 === "reduce()") {

            var _params
            if (isParam({ _window, string: args[1] })) _params = toParam({ _window, id, e, __, string: args[1] })
            else _params = toValue({ _window, id, __, e, value: args[1] })
            var _path = Array.isArray(_params.path) ? _params.path : _params.path.split(".")
            var _data = _params.data || o
            var _value = _params.value || o
            var _lastIndex = (_path.length || 1) - 1
            if (underScored === 1) return _path.reduce((o, k, i) => reducer({ _window, id, path, value: _lastIndex === i && ((_value !== undefined && _value) || (lastIndex && value !== undefined)), key: _lastIndex === i && ((_value !== undefined) || (lastIndex && value !== undefined)), object, __: [o, k, ...__], e, mount, condition, toView }), _data)
            else if (underScored === 2) return _path.reduce((o, k, i) => reducer({ _window, id, path, value: _lastIndex === i && ((_value !== undefined && _value) || (lastIndex && value !== undefined)), key: _lastIndex === i && ((_value !== undefined) || (lastIndex && value !== undefined)), object, __: [o, k, i, ...__], e, mount, condition, toView }), _data)
            else return _path.reduce((o, k, i) => reducer({ _window, id, path, value: _lastIndex === i && ((_value !== undefined && _value) || (lastIndex && value !== undefined)), key: _lastIndex === i && ((_value !== undefined) || (lastIndex && value !== undefined)), object: o, __: [k, ...__], e, mount, condition, toView }), _data)

        } else if (k0 === "contains()") {
            
            var _next = toValue({ _window, id, value: args[1], __,  e })
            if (!_next || !_next.__view__) return false

            var deepChildren = getDeepChildrenId({ id: o.id })
            answer = deepChildren.find(id => id === _next.id)
            
        } else if (k0 === "in()") {
            
            var _next = toValue({ _window, id, value: args[1], __,  e })
            if (!_next) return

            if (Array.isArray(_next)) return answer = _next.find(el => isEqual(el, o))
            if (!_next.__view__) return false

            var deepChildren = getDeepChildrenId({ id: _next.id })
            answer = deepChildren.find(id => id === o.id)

        } else if (k0 === "out()") {
            
            var _next = toValue({ _window, id, value: args[1], __,  e })
            if (!_next) return

            if (Array.isArray(_next)) return answer = !_next.find(el => isEqual(el, o))
            if (!_next.__view__) return false

            var deepChildren = getDeepChildrenId({ id: _next.id })
            answer = !deepChildren.find(id => id === o.id) && o.id !== _next.id
            
        } else if (k0 === "is()") {
            
            var _next = toValue({ _window, lookupActions, stack, id, value: args[1], __,  e })
            if (o.__view__ && _next.__view__) return answer = o.id === _next.id
            answer = isEqual(o, _next)
            
        } else if (k0 === "opp()") {

            if (!isNaN(o)) answer = -1 * o
            else if (typeof o === "boolean") answer = !o
            else if (o === "true" || o === "false") {
                if (o === "true") answer = false
                else answer = true
            }

        } else if (k0 === "abs()") {
            
            o = o.toString()

            var isPrice
            if (o.includes(",")) isPrice = true
            o = toNumber(o)

            answer = Math.abs(o)
            if (isPrice) answer = answer.tovieweString()
            
        } else if (k0 === "sum()") {
            
            if (Array.isArray(o)) answer = o.reduce((o, k) => o + toNumber(k), 0)

        } else if (k0 === "src()") {

            if (key && value !== undefined) answer = o.element.src = value
            else answer = o.element.src

        } else if (k0 === "read()") {
            
          var _files = toValue({ _window, lookupActions, stack, id, value: args[1], __, e })

          if (!_files) return
          _files = toArray(_files)
          global.files = []

          var __key = generate()
          global.__counter__ = global.__counter__ || {}
          global.__counter__[__key] = {
            length: _files.length,
            count: 0
          }

          _files.map(file => {
            
            var reader = new FileReader()
            reader.onload = (e) => {

              global.__counter__[__key].count++;
              global.files.push({
                readAsDataURL: true,
                type: file.type,
                lastModified: file.lastModified,
                name: file.name,
                size: file.size,
                url: e.target.result
              })

              if (global.__counter__[__key].count === global.__counter__[__key].length) {
                global.file = global.files[0]
                global.files = global.files
                console.log(global.files);
                toParam({ _window, lookupActions, stack, id, e, __, string: args[2] })
              }

            }

            reader.readAsDataURL(file)
          })

        } else if (k0 === "notify()") {

          var notify = () => {
            if (isParam({ _window, string: args[1] })) {

              var _params = toParam({ _window, id, e, __,  string: args[1] })
              new Notification(_params.title || "", _params)

            } else {

              var title = toValue({ _window, id, e, __, value: args[1] })
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

            alert(toValue({ _window, id, value: args[1], __, e }))

        } else if (k0 === "clone()") {
            
            answer = clone(o)

        } else if (k0 === "override()") {
            
            var nextObject = toValue({ _window, id, value: args[1], __, e })

            if (Array.isArray(o)) {

                if (Array.isArray(nextObject)) answer = o = [...o, ...nextObject]
                else if (typeof nextObject === "object") answer = o = [...o, ...Object.values(nextObject)]

            } else if (typeof o === "object") {
                
                return answer = override(o, nextObject)

            } else answer = o = nextObject

        } else if (k0 === "label()") {

            var _view = o.__view__ ? o : view
            var deepChildren = getDeepChildren({ id: _view.id })
            if (_view.__label__) answer = _view
            else if (deepChildren.find(_v => _v.__label__)) answer = deepChildren.find(_v => _v.__label__)

        } else if (k0 === "txt()") {

            var el = o.__view__ ? o.element : views[id].element
            if (!el) return
            
            var _view
            if (views[el.id].__callingRef__.find(ad => ad.action.includes("txt()"))) 
                _view = toValue({ _window, id: el.id, value: views[el.id].__callingRef__.find(ad => ad.action.includes("txt()")).path })
            else _view = view[el.id]

            if (!_view) return o

            if (_view.name === "Input") {

                answer = _view.value
                if (i === lastIndex && key && value !== undefined && o._viewement) answer = _view.value = value
                else if (path[i + 1] === "del()") {
                    breakRequest = i + 1
                    answer = _view.value = ""
                }
                
            } else {

                answer = (_view.textContent === undefined) ? _view.innerText : _view.textContent
                if (i === lastIndex && key && value !== undefined) answer = _view.innerHTML = value
                else if (path[i + 1] === "del()") {
                    breakRequest = i + 1
                    answer = _view.innerHTML = ""
                }
            }
            
            //if (_view.required) answer = answer.slice(0, -1)
 
        } else if (k0 === "min()") {
            
            var _view
            if (views[el.id].__callingRef__.find(ad => ad.action.includes("min()")))
                _view = toValue({ _window, id: el.id, value: views[el.id].__callingRef__.find(ad => ad.action.includes("min()")).path })
            else _view = view[el.id]

            if (!_view) return o
            
            var el = _view.element

            if (el) answer = _view.min = el.min
            if (i === lastIndex && key && value !== undefined) el.min = _view.min = value
 
        } else if (k0 === "max()") {
            
            var _view
            if (views[el.id].__callingRef__.find(ad => ad.action.includes("max()")))
                _view = toValue({ _window, id: el.id, value: views[el.id].__callingRef__.find(ad => ad.action.includes("max()")).path })
            else _view = view[el.id]

            if (!_view) return o
            
            var el = _view.element
            
            if (el) answer = _view.max = el.max
            if (i === lastIndex && key && value !== undefined) el.max = _view.max = value

        } else if (k0 === "unshift()") { // push to the begining

          var _item = toValue({ _window, lookupActions, stack, id, value: args[1], __, e, object })
          var _index = 0
          if (_index === undefined) _index = o.length
          
          if (Array.isArray(_item)) {
              
              _item.map(_item => {
                  o.splice(_index, 0, _item)
                  _index += 1
              })

          } else if (Array.isArray(o)) o.splice(_index, 0, _item)
          answer = o
            
        } else if (k0 === "push()") { // push by index

            if (!Array.isArray(o)) 
                o = reducer({ _window, id, path: path.slice(0, i), value: [], key: true, __, e, object: _object })
            
            var _item, _index
            if (underScored) {
                _item = toValue({ _window, id, value: args[1], __: [o, ...__], e, object })
                _index = toValue({ _window, id, value: args[2], __: [o, ...__], e, object })
            } else {
                _item = toValue({ _window, id, value: args[1], __, e, object })
                _index = toValue({ _window, id, value: args[2], __, e, object })
            }

            if (_index === undefined) _index = o.length
            
            if (Array.isArray(_item)) {
                
                _item.map(_item => {
                    o.splice(_index, 0, _item)
                    _index += 1
                })

            } else if (Array.isArray(o)) o.splice(_index, 0, _item)

            answer = o
            
        } else if (k0 === "pull()") { // pull by index or by conditions

            // if no index pull the last element
            var _last = 1, _text, my__ = underScored ? [o, ...__] : __
            var _first = args[1] !== undefined ? toValue({ _window, id, value: args[1], __: my__, e, object }) : 0
            if (args[2]) _last = toValue({ _window, id, value: args[2], __: my__, e, object })

            if (typeof _first !== "number") {

                var _items
                
                if (underScored) _items = o.filter(o => toApproval({ _window, e, string: args[1], id, __: [o, ...__] }) )
                else _items = o.filter(o => toApproval({ _window, e, string: args[1], id, object: o, __ }))
                
                _items.filter(data => data !== undefined && data !== null).map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })
                
                return answer = o
            }

            o.splice(_first, _last || 1)
            answer = o
            
        } else if (k0 === "pullItem()") { // pull item

            var _item = toValue({ _window, id, value: args[1], __, e, object })
            var _index = o.findIndex(item => isEqual(item, _item))
            if (_index !== -1) o.splice(_index,1)
            answer = o
            
        } else if (k0 === "uniquify()") { // remove duplicates | also conditions work 
            
            if (args[1]) {

                var firstIndex = o.findIndex(o => toApproval({ _window, e, string: args[1], id, __, object: o }) )
                while (o.slice(firstIndex + 1).find(o => toApproval({ _window, e, string: args[1], id, __, object: o }) )) {
                    o.splice(o.slice(firstIndex + 1).findIndex(o => toApproval({ _window, e, string: args[1], id, __, object: o }) ), 1)
                }

            } else {

                var list = [], splicedTimes = 0
                o.map((item, i) => {
                    if (!list.find(item1 => isEqual(item, item1))) list.push(item)
                    else {
                        o.splice(i - splicedTimes, 1)
                        splicedTimes++
                    }
                })
            }

            return o

        } else if (k0 === "uniquifyItem()") { // remove duplicates by item 
            
            if (args[1]) {
                
                var item = toValue({ _window, e, id, value: args[1], __ })
                var firstIndex = o.findIndex(o => isEqual(o, item) )
                while (o.slice(firstIndex + 1).find(o => isEqual(o, item) )) {
                    o.splice(o.slice(firstIndex + 1).findIndex(o => isEqual(o, item) ), 1)
                }
                return o
            }
            
        } else if (k0 === "splice()") {

            // push at a specific index / splice():value:index
            var _value = toValue({ _window, id, value: args[1], __ ,e })
            var _index = toValue({ _window, id, value: args[2], __ ,e })
            if (_index === undefined) _index = o.length - 1

            o.splice(parseInt(_index), 0, _value)
            answer = o
            
        } else if (k0 === "rem()") { // remove child with/without data
            
            clearTimeout(global["__tooltipTimer__"])
            delete global["__tooltipTimer__"]
            views.tooltip.element.style.opacity = "0"

            var remData = toValue({ _window, id, value: args[1], __, e })

            var _parent = views[o.parent]
            var childIndex = _parent.__childrenID__.findIndex(_id => _id === o.id)
            _parent.__childrenID__.splice(childIndex, 1)
            _parent.__childrenID__.map(id => (views[id].index > childIndex) && views[id].index--)
            
            remove({ id: params.id || o.id, remove: { onlyChild: remData === false ? false : true } })
            return true

        } else if (k0 === "remChild()") { // remove only view without removing data

            if (args[1]) {
                var _id = toValue({ _window, lookupActions, stack, id, value: args[1],_ ,e })
                if (!views[_id]) return console.log("View doesnot exist!")
                return remove({ id: _id, remove: { onlyChild: true } })
            }

            var _id = typeof o === "string" ? o : o.id
            if (!views[_id]) return console.log("View doesnot exist!")
            remove({ id: o.id, remove: { onlyChild: true } })

        } else if (k0 === "droplist()") {
            
            var _params = toParam({ _window, lookupActions, stack, e, id, string: args[1], __ })
            require("./droplist").droplist({ id, e, droplist: _params })
            
        } else if (k0 === "keys()") {
            
            answer = Object.keys(o)
            
        } else if (k0 === "values()") { // values in an object
            
            if (Array.isArray(o)) answer = o
            else answer = Object.values(o)
            
        } else if (k0 === "gen()") {
            
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ _window, id, e, __,  string: args[1] })
                _params.length = _params.length || _params.len || 5
                _params.number = _params.number || _params.num
                answer = generate(_params)

            } else {

                var length = toValue({ _window, id, e, __, value: args[1] }) || 5
                answer = generate({ length })
            }

        } else if (k0 === "inc()") {
          
            var _item = toValue({ _window, id, e, value: args[1], __ })

            if (typeof _item !== "object") answer = o.includes(_item)
            else answer = o.find(item => isEqual(item, _item)) ? true : false

        } else if (k0 === "capitalize()") {
            
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ _window, id, e, __,  string: args[1] })
                if (_params.all) answer = capitalize(o)
                else answer = capitalizeFirst(o)

            } else answer = capitalize(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()") {
            
            var _o
            if (args[1]) _o = toValue({ _window, id, e, value: args[1], __ })
            else _o = o
            answer = typeof _o === "string" ? _o.toUpperCase() : _o
            
        } else if (k0 === "lowercase()") {
            
            answer = o.toLowerCase()
            
        } else if (k0 === "len()") {
            
          if (Array.isArray(o)) answer = o.length
          else if (typeof o === "string") answer = o.split("").length
          else if (typeof o === "object") answer = Object.keys(o).length
            
        } else if (k0 === "require()") {

            require(toValue({ _window, lookupActions, stack, id, e, __,  value: args[1] }))

        } else if (k0 === "new()") { //new():Class:1:2:3...
            
          var myparams = [], _className = toValue({ _window, lookupActions, stack, id, e, __, value: args[1] })
          args.slice(1).map(arg => {
            myparams.push(toValue({ _window, lookupActions, stack, id, e, __,  value: arg || "" }))
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
            
        } else if (k0 === "toDigitalClock()") { // converts timestamp to dd:hh:mm:ss
            
            var _params = toParam({ _window, id, e, string: args[1], __ })
            if (!_params.timestamp) _params.timestamp = o

            answer = toClock(_params)
            
        } else if (k0 === "toSimplifiedDateAr()") {
            
            var _params = toParam({ _window, id, e, string: args[1], __ })
            answer = toSimplifiedDate({ timestamp: o, lang: "ar", time: _params.time })

        } else if (k0 === "toSimplifiedDate()") {
            
            var _params = toParam({ _window, id, e, string: args[1], __ })
            answer = toSimplifiedDate({ timestamp: o, lang: "en", time: _params.time })

        } else if (k0 === "ar()") {
            //
            if (Array.isArray(o)) answer = o.map(o => o.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d]))
            else answer = o.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])

        } else if (k0 === "date()") {

            var _o
            if (args[1]) _o = toValue({ _window, lookupActions, stack, id, e, value: args[1], __ })
            else _o = o

            if (!isNaN(_o) && typeof _o === "string") _o = parseInt(_o)
            answer = new Date(_o)

        } else if (k0 === "toDateFormat()") { // returns date for input

            if (isParam({ _window, string: args[1] })) {

                var _options = toParam({ _window, lookupActions, stack, id, e, __,  string: args[1] })
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

                      var utc_days  = Math.floor(serial - 25569)
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

              var format = toValue({ _window, lookupActions, stack, id, e, value: args[1], __ }) || "format1"

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
              else if (format.replace(" ", "") === "format4")return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}${` | ${_hour.toString().length === 2 ? _hour : `0${_hour}`}:${_mins.toString().length === 2 ? _mins : `0${_mins}`}`}`
            }

        } else if (k0 === "toDateInputFormat()" || k0 === "formatDate()") { // returns date for input in a specific format

            var _params = {}
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ _window, lookupActions, stack, id, e, __,  string: args[1] })
            } else if (args[1]) {
                _params = { date: toValue({ _window, lookupActions, stack, id, e, value: args[1], __ }) }
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

            }
            
            return newDate

        } else if (k0 === "toUTCString()") {
            
            if (!isNaN(o) && (parseFloat(o) + "").length === 13) o = new Date(parseFloat(o))
            answer = o.toUTCString()
            
        } else if (k0 === "getGeoLocation") {

          navigator.geolocation.getCurrentPosition((position) => { console.log(position); global.geolocation = position })

        } else if (k0 === "counter()") {
            
          var _options = {}
          if (isParam({ _window, string: args[1] })) _options = toParam({ _window, lookupActions, stack, id, e, __,  string: args[1] })
          else _options = toValue({ _window, lookupActions, stack, id, e, value: args[1], __ })

          _options.counter = _options.counter || _options.start || _options.count || 0
          _options.length = _options.length || _options.len || _options.maxLength || 0
          _options.end = _options.end || _options.max || _options.maximum || 999999999999
          //_options.timer = _options.timer || (new Date(_date.setHours(0,0,0,0))).getTime()

          answer = require("./counter").counter({ ..._options })

        } else if (k0 === "timestamp()") {
            
            var _o
            if (args[1]) _o = toValue({ _window, id, e, value: args[1] || "", __ })
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

        } else if (k0 === "moment()" || k0 === "currentDate()") {
            
            answer = new Date()
            
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

            answer = _date.setHours(_hrs,_min,0,0)
            
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

            answer = _date.setHours(23 + _hrs,59 + _min,59,999)
            
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

            answer = new Date(_date.setMonth(_date.getMonth(), 1)).setHours(_hrs,_min,0,0)

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

            answer = new Date(_date.setMonth(_date.getMonth(), getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs,_min,0,0)
            
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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs,_min,0,0)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs,_min,0,0)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, 1)).setHours(_hrs,_min,0,0)

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
            answer = new Date(new Date(_date.setYear(year)).setMonth(month, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            
            answer = new Date(_date.setMonth(0, 1)).setHours(_hrs,_min,0,0)

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
            
            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            
            answer = new Date(_date.setMonth(0, 1)).setHours(_hrs,_min,0,0)

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
            
            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

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
            
            answer = new Date(_date.setMonth(0, 1)).setHours(_hrs,_min,0,0)

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
            
            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

        } else if (k0 === "replace()") { //replace():prev:new

            if (!Array.isArray(o) && typeof o !== "string") 
            o = reducer({ _window, id, path: path.slice(0, i), value: [], key: true, __, e, object: _object })

            var rec0, rec1
            rec0 = toValue({ _window, id, e, __, value: args[1] || "" })
            rec1 = toValue({ _window, id, e, __, value: args[2] || "" })

            if (typeof o === "string") {

                if (rec1 !== undefined) answer = o.replace(rec0, rec1)
                else answer = o.replace(rec0)

            } else if (Array.isArray(o)) {

                var _itemIndex = o.findIndex(item => isEqual(item, rec0)), rec2 = rec1 || rec0 // replace():rec0:rec1 || replace():rec0 (if rec0 doesnot exist push it)
                if (_itemIndex >= 0) o[_itemIndex] = rec2
                else o.push(rec2)
                return o
            }
            
        } else if (k0 === "import()") {
        
            var _params = toParam({ _window, id, e, __, string: args[1] })
            _params.type = _params.json ? "json" : _params.type

            var _await = "", address = {}
            if (args[2]) {
                _await = global.__refs__[args[2]]
                address = { id: generate(), asynchronous: true, await: _await, requesterID: id, creationDate: (new Date()).getTime(), callerActionName: "import()" }
                stack.addresses.unshift(address)
                
                if (global.__waitAdds__.length > 0) address.headAddress = global.__waitAdds__[0]
            }

            if (_params.type === "json") {
                
                importJson({ _window, address, lookupActions, stack, id, e, __ })
                return true

            } else {

                require(toValue({ _window, lookupActions, stack, address, id, e, __, value: args[1] }))
            }
        
        } else if (k0 === "export()") {
        
            var _params = toParam({ _window, id, e, __, string: args[1] })
            if (_params.json) _params.type = "json"
            else if (_params.csv) _params.type = "csv"
            else if (_params.excel) _params.type = "excel"
            else if (_params.pdf) _params.type = "pdf"

            if (_params.type === "json") exportJson(_params)
            else if (_params.type === "csv") require("./toCSV").toCSV(_params)
            else if (_params.type === "excel") require("./toExcel").toExcel(_params)
            else if (_params.type === "pdf") require("./toPdf").toPdf({ options })
        
        } else if (k0 === "flat()") { // flat():map1:map2:map3 or flat()
            
            if (!args.slice(1).find(arg => arg)) {

                if (typeof o === "object" && Array.isArray(o)) {
                    o = [...o]
                    answer =  o.flat()
                } else if (typeof o === "object" && typeof object === "object") {
                    _object = { ..._object, ...o }
                } return o

            } else {

                if (Array.isArray(o)) answer = [...o]
                else if (typeof o === "object") answer = {...o}

                args.slice(1).map(arg => {
                    var _obj = toValue({ _window, id, e, __, value: arg })
                    if (Array.isArray(answer)) answer = [...answer, ..._obj]
                    else if (typeof answer === "object") answer = { ...o, ..._obj }
                })
            }
            
        } else if (k0 === "deepChildren()") {
            
            answer = getDeepChildren({ _window, lookupActions, stack, id: o.id })
            
        } else if (k0 === "filter()") {
            
            var noargs
            if (!args[0]) noargs = true
            
            if (noargs) answer = toArray(o).filter(o => o !== "" && o !== undefined && o !== null)
            else args.slice(1).map(arg => {

                if (underScored === 2) answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, e, string: arg, id, __: [o, index, ...__] }) )
                else if (underScored === 1) answer = toArray(o).filter((o) => toApproval({ _window, lookupActions, stack, e, string: arg, id, __: [o, ...__] }) )
                else answer = toArray(o).filter((o) => toApproval({ _window, lookupActions, stack, e, string: arg, id, object: o, __ }))
            })

            return answer
            
        } else if (k0 === "find()") {
            
            if (i === lastIndex && key && value !== undefined) {

                var _index
                
                if (underScored === 2) _index = toArray(o).findIndex((o, index) => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __: [o, index, ...__] }) )
                else if (underScored === 1) _index = toArray(o).findIndex((o, index) => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __: [o, ...__] }) )
                else _index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __, object: o }) )
                
                if (_index !== undefined && _index !== -1) o[_index] = answer = value
                
            } else {

                if (underScored === 2) answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __: [o, index, ...__] }) )
                else if (underScored === 1) answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __: [o, ...__] }) )
                else answer = toArray(o).find(o => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __, object: o }) )
            }
            
        } else if (k0 === "findItem()") {
            
            var _item = toValue({ _window, value: args[1], __, e })
            return toArray(o).find(item => isEqual(item, _item))
            
        } else if (k0 === "sort()") {
            
            var _array, _params = {}
            if (Array.isArray(o)) _array = o
            if (isParam({ _window, string: args[1] })) {
                
                _params = toParam({ _window, id, e, __, string: args[1] })
                _params.data = _params.data || _params.list || _array
            }
            
            if (!_params.data && _array) _params.data = _array
            
            // else return o
            _params.data = answer = require("./sort").sort({ _window, sort: _params, id, e })
            
            return answer

        } else if (k0 === "findIndex()") {
            
            if (typeof o !== "object") return
            
            if (underScored === 2) answer = toArray(o).findIndex((o, index) => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __: [o, index, ...__] }) )
            else if (underScored === 1) answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __: [o, ...__] }) )
            else answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, e, string: args[1], id, __, object: o }) )
            
        } else if (k0 === "()") { // loop() || map()
            
            var notArray = false
            if (args[1] && args[1].slice(0, 6) === "coded@") args[1] = global.__refs__[args[1]]
            if (typeof o === "object" && !Array.isArray(o)) notArray = true
            if (underScored === 1) {
              
              toArray(o).map(o => reducer({ _window, lookupActions, stack, id, path: args[1] || [], value, __: [o, ...__], e, object, toView }) )
              answer = o
                
            } else if (underScored === 2) {
              
              toArray(o).map((o, index) => reducer({ _window, lookupActions, stack, id, path: args[1] || [], value, __: [o, index, ...__], e, object, toView }) )
              answer = o
              
            } else {
              answer = toArray(o).map(o  => reducer({ _window, lookupActions, stack, id, path: args[1] || [], object: o, value, __, e, toView }) )
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

                _params = toParam({ _window, lookupActions, stack, id, e, _, string: args[1] })
                _el = _params.element || _params.id || _params.view || o

            } else if (args[1]) _el = toValue({ _window, lookupActions, stack, id, e, __, value: args[1] })
            else if (o) _el = o

            var opt = {
                margin:       [0.1, 0.1],
                filename:     _params.name || generate({ length: 20 }),
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, dpi: 300 },
                jsPDF:        { unit: 'in', format: _params.size || 'A4', orientation: 'portrait' },
                execludeImages: _params.execludeImages || false
            }

            var _await = "", address = {}
            if (args[2]) {
                _await = global.__refs__[args[2]]
                address = { id: generate(), asynchronous: true, await: _await, requesterID: id, creationDate: (new Date()).getTime(), callerActionName: "html2pdf()" }
                stack.addresses.unshift(address)
                
                if (global.__waitAdds__.length > 0) address.headAddress = global.__waitAdds__[0]

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
                                    exportHTMLToPDF({ _window, pages: _elements, opt, lookupActions, stack, address, id, e, __, args })

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
                                    if (args[2]) toAwait({ _window, lookupActions, stack, address, id, e, __: [pdf, __] })
                                    window.devicePixelRatio = 1
                                })
                            }
                        })
                    })

                } else html2pdf().set(opt).from(_element).save().then((pdf) => {


                    // await params
                    if (args[2]) toAwait({ _window, lookupActions, stack, address, id, e, __: [pdf, __] })
                    window.devicePixelRatio = 1
                })
            })

            document.getElementById("loader-container").style.display = "none"
            sleep(10)

        } else if (k0 === "share()") {

            if (isParam({ _window, string: args[1] })) { // share():[text;title;url;files]

                var _params = toParam({ _window, lookupActions, stack, id, e, __, string: args[1] }) || {}, images = []
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
                navigator.share({ url: toValue({ _window, lookupActions, stack, id, e, __, value: args[1] })})
            }

        } else if (k0 === "repeat()") {

            var repeatData = toValue({ _window, id, e, __, value: args[1], object })
            var repetions = toValue({ _window, id, e, __, value: args[2], object })
            var loop = []
            for (var i = 0; i < repetions; i++) { loop.push(repeatData) }
            return loop

        } else if (k0 === "loader()") {

          var _params = {}
          if (isParam({ _window, string: args[1] })) {
          
            _params = toParam({ _window, lookupActions, stack, id, e, __, string: args[1] })
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
            _o.__events__ = toArray(_o.__events__)
            return _o.__events__.push({
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

        } else if (k0 === "type()") {
            
            if (args[1]) answer = getType(toValue({ _window, id, e, __, value: args[1] }))
            else answer = getType(o)

        } else if (k0 === "coords()") {

          var _id = o.id
          if (args[1]) _id = toValue({ _window, id, e, __, value: args[1] })
          return require("./getCoords")({ id: _id || id })

        } else if (k0 === "price()") {
            
            var _price
            if (args[1]) _price = toValue({ _window, id, e, __, value: args[1] })
            else _price = o
            answer = parseFloat(_price)
            answer = formatter.format(answer).slice(1)
            
        } else if (k0 === "bool()") {

            answer = o === "true" ? true : o === "false" ? false : undefined
            
        } else if (k0 === "num()") {

            answer = toNumber(o)
            
        } else if (k0 === "isNum()") {

            answer = !isNaN(o)

        } else if (k0 === "round()") {

          if (!isNaN(o)) {
            var nth = toValue({ _window, lookupActions, stack, id, e, __, value: args[1] }) || 2
            answer = parseFloat(o || 0).toFixed(nth)
          }
            
        } else if (k0 === "nthEl()") {
            
            var nth = toValue({ _window, id, e, __, value: args[1] })
            if (value !== undefined && key && i === lastIndex) answer = o[nth] = value
            answer = o[0]
            
        } else if (k0 === "1stEl()") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[0] = value
            answer = o[0]
            
        } else if (k0 === "2ndEl()") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[1] = value
            answer = o[1]

        } else if (k0 === "3rdEl()") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[2] = value
            answer = o[2]

        } else if (k0 === "nthLastEl()") {
            
            var nth = toValue({ _window, id, e, __, value: args[1] })
            if (value !== undefined && key && i === lastIndex) answer = o[o.length - nth] = value
            answer = o[0]
            
        } else if (k0 === "3rdLastEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[o.length - 3] = value
            answer = o[o.length - 3]
            
        } else if (k0 === "2ndLastEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[o.length - 2] = value
            answer = o[o.length - 2]
            
        } else if (k0 === "lastEl()") {

            if (value !== undefined && key && i === lastIndex) answer = o[o.length - 1] = value
            answer = o[o.length - 1]
            
        } else if (k0 === "lastIndex()") {

            answer = o.length ? o.length - 1 : 0

        } else if (k0 === "2ndLastIndex()") {

            answer = o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

        } else if (k0 === "el()") {
          
            answer = o.element

        } else if (k0 === "checked()") {

            var _o

            if (o.checked) _o = o
            else if (o.element.children[0] && views[o.element.children[0].id].checked) _o = views[o.element.children[0]]
            else if (views[o.element.parentNode.id].checked) _o = views[o.element.parentNode.id]
            else return

            if (value !== undefined && key) answer = __o.checked.checked = __o.element.checked = value
            else answer = __o.checked.checked || __o.element.checked || false
        
        } else if (k0 === "check()") {

            breakRequest = true
            
            var _o

            if (o.checked) _o = o
            else if (o.element.children[0] && views[o.element.children[0].id].checked) _o = views[o.element.children[0]]
            else if (views[o.element.parentNode.id].checked) _o = views[o.element.parentNode.id]
            else return

            answer = _o.checked.checked = _o.element.checked = _o.checked.checked === true ? false : true
        
        } else if (k0 === "getCookie()") {

            // getCookie():name
            var _name = toValue({ _window, lookupActions, stack, id, e, __,  value: args[1] })
            var _cookie = getCookie({ name: _name, _window })
            return _cookie

        } else if (k0 === "eraseCookie()") {

            if (_window) return views.root.__events__.push({ event: `loaded?${pathJoined}` })
            var _name = toValue({ _window, lookupActions, stack, id, e, __,  value: args[1] })
            var _cookie = eraseCookie({ name: _name, _window })
            return _cookie

        } else if (k0 === "setCookie()") {

            if (_window) return views.root.__events__.push({ event: `loaded?${pathJoined}` })

            // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
            var cookies = []
            if (isParam({ _window, string: args[1] })) {

                args.slice(1).map(arg => {

                    var _params = toParam({ _window, lookupActions, stack, id, e, __, string: arg })
                    setCookie({ ..._params, _window })

                    cookies.push(_params)
                })

            } else {

                var _name = toValue({ _window, lookupActions, stack, id, e, __,  value: args[1] })
                var _value = toValue({ _window, lookupActions, stack, id, e, __,  value: args[2] })
                var _expiryDate = toValue({ _window, lookupActions, stack, id, e, __,  value: args[3] })

                setCookie({ name: _name, value: _value, expires: _expiryDate, _window })
            }

            
            if (cookies.length === 1) return cookies[0]
            else return cookies

        } else if (k0 === "cookie()") {

            var _params = toParam({ _window, lookupActions, stack, id, e, __, string: args[1] })

            if (params.method === "set") return setCookie({ ..._params, _window })
            else if (params.method === "delete") return eraseCookie({ ..._params, _window })
            else if (params.method === "get") return getCookie({ ..._params, _window })

        } else if (k0 === "split()") {
            
            var splited = toValue({ _window, lookupActions, stack, id, e, __, value: args[1] })
            answer = o.split(splited)

        } else if (k0 === "join()") {

            var joiner = toValue({ _window, lookupActions, stack, id, e, value: args[1] || "", __ })
            answer = o.join(joiner)

        } else if (k0 === "route()") {
            
            if (isParam({ _window, string: args[1] })) {

                var route = toParam({ _window, id, e, string: args[1] || "", __ })
                require("./route").route({ _window, lookupActions, stack, id, route })
                
            } else {
                
                // route():page:path
                var _page = toValue({ _window, id, e, value: args[1] || "", __ })
                var _path = toValue({ _window, id, e, value: args[2] || "", __ })
                require("./route").route({ _window, lookupActions, stack, id, route: { path: _path, page: _page } })
            }

        } else if (k0 === "createDoc()") {

            var address = addresser({ asynchronous: true, await: args[2], DOMRendering: true, renderingID: o.__view__ ? o.id : id, requesterID: id, callerActionName: "createDoc()" })
            createDoc({ _window })
            return ({ __asynchronous__: true, __action__: "createDoc()" })

        } /*else if (k0 === "toggleView()") {
          
            var toggle = {}
            if (isParam({ _window, string: args[1] })) {

                toggle = toParam({ _window, id, e, string: args[1] || "", __ })

            } else toggle = { view: toValue({ _window, id, e, value: args[1] || "", __ }) }

            require("./toggleView").toggleView({ _window, lookupActions, stack, toggle, id: o.id })
            return true

        } */else if (k0 === "note()") { // note
            
            var data = toValue({ _window, id, e, __, value: args[1] })
            return note({ note: data })
            
        } else if (k0 === "mininote()") {
          
            var _text = toValue({ _window, id, e, __, value: args[1] })
            var mininoteControls = toCode({ _window, id, string: `():mininote-text.txt()=${_text};clearTimer():[__mininoteTimer__:()];():mininote.style():[opacity=1;transform=scale(1)];__mininoteTimer__:()=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            return toParam({ _window, string: mininoteControls, e, id, __ })

        } else if (k0 === "tooltip()") {
          
            var _text = toValue({ _window, id, e, __, value: args[1] })
            var mininoteControls = toCode({ _window, id, string: `():tooltip-text.txt()=${_text};clearTimer():[__tooltipTimer__:()];():tooltip.style():[opacity=1;transform=scale(1)];__tooltipTimer__:()=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            return toParam({ _window, string: mininoteControls, e, id, __ })

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

            var _index = 0, _range = []
            var _startIndex = args[2] ? toValue({ _window, id, e, __, value: args[1] }) : 0 || 0
            var _endIndex = args[2] ? toValue({ _window, id, e, __, value: args[2] }) : toValue({ _window, id, e, __, value: args[1] })
            var _steps = toValue({ _window, id, e, __, value: args[3] }) || 1
            var _lang = args[4] || ""
            _index = _startIndex
            while (_index <= _endIndex) {
                if ((_index - _startIndex) % _steps === 0) {
                    _range.push(_index)
                    _index += _steps
                }
            }
            if (_lang === "ar") _range = _range.map(num => num.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d]))
            answer = _range
            
        } else if (k0 === "qr()") {

            if (res && !res.headersSent) {

                var data = isParam({ _window, string: args[1] }) ? toParam({ _window, id, e, __, string: args[1] }) : toValue({ _window, id, e, __, value: args[1] })
                if (typeof data !== "object") data = { text: data }
                if (data.data && data.text === undefined) data.text = data.data
                if (data.wifi && data.password && (data.ssid || data.name)) data.text = `WIFI:S:${data.name || data.ssid};T:${data.type || "WPA"};P:${data.password || ""};;${data.url || ""} `
                
                require('qrcode').toDataURL(data.text).then(data => {

                    var _data = { message: "QR generated successfully!", data, success: true }
                    toParam({ _window, id, e, __: [_data, ...__], string: args[2] })
                })
            }

        } else if (k0 === "contact()") {

            if (res && !res.headersSent) {
                
                var data = toValue({ _window, id, e, __, string: args[1] })
                if (typeof data !== "obejct") return o

                if (data.firstName && data.lastName && data.workPhone) {

                    // create a new vCard
                    const vCard = require("vcards-js")();

                    if (data.photo) vCard.photo.attachFromUrl(data.photo)
                    if (data.logo) vCard.logo.attachFromUrl(data.logo)

                    delete data.logo
                    delete data.photo

                    Object.entries(data).map((key, value) => vCard[key] = value)
                
                    vCard.firstName = data.firstName || "";
                    vCard.middleName = data.middleName || "";
                    vCard.lastName = data.lastName || "";
                    vCard.organization = data.organization || "";
                    
                    if (data.birthday && data.birthday.split("/")[0] !== undefined && data.birthday.split("/")[1] !== undefined && data.birthday.split("/")[2] !== undefined) 
                        vCard.birthday = new Date(parseInt(data.birthday.split("/")[2]), parseInt(data.birthday.split("/")[1] - 1), parseInt(data.birthday.split("/")[0]));
                    
                    res.set('Content-Type', `text/vcard; name="${(data.firstName || "") + " " + (data.lastName || "")}.vcf"`);
                    res.set('Content-Disposition', `inline; filename="${(data.firstName || "") + " " + (data.lastName || "")}.vcf"`);
                    
                    res.send(vCard.getFormattedString())
                }
                
            } else func({ _window, id, e, action: { actions: decode({ _window, string: k }) }, __, lookupActions, stack, address })
    
        } else if (k0 === "update()") {

            if (_window) return view.__events__.push({ event: `loaded?${pathJoined}` })
            var data = toValue({ _window, id, e, __, value: args[1] })
            
            var address = addresser({ asynchronous: true, await: args[2], DOMRendering: true, renderingID: o.__view__ ? o.id : id, requesterID: id, callerActionName: "update()" })

            require("./update").update({ _window, lookupActions, stack, id: o.id, mainId: id, address, __ })
            return ({ __asynchronous__: true, __action__: "update()" })

        } else if (k0 === "upload()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "upload()" })
            var data = toParam({ _window, id, e, __,  string: args[1] })
            require("./upload")({ _window, lookupActions, stack, id, address, e, __,  upload: data })
            return ({ __asynchronous__: true, __action__: "upload()" })

        } else if (k0 === "confirmEmail()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "confirmEmail()" })
            var data = toParam({ _window, lookupActions, id, e, __, string: args[1] })
            data.store = "confirmEmail"
            require("./save").save({ id, lookupActions, stack, address, e, __, save: data })
            return ({ __asynchronous__: true, __action__: "confirmEmail()" })

        } else if (k0 === "save()") {
          
            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "save()" })
            var data = toParam({ _window, lookupActions, id, e, __,  string: args[1] })
            require("./save").save({ _window, lookupActions, stack, id, e, __, address, save: data })
            return ({ __asynchronous__: true, __action__: "save()" })

        } else if (k0 === "fetch()") {



        } else if (k0 === "insert()") {
            
            var _id = id
            if (o.__view__) _id = o.id

            var address = addresser({ asynchronous: true, await: args[2], requesterID: _id, callerActionName: "insert()" })
            var data = toValue({ _window, lookupActions, id, e, __, value: args[1], object })
            insert({ id: data.id || _id, insert: data, lookupActions, stack, address, __ })
            return ({ __asynchronous__: true, __action__: "insert()" })

        } else if (k0 === "mail()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "mail()" })
            var data = toParam({ _window, id, e, __,  string: args[1] })

            if (!_window) {

                var action = { data, actions: `mail():[subject=_.subject;content=_.content;text=_.text;html=_.html;recipient=_.recipient;recipients=_.recipients;attachments=_.attachments]:[send():_]` }
                return func({ _window, id, lookupActions, stack, address, e, action, __ })
            }

            else require("./mail").mail({ _window, lookupActions, stack, address, id, e, __ })
            return ({ __asynchronous__: true, __action__: "mail()" })

        } else if (k0 === "print()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "print()" })
            var data = toValue({ _window, lookupActions, stack, id, e, __, value: args[1] })
            if (!data.id && !data.view) data.id = o.id
            if (data.view) data.id = data.view.id

            require("./print").print({ id, options: data, lookupActions, stack, address, id, e, __ })
            return ({ __asynchronous__: true, __action__: "print()" })

        } else if (k0 === "read()") {

            var data = toValue({ _window, lookupActions, stack, id, e, __,  value: args[1] })

            if (data.file || data.files) data.type = "file"

            if (data.type === "file") {
                data.files = (data.file ? toArray(data.file) : data.files) || []

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
                            file: e.target.result,
                            url: e.target.result
                        })

                        if (global.__COUNTER__[__key].count === global.__COUNTER__[__key].length) {

                            global.file = global.fileReader[0]
                            global.files = global.fileReader
                            console.log(global.files, global.file);
                            toParam({ _window, lookupActions, stack, id, e, __: [global.files.length === 1 ? global.files[0] : global.files, ...__.slice(0, 9)],  string: args[2] })
                        } 
                    }

                    try {
                        reader.readAsDataURL(file)
                    } catch (er) {
                        document.getElementById("loader-container").style.display = "none"
                    }
                })
            }

        } else if (k0 === "view()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "view()" })
            var data = isParam({ _window, string: args[1] }) ? toParam({ _window, id, e, string: args[1] || "", __ }) : { view: toValue({ _window, id, e, __, value: args[1] }) }
            toView({ _window, id: o.__view__ ? o.id : id, stack, lookupActions, address, __, e, ...data })

            return ({ __asynchronous__: true, __action__: "view()" })

        } else if (k0 === "search()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "search()" })
            var data = toParam({ _window, id, e, __, string: args[1] })
            require("./search").search({ _window, lookupActions, stack, address, id, e, __, search: data })

            return ({ __asynchronous__: true, __action__: "search()" })

        } else if (k0 === "erase()") {

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "erase()" })
            var data = toParam({ _window, id, e, __,  string: args[1] })
            require("./erase").erase({ _window, lookupActions, stack, address, id, e, __, erase: data })

            return ({ __asynchronous__: true, __action__: "erase()" })
  
        } else if (k0 === "send()") {
            
            breakRequest = true
            if (!res || res.headersSent) return

            global.__responded__ = true
            var data = toValue({ _window, id, e, __,  value: args[1] })
            res.send({ message: "Action executed successfully!", data, success: true})

            return ({ __asynchronous__: true, __action__: "send()" })

        } else if (k0 === "sent()") {

            if (!res || res.headersSent) return true
            else return false

        } else if (k0 === "position()") {

            var position = toValue({ _window, id, e, __, value: args[1] })
            position.positioner = position.positioner || id
            return require("./setPosition").setPosition({ position, id: o.id || id, e })

        } else if (k0 === "convert()") {
          
          var data = toValue({ _window, id, e, __, value: args[1] })
          if (!data.file) return
          if (!data.from) data.from = "csv" 
          if (!data.to) data.to = "json" 
          if (data.from === "csv" && data.to === "json") require("./csvToJson").csvToJson({ id, lookupActions, stack, e, file, onload: args[2] || "", __ })

        } else if (k0 === "encodeURI()") {

            answer = encodeURI(o)

        } else if (k0 === "decodeURI()") {

            answer = decodeURI(o)

        } else if (k0 === "copyToClipBoard()") {
          
            var text 
            if (args[1]) text = toValue({ _window, stack, id, e, __, value: args[1] })
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

        } else if (k0 === "return()") {

            global.__returnAdds__[0].value = toValue({ _window, value: args[1], e, id, object: object || o, __, stack, lookupActions })
            global.__returnAdds__[0].returned = true

        } else if (k0.length === 13 && k0.slice(-2) === "()" && k0.slice(0, 6) === 'coded@') { // [actions?conditions?elseActions]():[params]:[stack]
            
            var my__
            k0 = k0.slice(0, 12)
            if (underScored) my__ = [o, ...__]
            else my__ = __

            var address = addresser({ asynchronous: true, await: args[2], requesterID: id, callerActionName: "[...]()" })
            var data = args[1] ? toParam({ _window, id, e, __: my__,  string: args[1] }) : undefined

            if (k0.includes('coded@') && k0.length === 11) k0 = global.__refs__[k0]
            var my__1 = data !== undefined ? [data, ...my__] : my__

            var conditions = k0.split("?")[1] || ""
            var approved = toApproval({ _window, string: conditions, e, id, object, __: my__1 })
            if (!approved) k0 = k0.split("?")[2]
            else k0 = k0.split("?")[0]

            if (!k0) return o

            global.__waitAdds__.unshift(address.id)

            if (!condition) {

                answer = toValue({ _window, value: k0, e, id, object: object || o, __: my__1, stack, lookupActions })
                if (executable({ _window, string: answer })) {

                    answer = toCode({ _window, string: toCode({ _window, string: answer, start: "'" }) })
                    answer = toValue({ _window, value: answer, e, id, object: object || o, __: my__1, stack, lookupActions })

                } else if (typeof answer === "object" && answer["__action__"]) {

                    answer = answer.action
                    // continue later
                    /*
                        answer = toCode({ _window, string: toCode({ _window, string: answer, start: "'" }) })
                        answer = toValue({ _window, value: answer, e, id, object: object || o, __: my__1, stack, lookupActions })
                    */
                }

            } else {

                answer = k0
                if (isParam({ _window, string: answer })) answer = toValue({ _window, value: answer, e, id, object: object || o, __: my__1 })
                answer = toApproval({ _window, string: answer, e, id, object: object || o, __: my__1, stack, lookupActions })
            }

            // remove waiter
            global.__waitAdds__.splice(0, 1)
            
            // unexecuted wait
            checkUnexecutedAwait({ _window, id, stack, lookupActions, e, address, data, __: [global.search, ...my__] })

        } else if (k0.slice(-2) === "()") { // execute action
            
            return toAction({ _window, lookupActions, stack, id, __, e, path: [k], path0: k0, condition, mount, toView, object })

        } else if (k0.includes("()") && typeof o[k0.slice(0, -2)] === "function") { // it is a function
          
            var myparams = args.slice(1).map(arg => toValue({ _window, lookupActions, stack, id, e, __, value: arg || "" }))
            answer = o[k0.slice(0, -2)](...myparams)

        } else if (k0 === "action" && toView) { // action:[...]

            var event = global.__refs__[args[1]]
            var clickedID = o.__view__ ? o.id : id
            views[id].__events__ = toArray(views[id].__events__)
            var events = event.split("?")[0].split(";")
            var afterEvent = event.split("?").slice(1).join("?")
            events.map(event => views[id].__events__.push({ event: `${event}:${clickedID}?${afterEvent}`, lookupActions: lookupActions }))

        } else if (k.includes(":coded@") || k.slice(-3) === ":[]") { // ex: param:[...]

            // k0 is encoded
            if (k0.includes("coded@") && k0.length === 11) k0 = global.__refs__[k0].data

            o[k0] = o[k0] || {}
            
            if (args[1] && args[1] !== "[]") answer = toValue({ _window, id, e, value: args[1], object: o[k0], __ })
            
        } else if (key && value !== undefined && i === lastIndex) {

            if (k.includes("coded@")) {

              var _key = k.split("coded@")[0]
              k.split("coded@").slice(1).map(code => {
                _key += toValue({ _window, lookupActions, stack, value: global.__refs__[`coded@${code.slice(0, 5)}`].data, __, id, e, object })
                _key += code.slice(5)
              })
              
              k = _key
            }
            
            if (Array.isArray(o)) {
                if (isNaN(k)) {
                    if (o.length === 0) o.push({})
                    o = o[0]
                }
            }

            answer = o[k] = value

        } else if (key && o[k] === undefined && i !== lastIndex) {

          if (!isNaN(path[i + 1])) answer = o[k] = []
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
    
    if (view.__childrenID__.length > 0) 
    view.__childrenID__.map(childId => {

        var _view = views[childId]
        if (!_view) return
        
        if (_view.__childrenID__.length > 0) 
            all.push(...getDeepChildren({ id: childId }))

        else all.push(_view)
    })

    return all
}

const getDeepChildrenId = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    var all = [id]
    if (!view) return []
    
    if (view.__childrenID__.length > 0) 
    view.__childrenID__.map(childId => {
        
        var _view = views[childId]
        if (!_view) return

        if (_view.__childrenID__.length > 0) 
            all.push(...getDeepChildrenId({ id: childId }))

        else all.push(childId)
    })

    return all
}

const getAllParentsId = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    if (!view.parent) return []

    var parentId = view.parent
    var all = [parentId]
    
    all.push(...getAllParentsId({ _window, id: parentId }))

    return all
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
  
const exportHTMLToPDF = async ({ _window, pages, opt, address, id, e, __ }) => {
    
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
    if (args[2]) toAwait({ _window, address, id, e, __ })
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