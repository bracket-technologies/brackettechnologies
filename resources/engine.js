(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
    "droplist": [
        {
            "event": "[keyup:input()??e().key=Escape];[blur:input()??log():[];!():droplist.contains():[clicked()]||focused()!=()]?#close droplist;__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()"
        },
        {
            "event": "[click??__droplistPositioner__:()!=().id];[focus??__droplistPositioner__:()!=().id]?#open droplist on click;clearTimer():[__droplistTimer__:()];if():[__droplistPositioner__:()!=().id]:[__keyupIndex__:()=0;__droplistPositioner__:()=().id;droplist()::[().droplist.style.keys()._():[():droplist.style().[_]=().droplist.style.[_]];():droplist.position():[positioner=().id;[().droplist].flat()];():droplist.style():[opacity=1;transform='scale(1)';pointerEvents=auto]]]:[__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()]"
        },
        {
            "event": "keyup?#choose item on enter;():droplist.children().[__keyupIndex__:()].click()?e().key=Enter"
        },
        {
            "event": "mouseenter?#open on hoverin;clearTimer():[.droplistLeaved];if():[__droplistMouseenterer__:()!=().id]:[click();__droplistMouseenterer__:()=().id]?droplist.hoverable"
        },
        {
            "event": "mouseleave?#close on hoverout;__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()?droplist.hoverable"
        },
        {
            "event": "input:input()?#search droplist;droplist()?input();droplist.searchable"
        },
        {
            "event": "keydown?#moveup/down items;():droplist.children().[__keyupIndex__:()||0].mouseleave();__keyupIndex__:()=if():[e().keyCode=40]:[__keyupIndex__:()+1]:[__keyupIndex__:()-1];():droplist.children().[__keyupIndex__:()].mouseenter()?e().keyCode=40||=38;__droplistPositioner__:();if():[e().keyCode=38]:[__keyupIndex__:()>0].elif():[e().keyCode=40]:[__keyupIndex__:()<():droplist.children().len()-1]"
        }
    ],
    "hover": [
        {
            "event": "mouseenter?hover.style.keys()._():[style().[_]=hover.style.[_]]?!hover.disable"
        },
        {
            "event": "mouseleave?hover.style.keys()._():[style().[_]=style.[_]||null]?!hover.disable"
        }
    ],
    "mininote": [
        {
            "event": "click?():mininote-text.txt()=[.mininote.text||.mininote.note||''];clearTimeout():[mininote-timer:()];():mininote.style():[opacity=1;transform='scale(1)'];mininote-timer:()=():root.timer():[():mininote.style():[opacity=0;transform=scale(0)]]:[.mininote.timer||3000]"
        }
    ],
    "tooltip": [
        {
            "event": "mousemove?if():[!__tooltipTimer__:()]:[__tooltipTimer__:()=timer():[():tooltip.style().opacity=1?mouseentered]:500];():'tooltip-text'.txt()=[().tooltip.text]();():tooltip.position():[positioner=mouse;placement=[().tooltip.placement||left];distance=[().tooltip.distance||0]]?mouseentered;[().tooltip.text]()"
        },
        {
            "event": "mouseleave?mouseentered=false;clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0"
        },
        {
            "event": "mouseenter?mouseentered=true"
        }
    ]
}
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
const { decode } = require("./decode")
const { toArray } = require("./toArray")

const _colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const colorize = ({ _window, string, start = "[", index = 0, colors = _colors, sub }) => {

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
    key = colorize({ _window, string: key, index, colors, sub: true })

    if (string0) string0 = colorizeCoded({ _window, index, string: string0, colors })

    string = string0 + operator + `<span contenteditable style="background-color:#00000000; color: green; white-space:nowrap">${decode({ _window, string: comment })}</span>` + key

  } else string = colorizeCoded({ _window, index, string, colors })

  if (index !== 0) string = `<span contenteditable style="background-color:#00000000; color:${colors[index]}; white-space:nowrap">${string}</span>`

  // ?
  string = string.replaceAll("?", "<u>?</u>")
  return string
}

const colorizeCoded = ({ _window, index, string, colors }) => {

  var global = _window ? _window.global : window.global
  var slicer = string.split("@")
  if (slicer.length < 2) return string
  
  var text = ""

  var string0 = slicer[0]
  var string1 = colorize({ _window, index, string: slicer.slice(1).join("@").slice(5), colors, sub: true })
  var reference = global.__refs__["@" + slicer[1].slice(0, 5)]

  if (typeof reference === "object") {

    var data = ""
    if (reference.type === "code") data = colorize({ _window, string: "[" + reference.data + "]", index: index + 1, colors, sub: true })
    else data = `<span contenteditable style="background-color:#00000000; color:${colors[index + 1]}; white-space:nowrap">'${reference.data}'</span>`

    text += string0 + data + string1
  }

  return text || string
}

module.exports = { colorize }
},{"./decode":9,"./toArray":41}],5:[function(require,module,exports){
const setCookie = ({ name = "", value, expiry = 360 }) => {

  var cookie = document.cookie || "", host = window.global.manifest.host
  var decodedCookie = decodeURIComponent(cookie)
  var __session = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === "__session") || "").split("=").slice(1).join("=") || "{}")
  if (name === "__session__") {

    __session[host] = __session[host] || {}
    __session[host][name] = value
    
  } else __session[name] = value
  
  document.cookie = `__session=${JSON.stringify(__session)};path=/`//domain=${window.global.manifest.host};
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

const eraseCookie = ({ name }) => {

  var cookie = document.cookie || "", host = window.global.manifest.host
  var decodedCookie = decodeURIComponent(cookie)
  var __session = JSON.parse((decodedCookie.split('; ').find(cookie => cookie.split("=")[0] === "__session") || "").split("=").slice(1).join("=") || "{}")
  
  if (name === "__session__" && __session[host]) delete __session[host][name]
  else delete __session[name]

  document.cookie = `__session=${JSON.stringify(__session)};path=/`
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
  
  request.cookies = request.headers.cookie = list.__session || "{}"
}

module.exports = {setCookie, getCookie, eraseCookie, parseCookies}
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
  "borderColor": "border-color",
  "zIndex": "z-index",
  "gapX": "column-gap",
  "gapY": "row-gap",
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
},{}],8:[function(require,module,exports){
const { toParam } = require("./kernel");

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
            toParam({ id, e, data: onload, object: [views[id]], __: [window.global.file, ...__] })
        };

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file || e.target.files[0]);
    }
}
},{"./kernel":29}],9:[function(require,module,exports){
const decode = ({ _window, string }) => {

  var global = _window ? _window.global : window.global
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

},{}],10:[function(require,module,exports){
const { clone } = require("./clone")
const { jsonToBracket } = require("./jsonToBracket")
const { update, toLine, kernel, toValue } = require("./kernel")

const droplist = ({ id, e, __, stack, props, lookupActions, address, object }) => {
  
  var views = window.views
  var global = window.global
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
  var droplistView = { ...global.__queries__.view.droplist, children: [], __dataPath__, doc, __parent__: "root", __, __childIndex__: views.droplist.__childIndex__, __viewPath__: ["droplist"], __customViewPath__: ["router", "document", "root", "droplist"], __lookupActions__: [...view.__lookupActions__] }

  // input id
  var inputID = toValue({ id, data: "input().id||().id", object })
  var text = views[inputID].__element__.value || views[inputID].__element__.innerText

  // items
  if (typeof items === "string") items = toValue({ id, data: items, lookupActions, __: view.__, object })

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
          view: `Text?style:[minHeight=3rem;padding=0 1rem;fontSize=1.3rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item)};class=flex align-center pointer ${item.class || ""};click:[():[__droplistPositioner__:()].():[txt()=..txt();data()=..txt()]?!():${id}.droplist.preventDefault]`,
        })
      }
    }))
    
  } else droplistView.children = []
  
  droplistView.positioner = id
  
  update({ stack, lookupActions, __, address, id, data: { id: "droplist", view: droplistView } })
  droplistView = views.droplist
  
  // searchable
  var mouseEnterItem = () => {

    var _index, onlyOne
    //if (view.droplist && view.droplist.searchable) {

      if (text) {
        
        _index = (items || []).findIndex(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
        )

        // fills input value
        onlyOne = (items || []).filter(item => view.droplist.searchable.any 
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

          kernel({ id, data: { path: droplistView.__dataPath__, key: true, value: items[_index], data: global[droplistView.doc] }, __ })
          global.__keyupIndex__ = _index
        }
      }
    //}

    global.__keyupIndex__ = global.__keyupIndex__ || 0
    droplistView.__element__.children.length > 0 && droplistView.__element__.children[global.__keyupIndex__].dispatchEvent(new Event("mouseenter"))
  }

  global.__droplistTimer__ = setTimeout(mouseEnterItem, 100)
}

module.exports = { droplist }
},{"./clone":3,"./jsonToBracket":28,"./kernel":29}],11:[function(require,module,exports){
module.exports=[
  "mouseenter", "mouseleave",  "mouseover", "mousemove", "mousedown", "mouseup", "touchstart", 
  "touchend", "touchmove", "touchcancel", "click", "change", "focus", "blur", "keypress", "keyup", 
  "keydown", "scroll", "beforeLoading", "loaded", "controls", "children", "child", "change", "entry", 
  "enter", "longclick", "sibling", "siblings", "prevSiblings", "prevSibling", "unload", "undo", "storage",
  "resize", "redo", "popstate", "online", "offline", "message", "load", "languagechange",
  "error", "afterprint", "beforeprint", "beforeunload", "paste", "auxclick", "hover"
]
},{}],12:[function(require,module,exports){
const {isParam} = require("./isParam")

module.exports = {
    executable: ({ _window, string, encoded = true }) => {
        return typeof string === "string" && (string.includes("()") || (encoded ? string.charAt(0) === "@" || isParam({ _window, string }) : false) || string.includes("_"))
    }
}
},{"./isParam":27}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const numbers = "1234567890"

const generate = (params = {}) => {

  var { length, number, unique, universal, timestamp } = params

  var result = "", chars = number ? numbers : characters

  var charactersLength = chars.length
  var time = (new Date()).getTime() + ""

  if (unique) length = 26
  else if (!unique && !length) length = 5

  if (universal)
    for (let i = 0; i < 13; i++) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength)) + chars.charAt(Math.floor(Math.random() * charactersLength))
      result += time[i]
    }

  else
    for (let i = 0; i < (unique && length >= 26 ? length - 13 : length); i++) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength))
      if (unique && length >= 26 && i <= 13) result += time[i]
    }

    // timestamp => ex. xxxxxxxxxxxxxxxT(xxxxxxxxxxxxx:timestamp)
    if (typeof timestamp === "number") result += "T" + timestamp
    else if (timestamp) result += "T" + time

  return result
}

