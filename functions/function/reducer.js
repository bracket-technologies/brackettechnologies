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
const { note } = require("./note")
const { isParam } = require("./isParam")
const { toAwait } = require("./toAwait")
const toCSV = require("./toCSV")

const reducer = ({ _window, id, path, value, key, params, object, index = 0, _, __, _i, e, req, res, mount, condition }) => {
    
    const { remove } = require("./remove")
    const { toValue, calcSubs } = require("./toValue")
    const { execute } = require("./execute")
    const { toParam } = require("./toParam")

    var views = _window ? _window.views : window.views
    var view = views[id], breakRequest, coded, mainId = id
    var global = _window ? _window.global : window.global, _object

    // path is a string
    if (typeof path === "string") path = path.split(".")
    // path is a number
    if (typeof path === "number") path = [path]

    // ||
    if (path.join(".").includes("||")) {
        var args = path.join(".").split("||")
        var answer
        args.map(value => {
            if (!answer) answer = toValue({ _window, value, params, _, __, _i,id, e, req, res })
        })
        return answer
    }

    if (isParam({ _window, string: path.join(".") })) return toParam({ req, res, _window, id, e, string: path.join("."), _, __, _i, object, mount })

    // path[0] = path0:args
    var path0 = path[0] ? path[0].toString().split(":")[0] : ""
    var args 
    if (path[0]) args = path[0].toString().split(":")

    // function
    if (path0.slice(-2) === "()" && path0.slice(0, 2) !== ")(" && args[1] !== "()" && path0 !== "()" && view && (view[path0.charAt(0) === "_" ? path0.slice(1) : path0] || view[path0])) {
            
        var string = decode({ _window, string: view[path0].string }), _params = view[path0].params
        if (_params.length > 0) {
            _params.map((param, index) => {
                var _index = 0
                while(string.split(param).length > 1 && string.split(param)[_index].slice(-1) !== ".") {
                var _replacemenet = path[0].split(":").slice(1)[index]
                if (_replacemenet.slice(0, 7) === "coded()") _replacemenet = global.codes[_replacemenet]
                string = string.replace(param, _replacemenet)
                _index += 1
                }
            })
        }
        string = toCode({ _window, string })
        console.log(string);
        if (view[path0]) return toParam({ _window, ...view[path0], string })
        else if (view[path0.slice(1)]) return toParam({ _window, ...view[path0], string })
    }

    // multiplication
    if (path.join(".").includes("*")) {

        var values = path.join(".").split("*").map(value => toValue({ _window, value, params, _, __, _i,id, e, req, res, object, mount }))
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
    if (path.join(".").includes("+")) {
  
      var values = path.join(".").split("+").map(value => toValue({ _window, value, params, _, __, _i,id, e, req, res, object }))
      var answer = values[0]
      values.slice(1).map(val => answer += val)
      return answer
    }

    // subtraction
    if (path.join(".").includes("-")) {
  
        var _value = calcSubs({ _window, value: path.join("."), params, _, __, _i,id, e, req, res, object })
        if (_value !== path.join(".")) return _value
    }

    // coded
    if (path0.slice(0, 7) === "coded()" && path.length === 1) {
        
        coded = true
        return toValue({ req, res, _window, object, id, value: global.codes[path[0]], params, _, __, _i,e })
    }

    // codeds (string)
    if (path0.slice(0, 8) === "codedS()") {
        
        _object = global.codes[path[0]]
        path.shift()
        path0 = ""
    }
    
    // if
    if (path0 === "if()") {
        
      var approved = toApproval({ _window, e, string: args[1], id, _, __, _i, req, res, object })
      
      if (!approved) {
          
        if (args[3]) {
            if (condition) return toApproval({ _window, e, string: args[3], id, _, __, _i,req, res, object })
            return toValue({ req, res, _window, id, value: args[3], params, _, __, _i,e, object, mount })
        }

        if (path[1] && path[1].includes("else()")) return toValue({ req, res, _window, id, value: path[1].split(":")[1], params, _, __, _i,e, object, mount })

        if (path[1] && (path[1].includes("elseif()") || path[1].includes("elif()"))) {

            var _path = path.slice(2)
            _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
            var _ds = reducer({ _window, id, value, key, path: _path, params, object, params, _, __, _i,e, req, res, mount })
            return _ds

        } else return 

      } else {

        if (condition) return toApproval({ _window, e, string: args[2], id, _, __, _i,req, res, object })
        _object = toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e, object, mount })

        path.shift()
        while (path[0] && (path[0].includes("else()") || path[0].includes("elseif()") || path[0].includes("elif()"))) {
            path.shift()
        }
        path0 = path[0] || ""
      }
    }
    
    // global store
    if (path0 === ")(") {

        if (args[2]) {
            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, _, __, _i,e, req, res }), _timer)
        }

        var state = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i, object })
        if (state === undefined) state = args[1]
        if (state) path.splice(1, 0, state)
        path0 = path[0] = ")("

    } else if (path0 && args[1] === "()") {
        
        if (args[2]) {

            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, _, __, _i,e, req, res }), _timer)
        }

        var state = args[0]
        if (state.slice(0, 7) === "coded()" && state.length === 12) state = toValue({ req, res, _window, id, e, value: state, params, _, __, _i, object })

        // state:()
        if (path.length === 1 && key && state) return global[state] = value
        
        if (state) path.splice(1, 0, state)
        path[0] = path0 = ")("
    }
    
    var view
    // view => ():id:timer:conditions
    if (path0.slice(0, 2) === "()") {

        if (args[1] || args[2] || args[3]) {

            // timer
            if (args[2]) {
                var _timer = parseInt(args[2])
                args[2] = ""
                path[0] = args.join(":")
                return setTimeout(() => reducer({ _window, id, path, value, key, params, object, _, __, _i,e, req, res }), _timer)
            }

            // conditions
            if (args[3]) {
                var approved = toApproval({ _window, e, string: args[3], id, _, __, _i,req, res })
                if (!approved) return
            }

            // id
            var _id = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i, object })
            if (_id || args[1]) view = views[_id || args[1]]
            
            path[0] = path0 = "()"
            object = views[id]
        }
    }

    if (!view) view = views[id]

    // while
    if (path0 === "while()") {
            
        while (toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e, object, mount })) {
            toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e, object, mount })
        }
        path = path.slice(1)
    }

    // initialize by methods
    if (!object && (path0 === "data()" || path0 === "Data()" || path0 === "style()" || path0 === "className()" || path0 === "getChildrenByClassName()" 
    || path0 === "deepChildren()" || path0 === "children()" || path0 === "1stChild()" || path0 === "lastChild()" || path0 === "2ndChild()" || path0 === "3rdChild()" 
    || path0 === "3rdLastChild()" || path0 === "2ndLastChild()" || path0 === "parent()" || path0 === "next()" || path0 === "text()" || path0 === "val()" || path0 === "txt()" 
    || path0 === "element()" || path0 === "el()" || path0 === "checked()" || path0 === "check()" || path0 === "prev()" || path0 === "format()" || path0 === "lastSibling()" 
    || path0 === "1stSibling()" || path0 === "derivations()" || path0 === "path()" || path0 === "mouseleave()" || path0 === "mouseenter()" || path0 === "mouseup()" || path0 === "blur()"
    || path0 === "mousedown()" || path0 === "copyToClipBoard()" || path0 === "mininote()" || path0 === "note()" || path0 === "date()" || path0 === "tooltip()" || path0 === "update()" 
    || path0 === "refresh()" || path0 === "save()" || path0 === "search()" || path0 === "override()" || path0 === "click()" || path0 === "is()" || path0 === "setPosition()" 
    || path0 === "gen()" || path0 === "generate()" || path0 === "route()" || path0 === "getInput()" || path0 === "input()" || path0 === "getEntry()" || path0 === "entry()" 
    || path0 === "getEntries()" || path0 === "entries()" || path0 === "toggleView()" || path0 === "clearTimer()" || path0 === "timer()" || path0 === "range()" || path0 === "focus()" 
    || path0 === "siblings()" || path0 === "todayStart()" || path0 === "time()" || path0 === "remove()" || path0 === "rem()" || path0 === "removeChild()" || path0 === "remChild()" 
    || path0 === "getBoundingClientRect()" || path0 === "contains()" || path0 === "contain()" || path0 === "def()" || path0 === "price()" || path0 === "clone()" || path0 === "uuid()" 
    || path0 === "timezone()" || path0 === "timeDifference" || path0 === "position()" || path0 === "setPosition()" || path0 === "classList()" || path0 === "csvToJson()"
    || path0 === "classlist()" || path0 === "nextSibling()" || path0 === "2ndNextSibling()" || path0 === "axios()" || path0 === "newTab()" || path0 === "droplist()" || path0 === "sort()" 
    || path0 === "fileReader()" || path0 === "src()" || path0 === "addClass()" || path0 === "removeClass()" || path0 === "remClass()" || path0 === "wait()" || path0 === "print()" 
    || path0 === "monthStart()" || path0 === "monthEnd()" || path0 === "nextMonthStart()" || path0 === "nextMonthEnd()" || path0 === "prevMonthStart()" || path0 === "prevMonthEnd()"
    || path0 === "yearStart()" || path0 === "month()" || path0 === "year()" || path0 === "yearEnd()" || path0 === "nextYearStart()" || path0 === "nextYearEnd()" || path0 === "prevYearStart()" 
    || path0 === "prevYearEnd()" || path0 === "counter()" || path0 === "exportCSV()" || path0 === "exportPdf()" || path0 === "readonly()" || path0 === "html()" || path0 === "csvToJson()")) {

      if (path0 === "getChildrenByClassName()" || path0 === "className()") {

          path.unshift("doc()")
          path0 = "doc()"

      } else {

          if (view && path0 !== "txt()" && path0 !== "val()" && path0 !== "min()" && path0 !== "max()" && path0 !== "data()" && path0 !== "readonly()") {

              if (view.labeled && view.templated) path = ["parent()", "parent()", ...path]
              else if ((view.labeled && !view.templated) || view.templated || view.link) path.unshift("parent()")

          } else if (path0 === "txt()" || path0 === "val()" || path0 === "min()" || path0 === "max()") {
              
              if (view.islabel || view.templated || view.link) path.unshift("input()")
          }

          path.unshift("()")
          path0 = "()"
      }

    } else if (view && path[0] === "()" && path[1] && path[1].includes("()")) {
        
        if (path[1] !== "txt()" && path[1] !== "val()" && path0 !== "min()" && path0 !== "max()" && path0 !== "data()" && path0 !== "readonly()") {
            
            if (view.labeled) path = ["()", "parent()", "parent()", ...path.slice(1)]
            else if (view.templated) path = ["()", "parent()", ...path.slice(1)]

            path0 = "()"
        }
    }
    
    _object = path0 === "()" ? view
    : path0 === "index()" ? index
    : (path0 === "global()" || path0 === ")(")? _window ? _window.global : window.global
    : path0 === "e()" ? e
    : path0 === "_" ? _
    : path0 === "__" ? __
    : (path0 === "document()" || path0 === "doc()") ? document
    : (path0 === "window()" || path0 === "win()") ? _window || window
    : path0 === "history()" ? history
    : (path0 === "navigator()" || path0 === "nav()") ? navigator
    : _object !== undefined ? _object : object

    if (path0 === "()" || path0 === "index()" || path0 === "global()" || path0 === ")(" || path0 === "e()" || path0 === "_" || path0 === "__" || path0 === "document()" || path0 === "doc()" || path0 === "window()" || path0 === "win()" || path0 === "history()" || path0 === "return()") path = path.slice(1)
        
    if (!_object && _object !== 0 && _object !== false) {

        if (path[0]) {

            if (path0 === "undefined") return undefined
            else if (path0 === "false") return false
            else if (path0 === "true") return true
            else if (path0 === "desktop()") return global.device.type === "desktop"
            else if (path0 === "tablet()") return global.device.type === "tablet"
            else if (path0 === "mobile()" || path0 === "phone()") return global.device.type === "phone"
            else if (path0 === "clickedElement()" || path0 === "clicked()") _object = global["clickedElement()"]

            else if (path0 === "log()") {
                
                _log = args.slice(1).map(arg => toValue({ req, res, _window, id, value: arg || "here", params, _, __, _i,e, object }))
                console.log(..._log)
            }

            else if (path0.slice(0, 7) === "coded()") {

                coded = true
                _object = toValue({ req, res, _window, object, id, value: global.codes[path0], params, _, __, _i,e })
            }

            else if (path0 === "getCookie()") {

                // getCookie():name
                if (isParam({ _window, string: args[1] })) {
                    var _params = toParam({ req, res, _window, id, e, _, __, _i,params, string: args[1] })
                    return getCookie({ ..._params, req, res })
                }
                var _name = toValue({ req, res, _window, id, e, _, __, _i, value: args[1] })
                _object = getCookie({ name: _name, req, res })
                if (!_object) return
                
            } else if (path0 === "eraseCookie()") {

                // getCookie():name
                if (isParam({ _window, string: args[1] })) {
                    var _params = toParam({ req, res, _window, id, e, _, __, _i,params, string: args[1] })
                    return eraseCookie({ ..._params, req, res })
                }
                var _name = toValue({ req, res, _window, id, e, _, __, _i, value: args[1] })
                _object = eraseCookie({ name: _name, req, res })
                if (!_object) return
                
            } else if (path0 === "setCookie()") {
    
                // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
                var _params = toParam({ req, res, _window, id, e, _, __, _i,params, string: args[1] })
                return setCookie({ ..._params, req, res })
    
            } else if (path0 === "cookie()") {

                var _params = toParam({ req, res, _window, id, e, _, __, _i,params, string: args[1] })
                if (params.method === "post") return setCookie({ ..._params, req, res })
                if (params.method === "delete") return eraseCookie({ ..._params, req, res })
                if (params.method === "get") return getCookie({ ..._params, req, res })
            }
            
            else if (path0 === "today()") _object = new Date()
            else if (path0 === "" || path0 === "_dots") _object = "..."
            else if (path0 === "" || path0 === "_string") _object = ""
            else if (path0 === "'" || path0 === "_quotation") _object = "'"
            else if (path0 === `"` || path0 === "_quotations") _object = `"`
            else if (path0 === ` ` || path0 === "_space") _object = " "
            else if (path0 === "_number") _object = 0
            else if (path0 === "_index") _object = index
            else if (path0 === "_boolearn") _object = true
            else if (path0 === "_array" || path0 === "_list") {

                _object = []
                path[0].split(":").slice(1).map(el => {
                    el = toValue({ req, res, _window, id, _, __, _i,e, value: el, params })
                    _object.push(el)
                })
                
            } else if (path0 === "_map") {

                _object = {}
                var args = path[0].split(":").slice(1)
                args.map((arg, i) => {

                    if (i % 2) return
                    var f = toValue({ req, res, _window, id, _, __, _i,e, value: arg, params })
                    var v = toValue({ req, res, _window, id, _, __, _i,e, value: args[i + 1], params })
                    _object[f] = v

                })
                
            } else if (mount) {
                _object = view
                path.unshift("()")
            }
        }

        if (_object || _object === "" || _object === 0 || coded) path = path.slice(1)
        else {

            if (path[1] && path[1].includes("()")) {
                
                _object = path[0]
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
        /*if ((path[i + 1] + "") && ((path[i + 1] + "").includes("equal()") || (path[i + 1] + "").includes("equals()") || (path[i + 1] + "").includes("=()") || (path[i + 1] + "").includes("eq()"))) {
            
            key = true
            var args = path[i + 1].split(":")
            if (path[i + 1][0] === "_") _ = reducer({ req, res, _window, id, path: [k], params, object: o, _, __, _i,e })
            value = toValue({ req, res, _window, id, _, __, _i,e, value: args[1], params })
            breakRequest = i + 1
            lastIndex = i
        }*/
        
        // path[i]._
        /*if (path[i + 1] === "_") {
            
            path[i + 1] = _
            breakRequest = true
            return answer = reducer({ req, res, _window, id, path: path.slice(i), params, object: o, _, __, _i,e, key, value })
        }*/
        
        if (k0 === "else()" || k0 === "or()") {
            
            var args = k.split(":").slice(1)
            if (o || o === 0 || o === "") answer = o
            else if (args[0]) {
                args.map(arg => {
                    if (!answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, __, _i,e })
                })
            }
            return answer
        }
        
        // if():conds:ans.else():ans || if():conds:ans.elif():conds:ans
        /*if (k0 === "if()") {
        
            var args = k.split(":")
            var approved = toApproval({ req, res, _window, id, value: args[1], params, _, __, _i,e })
        
            if (!approved) {
                
                if (args[3]) return answer = toValue({ req, res, _window, id, value: args[3], params, _, __, _i,e })

                else if (path[i + 1] && path[i + 1].includes("else()")) 
                    return answer = toValue({ req, res, _window, id, value: path[i + 1].split(":")[1], params, _, __, _i,e })
    
                else if (path[i + 1] && (path[i + 1].includes("elseif()") || path[i + 1].includes("elif()"))) {
    
                    breakRequest = i + 1
                    var _path = path.slice(i + 2)
                    _path.unshift(`if():${path[i + 1].split(":").slice(1).join(":")}`)
                    return answer = reducer({ _window, id, path: _path, value, key, params, object: o, _, __, _i,e, req, res })
    
                } else return
    
            } else {
    
                answer = toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e })
                breakRequest = i
                while (path[breakRequest + 1] && (path[breakRequest + 1].includes("else()") || path[breakRequest + 1].includes("elseif()") || path[breakRequest + 1].includes("elif()"))) {
                    breakRequest = breakRequest + 1
                }
            }
        }*/
        
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

            var ___
            if (k0[0] === "_") ___ = o
            var _log = args.slice(1).map(arg => toValue({ req, res, _window, id, e, _: ___ ? ___ : _, __, _i, value: arg, params }))
            if (_log.length === 0) _log = o !== undefined ? [o] : ["here"]
            console.log(..._log)
            return o
        }

        if (o === undefined) return o

        else if (k0 !== "data()" && k0 !== "Data()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, id, e, _, __, _i,value: k, params })
            
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
            
            while (toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })) {
                toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e })
            }
            
        } else if (k0 === "_") {
          
            if (value !== undefined && key && i === lastIndex) answer = o[_] = value
            else if (typeof o === "object") answer = o[_]

        }else if (k0 === "__") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[__] = value
            else if (typeof o === "object") answer = o[__]

        }  else if (k0 === ")(") {

            var _state = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = global[_state]

        } else if (k0.slice(0, 7) === "coded()" || k0.slice(0, 8) === "codedS()") {
            
            var _coded
            if (k0.slice(0, 7) === "coded()") _coded = toValue({ req, res, _window, id, e, value: global.codes[k], params, _, __, _i })
            else if (k0.slice(0, 8) === "codedS()") _coded = global.codes[k]

            if (i === lastIndex && key && value !== undefined) answer = o[_coded] = value
            else answer = o[_coded]
            /*
            _coded = _coded !== undefined ? [...toArray(_coded), ...path.slice(i + 1)] : path.slice(i + 1)
            answer = reducer({ req, res, _window, id, e, value, key, path: _coded, object: o, params, _, __, _i })
            */
            
        } else if (k0 === "data()") {

            var _o = o.type ? o : view
            var _params = {}
            
            if (_o.type) breakRequest = true

            if (args[1]) _params = toParam({ req, res, _window, id, e, _, __, _i, string: args[1] })

            // just get data()
            if (!_o.derivations) {
              var _data = reducer({ req, res, _window, id, e, value, key, path: _params.path || views[id].derivations, object: _params.data || global[views[id].Data], params, _, __ })
              return answer = _o[_data]
            }

            var _derivations = _params.path || _o.derivations || []
            if (_params.path) return answer = reducer({ req, res, _window, id, e, value, key, path: _derivations, object: _params.data || object, params, _, __ })

            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, __, _i,e })
                answer = reducer({ req, res, _window, id, e, value, key, path: [..._derivations, ...path.slice(i + 1)], object: global[_o.Data], params, _, __, _i })

            } else answer = reducer({ req, res, _window, id, value, key: path[i + 1] === undefined ? key : false, path: [..._derivations], object: global[_o.Data], params, _, __, _i,e })
            
        } else if (k0 === "Data()") {

            var _path = args[1], _Data

            breakRequest = true
            if (o.derivations) _Data = o.Data
            else _Data = views[id].Data

            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: _path })
                    _path = _params.path || _params.derivations || []
                    if (typeof _path === "string") _path = _path.split(".")

                    return answer = reducer({ req, res, _window, id, e, value, key, path: [`${_Data}:()`, ..._path, ...path.slice(i + 1)], object, params, _, __, _i })
                }

                if (_path.slice(0, 7) === "coded()") _path = global.codes[_path]
                _path = toValue({ req, res, _window, id, value: _path, params, _, __, _i, e })
                if (typeof _path === "string") _path = _path.split(".")

                return answer = reducer({ req, res, _window, id, e, value, key, path: [`${_Data}:()`, ..._path, ...path.slice(i + 1)], object, params, _, __, _i })
            }

            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, __, _i,e })
                answer = reducer({ req, res, _window, id, e, value, key, path: [`${_Data}:()`, ...path.slice(i + 1)], object, params, _, __, _i })

            } else answer = global[_Data]

        } else if (k0 === "removeAttribute()") {

            var _o, _params
            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
            else _params = { att: toValue({ req, res, _window, id, e, _, __, _i,params, value: args[1] }) }

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (typeof _o === "object") {

              if (_o.status === "Mounted") _parent = views[_o.element.parentNode.id]
              else _parent = views[_o.parent]
            }

            answer = _parent
            
        } else if (k0 === "siblings()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
          } else _o = o

          if (typeof _o === "string" && views[_o]) _o = views[_o]

          var element = _o.element
          var nextSibling = element.nextElementSibling
          if (!nextSibling) return
          var _id = nextSibling.id
          answer = views[_id]
            
        } else if (k0 === "2ndNext()" || k0 === "2ndNextSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[_o.parent].element
            
            var nextSibling = element.nextElementSibling
            if (!nextSibling) return
            nextSibling = element.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]
            
        } else if (k0 === "nextSiblings()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var nextSiblings = [], nextSibling
            var element = _o.element
            // if (_o.templated || _o.link) element = views[_o.parent].element

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
            var _id = lastSibling.id
            answer = views[_id]

        } else if (k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = views[_id]
            
        } else if (k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var thirdlastSibling = element.parentNode.children[element.parentNode.children.length - 3]
            var _id = thirdlastSibling.id
            answer = views[_id]

        } else if (k0 === "1stSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var firstSibling = element.parentNode.children[0]
            var _id = firstSibling.id
            answer = views[_id]

        } else if (k0 === "2ndSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = views[_id]

        } else if (k0 === "prev()" || k0 === "prevSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element, _el = _o.element
            // if (_o.templated || _o.link) _el = views[_o.parent]
            
            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) element = _el
            else if (_el) element = _el.element
            else return
            
            var previousSibling = element.previousElementSibling
            if (!previousSibling) return
            var _id = previousSibling.id
            answer = views[_id]

        } else if (k0 === "1stChild()") {// o could be a string or element or view
            
            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]
            
            if (!_o.element) return
            if (!_o.element.children[0]) return
            var _id = _o.element.children[0].id
            
            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[0] }
            
        } else if (k0 === "2ndChild()") {// o could be a string or element or view
            
            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[_o.element.children.length - 2]) return
            var _id = _o.element.children[_o.element.children.length - 2].id
            
            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[_o.element.children.length - 2] }

        } else if (k0 === "lastChild()") {  // o could be a string or element or view
            
            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            else if (_o.nodeType === Node.ELEMENT_NODE) _o = views[_o.id]

            if (!_o.element) return
            if (!_o.element.children[_o.element.children.length - 1]) return
            var _id = _o.element.children[_o.element.children.length - 1].id
            
            if (views[_id]) answer = views[_id]
            else answer = views[_id] = { id: _id, element: _o.element.children[_o.element.children.length - 1] }

        } else if (k0 === "children()") {
            
            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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
            
        } else if (k0 === "style()") { // style():key || style():[key=value;id||el||view||element]
            
            var _o, _params = {}
            if (args[1]) {

              if (isParam({ _window, string: args[1] })) {
                  
                  _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                  _o = _params.view || _params.id || _params.el || _params.element || o

              } else {
                  _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
                  if (isParam({ _window, string: args[2] })) _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[2] })
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

            var { view: _view, id: _id, el: _el, element: _element, ...__params} = _params
            
            if (Object.keys(__params).length > 0) {

              Object.entries(__params).map(([key, value]) => {
                  answer[key] = value
              })
            }
            
        } else if (k0 === "getTagElements()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

        } else if (k0 === "getTagElement()") {
          
            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]

        } else if (k0 === "getTags()" || k0 === "tags()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => views[o.id])

        } else if (k0 === "getTag()" || k0 === "tag()") {
          
            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]
            answer = window.views[answer.id]

        } else if (k0 === "getInputs()" || k0 === "inputs()") {
            
            var _input, _textarea, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) {
                _input = _o.getElementsByTagName("INPUT")
                _textarea = _o.getElementsByTagName("TEXTAREA")
            } else {
                _input = _o.element && _o.element.getElementsByTagName("INPUT")
                _textarea = _o.element && _o.element.getElementsByTagName("TEXTAREA")
            }
            answer = [..._input, ..._textarea].map(o => views[o.id])

        } else if (k0 === "getInput()" || k0 === "input()") {
            
            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            if (_o.nodeType === Node.ELEMENT_NODE) __o = views[_o.id]
            else __o = _o

            if (!__o) return
            if (__o.type !== "Input") {
                if (__o.element.getElementsByTagName("INPUT")[0]) answer = views[__o.element.getElementsByTagName("INPUT")[0].id]
                else return
            } else answer = __o

        } else if (k0 === "getEntry()" || k0 === "entry()") {
            
            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })

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

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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

        } /*else if (k0 === "position()") {

            var args = k.split(":")
            var relativeTo = views["root"].element
            if (args[1]) 
                relativeTo = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            answer = position(o, relativeTo)

        } */else if (k0 === "getBoundingClientRect()") {

            var relativeTo
            if (args[1]) relativeTo = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            else relativeTo = o
            if (typeof relativeTo === "object") relativeTo = o.element
            answer = relativeTo.getBoundingClientRect()

        } else if (k0 === "relativePosition()") {

            var relativeTo = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "getChildrenByClassName()" || k0 === "className()") {

            // map not loaded yet
            if (view.status === "Loading") {

                /*view.controls = toArray(view.controls)
                view.controls.push({
                    event: `loaded?${key}`
                })
                return */
                
            }
            
            var className, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    className = _params.className || _params.class

                } else className = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })

            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

            answer = answer.map(o => window.views[o.id])
            
        } else if (k0 === "classlist()" || k0 === "classList()") {
            
            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (typeof _o === "object" && _o.element) answer = [..._o.element.classList]
            else if (_o.nodeType === Node.ELEMENT_NODE) answer = [..._o.classList]
            
        } else if (k0 === "getElementsByClassName()") {

            // map not loaded yet
            if (view.status === "Loading") {
                view.controls = toArray(view.controls)
                view.controls.push({
                    event: `loaded?${key}`
                })
                return 
            }
            
            var className, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    className = _params.className || _params.class

                } else className = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

        } else if (k0 === "toInteger()") {

            var integer
            if (args[1]) integer = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            else integer = o
            answer = Math.round(toNumber(integer))

        } else if (k0 === "click()") {
            
            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            if (typeof _o === "string" && views[_o]) views[_o].element.click()
            else if (_o.nodeType === Node.ELEMENT_NODE) _o.click()
            else if (typeof _o === "object" && _o.element) _o.element.click()

        } else if (k0 === "focus()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            focus({ id: _o.id })

        } else if (k0 === "blur()") { // blur

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            _o.element.blur()

        } else if (k0 === "axios()") {

            var _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
            require("./axios").axios({ id, e, _, __, _i,params: _params })

        } else if (k0 === "getElementById()") {

            var _params = {}, _o, _id
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.element || o
                    _id = _params.id

                } else _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o
            
            answer = _o.getElementById(_id)

        } else if (k0 === "mousedown()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mousedownEvent = new Event("mousedown")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mousedownEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseup()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseupEvent = new Event("mouseup")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseupEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseupEvent)

        } else if (k0 === "mouseenter()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseenterEvent = new Event("mouseenter")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseenterEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseleaveEvent = new Event("mouseleave")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseleaveEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseleaveEvent)

        } else if (k0 === "device()") {

            answer = global.device.type

        } else if (k0 === "mobile()" || k0 === "phone()") {

            answer = global.device.type === "phone"

        } else if (k0 === "desktop()") {

            answer = global.device.type === "desktop"

        } else if (k0 === "tablet()") {

            answer = global.device.type === "tablet"

        } else if (k0 === "clearTimeout()" || k0 === "clearTimer()") {

            var _params = {}, _o, _timer
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _timer = _params.timer

                } else {
                    return args.slice(1).map(arg => { 

                        _timer = toValue({ req, res, _window, id, e, _, __, _i,value: arg, params })
                        clearTimeout(_timer)
                    })
                }
            } else _timer = o
            
            clearTimeout(_timer)
            
        } else if (k0 === "clearInterval()") {

            var _params = {}, _o, _interval
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _interval = _params.interval

                } else {
                    return args.slice(1).map(arg => { 

                        _timer = toValue({ req, res, _window, id, e, _, __, _i,value: arg, params })
                        clearInterval(_timer)
                    })
                }
            } else _interval = o
            
            answer = clearInterval(_interval)
            
        } else if (k0 === "interval()" || k0 === "setInterval()") {
            
            if (!isNaN(toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e }))) { // interval():params:timer

                var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e }))
                var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
                answer = setInterval(myFn, _timer)

            } else if (isParam({ _window, string: args[1] }) && !args[2]) { // interval():[params;timer]

                var _params
                _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                var myFn = () => toValue({ req, res, _window, id, value: _params.params || _params.parameters, params, _, __, _i,e })
                answer = setInterval(myFn, _params.timer)
            }

        } else if (k0 === "timer()" || k0 === "setTimeout()") {
            
            if (args[2]) { // timer():params:timer

                var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e }))
                var myFn = () => { toParam({ req, res, _window, id, string: args[1], params, _, __, _i,e }) }
                answer = setTimeout(myFn, _timer)

            } else if (isParam({ _window, string: args[1] }) && !args[2]) { // timer():[params;timer]

                var _params
                _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                var myFn = () => toValue({ req, res, _window, id, value: _params.params || _params.parameters, params, _, __, _i,e })
                answer = setTimeout(myFn, _params.timer)
            }

        } /*else if (k0 === "path()") {

            var _path = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            if (typeof _path === "string") _path = _path.split(".")
            _path = [..._path, ...path.slice(i + 1)]
            answer = reducer({ req, res, _window, id, path: _path, value, key, params, object: o, _, __, _i,e })
            
        } */else if (k0 === "pop()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            else _o = o

            _o.pop()
            answer = _o
            
        } else if (k0 === "shift()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            else _o = o

            _o.shift()
            answer = _o

        } else if (k0 === "slice()") {

            if (!Array.isArray(o) && typeof o !== "string") return
            if (args[2] || !isNaN(toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i }))) { // slice():start:end

                var _start = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i, object })
                var _end = toValue({ req, res, _window, id, e, value: args[2], params, _, __, _i, object })
                // console.log(o, path, _start, _end, k);
                if (_end !== undefined) answer = o.slice(parseInt(_start), parseInt(_end))
                else answer = o.slice(parseInt(_start))

            } else {

                var _params = {}, _o
                if (args[1]) {

                    if (isParam({ _window, string: args[1] })) {

                        _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                        _o = _params.object || _params.map || o
                        if (_params.end !== undefined) answer = _o.slice(parseInt(_params.start), parseInt(_params.end))
                        else answer = _o.slice(parseInt(_params.start))
                    }
                }
            }
            
        } else if (k0 === "derivations()" || k0 === "path()") {

            var _params = {}, _o, _index
            if (args[1]) { // view.derivations():index

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                    _o = _params.object || _params.map || o
                    if (_params.index) return _o.derivations[_index]
                    else return _o.derivations

                } else _index = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            }
            if (_index !== undefined) return o.derivations[_index]
            else return o.derivations
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else if (k0 === "replaceState()") {

            // replaceState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _, __, _i }) || global.data.page[global.currentPage].title
            answer = o.replaceState(null, title, _url)

        } else if (k0 === "pushState()") {

            // pushState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _, __, _i }) || global.data.page[global.currentPage].title
            answer = o.pushState(null, title, _url)

        } else if (k0 === "_index") {
            
            answer = index

        } else if (k0 === "format()") {
            
            var args = k.split(":")
            answer = global.codes[args[1]]
           
        } else if (k0 === "_array" || k0 === "_list") {
            
            answer = []
            k.split(":").slice(1).map(el => {
                el = toValue({ req, res, _window, id, _, __, _i,e, value: el, params })
                answer.push(el)
            })

        } else if (k0 === "_object" || k0 === "_map" || k0 === "{}") {
            
            answer = {}
            k.split(":").slice(1).map((el, i) => {

                if (i % 2) return
                var f = toValue({ req, res, _window, id, _, __, _i,e, value: el, params })
                var v = toValue({ req, res, _window, id, _, __, _i,e, value: args[i + 1], params })
                answer[f] = v
            })

        } else if (k0 === "_semi" || k0 === ";") {
  
            answer = o + ";"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_quest" || k0 === "?") {
            
            answer = o + "?"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_dot" || k0 === ".") {

            answer = o + "."
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_space" || k0 === " ") {

            answer = o = o + " "
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_equal" || k0 === "=") {
            
            answer = o + "="
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_comma" || k0 === ",") {
            
            answer = o + ","
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "return()") {

            var args = k.split(":")
            answer = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            
        } else if (k0 === "reload()") {

            document.location.reload(true)
            
        } else if (k0 === "isSameNode()" || k0 === "isSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next === o
            
        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next !== o
            
        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o) || _next === o
            
        } else if (k0 === "contains()" || k0 === "contain()") {
            
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            if (!_next) return
            if (_next.nodeType === Node.ELEMENT_NODE) {}
            else if (typeof _next === "object") _next = _next.element
            else if (typeof _next === "string" && views[_next]) _next = views[_next].element

            if (o.nodeType === Node.ELEMENT_NODE) {}
            else if (typeof o === "object") o = o.element
            else if (typeof o === "string" && views[o]) o = views[o].element

            if (!o || !_next) return
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = o.contains(_next)
            
        } else if (k0 === "in()" || k0 === "inside()") {
            
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            if (typeof o === "string" || Array.isArray(o) || typeof o === "number") return answer = _next.includes(o)
            else if (typeof o === "object") answer = _next[o] !== undefined
            else if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE) return answer = _next.contains(o)

        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.contains(o) && _next !== o
            
        } else if (k0 === "doesnotContain()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !o.contains(_next)
            
        } else if (k0 === "then()") {

            var args = k.split(":").slice(1)
            
            if (args[0]) {
                args.map(arg => {
                    toValue({ req, res, _window, id: mainId, value: arg, params, _, __, _i,e })
                })
            }
            
        } else if (k0 === "and()") {
            
            if (!o) {
                answer = false
            } else {
                var args = k.split(":").slice(1)
                if (args[0]) {
                    args.map(arg => {
                        if (answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, __, _i,e })
                    })
                }
            }
            
        } else if (k0 === "isEqual()" || k0 === "is()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = isEqual(o, b)
            
        } else if (k0 === "greater()" || k0 === "isgreater()" || k0 === "isgreaterthan()" || k0 === "isGreaterThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = parseFloat(o) > parseFloat(b)
            
        } else if (k0 === "less()" || k0 === "isless()" || k0 === "islessthan()" || k0 === "isLessThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = parseFloat(o) < parseFloat(b)
            
        } else if (k0 === "isNot()" || k0 === "isNotEqual()" || k0 === "not()" || k0 === "isnot()") {
            
            var args = k.split(":")
            var isNot = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
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
            if (isPrice) answer = answer.tovieweString()
            
        } else if (k0 === "dividedBy()" || k0 === "divide()" || k0 === "divided()" || k0 === "divideBy()" || k0 === "/()") {
            
            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, __, _i,e })
                
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
                var b = toValue({ req, res, _window, id, value: arg, params, _, __, _i,e })
                
                answer = answer === 0 ? answer : (answer || "")
                b = b === 0 ? b : (b || "")
                answer = answer.toString()
                b = b.toString()
                
                if (answer.includes(",") || b.includes(",")) isPrice = true
                
                b = toNumber(b)
                answer = toNumber(answer)

                answer = answer * b
            })
            if (isPrice) answer = answer.tovieweString()
            
        } else if (k0 === "add()" || k0 === "plus()" || k0 === "+()") {
            
            var args = k.split(":").slice(1), isPrice
            answer = o
            args.map(arg => {
                var b = toValue({ req, res, _window, id, value: arg, params, _, __, _i,e })
                
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

                var b = toValue({ req, res, _window, id, value: arg, params, e, _, __, _i })
            
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
            
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            
            o = o === 0 ? o : (o || "")
            b = b === 0 ? b : (b || "")
            o = o.toString()
            b = b.toString()
            
            var isPrice
            if (o.includes(",") || b.includes(",")) isPrice = true
            
            b = toNumber(b)
            o = toNumber(o)

            answer = o % b
            if (isPrice) answer = answer.tovieweString()
            
        } else if (k0 === "sum()") {
            
            answer = o.reduce((o, k) => o + toNumber(k), 0)

        } else if (k0 === "src()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            else _o = o

            if (typeof _o === "object" && views[_o]) _o = views[_o]

            var __o
            if (_o.type !== "Image") {
                var imageEl = _o.element.getElementsByTagName("IMAGE")[0]
                if (imageEl) __o = views[imageEl.id]
                else return
            } else __o = _o

            if (__o.element) {

                if (key && value !== undefined) answer = __o.element.src = value
                else answer = __o.element.src

            } else if (__o.nodeType === Node.ELEMENT_NODE) answer = __o.src = value

        } else if (k0 === "fileReader()" || k0 === "fileReader()") {
            
            // fileReader():file:function
            var _file = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })

            var reader = new FileReader()
            reader.onload = (e) => toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e })
            reader.readAsDataURL(_file)

        } else if (k0 === "arr()" || k0 === "list()") {
            
            answer = toArray(o)

        } else if (k0 === "json") {
            
            answer = o + ".json"

        } else if (k0 === "exists()") {
            
            answer = o !== undefined ? true : false

        } else if (k0 === "clone()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            else _o = o
            answer = clone(_o)

        } else if (k0 === "override()") {
            
            var args = k.split(":"), _obj, _o
            if (args[2]) {

                _o = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
                _obj = toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e })

            } else {

                _o = o
                _obj = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
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

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            else _o = o
            
            var el
            if (typeof _o === "string" && views[_o]) el = views[_o].element
            else if (_o.nodeType === Node.ELEMENT_NODE) el = _o
            else if (_o.element) el = _o.element
            
            var _view
            if (el) _view = views[el.id]
            
            if (_view && _view.islabel && el && _view.type !== "Input") el = el.getElementsByTagName("INPUT")[0]
            
            if (el) {
                if (window.views[el.id].type === "Input") {

                    answer = el.value
                    if (i === lastIndex && key && value !== undefined && o.element) answer = el.value = value
                    
                } else {

                    answer = el.innerHTML
                    if (i === lastIndex && key && value !== undefined) answer = el.innerHTML = value
                }
            } else if (view && view.type === "Input") {

                if (i === lastIndex && key && value !== undefined) _o[view.element.value] = value
                else return answer = _o[view.element.value]

            } else if (view && view.type !== "Input") {

                if (i === lastIndex && key && value !== undefined) _o[view.element.innerHTML] = value
                else return answer = _o[view.element.innerHTML]
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
                var f = toValue({ req, res, _window, id, value: field, params, _, __, _i,e })
                var v = toValue({ req, res, _window, id, value: fields[i + 1], params, _, __, _i,e })
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

                    var f = toValue({ req, res, _window, id, value: _fv, params, _, __, _i,e })
                    var v = toValue({ req, res, _window, id, value: fv[_i + 1], params, _, __, _i,e })
                    answer[f] = v
                })
            }
            
        } else if (k0 === "unshift()") {
            
            o.unshift()
            answer = o
            
        } else if (k0 === "push()") {
            
            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            var _index = toValue({ req, res, _window, id, value: args[2], params, _, __, _i,e })
            if (_index === undefined) _index = o.length
            
            if (Array.isArray(_item)) {
                
                _item.map(_item => {
                    o.splice(_index, 0, _item)
                    _index += 1
                })

            } else o.splice(_index, 0, _item)
            answer = o
            
        } else if (k0 === "pull()") {

            // if no it pulls the last element
            var _pull = args[1] !== undefined ? toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e }) : o.length - 1
            if (_pull === undefined) return undefined
            o.splice(_pull,1)
            answer = o
            
        } else if (k0 === "pullItems()") {

            if (isParam({ _window, string: args[1] })) {
            
                var _items
    
                if (k[0] === "_") _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
                else _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, object: o, _i: index, req, res, _, __ }))
                
                _items.map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })
    
                answer = o
                
            } else {

                var _items = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
                _items.map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })

                answer = o
            }
            
        } else if (k0 === "pullItem()") {

            if (isParam({ _window, string: args[1] })) {

                var _index

                if (k[0] === "_") _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, __: _, _: o, req, res }) )
                else _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, object: o, req, res, _, __ }))

                if (_index !== -1) o.splice(_index , 1)
                answer = o
                
            } else {

                var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, _i, e })
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index,1)
                answer = o
                
            }
            
        } else if (k0 === "pullLastItem()" || k0 === "pullLast()") {
            
            // if no it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o
            
        } else if (k0 === "findItems()") {

            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = o.filter(item => isEqual(item, _item))
            
        } else if (k0 === "findItem()") {

            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = o.find(item => isEqual(item, _item))
            
        } else if (k0 === "findItemIndex()") {

            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, _i,e })
            answer = o.findIndex(item => isEqual(item, _item))
            
        } else if (k0 === "filterItems()") {
            
            var _items

            if (k[0] === "_") _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
            else _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, object: o, _i: index, req, res, _, __ }))
            
            _items.map(_item => {
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index, 1)
            })

            answer = o

        } else if (k0 === "filterItem()") {

            var _index

            if (k[0] === "_") _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, __: _, _: o, req, res }) )
            else _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, object: o, req, res, _, __ }))

            if (_index !== -1) o.splice(_index , 1)
            answer = o
            
        } else if (k0 === "splice()") {

            // push at a specific index / splice():value:index
            var _value = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
            var _index = toValue({ req, res, _window, id, value: args[2], params,_ ,e })
            if (_index === undefined) _index = o.length - 1
            // console.log(clone(o), _value, _index);
            o.splice(parseInt(_index), 0, _value)
            answer = o
            
        } else if (k0 === "remove()" || k0 === "rem()") { // remove child with data
            
            clearTimeout(global["tooltip-timer"])
            delete global["tooltip-timer"]
            views.tooltip.element.style.opacity = "0"
            
            if (args[1]) {
                var _id = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
                if (!views[_id]) return console.log("Element doesnot exist!")
                return remove({ id: _id })
            }

            var _id = typeof o === "string" ? o : o.id
            if (!views[_id]) return console.log("Element doesnot exist!")
            remove({ id: o.id })

        } else if (k0 === "removeChild()" || k0 === "remChild()" || k0 === "removeView()" || k0 === "remView()") { // remove only view without removing data

            if (args[1]) {
                var _id = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
                if (!views[_id]) return console.log("Element doesnot exist!")
                return remove({ id: _id, remove: { onlyChild: true } })
            }

            var _id = typeof o === "string" ? o : o.id
            if (!views[_id]) return console.log("Element doesnot exist!")
            remove({ id: o.id, remove: { onlyChild: true } })

        } else if (k0 === "charAt()") {

            var args = k.split(":")
            var _index = toValue({ req, res, _window, e, id, value: args[1], _, __, _i,params })
            answer = o.charAt(0)

        } else if (k0 === "droplist()") {
            
            var _params = toParam({ req, res, _window, e, id, string: args[1], _, __, _i,params })
            require("./droplist").droplist({ id, e, droplist: _params })
            
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
            
            var checklist = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()" || k0 === "gen()") {
            
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                if (_params.number || _params.numbers) answer = generate(_params.length || 5, true)
                else answer = generate(_params.length || 5)

            } else {

                var length = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params }) || 5
                answer = generate(length)
            }

        } else if (k0 === "includes()" || k0 === "inc()") {
            
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            answer = o.includes(_include)
            
        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {
            
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            answer = !o.includes(_include)
            
        } else if (k0 === "capitalize()") {
            
            answer = capitalize(o)
            
        } else if (k0 === "capitalizeFirst()") {
            
            answer = capitalizeFirst(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()" || k0 === "toUpperCase()" || k0 === "touppercase()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            else _o = o
            answer = _o.toUpperCase()
            
        } else if (k0 === "lowercase()" || k0 === "toLowerCase()" || k0 === "tolowercase()") {
            
            answer = o.toLowerCase()
            
        } else if (k0 === "len()" || k0 === "length()") {
            
            if (Array.isArray(o)) answer = o.length
            else if (typeof o === "string") answer = o.split("").length
            else if (typeof o === "object") answer = Object.keys(o).length
            
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
            if (args[1]) days_ = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            if (args[2]) hours_ = toValue({ req, res, _window, id, e, value: args[2], params, _, __, _i })
            if (args[3]) mins_ = toValue({ req, res, _window, id, e, value: args[3], params, _, __, _i })
            if (args[4]) secs_ = toValue({ req, res, _window, id, e, value: args[4], params, _, __, _i })
            */
            var _params = toParam({ req, res, _window, id, e, string: args[1], params, _, __, _i })
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
            if (Array.isArray(o)) answer = o.map(o => o.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d]))
            else answer = o.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])

        } else if (k0 === "date()" || k0 === "toDate()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })
            else _o = o

            if (!isNaN(_o) && typeof _o === "string") _o = parseInt(_o)
            answer = new Date(_o)

        } else if (k0 === "toDateFormat()") { // returns date for input

            if (!isNaN(o) && typeof o === "string") o = parseInt(o)
            var _date = new Date(o)
            var _year = _date.getFullYear()
            var _month = _date.getMonth() + 1
            var _day = _date.getDate()
            var _dayofWeek = _date.getDay()

            var _daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

            return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}`

        } else if (k0 === "toDateInputFormat()") { // returns date for input in format yyyy-mm-dd

            if (!isNaN(o) && typeof o === "string") o = parseInt(o)
            var _date = new Date(o)
            var _year = _date.getFullYear()
            var _month = _date.getMonth() + 1
            var _day = _date.getDate()
            return `${_year}-${_month.toString().length === 2 ? _month : `0${_month}`}-${_day.toString().length === 2 ? _day : `0${_day}`}`

        } else if (k0 === "toUTCString()") {
            
            if (!isNaN(o) && (parseFloat(o) + "").length === 13) o = new Date(parseFloat(o))
            answer = o.toUTCString()
            
        } else if (k0 === "uuid()") {
            
            answer = require("uuid").v4()
            console.log(answer);
            
        } else if (k0 === "counter()") {
            
          var _options = {}
          if (isParam({ _window, string: args[1] })) _options = toParam({ req, res, _window, id, e, _, __, _i, string: args[1] })
          else _options = toValue({ req, res, _window, id, e, value: args[1], params, _, __, _i })

          _options.counter = _options.counter || _options.start || _options.count || 0
          _options.length = _options.length || _options.len || _options.maxLength || 0
          _options.end = _options.end || _options.max || _options.maximum || 99999
          _options.timer = _options.timer || (new Date(_date.setHours(0,0,0,0))).getTime()

          answer = require("./counter").counter({ ..._options })

        } else if (k0 === "time()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, _i })
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
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, _i })
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
            
        } else if (k0 === "replace()") { //replace():prev:new

            var rec0, rec1
            
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                rec0 = _params["1"]
                rec1 = _params["2"]

            } else {

                rec0 = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
                rec1 = toValue({ req, res, _window, id, e, _, __, _i,value: args[2], params })
            }

            if (typeof o === "string") {

                if (rec1) answer = o.replace(rec0, rec1)
                else answer = o.replace(rec0)

            } else if (Array.isArray(o)) {

                var _itemIndex = o.findIndex(item => isEqual(item, rec0))
                if (_itemIndex >= 0) o[_itemIndex] = rec1
                return o
            }
            
        } else if (k0 === "replaceLast()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 1] = _item
                return o
            }
        
        } else if (k0 === "replaceSecondLast()" || k0 === "replace2ndLast()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 2] = _item
                return o
            }
        
        } else if (k0 === "replaceFirst()" || k0 === "replace1st()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[0] = _item
                return o
            }
        
        } else if (k0 === "replaceSecond()" || k0 === "replace2nd()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[1] = _item
                return o
            }
        
        } else if (k0 === "importJson()") {
        
            answer = importJson()
        
        } else if (k0 === "exportJson()") {
            
            var _name = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            exportJson({ data: o, filename: _name})
            
        } else if (k0 === "flat()") {
            
            answer = Array.isArray(o) ? o.flat() : o
            
        } else if (k0 === "getDeepChildrenId()") {
            
            answer = getDeepChildrenId({ _window, id: o.id })
            
        } else if (k0 === "deep()" || k0 === "deepChildren()" || k0 === "getDeepChildren()") {
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0.includes("filter()")) {
            
            var args = k.split(":").slice(1), isnot
            if (!args[0]) isnot = true
            
            if (isnot) answer = toArray(o).filter(o => o !== "" && o !== undefined && o !== null)
            else args.map(arg => {
                
                if (k[0] === "_") answer = toArray(o).filter((o, index) => toApproval({ _window, e, string: arg, id, __: _, _: o, _i: index, req, res }) )
                else answer = toArray(o).filter((o, index) => toApproval({ _window, e, string: arg, id, object: o, _i: index, req, res, _, __ }))
            })
            
        } /*else if (k0.includes("filterById()")) {

            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } */else if (k0.includes("find()")) {
            
            if (k[0] === "_") answer = toArray(o).find((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
            else answer = toArray(o).find((o, index) => toApproval({ _window, e, string: args[1], id, _, __, _i: index, req, res, object: o }) )
            
        } else if (k0 === "sort()") {
            
            var _array, _params
            if (Array.isArray(o)) _array = o
            if (isParam({ _window, string: args[1] })) {
                
                _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _params.data = _params.data || _params.map || _params.array || _params.object || _params.list || _array
            }
            answer = require("./sort").sort({ sort: _params, id, e })
            return answer

        } else if (k0.includes("findIndex()")) {
            
            if (typeof o !== "object") return
            
            if (k[0] === "_") answer = toArray(o).findIndex((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
            else answer = toArray(o).findIndex((o, index) => toApproval({ _window, e, string: args[1], id, _, __, _i: index, req, res, object: o }) )
            
        } else if (k0.includes("map()") || k0 === "_()" || k0 === "()") {
            
            if (args[1] && args[1].slice(0, 7) === "coded()") args[1] = global.codes[args[1]]
            if (k[0] === "_") {

                toArray(o).map((o, index) => reducer({ req, res, _window, id, path: args[1] || [], value, key, params, __: _, _: o, e, _i: index/*, object*/ }) )
                answer = o
            } else answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: args[1] || [], object: o, value, key, params, _, __, _i, e, _i: index }) )

        } else if (k0 === "index()") {
            
            var element = views[o.parent].element
            if (!element) answer = o.mapIndex
            else { 
                var children = [...element.children]
                var index = children.findIndex(child => child.id === o.id)
                if (index > -1) answer = index
                else answer = 0
            }
            
        } else if (k0 === "typeof()" || k0 === "type()") {

            answer = getType(o)

        } else if (k0 === "newTab()") {

            var _params = toParam({ req, res, _window, id, e, _,/* params,*/ string: args[1] })
            window.open(_params.url || _params.URL, _params.name, _params.specs || "")

        } else if (k0 === "action()") {
            
            answer = execute({ _window, id, actions: path[i - 1], params, e })
            
        } else if (k0 === "exportCSV()") {
            
            var file = toParam({ req, res, _window, id, e, _, string: args[1] })
            require("./toCSV").toCSV({ file })
            
        } else if (k0 === "exportPdf()") {
            
            var options = toParam({ req, res, _window, id, e, _, string: args[1] })
            require("./toPdf").toPdf({ options })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            var _price
            if (args[1]) _price = toValue({ req, res, _window, id, e, _, __, _i,params, value: args[1] })
            else _price = o
            answer = o = toPrice(toNumber(_price))
            
        } else if (k0 === "toBoolean()" || k0 === "boolean()" || k0 === "bool()") {

            answer = o === "true" ? true : o === "false" ? false : undefined
            
        } else if (k0 === "toNumber()" || k0 === "number()" || k0 === "num()") {

            answer = toNumber(o)
            
        } else if (k0 === "round()") {

            var nth = toValue({ req, res, _window, id, e, _, __, _i,params, value: args[1] }) || 2
            answer = parseFloat(o || 0).toFixed(nth)
            
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

        } else if (k0 === "checked()") {

            var _o
            if (typeof o === "string") _o = views[o] // id
            else if (o.nodeType === Node.ELEMENT_NODE) _o = o // element
            else if (o.type === "Input") _o = o.element // view
            else _o = o

            if (value !== undefined && key) answer = _o.checked = value
            else answer = _o.checked
        
        } else if (k0 === "check()") {

            breakRequest = true
            if (typeof o === "string") answer = views[o].checked = true // id
            else if (o.nodeType === Node.ELEMENT_NODE) answer = o.checked = true // element
            else if (o.type === "Input") answer = o.element.checked = true // view
            else answer = o.checked = true 
        
        } else if (k0 === "parseFloat()") {
            
            answer = parseFloat(o)

        } else if (k0 === "parseInt()") {
            
            answer = parseInt(o)

        } else if (k0 === "stringify()") {
            
            answer = JSON.stringify(o)

        } else if (k0 === "parse()") {
            
            answer = JSON.parse(o)

        } /*else if (k0 === "getCookie()") {

            var cname = toValue({ req, res, _window, id, e, _, __, _i,params, value: args[1] })
            answer = getCookie({ name: cname, req, res })
        
        } else if (k0 === "eraseCookie()") {

            // eraseCookie():name
            if (args[1]) _name = toValue({ req, res, _window, id, e, _, __, _i,params, value: args[1] })

            eraseCookie({ name: _name })
            return o
            
        } else if (k0 === "setCookie()") {

            // setCookie:name:expdays
            var args = k.split(":")
            var cvalue = o
            var cname = toValue({ req, res, _window, id, e, _, __, _i,params, value: args[1] })
            var exdays = toValue({ req, res, _window, id, e, _, __, _i,params, value: args[2] })

            setCookie({ name: cname, value: cvalue, expiry: exdays })

        } */else if (k0 === "split()") {
            
            var splited = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            answer = o.split(splited)

        } else if (k0 === "join()") {
            
            if (isParam({ _window, string: args[1] })) { // join():[1=[''];2='']

                var _params = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, _i })
                answer = _params["1"].join(_params["2"])
                
            } else {

                var joiner = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, _i })
                answer = o.join(joiner)
            }

        } else if (k0 === "clean()") {
            
            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")
            
        } else if (k0 === "removeDuplicates()") {
            
            var _array = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, _i })
            if (!_array) _array = o
            answer = [...new Set(_array)]
            
        } else if (k0 === "route()") {

            // route():page:path
            if (isParam({ _window, string: args[1] })) {

                var route = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, _i })
                require("./route").route({ id, route })
                
            } else {
                
                var _page = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, _i })
                var _path = toValue({ req, res, _window, id, e, value: args[2] || "", params, _, __, _i })
                require("./route").route({ id, route: { path: _path, page: _page } })
            }

        } else if (k0 === "toggleView()") {
          
            var toggle = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, _i })
            /*
            var _id = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, _i })
            var _view = toValue({ req, res, _window, id, e, value: args[2] || "", params, _, __, _i })
            var _page = toValue({ req, res, _window, id, e, value: args[3] || "", params, _, __, _i })
            var _timer = toValue({ req, res, _window, id, e, value: args[4] || "", params, _, __, _i })
            */
            require("./toggleView").toggleView({ _window, toggle, id })

        } else if (k0 === "preventDefault()") {
            
            if (o.target) answer = o.preventDefault()
            else if (e) answer = e.preventDefault()

        } else if (k0 === "stopPropagation()") {
            
            answer = o.stopPropagation()

        } else if (k0 === "isChildOf()") {
            
            var el = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            answer = isEqual(el, o)

        } else if (k0 === "isChildOfId()") {
            
            var _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)

        } else if (k0 === "isnotChildOfId()") {
            
            var _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)
            answer = answer ? false : true

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of view element and children elements in object formula
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0 === "note()") { // note
            
            if (isParam({ _window, string: args[1] })) {
                _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                return note({ note: _params })
            }
            var text = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var type = toValue({ req, res, _window, id, e, _, __, _i,value: args[2], params })
            return note({ note: { text, type } })
            
        } else if (k0 === "mininote()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, __, _i,value: _text, params })
            var mininoteControls = toCode({ string: `():mininote-text.txt()=${_text};clearTimer():[)(:mininote-timer];():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _, __, _i })

        } else if (k0 === "tooltip()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, __, _i,value: _text, params })
            var mininoteControls = toCode({ string: `():tooltip-text.txt()=${_text};clearTimer():[)(:tooltip-timer];():tooltip.style():[opacity=1;transform=scale(1)];)(:tooltip-timer=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _, __, _i })

        } else if (k0 === "readonly()") {
          
            if (typeof o === "object") {
                if (key && value !== undefined) answer = o.element.readOnly = value
                answer = o.element.readOnly
            } else if (o.nodeType === Node.ELEMENT_NODE) {
                if (key && value !== undefined) answer = o.readOnly = value
                answer = o.readOnly
            }

        } else if (k0 === "html()") {
          
            answer = o.element.innerHTML

        } else if (k0 === "range()") {
          
            var args = k.split(":").slice(1)
            var _index = 0, _range = []
            var _startIndex = toValue({ req, res, _window, id, e, _, __, _i,value: args[0], params }) || 0
            var _endIndex = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var _steps = toValue({ req, res, _window, id, e, _, __, _i,value: args[2], params }) || 1
            var _lang = args[3] || ""
            _index = _startIndex
            while (_index < _endIndex) {
                if ((_index - _startIndex) % _steps === 0) {
                    _range.push(_index)
                    _index += 1
                }
            }
            if (_lang === "ar") _range = _range.map(num => num.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d]))
            answer = _range
            
        } else if (k0 === "wait()") {
            
            var _params = { await: args.join(":"), awaiter: `wait():${args.slice(1).map(() => "nothing").join(":")}` }
            toAwait({ id, e, params: _params })

        } else if (k0 === "update()") {
          
            var __id, _id
            if (args[1]) __id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params }) || id
            if (typeof __id === "object" && __id.id) _id = __id.id
            else _id = __id
            
            return require("./update").update({ id: _id })

        } else if (k0 === "save()") {
          
            if (isParam({ _window, string: args[1] })) {

                var _save = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                return require("./save").save({ id, e, _, __, _i, save: _save })
            }

            var _collection = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var _doc = toValue({ req, res, _window, id, e, _, __, _i,value: args[2], params })
            var _data = toValue({ req, res, _window, id, e, _, __, _i,value: args[3], params })
            var _save = { collection: _collection, doc: _doc, data: _data }

            return require("./save").save({ id, e, save: _save })

        } else if (k0 === "search()") {
          
            if (isParam({ _window, string: args[1] })) {

                var _search = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                return require("./search").search({ id, e, _, __, _i,search: _search })
            }

            var _collection = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var _doc = toValue({ req, res, _window, id, e, _, __, _i,value: args[2], params })
            var _data = toValue({ req, res, _window, id, e, _, __, _i,value: args[3], params })
            var _search = { collection: _collection, doc: _doc, data: _data }

            return require("./search").search({ id, e, search: _search })

        } else if (k0 === "setPosition()" || k0 === "position()") {
          
            // setPosition():toBePositioned:positioner:placement:align
            /*
            var toBePositioned = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var positioner = toValue({ req, res, _window, id, e, _, __, _i,value: args[2], params }) || id
            var placement = toValue({ req, res, _window, id, e, _, __, _i,value: args[3], params })
            var align = toValue({ req, res, _window, id, e, _, __, _i,value: args[4], params })
            */
            var position = toParam({ req, res, _window, id, e, _, __, _i,string: args[1], params })

            return require("./setPosition").setPosition({ position, id, e })

        } else if (k0 === "refresh()") {
          
            var _id = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params }) || id
            return require("./refresh").refresh({ id: _id })

        } else if (k0 === "print()") {
          
            var _options = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            if (!_options.id && !_options.view) _options.id = o.id
            if (_options.view) _options.id = _options.view.id

            require("./print").print({ id, options: _options })

        } else if (k0 === "csvToJson()") {
          
            var _options = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            require("./csvToJson").csvToJson({ id, e, options: _options })

        } else if (k0 === "copyToClipBoard()") {
          
            var text 
            if (args[1]) text = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
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
            
            var _o, _class
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.element || _params.view || _params.id || o
                _class = _params.class
                
            } else {

                _o = o
                _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (_o.element) answer = _o.element.classList.add(_class)
            else answer = _o.classList.add(_class)

        } else if (k0 === "removeClass()" || k0 === "remClass()") {
            
            var _o, _class
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, _i,string: args[1] })
                _o = _params.element || _params.view || _params.id || o
                _class = _params.class
                
            } else {

                _o = o
                _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (_o.element) answer = _o.element.classList.remove(_class)
            else answer = _o.classList.remove(_class)

        } else if (k.includes("def()")) {

            var _name = toValue({ req, res, _window, id, e, _, __, _i,value: args[1], params })
            var _params = global.codes[args[2]] ? global.codes[args[2]] : args[2]
            var _string = toValue({ req, res, _window, id, e, _, __, _i,value: args[3], params })
            o[`${_name}()`] = {
                name: _name,
                params: _params ? _params.split(":") : [],
                string: _string,
                id, _, __, _i,e, mount,
                req, res, 
            }
            
        } else if (k.includes(":coded()")) {
            
            breakRequest = true
            o[k0] = o[k0] || {}
            answer = reducer({ req, res, _window, id, e, value, key, path: [...args.slice(1), ...path.slice(i + 1)], object: o[k0], params, _, __, _i })

        } else if (key && value !== undefined && i === lastIndex) {

            if (k.includes("coded()")) {

                var _key = k.split("coded()")[0]
                k.split("coded()").slice(1).map(code => {
                    _key += toValue({ _window, value: global.codes[`coded()${code.slice(0, 5)}`], params, _, __, _i,id, e, req, res, object })
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

        } else if (k.includes("coded()")) {

            var _key = k.split("coded()")[0]
            k.split("coded()").slice(1).map(code => {
                _key += toValue({ _window, value: global.codes[`coded()${code.slice(0, 5)}`], params, _, __, _i,id, e, req, res, object })
                _key += code.slice(5)
            })
            k = _key

            if (key && o[k] === undefined && i !== lastIndex) {

                if (!isNaN(path[i + 1])) answer = o[k] = []
                else answer = o[k] = {}
    
            } else answer = o[k]
        
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
                if (isNaN(k)) {

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
    
    if ([...view.element.children].length > 0) 
    ([...view.element.children]).map(el => {

        var _view = views[el.id]
        if (!_view) return
        
        if ([..._view.element.children].length > 0) 
            all.push(...getDeepChildren({ id: el.id }))

        else all.push(_view)
    })

    return all
}

const getDeepChildrenId = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    var all = [id]
    if (!view) return []
    
    if ([...view.element.children].length > 0) 
    ([...view.element.children]).map(el => {
        
        var _view = views[el.id]
        if (!_view) return

        if ([..._view.element.children].length > 0) 
            all.push(...getDeepChildrenId({ id: el.id }))

        else all.push(el.id)
    })

    return all
}

const getDeepParentId = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    if (!view.element.parentNode || view.element.parentNode.nodeName === "BODY") return []

    var parentId = view.element.parentNode.id
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