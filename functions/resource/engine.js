(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports=[
  "data()", "Data()", "doc()", "mail()", "function()", "exec()", "notification()", "notify()", "alert()", "tag()", "view()"
 , "style()", "className()", "getChildrenByClassName()", "erase()", "insert()", "setChild()", "same()", "checker()"
 , "deepChildren()", "children()", "1stChild()", "lastChild()", "2ndChild()", "3rdChild()", "promise()", "type()"
 , "3rdLastChild()", "2ndLastChild()", "parent()", "next()", "text()", "val()", "txt()", "loader()", "resolve()"
 , "element()", "el()", "checked()", "check()", "prev()", "format()", "lastSibling()", "interval()", "export()"
 , "1stSibling()", "path()", "mouseleave()", "mouseenter()", "mouseup()", "blur()", "log()", "pull()"
 , "mousedown()", "copyToClipBoard()", "mininote()", "note()", "date()", "tooltip()", "update()"
 , "refresh()", "save()", "search()", "override()", "click()", "clicked()", "is()", "new()", "preventDefault()"
 , "device()", "mobile()", "tablet()", "desktop()", "render()"
 , "gen()", "generate()", "route()", "root()", "getInput()", "input()", "getEntry()", "entry()", "capitalize()", "if()"
 , "getEntries()", "entries()", "toggleView()", "clearTimer()", "timer()", "range()", "focus()", "setCookie()"
 , "siblings()", "todayStart()", "time()", "remove()", "rem()", "removeChild()", "remChild()", "keyup()", "keydown()"
 , "contains()", "contain()", "def()", "price()", "clone()", "uuid()", "touchable()", "px()", "getCookie()", "repeat()"
 , "timezone()", "timeDifference", "position()", "setPosition()", "classList()", "csvToJson()", "eraseCookie()"
 , "classlist()", "nextSibling()", "2ndNextSibling()", "axios()", "newTab()", "droplist()", "sort()", "cookie()"
 , "fileReader()", "src()", "addClass()", "removeClass()", "remClass()", "wait()", "print()", "reduce()", "1stEl()"
 , "monthStart()", "monthEnd()", "nextMonthStart()", "nextMonthEnd()", "prevMonthStart()", "prevMonthEnd()", "readFile()", "readFiles()"
 , "yearStart()", "month()", "year()", "yearEnd()", "nextYearStart()", "nextYearEnd()", "prevYearStart()", "while()"
 , "prevYearEnd()", "counter()", "exportCSV()", "exportPdf()", "readonly()", "html()", "csvToJson()", "fetch()"
 , "upload()", "timestamp()", "confirmEmail()", "files()", "share()", "return()", "html2pdf()", "dblclick()"
 , "exportExcel()", "2nd()", "2ndPrev()", "3rdPrev()", "2ndParent()", "3rdParent()", "installApp()", "sent()", "stack()"
 , "replaceItem()", "replaceItems()", "findAndReplaceItem()", "grandParent()", "grandChild()", "grandChildren()", "2ndNext()", "isNaN()"
 , "send()", "removeDuplicates()", "stopWatchers()", "getGeoLocation()", "display()", "hide()", "scrollTo()", "colorize()"
]
},{}],2:[function(require,module,exports){
const { clone } = require("./clone");
const { generate } = require("./generate");
const { toLine } = require("./toLine");

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

const endAddress = ({ _window, stack, data, req, res, id, e, __, lookupActions }) => {
    
    const { toAwait } = require("./toAwait");
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

module.exports = { addresser, printAddress, endAddress, resetAddress }
},{"./clone":4,"./generate":24,"./toAwait":63,"./toLine":71}],3:[function(require,module,exports){
const capitalize = (string, minimize) => {
  if (typeof string !== "string") return string

  if (minimize) return string
    .split(" ")
    .map((string) => string.charAt(0).toLowerCase() + string.slice(1))
    .join(" ")

  return string
      .split(" ")
      .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
      .join(" ")
}

const capitalizeFirst = (string, minimize) => {
  if (typeof string !== "string") return string

  if (minimize) return string.charAt(0).toLowerCase() + string.slice(1)

  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {capitalize, capitalizeFirst}

},{}],4:[function(require,module,exports){
const clone = (obj) => {
  
  if (!obj) return obj
  
  var copy
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") return obj
  else if (Array.isArray(obj)) copy = [...obj.map(obj => clone(obj))]
  else if (Object.keys(obj).length === 0) copy = {}
  else {
    copy = {}
    Object.entries(obj).map(([key, value]) => {
      if (key !== "element") copy[key] = typeof value === "object" ? clone(value) : value
      else copy[key] = value
    })
  }

  return copy
}

module.exports = {clone}

},{}],5:[function(require,module,exports){
const { toLine } = require("./toLine")

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

module.exports = { closePublicViews }
},{"./toLine":71}],6:[function(require,module,exports){
const { decode } = require("./decode")
const { toArray } = require("./toArray")

const _colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const colorize = ({ _window, string, start = "[", index = 0, colors = _colors }) => {

  colors = toArray(colors)
  
  if (index === 8) index = 1
  if (typeof string !== "string") return string

  string = string.replaceAll("<", "&#60;")
  string = string.replaceAll(">", "&#62;")

  // comment
  if (string.charAt(0) === "#" || string.includes("?#") || string.includes(";#") || string.includes("[#")) {

    var string0 = "", operator = ""
    if (string.split("?#")[1]) {

      string0 = string.split("?#")[0]
      operator = "?"

    } else if (string.split(";#")[1]) {

      string0 = string.split(";#")[0]
      operator = ";"

    } else if (string.split("[#")[1]) {

      string0 = string.split("[#")[0]
      operator = "["
    }

    var key = !operator ? string : string.split(string0 + operator).slice(1).join(string0 + operator)
    var comment = key.split("?")[0].split(";")[0]

    comment = (comment || "").replaceAll("[]", "__map__")
    if (comment.split("]")[1] !== undefined) comment = key.split("]")[0]
    comment = (comment || "").replaceAll("__map__", "[]")

    key = key.split(comment).slice(1).join(comment)
    key = colorize({ _window, string: key, index, colors })

    if (string0) string0 = colorizeCoded({ _window, index, string: string0, colors })

    string = string0 + operator + `<span contenteditable style="background-color:#00000000; color: green; white-space:nowrap">${decode({ _window, string: comment })}</span>` + key

  } else string = colorizeCoded({ _window, index, string, colors })

  // arabic
  /*if (arabic.test(string)) {

    var i = 0, lastIndex = string.length - 1, start = false, newString = ""
    while (i <= lastIndex) {
      if ((arabic.test(string[i]) && !english.test(string[i])) || (start !== false && string[i] === " ")) {
        if (start === false) {
          start = i
          newString += `<span contenteditable class="arabic" style="color:inherit; background-color:#00000000; white-space:nowrap">`
        }
      } else if (start !== false) {
        start = false
        newString += `</span>`
      } else start = false
      newString += string[i]
      i++
    }
    string = newString
  }*/

  if (index !== 0) string = `<span contenteditable style="background-color:#00000000; color:${colors[index]}; white-space:nowrap">${string}</span>`

  return string
}

const colorizeCoded = ({ _window, index, string, colors }) => {

  const global = _window ? _window.global : window.global
  var slicer = string.split("@")
  if (slicer.length < 2) return string
  
  var text = ""

  var string0 = slicer[0]
  var string1 = colorize({ _window, index, string: slicer.slice(1).join("@").slice(5), colors })
  var reference = global.__refs__["@" + slicer[1].slice(0, 5)]

  if (typeof reference === "object") {

    var data = ""
    if (reference.type === "code") data = colorize({ _window, string: "[" + reference.data + "]", index: index + 1, colors })
    else data = `<span contenteditable style="background-color:#00000000; color:${colors[index + 1]}; white-space:nowrap">'${reference.data}'</span>`

    text += string0 + data + string1
  }

  return text || string
}

module.exports = { colorize }
},{"./decode":13,"./toArray":62}],7:[function(require,module,exports){
const setCookie = ({ _window, name = "", value, expiry = 360 }) => {

  var cookie = document.cookie || ""
  var decodedCookie = decodeURIComponent(cookie)
  var __session = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === "__session") || "").split("=").slice(1).join("=") || "{}")
  __session[name] = value
  document.cookie = `__session=${JSON.stringify(__session)}`
}

const getCookie = ({ name, req } = {}) => {
  
  if (req) {
    if (!name) return req.cookies
    return req.cookies[name]
  }
  
  var cookie = document.cookie || ""
  var decodedCookie = decodeURIComponent(cookie)
  var __session = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === "__session") || "").split("=").slice(1).join("=") || "{}")

  if (!name) return __session
  return __session[name]
}

const eraseCookie = ({ _window, name }) => {

  var cookie = document.cookie || ""
  var decodedCookie = decodeURIComponent(cookie)
  var __session = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === "__session") || "").split("=").slice(1).join("=") || "{}")

  delete __session[name]
  document.cookie = `__session=${JSON.stringify(__session)}`
}

function parseCookies (request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  
  if (!cookieHeader) return request.cookies = list;

  cookieHeader.split(`;`).forEach(function(cookie) {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
  });

  request.cookies = list
}

module.exports = {setCookie, getCookie, eraseCookie, parseCookies}
},{}],8:[function(require,module,exports){
module.exports = {
  counter: ({ length = 0, counter = 0, end, reset = "daily", timer = 0 }) => {

    counter = parseInt(counter)
    var _date = new Date(), timestamp

    if (reset === "daily") timestamp = (new Date(_date.setHours(0,0,0,0))).getTime()
    else if (reset === "weekly") timestamp = (new Date((new Date(_date.getDate() - _date.getDay() + (_date.getDay() === 0 ? -6 : 1))).setHours(0,0,0,0))).getTime()
    else if (reset === "monthly") timestamp = (new Date(new Date(_date.setMonth(_date.getMonth(), 1)).setHours(0,0,0,0))).getTime()
    else timestamp = (new Date(_date.setHours(0,0,0,0))).getTime()

    var diff = timer - timestamp, _reset
    if (reset === "daily") _reset = 60*60*24*1000 - diff <= 0
    else if (reset === "weekly") _reset = 7*60*60*24*1000 - diff <= 0
    else if (reset === "monthly") _reset = ((new Date(_date.getFullYear(), _date.getMonth() + 1, 0)).getDate()*60*60*24*1000) - diff <= 0
    else _reset = 60*60*24*1000 - diff <= 0

    if (_reset) counter = 0

    if (end && end === counter) counter = 0
    counter = counter + 1

    var _counter = counter + ""
    if (length && (length - _counter.length < 0)) _counter = "1"

    var diff = length - _counter.length

    while (diff > 0) {
      _counter = "0" + _counter
      diff -= 1
    }

    // console.log({ counter: _counter, length, reset, timer: timestamp });
    return { counter: _counter, length, reset, timer: timestamp }
  }
}
},{}],9:[function(require,module,exports){
module.exports = {
  "userSelect": "user-select",
  "inlineSize": "inline-size",
  "clipPath": "clip-path",
  "flexWrap": "flex-wrap",
  "wordWrap": "word-wrap",
  "wordBreak": "word-break",
  "verticalAlign": "vertical-align",
  "borderBottom": "border-bottom",
  "borderLeft": "border-left",
  "borderRight": "border-right",
  "borderTop": "border-top",
  "paddingBottom": "padding-bottom",
  "paddingLeft": "padding-left",
  "paddingRight": "padding-right",
  "paddingTop": "padding-top",
  "marginBottom": "margin-bottom",
  "marginLeft": "margin-left",
  "marginRight": "margin-right",
  "marginTop": "margin-top",
  "fontFamily": "font-family",
  "fontSize": "font-size",
  "fontStyle": "font-style",
  "fontWeight": "font-weight",
  "textDecoration": "text-decoration",
  "lineHeight": "line-height",
  "letterSpacing": "letter-spacing",
  "textOverflow": "text-overflow",
  "whiteSpace": "white-space",
  "backgroundImage": "background-image",
  "backgroundColor": "background-color",
  "zIndex": "z-index",
  "boxShadow": "box-shadow",
  "borderRadius": "border-radius",
  "zIndex": "z-index",
  "alignItems": "align-items",
  "alignSelf": "align-self",
  "justifyContent": "justify-content",
  "justifySelf": "justify-self",
  "userSelect": "user-select",
  "userDrag": "user-drag",
  "textAlign": "text-align",
  "pointerEvents": "pointer-events",
  "flexDirection": "flex-direction",
  "flexGrow": "flex-grow",
  "flexShrink": "flex-shrink",
  "maxWidth": "max-width",
  "minWidth": "min-width",
  "maxHeight": "max-height",
  "minHeight": "min-height",
  "overflowX": "overflow-x",
  "overflowY": "overflow-y",
  "rowGap": "row-gap",
  "columnGap": "column-gap",
  "pageBreakInside": "page-break-inside",
  "pageBreakBefore": "page-break-before",
  "pageBreakAfter": "page-break-after",
  "gridTemplateColumns": "grid-template-columns",
  "gridAutoColumns": "grid-auto-columns",
  "gridTemplateRows": "grid-template-rows",
  "gridAutoRows": "grid-auto-columns",
  "writingMode": "writing-mode"
}
},{}],10:[function(require,module,exports){
const { toParam } = require("./toParam");

module.exports = {
    csvToJson: ({ id, e, file, onload, __ }) => {
        
        var reader = new FileReader();
        reader.onload = function () {
            var result = []
            
            // xlsx
            if (e.target.files[0].name.includes(".xlsx")) {

                let data = reader.result
                let workbook = XLSX.read(data,{type:"binary"})
                
                workbook.SheetNames.forEach(sheet => {
                    result = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                    console.log(result);
                })

            } else if (e.target.files[0].name.includes(".csv")) {

                // csv
                var lines = reader.result.split("\n")
                var headers=lines[0].split(",").map(header => header.replace(/\r?\n|\r/g, ""))
                console.log(headers);
                
                for(var i=1; i<lines.length; i++) {

                    var obj = {}
                    var currentline=lines[i].split(",")

                    for(var j=0; j < headers.length; j++){
                        if (currentline[j] !== undefined) obj[headers[j]] = currentline[j].toString().replace(/\r?\n|\r/g, "")
                    }

                    result.push(obj)
                }
            }

            /* Convert the final array to JSON */
            console.log(result)
            window.views[id].file = window.global.file = { data: result, message: "Data converted successfully!" }
            toParam({ id, e, data: onload, mount: true, __: [window.global.file, ...__] })
        };

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file || e.target.files[0]);
    }
}
},{"./toParam":74}],11:[function(require,module,exports){
(function (global){(function (){
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { setData } = require("./setData")

const createData = ({ data, id }) => {

  var view = window.views[id]

  view.__dataPath__.reduce((o, k, i) => {

    if (i === view.__dataPath__.length - 1) return o[k] = data
    return o[k]

  }, global[view.doc])
}

const clearData = ({ id, e, clear = {}, __ }) => {

  var view = window.views[id]

  if (!global[view.doc]) return
  
  var path = clear.path
  path = path ? path.split(".") : clone(view.__dataPath__)
  path.push('delete()')
  
  reducer({ id, e, data: { path, object: global[view.doc] }, __ })

  console.log("data removed", global[view.doc])
}

module.exports = { createData, setData, clearData }

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./clone":4,"./reducer":45,"./setData":54}],12:[function(require,module,exports){
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { clone } = require("./clone")
const { toOperator } = require("./toOperator")

const database = ({ _window, req, res }) => {

  if (req.body.type === "search") {

    getdb({ _window, req, res })

  } else if (req.body.type === "save") {

    postdb({ _window, req, res })

  } else if (req.body.type === "erase") {

    deletedb({ _window, req, res })
  }
}

const getdb = async ({ _window, req, res }) => {

  var search = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!search.collection) {
    console.log("SEARCH", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { data, success, message } = await getData({ _window, req, res, search })

  console.log("SEARCH", search.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const postdb = async ({ _window, req, res }) => {

  var save = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!save.collection) {
    console.log("SAVE", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { data, success, message } = await postData({ _window, req, res, save })

  console.log("SAVE", save.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const deletedb = async ({ _window, req, res }) => {

  var erase = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!erase.collection) {
    console.log("ERASE", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { success, message } = await deleteData({ _window, req, res, erase })

  console.log("ERASE", erase.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success, message }))
  res.end()
}

const getData = async ({ _window, req, res, search }) => {

  var collection = search.collection
  var provider = _window.global.__provider__
  var project = (search.headers || {}).project || _window.global.manifest.session.projectID
  var response = { success: false, message: "Something went wrong!" }

  var doc = search.doc,
    docs = search.docs,
    populate = search.populate,
    select = search.select,
    deselect = search.deselect,
    assign = search.assign,
    find = search.find || search.field || {},
    findOne = search.findOne,
    limit = search.limit || 1000,
    skip = search.skip || 0,
    data = {}, success, message

  if (provider === "bracketDB") {
  } else if (provider === "firebase") {

    if (_window.global.data.project.datastore.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && !search.url) collection += `-${project}`

    var ref = req.db.firebaseDB.collection(collection), promises = []

    if ("url" in search) {

      if (!search.url) return ({ data: {}, success: false, message: "Missing Url!" })

      var url = search.url
      delete search.url

      if (url.slice(-1) === "/") url = url.slice(0, -1)

      try {
        data = await require("axios").get(url, { timeout: 1000 * 40 })
          .then(res => res.doesNotExist.throwAnError)
          .catch(err => err)

        data = JSON.parse(data.data)
        success = true
        message = `Document/s mounted successfuly!`

      } catch (err) {
        data = {}
        success = false
        message = `Error!`
      }

      response = { data, success, message }
    }

    else if ("docs" in search) {

      if (!docs) return ({ data: {}, success: false, message: "Missing Docs!" })

      var _docs = [], index = 1, length = Math.floor(search.docs.length / 10) + (search.docs.length % 10 > 0 ? 1 : 0), promises = []
      while (index <= length) {
        _docs.push(search.docs.slice((index - 1) * 10, index * 10))
        index += 1
      }

      _docs.map(docList => {
        promises.push(ref.where("id", "in", docList).get().then(docs => {

          success = true
          docs.forEach(doc => data[doc.id] = doc.data())
          message = `Documents mounted successfuly!`

        }).catch(error => {

          success = false
          message = `An error Occured!`

        }))
      })

      await Promise.all(promises)

      response = { data, success, message }
    }

    else if ("doc" in search) {

      if (!doc) return ({ data: {}, success: false, message: "Missing Doc!" })

      await ref.doc(doc.toString()).get().then(doc => {

        success = true
        data = doc.data()
        message = `Document mounted successfuly!`

      }).catch(error => {

        success = false
        message = `An error Occured!`
      })

      await Promise.all(promises)

      response = { data, success, message }
    }

    else if (Object.keys(find).length === 0) {

      if (search.orderBy || search.skip) ref = ref.orderBy(...toArray(search.orderBy || "id"))
      if (search.skip) ref = ref.offset(search.skip)
      if (search.orderBy) ref = ref.orderBy(search.orderBy)
      if (search.offset) ref = ref.endAt(search.offset)
      if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)

      if (search.startAt) ref = ref.startAt(search.startAt)
      if (search.startAfter) ref = ref.startAfter(search.startAfter)

      if (search.endAt) ref = ref.endAt(search.endAt)
      if (search.endBefore) ref = ref.endBefore(search.endBefore)
      if (limit) ref = ref.limit(limit)

      await ref.get().then(q => {

        q.forEach(doc => data[doc.id] = doc.data())

        success = true
        message = `Documents mounted successfuly!`

      }).catch(error => {

        success = false
        message = `An error Occured!`
      })

      await Promise.all(promises)

      response = { data, success, message }
    }

    // search by field
    else {

      const myPromise = () => new Promise(async (resolve) => {
        try {
          // search find
          var multiIN = false, _ref = ref
          if (find) Object.entries(find).map(([key, value]) => {

            if (typeof value !== "object") value = { equal: value }
            var operator = toFirebaseOperator(Object.keys(value)[0])
            var _value = value[Object.keys(value)[0]]
            if (operator === "in" && _value.length > 10) {

              find[key][Object.keys(value)[0]] = [..._value.slice(10)]
              _value = [..._value.slice(0, 10)]
              multiIN = true
            }

            _ref = _ref.where(key, operator, _value)
          })

          if (search.orderBy || search.skip) _ref = _ref.orderBy(...toArray(search.orderBy || "id"))
          if (search.skip) _ref = _ref.offset(search.skip)
          if (search.limitToLast) _ref = _ref.limitToLast(search.limitToLast)

          if (search.startAt) _ref = _ref.startAt(search.startAt)
          if (search.startAfter) _ref = _ref.startAfter(search.startAfter)

          if (search.endAt) _ref = _ref.endAt(search.endAt)
          if (search.endBefore) _ref = _ref.endBefore(search.endBefore)
          if (limit || 100) _ref = _ref.limit(limit || 100)

          // retrieve data
          await _ref.get().then(query => {

            success = true
            query.docs.forEach(doc => data[doc.id] = doc.data())
            message = `Documents mounted successfuly!`

          }).catch(error => {

            success = false
            message = error
          })

          if (multiIN) {

            var { data: _data } = await myPromise()
            data = { ...data, ..._data }
          }

          resolve({ data, success, message })

        } catch (error) {

          resolve({ data, success: false, message: error })
        }
      })

      response = await myPromise()
    }

  } else if (provider === "mongoDB") {

    var ref = req.db.mongoDB.db(project).collection(collection)

    // docs
    if (docs) data = await db.collection(collection).find({ id: { $in: docs } }).limit(limit).skip(skip)

    // doc
    else if (doc) data = await db.collection(collection).findOne({ id: doc })

    // collection
    else if (!find && !findOne) data = await db.collection(collection).find().limit(limit).skip(skip)

    // find
    else data = await db.collection(collection).find(mongoOptions({ find })).limit(limit).skip(skip)

    // return data as map
    if (!doc && Object.values(data)[0]) {
      var mapData = {}
      data.map(data => {
        mapData[data.id] = data
      })
      data = mapData
    }
  }

  // ex: search():[collection=product;docs;populate=:[collection;key;field]] (key is keyname in data, field is the fields to return)
  if ((populate || select || deselect || assign) && success) {

    var data = response.data

    // restructure
    if (doc) data = { [doc]: data }

    if (populate) await populator({ _window, req, res, data, populate, search })
    if (select) data = selector({ data, select })
    else if (deselect) data = deselector({ data, deselect })
    else if (assign) data = assigner({ data, assign })

    // restructure
    if (doc) data = data[doc]
    response.data = data
  }

  return response
}

const postData = async ({ _window, req, res, save }) => {

  var collection = save.collection
  var provider = _window.global.__provider__
  var project = (save.headers || {}).project || _window.global.manifest.session.projectID

  // collection
  var doc = save.doc
  var data = save.data
  var update = save.update || {}
  var success = false, message = "Missing data!"

  // update specific fields. ex: update:[name=Goerge;age=28] (it ignores appended data)
  if (Object.keys(update).length > 0 && doc) {

    var { data: rawData, success, message } = await getData({ _window, req, res, search: { collection, doc } })
    if (!success) return ({ success, message })
    Object.entries(update).map(([key, value]) => rawData[key] = value)
    data = rawData
  }

  if (provider === "bracketDB") {
  } else if (provider === "firebase") {

    if (_window.global.data.project.datastore.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`

    var ref = req.db.firebaseDB.collection(collection)

    var promises = toArray(data).map(async (data, i) => {

      data.id = data.id || (i === 0 && save.doc) || generate({ length: 60, timestamp: true })

      if (!data["creationDate"] && req.headers.timestamp) data["creationDate"] = parseInt(req.headers.timestamp)

      return await ref.doc((doc && doc.toString()) || data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`

      }).catch(error => {

        success = false
        message = error
      })
    })

    await Promise.all(promises)

    return ({ data, success, message })

  } else if (provider === "mongoDB") {

    var ref = req.db.mongoDB.db(project).collection(collection)
    promises = toArray(data).map(async data => {

      data.__props__ = data.__props__ || {
        id: generate({ unique: true }),
        creationDate: data["creation-date"] || new Date().getTime(),
        collapsed: [],
        comments: [],
        docName: doc.id,
        folderPath: [],
        confidential: {
          projectID: project
        }
      }

      if (data.id) return await ref.update({ id }, data, { upsert: true })
      else return await ref.insertOne(data)
    })
  }

  await Promise.all(promises)
}

const deleteData = async ({ _window, req, res, erase }) => {

  var collection = erase.collection
  var provider = _window.global.__provider__
  var project = (erase.headers || {}).project || _window.global.manifest.session.projectID

  var success, message
  var docs = erase.docs || [erase.doc]

  if (provider === "bracketDB") {
  } else if (provider === "firebase") {

    if (_window.global.data.project.datastore.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`

    var promises = docs.map(async doc => {

      await req.db.firebaseDB.collection(collection).doc(doc.toString()).delete().then(() => {

        success = true,
          message = `Document erased successfuly!`

      }).catch(error => {

        success = false
        message = error
      })

      if (erase.storage && erase.storage.doc) {

        var exists = await req.storage.firebaseStorage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).exists()
        if (exists) {

          await req.storage.firebaseStorage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).delete()

          await req.db.firebaseDB.collection(`storage-${req.headers["project"]}`).doc(erase.storage.doc.toString()).delete().then(() => {

            success = true,
              message = `Document erased successfuly!`

          }).catch(error => {

            success = false
            message = error
          })
        }
      }
    })

    await Promise.all(promises)

  } else if (provider === "mongoDB") {

    var ref = req.db.mongoDB.db(project).collection(collection)
    var promises = docs.map(async doc => await ref.deleteOne({ id: doc }))
    await Promise.all(promises)
  }

  return ({ success, message })
}

const populator = async ({ _window, req, res, data, populate, search }) => {

  var populatedData = {}
  var populates = toArray(populate)

  // get data by IDs
  var responses = populates.map(async (populate, i) => {

    if (typeof populate === "string") populates[i] = populate = { collection: populate, find: populate, deselect: [] }
    if (!populate.collection) populate.collection = populate.find

    var IDSet = new Set()
    Object.values(data).map(data => IDSet.add(data[populate.find]))
    var response = await getData({ _window, req, res, search: { collection: populate.collection, docs: Array.from(IDSet), headers: search.headers } })
    populatedData = { ...populatedData, ...response.data }
    return response
  })

  await Promise.all(responses)

  // populate
  populates.map(populate => {

    // assign a value to key. ex: name instead of ID
    if (populate.assign) {
      Object.values(data).map(data => {
        if (populatedData[data[populate.find]]) data[populate.find] = populatedData[data[populate.find]][populate.assign]
      })
    }

    // select. return the doc with specific find. (considering data and populatedData are many docs)
    else if (populate.select) data = selector({ data, key: populate.find, select: populate.select, populatedData })

    // select. return the doc with specific find. (considering data and populatedData are many docs)
    else if (populate.deselect) data = deselector({ data, key: populate.find, deselect: populate.deselect, populatedData })
  })

  return data
}

const selector = ({ data, key, select, populatedData }) => {

  // select with populate
  if (key && populatedData) {

    Object.values(data).map(data => {
      var doc = data[key]
      if (populatedData[doc]) {
        data[key] = {}
        toArray(select).map(select => data[key][select] = populatedData[doc][select])
      }
    })

    // select
  } else {

    var clonedData = clone(data)
    data = {}
    Object.keys(clonedData).map(doc => {
      data[doc] = {}
      toArray(select).map(select => data[doc][select] = clonedData[doc][select])
    })
  }

  return data
}

const deselector = ({ data, key, deselect, populatedData }) => {

  // deselect with populate
  if (key && populatedData) {

    Object.values(data).map(data => {
      var doc = data[key]
      if (populatedData[doc]) {
        data[key] = populatedData[data[key]]
        toArray(deselect).map(deselect => delete data[key][deselect])
      }
    })

    // deselect
  } else {

    Object.keys(data).map(doc => {
      toArray(deselect).map(deselect => delete data[doc][deselect])
    })
  }

  return data
}

const assigner = ({ data, assign }) => {
  Object.keys(data).map(doc => data[doc] = data[doc][assign])
}

const mongoOptions = ({ find }) => {

  var options = {}

  if (Array.isArray(find)) {

    // init
    options = { $or: [] }

    find.map(find => options["$or"].push(mongoOptions({ find })))

  } else {

    Object.entries(find).map(([key, valueAndOperator]) => {

      if (typeof valueAndOperator !== "object") valueAndOperator = { equal: valueAndOperator }

      var operator = toOperator(Object.keys(value)[0])
      var value = Object.values(valueAndOperator)[0]

      options[key] = options[key] || {}

      if (operator === "==") options[key]["$eq"] = value
      else if (operator === "!=") options[key]["$ne"] = value
      else if (operator === ">") options[key]["$gt"] = value
      else if (operator === "<") options[key]["$lt"] = value
      else if (operator === ">=") options[key]["$gte"] = value
      else if (operator === "<=") options[key]["$lte"] = value
      else if (operator === "in" && Array.isArray(value)) options[key]["$in"] = value
      else if (operator === "notin" && Array.isArray(value)) options[key]["$nin"] = value
      else if (operator === "regex") options[key]["$regex"] = value
      else if (operator === "inc") options[key] = value
      else if (operator === "incall") options[key]["$all"] = value
      else if (operator === "length") options[key]["$size"] = value
      else if (operator === "find") options[key] = { $elemMatch: mongoOptions({ find: value }) }
    })
  }

  return options
}

module.exports = {
  database,
  getdb,
  getData,
  postdb,
  postData,
  deletedb,
  deleteData
}
},{"./clone":4,"./generate":24,"./toArray":62,"./toFirebaseOperator":70,"./toOperator":73,"axios":88}],13:[function(require,module,exports){
const decode = ({ _window, string }) => {

  const global = _window ? _window.global : window.global
  if (typeof string !== "string") return string

  string.split("@").map((state, i) => {

    if (i === 0) return string = state

    var code = state.slice(0, 5)
    var after = state.slice(5)
    var statement = (global.__refs__[`@${code}`] || {}).data

    var prev, next
    if ((global.__refs__[`@${code}`] || {}).type === "text") {
      prev = "'"
      next = "'"
    } else {
      prev = "["
      next = "]"
    }

    statement = decode({ _window, string: statement })
    string += prev + statement + next + after
  })

  return string
}

module.exports = { decode }

},{}],14:[function(require,module,exports){
const { eventExecuter } = require("../action/event")
const { toLine } = require("../action/toLine")

const defaultAppEvents = () => {

    const views = window.views
    const global = window.global

    // document default event listeners

    // clicked element
    document.addEventListener('click', e => {

        // droplist
        if (global.__clicked__ && views.droplist.__element__.contains(global.__clicked__.__element__)) global["droplist-txt"] = global.__clicked__.__element__.innerHTML

        // document click events
        Object.entries(global.__events__).map(([id, event]) => { views[id] && event.click && event.click.map(data => (global.__clicked__ && (global.__clicked__.id === data.eventID || views[data.eventID].__element__.contains(global.__clicked__.__element__))) && eventExecuter({ ...data, e }) ) })
    })

    // mousemove
    document.addEventListener('mousemove', (e) => {

        global.__mousemoved__ = views[((e || window.event).target || e.currentTarget).id]

        // document mousemove events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mousemove && event.mousemove.map(data => (global.__mousemoved__ && (global.__mousemoved__.id === data.eventID || views[data.eventID].__element__.contains(global.__mousemoved__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener("mouseenter", (e) => {

        global.__mouseentered__ = views[((e || window.event).target || e.currentTarget).id]

        // document mouseenter events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mouseenter && event.mouseenter.map(data => (global.__mouseentered__ && (global.__mouseentered__.id === data.eventID || views[data.eventID].__element__.contains(global.__mouseentered__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener("mouseleave", (e) => {

        global.__mouseleaved__ = views[((e || window.event).target || e.currentTarget).id]

        // document mouseleav events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mouseleave && event.mouseleave.map(data => (global.__mouseleaved__ && (global.__mouseleaved__.id === data.eventID || views[data.eventID].__element__.contains(global.__mouseleaved__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener("mousedown", (e) => {

        global.__mousedowned__ = views[((e || window.event).target || e.currentTarget).id]

        // document mousedown events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mousedown && event.mousedown.map(data => (global.__mousedowned__ && (global.__mousedowned__.id === data.eventID || views[data.eventID].__element__.contains(global.__mousedowned__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener("mouseup", (e) => {
        
        global.__mouseuped__ = views[((e || window.event).target || e.currentTarget).id]

        // document mouseup events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mouseup && event.mouseup.map(data => (global.__mouseuped__ && (global.__mouseuped__.id === data.eventID || views[data.eventID].__element__.contains(global.__mouseuped__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener('keydown', e => {

        global.__keydowned__ = views[((e || window.event).target || e.currentTarget).id]

        if (global.manifest.session.projectID === "brackettechnologies" && e.ctrlKey && e.key === "s") e.preventDefault()
        
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.keydown && event.keydown.map(data => (data.eventID === "document" || (global.__keydowned__ && (global.__keydowned__.id === data.eventID || views[data.eventID].__element__.contains(global.__keydowned__.__element__)))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener('keyup', e => {

        global.__keyuped__ = views[((e || window.event).target || e.currentTarget).id]
        if (!e.ctrlKey) global.ctrlKey = false
        
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.keyup && event.keyup.map(data => data.eventID === "document" || (global.__keyuped__ && (global.__keyuped__.id === data.eventID || views[data.eventID].__element__.contains(global.__keyuped__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener('scroll', (e) => {

        global.__scrolled__ = views[((e || window.event).target || e.currentTarget).id]

        // close droplist
        if (views.droplist.__element__.style.pointerEvents === "auto") {

            var string = "():droplist.mouseleave()?!():droplist.mouseentered"
            toLine({ id: "document", e, data: {string} })
        }

        Object.entries(global.__events__).map(([id, event]) => views[id] && event.scroll && event.scroll.map(data => (global.__scrolled__ && (global.__scrolled__.id === data.eventID || views[data.eventID].__element__.contains(global.__scrolled__.__element__))) && eventExecuter({ ...data, e })))
    }, true)

    // window default event listeners

    window.addEventListener("focus", (e) => {

        views.root.__element__.click()
        document.activeElement.blur()

        var string = "():mininote.style():[opacity=0;transform=scale(0)]"
        toLine({ id: "window", e, data: {string} })
    })

    window.addEventListener("mousedown", (e) => {

        global.__clicked__ = views[(e || window.event).target.id]
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

    window.addEventListener("keydown", function (e) {
        if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
            e.preventDefault()
        }
    }, false)

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

module.exports = { defaultAppEvents }
},{"../action/event":18,"../action/toLine":71}],15:[function(require,module,exports){
const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")
const { colorize } = require("./colorize")
const { toCode } = require("./toCode")
const { replaceNbsps } = require("./replaceNbsps")

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

const getCaretIndex = (element) => {

  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      console.log(preCaretRange);
      preCaretRange.selectNodeContents(element);
      console.log(preCaretRange);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      console.log(preCaretRange);
      position = preCaretRange.toString().length;
    }
  }
  return position + 1;
}

module.exports = { defaultInputHandler }


/*if (e.data === "[") {
  var _prev = value.slice(0, e.target.selectionStart - 1)
  var _next = value.slice(e.target.selectionStart)
  e.target.value = value = _prev + "[]" + _next
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length + 1)

} else if (e.data === "(" && value[e.target.selectionStart - 2] !== ")") {
  var _prev = value.slice(0, e.target.selectionStart - 1)
  var _next = value.slice(e.target.selectionStart)
  e.target.value = value = _prev + "()" + _next
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

} else */ /*else if (e.data === "]" && value[e.target.selectionStart - 2] === "[" && value[e.target.selectionStart] === "]") {
  var _prev = value.slice(0, e.target.selectionStart)
  var _next = value.slice(e.target.selectionStart + 1)
  e.target.value = value = _prev + _next
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length + 1)

} else if (e.data === "T" && e.target.selectionStart === 1 && view.__dataPath__[view.__dataPath__.length - 1] === "type") {
  e.target.value = value = "Text?class=flexbox;text=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "c" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.__dataPath__[view.__dataPath__.length - 1] === "type") {
  e.target.value = value = "Icon?class=flexbox;name=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "n" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.__dataPath__[view.__dataPath__.length - 1] === "type") {
  e.target.value = value = "Input?style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 1

} else if (e.data === "m" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.__dataPath__[view.__dataPath__.length - 1] === "type") {
  e.target.value = value = "Image?class=flexbox;src=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "V" && e.target.selectionStart === 1 && view.__dataPath__[view.__dataPath__.length - 1] === "type") {
  e.target.value = value = "View?class=vertical;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 1

}*/
},{"./colorize":6,"./data":11,"./isArabic":31,"./replaceNbsps":47,"./resize":48,"./toCode":66}],16:[function(require,module,exports){
const { update } = require("./toView")
const { clone } = require("./clone")
const { jsonToBracket } = require("./jsonToBracket")
const { toLine } = require("./toLine")
const { kernel } = require("./kernel")

const droplist = ({ id, e, __, stack, lookupActions, address }) => {
  
  const views = window.views
  const global = window.global
  var view = views[id]

  if (!view.droplist) return
  if (view.droplist.searchable !== false) view.droplist.searchable = {}

  // closedroplist
  var mouseleaveEvent = new Event("mouseleave")
  views.droplist.__element__.dispatchEvent(mouseleaveEvent)
  
  // items
  var items = clone(view.droplist.items) || []
  var __dataPath__ = view.droplist.path !== undefined ? (Array.isArray(view.droplist.path) ? view.droplist.path : view.droplist.path.split(".")) : view.__dataPath__
  var doc = view.droplist.doc || view.doc

  // init droplist
  var droplistView = { ...global.data.view.droplist, children: [], __dataPath__, doc, __parent__: "root", __, __childIndex__: views.droplist.__childIndex__, __viewPath__: ["droplist"], __customViewPath__: ["route", "document", "root", "droplist"], __lookupViewActions__: [...view.__lookupViewActions__] }

  // input id
  var { data: inputID } = toLine({ id, data: { string: "input().id||().id" } })
  var text = views[inputID].__element__.value || views[inputID].__element__.innerHTML

  // items
  if (typeof items === "string") items = toLine({ id, data: { string: items }, lookupActions, __: view.__ }).data

  // filterable
  if (!view.droplist.preventDefault) {

    if ((view.droplist.searchable || {}).filter && text) {
      
      items = items.filter(item => view.droplist.searchable.any 
        ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
        : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
      )

      global.__keyupIndex__ = 0
    }
  }
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    droplistView.children.push(...clone(items).map(item => {

      if (typeof item === "string" || typeof item === "number") item = { text: item }
      item.text = item.text !== undefined ? `${item.text}` : ""

      if (item.icon) {
  
        if (typeof item.icon === "string") item.icon = { name: item.icon }
        if (typeof item.text === "string") item.text = { text: item.text }
        
        return ({
          view: `View?style:[minHeight=3rem;padding=0 1rem;gap=1rem];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item || {})};${jsonToBracket(item || {})};class=flex align-items pointer ${item.class || ""}`,
          children: [{
            view: `View?style:[height=inherit;width=fit-content];${jsonToBracket(item.icon.container || {})};class=flexbox ${(item.icon.container || {}).class || ""}`,
            children: [{
              view: `Icon?style:[color=#666;fontSize=1.7rem];${jsonToBracket(view.droplist.item && view.droplist.item.icon || {})};${jsonToBracket(view.droplist.icon || {})};${jsonToBracket(item.icon || {})};class=flexbox ${(item.icon || {}).class || ""}`
            }]
          }, {
            view: `Text?style:[fontSize=1.3rem;width=100%];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item.text)};class=flex align-center ${(item.text || {}).class || ""};click:[():[__droplistPositioner__:()].():[txt()=txt();data()=txt()]?!():${id}.droplist.preventDefault]?${item.text.text ? true : false}`
          }]
        })
  
      } else {
        
        return ({
          view: `Text?style:[minHeight=3rem;padding=0 1rem;fontSize=1.3rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item)};class=flex align-center pointer ${item.class || ""};click:[():[__droplistPositioner__:()].():[txt()=txt();data()=txt()]?!():${id}.droplist.preventDefault]`,
        })
      }
    }))
    
  } else droplistView.children = []
  
  droplistView.positioner = id
  
  update({ stack, lookupActions, __, address, data: { id: "droplist", view: droplistView } })
  droplistView = views.droplist
  
  // searchable
  var mouseEnterItem = () => {

    var _index, onlyOne
    if (view.droplist && view.droplist.searchable) {

      if (text) {
        
        _index = items.findIndex(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
        )

        // fills input value
        onlyOne = items.filter(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
        ).length === 1
        
        if (_index !== -1) {
          
          if (onlyOne) {
            
            if (e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward" && e.inputType !== "deleteWordBackward" && e.inputType !== "deleteWordForward") {

              if (inputID) {

                views[inputID].__element__.value = views[inputID].prevValue = items[_index]
                views[inputID].contenteditable = false

              } else {

                view.__element__.innerHTML = view.prevValue = items[_index]
                view.contenteditable = false
              }
              
              
            } else if (view.contenteditable === false || views[inputID].contenteditable === false) {
              
              if (inputID) {

                views[inputID].__element__.value = items[_index].slice(0, -1)
                views[inputID].contenteditable = true

              } else {

                view.__element__.innerHTML = items[_index].slice(0, -1)
                view.contenteditable = true
              }
            }
          }

          kernel({ id, data: { path: droplistView.__dataPath__, object: global[droplistView.doc], key: true, value: items[_index] }, __ })
          global.__keyupIndex__ = _index
        }
      }
    }

    global.__keyupIndex__ = global.__keyupIndex__ || 0
    droplistView.__element__.children[view.droplist.title ? global.__keyupIndex__ + 1 : global.__keyupIndex__].dispatchEvent(new Event("mouseenter"))
  }

  global.__droplistTimer__ = setTimeout(mouseEnterItem, 100)
}