module.exports = { generate }

},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
module.exports = {
    getDaysInMonth: (stampTime) => {
        return new Date(stampTime.getFullYear(), stampTime.getMonth() + 1, 0).getDate()
    }
}
},{}],19:[function(require,module,exports){
const getType = (value) => {
  const { emptySpaces, isNumber } = require("./kernel")

  if (typeof value === "boolean" || value === "true" || value === "false") return "boolean"
  if (typeof value === "object" && Array.isArray(value)) return "array"
  if (typeof value === "object") return "map"
  if (typeof value === "function") return "function"
  if (typeof value === "number" || (typeof value === "string" && isNumber(value))) {

    /*if (value.length >= 10 && value.length <= 13 && !isNaN(value) && value.slice(0, 2) !== "0") return "timestamp"
    if (value.length === 8 && value.slice(0, 2) !== "00" && !isNaN(value)) return "time"*/

    if ((value + "").length === 13 && (value + "").charAt(0) !== "0") return "timestamp"
    //if ((value + "").length === 8 && (value + "").charAt(0) !== "0") return "time"
    if (typeof value === "number") return "number"
    return "string"
  }
  if (typeof value === "string") return "string"
}
module.exports = { getType }
},{"./kernel":29}],20:[function(require,module,exports){
const nthParent = ({ _window, nth, o }) => {

  if (!o.__view__) return 
  var views = _window ? _window.views : window.views

  var n = 0, parent = o.id
  
  while (n < nth) {
    if (views[parent]) parent = views[parent].__parent__
    n++
  }
  
  return views[parent]
}

const nthNext = ({ _window, nth, o }) => {

  if (!o.__view__) return 
  var views = _window ? _window.views : window.views

  var n = 0, next = o.id
  while (n < nth) {
    if (views[next]) next = (views[views[next].__parent__].__childrenRef__[views[next].__index__ + 1] || {}).id
    n++
  }

  return views[next]
}

const nthPrev = ({ _window, nth, o }) => {

  if (!o.__view__) return 
  var views = _window ? _window.views : window.views

  var n = 0, prev = o.id
  while (n < nth) {
    if (views[prev]) prev = (views[views[prev].__parent__].__childrenRef__[views[prev].__index__ - 1] || {}).id
    n++
  }

  return views[prev]
}

const getAllParents = ({ _window, id }) => {

  var views = _window ? _window.views : window.views
  var view = views[id]
  if (!view.__parent__) return []

  var parentId = view.__parent__
  var all = [views[parentId]]

  all.push(...getAllParents({ _window, id: parentId }))

  return all
}

module.exports = { nthParent, getAllParents, nthNext, nthPrev }
},{}],21:[function(require,module,exports){
const { setCookie } = require("./cookie")
const { defaultAppEvents, initView, eventExecuter, starter, addEventListener } = require("./kernel")


window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
var views = window.views
var global = window.global

views.document.__element__ = document

// in some casese path changes when rendering
history.replaceState(null, global.manifest.title, global.manifest.path.join("/"))

// session
setCookie({ name: "__session__", value: global.manifest.session })

// app default event listeneres
defaultAppEvents()

// start app
var relatedEvents = views.document.__idList__.map(id => starter({ id }))

// document built-in events
views.document.__controls__.map(controls => addEventListener({ id: "document", ...controls, event: controls.event }))

// loaded events
views.document.__idList__.map(id => views[id] && views[id].__loadedEvents__.map(data => eventExecuter(data)))

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
},{"./cookie":5,"./kernel":29}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
const isCalc = ({ _window, string }) => {

    if (typeof string !== "string") return false
    
    var global = _window ? _window.global : window.global
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
},{}],24:[function(require,module,exports){
module.exports = {
    isCondition: ({ _window, string }) => {
        
        if (typeof string !== "string") return false

        var global = _window ? _window.global : window.global
        if (string.charAt(0) === "@" && string.length === 6) string = global.__refs__[string].data

        // recheck after decoding
        if (typeof string !== "string") return false

        if (string.slice(0, 1) === "!" || string.includes(">") || string.includes("<") || string.includes("!=") || string.includes("==")) return true
        return false
    }
}
},{}],25:[function(require,module,exports){
const isEqual = function (value, other) {
  // if (value === undefined || other === undefined) return false

  if ((value && !other) || (other && !value) || (typeof value !== typeof other)) return false

  // string
  if (typeof value === "string") return value.replace(/\s+/g, ",") === other.replace(/\s+/g, ",");

  // boolean || number
  if (typeof value !== "object") return value === other

  var type = Object.prototype.toString.call(value)
  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false

  // views
  if (value.__view__ && other.__view__) return value.id === other.id

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the two items
  const valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  const otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  const compare = function (item1, item2) {
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

  if (Array.isArray(value)) {
    var equal = true
    if (value.length === other.length) {
      value.map((value, i) => {
        if (!isEqual(value, other[i])) equal = false
      })
    } else equal = false
    return equal
  }

  if (typeof value === "object") {
    var equal = true, valueKeys = Object.keys(value), otherKeys = Object.keys(other)
    if (valueKeys.length === otherKeys.length) {
      valueKeys.map((key, i) => {
        if (!isEqual(valueKeys[key], otherKeys[key])) equal = false
      })
    } else equal = false
    return equal
  }

  // html elements
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

  // If nothing failed, return true
  return true;
}

module.exports = { isEqual }

},{}],26:[function(require,module,exports){
var events = require("./events.json")

const isEvent = ({ _window, string }) => {

    var global = _window ? _window.global : window.global
    
    if (string.split("?").length > 1) {

        string = string.split("?")[0]
        // ex: [[click??conditions]?params]
        if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data
        string = string.split(";")[0]
        // ex: [[click??conditions];[keyup??conditions]?params]
        if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data
        // ex: click:id
        string = string.split(":")[0]
        if (events.includes(string)) return true
        else return false

    } else return false
}

module.exports = { isEvent }
},{"./events.json":11}],27:[function(require,module,exports){
module.exports = {
  isParam: ({ _window, string = "" }) => {
    
    if (string.charAt(0) === "@" && string.length === 6) string = (_window ? _window.global : window.global).__refs__[string].data

    if (string.includes("=") || string.includes(";") || string === "return()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) return true
    return false
  }
}
},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
(function (process,global){(function (){
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { isEqual } = require("./isEqual")
const { capitalizeFirst, capitalize } = require("./capitalize")
const { clone } = require("./clone")
const { getDateTime } = require("./getDateTime")
const { getDaysInMonth } = require("./getDaysInMonth")
const { getType } = require("./getType")
const { exportJson } = require("./exportJson")
const { setCookie, getCookie, eraseCookie, parseCookies } = require("./cookie")
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
const { override, merge } = require("./merge")
const { nthParent, nthNext, nthPrev } = require("./getView")
const { decode } = require("./decode")
const { executable } = require("./executable")
const { toEvent } = require("./toEvent")
const { isEvent } = require("./isEvent")
const { isCondition } = require("./isCondition")
const { isCalc } = require("./isCalc")
const { toCode } = require("./toCode")
const { logger } = require("./logger")
const { openStack, clearStack, endStack } = require("./stack")
const { watch } = require("./watch")
const { isArabic } = require("./isArabic")
const builtInViews = require("../views/views")
const cssStyleKeyNames = require("./cssStyleKeyNames")
const events = require("./events.json")
const builtinEvents = require("./builtinEvents.json")
const passport = require("./passport")
const myViews = ["View", "Input", "Text", "Image", "Icon", "Action", "Audio", "Video"]

// database
const { spawn, exec } = require("child_process")
const fs = require("fs")
const util = require('util')

// config
require('dotenv').config()
const executableRegex = /\(\)|@|^_+$/;

// project DB
var bracketDB = process.env.BRACKETDB

const actions = {
    "global()": () => _window ? _window.global : window.global,
    "scope()": ({object}) => object,
    "e()": () => e,
    "console()": () => console,
    "string()": () => String,
    "object()": () => Object,
    "array()": () => Array,
    "document()": () => _window ? {} : document,
    "window()": () => _window || window,
    "win()": () => _window || window,
    "history()": () => _window ? {} : history,
    "nav()": () => _window ? {} : navigator,
    "navigator()": () => _window ? {} : navigator,
    "request()": () => req,
    "req()": () => req,
    "response()": () => res,
    "res()": () => res,
    "math()": () => Math,
    "id()": ({ o }) => {
        if (typeof o === "object" && o.__props__) return o.__props__.id
    },
    "if()": () => { }, // inorder not to check in actions
    "__props__()": ({ o, args }) => {
        if (args[1] === "clearActions") return clearActions(o)
    },
    "caret()": ({ o }) => ({ index: getCaretIndex(o) }),
    "device()": ({ global }) => global.manifest.device.device,
    "mobile()": ({ global }) => global.manifest.device.device.type === "smartphone",
    "desktop()": ({ global }) => global.manifest.device.device.type === "desktop",
    "tablet()": ({ global }) => global.manifest.device.device.type === "tablet",
    "stack()": ({ stack }) => stack,
    "address()": ({ stack }) => stack.addresses.find(({ id }) => id === stack.interpretingAddressID),
    "toInt()": ({ o }) => {

        if (!isNumber(o)) return
        var integer = o
        return Math.round(toNumber(integer))
    }, "clicked()": ({ global, key, value, pathJoined }) => {

        if (key && value !== undefined) global.__droplistPositioner__ = global.__clicked__ = value
        return global.__clicked__

    }, "clicker()": ({ global }) => {

        return global.__clicker__
    }, "focused()": ({ global }) => {

        return global.__focused__
    }, "click()": ({ _window, global, views, o, id, pathJoined }) => {

        if (!o.__view__) return

        if (_window) return o.__controls__.push({
            event: `loaded?${pathJoined}`
        })

        if (!o.__rendered__) return

        global.__clicker__ = views[id]
        global.__clicked__ = o

        o.__element__.click()

    }, "focus()": ({ _window, o, pathJoined, id }) => {

        if (!o.__view__) return

        if (_window) return o.__controls__.push({
            event: `loaded?${pathJoined}`
        })

        focus({ id: o.id || id })
        return true

    }, "blur()": ({ _window, view, o, pathJoined }) => {

        if (!o.__view__) return

        if (_window) return view.__controls__.push({
            event: `loaded?${pathJoined}`
        })

        o.__element__.blur()
        return true

    }, "mousedown()": ({ o }) => {

        if (!o.__view__) return
        var mousedownEvent = new Event("mousedown")
        o.__element__.dispatchEvent(mousedownEvent)
    }, "mouseup()": ({ o }) => {
        if (!o.__view__) return
        var mouseupEvent = new Event("mouseup")
        o.__element__.dispatchEvent(mouseupEvent)
    }, "mouseenter()": ({ o }) => {

        if (!o.__view__) return
        var mouseenterEvent = new Event("mouseenter")
        o.__element__.dispatchEvent(mouseenterEvent)
    }, "mouseleave()": ({ o }) => {

        if (!o.__view__ || !o.__rendered__) return
        var mouseleaveEvent = new Event("mouseleave")
        o.__element__.dispatchEvent(mouseleaveEvent)
    }, "keyup()": ({ o }) => {
        if (!o.__view__) return
        var keyupevent = new Event("keyup")
        o.__element__.dispatchEvent(keyupevent)
    }, "keydown()": ({ o }) => {
        if (!o.__view__) return
        var keyupevent = new Event("keydown")
        o.__element__.dispatchEvent(keyupevent)
    }, "name()": ({ _window, o, id, e, __, args, object }) => {

        var name = toValue({ _window, id, e, object, data: args[1], props: { isValue: true }, __ })
        if (name === o.__name__) return o
        var children = getDeepChildren({ _window, id: o.id || id })
        return children.find(view => view.__name__ === name)

    }, "names()": ({ _window, o, id, e, __, args, object }) => {

        var name = toValue({ _window, id, e, object, data: args[1], props: { isValue: true }, __ })
        var children = getDeepChildren({ _window, id: o.id || id })
        return children.filter(view => view.__name__ === name)

    }, "tag()": ({ _window, id, e, object, args, __ }) => {

        var tag = toValue({ _window, id, e, object, data: args[1], props: { isValue: true }, __ }), styles = ""
        if (!tag.type) tag.type = "span"

        if (tag.style) {
            Object.entries(tag.style).map(([style, value]) => {
                styles += `${cssStyleKeyNames[style] || style}:${value}; `
            })

            styles = styles.slice(0, -2)
        }

        return `<${tag.type} style="${styles}" class="${tag.class || ""}">${tag.text || ""}</${tag.type}>`

    }, "width()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.width = value
        else return o.__element__.offsetWidth / 10 + "rem"

    }, "height()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.height = value
        else return o.__element__.offsetHeight / 10 + "rem"

    }, "border()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.border = value
        else return o.__element__.border

    }, "left()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.left = value
        else return o.__element__.left

    }, "right()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.right = value
        else return o.__element__.right

    }, "cursor()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.cursor = value
        else return o.__element__.cursor

    }, "transform()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.transform = value
        else return o.__element__.transform

    }, "color()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.color = value
        else return o.__element__.color

    }, "backgroundColor()": ({ o, key, value }) => {

        if (!o.__view__) return
        if (key && value !== undefined) return o.__element__.style.backgroundColor = value
        else return o.__element__.backgroundColor

    }, "display()": ({ o, value, key }) => {

        if (!o.__view__) return
        return o.__element__.style.display = ["flex", "none", "block"].includes(value) ? value : "flex"

    }, "scale()": ({ _window, o, id, e, __, args, object, lastIndex, value, i, key, props = {} }) => {

        if (!o.__view__) return
        var scale = toValue({ _window, id, e, data: args[1], __, object, props: { isValue: true } }) || 0
        var transform = o.__element__.style.transform || ""

        if (key && i === lastIndex && value !== undefined) return o.__element__.style.transform = (transform ? " " : "") + `scale(${value})`
        else if (props.isCondition || (!args[1] && i === lastIndex)) return getNumberAfterString(o.__element__.style.transform, "scale(") || 0
        return o.__element__.style.transform = (transform ? " " : "") + `scale(${scale})`

    }, "rotate()": ({ _window, o, id, e, __, args, object, lastIndex, value, i, key, props }) => {

        if (!o.__view__) return
        var angle = toValue({ _window, id, e, data: args[1], __, object, props: { isValue: true } }) || 0
        var transform = o.__element__.style.transform || ""

        if (key && i === lastIndex && value !== undefined) return o.__element__.style.transform = (transform ? " " : "") + `rotate(${value}deg)`
        else if (props.isCondition || (!args[1] && i === lastIndex)) return getNumberAfterString(o.__element__.style.transform, "rotate(") || 0
        return o.__element__.style.transform = (transform ? " " : "") + `rotate(${angle}deg)`

    }, "hide()": ({ o }) => {

        if (!o.__view__) return
        return o.__element__.style.display = "none"

    }, "hidden()": ({ o }) => {

        if (!o.__view__) return true
        return o.__element__.style.display === "none"

    }, "fade()": ({ _window, id, e, object, args, __, value, key, lastIndex, i, o }) => {

        var opacity = toValue({ _window, id, e, object, data: args[1], __, props: { isValue: true } }) || 0
        var timer = toValue({ _window, id, e, object, data: args[2], __, props: { isValue: true } }) || 0

        if (key && lastIndex === i && value !== undefined) return o.__element__.style.opacity = 1 - value
        if (!o.__view__) return
        if (timer) o.__element__.style.transition += `, opacity ${timer}ms`
        return o.__element__.style.opacity = 1 - opacity

    }, "opacity()": ({ _window, id, e, object, args, __, value, key, lastIndex, i, o }) => {

        var opacity = toValue({ _window, id, e, object, data: args[1], __, props: { isValue: true } }) || 0
        var timer = toValue({ _window, id, e, object, data: args[2], __, props: { isValue: true } }) || 0

        if (key && lastIndex === i && value !== undefined) return o.__element__.style.opacity = value
        if (!o.__view__) return
        if (timer) o.__element__.style.transition += `, opacity ${timer}ms`
        return o.__element__.style.opacity = opacity

    }, "style()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__) return
        if (!args[1]) {
            if (!o.__element__) {
                o.style = o.style || {}
                return o.style
            } return o.__element__.style
        }

        var styles = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, __, data: args[1], object })

        if (Object.keys(styles).length > 0) {

            var obj = o.__element__ ? o.__element__ : o
            if (obj.__view__) obj.style = obj.style || {}

            Object.entries(styles).map(([key, value]) => {
                obj.style[key] = value
            })
        }
        return styles

    }, "qr()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        // wait address
        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id || id, action: "qr()", object, lookupActions, __, id })
        return qr({ _window, id, req, res, data, e, __, stack, props, address, lookupActions })

    }, "contact()": ({ _window, req, res, o, id, e, __, args, object }) => {

        var data = toValue({ req, res, _window, id, e, __, data: args[1], object, props: { isValue: true } })
        if (typeof data !== "obejct") return o

        return vcard({ _window, id, req, res, data, e, __ })

    }, "bracket()": ({ o }) => {

        if (typeof o === "object") return require("./jsonToBracket").jsonToBracket(o)

    }, "inputs()": ({ _window, views, o, stack, props, lookupActions, id }) => {

        if (!o.__view__) return
        var inputs = [], textareas = [], editables = []

        if (!o.__rendered__) {
            if (o.__name__ === "Input") return [o]
            var findInputs = (view) => {
                if (o.__name__ !== "View") return
                o.__childrenRef__.map(({ id }) => {
                    if (views[id].__name__ === "Input") return inputs.push(o)
                    else if (views[id].__name__ === "View") findInputs(view)
                })
            }
            return inputs
        }

        inputs = o.__element__.getElementsByTagName("INPUT")
        textareas = o.__element__.getElementsByTagName("TEXTAREA")
        editables = getDeepChildren({ _window, lookupActions, stack, props, id: o.id || id }).filter(view => view.editable)
        if (o.editable) editables.push(o)

        return [...inputs, ...textareas, ...editables].map(o => views[o.id || id])

    }, "input()": ({ _window, views, o, stack, props, lookupActions, id }) => {

        if (!o.__view__) return
        var inputs = [], textareas = [], editables = [], input

        if (!o.__rendered__) {
            if (o.__name__ === "Input") return o
            var findInputs = (view) => {
                if (o.__name__ !== "View") return
                o.__childrenRef__.map(({ id }) => {
                    if (input) return
                    if (views[id].__name__ === "Input") return input = o
                    else if (views[id].__name__ === "View") findInputs(view)
                })
            }
            return input
        }

        inputs = o.__element__.getElementsByTagName("INPUT")
        textareas = o.__element__.getElementsByTagName("TEXTAREA")
        editables = getDeepChildren({ _window, lookupActions, stack, props, id: o.id || id }).filter(view => view.editable)
        if (o.editable) editables.push(o)

        if ([...inputs, ...textareas, ...editables].length === 0) return
        return views[[...inputs, ...textareas, ...editables][0].id]

    }, "px()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (args[1]) return lengthConverter(toValue({ req, res, _window, lookupActions, object, stack, props: { isValue: true }, id, e, __, data: args[1] }))
        return lengthConverter(o)

    }, "touchable()": ({ _window, global }) => {

        if (_window) return global.manifest.device.device.type === "smartphone"
        else return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))

    }, "class()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, answer, object }) => {

        if (!o.__view__) return
        var className = toValue({ req, res, _window, lookupActions, object, stack, props: { isValue: true }, id, e, __, data: args[1] })

        var answer = [...o.__element__.getElementsByClassName(className)]
        return answer.map(o => window.views[o.id || id])

    }, "classList()": ({ o }) => {

        if (!o.__view__) return
        return [...o.__element__.classList]

    }, "log()": ({ _window, req, res, o, stack, props, pathJoined, lookupActions, id, e, __, args, k, underScored, object, i }) => {

        var logs = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, __: underScored ? [o, ...__] : __, data: arg, object }))
        if (args.slice(1).length === 0 && pathJoined !== "log()") logs = [o]

        console.log("LOG:" + (o.id || id), decode({ _window, string: pathJoined }), ...logs)
        stack.logs && stack.logs.push(stack.logs.length + " LOG:" + (o.id || id) + " " + logs.join(" "))

        return o
    }, "parent()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthParent({ _window, nth: 1, o })

    }, "2ndParent()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthParent({ _window, nth: 2, o })

    }, "3rdParent()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthParent({ _window, nth: 3, o })

    }, "nthParent()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__) return

        var nth = toValue({ _window, id, e, lookupActions, stack, props: { isValue: true }, __, data: args[1], object })

        return nthParent({ _window, nth, o })

    }, "prevSiblings()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return o
        return views[o.__parent__].__childrenRef__.slice(0, o.__index__ + 1).map(({ id }) => views[id])

    }, "nextSiblings()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return o
        return views[o.__parent__].__childrenRef__.slice(o.__index__ + 1).map(({ id }) => views[id])

    }, "siblings()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return o
        var children = clone(views[o.__parent__].__childrenRef__)
        children.splice(o.__index__, 1)
        return children.map(({ id }) => views[id])

    }, "next()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthNext({ _window, nth: 1, o })

    }, "2ndNext()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthNext({ _window, nth: 2, o })

    }, "3rdNext()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthNext({ _window, nth: 3, o })

    }, "nthNext()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__ || !o.id) return
        var nth = toValue({ _window, __, data: args[1], e, id, lookupActions, stack, props: { isValue: true }, object })
        return nthNext({ _window, nth, o })

    }, "last()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[views[o.__parent__].__childrenRef__.slice(-1)[0].id]

    }, "lastSibling()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[views[o.__parent__].__childrenRef__.slice(-1)[0].id]

    }, "2ndLast()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[views[o.__parent__].__childrenRef__.slice(-2)[0].id]

    }, "3rdLast()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[views[o.__parent__].__childrenRef__.slice(-3)[0].id]

    }, "nthLast()": ({ _window, views, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__ || !o.id) return
        var nth = toValue({ _window, __, data: args[1], e, id, lookupActions, stack, props: { isValue: true }, object })
        if (!isNumber(nth)) return
        return views[views[o.__parent__].__childrenRef__.slice(-1 * nth)[0].id]

    }, "1stSibling()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return o
        return views[views[o.__parent__].__childrenRef__[0].id]

    }, "2ndSibling()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return o
        return views[views[o.__parent__].__childrenRef__[1].id]

    }, "3rdSibling()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return o
        return views[views[o.__parent__].__childrenRef__[2].id]

    }, "nthSibling()": ({ _window, views, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__ || !o.id) return o
        var nth = toValue({ _window, id, e, __, data: args[1], lookupActions, stack, object, props: { isValue: true } })
        return views[views[o.__parent__].__childrenRef__[nth - 1].id]

    }, "grandChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[views[o.__childrenRef__[0].id].__childrenRef__[0].id]

    }, "grandChildren()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[o.__childrenRef__[0].id].__childrenRef__.map(({ id }) => views[id])

    }, "prev()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthPrev({ _window, nth: 1, o })

    }, "2ndPrev()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthPrev({ _window, nth: 2, o })

    }, "3rdPrev()": ({ _window, o }) => {

        if (!o.__view__) return
        return nthPrev({ _window, nth: 3, o })

    }, "nthPrev()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__ || !o.id) return
        var nth = toValue({ _window, id, e, __, data: args[1], object, lookupActions, stack, props: { isValue: true } })
        return nthPrev({ _window, nth, o })

    }, "1stChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id || !o.__childrenRef__[0]) return
        return views[o.__childrenRef__[0].id]

    }, "child()": ({ views, o }) => {

        if (!o.__view__ || !o.id || !o.__childrenRef__[0]) return
        return views[o.__childrenRef__[0].id]

    }, "2ndChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id || !o.__childrenRef__[1]) return
        return views[o.__childrenRef__[1].id]

    }, "3rdChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id || !o.__childrenRef__[2]) return
        return views[o.__childrenRef__[2].id]

    }, "nthChild()": ({ _window, views, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__ || !o.id) return
        var nth = toValue({ _window, __, data: args[1], e, id, stack, object, props: { isValue: true }, lookupActions })
        if (!isNumber(nth)) return
        if (!o.__childrenRef__[nth - 1]) return
        return views[o.__childrenRef__[nth - 1].id]

    }, "3rdLastChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[o.__childrenRef__.slice(-3)[0].id]

    }, "2ndLastChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[o.__childrenRef__.slice(-2)[0].id]

    }, "lastChild()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return views[o.__childrenRef__.slice(-1)[0].id]

    }, "nthLastChild()": ({ _window, views, o, id, e, __, args, object }) => {

        if (!o.__view__ || !o.id) return
        var nth = toValue({ _window, __, data: args[1], e, id, object, props: { isValue: true } })
        if (!isNumber(nth)) return
        return views[o.__childrenRef__.slice(-1 * nth)[0].id]

    }, "children()": ({ views, o }) => {

        if (!o.__view__ || !o.id) return
        return o.__childrenRef__.map(({ id }) => views[id])

    }, "lastEl()": ({ o }) => {

        return o[o.length - 1]

    }, "2ndLastEl()": ({ o }) => {

        return o[o.length - 2]

    }, "3rdLastEl()": ({ o }) => {

        return o[o.length - 3]

    }, "nthLastEl()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var nth = toValue({ _window, __, data: args[1], e, id, lookupActions, stack, object, props: { isValue: true } })
        return o[o.length - nth]

    }, "while()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        while (toValue({ req, res, _window, lookupActions, stack, object, props: { isValue: true }, id, data: args[1], __, e })) {
            toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[2], __, e })
        }

    }, "data()": ({ _window, req, res, global, o, stack, props, lookupActions, id, e, __, args, object, i, lastIndex, value, key, path, breakRequest }) => {

        /*if (o.__props__) {
            var {__props__, ...data} = o
            return data
        }*/
        if (!o.__view__) return
        //
        if (key && value !== undefined) o.__defaultValue__ = value

        breakRequest.break = true

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] || "" })

        if (data.path) return answer = kernel({ req, res, _window, lookupActions, stack, props, id, e, data: { data: data.data || global[data.doc || o.doc], value, key, path: data.path }, __, object })

        if (!o.doc) return

        // ex: data()=value => ().data=value
        if (i === lastIndex && key && value !== undefined) o.data = value

        return kernel({ req, res, _window, lookupActions, stack, props, id, data: { path: [...o.__dataPath__, ...path.slice(i + 1)], data: global[o.doc], value, key }, __, e, object })

    }, "doc()": ({ _window, req, res, global, views, o, stack, props, lookupActions, id, e, __, args, object, i, value, key, path, breakRequest, answer }) => {

        breakRequest.break = true
        var doc = o.__view__ ? o.doc : views[id].doc

        if (args[1]) {

            if (isParam({ _window, string: args[1] })) {

                data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
                args[1] = data.path || data.__dataPath__ || []
                if (typeof args[1] === "string") args[1] = args[1].split(".")

                return answer = reducer({ req, res, _window, lookupActions, stack, props, id, e, data: { value, key, path: [`${doc}:()`, ...args[1], ...path.slice(i + 1)] }, object, __ })
            }

            if (args[1].charAt(0) === "@") args[1] = global.__refs__[args[1]].data
            args[1] = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e })
            if (typeof args[1] === "string") args[1] = args[1].split(".")

            return answer = reducer({ req, res, _window, lookupActions, stack, props, id, e, data: { value, key, path: [`${doc}:()`, ...args[1], ...path.slice(i + 1)] }, object, __ })
        }

        if (path[i + 1] !== undefined) {

            if (path[i + 1] && path[i + 1].charAt(0) === "@") path[i + 1] = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: global.__refs__[path[i + 1]].data, __, e, object })
            answer = reducer({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, data: { value, key, path: [`${doc}:()`, ...path.slice(i + 1)] }, object, __ })

        }

        else if (key && value !== undefined) {
            answer = global[doc] = value
            o.data = value
        }

        else answer = global[doc]

        return answer

    }, "installApp()": ({ global }) => {

        const installApp = async () => {

            global.__installApp__.prompt();
            const { outcome } = await global.__installApp__.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
        }

        installApp()

    }, "clearTimer()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var timer = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e, object }) || o
        return clearTimeout(timer)

    }, "clearInterval()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var timer = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e, object }) || o
        return clearInterval(timer)

    }, "interval()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__) return
        if (!isNaN(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, data: args[2], __, e }))) { // interval():params:timer

            var timer = parseInt(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[2], __, e, object }))
            var myFn = () => toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, __, data: args[1], object })
            return setInterval(myFn, timer)
        }

    }, "repeat()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object, i }) => {

        var item = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e, object })
        var times = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[2], __, e, object })
        var loop = []
        for (var i = 0; i < times; i++) {
            loop.push(item)
        }
        return loop

    }, "timer()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object, answer, pathJoined }) => { // timer():params:timer:repeats

        if (_window) return console.log("Cannot run a timer in server => " + decode({ _window, string: pathJoined }))

        var timer = args[2] ? parseInt(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[2], __, e, object })) : 0
        var repeats = args[3] ? parseInt(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[3], __, e, object })) : false
        var myFn = () => { eventExecuter({ req, res, event: "Timer", eventID: id, _window, lookupActions, id, string: args[1], __, e, object }) }

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
        return answer

    }, "slice()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object, answer }) => { // slice by text or by number

        if (!Array.isArray(o) && typeof o !== "string" && typeof o !== "number") return

        var start = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, data: args[1], __, object })
        var end = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, data: args[2], __, object })

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
        return answer

    }, "reduce()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, value, key, object }) => { // o.reduce():[path=]

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })
        if (Array.isArray(data) || typeof data !== "object") data = { path: data }
        return reducer({ _window, lookupActions, stack, props, id, data: { path: data.path, key: data.data !== undefined, value: data.data !== undefined ? data.data : value }, object: [o, ...object], e, req, res, __ })

    }, "path()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, lastIndex, value, key, object }) => {

        if (!o.__view__) return
        var data = {}
        if (args[1]) {

            if (isParam({ _window, string: args[1] })) {

                data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })

            } else data.path = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, data: args[1], __, object })
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

    }, "reload()": () => {

        document.location.reload(true)

    }, "contains()": ({ _window, req, res, views, o, stack, props, lookupActions, id, e, __, args, answer, object, pathJoined }) => {
        
        var first = o, next = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e, object })
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
       
        return answer

    }, "in()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var next = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e, object })

        if (next) {
            if (typeof o === "string" || Array.isArray(o) || typeof o === "number") return next.includes(o)
            else if (typeof o === "object") return next[o] !== undefined
            else if (o.nodeType === Node.ELEMENT_NODE && next.nodeType === Node.ELEMENT_NODE) return next.contains(o)
        } else return false

    }, "is()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var b = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, data: args[1], __, e })
        return isEqual(o, b)

    }, "opp()": ({ o }) => {

        if (typeof o === "number") return -1 * o
        else if (typeof o === "boolean") return !o
        else if (typeof o === "string" && o === "true" || o === "false") {
            if (o === "true") return false
            else return true
        }

    }, "neg()": ({ o }) => {

        return o < 0 ? o : -o

    }, "pos()": ({ o }) => {

        return o > 0 ? o : o < 0 ? -o : o

    }, "sum()": ({ o }) => {

        return o.reduce((o, k) => o + toNumber(k), 0)

    }, "src()": ({ o, lastIndex, value, key }) => {

        if (!o.__view__) return

        if (lastIndex && key && value !== undefined) return o.__element__.src = value
        else return o.__element__.src

    }, "clear()": ({ o }) => {

        if (!o.__view__) return
        o.__element__.value = null
        o.__element__.text = null
        o.__element__.files = null
        return o

    }, "list()": ({ o, answer }) => {

        answer = toArray(o)
        return [...answer]

    }, "notify()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        var notify = () => {
            if (isParam({ _window, string: args[1] })) {

                var _params = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
                new Notification(_params.title || "", _params)

            } else {

                var title = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
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

    }, "alert()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        var text = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, data: args[1], __, e })
        alert(text)

    }, "clone()": ({ o }) => {

        return clone(o)

    }, "override()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var obj1 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, data: args[1], __, e })
        override(o, obj1)

    }, "icon()": ({ views, o }) => {

        if (o.__name__ === "Icon") return o

        var icon

        var findIcon = (view) => {
            if (view.__name__ !== "View") return
            view.__childrenRef__.map(({ id }) => {
                if (icon) return
                if (views[id].__name__ === "Icon") icon = views[id]
                else findIcon(views[id])
            })
        }

        findIcon(o)
        return icon

    }, "icons()": ({ views, o }) => {

        if (o.__name__ === "Icon") return [o]

        var icons = []

        var findIcons = (view) => {
            if (view.__name__ !== "View") return
            view.__childrenRef__.map(({ id }) => {
                if (views[id].__name__ === "Icon") icons.push(views[id])
                else findIcons(views[id])
            })
        }

        findIcons(o)
        return icons

    }, "txt()": ({ views, o, i, lastIndex, value, key, path, breakRequest, answer, pathJoined }) => {

        if (!o.__view__) return

        if (o.__name__ === "Icon") return o.name

        var el
        if ((o.__islabel__ || o.__labeled__) && o.__name__ !== "Input") el = o.__element__.getElementsByTagName("INPUT")[0]
        else if (views[o.id].__status__ === "Mounted") el = o.__element__

        if (value) value = replaceNbsps(value)

        if (el) {

            if (views[el.id].__name__ === "Input") {

                answer = el.value
                if (i === lastIndex && key && value !== undefined && o.__element__) answer = el.value = value
                else if (path[i + 1] === "del()") {
                    breakRequest.index = i + 1
                    answer = el.value = ""
                }

            } else {

                answer = (el.textContent === undefined) ? el.innerText : el.textContent
                if (i === lastIndex && key && value !== undefined) answer = el.innerHTML = value
                else if (path[i + 1] === "del()") {
                    breakRequest.index = i + 1
                    answer = el.innerHTML = ""
                }
            }

        } else {

            if (i === lastIndex && key && value !== undefined) answer = views[o.id].text = value
            else if (path[i + 1] === "del()") {
                breakRequest.index = i + 1
                answer = views[o.id].text = ""
            }
            answer = views[o.id].text
        }
        return answer

    }, "min()": ({ o, i, lastIndex, value, key }) => {

        if (!o.__view__) return

        if (i === lastIndex && key && value !== undefined) o.min = value
        return o.min

    }, "max()": ({ o, i, lastIndex, value, key }) => {

        if (!o.__view__) return

        if (i === lastIndex && key && value !== undefined) o.max = value
        return o.max

    }, "push()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object, i, path, _object }) => {

        if (!Array.isArray(o)) o = kernel({ req, res, _window, id, stack, props: { isValue: true }, data: { data: _object, path: path.slice(0, i), value: [], key: true }, __, e, object })

        var item = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1], __, e, object })
        var index = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[2], __, e, object })

        if (!Array.isArray(o)) return
        if (index === undefined) index = o.length || 0

        if (Array.isArray(item)) {

            item.map(item => {
                o.splice(index, 0, item)
                index += 1
            })

        } else if (Array.isArray(o)) o.splice(index, 0, item)

        return o

    }, "pushItems()": ({ _window, req, res, o, id, e, __, args, object }) => {

        args.slice(1).map(arg => {
            arg = toValue({ req, res, _window, id, data: args[1], __, e, object, props: { isValue: true } })
            o.splice(o.length, 0, arg)
        })
        return o

    }, "pullIndex()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object, i, lastIndex, pathJoined }) => { // pull by index

        if (!Array.isArray(o)) {
            if (stack.server) return o
            else throw "Pulling index from a non list => " + decode({ _window, string: pathJoined })
        }

        // if no index pull the last element
        var lastIndex = 1, firstIndex = 0
        if (args[1]) firstIndex = toValue({ _window, id, data: args[1], __, e, lookupActions, stack, props: { isValue: true }, object })
        if (args[2]) lastIndex = toValue({ _window, id, data: args[2], __, e, lookupActions, stack, props: { isValue: true }, object })

        o.splice(firstIndex, lastIndex || 1)
        return o

    }, "pull()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object, pathJoined }) => { // pull by conditions

        if (!Array.isArray(o)) {
            if (stack.server) return o
            else throw "Pulling from a non list at pull() => " + decode({ _window, string: pathJoined })
        }
        var items = o.filter(o => toApproval({ _window, e, data: args[1], id, object: [o, ...object], __, lookupActions, stack, props }))

        items.filter(data => data !== undefined && data !== null).map(_item => {
            var _index = o.findIndex(item => isEqual(item, _item))
            if (_index !== -1) o.splice(_index, 1)
        })

        return o

    }, "pullItem()": ({ _window, o, id, e, __, args, stack, props, object, pathJoined }) => { // pull by item

        if (!Array.isArray(o)) {
            if (stack.server) return o
            else throw "Pulling item from a non list => " + decode({ _window, string: pathJoined })
        }
        var item = toValue({ _window, id, data: args[1], __, e, props: { isValue: true }, object })
        var index = o.findIndex(_item => isEqual(_item, item))
        if (index !== -1) o.splice(index, 1)
        return o

    }, "pullLast()": ({ _window, o, stack, props, pathJoined }) => {

        if (!Array.isArray(o)) {
            if (stack.server) return o
            else throw "Pulling last item from a non list => " + decode({ _window, string: pathJoined })
        }
        // if no it pulls the last element
        o.splice(o.length - 1, 1)
        return o

    }, "rem()": ({ _window, id, o, stack, props, __, e, object, args }) => {

        if (!o.__view__) return
        var data = toValue({ _window, id, data: args[1], __, e, props: { isValue: true }, object })
        remove({ id: o.id, __, stack, props, data })
        return true

    }, "keys()": ({ o }) => {

        return Object.keys(o)

    }, "key()": ({ o, i, lastIndex, value, key }) => {

        if (i === lastIndex && value !== undefined && key) return Object.keys(o)[0] = value
        else return Object.keys(o)[0]

    }, "values()": ({ o }) => { // values in an object

        if (Array.isArray(o)) return o
        else return Object.values(o)

    }, "value()": ({ o, i, lastIndex, value, key }) => { // value 0 in an object

        if (i === lastIndex && value !== undefined && key) return o[Object.keys(o)[0]] = value
        else return Object.values(o)[0]

    }, "gen()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        if (isParam({ _window, string: args[1] })) {

            var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            return generate(data)

        } else {

            var length = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }) || 5
            return generate({ length })
        }

    }, "inc()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var item = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })

        if (typeof o === "string") return o.split(item).length > 1
        else if (Array.isArray(o)) return o.find(_item => isEqual(_item, item)) ? true : false

    }, "incAny()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, answer, object }) => {

        var items = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })
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
        return answer

    }, "capitalize()": ({ o }) => {

        return capitalize(o)

    }, "capitalizeFirst()": ({ o }) => {

        return capitalizeFirst(o)

    }, "len()": ({ o }) => {

        if (Array.isArray(o)) return o.length
        else if (typeof o === "string") return o.split("").length
        else if (typeof o === "object") return Object.keys(o).length

    }, "require()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        require(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }))

    }, "new()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        var data = [], className = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
        args.slice(1).map(arg => {
            data.push(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: arg || "" }))
        })
        if (className && typeof (new [className]()) === "object") return new [className](...data)

    }, "timezone()": () => {

        var _date = new Date()
        var timeZone = Math.abs(_date.getTimezoneOffset()) * 60 * 1000
        return timeZone

    }, "clock()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object, answer }) => { // dd:hh:mm:ss

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })
        if (!data.timestamp) data.timestamp = o

        return toClock(data)

    }, "toSimplifiedDate()": ({ _window, req, res, o, stack, props, object, lookupActions, id, e, __, args, answer }) => {

        var data = toValue({ _window, req, res, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })
        return toSimplifiedDate({ timestamp: o, lang: data.lang || "en", timer: data.time || false })

    }, "lowercase()": ({ o }) => {
        return (o + "").toLowerCase()
    }, "uppercase()": ({ o }) => {
        return (o + "").toUpperCase()
    }, "camelcase()": ({ o }) => {

        var str = o
        // Split the string by spaces, dashes, and underscores
        let words = str.split(/[\s-_]/);

        // Convert the first word to lowercase
        let camelCaseStr = words[0].toLowerCase();

        // Capitalize the first letter of each word except the first word
        for (let i = 1; i < words.length; i++) {
            camelCaseStr += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        }

        return camelCaseStr;

    }, "ar()": ({ o }) => {
        //
        if (Array.isArray(o)) return o.map(o => o.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))
        else return o.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

    }, "date()": ({ _window, stack, props, lookupActions, id, e, __, args, object }) => {

        var data = toValue({ _window, id, data: args[1], __, e, lookupActions, stack, props: { isValue: true }, object })
        if (isNumber(data) && typeof data === "string") data = parseInt(data)
        return new Date(data)

    }, "toDateFormat()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => { // returns date for input

        if (isParam({ _window, string: args[1] })) {

            var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
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

            var format = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ }) || "format1"

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

    }, "toDateInputFormat()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => { // returns date for input in a specific format

        var data = {}
        if (isParam({ _window, string: args[1] })) {

            data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
        } else if (args[1]) {
            data = { date: toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ }) }
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

    }, "getGeoLocation()": ({ answer }) => {

        navigator.geolocation.getCurrentPosition((position) => { answer = position })
        return answer

    }, "counter()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })

        data.counter = data.counter || data.start || data.count || 0
        data.length = data.length || data.len || data.maxLength || 0
        data.end = data.end || data.max || data.maximum || 999999999999

        return require("./counter").counter({ ...data })

    }, "time()": ({ o }) => {

        if (isNumber(o)) {

            var _1Day = 24 * 60 * 60 * 1000, _1Hr = 60 * 60 * 1000, _1Min = 60 * 1000
            o = parseInt(o)

            var _days = Math.floor(o / _1Day).toString()
            _days = _days.length === 1 ? ("0" + _days) : _days

            var _hrs = Math.floor(o % _1Day, _1Hr).toString()
            _hrs = _hrs.length === 1 ? ("0" + _hrs) : _hrs

            var _mins = Math.floor(o % _1Hr, _1Min).toString()
            _mins = _mins.length === 1 ? ("0" + _mins) : _mins

            return _days + ":" + _hrs + ":" + _mins
        }

    }, "timestamp()": ({ o }) => {

        if ((typeof o === "number" || typeof o === "string") && new Date(o)) return new Date(o).getTime()
        else return new Date().getTime()

        /*else if (o.length === 5 && o.split(":").length === 2) {

            var _hrs = parseInt(o.split(":")[0]) * 60 * 60 * 1000
            var _mins = parseInt(o.split(":")[1]) * 60 * 1000
            return _hrs + _mins

        } else if (o.length === 8 && o.split(":").length === 3) {

            var _days = parseInt(o.split(":")[0]) * 24 * 60 * 60 * 1000
            var _hrs = parseInt(o.split(":")[1]) * 60 * 60 * 1000
            var _mins = parseInt(o.split(":")[2]) * 60 * 1000
            return _days + _hrs + _mins

        } else {

            o = new Date(o)
            if (o.getTime()) return o.getTime()
            o = new Date()
            return o.getTime()
        }*/

    }, "getDateTime()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var format = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1], __ })
        return getDateTime(o, format)

    }, "getDaysInMonth()": ({ o }) => {

        if (o instanceof Date) return new Date(o.getFullYear(), o.getMonth() + 1, 0).getDate()

    }, "1MonthLater()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()
        var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
        var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900

        return new Date(date.setYear(year)).setMonth(month, date.getDays())

    }, "2MonthLater()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()
        var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
        var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
        month = month + 1 > 11 ? 1 : month + 1
        year = month === 1 ? year + 1 : year

        return new Date(date.setYear(year)).setMonth(month, date.getDays())

    }, "3MonthLater()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
        var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
        month = month + 1 > 11 ? 1 : month + 1
        year = month === 1 ? year + 1 : year
        month = month + 1 > 11 ? 1 : month + 1
        year = month === 1 ? year + 1 : year
        return new Date(date.setYear(year)).setMonth(month, date.getDays())

    }, "1MonthEarlier()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
        var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
        return new Date(date.setYear(year)).setMonth(month, date.getDays())

    }, "2MonthEarlier()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
        var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
        month = month - 1 < 0 ? 11 : month - 1
        year = month === 11 ? year - 1 : year
        return new Date(date.setYear(year)).setMonth(month, date.getDays())

    }, "3MonthEarlier()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
        var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
        month = month - 1 < 0 ? 11 : month - 1
        year = month === 11 ? year - 1 : year
        month = month - 1 < 0 ? 11 : month - 1
        year = month === 11 ? year - 1 : year
        return new Date(date.setYear(year)).setMonth(month, date.getDays())

    }, "today()": () => {

        return new Date().getTime()

    }, "now()": () => {

        return new Date().getTime()

    }, "hourStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()
        date.setMinutes(0, 0, 0)
        return date.getTime()

    }, "todayStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()
        date.setHours(0, 0, 0, 0)
        return date.getTime()

    }, "todayEnd()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()
        date.setHours(23, 59, 59, 999)
        return date.getTime()

    }, "monthStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = _date.getTimezoneOffset() % 60
        var _hrs = (_date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(_date.setMonth(_date.getMonth(), 1)).setHours(_hrs, _min, 0, 0)

    }, "monthEnd()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(date.getMonth(), getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "nextMonthStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
        var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
        return new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

    }, "nextMonthEnd()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        var month = date.getMonth() + 1 > 11 ? 1 : date.getMonth() + 1
        var year = (month === 1 ? date.getYear() + 1 : date.getYear()) + 1900
        return new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "2ndNextMonthStart()": ({ o }) => {

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
        return new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

    }, "2ndNextMonthEnd()": ({ o }) => {

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
        return new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "prevMonthStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
        var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
        return new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

    }, "prevMonthEnd()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        var month = date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1
        var year = (month === 11 ? date.getYear() - 1 : date.getYear()) + 1900
        return new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "2ndPrevMonthStart()": ({ o }) => {

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
        return new Date(new Date(date.setYear(year)).setMonth(month, 1)).setHours(_hrs, _min, 0, 0)

    }, "2ndPrevMonthEnd()": ({ o }) => {

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
        return new Date(new Date(date.setYear(year)).setMonth(month, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "yearStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

    }, "yearEnd()": ({ o }) => {

        var date
        if (typeof o.getMonth === 'function') date = o
        else date = new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(0, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "nextYearStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

    }, "nextYearEnd()": ({ o }) => {

        var date
        if (typeof o.getMonth === 'function') date = o
        else date = new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(0, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "prevYearStart()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(0, 1)).setHours(_hrs, _min, 0, 0)

    }, "prevYearEnd()": ({ o }) => {

        var date = o instanceof Date ? o : new Date()

        var _min = date.getTimezoneOffset() % 60
        var _hrs = (date.getTimezoneOffset() / 60) - _min

        if (_hrs < 0) {
            _hrs = _hrs * -1
            _min = _min * -1
        }

        return new Date(date.setMonth(0, getDaysInMonth(date))).setHours(23 + _hrs, 59 + _min, 59, 999)

    }, "removeDuplicates()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => { // without condition and by condition. ex: removeDuplicates():number (it will remove items that has the same number value)

        if (args[1]) {

            var keys = toValue({ _window, e, data: args[1], id, __, lookupActions, stack, props: { isValue: true }, object })
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

    }, "replaceAll()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (typeof o === "string") {

            var rec0 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] || "" })
            var rec1 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[2] || "" })
            return o.replaceAll(rec0, rec1)
        }

    }, "replace()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object, i, path, _object, pathJoined }) => { // replace():[conditions]:newItem

        if (typeof o === "string") {

            var rec0 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] || "" })
            var rec1 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[2] || "" })
            if (rec1 !== undefined) return o.replace(rec0, rec1)
            else return o.replace(rec0)
        }

        if (!Array.isArray(o)) o = kernel({ req, res, _window, id, stack, props, data: { data: _object, path: path.slice(0, i), value: [], key: true }, __, e, object }) || []

        var newItem = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[2] || "" }), pushed = false

        if (o.length === 0) o.push(newItem)
        else {
            o.map((item, i) => {
                if (toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __, req, res, object: [item, ...toArray(object)] })) {
                    pushed = true
                    o[i] = newItem
                }
            })

            if (!pushed) o.push(newItem)
        }

        return o

    }, "replaceItem()": ({ o, req, res, _window, lookupActions, stack, props, id, e, __, args, object }) => { // replaceItem():item

        if (!Array.isArray(o) && typeof o !== "string") o = kernel({ req, res, _window, id, data: { data: _object, path: path.slice(0, i), value: [], key: true }, __, e, object })

        if (typeof o === "string") {

            var rec0 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] || "" })
            var rec1 = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[2] || "" })

            if (rec1 !== undefined) return o.replaceAll(rec0, rec1)
            else return o.replaceAll(rec0)
        }

        var newItem = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] || "" })
        var index = o.findIndex(item => isEqual(item, newItem))
        if (index >= 0) o[index] = newItem
        else o.push(newItem)

        return o

    }, "replaceItems()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (isParam({ _window, string: args[1] })) {

            var _params = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            var _path = _params.path, _data = _params.data.filter(data => data !== undefined && data !== null)
            toArray(_data).map(_data => {

                var _index = o.findIndex((item, index) => isEqual(kernel({ req, res, _window, lookupActions, stack, props, id, data: { path: _path || [], data: item }, __: [o, ...__], e }), kernel({ req, res, _window, lookupActions, stack, props, id, data: { path: _path || [], data: _data }, __: [o, ...__], e })))
                if (_index >= 0) o[_index] = _data
                else o.push(_data)
            })

        } else if (args[1]) {

            var _data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }).filter(data => data !== undefined && data !== null)
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

        return o

    }, "terminate()": ({ stack, }) => {

        stack.terminated = true

    }, "break()": ({ stack, }) => {

        if (stack.loop) stack.broke = true

    }, "return()": ({ _window, stack, props, lookupActions, id, e, __, args, object, answer, pathJoined }) => {

        stack.returns[0].data = answer = toValue({ _window, data: args[1], e, id, __, stack, props: { isValue: true }, object, lookupActions })
        stack.returns[0].returned = true

        return answer

    }, "export()": ({ _window, req, res, id, e, __, args }) => {

        var data = toLine({ _window, req, res, _window, id, e, __, data: { string: args[1] } }).data

        if (data.json) data.type = "json"
        if (data.csv) data.type = "csv"
        if (data.excel) data.type = "excel"
        if (data.pdf) data.type = "pdf"

        if (data.type === "json") exportJson(data)
        else if (data.type === "csv") require("./toCSV").toCSV(data)
        else if (data.type === "excel") require("./toExcel").toExcel(data)
        else if (data.type === "pdf") require("./toPdf").toPdf(data)

    }, "flat()": ({ o, object }) => {

        if (typeof o === "object") {
            if (Array.isArray(o)) {
                o = [...o]
                return o.flat()
            } else if (typeof o === "object") {

                Object.entries(o).map(([key, value]) => object[0][key] = value)
                return object[0]
            }
        } else return o

    }, "getDeepChildrenId()": ({ _window, o }) => {

        return getDeepChildrenId({ _window, id: o.id })

    }, "deep()": ({ _window, o }) => {

        return getDeepChildren({ _window, id: o.id })

    }, "deepChildren()": ({ _window, o }) => {

        return getDeepChildren({ _window, id: o.id })

    }, "filter()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, underScored, object }) => {

        var isnot = false
        args = args.slice(1)
        if (!args[0]) isnot = true

        if (isnot) return toArray(o).filter(o => o !== "" && o !== undefined && o !== null)

        if (underScored) return toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, props: { isCondition: true, isValue: false }, e, data: args[0], id, __: [o, ...__], object, req, res }))
        else return toArray(o).filter((o, index) => toApproval({ _window, lookupActions, stack, props: { isCondition: true, isValue: false }, e, data: args[0], id, object: [o, ...object], req, res, __ }))

    }, "find()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, underScored, i, lastIndex, value, key, answer, object }) => {

        if (i === lastIndex && key && value !== undefined) {

            var index
            if (underScored) index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, props: { isCondition: true, isValue: false }, e, data: args[1], id, __: [o, ...__], req, res, object }))
            else index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __, req, res, object: [o, ...toArray(object)] }))
            if (index !== undefined && index !== -1) o[index] = answer = value
            return answer

        } else {

            if (underScored) return toArray(o).find(o => toApproval({ _window, lookupActions, stack, props: { isCondition: true, isValue: false }, e, data: args[1], id, __: [o, ...__], req, res, object }))
            else return toArray(o).find(o => toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __, req, res, object: [o, ...toArray(object)] }))
        }

    }, "sort()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, answer, object, pathJoined }) => {

        var data = toParam({ req, res, _window, lookupActions, stack, props, object: [{}, ...object], id, e, __, data: args[1] })
        data.data = data.data || o

        data.data = answer = sort({ _window, lookupActions, stack, props, __, id, e, sort: data })

        return answer

    }, "findIndex()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, underScored, object }) => {

        if (typeof o !== "object") return

        if (underScored) return toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __: [o, ...__], req, res }))
        else return toArray(o).findIndex(o => toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __, req, res, object: [o, ...toArray(object)] }))

    }, "map()": ({ _window, req, res, global, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (args[1] && args[1].charAt(0) === "@" && args[1].length == 6) args[1] = global.__refs__[args[1]].data

        if (args[1] && underScored) {

            toArray(o).map((...o) => toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, data: args[1] || "", __: [o, ...__], e }))
            return o

        } else if (args[1]) {

            return toArray(o).map((...o) => toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[1] || "", object: [o, ...toArray(object)], __, e }))
        }

    }, "()": ({ _window, req, res, global, o, stack, props, lookupActions, id, e, __, args, underScored, object, breakRequest, pathJoined }) => {// map()

        var notArray = false
        if (args[1] && args[1].charAt(0) === "@" && args[1].length == 6) args[1] = global.__refs__[args[1]].data
        if (args[2] && args[2].charAt(0) === "@" && args[2].length == 6) args[2] = global.__refs__[args[2]].data

        if (typeof o === "object" && !Array.isArray(o)) notArray = true

        stack.loop = true

        if (args[1] && underScored) {

            toArray(o).map(o => toValue({ req, res, _window, lookupActions, stack, props: { ...props, isValue: false }, id, data: args[1] || "", object, __: [o, ...__], e }))
            return o

        } else if (args[1]) {

            return toArray(o).map(o => toValue({ req, res, _window, lookupActions, stack, props: { ...props, isValue: false }, id, data: args[1] || "", object: [o, ...object], __, e }))

        } else if (args[2] && underScored) {

            breakRequest.break = true
            var address;
            ([...toArray(o)]).reverse().map(o => {
                // address
                address = addresser({ _window, id, stack, props: { ...props, isValue: false }, nextAddress: address, __: [o, ...__], lookupActions, data: { string: args[2] }, object }).address
            })

            // address
            if (address) toAwait({ _window, id, lookupActions, stack, props: { ...props, isValue: false }, address, __, req, res })

        } else if (args[2]) {

            breakRequest.break = true
            var address;
            ([...toArray(o)]).reverse().map(o => {
                // address
                address = addresser({ _window, id, stack, props, nextAddress: address, __, lookupActions, data: { string: args[2] }, object: [o, ...toArray(object)] }).address
            })

            // address
            if (address) toAwait({ _window, id, lookupActions, stack, props, address, __, req, res })
        }

        stack.loop = false
        stack.broke = false

        if (notArray) return o

    }, "html2pdf()": ({ _window, o, stack, props, lookupActions, id, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, asynchronous: true, id: o.id, status: "Start", action: "html2pdf()", object, lookupActions, __, id })

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
                                exportHTMLToPDF({ _window, pages: _elements, opt, lookupActions, stack, props, address, req, res, id, e, __, args })

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
                                if (args[2]) require("./kernel").toAwait({ _window, lookupActions, stack, props, address, req, res, id, e, __: [pdf, ...__] })
                                window.devicePixelRatio = 1
                            })
                        }
                    })
                })

            } else html2pdf().set(opt).from(_element).save().then((pdf) => {


                // await params
                if (args[2]) require("./kernel").toAwait({ _window, lookupActions, stack, props, address, req, res, id, e, __: [pdf, ...__] })
                window.devicePixelRatio = 1
            })
        })*/

    }, "share()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        if (isParam({ _window, string: args[1] })) { // share():[text;title;url;files]

            var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }) || {}, images = []
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
            navigator.share({ url: toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }) })
        }

    }, "loader()": ({ _window, req, res, views, o, stack, props, object, lookupActions, id, e, __, args, k }) => {

        var data = {}

        if (isParam({ _window, string: args[1] })) {

            data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            if (data.hide) data.show = false

        } else {

            var show = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
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

    }, "type()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (args[1]) return getType(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }))
        else return getType(o)

    }, "coords()": ({ o }) => {

        if (!o.__view__) return
        require("./getCoords")({ id: o.id })

    }, "price()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!isNumber(o)) return

        var data = toParam({ req, res, _window, lookupActions, stack, props, object, id, e, __, data: args[1] })
        if (!data.decimal) data.decimal = 2
        var formatter = new Intl.NumberFormat("en", {
            style: 'decimal',
            decimal: data.decimal,
        })
        
        return formatter.format(parseFloat(o))

    }, "bool()": ({ o }) => {

        return typeof o === "boolean" ? o : (o === "true" ? true : o === "false" ? false : undefined)

    }, "num()": ({ o }) => {

        return toNumber(o)

    }, "isNum()": ({ o }) => {

        return isNumber(o)

    }, "round()": ({ _window, req, res, o, stack, props, object, lookupActions, id, e, __, args }) => {

        if (isNumber(o)) {
            var nth = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }) || 2
            return parseFloat(o || 0).toFixed(nth)
        }

    }, "str()": ({ o }) => {

        if (typeof o !== "object") return o + ""
        else return toString(o)

    }, "lastIndex()": ({ o }) => {

        return o.length ? o.length - 1 : 0

    }, "2ndLastIndex()": ({ o }) => {

        return o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

    }, "2ndLastIndex()": ({ o }) => {

        return o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

    }, "nthLastIndex()": ({ o }) => {

        return o.length ? (o.length - 1 ? o.length - 2 : o.length - 1) : o.length

    }, "el()": ({ o }) => {

        return o.__element__

    }, "index()": ({ o }) => {

        if (!o.__indexed__ && o.__loop__) return o.__loopIndex__
        else if (!o.__indexed__) return o.__childIndex__
        else return o.__index__

    }, "checked()": ({ o, value, key }) => {

        if (!o.__view__) return

        if (value !== undefined && key) return o.checked.checked = o.__element__.checked = value
        else return o.checked.checked || o.__element__.checked || false

    }, "check()": ({ o, value, breakRequest }) => {

        breakRequest.break = true
        if (!o.__view__) return

        return o.checked.checked = o.__element__.checked = value || false

    }, "parseFloat()": ({ o }) => {

        return parseFloat(o)

    }, "parseInt()": ({ o }) => {

        return parseInt(o)

    }, "stringify()": ({ o }) => {

        return JSON.stringify(o)

    }, "parse()": ({ o }) => {

        return JSON.parse(o)

    }, "getCookie()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        // getCookie():name
        if (isParam({ _window, string: args[1], req, res })) {

            var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            return getCookie({ ...data, req, res, _window })
        }

        var _name = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
        var _cookie = getCookie({ name: _name, req, res, _window })
        return _cookie

    }, "eraseCookie()": ({ _window, req, res, views, stack, props, pathJoined, lookupActions, id, e, __, args, object }) => {

        if (_window) return views.root.__controls__.push({ event: `loading?${pathJoined}` })

        // getCookie():name
        if (isParam({ _window, req, res, string: args[1] })) {
            var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            return eraseCookie({ ...data, req, res, _window })
        }

        var _name = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
        var _cookie = eraseCookie({ name: _name, req, res, _window })
        return _cookie

    }, "setCookie()": ({ _window, req, res, views, stack, props, pathJoined, lookupActions, id, e, __, args, object }) => {

        if (_window) return views.root.__controls__.push({ event: `loading?${pathJoined}` })

        // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
        var cookies = []
        if (isParam({ _window, req, res, string: args[1] })) {

            args.slice(1).map(arg => {

                var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: arg })
                setCookie({ ...data, req, res, _window })

                cookies.push(data)
            })

        } else {

            var _name = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            var _value = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[2] })
            var _expiryDate = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[3] })

            setCookie({ name: _name, value: _value, expires: _expiryDate, req, res, _window })
        }


        if (cookies.length === 1) return cookies[0]
        else return cookies

    }, "cookie()": ({ _window, req, res, views, stack, props, pathJoined, lookupActions, id, e, __, args, object }) => {

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })

        if (_window && data.method === "post" || data.method === "delete") return views.root.__controls__.push({ event: `loading?${pathJoined}` })
        if (data.method === "post") return setCookie({ ...data, req, res, _window })
        if (data.method === "delete") return eraseCookie({ ...data, req, res, _window })
        if (data.method === "get") return getCookie({ ...data, req, res, _window })

    }, "clean()": ({ o }) => {

        return o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")

    }, "colorize()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: args[1] || "", __ })
        return colorize({ _window, string: o, ...data })

    }, "deepChildren()": ({ _window, o, stack, props, lookupActions }) => {

        return getDeepChildren({ _window, lookupActions, stack, props, id: o.id })

    }, "note()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => { // note

        var data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
        note({ _window, note: data })
        return data

    }, "readonly()": ({ _window, o }) => {

        if (!o.__view__) return
        var children = getDeepChildren({ _window, id: o.id })

        children.map(child => {

            child.__element__.setAttribute("readOnly", true)
            child.__element__.setAttribute("contentEditable", false)
        })

    }, "editable()": ({ _window, o }) => {

        if (!o.__view__) return
        var children = getDeepChildren({ _window, id: o.id })

        children.map(child => {

            child.__element__.setAttribute("readOnly", false)
            child.__element__.setAttribute("contentEditable", true)
        })

    }, "range()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        var index = 0
        var range = []
        var startIndex = args[2] ? toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] }) : 0 || 0
        var endIndex = args[2] ? toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[2] }) : toValue({ req, res, _window, lookupActions, stack, props, id, e, __, data: args[1] })
        var steps = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[3] }) || 1
        var lang = args[4] || ""
        index = startIndex

        while (index <= endIndex) {
            if ((index - startIndex) % steps === 0) {
                range.push(index)
                index += steps
            }
        }

        if (lang === "ar") range = range.map(num => num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]))
        return range

    }, "droplist()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, id, interpreting: true, status: "Start", action: "droplist()", object, lookupActions, __ })
        require("./droplist").droplist({ id, e, data, __, stack, props, lookupActions, address, object })

    }, "route()": ({ _window, req, res, o, stack, props, lookupActions, id, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, interpreting: true, status: "Start", type: "action", asynchronous: true, id: o.id, action: "route()", object, lookupActions, __ })
        if (typeof data === "string") data = { data: data }

        route({ _window, lookupActions, stack, props, address, id, req, res, data: data.data, __ })

    }, "root()": ({ _window, req, res, o, stack, props, lookupActions, id, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props: { isValue: true }, args, interpreting: true, status: "Start", type: "action", blockable: false, renderer: true, id, action: "root()", object, lookupActions, __ })
        if (typeof data === "string") data = { page: data }

        root({ _window, lookupActions, stack, props, address, id, req, res, root: data, __ })

    }, "update()": ({ _window, req, res, o, stack, props, lookupActions, id, __, args, object }) => {

        if (!o.__view__) return o
        var { address, data = {} } = addresser({ _window, stack, props, args, interpreting: true, status: "Start", type: "action", dataInterpretAction: "toValue", renderer: true, blockable: false, id, action: "update()", object, lookupActions, __ })
        update({ _window, lookupActions, stack, props, req, res, id, address, __, data: { id: data.id || o.id, ...data } })

    }, "insert()": ({ _window, o, stack, props, lookupActions, id, __, args, object }) => {

        if (!o.__view__) return o

        // wait address
        var { address, data = {} } = addresser({ _window, stack, props, args, interpreting: true, status: "Start", type: "action", renderer: true, id, action: "insert()", lookupActions, __, object })
        insert({ id, lookupActions, stack, props, object, address, __, insert: { ...data, parent: o.id } })

    }, "confirmEmail()": ({ _window, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id, action: "confirmEmail()", object, lookupActions, __ })
        data.store = "confirmEmail"

    }, "mail()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__) return o

        // wait address
        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id, action: "mail()", object, lookupActions, __ })

        require("./mail").mail({ req, res, _window, lookupActions, stack, props, address, id, e, __, data })
        return true

    }, "print()": () => {

    }, "files()": ({ o }) => {

        return o.__files__

    }, "file()": ({ o }) => {

        return o.__file__

    }, "read()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        // wait address
        var { address, data, action } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id, action: "read()", object, lookupActions, __, id, dataInterpretAction: "conditional" })

        if (!data) return
        if (action === "toValue") data.file = data

        fileReader({ req, res, _window, lookupActions, stack, props, address, id, e, __, data })

    }, "passport()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, req, res, status: "Start", dataInterpretAction: "toParam", asynchronous: true, id: o.id, type: "Auth", action: "passport()", object, lookupActions, __, id })
        passport({ _window, lookupActions, stack, props, address, id, e, __, req, res, data })

    }, "upload()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, mount }) => {

        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id, type: "Data", action: "upload()", object, mount, lookupActions, __ })
        upload({ _window, lookupActions, stack, props, address, req, res, id, e, upload: data, __ })

    }, "database()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id || id, type: "Data", action: "database()", object, lookupActions, __ })
        return callDatabase({ _window, lookupActions, stack, props, address, id, e, __, req, res, data: { data: (data === undefined ? __[0] : data), action: data.action } })

    }, "search()": ({ _window, global, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id || id, type: "Data", action: "search()", object, lookupActions, __ })
        return callDatabase({ _window, lookupActions, stack, props, address, id, e, __, req, res, data: { data: data === undefined ? __[0] : data, action: "search()" } })

    }, "erase()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id || id, type: "Data", action: "erase()", object, lookupActions, __ })
        return callDatabase({ _window, lookupActions, stack, props, address, id, e, __, req, res, data: { data: data === undefined ? __[0] : data, action: "erase()" } })

    }, "save()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var { address, data } = addresser({ _window, stack, props, args, status: "Start", asynchronous: true, id: o.id || id, type: "Data", action: "save()", object, lookupActions, __ })
        return callDatabase({ _window, lookupActions, stack, props, address, id, e, __, req, res, data: { data: data === undefined ? __[0] : data, action: "save()" } })

    }, "start()": ({ global, stack, props }) => {

        var address = stack.addresses.find(address => address.id === stack.interpretingAddressID)
        address.starter = true
        var startID = generate()
        global.__startAddresses__[startID] = { id: startID, address }

        stack.logs.push(`${stack.logs.length} Starter STACK ${stack.id} ${stack.event.toUpperCase()} ${stack.string}`)

        return startID

    }, "end()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, o, object }) => {

        var { data } = toLine({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, e, __, data: { string: args[1] }, action: "toValue", object })
        endAddress({ req, res, _window, lookupActions, stack, props, object, id, e, __, data, endID: typeof o === "string" && o })

    }, "send()": ({ _window, req, res, global, stack, props, lookupActions, id, e, __, args, object, breakRequest, pathJoined }) => {

        breakRequest.break = true

        var response

        if (isParam({ _window, string: args[1] })) {

            response = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
            //console.log(decode({_window, string:args[1]}));
            response.success = response.success !== undefined ? response.success : true
            response.message = response.message || response.msg || "Action executed successfully!"
            delete response.msg

        } else {

            var data = toValue({ req, res, _window, lookupActions, id, e, __, data: args[1], stack, props: { isValue: true }, object })
            response = { success: true, message: "Action executed successfully!" }
            if (typeof data === "object" && !Array.isArray(data)) response = { ...response, ...data }
            else response.data = data
        }

        respond({ res, stack, props, global, response, __ })
        return response

    }, "sent()": ({ res }) => {

        if (!res || res.headersSent) return true
        else return false

    }, "position()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var position = toValue({ req, res, _window, lookupActions, stack, props: {isValue: true}, id, e, __, data: args[1], object })

        if (!position.id) position.id = o.id
        if (!position.positioner) position.positioner = id

        require("./setPosition").setPosition({ position, id, e })
        return views[position.id]

    }, "csvToJson()": ({ _window, req, res, stack, props, lookupActions, id, e, __, args, object }) => {

        var file = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
        require("./csvToJson").csvToJson({ id, lookupActions, stack, props, object, e, file, onload: args[2] || "", __ })

    }, "copyToClipBoard()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        var text
        if (args[1]) text = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: args[1] })
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

    }, "addClass()": ({ _window, req, res, o, stack, props, lookupActions, id, e, __, args, object }) => {

        if (!o.__view__) return o
        var _class = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __: [o, ...__], data: args[1] })
        if (o.__element__) return o.__element__.classList.add(_class)

    }, "remClass()": ({ _window, req, res, o, stack, props, object, lookupActions, id, e, __, args }) => {

        if (!o.__view__) return o
        var _class = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __: [o, ...__], data: args[1] })
        if (o.__element__) return o.__element__.classList.remove(_class)

    }, "toggleClass()": ({ _window, req, res, o, stack, props, object, lookupActions, id, e, __, args }) => {

        if (!o.__view__) return o
        var _class = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __: [o, ...__], data: args[1] })
        if (o.__element__) return o.__element__.classList.toggle(_class)

    }, "encodeURI()": ({ o }) => {

        return encodeURI(o)

    }, "preventDefault()": ({ e }) => {

        e.preventDefault()

    }, "decodeURI()": ({ o }) => {

        return decodeURI(o)

    }
}

const builtInActions = Object.keys(actions)

const kernel = ({ _window, lookupActions, stack, props = {}, id, __, e, req, res, data: { data: _object, path, pathJoined, value, key }, object = [] }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id] // || { id, __view__: true }

    var pathJoined = pathJoined || path.join("."), breakRequest = { break: false, index: -1 }

    // no path but there is value
    if (path.length === 0 && key && value !== undefined) return value

    var answer = path.reduce((o, k, i) => {

        // break
        if (breakRequest.break === true || breakRequest.index >= i) return o

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

        // undefined
        if ((o === undefined || o === null) && k0 !== "push()" && k0 !== "replace()" && k0 !== "replaceItem()") return o

        // delete
        if (k0 !== "data()" && k0 !== "doc()" && path[i + 1] === "del()") {

            breakRequest.index = i + 1
            if (k.charAt(0) === "@" && k.length === 6) k = toValue({ req, res, _window, lookupActions, stack, props, object, id, e, __, data: k })

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

        }

        // underscore
        else if (underScored && !k0) { // _

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

        }

        // @coded
        else if (k.charAt(0) === "@" && k.length === 6) { // k not k0

            var data
            if (k0.charAt(0) === "@" && global.__refs__[k0].type === "text") data = global.__refs__[k0].data
            else data = toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, data: global.__refs__[k0].data, __ })

            if (typeof data !== "object") {

                if (Array.isArray(o) && isNumber(data) && data < 0) { // negative index

                    var item = o[o.length + data]

                    if (i === lastIndex && key && value !== undefined) {
                        o.splice(o.length + data, 1, value)
                        answer = value
                    } else answer = item

                } else if (i === lastIndex && key && value !== undefined) answer = o[data] = value
                else if (i !== lastIndex && key && value !== undefined && o[data] === undefined) {

                    if (isNumber(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, data: path[i + 1], __, e }))) answer = o[data] = []
                    else answer = o[data] = {}
                }
                else answer = o[data]
                //console.log(decode({_window, string: pathJoined}), clone(answer), data);
            } else answer = data
        }

        // OOP
        else if (actions[k0]) return actions[k0]({ _window, req, res, global, views, view, o, stack, props, pathJoined, lookupActions, id, e, __, args, k, underScored, object, i, lastIndex, value, key, path, breakRequest, _object, answer })

        // js method()
        else if (k0.slice(-2) === "()" && typeof o[k0.slice(0, -2)] === "function") {

            var data = []
            args.slice(1).map(arg => {
                data.push(toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, object, id, e, __, data: arg || "" }))
            })

            answer = o[k0.slice(0, -2)](...data)
        }

        // action()
        else if (k0.slice(-2) === "()") answer = toAction({ _window, lookupActions, stack, props, id, req, res, __, e, data: { action: k }, object: [o, ...toArray(object)] })

        // endoced params
        else if (k.includes(":@")) {

            breakRequest.break = true

            // decode
            if (k0.charAt(0) === "@" && k0.length == 6) k0 = global.__refs__["@" + k0.slice(-5)].data

            if (events.includes(k0)) {

                if (!o.__view__) return

                var data = global.__refs__["@" + args[1].slice(-5)].data

                return views[id].__controls__.push({ event: k0 + "?" + data, id, __, lookupActions, eventID: o.id })
            }

            o[k0] = o[k0] || {}

            if (args[1]) answer = toParam({ req, res, _window, lookupActions, stack, props, id, e, object: [o[k0], ...object], data: args[1], __ })
            else return
        }

        // lastindex
        else if (key && value !== undefined && i === lastIndex) {

            if (Array.isArray(o)) {
                if (!isNumber(k)) {
                    if (o.length === 0) o.push({})
                    o = o[0]
                }
            }
            answer = o[k] = value
        }

        // assign {} of []
        else if (key && o[k] === undefined && i !== lastIndex) {

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
        }

        else answer = o[k]

        return answer

    }, _object)

    return answer
}

const toValue = ({ _window, lookupActions = [], stack = { addresses: [], returns: [] }, props = { isValue: true }, address, data: value, key, __, id, e, req, res, object = [], mount }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    if (!value) return value

    // coded
    if (value.charAt(0) === "@" && value.length == 6 && global.__refs__[value].type === "text") return global.__refs__[value].data
    if (value.charAt(0) === "@" && value.length == 6) value = global.__refs__[value].data

    // value?condition?value
    if (value.split("?").length > 1) return toLine({ _window, lookupActions, stack, props, id, e, data: { string: value }, req, res, mount, __, object, action: "toValue" }).data

    // value is a param it has key=value
    if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, address, stack, props, e, data: value, __, object: props.isValue ? [{}, ...object] : object })

    // no value
    if (value === "()") return views[id]
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
    else if (value.charAt(0) === "." && !value.split(".").find(i => i !== "." && i !== "")) return object[value.split(".").length - 2]
    else if (value === "[]") return ({})
    else if (value === ":[]") return ([{}])
    else if (value === " ") return value
    else if (value === ":") return ([])

    // loader
    if (value === "loader.show" || value === "loader.hide") return loader({ _window, show: value === "loader.show" })

    if (value.includes("||")) { // or
        var answer
        value.split("||").map(value => {
            if (!answer) answer = toValue({ _window, lookupActions, stack, props: { isValue: true }, data: value, __, id, e, req, res, object })
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
                toParam({ req, res, _window, lookupActions, id, e, data: value, __, object, mount, props })
                return (toValue({ _window, lookupActions, stack, props, data: value, __, id, e, req, res, object, mount }) - 1)

            } else {

                var values = [], allAreNumbers = false, allAreArrays = false, allAreObjects = false

                var val0 = values[0] = toValue({ _window, lookupActions, stack, props: { isValue: true }, object, data: value.split("+")[0], __, id, e, req, res })

                if (isNumber(val0) || typeof val0 === "number") allAreNumbers = true
                else if (Array.isArray(val0)) allAreArrays = true
                else if (typeof val0 === "object") allAreObjects = true

                value.split("+").slice(1).map(value => {

                    var val0 = toValue({ _window, lookupActions, stack, props: { isValue: true }, object, data: value, __, id, e, req, res })

                    if (allAreNumbers) {

                        allAreArrays = false
                        allAreObjects = false
                        if (isNumber(value) || (executable({ _window, string: value }) && typeof val0 === "number")) allAreNumbers = true
                        else allAreNumbers = false

                    } else if (allAreObjects) {

                        allAreNumbers = false
                        allAreArrays = false
                        if (typeof val0 !== "object") allAreObjects = false
                    }

                    values.push(val0)
                })

                if (allAreArrays) {

                    var array = [...values[0]]
                    values.slice(1).map(val => {
                        // push map, string, num... but flat array
                        if (!Array.isArray(val)) array.push(val)
                        else array.push(...val)
                    })
                    return array

                } else if (allAreNumbers) {

                    var value = 0
                    values.map(val => value += (parseFloat(val) || 0))
                    return value

                } else if (allAreObjects) {

                    var object0 = {}
                    values.map(obj => object0 = { ...object0, ...obj })
                    return object0

                } else {

                    var value = ""
                    values.map(val => value += val + "")
                    return value
                }
            }
        }

        if (value.includes("-")) { // subtraction

            var _value = calcSubs({ _window, lookupActions, stack, props, value, __, id, e, req, res, object })
            if (_value !== value) return _value
        }

        if (value.includes("*") && value.split("*")[1] !== "") { // multiplication

            var values = value.split("*").map(value => toValue({ _window, lookupActions, stack, props: { isValue: true }, data: value, __, id, e, req, res, object, mount }))
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

            var _value = calcDivision({ _window, lookupActions, stack, props, value, __, id, e, req, res, object })
            if (_value !== value && _value !== undefined) return _value
        }

        if (value.includes("%") && value.split("%")[1] !== "") { // modulo

            var _value = calcModulo({ _window, lookupActions, stack, props, value, __, id, e, req, res, object })
            if (_value !== value && _value !== undefined) return _value
        }
    }

    // list => check calculations then list
    if (value.charAt(0) === ":") return value.split(":").slice(1).map(item => toValue({ req, res, _window, id, stack, props: { isValue: true }, lookupActions, __, e, data: item, object })) // :item1:item2

    var path = typeof value === "string" ? value.split(".") : []

    // number
    if (isNumber(value)) value = parseFloat(value)
    else if (path.length > 1 || path.find(path => executableRegex.test(path)) || !props.isValue || props.isKey) value = reducer({ _window, lookupActions, stack, props, id, data: { path, value }, object, __, e, req, res, mount })

    return value
}

const toParam = ({ _window, lookupActions, stack = { addresses: [], returns: [] }, props = {}, address, data: string, e, id, req, res, mount, object = [], __ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id] || { id, __view__: true, __fake__: true }

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
        return toLine({ _window, lookupActions, stack, props: { isValue: false, ...props }, id, e, data: { string }, req, res, __, object, action: "toParam" }).data
    }

    // conditions
    if (props.isCondition || isCondition({ _window, string })) return toApproval({ id, lookupActions, stack, props, e, data: string, req, res, _window, __, object })

    // init
    if (object.length === 0) object.push({})
    var params = object[0]

    props.isValue = false

    string.split(";").map(param => {

        // set interpreting
        if (address && address.id) stack.interpretingAddressID = address.id

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
            return params = { ...params, ...toParam({ _window, lookupActions, stack, props, data: param, e, id, req, res, object, __ }) }
        }

        // increment
        if (key && value === undefined && key.slice(-2) === "++") {
            key = key.slice(0, -2)
            value = parseFloat(toValue({ _window, lookupActions, stack, props: { isValue: true }, req, res, id, e, data: key, __, object }) || 0) + 1
        }

        // decrement
        else if (key && value === undefined && key.slice(-2) === "--") {
            key = key.slice(0, -2)
            value = parseFloat(toValue({ _window, lookupActions, stack, props: { isValue: true }, req, res, id, e, data: key, __, object }) || 0) - 1
        }

        // ||=
        else if (key && value && key.slice(-2) === "||") {
            key = key.slice(0, -2)
            value = `${key}||${value}`
        }

        // +=
        else if (key && value && key.slice(-1) === "+") {

            key = key.slice(0, -1)
            var myVal = (key.split(".")[0].slice(0, 2) === "()" || key.split(".")[0].slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
            var data = `[${myVal}||[if():[type():[${value}]=number]:0.elif():[type():[${value}]=map]:[].elif():[type():[${value}]=list]:[:]:'']]`
            data = toCode({ _window, id, string: toCode({ _window, id, string: data, start: "'" }) })
            value = `${data}+${value}`
        }

        // -=
        else if (key && value && key.slice(-1) === "-") {

            key = key.slice(0, -1)
            var myVal = (key.split(".")[0].slice(0, 2) === "()" || key.split(".")[0].slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
            var data = toCode({ _window, id, string: `[${myVal}||0]` })
            var data1 = toCode({ _window, id, string: `[${value}||0]` })
            value = `${data}-${data1}`
        }

        // *=
        else if (key && value && key.slice(-1) === "*") {

            key = key.slice(0, -1)
            var myVal = (key.split(".")[0].slice(0, 2) === "()" || key.split(".")[0].slice(-3) === ":()" || key.includes("_") || key.split(".")[0] === "") ? key : (`().` + key)
            var data = toCode({ _window, id, string: `[${myVal}||0]` })
            value = `${data}*${value}`
        }

        // !key
        if (param.slice(0, 1) === "!" && value === undefined) {
            value = false
            key = key.slice(1)
        }

        // loader
        if (param === "loader.show" || param === "loader.hide") return loader({ _window, show: param === "loader.show" })

        var path = typeof key === "string" ? key.split(".") : [], args = path[0].split(":"), path0 = path[0].split(":")[0]

        // interpret value
        if (typeof value === "string") {

            value = toValue({ _window, lookupActions, stack, props: { ...props, isValue: true }, req, res, id, e, data: value, __, object, key, param })

            if (value && typeof value === "string") value = replaceNbsps(value)

        } else if (value === undefined) value = generate()

        // :@1asd1
        if (!path0 && path[0]) return

        /*// .param=value or .[params]
        else if (!path[0]) {

            var index = -1
            while (param.charAt(0) === ".") {
                index += 1
                param = param.slice(1)
            }

            if (object[index]) return toParam({ req, res, _window, id, lookupActions, address, stack, props, e, data: param, __, object: object.slice(index) })
            else return object[index]
        }*/

        // if()
        if (path0 === "if()") {

            var data = {}
            var approved = toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __, req, res, object })

            if (!approved) {

                if (args[3]) {

                    data = toParam({ req, res, _window, lookupActions, stack, props, id, data: args[3], __, e, object })
                    path.shift()

                } else if (path[1] && path[1].includes("elif()")) {

                    path.shift()
                    path[0] = path[0].slice(2)
                    data = toParam({ _window, lookupActions, stack, props, id, data: path.join("."), __, e, req, res, object })
                }

                if (data) params = override(params, data)
                return data

            } else {

                data = toParam({ req, res, _window, lookupActions, stack, props, id, data: args[2], __, e, object, mount })

                path.shift()

                // remove elses and elifs
                while (path[0] && path[0].includes("elif()")) { path.shift() }

                // empty path
                if (!path[0]) return params = override(params, data)
            }

            return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, mount, object, data: { data, path, value, key, pathJoined: param } })
        }
/*
        // [params]
        if (param.charAt(0) === "@" && param.length === 6 && isParam({ _window, string: param })) return toParam({ req, res, _window, id, lookupActions, address, stack, props, e, data: param, __, object })
*/
        // reduce
        reducer({ _window, lookupActions, stack, props: {isParam:true, isValue:false}, id, data: { path, value, key }, object, e, req, res, __, mount, action: "toParam" })

        // path & data & doc
        if ((object[0] || {}).__view__ && !view.__fake__) mountData({ view, views, global, key, id, params, __ })
    })

    return params
}

const reducer = ({ _window, lookupActions = [], stack = { addresses: [], returns: [] }, props = {}, id, data: { path, value, key }, object = [], __, e, req, res, action, mount }) => {

    if ((stack.returns && stack.returns[0] || {}).returned || stack.terminated || stack.blocked || stack.broke) return

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
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
    if (isParam({ _window, string: pathJoined })) return toParam({ req, res, _window, lookupActions, stack, props, id, e, data: pathJoined, __, object })

    // toValue
    if (isCalc({ _window, string: pathJoined }) && !key) return toValue({ _window, lookupActions, stack, props, data: pathJoined, __, id, e, req, res, object })

    // [actions?conditions?elseActions]():[path;view]:[waits]
    else if (path0.length === 8 && path0.slice(-2) === "()" && path0.charAt(0) === "@") {

        var myLookupActions = lookupActions, myID, my__ = __, myObject = object
        var { address, data } = addresser({ _window, stack, props, args, id, type: "action", action: "[...]()", data: { string: global.__refs__[path0.slice(0, -2)].data, dblExecute: true }, __, lookupActions, object, mount })

        // doc, view, path, collection, db
        if (typeof data === "object" && data.__view__) {

            myID = data.id
            my__ = [...data.__, ...my__]
            myObject = [data, ...myObject]
            myLookupActions = [data.__lookupActions__.slice(0, -1), ...myLookupActions]

        } else if (typeof data === "object") {

            if ("condition" in data) {
                address.params.props.isCondition = data.condition
                if (address.hasWaits) stack.addresses.find(({ id }) => id === address.nextAddressID).params.isCondition = data.condition
            }

            if (data.view) {

                myID = data.view.id
                myObject = [data.view, ...myObject]
                my__ = [...data.view.__, ...my__]
                myLookupActions = [...data.view.__lookupActions__.slice(0, -1), ...myLookupActions]
            }

            if ("data" in data) {
                my__ = [data.data, ...my__]
            }

            if (data.doc || data.path || data.collection || data.db) {

                if (typeof data.path === "string") data.path = data.path.split(".")
                myLookupActions = [{ doc: data.doc || myLookupActions[0].doc, path: data.path, collection: data.collection || myLookupActions[0].collection, db: data.db }, ...myLookupActions]
            }

        } else if (typeof data === "string") myLookupActions = [{ doc: data, collection: "view" }, ...myLookupActions]

        address.params = { ...address.params, id: myID || id, lookupActions: myLookupActions, __: my__, object: myObject }

        //console.log("before", decode({ _window, string: path0.slice(0, -2)}), clone(object));
        var data = toAwait({ _window, lookupActions: myLookupActions, stack, props, object: myObject, address, id: myID || id, e, req, res, __: my__ }).data
        if (path[1]) return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data, path: path.slice(1), value, key, pathJoined } })
        else return data
    }

    // if()
    else if (path0 === "if()") {

        var data
        var approved = toApproval({ _window, lookupActions, stack, props: { isValue: true }, e, data: args[1], id, __, req, res, object })

        if (!approved) {

            if (args[3]) {

                if (props.isCondition) return toApproval({ _window, lookupActions, stack, props, e, data: args[3], id, __, req, res, object })
                else return toValue({ req, res, _window, lookupActions, stack, props, id, data: args[3], __, e, object })

            } else if (path[1] && path[1].includes("elif()")) {

                path.shift()
                path[0] = path[0].slice(2)
                return reducer({ _window, lookupActions, stack, props, id, data: { path, value, key }, object, __, e, req, res })

            } else return data

        } else {

            //if (props.isCondition) return toApproval({ _window, lookupActions, stack, props, e, data: args[2], id, __, req, res, object })
            if (path[1]) data = toValue({ req, res, _window, lookupActions, stack, props, id, data: args[2], __, e, object })
            else return toValue({ req, res, _window, lookupActions, stack, props, id, data: args[2], __, e, object })

            path.shift()

            // remove elses and elifs
            while (path[0] && path[0].includes("elif()")) { path.shift() }

            // empty path
            if (!path[0]) return data
        }

        return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data, path, value, key, pathJoined } })
    }

    // while()
    else if (path0 === "while()") {

        while (toApproval({ _window, lookupActions, stack, props, e, data: args[1], id, __, req, res, object })) {
            toValue({ req, res, _window, lookupActions, stack, props: { isValue: true }, id, data: args[2], __, e, object })
        }
        // path = path.slice(1)
        return global.return = false
    }

    // global:()
    else if (path0 && args[1] === "()" && !args[2]) {

        var globalVariable = toValue({ req, res, _window, id, e, data: args[0], __, stack, props: { isValue: true }, lookupActions, object })
        if (path.length === 1 && key && globalVariable) return global[globalVariable] = value

        path.splice(0, 1, globalVariable)
        return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: global, path, value, key, pathJoined } })
    }

    // view => ():id
    else if (path0 === "()" && args[1]) {

        // id
        var customID = toValue({ req, res, _window, lookupActions, stack, id, e, data: args[1], __, object, props: { isValue: true } })
        path.shift()
        return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: views[customID || args[1] || id], path, value, key, pathJoined } })
    }

    // .value
    else if (path[0] === "" && path.length > 1) {

        if (!isNumber(path[1].charAt(0))) {

            var index = 0
            while (pathJoined.charAt(index) === ".") { index++ }
            path = path.slice(index)
            var t = kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: object[index - 1], path, value, key, pathJoined } })
            //console.log(decode({_window, string: pathJoined}), clone(object), t);
            return t
        } else return pathJoined
    }

    // @coded
    else if (path0.charAt(0) === "@" && path[0].length === 6) {

        var data

        // text in square bracket
        if (global.__refs__[path[0]].type === "text" && key && value !== undefined) {
            kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: object[0], path, value, key, pathJoined } })
            return object[0]
        }

        if (global.__refs__[path[0]].type === "text") return global.__refs__[path[0]].data
        else data = toLine({ _window, req, res, lookupActions, stack, props: {...props, isParam: path[1] ? false : props.isParam}, object, id, data: { string: global.__refs__[path[0]].data }, __, e }).data

        if (path[1] === "flat()") {

            if (Array.isArray(data)) {

                data = [...data]
                return data.flat()

            } else {

                if (typeof object[0] === "object") return override(object[0], data)
                return object[0]
            }

        } else {

            if (!path[1] && key) {

                if (value !== undefined) object[0][data] = value
                return object[0][data]

            } else if (path[1]) {

                path.splice(0, 1)
                return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data, path, value, key, pathJoined } })

            } else return data
        }
    }

    // action()
    else if (path0.slice(-2) === "()") {

        var action = toAction({ _window, lookupActions, stack, props, id, req, res, __, e, data: { action: path[0] }, object })
        if (action !== "__continue__") return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: action, path: path.slice(1), value, key, pathJoined } })
    }

    if (path0 === "class()") {
        return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: views.document, path, value, key, pathJoined } })
    } else {
        var __o = (object[0] || {}).__view__ ? object[0] : view || {}
        if (__o.__labeled__ && (path0.toLowerCase().includes("prev") || path0.toLowerCase().includes("next") || path0.toLowerCase().includes("parent"))) {

            if (__o.__featured__) path = ["2ndParent()", ...path]
            else path.unshift("parent()")

        } else if (__o.__islabel__ && path0 === "txt()" || path0 === "min()" || path0 === "max()") path.unshift("input()")
    }

    // assign reserved vars
    var mainVars = {
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

    // main var (win(), document()...) or underscore
    if (mainVars.keys.includes(path0) || underScored) {

        var data
        if (mainVars.keys.includes(path0)) data = mainVars[path0]
        else data = __[path0.split("_").length - 2]

        path.shift()
        return kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data, path, value, key, pathJoined } })
    }

    // lookup object
    if (props.isValue || path.length > 1 || executableRegex.test(pathJoined)) {

        var index = 0, answer

        while (object[index] !== undefined && answer === undefined) {
            answer = kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: object[index], path, value, key, pathJoined } })
            index++
        }
        if (answer === undefined && !props.isCondition && props.isValue && !executableRegex.test(pathJoined)) answer = pathJoined

    } else answer = kernel({ _window, lookupActions, stack, props, id, __, e, req, res, object, data: { data: object[0], path, value, key, pathJoined } })

    return answer
}