module.exports = { droplist }
},{"./clone":4,"./jsonToBracket":38,"./kernel":39,"./toLine":71,"./toView":78}],17:[function(require,module,exports){
const axios = require("axios")
const { deleteData } = require("./database")

const erase = async ({ _window, lookupActions, stack, req, res, id, e, __, erase = {}, ...params }) => {

  var data

  if (!erase.collection) return console.log("No collection!")

  // headers
  var headers = { ...(erase.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }
  
  if (_window) {

    data = await deleteData({ _window, req, res, erase })

  } else {

    var response = await axios.post(`/`, { server: "database", type: "erase", data: erase }, { headers })
    data = response.data
  }

  // console.log("ERASE", (new Date()).getTime() - headers.timestamp, erase.collection, data)

  // stack
  require("./toAwait").toAwait({ _window, lookupActions, stack, id, e, ...params, req, res, _: data, __ })
}

module.exports = { erase }
},{"./database":12,"./toAwait":63,"axios":88}],18:[function(require,module,exports){
const { toCode } = require("./toCode")
const { openStack, endStack } = require("./stack")
const { toLine } = require("./toLine")
const { watch } = require("./watch")
const { clone } = require("./clone")
const { decode } = require("./decode")
const { addresser } = require("./addresser")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { toParam } = require("./toParam")

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

      // view doesnot exist
      if (!event || !views[eventID] || !views[id]) return

      // loaded event
      if (event === "loaded") return eventExecuter({ string, event, eventID, id, address, stack, lookupActions, __ })

      //
      if (id !== eventID) {

        global.__events__[id] = global.__events__[id] || {}
        global.__events__[id][event] = global.__events__[id][event] || []
        global.__events__[id][event].push({ string, event, eventID, id, lookupActions, __ })

      } else views[eventID].__element__.addEventListener(event, (e) => {

        eventExecuter({ string, event, eventID, id, stack, lookupActions, __, address, e })
      })
    })
  })
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

  // unlunch unrelated droplists
  if (id !== "droplist" && eventID === "droplist" && (!global.__droplistPositioner__ || !views[global.__droplistPositioner__] || !views[global.__droplistPositioner__].__element__.contains(view.__element__))) return

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
  var fn = (e) => {
    if (views[id]) view[keyName] = value
  }

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

module.exports = { addEventListener, defaultEventHandler, eventExecuter }

},{"./addresser":2,"./clone":4,"./decode":13,"./generate":24,"./stack":57,"./toArray":62,"./toCode":66,"./toLine":71,"./toParam":74,"./watch":82}],19:[function(require,module,exports){
module.exports=[
  "mouseenter", "mouseleave",  "mouseover", "mousemove", "mousedown", "mouseup", "touchstart", 
  "touchend", "touchmove", "touchcancel", "click", "change", "focus", "blur", "keypress", "keyup", 
  "keydown", "scroll", "beforeLoading", "loaded", "controls", "children", "child", "change", "entry", 
  "enter", "longclick", "sibling", "siblings", "prevSiblings", "prevSibling", "unload", "undo", "storage",
  "resize", "redo", "popstate", "online", "offline", "message", "load", "languagechange",
  "error", "afterprint", "beforeprint", "beforeunload", "paste"
]
},{}],20:[function(require,module,exports){
const {isParam} = require("./isParam")

module.exports = {
    executable: ({ _window, string, encoded = true }) => {
        return typeof string === "string" && (string.includes("()") || (encoded ? string.charAt(0) === "@" || isParam({ _window, string }) : false) || string.includes("_"))
    }
}
},{"./isParam":36}],21:[function(require,module,exports){
module.exports = {
    exportJson: ({ data, name }) => {
        
        var dataStr = JSON.stringify(data, null, 2)
        var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

        var exportFileDefaultName = `${name || `exportDate-${(new Date()).getTime()}`}.json`

        var linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
        // linkElement.delete()
    }
}
},{}],22:[function(require,module,exports){
(function (global){(function (){
const { toArray } = require("./toArray")
const { toAwait } = require("./toAwait")

module.exports = {
    fileReader: ({ req, res, _window, lookupActions, stack, address, id, e, __, data }) => {

        // files to read
        data.data = toArray(data.data)
        if (!data.data) return console.log("No data to read!")

        // read type
        var type = data.type
        if (!type && data.url) type = "url"
        else if (!type && data.json) type = "json"
        else if (!type && data.text) type = "text"
        else if (!type && data.buffer) type = "buffer"
        else if (!type && data.binary) type = "binary"
        else if (!type) type = "url"

        // init
        global.__fileReader__ = {
            files: [],
            length: data.data.length,
            count: 0
        };

        data.data.map(file => {

            var reader = new FileReader()
            reader.onload = (e) => {

                global.__fileReader__.count++;

                global.__fileReader__.files.push({
                    type: file.type,
                    lastModified: file.lastModified,
                    name: file.name,
                    size: file.size,
                    url: e.target.result,
                    data: e.target.result
                })

                if (global.__fileReader__.count === global.__fileReader__.length) {

                    var files = global.__fileReader__.files

                    // parse JSON
                    if (type === "json") files.map(file => file.data = JSON.parse(file.data))

                    var data = { success: true, message: "File read successfully!", data: files.length === 1 ? files[0] : files }

                    toAwait({ req, res, _window, lookupActions, stack, address, id, e, __, _: data })
                }
            }

            try {

                if (type === "url" || type === "file") reader.readAsDataURL(file)
                else if (type === "text" || type === "json") reader.readAsText(file)
                else if (type === "binary") reader.readAsBinaryString(file)
                else if (type === "buffer") reader.readAsArrayBuffer(file)

            } catch (er) {
                document.getElementById("loader-container").style.display = "none"
            }
        })
    }
}
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./toArray":62,"./toAwait":63}],23:[function(require,module,exports){
const focus = ({ id }) => {

  var view = window.views[id]
  if (!view) return

  var isInput = view.__name__ === "Input" || view.__name__ === "Textarea"
  if (isInput) view.__element__.focus()
  else {
    if (view.__element__) {
      let childElements = view.__element__.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = view.__element__.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].focus()

        var _view = window.views[childElements[0].id]
        // focus to the end of input
        var value = _view.__element__.value
        _view.__element__.value = ""
        _view.__element__.value = value

        return
      } else view.__element__.focus()
    }
  }

  // focus to the end of input
  var value = view.__element__.value
  view.__element__.value = ""
  view.__element__.value = value
}

module.exports = {focus}

},{}],24:[function(require,module,exports){
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const numbers = "1234567890"

const generate = (params = {}) => {

  var { length, number, unique } = params

  var result = "", chars = number ? numbers : characters

  var charactersLength = chars.length
  var time = (new Date()).getTime() + ""
  
  if (unique) length = 26
  else if (!unique && !length) length = 5

  for (let i = 0; i < (unique && length >= 26 ? length - 13 : length); i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
    if (unique && length >= 26 && i <= 13) result += time[i]
  }
  
  return result
}

module.exports = {generate}

},{}],25:[function(require,module,exports){
module.exports = ({ el, id }) => {
  var view = window.views[id]
  el = el || view.__element__

  // crossbrowser version
  var box = el.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  
  var height = el.offsetHeight;
  var width = el.offsetWidth;
  var top  = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;
  var right = window.screen.availWidth - (left + width);
  var bottom = window.screen.availHeight - (top + height);

  return { top: Math.round(top), left: Math.round(left), right: Math.round(right), bottom: Math.round(bottom), height: Math.round(height), width: Math.round(width) };
}
},{}],26:[function(require,module,exports){
module.exports = {
    getDateTime: (time, format) => {
        
        var sec = parseInt(time.getSeconds())
        var min = parseInt(time.getMinutes())
        var hrs = parseInt(time.getHours())
        var day = parseInt(time.getDate())
        var month = parseInt(time.getMonth()) + 1
        var year = parseInt(time.getFullYear())
        
        if (sec < 10) sec = "0" + sec
        if (min < 10) min = "0" + min
        if (hrs < 10) hrs = "0" + hrs
        if (day < 10) day = "0" + day
        if (month < 10) month = "0" + month
        if (year < 10) year = "0" + year
        
        return format === "yyyy-mm-ddThh-mm-ss" && `${year}-${month}-${day}T${hrs}:${min}:${sec}`
    }
}
},{}],27:[function(require,module,exports){
module.exports = {
    getDaysInMonth: (stampTime) => {
        return new Date(stampTime.getFullYear(), stampTime.getMonth() + 1, 0).getDate()
    }
}
},{}],28:[function(require,module,exports){
const getType = (value) => {
  const { emptySpaces, isNumber } = require("./toValue")

  if (typeof value === "boolean" || value === "true" || value === "false") return "boolean"
  if (typeof value === "object" && Array.isArray(value)) return "array"
  if (typeof value === "object") return "map"
  if (typeof value === "function") return "function"
  if (typeof value === "number" || (typeof value === "string" && isNumber(value))) {

    /*if (value.length >= 10 && value.length <= 13 && !isNaN(value) && value.slice(0, 2) !== "0") return "timestamp"
    if (value.length === 8 && value.slice(0, 2) !== "00" && !isNaN(value)) return "time"*/

    if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").charAt(0) !== "0") return "timestamp"
    //if ((value + "").length === 8 && (value + "").charAt(0) !== "0") return "time"
    if (typeof value === "number") return "number"
    return "string"
  }
  if (typeof value === "string") return "string"
}
module.exports = { getType }
},{"./toValue":77}],29:[function(require,module,exports){
const nthParent = ({ _window, nth, o }) => {

  if (!o.__view__) return o
  const views = _window ? _window.views : window.views

  var n = 0, parent = o.id
  
  while (n < nth) {
    if (views[parent]) parent = views[parent].__parent__
    n++
  }
  
  return views[parent]
}

const nthNext = ({ _window, nth, o }) => {

  if (!o.__view__) return o
  const views = _window ? _window.views : window.views

  var n = 0, next = o.id
  while (n < nth) {
    if (views[next]) next = (views[views[next].__parent__].__childrenRef__[views[next].__index__ + 1] || {}).id
    n++
  }

  return views[next]
}

const nthPrev = ({ _window, nth, o }) => {

  if (!o.__view__) return o
  const views = _window ? _window.views : window.views

  var n = 0, prev = o.id
  while (n < nth) {
    if (views[prev]) prev = (views[views[prev].__parent__].__childrenRef__[views[prev].__index__ - 1] || {}).id
    n++
  }

  return views[prev]
}

const getAllParents = ({ _window, id }) => {

  const views = _window ? _window.views : window.views
  var view = views[id]
  if (!view.__parent__) return []

  var parentId = view.__parent__
  var all = [views[parentId]]

  all.push(...getAllParents({ _window, id: parentId }))

  return all
}

module.exports = { nthParent, getAllParents, nthNext, nthPrev }
},{}],30:[function(require,module,exports){
const { clone } = require("./clone")
const { decode } = require("./decode")
const { generate } = require("./generate")
const { getDeepChildrenId } = require("./kernel")
const { updateDataPath } = require("./remove")
const { toCode } = require("./toCode")
const { isNumber } = require("./toValue")
const { update } = require("./toView")

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

    if (childrenRef) view = views[childrenRef.id]
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
      
      // data
      data = insert.__view__ ? (typeof insert.data === "object" ? {} : "") : (insert.view && data !== undefined ? data : undefined)

      path.reduce((o, k, i) => {

        if (i === itemIndex - 1) o[k].splice(path[itemIndex], 0, data)
        else if (i >= itemIndex) return
        else return o[k]

      }, global[doc])
    }
    
    // inserted view params
    passData = {
      __: view.__loop__ ? [data, ...view.__.slice(1)] : view.__,
      __viewPath__: [...view.__viewPath__, ...viewPath], 
      __customViewPath__: [...view.__customViewPath__], 
      __lookupViewActions__: [...view.__lookupViewActions__] 
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

module.exports = { insert }
},{"./clone":4,"./decode":13,"./generate":24,"./kernel":39,"./remove":46,"./toCode":66,"./toValue":77,"./toView":78}],31:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[A-Za-z]/

const isArabic = ({ id, value, text }) => {

  var view = window.views[id]
  if (!view || !view.__element__) return
  text = text || value || view.__element__.value || view.__element__.innerHTML
  if (!text) return

  var isarabic = arabic.test(text)
  var isenglish = english.test(text)

  if (isarabic && !isenglish) {

    view.__element__.classList.add("arabic")
    view.__element__.style.textAlign = view.__element__.style.textAlign || "right"
    if (view.__name__ !== "Input") view.__element__.innerHTML = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    else view.__element__.value = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    if (view["placeholder-ar"]) view.__element__.placeholder = view["placeholder-ar"]

  } else {

    if (view.__element__.className.includes("arabic")) view.__element__.style.textAlign = view.__element__.style.textAlign || "right"
    view.__element__.classList.remove("arabic")
    if (view["placeholder"]) view.__element__.placeholder = view["placeholder"]
  }

  return isarabic && !isenglish
}

module.exports = { isArabic }

},{}],32:[function(require,module,exports){
const isCalc = ({ _window, string }) => {

    if (typeof string !== "string") return false
    
    const global = _window ? _window.global : window.global
    if (string.charAt(0) === "@" && string.length === 6) string = global.__refs__[string].data

    // recheck after decoding
    if (typeof string !== "string") return false

    // tested before
    if (global.__calcTests__[string]) return true
    else if (global.__calcTests__[string] === false) {
        delete global.__calcTests__[string]
        return false
    }

    if (!string.includes(",") && ((string.includes("/") && string.split("/")[1] !== "") || (string.includes("%") && string.split("%")[1] !== "") || string.includes("||") || string.includes("*") || string.includes("+") || string.includes("-")))
    return true

    else return false
}

module.exports = { isCalc }
},{}],33:[function(require,module,exports){
module.exports = {
    isCondition: ({ _window, string }) => {
        
        if (typeof string !== "string") return false

        const global = _window ? _window.global : window.global
        if (string.charAt(0) === "@" && string.length === 6) string = global.__refs__[string].data

        // recheck after decoding
        if (typeof string !== "string") return false

        if (string.slice(0, 1) === "!" || string.includes(">") || string.includes("<") || string.includes("!=")) return true
        return false
    }
}
},{}],34:[function(require,module,exports){
const isEqual = function(value, other) {
  // if (value === undefined || other === undefined) return false

  if ((value && !other) || (other && !value)) return false

  // string
  if (typeof value === "string" && typeof other === "string") return value.replace(/\s+/g, ",") === other.replace(/\s+/g, ",");

  // boolean || number
  if ((typeof value !== "object") && (typeof other !== "object")) return value === other
  
  var type = Object.prototype.toString.call(value)
  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the two items
  const valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  const otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  const compare = function(item1, item2) {
    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() != item2.toString()) return false;
      } else {
        if (item1 != item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    var equal = true
    if (value.length === other.length) {
      value.map((value, i) => {
        if (!isEqual(value, other[i])) equal = false
      })
    } else equal = false
    return equal
  }

  if (typeof value === "object" && typeof other === "object" && !Array.isArray(value) && !Array.isArray(other)) {
    var equal = true, valueKeys = Object.keys(value), otherKeys = Object.keys(other)
    if (valueKeys.length === otherKeys.length) {
      valueKeys.map((key, i) => {
        if (!isEqual(valueKeys[key], otherKeys[key])) equal = false
      })
    } else equal = false
    return equal
  }

  // html elements
  if (value && other) {
    
    if (
      value.nodeType === Node.ELEMENT_NODE &&
      other.nodeType === Node.ELEMENT_NODE
    ) {
      return (
        value.isSameNode(other) ||
        value.contains(other) ||
        other.contains(value)
      );
    } else if (
      (value.nodeType !== Node.ELEMENT_NODE &&
        other.nodeType === Node.ELEMENT_NODE) ||
      (value.nodeType === Node.ELEMENT_NODE &&
        other.nodeType !== Node.ELEMENT_NODE)
    ) {
      return false;
    }
  }

  // If nothing failed, return true
  return true;
}

module.exports = {isEqual}

},{}],35:[function(require,module,exports){
var events = require("./events.json")

const isEvent = ({ _window, string }) => {
    
    if (string.split("?").length > 1) {

        var path = string.split("?")
        var event = path[0].split(";")[0].split(":")[0]
        if (events.includes(event)) return true
        else return false

    } else return false
}

module.exports = { isEvent }
},{"./events.json":19}],36:[function(require,module,exports){
module.exports = {
  isParam: ({ _window, string = "" }) => {
    
    if (string.charAt(0) === "@" && string.length === 6) string = (_window ? _window.global : window.global).__refs__[string].data

    if (string.includes("=") || string.includes(";") || string === "return()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) return true
    return false
  }
}
},{}],37:[function(require,module,exports){
const fs = require("fs")
const { toArray } = require("./toArray")
const { toOperator } = require("./toOperator")

var getJsonFiles = ({ search = {} }) => {
  
  var data = {},
  collection = search.collection, 
  doc = search.doc, 
  docs = search.docs, 
  fields = search.field, 
  limit = search.limit || 100,
  path = `database/${collection}`
  
  // create folder if it doesnot exist
  if (!fs.existsSync(path)) return data

  if (doc) {
    
    if (!fs.existsSync(`${path}/${doc}.json`)) return data // fs.writeFileSync(`${path}/${doc}.json`, "{}")
    data = JSON.parse(fs.readFileSync(`${path}/${doc}.json`))

  } else if (docs && docs.length > 0) {
    
    toArray(docs).map(doc => {
      if (fs.existsSync(`${path}/${doc}.json`)) data[doc] = JSON.parse(fs.readFileSync(`${path}/${doc}.json`))
    })
    
  } else if (!fields) {

    var docs = fs.readdirSync(path), i = 0
    while ((i < limit) && (i <= docs.length - 1)) {

      var doc = docs[i]
      var _document = JSON.parse(fs.readFileSync(`${path}/${doc}`))
      doc = doc.split(".json")[0]
      data[doc] = _document
      i += 1
    }
    
  } else if (fields) {

    var docs = fs.readdirSync(path), i = 0
    var _operator = search.operator || "and"
    
    while ((Object.keys(data).length <= limit) && (i <= docs.length - 1)) {

      var doc = docs[i]
      var _document = JSON.parse(fs.readFileSync(`${path}/${doc}`))

      doc = doc.split(".json")[0]
      var _data = _document, _push = false, pushed = false

      Object.keys(fields).map(field => {

        if (pushed) return
        Object.entries(fields[field]).map(([operator, value]) => {

          if (pushed) return
          operator = toOperator(operator)
          
          if (operator === "==") {
            if (_data[field] === value) _push = true
            else _push = false
          } else if (operator === "!=") {
            if (_data[field] !== value) _push = true
            else _push = false
          } else if (operator === ">=") {
            if (_data[field] >= value) _push = true
            else _push = false
          } else if (operator === "<=") {
            if (_data[field] <= value) _push = true
            else _push = false
          } else if (operator === "<") {
            if (_data[field] < value) _push = true
            else _push = false
          } else if (operator === ">") {
            if (_data[field] > value) _push = true
            else _push = false
          } else if (operator === "array-contains") {
            if (toArray(value).length > 0 && toArray(value).filter(v => _data[field].find(_v => _v === v)).length === toArray(value).length) _push = true
            else _push = false
          } else if (operator === "array-contains-any") {
            if (_data[field].find(v => toArray(value).find(_v => _v === v))) _push = true
            else _push = false
          } else if (operator === "in") {
            if (typeof _data[field] === "object") {
              var records = Array.isArray(_data[field]) ? _data[field] : Object.keys(_data[field])
              if (records.find(v => value === v)) _push = true
              else _push = false
            } else if (typeof _data[field] === "string") {
              if (value.length >= _data[field].length) {
                if (value.includes(_data[field]) && _data[field]) _push = true
                else _push = false
              } else {
                if (_data[field].includes(value)) _push = true
                else _push = false
              }
            }
          } else if (operator === "not-in") {
            if (typeof _data[field] === "object") {
              var records = Array.isArray(_data[field]) ? _data[field] : Object.keys(_data[field])
              if (records.find(v => value === v)) _push = false
              else _push = true
            } else if (typeof _data[field] === "string") {
              if (value.length >= _data[field].length) {
                if (value.includes(_data[field])) _push = false
                else _push = true
              } else {
                if (_data[field].includes(value)) _push = false
                else _push = true
              }
            }
          }

          if (_push && _operator === "or") {
            data[_data.id] = _data
            pushed = true
          }
        })
      })
      if (_push && _operator === "and") data[_data.id] = _data
      i += 1
    }
  }

  return data
}

const postJsonFiles = ({ save = {} }) => {
  
  var data = save.data,
  collection = save.collection, 
  doc = save.doc
  
  // create folder if it doesnot exist
  var path = "database/"
  collection.split("/").map(dir => {
    path += dir
    if (!fs.existsSync(path)) fs.mkdirSync(path)
    path += "/"
  })
  
  path = `database/${collection}`
  fs.writeFileSync(`${path}/${doc}.json`, JSON.stringify(data, null, 2))
  return data
}

const removeJsonFiles = ({ erase = {} }) => {

  var db = erase.db, 
  collection = erase.collection, 
  docs = toArray(erase.doc || erase.docs), 
  path = `database`

  if (db) path += `/${db}`
  if (collection) path += `/${collection}`
  
  if (!fs.existsSync(path)) return

  // create folder if it doesnot exist
  if (docs.length === 0) fs.rmSync(`${path}`, { recursive: true, force: true })
  else docs.map(doc => doc && fs.unlinkSync(`${path}/${doc}.json`))
}

const uploadJsonFile = ({ upload = {} }) => {
  
  var file = upload.file, path, 
  collection = upload.collection, 
  doc = upload.document || upload.doc, 
  data = upload.data, 
  path = `storage/${collection}/${doc}`
  
  // file Type
  upload.type = upload.type.split("-").join("/")
  fs.writeFileSync(path, file, "base64")
  data.url = path

  path = `database/${collection}/${doc}`
  fs.writeFileSync(path, JSON.stringify(data, null, 2))

  return path
}

module.exports = { getJsonFiles, postJsonFiles, removeJsonFiles, uploadJsonFile }
},{"./toArray":62,"./toOperator":73,"fs":118}],38:[function(require,module,exports){
const jsonToBracket = (object, field) => {

  if (!object) return ""

  var string = ""
  var length = Object.entries(object).length

  Object.entries(object).map(([key, value], index) => {
    if (field) key = `${field}.${key}`

    if (Array.isArray(value)) {

      if (value.length === 0) string += `${key}=:[]`
      else string += `${key}=:${value.join(":")}`

    } else if (typeof value === "object") {

      if (Object.keys(value).length === 0) string += `${key}=[]`
      else {
        var path = jsonToBracket(value).split(";")
        string += path.map(path => `${key}.${path}`).join(";")
      }

    } else if (typeof value === "string") string += `${key}='${value}'`
    else string += `${key}=${value}`

    if (index < length - 1) string += ";"
  })

  return string || ""
}

module.exports = {jsonToBracket}

},{}],39:[function(require,module,exports){
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
const { setCookie, getCookie, eraseCookie } = require("./cookie")
const { focus } = require("./focus")
const { toSimplifiedDate } = require("./toSimplifiedDate")
const { toClock } = require("./toClock")
const { note } = require("./note")
const { isParam } = require("./isParam")
const { lengthConverter } = require("./resize")
const { qr } = require("./qr")
const { replaceNbsps } = require("./replaceNbsps")
const { addresser, endAddress } = require("./addresser")
const { vcard } = require("./vcard")
const { toLine } = require("./toLine")
const { colorize } = require("./colorize")
const { override } = require("./merge")
const { nthParent, nthNext, nthPrev } = require("./getView")
const { remove } = require("./remove")
const events = require("./events.json")
const { decode } = require("./decode")
const { toAwait } = require("./toAwait")
const { searchParams } = require("./searchParams")
const { fileReader } = require("./fileReader")

const kernel = ({ _window, lookupActions, stack, id, __, e, req, res, condition, data: { data: _object, path, pathJoined, value, key, object } }) => {

    const { toValue, isNumber } = require("./toValue")
    const { toParam } = require("./toParam")
    const { toAction } = require("./toAction")
    const { toApproval } = require("./toApproval")
    const { reducer } = require("./reducer")

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

        } else if (k0 === "qr()") {

            // wait address
            var { address, data } = addresser({ _window, stack, args, status: "Start", asynchronous: true, id: o.id, action: "qr()", object, lookupActions, __, id })

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

        } else if (k0 === "mouseentered()") {

            return global.__mouseentered__

        } else if (k0 === "mouseleaved()") {

            return global.__mouseleaved__

        } else if (k0 === "focused()") {

            return global.__focused__

        } else if (k0 === "click()") {
 
            if (!o.__view__ || !o.__rendered__) return

            if (_window) return view.__controls__.push({
                event: `loaded?${pathJoined}`
            })

            global.__clicked__ = o
            o.__element__.click()

        } else if (k0 === "focus()") {

            if (!o.__view__) return

            if (_window) return view.__controls__.push({
                event: `loaded?${pathJoined}`
            })

            global.__focused__ = o
            focus({ id: o.id })

        } else if (k0 === "blur()") { // blur

            if (!o.__view__) return

            if (_window) return view.__controls__.push({
                event: `loaded?${pathJoined}`
            })

            global.__blured__ = o
            o.__element__.blur()

        } else if (k0 === "mousedown()") {

            if (!o.__view__) return
            var mousedownEvent = new Event("mousedown")
            o.__element__.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseup()") {
            
            if (!o.__view__) return
            global.__mouseuped__ = o
            var mouseupEvent = new Event("mouseup")
            o.__element__.dispatchEvent(mouseupEvent)

        } else if (k0 === "mouseenter()") {
            
            if (!o.__view__) return
            global.__mouseentered__ = o
            var mouseenterEvent = new Event("mouseenter")
            o.__element__.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            if (!o.__view__) return
            global.__mouseleaved__ = o
            var mouseleaveEvent = new Event("mouseleave")
            o.__element__.dispatchEvent(mouseleaveEvent)

        } else if (k0 === "keyup()") {

            if (!o.__view__) return
            global.__keyuped__ = o
            var keyupevent = new Event("keyup")
            o.__element__.dispatchEvent(keyupevent)

        } else if (k0 === "keydown()") {

            if (!o.__view__) return
            global.__keydowned__ = o
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
            require("./toView").update({ _window, lookupActions, stack, req, res, id, address, __, data: { id: data.id || o.id, ...data } })

        } else if (k0 === "insert()") {

            if (!o.__view__) return o

            // wait address
            var { address, data = {} } = addresser({ _window, stack, args, interpreting: true, status: "Start", type: "action", renderer: true, id: o.id, action: "insert()", lookupActions, __, id })
            require("./insert").insert({ id, lookupActions, stack, address, __, insert: { ...data, parent: o.id } })

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

module.exports = { kernel, getDeepChildren, getDeepChildrenId }
},{"./addresser":2,"./capitalize":3,"./clone":4,"./colorize":6,"./cookie":7,"./counter":8,"./csvToJson":10,"./decode":13,"./droplist":16,"./erase":17,"./events.json":19,"./exportJson":21,"./fileReader":22,"./focus":23,"./generate":24,"./getCoords":25,"./getDateTime":26,"./getDaysInMonth":27,"./getType":28,"./getView":29,"./insert":30,"./isEqual":34,"./isParam":36,"./jsonToBracket":38,"./mail":41,"./merge":42,"./note":43,"./qr":44,"./reducer":45,"./remove":46,"./replaceNbsps":47,"./resize":48,"./root":49,"./route":50,"./save":51,"./search":52,"./searchParams":53,"./setPosition":55,"./sort":56,"./toAction":60,"./toApproval":61,"./toArray":62,"./toAwait":63,"./toCSV":64,"./toClock":65,"./toExcel":69,"./toLine":71,"./toNumber":72,"./toParam":74,"./toPdf":75,"./toSimplifiedDate":76,"./toValue":77,"./toView":78,"./upload":79,"./vcard":80}],40:[function(require,module,exports){
const logger = ({ _window: { global }, data: { key, start, end } }) => {
    
    if (!key) return
    if (start) global.__server__[`${key}StartTime`] = (new Date()).getTime()
    else if (end) {
    
        global.__server__[`${key}EndTime`] = (new Date()).getTime()
        global.__server__[`${key}Duration`] = global.__server__[`${key}EndTime`] - global.__server__[`${key}StartTime`]
        console.log(key.toUpperCase(), global.__server__[`${key}Duration`])
    }
}
module.exports = { logger }
},{}],41:[function(require,module,exports){
const { toArray } = require("./toArray")

module.exports = {
    mail: async ({ _window, req, res, id, data, __, ...params }) => {

        var { subject, content, text, html, recipient, attachments, recipients = [] } = data
        
        const { google } = _window.__package__.googleapis
        const nodemailer = _window.__package__.nodemailer
        const OAuth2 = google.auth.OAuth2;
        var data = req.body.data
        const global = _window.global
        var project = global.data.project

        // no recipient
        if (!data.recipient) return res.send({ success: false, message: `Missing recipient!` })
        
        if (project.mail) {

            const OAuth2_client = new OAuth2(project.mail.clientId, project.mail.clientSecret);
            OAuth2_client.setCredentials({ refresh_token: project.mail.refreshToken })

            const accessToken = OAuth2_client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: project.mail.service,
                auth: {
                    type: project.mail.authType,
                    user: project.mail.user,
                    clientId: project.mail.clientId,
                    clientSecret: project.mail.clientSecret,
                    refreshToken: project.mail.refreshToken,
                    accessToken: accessToken
                },
            });

            const msg = {
                from: `"Bracket Technologies" <${project.mail.user}>`,
                to: `${toArray(recipient || recipients).map(r => r).join(", ")}`,
                subject: subject || "Test Email",
                text: text || "Hello World!",
                html: html || "<b>Hello World!</b>",
            }

            if (attachments) msg.attachments = attachments

            const info = await transporter.sendMail(msg);

            global.mail = { success: true, message: `Email sent successfully!` }

        } else global.mail = { success: false, message: `No mail api exists!` }

        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, id, ...params, req, res, __, _: global.mail })
    }
}
},{"./toArray":62,"./toAwait":63}],42:[function(require,module,exports){
const { toArray } = require("./toArray")
const { clone } = require("./clone")

const merge = (array) => {

  array = clone(array)
  if (typeof array !== "object") return array

  var type = typeof array[0]
  array.map(obj => {
    if (typeof obj !== type) type = false
  })

  if (type === false) return array[0]
  var merged = toArray(array[0]).flat()

  array.shift()

  array.map((obj) => {
    merged.push(...toArray(obj).flat())

    if (!Array.isArray(obj) && typeof obj === "object") {
      Object.entries(obj).map(([key, value]) => {

        if (merged[key]) {

          if (typeof value === "string" || typeof value === "number") {

            merged[key] = toArray(merged[key])
            merged[key].push(value)

          } else if (Array.isArray(value)) {

            merged[key].push(...value)

          } else if (typeof value === "object") {

            merged[key] = merge([value, merged[key]])

          }

        } else merged[key] = value
      })
    }
  })

  return merged
}

const override = (obj1, obj2) => { // (old, new)
  obj1 = obj1 || {}

  Object.entries(obj2).map(([key, value]) => {

    if (obj1[key]) {
      if (!Array.isArray(value) && typeof value === "object") {

        obj1[key] = override(obj1[key], value)

      } else obj1[key] = value

    } else obj1[key] = value

  })

  return obj1
}

module.exports = { merge, override }

},{"./clone":4,"./toArray":62}],43:[function(require,module,exports){
const { isArabic } = require("./isArabic")

const note = ({ note: data }) => {

  const views = window.views
  var note = views["note"]
  var type = (data.type || (data.danger && "danger") || (data.info && "info") || (data.warning && "warning") || "success").toLowerCase()
  var noteText = views["note-text"]
  var backgroundColor = type === "success" 
  ? "#2FB886" : type === "danger" 
  ? "#F66358" : type === "info"
  ? "#47A8F5" : type === "warning"
  && "#FFA92B"
  
  if (!data || !noteText) return

  clearTimeout(note["note-timer"])

  noteText.__element__.innerHTML = data.text
  // isArabic({ id: "note-text" })

  var width = note.__element__.offsetWidth
  note.__element__.style.backgroundColor = backgroundColor
  note.__element__.style.left = `calc(50% - ${width/2}px)`
  note.__element__.style.opacity = "1"
  note.__element__.style.transition = "transform .2s"
  note.__element__.style.transform = "translateY(0)"

  const myFn = () => note.__element__.style.transform = "translateY(-200%)"

  note["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = { note }

},{"./isArabic":31}],44:[function(require,module,exports){
const qr = async ({ _window, id, req, res, data, __, e, stack, lookupActions, address }) => {

    if (res && !res.headersSent) return qrServer({ _window, id, req, res, data, __, e, stack, lookupActions, address })
    
    var QRCode = require("easyqrcodejs")

    // get image
    var view = window.views[data.id], imageEl
    if (view) imageEl = view.__element__
    
    var qrcode = new QRCode(document.getElementById(data.id), data)
    var data = { message: "QR generated successfully!", data: qrcode, success: true }

    console.log("QR", data)

    require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, address, stack, req, res, __, _: data })
}

const qrServer = async ({ _window, id, req, res, data, __, e, stack, lookupActions, address }) => {

    var text = data.text || data.url
    if (data.wifi) text = wifiQrText({ data })

    var qrcode = await require('qrcode').toDataURL(text)
    var data = { message: "QR generated successfully!", data: qrcode, success: true }

    require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, address, stack, req, res, __, _: data })
}