const toApproval = ({ _window, lookupActions, stack, props, e, data: string, id, __, req, res, object = [] }) => {

    // no string but object exists
    if (!string)
        if (object[0]) return true
        else if (object[0] !== undefined) return false

    // no string
    if (!string || typeof string !== "string") return true

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], approval = true

    if ((stack.returns && stack.returns[0] || {}).returned) return

    // coded
    if (string.charAt(0) === "@" && string.length == 6) string = global.__refs__[string].data

    // ==
    string = string.replaceAll("==", "=")

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
                approval = toValue({ _window, lookupActions, stack, props: { isCondition: true }, e, data: conditions[i], id, __, req, res, object })
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
        if (value) value = toValue({ _window, lookupActions, stack, props: { isCondition: true, isValue: true }, id, data: value, e, __, req, res, object })

        // encoded
        if (key.charAt(0) === "@" && key.length == 6 && global.__refs__[key].type === "text") {
            if (value === undefined) return approval = global.__refs__[key].data ? true : false
            else return approval = global.__refs__[key].data === value
        }

        // operator has !
        if (key.at(0) === "!" || key.at(-1) === "!") {

            if (key.at(-1) === "!") {

                if (condition[1]) {
                    notEqual = true
                    key = key.split("!")[0]
                }

            } else {

                key = key.slice(1)
                notEqual = true
                if (key.charAt(0) === "@" && key.length === 6) {
                    key = toApproval({ _window, lookupActions, stack, props, e, data: key, id, __, req, res, object })
                }
            }
        }

        // get key
        if (typeof key === "string") {

            //if (key.charAt(0) === "@" && key.length == 6) key = global.__refs__[key].data
            key = toValue({ _window, lookupActions, stack, props: { isCondition: true, isValue: true, isKey: true }, id, data: key, e, __, req, res, object })
        }

        // evaluate
        if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !key : key
        else {

            if (equalOp) approval = notEqual ? !isEqual(key, value) : isEqual(key, value)
            if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(key) > parseFloat(value)) : (parseFloat(key) > parseFloat(value))
            if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(key) < parseFloat(value)) : (parseFloat(key) < parseFloat(value))
        }
    })
    return approval
}

const toAction = ({ _window, id, req, res, __, e, data: { action }, mount, object = [], lookupActions = {}, stack, props = {} }) => {

    var views = _window ? _window.views : window.views

    if (!views[id]) return "__continue__"

    var action0 = action.split(":")[0]

    var { newLookupActions, checkInViewsInDatastore, serverAction, actionFound } = isAction({ _window, lookupActions, stack, props, address, id, __, e, req, res, action, name: action0.slice(0, -2), object })
    
    // lookup in server views for action
    if (checkInViewsInDatastore) return true
    
    // action not found
    if (actionFound === undefined) return "__continue__"
        
    var { address, data } = addresser({ _window, req, res, stack, props, args: action.split(":"), newLookupActions, asynchronous: serverAction, e, id, data: { string: serverAction ? "" : actionFound }, action: action0, __, id, object, mount, lookupActions })

    // server action
    if (serverAction) {

        address.status = "Start"
        return route({ _window, req, res, id, e, data: { lookupActions: newLookupActions, server: "action", action: action0, data }, __, stack, props, lookupActions, address })
    }

    var answer = toAwait({ _window, lookupActions, stack, props, address, id, e, req, res, __, _: data }).data
    
    if (answer === "__continue__") return
    else return answer
}

const toLine = ({ _window, lookupActions, stack, props = {}, address = {}, id, e, data: { string, dblExecute, index: i = 0, splitter = "?" }, req, res, __, mount, object = [], action, startTime = (new Date()).getTime(), success = true, message = "", conditionsNotApplied = false }) => {

    var global = _window ? _window.global : window.global
    var view = _window ? _window.views[id] : window.views[id]

    // missing stack or __
    if (!stack) stack = { addresses: [], returns: [] }
    if (!__) __ = view.__

    var data, returnForWaitActionExists = false

    // splitter is for ? or :
    // i is for using name?params?conditions?elseparams

    var terminator = ({ data, order }) => {

        if (stack.terminated || !address.id) return data

        address.interpreting = false

        // execute waits
        toAwait({ _window, lookupActions, stack, props, address, id, e, req, res, __, _: returnForWaitActionExists ? data.data : undefined })

        return data
    }    

    // action is a variable
    if (typeof string !== "string") return terminator({ data: {success:true, data:string} })

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
        //if (props.isValue && !props.isCondition) object = [{}, ...object]
    }

    // check if event
    if (string.split("?").length > 1 && isEvent({ _window, string })) {

        toEvent({ _window, string, id, __, lookupActions })
        return terminator({ data: { success: true, message: `Event`, executionDuration: 0 } })
    }

    // subparams
    if (i === 1) {

        // list
        var substring = string.split(splitter)[0]
        if (!substring) return terminator({ data: { success: false, message: `Missing name!`, executionDuration: 0 }, order: 3 })

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // name has subparams => interpret
        if (substring.includes("?")) {

            var data = toLine({ lookupActions, stack, props, id, e, data: { string: substring, i: 1 }, req, res, __, mount, object })
            if (data.conditionsNotApplied) return terminator({ data, order: 4 })
        }
    }

    var stringList = string.split(splitter), elseIfList = string.split("??")

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

    var approved = toApproval({ _window, data: conditions || "", id, e, req, res, __, stack, props, lookupActions, object })

    if (!approved && elseParams) {

        string = stringList.slice(2).join("?")
        message = "Else actions executed!"
        conditionsNotApplied = true
        return toLine({ _window, lookupActions, stack, props, address, id, e, data: { string, dblExecute, splitter }, req, res, __, mount, object, action, startTime, message, conditionsNotApplied })

    } else if (!approved) return terminator({ data: { success, message: `Conditions not applied!`, conditionsNotApplied: true, executionDuration: (new Date()).getTime() - startTime } })
    else message = `Action executed successfully!`

    var actionReturnID = generate(), data
    stack.returns.unshift({ id: actionReturnID })

    // no params
    if (!string) message = "No actions to execute!"

    if (!action || props.isCondition) {

        action = "toValue"
        if (props.isValue || dblExecute) action = "toValue"
        else if (props.isParam) {
            action = "toParam"
            props.isParam = false
        } else if (props.isCondition || isCondition({ _window, string })) action = "toApproval"
        else if (isParam({ _window, string })) action = "toParam"

    } else if (action === "conditional") {

        if (isParam({ _window, string })) action = "toParam"
        else action = "toValue"
    }

    if (action === "toValue") data = toValue({ _window, lookupActions, address, stack, props, id, e, data: string, req, res, __, object })
    else if (action === "toApproval") data = toApproval({ _window, lookupActions, address, stack, props, id, e, data: string, req, res, __, object })
    else if (action === "toParam") data = toParam({ _window, lookupActions, address, stack, props, id, e, data: string, req, res, __, object })

    if (dblExecute && executable({ _window, string: data })) data = toLine({ _window, lookupActions, stack, props, id, e, data: { string: data }, req, res, __, object, tt: true }).data

    if (stack.returns && stack.returns[0].returned) {
        returnForWaitActionExists = true
        data = stack.returns[0].data
    }

    // remove return address
    stack.returns.splice(stack.returns.findIndex(ret => ret.id === actionReturnID), 1)

    // set interpreting address id
    if (address.id) stack.interpretingAddressID = address.prevInterpretingAddressID

    return terminator({ data: { success, message, data, action, conditionsNotApplied, executionDuration: (new Date()).getTime() - startTime }, order: 5 })
}

const addresser = ({ _window, addressID = generate(), index = 0, stack, props = {}, args = [], req, res, e, type = "action", status = "Wait", file, data, waits, hasWaits, params, function: func, newLookupActions, nextAddressID, nextStack = {}, nextAddress = {}, blocked, blockable = true, dataInterpretAction, asynchronous = false, interpreting = false, renderer = false, action, __, id, object, mount, lookupActions, logger, switchNextAddressIDWith }) => {

    var global = _window ? _window.global : window.global
    if (switchNextAddressIDWith) {

        nextAddressID = switchNextAddressIDWith.nextAddressID
        hasWaits = switchNextAddressIDWith.hasWaits
        switchNextAddressIDWith.nextAddressID = addressID
        switchNextAddressIDWith.hasWaits = false
        switchNextAddressIDWith.interpreting = false
    }

    // find nextAddress by nextAddressID
    if (nextAddressID && !nextAddress.id) nextAddress = stack.addresses.find(nextAddress => nextAddress.id === nextAddressID) || {}

    // waits
    waits = waits || args[2], params = params || args[1] || ""

    // address waits
    if (waits) toArray(waits).reverse().map(waits => {
        if (waits.charAt(0) === "@" && waits.length == 6) waits = global.__refs__[waits].data
        nextAddress = addresser({ _window, stack, props, req, res, e, type: "waits", action: action + "::[...]", data: { string: waits }, nextAddress, blockable, __, id, object, mount, lookupActions }).address
    })
    // data is encoded ex. action [key=value] => build a map => object=[]
    //var global = _window ? _window.global : window.global
    //var encoded = type !== "waits" && data && data.string && data.string.charAt(0) === "@" && data.string.length == 6 && global.__refs__[data.string].type !== "text" ? true : false

    var address = { id: addressID, stackID: stack.id, props, viewID: id, type, data, status, file, function: func, hasWaits: hasWaits !== undefined ? hasWaits : (waits ? true : false), nextStackID: nextStack.id, nextAddressID: nextAddress.id, blocked, blockable, index: stack.addresses.length, action, asynchronous, interpreting, renderer, logger, executionStartTime: (new Date()).getTime() }
    var stackLength = stack.addresses.length

    // Start => set interpretingAddressID
    if (address.status === "Start" && !asynchronous) {
        //var interpretingAddress = stack.addresses.find(add => add.id === stack.interpretingAddressID)
        //if (interpretingAddress) interpretingAddress.interpreting = false
        stack.interpretingAddressID = address.id
        //address.interpreting = true
    }

    // set nextAddressID
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

        var nextAddressID = !address.nextStackID && address.nextAddressID
        while (nextAddressID) {

            var holdnextAddress = stack.addresses.find(nextAddress => nextAddress.id === nextAddressID)
            if (holdnextAddress) {
                holdnextAddress.hold = true
                nextAddressID = !address.nextStackID && holdnextAddress.nextAddressID
            } else nextAddressID = false
        }
    }

    // data
    var { data, executionDuration, action: interpretAction } = toLine({ _window, lookupActions, stack, props: { isValue: true }, req, res, id, e, __, data: { string: params }, action: dataInterpretAction, object })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, object, props, lookupActions: newLookupActions || lookupActions }

    // push to stack
    if (index) stack.addresses.splice(index, 0, address)
    else stack.addresses.unshift(address)

    // log
    if (address.status !== "Wait") printAddress({ stack, address, nextAddress, newAddress: true })

    // actions executed
    address.action && address.status === "Start" && stack.executedActions.push(address.action)

    return { nextAddress, address, data, stack, props, action: interpretAction, __: [...(data !== undefined ? [data] : []), ...__] }
}

const toAwait = ({ _window, req, res, address = {}, addressID, lookupActions, stack, props = {}, id, e, _, __, action }) => {

    var global = _window ? _window.global : window.global

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
        if (index !== -1) {
            stack.addresses[index] = null
            stack.addresses.splice(index, 1)
        }

        // pass underscores to waits
        if (address.hasWaits && nextAddress.params && !nextAddress.ended) {
            nextAddress.params.__ = my__
            nextAddress.params.id = address.params.id
        }

        // logger
        if (address.logger && address.logger.end) logger({ _window, data: { key: address.logger.key, end: true } })

    } else if (address.status === "Wait") {

        address.status = "Start"
        address.interpreting = true
        // nextAddress.interpreting = false
        printAddress({ stack, address, nextAddress })

        // actions executed
        address.action && stack.executedActions.push(address.action)
        address.prevInterpretingAddressID = stack.interpretingAddressID
        stack.interpretingAddressID = address.id

        // logger
        if (address.logger && address.logger.start) logger({ _window, data: { key: address.logger.key, start: true } })


        if (address.function) {

            var func = address.function || "toLine"
            var params = { _window, lookupActions, stack, props, id, e, req, res, address, nextAddress, ...(address.params || {}), data: address.data, __: my__, action }

            if (func === "toView") toView(params)
            else if (func === "toHTML") toHTML(params)
            else if (func === "update") update(params)
            else if (func === "documenter") require("./documenter")(params)
            else if (func === "blockRelatedAddressesByViewID") blockRelatedAddressesByViewID(address.data)

            address.interpreting = false

            return !address.asynchronous && toAwait({ _window, lookupActions, stack, props, address, id, e, req, res, __: my__, action })

        } else if (address.type === "line" || address.type === "waits" || address.type === "action") {

            return toLine({ _window, lookupActions, address, stack, props: { isValue: false }, id, e, req, res, ...(address.params || {}), data: address.data, __: my__ })
        }
    }

    if (stack.terminated) return

    // asynchronous unholds nextAddresses
    if (address.nextAddressID && !address.nextStackID && nextAddress.interpreting === false) {

        var otherWaiting = stack.addresses.findIndex(waitingAddress => waitingAddress.nextAddressID === address.nextAddressID)

        if (otherWaiting === -1 || (otherWaiting > -1 && !stack.addresses.find(waitingAddress => waitingAddress.nextAddressID === address.nextAddressID && !address.blocked))) {

            nextAddress.hold = false
            return toAwait({ _window, lookupActions, stack, props, address: nextAddress, id, req, res, __, action, e })
        }

    } else if (nextAddress.interpreting) stack.interpretingAddressID = nextAddress.id

    // address is for another stack
    if (address.nextStackID && global.__stacks__[address.nextStackID] && global.__stacks__[address.nextStackID].addresses.find(({ id }) => address.nextStackID === id)) {

        toAwait({ _window, lookupActions, stack: global.__stacks__[address.nextStackID], props, address, id, e, req, res, __, action })
    }

    endStack({ _window, stack, props })
}

const insert = async ({ lookupActions, stack, props = {}, object, __, address, id, insert }) => {

    var { index, view, path, data, doc, viewPath = [], parent, mount, preventDefault } = insert
    //console.log(clone(insert));
    var views = window.views
    var global = window.global
    var parent = views[parent]
    var passData = {}, myID
    var __childIndex__

    if (insert.__view__) {

        view = insert

    } else if (!view) {

        var childrenRef = parent.__childrenRef__.find(({ id: viewID }) => viewID === id || getDeepChildrenId({ id: viewID }).includes(id))

        if (childrenRef) view = insert = views[childrenRef.id]
        else view = insert = views[parent.__childrenRef__[0].id]
    }

    // clone
    if (typeof view === "object" && view.__view__) {

        // id
        myID = view.id

        // childIndex
        __childIndex__ = view.__childIndex__

        // index
        index = index !== undefined ? index : (view.__index__ + 1)

        // path
        path = [...(path || view.__dataPath__)]
        doc = doc || view.doc

        // get data
        passData.data = (insert.__view__) ? (typeof insert.__[insert.__underscoreLoopIndex__ || 0] === "object" ? {} : "") // insert():[...]
            : (insert.view && !("data" in insert)) ? (typeof insert.view.__[insert.__underscoreLoopIndex__ || 0] === "object" ? {} : "") // insert():[view=...]
                : (insert.view && ("data" in insert) ? data : undefined); // insert():[view=...;data=...]

        if (!preventDefault) {

            // increment data index
            if (isNumber(path[path.length - 1])) path[path.length - 1] += 1

            // increment next views dataPath index
            var itemIndex = view.__dataPath__.length - 1
            if (index < parent.__childrenRef__.length)
                parent.__childrenRef__.slice(index).map(viewRef => updateDataPath({ id: viewRef.id, myIndex: view.__dataPath__[itemIndex], index: itemIndex, increment: true }))

            // mount data
            passData.data !== undefined && path.reduce((o, k, i) => {

                if (itemIndex === 0) o.splice(path[itemIndex], 0, passData.data)
                else if (i === itemIndex - 1) o[k].splice(path[itemIndex], 0, passData.data)
                else if (i >= itemIndex) return
                else return o[k]

            }, global[doc])

        }

        // inserted view params
        passData = {
            __: ((view.__loop__ && view.__mount__) || preventDefault) ? [passData.data, ...view.__.slice((view.__underscoreLoopIndex__ || 0) + 1)] : view.__,
            __viewPath__: [...view.__viewPath__, ...viewPath],
            __customViewPath__: [...view.__customViewPath__],
            __lookupActions__: [...view.__lookupActions__],
            passData: {
                __loop__: view.__loop__,
                __mount__: view.__mount__,
            }
        }

        // get raw view
        view = clone(([...view.__viewPath__, ...viewPath]).reduce((o, k) => o[k], global.__queries__.view))

    } else { // new View

        var genView = generate()
        if (typeof view !== "string") global.__queries__.view[genView] = clone(view)
        else {
            genView = view
            view = clone((viewPath).reduce((o, k) => o[k], global.__queries__.view[view]))
        }

        passData = {
            __viewPath__: [genView, ...viewPath],
            __customViewPath__: [...parent.__customViewPath__, genView],
            __lookupActions__: [{ doc: genView, collection: "view" }, ...parent.__lookupActions__]
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

    update({ lookupActions, stack, props, object, address, id, __, data: { view: { ...clone(view), __inserted__: true }, id: myID || id, path, mount, data, doc, __childIndex__, __index__: index, insert: true, __parent__: parent.id, action: "INSERT", ...passData } })
}

const toView = ({ _window, lookupActions, stack, props = {}, address, req, res, __, id, data = {} }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = data.view || views[id]

    // interpret view
    if (!view.__interpreted__) {

        // init view
        var details = initView({ views, global, id, parent: data.parent, ...(data.view || {}), __ })
        view = details.view
        id = details.id

        // no view
        if (!view.view) return removeView({ _window, global, views, lookupActions, stack, props, id, address, __ })

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
            if (view.__name__ === "manifest:().page") view.__page__ = true
            if (view.__name__ === "manifest:().action") global.__actionLaunched__ = true
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

        // exec view name
        view.__name__ = toValue({ _window, id, req, res, data: view.__name__, __, stack, props: { isValue: true }, object: [view] })

        // no view
        if (!view.__name__ || typeof view.__name__ !== "string" || view.__name__.charAt(0) === "#") return removeView({ _window, global, views, id, stack, props, address })
        else views[id] = view

        // executable view name
        if (executable({ _window, string: view.__name__ })) {

            var action = view.__name__
            view.__name__ = "Action"
            toValue({ _window, id, req, res, data: action, lookupActions, __, stack, object: [view] })
        }

        // interpret subparams
        if (subParams) {
            view.__executingSubparams__ = true
            var { data = {}, conditionsNotApplied } = toLine({ _window, lookupActions, stack, props: { isValue: true }, id, data: { string: subParams }, req, res, object: [view], __ })
            //console.log(data, decode({ _window, string: subParams }), clone(view));
            if (conditionsNotApplied) return removeView({ _window, global, views, id, stack, props, address })
            else subParams = data
            view.__executingSubparams__ = false
        }

        // [View]
        if (loop) return loopOverView({ _window, id, stack, props, lookupActions, __, address, data: subParams || {}, req, res })

        // subparam is params or id
        if (typeof subParams === "object") {

            my__ = [subParams, ...__]
            override(view, subParams)

        } else if (subParams && typeof subParams === "string" && subParams !== id) {

            var newID = subParams
            if (views[newID] && view.id !== newID) newID += "_" + generate()

            delete Object.assign(views, { [newID]: views[id] })[id]

            // remove from initial index list
            if (views[view.parent]) {
                var initialIDIndex = views[view.parent].__childrenInitialIDRef__.indexOf(id)
                if (initialIDIndex > -1) views[view.parent].__childrenInitialIDRef__.splice(initialIDIndex, 1)
                views[view.parent].__childrenInitialIDRef__.push(newID)
            }

            id = newID
            views[id].id = id
            view = views[id]
            view.__customID__ = true
        }

        // conditions
        var approved = toApproval({ _window, lookupActions, stack, props, data: conditions, id, req, res, __, object: [view] })
        if (!approved) return removeView({ _window, global, views, id, stack, props, address })

        // params
        if (params) {

            toParam({ _window, lookupActions, stack, props, data: params, id, req, res, object: [view], __ })

            // id changed
            if (view.id !== id) id = view.id
        }

        // data
        view.data = kernel({ _window, id, stack, props, lookupActions, data: { path: view.__dataPath__, data: global[view.doc], value: view.data, key: true }, __ })

        // prepare for toHTML
        componentModifier({ _window, id })

        // built-in view
        if (view.__name__ === "Input" && !view.__templated__) var { id, view } = builtInViewHandler({ _window, lookupActions, stack, props, id, req, res, __ })

        // set interpreted
        view.__interpreted__ = true

        // maybe update in params or root
        if (address.blocked) return// toAwait({ _window, lookupActions, stack, props, address, id, req, res, __ })

        // asynchronous actions within view params
        if (address.hold) return addresser({ _window, id, stack, props, switchNextAddressIDWith: address, type: "function", function: "toView", __, lookupActions, stack, props, data: { view } })
    }

    // not builtin view => custom View
    if (!myViews.includes(view.__name__)) {

        // queried before and not found
        if (global.__queries__.view[view.__name__] === false) return

        // query custom view
        if (!global.__queries__.view[view.__name__]) {

            address.interpreting = false
            address.status = "Wait"
            address.data = { view }
            return searchDoc({ _window, lookupActions, stack, props, address, id, __, req, res, object: [view], data: { data: { collection: "view", doc: view.__name__ } } })
        }

        // continue to custom view
        else {

            var newView = {
                ...global.__queries__.view[view.__name__],
                __interpreted__: false,
                __customView__: view.__name__,
                __viewPath__: [view.__name__],
                __customViewPath__: [...view.__customViewPath__, view.__name__],
                __lookupActions__: [{ doc: view.__name__, collection: "view" }, ...view.__lookupActions__]
            }

            // id
            if (newView.id && views[newView.id] && newView.id !== id) newView.id += "_" + generate()
            else if (newView.id) newView.__customID__ = true
            else if (!newView.id) newView.id = id

            var child = { ...view, ...newView }
            views[child.id] = child

            // inorder to stop recursion 
            if (!newView.view) child.view = ""

            var data = getViewParams({ view })

            // document
            if (view.__name__ === "document") {

                stack.documenter = true
                stack.renderer = true

                // log start document
                logger({ _window, data: { key: "documenter", start: true } })

                // address: document
                address = addresser({ _window, id: child.id, nextAddress: address, type: "function", function: "documenter", stack, props, __, logger: { key: "documenter", end: true } }).address

                // get shared public views
                Object.entries(require("./publicViews.json")).map(([doc, data]) => {

                    global.__queries__.view[doc] = { ...data, id: doc }
                    global.__queries__.view[doc] = data
                })

                address = addresser({ _window, stack, props, status: "Start", type: "function", function: "toView", nextAddress: address, lookupActions, __ }).address

            }

            // address
            return toView({ _window, stack, props, address, req, res, lookupActions: child.__lookupActions__, __: [...(Object.keys(data).length > 0 ? [data] : []), ...__], data: { view: child, parent: view.__parent__ } })
        }
    }

    var toViewAddress = address
    toViewAddress.interpreting = false

    // render children
    if (view.children.length > 0) {

        // html address
        address = addresser({ _window, id, stack, props, type: "function", function: "toHTML", file: "toView", __, lookupActions, nextAddress: address }).address

        var lastIndex = view.children.length - 1;

        // address children
        [...view.children].reverse().map((child, index) => {

            if (!child) return
            var childID = child.id || generate()
            views[childID] = { ...child, id: childID, __view__: true, __parent__: id, __viewPath__: [...view.__viewPath__, "children", lastIndex - index], __childIndex__: lastIndex - index }

            // address
            address = addresser({ _window, index, id: childID, stack, props, type: "function", function: "toView", __: [...__], lookupActions, nextAddress: address, data: { view: views[childID] } }).address
        })

    } else toHTML({ _window, id, stack, props, __ })

    if (view.__page__) global.__pageViewID__ = view.id

    // address
    if (!toViewAddress.hold) toAwait({ _window, lookupActions, stack, props, address, id, req, res, __ })
}

const update = ({ _window, id, lookupActions, stack, props, address, req, res, __, data = {} }) => {

    // address.blockable = false
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    var view = views[data.id]

    if (!data.postUpdate) {

        var parent = views[data.__parent__ || view.__parent__]
        var __index__ = data.__index__ !== undefined ? data.__index__ : (view.__loop__ ? view.__index__ : undefined)
        var __childIndex__ = data.__childIndex__ !== undefined ? data.__childIndex__ : view.__childIndex__//(view.__loop__ ? view.__index__ : view.__childIndex__)
        var __viewPath__ = [...(data.__viewPath__ || view.__viewPath__)]
        var __customViewPath__ = [...(data.__customViewPath__ || view.__customViewPath__)]
        var __lookupActions__ = [...(data.__lookupActions__ || view.__lookupActions__)]
        var my__ = data.__ || view.__

        var elements = []
        var timer = (new Date()).getTime()

        if (!view) return

        // close publics
        closePublicViews({ _window, id: data.id, __, stack, props, lookupActions })

        // get view to be rendered
        var reducedView = {
            ...(data.view ? data.view : clone(__viewPath__.reduce((o, k) => o[k], global.__queries__.view))),
            __index__,
            __childIndex__,
            __view__: true,
            __loop__: view.__loop__,
            __viewPath__,
            __customViewPath__,
            __lookupActions__,
            __page__: data.id === global.__pageViewID__,
            ...(data.passData || {}),
        }

        // data
        if ("data" in data) {

            if ("mount" in data) {

                reducedView.data = data.data
                reducedView.doc = data.doc || view.doc || parent.doc || generate()
                global[reducedView.doc] = global[reducedView.doc] || reducedView.data
            }

            if (!("__" in data)) my__ = [data.data, ...my__]

        } else if ("doc" in data) {


            reducedView.doc = data.doc
            global[reducedView.doc] = global[reducedView.doc] || reducedView.data || {}
            if (!("__" in data)) my__ = [global[reducedView.doc], ...my__]
        }

        // path
        if ("path" in data) reducedView.__dataPath__ = (Array.isArray(data.path) ? data.path : typeof data.path === "number" ? [data.path] : data.path.split(".")) || []

        // remove views
        if (!data.insert && parent.__rendered__) parent.__childrenRef__.filter(({ index, childIndex }) => (data.__childIndex__ === undefined && view.__loop__) ? (index === view.__index__) : (childIndex === __childIndex__))
            .map(({ id }) => elements.push(removeView({ _window, global, views, id, stack, props, main: true, insert: data.insert })))
        else if (!parent.__rendered__) removeView({ _window, global, views, id: data.id, stack, props, main: true })

        // remove loop
        if (reducedView.view.charAt(0) === "[") {
            reducedView.view = toCode({ id, string: toCode({ id, string: reducedView.view, start: "'" }) })
            reducedView.view = global.__refs__[reducedView.view.slice(0, 6)].data + "?" + decode({ string: reducedView.view.split("?").slice(1).join("?") })
        }

        // address for delete blocked addresses (switch with second next address => execute after end of update waits)
        addresser({ _window, id, stack, props, switchNextAddressIDWith: address.hasWaits ? stack.addresses.find(add => add.id === address.nextAddressID) : address, type: "function", function: "blockRelatedAddressesByViewID", __, lookupActions, data: { stack, id: data.id } })

        // address for post update
        addresser({ _window, id, stack, props, switchNextAddressIDWith: address, type: "function", function: "update", __, lookupActions, data: { ...data, childIndex: __childIndex__, index: __index__, elements, timer, parent, postUpdate: true } })

        // address for rendering view
        address = addresser({ _window, id, stack, props, nextAddress: address, status: "Start", type: "function", function: "toView", interpreting: true, __: my__, lookupActions: __lookupActions__, data: { view: reducedView, parent: parent.id } }).address

        // render
        toView({ _window, lookupActions: __lookupActions__, stack, props, req, res, address, __: my__, data: { view: reducedView, parent: parent.id } })

        // seq: END:toView => END:update() => START:postUpdate => END:postUpdate => START:waits => END:waits => START:spliceBlockedAddresses

        // address
        toAwait({ _window, lookupActions, stack, props, address, id, req, res, __ })

    } else { // post update

        var { childIndex, elements, root, timer, parent, loop, inserted, ...data } = data

        // tohtml parent
        toHTML({ _window, lookupActions, stack, props, __, id: parent.id })

        var renderedRefView = parent.__childrenRef__.filter(({ id, childIndex: chdIndex }) => (inserted ? chdIndex === childIndex : true) && !views[id].__rendered__ && views[id])

        var updatedViews = [], idLists = [], innerHTML = ""

        // get html
        renderedRefView.map(({ id }) => {

            var { __idList__, __html__ } = views[id]

            // push to html
            innerHTML += __html__

            // _.data
            updatedViews.push(views[id])

            // start
            idLists.push(...[id, ...__idList__])
        })

        // remove prev elements
        elements.map(element => element.nodeType ? element.remove() : (delete views[element.id]))

        // browser actions
        if (!_window && innerHTML && parent.__rendered__) {

            var lDiv = document.createElement("div")
            document.body.appendChild(lDiv)
            lDiv.style.position = "absolute"
            lDiv.style.opacity = "0"
            lDiv.style.left = -1000
            lDiv.style.top = -1000
            lDiv.innerHTML = innerHTML
            lDiv.children[0].style.opacity = "0"

            renderedRefView.map(({ index }) => {

                if (index >= parent.__element__.children.length || parent.__element__.children.length === 0) parent.__element__.appendChild(lDiv.children[0])
                else parent.__element__.insertBefore(lDiv.children[0], parent.__element__.children[index])
            })

            // start
            var relatedEvents = idLists.map(id => starter({ _window, lookupActions, address, stack, props, __, id }))

            // loaded events
            idLists.map(id => views[id] && views[id].__loadedEvents__.map(data => eventExecuter(data)))

            // related events: assign to others
            relatedEvents.map(relatedEvents => {
                Object.entries(relatedEvents).map(([eventID, address]) => {
                    Object.values(address).map(address => views[eventID] && views[eventID].__rendered__ && views[eventID].__element__.addEventListener(address.event, address.eventListener))
                })
            })

            // display view
            updatedViews.map(({ id }) => views[id].__element__.style.opacity = "1")

            // state, title, & path
            if (updatedViews[0].id === "root" && views[global.manifest.page]) {

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

        } else if (!innerHTML) console.log("View has conditions which are not applied!");

        console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + (data.action || "UPDATE") + ":" + (data.action === "ROOT" ? global.manifest.page : (updatedViews[0] || {}).id), (new Date()).getTime() - timer)

        var data = { view: updatedViews.length === 1 ? updatedViews[0] : updatedViews, message: "View updated successfully!", success: true }

        // toParam({ _window, data: "loader.hide" })

        if (address) {
            address.params.__ = [data, ...address.params.__]
            address.params.id = views[address.params.id] ? address.params.id : updatedViews[0].id
        }
    }
}

const addEventListener = ({ event, id, string, __, stack, props, lookupActions, address, eventID: mainEventID, executable }) => {

    var views = window.views
    var global = window.global
    var view = views[id]

    if (executable) return eventExecuter({ string, event, eventID: mainEventID, id, address, stack, props, lookupActions, __ })

    if (!view || !event) return

    // inherit from view
    if (!__) __ = view.__
    if (!lookupActions) lookupActions = view.__lookupActions__

    var mainString = toCode({ id, string: toCode({ id, string: event, start: "'" }) })

    mainString.split("?")[0].split(";").map(substring => {

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // event:id
        var { data: eventID } = toLine({ id, data: { string: substring.split("?")[0].split(":")[1] }, props: { isValue: true } })
        eventID = eventID || mainEventID || id

        toArray(eventID).map(eventID => {

            if (typeof eventID === "object" && eventID.__view__) eventID = eventID.id

            // modify
            var { event, string } = modifyEvent({ eventID, event: substring, string: mainString, id, __, stack, props, lookupActions, address })

            // watch
            if (event === "watch") return watch({ lookupActions, __, stack, props, address, string, id })

            // loaded event
            if (event === "loaded") return views[eventID].__loadedEvents__.push({ string, event, eventID, id, address, stack, props, lookupActions, __ })

            // event id
            var genID = generate()
            var eventAddress = { genID, event, id, eventListener: (e) => eventExecuter({ string, event, eventID, id, stack, props, lookupActions, __, address, e }) }

            //
            if (id !== eventID) {

                global.__events__[eventID] = global.__events__[eventID] || {}
                global.__events__[eventID][genID] = eventAddress

                // relate event
                views[id].__relEvents__[eventID] = views[id].__relEvents__[eventID] || {}
                views[id].__relEvents__[eventID][genID] = eventAddress

            } else {

                views[id].__events__.unshift(eventAddress)
                views[id].__element__.addEventListener(event, eventAddress.eventListener)
            }
        })
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////// 
/////////////////////////////////////////////////////////////////////////////////////////

const isAction = ({ _window, lookupActions, stack, props, address, id, __, e, req, res, action, name, object }) => {
    
    if (builtInActions.includes(name + "()")) return {}

    var global = _window ? _window.global : window.global
    var serverAction = false, actionFound = false, newLookupActions, checkInViewsInDatastore = false

    // lookup through parent map actions
    toArray(lookupActions).map((lookupAction, indexx) => {

        if (checkInViewsInDatastore || actionFound || !lookupAction.collection) return

        var collection = global.__queries__[lookupAction.collection] || {}
        var doc = collection[lookupAction.doc]

        // queried before and not found
        if (collection && doc === false) return
        
        // not queried yet => query
        if (!collection || !doc || (doc.__props__.secured && !stack.server && !(name in (lookupAction.path || []).reduce((o, k, i) => o[k] ? o[k] : {}, doc.__props__.actions)))) {
            
            checkInViewsInDatastore = true
            var mydata = { data: { ...lookupAction, path: [...(lookupAction.path || []), name] }, action, lookupServerActions: true }
            return searchDoc({ _window, lookupActions, stack, props, address, id, __, e, req, res, data: mydata, object })
        }

        var actions = doc.__props__.actions
        
        // lookup through path
        if (lookupAction.path && lookupAction.path.length > 0) {

            var path = lookupAction.path
            clone(path).reverse().map((x, i) => {

                if (actionFound) return

                actionFound = clone((path.slice(0, path.length - i).reduce((o, k) => o[k], actions) || {})[name])
                
                // found map action
                if (typeof actionFound === "object" && actionFound._) {

                    actionFound = actionFound._ || ""
                    newLookupActions = [{ ...lookupAction, path: [...path.slice(0, path.length - i), name] }, ...lookupActions.slice(indexx)]

                // found action
                } else if (actionFound && lookupActions.length > 1) newLookupActions = lookupActions.slice(indexx)
            })

        // calling server action from browser
        } else if (doc.__props__.secured && !stack.server && actions[name] === true) {
            
            actionFound = true
            serverAction = true
            newLookupActions = [{ doc: lookupAction.doc, collection: lookupAction.collection }]
        
        // action in the view main actions
        } else if (actions[name]) {
            
            actionFound = clone(actions[name])

            if (typeof actionFound === "object" && actionFound._) {

                actionFound = actionFound._ || ""
                newLookupActions = [{ ...lookupAction, path: [name] }, ...lookupActions]
            }
        }
    })

    return { newLookupActions, checkInViewsInDatastore, serverAction, actionFound }
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

const getDeepParentId = ({ _window, lookupActions, stack, props, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]

    if (!view) return []
    if (!view.__element__.parentNode || view.__element__.parentNode.nodeName === "BODY") return []

    var parentId = view.__element__.parentNode.id
    var all = [parentId]

    all.push(...getDeepParentId({ _window, lookupActions, stack, props, id: parentId }))

    return all
}

const exportHTMLToPDF = async ({ _window, pages, opt, lookupActions, stack, props, address, req, res, id, e, __ }) => {

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
    if (args[2]) require("./kernel").toAwait({ _window, lookupActions, stack, props, address, req, res, id, e, __ })
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
    return typeof value === "number" ? true : (typeof value === "string" && !isNaN(value) && !emptySpaces(value))
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

const calcSubs = ({ _window, lookupActions, stack, props, value, __, id, e, req, res, object, index = 1 }) => {

    var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
    if (value.split("-").length > index) {

        var _value = value.split("-").slice(0, index).join("-")
        var _values = value.split("-").slice(index)
        _values.unshift(_value)

        var values = _values.map(value => {

            if (!allAreNumbers) return
            if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

            if (allAreNumbers) {

                var num = toValue({ _window, lookupActions, stack, props: { isValue: true }, data: value, __, id, e, req, res, object })
                if (!isNaN(num) && num !== " " && num !== "") return num
                else allAreNumbers = false
            }
        })

        if (allAreNumbers) {

            value = parseFloat(values[0])
            values.slice(1).map(val => value -= parseFloat(val))
            global.__calcTests__[test] = true

        } else value = calcSubs({ _window, lookupActions, stack, props, value, __, id, e, req, res, object: value.charAt(0) === "." ? object : [], index: index + 1 })

    } else return value

    if (value === test) global.__calcTests__[test] = false
    return value
}

const calcDivision = ({ _window, lookupActions, stack, props, value, __, id, e, req, res, object, index = 1 }) => {

    var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
    if (value.split("/").length > index) {

        var _value = value.split("/").slice(0, index).join("/")
        var _values = value.split("/").slice(index)
        _values.unshift(_value)

        var values = _values.map(value => {

            if (!allAreNumbers) return
            if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

            if (allAreNumbers) {

                var num = toValue({ _window, lookupActions, stack, props: { isValue: true }, data: value, __, id, e, req, res, object })
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

        } else calcDivision({ _window, lookupActions, stack, props, value, __, id, e, req, res, object, index: index + 1 })
    }

    if (value === test) global.__calcTests__[test] = false
    return value
}

const calcModulo = ({ _window, lookupActions, stack, props, value, __, id, e, req, res, object, index = 1 }) => {

    var allAreNumbers = true, test = value, global = _window ? _window.global : window.global
    if (value.split("%").length > index) {

        var _value = value.split("%").slice(0, index).join("%")
        var _values = value.split("%").slice(index)
        _values.unshift(_value)

        var values = _values.map(value => {

            if (!executable({ _window, string: value }) && !isNumber(value)) return allAreNumbers = false

            if (allAreNumbers) {

                var num = toValue({ _window, lookupActions, stack, props: { isValue: true }, data: value, __, id, e, req, res, object })

                if (!isNaN(num) && num !== " " && num !== "") return num
                else allAreNumbers = false
            }
        })

        if (allAreNumbers) {

            value = parseFloat(values[0])
            values.slice(1).map(val => value %= val)

            global.__calcTests__[test] = true

        } else value = calcModulo({ _window, lookupActions, stack, props, value, __, id, e, req, res, object, index: index + 1 })
    }

    if (value === test) global.__calcTests__[test] = false
    return value
}

const endAddress = ({ _window, stack, props, data, req, res, id, e, __, lookupActions, endID }) => {

    var global = _window ? _window.global : window.global

    var starter = false, nextAddressID = stack.interpretingAddressID, currentStackID = stack.id
    var address = stack.addresses.find(address => address.id === nextAddressID)

    var endStarterAddress = ({ address, stack, props }) => {

        address.starter = false

        // get start nextAddress to push data to its underscores
        var starternextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID)
        if (starternextAddress) {

            // push response to underscore
            starternextAddress.params.__ = [data, ...starternextAddress.params.__]
            starternextAddress.hasWaits = false
            starternextAddress.ended = true

            // start again from the current interpreting address and set blocked until reaching nextAddress
            var stack = global.__stacks__[currentStackID], blockedAddress = true
            nextAddressID = stack.interpretingAddressID

            while (blockedAddress && nextAddressID && nextAddressID !== starternextAddress.id) {

                blockedAddress = stack.addresses.find(address => address.id === nextAddressID)
                if (blockedAddress) {
                    blockedAddress.blocked = true
                    nextAddressID = blockedAddress.nextAddressID

                    stack.blocked = true

                    // address coming from different stack
                    if (blockedAddress.nextStackID) stack = global.__stacks__[blockedAddress.nextStackID]
                }
            }

            address.hold = false

            stack = global.__stacks__[currentStackID]

            toAwait({ req, res, _window, lookupActions, stack, props, addressID: stack.interpretingAddressID, id, e, __ })

            if (endID) {

                var stack = global.__stacks__[global.__startAddresses__[endID].address.stackID]
                var address = global.__startAddresses__[endID].address

                delete global.__startAddresses__[endID]
                toAwait({ req, res, _window, lookupActions, stack, props, address, id, e, __ })
            }
        }
    }

    if (endID) {

        if (!global.__startAddresses__[endID]) return
        var stack = global.__stacks__[global.__startAddresses__[endID].address.stackID]
        var address = global.__startAddresses__[endID].address

        endStarterAddress({ address, stack, props })

    } else {

        while (!starter && nextAddressID && stack) {

            // start from self address (by interpretingAddressID) to reach the start head address
            var address = stack.addresses.find(address => address.id === nextAddressID)

            if (!address) return nextAddressID = false

            if (address.starter) {

                starter = true
                endStarterAddress({ address, stack, props })
            }

            // move to head address
            nextAddressID = address.nextAddressID

            // reached index 0 address => check stack if it has nextAddress
            if (address.nextStackID) stack = global.__stacks__[address.nextStackID]
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
    if (id !== "droplist") toParam({ id: "droplist", data: toCode({ string: "__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()" }), __, lookupActions })

    // close tooltip
    toParam({ id: "tooltip", data: toCode({ string: "clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0" }), __, lookupActions })

    // close mininote
    toParam({ id: "mininote", data: toCode({ string: "():mininote.style():[opacity=0;transform=scale(0)]" }), __, lookupActions })
}

const remove = ({ _window, stack, props, data = {}, id, __, lookupActions }) => {

    var global = window.global
    var views = window.views
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
    closePublicViews({ _window, id, __, stack, props, lookupActions })

    // no data
    if (__dataPath__.length === 0) {

        removeView({ id, global, views, stack, props, main: true }).remove()

    } else {

        // reset length and __dataPath__
        var itemIndex = view.__dataPath__.length - 1
        var parent = views[view.__parent__]

        // update data path
        if (!data.preventDefault) parent.__childrenRef__.slice(view.__index__ + 1).map(({ id }) => updateDataPath({ id, myIndex: view.__dataPath__[itemIndex], index: itemIndex, decrement: true }))
        removeView({ id, global, views, stack, props, main: true }).remove()
    }

    console.log("REMOVE:" + id)
}

const updateDataPath = ({ id, myIndex, index, decrement, increment }) => {

    var views = window.views
    var view = views[id]

    if (!view) return
    if (!isNumber(view.__dataPath__[index])) return
    if (decrement && view.__dataPath__[index] <= myIndex) return
    else if (increment && view.__dataPath__[index] >= myIndex) return

    if (decrement) view.__dataPath__[index] -= 1
    else if (increment) view.__dataPath__[index] += 1

    view.__childrenRef__.map(({ id }) => updateDataPath({ id, myIndex, index, decrement, increment }))
}

const sort = ({ _window, sort = {}, id, e, lookupActions, __, stack, props, object }) => {

    var view = _window ? _window.views[id] : window.views[id]

    // data
    var doc = sort.doc || view.doc
    var data = sort.data || global[doc]
    var sortBy = "descending"

    if (sort.ascending) sortBy = "ascending"
    else if (sort.descending) sortBy = "descending"

    // path
    var path = sort.path
    if (typeof sort.path === "string") path = toArray(toCode({ _window, string: path }).split("."))
    if (!path) path = []

    if (!Array.isArray(data) && typeof data === "object") data = Object.values(data)

    data.sort((a, b) => {

        a = reducer({ _window, id, data: { path }, object: [a, ...toArray(object)], e, lookupActions, __, stack, props })
        b = reducer({ _window, id, data: { path }, object: [b, ...toArray(object)], e, lookupActions, __, stack, props })

        if (sortBy === "descending") {

            if (typeof a === "string" && typeof b === "string") return b.localeCompare(a, undefined, { numeric: true })
            else return b - a

        } else {

            if (typeof a === "string" && typeof b === "string") return a.localeCompare(b, undefined, { numeric: true })
            else return a - b
        }
    })

    // sort by
    if (doc) global[doc] = data

    return data
}

const sortAndArrange = ({ _window, data, sort: _sort, arrange, id }) => {

    var index = 0

    if (_sort) data = sort({ _window, id, sort: { data, ascending: true } })

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
    if (!view) return console.log("No view in componentModifier");
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
        if ("type" in view) view.input.type = view.type
        if ("value" in view) view.input.value = view.input.text = view.text = view.input.value || view.input.text || view.value
        if (view.checked !== undefined) view.input.checked = view.checked
        if (view.max !== undefined) view.input.max = view.max
        if (view.min !== undefined) view.input.min = view.min
        if (view.name !== undefined) view.input.name = view.name
        if (view.accept !== undefined) view.input.accept = view.input.accept
        if (view.multiple !== undefined) view.input.multiple = true
        if (view.input.placeholder) view.placeholder = view.input.placeholder
        if ("text" in view) view.input.value = view.text

    }

    else if (view.__name__ === "Image") {

        view.src = view.src || (typeof view.data === "string" && view.data) || ""

    }

    else if (view.__name__ === "Text") {

        view.text = view.text !== undefined ? view.text : ((typeof view.data === "string" && view.data) || "")
    }
}

const loopOverView = ({ _window, id, stack, props, lookupActions, __, address, data = {}, req, res }) => {

    var global = _window ? _window.global : window.global
    var views = _window ? _window.views : window.views
    var view = views[id]

    // mount
    if (data.doc || data.path) data.mount = true

    // path
    var path = toArray(data.path) || []
    path = Array.isArray(data.path) ? data.path : data.path !== undefined ? (data.path || "").split(".") : []

    if (data.mount) {

        data.__dataPath__ = [...((data.doc || data.data) ? [] : view.__dataPath__), ...path]
        data.doc = data.doc || ((("path" in data) || ("keys" in data)) && view.doc) || generate()
        global[data.doc] = global[data.doc] || data.data || {}

        data.data = kernel({ _window, lookupActions, stack, props: {}, id, data: { path: data.__dataPath__, data: global[data.doc] }, req, res, __ })
    }

    var { doc, data = {}, __dataPath__ = [], mount, path, keys, preventDefault, ...myparams } = data

    var loopData = []
    var isObj = !Array.isArray(data) && typeof data === "object"
    if (isObj && keys) loopData = Object.keys(data)
    else if (Array.isArray(data)) {
        if (data.length === 1) loopData = ["0"]
        else loopData = Object.keys(data)
    } else if (isObj) loopData = ["0"]

    var values = keys ? data : toArray(data), address = {}
    if (keys && !Array.isArray(data)) loopData = sortAndArrange({ _window, id, data: loopData, sort: myparams.sort, arrange: myparams.arrange })

    var lastIndex = loopData.length - 1;

    // view
    [...loopData].reverse().map((key, index) => {

        view.__looped__ = true
        index = lastIndex - index

        var params = { i: index, __loopIndex__: index, view: view.__name__ + "?" + view.view.split("?").slice(1).join("?"), id: `${view.id}_${index}` }
        key = isNumber(key) ? parseInt(key) : key
        if (mount) params = { ...params, doc, __dataPath__: [...__dataPath__, key] }

        views[params.id] = { __view__: true, __loop__: true, __mount__: mount, ...clone(view), ...myparams, ...params }

        address = addresser({ _window, id: params.id, stack, props, nextAddress: address, type: "function", function: "toView", renderer: true, blockable: false, __: [values[key], ...__], lookupActions, data: { view: views[params.id] } }).address
    })

    toAwait({ _window, lookupActions, stack, props, address, id, req, res, __ })
    removeView({ _window, global, views, id, stack, props, address })
}

const builtInViewHandler = ({ _window, lookupActions, stack, props, id, req, res, __ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]

    views[id] = builtInViews.Input(view)
    var { id, view } = initView({ views, global, parent: views[id].__parent__, ...views[id] })

    toLine({ _window, lookupActions, stack, props, data: { string: view.view, id, index: 1 }, req, res, object: [view], __ })
    view.__name__ = view.view.split("?")[0]

    if (view.id !== id) {

        delete Object.assign(views, { [view.id]: views[id] })[id]
        id = view.id
    }

    componentModifier({ _window, id })

    return { id, view }
}

const toHTML = ({ _window, id, stack, props, __ }) => {

    var views = _window ? _window.views : window.views

    var view = views[id], parent = views[view.__parent__]
    var name = view.__name__, html = ""

    // remove view
    delete view.view
    delete view.children
    delete view.__props__

    if (name === "Action") return

    // linkable
    //if (view.link && !view.__linked__) return link({ _window, id, stack, props, __ })

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

        // remove from initial index list
        var initialIDIndex = parent.__childrenInitialIDRef__.indexOf(view.__initialID__)
        if (initialIDIndex > -1) parent.__childrenInitialIDRef__.splice(initialIDIndex, 1)

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
    view.__element__ = view.__element__ || { text, id, innerHTML, index, style: {} }

    // label
    // if (view.label && !view.__labeled__) html = labelHandler({ _window, id, tag })

    view.__innerHTML__ = innerHTML
    view.__html__ = html

    // id list
    view.__idList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
}

const link = ({ _window, id, stack, props, __ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    var view = views[id]

    var link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.manifest.host)
    var linkView = typeof view.link === "string" ? { link } : { ...view.link, link, __name__: "A" }

    // link
    var { view: linkView, id: linkID } = initView({ views, global, parent: view.__parent__, ...linkView, __, __controls__: [{ event: `click?root():'${view.link.path}'?${view.link.path || "false"};${view.link.preventDefault ? "false" : "true"}` }] })
    toHTML({ _window, id: linkID, stack, props, __ })

    // view
    view.__parent__ = linkID
    view.__linked__ = true
    toHTML({ _window, id, stack, props, __ })
}

const clearActions = (data) => {
    if (typeof data !== "object") return
    Object.entries(data || {}).map(([action, mapAction]) => {
        if (typeof mapAction === "object") return clearActions(mapAction)
        data[action] = ""
    })
    return data
}

const initView = ({ views, global, id = generate(), doc, children = [], parent, style = {}, __parent__, __status__ = "Loading", __dataPath__, __controls__ = [], ...data }) => {

    var parentView = (parent || __parent__ ? views[parent || __parent__] : { __childrenInitialIDRef__: [] }) || { __childrenInitialIDRef__: [] }

    views[id] = {
        ...data,
        id,
        children,
        style,
        doc: doc || parentView.doc,
        __initialID__: id,
        __status__,
        __view__: true,
        __parent__: parent || __parent__,
        __dataPath__: __dataPath__ || [...(parentView.__dataPath__ || [])],
        __indexing__: 0,
        __name__: data.view,
        __controls__,
        __events__: [],
        __loadedEvents__: [],
        __relEvents__: {},
        __childrenRef__: [],
        __childrenInitialIDRef__: [],
        __timers__: [],
        __rendered__: false,
        __initialIndex__: parentView.__indexing__ || 0,
        __viewPath__: [...(data.__viewPath__ || [])],
        __lookupActions__: [...(data.__lookupActions__ || parentView.__lookupActions__ || [])],
        __customViewPath__: [...(data.__customViewPath__ || parentView.__customViewPath__ || [])]
    }

    // 
    if (!parentView.__childrenInitialIDRef__.includes(id)) parentView.__childrenInitialIDRef__.push(id)

    if (parentView.__indexing__ > -1) parentView.__indexing__ += 1

    return { id, view: views[id] }
}

const getViewParams = ({ view }) => {

    var {
        id, doc, data, view, children, style, __lookupActions__, __element__, __dataPath__, __childrenRef__, __index__, __relEvents__, __loadedEvents__,
        __loop__, __loopIndex__, __looped__, __mount__, i, __executingSubparams__, __underscoreLoopIndex__,
        __viewPath__, __customViewPath__, __indexing__, __childIndex__, __initialIndex__, __customView__, __htmlStyles__, __events__, __page__,
        __defaultValue__, __childrenInitialIDRef__, __initialID__,
        __parent__, __controls__, __status__, __rendered__, __timers__, __view__, __name__, __customID__, __interpreted__, __, ...params
    } = view

    return params
}

const removeView = ({ _window, global, views, id, stack, props, self = true, main, insert }) => {

    var view = views[id]
    if (!view) return
    var parent = views[view.__parent__], element = {}

    if (!parent) return

    view.__childrenRef__.map(({ id }) => id).map(id => removeView({ _window, global, views, id, stack, props, insert }))
    if (main || !self) view.__childrenInitialIDRef__.map(initialID => {

        var unrenderedView = Object.values(views).find(view => initialID === (view || {}).__initialID__)
        if (unrenderedView) removeView({ _window, global, views, id: unrenderedView.id, stack, props, insert })
    })

    // remove events
    view.__element__ && view.__events__.map(event => view.__element__.removeEventListener(event.event, event.eventListener))

    // remove related events
    Object.entries(view.__relEvents__).map(([eventID, addresses]) => {
        Object.entries(addresses).map(([genID, address]) => {
            views[eventID] && views[eventID].__rendered__ && views[eventID].__element__.removeEventListener(address.event, address.eventListener)
            delete global.__events__[eventID][genID]
        })
    })

    // remove loader()
    if (!_window) {
        var loader = document.getElementById(view.id + "-loader")
        if (loader) loader.remove()
    }

    if (!self) {

        // remove from initial index list
        var initialIDIndex = parent.__childrenInitialIDRef__.indexOf(view.__initialID__)
        if (initialIDIndex > -1) parent.__childrenInitialIDRef__.splice(initialIDIndex, 1)

        return element
    }

    view.__timers__.map(timerID => clearTimeout(timerID))

    var index = parent.__childrenRef__.findIndex(({ id }) => id === view.id)

    if (index > -1) {
        main && parent.__childrenRef__.slice(index + 1).map(viewRef => {

            viewRef.index--
            views[viewRef.id].__index__ = viewRef.index
            views[viewRef.id].__rendered__ && views[viewRef.id].__element__.setAttribute("index", viewRef.index)
        })
        parent.__childrenRef__.splice(index, 1)
    }

    if (main && view.__rendered__) element = view.__element__

    views[id] = null
    delete views[id]

    return element
}

const deepDelete = ({ obj, key }) => {

    if (typeof obj !== "object" || obj[key] === null) return
    if (typeof obj[key] === "object")
        Object.keys(obj[key]).map(key => {
            deepDelete({ obj: obj[key], key })
        })

    obj[key] = null
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
    var index = stack.addresses.findIndex(({ viewID, blocked, blockable }) => blockable && !blocked && viewID === id)
    if (index !== -1) blockRelatedAddressesBynextAddress({ stack, index })
}

const eventExecuter = ({ _window, event, eventID, id, lookupActions, e, string, stack: nextStack, props, address: nextAddress, __, object = [] }) => {

    var views = window.views
    var global = window.global

    // view doesnot exist
    if (!views[id] || !views[eventID]) return

    object = [views[id], ...object]

    // e.target is not necessorily the element clicked. consider a btn in a container. the click event is on the container however the exact click was on the btn.
    if (event === "click" || event === "mousedown" || event === "mouseup") global.__clicked__ = views[e.target.id]

    // prevent unrelated droplists
    if (eventID === "droplist" && id !== "droplist" && (!global.__droplistPositioner__ || !views[global.__droplistPositioner__] || !views[global.__droplistPositioner__].__element__.contains(views[id].__element__))) return

    // init stack
    var stack = openStack({ _window, event, id, eventID, string, e })

    // address line
    var address = addresser({ _window, stack, props, id, status: "Start", type: "line", event, interpreting: true, lookupActions, __, nextStack, nextAddress, object }).address

    // main params
    toLine({ _window, lookupActions, stack, props, id, e, address, data: { string }, __, object, action: "toParam" })

    endStack({ _window, stack, props })
}

const defaultEventHandler = ({ id, events = ["click", "focus", "blur", "mouseenter", "mouseleave", "mousedown", "mouseup"] }) => {

    var views = window.views
    var view = views[id]

    view.focused = false
    view.touchstarted = false
    view.mouseentered = false
    view.mousedowned = false

    // linkable
    if (events.includes("click") && view.link && typeof view.link === "object" && view.link.preventDefault)
        view.__element__.addEventListener("click", (e) => { e.preventDefault() })

    // input
    if (view.__name__ === "Input" || view.editable) {

        events.includes("focus") && defaultInputHandlerByEvent({ views, view, id, event: "focus", keyName: "focused", value: true })
        events.includes("blur") && defaultInputHandlerByEvent({ views, view, id, event: "blur", keyName: "focused", value: false })
    }

    events.includes("mouseenter") && defaultInputHandlerByEvent({ views, view, id, event: "mouseenter", keyName: "mouseentered", value: true })
    events.includes("mouseleave") && defaultInputHandlerByEvent({ views, view, id, event: "mouseleave", keyName: "mouseentered", value: false })

    events.includes("mousedown") && defaultInputHandlerByEvent({ views, view, id, event: "mousedown", keyName: "mousedowned", value: true })
    events.includes("mouseup") && defaultInputHandlerByEvent({ views, view, id, event: "mouseup", keyName: "mousedowned", value: false })
}

const defaultInputHandlerByEvent = ({ views, view, id, event, keyName, value }) => {

    // function
    var fn = (e) => {
        if (views[id]) view[keyName] = value
    }
    view.__element__.addEventListener(event, fn)
}

const modifyEvent = ({ eventID, event, string, id, __, stack, props, lookupActions, address }) => {

    var view = window.views[eventID]
    var subparams = event.split("?")[1] || ""
    var subconditions = event.split("?")[2] || ""
    event = event.split("?")[0].split(":")[0]

    string = string.split("?").slice(1)
    var conditions = string[1] || ""

    if (event === "change" && (view.editable || view.input.type === "text" || view.input.type === "number")) {

        event = "keyup"
        subconditions += "e().key!=Tab;e().key!=Alt;e().key!=Shift;e().key!=Control;e().key!=ArrowUp;e().key!=ArrowDown;e().key!=ArrowRight;e().key!=ArrowLeft;e().key!=Enter"

    } else if (event === "entry") {

        event = "input"

    } else if (event === "menter") {

        event = "mouseenter"

    } else if (event === "mleave") {

        event = "mouseleave"

    } else if (event === "enter") {

        event = "keyup"
        conditions += "e().key=Enter||e().keyCode=13"

    } else if (event === "ctrl") {

        event = "keydown"
        conditions += "e().ctrlKey"

    } else if (event === "hover") {

        event = "mouseleave"
        defaultEventHandler({ id, events: ["mouseenter", "mouseleave"] })
        addEventListener({ event: `mouseenter?[${subparams};${string[0]}?${conditions}?${string.slice(2).join("?") || ""}]?${subconditions}`, eventID, id, __, stack, props, lookupActions, address })

    } else if (event === "dblclick") {

    }

    string = `[${subparams};${string[0]}?${conditions}?${string.slice(2).join("?") || ""}]?${subconditions}`
    while (string.slice(-1) === "?") string = string.slice(0, -1)

    return { string, event }
}

const starter = ({ lookupActions, stack, props, __, address, id }) => {

    var view = window.views[id]
    var global = window.global
    if (!view) return {}

    // status
    view.__status__ = "Mounted"
    view.__rendered__ = true

    view.__element__ = document.getElementById(id)
    if (!view.__element__) {
        delete window.views[id]
        return {}
    }
    view.__element__.setAttribute("index", view.__index__)

    // default input handlers
    defaultInputHandler({ id })

    // status
    //view.__status__ = "Mounting Events"

    // built in events
    Object.keys(builtinEvents).map(key => view[key] && view.__controls__.push(...builtinEvents[key]))

    // events
    view.__controls__.map(data => addEventListener({ lookupActions, stack, props, address, __, id, ...data }))

    // related events
    global.__events__[id] && Object.values(global.__events__[id]).map(address => view.__element__.addEventListener(address.event, address.eventListener))

    return view.__relEvents__ || {}
}

const defaultInputHandler = ({ id }) => {

    var views = window.views
    var global = window.global
    var view = views[id]

    if (!view) return
    if (view.__name__ !== "Input" && !view.editable) return

    view.__element__.addEventListener("focus", (e) => { if (view) global.__focused__ = view })

    if (typeof view.preventDefault === "string") return

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

        if (view.__name__ === "Input" && view.input.type === "number") {

            if (e.data !== ".") {

                if (isNaN(value)) value = value.toString().slice(0, -1)
                if (!value) value = 0
                if (value.toString().charAt(0) === "0" && value.toString().length > 1) value = value.toString().slice(1)
                if (view.input.min && view.input.min > parseFloat(value)) value = view.input.min
                if (view.input.max && view.input.max < parseFloat(value)) value = view.input.max
                value = parseFloat(value)
                // prevent default for 0 values
                if (e.target.value === "" && (typeof view.preventDefault === "object" ? view.preventDefault.zeroValue : false)) value = null
                else view.__element__.value = value.toString()

            } else value = parseFloat(value + ".0")
        }

        if (view.doc) setData({ id, data: { value, noValue: value === null }, __: view.__ })

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
                collection: global["openCollection"],
                doc: global["openDoc"],
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

    // 
    if (view.input ? view.input.type !== "file" : true) {

        var type = view.input && view.input.type

        view.__element__.addEventListener("input", inputEventHandler)
        if ("__defaultValue__" in view) {

            if (view.__name__ === "Input") view.__element__.value = view.__defaultValue__
            else if (view.editable) (view.__element__.textContent === undefined) ? (view.__element__.innerText = view.__defaultValue__) : (view.__element__.textContent = view.__defaultValue__)

        } else {

            var value
            if (view.__name__ === "Input") value = view.__element__.value
            else if (view.editable) value = (view.__element__.textContent === undefined) ? view.__element__.innerText : view.__element__.textContent

            if (view.data !== undefined && typeof view.data !== type) { }

            else {

                if (isNumber(value) && (view.type === "number" || (view.input && view.input.type === "number"))) value = parseFloat(value)

                if (view.doc && value !== undefined && value !== "") setData({ id, data: { value }, __: view.__ })
            }
        }
    }

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

    var views = window.views
    var global = window.global

    window.addEventListener('popstate', (e) => {
        // this detects back click
    })

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

        // views.root.__element__.click()
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

const setData = ({ id, data, __, stack = { addresses: [], returns: [] }, props = {} }) => {

    var view = window.views[id]
    var global = window.global

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

    if (data.noValue) keys.push("del()")

    // set value
    kernel({ id, data: { data: global[view.doc], path: keys, value: defValue, key: !data.noValue }, stack, props, __ })
}

const fileReader = ({ req, res, _window, lookupActions, stack, props, address, id, e, __, data }) => {

    // files to read
    data.files = toArray(data.file || data.files)
    if (!data.files) return console.log("No data to read!")

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
        length: data.files.length,
        count: 0
    };

    data.files.map(file => {

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

                toAwait({ req, res, _window, lookupActions, stack, props, address, id, e, __, _: data })
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

const root = ({ id, _window, root = {}, stack, props, lookupActions, address, req, res, __ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

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

    if (!views.root) return

    var anotherRootAddress = stack.addresses.find(({ data = {} }) => data.id === "root" && data.postUpdate)
    if (anotherRootAddress) {
        anotherRootAddress.blocked = true
        anotherRootAddress.data.elements.map(element => element.remove())
    }

    update({ _window, id, req, res, stack, props, lookupActions, address, data: { root, id: "root", action: "ROOT" }, __ })
}

const getNumberAfterString = (str, variable) => {

    if (!str) return false

    // Execute the regular expression on the input string
    let match = str.split(variable)[1];

    // Check if a match is found and return the number
    if (match) {
        return parseInt(match, 10); // Convert the matched string to an integer
    } else {
        return null; // Return null if no match is found
    }
}

const searchDoc = ({ _window, lookupActions, stack, props, address, id, __, req, res, data, object }) => {

    var waits = [`loader.hide;__queries__:().${data.data.collection}.${data.data.doc}=_.data||false`]
    if (data.lookupServerActions) waits.push(data.action)
    var { address } = addresser({ _window, id, stack, props, __, lookupActions, nextAddress: address, stack, props, type: "data", action: "search()", status: "Start", asynchronous: true, waits, object })

    return callDatabase({ _window, lookupActions, stack, props, address, id, __, req, res, data: { ...data, action: "search()" } })
}

const callDatabase = async ({ _window, lookupActions, stack, props, address, id, req, res, e, __, data }) => {

    // call server
    if (!_window) return route({ lookupActions, stack, props, address, id, req, __, res, e, data: { ...data, server: "database" } })

    // database
    var data = await database({ _window, req, res, action: data.action, stack, props, data: data.data || {}, __ })

    // awaits
    toAwait({ _window, lookupActions, stack, props, id, address, e, req, res, _: data, __ })
}

const route = async ({ lookupActions, stack, props, address, id, req, __, res, e, data }) => {

    // headers
    var options = {
        method: "POST",
        headers: {
            ...(data.headers || {}),
            timestamp: (new Date()).getTime(),
            timezone: Math.abs((new Date()).getTimezoneOffset()),
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
            cookies: JSON.stringify(getCookie())
        },
        // body
        body: JSON.stringify({
            __props__: {
                server: data.server,
                lookupActions: data.lookupActions,
                page: window.global.manifest.page,
                path: window.global.manifest.path,
                lookupServerActions: data.lookupServerActions
            },
            action: data.action,
            data: data.data
        })
    }

    // fetch
    var data = await fetch("/", options).then(response => response.json())

    // update session
    if (data.__props__.session) setCookie({ name: "__session__", value: data.__props__.session })

    // await
    toAwait({ lookupActions, address, stack, props, id, e, req, res, _: data, __ })
}

const loader = ({ _window, show }) => {

    if (_window) return

    if (!document.getElementById("loader-container")) return
    document.getElementById("loader-container").style.display = show ? "flex" : "none"
}

const mountData = ({ view, views, global, key, id, params, __ }) => {

    // data without doc => push to underscore
    if (key === "data" && !view.__executingSubparams__) {

        view.__.unshift(view.data)
        delete view.data
        delete params.data

        if (view.__loop__) {
            view.__underscoreLoopIndex__ = view.__underscoreLoopIndex__ || 0
            view.__underscoreLoopIndex__ += 1
        }
    }

    // doc or (data with prev doc)
    else if (key === "doc" || key === "data") {

        view.__dataPath__ = []
        view.doc = view.doc || generate()
        if (key === "data") global[view.doc] = view.data
        else global[view.doc] = global[view.doc] || {}
        if (key === "doc") delete view.data
    }

    // mount path directly when found
    else if (key === "path") {

        var dataPath = view.path
        // console.log(dataPath);
        // setup doc
        if (!view.doc) {

            view.doc = generate()
            global[view.doc] = {}
        }

        // list path
        var myPath = (typeof dataPath === "string" || typeof dataPath === "number") ? dataPath.toString().split(".") : dataPath || []

        // push path to __dataPath__
        view.__dataPath__.push(...myPath)
    }

    // assign view params to new view ID
    else if (view.id !== id) {

        var newID = view.id

        // remove from initial index list
        if (views[view.parent]) {
            var initialIDIndex = views[view.parent].__childrenInitialIDRef__.indexOf(id)
            if (initialIDIndex > -1) views[view.parent].__childrenInitialIDRef__.splice(initialIDIndex, 1)
            views[view.parent].__childrenInitialIDRef__.push(newID)
        }

        if (views[newID] && newID !== "root") newID += "_" + generate()
        Object.assign(views, { [newID]: views[id] })
        delete views[id]
        view.id = id = newID
        view.__customID__ = true
    }
}

const respond = ({ res, stack, props, global, response, __ }) => {

    if (!res || res.headersSent) return

    if (stack && typeof response === "object") {

        var executionDuration = (new Date()).getTime() - stack.executionStartTime
        stack.terminated = true

        // logs
        console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + "SEND " + stack.action, executionDuration, global.manifest.session.subdomain || "", global.manifest.session.username || "")
        stack.logs.push(stack.logs.length + " SEND " + stack.action + " (" + executionDuration + ")")

        // props
        response.__props__ = {
            action: stack.action,
            session: global.manifest.session.__props__.id,
            executionDuration,
            executedActions: stack.executedActions
        }

        // hide secured
        hideSecured({ global, __ })
    }

    if (typeof response === "object") {

        // respond
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(response))

    } else res.write(response)

    res.end()
}

const upload = async ({ _window, lookupActions, stack, props, address, id, req, res, e, __, upload, ...params }) => {

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

            headers.cookies = JSON.stringify(getCookie())
            /*var { data } = await axios.post(`/`, { server: "storage", action: "storage", data: upload }, { headers })
    
            uploads.push(data)
            return data*/
        }
    }))

    await Promise.all(promises)

    // await
    require("./kernel").toAwait({ _window, lookupActions, stack, props, address, req, res, id, e, __, _: uploads.length === 1 ? uploads[0] : uploads, ...params })
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

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

const database = async ({ _window, req, res, action, preventDefault, data, stack, props, authorized, __ }) => {

    var timer = (new Date()).getTime(), global = _window.global, responses = []

    // authorize
    var authorizations = authorized ? [data] : await authorize({ _window, global, action: action.slice(0, -2), data })
    if (!authorizations) return respond({ res, stack, props, global, __, response: { success: false, message: "Not authorized!" } })

    var promises = authorizations.map(async data => {

        if (action === "search()") responses.push(await getData({ _window, req, res, preventDefault, search: data, action }))
        else if (action === "save()") responses.push(await postData({ _window, req, res, preventDefault, save: data, action }))
        else if (action === "erase()") responses.push(await deleteData({ _window, req, res, preventDefault, erase: data, action }))

    })

    await Promise.all(promises)

    var response = mergeResponses({ global, action, responses })

    // log
    global.manifest.session && console.log((new Date()).getHours() + ":" + (new Date()).getMinutes(), action.slice(0, -2).toUpperCase(), data.collection, (new Date()).getTime() - timer, global.manifest.session.subdomain || "", global.manifest.session.username || "");

    // end
    if (global.manifest.server !== "database" || !global.__actionLaunched__) return response

    // send
    return respond({ res, stack, props, global, response, __ })
}

const getData = async ({ _window = {}, req, res, search, action = "search()" }) => {

    var global = _window.global
    var response = { success: false, message: "Something went wrong!" }
    var datastore = search.datastore || "bracketDB" || global.manifest.datastore,
        db = search.db = search.db || global.manifest.session.db,
        collection = search.collection,
        doc = search.doc,
        docs = search.docs,
        populate = search.populate,
        select = search.select,
        deselect = search.deselect,
        assign = search.assign,
        find = search.find,
        findOne = search.findOne,
        limit = search.limit || 1000,
        skip = search.skip || 0,
        data = {}, 
        success = true, 
        message = "Data queried successfully!",
        single

    if ("url" in search) {

        try {

            //data = await axios.get(search.url, { timeout: 1000 * 40 }).catch(err => err)

            data = data.data
            success = true
            message = `Search done successfuly!`

        } catch (err) {

            data = {}
            success = false
            message = err
        }

        response = { data, success, message }

    } else if (datastore === "bracketDB") {

        var { path, dbProps, collectionProps, liveDB, success, message } = await checkParams({ data: search, action })
        if (!success) return { success, message }

        // no collection => return collection names
        if (!collection) {

            var data = getFolderNames(path)

            var propsIndex = data.findIndex(coll => coll === "__props__")
            data.splice(propsIndex, 1)

            return ({ data, message: "Collection names sent successfully!", success: true })
        }

        // chunk details
        var chunkIndex = collectionProps.lastChunk
        var chunkName = "chunk" + chunkIndex
        var chunksRunout = false, endSearch = false
        
        // findOne
        if ("findOne" in search) {

            search.find = find = search.findOne
            limit = 1
            single = true
        }

        if ("docs" in search) {

            var foundDocs = []
            toArray(docs).map(doc => {
                if (fs.existsSync(`${path}/collection1/${doc}.json`)) {
                    data[doc] = JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`))
                    foundDocs.push(doc);
                }
            })
        }

        else if ("doc" in search) {

            if (fs.existsSync(`${path}/collection1/${doc}.json`)) {

                data = { [doc]: JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`)) }
                single = true

                // doc does not exist in collection
            } else data = undefined
        }

        else if ("findAny" in search) {

            var value = toArray(search.findAny)
            for (let index = collectionProps.lastChunk; index > 0; index--) {

                var chunkProps = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/chunk${index}/__props__.json`))
                var docs = chunkProps.docs

                for (let i = 0; i < docs.length; i++) {

                    var doc = docs[i]
                    var docData = JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`))

                    value.map(value => {

                        delete docData.__props__.active
                        delete docData.__props__.creationDate
                        delete docData.__props__.comments
                        delete docData.__props__.collapsed
                        delete docData.__props__.createdByUserID
                        delete docData.__props__.id
                        delete docData.__props__.doc
                        delete docData.__props__.counter
                        delete docData.__props__.chunk
                        delete docData.__props__.version
                        delete docData.__props__.dirPath
                        delete docData.__props__.collection
                        delete docData.__props__.chunk
                        
                        if (JSON.stringify(docData).includes(value)) {

                            data[doc] = []

                            var list = objectToString(docData).split(value)
                            if (list.length <= 1) return

                            list.map((text, i) => {
                                if (i === 0) return
                                data[doc].push(list[i - 1].split(": ").at(-1).split(",").at(-1).slice(-30) + `<mark>${value}</mark>` + text.split(",")[0])
                            })
                        }
                    })
                }
            }
        }

        else { // find on no find
            while (!chunksRunout && !endSearch) {
   
                if ("find" in search) {

                    // find=[] & find=[preventDefault] => do not return all data in collection
                    var searchFields = Object.keys(find)
                    if ((find.preventDefault && searchFields.length === 1) || searchFields.length === 0) return { data: {}, message: "No find conditions exist!", success: false }
                    delete find.preventDefault
                    
                    // get indexing
                    var {success, chunks, docs, message} = checkIndexing({path, finds: toArray(find), chunkName, collectionProps})
                    if (!success) break;

                    var i = 0

                    while (limit > 0 && (i <= docs.length - 1)) {

                        var doc = docs[i]

                        toArray(find).map((find, index) => {
                            delete find.preventDefault
                            if (limit === 0) return
                            var push = true
                            var chunk = chunks[index]
                            
                            searchFields.map(searchField => {

                                if (!push) return
                                // equal query without having equal operator
                                if (typeof find[searchField] !== "object" || Array.isArray(find[searchField])) find[searchField] = { equal: find[searchField] }

                                Object.entries(find[searchField]).map(([operator, value]) => {
                                    push = findData({ data: chunk.indexing[doc][searchField], operator: toOperator(operator), value })
                                })
                            })

                            if (push && skip) skip--;
                            else if (push && limit > 0 && !skip) {
                                limit--;
                                data[doc] = JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`))
                            }
                            
                            if (limit === 0) endSearch = true
                            i++;
                        })
                    }
                }

                else {

                    // get indexing
                    var {success, chunks, docs, message} = checkIndexing({path, finds: toArray(find), chunkName, collectionProps})
                    if (!success) break;

                    var i = 0

                    while (limit > 0 && (i <= docs.length - 1)) {

                        var doc = docs[i]

                        if (!skip) data[doc] = JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`))
                        if (skip) skip--;
                        else limit--;
                        i++;
                    }

                    if (limit === 0) endSearch = true
                }

                if (chunkIndex === 1 || endSearch) chunksRunout = true
                else {
                    chunkIndex--;
                    chunkName = "chunk" + chunkIndex
                }
            }
        }

        // __queries__
        queries({ global, data, search, collection })
        
        // props
        readProps({ collectionProps, dbProps, data, db: liveDB, collection })

        response = { id: generate(), data, message, success, single, dev: search.dev, search }

    } else if (datastore === "firebase") {

        var project = (search.headers || {}).project || search.db || _window.global.manifest.session.db

        if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && !search.url) {
            collection = 'collection-' + collection
            collection += `-${project}`
        }

        var ref = req.datastore.firebaseDB.collection(collection), promises = []

        if ("docs" in search) {

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

    } else if (datastore === "mongoDB") {

        if (!collection) {

            var collections = await req.datastore.mongoDB.db(db).listCollections().toArray()
            return ({ success: true, message: "Names queried successfully!", data: collections.map(data => data.name) })
        }

        var ref = req.datastore.mongoDB.db(db).collection(collection)

        // docs
        if (docs) data = await ref.find({ "__props__.doc": { $in: docs } }).limit(limit).skip(skip).toArray();

        // doc
        else if (doc) data = await ref.findOne({ "__props__.doc": doc })

        // collection
        else if (!find && !findOne) data = await ref.find().limit(limit).skip(skip).toArray();

        // find
        else data = await ref.find(mongoOptions({ find })).limit(limit).skip(skip).toArray();

        // return data as map
        if (!doc && data) {
            var mapData = {}
            data.map(data => {
                mapData[data.__props__.doc] = data
            })
            data = mapData
        }

        response = { data, message: "Data queried successfully!", success: true }
    }

    // ex: search():[collection=product;docs;populate=:[collection;key;field]] (key is keyname in data, field is the fields to return)
    if ((populate || select || deselect || assign) && success) {

        var data = response.data

        // restructure
        if (doc) data = { [doc]: data }

        if (populate) await populator({ _window, req, res, db, data, populate, search })
        if (select) data = selector({ data, select })
        else if (deselect) data = deselector({ data, deselect })
        else if (assign) data = assigner({ data, assign })

        // restructure
        if (doc) data = data[doc]
        response.data = data
    }

    return response
}

const postData = async ({ _window = {}, req, res, save, action = "save()" }) => {

    var datastore = save.datastore || "bracketDB" || _window.global.manifest.datastore
    var project = (save.headers || {}).project || save.db

    // collection
    var db = save.db || _window.global.manifest.session.db,
        collection = save.collection,
        doc = save.doc,
        docs = save.docs || [],
        data = save.data,
        find = save.find,
        success = false, 
        message = "Missing data!"

    // update specific fields. ex: update:[name=Goerge;age=28] (it ignores appended data)
    if (save.update) {

        var search = { datastore, db, collection }
        if (doc) search.doc = doc
        else if (find) search.find = find

        var { data: rawData, success, message } = await database({ _window, req, action: "search()", data: search })
        if (!success) return ({ success, message })
        data = rawData

        if (doc) data = { [data.__props__.doc]: data }

        // update values for requested keys
        Object.values(data).map(data => Object.entries(save.update).map(([key, value]) => key.split(".").reduce((o, k, i) => { if (i === key.split(".").length - 1) { o[k] = value } else return o[k] }, data)))
        data = Object.values(data)
    }

    // find data
    else if (find) {

        var { data: rawData } = await database({ _window, req, res, action: "search()", data: save })
        rawData = Object.values(rawData)
        if (rawData.length > 1) return ({ success: false, message: "Incompatible use of find and save!" })
        else if (rawData.length === 1) save.doc = rawData[0].__props__.doc
    }

    if (datastore === "bracketDB") {

        var { path, dbProps, collectionProps, liveDB, success, message } = await checkParams({ data: save, action })
        if (!success) return { success, message }

        if (save.publish) {
            var response = await publish({ data: save })
            return response
        }

        /*// no props
        if (collection === "project" && db === bracketDB && !data.__props__) {
            if (!data.db) return ({ success: false, message: "Missing data!" })
            if (fs.existsSync(`bracketDB/${data.db}`)) return ({ success: false, message: "Database exists!" })
        }*/

        // create collection
        if (!("data" in save) && !("update" in save) && !("rename" in save) && collection) {

            if (fs.existsSync(path + "/" + collection)) return ({ success: false, message: "Enter data to save!" })

            createCollection({ _window, req, db, collection, liveDB })

            return { success: true, message: "Collection created successfully!" }
        }

        // rename collection
        if (save.rename && save.collection) {

            fs.renameSync(path, `bracketDB/${db}/${save.rename}`)

            // props
            dbProps.writes += 1
            collectionProps.writes += 1
            collectionProps.collection = collection = save.rename

            // props
            fs.writeFileSync(`bracketDB/${liveDB}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))
            fs.writeFileSync(`bracketDB/${liveDB}/__props__/db.json`, JSON.stringify(dbProps, null, 4))

            return { success: true, message: "Collection name changed successfully!" }
        }

        var writesCounter = 0, newDocsLength = 0, payloadIn = 0, newDataSize = 0, chunks = {}, chunkName = `chunk${collectionProps.lastChunk}`
        var length = toArray(data).length, promises = []

        // incompatible payload
        if (("doc" in save && length > 1 && docs.length !== length)) return {success:false, message: "Incompatible payload!"}

        // push doc to docs
        if ("doc" in save && length === 1 && docs.length === 0) docs = [save.doc]

        var dataList = toArray(data)

        for (let i = 0; i < dataList.length; i++) {

            var data = dataList[i], createNewDoc = false, existingData = {}, chunkName = `chunk${collectionProps.lastChunk}`

            // check if user is creating a new doc
            var createNewDoc = !data.__props__ || !data.__props__.doc
            // check doc by props.doc
            if (!createNewDoc) {
                var response = await database({_window, action:"search()", data:{db, collection, doc:data.__props__.doc}})
                if (response.data) existingData = response.data
                else createNewDoc = true
            }

            // check doc by given doc
            if (createNewDoc && docs[i]) {
                var response = await database({_window, action:"search()", data:{collection, doc:docs[i]}})
                if (response.data) {
                    existingData = response.data
                    createNewDoc = false
                }
            }

            // collection props
            writesCounter++
            if (createNewDoc) {

                newDocsLength++;
                collectionProps.counter++;
            }

            var existingProps = existingData.__props__ || {}
            var newProps = data.__props__ || {}

            // data props
            data.__props__ = {
                // main props: imutable
                id: existingProps.id || generate({ unique: true }),
                doc: docs[i] || existingProps.doc || (collection + collectionProps.counter),
                counter: existingProps.counter || collectionProps.counter,
                creationDate: existingProps.creationDate || (new Date()).getTime(),
                collection: existingProps.collection || collection,
                chunk: existingProps.chunk || chunkName,
                // other props: mutable
                actions: newProps.actions || existingProps.actions || {},
                comments: newProps.comments || existingProps.comments || [],
                collapsed: newProps.collapsed || existingProps.collapsed || [],
                arrange: newProps.arrange || existingProps.arrange || [],
                secured: newProps.secured || existingProps.secured || false,
            }

            // set data size
            data.__props__.size = JSON.stringify(data).length
            
            // create new db
            if (collection === "project" && db === bracketDB) createDB({ data })

            // create new host
            else if (collection === "host" && db === bracketDB && data.port) data.port.map(port => start(port))

            // reset doc name
            var doc = data.__props__.doc, oldDoc = existingProps.doc
            
            // get chunk props
            var chunkName = data.__props__.chunk
            if (!chunks[chunkName]) chunks[chunkName] = { props: JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/__props__.json`)), indexings: {} }
            var chunkProps = chunks[chunkName].props
            
            // push/replace doc to sorted docs & update chunk docslength & size
            if (oldDoc && doc !== oldDoc) {
                for (let i = 0; i < chunkProps.docs.length; i++) {
                    if (chunkProps.docs[i] === oldDoc) chunkProps.docs[i] = doc
                }
                chunkProps.size -= existingData.__props__.size
            } else if (oldDoc) {
                chunkProps.size -= existingData.__props__.size
            } else if (!oldDoc) {

                chunkProps.docs.unshift(doc)
                chunkProps.docsLength += 1
                
                // check chunk docs length
                if (chunkProps.docsLength === 1000) {

                    collectionProps.lastChunk += 1
                    chunkProps.reachedMax = true
                    createChunk({ db, collection, chunkName: `chunk${collectionProps.lastChunk}`, collectionProps })
                }
            }
            chunkProps.size += data.__props__.size

            // loop over indexings
            for (let i = 0; i < collectionProps.indexes.length; i++) {
                var indexProps = collectionProps.indexes[i], sameFieldValue = true, indexingOfDoc = {}

                // indexing expired
                if (indexProps.expiryDate < new Date().getTime()) {
                    delete collectionProps.indexes[i]
                    fs.rmSync(`${path}/collection1/__props__/${chunkName}/${indexProps.doc}.json`)
                    continue;
                }
                
                // loop over find search fields
                for (let j = 0; j < indexProps.find.length; j++) {
                    var searchFields = indexProps.find[j]

                    // get new data field value 
                    var newFieldValue = getFieldValue(searchFields.split("."), data).value
                    indexingOfDoc[searchFields] = newFieldValue

                    // check prev value
                    if (oldDoc && sameFieldValue) {
                        
                        var prevFieldValue = getFieldValue(searchFields.split("."), existingData).value
                        sameFieldValue = isEqual(prevFieldValue, newFieldValue)

                    } else sameFieldValue = false
                }

                // update indexing
                if (!sameFieldValue) {

                    // get chunk indexing
                    if (!chunks[chunkName].indexings[indexProps.doc]) chunks[chunkName].indexings[indexProps.doc] = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/${indexProps.doc}.json`))

                    // get indexing
                    chunks[chunkName].indexings[indexProps.doc][doc] = indexingOfDoc
                }
            }

            // save data
            fs.writeFileSync(`${path}/collection1/${doc}.json`, JSON.stringify(data, null, 4))

            // props: data size
            var dataSize = JSON.stringify({ [doc]: data }).length
            payloadIn += dataSize
            if (createNewDoc) newDataSize += dataSize
        }

        // save chunk props & indexings
        Object.entries(chunks).map(([chunkName, chunk]) => {
            fs.writeFileSync(`${path}/collection1/__props__/${chunkName}/__props__.json`, JSON.stringify(chunk.props, null, 4))
            Object.entries(chunk.indexings).map(([indexingDoc, indexing]) => {
                fs.writeFileSync(`${path}/collection1/__props__/${chunkName}/${indexingDoc}.json`, JSON.stringify(indexing, null, 4))
            })
        })

        // props
        postProps({ db: liveDB, collection, collectionProps, dbProps, writesCounter, newDocsLength, payloadIn, newDataSize })

        return { success: true, message: "Data saved successfully!", data }

    } else if (datastore === "firebase") {

        if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") {
            collection = 'collection-' + collection
            collection += `-${project}`
        }

        var ref = req.datastore.firebaseDB.collection(collection)

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

    } else if (datastore === "mongoDB") {

        var ref = req.datastore.mongoDB.db(db).collection(collection)

        // get counter
        if (collection !== "counters") {
            var { data: counter } = await getData({ _window, req, res, search: { db: bracketDB, collection: "counters", find: { db } } })
            counter = Object.values(counter)[0]
        }

        promises = toArray(data).map(async data => {

            if (!data.__props__) {

                if (!counter.collections[collection]) counter.collections[collection] = 0
                counter.collections[collection]++;

                data.__props__ = {

                    id: generate({ unique: true }),
                    doc: doc || (collection + counter.collections[collection]),
                    creationDate: (new Date()).getTime(),
                    active: true,
                    createdByUserID: _window.global.manifest.session.userID,
                    counter: counter.collections[collection]
                }

                doc = data.__props__.doc

                // set counter
                collection !== "counters" && database({ _window, req, action: "save()", data: { db: bracketDB, collection: "counters", doc: counter.__props__.doc, data: counter } })

                return await ref.insertOne(data)

            } else if (doc) data.__props__.doc = doc
            else doc = data.__props__.doc

            var set = {}
            Object.entries(data).map(([key, value]) => { if (key !== "_id") set[key] = value })

            return await ref.updateOne({ "__props__.id": data.__props__.id }, { $set: set }, { upsert: true })
        })

        await Promise.all(promises)

        return { success: true, message: "Data saved successfully!", data }
    }
}

const deleteData = async ({ _window = {}, req, res, erase, action = "erase()" }) => {

    var global = _window.global
    var collection = erase.collection,
        datastore = erase.datastore || "bracketDB" || _window.global.manifest.datastore,
        project = (erase.headers || {}).project,
        db = erase.db || global.manifest.session.db,
        docs = toArray(erase.docs || erase.doc),
        find = erase.find,
        data = {},
        success = true, 
        message = "Documents erased successfully!"

    if (datastore === "bracketDB") {

        var { path, dbProps, collectionProps, liveDB, success, message } = await checkParams({ data: erase, action })
        if (!success) return { success, message }

        // erase collection
        if (!("docs" in erase) && !("doc" in erase) && !("find" in erase)) {

            fs.rmSync(`${path}`, { recursive: true, force: true })

            dbProps.deletes += 1
            dbProps.collectionsLength -= 1
            dbProps.docsLength -= collectionProps.docsLength
            dbProps.size -= collectionProps.size

            deleteProps({ db: liveDB, collection, collectionProps, dbProps })

            return ({ success: true, message: "Collection erased successfully!" })
        }

        // find => get docs
        if ("find" in erase || "findOne" in erase) {

            var searchOptions = { datastore, db, collection, find }
            if (erase.findOne) {
                searchOptions.find = erase.findOne
                searchOptions.limit = 1
            }
            find.preventDefault = true
            var { data } = await database({ _window, req, action: "search()", data: searchOptions })
            docs = Object.keys(data)
            docs.map(doc => data[doc] = "erased")
        }

        if (docs.length === 0) {

            message = "No data found!"
            collectionProps.deletes += 1
            dbProps.deletes += 1

        } else {

            var docsLength = 0, dataSize = 0, chunks = {}

            // remove docs
            docs.map(doc => {
                if (fs.existsSync(`${path}/collection1/${doc}.json`)) {

                    // get data
                    var docData = JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`)), chunkName = docData.__props__.chunk
                    if (!chunks[chunkName]) chunks[chunkName] = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/__props__.json`))

                    // remove from docs
                    var index = chunks[chunkName].docs.indexOf(doc)
                    if (index > -1) chunks[chunkName].docs.splice(index, 1)
                        
                    // case: delete project
                    if (collection === "project" && db === bracketDB && fs.existsSync(`bracketDB/${docData.db}`)) fs.rmSync(`bracketDB/${docData.db}`, { recursive: true, force: true })

                    // props: length, size
                    docsLength++;
                    dataSize += docData.__props__.size
                    data[doc] = "erased"

                    // last doc => decrement counter
                    if (collectionProps.counter === docData.__props__.counter) collectionProps.counter--

                    // update chunk props
                    chunks[chunkName].size -= docData.__props__.size
                    chunks[chunkName].docsLength -= 1
                    
                    // remove doc
                    fs.unlinkSync(`${path}/collection1/${doc}.json`)

                } else delete data[doc]
            })
            
            // reset docs according to erased 
            var docs = Object.keys(data)

            // update indexing & chunk props
            Object.entries(chunks).map(([chunkName, chunkProps]) => {

                // remove doc from indexing
                collectionProps.indexes.map(({ doc: indexName }) => {
                    var indexing = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/${indexName}.json`))
                    docs.map(doc => delete indexing[doc])
                    fs.writeFileSync(`${path}/collection1/__props__/${chunkName}/${indexName}.json`, JSON.stringify(indexing, null, 4))
                })

                // save chunk props
                fs.writeFileSync(`${path}/collection1/__props__/${chunkName}/__props__.json`, JSON.stringify(chunkProps, null, 4))
            })
        }

        // props
        deleteProps({ db: liveDB, collection, collectionProps, dbProps, docsLength, dataSize })

    } else if (datastore === "firebase") {

        if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") {
            collection = 'collection-' + collection
            collection += `-${project}`
        }

        var promises = docs.map(async doc => {

            await req.datastore.firebaseDB.collection(collection).doc(doc.toString()).delete().then(() => {

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

                    await req.datastore.firebaseDB.collection(`storage-${req.headers["project"]}`).doc(erase.storage.doc.toString()).delete().then(() => {

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

    } else if (datastore === "mongoDB") {

        var ref = req.datastore.mongoDB.db(project).collection(collection)

        // erase by docs
        if (docs.length > 0) {
            var promises = docs.map(async doc => await ref.deleteOne({ "__props__.id": doc }))
            await Promise.all(promises)
        }

        // erase by options
        else if (find) {
            await ref.delete(mongoOptions({ find }))
        }
    }

    return ({ success, message, data })
}

const checkParams = async ({ _window, req, data, action }) => {

    var collection = data.collection, db = data.db
    var path = `bracketDB/${db}`

    // publish
    if (data.publish) return ({ success: true, path })

    if (!fs.existsSync(path)) return ({ success: false, message: "Project does not exist!" })

    // collection
    if (collection) {

        path += `/${collection}`
        if (!fs.existsSync(path) && action !== "save()") return ({ success: false, message: "Collection does not exist!" }) // save without collection creates collection

    } else if (action !== "search()") return ({ success: false, message: "No collection!" }) // search without collection gets collections

    // props
    var liveDB = data.dev ? data.liveDB : db

    if (!fs.existsSync(`bracketDB/${liveDB}`)) return ({ success: false, message: "Props error!" })

    var dbProps = JSON.parse(fs.readFileSync(`bracketDB/${liveDB}/__props__/db.json`))
    var collectionProps = collection && fs.existsSync(`bracketDB/${liveDB}/${collection}`) && JSON.parse(fs.readFileSync(`bracketDB/${liveDB}/${collection}/collection1/__props__/__props__.json`))

    // create collection
    if (!collectionProps && action === "save()") collectionProps = await createCollection({ _window, req, db, collection, liveDB, data, dev: liveDB !== db })
    // devdb and create collection
    else if (collectionProps && action === "save()" && liveDB !== db && (!fs.existsSync(path) || getDocNames(path).length === 0)) await createCollection({ _window, req, db, collection, liveDB, collectionProps, dev: true })
    // erase
    if (!collectionProps && action === "erase()") return { success: false }

    return { collection, path, dbProps, collectionProps, liveDB, success: true }
}

const hideSecured = ({ global, __ }) => {

    if (!global) return
    var lookupServerAction = (collection, doc) => global.manifest.lookupServerActions && global.manifest.lookupServerActions.collection === collection && global.manifest.lookupServerActions.doc === doc

    Object.keys(global.__queries__).map(collection => {
        Object.keys(global.__queries__[collection]).map(doc => {
            var data = global.__queries__[collection][doc]
            if (data.__props__ && data.__props__.secured && !global.__authorized__[collection][doc]) {

                Object.keys(data).map(key => {
                    if (key === "__props__") {

                        var found = false
                        if (lookupServerAction(collection, doc)) {

                            found = true

                            var path = global.manifest.lookupServerActions.path || [], lastIndex = path.length - 1

                            path.reduce((o, k, i) => {
                                if (!(k in o) || !found) return found = false
                                else if (typeof o[k] !== "object" && i !== lastIndex) found = false
                                else return o[k]
                            }, data.__props__.actions)

                            // reset actions
                            data.__props__.actions = {}

                            path.reduce((o, k, i) => {

                                if (i === lastIndex && !found) o[k] = false
                                else if (i === lastIndex && found) o[k] = true
                                else return o[k] = {}

                            }, data.__props__.actions)

                        } else data.__props__.actions = {}

                        delete data.__props__.collapsed
                        delete data.__props__.comments

                    } else delete data[key]
                })
            }
        })
    })
}

const populator = async ({ _window, req, data, db, populate }) => {

    var populatedData = {}
    var populates = toArray(populate)

    // get data by IDs
    var responses = populates.map(async (populate, i) => {

        if (typeof populate === "string") populates[i] = populate = { db, collection: populate, field: populate, find: "id", deselect: [] }
        if (!populate.collection) populate.collection = populate.field
        if (!populate.find) populate.find = "id"

        // get values from queried data
        var IDSet = new Set()
        Object.values(data).map(data => IDSet.add(data[populate.field]))

        // add find conditions
        if (populate.find === "doc") {
            populate.docs = Array.from(IDSet)
            delete populate.find
        } else populate.find = { [populate.find]: { in: Array.from(IDSet) } }

        var response = await database({ _window, req, action: "search()", data: populate })
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

            var operator = toOperator(Object.keys(valueAndOperator)[0])
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

const getSession = async ({ _window, req }) => {

    var global = _window.global, response, session, promises = [], sessionID = (global.manifest.cookies[global.manifest.host] || {}).__session__
    
    // get session by sessionID
    if (sessionID) {

        // get session
        var response = await database({ _window, req, action: "search()", data: { db: bracketDB, collection: "session", findOne: { "__props__.id": sessionID, publicID: global.manifest.publicID } } })
        session = response.data
        
        // session expired
        if (!session || session.expiryDate < new Date().getTime()) {

            // delete old session
            if (session) await database({ _window, req, action: "erase()", data: { db: bracketDB, collection: "session", doc: session.__props__.doc } })

            // create session
            response = await createSession({ _window, req, session })
            session = response.data

            // session garbage collector
            database({ _window, req, action: "erase()", data: { db: bracketDB, collection: "session", find: { expiryDate: { "<": (new Date()).getTime() - 259200000 } } } })
        }
    }

    // create session
    if (!session) {

        response = await createSession({ _window, req })
        session = response.data
    }

    // permissions
    if (session.userID) promises.push(database({ _window, req, action: "search()", data: { db: bracketDB, collection: "permission", findOne: { userID: { equal: session.userID } } } }).then(({ data }) => { session.permissions = data || {} }))

    // plugins
    promises.push(getPlugins({ _window, publicID: session.publicID, session }))

    // activity
    promises.push(recordActivity({ _window, session }))

    await Promise.all(promises)
    return response
}

const createSession = async ({ _window, req, res, session = {} }) => {

    var global = _window.global
    var promises = [], account

    // project
    await database({ _window, req, action: "search()", data: { db: bracketDB, collection: "project", findOne: { publicID: global.manifest.publicID } } }).then(({ data }) => { project = data })

    // project does not exist
    if (!project) return { message: "Project does not exist!", success: false }

    // account
    promises.push(database({ _window, req, action: "search()", data: { db: bracketDB, collection: "account", findOne: { "__props__.id": { equal: project.accountID } } } }).then(({ data }) => { account = data }))

    await Promise.all(promises)

    if (!account) return { message: "Account does not exist!", success: false }

    // session
    var newSession = {

        // related to the opened project not the user
        accountID: account.__props__.id,
        accountName: account.__props__.doc,
        publicID: project.publicID,
        projectID: project.__props__.id,
        projectDoc: project.__props__.doc,
        subdomain: project.subdomain,
        host: global.manifest.host,
        db: project.db,
        dev: global.manifest.dev || false,
        devDB: global.manifest.dev ? project.devDB : "",
        expiryDate: new Date().getTime() + 86400000,
        encryptionKey: generate(),

        // related to the user logged in to the platform
        userID: session.userID || "",
        username: session.username || "",
    }

    // save
    var { data: session } = await database({ _window, req, action: "save()", data: { db: bracketDB, collection: "session", data: newSession } })

    return { data: session, success: true, message: "Session created successfully!" }
}

const getFolderNames = path =>
    fs.readdirSync(path, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name)

const getDocNames = path =>
    fs.readdirSync(path, { withFileTypes: true })
        .filter(dir => !dir.isDirectory())
        .map(dir => dir.name)

const flattenObject = (obj, parentKey = '') => {
    let flattened = {};

    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            let nestedObj = flattenObject(obj[key], parentKey + key + ': ');
            flattened = { ...flattened, ...nestedObj };
        } else {
            flattened[parentKey + key] = Array.isArray(obj[key]) ? obj[key].join(', ') : obj[key];
        }
    }

    return flattened;
}

const objectToString = (obj) => {
    let flattenedObj = flattenObject(obj);
    let str = '';

    let usedKeys = {}; // Keep track of used parent keys

    for (let key in flattenedObj) {
        let parts = key.split(': '); // Split the key into parts by ': '
        let parentKey = parts.slice(0, -1).join(': '); // Get the parent key
        let lastKey = parts[parts.length - 1]; // Get the last part of the key

        // Check if the parent key has been used before
        if (!usedKeys[parentKey]) {
            // If not used, add the parent key and the last key with value
            str += parentKey + ': ' + lastKey + ': ' + flattenedObj[key] + ', ';
            usedKeys[parentKey] = true; // Mark the parent key as used
        } else {
            // If used, just add the last key with value
            str += lastKey + ': ' + flattenedObj[key] + ', ';
        }
    }

    // Remove the trailing comma and space
    str = str.slice(0, -2);

    return str;
}

const readProps = ({ collectionProps, dbProps, data, db, collection }) => {

    if (!collectionProps || !dbProps) return

    var reads = data ? Object.keys(data).length : 1
    var payloadOut = data ? JSON.stringify(data).length : 0
    
    // remove expired indexes
    for (let i = collectionProps.indexes.length - 1; i >= 0; i--) {
        if (collectionProps.indexes[i].expiryDate < new Date().getTime()) collectionProps.indexes.splice(i, 1)
    }

    // save collection props
    collectionProps.reads += reads
    collectionProps.payloadOut += payloadOut
    fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))

    dbProps.reads += reads
    dbProps.payloadOut += payloadOut
    fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(dbProps, null, 4))
}

const postProps = ({ db, collection, collectionProps, dbProps, writesCounter, newDocsLength, payloadIn, newDataSize }) => {

    if (!collectionProps || !dbProps) return
    
    // remove expired indexes
    for (let i = collectionProps.indexes.length - 1; i >= 0; i--) {
        if (collectionProps.indexes[i].expiryDate < new Date().getTime()) collectionProps.indexes.splice(i, 1)
    }

    collectionProps.writes += writesCounter
    collectionProps.docsLength += newDocsLength
    collectionProps.payloadIn += payloadIn
    collectionProps.size += newDataSize
    fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))

    dbProps.writes += writesCounter
    dbProps.docsLength += newDocsLength
    dbProps.payloadIn += payloadIn
    dbProps.size += newDataSize
    fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(dbProps, null, 4))
}