const wifiQrText = ({ data }) => {
    
    return `WIFI:S:${data.name || data.ssid || ""};T:${data.type || "WPA"};P:${data.password || ""};;${data.url || ""}`
}

module.exports = { qr }
},{"./toAwait":63,"easyqrcodejs":121,"qrcode":126}],45:[function(require,module,exports){
const { isParam } = require("./isParam")
const { addresser } = require("./addresser")
const { toLine } = require("./toLine")
const { isCalc } = require("./isCalc")
const { kernel } = require("./kernel")
const { decode } = require("./decode")
const { toAwait } = require("./toAwait")
const { override } = require("./merge")
const { clone } = require("./clone")

const reducer = ({ _window, lookupActions = [], stack = {}, id, data: { path, value, key, object }, __, e, req, res, condition, action }) => {

    const { toValue } = require("./toValue")
    const { toParam } = require("./toParam")
    const { toAction } = require("./toAction")
    const { toApproval } = require("./toApproval")

    if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.blocked || stack.broke) return

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global
    var view = views[id] || { id, __view__:true }

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

module.exports = { reducer }
},{"./addresser":2,"./clone":4,"./decode":13,"./isCalc":32,"./isParam":36,"./kernel":39,"./merge":42,"./toAction":60,"./toApproval":61,"./toAwait":63,"./toLine":71,"./toParam":74,"./toValue":77}],46:[function(require,module,exports){
const { removeView } = require("./view")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")
const { toLine } = require("./toLine")
const { isNumber } = require("./toValue")

const remove = ({ _window, stack, data = {}, id, __, lookupActions }) => {

  const views = window.views
  var view = window.views[id]

  var path = data.path, __dataPath__ = []

  if (path) __dataPath__ = path
  else __dataPath__ = clone(view.__dataPath__) || []
  
  if (__dataPath__.length > 0 && !data.preventDefault) {

    var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1)
    var parentData = toLine({ id, data: {string} })

    // remove data
    if (Array.isArray(parentData) && parentData.length === 0) {

      var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1) + "=:"
      toLine({ id, data: {string}, __, lookupActions })

    } else {

      var string = `${view.doc}:().` + __dataPath__.join(".") + ".del()"
      toLine({ id, data: {string}, __, lookupActions })
    }
  }

  // close publics
  closePublicViews({ _window, id, __, stack, lookupActions })
  
  // no data
  if (__dataPath__.length === 0) return removeView({ id, stack, main: true }).remove()

  // reset length and __dataPath__
  var itemIndex = view.__dataPath__.length - 1
  var parent = views[view.__parent__]
  
  // update data path
  parent.__childrenRef__.slice(view.__index__ + 1).map(({ id }) => updateDataPath({ id, index: itemIndex, decrement: true }))
  removeView({ id, stack, main: true }).remove()
  console.log("REMOVE:" + id)
}

const updateDataPath = ({ id, index, decrement, increment }) => {

  const views = window.views
  var view = views[id]
  
  if (!view) return
  if (!isNumber(view.__dataPath__[index])) return

  if (decrement) view.__dataPath__[index] -= 1
  else if (increment) view.__dataPath__[index] += 1

  view.__childrenRef__.map(({ id }) => updateDataPath({ id, index, decrement, increment }) )
}

module.exports = { remove, updateDataPath }

},{"./clone":4,"./closePublicViews":5,"./toLine":71,"./toValue":77,"./view":81}],47:[function(require,module,exports){
const replaceNbsps = (str) => {
  if (typeof str !== "string") return str
    var re = new RegExp(String.fromCharCode(160), "g");
    return str.toString().replace(re, " ");
  }

  module.exports = { replaceNbsps }
},{}],48:[function(require,module,exports){
const resize = ({ id }) => {

  var view = window.views[id]
  if (!view) return
  
  if (view.__name__ !== "Input" && view.__name__ !== "Entry" && (width !== "fit-content" || height !== "fit-content")) return

  var results = dimensions({ id })

  // for width
  var width = view.style.width
  if (width === "fit-content" && view.__element__) {
    view.__element__.style.width = results.width + "px"
    view.__element__.style.minWidth = results.width + "px"
  }

  // for height
  var height = view.style.height
  if (height === "fit-content" && view.__element__) {
    view.__element__.style.height = results.height + "px"
    view.__element__.style.minHeight = results.height + "px"
  }
}

const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const dimensions = ({ id, text }) => {

  var view = window.views[id]
  if (!view) return

  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)

  var pStyle = view.style
  var pText = text || (view.__name__ === "Input" && view.__element__ && view.__element__.value) || "A"
  if (pText.includes("<") || pText.includes(">")) pText = pText.split("<").join("&lt;").split(">").join("&gt;")
  
  if (pStyle != null) lDiv.style = pStyle

  // pText = pText.split(" ").join("-")
  if (pText.charAt(pText.length - 1) === " ") pText = pText.slice(0, -1) + "-"
  while (pText.includes("  ")) { pText = pText.replace("  ", "--") }
  
  if (arabic.test(pText) && !english.test(pText)) {
    lDiv.style.fontFamily = "Noto Sans Arabic, sans-serif"
    lDiv.style.textAlign = "right"
    lDiv.classList.add("arabic")
  }

  lDiv.style.fontSize = pStyle.fontSize || "initial"
  lDiv.style.fontWeight = pStyle.fontWeight || "initial"
  lDiv.style.padding = pStyle.padding || "initial"
  lDiv.style.maxWidth = pStyle.maxWidth || "initial"
  lDiv.style.minWidth = pStyle.minWidth || "initial"
  lDiv.style.width = pStyle.width || "initial"
  lDiv.style.height = pStyle.height || "initial"
  lDiv.style.maxHeight = pStyle.maxHeight || "initial"
  lDiv.style.minHeight = pStyle.minHeight || "initial"
  lDiv.style.transform = pStyle.transform || "initial"
  lDiv.style.whiteSpace = pStyle.whiteSpace || "nowrap"
  lDiv.style.flexWrap = pStyle.flexWrap || "initial"
  lDiv.style.display = "flex"
  lDiv.style.position = "absolute"
  lDiv.style.left = "-1000px"
  lDiv.style.top = "-1000px"
  lDiv.style.opacity = "0"
  lDiv.innerHTML = pText
  
  if (pStyle.width === "100%") lDiv.style.width = (view.__element__ ? view.__element__.clientWidth : lDiv.style.width) + "px"
  var height, width = lDiv.clientWidth + 2

  if (view.__element__.tagName === "TEXTAREA") {

    height = lDiv.clientHeight
    if (lDiv.clientHeight < view.__element__.scrollHeight) height = view.__element__.scrollHeight
    if (!pText) height = lDiv.clientHeight
  }
  
  var lResult = { width, height }
  
  document.body.removeChild(lDiv)
  lDiv = null

  return lResult
}

var lengthConverter = (length) => {
  
  if (!length) return 0
  if (typeof length === "number") return length
  if (!isNaN(length) && parseFloat(length).toString().length === length.toString().length) return parseFloat(length)
  if (length.includes("rem")) return parseFloat(length) * 10
  if (length.includes("px")) return parseFloat(length)
  if (length.includes("100vw")) return window.innerWidth
  if (length.includes("100vh")) return window.innerHeight
  else return length
}

module.exports = {resize, dimensions, lengthConverter}

},{}],49:[function(require,module,exports){
const { clone } = require("./clone")
const { update } = require("./toView")

module.exports = {
  root: ({ id, _window, root = {}, stack, lookupActions, address, req, res, __ }) => {

    const views = _window ? _window.views : window.views
    const global = _window ? _window.global : window.global

    // path
    var path = root.path || (root.page.includes("/") ? root.page : global.manifest.path.join("/"))

    // page
    var page = root.page && (root.page.includes("/") ? (!root.page.split("/")[0] ? root.page.split("/")[1] : root.page.split("/")[0]) : root.page) || path.split("/")[1] || "main"

    // recheck path
    path = root.path ? path : page === "main" ? "/" : `/${page}`

    // prevs
    global.__prevPath__.push(global.manifest.path.join("/"))
    global.__prevPage__.push(global.manifest.page)

    // page & path
    global.manifest.page = page
    global.manifest.path = path.split("/")

    // params
    root.path = path
    root.page = page

    update({ _window, id, req, res, stack, lookupActions, address, data: { root, id: "root", action: "ROOT" }, __ })
  }
}
},{"./clone":4,"./toView":78}],50:[function(require,module,exports){
const route = async ({ _window, lookupActions, stack, address, id, req, __, res, e, data: { type, route = {} } }) => {

  // headers
  var headers = { ...(route.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }

  // route
  var { data } = await require("axios").post(`/route`, { server: "render", type, data: route }, { headers })
  
  // await
  require("./toAwait").toAwait({ _window, lookupActions, address, stack, id, e, req, res, _: data, __ })
}

module.exports = { route }
},{"./toAwait":63,"axios":88}],51:[function(require,module,exports){
const axios = require('axios')
const { postData } = require('./database')

module.exports = {
  save: async ({ _window, lookupActions, stack, address, id, req, res, e, __, save = {} }) => {

    var data

    // headers
    var headers = { ...(save.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }
    
    if (_window) {
      
      data = await postData({ _window, req, res, save })

    } else {

      var response = await axios.post(`/`, { server: "database", type: "save", data: save }, { headers })

      data = response.data
    }

    // console.log("SAVE", (new Date()).getTime() - headers.timestamp, save.collection, data)
    
    // await
    require("./toAwait").toAwait({ _window, lookupActions, stack, id, address, e, req, res, _: data, __ })
  }
}
},{"./database":12,"./toAwait":63,"axios":88}],52:[function(require,module,exports){
module.exports = {
  search: async ({ _window, lookupActions, stack, id, req, res, e, __, data: search = {}, address }) => {
    
    var data

    // headers
    var headers = { ...(search.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }
    
    if (_window) {

      data = await require('./database').getData({ _window, req, res, search })

    } else {

      var response = await require('axios').post(`/`, { server: "database", type: "search", data: search }, { headers })

      data = response.data
    }

    // await params
    require("./toAwait").toAwait({ _window, lookupActions, stack, id, e, address, req, res, _: data, __ })
  }
}
},{"./database":12,"./toAwait":63,"axios":88}],53:[function(require,module,exports){
const { decode } = require("./decode")
const { toLine } = require("./toLine")
const { toCode } = require("./toCode")

const searchParams = ({ _window, lookupActions, stack, req, res, id, e, __, string, object }) => {

    const global = _window ? _window.global : window.global

    if (string.charAt(0) === "@" && string.length === 6) string = global.__refs__[string].data

    string = decode({ _window, string })
    string = string.replaceAll("field:", "field=")
    
    // case: collection=value;field:[key1=value1;key2>=value2;key3<=value3;key4.in():[value4];key5.inc():[value6]]

    var i = 1, stringList = string.split("field=")
    while (stringList[i]) {

        stringList[i] = toCode({ _window, string: stringList[i] })
        var code = stringList[i].slice(0, 6)
        global.__refs__[code].type = "text"
        i++
    }

    string = stringList.join("field=")
    
    var data = toLine({ _window, lookupActions, stack, req, res, id, e, __, data: { string }, object }).data

    if (!data.field || typeof data.field !== "string") return data

    // convert operators to texts
    var fields = data.field
    
    fields = fields.replaceAll("<=", ".lessorequal=")
    fields = fields.replaceAll(">=", ".greaterorequal=")
    fields = fields.replaceAll("!=", ".notequal=")
    fields = fields.replaceAll("<", ".less=")
    fields = fields.replaceAll(">", ".greater=")
    fields = fields.replaceAll("in():", "in=")
    fields = fields.replaceAll("inc():", "contains=")

    var string = ""
    fields.split(";").map(field => {
        if (field.charAt(0) === "!" && field.includes(".in=")) {

            field = field.slice(1)
            field = fields.replace(".in=", ".not-in=")

        } else if (field.charAt(0) === "!") {

            field = field.slice(1)
            field = field + "=null"
        }
        string += field + ";"
    })

    string = string.slice(0, -1)

    data.field = toLine({ _window, lookupActions, stack, req, res, id, e, __, data: { string, action: "toParam" }, object }).data

    return data
}

module.exports = { searchParams }
},{"./decode":13,"./toCode":66,"./toLine":71}],54:[function(require,module,exports){
const {clone} = require("./clone")
const { kernel } = require("./kernel")

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

module.exports = { setData }

},{"./clone":4,"./kernel":39}],55:[function(require,module,exports){
const setPosition = ({ position = {}, id, e }) => {

  const views = window.views
  var align = position.align || "center"
  var element = views[position.id || id].__element__
  var mousePos = position.positioner === "mouse"
  var fin = element.getElementsByClassName("fin")[0]
  var positioner = position.positioner || id
  
  if (!views[positioner] && !mousePos) return

  var topPos, bottomPos, rightPos, leftPos, heightPos, widthPos

  if (mousePos) {

    topPos = e.clientY + window.scrollY
    bottomPos = e.clientY + window.scrollY
    rightPos = e.clientX + window.scrollX
    leftPos = e.clientX + window.scrollX
    heightPos = 0
    widthPos = 0
    
  } else {

    positioner = views[positioner].__element__
    topPos = positioner.getBoundingClientRect().top
    bottomPos = positioner.getBoundingClientRect().bottom
    rightPos = positioner.getBoundingClientRect().right
    leftPos = positioner.getBoundingClientRect().left
    heightPos = positioner.clientHeight
    widthPos = positioner.clientWidth

    // set height to fit content
    element.style.height = views[element.id].style.height
  }

  var top 
  var left 
  var bottom 
  var distance 
  var placement
  var height = element.offsetHeight
  var width = element.offsetWidth

  if (position.width === "inherit") {

    width = positioner.offsetWidth
    element.style.width = width + "px"

  } else if (position.height === "inherit") {

    height = positioner.offsetHeight
    element.style.height = height + "px"
  }
  
  placement = position.placement || "bottom"
  distance = parseFloat(element.distance || position.distance || 10)
  
  if (placement === "right") {

    left = rightPos + distance + (position.gapX || 0)
    top = topPos + heightPos / 2 - height / 2 + (position.gapY || 0)
      
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "-0.5rem"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0 0 0.4rem"
    }

  } else if (placement === "left") {
    
    left = leftPos - distance - width + (position.gapX || 0)
    top = topPos + heightPos / 2 - height / 2 + (position.gapY || 0)
    
    if (fin) {
      fin.style.right = "-0.5rem"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }

  } else if (placement === "top") {

    top = topPos - height - distance + (position.gapY || 0)
    left = leftPos + widthPos / 2 - width / 2 + (position.gapX || 0)

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "-0.5rem"
      fin.style.borderRadius = "0 0 0.4rem 0"
    }

  } else if (placement === "bottom") {

    top = topPos + heightPos + distance + (position.gapY || 0)
    left = leftPos + widthPos / 2 - width / 2 + (position.gapX || 0)
    
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "-0.5rem"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }
  }

  // fix height overflow
  bottom = top + height
  if (mousePos && window.scrollY) bottom = top - window.scrollY

  if (top - 10 < 0) {

    if (fin) fin.style.top = height / 2 - 5 - 10 + top + "px"
    
    element.style.top = 10 + 'px'
    
    if (20 + height >= window.innerHeight)
    element.style.height = window.innerHeight - 20 + "px"

  } else if (bottom + 10 > window.innerHeight) {

    if (fin) fin.style.top = height / 2 - (fin ? 5 : 0) + 10 + bottom - window.innerHeight + "px"
    
    element.style.top = (window.innerHeight - 10 - height) + 'px'
    
    if (window.innerHeight - 20 - height <= 0) {
      element.style.top = 10 + "px"
      element.style.height = window.innerHeight - 20 + "px"
    }

  } else element.style.top = top + 'px'

  // fix width overflow
  right = left + width
  var windowWidth = window.innerWidth
  var bodyHeight = document.body.offsetHeight
  if (bodyHeight > window.innerHeight) windowWidth -= 12

  if (mousePos && window.scrollX) right = left - window.scrollX
  
  if (left - 10 < 0) {

    if (fin) fin.style.left = width / 2 - 5 - 10 + left + "px"

    element.style.left = 10 + 'px'
    
    if (20 + width >= windowWidth)
    element.style.width = windowWidth - 20 + "px"

  } else if (right + 10 > windowWidth) {

    if (fin) fin.style.left = width / 2 - (fin ? 5 : 0) + 10 + right - windowWidth + "px"
    
    element.style.left = windowWidth - 10 - width + 'px'
    
    if (windowWidth - 20 - width <= 0) {
      element.style.left = 10 + "px"
      element.style.width = windowWidth - 20 + "px"
    }

  } else element.style.left = left + 'px'
  
  // align
  if (align === "left") element.style.left = leftPos + (position.gapX || 0) + "px"
  else if (align === "top") element.style.top = topPos - height + heightPos + (position.gapY || 0) + "px"
  else if (align === "bottom") element.style.bottom = bottomPos + (position.gapY || 0) + "px"
  else if (align === "right") element.style.left = leftPos - width + widthPos + (position.gapX || 0) + "px"
  
  if (fin) fin.style.left = "unset"
}

module.exports = {setPosition}

},{}],56:[function(require,module,exports){
(function (global){(function (){
const { reducer } = require("./reducer")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const sort = ({ _window, sort = {}, id, e, lookupActions, __, stack }) => {

  var view = _window ? _window.views[id] : window.views[id]
  if (!view) return
  
  // data
  var Data = sort.doc || view.doc
  var options = global[`${Data}-options`] = global[`${Data}-options`] || {}
  var data = sort.data || global[Data]
  var sortBy = options.sortBy || view.sortBy || sort.sortBy || sort.by || "descending"

  if (sort.ascending) sortBy = "ascending"
  else if (sort.descending) sortBy = "descending"
  else if (sort.sortBy || sort.sortby || sort.by) sortBy = sort.sortBy || sort.sortby || sort.by
  options.sortBy = view.sortBy = sortBy

  // path
  var path = sort.path
  if (typeof sort.path === "string") path = toArray(toCode({ _window, id, string: path, e }).split("."))
  if (!path) path = []
  var isDate = false
  
  if (!Array.isArray(data) && typeof data === "object") data = Object.values(data)

  data.sort((a, b) => {
    
    a = reducer({ _window, id, data: { path, object: a }, e, lookupActions, __, stack }) || "!"
    
    if (a !== undefined) a = a.toString()

    b = reducer({ _window, id, data: { path, object: b }, e, lookupActions, __, stack }) || "!"

    if (b !== undefined) b = b.toString()

    if ((!isNaN(a) && b === "!") || (!isNaN(b) && a === "!")) {
      if (a === "!") a = 0
      else if (b === "!") b = 0
    }

    if ((!isNaN(a) && isNaN(b)) || (!isNaN(b) && isNaN(a))) {
      a = a.toString()
      b = b.toString()
    }
    
    if (sortBy === "descending") {
      if (isDate) {
        if (b.year === a.year) {
          if (b.month === a.month) {
            if (a.day === b.day) return 0
            else if (a.day > b.day) return 1
            else return -1
          } else {
            if (a.month > b.month) return 1
            else return -1
          }
        } else {
          if (a.year > b.year) return 1
          else return -1
        }
      }

      if (!isNaN(a) && !isNaN(b)) return b - a

      if (a < b) return -1
      return a > b ? 1 : 0
    } else {
      if (isDate) {
        if (b.year === a.year) {
          if (b.month === a.month) {
            if (a.day === b.day) return 0
            else if (a.day < b.day) return 1
            else return -1
          } else {
            if (a.month < b.month) return 1
            else return -1
          }
        } else {
          if (a.year < b.year) return 1
          else return -1
        }
      }
      
      if (!isNaN(a) && !isNaN(b)) return a - b

      if (b < a) return -1
      return b > a ? 1 : 0
    }
  })
  
  // sort by
  if (sort.reversable || sort.reverse || sort.flip || sort.flipable) options.sortBy = sortBy === "ascending" ? "descending" : "ascending"
  if (Data) global[Data] = data
  return data
}

module.exports = {sort}
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./reducer":45,"./toArray":62,"./toCode":66}],57:[function(require,module,exports){
const { decode } = require("./decode")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const openStack = ({ _window, id: viewID, string = "", nextAddress, headStack, ...data }) => {

  var stack = {
    ...data,
    print: false,
    id: generate(),
    viewID,
    terminated: false,
    broke: false,
    returned: false,
    interpreting: true,
    string: string ? decode({ _window, string }) : "",
    executionStartTime: (new Date()).getTime(),
    addresses: toArray(nextAddress),
    logs: [],
    returns: []
  }

  if (headStack) stack.headStackID = headStack.id

  stack.logs.push(`# Status TYPE ID Index Action => HeadID HeadIndex HeadAction`)
  stack.logs.push(`1 Start STACK ${stack.id} ${stack.event.toUpperCase()} ${stack.string}`)

  const global = _window ? _window.global : window.global
  global.__stacks__[stack.id] = stack

  return stack
}

const clearStack = ({ stack }) => {

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack.event.toUpperCase())

  stack.terminated = true
  stack.addresses = []
}

const endStack = ({ _window, stack, end }) => {

  if (end && stack.addresses.length === 0) {

    var logs = `%cSTACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.event}`
    stack.logs.push(`${stack.logs.length} End STACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.id} ${stack.event}`)

    // remove stack
    delete (_window ? _window.global : window.global).__stacks__[stack.id]

    // print stack
    stack.print && !stack.printed && console.log(logs, "color: blue", stack.logs)
    stack.printed = true
  }
}

module.exports = { openStack, clearStack, endStack }
},{"./decode":13,"./generate":24,"./toArray":62}],58:[function(require,module,exports){
const { defaultInputHandler } = require("./defaultInputHandler")
const { addEventListener } = require("./event")
const { toArray } = require("./toArray")

const starter = ({ lookupActions, stack, __, address, id }) => {
  
  var view = window.views[id]
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

  //view.__status__ = "Mounted"
  
  // events
  toArray(view.__controls__).map(data => addEventListener({ lookupActions, stack, address, __, id, ...data, event: data.event }))
}

module.exports = { starter }
},{"../event/event":84,"./defaultInputHandler":15,"./event":18,"./toArray":62}],59:[function(require,module,exports){
(function (Buffer){(function (){
const fs = require("fs")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
var _window = { global: {}, views: {} }
const mime = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  png: "image/png",
  svg: "image/svg+xml",
  json: "application/json",
  woff: "application/font-woff",
  woff2: "font/woff2",
  js: "application/javascript",
  ico: "image/x-icon"
}

const storage = async ({ req, res }) => {

  var upload = req.body.data
  var data = await storeFile({ req, upload })
  res.send(data)
}

const storeFile = async ({ req, upload }) => {

  var db = req.db.firebaseDB
  var storage = req.storage.firebaseStorage
  var file = upload.file
  var data = upload.data, url
  
  // convert base64 to buffer
  var buffer = Buffer.from(file, "base64")
  
  // 
  upload.doc = upload.doc || generate({length: 20})

  var collection = `storage-${req.headers["project"]}`
  
  await storage.bucket().file(`${collection}/${upload.doc}`).save(buffer, { contentType: data.type }, async () => {
    url = await storage.bucket().file(`${collection}/${upload.doc}`).getSignedUrl({ action: 'read', expires: '03-09-3000' })
  })
  
  // post api
  data = {
    ...data,
    url: url[0],
    id: upload.doc,
    name: data.name,
    description: data.description || "",
    type: data.type,
    tags: data.tags || [],
    title: data.title || data.type.toUpperCase(),
    "creationDate": parseInt(req.headers.timestamp)
  }
  
  await db.collection(collection).doc(upload.doc).set(data).then(() => {

    success = true
    message = `Document saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return ({ data, success, message })
}

const deleteFile = async ({ req, res }) => {
  
  var db = req.db.firebaseDB
  var storage = req.storage.firebaseStorage
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, data: string, id: "" })
  var erase = params.erase || {}

  var collection = `storage-${req.headers["project"]}`

  await storage.bucket().file(`${collection}/${erase.doc}`).delete()

  await db.collection(collection).doc(erase.doc.toString()).delete().then(() => {

    success = true,
    message = `Document erased successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ success, message })
}

module.exports = { storeFile, deleteFile, storage }
}).call(this)}).call(this,require("buffer").Buffer)
},{"./generate":24,"./toArray":62,"buffer":119,"fs":118}],60:[function(require,module,exports){
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { addresser } = require("./addresser")
// const actions = require("./actions.json")
const { toAwait } = require("./toAwait")

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

module.exports = { toAction }
},{"./actions.json":1,"./addresser":2,"./clone":4,"./route":50,"./toArray":62,"./toAwait":63}],61:[function(require,module,exports){
const { decode } = require("./decode")
const { isEqual } = require("./isEqual")

const toApproval = ({ _window, lookupActions, stack, e, data: string, id, __, req, res, object }) => {

  const { toAction } = require("./toAction")
  const { toValue } = require("./toValue")

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

module.exports = { toApproval }

},{"./decode":13,"./isEqual":34,"./toAction":60,"./toValue":77}],62:[function(require,module,exports){
const toArray = (data) => {
  return data !== undefined ? (Array.isArray(data) ? data : [data]) : [];
}

module.exports = {toArray}

},{}],63:[function(require,module,exports){
const { printAddress } = require("./addresser")
const { clone } = require("./clone")
const { toLine } = require("./toLine")
const { endStack } = require("./stack")
const { logger } = require("./logger")

const toAwait = ({ _window, req, res, address = {}, addressID, lookupActions, stack, id, e, _, __, action }) => {

  const { toView, toHTML, documenter, update } = require("./toView")

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

module.exports = { toAwait }
},{"./addresser":2,"./clone":4,"./logger":40,"./stack":57,"./toLine":71,"./toView":78}],64:[function(require,module,exports){
module.exports = {
    toCSV: (file = {}) => {

        var data = file.data
        var fileName = file.name
        var CSV = ''
        
        //Set Report title in first row or line

        // This condition will generate the Label/Header
        var row = ""
        var keys = file.fields || []

        // get all keys
        if (keys.length === 0)
        data.slice(0, 5).map(data => {
            Object.keys(data).map(key => {
                if (!keys.includes(key)) keys.push(key)
            })
        })

        //This loop will extract the label from 1st index of on array
        keys.map(key => row += key + ',')

        row = row.slice(0, -1)

        // line break
        CSV += row + '\n'

        // extract each row
        data.map(d => {
            var row = ""

            // extract each column and convert it in string comma-separated
            keys.map(k => { 
                if (d[k] !== undefined) row += `${d[k]},`
                else row += ','
            })

            row = row.slice(0, -1)

            //add a line break after each row
            CSV += row + '\n'
        })

        if (CSV == '') {
            alert("Invalid data")
            return
        }

        var blob = new Blob([CSV], { type: 'text/csv;charset=utf-8;' })

        if (navigator.msSaveBlob) { // IE 10+

            navigator.msSaveBlob(blob, fileName)

        } else {

            var link = document.createElement("a")
            if (link.download !== undefined) { // feature detection

                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob)
                link.setAttribute("href", url)
                link.style = "visibility:hidden"
                link.download = fileName + ".csv"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

            }
        }
    }
}
},{}],65:[function(require,module,exports){
module.exports = {
    toClock: ({ timestamp, day, hr, min, sec }) => {

        if (!timestamp) return "00:00"
        var days_ = Math.floor(timestamp / 86400000) + ""
        var _days = timestamp % 86400000
        var hrs_ = Math.floor(_days / 3600000) + ""
        var _hrs = _days % 3600000
        var mins_ = Math.floor(_hrs / 60000) + ""
        var _mins = _hrs % 60000
        var secs_ = Math.floor(_mins / 1000) + ""

        if (days_.length === 1) days_ = "0" + days_
        if (hrs_.length === 1) hrs_ = "0" + hrs_
        if (mins_.length === 1) mins_ = "0" + mins_
        if (secs_.length === 1) secs_ = "0" + secs_

        return (day ? days_ + ":" : "") + (hr ? hrs_ + ":" : "") + (min ? mins_ : "") + (sec ? ":" + secs_ : "")
    }
}
},{}],66:[function(require,module,exports){
const { generate } = require("./generate")
const { replaceNbsps } = require("./replaceNbsps")

const toCode = ({ _window, id, string, e, start = "[", end = "]", subCoding }) => {

  if (typeof string !== "string") return string
  const global = _window ? _window.global : window.global

  // text
  if (start === "'") end = "'"
  
  // do not encode []
  if (!subCoding) string = replaceNbsps(string.replaceAll("[]", "__map__"))

  // init
  var type = start === "'" ? "text" : "code"
  var keys = string.split(start)

  if (keys[1] !== undefined) {

    var key = `@${generate()}`
    var subKey = keys[1].split(end)

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {

      keys[1] += `${start}${keys[2]}`
      if (keys[1].includes(end) && keys[2]) {
        keys[1] = toCode({ _window, id, string: keys[1], e, start, subCoding: true })
      }
      keys.splice(2, 1)
      subKey = keys[1].split(end)
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) return keys.join(start)//.replaceAll("__map__", "[]")

    // text
    if (subKey[0].split("'").length > 1) subKey[0] = toCode({ _window, id, string: subKey[0], start: "'" })

    // reference
    global.__refs__[key] = { id, data: subKey[0].replaceAll("__map__", "[]"), type }

    var value = key
    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join(start) ? `${start}${keys.join(start)}` : ""

    string = `${before}${value}${subKey.join(end)}${after}`
  }

  if (string.split(start)[1] !== undefined && string.split(start).slice(1).join(start).length > 0) string = toCode({ _window, id, string, e, start, subCoding: true })

  if (!subCoding) string = string.replaceAll("__map__", "[]")

  return string
}

module.exports = { toCode }
},{"./generate":24,"./replaceNbsps":47}],67:[function(require,module,exports){
const {generate} = require("./generate")
const {toArray} = require("./toArray")

const toComponent = (obj) => {
  // class
  obj.class = obj.class || ""

  // id
  obj.id = obj.id || generate()

  // style
  obj.style = obj.style || {}

  // controls
  obj.controls = toArray(obj.controls)

  // children
  obj.children = toArray(obj.children)

  // model
  if (!obj.model || obj.classic) obj.model = "classic"
  if (obj.featured) obj.model = "featured"

  // component
  obj.component = true

  return obj
}

module.exports = {toComponent}

},{"./generate":24,"./toArray":62}],68:[function(require,module,exports){
const { toArray } = require("./toArray")

const toEvent = ({ _window, id, string, __, lookupActions }) => {

  var view = _window ? _window.views[id] : window.views[id]
  toArray(view.__controls__).push({ event: string, __, lookupActions })
  
  return "__event__"
}

module.exports = { toEvent }
},{"./toArray":62}],69:[function(require,module,exports){
// const XLSX = require("xlsx")

module.exports = {
    toExcel: (file = {}) => {

        var data = file.data || file.json
        var fileName = file.name
        var myObject = []

        // This condition will generate the Label/Header
        var keys = file.fields || file.keys || file.headers || []
        if (keys.length > 0) data.map((data, i) => {
            myObject[i] = {}
            keys.map(key => myObject[i][key] = data[key])
        })
        else myObject = data

        var myFile = `${fileName}.xlsx`
        var myWorkSheet = XLSX.utils.json_to_sheet(myObject)
        var myWorkBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "Sheet")
        XLSX.writeFile(myWorkBook, myFile)
    }
}
},{}],70:[function(require,module,exports){
module.exports = {
    toFirebaseOperator: (string) => {
        if (!string || string === 'equal' || string === 'equals' || string === 'equalsTo' || string === 'equalTo' || string === 'is') return '=='
        if (string === 'notEqual' || string === 'notequal' || string === 'isnot') return '!='
        if (string === 'greaterOrEqual' || string === 'greaterorequal') return '>='
        if (string === 'lessOrEqual' || string === 'lessorequal') return '<='
        if (string === 'less' || string === 'lessthan' || string === 'lessThan') return '<'
        if (string === 'greater' || string === 'greaterthan' || string === 'greaterThan') return '>'
        if (string === 'contains') return 'array-contains'
        if (string === 'containsany') return 'array-contains-any'
        if (string === 'doesnotContain' || string === 'doesnotcontain') return 'array-contains-any'
        else return string
    }
}
},{}],71:[function(require,module,exports){
const { toCode } = require("./toCode")
const { generate } = require("./generate")
const { isCondition } = require("./isCondition")
const { executable } = require("./executable")
const { clone } = require("./clone")
const { isEvent } = require("./isEvent")
const { toEvent } = require("./toEvent")
const { isParam } = require("./isParam")

const toLine = ({ _window, lookupActions, stack, address = {}, id, e, data: { string, dblExecute, index: i = 0, splitter = "?" }, req, res, __, mount, condition, object, action }) => {

    require("./toParam")
    require("./toValue")
    require("./toApproval")
    
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
        require("./toAwait").toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: returnForWaitActionExists ? data.data : undefined })

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

    var approved = require("./toApproval").toApproval({ _window, data: conditions || "", id, e, req, res, __, stack, lookupActions, object })

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
    
    data = require(`./${action}`)[action]({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object })

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

module.exports = { toLine }
},{"./clone":4,"./executable":20,"./generate":24,"./isCondition":33,"./isEvent":35,"./isParam":36,"./toApproval":61,"./toAwait":63,"./toCode":66,"./toEvent":68,"./toParam":74,"./toValue":77}],72:[function(require,module,exports){
const { isNumber } = require("./toValue")
const toNumber = (string) => {

  if (!string) return string
  if (typeof string === 'number') return string
  if (isNumber(string)) return parseFloat(string)
  return string
}

module.exports = { toNumber }

},{"./toValue":77}],73:[function(require,module,exports){
module.exports = {
    toOperator: (string) => {
        if (!string || string === 'equal' || string === 'eq') return '=='
        if (string === 'notequal' || string === 'neq') return '!='
        if (string === 'greaterorequal' || string === 'gte') return '>='
        if (string === 'lessorequal' || string === 'lte') return '<='
        if (string === 'less' || string === 'lt') return '<'
        if (string === 'greater' || string === 'gt') return '>'
        if (string === 'contains' || string === "inc") return 'inc'
        if (string === 'containsall' || string === "incall") return 'inc'
        if (string === 'doesnotcontain' || string === "doesnotinclude") return 'notinc'
        else return string
    }
}

// in, notin, 
},{}],74:[function(require,module,exports){
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { replaceNbsps } = require("./replaceNbsps")
const { isCondition } = require("./isCondition")
const { toLine } = require("./toLine")
const { isEvent } = require("./isEvent")
const { override } = require("./merge")
const { toEvent } = require("./toEvent")
const { kernel } = require("./kernel")
const { decode } = require("./decode")

const toParam = ({ _window, lookupActions, stack = {}, data: string, e, id, req, res, mount, object, __, condition }) => {

  const { toAction } = require("./toAction")
  const { toApproval } = require("./toApproval")

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  var view = views[id] || { id, __view__:true }

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

const sleep = (milliseconds) => {

  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = { toParam }
},{"./clone":4,"./decode":13,"./generate":24,"./isCondition":33,"./isEvent":35,"./kernel":39,"./merge":42,"./reducer":45,"./replaceNbsps":47,"./toAction":60,"./toApproval":61,"./toCode":66,"./toEvent":68,"./toLine":71,"./toValue":77}],75:[function(require,module,exports){
module.exports = {
    toPdf: async (options) => {

        var blob = new Blob([`<html><head><meta charset="UTF-8"></head><body>${options.html}</body></html>`], { type: 'text/html' })
 
        //Check the Browser type and download the File.
        var isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob, options.name);
        } else {
            var url = window.URL || window.webkitURL;
            link = url.createObjectURL(blob);
            
            var a = document.createElement("a");
            a.setAttribute("download", options.name);
            a.setAttribute("href", link);
            /*document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);*/
            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            a.dispatchEvent(evt);
        }
    }
}
},{}],76:[function(require,module,exports){
// arabic
var daysAr = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
var monthsAr = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"]
var toArabicNum = (string) => string.replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])

// english
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var simpleDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var simpleMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//Both Persian and Arabic to English digits.
var IntoEn = (string) => string.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, d => ((c=d.charCodeAt()) > 1775 ? c - 1776 : c - 1632))