const deleteProps = ({ db, collection, collectionProps, dbProps, docsLength = 0, dataSize = 0 }) => {

    if (!collectionProps || !dbProps) return
    
    // remove expired indexes
    for (let i = collectionProps.indexes.length - 1; i >= 0; i--) {
        if (collectionProps.indexes[i].expiryDate < new Date().getTime()) collectionProps.indexes.splice(i, 1)
    }

    // props
    collectionProps.docsLength -= docsLength
    collectionProps.size -= dataSize
    dbProps.docsLength -= docsLength
    dbProps.size -= dataSize

    if (!collectionProps.docsLength) collectionProps.counter = 0

    // props
    if (fs.existsSync(`bracketDB/${db}/${collection}`)) fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))
    fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(dbProps, null, 4))
}

const queries = ({ global, data, search, collection }) => {

    if (!global || (search.preventDefault || {}).queries) return

    global.__queries__[collection] = global.__queries__[collection] || {}
    global.__authorized__[collection] = global.__authorized__[collection] || {}
    if (!data) global.__queries__[collection][search.doc] = false
    else if (!Array.isArray(data)) {
        Object.entries(data).map(([doc, data]) => {
            if (Array.isArray(data) || typeof data !== "object") return
            global.__queries__[collection][doc] = data
            if (search.unsecure) global.__authorized__[collection][doc] = true
        })
    }
}