module.exports = {
    toSimplifiedDate: ({ timestamp, lang, simplified, time }) => {

        timestamp = parseInt(timestamp)
        var date = new Date(timestamp)

        var dayofWeek = date.getDay()
        var dayofMonth = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()
        var hours = date.getHours()
        var mins = date.getMinutes()
        var secs = date.getSeconds()

        if (hours.toString().length === 1) hours = "0" + hours
        if (mins.toString().length === 1) mins = "0" + mins
        if (secs.toString().length === 1) secs = "0" + secs

        var simplifiedDate

        if (lang === "ar") simplifiedDate = daysAr[dayofWeek] + " " + dayofMonth + " " + monthsAr[month] + " " + year
        
        else if (lang === "en" && simplified) simplifiedDate = simpleDays[dayofWeek] + " " + dayofMonth + " " + simpleMonths[month] + " " + year
        
        else if (lang === "en" && !simplified) simplifiedDate = days[dayofWeek] + " " + dayofMonth + " " + months[month] + " " + year

        if (time) simplifiedDate += " | " + hours + ":" + mins + ":" + secs

        if (lang === "ar") simplifiedDate = toArabicNum(simplifiedDate)

        return simplifiedDate
    }
}
},{}],77:[function(require,module,exports){
const { decode } = require("./decode");
const { executable } = require("./executable");
const { generate } = require("./generate")
const { isParam } = require("./isParam");
const { toLine } = require("./toLine");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, lookupActions = [], stack = {}, data: value, __, id, e, req, res, object, mount, condition, isValue }) => {

  const { reducer } = require("./reducer")
  const { toParam } = require("./toParam")
  
  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global
  
  if (!value) return value

  // coded
  if (value.charAt(0) === "@" && value.length == 6 && global.__refs__[value].type === "text") return global.__refs__[value].data
  if (value.charAt(0) === "@" && value.length == 6) value = global.__refs__[value].data

  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, stack, e, data: value, __, object, mount: !isValue && mount, condition })

  // value?condition?value
  if (value.split("?").length > 1) return toLine({ _window, lookupActions, stack, id, e, data: {string: value}, req, res, mount, __, condition, object, action: "toValue" }).data

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
  else if (value === "mouseentered()") return global.__mouseentered__
  else if (value === "mouseleaved()") return global.__mouseleaved__
  else if (value === "focused()") return global.__focused__
  else if (value === "today()") return new Date()
  else if (value === "null") return null
  else if (value.charAt(0) === "_" && !value.split("_").find(i => i !== "_" && i !== "")) return __[value.split("_").length - 2]
  else if (value === "[]") return ({})
  else if (value === ":[]") return ([{}])
  else if (value === " ") return value
  else if (value === ":") return ([])
  else if (value.charAt(0) === ":") return value.split(":").slice(1).map(item =>  toValue({ req, res, _window, id, stack, lookupActions, __, e, data: item })) // :item1:item2

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

module.exports = { toValue, calcSubs, calcDivision, calcModulo, emptySpaces, isNumber }

},{"./decode":13,"./executable":20,"./generate":24,"./isParam":36,"./reducer":45,"./toLine":71,"./toParam":74}],78:[function(require,module,exports){
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { toValue, isNumber } = require("./toValue")
const { toArray } = require("./toArray")
const { override } = require("./merge")
const { toLine } = require("./toLine")
const { initView, removeView, getViewParams } = require("./view")
const { addresser, printAddress } = require("./addresser")
const { toAwait } = require("./toAwait")
const { kernel } = require("./kernel")
const { isParam } = require("./isParam")
const { executable } = require("./executable")
const { logger } = require("./logger")
const { replaceNbsps } = require("./replaceNbsps")
const { colorize } = require("./colorize")
const { getJsonFiles } = require("./jsonFiles")
const { toParam } = require("./toParam")
const { closePublicViews } = require("./closePublicViews")
const { starter } = require("./starter")
const cssStyleKeyNames = require("./cssStyleKeyNames")
const Input = require("../view/Input")

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
    if (!view.view) return removeView({ _window, lookupActions, stack, id, address, __ })

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
    if (!view.__name__ || typeof view.__name__ !== "string" || view.__name__.charAt(0) === "#") return removeView({ _window, id, stack, address })
    else views[id] = view

    // executable view name
    if (executable({ _window, string: view.__name__ })) {
      toValue({ _window, id, req, res, data: view.__name__, lookupActions, __, stack })
      view.__name__ = "Action"
    }

    // interpret subparams
    if (subParams) {

      var { data = {}, conditionsNotApplied } = toLine({ _window, lookupActions, stack, id, data: { string: subParams }, req, res, __ })
      if (conditionsNotApplied) return removeView({ _window, id, stack, address })
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
    if (!approved) return removeView({ _window, id, stack, address })
    
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
  if (!data.preventDefault && (data.doc || data.path)) data.mount = true

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
    if (!preventDefault && mount) params = { ...params, doc, __dataPath__: [...__dataPath__, key] }

    views[params.id] = { __view__: true, __loop__: true, __mount__: mount, ...clone(view), ...myparams, ...params }

    address = addresser({ _window, id: params.id, stack, nextAddress: address, type: "function", function: "toView", renderer: true, blockable: false, __: [values[key], ...__], lookupActions, data: { view: views[params.id] } }).address

  })//.reverse().map(address => !stack.addresses[0].asynchronous && toView({ _window, lookupActions, stack, req, res, address, ...(address.params || {}), data: address.data, __ }))

  toAwait({ _window, lookupActions, stack, address, id, req, res, __ })
  removeView({ _window, id, stack, address })
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
      __lookupViewActions__
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
    if (!data.insert && parent.__rendered__) parent.__childrenRef__.filter(({ childIndex }) => childIndex === __childIndex__).map(({ id }) => elements.push(removeView({ _window, id, stack, main: true, insert: data.insert })))
    else if (!parent.__rendered__) removeView({ _window, id: data.id, stack, main: true })

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

      idLists.map(id => starter({ _window, lookupActions, address, stack, __, id }))

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

module.exports = { toView, toHTML, documenter, update }
},{"../view/Input":156,"./addresser":2,"./clone":4,"./closePublicViews":5,"./colorize":6,"./cssStyleKeyNames":9,"./executable":20,"./generate":24,"./isParam":36,"./jsonFiles":37,"./kernel":39,"./logger":40,"./merge":42,"./replaceNbsps":47,"./search":52,"./starter":58,"./toApproval":61,"./toArray":62,"./toAwait":63,"./toCode":66,"./toLine":71,"./toParam":74,"./toValue":77,"./view":81}],79:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { storeFile } = require("./storage")

module.exports = async ({ _window, lookupActions, stack, address, id, req, res, e, __, upload, ...params }) => {

  var promises = []
  var alldata = toArray(upload.data || []), uploads = []
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])

  // headers
  var headers = { ...(upload.headers || {}), timestamp: (new Date()).getTime(), timezone: Math.abs((new Date()).getTimezoneOffset()), "Access-Control-Allow-Headers": "Access-Control-Allow-Headers" }

  promises.push(...([...files]).map(async (f, i) => {

    if (typeof f === "string") f = { file: f, type }

    var upload = {}
    var data = alldata[i] || {}
    var file = await readFile(f)

    upload.doc = f.id || f.doc || docs[i] || generate({ length: 20 })
    data.name = f.name || data.name || generate({ length: 20 })

    // get file type
    var type = data.type || f.type

    // get regex exp
    var regex = new RegExp(`^data:${type};base64,`, "gi")
    file = file.replace(regex, "")

    // data
    upload.data = clone(data)
    upload.file = file

    if (_window) {

      var data = await storeFile({ req, upload })

      uploads.push(data)
      return data

    } else {

      var { data } = await require("axios").post(`/`, { server: "storage", type: "store", data: upload }, { headers })

      uploads.push(data)
      return data
    }
  }))

  await Promise.all(promises)

  // await
  require("./toAwait").toAwait({ _window, lookupActions, stack, address, req, res, id, e, __, _: uploads.length === 1 ? uploads[0] : uploads, ...params })
}

const readFile = (file) => new Promise(res => {

  var myFile = file.file || file.url
  if (typeof myFile === "string" && myFile.slice(0, 5) === "data:") res(myFile)
  else if (typeof file === "object" && file["readAsDataURL"]) res()
  else {
    let myReader = new FileReader()
    myReader.onloadend = () => res(myReader.result)
    myReader.readAsDataURL(file)
  }
})
},{"./clone":4,"./generate":24,"./storage":59,"./toArray":62,"./toAwait":63,"axios":88}],80:[function(require,module,exports){
'use strict';

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
}

const vcard = ({ res, data: { info, firstName, middleName, lastName, org, title, img, phone, address, email } }) => {

    if (res && !res.headersSent) return vcardServer({ res, data })
    let vcard = `BEGIN:VCARD
    VERSION:3.0
    N:${info}
    FN:${firstName}
    MN:${middleName}
    LN:${lastName}
    ORG:${org}
    TITLE:${title}
    PHOTO;TYPE=JPEG;ENCODING=b:[${img}]
    TEL;TYPE=WORK,VOICE:${phone}
    ADR;TYPE=WORK,PREF:;;${address}
    EMAIL:${email}
    REV:${new Date().toISOString()}
    END:VCARD`;

    downloadToFile(vcard, 'vcard.vcf', 'text/vcard');
}

const vcardServer = ({ res, data }) => {

    if (data.firstName && data.lastName && data.workPhone) {

        // create a new vCard
        const vCard = require("vcards-js")();

        vCard.firstName = data.firstName || "";
        vCard.middleName = data.middleName || "";
        vCard.lastName = data.lastName || "";
        vCard.organization = data.organization || "";
        if (data.photo) vCard.photo.attachFromUrl(data.photo)
        if (data.logo) vCard.logo.attachFromUrl(data.logo)

        // dd/mm/yyyy
        if (data.birthday && data.birthday.split("/")[0] !== undefined && data.birthday.split("/")[1] !== undefined && data.birthday.split("/")[2] !== undefined)
            vCard.birthday = new Date(parseInt(data.birthday.split("/")[2]), parseInt(data.birthday.split("/")[1] - 1), parseInt(data.birthday.split("/")[0]));


        delete data.firstName
        delete data.lastName
        delete data.middleName
        delete data.photo
        delete data.logo
        delete data.birthday

        Object.entries(data).map(([key, value]) => {
            vCard[key] = value
        })

        res.setHeader('Content-Type', `text/vcard; name="${(data.firstName || "") + " " + (data.lastName || "")}.vcf"`);
        res.setHeader('Content-Disposition', `inline; filename="${(data.firstName || "") + " " + (data.lastName || "")}.vcf"`);

        res.end(vCard.getFormattedString())
    }
}

module.exports = { vcard }
},{"vcards-js":153}],81:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")

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
    
    var { id, doc, data, view, children, __lookupViewActions__, __element__, __dataPath__, __childrenRef__, __index__,
        __viewPath__, __customViewPath__, __indexing__, __childIndex__, __initialIndex__, __customView__, __htmlStyles__,
        __parent__, __controls__, __status__, __rendered__, __timers__, __view__, __name__, __customID__, __interpreted__, __, ...params } = view
        
    return params
}

const removeView = ({ _window, id, stack, self = true, main, insert }) => {
    
    const views = _window ? _window.views : window.views
    var view = views[id] || {}, parent = views[view.__parent__], element = {}
    
    view.__childrenRef__.map(({ id }) => id).map(id => removeView({ _window, id, stack, insert }))

    if (self && view.id) {

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
        
        // deepDelete({ obj: global.__events__, key: id })

        blockRelatedAddressesByViewID({ stack, id })

        // Object.keys(view).map(key => delete view[key])

        delete views[id]
    }

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

module.exports = { initView, getViewParams, removeView }
},{"./clone":4,"./generate":24}],82:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const watch = ({ lookupActions, __, string, id }) => {

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    var approved = toApproval({ id, lookupActions, stack, __, data: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500, watchAddress = { id: generate() }
        view[`${_watch}-watch`] = clone(toValue({ id, lookupActions, stack, __, data: _watch }))
        
        const myFn = async () => {
            
            var value = toValue({ id, lookupActions, stack, data: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, lookupActions, stack, data: watch.split('?')[1], mount: true, __ })
            
            // approval
            var approved = toApproval({ id, lookupActions, stack, data: watch.split('?')[2], __ })
            if (!approved) return
                
            // params
            if (view.await) toParam({ id, lookupActions, stack, data: view.await.join(';'), __ })
        }

        view.__timers__.push(setInterval(myFn, timer))
    })
}

module.exports = { watch }
},{"./clone":4,"./generate":24,"./isEqual":34,"./toApproval":61,"./toCode":66,"./toParam":74,"./toValue":77}],83:[function(require,module,exports){
module.exports = () => {
  
  return [{ // close droplist
    event: `[keyup:input()??e().key=Escape];[blur:input()??!():droplist.contains():[clicked()]||focused().id!=().id]?__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()`
  }, { // open droplist on click
    event: `[click??__droplistPositioner__:()!=().id];[focus:input()??__droplistPositioner__:()!=().id]?clearTimer():[__droplistTimer__:()];if():[__droplistPositioner__:()!=().id]:[__keyupIndex__:()=0;__droplistPositioner__:()=().id;droplist()::[().droplist.style.keys()._():[():droplist.style().[_]=().droplist.style.[_]];():droplist.position():[positioner=().id;[().droplist].flat()];():droplist.style():[opacity=1;transform='scale(1)';pointerEvents=auto];]]:[__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()]`,
  }, { // choose item on enter
    event: `keyup:input()?():droplist.children().[__keyupIndex__:()].click()?e().key=Enter`
  }, { // open on hoverin
    event: `mouseenter?clearTimer():[.droplistLeaved];if():[__droplistMouseenterer__:()!=().id]:[click();__droplistMouseenterer__:()=().id]?droplist.hoverable`
  }, { // close on hoverout
    event: `mouseleave?__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()?droplist.hoverable`
  }, { // search droplist
    event: `input:input()?droplist()?input();droplist.searchable`
  }, { // move up/down items
    event: `keyup:input()?():droplist.children().[__keyupIndex__:()||0].mouseleave();__keyupIndex__:()=if():[e().keyCode=40]:[__keyupIndex__:()+1]:[__keyupIndex__:()-1];():droplist.children().[__keyupIndex__:()].mouseenter()?e().keyCode=40||=38;__droplistPositioner__:();if():[e().keyCode=38]:[__keyupIndex__:()>0].elif():[e().keyCode=40]:[__keyupIndex__:()<():droplist.children().len()-1]`
  }]
}
},{}],84:[function(require,module,exports){
module.exports = {
  droplist: require("./droplist"),
  tooltip: require("./tooltip"),
  mininote: require("./mininote"),
  hover: require("./hover")
}
},{"./droplist":83,"./hover":85,"./mininote":86,"./tooltip":87}],85:[function(require,module,exports){
module.exports = ({ data, id }) => {

    var view = window.views[id]
    var _id = data.id || data.controllerId || id
    if (typeof _id === "object" && _id.id) _id = _id.id
    
    view.hover.default = view.hover.default || { style: {} }
    view.hover.style &&
    Object.keys(view.hover.style).map(key => 
        view.hover.default.style[key] = view.hover.default.style[key] !== undefined ? view.hover.default.style[key] : view.style[key] !== undefined ? view.style[key] : null 
    )
    
    return [{
        //"event": `loaded:${_id}?mouseenter()?hover.mount`
    }, {
        "event": `mouseenter:${_id}?hover.style.keys()._():[style().[_]=.hover.style.[_]]?!hover.disable`
    }, {
        "event": `mouseleave:${_id}?hover.default.style.keys()._():[style().[_]=.hover.default.style.[_]]?!hover.disable`
    }]
}
},{}],86:[function(require,module,exports){
module.exports = () => {
  
  return [{
    event: `click?():mininote-text.txt()=[.mininote.text||.mininote.note||''];clearTimeout():[mininote-timer:()];():mininote.style():[opacity=1;transform='scale(1)'];mininote-timer:()=():root.timer():[():mininote.style():[opacity=0;transform=scale(0)]]:[.mininote.timer||3000]`
  }]
}
},{}],87:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ data, id }) => {
  
  id = data.id || id
  var text = data.text || ""
  
  return [{
    event: `mousemove?if():[!__tooltipTimer__:()]:[__tooltipTimer__:()=timer():[():tooltip.style().opacity=1?mouseentered]:500];():tooltip-text.txt()=.tooltip.text;():tooltip-text.removeClass():ar;if():[${arabic.test(text) && !english.test(text)}]:[():tooltip-text.addClass():ar];():tooltip.position():[positioner=mouse;placement=[.tooltip.placement||left];distance=[.tooltip.distance||0]]?mouseentered`
  }, {
    event: "mouseleave?mouseentered=false;clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0"
  }, {
    event: "mouseenter?mouseentered=true"
  }]
}
},{}],88:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":90}],89:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":96,"../core/createError":97,"./../core/settle":101,"./../helpers/buildURL":105,"./../helpers/cookies":107,"./../helpers/isURLSameOrigin":110,"./../helpers/parseHeaders":112,"./../utils":115}],90:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":91,"./cancel/CancelToken":92,"./cancel/isCancel":93,"./core/Axios":94,"./core/mergeConfig":100,"./defaults":103,"./helpers/bind":104,"./helpers/isAxiosError":109,"./helpers/spread":113,"./utils":115}],91:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],92:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":91}],93:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],94:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":105,"../helpers/validator":114,"./../utils":115,"./InterceptorManager":95,"./dispatchRequest":98,"./mergeConfig":100}],95:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":115}],96:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":106,"../helpers/isAbsoluteURL":108}],97:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":99}],98:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":93,"../defaults":103,"./../utils":115,"./transformData":102}],99:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],100:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":115}],101:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":97}],102:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":103,"./../utils":115}],103:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":89,"./adapters/xhr":89,"./core/enhanceError":99,"./helpers/normalizeHeaderName":111,"./utils":115,"_process":125}],104:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],105:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":115}],106:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],107:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":115}],108:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],109:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],110:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":115}],111:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":115}],112:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":115}],113:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],114:[function(require,module,exports){
'use strict';

var pkg = require('./../../package.json');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

},{"./../../package.json":116}],115:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":104}],116:[function(require,module,exports){
module.exports={
  "name": "axios",
  "version": "0.21.4",
  "description": "Promise based HTTP client for the browser and node.js",
  "main": "index.js",
  "scripts": {
    "test": "grunt test",
    "start": "node ./sandbox/server.js",
    "build": "NODE_ENV=production grunt build",
    "preversion": "npm test",
    "version": "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    "postversion": "git push && git push --tags",
    "examples": "node ./examples/server.js",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "fix": "eslint --fix lib/**/*.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/axios/axios.git"
  },
  "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
  ],
  "author": "Matt Zabriskie",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/axios/axios/issues"
  },
  "homepage": "https://axios-http.com",
  "devDependencies": {
    "coveralls": "^3.0.0",
    "es6-promise": "^4.2.4",
    "grunt": "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    "karma": "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    "minimist": "^1.2.0",
    "mocha": "^8.2.1",
    "sinon": "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    "typescript": "^4.0.5",
    "url-search-params": "^0.10.0",
    "webpack": "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  },
  "browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
  "jsdelivr": "dist/axios.min.js",
  "unpkg": "dist/axios.min.js",
  "typings": "./index.d.ts",
  "dependencies": {
    "follow-redirects": "^1.14.0"
  },
  "bundlesize": [
    {
      "path": "./dist/axios.min.js",
      "threshold": "5kB"
    }
  ]
}

},{}],117:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],118:[function(require,module,exports){

},{}],119:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":117,"buffer":119,"ieee754":123}],120:[function(require,module,exports){
'use strict';

/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/
var dijkstra = {
  single_source_shortest_paths: function(graph, s, d) {
    // Predecessor map for each node that has been encountered.
    // node ID => predecessor node ID
    var predecessors = {};

    // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost
    var costs = {};
    costs[s] = 0;

    // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?
    var open = dijkstra.PriorityQueue.make();
    open.push(s, 0);

    var closest,
        u, v,
        cost_of_s_to_u,
        adjacent_nodes,
        cost_of_e,
        cost_of_s_to_u_plus_cost_of_e,
        cost_of_s_to_v,
        first_visit;
    while (!open.empty()) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      closest = open.pop();
      u = closest.value;
      cost_of_s_to_u = closest.cost;

      // Get nodes adjacent to u...
      adjacent_nodes = graph[u] || {};

      // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.
      for (v in adjacent_nodes) {
        if (adjacent_nodes.hasOwnProperty(v)) {
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v];

          // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.
          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

          // If we haven't visited v yet OR if the current known cost from s to
          // v is greater than the new cost we just found (cost of s to u plus
          // cost of u to v across e), update v's cost in the cost list and
          // update v's predecessor in the predecessor list (it's now u).
          cost_of_s_to_v = costs[v];
          first_visit = (typeof costs[v] === 'undefined');
          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = cost_of_s_to_u_plus_cost_of_e;
            open.push(v, cost_of_s_to_u_plus_cost_of_e);
            predecessors[v] = u;
          }
        }
      }
    }

    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
      throw new Error(msg);
    }

    return predecessors;
  },

  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
    var nodes = [];
    var u = d;
    var predecessor;
    while (u) {
      nodes.push(u);
      predecessor = predecessors[u];
      u = predecessors[u];
    }
    nodes.reverse();
    return nodes;
  },

  find_path: function(graph, s, d) {
    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
    return dijkstra.extract_shortest_path_from_predecessor_list(
      predecessors, d);
  },

  /**
   * A very naive priority queue implementation.
   */
  PriorityQueue: {
    make: function (opts) {
      var T = dijkstra.PriorityQueue,
          t = {},
          key;
      opts = opts || {};
      for (key in T) {
        if (T.hasOwnProperty(key)) {
          t[key] = T[key];
        }
      }
      t.queue = [];
      t.sorter = opts.sorter || T.default_sorter;
      return t;
    },

    default_sorter: function (a, b) {
      return a.cost - b.cost;
    },

    /**
     * Add a new item to the queue and ensure the highest priority element
     * is at the front of the queue.
     */
    push: function (value, cost) {
      var item = {value: value, cost: cost};
      this.queue.push(item);
      this.queue.sort(this.sorter);
    },

    /**
     * Return the highest priority element in the queue.
     */
    pop: function () {
      return this.queue.shift();
    },

    empty: function () {
      return this.queue.length === 0;
    }
  }
};