const createDB = ({ data }) => {

    data.db = generate({ universal: true })
    data.devDB = generate({ universal: true })
    data.storage = generate({ universal: true })

    var newProjectProps = {
        creationDate: 0,
        collectionsLength: 0,
        docsLength: 0,
        reads: 0,
        writes: 0,
        deletes: 0,
        size: 0,
        payloadIn: 0,
        payloadOut: 0
    }

    // db
    fs.mkdirSync(`bracketDB/${data.db}`)
    // devDB
    fs.mkdirSync(`bracketDB/${data.devDB}`)

    // db props
    fs.mkdirSync(`bracketDB/${data.db}/__props__`)
    fs.writeFileSync(`bracketDB/${data.db}/__props__/db.json`, JSON.stringify(newProjectProps, null, 4))

    // storage
    fs.mkdirSync(`storage/${data.storage}`)
    fs.mkdirSync(`storage/${data.storage}/__props__`)
    fs.writeFileSync(`storage/${data.storage}/__props__/storage.json`, JSON.stringify(newProjectProps, null, 4))
}

const authorize = async ({ _window, global, action, data }) => {

    var authorizations = []

    // devDB => add authorizations
    if (data.devDB && data.db) {
        authorizations.push({ ...data, db: data.devDB, devDB: data.devDB, dev: true, liveDB: data.db })
        if (action === "save") return authorizations
    }
    if (data.db) return [{ ...data, db: data.db }, ...authorizations]

    // no session yet
    if (!global.manifest.session) return authorizations

    // devDB => add authorizations
    if (global.manifest.session.dev) {
        authorizations.push({ ...data, db: global.manifest.session.devDB, devDB: global.manifest.session.devDB, dev: true, liveDB: global.manifest.session.db })
        if (action === "save") return authorizations
    }
    authorizations.push({ ...data, db: global.manifest.session.db })

    // special case
    if (data.uncheckPlugins) return authorizations

    // get plugins from session
    var plugins = global.manifest.session.plugins || []

    // no plugin found
    if (plugins.length === 0) return authorizations

    // check authority
    var authPlugins = plugins.filter(plugin => pluginAuthConditions(plugin, action))

    // not authorized
    if (authPlugins.length === 0) return authorizations

    var queryOptions = []//, localDBIncluded = false
    var promises = authPlugins.map(async plugin => {

        // get db through projectID
        return await getData({ _window, action: "search()", authorized: true, search: { db: bracketDB, collection: "project", find: { "__props__.id": plugin.projectID }, limit: 1, preventDefault: { queries: true } } }).then(response => {

            var project = Object.values(response.data || {})[0]
            if (!project) return queryOptions.push(false)
            queryOptions.push({ ...data, db: project.db, plugin })
        })
    })

    await Promise.all(promises)

    // query options
    return [...authorizations, ...queryOptions.filter(options => options)]
}

const getPlugins = async ({ _window, publicID, session }) => {

    // recheck subscriptions
    var accessabilities = [], subscriptions = []

    // get subscriptions
    await database({ _window, action: "search()", data: { db: bracketDB, collection: "subscription", find: { expiryDate: { greater: new Date().getTime() }, publicID } } }).then(({ data }) => { subscriptions = Object.values(data || {}) })

    // get plugins
    subscriptions.length > 0 && await database({ _window, action: "search()", data: { db: bracketDB, collection: "accessability", find: { packageID: { in: subscriptions.map(subs => subs.packageID) } } } }).then(({ data }) => { accessabilities = Object.values(data || {}) })

    // accessabilities
    accessabilities = accessabilities.map(({ accessabilities }) => accessabilities).flat()

    if (session) session.plugins = accessabilities

    return accessabilities
}

const pluginAuthConditions = ({ collection, collections, doc, docs, actions = [] }, action) => (

    actions.includes(action) &&
    // collection
    (collections ? (typeof collections === "boolean" ? true : (Array.isArray(collections) && data.collection) ? collections.includes(data.collection) : false) : (collection && data.collection) ?
        // doc
        (collection === data.collection && (docs ? (typeof docs === "boolean" ? true : (Array.isArray(docs) && data.doc) ? docs.includes(data.doc) : false) : (doc && data.doc) ? doc === data.doc : false)) : false)
)

const start = (port) => {

    var child = spawn("node", ["index.js", port])

    child.stdout.on("data", function (data) {
        //start(port, true)
        console.log(child.spawnargs[2], data.toString())
    })
    child.stderr.on("data", function (data) {
        //start(port, true)
        console.log(child.spawnargs[2], data.toString())
    })
    child.on("close", function (data) {
        // console.log(port);
        // start(port, true);
        start(child.spawnargs[2])
    })
    //console.log(child);
}

const saveLogs = () => {

    // save logs to file
    var logFile = fs.createWriteStream('log.txt', { flags: 'a' }); // w to clear on new process
    var logStdout = process.stdout;
    var logSterr = process.stderr;

    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + '\n');
        logStdout.write(util.format.apply(null, arguments) + '\n');
        logSterr.write(util.format.apply(null, arguments) + '\n');
    }

    console.error = console.log
}

const publish = async ({ data }) => {

    var devDB = data.devDB, liveDB = data.liveDB
    if (!fs.existsSync(`bracketDB/${devDB}`) || !fs.existsSync(`bracketDB/${liveDB}`)) return ({ success: false, message: "Wrong DB!" })

    var collections = fs.readdirSync(`bracketDB/${devDB}`)

    for (let index = 0; index < collections.length; index++) {

        var collection = collections[index]
        if (collection === "__props__") return
        
        var chunkProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/__props__/${chunkName}/__props__.json`))

        // save docs in liveDB and remove from devDB
        for (let i = 0; i < chunkProps.docs.length; i++) {
            postData({ save: {db: liveDB, collection, data: JSON.parse(fs.readFileSync(`bracketDB/${devDB}/${collection}/collection1/${chunkProps.docs[i]}.json`)) } })
        }

        // remove collection from devDB
        fs.rmSync(`bracketDB/${devDB}/${collection}`, { recursive: true, force: true })
    }

    // remove removed devData from liveData
    // ... (later)

    return ({ success: true, message: "Data published successfully!" })
}

const findData = ({ data, operator, value }) => {

    var push = false

    // list => loop
    if (Array.isArray(data) && operator !== "inc") return push = data.find(data => findData({ data, operator, value })) || false

    if (operator === "==") {
        if (data === value) push = true
    } else if (operator === "!=") {
        if (data !== value) push = true
    } else if (operator === ">=") {
        if (data >= value) push = true
    } else if (operator === "<=") {
        if (data <= value) push = true
    } else if (operator === "<") {
        if (data < value) push = true
    } else if (operator === ">") {
        if (data > value) push = true
    } else if (operator === "inc") {
        if (typeof data === "string" && data.includes(value)) push = true
        else if (toArray(data).includes(value)) push = true
    } else if (operator === "in") {
        if (toArray(value).includes(data)) push = true
    } else if (operator === "regex") {
        if (value.test(data)) push = true
    } else if (operator === "exists") {
        if (data !== undefined) push = true
    } else if (operator === "doesnotexist") {
        if (data === undefined) push = true
    }

    return push
}

const toFirebaseOperator = (string) => {
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

const toOperator = (string) => {
    if (!string || string === 'equal' || string === 'eq') return '=='
    if (string === 'notequal' || string === 'neq') return '!='
    if (string === 'greaterorequal' || string === 'gte') return '>='
    if (string === 'lessorequal' || string === 'lte') return '<='
    if (string === 'less' || string === 'lt') return '<'
    if (string === 'greater' || string === 'gt') return '>'
    if (string === 'contains') return 'inc'
    if (string === 'containsall' || string === "incall") return 'inc'
    if (string === 'doesnotcontain' || string === "doesnotinclude") return 'notinc'
    else return string
}

const mergeResponses = ({ global, responses, action, response }) => {

    if (!global.manifest.session || action !== "search()") response = responses[0]
    else {

        // get main response
        response = responses.find(res => res.dev || (global.manifest.session.dev ? res.db === global.manifest.session.devDB : res.db === global.manifest.session.db))

        // not db related response (reading from another db)
        if (!response) response = responses[0]

        // no data in main response
        if (!response.data && responses.find(({ data, success }) => data && success)) response = { data: {}, success: true }

        responses.map(res => {
            if (res.id !== response.id && res.data) Object.entries(res.data).map(([doc, data]) => { if (!response.data[doc]) response.data[doc] = data })
        })
    }

    // single
    if (responses.find(({ single }) => single)) response.data = Object.values(response.data)[0]

    return { success: response.success, message: response.message, data: response.data }
}

const checkIndexing = ({ path, finds, chunkName, collectionProps }) => {

    var chunks = [], message, success = true
    // get chunk props
    var chunkProps = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/__props__.json`))
    // get docs arrangement 
    var docs = chunkProps.docs

    for (let index = 0; index < finds.length; index++) {

        if (!success) break;
        var find = finds[index];

        var searchFields = Object.keys(find), indexing = {}

        // undefined field name
        var wrongFields = searchFields.find(field => field.includes("undefined"))
        if (wrongFields) {
            success = false
            message = "Wrong find keynames! Includes undefined"
            break;
        }

        // check if indexed else create index
        var indexProps = collectionProps.indexes.find(findProps => searchFields.length === findProps.find.length && !searchFields.find(field => !findProps.find.includes(field)))
        
        // not indexed => create an index
        if (!indexProps) var {success, message, indexProps} = createIndex({ collectionProps, searchFields, path })
        
        // get index
        indexing = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/${indexProps.doc}.json`))

        // update index expiryDate
        indexProps.lastRead = new Date().getTime()
        indexProps.expiryDate = indexProps.lastRead + 2592000000

        // read index
        fs.readFileSync(`${path}/collection1/__props__/${chunkName}/${indexProps.doc}.json`)
        
        chunks[index] = { indexing, find: searchFields }
    }
    
    return {success, message, chunks, docs}
}

const getFieldValue = (fields, object) => {

    var breakRequest = false
    var lastIndex = fields.length - 1
    var success = true, message = "Index created successfully!"

    var answer = fields.reduce((o, k, i) => {
        if (breakRequest || !o) return o
        
        if (Array.isArray(o) && !isNumber(k)) {
            breakRequest = true
            return o.map(o => getFieldValue(fields.slice(i), o).value).filter(value => value !== undefined)
        }
        else if (i === lastIndex && o[k] !== undefined) return o[k]
        else if (k.slice(-2) === "()") return actions[k]({o})
        else if (i !== lastIndex) {
            if (typeof o !== "object"/* || (typeof o === "string" && !isNumber(k))*/) {
                breakRequest = true
                success = false
                message = "Accessing a non object through field " + k + "!"
                return
            }
            return o[k]
        }
    }, object)

    return { success, value: answer, message }
}

const createCollection = async ({ _window, req, db, collection, liveDB, collectionProps = {}, dev }) => {

    // collection props has chunk and devDB does not have => create collection and chunk
    if (dev) {

        // create collection dir
        if (fs.existsSync(`bracketDB/${db}/${collection}`)) return

        fs.mkdirSync(`bracketDB/${db}/${collection}`)
        fs.mkdirSync(`bracketDB/${db}/${collection}/collection1`)
        fs.mkdirSync(`bracketDB/${db}/${collection}/collection1/__props__`)

        createChunk({ db, collection, chunkName, collectionProps })
    }

    if (fs.existsSync(`bracketDB/${liveDB}/${collection}`)) return

    fs.mkdirSync(`bracketDB/${liveDB}/${collection}`)
    fs.mkdirSync(`bracketDB/${liveDB}/${collection}/collection1`)
    fs.mkdirSync(`bracketDB/${liveDB}/${collection}/collection1/__props__`)
    fs.mkdirSync(`bracketDB/${liveDB}/${collection}/collection1/__props__/chunk1`)
    fs.writeFileSync(`bracketDB/${liveDB}/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify({ docs: [], chunk: "chunk1", docsLength: 0, size: 0 }, null, 4))

    // props
    var collectionProps = {
        creationDate: new Date().getTime(),
        collection,
        maxSize: 1000,
        lastChunk: 1,
        collection: 1,
        docsLength: 0,
        counter: 0,
        reads: 0,
        writes: 1,
        deletes: 0,
        size: 0,
        payloadIn: 0,
        payloadOut: 0,
        indexes: [],
        lastIndex: 0
    }

    // collection props
    fs.writeFileSync(`bracketDB/${liveDB}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))

    // db props
    var dbProps = JSON.parse(fs.readFileSync(`bracketDB/${liveDB}/__props__/db.json`))

    dbProps.writes += 1
    db.collectionsLength += 1

    fs.writeFileSync(`bracketDB/${liveDB}/__props__/db.json`, JSON.stringify(dbProps, null, 4))

    // create view collection
    if (collection === "view") {

        var data = [{
            view: "Action?id=router",
            children: [
                {
                    view: "manifest:().action"
                }
            ]
        }, {
            view: "View?id=document",
            children: [
                {
                    view: "View?id=head"
                },
                {
                    view: "View?id=body",
                    children: [
                        {
                            view: "root"
                        }
                    ]
                }
            ]
        }, {
            view: "View?id=root",
            children: [
                {
                    view: "droplist"
                },
                {
                    view: "note"
                },
                {
                    view: "manifest:().page"
                }
            ]
        }, {
            view: "View?id=main;class=flexbox;style:[height=100vh;width=100vw;gap=3rem]",
            children: [
                {
                    view: "Text?text=Welcome to Bracket Technologies!;style:[fontSize=4rem]"
                }
            ]
        }]

        var docs = ["router", "document", "root", "main"]

        for (let index = 0; index < data.length; index++) {
            await database({ _window, req, action: "save()", data: { db, collection, data: data[index], doc: docs[index] } })
        }
    }

    return collectionProps
}

const createChunk = ({ db, collection, chunkName, collectionProps }) => {

    var chunkProps = { docs: [], chunk: chunkName, docsLength: 0, size: 0 }
    fs.mkdirSync(`bracketDB/${db}/${collection}/collection1/__props__/${chunkName}`)

    // create indexes in chunk1
    if (fs.existsSync(`bracketDB/${db}/${collection}`))
        collectionProps.indexes.map(({ doc }) => fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/${chunkName}/${doc}.json`, JSON.stringify({}, null, 4)))

    fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/${chunkName}/__props__.json`, JSON.stringify(chunkProps, null, 4))
    
    for (let i = 0; i < collectionProps.indexes.length; i++) {
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/${chunkName}/${collectionProps.indexes[i].doc}.json`, JSON.stringify({}, null, 4))
    }
}

const createIndex = ({ collectionProps, searchFields, path }) => {

    var success = true, message = ""

    collectionProps.lastIndex += 1
    var indexProps = { find: searchFields, doc: "index" + collectionProps.lastIndex }
    collectionProps.indexes.push(indexProps)

    for (let index = 1; index <= collectionProps.lastChunk; index++) {

        var chunkName = "chunk" + index
        var chunkProps = JSON.parse(fs.readFileSync(`${path}/collection1/__props__/${chunkName}/__props__.json`))
        var { docs } = chunkProps
        var indexing = {}
        
        // loop over all docs
        for (let i = 0; i < docs.length; i++) {

            var doc = docs[i];
            if (!success) break;

            // loop over find fields
            for (let j = 0; j < searchFields.length; j++) {
                var field = searchFields[j];

                // get value
                var { success, value, message } = getFieldValue(field.split("."), JSON.parse(fs.readFileSync(`${path}/collection1/${doc}.json`)))
                if (!success) break;

                if (j === 0) indexing[doc] = {}

                // push values to indexing
                if (value !== undefined) indexing[doc][field] = value
            }
        }
    
        // save index
        fs.writeFileSync(`${path}/collection1/__props__/${chunkName}/index${collectionProps.lastIndex}.json`, JSON.stringify(indexing, null, 4))
    }

    return { success, message, indexProps }
}

const recordActivity = async ({ _window, session }) => {

    var todayStart = actions["todayStart()"]({})
    var hourStart = actions["hourStart()"]({})
    var now = actions["now()"]({})

    // user activity
    const userActivity = async () => {

        var userActivity
        if (!session.userID) return
        var { data: userActivity } = await database({ _window, action: "search()", data: { db: bracketDB, collection: "userActivity", findOne: { date: todayStart, userID: session.userID } } })
        if (!userActivity) userActivity = { firstTrigger: now, serverTriggers: 0, date: todayStart, userID: session.userID, activityPerHour: [] }
        
        // day activity
        userActivity.serverTriggers += 1
        userActivity.lastTrigger = now
        
        // hour activity
        if (!userActivity.activityPerHour.find(({time}) => time === hourStart)) {
            userActivity.activityPerHour.push({ time: hourStart, firstTrigger: now, serverTriggers: 0 })
        }
        var hourActivity = userActivity.activityPerHour[userActivity.activityPerHour.length - 1]
        hourActivity.serverTriggers += 1
        hourActivity.lastTrigger = now

        await database({ _window, action: "save()", data: { db: bracketDB, collection: "userActivity", data: userActivity } })
    }

    // project activity
    const projectActivity = async () => {

        var projectActivity
        var { data: projectActivity } = await database({ _window, action: "search()", data: { db: bracketDB, collection: "projectActivity", findOne: { date: todayStart, projectID: session.projectID } } })
        if (!projectActivity) projectActivity = { firstTrigger: now, serverTriggers: 0, date: todayStart, projectID: session.projectID, activityPerHour: [] }
        
        // day activity
        projectActivity.serverTriggers += 1
        projectActivity.lastTrigger = now
        
        // hour activity
        if (!projectActivity.activityPerHour.find(({time}) => time === hourStart)) {
            projectActivity.activityPerHour.push({time: hourStart, firstTrigger: now, serverTriggers: 0 })
        }
        var hourActivity = projectActivity.activityPerHour[projectActivity.activityPerHour.length - 1]
        hourActivity.serverTriggers += 1
        hourActivity.lastTrigger = now

        await database({ _window, action: "save()", data: { db: bracketDB, collection: "projectActivity", data: projectActivity } })
    }

    var promises = [userActivity(), projectActivity()]

    await Promise.all(promises)
}