// node.js module exports
if (typeof module !== 'undefined') {
  module.exports = dijkstra;
}

},{}],121:[function(require,module,exports){
(function (global){(function (){
/**
 * EasyQRCodeJS
 * 
 * Cross-browser QRCode generator for pure javascript. Support Canvas, SVG and Table drawing methods. Support Dot style, Logo, Background image, Colorful, Title etc. settings. Support Angular, Vue.js, React, Next.js, Svelte framework. Support binary(hex) data mode.(Running with DOM on client side)
 * 
 * Version 4.6.0
 * 
 * @author [ inthinkcolor@gmail.com ]
 * 
 * @see https://github.com/ushelp/EasyQRCodeJS 
 * @see http://www.easyproject.cn/easyqrcodejs/tryit.html
 * @see https://github.com/ushelp/EasyQRCodeJS-NodeJS
 * 
 * Copyright 2017 Ray, EasyProject
 * Released under the MIT license
 * 
 * [Support AMD, CMD, CommonJS/Node.js]
 * 
 */
!function(){"use strict";function a(a,b){var c,d=Object.keys(b);for(c=0;c<d.length;c++)a=a.replace(new RegExp("\\{"+d[c]+"\\}","gi"),b[d[c]]);return a}function b(a){var b,c,d;if(!a)throw new Error("cannot create a random attribute name for an undefined object");b="ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",c="";do{for(c="",d=0;d<12;d++)c+=b[Math.floor(Math.random()*b.length)]}while(a[c]);return c}function c(a){var b={left:"start",right:"end",center:"middle",start:"start",end:"end"};return b[a]||b.start}function d(a){var b={alphabetic:"alphabetic",hanging:"hanging",top:"text-before-edge",bottom:"text-after-edge",middle:"central"};return b[a]||b.alphabetic}var e,f,g,h,i;i=function(a,b){var c,d,e,f={};for(a=a.split(","),b=b||10,c=0;c<a.length;c+=2)d="&"+a[c+1]+";",e=parseInt(a[c],b),f[d]="&#"+e+";";return f["\\xa0"]="&#160;",f}("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro",32),e={strokeStyle:{svgAttr:"stroke",canvas:"#000000",svg:"none",apply:"stroke"},fillStyle:{svgAttr:"fill",canvas:"#000000",svg:null,apply:"fill"},lineCap:{svgAttr:"stroke-linecap",canvas:"butt",svg:"butt",apply:"stroke"},lineJoin:{svgAttr:"stroke-linejoin",canvas:"miter",svg:"miter",apply:"stroke"},miterLimit:{svgAttr:"stroke-miterlimit",canvas:10,svg:4,apply:"stroke"},lineWidth:{svgAttr:"stroke-width",canvas:1,svg:1,apply:"stroke"},globalAlpha:{svgAttr:"opacity",canvas:1,svg:1,apply:"fill stroke"},font:{canvas:"10px sans-serif"},shadowColor:{canvas:"#000000"},shadowOffsetX:{canvas:0},shadowOffsetY:{canvas:0},shadowBlur:{canvas:0},textAlign:{canvas:"start"},textBaseline:{canvas:"alphabetic"},lineDash:{svgAttr:"stroke-dasharray",canvas:[],svg:null,apply:"stroke"}},g=function(a,b){this.__root=a,this.__ctx=b},g.prototype.addColorStop=function(b,c){var d,e,f=this.__ctx.__createElement("stop");f.setAttribute("offset",b),-1!==c.indexOf("rgba")?(d=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi,e=d.exec(c),f.setAttribute("stop-color",a("rgb({r},{g},{b})",{r:e[1],g:e[2],b:e[3]})),f.setAttribute("stop-opacity",e[4])):f.setAttribute("stop-color",c),this.__root.appendChild(f)},h=function(a,b){this.__root=a,this.__ctx=b},f=function(a){var b,c={width:500,height:500,enableMirroring:!1};if(arguments.length>1?(b=c,b.width=arguments[0],b.height=arguments[1]):b=a||c,!(this instanceof f))return new f(b);this.width=b.width||c.width,this.height=b.height||c.height,this.enableMirroring=void 0!==b.enableMirroring?b.enableMirroring:c.enableMirroring,this.canvas=this,this.__document=b.document||document,b.ctx?this.__ctx=b.ctx:(this.__canvas=this.__document.createElement("canvas"),this.__ctx=this.__canvas.getContext("2d")),this.__setDefaultStyles(),this.__stack=[this.__getStyleState()],this.__groupStack=[],this.__root=this.__document.createElementNS("http://www.w3.org/2000/svg","svg"),this.__root.setAttribute("version",1.1),this.__root.setAttribute("xmlns","http://www.w3.org/2000/svg"),this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),this.__root.setAttribute("width",this.width),this.__root.setAttribute("height",this.height),this.__ids={},this.__defs=this.__document.createElementNS("http://www.w3.org/2000/svg","defs"),this.__root.appendChild(this.__defs),this.__currentElement=this.__document.createElementNS("http://www.w3.org/2000/svg","g"),this.__root.appendChild(this.__currentElement)},f.prototype.__createElement=function(a,b,c){void 0===b&&(b={});var d,e,f=this.__document.createElementNS("http://www.w3.org/2000/svg",a),g=Object.keys(b);for(c&&(f.setAttribute("fill","none"),f.setAttribute("stroke","none")),d=0;d<g.length;d++)e=g[d],f.setAttribute(e,b[e]);return f},f.prototype.__setDefaultStyles=function(){var a,b,c=Object.keys(e);for(a=0;a<c.length;a++)b=c[a],this[b]=e[b].canvas},f.prototype.__applyStyleState=function(a){var b,c,d=Object.keys(a);for(b=0;b<d.length;b++)c=d[b],this[c]=a[c]},f.prototype.__getStyleState=function(){var a,b,c={},d=Object.keys(e);for(a=0;a<d.length;a++)b=d[a],c[b]=this[b];return c},f.prototype.__applyStyleToCurrentElement=function(b){var c=this.__currentElement,d=this.__currentElementsToStyle;d&&(c.setAttribute(b,""),c=d.element,d.children.forEach(function(a){a.setAttribute(b,"")}));var f,i,j,k,l,m,n=Object.keys(e);for(f=0;f<n.length;f++)if(i=e[n[f]],j=this[n[f]],i.apply)if(j instanceof h){if(j.__ctx)for(;j.__ctx.__defs.childNodes.length;)k=j.__ctx.__defs.childNodes[0].getAttribute("id"),this.__ids[k]=k,this.__defs.appendChild(j.__ctx.__defs.childNodes[0]);c.setAttribute(i.apply,a("url(#{id})",{id:j.__root.getAttribute("id")}))}else if(j instanceof g)c.setAttribute(i.apply,a("url(#{id})",{id:j.__root.getAttribute("id")}));else if(-1!==i.apply.indexOf(b)&&i.svg!==j)if("stroke"!==i.svgAttr&&"fill"!==i.svgAttr||-1===j.indexOf("rgba")){var o=i.svgAttr;if("globalAlpha"===n[f]&&(o=b+"-"+i.svgAttr,c.getAttribute(o)))continue;c.setAttribute(o,j)}else{l=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi,m=l.exec(j),c.setAttribute(i.svgAttr,a("rgb({r},{g},{b})",{r:m[1],g:m[2],b:m[3]}));var p=m[4],q=this.globalAlpha;null!=q&&(p*=q),c.setAttribute(i.svgAttr+"-opacity",p)}},f.prototype.__closestGroupOrSvg=function(a){return a=a||this.__currentElement,"g"===a.nodeName||"svg"===a.nodeName?a:this.__closestGroupOrSvg(a.parentNode)},f.prototype.getSerializedSvg=function(a){var b,c,d,e,f,g,h=(new XMLSerializer).serializeToString(this.__root);if(g=/xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi,g.test(h)&&(h=h.replace('xmlns="http://www.w3.org/2000/svg','xmlns:xlink="http://www.w3.org/1999/xlink')),a)for(b=Object.keys(i),c=0;c<b.length;c++)d=b[c],e=i[d],f=new RegExp(d,"gi"),f.test(h)&&(h=h.replace(f,e));return h},f.prototype.getSvg=function(){return this.__root},f.prototype.save=function(){var a=this.__createElement("g"),b=this.__closestGroupOrSvg();this.__groupStack.push(b),b.appendChild(a),this.__currentElement=a,this.__stack.push(this.__getStyleState())},f.prototype.restore=function(){this.__currentElement=this.__groupStack.pop(),this.__currentElementsToStyle=null,this.__currentElement||(this.__currentElement=this.__root.childNodes[1]);var a=this.__stack.pop();this.__applyStyleState(a)},f.prototype.__addTransform=function(a){var b=this.__closestGroupOrSvg();if(b.childNodes.length>0){"path"===this.__currentElement.nodeName&&(this.__currentElementsToStyle||(this.__currentElementsToStyle={element:b,children:[]}),this.__currentElementsToStyle.children.push(this.__currentElement),this.__applyCurrentDefaultPath());var c=this.__createElement("g");b.appendChild(c),this.__currentElement=c}var d=this.__currentElement.getAttribute("transform");d?d+=" ":d="",d+=a,this.__currentElement.setAttribute("transform",d)},f.prototype.scale=function(b,c){void 0===c&&(c=b),this.__addTransform(a("scale({x},{y})",{x:b,y:c}))},f.prototype.rotate=function(b){var c=180*b/Math.PI;this.__addTransform(a("rotate({angle},{cx},{cy})",{angle:c,cx:0,cy:0}))},f.prototype.translate=function(b,c){this.__addTransform(a("translate({x},{y})",{x:b,y:c}))},f.prototype.transform=function(b,c,d,e,f,g){this.__addTransform(a("matrix({a},{b},{c},{d},{e},{f})",{a:b,b:c,c:d,d:e,e:f,f:g}))},f.prototype.beginPath=function(){var a,b;this.__currentDefaultPath="",this.__currentPosition={},a=this.__createElement("path",{},!0),b=this.__closestGroupOrSvg(),b.appendChild(a),this.__currentElement=a},f.prototype.__applyCurrentDefaultPath=function(){var a=this.__currentElement;"path"===a.nodeName?a.setAttribute("d",this.__currentDefaultPath):console.error("Attempted to apply path command to node",a.nodeName)},f.prototype.__addPathCommand=function(a){this.__currentDefaultPath+=" ",this.__currentDefaultPath+=a},f.prototype.moveTo=function(b,c){"path"!==this.__currentElement.nodeName&&this.beginPath(),this.__currentPosition={x:b,y:c},this.__addPathCommand(a("M {x} {y}",{x:b,y:c}))},f.prototype.closePath=function(){this.__currentDefaultPath&&this.__addPathCommand("Z")},f.prototype.lineTo=function(b,c){this.__currentPosition={x:b,y:c},this.__currentDefaultPath.indexOf("M")>-1?this.__addPathCommand(a("L {x} {y}",{x:b,y:c})):this.__addPathCommand(a("M {x} {y}",{x:b,y:c}))},f.prototype.bezierCurveTo=function(b,c,d,e,f,g){this.__currentPosition={x:f,y:g},this.__addPathCommand(a("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}",{cp1x:b,cp1y:c,cp2x:d,cp2y:e,x:f,y:g}))},f.prototype.quadraticCurveTo=function(b,c,d,e){this.__currentPosition={x:d,y:e},this.__addPathCommand(a("Q {cpx} {cpy} {x} {y}",{cpx:b,cpy:c,x:d,y:e}))};var j=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]);return[a[0]/b,a[1]/b]};f.prototype.arcTo=function(a,b,c,d,e){var f=this.__currentPosition&&this.__currentPosition.x,g=this.__currentPosition&&this.__currentPosition.y;if(void 0!==f&&void 0!==g){if(e<0)throw new Error("IndexSizeError: The radius provided ("+e+") is negative.");if(f===a&&g===b||a===c&&b===d||0===e)return void this.lineTo(a,b);var h=j([f-a,g-b]),i=j([c-a,d-b]);if(h[0]*i[1]==h[1]*i[0])return void this.lineTo(a,b);var k=h[0]*i[0]+h[1]*i[1],l=Math.acos(Math.abs(k)),m=j([h[0]+i[0],h[1]+i[1]]),n=e/Math.sin(l/2),o=a+n*m[0],p=b+n*m[1],q=[-h[1],h[0]],r=[i[1],-i[0]],s=function(a){var b=a[0];return a[1]>=0?Math.acos(b):-Math.acos(b)},t=s(q),u=s(r);this.lineTo(o+q[0]*e,p+q[1]*e),this.arc(o,p,e,t,u)}},f.prototype.stroke=function(){"path"===this.__currentElement.nodeName&&this.__currentElement.setAttribute("paint-order","fill stroke markers"),this.__applyCurrentDefaultPath(),this.__applyStyleToCurrentElement("stroke")},f.prototype.fill=function(){"path"===this.__currentElement.nodeName&&this.__currentElement.setAttribute("paint-order","stroke fill markers"),this.__applyCurrentDefaultPath(),this.__applyStyleToCurrentElement("fill")},f.prototype.rect=function(a,b,c,d){"path"!==this.__currentElement.nodeName&&this.beginPath(),this.moveTo(a,b),this.lineTo(a+c,b),this.lineTo(a+c,b+d),this.lineTo(a,b+d),this.lineTo(a,b),this.closePath()},f.prototype.fillRect=function(a,b,c,d){var e,f;e=this.__createElement("rect",{x:a,y:b,width:c,height:d,"shape-rendering":"crispEdges"},!0),f=this.__closestGroupOrSvg(),f.appendChild(e),this.__currentElement=e,this.__applyStyleToCurrentElement("fill")},f.prototype.strokeRect=function(a,b,c,d){var e,f;e=this.__createElement("rect",{x:a,y:b,width:c,height:d},!0),f=this.__closestGroupOrSvg(),f.appendChild(e),this.__currentElement=e,this.__applyStyleToCurrentElement("stroke")},f.prototype.__clearCanvas=function(){for(var a=this.__closestGroupOrSvg(),b=a.getAttribute("transform"),c=this.__root.childNodes[1],d=c.childNodes,e=d.length-1;e>=0;e--)d[e]&&c.removeChild(d[e]);this.__currentElement=c,this.__groupStack=[],b&&this.__addTransform(b)},f.prototype.clearRect=function(a,b,c,d){if(0===a&&0===b&&c===this.width&&d===this.height)return void this.__clearCanvas();var e,f=this.__closestGroupOrSvg();e=this.__createElement("rect",{x:a,y:b,width:c,height:d,fill:"#FFFFFF"},!0),f.appendChild(e)},f.prototype.createLinearGradient=function(a,c,d,e){var f=this.__createElement("linearGradient",{id:b(this.__ids),x1:a+"px",x2:d+"px",y1:c+"px",y2:e+"px",gradientUnits:"userSpaceOnUse"},!1);return this.__defs.appendChild(f),new g(f,this)},f.prototype.createRadialGradient=function(a,c,d,e,f,h){var i=this.__createElement("radialGradient",{id:b(this.__ids),cx:e+"px",cy:f+"px",r:h+"px",fx:a+"px",fy:c+"px",gradientUnits:"userSpaceOnUse"},!1);return this.__defs.appendChild(i),new g(i,this)},f.prototype.__parseFont=function(){var a=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i,b=a.exec(this.font),c={style:b[1]||"normal",size:b[4]||"10px",family:b[6]||"sans-serif",weight:b[3]||"normal",decoration:b[2]||"normal",href:null};return"underline"===this.__fontUnderline&&(c.decoration="underline"),this.__fontHref&&(c.href=this.__fontHref),c},f.prototype.__wrapTextLink=function(a,b){if(a.href){var c=this.__createElement("a");return c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a.href),c.appendChild(b),c}return b},f.prototype.__applyText=function(a,b,e,f){var g=this.__parseFont(),h=this.__closestGroupOrSvg(),i=this.__createElement("text",{"font-family":g.family,"font-size":g.size,"font-style":g.style,"font-weight":g.weight,"text-decoration":g.decoration,x:b,y:e,"text-anchor":c(this.textAlign),"dominant-baseline":d(this.textBaseline)},!0);i.appendChild(this.__document.createTextNode(a)),this.__currentElement=i,this.__applyStyleToCurrentElement(f),h.appendChild(this.__wrapTextLink(g,i))},f.prototype.fillText=function(a,b,c){this.__applyText(a,b,c,"fill")},f.prototype.strokeText=function(a,b,c){this.__applyText(a,b,c,"stroke")},f.prototype.measureText=function(a){return this.__ctx.font=this.font,this.__ctx.measureText(a)},f.prototype.arc=function(b,c,d,e,f,g){if(e!==f){e%=2*Math.PI,f%=2*Math.PI,e===f&&(f=(f+2*Math.PI-.001*(g?-1:1))%(2*Math.PI));var h=b+d*Math.cos(f),i=c+d*Math.sin(f),j=b+d*Math.cos(e),k=c+d*Math.sin(e),l=g?0:1,m=0,n=f-e;n<0&&(n+=2*Math.PI),m=g?n>Math.PI?0:1:n>Math.PI?1:0,this.lineTo(j,k),this.__addPathCommand(a("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}",{rx:d,ry:d,xAxisRotation:0,largeArcFlag:m,sweepFlag:l,endX:h,endY:i})),this.__currentPosition={x:h,y:i}}},f.prototype.clip=function(){var c=this.__closestGroupOrSvg(),d=this.__createElement("clipPath"),e=b(this.__ids),f=this.__createElement("g");this.__applyCurrentDefaultPath(),c.removeChild(this.__currentElement),d.setAttribute("id",e),d.appendChild(this.__currentElement),this.__defs.appendChild(d),c.setAttribute("clip-path",a("url(#{id})",{id:e})),c.appendChild(f),this.__currentElement=f},f.prototype.drawImage=function(){var a,b,c,d,e,g,h,i,j,k,l,m,n,o,p=Array.prototype.slice.call(arguments),q=p[0],r=0,s=0;if(3===p.length)a=p[1],b=p[2],e=q.width,g=q.height,c=e,d=g;else if(5===p.length)a=p[1],b=p[2],c=p[3],d=p[4],e=q.width,g=q.height;else{if(9!==p.length)throw new Error("Invalid number of arguments passed to drawImage: "+arguments.length);r=p[1],s=p[2],e=p[3],g=p[4],a=p[5],b=p[6],c=p[7],d=p[8]}h=this.__closestGroupOrSvg(),this.__currentElement;var t="translate("+a+", "+b+")";if(q instanceof f){if(i=q.getSvg().cloneNode(!0),i.childNodes&&i.childNodes.length>1){for(j=i.childNodes[0];j.childNodes.length;)o=j.childNodes[0].getAttribute("id"),this.__ids[o]=o,this.__defs.appendChild(j.childNodes[0]);if(k=i.childNodes[1]){var u,v=k.getAttribute("transform");u=v?v+" "+t:t,k.setAttribute("transform",u),h.appendChild(k)}}}else"CANVAS"!==q.nodeName&&"IMG"!==q.nodeName||(l=this.__createElement("image"),l.setAttribute("width",c),l.setAttribute("height",d),l.setAttribute("preserveAspectRatio","none"),l.setAttribute("opacity",this.globalAlpha),(r||s||e!==q.width||g!==q.height)&&(m=this.__document.createElement("canvas"),m.width=c,m.height=d,n=m.getContext("2d"),n.drawImage(q,r,s,e,g,0,0,c,d),q=m),l.setAttribute("transform",t),l.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","CANVAS"===q.nodeName?q.toDataURL():q.originalSrc),h.appendChild(l))},f.prototype.createPattern=function(a,c){var d,e=this.__document.createElementNS("http://www.w3.org/2000/svg","pattern"),g=b(this.__ids);return e.setAttribute("id",g),e.setAttribute("width",a.width),e.setAttribute("height",a.height),"CANVAS"===a.nodeName||"IMG"===a.nodeName?(d=this.__document.createElementNS("http://www.w3.org/2000/svg","image"),d.setAttribute("width",a.width),d.setAttribute("height",a.height),d.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","CANVAS"===a.nodeName?a.toDataURL():a.getAttribute("src")),e.appendChild(d),this.__defs.appendChild(e)):a instanceof f&&(e.appendChild(a.__root.childNodes[1]),this.__defs.appendChild(e)),new h(e,this)},f.prototype.setLineDash=function(a){a&&a.length>0?this.lineDash=a.join(","):this.lineDash=null},f.prototype.drawFocusRing=function(){},f.prototype.createImageData=function(){},f.prototype.getImageData=function(){},f.prototype.putImageData=function(){},f.prototype.globalCompositeOperation=function(){},f.prototype.setTransform=function(){},"object"==typeof window&&(window.C2S=f),"object"==typeof module&&"object"==typeof module.exports&&(module.exports=f)}(),function(){"use strict";function a(a,b,c){if(this.mode=q.MODE_8BIT_BYTE,this.data=a,this.parsedData=[],b){for(var d=0,e=this.data.length;d<e;d++){var f=[],g=this.data.charCodeAt(d);f[0]=g,this.parsedData.push(f)}this.parsedData=Array.prototype.concat.apply([],this.parsedData)}else this.parsedData=function(a){for(var b=[],c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b.push(d):d<2048?b.push(192|d>>6,128|63&d):d<55296||d>=57344?b.push(224|d>>12,128|d>>6&63,128|63&d):(c++,d=65536+((1023&d)<<10|1023&a.charCodeAt(c)),b.push(240|d>>18,128|d>>12&63,128|d>>6&63,128|63&d))}return b}(a);this.parsedData=Array.prototype.concat.apply([],this.parsedData),c||this.parsedData.length==this.data.length||(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function c(a,b){if(a.length==i)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function d(a,b){this.totalCount=a,this.dataCount=b}function e(){this.buffer=[],this.length=0}function f(){var a=!1,b=navigator.userAgent;if(/android/i.test(b)){a=!0;var c=b.toString().match(/android ([0-9]\.[0-9])/i);c&&c[1]&&(a=parseFloat(c[1]))}return a}function g(a,b){for(var c=b.correctLevel,d=1,e=h(a),f=0,g=w.length;f<g;f++){var i=0;switch(c){case r.L:i=w[f][0];break;case r.M:i=w[f][1];break;case r.Q:i=w[f][2];break;case r.H:i=w[f][3]}if(e<=i)break;d++}if(d>w.length)throw new Error("Too long data. the CorrectLevel."+["M","L","H","Q"][c]+" limit length is "+i);return 0!=b.version&&(d<=b.version?(d=b.version,b.runVersion=d):(console.warn("QR Code version "+b.version+" too small, run version use "+d),b.runVersion=d)),d}function h(a){return encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a").length}var i,j,k="object"==typeof global&&global&&global.Object===Object&&global,l="object"==typeof self&&self&&self.Object===Object&&self,m=k||l||Function("return this")(),n="object"==typeof exports&&exports&&!exports.nodeType&&exports,o=n&&"object"==typeof module&&module&&!module.nodeType&&module,p=m.QRCode;a.prototype={getLength:function(a){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;b<c;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b,c,d){var e=new a(b,c,d);this.dataList.push(e),this.dataCache=null},isDark:function(a,b){if(a<0||this.moduleCount<=a||b<0||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b][0]},getEye:function(a,b){if(a<0||this.moduleCount<=a||b<0||this.moduleCount<=b)throw new Error(a+","+b);var c=this.modules[a][b];if(c[1]){var d="P"+c[1]+"_"+c[2];return"A"==c[2]&&(d="A"+c[1]),{isDark:c[0],type:d}}return null},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=[]}this.setupPositionProbePattern(0,0,"TL"),this.setupPositionProbePattern(this.moduleCount-7,0,"BL"),this.setupPositionProbePattern(0,this.moduleCount-7,"TR"),this.setupPositionAdjustPattern("A"),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b,c){for(var d=-1;d<=7;d++)if(!(a+d<=-1||this.moduleCount<=a+d))for(var e=-1;e<=7;e++)b+e<=-1||this.moduleCount<=b+e||(0<=d&&d<=6&&(0==e||6==e)||0<=e&&e<=6&&(0==d||6==d)||2<=d&&d<=4&&2<=e&&e<=4?(this.modules[a+d][b+e][0]=!0,this.modules[a+d][b+e][2]=c,this.modules[a+d][b+e][1]=-0==d||-0==e||6==d||6==e?"O":"I"):this.modules[a+d][b+e][0]=!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;c<8;c++){this.makeImpl(!0,c);var d=t.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c);this.make();for(var e=0;e<this.modules.length;e++)for(var f=1*e,g=0;g<this.modules[e].length;g++){var h=1*g,i=this.modules[e][g][0];i&&(d.beginFill(0,100),d.moveTo(h,f),d.lineTo(h+1,f),d.lineTo(h+1,f+1),d.lineTo(h,f+1),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6][0]&&(this.modules[a][6][0]=a%2==0);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b][0]&&(this.modules[6][b][0]=b%2==0)},setupPositionAdjustPattern:function(a){for(var b=t.getPatternPosition(this.typeNumber),c=0;c<b.length;c++)for(var d=0;d<b.length;d++){var e=b[c],f=b[d];if(null==this.modules[e][f][0])for(var g=-2;g<=2;g++)for(var h=-2;h<=2;h++)-2==g||2==g||-2==h||2==h||0==g&&0==h?(this.modules[e+g][f+h][0]=!0,this.modules[e+g][f+h][2]=a,this.modules[e+g][f+h][1]=-2==g||-2==h||2==g||2==h?"O":"I"):this.modules[e+g][f+h][0]=!1}},setupTypeNumber:function(a){for(var b=t.getBCHTypeNumber(this.typeNumber),c=0;c<18;c++){var d=!a&&1==(b>>c&1);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3][0]=d}for(var c=0;c<18;c++){var d=!a&&1==(b>>c&1);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)][0]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=t.getBCHTypeInfo(c),e=0;e<15;e++){var f=!a&&1==(d>>e&1);e<6?this.modules[e][8][0]=f:e<8?this.modules[e+1][8][0]=f:this.modules[this.moduleCount-15+e][8][0]=f}for(var e=0;e<15;e++){var f=!a&&1==(d>>e&1);e<8?this.modules[8][this.moduleCount-e-1][0]=f:e<9?this.modules[8][15-e-1+1][0]=f:this.modules[8][15-e-1][0]=f}this.modules[this.moduleCount-8][8][0]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,f=0,g=this.moduleCount-1;g>0;g-=2)for(6==g&&g--;;){for(var h=0;h<2;h++)if(null==this.modules[d][g-h][0]){var i=!1;f<a.length&&(i=1==(a[f]>>>e&1));var j=t.getMask(b,d,g-h);j&&(i=!i),this.modules[d][g-h][0]=i,e--,-1==e&&(f++,e=7)}if((d+=c)<0||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,f){for(var g=d.getRSBlocks(a,c),h=new e,i=0;i<f.length;i++){var j=f[i];h.put(j.mode,4),h.put(j.getLength(),t.getLengthInBits(j.mode,a)),j.write(h)}for(var k=0,i=0;i<g.length;i++)k+=g[i].dataCount;if(h.getLengthInBits()>8*k)throw new Error("code length overflow. ("+h.getLengthInBits()+">"+8*k+")");for(h.getLengthInBits()+4<=8*k&&h.put(0,4);h.getLengthInBits()%8!=0;)h.putBit(!1);for(;;){if(h.getLengthInBits()>=8*k)break;if(h.put(b.PAD0,8),h.getLengthInBits()>=8*k)break;h.put(b.PAD1,8)}return b.createBytes(h,g)},b.createBytes=function(a,b){for(var d=0,e=0,f=0,g=new Array(b.length),h=new Array(b.length),i=0;i<b.length;i++){var j=b[i].dataCount,k=b[i].totalCount-j;e=Math.max(e,j),f=Math.max(f,k),g[i]=new Array(j);for(var l=0;l<g[i].length;l++)g[i][l]=255&a.buffer[l+d];d+=j;var m=t.getErrorCorrectPolynomial(k),n=new c(g[i],m.getLength()-1),o=n.mod(m);h[i]=new Array(m.getLength()-1);for(var l=0;l<h[i].length;l++){var p=l+o.getLength()-h[i].length;h[i][l]=p>=0?o.get(p):0}}for(var q=0,l=0;l<b.length;l++)q+=b[l].totalCount;for(var r=new Array(q),s=0,l=0;l<e;l++)for(var i=0;i<b.length;i++)l<g[i].length&&(r[s++]=g[i][l]);for(var l=0;l<f;l++)for(var i=0;i<b.length;i++)l<h[i].length&&(r[s++]=h[i][l]);return r};for(var q={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},r={L:1,M:0,Q:3,H:2},s={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},t={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;t.getBCHDigit(b)-t.getBCHDigit(t.G15)>=0;)b^=t.G15<<t.getBCHDigit(b)-t.getBCHDigit(t.G15);return(a<<10|b)^t.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;t.getBCHDigit(b)-t.getBCHDigit(t.G18)>=0;)b^=t.G18<<t.getBCHDigit(b)-t.getBCHDigit(t.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return t.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case s.PATTERN000:return(b+c)%2==0;case s.PATTERN001:return b%2==0;case s.PATTERN010:return c%3==0;case s.PATTERN011:return(b+c)%3==0;case s.PATTERN100:return(Math.floor(b/2)+Math.floor(c/3))%2==0;case s.PATTERN101:return b*c%2+b*c%3==0;case s.PATTERN110:return(b*c%2+b*c%3)%2==0;case s.PATTERN111:return(b*c%3+(b+c)%2)%2==0;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new c([1],0),d=0;d<a;d++)b=b.multiply(new c([1,u.gexp(d)],0));return b},getLengthInBits:function(a,b){if(1<=b&&b<10)switch(a){case q.MODE_NUMBER:return 10;case q.MODE_ALPHA_NUM:return 9;case q.MODE_8BIT_BYTE:case q.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(b<27)switch(a){case q.MODE_NUMBER:return 12;case q.MODE_ALPHA_NUM:return 11;case q.MODE_8BIT_BYTE:return 16;case q.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(b<41))throw new Error("type:"+b);switch(a){case q.MODE_NUMBER:return 14;case q.MODE_ALPHA_NUM:return 13;case q.MODE_8BIT_BYTE:return 16;case q.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;d<b;d++)for(var e=0;e<b;e++){for(var f=0,g=a.isDark(d,e),h=-1;h<=1;h++)if(!(d+h<0||b<=d+h))for(var i=-1;i<=1;i++)e+i<0||b<=e+i||0==h&&0==i||g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;d<b-1;d++)for(var e=0;e<b-1;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,0!=j&&4!=j||(c+=3)}for(var d=0;d<b;d++)for(var e=0;e<b-6;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;e<b;e++)for(var d=0;d<b-6;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;e<b;e++)for(var d=0;d<b;d++)a.isDark(d,e)&&k++;return c+=Math.abs(100*k/b/b-50)/5*10}},u={glog:function(a){if(a<1)throw new Error("glog("+a+")");return u.LOG_TABLE[a]},gexp:function(a){for(;a<0;)a+=255;for(;a>=256;)a-=255;return u.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},v=0;v<8;v++)u.EXP_TABLE[v]=1<<v;for(var v=8;v<256;v++)u.EXP_TABLE[v]=u.EXP_TABLE[v-4]^u.EXP_TABLE[v-5]^u.EXP_TABLE[v-6]^u.EXP_TABLE[v-8];for(var v=0;v<255;v++)u.LOG_TABLE[u.EXP_TABLE[v]]=v;c.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++)for(var e=0;e<a.getLength();e++)b[d+e]^=u.gexp(u.glog(this.get(d))+u.glog(a.get(e)));return new c(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=u.glog(this.get(0))-u.glog(a.get(0)),d=new Array(this.getLength()),e=0;e<this.getLength();e++)d[e]=this.get(e);for(var e=0;e<a.getLength();e++)d[e]^=u.gexp(u.glog(a.get(e))+b);return new c(d,0).mod(a)}},
d.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],d.getRSBlocks=function(a,b){var c=d.getRsBlockTable(a,b);if(c==i)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var e=c.length/3,f=[],g=0;g<e;g++)for(var h=c[3*g+0],j=c[3*g+1],k=c[3*g+2],l=0;l<h;l++)f.push(new d(j,k));return f},d.getRsBlockTable=function(a,b){switch(b){case r.L:return d.RS_BLOCK_TABLE[4*(a-1)+0];case r.M:return d.RS_BLOCK_TABLE[4*(a-1)+1];case r.Q:return d.RS_BLOCK_TABLE[4*(a-1)+2];case r.H:return d.RS_BLOCK_TABLE[4*(a-1)+3];default:return i}},e.prototype={get:function(a){var b=Math.floor(a/8);return 1==(this.buffer[b]>>>7-a%8&1)},put:function(a,b){for(var c=0;c<b;c++)this.putBit(1==(a>>>b-c-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var w=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],x=function(){return"undefined"!=typeof CanvasRenderingContext2D}()?function(){function a(){if("svg"==this._htOption.drawer){var a=this._oContext.getSerializedSvg(!0);this.dataURL=a,this._el.innerHTML=a}else try{var b=this._elCanvas.toDataURL("image/png");this.dataURL=b}catch(a){console.error(a)}this._htOption.onRenderingEnd&&(this.dataURL||console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"),this._htOption.onRenderingEnd(this._htOption,this.dataURL))}function b(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&c._fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="}else!0===c._bSupportDataURI&&c._fSuccess?c._fSuccess.call(c):!1===c._bSupportDataURI&&c._fFail&&c._fFail.call(c)}if(m._android&&m._android<=2.1){var c=1/window.devicePixelRatio,d=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,b,e,f,g,h,i,j,k){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*c;else void 0===j&&(arguments[1]*=c,arguments[2]*=c,arguments[3]*=c,arguments[4]*=c);d.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=f(),this._el=a,this._htOption=b,"svg"==this._htOption.drawer?(this._oContext={},this._elCanvas={}):(this._elCanvas=document.createElement("canvas"),this._el.appendChild(this._elCanvas),this._oContext=this._elCanvas.getContext("2d")),this._bSupportDataURI=null,this.dataURL=null};return e.prototype.draw=function(a){function b(){d.quietZone>0&&d.quietZoneColor&&(j.lineWidth=0,j.fillStyle=d.quietZoneColor,j.fillRect(0,0,k._elCanvas.width,d.quietZone),j.fillRect(0,d.quietZone,d.quietZone,k._elCanvas.height-2*d.quietZone),j.fillRect(k._elCanvas.width-d.quietZone,d.quietZone,d.quietZone,k._elCanvas.height-2*d.quietZone),j.fillRect(0,k._elCanvas.height-d.quietZone,k._elCanvas.width,d.quietZone))}function c(a){function c(a){var c=Math.round(d.width/3.5),e=Math.round(d.height/3.5);c!==e&&(c=e),d.logoMaxWidth?c=Math.round(d.logoMaxWidth):d.logoWidth&&(c=Math.round(d.logoWidth)),d.logoMaxHeight?e=Math.round(d.logoMaxHeight):d.logoHeight&&(e=Math.round(d.logoHeight));var f,g;void 0===a.naturalWidth?(f=a.width,g=a.height):(f=a.naturalWidth,g=a.naturalHeight),(d.logoMaxWidth||d.logoMaxHeight)&&(d.logoMaxWidth&&f<=c&&(c=f),d.logoMaxHeight&&g<=e&&(e=g),f<=c&&g<=e&&(c=f,e=g));var h=(d.realWidth-c)/2,i=(d.realHeight-e)/2,k=Math.min(c/f,e/g),l=f*k,m=g*k;(d.logoMaxWidth||d.logoMaxHeight)&&(c=l,e=m,h=(d.realWidth-c)/2,i=(d.realHeight-e)/2),d.logoBackgroundTransparent||(j.fillStyle=d.logoBackgroundColor,j.fillRect(h,i,c,e));var n=j.imageSmoothingQuality,o=j.imageSmoothingEnabled;j.imageSmoothingEnabled=!0,j.imageSmoothingQuality="high",j.drawImage(a,h+(c-l)/2,i+(e-m)/2,l,m),j.imageSmoothingEnabled=o,j.imageSmoothingQuality=n,b(),s._bIsPainted=!0,s.makeImage()}d.onRenderingStart&&d.onRenderingStart(d);for(var h=0;h<e;h++)for(var i=0;i<e;i++){var k=i*f+d.quietZone,l=h*g+d.quietZone,m=a.isDark(h,i),n=a.getEye(h,i),o=d.dotScale;j.lineWidth=0;var p,q;n?(p=d[n.type]||d[n.type.substring(0,2)]||d.colorDark,q=d.colorLight):d.backgroundImage?(q="rgba(0,0,0,0)",6==h?d.autoColor?(p=d.timing_H||d.timing||d.autoColorDark,q=d.autoColorLight):p=d.timing_H||d.timing||d.colorDark:6==i?d.autoColor?(p=d.timing_V||d.timing||d.autoColorDark,q=d.autoColorLight):p=d.timing_V||d.timing||d.colorDark:d.autoColor?(p=d.autoColorDark,q=d.autoColorLight):p=d.colorDark):(p=6==h?d.timing_H||d.timing||d.colorDark:6==i?d.timing_V||d.timing||d.colorDark:d.colorDark,q=d.colorLight),j.strokeStyle=m?p:q,j.fillStyle=m?p:q,n?(o="AO"==n.type?d.dotScaleAO:"AI"==n.type?d.dotScaleAI:1,d.backgroundImage&&d.autoColor?(p=("AO"==n.type?d.AI:d.AO)||d.autoColorDark,q=d.autoColorLight):p=("AO"==n.type?d.AI:d.AO)||p,m=n.isDark,j.fillRect(Math.ceil(k+f*(1-o)/2),Math.ceil(d.titleHeight+l+g*(1-o)/2),Math.ceil(f*o),Math.ceil(g*o))):6==h?(o=d.dotScaleTiming_H,j.fillRect(Math.ceil(k+f*(1-o)/2),Math.ceil(d.titleHeight+l+g*(1-o)/2),Math.ceil(f*o),Math.ceil(g*o))):6==i?(o=d.dotScaleTiming_V,j.fillRect(Math.ceil(k+f*(1-o)/2),Math.ceil(d.titleHeight+l+g*(1-o)/2),Math.ceil(f*o),Math.ceil(g*o))):(d.backgroundImage,j.fillRect(Math.ceil(k+f*(1-o)/2),Math.ceil(d.titleHeight+l+g*(1-o)/2),Math.ceil(f*o),Math.ceil(g*o))),1==d.dotScale||n||(j.strokeStyle=d.colorLight)}if(d.title&&(j.fillStyle=d.titleBackgroundColor,j.fillRect(d.quietZone,d.quietZone,d.width,d.titleHeight),j.font=d.titleFont,j.fillStyle=d.titleColor,j.textAlign="center",j.fillText(d.title,this._elCanvas.width/2,+d.quietZone+d.titleTop)),d.subTitle&&(j.font=d.subTitleFont,j.fillStyle=d.subTitleColor,j.fillText(d.subTitle,this._elCanvas.width/2,+d.quietZone+d.subTitleTop)),d.logo){var r=new Image,s=this;r.onload=function(){c(r)},r.onerror=function(a){console.error(a)},null!=d.crossOrigin&&(r.crossOrigin=d.crossOrigin),r.originalSrc=d.logo,r.src=d.logo}else b(),this._bIsPainted=!0,this.makeImage()}var d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e;f<=1&&(f=1),g<=1&&(g=1);var h=f*e,i=g*e;d.heightWithTitle=i+d.titleHeight,d.realHeight=d.heightWithTitle+2*d.quietZone,d.realWidth=h+2*d.quietZone,this._elCanvas.width=d.realWidth,this._elCanvas.height=d.realHeight,"canvas"!=d.drawer&&(this._oContext=new C2S(this._elCanvas.width,this._elCanvas.height)),this.clear();var j=this._oContext;j.lineWidth=0,j.fillStyle=d.colorLight,j.fillRect(0,0,this._elCanvas.width,this._elCanvas.height),j.clearRect(d.quietZone,d.quietZone,d.width,d.titleHeight);var k=this;if(d.backgroundImage){var l=new Image;l.onload=function(){j.globalAlpha=1,j.globalAlpha=d.backgroundImageAlpha;var b=j.imageSmoothingQuality,e=j.imageSmoothingEnabled;j.imageSmoothingEnabled=!0,j.imageSmoothingQuality="high",(d.title||d.subTitle)&&d.titleHeight?j.drawImage(l,d.quietZone,d.quietZone+d.titleHeight,d.width,d.height):j.drawImage(l,0,0,d.realWidth,d.realHeight),j.imageSmoothingEnabled=e,j.imageSmoothingQuality=b,j.globalAlpha=1,c.call(k,a)},null!=d.crossOrigin&&(l.crossOrigin=d.crossOrigin),l.originalSrc=d.backgroundImage,l.src=d.backgroundImage}else c.call(k,a)},e.prototype.makeImage=function(){this._bIsPainted&&b.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.remove=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1,this._el.innerHTML=""},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){var b=this._htOption,c=this._el,d=a.getModuleCount(),e=b.width/d,f=b.height/d;e<=1&&(e=1),f<=1&&(f=1);var g=e*d,h=f*d;b.heightWithTitle=h+b.titleHeight,b.realHeight=b.heightWithTitle+2*b.quietZone,b.realWidth=g+2*b.quietZone;var i=[],j="",k=Math.round(e*b.dotScale),l=Math.round(f*b.dotScale);k<4&&(k=4,l=4);var m=b.colorDark,n=b.colorLight;if(b.backgroundImage){b.autoColor?(b.colorDark="rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');",b.colorLight="rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');"):b.colorLight="rgba(0,0,0,0)";var o='<div style="display:inline-block; z-index:-10;position:absolute;"><img src="'+b.backgroundImage+'" width="'+(b.width+2*b.quietZone)+'" height="'+b.realHeight+'" style="opacity:'+b.backgroundImageAlpha+";filter:alpha(opacity="+100*b.backgroundImageAlpha+'); "/></div>';i.push(o)}if(b.quietZone&&(j="display:inline-block; width:"+(b.width+2*b.quietZone)+"px; height:"+(b.width+2*b.quietZone)+"px;background:"+b.quietZoneColor+"; text-align:center;"),i.push('<div style="font-size:0;'+j+'">'),i.push('<table  style="font-size:0;border:0;border-collapse:collapse; margin-top:'+b.quietZone+'px;" border="0" cellspacing="0" cellspadding="0" align="center" valign="middle">'),i.push('<tr height="'+b.titleHeight+'" align="center"><td style="border:0;border-collapse:collapse;margin:0;padding:0" colspan="'+d+'">'),b.title){var p=b.titleColor,q=b.titleFont;i.push('<div style="width:100%;margin-top:'+b.titleTop+"px;color:"+p+";font:"+q+";background:"+b.titleBackgroundColor+'">'+b.title+"</div>")}b.subTitle&&i.push('<div style="width:100%;margin-top:'+(b.subTitleTop-b.titleTop)+"px;color:"+b.subTitleColor+"; font:"+b.subTitleFont+'">'+b.subTitle+"</div>"),i.push("</td></tr>");for(var r=0;r<d;r++){i.push('<tr style="border:0; padding:0; margin:0;" height="7">');for(var s=0;s<d;s++){var t=a.isDark(r,s),u=a.getEye(r,s);if(u){t=u.isDark;var v=u.type,w=b[v]||b[v.substring(0,2)]||m;i.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+'px;"><span style="width:'+e+"px;height:"+f+"px;background-color:"+(t?w:n)+';display:inline-block"></span></td>')}else{var x=b.colorDark;6==r?(x=b.timing_H||b.timing||m,i.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(t?x:n)+';"></td>')):6==s?(x=b.timing_V||b.timing||m,i.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(t?x:n)+';"></td>')):i.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+'px;"><div style="display:inline-block;width:'+k+"px;height:"+l+"px;background-color:"+(t?x:b.colorLight)+';"></div></td>')}}i.push("</tr>")}if(i.push("</table>"),i.push("</div>"),b.logo){var y=new Image;null!=b.crossOrigin&&(y.crossOrigin=b.crossOrigin),y.src=b.logo;var z=b.width/3.5,A=b.height/3.5;z!=A&&(z=A),b.logoWidth&&(z=b.logoWidth),b.logoHeight&&(A=b.logoHeight);var B="position:relative; z-index:1;display:table-cell;top:-"+(b.height/2+A/2+b.quietZone)+"px;text-align:center; width:"+z+"px; height:"+A+"px;line-height:"+z+"px; vertical-align: middle;";b.logoBackgroundTransparent||(B+="background:"+b.logoBackgroundColor),i.push('<div style="'+B+'"><img  src="'+b.logo+'"  style="max-width: '+z+"px; max-height: "+A+'px;" /> <div style=" display: none; width:1px;margin-left: -1px;"></div></div>')}b.onRenderingStart&&b.onRenderingStart(b),c.innerHTML=i.join("");var C=c.childNodes[0],D=(b.width-C.offsetWidth)/2,E=(b.heightWithTitle-C.offsetHeight)/2;D>0&&E>0&&(C.style.margin=E+"px "+D+"px"),this._htOption.onRenderingEnd&&this._htOption.onRenderingEnd(this._htOption,null)},a.prototype.clear=function(){this._el.innerHTML=""},a}();j=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:r.H,dotScale:1,dotScaleTiming:1,dotScaleTiming_H:i,dotScaleTiming_V:i,dotScaleA:1,dotScaleAO:i,dotScaleAI:i,quietZone:0,quietZoneColor:"rgba(0,0,0,0)",title:"",titleFont:"normal normal bold 16px Arial",titleColor:"#000000",titleBackgroundColor:"#ffffff",titleHeight:0,titleTop:30,subTitle:"",subTitleFont:"normal normal normal 14px Arial",subTitleColor:"#4F4F4F",subTitleTop:60,logo:i,logoWidth:i,logoHeight:i,logoMaxWidth:i,logoMaxHeight:i,logoBackgroundColor:"#ffffff",logoBackgroundTransparent:!1,PO:i,PI:i,PO_TL:i,PI_TL:i,PO_TR:i,PI_TR:i,PO_BL:i,PI_BL:i,AO:i,AI:i,timing:i,timing_H:i,timing_V:i,backgroundImage:i,backgroundImageAlpha:1,autoColor:!1,autoColorDark:"rgba(0, 0, 0, .6)",autoColorLight:"rgba(255, 255, 255, .7)",onRenderingStart:i,onRenderingEnd:i,version:0,tooltip:!1,binary:!1,drawer:"canvas",crossOrigin:null,utf8WithoutBOM:!0},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];this._htOption.title||this._htOption.subTitle||(this._htOption.titleHeight=0),(this._htOption.version<0||this._htOption.version>40)&&(console.warn("QR Code version '"+this._htOption.version+"' is invalidate, reset to 0"),this._htOption.version=0),(this._htOption.dotScale<0||this._htOption.dotScale>1)&&(console.warn(this._htOption.dotScale+" , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScale=1),(this._htOption.dotScaleTiming<0||this._htOption.dotScaleTiming>1)&&(console.warn(this._htOption.dotScaleTiming+" , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleTiming=1),this._htOption.dotScaleTiming_H?(this._htOption.dotScaleTiming_H<0||this._htOption.dotScaleTiming_H>1)&&(console.warn(this._htOption.dotScaleTiming_H+" , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleTiming_H=1):this._htOption.dotScaleTiming_H=this._htOption.dotScaleTiming,this._htOption.dotScaleTiming_V?(this._htOption.dotScaleTiming_V<0||this._htOption.dotScaleTiming_V>1)&&(console.warn(this._htOption.dotScaleTiming_V+" , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleTiming_V=1):this._htOption.dotScaleTiming_V=this._htOption.dotScaleTiming,(this._htOption.dotScaleA<0||this._htOption.dotScaleA>1)&&(console.warn(this._htOption.dotScaleA+" , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleA=1),this._htOption.dotScaleAO?(this._htOption.dotScaleAO<0||this._htOption.dotScaleAO>1)&&(console.warn(this._htOption.dotScaleAO+" , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleAO=1):this._htOption.dotScaleAO=this._htOption.dotScaleA,this._htOption.dotScaleAI?(this._htOption.dotScaleAI<0||this._htOption.dotScaleAI>1)&&(console.warn(this._htOption.dotScaleAI+" , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleAI=1):this._htOption.dotScaleAI=this._htOption.dotScaleA,(this._htOption.backgroundImageAlpha<0||this._htOption.backgroundImageAlpha>1)&&(console.warn(this._htOption.backgroundImageAlpha+" , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. "),this._htOption.backgroundImageAlpha=1),this._htOption.quietZone||(this._htOption.quietZone=0),this._htOption.titleHeight||(this._htOption.titleHeight=0),this._htOption.width=Math.round(this._htOption.width),this._htOption.height=Math.round(this._htOption.height),this._htOption.quietZone=Math.round(this._htOption.quietZone),this._htOption.titleHeight=Math.round(this._htOption.titleHeight),"string"==typeof a&&(a=document.getElementById(a)),(!this._htOption.drawer||"svg"!=this._htOption.drawer&&"canvas"!=this._htOption.drawer)&&(this._htOption.drawer="canvas"),this._android=f(),this._el=a,this._oQRCode=null,this._htOption._element=a;var d={};for(var c in this._htOption)d[c]=this._htOption[c];this._oDrawing=new x(this._el,d),this._htOption.text&&this.makeCode(this._htOption.text)},j.prototype.makeCode=function(a){this._oQRCode=new b(g(a,this._htOption),this._htOption.correctLevel),this._oQRCode.addData(a,this._htOption.binary,this._htOption.utf8WithoutBOM),this._oQRCode.make(),this._htOption.tooltip&&(this._el.title=a),this._oDrawing.draw(this._oQRCode)},j.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},j.prototype.clear=function(){this._oDrawing.remove()},j.prototype.resize=function(a,b){this._oDrawing._htOption.width=a,this._oDrawing._htOption.height=b,this._oDrawing.draw(this._oQRCode)},j.prototype.download=function(a){var b=this._oDrawing.dataURL,c=document.createElement("a");if("svg"==this._htOption.drawer){a+=".svg";var d=new Blob([b],{type:"text/plain"});if(navigator.msSaveBlob)navigator.msSaveBlob(d,a);else{c.download=a;var e=new FileReader;e.onload=function(){c.href=e.result,c.click()},e.readAsDataURL(d)}}else if(a+=".png",navigator.msSaveBlob){var f=function(a){var b=atob(a.split(",")[1]),c=a.split(",")[0].split(":")[1].split(";")[0],d=new ArrayBuffer(b.length),e=new Uint8Array(d);for(v=0;v<b.length;v++)e[v]=b.charCodeAt(v);return new Blob([d],{type:c})}(b);navigator.msSaveBlob(f,a)}else c.download=a,c.href=b,c.click()},j.prototype.noConflict=function(){return m.QRCode===this&&(m.QRCode=p),j},j.CorrectLevel=r,"function"==typeof define&&(define.amd||define.cmd)?define([],function(){return j}):o?((o.exports=j).QRCode=j,n.QRCode=j):m.QRCode=j}.call(this);
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],122:[function(require,module,exports){
'use strict'

module.exports = function encodeUtf8 (input) {
  var result = []
  var size = input.length

  for (var index = 0; index < size; index++) {
    var point = input.charCodeAt(index)

    if (point >= 0xD800 && point <= 0xDBFF && size > index + 1) {
      var second = input.charCodeAt(index + 1)

      if (second >= 0xDC00 && second <= 0xDFFF) {
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        point = (point - 0xD800) * 0x400 + second - 0xDC00 + 0x10000
        index += 1
      }
    }

    // US-ASCII
    if (point < 0x80) {
      result.push(point)
      continue
    }

    // 2-byte UTF-8
    if (point < 0x800) {
      result.push((point >> 6) | 192)
      result.push((point & 63) | 128)
      continue
    }

    // 3-byte UTF-8
    if (point < 0xD800 || (point >= 0xE000 && point < 0x10000)) {
      result.push((point >> 12) | 224)
      result.push(((point >> 6) & 63) | 128)
      result.push((point & 63) | 128)
      continue
    }

    // 4-byte UTF-8
    if (point >= 0x10000 && point <= 0x10FFFF) {
      result.push((point >> 18) | 240)
      result.push(((point >> 12) & 63) | 128)
      result.push(((point >> 6) & 63) | 128)
      result.push((point & 63) | 128)
      continue
    }

    // Invalid character
    result.push(0xEF, 0xBF, 0xBD)
  }

  return new Uint8Array(result).buffer
}

},{}],123:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],124:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":125}],125:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],126:[function(require,module,exports){

const canPromise = require('./can-promise')

const QRCode = require('./core/qrcode')
const CanvasRenderer = require('./renderer/canvas')
const SvgRenderer = require('./renderer/svg-tag.js')

function renderCanvas (renderFunc, canvas, text, opts, cb) {
  const args = [].slice.call(arguments, 1)
  const argsNum = args.length
  const isLastArgCb = typeof args[argsNum - 1] === 'function'

  if (!isLastArgCb && !canPromise()) {
    throw new Error('Callback required as last argument')
  }

  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 2) {
      cb = text
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === 'undefined') {
        cb = opts
        opts = undefined
      } else {
        cb = opts
        opts = text
        text = canvas
        canvas = undefined
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 1) {
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 2 && !canvas.getContext) {
      opts = text
      text = canvas
      canvas = undefined
    }

    return new Promise(function (resolve, reject) {
      try {
        const data = QRCode.create(text, opts)
        resolve(renderFunc(data, canvas, opts))
      } catch (e) {
        reject(e)
      }
    })
  }

  try {
    const data = QRCode.create(text, opts)
    cb(null, renderFunc(data, canvas, opts))
  } catch (e) {
    cb(e)
  }
}

exports.create = QRCode.create
exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render)
exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL)

// only svg for now.
exports.toString = renderCanvas.bind(null, function (data, _, opts) {
  return SvgRenderer.render(data, opts)
})

},{"./can-promise":127,"./core/qrcode":143,"./renderer/canvas":150,"./renderer/svg-tag.js":151}],127:[function(require,module,exports){
// can-promise has a crash in some versions of react native that dont have
// standard global objects
// https://github.com/soldair/node-qrcode/issues/157

module.exports = function () {
  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
}

},{}],128:[function(require,module,exports){
/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */

const getSymbolSize = require('./utils').getSymbolSize

/**
 * Calculate the row/column coordinates of the center module of each alignment pattern
 * for the specified QR Code version.
 *
 * The alignment patterns are positioned symmetrically on either side of the diagonal
 * running from the top left corner of the symbol to the bottom right corner.
 *
 * Since positions are simmetrical only half of the coordinates are returned.
 * Each item of the array will represent in turn the x and y coordinate.
 * @see {@link getPositions}
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinate
 */
exports.getRowColCoords = function getRowColCoords (version) {
  if (version === 1) return []

  const posCount = Math.floor(version / 7) + 2
  const size = getSymbolSize(version)
  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2
  const positions = [size - 7] // Last coord is always (size - 7)

  for (let i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals
  }

  positions.push(6) // First coord is always 6

  return positions.reverse()
}

/**
 * Returns an array containing the positions of each alignment pattern.
 * Each array's element represent the center point of the pattern as (x, y) coordinates
 *
 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
 * and filtering out the items that overlaps with finder pattern
 *
 * @example
 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
 * The alignment patterns, therefore, are to be centered on (row, column)
 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
 * and are not therefore used for alignment patterns.
 *
 * let pos = getPositions(7)
 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
exports.getPositions = function getPositions (version) {
  const coords = []
  const pos = exports.getRowColCoords(version)
  const posLength = pos.length

  for (let i = 0; i < posLength; i++) {
    for (let j = 0; j < posLength; j++) {
      // Skip if position is occupied by finder patterns
      if ((i === 0 && j === 0) || // top-left
          (i === 0 && j === posLength - 1) || // bottom-left
          (i === posLength - 1 && j === 0)) { // top-right
        continue
      }

      coords.push([pos[i], pos[j]])
    }
  }

  return coords
}

},{"./utils":147}],129:[function(require,module,exports){
const Mode = require('./mode')

/**
 * Array of characters available in alphanumeric mode
 *
 * As per QR Code specification, to each character
 * is assigned a value from 0 to 44 which in this case coincides
 * with the array index
 *
 * @type {Array}
 */
const ALPHA_NUM_CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
]

function AlphanumericData (data) {
  this.mode = Mode.ALPHANUMERIC
  this.data = data
}

AlphanumericData.getBitsLength = function getBitsLength (length) {
  return 11 * Math.floor(length / 2) + 6 * (length % 2)
}

AlphanumericData.prototype.getLength = function getLength () {
  return this.data.length
}

AlphanumericData.prototype.getBitsLength = function getBitsLength () {
  return AlphanumericData.getBitsLength(this.data.length)
}

AlphanumericData.prototype.write = function write (bitBuffer) {
  let i

  // Input data characters are divided into groups of two characters
  // and encoded as 11-bit binary codes.
  for (i = 0; i + 2 <= this.data.length; i += 2) {
    // The character value of the first character is multiplied by 45
    let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45

    // The character value of the second digit is added to the product
    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1])

    // The sum is then stored as 11-bit binary number
    bitBuffer.put(value, 11)
  }

  // If the number of input data characters is not a multiple of two,
  // the character value of the final character is encoded as a 6-bit binary number.
  if (this.data.length % 2) {
    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6)
  }
}

module.exports = AlphanumericData

},{"./mode":140}],130:[function(require,module,exports){
function BitBuffer () {
  this.buffer = []
  this.length = 0
}

BitBuffer.prototype = {

  get: function (index) {
    const bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
  },

  put: function (num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  },

  getLengthInBits: function () {
    return this.length
  },

  putBit: function (bit) {
    const bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0)
    }

    if (bit) {
      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8))
    }

    this.length++
  }
}

module.exports = BitBuffer

},{}],131:[function(require,module,exports){
/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */
function BitMatrix (size) {
  if (!size || size < 1) {
    throw new Error('BitMatrix size must be defined and greater than 0')
  }

  this.size = size
  this.data = new Uint8Array(size * size)
  this.reservedBit = new Uint8Array(size * size)
}

/**
 * Set bit value at specified location
 * If reserved flag is set, this bit will be ignored during masking process
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 * @param {Boolean} reserved
 */
BitMatrix.prototype.set = function (row, col, value, reserved) {
  const index = row * this.size + col
  this.data[index] = value
  if (reserved) this.reservedBit[index] = true
}

/**
 * Returns bit value at specified location
 *
 * @param  {Number}  row
 * @param  {Number}  col
 * @return {Boolean}
 */
BitMatrix.prototype.get = function (row, col) {
  return this.data[row * this.size + col]
}

/**
 * Applies xor operator at specified location
 * (used during masking process)
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 */
BitMatrix.prototype.xor = function (row, col, value) {
  this.data[row * this.size + col] ^= value
}

/**
 * Check if bit at specified location is reserved
 *
 * @param {Number}   row
 * @param {Number}   col
 * @return {Boolean}
 */
BitMatrix.prototype.isReserved = function (row, col) {
  return this.reservedBit[row * this.size + col]
}

module.exports = BitMatrix

},{}],132:[function(require,module,exports){
const encodeUtf8 = require('encode-utf8')
const Mode = require('./mode')

function ByteData (data) {
  this.mode = Mode.BYTE
  if (typeof (data) === 'string') {
    data = encodeUtf8(data)
  }
  this.data = new Uint8Array(data)
}

ByteData.getBitsLength = function getBitsLength (length) {
  return length * 8
}

ByteData.prototype.getLength = function getLength () {
  return this.data.length
}

ByteData.prototype.getBitsLength = function getBitsLength () {
  return ByteData.getBitsLength(this.data.length)
}

ByteData.prototype.write = function (bitBuffer) {
  for (let i = 0, l = this.data.length; i < l; i++) {
    bitBuffer.put(this.data[i], 8)
  }
}

module.exports = ByteData

},{"./mode":140,"encode-utf8":122}],133:[function(require,module,exports){
const ECLevel = require('./error-correction-level')

const EC_BLOCKS_TABLE = [
// L  M  Q  H
  1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, 2, 2,
  1, 2, 2, 4,
  1, 2, 4, 4,
  2, 4, 4, 4,
  2, 4, 6, 5,
  2, 4, 6, 6,
  2, 5, 8, 8,
  4, 5, 8, 8,
  4, 5, 8, 11,
  4, 8, 10, 11,
  4, 9, 12, 16,
  4, 9, 16, 16,
  6, 10, 12, 18,
  6, 10, 17, 16,
  6, 11, 16, 19,
  6, 13, 18, 21,
  7, 14, 21, 25,
  8, 16, 20, 25,
  8, 17, 23, 25,
  9, 17, 23, 34,
  9, 18, 25, 30,
  10, 20, 27, 32,
  12, 21, 29, 35,
  12, 23, 34, 37,
  12, 25, 34, 40,
  13, 26, 35, 42,
  14, 28, 38, 45,
  15, 29, 40, 48,
  16, 31, 43, 51,
  17, 33, 45, 54,
  18, 35, 48, 57,
  19, 37, 51, 60,
  19, 38, 53, 63,
  20, 40, 56, 66,
  21, 43, 59, 70,
  22, 45, 62, 74,
  24, 47, 65, 77,
  25, 49, 68, 81
]

const EC_CODEWORDS_TABLE = [
// L  M  Q  H
  7, 10, 13, 17,
  10, 16, 22, 28,
  15, 26, 36, 44,
  20, 36, 52, 64,
  26, 48, 72, 88,
  36, 64, 96, 112,
  40, 72, 108, 130,
  48, 88, 132, 156,
  60, 110, 160, 192,
  72, 130, 192, 224,
  80, 150, 224, 264,
  96, 176, 260, 308,
  104, 198, 288, 352,
  120, 216, 320, 384,
  132, 240, 360, 432,
  144, 280, 408, 480,
  168, 308, 448, 532,
  180, 338, 504, 588,
  196, 364, 546, 650,
  224, 416, 600, 700,
  224, 442, 644, 750,
  252, 476, 690, 816,
  270, 504, 750, 900,
  300, 560, 810, 960,
  312, 588, 870, 1050,
  336, 644, 952, 1110,
  360, 700, 1020, 1200,
  390, 728, 1050, 1260,
  420, 784, 1140, 1350,
  450, 812, 1200, 1440,
  480, 868, 1290, 1530,
  510, 924, 1350, 1620,
  540, 980, 1440, 1710,
  570, 1036, 1530, 1800,
  570, 1064, 1590, 1890,
  600, 1120, 1680, 1980,
  630, 1204, 1770, 2100,
  660, 1260, 1860, 2220,
  720, 1316, 1950, 2310,
  750, 1372, 2040, 2430
]

/**
 * Returns the number of error correction block that the QR Code should contain
 * for the specified version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction blocks
 */
exports.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
    case ECLevel.M:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
    case ECLevel.Q:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
    case ECLevel.H:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
}

/**
 * Returns the number of error correction codewords to use for the specified
 * version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction codewords
 */
exports.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
    case ECLevel.M:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
    case ECLevel.Q:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
    case ECLevel.H:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
}

},{"./error-correction-level":134}],134:[function(require,module,exports){
exports.L = { bit: 1 }
exports.M = { bit: 0 }
exports.Q = { bit: 3 }
exports.H = { bit: 2 }

function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }

  const lcStr = string.toLowerCase()

  switch (lcStr) {
    case 'l':
    case 'low':
      return exports.L

    case 'm':
    case 'medium':
      return exports.M

    case 'q':
    case 'quartile':
      return exports.Q

    case 'h':
    case 'high':
      return exports.H

    default:
      throw new Error('Unknown EC Level: ' + string)
  }
}

exports.isValid = function isValid (level) {
  return level && typeof level.bit !== 'undefined' &&
    level.bit >= 0 && level.bit < 4
}

exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return value
  }

  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}

},{}],135:[function(require,module,exports){
const getSymbolSize = require('./utils').getSymbolSize
const FINDER_PATTERN_SIZE = 7

/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
exports.getPositions = function getPositions (version) {
  const size = getSymbolSize(version)

  return [
    // top-left
    [0, 0],
    // top-right
    [size - FINDER_PATTERN_SIZE, 0],
    // bottom-left
    [0, size - FINDER_PATTERN_SIZE]
  ]
}

},{"./utils":147}],136:[function(require,module,exports){
const Utils = require('./utils')

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)
const G15_BCH = Utils.getBCHDigit(G15)

/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Number} mask                 Mask pattern
 * @return {Number}                      Encoded format information bits
 */
exports.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
  const data = ((errorCorrectionLevel.bit << 3) | mask)
  let d = data << 10

  while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
    d ^= (G15 << (Utils.getBCHDigit(d) - G15_BCH))
  }

  // xor final data with mask pattern in order to ensure that
  // no combination of Error Correction Level and data mask pattern
  // will result in an all-zero data string
  return ((data << 10) | d) ^ G15_MASK
}

},{"./utils":147}],137:[function(require,module,exports){
const EXP_TABLE = new Uint8Array(512)
const LOG_TABLE = new Uint8Array(256)
/**
 * Precompute the log and anti-log tables for faster computation later
 *
 * For each possible value in the galois field 2^8, we will pre-compute
 * the logarithm and anti-logarithm (exponential) of this value
 *
 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
 */
;(function initTables () {
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x
    LOG_TABLE[x] = i

    x <<= 1 // multiply by 2

    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
      x ^= 0x11D
    }
  }

  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
  // stay inside the bounds (because we will mainly use this table for the multiplication of
  // two GF numbers, no more).
  // @see {@link mul}
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255]
  }
}())

/**
 * Returns log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
exports.log = function log (n) {
  if (n < 1) throw new Error('log(' + n + ')')
  return LOG_TABLE[n]
}

/**
 * Returns anti-log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
exports.exp = function exp (n) {
  return EXP_TABLE[n]
}

/**
 * Multiplies two number inside Galois Field
 *
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number}
 */
exports.mul = function mul (x, y) {
  if (x === 0 || y === 0) return 0

  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
  // @see {@link initTables}
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
}

},{}],138:[function(require,module,exports){
const Mode = require('./mode')
const Utils = require('./utils')

function KanjiData (data) {
  this.mode = Mode.KANJI
  this.data = data
}

KanjiData.getBitsLength = function getBitsLength (length) {
  return length * 13
}

KanjiData.prototype.getLength = function getLength () {
  return this.data.length
}

KanjiData.prototype.getBitsLength = function getBitsLength () {
  return KanjiData.getBitsLength(this.data.length)
}

KanjiData.prototype.write = function (bitBuffer) {
  let i

  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
  // These byte values are shifted from the JIS X 0208 values.
  // JIS X 0208 gives details of the shift coded representation.
  for (i = 0; i < this.data.length; i++) {
    let value = Utils.toSJIS(this.data[i])

    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
    if (value >= 0x8140 && value <= 0x9FFC) {
      // Subtract 0x8140 from Shift JIS value
      value -= 0x8140

    // For characters with Shift JIS values from 0xE040 to 0xEBBF
    } else if (value >= 0xE040 && value <= 0xEBBF) {
      // Subtract 0xC140 from Shift JIS value
      value -= 0xC140
    } else {
      throw new Error(
        'Invalid SJIS character: ' + this.data[i] + '\n' +
        'Make sure your charset is UTF-8')
    }

    // Multiply most significant byte of result by 0xC0
    // and add least significant byte to product
    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff)

    // Convert result to a 13-bit binary string
    bitBuffer.put(value, 13)
  }
}

module.exports = KanjiData

},{"./mode":140,"./utils":147}],139:[function(require,module,exports){
/**
 * Data mask pattern reference
 * @type {Object}
 */
exports.Patterns = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
}

/**
 * Weighted penalty scores for the undesirable features
 * @type {Object}
 */
const PenaltyScores = {
  N1: 3,
  N2: 3,
  N3: 40,
  N4: 10
}

/**
 * Check if mask pattern value is valid
 *
 * @param  {Number}  mask    Mask pattern
 * @return {Boolean}         true if valid, false otherwise
 */
exports.isValid = function isValid (mask) {
  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
}

/**
 * Returns mask pattern from a value.
 * If value is not valid, returns undefined
 *
 * @param  {Number|String} value        Mask pattern value
 * @return {Number}                     Valid mask pattern or undefined
 */
exports.from = function from (value) {
  return exports.isValid(value) ? parseInt(value, 10) : undefined
}

/**
* Find adjacent modules in row/column with the same color
* and assign a penalty value.
*
* Points: N1 + i
* i is the amount by which the number of adjacent modules of the same color exceeds 5
*/
exports.getPenaltyN1 = function getPenaltyN1 (data) {
  const size = data.size
  let points = 0
  let sameCountCol = 0
  let sameCountRow = 0
  let lastCol = null
  let lastRow = null

  for (let row = 0; row < size; row++) {
    sameCountCol = sameCountRow = 0
    lastCol = lastRow = null

    for (let col = 0; col < size; col++) {
      let module = data.get(row, col)
      if (module === lastCol) {
        sameCountCol++
      } else {
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5)
        lastCol = module
        sameCountCol = 1
      }

      module = data.get(col, row)
      if (module === lastRow) {
        sameCountRow++
      } else {
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5)
        lastRow = module
        sameCountRow = 1
      }
    }

    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5)
    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5)
  }

  return points
}