module.exports = {
    actions, kernel, toValue, toParam, reducer, toApproval, toAction, toLine, addresser, toAwait, insert, toView, update, addEventListener,
    getDeepChildren, getDeepChildrenId, calcSubs, calcDivision, calcModulo, emptySpaces, isNumber, printAddress, endAddress, resetAddress,
    closePublicViews, updateDataPath, remove, toHTML, initView, getViewParams, removeView, defaultEventHandler,
    toNumber, defaultAppEvents, clearActions, hideSecured, route, respond, eventExecuter, starter,
    database,
    getData,
    postData,
    deleteData,
    getSession,
    createSession,
    start,
    saveLogs
}
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../views/views":113,"./builtinEvents.json":1,"./capitalize":2,"./clone":3,"./colorize":4,"./cookie":5,"./counter":6,"./cssStyleKeyNames":7,"./csvToJson":8,"./decode":9,"./documenter":undefined,"./droplist":10,"./events.json":11,"./executable":12,"./exportJson":13,"./focus":14,"./generate":15,"./getCoords":16,"./getDateTime":17,"./getDaysInMonth":18,"./getType":19,"./getView":20,"./isArabic":22,"./isCalc":23,"./isCondition":24,"./isEqual":25,"./isEvent":26,"./isParam":27,"./jsonToBracket":28,"./kernel":29,"./logger":30,"./mail":31,"./merge":32,"./note":33,"./passport":34,"./publicViews.json":35,"./qr":36,"./replaceNbsps":37,"./resize":38,"./setPosition":39,"./stack":40,"./toArray":41,"./toCSV":42,"./toClock":43,"./toCode":44,"./toEvent":45,"./toExcel":46,"./toPdf":47,"./toSimplifiedDate":48,"./vcard":49,"./watch":50,"_process":75,"child_process":52,"dotenv":56,"fs":52,"util":105}],30:[function(require,module,exports){
const logger = ({ _window: { global }, data: { key, start, end } }) => {
    
    if (!key) return
    if (start) global.__server__[`${key}StartTime`] = (new Date()).getTime()
    else if (end) {

        global.__server__[`${key}EndTime`] = (new Date()).getTime()
        global.__server__[`${key}Duration`] = global.__server__[`${key}EndTime`] - global.__server__[`${key}StartTime`]
        console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + key.toUpperCase(), global.__server__[`${key}Duration`], global.manifest.host)
    }
}
module.exports = { logger }
},{}],31:[function(require,module,exports){
const { toArray } = require("./toArray")

module.exports = {
    mail: async ({ _window, req, res, id, data, __, ...params }) => {

        var { subject, content, text, html, recipient, attachments, recipients = [] } = data
        
        const { google } = _window.__package__.googleapis
        const nodemailer = _window.__package__.nodemailer
        const OAuth2 = google.auth.OAuth2;
        var data = req.body.data
        var global = _window.global
        var project = global.__queries__.project

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
        if (params.asyncer) require("./kernel").toAwait({ _window, id, ...params, req, res, __, _: global.mail })
    }
}
},{"./kernel":29,"./toArray":41}],32:[function(require,module,exports){
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

},{"./clone":3,"./toArray":41}],33:[function(require,module,exports){
const { isArabic } = require("./isArabic")

const note = ({ _window, note: data }) => {

  if (_window) return
  var views = window.views
  var note = views["note"]
  if (typeof data === "string") data = { text: data }
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

},{"./isArabic":22}],34:[function(require,module,exports){
(function (process){(function (){
const { getData } = require('./kernel');

require('dotenv').config()

// project DB
var bracketDB = process.env.BRACKETDB

module.exports = async ({ _window, lookupActions, stack, props, address, id, e, __, req, res, data }) => {

    if (!_window) return console.log("Passport is a serverside action!")

    if (data.facebook) data.provider = "facebook"
    else if (data.gmail) data.provider = "gmail"

    if (data.auth) data.action = "auth"
    else if (data.login) data.action = "login"

    if (data.provider === "facebook" && data.action === "auth") {

        const params = [
            `client_id=429088239479513`,
            `scope=email`,
            `display=popup`
        ];

        var href = `https://www.facebook.com/v4.0/dialog/oauth?${params.join("&")}`
        
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.writeHead(302, { Location: href });
        res.end();

    } else if (data.provider === "facebook" && data.action === "login") {
        
        var global = _window.global
        var { data: project } = await getData({ _window, req, search: { db: bracketDB, collection: "project", doc: global.manifest.session.projectName } })

        if (data.provider === "facebook" && !project.facebook) return
        else if (data.provider === "gmail" && !project.gmail) return

        const params = [
            `client_id=${project.facebook.appID}`,
            `client_secret=${project.facebook.appSecret}`,
            `code=${data.code || ""}`,
            `redirect_uri=${data.redirectUri || ""}`
        ];

        try {

            // Exchange authorization code for access token
            const facebookLoginURL = `https://graph.facebook.com/v13.0/oauth/access_token?${params.join("&")}`;
            var { data: { access_token } } = await getData({ _window, req, res, search: { url: facebookLoginURL } })

            // Use access_token to fetch user profile
            var { data: profile } = await getData({ _window, req, res, search: { url: `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}` } })

            // Code to handle user authentication and retrieval using the profile data
            console.log(profile);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // await params
    require("./kernel").toAwait({ _window, lookupActions, stack, props, id, e, address, req, res, _: data, __ })
}
}).call(this)}).call(this,require('_process'))
},{"./kernel":29,"_process":75,"dotenv":56}],35:[function(require,module,exports){
module.exports={
    "droplist": {
        "view": "View:droplist?__droplistMouseleaveTimer__:()=400;class=box-shadow flex column;[mouseleave?mouseleaveDroplist()];[mouseenter?mouseenterDroplist()];[click:document?outClickDroplist()];style:[width=fit-content;transition=opacity .1s, transform .1s, background-color .1s;height=fit-content;overflowY=auto;overflowX=hidden;maxWidth=40rem;transform=scale(0.5);opacity=0;pointerEvents=none;position=fixed;borderRadius=.5rem;backgroundColor=#fff;zIndex=998]",
        "__props__": {
            "id": "H1Q7f0a828R8d7d0Q060p1E5l2",
            "creationDate": 0,
            "doc": "droplist",
            "active": true,
            "dirPath": [],
            "collapsed": [],
            "comments": [],
            "public": true,
            "actions": {
                "mouseleaveDroplist": "mouseentered=false;clearTimer():[__droplistTimer__:()];__droplistTimer__:()=timer():[__keyupIndex__:()=0;__droplistMouseenterer__:().del();__droplistPositioner__:().del();():droplist.style():[opacity=0;transform='scale(0.5)';pointerEvents=none]]:[__droplistMouseleaveTimer__:()]",
                "mouseenterDroplist": "mouseentered=true;__droplistMouseleaveTimer__:()=400;clearTimer():[__droplistTimer__:()]",
                "outClickDroplist": "__droplistMouseleaveTimer__:()=400;mouseleave()?!().contains():[clicked()];![():[__droplistPositioner__:()]].contains():[clicked()]"
            }
        }
    },
    "loader": {
        "view": "View:loader-container?class=loader-container",
        "children": [
            {
                "view": "View:loader?class=loader"
            }
        ],
        "__props__": {
            "id": "r1H7q0M8K8b8O7Q060t0u1w4v6",
            "creationDate": 0,
            "doc": "loader",
            "public": true,
            "active": true,
            "actions": {},
            "dirPath": [],
            "collapsed": [],
            "comments": []
        }
    },
    "mininote": {
        "view": "View:mininote?class=flex-start;style:[zIndex=99999;width=fit-content;alignItems=center;position=absolute;transform=scale(0);transition=transform .1s, opacity .2s;opacity=0;pointerEvents=none;padding=.5rem 1rem;backgroundColor=#444444dd;borderRadius=.5rem];():document.mousemove:[position():[positioner=mouse;placement=right]]",
        "children": [
            {
                "view": "Text:mininote-text?style.width=fit-content;style.fontSize=1.1rem;style.color=#fff"
            }
        ],
        "__props__": {
            "id": "01o73078J8D8T7T0n1d4P0g3o6",
            "creationDate": 0,
            "doc": "mininote",
            "public": true,
            "active": true,
            "actions": {},
            "dirPath": [],
            "collapsed": [],
            "comments": []
        }
    },
    "note": {
        "view": "View:note?class=flexbox box-shadow;style:[position=fixed;zIndex=9999;if():mobile():[maxWidth=40rem];minWidth=25rem;opacity=0;backgroundColor=#0d6efd;padding=1rem 3rem;left=center;top=0;transform=translateY(-200%);transition=transform .2s;borderRadius=0 0 1.5rem 1.5rem];mouseenter:[clearTimer():[().note-timer]];mouseleave:[note-timer=timer():[style().transform=translateY(-200%)]:5000]",
        "children": [
            {
                "view": "View?class=flexbox;style.width=100%",
                "children": [
                    {
                        "view": "Text?id=note-text;text=Action Note;style.color=#fff;style.fontSize=1.4rem"
                    },
                    {
                        "view": "Icon?icon.name=bi-x;style.color=#fff;style.position=absolute;style.fontSize=1.8rem;style.right=.4rem;style.cursor=pointer;click:[():note.style():[transform=translateY(-200%);opacity=0]]"
                    }
                ]
            }
        ],
        "__props__": {
            "id": "31V7U0w8O8l8K7R0N0m7o8u4X3",
            "creationDate": 0,
            "doc": "note",
            "public": true,
            "active": true,
            "actions": {},
            "dirPath": [],
            "collapsed": [],
            "comments": []
        }
    },
    "popup": {
        "view": "View:popup?class=box-shadow;style:[zIndex=10;pointerEvents=none;opacity=0;transition=opacity .1s;position=fixed];[click:document?closePopup()];mouseenter:[enterPopup()];mouseleave:[leavePopup()]",
        "children": [
            {
                "view": "View?style:[border=1px solid #f0f0f0;transform='scale(0.5)';borderRadius=.5rem;backgroundColor=#fff;transition=.2s]?():[__popupPositioner__:()].popup.model=model1",
                "children": [
                    {
                        "view": "Icon?class=pointer;id=popup-confirm;name=bi-check2;tooltip.text=Confirm;hover.style.backgroundColor=#0000ff22;style:[fontSize=1.8rem;height=4rem;width=3rem];click:[confirmPopup()]"
                    },
                    {
                        "view": "Icon?class=pointer;id=popup-cancel;name=bi-x;tooltip.text=Cancel;hover.style.backgroundColor=#ff000022;style:[fontSize=2rem;height=4rem;width=3rem];click:[cancelPopup()]"
                    }
                ]
            },
            {
                "view": "View?class=flexbox;style:[position=fixed;top=0;right=0;left=0;bottom=0;backgroundColor=#00000040;zIndex=10;transition=.2s]?():[__popupPositioner__:()].popup.model=model2",
                "children": [
                    {
                        "view": "View?class=flex column;style:[position=relative;borderRadius=.5em;backgroundColor=#fff;padding=2rem;gap=2rem]",
                        "children": [
                            {
                                "view": "Icon?class=flexbox pointer;name=bi-x;style:[position=absolute;top=1rem;right=1rem;height=2.5rem;width=2.5rem;fontSize=2.5rem;color=#666;transition=.2s;borderRadius=.5rem];hover:[style.backgroundColor=#eee];click:[():popup-cancel.click()]"
                            },
                            {
                                "view": "Text?style:[width=fit-content;fontSize=1.4rem];fontWeight=bold;text=[():[__popupPositioner__:()].popup.title.text||'Do you confirm!']"
                            },
                            {
                                "view": "View?class=flex align-center;style:[gap=2rem;justifyContent=flex-end]",
                                "children": [
                                    {
                                        "view": "Text:popup-confirm?class=flexbox pointer;hover.style.opacity=1;style:[fontSize=1.3rem;transition=.2s;color=#fff;borderRadius=.5rem;backgroundColor=blue;height=3rem;width=12rem];text=[():[__popupPositioner__:()].popup.confirm.text||'Confirm'];click:[confirmPopupModel2()]"
                                    },
                                    {
                                        "view": "Text:popup-cancel?class=flexbox pointer;hover.style.opacity=1;style:[fontSize=1.3rem;transition=.2s;borderRadius=.5rem;backgroundColor=#bbb;height=3rem;width=12rem];text=[():[__popupPositioner__:()].popup.cancel.text||'Cancel'];click:[cancelPopupModel2()]"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "__props__": {
            "id": "51e7D0G8Z8y8k7U0y1D4X9F4T1",
            "creationDate": 0,
            "doc": "popup",
            "public": true,
            "active": true,
            "dirPath": [],
            "collapsed": [],
            "comments": [],
            "actions": {
                "cancelPopup": "__popupPositioner__:().del();__popupConfirmed__:()=false;():popup.():[style():[opacity=0;pointerEvents=none];1stChild().style().transform=scale(0.5)]",
                "confirmPopup": "__popupConfirmed__:()=true;():popup.():[style():[opacity=0;pointerEvents=none];1stChild().style().transform=scale(0.5)]",
                "confirmPopupModel2": "__popupConfirmed__:()=true;():popup.style():[opacity=0;pointerEvents=none]",
                "cancelPopupModel2": "__popupPositioner__:().del();__popupConfirmed__:()=false;():popup.():[style():[opacity=0;pointerEvents=none]]",
                "closePopup": "leavePopup()?__popupPositioner__:();!__popupPositioner__:().contains():[clicked()];!popup.contains():[clicked()]",
                "leavePopup": "clearTimer():[popup-timer:()];popup-timer:()=timer():[():[__popupPositioner__:()].popup.style.keys()._():[():popup.style().[_]=():popup.style.[_]];clearTimer():[popup-timer:()];timer():[():[__popupPositioner__:()].popup.style.keys()._():[():popup.style().[_]=():popup.style.[_]];():popup.():[1stChild().style().transform=scale(0.5);style():[opacity=0;pointerEvents=none]];__popupPositioner__:().del()]:0]:400",
                "enterPopup": "clearTimer():[popup-timer:()]"
            }
        }
    },
    "tooltip": {
        "view": "View:tooltip?class=flex-start;style.zIndex=999;style.width=fit-content;style.alignItems=center;style.position=fixed;style.opacity=0;style.pointerEvents=none;style.padding=.5rem 1rem;style.backgroundColor=#444444dd;style.borderRadius=.5rem",
        "children": [
            {
                "view": "Text:tooltip-text?style.width=fit-content;style.fontSize=1.1rem;style.color=#fff"
            }
        ],
        "__props__": {
            "id": "z1W7Z0s8o87837a0z1N4k1D6C0",
            "creationDate": 0,
            "doc": "tooltip",
            "public": true,
            "active": true,
            "actions": {},
            "dirPath": [],
            "collapsed": [],
            "comments": []
        }
    }
}
},{}],36:[function(require,module,exports){
const qr = async ({ _window, id, req, res, data, __, e, stack, props, lookupActions, address }) => {

    if (res && !res.headersSent) return qrServer({ _window, id, req, res, data, __, e, stack, props, lookupActions, address })
    
    var QRCode = require("easyqrcodejs")

    // get image
    var view = window.views[data.id], imageEl
    if (view) imageEl = view.__element__
    
    var qrcode = new QRCode(document.getElementById(data.id), data)
    var data = { message: "QR generated successfully!", data: qrcode, success: true }

    console.log("QR", data)

    require("./kernel").toAwait({ _window, lookupActions, id, e, asyncer: true, address, stack, props, req, res, __, _: data })
}

const qrServer = async ({ _window, id, req, res, data, __, e, stack, props, lookupActions, address }) => {

    var text = data.text || data.url
    if (data.wifi) text = wifiQrText({ data })

    var qrcode = await require('qrcode').toDataURL(text)
    var data = { message: "QR generated successfully!", data: qrcode, success: true }

    require("./kernel").toAwait({ _window, lookupActions, id, e, asyncer: true, address, stack, props, req, res, __, _: data })
}

const wifiQrText = ({ data }) => {
    
    return `WIFI:S:${data.name || data.ssid || ""};T:${data.type || "WPA"};P:${data.password || ""};;${data.url || ""}`
}

module.exports = { qr }
},{"./kernel":29,"easyqrcodejs":58,"qrcode":76}],37:[function(require,module,exports){
const replaceNbsps = (str) => {
  if (typeof str !== "string") return str
    var re = new RegExp(String.fromCharCode(160), "g");
    return str.toString().replace(re, " ");
  }

  module.exports = { replaceNbsps }
},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
const setPosition = ({ position = {}, id, e }) => {

  var views = window.views
  var align = position.align || "center"
  var element = views[position.id || id].__element__
  var mousePos = position.positioner === "mouse"
  var fin = element.getElementsByClassName("fin")[0]
  var positioner = position.positioner || id

  if (!views[positioner] && !mousePos) return
  
  var positionerTop, positionerBottom, positionerRight, positionerLeft, positionerHeight, positionerWidth

  if (mousePos) {

    positionerTop = e.clientY + window.scrollY
    positionerBottom = e.clientY + window.scrollY
    positionerRight = e.clientX + window.scrollX
    positionerLeft = e.clientX + window.scrollX
    positionerHeight = 0
    positionerWidth = 0
    
  } else {

    positioner = views[positioner].__element__
    positionerTop = positioner.getBoundingClientRect().top
    positionerBottom = positioner.getBoundingClientRect().bottom
    positionerRight = positioner.getBoundingClientRect().right
    positionerLeft = positioner.getBoundingClientRect().left
    positionerHeight = positioner.offsetHeight
    positionerWidth = positioner.offsetWidth

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
  distance = position.distance === undefined ? 10 : position.distance

  if (placement === "right") {

    left = positionerRight + distance + (position.gapX || 0)
    top = positionerTop + positionerHeight / 2 - height / 2 + (position.gapY || 0)
      
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "-0.5rem"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0 0 0.4rem"
    }

  } else if (placement === "left") {
    
    left = positionerLeft - distance - width + (position.gapX || 0)
    top = positionerTop + positionerHeight / 2 - height / 2 + (position.gapY || 0)
    
    if (fin) {
      fin.style.right = "-0.5rem"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }

  } else if (placement === "top") {

    top = positionerTop - height - distance + (position.gapY || 0)
    left = positionerLeft + positionerWidth / 2 - width / 2 + (position.gapX || 0)

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "-0.5rem"
      fin.style.borderRadius = "0 0 0.4rem 0"
    }

  } else if (placement === "bottom") {

    top = positionerTop + positionerHeight + distance + (position.gapY || 0)
    left = positionerLeft + positionerWidth / 2 - width / 2 + (position.gapX || 0)
    
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "-0.5rem"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }
  }

  if (("top" in position) || ("left" in position) || ("bottom" in position) || ("right" in position)) {
    
    element.style.top = top + 'px'
    element.style.left = left + 'px'
    if ("top" in position) element.style.top = position.top + 'px'
    if ("left" in position) element.style.left = position.left + 'px'
    if ("bottom" in position) element.style.bottom = position.bottom + 'px'
    if ("right" in position) element.style.right = position.right + 'px'
    return
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
  if (align === "left") element.style.left = positionerLeft + (position.gapX || 0) + "px"
  else if (align === "top") element.style.top = positionerTop - height + positionerHeight + (position.gapY || 0) + "px"
  else if (align === "bottom") element.style.bottom = positionerBottom + (position.gapY || 0) + "px"
  else if (align === "right") element.style.left = positionerLeft - width + positionerWidth + (position.gapX || 0) + "px"
  
  if (fin) fin.style.left = "unset"
}

module.exports = {setPosition}

},{}],40:[function(require,module,exports){
const { decode } = require("./decode")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const openStack = ({ _window, id: viewID, string = "", ...data }) => {

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
    executedActions: [],
    addresses: [],
    logs: [],
    returns: []
  }

  stack.logs.push(`# Status TYPE ID Index Action => HeadID HeadIndex HeadAction`)
  stack.logs.push(`1 Start STACK ${stack.id} ${stack.event.toUpperCase()} ${stack.string}`)

  var global = _window ? _window.global : window.global
  global.__stacks__[stack.id] = stack

  return stack
}

const clearStack = ({ stack }) => {

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack, props.event.toUpperCase())

  stack.terminated = true
  stack.addresses = []
}

const endStack = ({ _window, stack, props }) => {

  if (stack.addresses.length === 0) {

    var global = _window ? _window.global : window.global
    var logs = `%cSTACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.event}`
    stack.logs.push(`${stack.logs.length} End STACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.id} ${stack.event}`)

    // remove stack
    delete global.__stacks__[stack.id]

    // print stack
    stack.print && !stack.printed && console.log("STACK:" + stack.event, logs, "color: blue", stack, props.logs)
    stack.printed = true
    stack.status = "End"
  }
}

module.exports = { openStack, clearStack, endStack }
},{"./decode":9,"./generate":15,"./toArray":41}],41:[function(require,module,exports){
const toArray = (data) => {
  return data !== undefined ? (Array.isArray(data) ? data : [data]) : [];
}

module.exports = {toArray}

},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
module.exports = {
    toClock: (data) => {

        var timestamp, day, hr, min, sec
        if (typeof data === "number") timestamp = data
        else { 
            timestamp = data.timestamp
            day = data.day
            hr = data.hr
            min = data.min
            sec = data.sec
        }

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
},{}],44:[function(require,module,exports){
const { generate } = require("./generate")
const { replaceNbsps } = require("./replaceNbsps")

const toCode = ({ _window, id, string, e, start = "[", end = "]", ignoreReplace = true }) => {

  if (typeof string !== "string") return string
  var global = _window ? _window.global : window.global

  // text
  if (start === "'") end = "'"
  
  // ignoreReplace
  if (ignoreReplace) string = replaceNbsps(string)
    .replaceAll("[]", "__map__")
    .replaceAll(/\\'(?!['])/g, "__quote__")
    .replace(/\\\[/g, "__openSquareBracket__")
    .replace(/\\\]/g, "__closeSquareBracket__")

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
        keys[1] = toCode({ _window, id, string: keys[1], e, start, ignoreReplace: false })
      }
      keys.splice(2, 1)
      subKey = keys[1].split(end)
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) return keys.join(start)//.replaceAll("__map__", "[]")

    // text
    if (subKey[0].split("'").length > 1) subKey[0] = toCode({ _window, id, string: subKey[0], start: "'" })

    // reference
    global.__refs__[key] = { 
      id, 
      type, 
      data: subKey[0]
      .replaceAll("__map__", "[]")
      .replaceAll("__quote__", "'")
      .replace("__openSquareBracket__", "[")
      .replace("__closeSquareBracket__", "]")
    }

    var value = key
    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join(start) ? `${start}${keys.join(start)}` : ""

    string = `${before}${value}${subKey.join(end)}${after}`
  }

  if (string.split(start)[1] !== undefined && string.split(start).slice(1).join(start).length > 0) string = toCode({ _window, id, string, e, start, ignoreReplace: false })

  if (ignoreReplace) string = string
    .replaceAll("__map__", "[]")
    .replaceAll("__quote__", "'")
    .replace("__openSquareBracket__", "[")
    .replace("__closeSquareBracket__", "]")

  return string
}

module.exports = { toCode }
},{"./generate":15,"./replaceNbsps":37}],45:[function(require,module,exports){
const { addEventListener } = require("./kernel")
const { toArray } = require("./toArray")

const toEvent = ({ _window, id, string, __, lookupActions }) => {

  var view = _window ? _window.views[id] : window.views[id]

  if (view.__rendered__) addEventListener({ event: string, id, __, stack, props, lookupActions })
  else toArray(view.__controls__).push({ event: string, __, lookupActions })
  
  return "__event__"
}

module.exports = { toEvent }
},{"./kernel":29,"./toArray":41}],46:[function(require,module,exports){
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
},{}],47:[function(require,module,exports){
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
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
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
},{"vcards-js":106}],50:[function(require,module,exports){
const { toApproval } = require("./kernel")
const { clone } = require("./clone")
const { toParam } = require("./kernel")
const { toValue } = require("./kernel")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const watch = ({ lookupActions, __, string, id }) => {

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    var approved = toApproval({ id, lookupActions, stack, props, __, data: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500, watchAddress = { id: generate() }
        view[`${_watch}-watch`] = clone(toValue({ id, lookupActions, stack, props:{isValue:true}, __, data: _watch }))
        
        const myFn = async () => {
            
            var value = toValue({ id, lookupActions, stack, props, data: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, lookupActions, stack, props, data: watch.split('?')[1], object: [view], __ })
            
            // approval
            var approved = toApproval({ id, lookupActions, stack, props, data: watch.split('?')[2], __ })
            if (!approved) return
                
            // params
            if (view.await) toParam({ id, lookupActions, stack, props, data: view.await.join(';'), __ })
        }

        view.__timers__.push(setInterval(myFn, timer))
    })
}

module.exports = { watch }
},{"./clone":3,"./generate":15,"./isEqual":25,"./kernel":29,"./toCode":44}],51:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],52:[function(require,module,exports){

},{}],53:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":54,"get-intrinsic":64}],54:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":63,"get-intrinsic":64}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
(function (process){(function (){
const fs = require('fs')
const path = require('path')
const os = require('os')
const packageJson = require('../package.json')

const version = packageJson.version

const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

// Parser src into an Object
function parse (src) {
  const obj = {}

  // Convert buffer to string
  let lines = src.toString()

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/mg, '\n')

  let match
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]

    // Default undefined or null to empty string
    let value = (match[2] || '')

    // Remove whitespace
    value = value.trim()

    // Check if double quoted
    const maybeQuote = value[0]

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // Add to object
    obj[key] = value
  }

  return obj
}

function _log (message) {
  console.log(`[dotenv@${version}][DEBUG] ${message}`)
}

function _resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  const debug = Boolean(options && options.debug)
  const override = Boolean(options && options.override)

  if (options) {
    if (options.path != null) {
      dotenvPath = _resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
  }

  try {
    // Specifying an encoding returns a string instead of a buffer
    const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }))

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else {
        if (override === true) {
          process.env[key] = parsed[key]
        }

        if (debug) {
          if (override === true) {
            _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`)
          } else {
            _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`)
          }
        }
      }
    })

    return { parsed }
  } catch (e) {
    if (debug) {
      _log(`Failed to load ${dotenvPath} ${e.message}`)
    }

    return { error: e }
  }
}

const DotenvModule = {
  config,
  parse
}

module.exports.config = DotenvModule.config
module.exports.parse = DotenvModule.parse
module.exports = DotenvModule

}).call(this)}).call(this,require('_process'))
},{"../package.json":57,"_process":75,"fs":52,"os":73,"path":74}],57:[function(require,module,exports){
module.exports={
  "name": "dotenv",
  "version": "16.0.3",
  "description": "Loads environment variables from .env file",
  "main": "lib/main.js",
  "types": "lib/main.d.ts",
  "exports": {
    ".": {
      "require": "./lib/main.js",
      "types": "./lib/main.d.ts",
      "default": "./lib/main.js"
    },
    "./config": "./config.js",
    "./config.js": "./config.js",
    "./lib/env-options": "./lib/env-options.js",
    "./lib/env-options.js": "./lib/env-options.js",
    "./lib/cli-options": "./lib/cli-options.js",
    "./lib/cli-options.js": "./lib/cli-options.js",
    "./package.json": "./package.json"
  },
  "scripts": {
    "dts-check": "tsc --project tests/types/tsconfig.json",
    "lint": "standard",
    "lint-readme": "standard-markdown",
    "pretest": "npm run lint && npm run dts-check",
    "test": "tap tests/*.js --100 -Rspec",
    "prerelease": "npm test",
    "release": "standard-version"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/motdotla/dotenv.git"
  },
  "keywords": [
    "dotenv",
    "env",
    ".env",
    "environment",
    "variables",
    "config",
    "settings"
  ],
  "readmeFilename": "README.md",
  "license": "BSD-2-Clause",
  "devDependencies": {
    "@types/node": "^17.0.9",
    "decache": "^4.6.1",
    "dtslint": "^3.7.0",
    "sinon": "^12.0.1",
    "standard": "^16.0.4",
    "standard-markdown": "^7.1.0",
    "standard-version": "^9.3.2",
    "tap": "^15.1.6",
    "tar": "^6.1.11",
    "typescript": "^4.5.4"
  },
  "engines": {
    "node": ">=12"
  }
}

},{}],58:[function(require,module,exports){
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
},{}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":64}],61:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],62:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],63:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":62}],64:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":63,"has":68,"has-symbols":65}],65:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":66}],66:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],67:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":66}],68:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":63}],69:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],70:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":53,"has-tostringtag/shams":67}],71:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":67}],72:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":51,"call-bind/callBound":53,"es-abstract/helpers/getOwnPropertyDescriptor":60,"foreach":61,"has-tostringtag/shams":67}],73:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],74:[function(require,module,exports){
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
},{"_process":75}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){

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

},{"./can-promise":77,"./core/qrcode":93,"./renderer/canvas":100,"./renderer/svg-tag.js":101}],77:[function(require,module,exports){
// can-promise has a crash in some versions of react native that dont have
// standard global objects
// https://github.com/soldair/node-qrcode/issues/157

module.exports = function () {
  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
}

},{}],78:[function(require,module,exports){
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

},{"./utils":97}],79:[function(require,module,exports){
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

},{"./mode":90}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

},{"./mode":90,"encode-utf8":59}],83:[function(require,module,exports){
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

},{"./error-correction-level":84}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
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

},{"./utils":97}],86:[function(require,module,exports){
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

},{"./utils":97}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
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

},{"./mode":90,"./utils":97}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{"./regex":95,"./version-check":98}],91:[function(require,module,exports){
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

},{"./mode":90}],92:[function(require,module,exports){
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

},{"./galois-field":87}],93:[function(require,module,exports){
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

},{"./alignment-pattern":78,"./bit-buffer":80,"./bit-matrix":81,"./error-correction-code":83,"./error-correction-level":84,"./finder-pattern":85,"./format-info":86,"./mask-pattern":89,"./mode":90,"./reed-solomon-encoder":94,"./segments":96,"./utils":97,"./version":99}],94:[function(require,module,exports){
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

},{"./polynomial":92}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
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

},{"./alphanumeric-data":79,"./byte-data":82,"./kanji-data":88,"./mode":90,"./numeric-data":91,"./regex":95,"./utils":97,"dijkstrajs":55}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValid = function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}

},{}],99:[function(require,module,exports){
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

},{"./error-correction-code":83,"./error-correction-level":84,"./mode":90,"./utils":97,"./version-check":98}],100:[function(require,module,exports){
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

},{"./utils":102}],101:[function(require,module,exports){
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

},{"./utils":102}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],104:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":70,"is-generator-function":71,"is-typed-array":72,"which-typed-array":108}],105:[function(require,module,exports){
(function (process){(function (){
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

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').slice(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.slice(1, -1);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":103,"./support/types":104,"_process":75,"inherits":69}],106:[function(require,module,exports){
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

},{"./lib/vCardFormatter":107,"fs":52,"path":74}],107:[function(require,module,exports){
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
},{}],108:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":51,"call-bind/callBound":53,"es-abstract/helpers/getOwnPropertyDescriptor":60,"foreach":61,"has-tostringtag/shams":67,"is-typed-array":72}],109:[function(require,module,exports){
const { jsonToBracket } = require('../functions/jsonToBracket')
const { override } = require('../functions/merge')
const { clone } = require('../functions/clone')
const { generate } = require('../functions/generate')
const { toArray } = require('../functions/toArray')

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

  
  // class
  component.class = component.class || ""

  // id
  component.id = component.id || generate()

  // style
  component.style = component.style || {}

  // controls
  component.controls = toArray(component.controls)

  // children
  component.children = toArray(component.children)

  // model
  if (!component.model || component.classic) component.model = "classic"
  if (component.featured) component.model = "featured"

  // component
  component.component = true

  var {
    id, input, model, droplist, readonly, style, __controls__, duplicated, duration, required, preventDefault,
    placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, __labeled__, __childIndex__,
    duplicatable, lang, unit, currency, google, key, minlength, children, container, generator, __templated__, type, text
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
    duplicatable, lang, unit, currency, google, key, minlength, children, container, generator, __templated__, type
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
          "view": `Text?id=${id}_label;text='${text || "Label"}';${required ? "required=true;" : ""}style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)}`,
          "__controls__": [{
            "event": "click?parent().input().focus()"
          }]
        },
        Input({ ...component, component: true, __labeled__: id, __parent__: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
        {
          "view": `View:${id}-required?class=flex gap-1;style:[alignItems=center;opacity=${required && required.style && required.style.opacity || "0"};transition=.2s]?${required ? true : false};false`,
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
        class: `${component.class.includes("ar") ? "ar " : ""}${component.class || ""}${readonly?" pointer":""}`,
        input,
        currency,
        day,
        type,
        unit,
        key,
        lang,
        google,
        text,
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
        view: `Icon:${id}-clear?class=pointer;name=bi-x;style:[position=absolute;if():[language:()=ar]:[left=[[6.5?${type==="date"}?4]?parent().password?[2.5?${type==="date"}?0.5]]+'rem']:[right=[[6.5?${type==="date"}?4]?parent().password?[2.5?${type==="date"}?0.5]]+'rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[parent().clearable;prev().txt()]:[prev().data().del();prev().txt()=;#prev().focus()].elif():[parent().removable;if():[parent().clearable]:[!prev().txt()]:true;doc():[path=path().slice():0:-1].len()>1]:[parent().rem()]]?parent().clearable||parent().removable||parent().duplicatable`,
      }, {
        view: `Icon:${id}-duplicate?class=pointer duplicater;name=bi-plus;style:[position=absolute;if():[language:()=ar]:[left=if():[parent().password]:'5.5rem':'3rem']:[right=if():[parent().password]:'5.5rem':'3rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[!parent().max||parent().max>2ndParent().class():duplicater.len()]:[doc():[path=path().slice():0:'-1'].push():[if():[data().type()=number]:0:''];2ndParent().update()::[class():duplicater.lastEl().2ndPrev().focus()]]]?parent().duplicatable`,
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
},{"../functions/clone":3,"../functions/generate":15,"../functions/jsonToBracket":28,"../functions/merge":32,"../functions/toArray":41}],110:[function(require,module,exports){
module.exports = (view) => {

  var AutorunScrollInPixel = `[px():[().autorun.scroll]||100]`
  var toScrollWidth = `[${AutorunScrollInPixel}-().scroll%${AutorunScrollInPixel}||${AutorunScrollInPixel}]`
  var autorunInterval = `mytimer=interval():[().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transform='translateX('+().scroll+'px)']:[().autorun.timer||100]`
  var loadedActions = `loaded:[scrollable=el().scrollWidth-parent().el().clientWidth;if():[autorun]:[${autorunInterval}]]`
  var mouseenterActions = `mouseenter:[clearTimer():[().mytimer]]`
  var mouseleaveActions = `mouseleave:[if():[!mousedn]:[style().transition=[().style.transition||.2s];${autorunInterval}]]`
  var mousedownActions = `mousedown:[mousedn=true;style().transition=null;mouseposition=e().screenX;scrollLeft=().scroll]`
  var bodyMousemoveActions = `():body.mousemove:[if():[mousedn]:[scroll=().scrollLeft+e().screenX-().mouseposition;if():[scroll<0]:[().scroll=0].elif():[scroll>().scrollable]:[().scroll=().scrollable];style().transform='translateX('+[().scroll]+'px)']]`
  var touchstartActions = `touchstart:[clearTimer():[().mytimer];touchst=true;style().transition=null;mouseposition=e().changedTouches.0.screenX;scrollLeft=().scroll]`
  var touchmoveActions = `touchmove:[if():[touchst]:[scroll=().scrollLeft+e().changedTouches.0.screenX-().mouseposition;if():[scroll<0]:[().scroll=0].elif():[scroll>().scrollable]:[().scroll=().scrollable];style().transform='translateX('+[().scroll]+'px)']]`
  var touchendActions = `touchend:[if():[touchst]:[touchst=false;if():[autorun]:[mytimer=interval():[().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)']:[().autorun.timer||100]];().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)';().scrollLeft=().scroll]]`
  var bodyMouseupActions = `():body.mouseup:[if():[mousedn]:[mousedn=false;if():[autorun;!mouseentered]:[mytimer=interval():[().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)']:[().autorun.timer||100]];().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)';().scrollLeft=().scroll]]`
  return {
    ...view,
    view: `View?style:[display=flex;alignItems=if():[().style.alignItems]:[().style.alignItems]:center;if():[vertical]:[flexDirection=column]];scrollLeft=0;scroll=0;${loadedActions};if():[autorun]:[${mouseenterActions};${mouseleaveActions}];${mousedownActions};${bodyMousemoveActions};${bodyMouseupActions};${touchstartActions};${touchmoveActions};${touchendActions}`,
  }
}
},{}],111:[function(require,module,exports){
module.exports = (view) => {
  return {
    ...view,
    view: `View?class='hide-scrollbar '+if():[().class]:[().class]:'';style:[display=if():[().style.display]:[().style.display]:flex;alignItems=if():[().style.alignItems]:[().style.alignItems]:center;position=if():[().style.position]:[().style.position]:relative;overflowX=if():[().style.overflowX]:[().style.overflowX]:hidden]`,
  }
}
},{}],112:[function(require,module,exports){
const { jsonToBracket } = require("../functions/jsonToBracket")

module.exports = (component) => {

  var { icon, pin, controls, style } = component

  pin = pin || {}
  icon = icon || {}
  icon.on = icon.on || {}
  icon.off = icon.off || {}

  return {
    ...component,
    view: `View?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${jsonToBracket({ style })}`,
    children: [{
      view: `View?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${jsonToBracket(pin)}`,
      children: [{
          view: `Icon?style.color=red;style.fontSize=1.8rem;style.position=absolute;style.transition=.3s;${jsonToBracket(icon.off)}?[${icon.off.name}]`
        }, {
          view: `Icon?style.color=blue;style.fontSize=1.3rem;style.position=absolute;style.opacity=0;style.transition=.3s;${jsonToBracket(icon.on)}?[${icon.on.name}]`
        }]
    }],
    __controls__: [{
        event: "click?().el().checked=[true].if().[().el().checked.notexist()].else().[false];().checked=().el().checked;().1stChild().el().style.left=[calc(100% - 2.3rem)].if().[().el().checked].else().[0.3rem];().1stChild().1stChild().el().style.opacity=[0].if().[().el().checked].else().[1];().1stChild().2ndChild().el().style.opacity=[1].if().[().el().checked].else().[0]"
      },
      ...controls
    ]
  }
}

},{"../functions/jsonToBracket":28}],113:[function(require,module,exports){
module.exports = {
  Input : require("./Input"),
  Switch : require("./Switch"),
  Swiper : require("./Swiper"),
  SwiperWrapper : require("./SwiperWrapper")
}
},{"./Input":109,"./Swiper":110,"./SwiperWrapper":111,"./Switch":112}]},{},[21]);