/**
 * Find 2x2 blocks with the same color and assign a penalty value
 *
 * Points: N2 * (m - 1) * (n - 1)
 */
exports.getPenaltyN2 = function getPenaltyN2 (data) {
  const size = data.size
  let points = 0

  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const last = data.get(row, col) +
        data.get(row, col + 1) +
        data.get(row + 1, col) +
        data.get(row + 1, col + 1)

      if (last === 4 || last === 0) points++
    }
  }

  return points * PenaltyScores.N2
}

/**
 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
 * preceded or followed by light area 4 modules wide
 *
 * Points: N3 * number of pattern found
 */
exports.getPenaltyN3 = function getPenaltyN3 (data) {
  const size = data.size
  let points = 0
  let bitsCol = 0
  let bitsRow = 0

  for (let row = 0; row < size; row++) {
    bitsCol = bitsRow = 0
    for (let col = 0; col < size; col++) {
      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col)
      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++

      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row)
      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++
    }
  }

  return points * PenaltyScores.N3
}

/**
 * Calculate proportion of dark modules in entire symbol
 *
 * Points: N4 * k
 *
 * k is the rating of the deviation of the proportion of dark modules
 * in the symbol from 50% in steps of 5%
 */
exports.getPenaltyN4 = function getPenaltyN4 (data) {
  let darkCount = 0
  const modulesCount = data.data.length

  for (let i = 0; i < modulesCount; i++) darkCount += data.data[i]

  const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10)

  return k * PenaltyScores.N4
}

/**
 * Return mask value at given position
 *
 * @param  {Number} maskPattern Pattern reference value
 * @param  {Number} i           Row
 * @param  {Number} j           Column
 * @return {Boolean}            Mask value
 */
function getMaskAt (maskPattern, i, j) {
  switch (maskPattern) {
    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
    case exports.Patterns.PATTERN001: return i % 2 === 0
    case exports.Patterns.PATTERN010: return j % 3 === 0
    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

    default: throw new Error('bad maskPattern:' + maskPattern)
  }
}

/**
 * Apply a mask pattern to a BitMatrix
 *
 * @param  {Number}    pattern Pattern reference number
 * @param  {BitMatrix} data    BitMatrix data
 */
exports.applyMask = function applyMask (pattern, data) {
  const size = data.size

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      if (data.isReserved(row, col)) continue
      data.xor(row, col, getMaskAt(pattern, row, col))
    }
  }
}

/**
 * Returns the best mask pattern for data
 *
 * @param  {BitMatrix} data
 * @return {Number} Mask pattern reference number
 */
exports.getBestMask = function getBestMask (data, setupFormatFunc) {
  const numPatterns = Object.keys(exports.Patterns).length
  let bestPattern = 0
  let lowerPenalty = Infinity

  for (let p = 0; p < numPatterns; p++) {
    setupFormatFunc(p)
    exports.applyMask(p, data)

    // Calculate penalty
    const penalty =
      exports.getPenaltyN1(data) +
      exports.getPenaltyN2(data) +
      exports.getPenaltyN3(data) +
      exports.getPenaltyN4(data)

    // Undo previously applied mask
    exports.applyMask(p, data)

    if (penalty < lowerPenalty) {
      lowerPenalty = penalty
      bestPattern = p
    }
  }

  return bestPattern
}

},{}],140:[function(require,module,exports){
const VersionCheck = require('./version-check')
const Regex = require('./regex')

/**
 * Numeric mode encodes data from the decimal digit set (0 - 9)
 * (byte values 30HEX to 39HEX).
 * Normally, 3 data characters are represented by 10 bits.
 *
 * @type {Object}
 */
exports.NUMERIC = {
  id: 'Numeric',
  bit: 1 << 0,
  ccBits: [10, 12, 14]
}

/**
 * Alphanumeric mode encodes data from a set of 45 characters,
 * i.e. 10 numeric digits (0 - 9),
 *      26 alphabetic characters (A - Z),
 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
 * Normally, two input characters are represented by 11 bits.
 *
 * @type {Object}
 */
exports.ALPHANUMERIC = {
  id: 'Alphanumeric',
  bit: 1 << 1,
  ccBits: [9, 11, 13]
}

/**
 * In byte mode, data is encoded at 8 bits per character.
 *
 * @type {Object}
 */
exports.BYTE = {
  id: 'Byte',
  bit: 1 << 2,
  ccBits: [8, 16, 16]
}

/**
 * The Kanji mode efficiently encodes Kanji characters in accordance with
 * the Shift JIS system based on JIS X 0208.
 * The Shift JIS values are shifted from the JIS X 0208 values.
 * JIS X 0208 gives details of the shift coded representation.
 * Each two-byte character value is compacted to a 13-bit binary codeword.
 *
 * @type {Object}
 */
exports.KANJI = {
  id: 'Kanji',
  bit: 1 << 3,
  ccBits: [8, 10, 12]
}

/**
 * Mixed mode will contain a sequences of data in a combination of any of
 * the modes described above
 *
 * @type {Object}
 */
exports.MIXED = {
  bit: -1
}

/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */
exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid version: ' + version)
  }

  if (version >= 1 && version < 10) return mode.ccBits[0]
  else if (version < 27) return mode.ccBits[1]
  return mode.ccBits[2]
}

/**
 * Returns the most efficient mode to store the specified data
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */
exports.getBestModeForData = function getBestModeForData (dataStr) {
  if (Regex.testNumeric(dataStr)) return exports.NUMERIC
  else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
  else if (Regex.testKanji(dataStr)) return exports.KANJI
  else return exports.BYTE
}

/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */
exports.toString = function toString (mode) {
  if (mode && mode.id) return mode.id
  throw new Error('Invalid mode')
}

/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */
exports.isValid = function isValid (mode) {
  return mode && mode.bit && mode.ccBits
}

/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */
function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }

  const lcStr = string.toLowerCase()

  switch (lcStr) {
    case 'numeric':
      return exports.NUMERIC
    case 'alphanumeric':
      return exports.ALPHANUMERIC
    case 'kanji':
      return exports.KANJI
    case 'byte':
      return exports.BYTE
    default:
      throw new Error('Unknown mode: ' + string)
  }
}

/**
 * Returns mode from a value.
 * If value is not a valid mode, returns defaultValue
 *
 * @param  {Mode|String} value        Encoding mode
 * @param  {Mode}        defaultValue Fallback value
 * @return {Mode}                     Encoding mode
 */
exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return value
  }

  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}

},{"./regex":145,"./version-check":148}],141:[function(require,module,exports){
const Mode = require('./mode')

function NumericData (data) {
  this.mode = Mode.NUMERIC
  this.data = data.toString()
}

NumericData.getBitsLength = function getBitsLength (length) {
  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
}

NumericData.prototype.getLength = function getLength () {
  return this.data.length
}

NumericData.prototype.getBitsLength = function getBitsLength () {
  return NumericData.getBitsLength(this.data.length)
}

NumericData.prototype.write = function write (bitBuffer) {
  let i, group, value

  // The input data string is divided into groups of three digits,
  // and each group is converted to its 10-bit binary equivalent.
  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3)
    value = parseInt(group, 10)

    bitBuffer.put(value, 10)
  }

  // If the number of input digits is not an exact multiple of three,
  // the final one or two digits are converted to 4 or 7 bits respectively.
  const remainingNum = this.data.length - i
  if (remainingNum > 0) {
    group = this.data.substr(i)
    value = parseInt(group, 10)

    bitBuffer.put(value, remainingNum * 3 + 1)
  }
}

module.exports = NumericData

},{"./mode":140}],142:[function(require,module,exports){
const GF = require('./galois-field')

/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Uint8Array} p1 Polynomial
 * @param  {Uint8Array} p2 Polynomial
 * @return {Uint8Array}    Product of p1 and p2
 */
exports.mul = function mul (p1, p2) {
  const coeff = new Uint8Array(p1.length + p2.length - 1)

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GF.mul(p1[i], p2[j])
    }
  }

  return coeff
}

/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Uint8Array} divident Polynomial
 * @param  {Uint8Array} divisor  Polynomial
 * @return {Uint8Array}          Remainder
 */
exports.mod = function mod (divident, divisor) {
  let result = new Uint8Array(divident)

  while ((result.length - divisor.length) >= 0) {
    const coeff = result[0]

    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], coeff)
    }

    // remove all zeros from buffer head
    let offset = 0
    while (offset < result.length && result[offset] === 0) offset++
    result = result.slice(offset)
  }

  return result
}

/**
 * Generate an irreducible generator polynomial of specified degree
 * (used by Reed-Solomon encoder)
 *
 * @param  {Number} degree Degree of the generator polynomial
 * @return {Uint8Array}    Buffer containing polynomial coefficients
 */
exports.generateECPolynomial = function generateECPolynomial (degree) {
  let poly = new Uint8Array([1])
  for (let i = 0; i < degree; i++) {
    poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]))
  }

  return poly
}

},{"./galois-field":137}],143:[function(require,module,exports){
const Utils = require('./utils')
const ECLevel = require('./error-correction-level')
const BitBuffer = require('./bit-buffer')
const BitMatrix = require('./bit-matrix')
const AlignmentPattern = require('./alignment-pattern')
const FinderPattern = require('./finder-pattern')
const MaskPattern = require('./mask-pattern')
const ECCode = require('./error-correction-code')
const ReedSolomonEncoder = require('./reed-solomon-encoder')
const Version = require('./version')
const FormatInfo = require('./format-info')
const Mode = require('./mode')
const Segments = require('./segments')

/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

/**
 * Add finder patterns bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupFinderPattern (matrix, version) {
  const size = matrix.size
  const pos = FinderPattern.getPositions(version)

  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0]
    const col = pos[i][1]

    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue

      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue

        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix.set(row + r, col + c, true, true)
        } else {
          matrix.set(row + r, col + c, false, true)
        }
      }
    }
  }
}

/**
 * Add timing pattern bits to matrix
 *
 * Note: this function must be called before {@link setupAlignmentPattern}
 *
 * @param  {BitMatrix} matrix Modules matrix
 */
function setupTimingPattern (matrix) {
  const size = matrix.size

  for (let r = 8; r < size - 8; r++) {
    const value = r % 2 === 0
    matrix.set(r, 6, value, true)
    matrix.set(6, r, value, true)
  }
}

/**
 * Add alignment patterns bits to matrix
 *
 * Note: this function must be called after {@link setupTimingPattern}
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupAlignmentPattern (matrix, version) {
  const pos = AlignmentPattern.getPositions(version)

  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0]
    const col = pos[i][1]

    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (r === -2 || r === 2 || c === -2 || c === 2 ||
          (r === 0 && c === 0)) {
          matrix.set(row + r, col + c, true, true)
        } else {
          matrix.set(row + r, col + c, false, true)
        }
      }
    }
  }
}

/**
 * Add version info bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupVersionInfo (matrix, version) {
  const size = matrix.size
  const bits = Version.getEncodedBits(version)
  let row, col, mod

  for (let i = 0; i < 18; i++) {
    row = Math.floor(i / 3)
    col = i % 3 + size - 8 - 3
    mod = ((bits >> i) & 1) === 1

    matrix.set(row, col, mod, true)
    matrix.set(col, row, mod, true)
  }
}

/**
 * Add format info bits to matrix
 *
 * @param  {BitMatrix} matrix               Modules matrix
 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
 * @param  {Number}    maskPattern          Mask pattern reference value
 */
function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
  const size = matrix.size
  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern)
  let i, mod

  for (i = 0; i < 15; i++) {
    mod = ((bits >> i) & 1) === 1

    // vertical
    if (i < 6) {
      matrix.set(i, 8, mod, true)
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true)
    } else {
      matrix.set(size - 15 + i, 8, mod, true)
    }

    // horizontal
    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true)
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true)
    } else {
      matrix.set(8, 15 - i - 1, mod, true)
    }
  }

  // fixed module
  matrix.set(size - 8, 8, 1, true)
}

/**
 * Add encoded data bits to matrix
 *
 * @param  {BitMatrix}  matrix Modules matrix
 * @param  {Uint8Array} data   Data codewords
 */
function setupData (matrix, data) {
  const size = matrix.size
  let inc = -1
  let row = size - 1
  let bitIndex = 7
  let byteIndex = 0

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--

    while (true) {
      for (let c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          let dark = false

          if (byteIndex < data.length) {
            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1)
          }

          matrix.set(row, col - c, dark)
          bitIndex--

          if (bitIndex === -1) {
            byteIndex++
            bitIndex = 7
          }
        }
      }

      row += inc

      if (row < 0 || size <= row) {
        row -= inc
        inc = -inc
        break
      }
    }
  }
}

/**
 * Create encoded codewords from data input
 *
 * @param  {Number}   version              QR Code version
 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
 * @param  {ByteData} data                 Data input
 * @return {Uint8Array}                    Buffer containing encoded codewords
 */
function createData (version, errorCorrectionLevel, segments) {
  // Prepare data buffer
  const buffer = new BitBuffer()

  segments.forEach(function (data) {
    // prefix data with mode indicator (4 bits)
    buffer.put(data.mode.bit, 4)

    // Prefix data with character count indicator.
    // The character count indicator is a string of bits that represents the
    // number of characters that are being encoded.
    // The character count indicator must be placed after the mode indicator
    // and must be a certain number of bits long, depending on the QR version
    // and data mode
    // @see {@link Mode.getCharCountIndicator}.
    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version))

    // add binary data sequence to buffer
    data.write(buffer)
  })

  // Calculate required number of bits
  const totalCodewords = Utils.getSymbolTotalCodewords(version)
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  // Add a terminator.
  // If the bit string is shorter than the total number of required bits,
  // a terminator of up to four 0s must be added to the right side of the string.
  // If the bit string is more than four bits shorter than the required number of bits,
  // add four 0s to the end.
  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4)
  }

  // If the bit string is fewer than four bits shorter, add only the number of 0s that
  // are needed to reach the required number of bits.

  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
  // pad the string on the right with 0s to make the string's length a multiple of 8.
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0)
  }

  // Add pad bytes if the string is still shorter than the total number of required bits.
  // Extend the buffer to fill the data capacity of the symbol corresponding to
  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
  // and 00010001 (0x11) alternately.
  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8
  for (let i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 0x11 : 0xEC, 8)
  }

  return createCodewords(buffer, version, errorCorrectionLevel)
}

/**
 * Encode input data with Reed-Solomon and return codewords with
 * relative error correction bits
 *
 * @param  {BitBuffer} bitBuffer            Data to encode
 * @param  {Number}    version              QR Code version
 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
 * @return {Uint8Array}                     Buffer containing encoded codewords
 */
function createCodewords (bitBuffer, version, errorCorrectionLevel) {
  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  const dataTotalCodewords = totalCodewords - ecTotalCodewords

  // Total number of blocks
  const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel)

  // Calculate how many blocks each group should contain
  const blocksInGroup2 = totalCodewords % ecTotalBlocks
  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2

  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks)

  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks)
  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1

  // Number of EC codewords is the same for both groups
  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1

  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
  const rs = new ReedSolomonEncoder(ecCount)

  let offset = 0
  const dcData = new Array(ecTotalBlocks)
  const ecData = new Array(ecTotalBlocks)
  let maxDataSize = 0
  const buffer = new Uint8Array(bitBuffer.buffer)

  // Divide the buffer into the required number of blocks
  for (let b = 0; b < ecTotalBlocks; b++) {
    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2

    // extract a block of data from buffer
    dcData[b] = buffer.slice(offset, offset + dataSize)

    // Calculate EC codewords for this data block
    ecData[b] = rs.encode(dcData[b])

    offset += dataSize
    maxDataSize = Math.max(maxDataSize, dataSize)
  }

  // Create final data
  // Interleave the data and error correction codewords from each block
  const data = new Uint8Array(totalCodewords)
  let index = 0
  let i, r

  // Add data codewords
  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i]
      }
    }
  }

  // Apped EC codewords
  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      data[index++] = ecData[r][i]
    }
  }

  return data
}

/**
 * Build QR Code symbol
 *
 * @param  {String} data                 Input string
 * @param  {Number} version              QR Code version
 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
 * @param  {MaskPattern} maskPattern     Mask pattern
 * @return {Object}                      Object containing symbol data
 */
function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
  let segments

  if (Array.isArray(data)) {
    segments = Segments.fromArray(data)
  } else if (typeof data === 'string') {
    let estimatedVersion = version

    if (!estimatedVersion) {
      const rawSegments = Segments.rawSplit(data)

      // Estimate best version that can contain raw splitted segments
      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel)
    }

    // Build optimized segments
    // If estimated version is undefined, try with the highest version
    segments = Segments.fromString(data, estimatedVersion || 40)
  } else {
    throw new Error('Invalid data')
  }

  // Get the min version that can contain data
  const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel)

  // If no version is found, data cannot be stored
  if (!bestVersion) {
    throw new Error('The amount of data is too big to be stored in a QR Code')
  }

  // If not specified, use min version as default
  if (!version) {
    version = bestVersion

  // Check if the specified version can contain the data
  } else if (version < bestVersion) {
    throw new Error('\n' +
      'The chosen QR Code version cannot contain this amount of data.\n' +
      'Minimum version required to store current data is: ' + bestVersion + '.\n'
    )
  }

  const dataBits = createData(version, errorCorrectionLevel, segments)

  // Allocate matrix buffer
  const moduleCount = Utils.getSymbolSize(version)
  const modules = new BitMatrix(moduleCount)

  // Add function modules
  setupFinderPattern(modules, version)
  setupTimingPattern(modules)
  setupAlignmentPattern(modules, version)

  // Add temporary dummy bits for format info just to set them as reserved.
  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
  // since the masking operation must be performed only on the encoding region.
  // These blocks will be replaced with correct values later in code.
  setupFormatInfo(modules, errorCorrectionLevel, 0)

  if (version >= 7) {
    setupVersionInfo(modules, version)
  }

  // Add data codewords
  setupData(modules, dataBits)

  if (isNaN(maskPattern)) {
    // Find best mask pattern
    maskPattern = MaskPattern.getBestMask(modules,
      setupFormatInfo.bind(null, modules, errorCorrectionLevel))
  }

  // Apply mask pattern
  MaskPattern.applyMask(maskPattern, modules)

  // Replace format info bits with correct values
  setupFormatInfo(modules, errorCorrectionLevel, maskPattern)

  return {
    modules: modules,
    version: version,
    errorCorrectionLevel: errorCorrectionLevel,
    maskPattern: maskPattern,
    segments: segments
  }
}

/**
 * QR Code
 *
 * @param {String | Array} data                 Input data
 * @param {Object} options                      Optional configurations
 * @param {Number} options.version              QR Code version
 * @param {String} options.errorCorrectionLevel Error correction level
 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
 */
exports.create = function create (data, options) {
  if (typeof data === 'undefined' || data === '') {
    throw new Error('No input text')
  }

  let errorCorrectionLevel = ECLevel.M
  let version
  let mask

  if (typeof options !== 'undefined') {
    // Use higher error correction level as default
    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M)
    version = Version.from(options.version)
    mask = MaskPattern.from(options.maskPattern)

    if (options.toSJISFunc) {
      Utils.setToSJISFunction(options.toSJISFunc)
    }
  }

  return createSymbol(data, version, errorCorrectionLevel, mask)
}

},{"./alignment-pattern":128,"./bit-buffer":130,"./bit-matrix":131,"./error-correction-code":133,"./error-correction-level":134,"./finder-pattern":135,"./format-info":136,"./mask-pattern":139,"./mode":140,"./reed-solomon-encoder":144,"./segments":146,"./utils":147,"./version":149}],144:[function(require,module,exports){
const Polynomial = require('./polynomial')

function ReedSolomonEncoder (degree) {
  this.genPoly = undefined
  this.degree = degree

  if (this.degree) this.initialize(this.degree)
}

/**
 * Initialize the encoder.
 * The input param should correspond to the number of error correction codewords.
 *
 * @param  {Number} degree
 */
ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
  // create an irreducible generator polynomial
  this.degree = degree
  this.genPoly = Polynomial.generateECPolynomial(this.degree)
}

/**
 * Encodes a chunk of data
 *
 * @param  {Uint8Array} data Buffer containing input data
 * @return {Uint8Array}      Buffer containing encoded data
 */
ReedSolomonEncoder.prototype.encode = function encode (data) {
  if (!this.genPoly) {
    throw new Error('Encoder not initialized')
  }

  // Calculate EC for this data block
  // extends data size to data+genPoly size
  const paddedData = new Uint8Array(data.length + this.degree)
  paddedData.set(data)

  // The error correction codewords are the remainder after dividing the data codewords
  // by a generator polynomial
  const remainder = Polynomial.mod(paddedData, this.genPoly)

  // return EC data blocks (last n byte, where n is the degree of genPoly)
  // If coefficients number in remainder are less than genPoly degree,
  // pad with 0s to the left to reach the needed number of coefficients
  const start = this.degree - remainder.length
  if (start > 0) {
    const buff = new Uint8Array(this.degree)
    buff.set(remainder, start)

    return buff
  }

  return remainder
}

module.exports = ReedSolomonEncoder

},{"./polynomial":142}],145:[function(require,module,exports){
const numeric = '[0-9]+'
const alphanumeric = '[A-Z $%*+\\-./:]+'
let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+'
kanji = kanji.replace(/u/g, '\\u')

const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+'

exports.KANJI = new RegExp(kanji, 'g')
exports.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g')
exports.BYTE = new RegExp(byte, 'g')
exports.NUMERIC = new RegExp(numeric, 'g')
exports.ALPHANUMERIC = new RegExp(alphanumeric, 'g')

const TEST_KANJI = new RegExp('^' + kanji + '$')
const TEST_NUMERIC = new RegExp('^' + numeric + '$')
const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$')

exports.testKanji = function testKanji (str) {
  return TEST_KANJI.test(str)
}

exports.testNumeric = function testNumeric (str) {
  return TEST_NUMERIC.test(str)
}

exports.testAlphanumeric = function testAlphanumeric (str) {
  return TEST_ALPHANUMERIC.test(str)
}

},{}],146:[function(require,module,exports){
const Mode = require('./mode')
const NumericData = require('./numeric-data')
const AlphanumericData = require('./alphanumeric-data')
const ByteData = require('./byte-data')
const KanjiData = require('./kanji-data')
const Regex = require('./regex')
const Utils = require('./utils')
const dijkstra = require('dijkstrajs')

/**
 * Returns UTF8 byte length
 *
 * @param  {String} str Input string
 * @return {Number}     Number of byte
 */
function getStringByteLength (str) {
  return unescape(encodeURIComponent(str)).length
}

/**
 * Get a list of segments of the specified mode
 * from a string
 *
 * @param  {Mode}   mode Segment mode
 * @param  {String} str  String to process
 * @return {Array}       Array of object with segments data
 */
function getSegments (regex, mode, str) {
  const segments = []
  let result

  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length
    })
  }

  return segments
}

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 *
 * @param  {String} dataStr Input string
 * @return {Array}          Array of object with segments data
 */
function getSegmentsFromString (dataStr) {
  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr)
  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr)
  let byteSegs
  let kanjiSegs

  if (Utils.isKanjiModeEnabled()) {
    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr)
    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr)
  } else {
    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr)
    kanjiSegs = []
  }

  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs)

  return segs
    .sort(function (s1, s2) {
      return s1.index - s2.index
    })
    .map(function (obj) {
      return {
        data: obj.data,
        mode: obj.mode,
        length: obj.length
      }
    })
}

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 *
 * @param  {Number} length String length
 * @param  {Mode} mode     Segment mode
 * @return {Number}        Bit length
 */
function getSegmentBitsLength (length, mode) {
  switch (mode) {
    case Mode.NUMERIC:
      return NumericData.getBitsLength(length)
    case Mode.ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length)
    case Mode.KANJI:
      return KanjiData.getBitsLength(length)
    case Mode.BYTE:
      return ByteData.getBitsLength(length)
  }
}

/**
 * Merges adjacent segments which have the same mode
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function mergeSegments (segs) {
  return segs.reduce(function (acc, curr) {
    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null
    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1].data += curr.data
      return acc
    }

    acc.push(curr)
    return acc
  }, [])
}

/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function buildNodes (segs) {
  const nodes = []
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([seg,
          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
          { data: seg.data, mode: Mode.BYTE, length: seg.length }
        ])
        break
      case Mode.ALPHANUMERIC:
        nodes.push([seg,
          { data: seg.data, mode: Mode.BYTE, length: seg.length }
        ])
        break
      case Mode.KANJI:
        nodes.push([seg,
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
        ])
        break
      case Mode.BYTE:
        nodes.push([
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
        ])
    }
  }

  return nodes
}

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 *
 * @param  {Array} nodes    Array of object with segments data
 * @param  {Number} version QR Code version
 * @return {Object}         Graph of all possible segments
 */
function buildGraph (nodes, version) {
  const table = {}
  const graph = { start: {} }
  let prevNodeIds = ['start']

  for (let i = 0; i < nodes.length; i++) {
    const nodeGroup = nodes[i]
    const currentNodeIds = []

    for (let j = 0; j < nodeGroup.length; j++) {
      const node = nodeGroup[j]
      const key = '' + i + j

      currentNodeIds.push(key)
      table[key] = { node: node, lastCount: 0 }
      graph[key] = {}

      for (let n = 0; n < prevNodeIds.length; n++) {
        const prevNodeId = prevNodeIds[n]

        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
          graph[prevNodeId][key] =
            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode)

          table[prevNodeId].lastCount += node.length
        } else {
          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length

          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
            4 + Mode.getCharCountIndicator(node.mode, version) // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds
  }

  for (let n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]].end = 0
  }

  return { map: graph, table: table }
}

/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the more suitable will be used.
 *
 * @param  {String} data             Input data
 * @param  {Mode | String} modesHint Data mode
 * @return {Segment}                 Segment
 */
function buildSingleSegment (data, modesHint) {
  let mode
  const bestMode = Mode.getBestModeForData(data)

  mode = Mode.from(modesHint, bestMode)

  // Make sure data can be encoded
  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
    throw new Error('"' + data + '"' +
      ' cannot be encoded with mode ' + Mode.toString(mode) +
      '.\n Suggested mode is: ' + Mode.toString(bestMode))
  }

  // Use Mode.BYTE if Kanji support is disabled
  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
    mode = Mode.BYTE
  }

  switch (mode) {
    case Mode.NUMERIC:
      return new NumericData(data)

    case Mode.ALPHANUMERIC:
      return new AlphanumericData(data)

    case Mode.KANJI:
      return new KanjiData(data)

    case Mode.BYTE:
      return new ByteData(data)
  }
}

/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 *
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 *
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 *
 * @param  {Array} array Array of objects with segments data
 * @return {Array}       Array of Segments
 */
exports.fromArray = function fromArray (array) {
  return array.reduce(function (acc, seg) {
    if (typeof seg === 'string') {
      acc.push(buildSingleSegment(seg, null))
    } else if (seg.data) {
      acc.push(buildSingleSegment(seg.data, seg.mode))
    }

    return acc
  }, [])
}

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 *
 * @param  {String} data    Input string
 * @param  {Number} version QR Code version
 * @return {Array}          Array of segments
 */
exports.fromString = function fromString (data, version) {
  const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled())

  const nodes = buildNodes(segs)
  const graph = buildGraph(nodes, version)
  const path = dijkstra.find_path(graph.map, 'start', 'end')

  const optimizedSegs = []
  for (let i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]].node)
  }

  return exports.fromArray(mergeSegments(optimizedSegs))
}

/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 *
 * @param  {string} data Input string
 * @return {Array}       Array of segments
 */
exports.rawSplit = function rawSplit (data) {
  return exports.fromArray(
    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
  )
}

},{"./alphanumeric-data":129,"./byte-data":132,"./kanji-data":138,"./mode":140,"./numeric-data":141,"./regex":145,"./utils":147,"dijkstrajs":120}],147:[function(require,module,exports){
let toSJISFunction
const CODEWORDS_COUNT = [
  0, // Not used
  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
]

/**
 * Returns the QR Code size for the specified version
 *
 * @param  {Number} version QR Code version
 * @return {Number}         size of QR code
 */
exports.getSymbolSize = function getSymbolSize (version) {
  if (!version) throw new Error('"version" cannot be null or undefined')
  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
  return version * 4 + 17
}

/**
 * Returns the total number of codewords used to store data and EC information.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Data length in bits
 */
exports.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
  return CODEWORDS_COUNT[version]
}

/**
 * Encode data with Bose-Chaudhuri-Hocquenghem
 *
 * @param  {Number} data Value to encode
 * @return {Number}      Encoded value
 */
exports.getBCHDigit = function (data) {
  let digit = 0

  while (data !== 0) {
    digit++
    data >>>= 1
  }

  return digit
}

exports.setToSJISFunction = function setToSJISFunction (f) {
  if (typeof f !== 'function') {
    throw new Error('"toSJISFunc" is not a valid function.')
  }

  toSJISFunction = f
}

exports.isKanjiModeEnabled = function () {
  return typeof toSJISFunction !== 'undefined'
}

exports.toSJIS = function toSJIS (kanji) {
  return toSJISFunction(kanji)
}

},{}],148:[function(require,module,exports){
/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValid = function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}

},{}],149:[function(require,module,exports){
const Utils = require('./utils')
const ECCode = require('./error-correction-code')
const ECLevel = require('./error-correction-level')
const Mode = require('./mode')
const VersionCheck = require('./version-check')

// Generator polynomial used to encode version information
const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
const G18_BCH = Utils.getBCHDigit(G18)

function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion
    }
  }

  return undefined
}

function getReservedBitsCount (mode, version) {
  // Character count indicator + mode indicator bits
  return Mode.getCharCountIndicator(mode, version) + 4
}

function getTotalBitsFromDataArray (segments, version) {
  let totalBits = 0

  segments.forEach(function (data) {
    const reservedBits = getReservedBitsCount(data.mode, version)
    totalBits += reservedBits + data.getBitsLength()
  })

  return totalBits
}

function getBestVersionForMixedData (segments, errorCorrectionLevel) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    const length = getTotalBitsFromDataArray(segments, currentVersion)
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
      return currentVersion
    }
  }

  return undefined
}

/**
 * Returns version number from a value.
 * If value is not a valid version, returns defaultValue
 *
 * @param  {Number|String} value        QR Code version
 * @param  {Number}        defaultValue Fallback value
 * @return {Number}                     QR Code version number
 */
exports.from = function from (value, defaultValue) {
  if (VersionCheck.isValid(value)) {
    return parseInt(value, 10)
  }

  return defaultValue
}

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {Number} version              QR Code version (1-40)
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Mode}   mode                 Data mode
 * @return {Number}                      Quantity of storable data
 */
exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid QR Code version')
  }

  // Use Byte mode as default
  if (typeof mode === 'undefined') mode = Mode.BYTE

  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  if (mode === Mode.MIXED) return dataTotalCodewordsBits

  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version)

  // Return max number of storable codewords
  switch (mode) {
    case Mode.NUMERIC:
      return Math.floor((usableBits / 10) * 3)

    case Mode.ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2)

    case Mode.KANJI:
      return Math.floor(usableBits / 13)

    case Mode.BYTE:
    default:
      return Math.floor(usableBits / 8)
  }
}

/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {Segment} data                    Segment of data
 * @param  {Number} [errorCorrectionLevel=H] Error correction level
 * @param  {Mode} mode                       Data mode
 * @return {Number}                          QR Code version
 */
exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
  let seg

  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M)

  if (Array.isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl)
    }

    if (data.length === 0) {
      return 1
    }

    seg = data[0]
  } else {
    seg = data
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
}

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Encoded version info bits
 */
exports.getEncodedBits = function getEncodedBits (version) {
  if (!VersionCheck.isValid(version) || version < 7) {
    throw new Error('Invalid QR Code version')
  }

  let d = version << 12

  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH))
  }

  return (version << 12) | d
}

},{"./error-correction-code":133,"./error-correction-level":134,"./mode":140,"./utils":147,"./version-check":148}],150:[function(require,module,exports){
const Utils = require('./utils')

function clearCanvas (ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!canvas.style) canvas.style = {}
  canvas.height = size
  canvas.width = size
  canvas.style.height = size + 'px'
  canvas.style.width = size + 'px'
}

function getCanvasElement () {
  try {
    return document.createElement('canvas')
  } catch (e) {
    throw new Error('You need to specify a canvas element')
  }
}

exports.render = function render (qrData, canvas, options) {
  let opts = options
  let canvasEl = canvas

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!canvas) {
    canvasEl = getCanvasElement()
  }

  opts = Utils.getOptions(opts)
  const size = Utils.getImageWidth(qrData.modules.size, opts)

  const ctx = canvasEl.getContext('2d')
  const image = ctx.createImageData(size, size)
  Utils.qrToImageData(image.data, qrData, opts)

  clearCanvas(ctx, canvasEl, size)
  ctx.putImageData(image, 0, 0)

  return canvasEl
}

exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
  let opts = options

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  const canvasEl = exports.render(qrData, canvas, opts)

  const type = opts.type || 'image/png'
  const rendererOpts = opts.rendererOpts || {}

  return canvasEl.toDataURL(type, rendererOpts.quality)
}

},{"./utils":152}],151:[function(require,module,exports){
const Utils = require('./utils')

function getColorAttrib (color, attrib) {
  const alpha = color.a / 255
  const str = attrib + '="' + color.hex + '"'

  return alpha < 1
    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
    : str
}

function svgCmd (cmd, x, y) {
  let str = cmd + x
  if (typeof y !== 'undefined') str += ' ' + y

  return str
}

function qrToPath (data, size, margin) {
  let path = ''
  let moveBy = 0
  let newRow = false
  let lineLength = 0

  for (let i = 0; i < data.length; i++) {
    const col = Math.floor(i % size)
    const row = Math.floor(i / size)

    if (!col && !newRow) newRow = true

    if (data[i]) {
      lineLength++

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow
          ? svgCmd('M', col + margin, 0.5 + row + margin)
          : svgCmd('m', moveBy, 0)

        moveBy = 0
        newRow = false
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd('h', lineLength)
        lineLength = 0
      }
    } else {
      moveBy++
    }
  }

  return path
}

exports.render = function render (qrData, options, cb) {
  const opts = Utils.getOptions(options)
  const size = qrData.modules.size
  const data = qrData.modules.data
  const qrcodesize = size + opts.margin * 2

  const bg = !opts.color.light.a
    ? ''
    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>'

  const path =
    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
    ' d="' + qrToPath(data, size, opts.margin) + '"/>'

  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"'

  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" '

  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n'

  if (typeof cb === 'function') {
    cb(null, svgTag)
  }

  return svgTag
}

},{"./utils":152}],152:[function(require,module,exports){
function hex2rgba (hex) {
  if (typeof hex === 'number') {
    hex = hex.toString()
  }

  if (typeof hex !== 'string') {
    throw new Error('Color should be defined as hex string')
  }

  let hexCode = hex.slice().replace('#', '').split('')
  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
    throw new Error('Invalid hex color: ' + hex)
  }

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length === 3 || hexCode.length === 4) {
    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
      return [c, c]
    }))
  }

  // Add default alpha value
  if (hexCode.length === 6) hexCode.push('F', 'F')

  const hexValue = parseInt(hexCode.join(''), 16)

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255,
    hex: '#' + hexCode.slice(0, 6).join('')
  }
}

exports.getOptions = function getOptions (options) {
  if (!options) options = {}
  if (!options.color) options.color = {}

  const margin = typeof options.margin === 'undefined' ||
    options.margin === null ||
    options.margin < 0
    ? 4
    : options.margin

  const width = options.width && options.width >= 21 ? options.width : undefined
  const scale = options.scale || 4

  return {
    width: width,
    scale: width ? 4 : scale,
    margin: margin,
    color: {
      dark: hex2rgba(options.color.dark || '#000000ff'),
      light: hex2rgba(options.color.light || '#ffffffff')
    },
    type: options.type,
    rendererOpts: options.rendererOpts || {}
  }
}

exports.getScale = function getScale (qrSize, opts) {
  return opts.width && opts.width >= qrSize + opts.margin * 2
    ? opts.width / (qrSize + opts.margin * 2)
    : opts.scale
}

exports.getImageWidth = function getImageWidth (qrSize, opts) {
  const scale = exports.getScale(qrSize, opts)
  return Math.floor((qrSize + opts.margin * 2) * scale)
}

exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
  const size = qr.modules.size
  const data = qr.modules.data
  const scale = exports.getScale(size, opts)
  const symbolSize = Math.floor((size + opts.margin * 2) * scale)
  const scaledMargin = opts.margin * scale
  const palette = [opts.color.light, opts.color.dark]

  for (let i = 0; i < symbolSize; i++) {
    for (let j = 0; j < symbolSize; j++) {
      let posDst = (i * symbolSize + j) * 4
      let pxColor = opts.color.light

      if (i >= scaledMargin && j >= scaledMargin &&
        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
        const iSrc = Math.floor((i - scaledMargin) / scale)
        const jSrc = Math.floor((j - scaledMargin) / scale)
        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0]
      }

      imgData[posDst++] = pxColor.r
      imgData[posDst++] = pxColor.g
      imgData[posDst++] = pxColor.b
      imgData[posDst] = pxColor.a
    }
  }
}

},{}],153:[function(require,module,exports){
/********************************************************************************
    vCards-js, Eric J Nesser, November 2014
********************************************************************************/
/*jslint node: true */
'use strict';

/**
 * Represents a contact that can be imported into Outlook, iOS, Mac OS, Android devices, and more
 */
var vCard = (function () {
    /**
     * Get photo object for storing photos in vCards
     */
    function getPhoto() {
        return {
            url: '',
            mediaType: '',
            base64: false,

            /**
             * Attach a photo from a URL
             * @param  {string} url       URL where photo can be found
             * @param  {string} mediaType Media type of photo (JPEG, PNG, GIF)
             */
            attachFromUrl: function(url, mediaType) {
                this.url = url;
                this.mediaType = mediaType;
                this.base64 = false;
            },

            /**
             * Embed a photo from a file using base-64 encoding (not implemented yet)
             * @param  {string} filename
             */
            embedFromFile: function(fileLocation) {
              var fs   = require('fs');
              var path = require('path');
              this.mediaType = path.extname(fileLocation).toUpperCase().replace(/\./g, "");
              var imgData = fs.readFileSync(fileLocation);
              this.url = imgData.toString('base64');
              this.base64 = true;
            },

            /**
             * Embed a photo from a base-64 string
             * @param  {string} base64String
             */
            embedFromString: function(base64String, mediaType) {
              this.mediaType = mediaType;
              this.url = base64String;
              this.base64 = true;
            }
        };
    }

    /**
     * Get a mailing address to attach to a vCard.
     */
    function getMailingAddress() {
        return {
            /**
             * Represents the actual text that should be put on the mailing label when delivering a physical package
             * @type {String}
             */
            label: '',

            /**
             * Street address
             * @type {String}
             */
            street: '',

            /**
             * City
             * @type {String}
             */
            city: '',

            /**
             * State or province
             * @type {String}
             */
            stateProvince: '',

            /**
             * Postal code
             * @type {String}
             */
            postalCode: '',

            /**
             * Country or region
             * @type {String}
             */
            countryRegion: ''
        };
    }

    /**
     * Get social media URLs
     * @return {object} Social media URL hash group
     */
    function getSocialUrls() {
        return {
            'facebook': '',
            'linkedIn': '',
            'twitter': '',
            'flickr': ''
        };
    }

    /********************************************************************************
     * Public interface for vCard
     ********************************************************************************/
    return {

        /**
         * Specifies a value that represents a persistent, globally unique identifier associated with the vCard
         * @type {String}
         */
        uid: '',

        /**
         * Date of birth
         * @type {Datetime}
         */
        birthday: '',

        /**
         * Cell phone number
         * @type {String}
         */
        cellPhone: '',

        /**
         * Other cell phone number or pager
         * @type {String}
         */
        pagerPhone: '',

        /**
         * The address for private electronic mail communication
         * @type {String}
         */
        email: '',

        /**
         * The address for work-related electronic mail communication
         * @type {String}
         */
        workEmail: '',

        /**
         * First name
         * @type {String}
         */
        firstName: '',

        /**
         * Formatted name string associated with the vCard object (will automatically populate if not set)
         * @type {String}
         */
        formattedName: '',

        /**
         * Gender.
         * @type {String} Must be M or F for Male or Female
         */
        gender: '',

        /**
         * Home mailing address
         * @type {object}
         */
        homeAddress: getMailingAddress(),

        /**
         * Home phone
         * @type {String}
         */
        homePhone: '',

        /**
         * Home facsimile
         * @type {String}
         */
        homeFax: '',

        /**
         * Last name
         * @type {String}
         */
        lastName: '',

        /**
         * Logo
         * @type {object}
         */
        logo: getPhoto(),

        /**
         * Middle name
         * @type {String}
         */
        middleName: '',

        /**
         * Prefix for individual's name
         * @type {String}
         */
        namePrefix: '',

        /**
         * Suffix for individual's name
         * @type {String}
         */
        nameSuffix: '',

        /**
         * Nickname of individual
         * @type {String}
         */
        nickname: '',

        /**
         * Specifies supplemental information or a comment that is associated with the vCard
         * @type {String}
         */
        note: '',

        /**
         * The name and optionally the unit(s) of the organization associated with the vCard object
         * @type {String}
         */
        organization: '',

        /**
         * Individual's photo
         * @type {object}
         */
        photo: getPhoto(),

        /**
         * The role, occupation, or business category of the vCard object within an organization
         * @type {String}
         */
        role: '',

        /**
         * Social URLs attached to the vCard object (ex: Facebook, Twitter, LinkedIn)
         * @type {String}
         */
        socialUrls: getSocialUrls(),

        /**
         * A URL that can be used to get the latest version of this vCard
         * @type {String}
         */
        source: '',

        /**
         * Specifies the job title, functional position or function of the individual within an organization
         * @type {String}
         */
        title: '',

        /**
         * URL pointing to a website that represents the person in some way
         * @type {String}
         */
        url: '',

        /**
         * URL pointing to a website that represents the person's work in some way
         * @type {String}
         */
        workUrl: '',

        /**
         * Work mailing address
         * @type {object}
         */
        workAddress: getMailingAddress(),

        /**
         * Work phone
         * @type {String}
         */
        workPhone: '',

        /**
         * Work facsimile
         * @type {String}
         */
        workFax: '',

        /**
         * vCard version
         * @type {String}
         */
        version: '3.0',

        /**
         * Get major version of the vCard format
         * @return {integer}
         */
        getMajorVersion: function() {
            var majorVersionString = this.version ? this.version.split('.')[0] : '4';
            if (!isNaN(majorVersionString)) {
                return parseInt(majorVersionString);
            }
            return 4;
        },

        /**
         * Get formatted vCard
         * @return {String} Formatted vCard in VCF format
         */
        getFormattedString: function() {
            var vCardFormatter = require('./lib/vCardFormatter');
            return vCardFormatter.getFormattedString(this);
        },

        /**
         * Save formatted vCard to file
         * @param  {String} filename
         */
        saveToFile: function(filename) {
            var vCardFormatter = require('./lib/vCardFormatter');
            var contents = vCardFormatter.getFormattedString(this);

            var fs = require('fs');
            fs.writeFileSync(filename, contents, { encoding: 'utf8' });
        }
    };
});

module.exports = vCard;

},{"./lib/vCardFormatter":154,"fs":118,"path":124}],154:[function(require,module,exports){
/********************************************************************************
 vCards-js, Eric J Nesser, November 2014,
 ********************************************************************************/
/*jslint node: true */
'use strict';

/**
 * vCard formatter for formatting vCards in VCF format
 */
(function vCardFormatter() {
	var majorVersion = '3';

	/**
	 * Encode string
	 * @param  {String}     value to encode
	 * @return {String}     encoded string
	 */
	function e(value) {
		if (value) {
			if (typeof(value) !== 'string') {
				value = '' + value;
			}
			return value.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
		}
		return '';
	}

	/**
	 * Return new line characters
	 * @return {String} new line characters
	 */
	function nl() {
		return '\r\n';
	}

	/**
	 * Get formatted photo
	 * @param  {String} photoType       Photo type (PHOTO, LOGO)
	 * @param  {String} url             URL to attach photo from
	 * @param  {String} mediaType       Media-type of photo (JPEG, PNG, GIF)
	 * @return {String}                 Formatted photo
	 */
	function getFormattedPhoto(photoType, url, mediaType, base64) {

		var params;

		if (majorVersion >= 4) {
			params = base64 ? ';ENCODING=b;MEDIATYPE=image/' : ';MEDIATYPE=image/';
		} else if (majorVersion === 3) {
			params = base64 ? ';ENCODING=b;TYPE=' : ';TYPE=';
		} else {
			params = base64 ? ';ENCODING=BASE64;' : ';';
		}

		var formattedPhoto = photoType + params + mediaType + ':' + e(url) + nl();
		return formattedPhoto;
	}

	/**
	 * Get formatted address
	 * @param  {object}         address
	 * @param  {object}         encoding prefix
	 * @return {String}         Formatted address
	 */
	function getFormattedAddress(encodingPrefix, address) {

		var formattedAddress = '';

		if (address.details.label ||
			address.details.street ||
			address.details.city ||
			address.details.stateProvince ||
			address.details.postalCode ||
			address.details.countryRegion) {

			if (majorVersion >= 4) {
				formattedAddress = 'ADR' + encodingPrefix + ';TYPE=' + address.type +
					(address.details.label ? ';LABEL="' + e(address.details.label) + '"' : '') + ':;;' +
					e(address.details.street) + ';' +
					e(address.details.city) + ';' +
					e(address.details.stateProvince) + ';' +
					e(address.details.postalCode) + ';' +
					e(address.details.countryRegion) + nl();
			} else {
				if (address.details.label) {
					formattedAddress = 'LABEL' + encodingPrefix + ';TYPE=' + address.type + ':' + e(address.details.label) + nl();
				}
				formattedAddress += 'ADR' + encodingPrefix + ';TYPE=' + address.type + ':;;' +
					e(address.details.street) + ';' +
					e(address.details.city) + ';' +
					e(address.details.stateProvince) + ';' +
					e(address.details.postalCode) + ';' +
					e(address.details.countryRegion) + nl();

			}
		}

		return formattedAddress;
	}

	/**
	 * Convert date to YYYYMMDD format
	 * @param  {Date}       date to encode
	 * @return {String}     encoded date
	 */
	function YYYYMMDD(date) {
		return date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
	}

	module.exports = {

		/**
		 * Get formatted vCard in VCF format
		 * @param  {object}     vCard object
		 * @return {String}     Formatted vCard in VCF format
		 */
		getFormattedString: function(vCard) {

			majorVersion = vCard.getMajorVersion();

			var formattedVCardString = '';
			formattedVCardString += 'BEGIN:VCARD' + nl();
			formattedVCardString += 'VERSION:' + vCard.version + nl();

			var encodingPrefix = majorVersion >= 4 ? '' : ';CHARSET=UTF-8';
			var formattedName = vCard.formattedName;

			if (!formattedName) {
				formattedName = '';

				[vCard.firstName, vCard.middleName, vCard.lastName]
					.forEach(function(name) {
						if (name) {
							if (formattedName) {
								formattedName += ' ';
							}
						}
						formattedName += name;
					});
			}

			formattedVCardString += 'FN' + encodingPrefix + ':' + e(formattedName) + nl();
			formattedVCardString += 'N' + encodingPrefix + ':' +
				e(vCard.lastName) + ';' +
				e(vCard.firstName) + ';' +
				e(vCard.middleName) + ';' +
				e(vCard.namePrefix) + ';' +
				e(vCard.nameSuffix) + nl();

			if (vCard.nickname && majorVersion >= 3) {
				formattedVCardString += 'NICKNAME' + encodingPrefix + ':' + e(vCard.nickname) + nl();
			}

			if (vCard.gender) {
				formattedVCardString += 'GENDER:' + e(vCard.gender) + nl();
			}

			if (vCard.uid) {
				formattedVCardString += 'UID' + encodingPrefix + ':' + e(vCard.uid) + nl();
			}

			if (vCard.birthday) {
				formattedVCardString += 'BDAY:' + YYYYMMDD(vCard.birthday) + nl();
			}

			if (vCard.anniversary) {
				formattedVCardString += 'ANNIVERSARY:' + YYYYMMDD(vCard.anniversary) + nl();
			}

			if (vCard.email) {
				if(!Array.isArray(vCard.email)){
					vCard.email = [vCard.email];
				}
				vCard.email.forEach(
					function(address) {
						if (majorVersion >= 4) {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';type=HOME:' + e(address) + nl();
						} else if (majorVersion >= 3 && majorVersion < 4) {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';type=HOME,INTERNET:' + e(address) + nl();
						} else {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';HOME;INTERNET:' + e(address) + nl();
						}
					}
				);
			}

			if (vCard.workEmail) {
				if(!Array.isArray(vCard.workEmail)){
					vCard.workEmail = [vCard.workEmail];
				}
				vCard.workEmail.forEach(
					function(address) {
						if (majorVersion >= 4) {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';type=WORK:' + e(address) + nl();
						} else if (majorVersion >= 3 && majorVersion < 4) {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';type=WORK,INTERNET:' + e(address) + nl();
						} else {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';WORK;INTERNET:' + e(address) + nl();
						}
					}
				);
			}

			if (vCard.otherEmail) {
				if(!Array.isArray(vCard.otherEmail)){
					vCard.otherEmail = [vCard.otherEmail];
				}
				vCard.otherEmail.forEach(
					function(address) {
						if (majorVersion >= 4) {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';type=OTHER:' + e(address) + nl();
						} else if (majorVersion >= 3 && majorVersion < 4) {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';type=OTHER,INTERNET:' + e(address) + nl();
						} else {
							formattedVCardString += 'EMAIL' + encodingPrefix + ';OTHER;INTERNET:' + e(address) + nl();
						}
					}
				);
			}

			if (vCard.logo.url) {
				formattedVCardString += getFormattedPhoto('LOGO', vCard.logo.url, vCard.logo.mediaType, vCard.logo.base64);
			}

			if (vCard.photo.url) {
				formattedVCardString += getFormattedPhoto('PHOTO', vCard.photo.url, vCard.photo.mediaType, vCard.photo.base64);
			}

			if (vCard.cellPhone) {
				if(!Array.isArray(vCard.cellPhone)){
					vCard.cellPhone = [vCard.cellPhone];
				}
				vCard.cellPhone.forEach(
					function(number){
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,cell":tel:' + e(number) + nl();
						} else {
							formattedVCardString += 'TEL;TYPE=CELL:' + e(number) + nl();
						}
					}
				);
			}

			if (vCard.pagerPhone) {
				if(!Array.isArray(vCard.pagerPhone)){
					vCard.pagerPhone = [vCard.pagerPhone];
				}
				vCard.pagerPhone.forEach(
					function(number) {
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="pager,cell":tel:' + e(number) + nl();
						} else {
							formattedVCardString += 'TEL;TYPE=PAGER:' + e(number) + nl();
						}
					}
				);
			}

			if (vCard.homePhone) {
				if(!Array.isArray(vCard.homePhone)){
					vCard.homePhone = [vCard.homePhone];
				}
				vCard.homePhone.forEach(
					function(number) {
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,home":tel:' + e(number) + nl();
						} else {
							formattedVCardString += 'TEL;TYPE=HOME,VOICE:' + e(number) + nl();
						}
					}
				);
			}

			if (vCard.workPhone) {
				if(!Array.isArray(vCard.workPhone)){
					vCard.workPhone = [vCard.workPhone];
				}
				vCard.workPhone.forEach(
					function(number) {
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,work":tel:' + e(number) + nl();

						} else {
							formattedVCardString += 'TEL;TYPE=WORK,VOICE:' + e(number) + nl();
						}
					}
				);
			}

			if (vCard.homeFax) {
				if(!Array.isArray(vCard.homeFax)){
					vCard.homeFax = [vCard.homeFax];
				}
				vCard.homeFax.forEach(
					function(number) {
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,home":tel:' + e(number) + nl();

						} else {
							formattedVCardString += 'TEL;TYPE=HOME,FAX:' + e(number) + nl();
						}
					}
				);
			}

			if (vCard.workFax) {
				if(!Array.isArray(vCard.workFax)){
					vCard.workFax = [vCard.workFax];
				}
				vCard.workFax.forEach(
					function(number) {
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,work":tel:' + e(number) + nl();

						} else {
							formattedVCardString += 'TEL;TYPE=WORK,FAX:' + e(number) + nl();
						}
					}
				);
			}

			if (vCard.otherPhone) {
				if(!Array.isArray(vCard.otherPhone)){
					vCard.otherPhone = [vCard.otherPhone];
				}
				vCard.otherPhone.forEach(
					function(number) {
						if (majorVersion >= 4) {
							formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,other":tel:' + e(number) + nl();

						} else {
							formattedVCardString += 'TEL;TYPE=OTHER:' + e(number) + nl();
						}
					}
				);
			}

			[{
				details: vCard.homeAddress,
				type: 'HOME'
			}, {
				details: vCard.workAddress,
				type: 'WORK'
			}].forEach(
				function(address) {
					formattedVCardString += getFormattedAddress(encodingPrefix, address);
				}
			);

			if (vCard.title) {
				formattedVCardString += 'TITLE' + encodingPrefix + ':' + e(vCard.title) + nl();
			}

			if (vCard.role) {
				formattedVCardString += 'ROLE' + encodingPrefix + ':' + e(vCard.role) + nl();
			}

			if (vCard.organization) {
				formattedVCardString += 'ORG' + encodingPrefix + ':' + e(vCard.organization) + nl();
			}

			if (vCard.url) {
				formattedVCardString += 'URL' + encodingPrefix + ':' + e(vCard.url) + nl();
			}

			if (vCard.workUrl) {
				formattedVCardString += 'URL;type=WORK' + encodingPrefix + ':' + e(vCard.workUrl) + nl();
			}

			if (vCard.note) {
				formattedVCardString += 'NOTE' + encodingPrefix + ':' + e(vCard.note) + nl();
			}

			if (vCard.socialUrls) {
				for (var key in vCard.socialUrls) {
					if (vCard.socialUrls.hasOwnProperty(key) &&
						vCard.socialUrls[key]) {
						formattedVCardString += 'X-SOCIALPROFILE' + encodingPrefix + ';TYPE=' + key + ':' + e(vCard.socialUrls[key]) + nl();
					}
				}
			}

			if (vCard.source) {
				formattedVCardString += 'SOURCE' + encodingPrefix + ':' + e(vCard.source) + nl();
			}

			formattedVCardString += 'REV:' + (new Date()).toISOString() + nl();
			
			if (vCard.isOrganization) {
				formattedVCardString += 'X-ABShowAs:COMPANY' + nl();
			} 
			
			formattedVCardString += 'END:VCARD' + nl();
			return formattedVCardString;
		}
	};
})();
},{}],155:[function(require,module,exports){
const { starter } = require("../action/starter")
const { defaultAppEvents } = require("../action/defaultAppEvents")
const { initView } = require("../action/view")

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
const views = window.views
const global = window.global

views.document.__element__ = document

// app default event listeneres
defaultAppEvents()

// start app
views.document.__idList__.map(id => starter({ id }))
// starter({ id: "document" })

// window
initView({ views, global, id: "window" })

// load arabic font
var arDiv = document.createElement("P")
arDiv.innerHTML = "مرحبا"
arDiv.classList.add("ar")
arDiv.style.position = "absolute"
arDiv.style.top = "-1000px"
views.body.__element__.appendChild(arDiv)
},{"../action/defaultAppEvents":14,"../action/starter":58,"../action/view":81}],156:[function(require,module,exports){
const { toComponent } = require('../action/toComponent')
const { jsonToBracket } = require('../action/jsonToBracket')
const { override } = require('../action/merge')
const { clone } = require('../action/clone')
const { generate } = require('../action/generate')

const Input = (component) => {

  if (component.__templated__) return component
  component.__templated__ = true

  component.hover = component.hover || {}
  component.style = component.style || {}
  component.hover.style = component.hover.style || {}

  // container
  component.container = component.container || {}

  // icon
  component.icon = component.icon || {}
  component.icon.style = component.icon.style || {}
  component.icon.hover = component.icon.hover || {}
  component.icon.hover.style = component.icon.hover.style || {}

  // input
  component.input = component.input || {}
  component.input.hover = component.input.hover || {}
  component.input.type = component.password && "password" || component.input.type || 'text'
  component.input.style = component.input.style || {}
  component.input.hover.style = component.input.hover.style || {}

  // required
  if (component.required) component.required = typeof component.required === "object" ? component.required : {}

  component = toComponent(component)

  var {
    id, input, model, droplist, readonly, style, __controls__, duplicated, duration, required, preventDefault,
    placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, __labeled__, __childIndex__,
    duplicatable, lang, unit, currency, google, key, minlength, children, container, generator, __templated__
  } = component

  if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
  if (duplicatable) removable = removable || {}
  if (removable && typeof removable !== "object") removable = {}
  if (clearable && typeof clearable !== "object") clearable = {}
  if (generator && typeof generator !== "object") generator = {}
  if (label && typeof label !== "object") label = { text: "Label Name" }
  if (label && !label.location) label.location = "outside"

  readonly = readonly ? true : false

  if (minlength === undefined) minlength = 1
  if (droplist) droplist.align = droplist.align || "left"

  // upload input styles
  var uploadInputStyle = input.type === 'file'
    ? {
      position: 'absolute',
      left: '0',
      top: '0',
      opacity: '0',
      cursor: 'pointer',
    } : {}

  var _component = component = {
    ...component, id, input, model, droplist, readonly, style, __controls__, duplicated, duration, required, preventDefault,
    placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, __labeled__, __childIndex__,
    duplicatable, lang, unit, currency, google, key, minlength, children, container, generator, __templated__
  }

  if (duplicatable) {
    component.removable = true
    removable = true
  }

  if (label && (label.location === "inside" || label.position === "inside")) {

    var label = clone(component.label)
    var __dataPath__ = clone(component.__dataPath__)
    var path = component.path
    var __parent__ = component.__parent__
    var doc = component.doc
    var password = component.password && true
    var text = label.text
    id = id || generate()

    delete component.label
    delete component.path
    delete component.id
    delete component.password
    delete component.__dataPath__
    delete component.__parent__
    delete component.__templated__
    delete label.text

    return {
      id, path, doc, __parent__, tooltip: component.tooltip, __dataPath__, __islabel__: true, preventDefault, __templated__, __childIndex__,
      "view": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=${component.style.width || "100%"};style.maxWidth=${component.style.maxWidth || "100%"};${jsonToBracket(container)}`,
      "children": [{
        "view": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
        "children": [{
          "view": `Text?id=${id}_label;text='${text || "Label"}';if():[parent().required]:[required=true];style.fontSize=1.1rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)}`,
          "__controls__": [{
            "event": "click?parent().input().focus()"
          }]
        }, Input({ ...component, component: true, __labeled__: id, __parent__: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
        ]
      }, {
        "view": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${jsonToBracket(password)}?${password}`,
        "children": [{
          "view": `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
          "__controls__": [{
            "event": "click?parent().prev().getInput().el().type=text;next().style().display=flex;style().display=none"
          }]
        }, {
          "view": `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
          "__controls__": [{
            "event": "click?parent().prev().getInput().el().type=password;prev().style().display=flex;style().display=none"
          }]
        }]
      }],
      "__controls__": [{
        "event": "click:document?style().border=if():[clicked().outside():[().el()]]:[1px solid #ccc]:[2px solid #008060]?!contains():[clicked()];!droplist.contains():[clicked()]"
      }, {
        "event": "click?getInput().focus()?!getInput().focus"
      }]
    }
  }

  if ((label && (label.location === "outside" || label.position === "outside")) || label) {

    var label = clone(component.label)
    var __dataPath__ = clone(component.__dataPath__)
    var path = component.path
    var __parent__ = component.__parent__
    var doc = component.doc
    var tooltip = component.tooltip
    var text = label.text
    id = id || generate()

    delete component.label
    delete component.path
    delete component.id
    delete component.tooltip
    delete component.required
    delete component.__parent__
    delete component.__templated__
    delete component.__childIndex__
    delete label.text
    label.tooltip = tooltip

    return {
      id, doc, __parent__, __dataPath__, path, __islabel__: true, preventDefault, __controls__: [], __templated__, __childIndex__,
      "view": `View?class=flex start column;style.gap=.5rem;style.width=${component.style.width || "100%"};style.maxWidth=${component.style.maxWidth || "100%"};${jsonToBracket(container)}`,
      "children": [
        {
          "view": `Text?id=${id}_label;text='${text || "Label"}';${required ? "required=true" : ""};style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)}`,
          "__controls__": [{
            "event": "click?parent().input().focus()"
          }]
        },
        Input({ ...component, component: true, __labeled__: id, __parent__: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
        {
          "view": `View:${id}-required?class=flex gap-1;style:[alignItems=center;opacity=${required && required.style && required.style.opacity || "0"};transition=.2s]?${required ? true : false}`,
          "children": [{
            "view": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
          }, {
            "view": `Text?text=${required && required.text || "Required blank"};style.color=#D72C0D;style.fontSize=1.3rem;${jsonToBracket(required)}`
          }]
        }
      ]
    }
  }
  
  if (model === 'featured' || password || clearable || removable || duplicatable || copyable || generator) {

    delete component.type

    return {
      ...component,
      view: "View",
      class: `flex align-items-center unselectable ${component.class || ""}`,
      // remove from comp
      __controls__: [{
        event: `mouseenter?if():[clearable||removable||duplicatable]:[():[${id}+'-clear'].style().opacity=1];if():copyable:[():[${id}+'-copy'].style().opacity=1];if():duplicatable:[():[${id}+'-duplicate'].style().opacity=1]];if():generator:[():[${id}+'-generate'].style().opacity=1]?!mobile()`
      }, {
        event: `mouseleave?if():[clearable||removable||duplicatable]:[():[${id}+'-clear'].style().opacity=0];if():copyable:[():[${id}+'-copy'].style().opacity=0];if():duplicatable:[():[${id}+'-duplicate'].style().opacity=0]];if():generator:[():[${id}+'-generate'].style().opacity=0]?!mobile()`
      }],
      style: {
        cursor: readonly ? "pointer" : "auto",
        display: "inline-flex",
        width: "fit-content",
        maxWidth: "100%",
        position: "relative",
        backgroundColor: "inherit",
        height: "fit-content",
        borderRadius: "0.25rem",
        overflow: "hidden",
        transition: ".1s",
        border: input.type === "file" ? "1px dashed #ccc" : "0",
        ...style,
      },
      children: [{ // message
        view: `Text?id=${id}-msg;msg=parent().msg;text=parent().msg?parent().msg`,
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          fontSize: '1.3rem',
          maxWidth: '95%',
        }
      }, {
        view: `Input`,
        id: `${id}-input`,
        class: `${component.class.includes("ar") ? "ar " : ""}${input.class || ""}`,
        input,
        currency,
        day,
        unit,
        key,
        lang,
        google,
        duration,
        textarea,
        readonly,
        __labeled__,
        placeholder,
        duplicated,
        disabled,
        duplicatable,
        preventDefault,
        __featured__: true,
        __templated__: true,
        style: {
          width: password || clearable || removable || copyable || generator ? "100%" : "fit-content",
          height: 'fit-content',
          borderRadius: style.borderRadius || '0.25rem',
          backgroundColor: style.backgroundColor || 'inherit',
          fontSize: style.fontSize || '1.4rem',
          maxHeight: style.maxHeight || "initial",
          border: '0',
          height: style.height || "100%",
          padding: "0.5rem",
          color: input.type === "number" ? "blue" : '#444',
          outline: 'none',
          userSelect: password ? "none" : "initial",
          ...uploadInputStyle,
          ...input.style
        },
        __controls__: [...__controls__, {
          event: `focus?if():[__labeled__]:[if():[!():${__labeled__}.contains():[clicked()]]:[if():${duplicatable ? true : false}:[parent().click()]:[2ndChild().click()]]]:[if():[!():${id}.contains():[clicked()]]:[click():[__droplistPositioner__:().del();]]]?!preventDefault`
        }, {
          event: `blur?():document.click()`
        }, {
          event: `keyup?():'${id}-duplicate'.click()?duplicatable;e().key=Enter`
        }]
      }, {
        view: `Icon:${id}-clear?class=pointer;name=bi-x;style:[position=absolute;if():[language:()=ar]:[left=if():[parent().password]:4rem:'0.5rem']:[right=if():[parent().password]:4rem:'0.5rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[parent().clearable;prev().txt()]:[prev().data().del();prev().txt()=;#prev().focus()].elif():[parent().removable;if():[parent().clearable]:[!prev().txt()]:true;doc():[path=path().slice():0:-1].len()>1]:[parent().rem()]]?parent().clearable||parent().removable||parent().duplicatable`,
      }, {
        view: `Icon:${id}-duplicate?class=pointer duplicater;name=bi-plus;style:[position=absolute;if():[language:()=ar]:[left=if():[parent().password]:'5.5rem':'3rem']:[right=if():[parent().password]:'5.5rem':'3rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[!parent().max||parent().max>2ndParent().className():duplicater.len()]:[doc():[path=path().slice():0:'-1'].push():[if():[data().type()=number]:0:''];2ndParent().update()::[className():duplicater.lastEl().2ndPrev().focus()]]]?parent().duplicatable`,
      }, {
        view: `Text:${id}-generate?class=flexbox pointer;text=ID;style:[position=absolute;color=blue;if():[language:()=ar]:[left=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0]:[right=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0];width=3rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;backgroundColor=inherit;borderRadius=.5rem];click:[generated=gen():[parent().generator.length||20];data()=().generated;():${id}-input.txt()=().generated;():${id}-input.focus()]?parent().generator`,
      }, {
        view: `Icon:${id}-copy?class=pointer;name=bi-files;style:[backgroundColor=#fff;position=absolute;if():[language:()=ar]:[left=if():[parent().clearable]:[2.5rem]:0]:[right=if():[parent().clearable]:[2.5rem]:0];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;borderRadius=.5rem];click:[if():[():${id}-input.txt()]:[data().copyToClipBoard();#():${id}-input.focus()]];mininote.text='copied!'?parent().copyable`,
      }, {
        view: `View?style.height=100%;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative?parent().password`,
        children: [{
          view: `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
          __controls__: [{
            event: "click?parent().prev().el().type=text;next().style().display=flex;style().display=none"
          }]
        }, {
          view: `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
          __controls__: [{
            event: "click?parent().prev().el().type=password;prev().style().display=flex;style().display=none"
          }]
        }]
      }]
    }
  }

  if (model === 'classic') {

    delete _component.type
    return {
      ..._component,
      view: "Input",
      style: {
        cursor: readonly ? "pointer" : "auto",
        border: "0",
        width: "fit-content",
        padding: '0.5rem',
        color: '#444',
        color: input.type === "number" ? "blue" : '#444',
        backgroundColor: 'inherit',
        height: 'fit-content',
        borderRadius: '0.25rem',
        fontSize: '1.4rem',
        transition: "border .1s",
        ...input.style,
        ...style,
      }
    }
  }
}

module.exports = Input
},{"../action/clone":4,"../action/generate":24,"../action/jsonToBracket":38,"../action/merge":42,"../action/toComponent":67}]},{},[155]);
