(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// navigator.serviceWorker.register("/resources/dummy-sw.js")

//const myWorker = new Worker('worker.js')
//myWorker.terminate()

const { starter } = require("../function/starter")
const { setElement } = require("../function/setElement")
const { toParam } = require("../function/toParam")
const { toApproval } = require("../function/toApproval")
const { execute } = require("../function/execute")
const { toCode } = require("../function/toCode")
const { setData } = require("../function/setData")
// const downloadsFolder = require('downloads-folder')

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

// navigator.serviceWorker.register('sw.js')
//
var views = window.views
var global = window.global

// access key
// document.cookie = "s_id=" + global.session.id + ";" + global.session["expiry-date"] + ";path=/"
global["body-click-events"] = {}
global["body-mousemove-events"] = {}
global["body-mousedown-events"] = {}
global["body-mouseup-events"] = {}
global["before-print-events"] = {}
global["after-print-events"] = {}
global["click-events"] = []
global["key-events"] = []

//views.document = document
document.element = document
views.body.element = document.body

// lunch arabic text
var _ar = document.createElement("P")
_ar.innerHTML = "مرحبا"
_ar.classList.add("ar")
_ar.style.position = "absolute"
_ar.style.top = "-1000px"
views.body.element.appendChild(_ar)

//history.pushState(null, global.data.page[global.currentPage].title, global.path)
//document.title = global.data.page[global.currentPage].title

window.onfocus = () => {
    
    global["click-events"] = []
    global["key-events"] = []
    views.root.element.click()
    document.activeElement.blur()
    toParam({ id: "root", string: "():mininote.style():[opacity=0;transform=scale(0)]" })
}
//console.log(downloadsFolder())
// body clicked
var bodyEventListener = async ({ id, viewEventConditions, viewEventParams, events, once, controls, index, event }, e) => {
    
    if (!views[id]) return
    var view = views[id]
    e.target = views[id].element
    
    // approval
    if (viewEventConditions) {
        var approved = toApproval({ string: viewEventConditions, id, e })
        if (!approved) return
    }

    // approval
    if (events[2]) {
        var approved = toApproval({ string: events[2], id, e })
        if (!approved) return
    }

    // once
    if (once) window.global[`body-${event}-events`][id].splice(index, 1)
    
    // params
    await toParam({ string: events[1], id, mount: true, e })
    
    // approval
    if (viewEventParams) await toParam({ string: viewEventParams, id, mount: true, e })

    // break
    if (view["break()"]) delete view["break()"]
    if (view["return()"]) return delete view["return()"]
    
    // execute
    if (controls.actions || controls.action) await execute({ controls, id, e })
}

// clicked element
document.body.addEventListener('click', e => {
  
  var global = window.global
  
  global["key-events"] = []
  global["clicked"] = views[((e || window.event).target||e.currentTarget).id]
  global["clickedElement"] = (e || window.event).target||e.currentTarget
  global["html"] = global.clickedElement.innerHTML.replace("&amp;", "&")
  global["txt"] = (global.clickedElement.textContent === undefined ? global.clickedElement.innerText : global.clickedElement.textContent).replace("&amp;", "&")

  // droplist
  if (global.clickedElement.id === "droplist") delete global["droplist-item-clicked"]
  else if (views.droplist.element.contains(global.clickedElement)) {
      global["droplist-item-clicked"] = global["droplist-item"] = global.clickedElement
      global["droplist-item-txt"] = global["droplist-txt"] = global.clickedElement.innerHTML.replace("&amp;", "&")
  }

  // actionlist
  else if (global.clickedElement.id === "actionlist") delete global["actionlist-item-clicked"]
  else if (views.droplist.element.contains(global.clickedElement)) {
      global["actionlist-item-clicked"] = global["actionlist-item"] = global.clickedElement
      global["actionlist-item-txt"] = global["actionlist-txt"] = global.clickedElement.innerHTML
  }
  
  // body event listeners
  Object.values(global["body-click-events"]).flat().map(o => bodyEventListener(o, e))

  // click events
  global["click-events"].map(o => bodyEventListener(o, e))
  global["click-events"] = []

})

// mousemove
document.body.addEventListener('mousemove', (e) => {

  global.mousePosX = e.screenX
  global.mousePosY = e.screenY
  Object.values(window.global["body-mousemove-events"]).flat().map(o => bodyEventListener(o, e))
  /*currentTime = (new Date()).getTime()
  // if (currentTime - lastVisit > 3600000 && global.data.page[global.currentPage]["recaptcha-required"]) 
  lastVisit = currentTime*/
})

document.body.addEventListener("mousedown", (e) => {

  var global = window.global, views = window.views
  global.mousedown = true
  global["clicked"] = views[((e || window.event).target||e.currentTarget).id]
  global["clickedElement"] = (e || window.event).target||e.currentTarget
  
  Object.values(global["body-mousedown-events"]).flat().map(o => bodyEventListener(o, e))
})

document.body.addEventListener("mouseup", (e) => {

  var global = window.global
  global.mousedown = false
  Object.values(global["body-mouseup-events"]).flat().map(o => bodyEventListener(o, e))
})

document.addEventListener('keydown', e => {
    if (e.ctrlKey) global.ctrlKey = true
    if (global.projectId === "brackettechnologies" && e.ctrlKey && e.key === "s") {
        e.preventDefault();
        toParam({ id: "saveBtn", e, string: "click()" })
    }
    if (global.projectId === "brackettechnologies" && e.ctrlKey && e.shiftKey && e.key === "Delete") {
        e.preventDefault();
    }
})

document.addEventListener('keyup', e => {
    if (!e.ctrlKey) global.ctrlKey = false
    
    // key events
    global["click-events"] = []
    global["key-events"].map(o => bodyEventListener(o, e))
    global["key-events"] = []
})

// default global mode
global.mode = global["default-mode"] = global["default-mode"] || "Light"
global.idList.map(id => setElement({ id }))
global.idList.map(id => starter({ id }))

// show icons
var icons = global.idList.filter(id => views[id] && views[id].type === "Icon").map(id => views[id])
window.onload = () => {
    icons.map(view => {
        if (view.element) {
            view.element.style.opacity = view.style.opacity !== undefined ? view.style.opacity : "1"
            view.element.style.transition = view.style.transition !== undefined ? view.style.transition : "none"
        }
    })
}

delete global.idList

window.onmousedown = (e) => {
    // e.preventDefault()
    
    var global = window.global
    global["clickedElement()"] = views[(e || window.event).target.id]
    global.clickedElement = (e || window.event).target
}

Object.entries(views).map(([id, views]) => {
    if (views.status === "Loading") delete views[id]
})

document.addEventListener('scroll', () => {
    
    // close droplist
    if (views.droplist.element.style.pointerEvents === "auto") {
        
        var closeDroplist = toCode({ string: "if():[!():droplist.mouseentered]:[():droplist.mouseleave()]" })
        toParam({ string: closeDroplist, id: "droplist" })
    }
}, true)

window.addEventListener("keydown", function(e) {
  if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault()
  }
}, false)
// unloaded views
// require("../function/loadViews").loadViews(true)
// new Promise(res => require("../function/loadViews").loadViews(res)).then(() => {})

window.addEventListener('beforeinstallprompt', function (e) {

  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault()
  console.log('👍', 'beforeinstallprompt', e);
  
  // Stash the event so it can be triggered later.
  window.global["installApp"] = e
  //setTimeout(() => { console.log(window.global["installApp"]); window.global["installApp"].prompt() }, 1000)
})

window.addEventListener('appinstalled', () => {
  // Log install to analytics
  console.log('INSTALL: Success')
})

/*if (window.location.protocol === 'http:') {

  const requireHTTPS = document.getElementById('requireHTTPS');
  const link = requireHTTPS.querySelector('a');
  link.href = window.location.href.replace('http://', 'https://');
  requireHTTPS.classList.remove('hidden');
}*/
},{"../function/execute":63,"../function/setData":106,"../function/setElement":107,"../function/starter":110,"../function/toApproval":115,"../function/toCode":120,"../function/toParam":130}],2:[function(require,module,exports){
const { clone } = require('../function/clone')
const { toComponent } = require('../function/toComponent')
const { jsonToBracket } = require('../function/jsonToBracket')

module.exports = (view) => {

  var path = clone(view.path)
  delete view.path
  view = toComponent(view)
  var { icon, box, label, style, checked, model2, text, value, required, group = {} } = view
  label = label || {}
  icon = icon || {}
  box = box || {}

  if (typeof checked === "string" || typeof checked === "boolean") checked = { checked: true }
  else if (typeof checked !== "object") checked = {}
  box.checked = box.checked || checked.box || {}
  icon.checked = icon.checked || checked.icon || {}
  label.checked = label.checked || checked.label || {}
  if (checked.checked) box.checked.checked = icon.checked.checked = label.checked.checked = true
  if (model2) model2 = true
  else model2 = false

  // text
  if (text !== undefined) label.text = text
  text = label.text || ""
  value = value !== undefined ? value : (label.value !== undefined ? label.value : text)
  delete label.text

  if (typeof group === "string" || typeof group === "number") group = { state: group }
  if (group.id) group.state = group.id
  if (!group.multiple) group.multiple = false
  else group.multiple = true
  if (required) group.required = true
  
  return {
    ...view, path, group,
    "view": `View?class=flex align-center;style:[gap=1.5rem];${jsonToBracket(style)}`,
    "children": [
      {
        "view": `View:${view.id}-box?${jsonToBracket(box)};if():[parent().group.state]:[CHECKBOX_STATE:().${group.state}.clicked=_list];if():[${group.multiple};!data()]:[data()=_list];class=flexbox pointer +${box.class||""};style:[height=[().style.height||2rem];width=[().style.width||2rem];position=[().style.position||relative];borderRadius=[().style.borderRadius||.35rem];transition=[().style.transition||.1s]];if():${model2}:[checked.style:[backgroundColor=[().checked.style.backgroundColor||#fff];border=[().checked.style.border||1px solid #ccc]]];style:[backgroundColor=if():[checked.checked]:[().checked.style.backgroundColor||'#2C6ECB']:[().style.backgroundColor||'#fff'];border=if():[checked.checked]:[().checked.style.border||'1px solid #ffffff00']:[().style.border||'1px solid #ccc']]`,
        "children": [{
          "view": `Icon:${view.id}-icon?name=check;google.symbol;${jsonToBracket(icon)};style:[position=[().style.position||absolute];color=[().style.color||#fff];transition=[().style.transition||.1s]];if():${model2}:[style:[fontSize=[().style.fontSize||3.5rem];left=[().style.left||'-.5rem'];bottom=[().style.bottom||'-.5rem']];checked.style.color=[().checked.style.bottom||blue]]:[style.fontSize=[().style.fontSize||1.8rem]];style:[opacity=if():[checked.checked]:1:0]`
        }],
        "controls": [{
          "event": `click?if():[parent().group.state;${!group.multiple};CHECKBOX_STATE:().${group.state}.clicked.0;if():[parent().required||parent().group.required]:true:[CHECKBOX_STATE:().${group.state}.clicked.0!=().id]]:[clickedItem=CHECKBOX_STATE:().${group.state}.clicked.0;CHECKBOX_STATE:().${group.state}.clicked.pull():0;():[().clickedItem]._():[_.checked.checked=false;_.child()._():[_.style().opacity=0;_.checked.style._():[__.style()._=[__.style._||null]]];if():${!group.multiple}:[_.data().del()]:[_.data().pullItem():[_.next().value]];_.style():[backgroundColor=#fff;border=1px solid #ccc];_.checked.style._():[__.style()._=[__.style._||null]]]];if():[!checked.checked]:[checked.checked=true;if():[parent().group.state]:[CHECKBOX_STATE:().${group.state}.clicked.push():[().id]];child()._():[_.style().opacity=1;_.style():[_.checked.style]];if():${!group.multiple}:[data()=next().value]:[data().replaceItem():[next().value]];style():[backgroundColor=#2C6ECB;border=1px solid #ffffff00];style():[().checked.style]]:[if():[[parent().group.required;data().len()>[parent().group.min||1]]||!parent().group.required]:[checked.checked=false;CHECKBOX_STATE:().${group.state}.clicked.pullItem():[().id];child()._():[_.style().opacity=0;_.checked.style._():[__.style()._=[__.style._||null]]];if():[parent().group.state]:[${!group.multiple}:[data().del()]:[data().pullItem():[next().value]]];style():[backgroundColor=#fff;border=1px solid #ccc];().checked.style._():[style()._=[().style._||null]]]]?parent().group.state`
        },
        {
          "event": `loaded?if():${group.multiple}:[if():[data().inc():[next().value]]:click()]:[if():[[parent().boolean;data()]||data()=next().value]:click()]`
        }, 
        {
          "event": `click?if():[checked.checked=true]:[data()=false;checked.checked=false;child()._():[_.style().opacity=0;_.checked.style._():[__.style()._=[__.style._||null]]];style():[backgroundColor=#fff;border=1px solid #ccc];checked.style._():[__.style()._=[__.style._||null]]]:[data()=true;checked.checked=true;child()._():[_.style().opacity=1;_.style():[_.checked.style]];style():[backgroundColor=#2C6ECB;border=1px solid #ffffff00];style():[().checked.style]]?!parent().group.state;parent().boolean`
        }]
      },
      {
        "view": `Text:${view.id}-label?${jsonToBracket(label)};style:[fontSize=[().style.fontSize||1.6rem];width=[().style.width||fit-content];cursor=[().style.cursor||pointer]]`,
        text, value,
        "controls": [{
          "event": "click?prev().click()"
        }]
      }
    ]
  }
}
},{"../function/clone":42,"../function/jsonToBracket":83,"../function/toComponent":121}],3:[function(require,module,exports){
module.exports = (view) => {
  var scrollWidth = `[px():[().swiper.scroll]||100]`
  var clickLeft = `():[().swiper.id]._():[clearTimer():[_.mytimer];_.scroll+=[${scrollWidth}-_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll>_.scrollable]:[_.scroll=0];_.style().transform='translateX('+_.scroll+'px)';if():[_.autorun]:[_.mytimer=interval():[_.scroll+=[${scrollWidth}-_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll>_.scrollable]:[_.scroll=0];_.style().transform='translateX('+_.scroll+'px)']:[_.autorun.timer||100]]]`
  var clickRight = `():[().swiper.id]._():[clearTimer():[_.mytimer];_.scroll-=[_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll<0]:[_.scroll=_.scrollable];_.style().transform='translateX('+_.scroll+'px)';if():[_.autorun]:[_.mytimer=interval():[_.scroll+=[${scrollWidth}-_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll>_.scrollable]:[_.scroll=0];_.style().transform='translateX('+_.scroll+'px)']:[_.autorun.timer||100]]]`
  return {
    ...view,
    view: `Icon?class='flexbox pointer '+[().class||];name=if():[direction=right]:'bi-chevron-right'.elif():[direction=left]:'bi-chevron-left';style:[fontSize=[().style.fontSize||2.5rem];if():[().direction=left]:[left=[().style.left||0]].elif():[().direction=right]:[right=[().style.right||0]]];click:[if():[direction=left;swiper.id]:[${clickLeft}].elif():[direction=right;swiper.id]:[${clickRight}]]`
  }
}
},{}],4:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')
const { jsonToBracket } = require('../function/jsonToBracket')
const { override } = require('../function/merge')
const { clone } = require('../function/clone')
const { generate } = require('../function/generate')

const Input = (component) => {

    if (component.templated) return component

    component.hover = component.hover || {}
    component.style = component.style || {}
    component.hover.style = component.hover.style || {}
    component.style.after = component.style.after || {}

    // container
    component.container = component.container || {}

    // icon
    component.icon = component.icon || {}
    component.icon.style = component.icon.style || {}
    component.icon.hover = component.icon.hover || {}
    component.icon.hover.style = component.icon.hover.style || {}
    component.icon.style.after = component.icon.style.after || {}

    // input
    component.input = component.input || {}
    component.input.hover = component.input.hover || {}
    component.input.type = component.password && "password" || component.input.type || 'text'
    component.input.style = component.input.style || {}
    component.input.hover.style = component.input.hover.style || {}
    component.input.style.after = component.input.style.after || {}

    // required
    if (component.required) component.required = typeof component.required === "object" ? component.required : {}
    
    component = toComponent(component)

    var {
      id, input, model, droplist, readonly, style, controls, duplicated, duration, required, preventDefault,
      placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, labeled,
      duplicatable, lang, unit, currency, google, key, minlength , children, container, generator,
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
      ...component, id, input, model, droplist, readonly, style, controls, duplicated, duration, required, preventDefault,
      placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, labeled,
      duplicatable, lang, unit, currency, google, key, minlength , children, container, generator
    }
    
    if (duplicatable) {
      component.removable = true
      removable = true 
    }

    if (label && (label.location === "inside" || label.position === "inside")) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var password = component.password && true
        var text = label.text
        id = id || generate()
        component.controls = component.controls || []
        
        delete component.parent
        delete component.label
        delete component.path
        delete component.id
        delete component.password
        delete component.derivations
        delete label.text

        return {
            id, path, Data, parent, derivations, tooltip: component.tooltip, islabel: true, preventDefault,
            "type": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=${component.style.width||"100%"};style.maxWidth=${component.style.maxWidth||"100%"};${jsonToBracket(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                  "type": `Text?id=${id}-label;text='${text || "Label"}';if():[parent().required]:[required=true];style.fontSize=1.1rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)}`,
                  "controls": [{
                    "event": "click?parent().input().focus()"
                  }]
                }, Input({ ...component, component: true, labeled: id, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
                ]
            }, {
                "type": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${jsonToBracket(password)}?${password}`,
                "children": [{
                    "type": `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?parent().prev().getInput().element.type=text;next().style().display=flex;style().display=none"
                    }]
                }, {
                    "type": `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?parent().prev().getInput().element.type=password;prev().style().display=flex;style().display=none"
                    }]
                }]
            }],
            "controls": [{
                "event": "click:body?style().border=if():[clicked:().outside():[().element]]:[1px solid #ccc]:[2px solid #008060]?!contains():[clicked:()];!droplist.contains():[clicked:()]"
            }, {
                "event": "click?getInput().focus()?!getInput().focus"
            }]
        }
    }
    
    if ((label && (label.location === "outside" || label.position === "outside")) || label) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var tooltip = component.tooltip
        var text = label.text
        id = id || generate()
        //var clickedBorder = component.clicked && component.clicked.style.border
        component.controls = component.controls || []

        /*if (component.clicked) {
          component.clicked.preventDefault = true
          if (component.clicked.style.border) delete component.clicked
        }*/
        
        delete component.label
        delete component.path
        delete component.id
        delete component.tooltip
        delete component.required
        delete label.text
        label.tooltip = tooltip
        
        return {
          id, Data, parent, derivations, path, islabel: true, preventDefault,
          "type": `View?class=flex start column;style.gap=.5rem;style.width=${component.style.width ||"100%"};style.maxWidth=${component.style.maxWidth ||"100%"};${jsonToBracket(container)}`,
          "children": [
            {
              "type": `Text?id=${id}-label;text='${text || "Label"}';${required ? "required=true": ""};style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)}`,
              "controls": [{
                "event": "click?parent().input().focus()"
              }]
            },
              Input({ ...component, component: true, labeled: id, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
            {
              "type": `View:${id}-required?class=flex gap-1;style:[alignItems=center;opacity=${required && required.style && required.style.opacity || "0"};transition=.2s]?${required ? true : false}`,
              "children": [{
                "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
              }, {
                "type": `Text?text=${required && required.text || "Required blank"};style.color=#D72C0D;style.fontSize=1.3rem;${jsonToBracket(required)}`
              }]
            }
          ],
          /*"controls": [{
            "event": `click:1stChild();click:[if():[${duplicatable?true:false}]:[2ndChild().children()]:2ndChild()]?clicked=true;if():[!${duplicatable?true:false}]:[2ndChild().style().border=${clickedBorder}]:[2ndChild().lastChild().style().border=${clickedBorder}]?!mobile();${clickedBorder?true:false}`
          }, {
            "event": `click:body?clicked=false;if():[${duplicatable?true:false}]:[2ndChild().children().():[style().border=${style.border || "1px solid #ccc"}]]:[2ndChild().style().border=${style.border || "1px solid #ccc"}]?${clickedBorder?true:false};!mobile();!contains():[clicked:()];!droplist.contains():[clicked:()]`
          }]*/
        }
    }

    if (model === 'featured' || password || clearable || removable || duplicatable || copyable || generator) {

      delete component.type
      
      return {
            ...component,
            view: "View",
            class: `flex align-items-center unselectable ${component.class || ""}`,
            // remove from comp
            controls: [{
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
            children: [...children, { // message
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
                labeled,
                placeholder,
                duplicated,
                disabled,
                duplicatable,
                preventDefault,
                templated: true,
                'placeholder-ar': component['placeholer-ar'],
                /*hover: {
                    ...input.hover,
                    style: {
                        backgroundColor: style.after.backgroundColor,
                        color: style.after.color || style.color,
                        ...input.style.after,
                        ...input.hover.style
                    }
                },*/
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
                controls: [...controls, {
                    event: `clickfocus;keyfocus?if():[labeled]:[if():[!():${labeled}.contains():[clicked:()]]:[if():${duplicatable?true:false}:[parent().click()]:[2ndChild().click()]]]:[if():[!():${id}.contains():[clicked:()]]:[click():[__droplistPositioner__:().del();]]]?!preventDefault`
                }, /*{
                    event: `clickfocus;keyfocus?parent().clicked.mount;parent().clicked.style.keys()._():[parent().style()._=parent()..clicked.style._];state:().[parent().clicked.state]=parent().id?parent().clicked`
                }, */{
                    event: `blur?():body.click()`
                }, {
                    event: "select;mousedown?preventDefault()"
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
                    controls: [{
                        event: "click?parent().prev().element.type=text;next().style().display=flex;style().display=none"
                    }]
                }, {
                  view: `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?parent().prev().element.type=password;prev().style().display=flex;style().display=none"
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
        },
        controls: [...controls, {
          event: `clickfocus;keyfocus?clicked.mount;clicked.style.keys()._():[().style()._=().clicked.style._];state:().[().clicked.state]=().id`
        }, {
          event: `blur?if():[state:().[().clicked.state]]:[():[state:().[().clicked.state]]._():[_.clicked.mount.del();_.clicked.style.keys()._():[__.style()._=[__.style._||null]]]]`
        }]
      }
    }
}

module.exports = Input
},{"../function/clone":42,"../function/generate":70,"../function/jsonToBracket":83,"../function/merge":88,"../function/toComponent":121}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
module.exports = (view) => {
  return {
    ...view,
    view: `View?class='hide-scrollbar '+if():[().class]:[().class]:'';style:[display=if():[().style.display]:[().style.display]:flex;alignItems=if():[().style.alignItems]:[().style.alignItems]:center;position=if():[().style.position]:[().style.position]:relative;overflowX=if():[().style.overflowX]:[().style.overflowX]:hidden]`,
  }
}
},{}],7:[function(require,module,exports){
const { toComponent } = require("../function/toComponent")
const { jsonToBracket } = require("../function/jsonToBracket")

module.exports = (component) => {

  var { icon, pin, controls, style } = toComponent(component)

  pin = pin || {}
  icon = icon || {}
  icon.on = icon.on || {}
  icon.off = icon.off || {}

  return {
    ...component,
    type: `Box?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${jsonToBracket({ style })}`,
    children: [{
      type: `Box?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${jsonToBracket(pin)}`,
      children: [{
          type: `Icon?style.color=red;style.fontSize=1.8rem;style.position=absolute;style.transition=.3s;${jsonToBracket(icon.off)}?[${icon.off.name}]`
        }, {
          type: `Icon?style.color=blue;style.fontSize=1.3rem;style.position=absolute;style.opacity=0;style.transition=.3s;${jsonToBracket(icon.on)}?[${icon.on.name}]`
        }]
    }],
    controls: [{
        event: "click?().element.checked=[true].if().[().element.checked.notexist()].else().[false];().checked=().element.checked;().1stChild().element.style.left=[calc(100% - 2.3rem)].if().[().element.checked].else().[0.3rem];().1stChild().1stChild().element.style.opacity=[0].if().[().element.checked].else().[1];().1stChild().2ndChild().element.style.opacity=[1].if().[().element.checked].else().[0]"
      },
      ...controls
    ]
  }
}

},{"../function/jsonToBracket":83,"../function/toComponent":121}],8:[function(require,module,exports){
module.exports = {
  Input : require("./Input"),
  Switch : require("./Switch"),
  Checkbox : require("./Checkbox"),
  Swiper : require("./Swiper"),
  Chevron : require("./Chevron"),
  SwiperWrapper : require("./SwiperWrapper")
}
},{"./Checkbox":2,"./Chevron":3,"./Input":4,"./Swiper":5,"./SwiperWrapper":6,"./Switch":7}],9:[function(require,module,exports){
module.exports = ({ id, controls }) => {
    if (window.views[id].type !== "Input" && !window.views[id].editable) {
      var _input = window.views[id].element.getElementsByTagName("INPUT")
      if (_input.length > 0) id = _input[0].id
    }
    return [{
      event: `blur:${id}?${controls}??${id}`
    }]
}
},{}],10:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `change:[getInput().id]?${controls}??getInput().id`
    }]
}
},{}],11:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `click?${controls}`
    }]
}
},{}],12:[function(require,module,exports){
const { generate } = require("../function/generate");

module.exports = ({ controls, id }) => {
  var view = window.views[id];
  var _id = controls.id || id;
  if (typeof _id === "object" && _id.id) _id = _id.id;

  view.clicked.state = view.clicked.state || generate();
  view.clicked.default = view.clicked.default || { style: {} };
  view.clicked.style &&
    Object.keys(view.clicked.style).map(
      (key) =>
        (view.clicked.default.style[key] =
          view.clicked.default.style[key] !== undefined
            ? view.clicked.default.style[key]
            : view.style[key] !== undefined
            ? view.style[key]
            : null)
    );

  return [
    {
      event: `loaded:${_id}?click()?clicked.mount`,
    },
    {
      event: `click:${_id}?if():[state:().[().clicked.state]]:[():[state:().[().clicked.state]]._():[_.clicked.mount.del();_.clicked.style.keys()._():[__.style()._=[__.style._||null]]]];clicked.mount;clicked.style.keys()._():[():${_id}.style()._=().clicked.style._];state:().[().clicked.state]=${_id}?!required.mount;!clicked.disable`,
    },
    {
      event: `click:body?if():[state:().[().clicked.state]]:[():[state:().[().clicked.state]]._():[_.clicked.mount.del();_.clicked.style.keys()._():[__.style()._=[__.style._||null]]]];state:().[().clicked.state].del()?!required.mount;!clicked.disable;!clicked.sticky`,
    }
  ]
}
},{"../function/generate":70}],13:[function(require,module,exports){
module.exports = {
  item: require("./item"),
  list: require("./list"),
  popup: require("./popup"),
  droplist: require("./droplist"),
  tooltip: require("./tooltip"),
  mininote: require("./mininote"),
  pricable: require("./pricable"),
  hover: require("./hover"),
  click: require("./click"),
  focus: require("./focus"),
  blur: require("./blur"),
  change: require("./change"),
  clicked: require("./clicked"),
  mouseenter: require("./mouseenter"),
  mouseleave: require("./mouseleave"),
  mouseover: require("./mouseover"),
  mousedown: require("./mousedown"),
  mouseup: require("./mouseup"),
  keypress: require("./keypress"),
  keyup: require("./keyup"),
  scroll: require("./scroll"),
  keydown: require("./keydown"),
  loaded: require("./loaded"),
  touchstart: require("./touchstart"),
  touchend: require("./touchend"),
  touchmove: require("./touchmove"),
  touchcancel: require("./touchcancel"),
  contentful: require("../function/contentful").contentful
}
},{"../function/contentful":45,"./blur":9,"./change":10,"./click":11,"./clicked":12,"./droplist":14,"./focus":15,"./hover":16,"./item":17,"./keydown":18,"./keypress":19,"./keyup":20,"./list":21,"./loaded":22,"./mininote":23,"./mousedown":24,"./mouseenter":25,"./mouseleave":26,"./mouseover":27,"./mouseup":28,"./popup":29,"./pricable":30,"./scroll":31,"./tooltip":32,"./touchcancel":33,"./touchend":34,"./touchmove":35,"./touchstart":36}],14:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  window.views[id].droplist.id = controls.id = id = controls.id || id
  
  return [{
    event: "[keyup:input()??e().key=Escape];[blur:input()??clicked:().id!=droplist;!():droplist.contains():[clicked:()]]?clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()"
  }, {
    event: `click;[focus:input()??clicked:().id!=().id;!clicked:().contains():[input().id]]?__keyupIndex__:()=0;droplist-search-txt:().del();if():[input().txt()]:[droplist-search-txt:()=input().txt()];clearTimer():[droplist-timer:()];if():[__droplistPositioner__:()!=${id}]:[().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]];if():[__droplistPositioner__:()=${id}]:[droplist-timer:()=timer():[().droplist.style.keys()._():[():droplist.style()._=():droplist.style._||null];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform='scale(0.5)';pointerEvents=none]];__droplistPositioner__:().del()]:0];if():[__droplistPositioner__:()!=().id]:[__droplistPositioner__:()=${id};():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transition=null;pointerEvents=none]];():${id}.droplist();timer():[():droplist.position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}];().droplist.style.keys()._():[():droplist.style()._=().droplist.style._];():droplist.():[children().():[style().pointerEvents=auto];style():[transition='opacity .1s, transform .1s';opacity=1;transform='scale(1)';pointerEvents=auto]]]:0]`,
  }, {
    event: `mouseenter?clearTimer():[().droplistLeaved];if():[droplist-mouseenterer:()!=().id]:[click();droplist-mouseenterer:()=().id]?droplist.hoverable`
  }, {
    event: `mouseleave?droplistLeaved=timer():[if():[!():droplist.mouseentered;droplist-mouseenterer:()=().id;():droplist.style().opacity='1']:[click();droplist-mouseenterer:().del()]]:400?droplist.hoverable`
  }, {
    event: "input:input()?droplist-search-txt:()=input().txt()?input();droplist.searchable",
    actions: `droplist:${id}?__droplistPositioner__:()=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform='scale(1)';pointerEvents=auto]];():droplist.position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}];().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]`
  }, {
    event: `keyup:input()?if():[__droplistPositioner__:();__keyupIndex__:()]:[():droplist.children().[__keyupIndex__:()].click();().break=true;#():droplist.mouseleave()];__keyupIndex__:()=0;#if():[__droplistPositioner__:()!=2ndChild().id]:[2ndChild().click()];#timer():[():droplist.children().0.mouseenter()]:200?!():${id}.droplist.preventDefault;e().key=Enter`
  }, {
    event: `keyup:input()?():droplist.children().():mouseleave();__keyupIndex__:()=if():[e().keyCode=40]:[__keyupIndex__:()+1]:[[__keyupIndex__:()]-1];():droplist.children().[__keyupIndex__:()].mouseenter()?!():${id}.droplist.preventDefault;e().keyCode=40||e().keyCode=38;__droplistPositioner__:();if():[e().keyCode=38]:[__keyupIndex__:()>0].elif():[e().keyCode=40]:[__keyupIndex__:()<():droplist.children.lastIndex()]`
  }]
}
},{}],15:[function(require,module,exports){
module.exports = ({ id, controls }) => {
  if (window.views[id].type !== "Input" && !window.views[id].editable) {
    var _input = window.views[id].element.getElementsByTagName("INPUT")
    if (_input.length > 0) id = _input[0].id
  }
  return [{
    event: `focus:${id}?${controls}??${id}`
  }]
}
},{}],16:[function(require,module,exports){
module.exports = ({ controls, id }) => {

    var view = window.views[id]
    var _id = controls.id || controls.controllerId || id
    if (typeof _id === "object" && _id.id) _id = _id.id
    
    view.hover.default = view.hover.default || { style: {} }
    view.hover.style &&
    Object.keys(view.hover.style).map(key => 
        view.hover.default.style[key] = view.hover.default.style[key] !== undefined ? view.hover.default.style[key] : view.style[key] !== undefined ? view.style[key] : null 
    )
    
    return [{
        "event": `loaded:${_id}?mouseenter()?hover.mount;!clicked.mount`
    }, {
        "event": `mouseenter:${_id}?hover.style.keys()._():[style()._=.hover.style._]?!clicked.disable;!clicked.mount;!hover.disable`
    }, {
        "event": `mouseleave:${_id}?hover.default.style.keys()._():[style()._=.hover.default.style._]?!clicked.disable;!clicked.mount;!hover.disable`
    }]
}
},{}],17:[function(require,module,exports){
module.exports = ({params}) => [
  "setData?data.value=().text",
  `resetStyles?():[)(:${params.state}.0].mountonload=false??${params.state}:()`,
  `setState?)(:${params.state}=[${params.id || "().id"},${
    params.id || "().id"
  }++-icon,${params.id || "().id"}++-text,${
    params.id || "().id"
  }++-chevron]`,
  `mountAfterStyles?().mountonload:)(:${params.state}.0??${params.state}:()`,
];

},{}],18:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `keydown?${controls}`
    }]
}
},{}],19:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `keypress?${controls}`
  }]
}
},{}],20:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `keyup?${controls}`
    }]
}
},{}],21:[function(require,module,exports){
module.exports = ({ controls }) => {

  return [{
    event: "click",
    actions: [
      `setState?)(:${controls.id}-mouseentered`,
      `mountAfterStyles:${controls.id}`,
      `setPosition?position.positioner=${controls.id};position.placement=${controls.placement || "right"};position.distance=${controls.distance || "15"}`,
    ],
  }, {
    event: "mouseleave",
    actions: [
      `resetStyles>>200:${controls.id}??!mouseentered;!mouseentered:${controls.id};!)(:${controls.id}-mouseentered`,
      `setState?)(:${controls.id}-mouseentered=false`,
    ]
  }]
}

},{}],22:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
        event: `loaded?${controls}`
    }]
}
},{}],23:[function(require,module,exports){
module.exports = () => {
  
  return [{
    event: `click?():mininote-text.txt()=[.mininote.text||.mininote.note||''];clearTimeout():[mininote-timer:()];():mininote.style():[opacity=1;transform='scale(1)'];mininote-timer:()=():root.timer():[():mininote.style():[opacity=0;transform=scale(0)]]:[.mininote.timer||3000]`
  }]
}
},{}],24:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mousedown?${controls}`
    }]
}
},{}],25:[function(require,module,exports){
module.exports = ({ controls }) => {
  
    return [{
      event: `mouseenter?${controls}`
    }]
}
},{}],26:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseleave?${controls}`
    }]
}
},{}],27:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseover?${controls}`
    }]
}
},{}],28:[function(require,module,exports){
module.exports = ({ controls }) => {
  
    return [{
      event: `mouseup?${controls}`
    }]
}
},{}],29:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  var view = window.views[id]
  
  if (typeof view.popup !== "object") view.popup = {}
  view.popup.id = controls.id = id = controls.id || id
  if (view.popup.model2) view.popup.model = "model2"
  else if (view.popup.model3) view.popup.model = "model3"
  if (!view.popup.model) view.popup.model = "model1"
  
  return [{
    event: `click?clearTimer():[popup-timer:()];if():[popup-positioner:()=${id}]:[timer():[().popup.style.keys()._():[():popup.style()._=():popup.style._||null];():popup.():[if():[():${id}.popup.model=model1]:[child().style().transform='scale(0.5)'];style():[opacity=0;pointerEvents=none]];popup-positioner:().del()]:0].elif():[popup-positioner:()!=${id}]:[popup-positioner:()=${id};update():popup;timer():[if():[():${id}.popup.model=model1]:[():popup.position():[positioner=${controls.positioner || id};placement=${controls.placement || "left"};distance=${controls.distance};align=${controls.align}]];():popup.():[if():[():${id}.popup.model=model1]:[child().style().transform='scale(1)'];style():[opacity=1;pointerEvents=auto]];().popup.style():[().popup.style]]:50]`
  }]
}
},{}],30:[function(require,module,exports){
module.exports = ({ id }) => {
    
    var input_id = window.views[id].type === 'Input' ? id : `${id}-input`
    return [{
        "event": `input:${input_id}?():${input_id}.data()=():${input_id}.element.value().toPrice().else().0;():${input_id}.element.value=():${input_id}.data().else().0`
    }]
}
},{}],31:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `scroll?${controls}`
  }]
}
},{}],32:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `mousemove?if():[!tooltip-timer:()]:[tooltip-timer:()=timer():[():tooltip.style().opacity=1]:500];():tooltip-text.txt()=${text};():tooltip-text.removeClass():ar;if():[${arabic.test(text) && !english.test(text)}]:[():tooltip-text.addClass():ar];():tooltip.position():[positioner=mouse;placement=${controls.placement || "left"};distance=${controls.distance}]`
  }, {
    event: "mouseleave?clearTimer():[tooltip-timer:()];tooltip-timer:().del();():tooltip.style().opacity=0"
  }]
}
},{}],33:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `touchcancel?${controls}`
  }]
}
},{}],34:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `touchend?${controls}`
  }]
}
},{}],35:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `touchmove?${controls}`
  }]
}
},{}],36:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `touchstart?${controls}`
  }]
}
},{}],37:[function(require,module,exports){
module.exports=[
  "data()", "Data()", "doc()", "mail()", "function()", "exec()", "notification()", "notify()", "alert()", "tag()", "view()"
 , "style()", "className()", "getChildrenByClassName()", "erase()", "insert()", "setChild()", "same()", "checker()"
 , "deepChildren()", "children()", "1stChild()", "lastChild()", "2ndChild()", "3rdChild()", "promise()", "type()"
 , "3rdLastChild()", "2ndLastChild()", "parent()", "next()", "text()", "val()", "txt()", "loader()", "resolve()"
 , "element()", "el()", "checked()", "check()", "prev()", "format()", "lastSibling()", "interval()", "export()"
 , "1stSibling()", "derivations()", "path()", "mouseleave()", "mouseenter()", "mouseup()", "blur()", "log()", "pull()"
 , "mousedown()", "copyToClipBoard()", "mininote()", "note()", "date()", "tooltip()", "update()", "updateSelf()" 
 , "refresh()", "save()", "search()", "override()", "click()", "is()", "new()", "preventDefault()", "device()", "mobile()", "tablet()", "desktop()"
 , "gen()", "generate()", "route()", "getInput()", "input()", "getEntry()", "entry()", "capitalize()", "if()"
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
 , "exportExcel()", "2nd()", "2ndPrev()", "3rdPrev()", "2ndParent()", "3rdParent()", "installApp()", "sent()"
 , "replaceItem()", "replaceItems()", "findAndReplaceItem()", "grandParent()", "grandChild()", "grandChildren()", "2ndNext()", "isNaN()"
 , "send()", "removeDuplicates()", "stopWatchers()", "getGeoLocation()", "display()", "hide()", "scrollTo()"
]
},{}],38:[function(require,module,exports){
const { toAwait } = require("./toAwait")

const axios = async ({ id, lookupActions, awaits, ...params }) => {

    var view = window.views[id]
    var { method, url, headers, payload } = params, data

    if (method === "get" || method === "SEARCH") {
        
        data = await require("axios").get(url, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })

    } else if (method === "post" || method === "save") {
        
        data = await require("axios").post(url, payload, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })

    } else if (method === "delete" || method === "erase") {
        
        data = await require("axios").delete(url, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })
    }

    // awaits
    console.log(data)
    view.axios = data

    toAwait({ id, lookupActions, awaits, params })
}

module.exports = { axios }
},{"./toAwait":117,"axios":142}],39:[function(require,module,exports){
const blur = ({ id }) => {

  var local = window.views[id]
  if (!local) return

  var isInput = local.type === "Input" || local.type === "Textarea"
  if (isInput) local.element.blur()
  else {
    if (local.element) {
      let childElements = local.element.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = local.element.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].blur()
      }
    }
  }
}

module.exports = {blur}

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
const {clone} = require("./clone");

const clearValues = (obj) => {
  let newObj = clone(obj);

  if (typeof obj === "undefined") return "";

  if (typeof obj === "string") return "";

  if (Array.isArray(obj)) {
    newObj = [];
    if (obj.length > 0) {
      obj.map((element, index) => {
        if (typeof element === "object") {
          newObj[index] = clearValues(element);
        } else newObj[index] = "";
      });
    }

    return newObj;
  }

  Object.entries(obj).map(([key, value]) => {
    if (Array.isArray(value)) {
      newObj[key] = [];
      if (value.length > 0) {
        value.map((element, index) => {
          if (typeof element === "object") {
            newObj[key][index] = clearValues(element);
          } else newObj[key][index] = "";
        });
      }
    } else if (typeof value === "object") newObj[key] = clearValues(value);
    else newObj[key] = "";
  });

  return newObj;
};

module.exports = {clearValues};

},{"./clone":42}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
const { decode } = require("./decode")

const _colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const colorize = ({ _window, id, string, start = "[", end = "]", index = 0, ...params }) => {

  var { colors = _colors } = params
  if (typeof colors === 'string') colors = [colors]

  if (index === 8) index = 1
  if (typeof string !== "string") return string

  string = string.replaceAll("<", "&#60;")
  string = string.replaceAll(">", "&#62;")

  // comment
  string = colorizeComment({ _window, id, start, end, index, params, string, colors })

  // arabic
  if (arabic.test(string)) {

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
  }

  if (index !== 0) string = `<span contenteditable style="background-color:#00000000; color:${colors[index]}; white-space:nowrap">${string}</span>`

  return string
}

const colorizeComment = ({ _window, id, start, end, index, params, string, colors }) => {

  if (string.charAt(0) === "#" || string.includes("?#") || string.includes(";#") || string.includes("[#")) {

    var string0 = "", operator = ""
    if (string.charAt(0) === "#") {

      string0 = string.split("#")[0]
      operator = ""

    } else if (string.split("?#")[1]) {

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
    var comment = key.split(";")[0]
    if (comment.split("]")[1] !== undefined) comment = key.split("]")[0]
    key = key.split(comment).slice(1).join(comment)
    key = colorize({ _window, id, start, end, string: key, index, colors, params })

    if (string0) {
      string0 = colorizeText({ _window, id, start, end, index, params, string: string0, colors })
      string0 = colorizeMap({ _window, id, start, end, index, params, string: string0, colors })
    }
    
    string = string0 + operator + `<span contenteditable style="background-color:#00000000; color: green; white-space:nowrap">${decode({ _window, string: comment })}</span>` + key
  
  } else {
    
    string = colorizeText({ _window, id, start, end, index, params, string: string, colors })
    string = colorizeMap({ _window, id, start, end, index, params, string: string, colors })
  }
  
  return string
}

const colorizeText = ({ _window, id, start, end, index, params, string, colors }) => {
  var global = _window ? _window.global : window.global

  // text
  while (string.includes("codedS()")) {

    var string0 = string.split("codedS()")[0]
    var key = global.codes["codedS()" + string.split("codedS()")[1].slice(0, 5)]

    key = `<span contenteditable style="background-color:#00000000; color:${colors[index + 1]}; white-space:nowrap">'${key}'</span>`
    string = string0 + key + string.split("codedS()")[1].slice(5) + (string.split("codedS()").length > 2 ? "codedS()" + string.split("codedS()").slice(2).join("codedS()") : "")
  }

  return string
}

const colorizeMap = ({ _window, id, start, end, index, params, string, colors }) => {
  var global = _window ? _window.global : window.global

  // map
  while (string.includes("coded()")) {

    var string0 = string.split("coded()")[0]
    var key = global.codes["coded()" + string.split("coded()")[1].slice(0, 5)]
    key = colorize({ _window, id, string: start + key + end, index: index + 1, ...params })
    string = string0 + key + string.split("coded()")[1].slice(5) + (string.split("coded()").length > 2 ? "coded()" + string.split("coded()").slice(2).join("coded()") : "")
  }

  return string
}

module.exports = { colorize }
},{"./decode":57}],44:[function(require,module,exports){
module.exports = {
    compare: (value1, operator, value2) => {
        if (operator === "==") return value1 === value2
        else if (operator === ">") return parseFloat(value1) > parseFloat(value2)
        else if (operator === "<") return parseFloat(value1) < parseFloat(value2)
        else if (operator === ">=") return parseFloat(value1) >= parseFloat(value2)
        else if (operator === "<=") return parseFloat(value1) <= parseFloat(value2)
        else if (operator === "in") return value1.includes(value2)
    }
}
},{}],45:[function(require,module,exports){
module.exports = {
    contentful: ({ id }) => {
        var local = window.views[id]

        local.element.addEventListener("keydown", (e => {
            
            if (e.key === "Tab" || e.key === "Enter" || e.key === "{" || e.key === "[" || e.key === "(") {
                

                var start = e.target.selectionStart
                var end = e.target.selectionEnd
                var value = e.target.value

                var isEnter = e.key === "Enter"
                var isTab = e.key === "Tab"
                var isCurly = e.key === "{"
                var isSquare = e.key === "["
                var isRound = e.key === "("

                var innerValue = isTab ? "\t" 
                : isEnter ? "\n"
                : isCurly ? "{}"
                : isSquare ? "[]"
                : isRound ? "()"
                : ""
                
                if (isEnter) {
                    var after = value.substring(end).slice(0, 1)
                    after = after === "}" || after === "]" || after === ")"
                    if (after) innerValue += "\n"
                }
        
                // set textarea value to: text before caret + tab + text after caret
                e.target.value = value.substring(0, start) + innerValue + value.substring(end)
        
                // put caret at right position again (add one for the tab)
                e.target.selectionStart = e.target.selectionEnd = start + 1
        
                // prevent the focus lose
                e.preventDefault()

            }
        }))
    }
}
},{}],46:[function(require,module,exports){
const { toArray } = require("./toArray")

const controls = ({ _window, lookupActions, awaits, controls, id, req, res }) => {

  const { addEventListener } = require("./event")
  const { watch } = require("./watch")

  var local = _window ? _window.views[id] : window.views[id]

  // controls coming from toControls action
  controls = controls || local.controls
  
  controls && toArray(controls).map(controls => {
    // watch
    if (controls.watch) watch({ _window, lookupActions, awaits, controls, id, req, res })
    // event
    else if (controls.event) addEventListener({ _window, lookupActions, awaits, controls, id, req, res })
  })
}

const setControls = ({ id, params }) => {

  var local = window.views[id]
  if (!local) return

  local.controls = toArray(local.controls)
  local.controls.push(...toArray(params.controls))
}

module.exports = { controls, setControls }

},{"./event":61,"./toArray":116,"./watch":141}],47:[function(require,module,exports){
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

module.exports = {setCookie, getCookie, eraseCookie}
},{}],48:[function(require,module,exports){
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

    console.log({ counter: _counter, length, reset, timer: timestamp });
    return { counter: _counter, length, reset, timer: timestamp }
  }
}
},{}],49:[function(require,module,exports){
const control = require("../control/control")

const createActions = ({ params, id }) => {

  const {execute} = require("./execute")

  if (!params.type) return
  var actions = control[params.type]({ params, id })

  execute({ actions, id })
}

module.exports = {createActions}

},{"../control/control":13,"./execute":63}],50:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")

const component = require("../component/component")
const { toCode } = require("./toCode")

module.exports = {
  createComponent: ({ _window, lookupActions, awaits, id, req, res, __ }) => {
    
    var views = _window ? _window.views : window.views
    var view = views[id], parent = view.parent
    
    if (!component[view.type]) return
    views[id] = view = component[view.type](view)
    
    // my views
    if (!view["my-views"]) view["my-views"] = [...views[view.parent]["my-views"]]

    // use view instead of type
    if (view.view) view.type = view.view
    
    // 
    view.type = toCode({ _window, lookupActions, awaits, string: view.type })
    view.type = toCode({ _window, lookupActions, awaits, id, string: view.type, start: "'", end: "'" })
    
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]

    // type
    view.type = type
    view.parent = parent

    // approval
    var approved = toApproval({ _window, lookupActions, awaits, string: conditions, id, req, res, __ })
    if (!approved) return

    // push destructured params from type to view
    if (params) {
      
      params = toParam({ _window, lookupActions, awaits, string: params, id, req, res, mount: true, toView: true, __ })

      if (params.id) {
        
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
    }
  }
}

},{"../component/component":8,"./clone":42,"./generate":70,"./toApproval":115,"./toCode":120,"./toParam":130}],51:[function(require,module,exports){
const { clone } = require("./clone")
const { colorize } = require("./colorize")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { toStyle } = require("./toStyle")

module.exports = {
    createHtml: ({ _window, lookupActions, awaits, id: _id, req, res, import: _import, __, viewer }) => {
    
    return new Promise (async resolve => {

      var { toView } = require("./toView")

      // views
      var views = _window ? _window.views : window.views, id = _id
      var global = _window ? _window.global : window.global
      var view = views[id], type = view.type, siblings = "", prevSiblings = ""
      
      if (view.children) view.children = toArray(view.children)
      
      var innerHTML = await Promise.all(toArray(view.children).map(async (child, index) => {
    
        if (!child) return ""
        var id = child.id
        if (id && views[id]) id += generate()
        else if (!id) id = generate()
        views[id] = clone(child)
        views[id].id = id
        views[id].index = index
        views[id].parent = view.id
        
        return await toView({ _window, lookupActions, awaits, id, req, res, import: _import, __, viewer })
      }))

      // siblings
      if (view.sibling || view.siblings) {
        
        var _siblings = await Promise.all(toArray(view.sibling || view.siblings).map(async (child, index) => {
    
          if (!child) return ""
          var id = child.id
          if (id && views[id]) id += generate()
          else if (!id) id = generate()
          views[id] = clone(child)
          views[id].id = id
          views[id].index = view.index + ":" + index
          views[id].parent = view.parent
          
          return await toView({ _window, lookupActions, awaits, id, req, res, __, viewer })
        }))

        siblings += _siblings.join("")
      }

      // prev siblings
      if (view.prevSibling || view.prevSiblings) {
        
        var _siblings = await Promise.all(toArray(view.prevSibling || view.prevSiblings).map(async (child, index) => {
    
          if (!child) return ""
          var id = child.id
          if (id && views[id]) id += generate()
          else if (!id) id = generate()
          views[id] = clone(child)
          views[id].id = id
          views[id].index = view.index + ":" + index
          views[id].parent = view.parent
          
          return await toView({ _window, lookupActions, awaits, id, req, res, __, viewer })
        }))

        prevSiblings += _siblings.join("")
      }
      
      innerHTML = innerHTML.join("")

      // colorize
      if (view.colorize) {
    
        innerHTML = innerHTML || view.text || (view.editable ? view.data : "")
        innerHTML = toCode({ _window, lookupActions, awaits, string: innerHTML  })
        innerHTML = toCode({ _window, lookupActions, awaits, string: innerHTML, start: "'", end: "'" })
        innerHTML = colorize({ _window, lookupActions, awaits, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
      }

      if (_id === "html") return resolve("")
      
      var tag = _import ? "" : require("./toHTML")({ _window, lookupActions, awaits, id: _id, innerHTML }) || ""
      if (prevSiblings) tag = prevSiblings + tag
      if (siblings) tag += siblings
      
      if (_import) {

        type = type.toLowerCase()
        delete view.text
        delete view.type
        delete view.view
        delete view.parent
        delete view["my-views"]
        delete view.viewType
    
        /*if (view.body) view.body = true
        else view.head = true*/
    
        if (type === "link" || type === "meta") {
          
          delete view.id
          delete view.index

          tag = `<${type} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>`

        } else if (type === "style") {

          tag = `
          <style>
    
            ${Object.entries(view).map(([key, value]) => 
              typeof value === "object" && !Array.isArray(value)
                ? `${key} {
                ${Object.entries(value).map(([key, value]) => `${require("./styleName")(key)}: ${value.toString().replace(/\\/g, '')}`).join(`;
                `)};
                }` : "").filter(style => style).join(`
              `)}
            
          </style>`

        } else {

          tag = `<${type} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>${(view.text || "").replace(/\\/g, '')}</${type}>`
        }
        
        if (view.head) {
    
          global.__TAGS__.head += tag.replace(` head="true"`, "")
          return resolve(global.__TAGS__.head)

        } else {
    
          global.__TAGS__.body += tag.replace(` body="true"`, "")
          return resolve(global.__TAGS__.body)
        }
      }
    
      // linkable
      if (view.link) {
    
        var id = generate(), style = '', _view, link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.host)
    
        _view = { id, parent: view.id, controls: [{ "event": `click?route():${view.link.path}?${view.link.path};${view.link.preventDafault ? false : true}` }] }
        _view.style = view.link.style
        views[id] = _view
        if (_view.style) style = toStyle({ _window, lookupActions, awaits, id })
        
        tag = `<a ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} id='${id}' href=${link} style='${style}' index='${view.index || 0}'>${tag}</a>`
      }
      
      resolve(tag)
    })
  }
}
},{"./clone":42,"./colorize":43,"./generate":70,"./styleName":113,"./toArray":116,"./toCode":120,"./toHTML":126,"./toStyle":133,"./toView":135}],52:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { createHtml } = require("./createHtml")
const { toArray } = require("./toArray")

const createTags = ({ _window, lookupActions, awaits, id: _id, req, res, __, viewer }) => {

  const { toView } = require("./toView")
  return new Promise (async resolve => {

    var views = _window ? _window.views : window.views, id = _id, view = views[id], tags = ""
    var global = _window ? _window.global : window.global
    if (!view) return

    // null data
    if (view.data === null) view.data = 0

    // mapper
    if (view.type === "Chevron" && Array.isArray(view.direction)) view["mapType"] = ["direction"]
    else if (view.type === "Icon" && Array.isArray(view.name)) view["mapType"] = ["name"]
    else if (view.type === "Image" && Array.isArray(view.src))view["mapType"] = ["src"]
    else if (view.type === "Text" && Array.isArray(view.text)) view["mapType"] = ["text"]
    else if (view.type === "Checkbox" && Array.isArray(view.label.text)) view["mapType"] = ["label", "text"]

    var mapType = clone(view.mapType)

    if (mapType) {

      var viewData = mapType.reduce((o, k) => o[k], view)
      var data = Array.isArray(viewData) ? viewData : (typeof viewData === "object" ? Object.keys(viewData) : [])
      var isObject = (typeof viewData === "object" && !Array.isArray(viewData)) ? true : false
      var myView = views[view.parent].children[view.index]
      if (myView.view) myView.type = myView.view

      var type = myView.type.replace("[", "").replace("]", "")
      
      // data
      if (type.includes("?data=")) type = type.split("?data=")[0] + "?" + type.split("?data=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";data=")) type = type.split(";data=")[0] + ";" + type.split(";data=").slice(1).join("").split(";").slice(1).join(";")
      // Data
      if (type.includes("?Data=")) type = type.split("?Data=")[0] + "?" + type.split("?Data=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes("?Data;")) type = type.split("?Data;")[0] + "?" + type.split("?Data;").slice(1).join("")
      if (type.includes(";Data=")) type = type.split(";Data=")[0] + ";" + type.split(";Data=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";Data;")) type = type.split(";Data;")[0] + ";" + type.split(";Data;").slice(1).join("")
      if (type.includes(";Data")) type = type.split(";Data")[0]
      // doc
      if (type.includes("?doc=")) type = type.split("?doc=")[0] + "?" + type.split("?doc=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes("?doc;")) type = type.split("?doc;")[0] + "?" + type.split("?doc;").slice(1).join("")
      if (type.includes(";doc=")) type = type.split(";doc=")[0] + ";" + type.split(";doc=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";doc;")) type = type.split(";doc;")[0] + ";" + type.split(";doc;").slice(1).join("")
      if (type.includes(";doc")) type = type.split(";doc")[0]
      // id
      if (type.includes("?id=")) type = type.split("?id=")[0] + "?" + type.split("?id=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";id=")) type = type.split(";id=")[0] + ";" + type.split(";id=").slice(1).join("").split(";").slice(1).join(";")
      // path
      if (type.includes("?path=")) type = type.split("?path=")[0] + "?" + type.split("?path=").slice(1).join("").split(";").slice(1).join(";") 
      if (type.includes(";path=")) type = type.split(";path=")[0] + ";" + type.split(";path=").slice(1).join("").split(";").slice(1).join(";")
      // arrange
      if (type.includes(";arrange=")) type = type.split(";arrange=")[0] + ";" + type.split(";arrange=").slice(1).join("").split(";").slice(1).join(";")
      // conditions
      if (type.split("?")[2]) type = type.split("?").slice(0, 2).join("?")

      // components
      if (view.type === "Chevron" && Array.isArray(view.direction)) {

        if (type.includes("?direction=")) type = type.split("?direction=")[0] + "?" + type.split("?direction=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";direction=")) type = type.split(";direction=")[0] + ";" + type.split(";direction=").slice(1).join("").split(";").slice(1).join(";")
      
      } else if (view.type === "Icon" && Array.isArray(view.name)) {

        if (type.includes("?name=")) type = type.split("?name=")[0] + "?" + type.split("?name=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";name=")) type = type.split(";name=")[0] + ";" + type.split(";name=").slice(1).join("").split(";").slice(1).join(";")
      
      } else if (view.type === "Image" && Array.isArray(view.src)) {

        if (type.includes("?src=")) type = type.split("?src=")[0] + "?" + type.split("?src=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";src=")) type = type.split(";src=")[0] + ";" + type.split(";src=").slice(1).join("").split(";").slice(1).join(";")

      } else if (view.type === "Text" && Array.isArray(view.text)) {

        if (type.includes("?text=")) type = type.split("?text=")[0] + "?" + type.split("?text=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";text=")) type = type.split(";text=")[0] + ";" + type.split(";text=").slice(1).join("").split(";").slice(1).join(";")

      } else if (view.type === "Checkbox" && typeof view.label === "object" && Array.isArray(view.label.text)) {

        if (type.includes("label.text=")) type = type.split("label.text=")[0] + "" + type.split("label.text=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes("[text=")) type = type.split("[text=")[0] + "[" + type.split("[text=").slice(1).join("").split(";").slice(1).join(";") 
        else if (type.includes(";text=")) type = type.split(";text=")[0] + ";" + type.split(";text=").slice(1).join("").split(";").slice(1).join(";")
      }

      view.length = data.length || 1

      // arrange
      if ((view.arrange || view.sort) && !Array.isArray(viewData)) data = arrange({ data, arrange: view.arrange, id, _window })

      delete views[id]
      delete view.mapType
      
      if (data.length > 0) {

        tags = await Promise.all(data.map(async (_data, index) => {
          
          var id = view.id + generate()
          var mapIndex = index
          var lastEl = isObject ? _data : index
          var derivations = clone(view.derivations)
          var data = clone(isObject ? viewData[_data] : _data)
          
          var _view = clone({ ...view, id, view: type, mapIndex, derivations, children: clone(myView.children || []) })
          mapType.reduce((o, k, i) => {
            if (i !== mapType.length - 1) return o[k]
            else o[k] = data
          }, _view)

          if (mapType[0] === "data") _view.derivations.push(lastEl)
         
          views[id] = _view
          return await toView({ _window, lookupActions, awaits, id, req, res, __, viewer })
        }))

        tags = tags.join("")

      } else {
          
        var id = generate()
        var mapIndex = 0
        var lastEl = isObject ? "" : 0
        var derivations = clone(view.derivations)
        var data = clone(viewData ? viewData[lastEl] : viewData)
          
        var _view = clone({ ...view, id, view: type, mapIndex, derivations, children: clone(myView.children || []) })
        mapType.reduce((o, k, i) => {
          if (i !== mapType.length - 1) return o[k]
          else o[k] = data
        }, _view)

        if (mapType[0] === "data") _view.derivations.push(lastEl)
        
        views[id] = _view
        tags = await toView({ _window, lookupActions, awaits, id, req, res, __, viewer })
      }

    } else tags = await createTag({ _window, lookupActions, awaits, id, req, res, __, viewer })
    
    resolve(tags)
  })
}

const createTag = async ({ _window, lookupActions, awaits, id, req, res, __, viewer }) => {
  
  // components
  componentModifier({ _window, id })
  createComponent({ _window, lookupActions, awaits, id, req, res, __ })
  componentModifier({ _window, id })
  
  return await createHtml({ _window, lookupActions, awaits, id, req, res, __, viewer })
}

const componentModifier = ({ _window, id }) => {

  var view = _window ? _window.views[id] : window.views[id]

  if (!view) return console.log(id)

  // chevron
  if (view.type === "Chevron") {
    if (view.right) view.direction = "right"
    else if (view.left) view.direction = "left"
  }

  // icon
  else if (view.type === "Icon") {

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
  else if (view.textarea && !view.templated) {

    view.style = view.style || {}
    view.input = view.input || {}
    view.input.style = view.input.style || {}
    view.input.style.height = "fit-content"
  }

  // input
  else if (view.type === "Input") {

    view.input = view.input || {}
    if (view.value) view.input.value = view.input.value || view.value
    if (view.checked !== undefined) view.input.checked = view.checked
    if (view.max !== undefined) view.input.max = view.max
    if (view.min !== undefined) view.input.min = view.min
    if (view.name !== undefined) view.input.name = view.name
    if (view.accept !== undefined) view.input.accept = view.input.accept
    if (view.multiple !== undefined) view.input.multiple = true
    if (view.input.placeholder) view.placeholder = view.input.placeholder
    
  } else if (view.type === "Item") {

    var parent = _window ? _window.views[view.parent] : window.views[view.parent]

    if (view.index === 0) {

      view.state = generate()
      parent.state = view.state
      
    } else view.state = parent.state

  } else if (view.type === "Image") {
    
    view.src = view.src || (typeof view.data === "string" && view.data) || ""

  } else if (view.type === "Text") {
    
    view.text = view.text !== undefined ? view.text : ((typeof view.data === "string" && view.data) || "")
  }
}

const arrange = ({ data, arrange, id, _window }) => {

  var views = _window ? _window.views : window.views
  var view = views[id], index = 0

  if (view) {
    if (view.arrange) toArray(arrange).map(el => {

      var _index = data.findIndex(_el => _el == el)
      if (_index > -1) {

        var _el = data[index]
        data[index] = el
        data[_index] = _el
        index += 1
      }
    })
    
    if (view.sort) {
      
      var _sorted = data.slice(index).sort()
      data = data.slice(0, index)
      data.push(..._sorted)
    }
  }
  return data
}

module.exports = { createTags }

},{"./clone":42,"./createComponent":50,"./createHtml":51,"./generate":70,"./toArray":116,"./toView":135}],53:[function(require,module,exports){
const {update} = require("./update")
const {toArray} = require("./toArray")
const {clone} = require("./clone")
const { generate } = require("./generate")

const createView = ({ view, id = generate(), lookupActions }) => {

  var view = window.views[id] || {}
  var global = window.global
  
  view.children = toArray(clone(global.data[view.viewType][view]))

  // update
  update({ id, lookupActions })
}

module.exports = {createView}
},{"./clone":42,"./generate":70,"./toArray":116,"./update":137}],54:[function(require,module,exports){
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
            toParam({ id, e, string: onload, mount: true, __: [window.global.file, ...__] })
        };

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(file || e.target.files[0]);
    }
}
},{"./toParam":130}],55:[function(require,module,exports){
(function (global){(function (){
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { setContent } = require("./setContent")
const { setData } = require("./setData")

const createData = ({ data, id }) => {

  var view = window.views[id]

  view.derivations.reduce((o, k, i) => {

    if (i === view.derivations.length - 1) return o[k] = data
    return o[k]

  }, global[view.Data])
}

const clearData = ({ id, e, clear = {}, __ }) => {

  var view = window.views[id]

  if (!global[view.Data]) return
  
  var path = clear.path
  path = path ? path.split(".") : clone(view.derivations)
  path.push('delete()')
  
  reducer({ id, e, path, object: global[view.Data], __ })

  setContent({ id })
  console.log("data removed", global[view.Data])
}

module.exports = { createData, setData, clearData }

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./clone":42,"./reducer":96,"./setContent":105,"./setData":106}],56:[function(require,module,exports){
const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { toCode } = require("./toCode")
const { toArray } = require("./toArray")

var getdb = async ({ _window, req, res }) => {
  
  var string = decodeURI(req.headers.search), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search || {}
  var { data, success, message } = await getData({ _window, req, res, search })

  toArray(data).map(data => {
    delete data["creation-date"]
  })

  return res.send({ data, success, message })
}

var postdb = async ({ _window, req, res }) => {
  
  var save = req.body.save || {}
  var { data, success, message } = await postData({ _window, req, res, save })

  return res.send({ data, success, message })
}

var deletedb = async ({ _window, req, res }) => {
  
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var erase = params.erase || {}

  var { success, message } = await deleteData({ _window, req, res, erase })
  
  return res.send({ success, message })
}

const getData = async ({ _window, req, res, search }) => {

  var db = req.db
  var collection = search.collection
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${req.headers["project"]}`

  var doc = search.document || search.doc,
    docs = search.documents || search.docs,
    field = search.field || search.fields,
    limit = search.limit || 1000,
    data = {}, success, message,
    ref = collection && db.collection(collection),
    promises = [], project

  if (search.url) {

    var url = search.url
    delete search.url

    if (url.slice(-1) === "/") url = url.slice(0, -1)
    
    try {
      data = await require("axios").get(url, { timeout: 1000 * 40 })
      .then(res => res.doesNotExist.throwAnError)
      .catch(err => err)

      data = data.data
      if (typeof data === "string") {
        data = `{ ${data.split("{").slice(1).join("{")}`
        data = JSON.parse(data)
      }
      success = true
      message = `Document/s mounted successfuly!`

    } catch (err) {
      data = {}
      success = false
      message = `Error!`
    }

    return ({ data, success, message })
  }

  if (docs) {

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
   
    return ({ data, success, message })
  }

  if (doc) {

    await ref.doc(doc.toString()).get().then(doc => {

      success = true
      data = doc.data()
      message = `Document mounted successfuly!`

    }).catch(error => {

      success = false
      message = `An error Occured!`
    })

    await Promise.all(promises)

    return ({ data, success, message })
  }

  if (!doc && !field) {

    
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

    return ({ data, success, message })
  }

  const myPromise = () => new Promise(async (resolve) => {

    // search field
    var multiIN = false, _ref = ref
    if (field) Object.entries(field).map(([key, value]) => {

      if (typeof value !== "object") value = { equal: value }
      var operator = toFirebaseOperator(Object.keys(value)[0])
      var _value = value[Object.keys(value)[0]]
      if (operator === "in" && _value.length > 10) {

        field[key][Object.keys(value)[0]] = [..._value.slice(10)]
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
  })

  var { data, success, message } = await myPromise()
  return ({ data, success, message })
}

const postData = async ({ _window, req, res, save }) => {

  // collection
  var db = req.db
  var data = req.body.data
  var collection = save.collection, schema
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var ref = db.collection(collection)
  var success, message
console.log(data, save);
  // get schema
  if (save.schematize) {

    await db.collection(`schema-${project}`).doc(save.collection).get().then(doc => {

      success = true
      schema = doc.data()

    }).catch(error => {

      success = false
      message = error
    })

    if (!schema) return
    else schema = schema.schema
    if (Array.isArray(data)) data = data.map(data => schematize({ data, schema }))
    data = schematize({ data, schema })
  }
  
  if (Array.isArray(data)) {

    var idList = toArray(save.idList || save.doc || save.id)
    if (save.idList) {

      var batch = db.batch()
      data.map((data, i) => {

        if (idList[i]) {

          if (!data["creation-date"] && req.headers.timestamp) {
            data["creation-date"] = parseInt(req.headers.timestamp)
          }

          /*if (!data["creation-date-gmt"]) {
            data["creation-date-gmt"] = (new Date()).getTime()
          }*/

          batch.set(db.collection(collection).document(idList[i].toString()), data)

          // Commit the batch
          batch.commit().then(() => {

            success = true
            message = `Document saved successfuly!`

          }).catch(error => {
      
            success = false
            message = error
          })
        }
      })
    }

  } else if (save.doc) {

    if (!data.id && !save.doc && !save.id) data.id = generate({ length: 20 })

    if (!data["creation-date"] && req.headers.timestamp) data["creation-date"] = parseInt(req.headers.timestamp)

    await ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

      success = true
      message = `Document saved successfuly!`

    }).catch(error => {

      success = false
      message = error
    })
  }

  return ({ data, success, message })
}

const deleteData = async ({ _window, req, res, erase }) => {

  var db = req.db, docs
  var storage = req.storage
  var collection = erase.collection, data
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  
  var ref = db.collection(collection)
  var success, message

  /*if (erase.collection === "storage" && erase.field) {

    var field = erase.field
    const myPromise = () => new Promise(async (resolve, rej) => {

      // search field
      var multiIN = false, _ref = ref
      if (field) Object.entries(field).map(([key, value]) => {
  
        if (typeof value !== "object") value = { equal: value }
        var _value = value[Object.keys(value)[0]]
        var operator = toFirebaseOperator(Object.keys(value)[0])
        if (operator === "in" && _value.length > 10) {
  
          field[key][Object.keys(value)[0]] = [..._value.slice(10)]
          _value = [..._value.slice(0, 10)]
          multiIN = true
        }
        _ref = _ref.where(key, operator, _value)
      })
      
      if (search.orderBy) _ref = _ref.orderBy(search.orderBy)
      if (search.limit || 100) _ref = _ref.limit(search.limit || 100)
      if (search.offset) _ref = _ref.endAt(search.offset)
      if (search.limitToLast) _ref = _ref.limitToLast(search.limitToLast)
  
      if (search.startAt) _ref = _ref.startAt(search.startAt)
      if (search.startAfter) _ref = _ref.startAfter(search.startAfter)
  
      if (search.endAt) _ref = _ref.endAt(search.endAt)
      if (search.endBefore) _ref = _ref.endBefore(search.endBefore)
  
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
    })
  
    var { data, success, message } = await myPromise()
    docs = Object.keys(data)
  }*/

  docs = erase.docs || [erase.doc]
  await docs.map(async doc => {
    
    return await ref.doc(doc.toString()).delete().then(() => {

      success = true,
      message = `Document erased successfuly!`

    }).catch(error => {

      success = false
      message = error
    })

    if (erase.storage && erase.storage.doc) {

      var exists = await storage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).exists()
      if (exists) {

        await storage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).delete()

        await db.collection(`storage-${req.headers["project"]}`).doc(erase.storage.doc.toString()).delete().then(() => {
      
          success = true,
          message = `Document erased successfuly!`
      
        }).catch(error => {
      
          success = false
          message = error
        })
      }
    }
  })
  
  return ({ data, success, message })
}

module.exports = {
  getdb,
  getData,
  postdb,
  postData,
  deletedb,
  deleteData
}
},{"./toArray":116,"./toCode":120,"./toFirebaseOperator":124,"./toParam":130,"axios":142}],57:[function(require,module,exports){
const decode = ({ _window, string }) => {

  var global = _window ? _window.global : window.global
  if (typeof string !== "string") return string
  
  if (string.includes("coded()")) {

    string.split("coded()").map((state, i) => {

      if (i === 0) return string = state
      
      var code = state.slice(0, 5)
      var after = state.slice(5)
      var statement = global.codes[`coded()${code}`]

      statement = decode({ _window, string: statement })
      string += `[${statement}]` + after
    })
  }
  
  if (string.includes("codedS()")) {

    string.split("codedS()").map((state, i) => {

      if (i === 0) return string = state
      
      var code = state.slice(0, 5)
      var after = state.slice(5)
      var statement = global.codes[`codedS()${code}`]

      statement = decode({ _window, string: statement })
      string += `'${statement}'` + after
    })
  }

  return string
}

module.exports = {decode}

},{}],58:[function(require,module,exports){
const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")
const { colorize } = require("./colorize")
const { toCode } = require("./toCode")
const { clone } = require("./clone")

const defaultInputHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global


  if (!view) return
  if (view.type !== "Input" && view.type !== "Entry" && !view.editable) return

  if (view.input.preventDefault) return

  // checkbox input
  if (view.input && view.input.type === "checkbox") {

    if (view.data === true) view.element.checked = true

    var myFn = (e) => {

      // view doesnot exist
      if (!window.views[id]) return e.target.removeEventListener("change", myFn)

      var data = e.target.checked
      view.data = data

      if (global[view.Data] && view.derivations[0] !== "") {

        // reset Data
        setData({ id, data })
      }
    }

    return view.element.addEventListener("change", myFn)
  }

  if (view.input && view.input.type === "number")
  view.element.addEventListener("mousewheel", (e) => e.target.blur())

  // readonly
  if (view.readonly) return

  view.element.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !e.shiftKey) e.preventDefault()
  })

  if (view.type === "Input") view.prevValue = view.element.value
  else if (view.type === "Entry" || view.editable) view.prevValue = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent
  
  var myFn = async (e) => {
    
    e.preventDefault()
    var value 
    if (view.type === "Input") value = e.target.value
    else if (view.type === "Entry" || view.editable) value = (e.target.textContent===undefined) ? e.target.innerText : e.target.textContent

    /*if (!view.contenteditable) {
      if (view.type === "Input") e.target.value = view.prevValue
      else if (view.type === "Entry") e.target.innerHTML = view.prevValue
      return 
    }*/

    // views[id] doesnot exist
    if (!window.views[id]) {
      if (e.target) e.target.removeEventListener("input", myFn)
      return 
    }

    // contentfull
    if (view.input.type === "text") {
      
      if (value.includes("&amp;")) {
        value = value.replace('&amp;','&')
        e.target.value = value
      }

      if (value.includes("&nbsp;")) {
        value = value.replace('&nbsp;',' ')
        e.target.value = value
      }
    }

    if (!view.preventDefault && view.input ? !view.input.preventDefault : view.editable ? !view.preventDefault : false) {
      
      // for number inputs, strings are rejected
      if (view.type === "Input" && view.input) {

        if (view.input.type === "number") {

          if (e.data !== ".") {

            if (isNaN(value)) value = value.toString().slice(0, -1)
            if (!value) value = 0
            if (value.toString().charAt(0) === "0" && value.toString().length > 1) value = value.toString().slice(1)
            if (view.input.min && view.input.min > parseFloat(value)) value = view.input.min
            if (view.input.max && view.input.max < parseFloat(value)) value = view.input.max
            value = parseFloat(value)
            view.element.value = value.toString()

          } else value = parseFloat(value + ".0")
        }

        // for uploads
        if (view.input.type === "file") {
          global.file = e.target.files[0]
          return global.files = [...e.target.files]
        }

        /*if (e.data === ")" && value.slice(e.target.selectionStart - 3, e.target.selectionStart - 1) === "()") {

          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        }*/
      }

      if (view.Data && (view.input ? !view.input.preventDefault : view.editable ? !view.preventDefault : true)) setData({ id, data: { value } })

    }
    // resize
    resize({ id })

    // arabic values
    // isArabic({ id, value })
    
    console.log(value, global[view.Data], view.derivations)

    view.prevValue = value
  }

  var myFn1 = (e) => {

    // contentfull
    /*if (view.input.type === "text") {
  
      var value 
      if (view.type === "Input") value = e.target.value
      else if (view.type === "Entry" || view.editable) value = (e.target.textContent===undefined) ? e.target.innerText : e.target.textContent
      
      if (value.includes("&amp;")) {
        value = value.replace('&amp;','&')
        e.target.value = value
      }

      if (value.includes("&nbsp;")) {
        value = value.replace('&nbsp;',' ')
        e.target.value = value
      }

      if (view.Data && (view.input ? !view.input.preventDefault : view.editable ? !view.preventDefault : true)) setData({ id, data: { value } })
    }*/

    var value
    if (view.type === "Input") value = view.element.value
    else if (view.type === "Entry" || view.editable) value = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent
    
    // colorize
    if (view.colorize) {
      
      // removeChildren({ id })
      var _value = toCode({ string: value })
      _value = toCode({ string: _value, start: "'", end: "'"  })
      if (view.type === "Input") e.target.value = colorize({ string: _value, ...(typeof view.colorize === "object" ? view.colorize : {}) })
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
        path: view.derivations,
        value: view.prevContent,
        id: view.element.parentNode.parentNode.parentNode.parentNode.id
      })
    }
  }

  const myFn2 = (e) => {
    
    var value = ""
    if (view.type === "Input") value = view.element.value
    else if (view.type === "Entry" || view.editable) value = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent

    view.prevContent = value
  }

  view.element.addEventListener("input", myFn)
  view.element.addEventListener("blur", myFn1)
  view.element.addEventListener("focus", myFn2)
}

function getCaretIndex(element) {

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

} else if (e.data === "T" && e.target.selectionStart === 1 && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Text?class=flexbox;text=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "c" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Icon?class=flexbox;name=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "n" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Input?style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 1

} else if (e.data === "m" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Image?class=flexbox;src=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "V" && e.target.selectionStart === 1 && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "View?class=vertical;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 1

}*/
},{"./clone":42,"./colorize":43,"./data":55,"./isArabic":78,"./resize":100,"./toCode":120}],59:[function(require,module,exports){
const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { jsonToBracket } = require("./jsonToBracket")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toParam } = require("./toParam")

const droplist = ({ id, e, droplist: params = {}, __ }) => {
  
  if (params.positioner || params.id) id = params.positioner || params.id
  var views = window.views
  var global = window.global
  var view = window.views[id]
  var dropList = views["droplist"]
  if (!view.droplist) return
  view.droplist.searchable = view.droplist.searchable || view.droplist.search || {}
  if (view.droplist.searchable && typeof view.droplist.searchable !== "object") view.droplist.searchable = {}
  
  // items
  var items = clone(view.droplist.items) || []
  dropList.derivations = clone(view.derivations)
  dropList.Data = view.Data
  clearTimeout(global.droplistTimer)
  
  // path & derivations
  if (view.droplist.path) dropList.derivations.push(...view.droplist.path.split("."))

  // input id
  var input_id = view.type === "Input" ? view.id : ""
  if (!input_id) {
    
    input_id = view.element.getElementsByTagName("INPUT")[0]
    if (input_id) {

      input_id = input_id.id
      global["droplist-search-txt"] = views[input_id].element.value

    } else global["droplist-search-txt"] = views[view.id].element.innerHTML
  }

  // items
  if (typeof items === "string")
    items = clone(toValue({ id, e, value: toCode({ string: toCode({ string: items }), start: "'", end: "'" }) }))

  // filterable
  if (!view.droplist.preventDefault) {

    if ((view.droplist.searchable || {}).filter && global["droplist-search-txt"] !== undefined && global["droplist-search-txt"] !== "") {
      
      items = items.filter(item => view.droplist.searchable.any 
        ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
        : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
      )

      global["__keyupIndex__"] = 0
    }
  }

  // initialize
  dropList.children = []
  
  // title
  if (view.droplist.title) {

    var Title
    if (typeof view.droplist.title === "string" || typeof view.droplist.title === "number") Title = clone({ text: view.droplist.title })
    else Title = clone(view.droplist.title)

    if (Title.icon) {

      if (typeof Title.icon === "string") Title.icon = { name: Title.icon }
      var title = clone(Title)

      delete title.icon
      delete title.container

      dropList.children.push({
        type: `View?style:[minHeight=3rem;height=100%;gap=1rem;cursor=default];${jsonToBracket({ style: view.droplist.item && view.droplist.item.style || {} })};${jsonToBracket(view.droplist.item && view.droplist.item.container || {})};${jsonToBracket(Title.container || {})};class=flex align-items pointer ${(Title.container || {}).class || ""}`,
        children: [{
          type: `View?style:[height=100%;width=fit-content];${jsonToBracket(Title.icon.container || {})};class=flexbox ${(Title.icon.container || {}).class || ""}`,
          children: [{
            type: `Icon?style:[color=#888;fontSize=1.8rem];${jsonToBracket(view.droplist.icon || {})};${jsonToBracket(Title.icon || {})};class=flexbox ${(Title.icon || {}).class || ""}`
          }]
        }, {
          type: `Text?style:[padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%;fontWeight=bold];${jsonToBracket(title)};class=flex align-center ${(title || {}).class || ""}`,
        }]
      })

    } else dropList.children.push({
      type: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%;fontWeight=bold;cursor=default];${jsonToBracket(view.droplist.item || {})};${jsonToBracket(Title)};class=flex align-center ${(Title || {}).class || ""}`,
    })
  }
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children.push(...clone(items).map(item => {

      if (typeof item === "string" || typeof item === "number") item = { text: item }
      item.text = item.text !== undefined ? `'${item.text}'` : ""
      if (item.icon) {
  
        if (typeof item.icon === "string") item.icon = { name: item.icon }
        if (typeof item.text === "string") item.text = { text: item.text }
        
        return ({
          view: `View?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;gap=1rem];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item || {})};${jsonToBracket(item || {})};class=flex align-items pointer ${(item || {}).class || ""}`,
          children: [{
            view: `View?style:[height=inherit;width=fit-content];${jsonToBracket(item.icon.container || {})};class=flexbox ${(item.icon.container || {}).class || ""}`,
            children: [{
              view: `Icon?style:[color=#888;fontSize=1.8rem];${jsonToBracket(view.droplist.item && view.droplist.item.icon || {})};${jsonToBracket(view.droplist.icon || {})};${jsonToBracket(item.icon || {})};class=flexbox ${(item.icon || {}).class || ""}`
            }]
          }, {
            view: `Text?style:[fontSize=1.3rem;width=100%];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item.text)};class=flex align-center ${(item.text || {}).class || ""};caller=${id}?${item.text.text ? true : false}`,
            controls: [...(view.droplist.controls || []), {
              event: `click??!():${id}.droplist.preventDefault`,
              actions: [
                `wait():[resize:${input_id}]:[isArabic:${input_id}]?if():${input_id?true:false}:[():${input_id}.data()=txt().replace():'&amp;':'&';if():[():${input_id}.data().type()=boolean]:[():${input_id}.data()=():${input_id}.data().boolean()];():${input_id}.txt()=txt().replace():'&amp;':'&']:[():${id}.data()=txt().replace():'&amp;':'&';():${id}.txt()=txt().replace():'&amp;':'&']?!():${id}.droplist.isMap`,
                `droplist:${id}?droplist-search-txt:()=():${id}.input().txt();():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable;!():${id}.droplist.preventDefault`
              ]
            }]
          }]
        })
  
      } else {
        
        return ({
          view: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item)};class=flex align-center pointer ${(item || {}).class || ""};caller=${id}`,
          controls: [...(view.droplist.controls || []), {
            event: `click??!():${id}.droplist.preventDefault`,
            actions: [ // :[focus:${input_id}]
              `wait():[resize:${input_id}]:[isArabic:${input_id}]?if():${input_id?true:false}:[():${input_id}.data()=txt().replace():'&amp;':'&';if():[():${input_id}.data().type()=boolean]:[():${input_id}.data()=():${input_id}.data().boolean()];():${input_id}.txt()=txt().replace():'&amp;':'&']:[():${id}.data()=txt().replace():'&amp;':'&';():${id}.txt()=txt().replace():'&amp;':'&']?!():${id}.droplist.isMap`,
              `?if():[txt()=list||txt()=map]:[opened-maps:().push():[():${id}.derivations.join():'-']];():${id}.data()=if():[txt()=children]:[_list:[view='']].elif():[txt()=text]:''.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=list]:[_list:''].elif():[txt()=map]:[''=''];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];__droplistPositioner__:().del();myParent:()=():${id}.2ndParent();():${id}.2ndParent().update()::[quit=false;_.view.inputs().filter():[!classlist().inc():'comment'].():[if():[!txt()||txt()=0;!().quit]:[focus();().quit=true]]]?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
              `droplist:${id}?droplist-search-txt:()=():${id}.input().txt();():${id}.droplist.style.keys()._():[():droplist.style().[_]=():${id}.droplist.style._]?():${id}.droplist.searchable;!():${id}.droplist.preventDefault`
            ]
          }]
        })
      }
    }))
    
  } else dropList.children = []
  
  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true
  update({ id: "droplist", __ })
  
  // searchable
  var myFn = () => {

    if (view.droplist && view.droplist.searchable) {

      if (global["droplist-search-txt"] !== undefined && global["droplist-search-txt"] !== "") {
        
        var _index = items.findIndex(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
        )

        var onlyOne = items.filter(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
        ).length === 1
        
        if (_index !== -1) {
          
          if (onlyOne) {
            
            if (e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward" && e.inputType !== "deleteWordBackward" && e.inputType !== "deleteWordForward") {

              if (input_id) {

                views[input_id].element.value = views[input_id].prevValue = items[_index]
                views[input_id].contenteditable = false

              } else {

                view.element.innerHTML = view.prevValue = items[_index]
                view.contenteditable = false
              }
              
              reducer({ id, path: dropList.derivations, value: items[_index], object: global[dropList.Data], key: true, __ })
              
            } else if (view.contenteditable === false || views[input_id].contenteditable === false) {
              
              if (input_id) {

                views[input_id].element.value = items[_index].slice(0, -1)
                views[input_id].contenteditable = true

              } else {

                view.element.innerHTML = items[_index].slice(0, -1)
                view.contenteditable = true
              }

              reducer({ id, path: dropList.derivations, value: items[_index], object: global[dropList.Data], key: true, __ })
            }
            
          }

          global["__keyupIndex__"] = _index
        }
      }
    }
    
    global["__keyupIndex__"] = global["__keyupIndex__"] || 0
    views.droplist.element.children[view.droplist.title ? global["__keyupIndex__"] + 1 : global["__keyupIndex__"]].dispatchEvent(new Event("mouseenter"))
  }

  if (!view.droplist.preventDefault) global.droplistTimer = setTimeout(myFn, 100)
}

module.exports = { droplist }
},{"./clone":42,"./jsonToBracket":83,"./reducer":96,"./toCode":120,"./toParam":130,"./toValue":134,"./update":137}],60:[function(require,module,exports){
const axios = require("axios");
const { clone } = require("./clone");
const { deleteData } = require("./database");
const { toArray } = require("./toArray");
const { jsonToBracket } = require("./jsonToBracket")

const erase = async ({ _window, lookupActions, awaits, req, res, id, e, __, ...params }) => {

  var global = _window ? _window.global : window.global
  var view = _window ? _window.views[id] : window.views[id]
  var erase = params.erase || {}
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId
  var store = erase.store || "database"
  
  erase.docs = toArray(erase.doc || erase.docs || erase.id || (erase.data && clone(toArray(erase.data.map(data => data.id)))))

  if (_window) {
    
    var data = await deleteData({ _window, req, res, erase })
    
    view.erase = global.erase = clone(data)
    console.log("erase", data)
  
    if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req , res, id, e, __: [data, ...__], ...params })

  } else {

    // erase
    headers.erase = encodeURI(jsonToBracket({ erase }))

    headers["timestamp"] = (new Date()).getTime()
    headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

    // access key
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

    var { data } = await axios.delete(`/${store}`, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })

    view.erase = global.erase = clone(data)
    console.log("erase", data)
  
    if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req , res, id, e, __: [data, ...__], ...params })
  }
}

module.exports = { erase }
},{"./clone":42,"./database":56,"./jsonToBracket":83,"./toArray":116,"./toAwait":117,"axios":142}],61:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const events = [
  "click",
  "mouseenter",
  "mouseleave",
  "mousedown",
  "mouseup",
  "touchstart",
  "touchend"
]

const addEventListener = ({ _window, awaits, controls, id, req, res }) => {
  
  const { execute } = require("./execute")

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id]
  var mainID = id

  // 'string'
  var events = toArray(controls.event)[0]
  events = toCode({ _window, id, string: events })
  events = toCode({ _window, id, string: events, start: "'", end: "'" })
  
  events = events.split("?")
  var _idList = id

  // popup
  var popup = (events[1] || "").split(";").find(param => param === "popup()")
  if (popup && view.popup) {
    
    view.popup = typeof view.popup === "object" ? view.popup : {}
    view.popup.controls = view.popup.controls || []

    return view.popup.controls.push({
      event: events.join("?").replace("popup()", ""),
      actions: controls.actions
    })
  }

  events[0].split(";").map(event => {

    // case event is coded
    if (event.slice(0, 7) === "coded()") {
      event = global.codes[event]
      if (event.includes("?")) {
        var viewEventIdList = event.split("?")[3]
        var viewEventConditions = event.split("?")[2]
        var viewEventParams = event.split("?")[1]
        event = event.split("?")[0]
      }
    }

    // id
    if (viewEventIdList) mainID = toValue({ _window, lookupActions: controls.lookupActions, awaits, req, res, id, value: viewEventIdList }) || viewEventIdList
    
    var timer = 0, idList, clickEvent, keyEvent
    var once = events[1] && events[1].includes('once')

    // click
    if (event.split(":")[0].slice(0, 5) === "click" && event.split(":")[0].length > 5) {
      clickEvent = "loaded?" + events[1] +  (events[2] ? "?" + events[2] : "")
      clickEvent = clickEvent.split("?")
      event = event.split("click")[1]
    }

    // key
    if (event.split(":")[0].slice(0, 3) === "key" && event.split(":")[0] !== "keydown" && event.split(":")[0] !== "keyup") {
      keyEvent = "loaded?" + events[1] +  (events[2] ? "?" + events[2] : "")
      keyEvent = keyEvent.split("?")
      event = event.split("key")[1]
    }

    // action:id
    var eventid = event.split(":")[1]
    if (eventid) idList = toValue({ _window, lookupActions: controls.lookupActions, awaits, req, res, id, value: eventid })
    else idList = clone(_idList)

    idList = toArray(idList).map(id => {
      if (typeof id === "object" && id.id) return id.id
      else return id
    })

    // timer
    timer = event.split(":")[2] || 0

    // event
    event = event.split(":")[0]

    if (!event || !view) return
    clearTimeout(view[`${event}-timer`])

    // add event listener
    idList.map(id => {

      var _view = views[id]
      if (!_view && id !== "window") return
      
      var myFn = (e) => {

        setTimeout(async () => {

          var myView = views[mainID]
          if (!myView) return

          if (view[event] && typeof view[event] === "object" && view[event].disable) return

          // approval
          if (viewEventConditions) {
            var approved = toApproval({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventConditions, e, id: mainID, __: controls.__ || myView.__ })
            if (!approved) return
          }
          
          // approval
          var approved = toApproval({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: events[2], e, id: mainID, __: controls.__ || myView.__ })
          if (!approved) return

          // once
          if (once) e.target.removeEventListener(event, myFn)

          // params
          await toParam({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: events[1], e, id: mainID, mount: true, __: controls.__ || myView.__ })

          // break
          if (view.break) return delete view.break
          
          // approval
          if (viewEventParams) await toParam({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventParams, e, id: mainID, mount: true, __: controls.__ || myView.__ })
          
          // execute
          if (controls.actions || controls.action) await execute({ _window, lookupActions: controls.lookupActions, awaits, req, res, controls, e, id: mainID, __: controls.__ || myView.__ })
        }, timer)
      }
      
      // onload event
      if (event === "loaded") return setTimeout(myFn({ target: _view.element }), 0)
      else if (id === "window") return window.addEventListener(event, myFn)

      // body event
      if (id === "body") {
        
        global[`body-${event}-events`] = global[`body-${event}-events`] || {}
        global[`body-${event}-events`][mainID] = global[`body-${event}-events`][mainID] || []
        var index = global[`body-${event}-events`][mainID].length
        global[`body-${event}-events`][mainID].push({ id: mainID, viewEventConditions, viewEventParams, events, once, controls, index, event })
        return
      }

      var myFn = (e) => {
        
        view[`${event}-timer`] = setTimeout(() => {
          
          if (view[event] && typeof view[event] === "object" && view[event].disable) return
          if (clickEvent) return global["click-events"].push({ id, viewEventConditions, viewEventParams, events: clickEvent, controls })
          if (keyEvent) return global["key-events"].push({ id, viewEventConditions, viewEventParams, events: keyEvent, controls })

          // body
          if (eventid === "droplist" || eventid === "actionlist" || eventid === "popup") id = mainID

          // view doesnot exist
          var __view = views[id]
          if (!__view) {
            if (e.target) e.target.removeEventListener(event, myFn)
            return 
          }

          if (eventid === "droplist" && !global["__droplistPositioner__"]) return
          if (eventid === "droplist" && !views[global["__droplistPositioner__"]].element.contains(views[id].element)) return
          
          if (eventid === "popup" && (!global["popup-positioner"] || !global["popup-confirmed"])) return
          if (eventid === "popup" && !views[global["popup-positioner"]].element.contains(views[id].element)) return
          
          if (eventid === "actionlist" && !views[global["actionlistCaller"]].element.contains(views[id].element)) return

          if (once) e.target.removeEventListener(event, myFn)

          var _myFn = async () => {

            var myView = views[mainID]
            
            // approval
            if (viewEventConditions) {
              var approved = toApproval({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventConditions, e, id: mainID, __: controls.__ || myView.__ })
              if (!approved) return
            }
            
            // approval
            var approved = toApproval({ string: events[2], e, id: mainID, __: controls.__ || myView.__ })
            if (!approved) return
            
            // params
            toParam({ string: events[1], lookupActions: controls.lookupActions, e, id: mainID, mount: true, __: controls.__ || myView.__ })
            if (viewEventParams) toParam({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventParams, e, id: mainID, mount: true, __: controls.__ || myView.__ })
            
            if (controls.actions || controls.action) execute({ controls, e, id: mainID, __: controls.__ || myView.__ })
          }

          if (eventid === "droplist" || eventid === "actionlist" || eventid === "popup") setTimeout(_myFn, 100)
          else _myFn()
          
        }, timer)
      }

      if (!_view.element) return console.log(_view);
      // handler
      if (event.includes("touch") && !('ontouchstart' in window) && !(navigator.maxTouchPoints > 0) && !(navigator.msMaxTouchPoints > 0)) return;
      _view.element.addEventListener(event, myFn)
    })
  })
}

const defaultEventHandler = ({ id }) => {

  var view = window.views[id]
  var views = window.views
  view.touchstarted = false
  view.mouseentered = false
  view.mousedowned = false

  if (view.link && typeof view.link === "object" && view.link.preventDefault) view.element.addEventListener("click", (e) => { /*if (!view.link.link)*/ e.preventDefault() })

  // input
  if (view.type === "Input") {

    // focus
    var setEventType = (e) => {

      if (!window.views[id]) return e.target.removeEventListener("focus", setEventType)
      view.focused = true
    }

    view.element.addEventListener("focus", setEventType)

    // blur
    var setEventType = (e) => {

      if (!window.views[id]) return e.target.removeEventListener("blur", setEventType)
      view.focused = false
    }

    view.element.addEventListener("blur", setEventType)
  }
  
  var setEventType = (e) => { if (views[e.target.id]) views[e.target.id].mouseentered = true }
  view.element.addEventListener("mouseenter", setEventType)

  var setEventType = (e) => { if (views[e.target.id]) views[e.target.id].mouseentered = false }
  view.element.addEventListener("mouseleave", setEventType)
  
  var setEventType = (e) => { if (views[e.target.id]) views[e.target.id].mousedowned = true }
  view.element.addEventListener("mousedown", setEventType)

  var setEventType = (e) => { if (views[e.target.id]) views[e.target.id].mousedowned = false }
  view.element.addEventListener("mouseup", setEventType)

/*
  events.map((event) => {
    
    var setEventType = (e) => {

      if (!window.views[id]) return e.target.removeEventListener(event, setEventType)

      if (event === "mouseenter") view.mouseenter = true
      else if (event === "mouseleave") view.mouseenter = false
      else if (event === "mousedown") {

        view.mousedown = true
        window.views["tooltip"].element.style.opacity = "0"
        clearTimeout(global["tooltip-timer"])
        delete global["tooltip-timer"]

      } 
      else if (event === "mouseup") view.mousedown = false
      else if (event === "touchstart") view.touchstart = true
      else if (event === "touchend") view.touchstart = false
    }

    view.element.addEventListener(event, setEventType)
  })
*/
}

module.exports = { addEventListener, defaultEventHandler }

},{"./clone":42,"./execute":63,"./generate":70,"./toApproval":115,"./toArray":116,"./toCode":120,"./toParam":130,"./toValue":134}],62:[function(require,module,exports){
module.exports=[
  "mouseenter", "mouseleave",  "mouseover", "mousemove", "mousedown", "mouseup", "touchstart", 
  "touchend", "touchmove", "touchcancel", "click", "change", "focus", "blur", "keypress", "keyup", 
  "keydown", "scroll", "beforeLoading", "loaded", "controls", "children", "child", "change", "entry", 
  "enter", "longclick", "sibling", "siblings", "prevSiblings", "prevSibling", "unload", "undo", "storage",
  "resize", "redo", "popstate", "online", "offline", "message", "load", "languagechange",
  "error", "afterprint", "beforeprint", "beforeunload"
]
},{}],63:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const _method = require("./function")
const { toCode } = require("./toCode")
const { toAwait } = require("./toAwait")
const { toValue } = require("./toValue")
const { isParam } = require("./isParam")

const execute = ({ _window, lookupActions, awaits, controls, actions, e, id, params, __ }) => {

  var views = _window ? _window.views : window.views
  var view = views[id] || {}
  var global = window.global
  var _params = params, viewId = id

  if (controls) actions = controls.actions || controls.action

  // execute actions
  toArray(actions).map(_action => {

    _action = toCode({ _window, lookupActions, awaits, string: _action, e })
    _action = toCode({ _window, lookupActions, awaits, string: _action, e, start: "'", end: "'" })

    var awaiter = ""
    var approved = true
    var actions = _action.split("?")
    var params = actions[1]
    var conditions = actions[2]
    
    actions = actions[0].split(";")

    // approval
    if (conditions) approved = toApproval({ _window, lookupActions, awaits, string: conditions, params, id: viewId, e, __ })
    if (!approved) return toAwait({ id, lookupActions, awaits, e, params: _params, __ })

    // params
    params = toParam({ _window, lookupActions, awaits, string: params, e, id: viewId, executer: true, mount: true, __ })
    if (_params) params = {..._params, ...params}

    // break
    if (view["break()"]) delete view["break()"]
    if (view["return()"]) return delete view["return()"]

    actions.map(action => {

      if (action.includes("async():") || action.includes("wait():")) {
        
        var _actions = action.split(":").slice(1)
        action = _actions[0]
        params.awaiter = params.awaiter || ""
        if (_actions.slice(1)[0]) params.awaiter += `wait():${_actions.slice(1).join(":")}`
        params.asyncer = true
      }
      
      // action is coded
      if (action.slice(0, 7) === "coded()") return execute({ _window, lookupActions, awaits, actions: global.codes[action], e, id, params, __ })
      
      var name, caseCondition, timer = "", isInterval = false, actionid, args = action.split(':'), name = args[0], __params = {}

      if (isParam({ _window, lookupActions, awaits, string: args[1] }) || (args[2] && isNaN(args[2].split("i")[0]) && !args[3])) { // action:[params]:[conditions]

        __params = toParam({ _window, lookupActions, awaits, id: viewId, e, string: args[1], mount: true, __ })

        // break
        if (view["break()"]) delete view["break()"]
        if (view["return()"]) return delete view["return()"]

        actionid = toArray(__params.id || viewId) // id
        if (__params.timer !== undefined) timer = __params.timer.toString() // timer
        if (args[2]) caseCondition = args[2]

      } else { // action:id:timer:condition

        actionid = toArray(args[1] ? toValue({ _window, lookupActions, awaits, value: args[1], params, id: viewId, e, __ }) : viewId) // timer
        if (args[2]) timer = args[2] // timer
        if (args[3]) caseCondition = args[3] // conditions
      }

      // is interval
      if (timer.includes("i")) isInterval = params.isInterval = true
      timer = timer.split("i")[0]
      if (timer) timer = parseInt(timer)
      
      actionid = toArray(actionid).map(id => {
        if (typeof id === "object" && id.id) return id.id
        else return id
      })

      const myFn = () => {
        var approved = true

        // asyncer & awaiter
        var keys = name.split("."), isAwaiter, isAsyncer
        if (keys.length > 1) keys.map(k => {
  
          if (k === "async()") isAsyncer = true
          else if (k === "await()") {
            isAwaiter = true
            awaiter += action.split("await().")[1] + ";"
          }
        })

        if (isAwaiter || isAsyncer) name = name.split(".")[1]
        if (isAwaiter) return

        // case condition approval
        if (caseCondition) approved = toApproval({ _window, lookupActions, awaits, string: caseCondition, params, id: viewId, e, __ })
        if (!approved) return toAwait({ id, lookupActions, awaits, e, params, __ })
        
        if (_method[name]) actionid.map(async id => {
          
          if (typeof id !== "string") return

          // id = value.path
          if (id.indexOf(".") > -1) id = toValue({ _window, lookupActions, awaits, value: id, e, id: viewId, __ })
          
          // component does not exist
          if (!id || !views[id]) return

          if (isAsyncer) {
            params.awaiter = awaiter
            params.asyncer = isAsyncer
          }
          
          await _method[name]({ _window, lookupActions, awaits, ...params, ...__params, e, id })
          if (name !== "SEARCH" && name !== "save" && name !== "erase" && name !== "importJson" && name !== "upload" && name !== "wait") toAwait({ id, lookupActions, awaits, e, params, __ })
        })
      }

      if (timer || timer === 0) {

        if (view) {

          var _name = name.split('.')[1] || name.split('.')[0]
          if (isInterval) {
            myFn()
            view[`${_name}-timer`] = setInterval(() => myFn(), timer)
          } else view[`${_name}-timer`] = setTimeout(myFn, timer)

        } else {

          if (params["setInterval()"]) setInterval(myFn, timer)
          else setTimeout(myFn, timer)
        }

      } else myFn()
    })
  })
}

module.exports = { execute }

},{"./function":69,"./isParam":80,"./toApproval":115,"./toArray":116,"./toAwait":117,"./toCode":120,"./toParam":130,"./toValue":134}],64:[function(require,module,exports){
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
},{}],65:[function(require,module,exports){
const { toValue } = require("./function")

module.exports = {
    fileReader : ({ read: { file, reduce }, id, lookupActions }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, lookupActions, awaits, value: reduce, e })
        reader.readAsDataURL(file)
    }
}
},{"./function":69}],66:[function(require,module,exports){
(function (global){(function (){
const { isEqual } = require("./isEqual")
const { toArray } = require("./toArray")
const { compare } = require("./compare")
const { toOperator } = require("./toOperator")
const { clone } = require("./clone")

const filter = ({ filter = {}, id, e, ...params }) => {

  var view = window.views[id]
  if (!view) return

  var Data = filter.Data || view.Data
  var options = global[`${Data}-options`]
  if (!options) options = global[`${Data}-options`] = {}

  var path = toArray(filter.path)
  path = path.map(path => path.split("."))

  var backup = filter.backup
  var value = filter.value

  if (!value || isEqual(options.filter, value)) {

    options.filter = clone(value)
    data = backup

  } else {

    // reset backup filter options
    options.filter = clone(value)
    
      // remove spaces
    Object.entries(value).map(([k, v]) => value[k] = v.toString().split(" ").join("").toLowerCase())
    
    var data = []
    data.push(
      ...backup.filter(data => {
        return !Object.entries(value).map(([o, v]) => 
        compare(path
        .map(path => (path
        .reduce((o, k) => o[k], data) || '')
        .toString()
        .toLowerCase()
        .split(" ")
        .join("")
        )
        .join(""),
        toOperator(o), v))
        .join("")
        .includes("false")
      })
    )
  }
  
  global[Data] = data
  view.filter = { success: true, data }
}

module.exports = {filter}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./clone":42,"./compare":44,"./isEqual":79,"./toArray":116,"./toOperator":129}],67:[function(require,module,exports){
const focus = ({ id }) => {

  var view = window.views[id]
  if (!view) return

  var isInput = view.type === "Input" || view.type === "Textarea"
  if (isInput) view.element.focus()
  else {
    if (view.element) {
      let childElements = view.element.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = view.element.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].focus()

        var _view = window.views[childElements[0].id]
        // focus to the end of input
        var value = _view.element.value
        _view.element.value = ""
        _view.element.value = value

        return
      } else view.element.focus()
    }
  }

  // focus to the end of input
  var value = view.element.value
  view.element.value = ""
  view.element.value = value
}

module.exports = {focus}

},{}],68:[function(require,module,exports){
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { getCookie } = require("./cookie")
const { toArray } = require("./toArray")

const func = async ({ _window, lookupActions, awaits, myawait, id = "root", req, __, res, e, ...params }) => {
  
  const { toParam } = require("./toParam")
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id]
  var func = params.func || {}
  var headers = clone(func.headers || {})
  headers.project = headers.project || global.projectId

  headers["timestamp"] = (new Date()).getTime()
  headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

  delete func.headers
  if (!_window && getCookie()) func.cookies = getCookie()
  global.promises[id] = toArray(global.promises[id])
  
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (_window) {
    
    var myfn = func.actions || clone(global.data.project.functions[func.function])

    if (!myfn) return
    
    if (typeof myfn === "object") myfn = myfn._ || ""
    var _func = toCode({ _window, string: toCode({ _window, string: myfn }), start: "'", end: "'" })
    global.__waiters__.unshift(myawait.id)
    toParam({ _window, lookupActions, awaits, id, string: _func, req, res, __: [...(func.data ? [func.data] : []), ...__] })
    global.__waiters__.splice(0, 1)
    myawait.hold = false

    // await params
    if (awaits.findIndex(i => i.id === myawait.id) === 0) {
      
      if (myawait) {

        require("./toAwait").toAwait({ _window, lookupActions: myawait.lookupActions, id, e, asyncer: true, myawait, awaits, req, res,  __: [...(global.data ? [global.data] : []), ...__] })

      } else {

        awaits.splice(awaits.findIndex(i => i.id === myawait.id), 1)
        console.log(myawait.log)
      }
    }
    
  } else {
    
    global.promises[id].push(
      new Promise(async (resolve) => {

        console.log("Action execution requested!");
        
        var { data } = await require("axios").post(`/action`, func, {
          headers: {
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
            ...headers
          }
        })

        if (view) view.function = view.func = clone(data)
        global.function = global.func = clone(data)
  
        console.log(params.func, global.func, awaits, myawait)
        
        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions: myawait.lookupActions, myawait, awaits, id, e, ...params, req, res, __: [global.func, ...__] })
        resolve()
      })
    )
  }
}

module.exports = { func }
},{"./clone":42,"./cookie":47,"./toArray":116,"./toAwait":117,"./toCode":120,"./toParam":130,"axios":142}],69:[function(require,module,exports){
const {clearValues} = require("./clearValues")
const {clone} = require("./clone")
const {getParam} = require("./getParam")
const {isArabic} = require("./isArabic")
const {isEqual} = require("./isEqual")
const {merge} = require("./merge")
const {overflow} = require("./overflow")
const {toApproval} = require("./toApproval")
const {toComponent} = require("./toComponent")
const {toId} = require("./toId")
const {toParam} = require("./toParam")
const {jsonToBracket} = require("./jsonToBracket")
const {update, removeChildren} = require("./update")
const {toControls} = require("./toControls")
const {toArray} = require("./toArray")
const {generate} = require("./generate")
const {refresh} = require("./refresh")
const {axios} = require("./axios")
const {wait} = require("./wait")
const {toView} = require("./toView")
const {addEventListener} = require("./event")
const {execute} = require("./execute")
const {controls} = require("./controls")
const {setContent} = require("./setContent")
const {starter} = require("./starter")
const {setState} = require("./state")
const {setPosition} = require("./setPosition")
const {droplist} = require("./droplist")
const {createView} = require("./createView")
const {filter} = require("./filter")
const {remove} = require("./remove")
const {focus} = require("./focus")
const {sort} = require("./sort")
const {log} = require("./log")
const {search} = require("./search")
const {save} = require("./save")
const {erase} = require("./erase")
const {toValue} = require("./toValue")
const {reducer} = require("./reducer")
const {toStyle} = require("./toStyle")
const {preventDefault} = require("./preventDefault")
const {createComponent} = require("./createComponent")
const {getJsonFiles} = require("./jsonFiles")
const {createHtml} = require("./createHtml")
const {setData} = require("./setData")
const {defaultInputHandler} = require("./defaultInputHandler")
const {createActions} = require("./createActions")
const {blur} = require("./blur")
const {toAwait} = require("./toAwait")
const {note} = require("./note")
const {toCode} = require("./toCode")
const {isPath} = require("./isPath")
const {toNumber} = require("./toNumber")
const {capitalize} = require("./capitalize")
const {setElement} = require("./setElement")
const {toOperator} = require("./toOperator")
const {popup} = require("./popup")
const {keys} = require("./keys")
const {toggleView} = require("./toggleView")
const upload = require("./upload")
const {compare} = require("./compare")
const {toCSV} = require("./toCSV")
const {decode} = require("./decode")
const {route} = require("./route")
const {contentful} = require("./contentful")
const {importJson} = require("./importJson")
const {getDateTime} = require("./getDateTime")
const {insert} = require("./insert")
const {exportJson} = require("./exportJson")
const {switchMode} = require("./switchMode")
const {setCookie, getCookie} = require("./cookie")
const {getDaysInMonth} = require("./getDaysInMonth")
const {reload} = require("./reload")
const {nothing} = { nothing: () => {} }
const {fileReader} = require("./fileReader")
const {position, getPadding} = require("./position")
const {
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
} = require("./style")
const {resize, dimensions, lengthConverter} = require("./resize")
const {createData, clearData} = require("./data")

module.exports = {
  switchMode,
  refresh,
  nothing,
  getDaysInMonth,
  importJson,
  lengthConverter,
  getCookie,
  setCookie,
  position,
  getPadding,
  route,
  decode,
  contentful,
  reload,
  toCSV,
  compare,
  setElement,
  clearValues,
  clone,
  getJsonFiles,
  search,
  getParam,
  isArabic,
  isEqual,
  merge,
  overflow,
  addEventListener,
  setState,
  toApproval,
  toComponent,
  toId,
  toParam,
  fileReader,
  jsonToBracket,
  update,
  execute,
  removeChildren,
  toArray,
  generate,
  toView,
  controls,
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
  resize,
  dimensions,
  createData,
  setData,
  clearData,
  setContent,
  starter,
  createComponent,
  setPosition,
  droplist,
  filter,
  createView,
  createActions,
  blur,
  toAwait,
  exportJson,
  toControls,
  remove,
  defaultInputHandler,
  focus,
  sort,
  wait,
  log,
  save,
  erase,
  toCode,
  toValue,
  reducer,
  preventDefault,
  toStyle,
  createHtml,
  capitalize,
  note,
  isPath,
  toNumber,
  popup,
  getDateTime,
  keys,
  toOperator,
  upload,
  toggleView,
  insert,
  axios
}
},{"./axios":38,"./blur":39,"./capitalize":40,"./clearValues":41,"./clone":42,"./compare":44,"./contentful":45,"./controls":46,"./cookie":47,"./createActions":49,"./createComponent":50,"./createHtml":51,"./createView":53,"./data":55,"./decode":57,"./defaultInputHandler":58,"./droplist":59,"./erase":60,"./event":61,"./execute":63,"./exportJson":64,"./fileReader":65,"./filter":66,"./focus":67,"./generate":70,"./getDateTime":72,"./getDaysInMonth":73,"./getParam":74,"./importJson":76,"./insert":77,"./isArabic":78,"./isEqual":79,"./isPath":81,"./jsonFiles":82,"./jsonToBracket":83,"./keys":84,"./log":86,"./merge":88,"./note":89,"./overflow":90,"./popup":91,"./position":92,"./preventDefault":93,"./reducer":96,"./refresh":97,"./reload":98,"./remove":99,"./resize":100,"./route":101,"./save":102,"./search":104,"./setContent":105,"./setData":106,"./setElement":107,"./setPosition":108,"./sort":109,"./starter":110,"./state":111,"./style":112,"./switchMode":114,"./toApproval":115,"./toArray":116,"./toAwait":117,"./toCSV":118,"./toCode":120,"./toComponent":121,"./toControls":122,"./toId":127,"./toNumber":128,"./toOperator":129,"./toParam":130,"./toStyle":133,"./toValue":134,"./toView":135,"./toggleView":136,"./update":137,"./upload":139,"./wait":140}],70:[function(require,module,exports){
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const numbers = "1234567890"

const generate = (params = {}) => {

  var { length = 5, number } = params
  var result = "", chars = number ? numbers : characters

  var charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result
}

module.exports = {generate}

},{}],71:[function(require,module,exports){
module.exports = ({ el, id }) => {
  var view = window.views[id]
  el = el || view.element

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
},{}],72:[function(require,module,exports){
module.exports = {
    getDateTime: (time) => {
        
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
        
        return `${year}-${month}-${day}T${hrs}:${min}:${sec}`
    }
}
},{}],73:[function(require,module,exports){
module.exports = {
    getDaysInMonth: (stampTime) => {
        return new Date(stampTime.getFullYear(), stampTime.getMonth() + 1, 0).getDate()
    }
}
},{}],74:[function(require,module,exports){
const { toParam } = require("./toParam")

const getParam = ({ string, param, defValue }) => {

  if (!string) return defValue
  if (!string.includes("?")) return defValue

  string = string.split("/?").join("_question")
  string = string.split("?")[1]
  if (!string) return defValue

  string = string.split(";")
  string = string.find((el) => el.includes(param))
  if (!string) return defValue

  let params = toParam({ string })
  if (params[param]) value = params[param]

  return value
}

module.exports = {getParam}

},{"./toParam":130}],75:[function(require,module,exports){
const getType = (value) => {
  const { emptySpaces } = require("./toValue")

  if (typeof value === "boolean" || value === "true" || value === "false") return "boolean"
  if (typeof value === "object" && Array.isArray(value)) return "array"
  if (typeof value === "object") return "map"
  if (typeof value === "function") return "function"
  if (typeof value === "number" || (typeof value === "string" && !isNaN(value) && !emptySpaces(value))) {

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
},{"./toValue":134}],76:[function(require,module,exports){
const { toAwait } = require("./toAwait")

const getJson = (url) => {

    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", url, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

const importJson = ({ _window, id, e, __, ...params }) => {
    
    var global = _window ? _window.global : window.global
    global.import = {}
    var inputEl = document.createElement('input')
    inputEl.style.position = "absolute"
    inputEl.style.top = "-1000px"
    inputEl.style.left = "-1000px"
    inputEl.type = "file"
    inputEl.accept = "application/JSON"
    document.body.appendChild(inputEl)
    setTimeout(() => {

        inputEl.addEventListener("change", (event) => {
            
            var reader = new FileReader()
            reader.onload = (e) => {
                
                global.import.data = JSON.parse(e.target.result)
                toAwait({ _window, id, e, ...params, __: [global.import, ...__] })
            }

            global.import.files = [...event.target.files]
            global.import.file = global.import.files[0]
            
            reader.readAsText(event.target.files[0])
        })

        inputEl.click()
    }, 200)
}

module.exports = {importJson, getJson}
},{"./toAwait":117}],77:[function(require,module,exports){
const { clone } = require("./clone")
const { toView } = require("./toView")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

module.exports = {
  insert: async ({ _window, lookupActions, awaits, id, __, ...params }) => {
    
    var insert = params.insert, { index, value = {}, el, elementId, component, view, replace, path, data } = insert
    if (view) component = view

    var views = window.views, global = window.global, appendTo = (insert.id || insert.parent)
    if (appendTo && typeof appendTo === "object") appendTo = appendTo.id
    else if (!appendTo) appendTo = id

    var view = views[appendTo], lDiv
    
    if (index === undefined) {
      if (!view.length) {

        view.length = view.element.children.length || 0
        index = view.length
        view.length = view.length + 1

      } else {
        
        index = view.length
        view.length = view.length + 1
      }
    }
    
    if (component || replace) {

      var children = clone(component || replace)
      children.type = children.type || children.view
      
      // remove mapping
      if (children.type.slice(0, 1) === "[") {
        children.type = children.view = "View?" + toCode({ _window, string: children.type }).split("?").slice(1).join("?")
        //children.type = children.view = _type + "?" + children.type.split("?").slice(1).join("?")
      }
      
      // data
      if (data) {
        children.data = clone(data)
        children.Data = views[appendTo].Data || insert.Data || insert.doc || generate()
        global[children.Data] = children.data
      }

      // path
      if (path) children.derivations = (Array.isArray(path) ? path : typeof path === "number" ? [path] : path.split(".")) || []
      
      var innerHTML = await Promise.all(toArray(children).map(async (child, i) => {

        var id = child.id || generate()
        views[id] = child
        views[id].id = id
        views[id].index = i
        views[id].mapIndex = index
        views[id].parent = appendTo
        views[id].style = views[id].style || {}
        views[id].reservedStyles = /*toParam({ id, string: views[id].type.split("?")[1] || "" }).style ||*/ {}
        views[id].style.transition = null
        views[id].style.opacity = "0"
        views[id]["my-views"] = [...views[appendTo]["my-views"]]
        
        return await toView({ id, lookupActions, __: views[appendTo].__ })
      }))
      
      innerHTML = innerHTML.join("")
      lDiv = document.createElement("div")
      document.body.appendChild(lDiv)
      lDiv.style.position = "absolute"
      lDiv.style.opacity = "0"
      lDiv.style.left = -1000
      lDiv.style.top = -1000
      lDiv.innerHTML = innerHTML

      el = lDiv.children[0]
      views[el.id].parent = view.id

    } else {
      
      elementId = elementId || value.id || el && el.id
      el = el || value.el || views[elementId].el
    }

    if (index >= view.element.children.length) view.element.appendChild(el)
    else view.element.insertBefore(el, view.element.children[index])

    var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
    idList.map(id => setElement({ id, lookupActions }))
    idList.map(id => starter({ id, lookupActions }))
    
    views[el.id].style.transition = views[el.id].element.style.transition = (views[el.id].reservedStyles && views[el.id].reservedStyles.transition) || null
    views[el.id].style.opacity = views[el.id].element.style.opacity = (views[el.id].reservedStyles && views[el.id].reservedStyles.opacity) || "1"
    delete views[el.id].reservedStyles

    view.insert = global.insert = { view: views[el.id], message: "View inserted succefully!", success: true }
    
    if (lDiv) {

      document.body.removeChild(lDiv)
      lDiv = null
    }

    // await params
    if (params.asyncer) require("./toAwait").toAwait({ id, lookupActions, awaits, __: [view.insert, ...__], ...params })
  }
}
},{"./clone":42,"./generate":70,"./setElement":107,"./starter":110,"./toArray":116,"./toAwait":117,"./toCode":120,"./toView":135}],78:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[A-Za-z]/

const isArabic = ({ id, value, text }) => {

  var view = window.views[id]
  if (!view || !view.element) return
  text = text || value || view.element.value || view.element.innerHTML
  if (!text) return

  var isarabic = arabic.test(text)
  var isenglish = english.test(text)

  if (isarabic && !isenglish) {

    view.element.classList.add("arabic")
    view.element.style.textAlign = view.element.style.textAlign || "right"
    if (view.type !== "Input") view.element.innerHTML = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    else view.element.value = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    if (view["placeholder-ar"]) view.element.placeholder = view["placeholder-ar"]

  } else {

    if (view.element.className.includes("arabic")) view.element.style.textAlign = view.element.style.textAlign || "right"
    view.element.classList.remove("arabic")
    if (view["placeholder"]) view.element.placeholder = view["placeholder"]
  }

  return isarabic && !isenglish
}

module.exports = { isArabic }

},{}],79:[function(require,module,exports){
const isEqual = function(value, other) {
  // if (value === undefined || other === undefined) return false

  if ((value && !other) || (other && !value)) return false

  // string || boolean || number
  if (typeof value !== "object" && typeof other !== "object") {
    return value === other;
  }

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

},{}],80:[function(require,module,exports){
module.exports = {
  isParam: ({ _window, string }) => {
      
    if (typeof string !== "string") return false
    var global = _window ? _window.global : window.global
    if (string.slice(0, 7) === "coded()" && string.length === 12) string = global.codes[string]
// 
    if (string) if (string.includes("=") || string.includes(";") || string.includes("?") || string === "break()" || string === "return()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")
    || string.slice(0, 9) === "controls:" || string.slice(0, 9) === "children:" || string.slice(0, 6) === "child:" || string.slice(0, 9) === "siblings:" || string.slice(0, 8) === "sibling:" || string.slice(0, 12) === "prevSibling:") return true
    return false
  }
}
},{}],81:[function(require,module,exports){
module.exports = {
  isPath: ({ path }) => {
    path = path.split(".")

    if (path.length === 1 || path.length === 0) return false;
    else if (
      /\d/.test(path[0]) ||
      /\s/.test(path[0]) ||
      (path[1] && (path[1].includes("rem") || path[1].includes("px")))
    ) {
      return false;
    }
    return true;
  },
};

},{}],82:[function(require,module,exports){
const fs = require("fs")
const { toArray } = require("./toArray")
const { toOperator } = require("./toOperator")

var getJsonFiles = ({ search = {} }) => {
  
  var data = {},
  collection = search.collection, 
  doc = search.document || search.doc, 
  docs = search.documents || search.docs, 
  fields = search.fields || search.field, 
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
  doc = save.document || save.doc, 
  path = `database/${collection}`
  
  // create folder if it doesnot exist
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  fs.writeFileSync(`${path}/${doc}.json`, JSON.stringify(data, null, 2))
  return data
}

const removeJsonFiles = ({ erase = {} }) => {
  
  var collection = erase.collection, 
  docs = toArray(erase.document || erase.doc || erase.docs), 
  path = `database/${collection}`
  if (!fs.existsSync(path)) return

  // create folder if it doesnot exist
  docs.map(doc => fs.unlinkSync(`${path}/${doc}.json`))
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
},{"./toArray":116,"./toOperator":129,"fs":172}],83:[function(require,module,exports){
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

    } else if (typeof value === "string") string += `${key}=${value}`
    else string += `${key}=${value}`

    if (index < length - 1) string += ";"
  })

  return string || ""
}

module.exports = {jsonToBracket}

},{}],84:[function(require,module,exports){
module.exports = {
    keys: (object) => {
        return Object.keys(object)
    }
}
},{}],85:[function(require,module,exports){
const { generate } = require("./generate")
const { toStyle } = require("./toStyle")

module.exports = {
  labelHandler: ({ _window, tag, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]

    if (typeof view.label === "string") view.label = { text: view.label }
    if (!view.container) view.container = {}

    // container
    var containerId = view.container.id || generate()
    var container = views[containerId] = {id: containerId, index: view.index, class: `flex column ${view.container.class || ""}`, style: { gap: ".5rem", ...view.container.style }, parent: view.id}
    var containerStyle = toStyle({ _window, id: containerId })
    var containerAtts = Object.entries(view.container.att || view.container.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

    // label
    var labelId = view.label.id || generate()
    var label = views[labelId] = {id: labelId, index: 0, style: { fontSize: "1.3rem", textAlign: "left", ...view.label.style }, parent: containerId}
    var labelStyles = toStyle({ _window, id: labelId })
    var labelAtts = Object.entries(view.label.att || view.label.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")
    var labelTag = `<p ${labelAtts} ${label.editable || label.contenteditable ? "contenteditable ": ""}class='${label.class || ""}' id='${labelId}' style='${labelStyles}' index='0'>${view.label.text||""}</p>`

    // view
    view.parent = containerId
    view.index = 1
    
    return `<div ${containerAtts} ${container.draggable !== undefined ? `draggable='${container.draggable}'` : ''} spellcheck='false' ${container.editable && !container.readonly ? 'contenteditable' : ''} class='${container.class}' id='${containerId}' style='${containerStyle}' index='${container.index || 0}'>${labelTag}${tag}</div>`
  }
}
},{"./generate":70,"./toStyle":133}],86:[function(require,module,exports){
const log = ({ log }) => {
  console.log( log || 'here')
}

module.exports = {log}

},{}],87:[function(require,module,exports){
const { toArray } = require("./toArray")
const readFile = require("./readFile");

module.exports = {
    mail: async ({ _window, req, res, id, subject, content, text, html, recipient, attachments, recipients = [], __, ...params }) => {
        
        const { google } = _window.__PACKAGE__.googleapis
        const nodemailer = _window.__PACKAGE__.nodemailer
        const OAuth2 = google.auth.OAuth2;
        var data = req.body.data
        var global = _window.global
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
        console.log(global.mail)

        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, id, ...params, req, res, __: [global.mail, ...__] })
    }
}
},{"./readFile":95,"./toArray":116,"./toAwait":117}],88:[function(require,module,exports){
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

const override = (obj1, obj2) => {
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

},{"./clone":42,"./toArray":116}],89:[function(require,module,exports){
const { isArabic } = require("./isArabic")

const note = ({ note: _note }) => {

  var views = window.views
  var note = views["action-note"]
  var type = (_note.type || (_note.danger && "danger") || (_note.info && "info") || (_note.warning && "warning") || "success").toLowerCase()
  var noteText = views["action-note-text"]
  var backgroundColor = type === "success" 
  ? "#2FB886" : type === "danger" 
  ? "#F66358" : type === "info"
  ? "#47A8F5" : type === "warning"
  && "#FFA92B"
  
  if (!_note) return

  clearTimeout(note["note-timer"])

  noteText.element.innerHTML = _note.text
  isArabic({ id: "action-note-text" })

  var width = note.element.offsetWidth
  note.element.style.backgroundColor = backgroundColor
  note.element.style.left = `calc(50% - ${width/2}px)`
  note.element.style.opacity = "1"
  note.element.style.transition = "transform .2s"
  note.element.style.transform = "translateY(0)"

  const myFn = () => note.element.style.transform = "translateY(-200%)"

  note["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = { note }

},{"./isArabic":78}],90:[function(require,module,exports){
const overflow = ({ id }) => {

  var view = window.views[id]
  var width = view.element.clientWidth
  var height = view.element.clientHeight
  var text

  if (view.type === "Input" || view.type === "Textarea") {
    text = view.element.value
  } else if (
    view.type === "Text" ||
    view.type === "Label" ||
    view.type === "Header"
  ) {
    text = view.element.innerHTML
  } else if (view.type === "UploadInput") text = view.element.value

  // create a test div
  let lDiv = document.createElement("div")

  document.body.appendChild(lDiv)

  var pStyle = view.element.style
  var pText = view.data || view.input.value || ""
  var pFontSize = pStyle.fontSize

  if (pStyle != null) {
    lDiv.style = pStyle
  }

  lDiv.style.fontSize = pFontSize
  lDiv.style.position = "absolute"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.style.padding = pStyle.padding

  lDiv.innerHTML = pText

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  }

  document.body.removeChild(lDiv)
  lDiv = null

  var overflowX, overflowY
  
  if (width < lResult.width) overflowX = true
  if (height < lResult.height) overflowY = true

  return [overflowX, overflowY]
}

module.exports = {overflow}

},{}],91:[function(require,module,exports){
const popup = ({ id }) => {
  
}

module.exports = {popup}

},{}],92:[function(require,module,exports){
const { lengthConverter } = require("./resize")

const getPadding = (el) => {
    
    var padding = el.style.padding.split(" ")
    if (padding.length === 1) {
        return padding = {
            top: lengthConverter(padding[0]),
            right: lengthConverter(padding[0]),
            bottom: lengthConverter(padding[0]),
            left: lengthConverter(padding[0])
        }
    } else if (padding.length === 2) {
        return padding = {
            top: lengthConverter(padding[0]),
            right: lengthConverter(padding[1]),
            bottom: lengthConverter(padding[0]),
            left: lengthConverter(padding[1])
        }
    } else if (padding.length === 4) {
        return padding = {
            top: lengthConverter(padding[0]),
            right: lengthConverter(padding[1]),
            bottom: lengthConverter(padding[2]),
            left: lengthConverter(padding[3])
        }
    }
}

const position = (el1, el2) => {

    elPos1 = el1.getBoundingClientRect()
    elPos2 = el2.getBoundingClientRect()

    var el2padding = getPadding(el2)

    var top  = elPos1.top - elPos2.top - el2padding.top
    var left = elPos1.left - elPos2.left - el2padding.left
    
    return { top: Math.round(top), left: Math.round(left) }
}

module.exports = {
    position,
    getPadding
}
},{"./resize":100}],93:[function(require,module,exports){
const preventDefault = ({e}) => {
  e.preventDefault();
};

module.exports = {preventDefault};

},{}],94:[function(require,module,exports){
const { toParam } = require("./toParam")

module.exports = {
    print: async ({ id, options, ...params }) => {

        var mediaQueryList = window.matchMedia('print')

        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                // console.log('before print dialog open');
                if (options["before-print"]) toParam({ string: options["before-print"], id, mount: true })
            } else {
                // await params
                if (params.asyncer) require("./toAwait").toAwait({ id, ...params })
                if (options["after-print"]) toParam({ string: options["after-print"], id, mount: true })
            }
        })
        
        window.print()
    }
}   
},{"./toAwait":117,"./toParam":130}],95:[function(require,module,exports){
module.exports = (file) => new Promise(res => {

    var myFile = file.file || file.url
    if (typeof myFile === "string" && myFile.slice(0, 5) === "data:") res(myFile)
    else if (typeof file === "object" && file["readAsDataURL"]) res()
    else {
        let myReader = new FileReader()
        myReader.onloadend = () => res(myReader.result)
        myReader.readAsDataURL(file)
    }
})
},{}],96:[function(require,module,exports){
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
const actions = require("./actions.json")
const events = require("./events.json")
const { func } = require("./func")
const { decode } = require("./decode")

const reducer = ({ _window, lookupActions, awaits = [], id = "root", path, value, key, params = {}, object, __, e, req, res, mount, condition, toView, _object }) => {

    const { remove } = require("./remove")
    const { toValue, calcSubs, calcDivision, calcModulo } = require("./toValue")
    const { toParam } = require("./toParam")
    const { insert } = require("./insert")
    const { toFunction } = require("./toFunction")

    var views = _window ? _window.views : window.views
    var view = views[id], breakRequest, coded, mainId = id
    var global = _window ? _window.global : window.global

    if ((global.__actionReturns__[0] || {}).returned) return

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
            if (!answer) answer = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object })
        })
        return answer
    }

    // path[0] = path0:args
    var path0 = path[0] ? path[0].toString().split(":")[0] : "", args
    if (path[0] !== undefined) args = path[0].toString().split(":")

    if (isParam({ _window, string: pathJoined })) return toParam({ req, res, _window, lookupActions, awaits, id, e, string: pathJoined, __, object, mount, toView })
    
    if (path0.length === 14 && path0.slice(-2) === "()" && path0.slice(0, 7) === 'coded()') { // [actions?conditions]():[params]:[awaits]

        path0 = path0.slice(0, -2)
        var _await = "", myawait = { id: generate(), hold: true }
        if (args[2]) {

            _await = global.codes[args[2]]
            myawait = { id: generate(), hold: true, await: _await, action: "[...]()" }
            awaits.unshift(myawait)

            // push waiter id
            if (global.__waiters__.length > 0) myawait.waiter = global.__waiters__[0]
        }

        var _params = args[1] ? toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] }) : undefined

        global.__waiters__.unshift(myawait.id)
        console.log("ACTION", "[...]()");

            if (path0.includes('coded()') && path0.length === 12) path0 = global.codes[path0]

            var conditions = path0.split("?")[1]
            if (conditions) {
                var approved = toApproval({ _window, string: conditions, e, id, req, res, params, object, __ })
                if (!approved) {
                    myawait.hold = false
                    return global.__waiters__.splice(0, 1)
                }
            }

            //path0 = toCode({ _window, string: toCode({ _window, string: path0, start: "'", end: "'" })})
            path0 = path0.split("?")[0]
            _object = toValue({ _window, value: path0, e, id, req, res, object, asyncer: true, __, awaits, lookupActions })

            if (!condition) {
                
                // ex: [_]() & _ = 'action_name()' --> action_name()
                if (typeof _object === "string" && (isParam({ _window, string: _object }) || _object.includes(".") || _object.includes("()"))) {
                    _object = toCode({ _window, string: toCode({ _window, string: _object, start: "'", end: "'" }) })
                    _object = toValue({ _window, lookupActions, awaits, id, value: _object, key, params, object, __: [...(_params !== undefined ? [_params] : []), ...__], e, req, res, mount, condition, toView })
                }

            } else {
                _object = toApproval({ _window, string: _object, e, id, req, res, params, object, __: [...(_params !== undefined ? [_params] : []), ...__], awaits, lookupActions })
            }

            global.__waiters__.splice(0, 1)
            myawait.hold = false

            // await params
            if (!_await || awaits.findIndex(i => i.id === myawait.id) === 0) {
                
                if (_await) {

                    require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, myawait, awaits, req, res, __ })

                } else {

                    awaits.splice(awaits.findIndex(i => i.id === myawait.id), 1)
                    console.log({ action: "[...]()", data: _params, success: true, message: "Action executed successfully!", path: (lookupActions || {}).fn })
                }
            }

            
            path0 = (path[1] || "").split(":")[0]
            path.splice(0, 1)
    }

    if (path0.slice(-2) === "()" && path0.slice(-3) === ":()" && path0 !=="()") {

        var isFn = toFunction({ _window, lookupActions, awaits, id, req, res, __, e, path: [path[0]], path0, condition, mount, toView, object })
        if (isFn !== "__CONTINUE__") _object = isFn 
    }

    // division
    if (pathJoined.includes("/") && pathJoined.split("/")[1] !== "" && !key) {

      var _value = calcDivision({ _window, lookupActions, awaits, value: pathJoined, params, __, id, e, req, res, object, condition })
      if (_value !== value && _value !== undefined) return _value
    }

    // modulo
    if (pathJoined.includes("%") && pathJoined.split("%")[1] !== "" && !key) {

      var _value = calcModulo({ _window, lookupActions, awaits, value: pathJoined, params, __, id, e, req, res, object, condition })
      if (_value !== value && _value !== undefined) return _value
    }

    // multiplication
    if (pathJoined.includes("*") && !key) {

        var values = pathJoined.split("*").map(value => toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, mount }))
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
        
        return toValue({ req, res, _window, lookupActions, awaits, id, e, value: pathJoined.slice(0, -2)+"1", __, object, mount, condition })
  
      } else {
  
        var values = pathJoined.split("+").map(value => toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object }))
        var answer = values[0]
        values.slice(1).map(val => answer += val)
        return answer
      }
    }

    // subtraction
    if (pathJoined.includes("-") && !key) {
  
      var _value = calcSubs({ _window, lookupActions, awaits, value: pathJoined, params, __, id, e, req, res, object })
      if (_value !== pathJoined) return _value
    }

    // if
    if (path0 === "if()") {
        
      var approved = toApproval({ _window, lookupActions, awaits, e, string: args[1], params, id, __, req, res, object })

      if (!approved) {
          
        if (args[3]) {

            if (condition) return toApproval({ _window, lookupActions, awaits, e, params, string: args[3], id, __, req, res, object })
            if (path[1]) _object = toValue({ req, res, _window, lookupActions, awaits, id, value: args[3], params, __, e, object, mount, toView })
            else return toValue({ req, res, _window, lookupActions, awaits, id, value: args[3], params, __, e, object, mount, toView })
        }

        if (path[1] && path[1].includes("else()")) {

          if (path[2]) _object = toValue({ req, res, _window, lookupActions, awaits, id, value: path[1].split(":")[1], params, __, e, object, mount })
          else return toValue({ req, res, _window, lookupActions, awaits, id, value: path[1].split(":")[1], params, __, e, object, mount })

        } else if (path[1] && (path[1].includes("elseif()") || path[1].includes("elif()"))) {

            var _path = path.slice(2)
            _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
            return reducer({ _window, lookupActions, awaits, id, value, key, path: _path, params, object, __, e, req, res, mount, condition })

        } else if (!path[1]) return
        
        path.shift()
        path0 = path[0].split(":")[0] || ""
        args = path[0].split(":")

      } else {
        
        if (condition) return toApproval({ _window, lookupActions, awaits, e, params, string: args[2], id, __, req, res, object, toView })
        if (path[1]) _object = toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e, object, mount, toView })
        else return toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e, object, mount, toView })

        path.shift()
        while (path[0] && (path[0].includes("else()") || path[0].includes("elseif()") || path[0].includes("elif()"))) {
            path.shift()
        }
        if (path[0]) {
            path0 = path[0].split(":")[0] || ""
            args = path[0].split(":")
        } else return _object
      }
    }
    
    // global
    if (path0 === ")(") {

        if (args[2]) {
            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, lookupActions, awaits, id, path, value, key, params, object, __, e, req, res }), _timer)
        }

        var state = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __, object })
        if (state === undefined) state = args[1]
        if (state) path.splice(1, 0, state)
        path0 = path[0] = "global()"

    } else if (path0 && args[1] === "()" && !args[2]) {

        var state = toValue({ req, res, _window, id, e, value: args[0], params, __ })

        // state:()
        if (path.length === 1 && key && state) return global[state] = value
        
        if (state) path.splice(1, 0, state)
        path[0] = path0 = "global()"
    }
    
    var view
    // view => ():id
    if (path0 === "()") {
        
        if (args[1]) {

            // id
            var _id = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __, object })
            if (_id || args[1]) view = views[_id || args[1]]
            path[0] = path0 = "()"
            _object = views[_id || id]
        }
    }

    if (path[0] === "" && path.length > 1 && _object === undefined) {
        if (isNaN(path[1].charAt(0)) || path[1].includes("()")) {
            path.splice(0, 1)
            _object = object || view
        } else return path.join(".")
    }

    if (!view) view = views[id]

    // while
    if (path0 === "while()") {
            
      while (toApproval({ _window, lookupActions, awaits, e, string: args[1], id, __, req, res, object })) {
        toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e, object, mount, toView })
      }
      // path = path.slice(1)
      return global.return = false
    }

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

            if (__o.labeled && __o.templated) path = ["parent()", "parent()", ...path]
            else if ((__o.labeled && !__o.templated) || __o.templated || __o.link) path.unshift("parent()")

        } else if (__o && path0 === "txt()" || path0 === "val()" || path0 === "min()" || path0 === "max()") {
            
            if (__o.islabel || __o.templated || __o.link || __o.labeled) path.unshift("input()")
        }
      }
    }
    
    // assign reserved vars
    var reservedVars = {
        keys: ["()", "global()", "e()", "console()", "document()", "window()", "history()", "navigator()", "request()", "response()", "math()"],
        "()": view || views[id],
        "global()": _window ? _window.global : window.global,
        "e()": e,
        "console()": console,
        "document()": _window ? {} : document,
        "window()": _window || window,
        "history()":_window ? {} :  history,
        "navigator()": _window ? {} : navigator,
        "request()": req,
        "response()": res,
        "math()": Math
    }

    var reservedVar = false
    var underScored0 = path0.charAt(0) === "_" && !path0.split("_").find(i => i !== "_" && i !== "")
    if (reservedVars.keys.includes(path0) || underScored0) {
        
        if (reservedVars.keys.includes(path0)) _object = reservedVars[path0]
        else _object = __[path0.split("_").length - 2]

        path.splice(0, 1)
        reservedVar = true

    } else _object = _object !== undefined ? _object : object

    if (_object === undefined && !reservedVar) {

        if (path[0]) {

            if (path0 === "undefined") return undefined
            else if (path0 === "false") return false
            else if (path0 === "true") return true
            else if (path0 === "desktop()") return global.device.device.type === "desktop"
            else if (path0 === "tablet()") return global.device.device.type === "tablet"
            else if (path0 === "mobile()") return global.device.device.type === "phone"
            else if (path0 === "clicked()") _object = global["clicked()"]
            else if (path0 === "log()") {

                var _log = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, awaits, id, value: arg || "here", params, __, e, object }))
                console.log(..._log)
                path = path.slice(1)
                path0 = (path[1] || "").split(":")[0]
            }

            else if (path0.slice(0, 7) === "coded()" && path[0].length === 12) {

                // coded = true
                _object = toValue({ req, res, _window, lookupActions, awaits, object, id, value: global.codes[path0], params, __, e })
            }
            
            else if (path0 === "today()") _object = new Date()
            else if (path0 === "_array" || path0 === "_list" || (!path0 && path[0].charAt(0) === ":")) {

                _object = []
                path[0].split(":").slice(1).map(el => {

                    if (isParam({ _window, string: el })) el = toParam({ req, res, _window, id, e, __, string: el })
                    else el = toValue({ req, res, _window, id, __, e, value: el, params })
                    _object.push(el)
                })
            } 
            
            else if (path0 === "" || path0 === "_string") _object = ""
            else if (path0 === "_map") {

                var __object = {}
                if (isParam({ _window, string: args[1] })) {

                  return args.slice(1).map(arg => reducer({ _window, lookupActions, awaits, id, params, path: arg, object: __object, e, req, res, __, mount }))

                } else {

                  var args = path[0].split(":").slice(1)
                  args.map((arg, i) => {

                      if (i % 2) return
                      var f = toValue({ req, res, _window, id, __, e, value: arg, params })
                      var v
                    if (isParam({ _window, string: args[i + 1] })) v = toParam({ req, res, _window, id, e, __, string: args[i + 1]/*, object*/ })
                      else v = toValue({ req, res, _window, id, __, e, value: args[i + 1], params, object })
                      if (v !== undefined) __object[f] = v

                  })
                }
            }
            
            else if (mount) {
                _object = view
                path.unshift("()")
            }
        }

        if (_object || _object === "" || _object === 0/* || coded*/) path = path.slice(1)
        else {
            if (actions.includes(path0)) {
                _object = view
            } else if (path[1] && path[1].toString().includes("()")) {
                
                _object = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: path[0], params }) || {}//path[0]
                path = path.slice(1)

            } else return pathJoined//return decode({ _window, lookupActions, awaits, string: pathJoined })
        }
    }
    
    var lastIndex = path.length - 1, k0
    var answer = path.reduce((o, k, i) => {
        
        if (k === undefined) console.log(view, id, path)

        k = k.toString()
        k0 = k.split(":")[0]
        var args = k.split(":");

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
                    if (!answer) answer = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: arg, params, __, e })
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
            
            var _log = args.slice(1).map(arg => toValue({ req, res, _window, lookupActions, awaits, id, e, __: tolog ? [tolog, ...__] : __, value: arg, object: o }))

            console.log(..._log)
            return o
        }

        if ((o === undefined || o === null) && k0 !== "push()") return o

        /*if (path0.slice(-2) === "()" && typeof o === "object" && !Array.isArray(o) && o.__view__ && o.functions[path0.slice(-2)]) {

            return toFunction({ _window, lookupActions, awaits, id: o.id, req, res, __, e, path: [k], path0: k0, condition, params, mount, toView, object })
        }*/

        // push() with undefined
        /*if (path[i+1] === "push()" && !isNaN(toValue({ req, res, _window, id, e, __, value: k0 })) && o[toValue({ req, res, _window, id, e, __, value: k0 })] === undefined) {
            breakRequest = i + 1
            o[k0] = []
            o[k0].push
        }*/
        
        if (k0 !== "data()" && k0 !== "Data()" && k0 !== "doc()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: k, params })
            
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
                var myparam = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
                delete o[myparam]
            }

            return o
            
        } else if (k0 === "while()") {
            
            while (toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })) {
                toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e })
            }
            
        } else if (underScored && !k00) { // _ || __ || ___ ...
            
            if (o.__view__) return o.__[underScored - 1]
            if (value !== undefined && key && i === lastIndex) answer = o[__[underScored - 1]] = value
            else if (typeof o === "object") answer = o[__[underScored - 1]]

        } /*else if (k0 === "_" && _ !== undefined) {
          
            if (o.__view__) return o._
            if (value !== undefined && key && i === lastIndex) answer = o[_] = value
            else if (typeof o === "object") answer = o[_]

        } else if (k0 === "__" && __ !== undefined) {
            
            if (o.__view__) return o.__
            if (value !== undefined && key && i === lastIndex) answer = o[__] = value
            else if (typeof o === "object") answer = o[__]

        } else if (k0 === "___" && ___ !== undefined) {
            
            if (o.__view__) return o.___
            if (value !== undefined && key && i === lastIndex) answer = o[___] = value
            else if (typeof o === "object") answer = o[___]

        } else if (k0 === ")(") {

            var _state = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            answer = global[_state]

        } */else if ((k0.slice(0, 7) === "coded()" && k.length === 12) || (k0.slice(0, 8) === "codedS()" && k.length === 13)) {
            
            var _coded
            if (k0.slice(0, 7) === "coded()") _coded = toValue({ req, res, _window, lookupActions, awaits, id, e, value: global.codes[k], params, __ })
            else if (k0.slice(0, 8) === "codedS()") _coded = global.codes[k]

            if (typeof _coded !== "object") {
                if (i === lastIndex && key && value !== undefined) answer = o[_coded] = value
                else if (key && value !== undefined && o[_coded] === undefined) {
                
                    if (!isNaN(toValue({ req, res, _window, lookupActions, awaits, id, value: path[i + 1], params, __, e }))) answer = o[_coded] = []
                    else answer = o[_coded] = {}
                }
                else answer = o[_coded]
            } else answer = _coded
            
            /*
            _coded = _coded !== undefined ? [...toArray(_coded), ...path.slice(i + 1)] : path.slice(i + 1)
            answer = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: _coded, object: o, params, __ })
            */
            
        } else if (k0 === "data()") {

            var _o = o.type ? o : view
            var _params = {}
            
            if (!o) return
            if (_o.type) breakRequest = true

            if (args[1]) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })

            // just get data()
            if (!_o.derivations) {

              var _path = _params.path || views[id].derivations || []
              var _data 
              if (_params.data) _data = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: _params.path || views[id].derivations, object: _params.data || global[views[id].Data], params, __ })
              else {
                
                _path.unshift(`${views[id].Data}:()`)
                _data = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: _path, object, params, __ })
              }
              return answer = _o[_data]
            }

            if (_params.path) return answer = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: _params.path, object: _params.data || object, params, __ })
            var _derivations = _params.path || _o.derivations || []

            if (path[i + 1] !== undefined) {

                //if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, lookupActions, awaits, id, value: global.codes[path[i + 1]], params, __, e })
                if (!_o.Data) return
                var _path = [..._derivations, ...path.slice(i + 1)]
                _path.unshift(`${_o.Data}:()`)
                answer = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: _path, object, params, __ })

            } else {
                var _path = [..._derivations]
                _path.unshift(`${_o.Data}:()`)
                answer = reducer({ req, res, _window, lookupActions, awaits, id, value, key: path[i + 1] === undefined ? key : false, path: _path, object, params, __, e })
            }
            
        } else if (k0 === "Data()" || k0 === "doc()") {

            var _path = args[1], _Data

            breakRequest = true
            if (o.derivations) _Data = o.Data
            else _Data = views[id].Data

            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: _path })
                    _path = _params.path || _params.derivations || []
                    if (typeof _path === "string") _path = _path.split(".")

                    return answer = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: [`${_Data}:()`, ..._path, ...path.slice(i + 1)], object, params, __ })
                }

                if (_path.slice(0, 7) === "coded()") _path = global.codes[_path]
                _path = toValue({ req, res, _window, lookupActions, awaits, id, value: _path, params, __, e })
                if (typeof _path === "string") _path = _path.split(".")

                return answer = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: [`${_Data}:()`, ..._path, ...path.slice(i + 1)], object, params, __ })
            }

            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, lookupActions, awaits, id, value: global.codes[path[i + 1]], params, __, e })
                answer = reducer({ req, res, _window, lookupActions, awaits, id, e, value, key, path: [`${_Data}:()`, ...path.slice(i + 1)], object, params, __ })

            } else answer = global[_Data]

        } else if (k0 === "removeAttribute()") {

            var _o, _params
            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
            else _params = { att: toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] }) }

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

            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
            _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[_o.parent].element
            
            if (!element.nextElementSibling || !element.nextElementSibling.nextElementSibling) return
            var nextSibling = element.nextElementSibling.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]
            
        } else if (k0 === "3rdNext()" || k0 === "3rd()" || k0 === "3rdNextSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[_o.parent].element
            
            if (!element.nextElementSibling || !element.nextElementSibling.nextElementSibling || !element.nextElementSibling.nextElementSibling.nextElementSibling) return
            var nextSibling = element.nextElementSibling.nextElementSibling.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]
            
        } else if (k0 === "nextSiblings()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (Array.isArray(_o)) return answer = _o[_o.length - 1]
            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (Array.isArray(_o)) {

              if (value !== undefined && key) answer = _o[_o.length - 1] = value
              answer = _o[_o.length - 1]

            } else if (_o.type && _o.id) {

              var element = _o.element
              // if (_o.templated || _o.link) element = views[o.parent].element
              var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
              var _id = lastSibling.id
              answer = views[_id]
            }

        } else if (k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (Array.isArray(_o)) return answer = _o[_o.length - 2]
            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = views[_id]
            
        } else if (k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var _o, _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var element = _o.element
            // if (_o.templated || _o.link) element = views[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = views[_id]

        } else if (k0 === "prev()" || k0 === "prevSibling()" || k0 === "1stPrev()") {

          var _o, _params = {}
          if (args[1]) {

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
          } else _o = o

          if (typeof _o === "string" && views[_o]) _o = views[_o]

          var element, _el = _o.element
          // if (_o.templated || _o.link) _el = views[_o.parent]
          
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
          } else _o = o

          if (typeof _o === "string" && views[_o]) _o = views[_o]

          var _element, _el = _o.element, previousSibling
          // if (_o.templated || _o.link) _el = views[_o.parent]
          
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
          } else _o = o

          if (typeof _o === "string" && views[_o]) _o = views[_o]

          var _element, _el = _o.element, previousSibling
          // if (_o.templated || _o.link) _el = views[_o.parent]
          
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
            _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
                var _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
                if (typeof _o === "object") _id = _o.id
                else if (typeof _o === "string") _id = _o
            }

            toParam({ req, res, _window, lookupActions, awaits, id: _id, e, __, string: `style().display=flex` })
            
        } else if (k0 === "hide()") {

            var _i
            if (typeof o === "object") _id = o.id
            else if (typeof o === "string") _id = o

            if (args[1]) {
                var _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
                if (typeof _o === "object") _id = _o.id
                else if (typeof _o === "string") _id = _o
            }

            toParam({ req, res, _window, lookupActions, awaits, id: _id, e, __, string: `style().display=none` })
            
        } else if (k0 === "style()") { // style():key || style():[key=value;id||el||view||element]
            
            var _o, _params = {}
            
            if (args[1]) {
                  
              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              else _params = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

            var { view: _view, id: _id, el: _el, element: _element, ...__params} = _params

            if (Object.keys(__params).length > 0) {

              Object.entries(__params).map(([key, value]) => {
                  answer[key] = value
              })
            }
            
        } else if (k0 === "qr()") {

            if (res && !res.headersSent) {

                var params = isParam({ _window, string: args[1] }) ? toParam({ req, res, _window, id, e, __, string: args[1] }) : toValue({ req, res, _window, id, e, __, value: args[1] })
                if (typeof params !== "object") params = { data: params }
                if (params.text && params.data === undefined) params.data = params.text
                if (params.wifi && params.password && (params.ssid || params.name)) params.data = `WIFI:S:${params.name || params.ssid};T:${params.type || "WPA"};P:${params.password || ""};;${params.url || ""}` 
                
                require('qrcode').toDataURL(params.data).then(data => {

                    var _params = { message: "QR generated successfully!", data, success: true }
                    toParam({ req, res, _window, id, e, __: [...(_params || []), ...__], string: args[2] })
                })
            }

        } else if (k0 === "contact()") {

            if (res && !res.headersSent) {
                
                var data = toValue({ req, res, _window, id, e, __, string: args[1] })
                if (typeof data !== "obejct") return o

                if (data.firstName && data.lastName && data.workPhone) {

                    // create a new vCard
                    const vCard = require("vcards-js")();
                
                    vCard.firstName = data.firstName || "";
                    vCard.middleName = data.middleName || "";
                    vCard.lastName = data.lastName || "";
                    vCard.organization = data.organization || "";
                    if (data.photo) vCard.photo.attachFromUrl(data.photo)
                    if (data.logo) vCard.logo.attachFromUrl(data.logo)

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
                
                    res.set('Content-Type', `text/vcard; name="${(data.firstName || "") + " " + (data.lastName || "")}.vcf"`);
                    res.set('Content-Disposition', `inline; filename="${(data.firstName || "") + " " + (data.lastName || "")}.vcf"`);
                    
                    res.send(vCard.getFormattedString())
                }
                
            } else func({ _window, id, e, func: { actions: decode({ _window, string: k }) }, __, asyncer: true, awaits, myawait, lookupActions })

        } else if (k0 === "jsonToBracketCode()") {

            if (typeof o === "object") answer = require("./jsonToBracket").jsonToBracket(o)

        } else if (k0 === "getTagElements()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

          } else if (k0 === "getTagElement()") {
          
            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]

          } else if (k0 === "getTags()" || k0 === "tags()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => views[o.id])

          } else if (k0 === "getTag()" || k0 === "tag()") {
          
            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]
            answer = window.views[answer.id]

        } else if (k0 === "getInputs()" || k0 === "inputs()") {
            
            var _input, _textarea, _editables, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) {

                _input = _o.getElementsByTagName("INPUT")
                _textarea = _o.getElementsByTagName("TEXTAREA")

            } else {

                _input = _o.element && _o.element.getElementsByTagName("INPUT")
                _textarea = _o.element && _o.element.getElementsByTagName("TEXTAREA")
                _editables = getDeepChildren({ _window, lookupActions, awaits, id: _o.id }).filter(view => view.editable)
                if (_o.editable) _editables.push(_o)
            }
            answer = [..._input, ..._textarea, ..._editables].map(o => views[o.id])

        } else if (k0 === "getInput()" || k0 === "input()") {
            
            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            if (_o.nodeType === Node.ELEMENT_NODE) __o = views[_o.id]
            else __o = _o

            if (!__o) return
            if (__o.type !== "Input") {
                if (__o.element.getElementsByTagName("INPUT")[0]) answer = views[__o.element.getElementsByTagName("INPUT")[0].id]
                else if (__o.element.getElementsByTagName("TEXTAREA")[0]) answer = views[__o.element.getElementsByTagName("TEXTAREA")[0].id]
                else {
                    var deepChildren = getDeepChildren({ _window, lookupActions, awaits, id:__o.id })
                    if (__o.editable || deepChildren.find(view => view.editable)) {
                        answer = __o.editable ? __o : deepChildren.find(view => view.editable)
                    } else return
                }
            } else answer = __o

        } else if (k0 === "getEntry()" || k0 === "entry()") {
            
            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
            return lengthConverter(toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }))
          }
          return lengthConverter(o)

        } else if (k0 === "touchable()") {

          if (_window) {
            
            return req.device.type === "phone" || req.device.type === "tablet"
 
          } else return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));

        }/*else if (k0 === "position()") {

            var args = k.split(":")
            var relativeTo = views["root"].element
            if (args[1]) 
                relativeTo = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            answer = position(o, relativeTo)

        } *//*else if (k0 === "getBoundingClientRect()") {

            var relativeTo
            if (args[1]) relativeTo = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            else relativeTo = o
            if (typeof relativeTo === "object") relativeTo = o.element
            answer = relativeTo.getBoundingClientRect()

        } */else if (k0 === "getChildrenByClassName()" || k0 === "className()") {
            
            var className, _params = {}, _o
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || o
                className = _params.className || _params.class

            } else {
              className = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
            var _name = toValue({ req, res, _window, id, e, __, value: args[1] })
            if (_o.__viewName__ === _name) return _o
            else {
                var children_ = getDeepChildren({ _window, id: _o.id })
                return children_.find(child => child.__viewName__ === _name)
            }

        } else if (k0 === "names()") {

            var _o
            if (o.__view__) _o = o
            else _o = views[id]
            var _name = toValue({ req, res, _window, id, e, __, value: args[1] }), _views_ = []
            if (_o.__viewName__ === _name) _views_.push(_o)
            else {
                var children_ = getDeepChildren({ _window, id: _o.id })
                _views_.push(...children_.filter(child => child.__viewName__ === _name))
            }
            return _views_

        } else if (k0 === "classlist()" || k0 === "classList()") {
            
            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
            if (args[1]) className = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            
            if (className && o.element) answer = [...o.element.getElementsByClassName(className)]
            else answer = []

            answer = answer.map(el => views[el.id])
            if ([...o.element.classList].includes(className)) answer.unshift(o)

        } else if (k0 === "toInteger()") {

            var integer
            if (args[1]) integer = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            else integer = o
            answer = Math.round(toNumber(integer))

        } else if (k0 === "click()") {
            
          if (_window) return view.controls.push({
            event: `loaded?${pathJoined}`
          })

          var _params = {}, _o
          if (args[1]) {

              if (isParam({ _window, string: args[1] })) {

                  _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                  _o = _params.view || _params.id || _params.el || _params.element || o

              } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
              
          } else _o = o.__view__ ? o : views[id]
          
          if (typeof _o === "string" && views[_o]) views[_o].element.q()
          else if (_o.nodeType === Node.ELEMENT_NODE) _o.click()
          else if (typeof _o === "object" && _o.element) _o.element.click()

        } else if (k0 === "dblclick()") {
            
          if (_window) return view.controls.push({
            event: `loaded?${pathJoined}`
          })
            
            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o
            
            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            _o.element.blur()

        } else if (k0 === "axios()") {

            var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
            require("./axios").axios({ id, lookupActions, awaits, e, __, params: _params })

        } else if (k0 === "getElementById()") {

            var _params = {}, _od
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.element || o
                    _id = _params.id

                } else _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            } else _o = o
            
            answer = _o.getElementById(_id)

        } else if (k0 === "mousedown()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                  _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                  _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                  _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else {
                  _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                  _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                  _o = _params.view || _params.el || _params.id || _params.element || o

              } else {
                _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.view || _params.el || _params.id || _params.element || o

            } else {
              _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
              _o = views[_id]
            }

        } else _o = o

        if (typeof _o === "string" && views[_o]) _o = views[_o]

        var keyupevent = new Event("keydown")

        if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(keyupevent)
        else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(keyupevent)

    } else if (k0 === "device()") {

            answer = global.device.type

        } else if (k0 === "mobile()" || k0 === "phone()") {

            answer = global.device.type === "phone"

        } else if (k0 === "desktop()") {

            answer = global.device.type === "desktop"

        } else if (k0 === "tablet()") {

            answer = global.device.type === "tablet"

        } else if (k0 === "installApp()") {

          const installApp = async () => {

            global["installApp"].prompt();
            const { outcome } = await global["installApp"].userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
          }

          installApp()

        } else if (k0 === "clearTimeout()" || k0 === "clearTimer()") {

            var _params = {}, _o, _timer
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _timer = _params.timer

                } else {
                    return args.slice(1).map(arg => { 

                        _timer = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: arg, params })
                        clearTimeout(_timer)
                    })
                }
            } else _timer = o
            
            clearTimeout(_timer)
            
        } else if (k0 === "clearInterval()") {

            var _params = {}, _onterval
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _interval = _params.interval

                } else {
                    return args.slice(1).map(arg => { 

                        _timer = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: arg, params })
                        clearInterval(_timer)
                    })
                }
            } else _interval = o
            
            answer = clearInterval(_interval)
            
        } else if (k0 === "interval()") {
            
            if (!isNaN(toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e }))) { // interval():params:timer

              var _timer = parseInt(toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e }))
              var myFn = () => toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], mount: true })
              answer = setInterval(myFn, _timer)
              
            } else if (isParam({ _window, string: args[1] }) && !args[2]) { // interval():[params;timer]

              var _params
              _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], mount: true })
              var myFn = () => toValue({ req, res, _window, lookupActions, awaits, id, value: _params.params || _params.parameters, params, __, e })
              answer = setInterval(myFn, _params.timer)
            }

            if (o.type && o.id) o[generate() + "-timer"] = answer

        } else if (k0 === "repeat()") {

            var _data_ = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e, object })
            var times = toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e, object })
            var loop = []
            for (var i = 0; i < times; i++) {
                loop.push(_data_)
            }
            return loop

        } else if (k0 === "timer()" || k0 === "setTimeout()") {
            
            // timer():params:timer:repeats
            var _timer = args[2] ? parseInt(toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e, object })) : 0
            var _repeats = args[3] ? parseInt(toValue({ req, res, _window, lookupActions, awaits, id, value: args[3], params, __, e, object })) : false
            var myFn = () => { toParam({ req, res, _window, lookupActions, awaits, id, string: args[1], params, __, e, object, toView }) }
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

            var _path = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            if (typeof _path === "string") _path = _path.split(".")
            _path = [..._path, ...path.slice(i + 1)]
            answer = reducer({ req, res, _window, lookupActions, awaits, id, path: _path, value, key, params, object: o, __, e })
            
        } */else if (k0 === "pop()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            else _o = o

            _o.pop()
            answer = _o
            
        } else if (k0 === "shift()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            else _o = o

            _o.shift()
            answer = _o

        } else if (k0 === "slice()") { // slice by text or slice by number

            if (!Array.isArray(o) && typeof o !== "string" && typeof o !== "number") return
            var _start, _end, _params

            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.object || _params.map || o
                _start = _params.start
                _end = _params.end

            } else {

                _start = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __, object })
                _end = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[2], params, __, object })
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

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })

                } else _params.path = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
            }

            answer = reducer({ _window, lookupActions, awaits, id, path: _params.path, object: o, e, req, res, __, mount, key: _params.value !== undefined ? true : key, value: _params.value !== undefined ? _params.value : value })
          
        } else if (k0 === "derivations()" || k0 === "path()") {

            var _params = {}
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })

                } else _params.path = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
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
                el = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: el, params })
                answer.push(el)
            })

        } else if (k0 === "_map") {
            
            answer = {}
            if (isParam({ _window, string: args[1] })) {

              return args.slice(1).map(arg => reducer({ _window, lookupActions, awaits, id, params, path: arg, object: answer, e, req, res, __, mount }))
            } else {

              k.split(":").slice(1).map((el, i) => {

                  if (i % 2) return
                  var f = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: el, params })
                  var v = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args[i + 1], params })
                  if (v !== undefined) answer[f] = v
              })
            }

        } else if (k0 === "_semi" || k0 === ";") {
  
            answer = o + ";"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_quest" || k0 === "?") {
            
            answer = o + "?"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_dot" || k0 === ".") {

            answer = o + "."
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_space" || k0 === " ") {

            answer = o = o + " "
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_equal" || k0 === "=") {
            
            answer = o + "="
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_comma" || k0 === ",") {
            
            answer = o + ","
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, lookupActions, awaits, id, __, e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "return()") {

            global.__actionReturns__[0].value = answer = toValue({ _window, value: args[1], e, id, object, __, awaits, lookupActions })
            global.__actionReturns__[0].returned = true
            
        } else if (k0 === "reload()") {

            document.location.reload(true)
            
        } else if (k0 === "same()" || k0 === "isSame()") {

            var _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next === o
            
        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next !== o
            
        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o) || _next === o
            
        } else if (k0 === "contains()" || k0 === "contain()") {
            
            var _first, _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e })
            if (!_next) return
            if (_next.nodeType === Node.ELEMENT_NODE) {}
            else if (typeof _next === "object") _next = _next.element
            else if (typeof _next === "string" && views[_next]) _next = views[_next].element

            if (o.nodeType === Node.ELEMENT_NODE) _first = o
            else if (typeof o === "object") _first = o.element
            else if (typeof o === "string" && views[o]) _first = views[o].element

            if (!_first || !_next) return
            if (_first.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _first.contains(_next)
            
        } else if (k0 === "in()" || k0 === "inside()") {
            
            var _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e })
            if (_next) {
              if (typeof o === "string" || Array.isArray(o) || typeof o === "number") return answer = _next.includes(o)
              else if (typeof o === "object") answer = _next[o] !== undefined
              else if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE) return answer = _next.contains(o)
            } else return false

        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.contains(o) && _next !== o
            
        } else if (k0 === "doesnotContain()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: args[1], params, __, e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !o.contains(_next)
            
        } else if (k0 === "then()") {

            var args = k.split(":").slice(1)
            
            if (args[0]) {
                args.map(arg => {
                    toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: arg, params, __, e })
                })
            }
            
        } else if (k0 === "and()") {
            
            if (!o) {
                answer = false
            } else {
                var args = k.split(":").slice(1)
                if (args[0]) {
                    args.map(arg => {
                        if (answer) answer = toValue({ req, res, _window, lookupActions, awaits, id: mainId, value: arg, params, __, e })
                    })
                }
            }
            
        } else if (k0 === "isEqual()" || k0 === "is()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            // console.log(`'${o}'`, `'${b}'`);
            answer = isEqual(o, b)
            // console.log(answer, o[3] === b[3], o == b);
            
        } else if (k0 === "greater()" || k0 === "isgreater()" || k0 === "isgreaterthan()" || k0 === "isGreaterThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            answer = parseFloat(o) > parseFloat(b)
            
        } else if (k0 === "less()" || k0 === "isless()" || k0 === "islessthan()" || k0 === "isLessThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            answer = parseFloat(o) < parseFloat(b)
            
        } else if (k0 === "isNot()" || k0 === "isNotEqual()" || k0 === "not()" || k0 === "isnot()") {
            
            var args = k.split(":")
            var isNot = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
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
                var b = toValue({ req, res, _window, lookupActions, awaits, id, value: arg, params, __, e })
                
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
                var b = toValue({ req, res, _window, lookupActions, awaits, id, value: arg, params, __, e })
                
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
                var b = toValue({ req, res, _window, lookupActions, awaits, id, value: arg, params, __, e })
                
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

                var b = toValue({ req, res, _window, lookupActions, awaits, id, value: arg, params, e, __ })
            
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
            
            var b = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            
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
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
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
                _params = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
                _files = _params.files ? _params.files : (_params.file ? toArray(_params.file) : [])
            } else _files = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
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
                toParam({ req, res, _window, lookupActions, awaits, id, e, __: [(global.files.length > 1 ? global.files : global.file), ...__],  string: _params })
              } 
            }

            reader.readAsDataURL(file)
          })

        } else if (k0 === "clear()") {

            o.element.value = null

        } else if (k0 === "arr()" || k0 === "list()") {
            
            answer = toArray(o)
            answer = [...answer]

        } else if (k0 === "json") {
            
            answer = o + ".json"

        } else if (k0 === "notification()" || k0 === "notify()") {

          var notify = () => {
            if (isParam({ _window, string: args[1] })) {

              var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              new Notification(_params.title || "", _params)

            } else {

              var title = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
            
            var text = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            alert(text)

        } else if (k0 === "clone()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            else _o = o
            answer = clone(_o)

        } else if (k0 === "override()") {
            
            var args = k.split(":"), _obj, _o
            if (args[2]) {

                _o = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
                _obj = toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __, e })

            } else {

                _o = o
                _obj = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
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
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            else _o = o

            var el
            if (typeof _o === "string" && views[_o]) el = views[_o].element
            else if (_o.nodeType === Node.ELEMENT_NODE) el = _o
            else if (_o.element) el = _o.element
            
            var _view
            if (el) _view = views[el.id]
            
            if (_view && (_view.islabel || _view.labeled) && el && _view.type !== "Input") el = el.getElementsByTagName("INPUT")[0]
            else if (_view && _view.editable) el = _view.element
            
            if (el) {
                if (window.views[el.id].type === "Input") {

                    answer = el.value
                    if (i === lastIndex && key && value !== undefined && o.element) answer = el.value = value
                    else if (path[i + 1] === "del()") {
                      breakRequest = i + 1
                      answer = el.value = ""
                    }
                    
                } else {

                    answer = (el.textContent===undefined) ? el.innerText : el.textContent
                    if (i === lastIndex && key && value !== undefined) answer = el.innerHTML = value
                    else if (path[i + 1] === "del()") {
                      breakRequest = i + 1
                      answer = el.innerHTML = ""
                    }
                }
                
                if (views[el.id].required) answer = answer.slice(0, -1)
                
            } else if (view && view.type === "Input") {

                if (i === lastIndex && key && value !== undefined) answer = _o[view.element.value] = value
                else if (path[i + 1] === "del()") {
                  breakRequest = i + 1
                  answer = _o[view.element.value] = ""
                }
                else return answer = _o[view.element.value]

            } else if (view && view.type !== "Input") {

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
                var f = toValue({ req, res, _window, lookupActions, awaits, id, value: field, params, __, e })
                var v = toValue({ req, res, _window, lookupActions, awaits, id, value: fields[i + 1], params, __, e })
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

                    var f = toValue({ req, res, _window, lookupActions, awaits, id, value: _fv, params, __, e })
                    var v = toValue({ req, res, _window, lookupActions, awaits, id, value: fv[_i + 1], params, __, e })
                    answer[f] = v
                })
            }
            
        } */else if (k0 === "unshift()" || k0 === "pushFirst()" || k0 === "pushStart()") { // push to the begining, push first, push start

          var _item = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e, object })
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
            
            if (!Array.isArray(o)) {
                o = reducer({ req, res, _window, id, path: path.slice(0, i), value: [], key: true, __, e, object: _object })
            }
            
            var _item, _index
            if (k0.charAt(0) === "_") {
                _item = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], __: [o, ...__], e, object })
                _index = toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], __: [o, ...__], e, object })
            } else {
                _item = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], __, e, object })
                _index = toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], __, e, object })
            }

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
                arg = toValue({ req, res, _window, id, value: args[1], __, e, object })
                o.splice(o.length, 0, arg)
            })

        } else if (k0 === "pull()") { // pull by index or by conditions

            // if no index pull the last element
            var _last = 1, _text
            var _first
            if (!isParam({ _window, id, string: args[1] })) _first = args[1] !== undefined ? toValue({ _window, id, value: args[1], __, e, object }) : 0
            if (args[2]) _last = toValue({ _window, id, value: args[2], __, e, object })
            
            if (typeof _first !== "number") {

                var _items = o.filter(o => toApproval({ _window, e, string: args[1], id, object: o, __ }))
                console.log(o, _items.length);
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

        } else if (k0 === "pullLast()") {
            
            // if no it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o
            
        } else if (k0 === "findItems()") {

            var _item = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            answer = o.filter(item => isEqual(item, _item))
            
        } else if (k0 === "findItem()") {

            var _item = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            answer = o.find(item => isEqual(item, _item))
            
        } else if (k0 === "findItemIndex()") {

            var _item = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __, e })
            answer = o.findIndex(item => isEqual(item, _item))
            
        } else if (k0 === "filterItems()") {
            
            var _items

            if (k[0] === "_") _items = o.filter(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, __: [o, ...__], req, res }) )
            else _items = o.filter(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, object: o, req, res, __ }))
            
            _items.map(_item => {
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index, 1)
            })

            answer = o

        } else if (k0 === "filterItem()") {

            var _index

            if (k[0] === "_") _index = o.findIndex(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, __: [o, ...__], req, res }) )
            else _index = o.findIndex(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, object: o, req, res, __ }))

            if (_index !== -1) o.splice(_index , 1)
            answer = o
            
        } else if (k0 === "splice()") {

            // push at a specific index / splice():value:index
            var _value = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __,e })
            var _index = toValue({ req, res, _window, lookupActions, awaits, id, value: args[2], params, __,e })
            if (_index === undefined) _index = o.length - 1
            // console.log(clone(o), _valuendex);
            o.splice(parseInt(_index), 0, _value)
            answer = o
            
        } else if (k0 === "remove()" || k0 === "rem()") { // remove child with data
            
            clearTimeout(global["tooltip-timer"])
            delete global["tooltip-timer"]
            views.tooltip.element.style.opacity = "0"
            
            if (args[1] && !isParam({ _window, string: args[1] })) {

                var _id = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __,e })
                if (!views[_id]) return console.log("Element doesnot exist!")
                return remove({ id: _id })

            } else if (args[1] && isParam({ _window, string: args[1] })) {

                var params = toParam({ req, res, _window, lookupActions, awaits, e, id, string: args[1], __, params })
                return remove({ id: params.id || o.id, remove: { onlyChild: params.data === false ? false : true } })
            }

            var _id = typeof o === "string" ? o : o.id
            if (!views[_id]) return console.log("Element doesnot exist!")

            var _parent = views[views[o.id].parent]
            _parent.length = (_parent.element.children.length - 1) || 0
            
            remove({ id: o.id })
            return true

        } else if (k0 === "removeChild()" || k0 === "remChild()" || k0 === "removeView()" || k0 === "remView()") { // remove only view without removing data

            if (args[1]) {
                var _id = toValue({ req, res, _window, lookupActions, awaits, id, value: args[1], params, __,e })
                if (!views[_id]) return console.log("Element doesnot exist!")
                return remove({ id: _id, remove: { onlyChild: true } })
            }

            var _id = typeof o === "string" ? o : o.id
            if (!views[_id]) return console.log("Element doesnot exist!")
            remove({ id: o.id, remove: { onlyChild: true } })

        } else if (k0 === "charAt()") {

            var args = k.split(":")
            var _index = toValue({ req, res, _window, lookupActions, awaits, e, id, value: args[1], __, params })
            answer = o.charAt(0)

        } else if (k0 === "scrollTo()") {

          var _x = toValue({ req, res, _window, lookupActions, awaits, e, id, value: args[1], __, params })
          var _y = toValue({ req, res, _window, lookupActions, awaits, e, id, value: args[2], __, params })
          window.scrollTo(_x, _y)
          
        } else if (k0 === "droplist()") {
            
            var _params = toParam({ req, res, _window, lookupActions, awaits, e, id, string: args[1], __, params })
            require("./droplist").droplist({ id, e, droplist: _params, __ })
            
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
            
            var checklist = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()" || k0 === "gen()") {
            
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _params.length = _params.length || _params.len || 5
                _params.number = _params.number || _params.num
                answer = generate(_params)

            } else {

                var length = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }) || 5
                answer = generate({ length })
            }

        } else if (k0 === "includes()" || k0 === "inc()") {
          
            var _item = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
            if (typeof o === "string") {
                answer = o.split(_item).length > 1
            } else if (Array.isArray(o)) {
                answer = o.find(item => isEqual(item, _item)) ? true : false
            }
            
        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {
            
            var _include = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
            answer = !o.includes(_include)
            
        } else if (k0 === "capitalize()") {
            
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                if (_params.all) answer = capitalize(o)
                else answer = capitalizeFirst(o)

            } else answer = capitalize(o)
            
        } else if (k0 === "capitalizeFirst()") {
            
            answer = capitalizeFirst(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()" || k0 === "toUpperCase()" || k0 === "touppercase()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
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
              toParam({ req, res, _window, lookupActions, awaits, id, e, string: args[1], params, __ })
            })
            toParam({ req, res, _window, lookupActions, awaits, id, e, string: args[1], params, __: [_params, ...__] })
          }

        } else if (k0 === "resolve()") {

          res(toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }))

        } else if (k0 === "require()") {

          require(toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }))

        } else if (k0 === "new()") {
            
          var myparams = [], _className = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
          args.slice(1).map(arg => {
            myparams.push(toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: arg || "", params }))
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
            if (args[1]) days_ = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
            if (args[2]) hours_ = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[2], params, __ })
            if (args[3]) mins_ = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[3], params, __ })
            if (args[4]) secs_ = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[4], params, __ })
            */
            var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, string: args[1], params, __ })
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
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })
            else _o = o

            if (!isNaN(_o) && typeof _o === "string") _o = parseInt(_o)
            answer = new Date(_o)

        } else if (k0 === "toDateFormat()") { // returns date for input

            if (isParam({ _window, string: args[1] })) {

                var _options = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
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

              var format = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ }) || "format1"

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

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
            } else if (args[1]) {
                _params = { date: toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ }) }
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
          if (isParam({ _window, string: args[1] })) _options = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
          else _options = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1], params, __ })

          _options.counter = _options.counter || _options.start || _options.count || 0
          _options.length = _options.length || _options.len || _options.maxLength || 0
          _options.end = _options.end || _options.max || _options.maximum || 999999999999
          //_options.timer = _options.timer || (new Date(_date.setHours(0,0,0,0))).getTime()

          answer = require("./counter").counter({ ..._options })

        } else if (k0 === "time()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1] || "", params, __ })
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
            if (args[1]) _o = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1] || "", params, __ })
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

            var _id = args[1] ? toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }) : o.id
            require("./duplicate").duplicate({ _window, lookupActions, awaits, __, id: _id })
            return true

          } */else if (k0 === "stopWatchers()") {
            
            var _view
            if (args[1]) _view = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
            
            answer = new Date(_date.setMonth(0, getDaysInMonth(_date))).setHours(23 + _hrs,59 + _min,59,999)

        } else if (k0 === "exist()" || k0 === "exists()") {
            
            answer = o !== undefined ? true : false
            
        } /*else if (k0 === "open()") {
            
          var _url
          if (args[1]) _url = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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
                o = reducer({ req, res, _window, id, path: path.slice(0, i), value: [], key: true, __, e, object: _object })
            }

            var rec0, rec1

            rec0 = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] || "", params })
            rec1 = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[2] || "", params })

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

                var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                var _path = _params.path, _data = _params.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, awaits, id, path: _path || [], value, params, __: [o, ...__], e, object: item }), reducer({ req, res, _window, lookupActions, awaits, id, path: _path || [], value, params, __: [o, ...__], e, object: _data })))
                if (_index >= 0) o[_index] = _data
                else o.push(_data)

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
                
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

              var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              var _path = _params.path, _data = _params.data.filter(data => data !== undefined && data !== null)
              toArray(_data).map(_data => {

                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, awaits, id, path: _path || [], value, params, __: [o, ...__], e, object: item }), reducer({ req, res, _window, lookupActions, awaits, id, path: _path || [], value, params, __: [o, ...__], e, object: _data })))
                if (_index >= 0) o[_index] = _data
                else o.push(_data)
              })

          } else if (args[1]) {

              var _data = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }).filter(data => data !== undefined && data !== null)
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

                var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                var _path = _params.path, _data = _params.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, lookupActions, awaits, id, path: _path || [], value, params, __: [o, ...__], e, object: item }), reducer({ req, res, _window, lookupActions, awaits, id, path: _path || [], value, params, __: [o, ...__], e, object: _data })))
                if (_index >= 0) o[_index] = _data

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
                var _index = o.findIndex(item => item.id === _data.id)
                if (_index >= 0) o[_index] = _data
            }
            
        } else if (k0 === "replaceLast()") {
        
            var _item = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 1] = _item
                return o
            }
        
        } else if (k0 === "replaceSecondLast()" || k0 === "replace2ndLast()") {
        
            var _item = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 2] = _item
                return o
            }
        
        } else if (k0 === "replaceFirst()" || k0 === "replace1st()") {
        
            var _item = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[0] = _item
                return o
            }
        
        } else if (k0 === "replaceSecond()" || k0 === "replace2nd()") {
        
            var _item = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[1] = _item
                return o
            }
        
        } else if (k0 === "import()") {
        
            var _params = toParam({ req, res, _window, id, e, __, string: args[1] })
            _params.type = _params.json ? "json" : _params.type

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "import()" }
                awaits.unshift(myawait)
            }

            if (_params.type === "json") {
                
                importJson({ req, res, _window, myawait, lookupActions, awaits, id, e, __, params, asyncer: true })
                return true

            } else {

                require(toValue({ req, res, _window, lookupActions, awaits, myawait, id, e, __, value: args[1], params }))
            }
        
        } else if (k0 === "export()") {
        
            var _params = toParam({ req, res, _window, id, e, __, string: args[1] })
            _params.type = _params.json ? "json" : _params.type

            if (_params.type === "json") exportJson(_params)
        
        } else if (k0 === "exportJson()") {
            
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, __, string: args[1] })
                exportJson(_params)

            } else {

                var _name = toValue({ req, res, _window, id, e, __, value: args[1], params })
                exportJson({ data: o, name: _name})
            }
            
        } else if (k0 === "flat()") {
            
          if (typeof o === "object") {
            if (Array.isArray(o)) {
                o = [...o]
                answer =  o.flat()
            } else {
                _object = {..._object, ...o}
                return _object
            }
          } else return o
            
        } else if (k0 === "getDeepChildrenId()") {
            
            answer = getDeepChildrenId({ _window, lookupActions, awaits, id: o.id })
            
        } else if (k0 === "deep()" || k0 === "deepChildren()" || k0 === "getDeepChildren()") {
            
            answer = getDeepChildren({ _window, lookupActions, awaits, id: o.id })
            
        } else if (k0.includes("filter()")) {
            
            var args = k.split(":").slice(1), isnot
            if (!args[0]) isnot = true
            
            if (isnot) answer = toArray(o).filter(o => o !== "" && o !== undefined && o !== null)
            else args.map(arg => {
                
                if (k[0] === "_") answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, awaits, e, string: arg, params, id, __: [o, ...__], req, res }) )
                else answer = toArray(o).filter((o, index) => toApproval({ _window, lookupActions, awaits, e, string: arg, id, params, object: o, req, res, __ }))
            })
            
        } /*else if (k0.includes("filterById()")) {

            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, lookupActions, awaits, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } */else if (k0.includes("find()")) {
            

            if (i === lastIndex && key && value !== undefined) {

                var _index
                if (k[0] === "_") _index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], params, id, __: [o, ...__], req, res }) )
                else _index = toArray(o).findIndex(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, params, __, req, res, object: o }) )
                if (_index !== undefined && _index !== -1) o[_index] = answer = value
                
            } else {

                if (k[0] === "_") answer = toArray(o).find(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], params, id, __: [o, ...__], req, res }) )
                else answer = toArray(o).find(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, params, __, req, res, object: o }) )
            }
            
        } else if (k0 === "sort()") {
            
            var _array, _params = {}
            if (Array.isArray(o)) _array = o
            if (isParam({ _window, string: args[1] })) {
                
                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], params })
                _params.data = _params.data || _params.map || _params.array || _params.object || _params.list || _array

            } else if (args[1]) {
              
              _params.data = _array
              _params.path = toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] })
            }
            
            if (!_params.data && _array) _params.data = _array
            // else return o
            _params.data = answer = require("./sort").sort({ _window, lookupActions, awaits, sort: _params, id, e })
            
            return answer

        } else if (k0.includes("findIndex()")) {
            
            if (typeof o !== "object") return
            
            if (k[0] === "_") answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, __: [o, ...__], req, res }) )
            else answer = toArray(o).findIndex(o => toApproval({ _window, lookupActions, awaits, e, string: args[1], id, __, req, res, object: o }) )
            
        } else if (k0 === "_()" || k0 === "__()" || k0 === "()") { // map()

            var notArray = false
            if (args[1] && args[1].slice(0, 7) === "coded()") args[1] = global.codes[args[1]]
            if (typeof o === "object" && !Array.isArray(o)) notArray = true
            
            if (k0 === "_()") {
              
              toArray(o).map(o => reducer({ req, res, _window, lookupActions, awaits, id, path: args[1] || [], value, params, __: [o, ...__], e, object, toView }) )
              answer = o
                
            } else if (k0 === "__()") {
              
              toArray(o).map((o, index) => reducer({ req, res, _window, lookupActions, awaits, id, path: args[1] || [], value, params, __: [o, index, ...__], e, object, toView }) )
              answer = o
              
            } else {
              answer = toArray(o).map(o  => reducer({ req, res, _window, lookupActions, awaits, id, path: args[1] || [], object: o, value, params, __, e, toView }))
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

                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _el = _params.element || _params.id || _params.view || o

            } else if (args[1]) _el = toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] })
            else if (o) _el = o

            var opt = {
                margin:       [0.1, 0.1],
                filename:     _params.name || generate({ length: 20 }),
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, dpi: 300 },
                jsPDF:        { unit: 'in', format: _params.size || 'A4', orientation: 'portrait' },
                execludeImages: _params.execludeImages || false
            }

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "html2pdf()" }
                awaits.unshift(myawait)
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
                                    exportHTMLToPDF({ _window, pages: _elements, opt, lookupActions, awaits, myawait, req, res, id, e, __, args })

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
                                    if (args[2]) require("./toAwait").toAwait({ _window, lookupActions, awaits, myawait, req, res, id, e, __: [pdf, ...__] })
                                    window.devicePixelRatio = 1
                                })
                            }
                        })
                    })

                } else html2pdf().set(opt).from(_element).save().then((pdf) => {


                    // await params
                    if (args[2]) require("./toAwait").toAwait({ _window, lookupActions, awaits, myawait, req, res, id, e, __: [pdf, ...__] })
                    window.devicePixelRatio = 1
                })
            })

            document.getElementById("loader-container").style.display = "none"
            sleep(10)

        } else if (k0 === "share()") {

            if (isParam({ _window, string: args[1] })) { // share():[text;title;url;files]

                var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] }) || {}, images = []
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
                navigator.share({ url: toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] })})
            }

        } else if (k0 === "loader()") {

          var _params = {}
          if (isParam({ _window, string: args[1] })) {
          
            _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
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
            
            if (args[1]) answer = getType(toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] }))
            else answer = getType(o)

        } else if (k0 === "coords()") {

          var _id = o.id
          if (args[1]) _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] })
          require("./getCoords")({ id: _id || id })

        } else if (k0 === "function()") {
            
            answer = (...my_) => {

              if (my_.length === 0) toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], object }) 
              else if (my_.length === 1) toParam({ req, res, _window, lookupActions, awaits, id, e, __: [my_[0], ...__], string: args[1], object })
              else toParam({ req, res, _window, lookupActions, awaits, id, e, __: [my_, ...__], string: args[1], object })
            }
            
        } else if (k0 === "exec()") {

            answer = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], object })
            
        } else if (k0 === "exportCSV()") {
            
            var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], object })
            require("./toCSV").toCSV(_params)
            
        } else if (k0 === "exportExcel()") {
            
            var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], object })
            require("./toExcel").toExcel(_params)
            
        } else if (k0 === "exportPdf()") {
            
            var options = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], object })
            require("./toPdf").toPdf({ options })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            var _price
            if (args[1]) _price = toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] })
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
            
        } else if (k0 === "toBoolean()" || k0 === "boolean()" || k0 === "bool()") {

            answer = o === "true" ? true : o === "false" ? false : undefined
            
        } else if (k0 === "toNumber()" || k0 === "number()" || k0 === "num()") {

            answer = toNumber(o)
            
        } else if (k0 === "isNaN()") {

            answer = isNaN(o)
            // console.log(answer, o);

        } else if (k0 === "round()") {

          if (!isNaN(o)) {
            var nth = toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] }) || 2
            answer = parseFloat(o || 0).toFixed(nth)
          }
            
        } else if (k0 === "toString()" || k0 === "string()" || k0 === "str()") {
            
            if (args[1]) {
              var number = toValue({ req, res, _window, lookupActions, awaits, id, e, __, params, value: args[1] })
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

                var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, params, string: args[1] })
                return getCookie({ ..._params, req, res, _window })
            }

            var _name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] })
            var _cookie = getCookie({ name: _name, req, res, _window })
            return _cookie

        } else if (k0 === "eraseCookie()") {

            if (_window) return views.root.controls.push({ event: `loading?${pathJoined}` })

              // getCookie():name
              if (isParam({ _window, req, res, string: args[1] })) {
                  var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, params, string: args[1] })
                  return eraseCookie({ ..._params, req, res, _window })
              }
              var _name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] })
              var _cookie = eraseCookie({ name: _name, req, res, _window })
              return _cookie

        } else if (k0 === "setCookie()") {

            if (_window) return views.root.controls.push({ event: `loading?${pathJoined}` })

            // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
            var cookies = []
            if (isParam({ _window, req, res, string: args[1] })) {

                args.slice(1).map(arg => {

                    var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, params, string: arg })
                    setCookie({ ..._params, req, res, _window })

                    cookies.push(_params)
                })

            } else {

                var _name = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1] })
                var _value = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[2] })
                var _expiryDate = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[3] })

                setCookie({ name: _name, value: _value, expires: _expiryDate, req, res, _window })
            }

            
            if (cookies.length === 1) return cookies[0]
            else return cookies

        } else if (path0 === "cookie()") {

            var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, params, string: args[1] })

            if (_window && params.method === "post" || params.method === "delete") return views.root.controls.push({ event: `loading?${pathJoined}` })
            if (params.method === "post") return setCookie({ ..._params, req, res, _window })
            if (params.method === "delete") return eraseCookie({ ..._params, req, res, _window })
            if (params.method === "get") return getCookie({ ..._params, req, res, _window })

        } else if (k0 === "split()") {
            
            var splited = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            answer = o.split(splited)

        } else if (k0 === "join()") {
            
            var joiner = toValue({ req, res, _window, lookupActions, awaits, id, e, value: args[1] || "", params, __ })
            answer = o.join(joiner)

        } else if (k0 === "clean()") {
            
            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")
            
        } else if (k0 === "route()") {
            
            if (isParam({ _window, string: args[1] })) {

                var route = toParam({ req, res, _window, id, e, string: args[1] || "", params, __ })
                require("./route").route({ _window, lookupActions, awaits, req, res, id, route, __ })
                
            } else {
                
                // route():page:path
                var _page = toValue({ req, res, _window, id, e, value: args[1] || "", params, __ })
                var _path = toValue({ req, res, _window, id, e, value: args[2] || "", params, __ })
                require("./route").route({ _window, lookupActions, awaits, id, req, res, route: { path: _path, page: _page }, __ })
            }

        } else if (k0 === "toggleView()") {
          
            var toggle = {}
            if (isParam({ _window, string: args[1] })) {

                toggle = toParam({ req, res, _window, id, e, string: args[1] || "", params, __ })

            } else toggle = { view: toValue({ req, res, _window, id, e, value: args[1] || "", params, __ }) }

            require("./toggleView").toggleView({ _window, lookupActions, awaits, req, res, toggle, id: o.id, __ })

        } else if (k0 === "setChild()") {

            var toggle = toParam({ req, res, _window, lookupActions, awaits, id, e, string: args[1] || "", params, __ })
            require("./toggleView").toggleView({ _window, lookupActions, awaits, req, res, toggle, id: o.id, __ })

        } else if (k0 === "preventDefault()") {
            
            if (o.target) answer = o.preventDefault()
            else if (e) answer = e.preventDefault()

        } else if (k0 === "stopPropagation()") {
            
            answer = o.stopPropagation()

        } else if (k0 === "isChildOf()") {
            
            var el = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            answer = isEqual(el, o)

        } else if (k0 === "isChildOfId()") {
            
            var _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            var _ids = getDeepChildren({ _window, lookupActions, awaits, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)

        } else if (k0 === "isnotChildOfId()") {
            
            var _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            var _ids = getDeepChildren({ _window, lookupActions, awaits, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)
            answer = answer ? false : true

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of view element and children elements in object formula
            
            answer = getDeepChildren({ _window, lookupActions, awaits, id: o.id })
            
        } else if (k0 === "view()") {

          var _o
          if (typeof o === "object" && o.type && o.id) _o = o
          else _o = view

          var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
          _params.parent = _params.parent || _o.id
          _params.id = _params.id || generate()
          if (!_params.type && _params.text) _params.type = _params.type = "Text"
          views[_params.id] = _params
          var _view = require("./toHTML")({ _window, lookupActions, awaits, id: _params.id })
          return _view

        } else if (k0 === "note()") { // note
            
            if (isParam({ _window, string: args[1] })) {
              var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
              note({ note: _params })
            } else {
              var text = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
              var type = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[2], params })
              note({ note: { text, type } })
            }
            return true
            
        } else if (k0 === "mininote()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: _text, params })
            var mininoteControls = toCode({ _window, lookupActions, awaits, string: `():mininote-text.txt()=${_text};clearTimer():[mininote-timer:()];():mininote.style():[opacity=1;transform=scale(1)];mininote-timer:()=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            toParam({ _window, lookupActions, awaits, string: mininoteControls, e, id, req, res, __ })
            return true

        } else if (k0 === "tooltip()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: _text, params })
            var mininoteControls = toCode({ _window, lookupActions, awaits, string: `():tooltip-text.txt()=${_text};clearTimer():[tooltip-timer:()];():tooltip.style():[opacity=1;transform=scale(1)];tooltip-timer:()=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            toParam({ _window, lookupActions, awaits, string: mininoteControls, e, id, req, res, __ })
            return true

        } else if (k0 === "readonly()") {
          
            if (typeof o === "object") {

                if (key && value !== undefined) answer = o.element.readOnly = value
                else answer = o.element.readOnly = true

                if (key && value !== undefined) answer = o.element.setAttribute("contenteditable", value)
                else answer = o.element.setAttribute("contenteditable", false)

            } else if (o.nodeType === Node.ELEMENT_NODE) {

                if (key && value !== undefined) answer = o.readOnly = value
                else answer = o.readOnly = true

                if (key && value !== undefined) answer = o.setAttribute("contenteditable", value)
                else answer = o.setAttribute("contenteditable", false)
            }

        } else if (k0 === "editable()") {
          
            if (typeof o === "object") {

                if (key && value !== undefined) answer = o.element.readOnly = value
                else answer = o.element.readOnly = false

                if (key && value !== undefined) answer = o.element.setAttribute("contenteditable", value)
                else answer = o.element.setAttribute("contenteditable", true)

            } else if (o.nodeType === Node.ELEMENT_NODE) {

                if (key && value !== undefined) answer = o.readOnly = value
                else answer = o.readOnly = false

                if (key && value !== undefined) answer = o.setAttribute("contenteditable", value)
                else answer = o.setAttribute("contenteditable", true)
            }

        } else if (k0 === "html()") {
          
            answer = o.element.innerHTML

        } else if (k0 === "range()") {
          
            var args = k.split(":").slice(1)
            var _index = 0, _range = []
            var _startIndex = args[1] ? toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[0], params }) : 0 || 0
            var _endIndex = args[1] ? toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }) : toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[0], params })
            var _steps = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[2], params }) || 1
            var _lang = args[3] || ""
            _index = _startIndex
            while (_index <= _endIndex) {
                if ((_index - _startIndex) % _steps === 0) {
                    _range.push(_index)
                    _index += _steps
                }
            }
            if (_lang === "ar") _range = _range.map(num => num.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d]))
            answer = _range
            
        } else if (k0 === "wait()") {
            
          var _params = { await: args.join(":"), awaiter: `wait():${args.slice(1).map(() => "nothing").join(":")}` }
          toAwait({ id, e, params: _params, lookupActions })

        } else if (k0 === "update()") {
          
          var __id, _id, _params, _self
          if (_window) return view.controls.push({
            event: `loaded?${pathJoined}`
          })
          
          if (isParam({ _window, string: args[1] })) {

            _params = toParam({ req, res, _window, id, e, __, string: args[1] })
            __id = _params.id || id
            _self = _params.self

          } else if (args[1]) __id = toValue({ req, res, _window, id, e, __, value: args[1], params })

          if (typeof __id === "object" && __id.id) _id = __id.id
          else _id = __id

          if (!_id && o.id) _id = o.id
          
            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "update()" }
                awaits.unshift(myawait)
            }

          if (_self) return require("./updateSelf").updateSelf({ _window, lookupActions, awaits, req, res, mainId: id, id: _id, myawait, asyncer: true, __ })
          else return require("./update").update({ _window, lookupActions, awaits, req, res, id: _id, mainId: id, myawait, asyncer: true, __ })

        } else if (k0 === "updateSelf()") {
          
          var __id, _id, _params, _self
          if (_window) return view.controls.push({
            event: `loaded?${pathJoined}`
          })
          
          if (isParam({ _window, string: args[1] })) {

            _params = toParam({ req, res, _window, id, e, __, string: args[1] })
            __id = _params.id || id

          } else if (args[1]) __id = toValue({ req, res, _window, id, e, __, value: args[1], params }) || id

          if (typeof __id === "object" && __id.id) _id = __id.id
          else _id = __id

          if (!_id && o.id) _id = o.id
          

          var _await = "", myawait = {}
          if (args[2]) {
              _await = global.codes[args[2]]
              myawait = { id: generate(), hold: true, await: _await, action: "updateSelf()" }
              awaits.unshift(myawait)
          }
          
          return require("./updateSelf").updateSelf({ _window, lookupActions, awaits, req, res, id: _id, myawait, asyncer: true, __ })

        } else if (k0 === "upload()") {
          
          if (isParam({ _window, string: args[1] })) {

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "upload()" }
                awaits.unshift(myawait)
            }
            
            var _upload = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })
            require("./upload")({ _window, lookupActions, awaits, req, res, id, myawait, e, __, upload: _upload, asyncer: true })
            return true
          }

          return require("./upload")({ _window, lookupActions, awaits, req, res, id, e, save: { upload: { file: global.upload } }, __ })

        } else if (k0 === "confirmEmail()") {
          
          if (isParam({ _window, string: args[1] })) {

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "confirmEmail()" }
                awaits.unshift(myawait)
            }

            var _save = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })
            _save.store = "confirmEmail"
            return require("./save").save({ id, lookupActions, awaits, myawait, e, __, save: _save, asyncer: true })
          }

        } else if (k0 === "save()") {
          
          if (isParam({ _window, string: args[1] })) {

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "save()" }
                awaits.unshift(myawait)
            }

            var _save = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })
            return require("./save").save({ _window, lookupActions, awaits, req, res, id, e, __, myawait, asyncer: true, save: _save })
          }

          var _collection = toValue({ req, res, _window, lookupActions, id, e, __, value: args[1], params })
          var _doc = toValue({ req, res, _window, lookupActions, id, e, __, value: args[2], params })
          var _data = toValue({ req, res, _window, lookupActions, id, e, __, value: args[3], params })
          var _save = { collection: _collection, doc: _doc, data: _data }

          return require("./save").save({ _window, lookupActions, awaits, req, res, id, e, save: _save, __ })

        } else if (k0 === "fetch()") {



        } else if (k0 === "insert()") {
            
            var _id = id
            if (o.type) _id = o.id
            
            if (isParam({ _window, string: args[1] })) {

                var _await = "", myawait = {}
                if (args[2]) {
                    _await = global.codes[args[2]]
                    myawait = { id: generate(), hold: true, await: _await, action: "insert()" }
                    awaits.unshift(myawait)
                }

                var _params = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })
                insert({ id: _params.id || _id, insert: _params, lookupActions, awaits, asyncer: true, myawait, __ })
            }

            return true

        } else if (k0 === "mail()") {

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "mail()" }
                awaits.unshift(myawait)
            }

            var _params = toParam({ req, res, _window, id, e, __, string: args[1] })

            if (!_window) {

                var _func = { data: _params, actions: `mail():[subject=_.subject;content=_.content;text=_.text;html=_.html;recipient=_.recipient;recipients=_.recipients;attachments=_.attachments]:[send():_]` }
                return func({ _window, req, res, id, lookupActions, awaits, myawait, asyncer: true, e, func: _func, __, ...params })
            }

            //if (_window) {

            else require("./mail").mail({ req, res, _window, lookupActions, awaits, myawait, asyncer: true, id, e, __, ..._params })
            
            /*} else {

                if (isParam({ _window, string: args[1] })) {

                    var _options = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                    _options.body = _options.body || _options.text || _options.content
                    _options.subject = _options.subject || _options.header || _options.title
                    // window.open(`mailto:${_options.email}?subject=${_options.subject}&body=${_options.body}`)
                    
                    try{
                        var theApp = new ActiveXObject("Outlook.Application");
                        var objNS = theApp.GetNameSpace('MAPI');
                        var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
                        theMailItem.to = (_options.to);
                        theMailItem.Subject = (_options.subject);
                        theMailItem.Body = (_options.body);
                        // theMailItem.Attachments.Add("C:\\file.txt");
                        theMailItem.display();
                    }
                    catch (err) {
                        alert(err.message);
                    }

                } else {

                    var _email = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
                    var _subject = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[2], params })
                    var _body = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[3], params })
                    window.open(`mailto:${_email}?subject=${_subject}&body=${_body}`)
                }
            }*/

        } else if (k0 === "print()") {
          
            var _options = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            if (!_options.id && !_options.view) _options.id = o.id
            if (_options.view) _options.id = _options.view.id

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "print()" }
                awaits.unshift(myawait)
            }

            require("./print").print({ id, options: _options, lookupActions, awaits, myawait, asyncer: true, id, e, __, req, res })

        } else if (k0 === "read()") {

            var _params = {}
            if (isParam({ _window, string: args[1] }))
                _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
             else _params.file = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })

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
                  var my_ = {success: true, data: global.files.length === 1 ? global.files[0] : global.files}
                  toParam({ req, res, _window, lookupActions, awaits, id, e, __: [my_, ...__],  string: args[2] })
                } 
              }

              try {
                reader.readAsDataURL(file)
              } catch (er) {
                document.getElementById("loader-container").style.display = "none"
              }
            })

        } else if (k0 === "search()") {

            var _await = "", myawait = {}
            if (args[2]) {

                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "search()" }
                awaits.unshift(myawait)
                
                if (global.__waiters__.length > 0) myawait.waiter = global.__waiters__[0]
            }
            var _search = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })
            
            require("./search").search({ _window, lookupActions, awaits, myawait, asyncer: true, id, e, __, req, res, search: _search })
            return true

        } else if (k0 === "erase()") {
          
            if (isParam({ _window, string: args[1] })) {

                var _await = "", myawait = {}
                if (args[2]) {
                    _await = global.codes[args[2]]
                    myawait = { id: generate(), hold: true, await: _await, action: "erase()" }
                    awaits.unshift(myawait)
                }

                var _erase = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })
                return require("./erase").erase({ _window, lookupActions, awaits, myawait, req, res, id, e, __, erase: _erase, asyncer: true })
            }
  
            var _collection = toValue({ req, res, _window, lookupActions, id, e, __, value: args[1], params })
            var _doc = toValue({ req, res, _window, lookupActions, id, e, __, value: args[2], params })
            var _erase = { collection: _collection, doc: _doc }
  
            return require("./erase").erase({ _window, lookupActions, awaits, req, res, id, e, save: _erase, __ })
  
        } else if (k0 === "send()") {
            
          breakRequest = true
          if (!res || res.headersSent) return
          if (isParam({ _window, string: args[1] })) {
            
            var _params = toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] })//, _params_ = {}

            _params.success = _params.success !== undefined ? _params.success : true
            _params.message = _params.message || _params.msg || "Action executed successfully!"
            delete _params.msg
            
            if (!_window.function) return global.func = _params
            else res.send(_params)

          } else {
            
            var _data = toValue({ req, res, _window, lookupActions, id, e, __, value: args[1], params })
            if (!_window.function) return global.func = { success: true, message: "Action executed successfully!", data: _data }
            else res.send({ success: true, message: "Action executed successfully!", data: _data })
          }
          console.log("RESPONDED");

        } else if (k0 === "sent()") {

          if (!res || res.headersSent) return true
          else return false

        } else if (k0.length === 14 && k0.slice(-2) === "()" && k0.slice(0, 7) === 'coded()') { // [actions?conditions]():[params]:[awaits]
            
            k0 = k0.slice(0, 12)

            var _await = "", myawait = {}
            if (args[2]) {
                _await = global.codes[args[2]]
                myawait = { id: generate(), hold: true, await: _await, action: "action()" }
                awaits.unshift(myawait)
            }
            
            var _params = args[1] ? toParam({ req, res, _window, lookupActions, id, e, __, string: args[1] }) : undefined

            if (k0.includes('coded()') && k0.length === 12) k0 = global.codes[k0]

            var conditions = k0.split("?")[1]
            if (conditions) {
                var approved = toApproval({ _window, string: conditions, e, id, req, res, params, object, __ })
                if (!approved) return false
            }

            k0 = k0.split("?")[0]
            
            if (!condition) {

                answer = toValue({ _window, value: k0, e, id, req, res, object: object || o, asyncer: true, __, awaits, lookupActions })
                
                // ex: [_]() & _ = 'action_name()' --> action_name()
                if (typeof answer === "string") {
                    answer = toCode({ _window, string: toCode({ _window, string: answer, start: "'", end: "'" }) })
                    reducer({ _window, lookupActions, awaits, id, path: [answer], value, key, params, object, __: [...(_params !== undefined ? [_params] : []), ...__],  e, req, res, mount, condition, toView })
                }
                
            } else {
                answer = toValue({ _window, value: k0, e, id, req, res, object: object || o, asyncer: true, __, awaits, lookupActions })
                answer = toApproval({ _window, string: answer, e, id, req, res, params, object: object || o, __: [...(_params !== undefined ? [_params] : []), ...__], awaits, lookupActions })
            }
            // await params
            if (!_await || awaits.findIndex(i => i.id === myawait.id) === 0) {
                
                if (_await) {

                    require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, myawait, awaits, req, res, __: [global.search, ...__] })

                } else {

                    awaits.splice(awaits.findIndex(i => i.id === myawait.id), 1)
                    // console.log({ action: path0, data: _params, success: true, message: "Action executed successfully!", path: (lookupActions || {}).fn })
                }
            }

        } else if (k0 === "setPosition()" || k0 === "position()") {
          
            // setPosition():toBePositioned:positioner:placement:align
            /*
            var toBePositioned = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
            var positioner = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[2], params }) || id
            var placement = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[3], params })
            var align = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[4], params })
            */
            var position = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1], params })

            return require("./setPosition").setPosition({ position, id: o.id || id, e })

        } else if (k0 === "refresh()") {
          
            var _id = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params }) || id
            return require("./refresh").refresh({ id: _id, lookupActions })

        } else if (k0 === "csvToJson()") {
          
          var file = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
          require("./csvToJson").csvToJson({ id, lookupActions, awaits, e, file, onload: args[2] || "", __ })

        } else if (k0 === "copyToClipBoard()") {
          
            var text 
            if (args[1]) text = toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: args[1], params })
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

                var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.element || _params.view || _params.id || o
                _class = _params.class
                
            } else {

                _o = o
                _class = toValue({ req, res, _window, lookupActions, awaits, id, e, __: [o, ...__], value: args[1], params })
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (_o.element) answer = _o.element.classList.add(_class)
            else answer = _o.classList.add(_class)

        } else if (k0 === "removeClass()" || k0 === "remClass()") {
            
            var _o, _class
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, lookupActions, awaits, id, e, __, string: args[1] })
                _o = _params.element || _params.view || _params.id || o
                _class = _params.class
                
            } else {

                _o = o
                _class = toValue({ req, res, _window, lookupActions, awaits, id, e, __: [o, ...__], value: args[1], params })
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (_o.element) answer = _o.element.classList.remove(_class)
            else answer = _o.classList.remove(_class)

        } else if (k0 === "encodeURI()") {

            answer = encodeURI(o)

        } else if (k0 === "decodeURI()") {

            answer = encodeURI(o)

        } else if (k0.includes("()") && typeof o[k0.slice(0, -2)] === "function") {
            
          var myparams = []
          args.slice(1).map(arg => {
            myparams.push(toValue({ req, res, _window, lookupActions, awaits, id, e, __, value: arg || "" }))
          })
          
          answer = o[k0.slice(0, -2)](...myparams)

        } else if (k0.slice(-2) === "()") {
            
            if (k0.slice(0, -2).includes("coded()")) {
                if (isParam({ _window, string: k0 })) return toParam({ req, res, _window, id, e, __, string: k0, object })
                else k0 = toValue({ req, res, _window, id, e, __, value: k0, object })
            }

            if (k0.charAt(0) === "_") {
                answer = toFunction({ _window, lookupActions, awaits, id, req, res, __: [o, ...__], e, path: [k], path0: k0, condition, mount, toView, object })
            } else {
                answer = toFunction({ _window, lookupActions, awaits, id, req, res, __, e, path: [k], path0: k0, condition, mount, toView, object: object || o })
            }

        } else if (k.includes(":coded()")) {
          
            breakRequest = true

            // k0 is encoded
            if (k0.includes("coded()") && k0.length === 12) k0 = global.codes["coded()" + k0.slice(-5)]
            else if (k0.includes("codedS()") && k0.length === 13) k0 = global.codes["codedS()" + k0.slice(-5)]

            o[k0] = o[k0] || {}
            if (toView && events.includes(k.split(":coded()")[0])) {
              
              if (o.__view__) {

                var _params_ = global.codes["coded()" + args[1].slice(-5)]
                var _conditions = _params_.split("?")[1] || ""
                
                _params_ = _params_.split("?")[0]

                views[id].controls = toArray(views[id].controls)
                if (k0 === "entry") k0 = "input"
                else if (k0 === "enter") {
                  k0 = "keyup"
                  _conditions += "e().key=Enter||e().keyCode=13"
                } else if (k0 === "ctrl") {
                  k0 = "keydown"
                  _conditions += "e().ctrlKey"
                } else if (k0 === "longclick") {
                  views[id].controls.push({
                    "event": `mousedown:${o.id !== id ? (":" + o.id) : ""};touchstart:${o.id !== id ? (":" + o.id) : ""}?clickTimer=timestamp()?${_conditions}`, __, lookupActions
                  })
                  views[id].controls.push({
                    "event": `mouseup:${o.id !== id ? (":" + o.id) : ""};touchend:${o.id !== id ? (":" + o.id) : ""}?${global.codes["coded()" + args[1].slice(-5)]}?${_conditions};timestamp()-clickTimer>=1000`, __, lookupActions
                  })
                  return
                } else if (k0 === "dblclick") {
                    views[id].controls.push({
                      "event": `click:${o.id !== id ? (":" + o.id) : ""}?${_conditions};clickTimer=timestamp()`, __, lookupActions
                    })
                    return
                  }
                  
                views[id].controls.push({
                  "event": k0 + (o.id !== id ? (":" + o.id) : "") + "?" + global.codes["coded()" + args[1].slice(-5)] + "?" + _conditions, __, lookupActions
                })
              }
              return
            }
            
            args[1] = (global.codes["coded()" + args[1].slice(-5)] || "").split(".")
            if (args[1]) answer = reducer({ req, res, _window, lookupActions, awaits, id, e, key, path: [...args.slice(1).flat(), ...path.slice(i + 1)], object: o[k0], params, __ })
            else return
            
        } 
        else if (k0 === "device()") return global.device.device
        
        else if (key && value !== undefined && i === lastIndex) {

            if (k.includes("coded()")) {

              var _key = k.split("coded()")[0]
              k.split("coded()").slice(1).map(code => {
                _key += toValue({ _window, lookupActions, awaits, value: global.codes[`coded()${code.slice(0, 5)}`], params, __, id, e, req, res, object })
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
                _key += toValue({ _window, lookupActions, awaits, value: global.codes[`coded()${code.slice(0, 5)}`], params, __, id, e, req, res, object })
                _key += code.slice(5)
            })
            k = _key

            if (key && o[k] === undefined && i !== lastIndex) {

                if (!isNaN(path[i + 1])) answer = o[k] = []
                else answer = o[k] = {}
    
            } else answer = o[k]

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
            //console.log(k, o, lastIndex, path, i, o[k]);
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

const getDeepParentId = ({ _window, lookupActions, awaits, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    if (!view.element.parentNode || view.element.parentNode.nodeName === "BODY") return []

    var parentId = view.element.parentNode.id
    var all = [parentId]
    
    all.push(...getDeepParentId({ _window, lookupActions, awaits, id: parentId }))

    return all
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
const exportHTMLToPDF = async ({ _window, pages, opt, lookupActions, awaits, myawait, req, res, id, e, __ }) => {
    
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
    if (args[2]) require("./toAwait").toAwait({ _window, lookupActions, awaits, myawait, req, res, id, e, __ })
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
},{"./actions.json":37,"./axios":38,"./capitalize":40,"./clone":42,"./cookie":47,"./counter":48,"./csvToJson":54,"./decode":57,"./droplist":59,"./erase":60,"./events.json":62,"./exportJson":64,"./focus":67,"./func":68,"./generate":70,"./getCoords":71,"./getDateTime":72,"./getDaysInMonth":73,"./getType":75,"./importJson":76,"./insert":77,"./isEqual":79,"./isParam":80,"./jsonToBracket":83,"./mail":87,"./note":89,"./print":94,"./refresh":97,"./remove":99,"./resize":100,"./route":101,"./save":102,"./search":104,"./setPosition":108,"./sort":109,"./toApproval":115,"./toArray":116,"./toAwait":117,"./toCSV":118,"./toClock":119,"./toCode":120,"./toExcel":123,"./toFunction":125,"./toHTML":126,"./toId":127,"./toNumber":128,"./toParam":130,"./toPdf":131,"./toSimplifiedDate":132,"./toValue":134,"./toggleView":136,"./update":137,"./updateSelf":138,"./upload":139,"qrcode":179,"vcards-js":206}],97:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { removeChildren } = require("./update")

const refresh = async ({ id, update = {}, lookupActions, __ }) => {

  var views = window.views
  var view = views[id]
  var timer = update.timer || 0
  
  if (!view || !view.element) return
  var parent = views[view.parent]
  var index = view.index

  // children
  var children = clone(toArray(parent.children[index]))
  
  // remove children
  removeChildren({ id })

  ////// remove view
  Object.entries(views[id]).map(([k, v]) => {

    if (k.includes("-timer")) clearTimeout(v)
  })
  delete views[id]
  ///////

  var innerHTML = await Promise.all(children.map(async child => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = parent.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = [...view["my-views"]]
    views[id].style.opacity = "0"
    if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return await toView({ id, lookupActions, __ })

  }))
  
  innerHTML = innerHTML.join("")
  
  var childrenNodes = [...parent.element.children]
  childrenNodes.map((childNode, i) => {
    var _index = parseInt(childNode.getAttribute("index"))
    if (_index === index) parent.element.removeChild(childrenNodes[i])
  })
  
  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.opacity = "0"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.innerHTML = innerHTML
  var node = lDiv.children[0]

  parent.element.insertBefore(node, parent.element.children[index])
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))
  
  var _children = [...parent.element.children]
  _children.map(childNode => {
    var _index = childNode.getAttribute("index")
    if (_index === index) return childNode
    else return
  }).filter(child => child)
  
  if (timer) setTimeout(() => _children.map(el => views[el.id].style.opacity = views[el.id].element.style.opacity = "1"), 0)
  else _children.map(el => views[el.id].style.opacity = views[el.id].element.style.opacity = "1")
  
  if (lDiv) {
    document.body.removeChild(lDiv)
    lDiv = null
  }
}

module.exports = {refresh}
},{"./clone":42,"./generate":70,"./setElement":107,"./starter":110,"./toArray":116,"./toView":135,"./update":137}],98:[function(require,module,exports){
module.exports = {
    reload: () => {
        document.location.reload(true)
    }
}
},{}],99:[function(require,module,exports){
const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const remove = ({ _window, remove: _remove, id, __ }) => {

  var views = window.views
  var view = window.views[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(view.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(`${view.Data}:()`)
    var parentData = reducer({ id, path: keys.slice(0, -1), __ })
    if (Array.isArray(parentData) && parentData.length === 0) {
      reducer({ id, path: keys.slice(0, -1), value: [], key: true, __ })
    } else {
      keys.push("del()")
      reducer({ id, path: keys, __ })
    }
  }

  // close droplist
  if (global["__droplistPositioner__"] && view.element.contains(views[global["__droplistPositioner__"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[actionlistTimer:()];():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }

  removeChildren({ id })
  
  if (keys.length === 0) {
    
    view.element.remove()
    delete window.views[id]
    return
  }

  // reset length and derivations
  var nextSibling = false
  var children = [...window.views[view.parent].element.children]
  var index = view.derivations.length - 1
  
  children.map((child) => {

    var id = child.id
    window.views[id].length -= 1

    // derivation in array of next siblings must decrease by 1
    if (nextSibling) resetDerivations({ id, index })

    if (id === view.id) {
      nextSibling = true
      view.element.remove()
      delete window.views[id]
    }
  })
}

const resetDerivations = ({ id, index }) => {

  var views = window.views
  var view = views[id]

  if (!view) return
  if (isNaN(view.derivations[index])) return

  view.derivations[index] -= 1

  var children = [...view.element.children]
  children.map((child) => resetDerivations({ id: child.id, index }) )
}

module.exports = { remove }

},{"./clone":42,"./reducer":96,"./toCode":120,"./toParam":130,"./update":137}],100:[function(require,module,exports){
const resize = ({ id }) => {

  var view = window.views[id]
  if (!view) return
  
  if (view.type !== "Input" && view.type !== "Entry" && (width !== "fit-content" || height !== "fit-content")) return

  var results = dimensions({ id })

  // for width
  var width = view.style.width
  if (width === "fit-content" && view.element) {
    view.element.style.width = results.width + "px"
    view.element.style.minWidth = results.width + "px"
  }

  // for height
  var height = view.style.height
  if (height === "fit-content" && view.element) {
    view.element.style.height = results.height + "px"
    view.element.style.minHeight = results.height + "px"
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
  var pText = text || (view.type === "Input" && view.element && view.element.value) || "A"
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
  
  if (pStyle.width === "100%") lDiv.style.width = (view.element ? view.element.clientWidth : lDiv.style.width) + "px"
  var height, width = lDiv.clientWidth + 2

  if (view.element.tagName === "TEXTAREA") {

    height = lDiv.clientHeight
    if (lDiv.clientHeight < view.element.scrollHeight) height = view.element.scrollHeight
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

},{}],101:[function(require,module,exports){
const { clone } = require("./clone")
const { update } = require("./update")
const { toView } = require("./toView")
const { toArray } = require("./toArray")

module.exports = {
    route: async ({ id, _window, route = {}, req, res, __ }) => {
      
      var views = _window ? _window.views : window.views
      var global = _window ? _window.global : window.global
      global.prevPath.push(global.path)
      if (global.prevPath.length > 5) global.prevPath.shift()
      var path = route.path || (route.page.includes("/") ? route.page : global.path)
      
      global.prevPage.push(global.currentPage)
      if (global.prevPage.length > 5) global.prevPage.shift()
      var currentPage = global.currentPage = route.page && (route.page.includes("/") ? (!route.page.split("/")[0] ? route.page.split("/")[1] : route.page.split("/")[0]): route.page ) || path.split("/")[1] || "main"

      global.currentPage = currentPage
      global.path = route.path ? path : currentPage === "main" ? "/" : (currentPage.charAt(0) === "/" ? currentPage : `/${currentPage}`)
      
      if (res) {
        
        global.updateLocation = true
        views.root.children = [{ ...clone(global.data.page[currentPage]), id: currentPage, ["my-views"]: [currentPage] }]
        
        if (id !== "root") {

          global.promises[id] = toArray(global.promises[id])

          global.promises[id].push(new Promise (async resolve => {
              
              var innerHTML = await toView({ _window, id: "root", req, res, __ })
              if (!global.__INNERHTML__.root) global.__INNERHTML__.root = innerHTML
              global.breaktoView[id] = true
              resolve()
            })
          )
          
        }

      } else {
        
        route.path = global.path
        route.currentPage = global.currentPage
        
        if (document.getElementById("loader-container").style.display === "none") document.getElementById("loader-container").style.display = "flex"
        update({ _window, req, res, id: "root", route, __ })
      }
    }
}
},{"./clone":42,"./toArray":116,"./toView":135,"./update":137}],102:[function(require,module,exports){
var { clone } = require("./clone")
const { toParam } = require("./toParam")
const { generate } = require("./generate")
const { schematize } = require("./schematize")
const { toArray } = require("./toArray")

const save = async ({ _window, lookupActions, awaits, req, res, id, e, __, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var save = params.save || {}
  var view = views[id]
  var _data
  var headers = clone(save.headers) || {}
  var store = save.store || "database"

  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]
  if (save.map && typeof save.map === 'object') {
    
    save.idList = []
    save.data = []
    Object.entries(save.map).map(([doc, data]) => {
      save.data.push(data)
      save.idList.push(doc)
    })
    _data = save.data
  }

  if (!Array.isArray(save.data)) {
    save.doc = save.doc || save.id || save.data.id || generate({ length: 20 })
  } else {
    toArray(save.data).map(data => {
      data.id = data.id || generate({ length: 20 })
    })
  }
  /*if (save.doc || save.id || (typeof save.data === "object" && !Array.isArray(save.data) && save.data.id)) save.doc = save.doc || save.id || save.data.id
  if (!save.doc && (Array.isArray(save.data) ? save.data.find(data => !data.id) : false)) return*/

  // schema
  if (save.schematize && (save.doc || save.schema)) {

    var schema = save.doc ? global[`${save.doc}-schema`] : save.schema
    if (!save.schema) return toParam({ _window, lookupActions, awaits, string: "note():[text=Schema does not exist!;type=danger]" })
    if (Array.isArray(save.data)) save.data = save.data.map(data => schematize({ data, schema }))
    else save.data = schematize({ data: save.data, schema })
  }

  if (_window) {
    
    var collection = save.collection, success, message, project = headers.project || req.headers.project, schema
    if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`
    
    // get schema
    if (save.schematize) {
      await req.db.collection(`schema-${project}`).doc(save.collection).get().then(doc => {

        success = true
        schema = doc.data()

      }).catch(error => {

        success = false
        message = error
      })

      if (!schema) return
      if (Array.isArray(save.data)) save.data = save.data.map(data => schematize({ data, schema }))
      save.data = schematize({ data: save.data, schema })
    }

    global.promises[id] = toArray(global.promises[id])
    var ref = req.db.collection(collection)

    if (Array.isArray(save.data)) {

      /*var idList = save.idList || []
      if (idList) {

        var batch = req.db.batch()
        save.data.map((data, i) => {
          
          if (idList[i]) {
            
            // if (!data.id) data.id = generate({ length: 20 })
            if (!data["creation-date"]) {
              data["creation-date"] = (new Date()).getTime()
              data.timezone = "GMT"
            }


            batch.set(req.db.collection(collection).document(idList[i]), data)
      
            // Commit the batch
            global.promises[id].push(batch.commit().then(() => {
      
              success = true
              message = `Document saved successfuly!`
              
            }).catch(error => {
        
              success = false
              message = error
            }))
          }
        })

      } else {*/

        save.data.map((data, i) => {

          if (!data.id) data.id = generate({ length: 20 })

          if (!data["creation-date"]) data["creation-date"] = parseInt(req.headers.timestamp)

          global.promises[id].push(ref.doc(data.id.toString()).set(data).then(() => {

            success = true
            message = `Document saved successfuly!`
      
          }).catch(error => {
      
            success = false
            message = error
          }))
        })
      //}

    } else if (save.doc) {

      var data = save.data
      if (!data.id && !save.doc && !save.id) data.id = generate({ length: 20 })
      if (!data["creation-date"]) data["creation-date"] = parseInt(req.headers.timestamp)
      
      global.promises[id].push(ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`

      }).catch(error => {

        success = false
        message = error
      }))
    }
    
    await Promise.all((global.promises[id] || []))
    delete global.promises[id]

    _data = { data: save.data, success, message }

  } else {
    
    var _data_ = clone(save.data), data
    delete save.data
    
    headers["timestamp"] = (new Date()).getTime()
    headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())
    
    var { data } = await require("axios").post(`/${store}`, { save, data: _data_ }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })
    
    _data = data
  }

  view.save = global.save = _data
  if (store === "confirmEmail") view.confirmEmail = _data

  /*if (!_window) */console.log("save", _data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req, res, id, e, __: [_data, ...__], ...params })
}

module.exports = { save }
},{"./clone":42,"./generate":70,"./schematize":103,"./toArray":116,"./toAwait":117,"./toParam":130,"axios":142}],103:[function(require,module,exports){
const schematize = ({ data, schema }) => {
  var _data = {}
  schema.map(schema => {
    if (data[schema.path] !== undefined) {
      
      if (schema.type === "any" || typeof data[schema.path] === schema.type) _data[schema.path] = data[schema.path]
      else if (schema.type === "number" || typeof data[schema.path] === "number") _data[schema.path] = data[schema.path]
      else if (schema.type === "string" || typeof data[schema.path] === "string") _data[schema.path] = data[schema.path]
      else if (schema.type === "boolean" || typeof data[schema.path] === "boolean") _data[schema.path] = data[schema.path]
      else if (Array.isArray(schema.type) || typeof data[schema.path] === "object") {
        if (schema.isArray && Array.isArray(data[schema.path])) _data[schema.path] = data[schema.path].map(data => schematize({ data, schema: schema.type }))
        else if (!Array.isArray(data[schema.path])) _data[schema.path] = schematize({ data, schema: schema.type })
      }
    }
  })
  return _data
}

module.exports = { schematize }
},{}],104:[function(require,module,exports){
const axios = require('axios')
const { jsonToBracket } = require('./jsonToBracket')
const { clone } = require('./clone')
const { toFirebaseOperator } = require('./toFirebaseOperator')
const { toArray } = require('./toArray')

module.exports = {
  search: async ({ _window, lookupActions, awaits, id = "root", req, res, e, __, ...params }) => {
      
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    var view = views[id], _data
    var search = params.search || {}
    var headers = search.headers || {}
    var store = search.store || "database"
    headers.project = headers.project || global.projectId
    search.collection = search.collection || "collection"
    
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]
    delete search.headers
    
    if (_window) {
      
      global.promises[id] = toArray(global.promises[id])
      var collection = search.collection, project = headers.project || req.headers.project
      if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
      if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${project}`
      
      var doc = search.document || search.doc,
      docs = search.documents || search.docs,
      field = search.field || search.fields,
      limit = search.limit || 25,
      data = {}, success, message,
      ref = req.db.collection(collection),
      promises = [], project
      
      /////////////////// verify access key ///////////////////// access key is stopped
      // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
      project = { ["accesskey"]: req.headers["accesskey"] }
      
      if (search.url) {

        var url = search.url
        delete search.url

        if (url.slice(-1) === "/") url = url.slice(0, -1)
        
        try {
          data = await axios.get(url, { timeout: 1000 * 40 })
          .then(res => res.doesNotExist.throwAnError)
          .catch(err => err)

          data = data.data
          //data = JSON.parse(data)
          success = true
          message = `Document/s mounted successfuly!`

        } catch (err) {
          data = {}
          success = false
          message = `Error!`
        }

        _data = { data, success, message }
      }

      else if (docs) {

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
            message = `An error occured!`

          }))
        })

        global.promises[id].push(...promises)
        await Promise.all((global.promises[id] || []))
        delete global.promises[id]
        /*
        if (project["accesskey"] !== req.headers["accesskey"]) {

          success = false
          message = `Your are not verified!`
          return res.send({ success, message })
        }
        */
      
        _data = { data, success, message }
      }

      else if (doc) {
        
        global.promises[id].push(ref.doc(doc.toString()).get().then(doc => {
          
          success = true
          data = doc.data()
          message = `Document mounted successfuly!`

        }).catch(error => {

          success = false
          message = `An error Occured!`
        }))
        
        // await Promise.all(promises)
        if (project["accesskey"] !== req.headers["accesskey"]) {

          success = false
          message = `Your are not verified!`
          _data = { success, message }
        }
        
        // await global.promises[global.promises.length - 1]
        await Promise.all((global.promises[id] || []))
        delete global.promises[id]
        _data = { data, success, message }
      }

      else if (!doc && !field) {
          
        if (search.orderBy || search.skip) ref = ref.orderBy(...toArray(search.orderBy || "id"))
        if (search.skip) ref = ref.offset(search.skip)
        if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)
        if (search.startAt) ref = ref.startAt(search.startAt)
        if (search.startAfter) ref = ref.startAfter(search.startAfter)
        if (search.endAt) ref = ref.endAt(search.endAt)
        if (search.endBefore) ref = ref.endBefore(search.endBefore)
        if (limit || 100) ref = ref.limit(limit || 100)
        
        global.promises[id].push(ref.get().then(q => {
          
          q.forEach(doc => data[doc.id] = doc.data())

          success = true
          message = `Documents mounted successfuly!`

        }).catch(error => {
          
          success = false
          message = `An error Occured!`
        }))
        
        // await Promise.all(promises)
        if (project["accesskey"] !== req.headers["accesskey"]) {

          success = false
          message = `Your are not verified!`
          return res.send({ success, message })
        }

        // await global.promises[global.promises.length - 1]
        await Promise.all((global.promises[id] || []))
        delete global.promises[id]
        _data = { data, success, message }
      }

      else {
        
        const myPromise = () => new Promise(async resolve => {

          // search field
          var multiIN = false, _ref = ref
          if (field) Object.entries(field).map(([key, value]) => {
            if (typeof value !== "object") value = { equal: value }
            var _value = value[Object.keys(value)[0]]
            var operator = toFirebaseOperator(Object.keys(value)[0])
            
            if (operator === "in" && _value.length > 10) {

              field[key][Object.keys(value)[0]] = [..._value.slice(10)]
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
        })

        global.promises[id].push(myPromise())
        
        // await global.promises[global.promises.length - 1]
        await Promise.all((global.promises[id] || []))
        delete global.promises[id]
        _data = { data, success, message }
      }
      
      console.log("SEARCH", _data)
      view.search = global.search = clone(_data)
    
      // await params
      if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, id, e, ...params, req, res, __: [...(global.search ? [global.search] : []), ...__] })

    } else {

      // search
      var myFn
      headers.search = encodeURI(jsonToBracket({ search }))
      headers["timestamp"] = (new Date()).getTime()
      headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

      if (search.url && !search.secure) {
    
        myFn = () => {
          return new Promise (async resolve => {
    
            var { data: _data } = await axios.get(search.url, {
              headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
              }
            })
    
            console.log("SEARCH", _data)
            view.search = global.search = clone(_data)
    
            // await params
            if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, id, e, ...params, req, res, __: [...(global.search ? [global.search] : []), ...__] })
    
            resolve()
          })
        }

      } else {
    
        var { data: _data } = await axios.get(`/${store}`, {
          headers: {
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
            ...headers
          }
        })

        console.log("SEARCH", _data)
        view.search = global.search = clone(_data)

        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, id, e, ...params, req, res, __: [...(global.search ? [global.search] : []), ...__] })
      }
    }
  }
}
},{"./clone":42,"./jsonToBracket":83,"./toArray":116,"./toAwait":117,"./toFirebaseOperator":124,"axios":142}],105:[function(require,module,exports){
const { isArabic } = require("./isArabic")

const setContent = ({ id, content = {} }) => {

  var view = window.views[id]
  var value = content.value !== undefined ? content.value : ""

  if (typeof value !== "string" && typeof value !== "number") return

  // not loaded yet
  if (!view.element) return

  if (view.input && view.input.type === "radio" && value) view.element.checked = "checked"
  else if (view.type === "Input" || view.type === "Textarea") view.element.value = value || ""
  else if (view.type === "UploadInput") view.element.value = value || null
  else if (view.type === "Text" || view.type === "Label" || view.type === "Header" ) view.element.innerHTML = value || ""

  isArabic({ id, value })
}

module.exports = {setContent}

},{"./isArabic":78}],106:[function(require,module,exports){
const {clone} = require("./clone")
const {reducer} = require("./reducer")

const setData = ({ id, data, __ }) => {

  var view = window.views[id]
  var global = window.global

  if (!global[view.Data]) return

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
  var derivations = clone(view.derivations)
  var keys = [...derivations, ...path]
  
  // set value
  reducer({ id, object: global[view.Data], path: keys, value: defValue, key: true, __: ["_"] })
/*
  view.data = value
  if (view.input && view.input.type === "file") return

  // setContent
  var content = data.content || value
  setContent({ id, content: { value: content } })
*/
}

module.exports = { setData }

},{"./clone":42,"./reducer":96}],107:[function(require,module,exports){
const { controls } = require("./controls")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
// const { starter } = require("./starter")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { defaultInputHandler } = require("./defaultInputHandler")
const { isArabic } = require("./isArabic")
const { resize } = require("./resize")

const setElement = ({ _window, id }) => {

    var view = window.views[id]
    if (!view) return console.log("No Element", id)
    
    // loading controls
    if (view.controls) {
      
      toArray(view.controls).map((controls = {}) => {
        var event = toCode({ _window, string: controls.event || "" })
        if (event.split("?")[0].split(";").find(event => event.slice(0, 7) === "loading") && toApproval({ id, string: controls.event.split('?')[2] })) 
          toParam({ id, string: controls.event.split("?")[1] })
      })
    }

    // status
    view.status = "Mounting Element"
    
    view.element = document.getElementById(id)
    if (!view.element) return delete window.views[id]
  
    // input handlers
    defaultInputHandler({ id })
  
    // arabic text
    // isArabic({ id })
    
    //var timer = (new Date()).getTime()
    // resize
    /*setTimeout(() => { */if (view.type === "Input" || view.type === "Entry") resize({ id }) //}, 0)
    /*global.myTimer += (new Date()).getTime() - timer
    timer = (new Date()).getTime()*/

    // status
    view.status = "Element Loaded"
}
    
module.exports = { setElement }
},{"./controls":46,"./defaultInputHandler":58,"./isArabic":78,"./resize":100,"./toApproval":115,"./toArray":116,"./toCode":120,"./toParam":130}],108:[function(require,module,exports){
const setPosition = ({ position = {}, id, e }) => {

  var views = window.views
  var leftDeviation = position.left
  var topDeviation = position.top
  var align = position.align
  var element = views[position.id || id].element
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

    positioner = views[positioner].element
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
  
  placement = element.placement || position.placement || "right"
  distance = parseFloat(element.distance || position.distance || 10)
  
  if (placement === "right") {

    left = rightPos + distance
    top = topPos + heightPos / 2 - height / 2
      
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "-0.5rem"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0 0 0.4rem"
    }

  } else if (placement === "left") {
    
    left = leftPos - distance - width
    top = topPos + heightPos / 2 - height / 2
      
    if (fin) {
      fin.style.right = "-0.5rem"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }

  } else if (placement === "top") {

    top = topPos - height - distance
    left = leftPos + widthPos / 2 - width / 2

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "-0.5rem"
      fin.style.borderRadius = "0 0 0.4rem 0"
    }

  } else if (placement === "bottom") {

    top = topPos + heightPos + distance
    left = leftPos + widthPos / 2 - width / 2

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "-0.5rem"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }
  }
  
  // deviation
  if (topDeviation) top = top + topDeviation
  if (leftDeviation) left = left + leftDeviation

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
  if (align === "left") element.style.left = leftPos + "px"
  else if (align === "top") element.style.top = topPos - height + heightPos + "px"
  else if (align === "bottom") element.style.bottom = bottomPos + "px"
  else if (align === "right") element.style.left = leftPos - width + widthPos + "px"
  
  if (fin) fin.style.left = "unset"
}

module.exports = {setPosition}

},{}],109:[function(require,module,exports){
(function (global){(function (){
const { reducer } = require("./reducer")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const sort = ({ _window, sort = {}, id, e }) => {

  var view = _window ? _window.views[id] : window.views[id]
  if (!view) return
  
  // data
  var Data = sort.Data || view.Data
  var options = global[`${Data}-options`] = global[`${Data}-options`] || {}
  var data = sort.data || global[Data]
  var sortBy = options.sortBy || view.sortBy || sort.sortBy || sort.by || "descending"

  if (sort.ascending) sortBy = "ascending"
  else if (sort.descending) sortBy = "descending"
  else if (sort.sortBy || sort.sortby || sort.by) sortBy = sort.sortBy || sort.sortby || sort.by
  options.sortBy = view.sortBy = sortBy

  // path
  var path = sort.path
  if (typeof sort.path === "string") path = toArray(toCode({ _window, string: path, e }).split("."))
  if (!path) path = []
  var isDate = false
  
  if (!Array.isArray(data) && typeof data === "object") data = Object.values(data)

  data.sort((a, b) => {
    
    a = reducer({ _window, id, path, object: a, e }) || "!"
    
    if (a !== undefined) {
      a = a.toString()

      // date
      /*if (a.split("-")[2] && !isNaN(a.split("-")[2].split("T")[0])) {
        var year = parseInt(a.split("-")[2].split("T")[0])
        var month = parseInt(a.split("-")[1])
        var day = parseInt(a.split("-")[0])
        a = {year, month, day}
        isDate = true
      }*/
    }

    b = reducer({ _window, id, path, object: b, e }) || "!"

    if (b !== undefined) {
      b = b.toString()

      // date
      /*if (b.split("-")[2] && !isNaN(b.split("-")[2].split("T")[0])) {
        var year = parseInt(b.split("-")[2].split("T")[0])
        var month = parseInt(b.split("-")[1])
        var day = parseInt(b.split("-")[0])
        b = {year, month, day}
        isDate = true
      }*/
    }

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
},{"./reducer":96,"./toArray":116,"./toCode":120}],110:[function(require,module,exports){
const _controls_ = require("../control/control")
const { toArray } = require("./toArray")

const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")

  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Functions"

  // lunch auto controls
  Object.entries(_controls_).map(([type, control]) => {

    if (view[type]) {
      
      view.controls = toArray(view.controls)
      var _controls = control({ id, controls: view[type] })
      _controls && view.controls.push(..._controls)
    }
  })

  // mouseenter, click, mouseover...
  defaultEventHandler({ id })
  
  // execute controls
  if (view.controls) controls({ id })

  view.status = "Mounted"
}

module.exports = { starter }

},{"../control/control":13,"./controls":46,"./event":61,"./toArray":116}],111:[function(require,module,exports){
const setState = ({}) => {}

module.exports = {setState};

},{}],112:[function(require,module,exports){
const { resize } = require("./resize")
const { toArray } = require("./toArray")

const setStyle = ({ id, style = {} }) => {

  var view = window.views[id]
  view.style = view.style || {}
  
  Object.entries(style).map(([key, value]) => {

    if (key === "after") return
    var timer = 0
    if (value || value === 0) value = value + ""

    const style = () => {
      // value = width || height
      if (value) {

        if (value === "available-width") {
          var left = view.element.getBoundingClientRect().left
          var tWidth = window.innerWidth
          if (left) {
            value = (tWidth - left) + "px"
          } else {
            key = "flex"
            value = "1"
          }
          
        } else if (value === "width" || value.includes("width/")) {

          var divide = value.split("/")[1]
          value = view.element.clientWidth
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (value === "height" || value.includes("height/")) {

          var divide = value.split("/")[1]
          value = view.element.clientHeight
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (key === "left" && value === "center") {

          var width = view.element.offsetWidth
          var parentWidth = window.views[view.parent].element.clientWidth

          value = parentWidth / 2 - width / 2 + "px"
        }
      }

      if (view.element) view.element.style[key] = value
      else view.style[key] = value
    }

    if (timer) view[`${key}-timer`] = setTimeout(style, timer)
    else style()

    // resize
    if (key === "width") setTimeout(() => resize({ id }), 0)
  })
}

const resetStyles = ({ id, style = {} }) => {

  var view = window.views[id]
  view.afterStylesMounted = false

  Object.entries({...view.style.after, ...(view.hover && view.hover.style || {})}).map(([key]) => {
    if (view.style[key] !== undefined) style[key] = view.style[key]
    else style[key] = null
  })
  
  setStyle({ id, style })
}

const toggleStyles = ({ id }) => {

  var view = window.views[id]
  if (view.afterStylesMounted) resetStyles({ id, style })
  else mountAfterStyles({ id })
}

const mountAfterStyles = ({ id }) => {

  var view = window.views[id]
  if (!view.style || !view.style.after) return

  view.afterStylesMounted = true

  Object.entries(view.style.after).map(([key, value]) => {

    var timer = 0
    value = value + ""
    if (value.includes(">>")) {
      timer = value.split(">>")[1]
      value = value.split(">>")[0]
    }

    var myFn = () => view.element.style[key] = value

    if (timer) view[`${key}-timer`] = setTimeout(myFn, timer)
    else {

      if (view.element) myFn()
      else {
        view.controls = toArray(view.controls)
        return view.controls.push({
          event: `loaded?().element.style.${key}=${value}`
        })
      }
    }
  })
}

module.exports = { setStyle, resetStyles, toggleStyles, mountAfterStyles }

},{"./resize":100,"./toArray":116}],113:[function(require,module,exports){
module.exports = (k) => {
  
  if (k === "userSelect") k = "user-select";
  else if (k === "inlineSize") k = "inline-size";
  else if (k === "clipPath") k = "clip-path";
  else if (k === "flexWrap") k = "flex-wrap";
  else if (k === "wordWrap") k = "word-wrap";
  else if (k === "wordBreak") k = "word-break";
  else if (k === "verticalAlign") k = "vertical-align";
  else if (k === "borderBottom") k = "border-bottom";
  else if (k === "borderLeft") k = "border-left";
  else if (k === "borderRight") k = "border-right";
  else if (k === "borderTop") k = "border-top";
  else if (k === "paddingBottom") k = "padding-bottom";
  else if (k === "paddingLeft") k = "padding-left";
  else if (k === "paddingRight") k = "padding-right";
  else if (k === "paddingTop") k = "padding-top";
  else if (k === "marginBottom") k = "margin-bottom";
  else if (k === "marginLeft") k = "margin-left";
  else if (k === "marginRight") k = "margin-right";
  else if (k === "marginTop") k = "margin-top";
  else if (k === "fontFamily") k = "font-family";
  else if (k === "fontSize") k = "font-size";
  else if (k === "fontStyle") k = "font-style";
  else if (k === "fontWeight") k = "font-weight";
  else if (k === "textDecoration") k = "text-decoration";
  else if (k === "lineHeight") k = "line-height";
  else if (k === "letterSpacing") k = "letter-spacing";
  else if (k === "textOverflow") k = "text-overflow";
  else if (k === "whiteSpace") k = "white-space";
  else if (k === "backgroundImage") k = "background-image";
  else if (k === "backgroundColor") k = "background-color";
  else if (k === "zIndex") k = "z-index";
  else if (k === "boxShadow") k = "box-shadow";
  else if (k === "borderRadius") k = "border-radius";
  else if (k === "zIndex") k = "z-index";
  else if (k === "alignItems") k = "align-items";
  else if (k === "alignSelf") k = "align-self";
  else if (k === "justifyContent") k = "justify-content";
  else if (k === "justifySelf") k = "justify-self";
  else if (k === "userSelect") k = "user-select";
  else if (k === "userDrag") k = "user-drag";
  else if (k === "textAlign") k = "text-align";
  else if (k === "pointerEvents") k = "pointer-events";
  else if (k === "flexDirection") k = "flex-direction";
  else if (k === "flexGrow") k = "flex-grow";
  else if (k === "flexShrink") k = "flex-shrink";
  else if (k === "maxWidth") k = "max-width";
  else if (k === "minWidth") k = "min-width";
  else if (k === "maxHeight") k = "max-height";
  else if (k === "minHeight") k = "min-height";
  else if (k === "overflowX") k = "overflow-x";
  else if (k === "overflowY") k = "overflow-y";
  else if (k === "rowGap") k = "row-gap";
  else if (k === "columnGap") k = "column-gap";
  else if (k === "pageBreakInside") k = "page-break-inside";
  else if (k === "pageBreakBefore") k = "page-break-before";
  else if (k === "pageBreakAfter") k = "page-break-after";
  else if (k === "gridTemplateColumns") k = "grid-template-columns";
  else if (k === "gridAutoColumns") k = "grid-auto-columns";
  else if (k === "gridTemplateRows") k = "grid-template-rows";
  else if (k === "gridAutoRows") k = "grid-auto-columns";
  else if (k === "writingMode") k = "writing-mode";
  return k
}
},{}],114:[function(require,module,exports){
const { setStyle } = require("./style")
const { capitalize } = require("./capitalize")
const { clone } = require("./clone")

const switchMode = ({ mode, _id = "body" }) => {

    var view = window.views
    var children = [...view[_id].element.children]

    mode = mode.toLowerCase()
    if (mode === window.global.mode.toLowerCase()) return

    children.map(el => {
        
        var local = view[el.id], style = {}
        if (!local) return
            
        if (local.mode) {
            
            if (mode === window.global["default-mode"].toLowerCase()) {

                style = clone(local.mode[mode] ? (local.mode[mode].style || {}) : {})
                Object.keys(local.mode).map(_mode => {
                    if (_mode.toLowerCase() !== mode) {
                        Object.entries(local.mode[_mode].style).map(([k, v]) => {
                            style[k] = style[k] || local.style[k] || null
                        })
                    }
                })
                
            } else if (local.mode[mode]) style = local.mode[mode].style

            setStyle({ id: el.id, style })

            // hover
            local.hover && local.hover.style && Object.keys(local.hover.style).map(key => 
                local.hover.before[key] = style[key] !== undefined ? style[key] : null 
            )

            // clicked
            local.clicked && local.clicked.style && Object.keys(local.clicked.style).map(key => 
                local.clicked.before[key] = style[key] !== undefined ? style[key] : null 
            )

            // click
            local.click && local.click.style && Object.keys(local.click.style).map(key => 
                local.click.before[key] = style[key] !== undefined ? style[key] : null 
            )

            // touch
            local.touch && local.touch.style && Object.keys(local.touch.style).map(key => 
                local.touch.before[key] = style[key] !== undefined ? style[key] : null 
            )
        }
        
        switchMode({ _id: el.id, mode })
    })

    // set global mode view
    if (_id === "body") window.global.mode = capitalize(mode)
}

module.exports = {switchMode}
},{"./capitalize":40,"./clone":42,"./style":112}],115:[function(require,module,exports){
const { isEqual } = require("./isEqual")

const toApproval = ({ _window, lookupActions, awaits, e, string, params = {}, id = "root", __, req, res, object, elser }) => {

  const { toFunction } = require("./toFunction")
  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")

  // no string but object exists
  if (!string)
    if (object) return true
    else if (object !== undefined) return false

  // no string
  if (!string || typeof string !== "string") return true

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var mainId = id, approval = true
  
  if ((global.__actionReturns__[0] || {}).returned) return

  // coded
  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // ==
  string = string.replace("==", "=")

  string.split(";").map(condition => {

    // no condition
    if (condition === "") return true
    if (!approval) return false

    id = mainId
    var view = views[id] || {}

    if (condition.charAt(0) === "#") {
      if (elser) return approval = false
      else return
    }

    // or
    if (condition.includes("||")) {
      var conditions = condition.split("||"), _i = 0
      approval = false
      while (!approval && conditions[_i] !== undefined) {
        if (conditions[_i].slice(0,2) === "=") conditions[_i] = conditions[0] + conditions[_i]
        approval = toApproval({ _window, lookupActions, awaits, e, string: conditions[_i], id, __, params, req, res, object, elser: true })
        _i += 1
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

    var key = condition[0]
    var value = condition[1]
    var notEqual

    // /////////////////// value /////////////////////

    if (value) value = toValue({ _window, lookupActions, awaits, id: mainId, value, e, __, req, res, params, condition: true })

    // /////////////////// key /////////////////////

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]
    if (key && key.includes('codedS()') && key.length === 13) {
      if (value === undefined) return approval = global.codes[key] ? true : false
      else return approval = global.codes[key] === value
    }

    // operator has !
    if (key.includes("!")) {
      if (key.split("!")[0]) {

        if (condition[1]) {
          notEqual = true
          key = key.split("!")[0]
        }

      } else {

        key = key.split("!")[1]
        notEqual = true
      }
    }

    //
    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0], myKey

    // function
    if (path0.slice(-2) === "()") {
    var isFn = toFunction({ _window, lookupActions, awaits, id, req, res, __, e, path, path0, condition: true });
    if (isFn !== "__CONTINUE__") return approval = notEqual ? !isFn : isFn
    }

    if (!key && object !== undefined) myKey = object
    else if (key === "undefined") myKey = undefined
    else if (key === "false") myKey = false
    else if (key === "true") myKey = true
    else if (key === "desktop()") myKey = global.device.device.type === "desktop"
    else if (key === "tablet()") myKey = global.device.device.type === "tablet"
    else if (key === "mobile()") myKey = global.device.device.type === "smartphone"
    else if (key.charAt(0) === "_" && !key.split("_").find(i => i !== "_" && i !== "")) myKey = __[key.split("_").length - 2]
    else if (object || path[0].includes("()") || (path[1] && path[1].includes("()"))) myKey = reducer({ _window, lookupActions, awaits, id, path, e, __, params, req, res, object, condition: true })
    else myKey = reducer({ _window, lookupActions, awaits, id, path, e, __, req, res, params, object: object ? object : view, condition: true })
    // else myKey = key

    if (params["return()"] !== undefined) {

      approval = params["return()"]

    } else if (!equalOp && !greaterOp && !lessOp) {

      approval = notEqual ? !myKey : (myKey === 0 ? true : myKey)

    } else {
      
      if (equalOp) approval = notEqual ? !isEqual(myKey, value) : isEqual(myKey, value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(myKey) > parseFloat(value)) : (parseFloat(myKey) > parseFloat(value))
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(myKey) < parseFloat(value)) : (parseFloat(myKey) < parseFloat(value))
    }
  })

  return approval
}

module.exports = { toApproval }

},{"./isEqual":79,"./reducer":96,"./toFunction":125,"./toValue":134}],116:[function(require,module,exports){
const toArray = (data) => {
  return data !== undefined ? (Array.isArray(data) ? data : [data]) : [];
}

module.exports = {toArray}

},{}],117:[function(require,module,exports){
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const toAwait = ({ _window, lookupActions, awaits = [], myawait, id, e, req, res, __, asyncer, awaiter, ...params }) => {

  const { execute } = require("./execute")
  const { toParam } = require("./toParam")
  
  if (!asyncer) return
  var keepGoingOn = true
  var global = _window ? _window.global : window.global

  if (myawait && myawait.await) awaitHandler({ _window, myawait, req, res, lookupActions, awaits, id, e, __, ...params })

  // get params
  while (awaits.length > 0 && keepGoingOn) {
  
    var _await = awaits[0]
    if (keepGoingOn) keepGoingOn = !_await.hold
    if (keepGoingOn) {

      if (_await.await) {

        var _await_ = toCode({ _window, string: toCode({ _window, string: _await.await }), start: "'", end: "'" })
        var __params = _await.passGlobalFuncData ? { __: [...(global.func ? [global.func] : []), ...__] } : { __ }

        var conditions = _await_.split("?")[1], approved = true
        if (conditions) approved = toApproval({ _window, string: conditions, e, id, req, res, __, awaits, lookupActions })

        _await_ = _await_.split("?")[0]

        if (_await.waiter) global.__waiters__.unshift(_await.waiter)
        if (approved) toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, ...__params, req, res, ...(_await.params || {}) })
        if (_await.waiter) global.__waiters__.splice(0, 1)

        if (_await.log) console.log(_await.log);
      }
      
      var index = toArray(awaits).findIndex(item => item.id === _await.id)
      if (index !== -1) toArray(awaits).splice(index, 1)
      if (index !== 0) keepGoingOn = false

      if (_await.waiter) console.log("STACK", _await.action, clone(awaits).reverse().map((z, i) => ([i, z.action, "hold: " + (z.hold || "false"), "wait: " + (z.await || "X"), "id: " + z.id, "waiter: " + (z.waiter || "X")])));
      //if (_await.waiter && awaits.length > 0 && awaits[0].id === _await.waiter) awaits[0].hold = false
   }
  }

  // override params
  if (awaiter) execute({ _window, lookupActions, awaits, id, e, actions: awaiter, params: _params, __, req, res})
}

const awaitHandler = ({_window, req, res, myawait, lookupActions, awaits, id, e, __, ...params }) => {
  
  var global = _window ? _window.global : window.global
  const { toParam } = require("./toParam")

  if (myawait.await) {
    var _params, _await_ = toCode({ _window, string: toCode({ _window, string: myawait.await, start: "'", end: "'" }) })

    var conditions = _await_.split("?")[1], approved = true
    if (conditions) {
      approved = toApproval({ _window, string: conditions, e, id, req, res, __: [...(_params !== undefined ? [_params] : []), ...__], awaits, lookupActions, ...params })
    }

    _await_ = _await_.split("?")[0]
    var _params = myawait.params
    var index = awaits.findIndex(item => item.id === myawait.id)

    if (index !== -1) {

      if (awaits[index].log) console.log(awaits[index].log);
      awaits.splice(index, 1)
    }
    
    if (myawait.waiter) global.__waiters__.unshift(myawait.waiter)
    if (approved) _params = toParam({ _window, lookupActions, awaits, id, e, string: _await_, asyncer: true, __, req, res, ...params, ...(_params || {}) })
    if (myawait.waiter) global.__waiters__.splice(0, 1)
  }

  console.log("STACK", myawait.action, clone(awaits).reverse().map((z, i) => ([i, z.action, "hold: " + (z.hold || "false"), "wait: " + (z.await || "X"), "id: " + z.id, "waiter: " + (z.waiter || "X")])));
  //if (myawait.waiter && awaits.length > 0 && awaits[0].id === myawait.waiter) { awaits[0].hold = false }
}

module.exports = {toAwait}
},{"./clone":42,"./execute":63,"./toArray":116,"./toCode":120,"./toParam":130}],118:[function(require,module,exports){
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
},{}],119:[function(require,module,exports){
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
},{}],120:[function(require,module,exports){
const { generate } = require("./generate")

const toCode = ({ _window, string, e, codes, start = "[", end = "]" }) => {

  if (typeof string !== "string") return string
  var codeName = start === "'" ? "codedS()" : "coded()", global = {}
  if (!codes) global = _window ? _window.global : window.global

  // split []
  //if (start === "[") string = string.split("[]").join("__map__")

  var keys = string.split(start)

  if (keys[1] !== undefined) {

    var key = `${codeName}${generate()}`
    var subKey = keys[1].split(end)

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {

      keys[1] += `${start}${keys[2]}`
      if (keys[1].includes(end) && keys[2]) {
        keys[1] = toCode({ _window, string: keys[1], e, start, end })
      }
      keys.splice(2, 1)
      subKey = keys[1].split(end)
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) {

      keys = keys.join(start)
      return keys
    }

    //if (start === "[") subKey[0] = subKey[0].split("__map__").join("[]")
    if (subKey[0].split("'").length > 1) subKey[0] = toCode({ _window, string: subKey[0], start: "'", end: "'" })
    if (codes) codes[key] = subKey[0]
    else global.codes[key] = subKey[0]

    var value = key
    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join(start) ? `${start}${keys.join(start)}` : ""

    string = `${before}${value}${subKey.join(end)}${after}`
  }

  if (string.split(start)[1] !== undefined && string.split(start).slice(1).join(start).length > 0) string = toCode({ _window, string, e, start, end })

  return string
}

module.exports = { toCode }
},{"./generate":70}],121:[function(require,module,exports){
const {generate} = require("./generate")
const {toArray} = require("./toArray")

const toComponent = (obj) => {
  // class
  obj.class = obj.class || ""

  // id
  obj.id = obj.id || generate()

  // style
  obj.style = obj.style || {}
  obj.style.after = obj.style.after || {}

  // controls
  obj.controls = toArray(obj.controls)

  // children
  obj.children = toArray(obj.children)

  // model
  obj.featured = obj.featured && "featured"
  obj.model = obj.model || obj.featured || "classic"

  // component
  obj.component = true

  return obj
}

module.exports = {toComponent}

},{"./generate":70,"./toArray":116}],122:[function(require,module,exports){
const toControls = ({ id }) => {}

module.exports = {toControls}

},{}],123:[function(require,module,exports){
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
},{}],124:[function(require,module,exports){
module.exports = {
    toFirebaseOperator: (string) => {
        if (!string || string === 'equal' || string === 'equals' || string === 'equalsTo' || string === 'equalTo' || string === 'is') return '=='
        if (string === 'notEqual' || string === 'different' || string === 'isnot') return '!='
        if (string === 'greaterOrEqual' || string === 'greaterorequal') return '>='
        if (string === 'lessOrEqual' || string === 'lessorequal') return '<='
        if (string === 'less' || string === 'lessthan' || string === 'lessThan') return '<'
        if (string === 'greater' || string === 'greaterthan' || string === 'greaterThan') return '>'
        if (string === 'contains' || string === 'contain') return 'array-contains'
        if (string === '!contains' || string === 'doesnotContain' || string === 'doesnotcontain') return 'array-contains-any'
        if (string === 'includes' || string === 'include') return 'in'
        if (string === '!includes' || string === 'doesnotInclude' || string === 'doesnotinclude') return 'not-in'
        else return string
    }
}
},{}],125:[function(require,module,exports){
const { func } = require("./func")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const { isParam } = require("./isParam")
const { toValue } = require("./toValue")
const { toParam } = require("./toParam")
const actions = require("./actions.json")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")

const toFunction = ({ _window, id, req, res, __, e, path, path0, condition, params = {}, mount, asyncer, toView, executer, object, lookupActions = {}, awaits = [], isView = false }) => {

  var global = _window ? _window.global : window.global
  var views = _window ? _window.views : window.views
  var view = views[id], backendFn = false, isFn = false
  
  if (path.length === 1 && path0 !== "()" && path0.slice(-2) === "()" && path0 !== "_()" && !actions.includes(path0) && path0.slice(0, 7) !== "coded()") {
    
    var newLookupActions
    var myViews = (view || {})["my-views"] || []
    
    // lookup through map actions
    toArray(lookupActions).map((lookupActions, indexx) => {
      if (lookupActions.fn) {
        
        var fn = lookupActions.fn
        clone(fn).reverse().map((myfn, i) => {

          if (!isFn) {
            
            var functions = clone(lookupActions.view === "_project_" ? global.data.project.functions : global.data[lookupActions.viewType][lookupActions.view].functions) || {}
            isFn = Object.keys(clone(fn).slice(0, fn.length - i).reduce((o, k) => o[k] || {}, functions)).find(fn => fn === path0.slice(0, -2))

            if (isFn) {

              isFn = fn.slice(0, fn.length - i).reduce((o, k) => o[k], functions)[isFn]
              if (typeof isFn === "object" && isFn._) {

                isFn = isFn._ || ""
                newLookupActions = { view: lookupActions.view, fn: [...fn, path0.slice(0, -2)], viewType: lookupActions.viewType || "view" }
                if (toArray(lookupActions).length > 1) newLookupActions = [newLookupActions, ...toArray(lookupActions).slice(indexx)]

              } else if (toArray(lookupActions).length > 1) toArray(lookupActions).slice(indexx)
            }
          }
        })
      }
    })

    // lookup through parent views' actions => server actions
    if (!isFn) {

      clone(["_project_", ...myViews]).reverse().map((myview, i) => {

        if (!isFn) {
          
          if (myview !== "_project_" && !global.data[i === myViews.length - 1 ? "page" : (view.viewType || "view")][myview]) return
          var functions = myview === "_project_" ? global.functions : (global.data[i === myViews.length - 1 ? "page" : (view.viewType || "view")][myview].functions) || {}
          isFn = (Array.isArray(functions) ? functions : Object.keys(functions)).find(fn => fn === path0.slice(0, -2))
          
          if (isFn) {

            if (myview === "_project_") {
              
              // backend function
              backendFn = true
              newLookupActions = { view: myview, fn: [isFn] }

            } else {

              if (!isView && typeof functions[isFn] === "object") {

                isFn = functions[isFn]._ || ""
                newLookupActions = { view: myview, fn: [path0.slice(0, -2)], viewType: i === myViews.length - 1 ? "page" : view.viewType }

              } else isFn = functions[isFn]
            }
          }
        }
      })
    }

    if (isFn) {
      
      var _params, args = path[0].split(":")
      
      if (backendFn) {
      
        var _data
        if (isParam({ _window, string: args[1] })) _data = toParam({ req, res, __, e, _window, id, string: args[1], params, condition, lookupActions })
        else _data = toValue({ req, res, _window, id, e, __, value: args[1], params, condition, lookupActions })

        var _func = { function: isFn, data: _data, log: { action: params.func, send: global.func } }
        var _await = global.codes[args[2]], myawait = { id: generate(), hold: true, await: _await, action: path0, passGlobalFuncData: _window ? true: false, log: { action: path0, await: _await, data: _params, success: true, message: "Action executed successfully!", path: (newLookupActions ? newLookupActions : lookupActions).fn || [] }, params: { e, id, mount, object, asyncer, toView, executer, condition, lookupActions } }
    
        if (_await) awaits.unshift(myawait)
        if (global.__waiters__.length > 0) myawait.waiter = global.__waiters__[0]

        var _lookupActions = _window && lookupActions ? [...toArray(newLookupActions ? newLookupActions : lookupActions), ...toArray(lookupActions)] : (newLookupActions ? newLookupActions : lookupActions)
        console.log("ACTION " + path0);
        var answer = func({ _window, req, res, id, e, func: _func, __, asyncer: true, awaits, myawait, lookupActions: _lookupActions })

        return answer
      }

      if (args[1]) {

        if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, __, string: args[1], params, lookupActions/*, condition*/ })
        else _params = toValue({ req, res, _window, id, e, __, value: args[1], params, lookupActions/*, condition*/ })
      }
      
      if (isFn) {

        // await
        var answer, _await = global.codes[args[2]], myawait = { id: generate(), hold: false, await: _await, action: path0, log: { action: path0, await: _await, data: _params, success: true, message: "Action executed successfully!", path: (newLookupActions ? newLookupActions : lookupActions).fn }, params: {e, id, mount, object, __: [...(_params !== undefined ? [_params] : []), ...__], asyncer, toView, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions} }
        awaits.unshift(myawait)
        if (global.__waiters__.length > 0) myawait.waiter = global.__waiters__[0]
        
        console.log("ACTION " + path0);

        if (!isView) {

          isFn = toCode({ _window, id, string: toCode({ _window, id, string: isFn, start: "'", end: "'" }) })

          if (isFn.includes('coded()') && isFn.length === 12) isFn = global.codes[isFn]
          
          var conditions = isFn.split("?")[1]
          if (conditions) {
            var approved = toApproval({ _window, string: conditions, e, id, req, res, params, object, __: [...(_params !== undefined ? [_params] : []), ...__], awaits, lookupActions: newLookupActions ? newLookupActions : lookupActions })
            if (!approved) return
          }

          isFn = isFn.split("?")[0]

        } else {

          var view = views[id]
          if (typeof isFn === "object") views[id] = { ...view, ...isFn }
          else view.view = view.type = isFn
          
          view.view = view.type = toCode({ _window, id, string: toCode({ _window, id, string: view.view, start: "'", end: "'" }) })
        }

        var actionReturnID = generate()
        global.__actionReturns__.unshift({ id: actionReturnID })
        if (!condition) {
          
          if (isView) 
            answer = require("./toView").toView({ _window, lookupActions, id, req, res, __: [...(_params !== undefined ? [_params] : []), ...__], awaits, lookupActions: newLookupActions ? newLookupActions : lookupActions })
          else if (isParam({ _window, string: isFn }))
            answer = toParam({ _window, string: isFn, e, id, req, res, mount, object, __: [...(_params !== undefined ? [_params] : []), ...__], asyncer, awaits, toView, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions })
          else {
            answer = toValue({ _window, value: isFn, e, id, req, res, mount, object, __: [...(_params !== undefined ? [_params] : []), ...__], asyncer, awaits, toView, params, executer, condition, lookupActions: newLookupActions ? newLookupActions : lookupActions })
          }
        } else answer = toApproval({ _window, string: isFn, e, id, req, res, mount, params, object, __: [...(_params !== undefined ? [_params] : []), ...__], awaits, lookupActions: newLookupActions ? newLookupActions : lookupActions })
        
        if (global.__actionReturns__[0].returned) answer = global.__actionReturns__[0].value
        global.__actionReturns__.splice(global.__actionReturns__.findIndex(ret => ret.id === actionReturnID), 1)
        myawait.hold = false

        // await params
        if (awaits.findIndex(i => i.id === myawait.id) === 0) {

          if (_await) {

            require("./toAwait").toAwait({ _window, lookupActions, id, e, asyncer: true, myawait, awaits, req, res, __: [global.search, ...__] })

          } else {

            awaits.splice(awaits.findIndex(i => i.id === myawait.id), 1)
            // console.log({ action: path0, data: _params, success: true, message: "Action executed successfully!", path: (newLookupActions ? newLookupActions : lookupActions).fn || [] })
          }
        }

        return answer
      }
    }
  }

  return "__CONTINUE__"
}

module.exports = { toFunction }
},{"./actions.json":37,"./clone":42,"./func":68,"./generate":70,"./isParam":80,"./toApproval":115,"./toArray":116,"./toAwait":117,"./toCode":120,"./toParam":130,"./toValue":134,"./toView":135}],126:[function(require,module,exports){
const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { labelHandler } = require("./labelHandler")

module.exports = ({ _window, id, innerHTML }) => {

  var views = _window ? _window.views : window.views
  var view = views[id]

  var text = view.text !== undefined && view.text !== null ? view.text.toString() : typeof view.data !== "object" ? view.data : ''
  var checked = view.input && view.input.type === "radio" && parseFloat(view.data) === parseFloat(view.input.defaultValue)
  var value = "", type = view.type
  
  // children IDs
  if (view.parent && views[view.parent]) {
    if(!views[view.parent].childrenID) views[view.parent].childrenID = []
    views[view.parent].childrenID.push(id)
  }

  if (view.type === "Input") value = (view.input && view.input.value) !== undefined ? view.input.value : view.data !== undefined ? view.data : ""

  // innerhtml
  innerHTML = innerHTML || (view.type !== "View" && view.type !== "Box" ? text : "")

  // required
  if (view.required && view.type === "Text") {
    if (typeof view.required === "string") view.required = {}
    type = "View"
    view.style.display = "block"
    innerHTML += `<span style='color:red; font-size:${(view.required.style && view.required.style.fontSize)||"1.6rem"}; padding:${(view.required.style && view.required.style.padding)||"0 0.4rem"}'>*</span>`
  }
  
  // styles
  var tag, style = toStyle({ _window, id })
  if (typeof value === 'object') value = ''
  if (innerHTML) innerHTML = innerHTML.toString().replace(/\\/g, '');

  // html attributes
  var atts = Object.entries(view.att || view.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

  if (view.editable) view.input = {type: "text"}
  
  if (type === "View" || type === "Box") {
    tag = `<div ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ''} spellcheck='false' ${view.editable && !view.readonly ? 'contenteditable' : ''} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML || view.text || ''}</div>`
  } else if (type === "Image") {
    tag = `<img ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index || 0}' ${view.src ? `src='${view.src}'` : ""}></img>`
  } else if (type === "Tag" && view.tag) {
    tag = `<${view.tag.toLowerCase()} ${atts} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${view.content}</${view.tag.toLowerCase()}>`
  } /*else if (type === "Table") {
    tag = `<table ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</table>`
  } else if (type === "Row") {
    tag = `<tr ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</tr>`
  } else if (type === "Header") {
    tag = `<th ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</th>`
  } else if (type === "Cell") {
    tag = `<td ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</td>`
  } else if (type === "Label") {
    tag = `<label ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
  } else if (type === "Span") {
    tag = `<span ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
  } */else if (type === "Text") {
    if (view.label) {
      tag = `<label ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
    } else if (view.h1) {
      tag = `<h1 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h1>`
    } else if (view.h2) {
      tag = `<h2 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h2>`
    } else if (view.h3) {
      tag = `<h3 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h3>`
    } else if (view.h4) {
      tag = `<h4 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h4>`
    } else if (view.h5) {
      tag = `<h5 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h5>`
    } else if (view.h6) {
      tag = `<h6 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h6>`
    } else if (view.span) {
      tag = `<span ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
    } else {
      tag = `<p ${atts} ${view.editable || view.contenteditable ? "contenteditable ": ""}class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${text}</p>`
    }
  } else if (type === "Icon") {
    tag = `<i ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined": (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || "" || ""} ${view.icon.name}' id='${view.id}' style='${style}${_window ? "; opacity:0; transition:.2s" : ""}' index='${view.index || 0}'>${view.google ? view.icon.name : ""}</i>`
  } else if (type === "Textarea") {
    tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${view.data || view.value || view.input.value || ""}</textarea>`
  } else if (type === "Input") {
    if (view.textarea) {
      tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${value}</textarea>`
    } else {
      tag = `<input ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} ${view.multiple?"multiple":""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${style}' ${view.input.name ? `name="${view.input.name}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.type || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.input.defaultValue ? `defaultValue="${view.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index || 0}'/>`
    }
  } /*else if (type === "Paragraph") {
    tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' index='${view.index || 0}'>${text}</textarea>`
  } */else if (type === "Video") {

    tag = `<video ${atts} style='${style}' controls>
      ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>`: "")}
      ${view.alt || view.message || ""}
    </video>`
  }

  // label
  if (view.label && !view.labeled) tag = labelHandler({ _window, id, tag })

  return tag
}
},{"./labelHandler":85,"./toArray":116,"./toStyle":133}],127:[function(require,module,exports){
const { generate } = require("./generate")

const toId = ({ string, checklist = [] }) => {
    
    var newId
    string = string.split(" ").join("-").toLowerCase()
    var candidates = [
        string, string.split("-").join(""), string.split("-").slice(1).join("-") + string.split("-")[0],
        string + "1", string + "2", string + "3", string + "4", string + "5", string + "6", string + "7",
        string + "8", string + "9", string + "10", string + "11", string + "12", string + "13", string + "14",
        string + "15", string + "16", string + "17", string + "18", string + "19", string + "20", string + "21"
    ]
    
    candidates.map(cand => {

      if (newId) return
      var exists = checklist.find(id => id === cand)
      if (!exists) newId = cand
    })
    
    if (!newId) newId = generate(12)
    // checklist.push(newId)
    
    return newId
}

module.exports = {toId}

},{"./generate":70}],128:[function(require,module,exports){
module.exports = {
  toNumber: (string) => {
    
    if (!string) return string
    if (typeof string === 'number') return string
    if (!isNaN(string)) return parseFloat(string)
    else return parseFloat(string.match(/[\d\.]+/) || 0)
    
    /*if ((parseFloat(string) || parseFloat(string) === 0)  && (!isNaN(string.charAt(0)) || string.charAt(0) === '-')) {
      if (!isNaN(string.split(",").join(""))) {
        // is Price
        string = parseFloat(string.split(",").join(""));

      } else if (parseFloat(string).length === string.length) parseFloat(string)
    }

    return string*/
  },
};

},{}],129:[function(require,module,exports){
module.exports = {
    toOperator: (string) => {
        if (!string || string === 'equal' || string === 'equals' || string === 'equalsTo' || string === 'equalTo' || string === 'is') return '=='
        if (string === 'notEqual' || string === 'different' || string === 'isnot') return '!='
        if (string === 'greaterOrEqual' || string === 'greaterorequal') return '>='
        if (string === 'lessOrEqual' || string === 'lessorequal') return '<='
        if (string === 'less' || string === 'lessthan' || string === 'lessThan') return '<'
        if (string === 'greater' || string === 'greaterthan' || string === 'greaterThan') return '>'
        if (string === 'contains' || string === 'contain') return 'array-contains'
        if (string === 'containsAny' || string === 'containAny' || string === "contains-any" || string === "contain-any") return 'array-contains-any'
        if (string === 'includes' || string === 'include') return 'in'
        if (string === '!includes' || string === 'doesnotInclude' || string === 'doesnotinclude') return 'not-in'
        else return string
    }
} 
},{}],130:[function(require,module,exports){
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { decode } = require("./decode")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { isParam } = require("./isParam")
const { toArray } = require("./toArray")
const actions = require("./actions.json")
const { getType } = require("./getType")
const { override } = require("./merge")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, lookupActions, awaits = [], string, e, id = "root", req, res, mount, object, __, _i, asyncer, toView, params = {}, executer, condition }) => {
  
  // break
  if (params && params["return()"] !== undefined) return params["return()"]
  else if (params["break()"]) return params

  const { toFunction } = require("./toFunction")
  const { toApproval } = require("./toApproval")
  var _functions = require("./function")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  
  if ((global.__actionReturns__[0] || {}).returned) return

  if (typeof string !== "string" || !string) return string || {}
  params = object || params

  while (string.includes('coded()') && string.length === 12) { string = global.codes[string] }
  if (string.includes('codedS()') && string.length === 13) return global.codes[string]

  // condition not param
  if (!toView && string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, lookupActions, awaits, e, string: string.replace("==", "="), req, res, _window, __, _i, object })
  // if (toView) _ = views[id]._
  
  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = views[id]
    if (param === "") return

    // break
    if (params && params["return()"] !== undefined) return params["return()"]
    else if (params["break()"]) return params
    
    if ((global.__actionReturns__[0] || {}).returned) return

    if (param.charAt(0) === "#") return

    // split
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // increment
    if (key && value === undefined && key.slice(-2) === "++") {
      key = key.slice(0, -2)
      value = parseFloat(toValue({ _window, lookupActions, awaits, req, res, id, e, value: key, params, __, condition, object }) || 0) + 1
    }

    // decrement
    else if (key && value === undefined && key.slice(-2) === "--") {
      key = key.slice(0, -2)
      value = parseFloat(toValue({ _window, lookupActions, awaits, req, res, id, e, value: key, params, __, condition, object }) || 0) - 1
    }

    // ||=
    else if (key && value && key.slice(-2) === "||") {
      key = key.slice(0, -2)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||${value}`
      value = `coded()${_key}`
    }

    // +=
    else if (key && value && key.slice(-1) === "+") {

      key = key.slice(0, -1)
      var _key = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      global.codes[`coded()${_key}`] = toCode({ _window, string: `${myVal}||[if():[type():[${value}]=number]:0:'']` })
      value = `coded()${_key}+${value}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}+coded()${_key0}`*/
    }

    // -=
    else if (key && value && key.slice(-1) === "-") {

      key = key.slice(0, -1)
      var _key = generate(), __key = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      global.codes[`coded()${_key}`] = toCode({ _window, string: `${myVal}||0` })
      global.codes[`coded()${__key}`] = toCode({ _window, string: `${value}||0` })
      value = `coded()${_key}-coded()${__key}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}-coded()${_key0}`*/
    }

    // *=
    else if (key && value && key.slice(-1) === "*") {

      key = key.slice(0, -1)
      var _key = generate(), _key0 = generate()
      var myVal = key.split(".")[0].includes("()") || key.includes("_") || key.split(".")[0] === "" ? key : (`().` + key)
      global.codes[`coded()${_key}`] = `${myVal}||0`
      value = `coded()${_key}*${value}`
      /*global.codes[`coded()${_key0}`] = `${value}||0`
      value = `coded()${_key}*coded()${_key0}`*/
    }

    // await
    if ((asyncer || executer) && (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():")) {

      var awaiter = param.split(":").slice(1)
      if (asyncer) {
        if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
        var _params = toParam({ _window, lookupActions, awaits, string: awaiter[0], e, id, req, res, mount, __, })
        params = { ...params, ..._params }
        awaiter = awaiter.slice(1)
      }

      params.await = params.await || ""
      if (awaiter[0]) return params.await += `wait():${awaiter.join(":")};`
      else if (awaiter.length === 0) return
    }
    
    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = params.await || ""
      return params.await += `${awaiter};`
    }

    // !attribute ---> attribute = false
    if (param.slice(0, 1) === "!" && value === undefined) {
      value = false
      key = key.slice(1)
    }

    // show loader
    if (!_window && param === "loader.show") {
      document.getElementById("loader-container").style.display = "flex"
      return sleep(10)
    }
    
    // hide loader
    if (!_window && param === "loader.hide") {
      document.getElementById("loader-container").style.display = "none"
      return sleep(10)
    }

    if (toView) {

      // children
      if (param.slice(0, 9) === "children:") {

        var _children = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ view: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }

      // children
      if (param.slice(0, 6) === "child:") {

        var _children = []
        param = param.slice(6)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ view: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }

      // siblings
      if (param.slice(0, 9) === "siblings:") {

        var siblings = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          siblings.push({ view: param })
        })

        view.siblings = toArray(view.siblings)
        view.siblings.unshift(...siblings)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }

      // sibling
      if (param.slice(0, 8) === "sibling:") {

        var siblings = []
        param = param.slice(8)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          siblings.push({ view: param })
        })

        view.siblings = toArray(view.siblings)
        view.siblings.unshift(...siblings)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return true
      }
    }

    var path = typeof key === "string" ? key.split(".") : [], isFn = false, i = path[0].split(":").length - 1, path0 = path[0].split(":")[0], pathi = path[0].split(":")[i]

    var sendObject = false
    if (typeof value === "string" && value.charAt(0) === "." && (value.includes("()") || isNaN(value.charAt(1)))) sendObject = true

    if (typeof value === 'string') value = toValue({ _window, lookupActions, awaits, req, res, id, e, value, __, condition, object: sendObject ? object : undefined })
    else if (value === undefined) value = generate()
    
    if (typeof value === "string" && value.includes("&nbsp;")) value = value.replace("&nbsp;", " ")

    id = viewId
    
    // :coded()1asd1
    if (path0 === "") return

    // function
    if (path0.slice(-2) === "()") {

      var isFn = toFunction({ _window, lookupActions, awaits, id, req, res, __, e, path, path0, condition, mount, asyncer, toView, executer, object })
      if (isFn !== "__CONTINUE__") return isFn
      else isFn = false
      
      // field:action()
      if (path[0] && pathi.slice(-2) === "()" && !path0.includes("()") && !_functions[pathi.slice(-2)] && !actions.includes(pathi)) {

        view && clone(view["my-views"] || []).reverse().map(myview => {
          if (!isFn) {
            isFn = Object.keys(global.data[view.viewType][myview] && global.data[view.viewType][myview].functions || {}).find(fn => fn === pathi.slice(0, -2))
            if (isFn) {
              isFn = toCode({ _window, lookupActions, awaits, id, string: (global.data[view.viewType][myview].functions || {})[isFn], start: "'", end: "'" })
              isFn = toCode({ _window, lookupActions, awaits, id, string: isFn })
            }
          }
        })
        
        // backend functions
        if (!isFn) {
          isFn = (global.functions || []).find(fn => fn === pathi.slice(0, -2))
          if (isFn) backendFn = true
        }
      }

      if (isFn) {

        var _field = path[0].split(":")[0]
        var _key = generate()
        global.codes[`coded()${_key}`] = isFn

        return toParam({ _window, lookupActions, awaits, string: `${_field}:coded()${_key}`, e, id, req, res, mount: true, object, __, _i, asyncer, toView, executer })
      }
    }
    
    // object structure
    if (path.length > 1 || path[0].includes("()") || object) {
      
      // break
      if (key === "break()" && value !== false) return view.break = true
      var _path = clone(params.path)
      delete params.path
      
      // mount state & value
      if ((path[0].includes("()") && (path0.slice(-2) === "()")) || path[0].slice(-3) === ":()"  || path[0].includes("_") || object) {
        
        reducer({ _window, lookupActions, awaits, id, path, value, key, e, req, res, __, _i, object, mount, toView, condition })

      } else {
        
        if (mount) reducer({ _window, lookupActions, awaits, id, path, value, key, params, e, req, res, __, _i, mount, object: view, toView, condition })
        reducer({ _window, lookupActions, awaits, id, path, value, key, params, e, req, res, __, _i, mount, object: params, toView, condition })
      }
      
      if (!params.path && _path !== undefined) params.path = _path
      
    } else if (key) {
      
      if (key === "_" && __[0]) return __[0] = value
      if (id && view && mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    if (mount && toView) {
      
      if (view && view.doc) view.Data = view.doc
      if (params.doc) params.Data = params.doc

      // mount data directly when found
      if (!mountDataUsed && ((params.data !== undefined && (!view.Data || !global[view.Data])) || params.Data || (view && view.data !== undefined && !view.Data))) {

        if (params.Data || (params.data !== undefined && !view.Data)) view.derivations = []
        mountDataUsed = true
        params.Data = view.Data = params.Data || view.Data || generate()
        params.data = global[view.Data] = params.data !== undefined ? params.data : (global[view.Data] !== undefined ? global[view.Data] : {})

        // duplicated element
        if (view.duplicatedElement) {

          delete view.path
          delete view.data
        }
      }
    
      // mount path directly when found
      if (!mountPathUsed && (params.path || params.schema) && view.parent !== "root") {

        var schema = clone(params.path || params.schema)
        mountPathUsed = true
        
        if (!view.Data) {

          view.Data = generate()
          global[view.Data] = view.data || {}
        }

        if (!global[`${view.Data}-schema`]) global[`${view.Data}-schema`] = []
        if (typeof schema === "object" && schema.value || schema.data) view.data = schema.value = schema.value || schema.data

        var myFnn = ({ path, derivations, mainSchema = [], schema = {}, value }) => {

          if (value !== undefined) schema.value = value

          // path
          var myPath = (typeof path === "string" || typeof path === "number") ? path.toString().split(".") : path || []
          derivations.push(...myPath)
          var lastIndex = derivations.length - 1
          
          derivations.reduce((o, k, i) => {

            var _type = i === 0 ? o : (o.type || [])
            if (i !== 0  && !o.type) o.type = _type
            if (!isNaN(k) && k !== " " && (k.length > 1 ? k.toString().charAt(0) !== "0" : true)) {
              
              o.isArray = true
              return o
            }

            if (_type.find(o => o.path === k)) {

              var _schema = _type.find(o => o.path === k)
              if (i === lastIndex) view.schema = _schema = { ..._schema, ...schema, path: k }
              if (_schema.type === "array") _schema.isArray = true
              _schema.type = (i !== lastIndex && !Array.isArray(_schema.type)) ? [] : (_schema.type || "any")
              return _schema
              
            } else {

              var _schema = { path: k }
              if (i === lastIndex) view.schema = _schema = { ..._schema, ...schema, path: k }
              if (_schema.type === "array") _schema.isArray = true
              _schema.type = (i !== lastIndex && !Array.isArray(_schema.type)) ? [] : (_schema.type || "any")

              // if (params.data && i === lastIndex) _schema.value = params.data
              _type.push(_schema)
              return _schema
            }
          }, mainSchema)
        }

        if (typeof schema === "object" ? Array.isArray(schema) : true) myFnn({ path: schema, derivations: view.derivations, mainSchema: global[`${view.Data}-schema`]})
        else if (schema.path) myFnn({ path: clone(schema.path), derivations: view.derivations, mainSchema: global[`${view.Data}-schema`], schema })

        // reducer({ _window, lookupActions, awaits, id, path: view.derivations, value: view.path, key: true, params, e, req, res, __, _i, mount, object: global[`${view.Data}-schema`] })

        if (typeof view.data === "object" && !Array.isArray(view.data)) {

          Object.entries(view.data).map(([k, v]) => {
            myFnn({ path: k, derivations: view.derivations || [], mainSchema: view.schema })
          })
        }

        // console.log("data schema", view.Data, global[`${view.Data}-schema`])
      }
    }
  
    //////////////////////////////////////////////////////// End /////////////////////////////////////////////////////////
  })
  
  //if (mount && toView && views[id]) override(views[id], params)

  if (params["return()"] !== undefined) return params["return()"]
  return params
}

module.exports = { toParam }

},{"./actions.json":37,"./clone":42,"./decode":57,"./function":69,"./generate":70,"./getType":75,"./isParam":80,"./merge":88,"./reducer":96,"./toApproval":115,"./toArray":116,"./toCode":120,"./toFunction":125,"./toValue":134}],131:[function(require,module,exports){
module.exports = {
    toPdf: async ({ id, options }) => {

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
},{}],132:[function(require,module,exports){
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
},{}],133:[function(require,module,exports){
module.exports = {
  toStyle: ({ _window, id }) => {

    var view = _window ? _window.views[id] : window.views[id]
    var style = ""

    if (view.style) {
      Object.entries(view.style).map(([k, v]) => {
        if (k === "after" || k.includes(">>")) return;
        k = require("./styleName")(k);
        style += `${k}:${v}; `
      })

      style = style.slice(0, -2)
    }

    return style
  }
}

},{"./styleName":113}],134:[function(require,module,exports){
const { clone } = require("./clone");
const { generate } = require("./generate")
const { isParam } = require("./isParam")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, lookupActions, awaits, value, params = {}, __, id, e, req, res, object, mount, asyncer, toView, executer, condition }) => {

  const { toFunction } = require("./toFunction")
  const { toParam } = require("./toParam")
  
  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global

  if ((global.__actionReturns__[0] || {}).returned) return
  
  if (!value) return value
  
  var coded = false
  // coded
  while (value.includes('coded()') && value.length === 12) { coded = true; value = global.codes[value] }
  // if (value.includes('coded()') && value.length === 12) value = global.codes[value]

  // no value
  if (value === "()") return view
  else if (value === ".") return object !== undefined ? object : view
  else if (value === undefined) return generate()
  else if (value === "undefined") return undefined
  else if (value === "false") return false
  else if (value === "true") return true
  else if (value === "null") return null
  else if (value.charAt(0) === "_" && !value.split("_").find(i => i !== "_" && i !== "")) return __[value.split("_").length - 2] // _ or __ or ___ or ____
  else if (value === "_text") return ""
  else if (value === "_string") return ""
  else if (value === "" && coded || value === "_map") return ({})
  else if (value === "_list" || value === ":") return ([])
  else if (value === ":[]") return ([{}])
  else if (value === " ") return value
  
  // break & return
  if (params && params["return()"] !== undefined) return params["return()"]
  if (params["break()"]) return params
  
  // string
  if (value.split("'").length > 1) value = toCode({ _window, string: value, start: "'", end: "'" })
  while (value.includes('codedS()') && value.length === 13) {
    
    if (!object) return global.codes[value]
    else value = global.codes[value]
    return (object ? object[value] : view[value]) || value
  }

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
  
  // value is a param it has key=value
  
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, lookupActions, awaits, e, string: value, __, object, mount, toView, condition })

  // or
  if (value.includes("||")) {
    var answer
    value.split("||").map(value => {
      if (!answer) { // or answer === undefined ?????
        answer = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, mount, condition })
        //console.log(value, answer);
      }
    })
    return answer
  }
  
  if (value.includes("+")) { // addition

    // increment
    if (value.slice(-2) === "++") {
      
      value = value.slice(0, -2)
      value = `${value}=${value}+1`
      toParam({ req, res, _window, lookupActions, id, e, string: value, __, object, mount, params, toView, condition })
      return (toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, mount, condition }) - 1)

    } else {

      var allAreNumbers = true
      var values = value.split("+").map(value => {
        
        var _value = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, mount/*, condition*/ })
        if (allAreNumbers) {
          if (!isNaN(_value) && !emptySpaces(_value)) allAreNumbers = true
          else allAreNumbers = false
        }
        return _value
      })
      
      if (allAreNumbers) {
        var newVal = parseFloat(values[0]) || 0
        values.slice(1).map(val => newVal += (parseFloat(val) || 0))
      } else {
        var newVal = values[0]
        values.slice(1).map(val => newVal += val)
      }
      return value = newVal
    }
  }
  
  if (value.includes("-")) { // subtraction

    var _value = calcSubs({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
    if (_value !== value) return _value
  }
  
  if (value.includes("*") && value.split("*")[1] !== "") { // multiplication

    var values = value.split("*").map(value => toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, mount, condition }))
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

    var _value = calcDivision({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
    if (_value !== value && _value !== undefined) return _value
  }
  
  if (value.includes("%") && value.split("%")[1] !== "") { // modulo

    var _value = calcModulo({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
    if (_value !== value && _value !== undefined) return _value
  }

  if (value === "()") return view

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  // string
  // if (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") return value = value.slice(1, -1)

  var path = typeof value === "string" ? value.split(".") : [], path0 = path[0].split(":")[0]

  // function
  if (path0.slice(-2) === "()") {
    var isFn = toFunction({ _window, lookupActions, awaits, id, req, res, __, e, path: [path[0]], path0, condition, mount, asyncer, toView, executer, object })
    if (isFn !== "__CONTINUE__") {
      if (path.length > 1) {
        path.splice(0, 1)
        return reducer({ _window, lookupActions, awaits, id, object, path, value, __, e, req, res, mount, toView, _object: isFn })
      }
      else return isFn
    }
  }

  /* value */
  if (!isNaN(value) && !emptySpaces(value) && (value.length > 1 ? value.charAt(0) !== "0" : true)) value = parseFloat(value)
  else if (value === " ") return value
  else if (object || path[0].includes(":") || path[1] || path[0].includes("()")) {
    value = reducer({ _window, lookupActions, awaits, id, object, path, value, params, __, e, req, res, mount, toView/*, condition*/ })
  }
  
  return value
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

const calcSubs = ({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => value -= parseFloat(val))
      // console.log(value);
      return value

    } else if (value.split("-").length > 2) {

      var allAreNumbers = true
      var _value = value.split("-").slice(0, 2).join("-")
      var _values = value.split("-").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
          if (!isNaN(num) && num !== " " && num !== "") return num
          else allAreNumbers = false
        }
      })

      if (allAreNumbers) {

        value = parseFloat(values[0])
        values.slice(1).map(val => value -= parseFloat(val))
        // console.log(value);
        return value
  
      } else if (value.split("-").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("-").slice(0, 3).join("-")
        var _values = value.split("-").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
            if (!isNaN(num) && num !== " " && num !== "") return num
            else allAreNumbers = false
          }
        })

        if (allAreNumbers) {

          value = parseFloat(values[0])
          values.slice(1).map(val => value -= parseFloat(val))
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}

const calcDivision = ({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }) => {
  
  if (value.split("/").length > 1) {

    var allAreNumbers = true
    var values = value.split("/").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => {
        if (!isNaN(value) && !isNaN(val)) value /= val
        else if (isNaN(value) && !isNaN(val)) {
          while (val > 1) {
            value -= value
            val -= 1
          }
        } else if (!isNaN(value) && isNaN(val)) {
          var index = value
          value = val
          while (index > 1) {
            value -= value
            index -= 1
          }
        }
      })
      // console.log(value);
      return value

    } else if (value.split("/").length > 2) {

      var allAreNumbers = true
      var _value = value.split("/").slice(0, 2).join("/")
      var _values = value.split("/").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
          if (!isNaN(num) && num !== " " && num !== "") return num
          else allAreNumbers = false
        }
      })

      if (allAreNumbers) {

        value = parseFloat(values[0])
        values.slice(1).map(val => {
          if (!isNaN(value) && !isNaN(val)) value /= val
          else if (isNaN(value) && !isNaN(val)) {
            while (val > 1) {
              value -= value
              val -= 1
            }
          } else if (!isNaN(value) && isNaN(val)) {
            var index = value
            value = val
            while (index > 1) {
              value -= value
              index -= 1
            }
          }
        })
        // console.log(value);
        return value
  
      } else if (value.split("/").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("/").slice(0, 3).join("/")
        var _values = value.split("/").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
            if (!isNaN(num) && num !== " " && num !== "") return num
            else allAreNumbers = false
          }
        })

        if (allAreNumbers) {

          value = parseFloat(values[0])
          values.slice(1).map(val => {
            if (!isNaN(value) && !isNaN(val)) value /= val
            else if (isNaN(value) && !isNaN(val)) {
              while (val > 1) {
                value -= value
                val -= 1
              }
            } else if (!isNaN(value) && isNaN(val)) {
              var index = value
              value = val
              while (index > 1) {
                value -= value
                index -= 1
              }
            }
          })
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}


const calcModulo = ({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }) => {
  
  if (value.split("%").length > 1) {

    var allAreNumbers = true
    var values = value.split("%").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
        if (!isNaN(num) && num !== " " && num !== "") return num
        else allAreNumbers = false
      }
    })
    
    if (allAreNumbers) {

      value = parseFloat(values[0])
      values.slice(1).map(val => {
        if (!isNaN(value) && !isNaN(val)) value %= val
        else if (isNaN(value) && !isNaN(val)) {
          while (val > 1) {
            value -= value
            val -= 1
          }
        } else if (!isNaN(value) && isNaN(val)) {
          var index = value
          value = val
          while (index > 1) {
            value -= value
            index -= 1
          }
        }
      })
      // console.log(value);
      return value

    } else if (value.split("%").length > 2) {

      var allAreNumbers = true
      var _value = value.split("%").slice(0, 2).join("%")
      var _values = value.split("%").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
          if (!isNaN(num) && num !== " " && num !== "") return num
          else allAreNumbers = false
        }
      })

      if (allAreNumbers) {

        value = parseFloat(values[0])
        values.slice(1).map(val => {
          if (!isNaN(value) && !isNaN(val)) value %= val
          else if (isNaN(value) && !isNaN(val)) {
            while (val > 1) {
              value -= value
              val -= 1
            }
          } else if (!isNaN(value) && isNaN(val)) {
            var index = value
            value = val
            while (index > 1) {
              value -= value
              index -= 1
            }
          }
        })
        // console.log(value);
        return value
  
      } else if (value.split("%").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("%").slice(0, 3).join("%")
        var _values = value.split("%").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, lookupActions, awaits, value, params, __, id, e, req, res, object, condition })
            if (!isNaN(num) && num !== " " && num !== "") return num
            else allAreNumbers = false
          }
        })

        if (allAreNumbers) {

          value = parseFloat(values[0])
          values.slice(1).map(val => {
            if (!isNaN(value) && !isNaN(val)) value %= val
            else if (isNaN(value) && !isNaN(val)) {
              while (val > 1) {
                value -= value
                val -= 1
              }
            } else if (!isNaN(value) && isNaN(val)) {
              var index = value
              value = val
              while (index > 1) {
                value -= value
                index -= 1
              }
            }
          })
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}

module.exports = { toValue, calcSubs, calcDivision, calcModulo, emptySpaces }

},{"./clone":42,"./generate":70,"./isParam":80,"./reducer":96,"./toCode":120,"./toFunction":125,"./toParam":130}],135:[function(require,module,exports){
const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")
const { toArray } = require("./toArray")
const { createHtml } = require("./createHtml")
const { override } = require("./merge")
const { isParam } = require("./isParam")
const { toFunction } = require("./toFunction")
const _imports = [ "link", "meta", "title", "script", "style" ]

const toView = ({ _window, lookupActions, awaits, id, req, res, import: _import, params: inheritedParams = {}, __, viewer = "view" }) => {

  return new Promise (async resolve => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], tags = ""
    var parent = views[view.parent] || {}

    // use view instead of type
    if (view.view) view.type = view.view
    view.__view__ = true

    // view is empty
    if (!view.type) return resolve("")
    if (!view["my-views"]) view["my-views"] = [...(parent["my-views"] || [])]
    view.viewType = viewer = view.viewType || parent.viewType || viewer || "view"
    
    // encode
    view.type = toCode({ _window, string: toCode({ _window, string: view.type }), start: "'", end: "'" })
    if (view.type.split(".")[0].split(":")[0].slice(-2) === "()") {
    var isFn = await toFunction({ _window, lookupActions, awaits, id, req, res, __, path: view.type.split("."), path0: view.type.split(".")[0].split(":")[0], isView: true })
    if (isFn !== "__CONTINUE__") return resolve(isFn)
    }
    
    // 
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]
    var subParams = type.split(":")[1] || ""
    type = type.split(":")[0]

    if (subParams.slice(0, 7) !== "coded()" && subParams.slice(0, 8) !== "codedS()" && subParams.includes("()")) {
      type = type + ":" + subParams
      subParams = ""
    }

    _import = view.id === "html" || (parent.id === "html" && _imports.includes(type.toLowerCase()))
    
    // [type]
    if (/*!view.duplicatedElement && */type.length === 12 && type.includes("coded()")) {

      type = global.codes[type]
      type = toValue({ req, res, _window, id, value: type, __ })
      view.__viewName__ = type

      // sub params
      if (subParams) {

        // inherit data
        view.Data = view.Data || view.doc || parent.Data
        view.derivations = view.derivations || [...(parent.derivations || [])]

        while (subParams.includes('coded()') && subParams.length === 12) { subParams = global.codes[subParams] }
        var _conditions_ = subParams.split("?")[1]
        
        if (_conditions_) {
          var approved = toApproval({ _window, string: _conditions_, id, req, res, __ })
          if (!approved) {
            delete views[id]
            return resolve("")
          }
        }
        
        subParams = subParams.split("?")[0]
        
        var _params = toValue({ req, res, _window, id, value: subParams, __ })
        if (_params.data === "mount") {
          _params.data = parent.data
          _params.mount = true
        }

        if ((_params.doc || _params.path) && !_params.preventDefault) _params.mount = true
        var loopData = []

        if (_params.path) {
          
          _params.path = Array.isArray(_params.path) ? _params.path : _params.path.split(".")

          if (_params.data) {
          
            _params.Data = _params.doc = _params.doc || _params.Data || generate()
            global[_params.Data] = global[_params.Data] || _params.data || {}
            _params.derivations = [...(_params.derivations || []), ...(_params.path || [])]
            loopData = reducer({ _window, lookupActions, awaits, id, path: _params.derivations, object: global[_params.Data], req, res, __ })

          } else {

            _params.Data = _params.doc = _params.doc || _params.Data || view.Data || parent.Data || generate()
            global[_params.Data] = global[_params.Data] || _params.data || {}
            _params.derivations = [...(_params.derivations || _params.derivations || parent.derivations || []), ...(_params.path || [])]
            loopData = _params.data = reducer({ _window, lookupActions, awaits, id, path: _params.derivations, object: global[_params.Data], req, res, __ })
          }

        } else if (_params.data) {

          _params.Data = _params.doc = _params.doc || _params.Data || (_params.mount && !_params.preventDefault && parent.Data) || generate()
          global[_params.Data] = global[_params.Data] || _params.data || {}
          _params.derivations = (_params.mount && !_params.preventDefault && !_params.doc && parent.derivations) || _params.derivations || []
          loopData = _params.data
          
        } else if (_params.Data || _params.doc) {

          _params.Data = _params.doc = _params.doc || _params.Data
          global[_params.Data] = global[_params.Data] || {}
          _params.derivations = _params.derivations || []
          loopData = _params.data = reducer({ _window, lookupActions, awaits, id, path: _params.derivations, object: global[_params.Data], req, res, __ })
        }
        
        /*if (_params.mount) {

          if (_params.doc) view.doc = view.Data = _params.doc
          else if (_params.data && !_params.doc) view.doc = view.Data = generate()
          view.Data = Data = view.Data || Data
          global[Data] = global[Data] || _params.data || {}
          _params.data = reducer({ _window, lookupActions, awaits, id, path: derivations, object: global[Data], req, res, __, key: _params.data !== undefined ? true : false, value: _params.data })
        }*/
        
        var tags = []
        var { Data, doc, data, path, derivations = [], preventDefault, ...myparams } = _params
        
        if (toArray(loopData).length > 0) {

          tags = await Promise.all(toArray(loopData).map(async (_data, index) => {

            var _id = view.id + "-" + index
            var _type = type + "?" + view.type.split("?").slice(1).join("?")
            var _view = clone({ ...view, ...myparams, id: _id, view: _type, i: index, mapIndex: index })
            if (_params.mount) _view = {..._view, Data: Data || _view.Data, doc: doc || _view.doc, data: _data, derivations: [...((derivations.length > 0 ? derivations : _params.derivations) || []), index] }

            if (!_params.preventDefault) {

              if (type === "Chevron") _view.direction = _data
              else if (type === "Icon") _view.name = _data
              else if (type === "Image") _view.src = _data
              else if (type === "Text") _view.text = _data
              else if (type === "Checkbox") _view.label = { text: _data }
            }

            views[_id] = _view
            return await toView({ _window, lookupActions, awaits, id: _id, req, res, __: [_data, ...__], viewer })
          }))

        } else {

          var _id = view.id + "-" + 0
          var _type = type + "?" + view.type.split("?").slice(1).join("?")
          var _view = clone({ ...view, ...myparams, id: _id, view: _type, i: 0, mapIndex: 0 })
          if (_params.mount) _view = {..._view, Data: Data || _view.Data, doc: doc || _view.doc, derivations: [...((derivations.length > 0 ? derivations : _params.derivations) || []), 0] }

          if (!_params.preventDefault) {

            if (type === "Chevron") _view.direction = "left"
            else if (type === "Icon") _view.name = "icon"
            else if (type === "Text") _view.text = ""
            else if (type === "Checkbox") _view.label = { text: "" }
          }
          
          views[_id] = _view
          var tags = await toView({ _window, lookupActions, awaits, id: _id, req, res, __: ["", ...__], viewer })
          return resolve(tags)
        }
        
        delete views[view.id]
        return resolve(tags.join(""))
      }

      view.mapType = ["data"]
    }

    view.type = view.__viewName__ = type = toValue({ req, res, _window, id, value: type, __ })


    // events
    if (view.event) {

      view.controls = toArray(view.controls)
      toArray(view.event).map(event => view.controls.push({ event }))
      delete view.event
    }
    
    // id
    if (subParams) {

      if (isParam({ _window, lookupActions, awaits, string: subParams })) {

        inheritedParams = {...inheritedParams, ...toParam({ req, res, _window, id, string: subParams, __ })}

      } else {
        
        view.Data = view.Data || view.doc || parent.Data
        view.derivations = view.derivations || [...(parent.derivations || [])]
        var _id = toValue({ _window, lookupActions, awaits, value: subParams, id, req, res, __ })
        
        if (views[_id] && view.id !== _id) view.id = _id + generate()
        else view.id = id = _id
      }
    }

    view.id = id = view.id || generate()

    // style
    if (!_import) {

      view.style = view.style || {}
      view.class = view.class || ""
      view.Data = view.Data || view.doc || parent.Data
      view.derivations = view.derivations || [...(parent.derivations || [])]
      view.controls = view.controls || []
      view.status = "Loading"
      view.childrenID = []
      view.__ = __
      views[id] = view
      
      if (global.breaktoView[id]) {

        global.breaktoView[id] = false
        return resolve("")
      }
    }

    // approval (after repeated  views conditions)
    var approved = toApproval({ _window, lookupActions, awaits, string: conditions, id, req, res, __ })
    if (!approved) {
      delete views[id]
      return resolve("")
    }

    /////////////////// approval & params /////////////////////

    // push destructured params from type to view
    if (params) {
      
      params = toValue({ _window, lookupActions, awaits, value: params, id, req, res, mount: true, toView: true, __ })
      if (typeof params !== "object") params = { [params]: generate() }

      if (params.id && params.id !== id) {

        if (views[params.id] && typeof views[params.id] === "object") params.id += generate()
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
        view = views[id]
      }
    } else params = {}
      
    // inherited params
    if (Object.keys(inheritedParams).length > 0) override(view, inheritedParams)

    // pass to children
    if (parent.passToChildren) override(view, parent.passToChildren)

    // before loading controls
    if (!_import && view.controls.length > 0) {
      await new Promise (async resolve => {
        
        toArray(view.controls).map(async (controls = {}) => {

          //
          if (!controls.event) return
          var event = toCode({ _window, lookupActions, awaits, string: controls.event })
          event = toCode({ _window, lookupActions, awaits, string: event, start: "'", end: "'" })

          if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ req, res, _window, id, string: event.split('?')[2], __ })) {

            toParam({ req, res, _window, id, string: event.split("?")[1], toView: true, __ })
            view.controls = view.controls.filter((controls = {}) => !controls.event.split("?")[0].includes("beforeLoading"))
          }
        })

        if (global.promises[id] && global.promises[id].length > 0) {
          
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          
          delete global.promises[id]
        }

        resolve()
      })
    }
    
    if (!_import && (params.view || global.data[viewer][view.type])) {
      
      var viewId = params.view || view.type
      view["my-views"].push(viewId)

      delete view.view
      delete params.view

      var newView = clone(global.data[viewer][viewId])
      if (!newView) return resolve("")
      if (newView.id && views[newView.id]) newView.id += generate()
      
      views[id] = { ...view,  ...newView, __viewName__: viewId, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)]}

      tags = await toView({ _window, lookupActions, awaits, id, req, res, __: [ ...(Object.keys(params).length > 0 ? [params] : []), ...__], viewer })
      return resolve(tags)
    }

    if (_import) {

      tags = await createHtml({ _window, lookupActions, awaits, id, req, res, import: _import })
      return resolve(tags)
    }

    // for droplist
    if (parent.unDeriveData || view.unDeriveData) {

      view.data = view.data || ""
      view.unDeriveData = true

    } else view.data = reducer({ _window, lookupActions, awaits, id, path: view.derivations, value: view.data, key: true, object: global[view.Data] || {}, req, res, __ })
    
    // doc
    if (!global[view.Data] && view.data) global[view.Data] = view.data

    // root
    if (view.parent === "root") views.root.child = view.id
    tags = await createTags({ _window, lookupActions, awaits, id, req, res, __, viewer })
    resolve(tags)
  })
}

module.exports = { toView }
},{"./clone":42,"./createHtml":51,"./createTags":52,"./generate":70,"./isParam":80,"./merge":88,"./reducer":96,"./toApproval":115,"./toArray":116,"./toCode":120,"./toFunction":125,"./toParam":130,"./toValue":134}],136:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toCode } = require("./toCode")
const { toParam } = require("./toParam")

const toggleView = async ({ _window, toggle = {}, id, res, __ }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var togglePage = toggle.page, view = {}
  var viewId = toggle.viewId || toggle.view
  var toggleId = toggle.id || id
  var parentId = toggle.parent
  if (togglePage) parentId = "root"
  if (!toggleId) {
    if (!parentId) parentId = id
    toggleId = views[parentId].element.children[0] && views[parentId].element.children[0].id
  } else if (!parentId) parentId = views[toggleId].parent

  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  document.getElementById("loader-container").style.display = "flex"
  


    // children
    var children = clone([global.data[views[toggleId].viewType][viewId] || { view: "View" }])
    if (togglePage) {

      global.prevPage.push(global.currentPage)
      if (global.prevPage.length > 5) global.prevPage.shift()
      var currentPage = global.currentPage = togglePage.split("/")[0]
      
      viewId = currentPage
      /*global.path = togglePage = togglePage === "main" ? "/" : togglePage

      history.pushState({}, title, togglePage)
      document.title = title
      view = views.root*/

    } else {
      view = views[parentId]

      if (id === "root" && global.data.page[viewId]) {

        var page = global.data.page[viewId]
        var _params = toParam({ string: page.type.split("?")[1] || "" })
        global.prevPath.push(global.path)
        if (global.prevPath.length > 5) global.prevPath.shift()
        global.path = _params.path
        history.pushState({}, _params.title, _params.path)
        document.title = _params.title
      }
    }

    
    if (children.length === 0) return
    if (!view || !view.element) return

    // close droplist
    if (global["__droplistPositioner__"] && view.element.contains(views[global["__droplistPositioner__"]].element)) {
      var closeDroplist = toCode({ _window, string: "clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()" })
      toParam({ string: closeDroplist, id: "droplist" })
    }
    
    // close actionlist
    if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
      var closeActionlist = toCode({ _window, string: "clearTimer():[actionlistTimer:()];():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()" })
      toParam({ string: closeActionlist, id: "actionlist" })
    }
          
    if (res) {
      
      views.root.children = clone([{ ...global.data.page[currentPage], id: currentPage }])
      return
    }

    // fadeout
    var timer = toggle.timer || toggle.fadeout.timer || 0
  
    var innerHTML = await Promise.all(children.map(async (child, index) => {

      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      views[id].style = {}
      views[id]["my-views"] = viewId ? [...view["my-views"], viewId] : view["my-views"]
      views[id].style.transition = toggle.fadein.before.transition || null
      views[id].style.opacity = toggle.fadein.before.opacity || "0"
      views[id].style.transform = toggle.fadein.before.transform || null

      return await toView({ id, __ })
    }))

    if (toggleId && views[toggleId] && views[toggleId].element) {
      
      views[toggleId].element.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
      views[toggleId].element.style.transform = toggle.fadeout.after.transform || null
      views[toggleId].element.style.opacity = toggle.fadeout.after.opacity || "0"
      
      removeChildren({ id: toggleId })
      delete views[toggleId]
    }
    
    innerHTML = innerHTML.join("")

    // timer
    var timer = toggle.timer || toggle.fadein.timer || 0
    view.element.innerHTML = ""
    view.element.innerHTML = innerHTML
    
    var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
    idList.map(id => setElement({ id }))
    idList.map(id => starter({ id }))
  
  // set visible
  setTimeout(async () => {

    var children = [...view.element.children]
    children.map(el => {

      var id = el.id
      views[id].style.transition = el.style.transition = toggle.fadein.after.transition || `${timer}ms ease-out`
      views[id].style.transform = el.style.transform = toggle.fadein.after.transform || null
      views[id].style.opacity = el.style.opacity = toggle.fadein.after.opacity || "1"
    })
    
    document.getElementById("loader-container").style.display = "none"
    
  }, timer)
}

module.exports = { toggleView }
},{"./clone":42,"./generate":70,"./setElement":107,"./starter":110,"./toCode":120,"./toParam":130,"./toView":135,"./update":137}],137:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const update = async ({ id, _window, lookupActions, awaits, req, res, update = {}, __, route, mainId, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.views : window.global
  var view = views[id]
  
  if (!view || !view.element) return

  // close droplist
  if (global["__droplistPositioner__"] && view.element.contains(views[global["__droplistPositioner__"]].element)) {
    var closeDroplist = toCode({ _window, lookupActions, awaits, string: "clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()" })
    toParam({ _window, lookupActions, awaits, req, res, string: closeDroplist, id: "droplist", __ })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, lookupActions, awaits, string: "clearTimer():[actionlistTimer:()];():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()" })
    toParam({ _window, lookupActions, awaits, req, res, string: closeActionlist, id: "actionlist", __ })
  }

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") {
    views.root.children = children = [{ ...clone(global.data.page[global.currentPage]), id: global.currentPage, ["my-views"]: [global.currentPage] }]
  }
  
  var innerHTML = await Promise.all(children.map(async (child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = views[id]["my-views"] || [...view["my-views"]]
    
    return await toView({ _window, lookupActions, awaits, req, res, id, __: view.__ })
  }))

  if (id === "root" && route.currentPage && route.currentPage !== global.currentPage) return
  
  innerHTML = innerHTML.join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML
  
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ _window, lookupActions, awaits, req, res, id }))
  idList.map(id => starter({ _window, lookupActions, awaits, req, res, id }))
  
  view.update = global.update = { view: views[id], message: "View updated successfully!", success: true }

  // routing
  if (id === "root") {

    document.body.scrollTop = document.documentElement.scrollTop = 0
    var title = route.title || views[global.currentPage].title
    var path = route.path || views[global.currentPage].path
    
    history.pushState(null, title, path)
    document.title = title

    if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "none"
  }

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req, res, id: mainId || id, __: [global.update, ...__], /*object: global.update.view,*/ ...params })
}

const removeChildren = ({ id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]

  if (!view.element) return
  var children = [...view.element.children]
  
  children.map((child) => {

    var id = child.id
    var view = views[id]
    if (!views[id]) return

    // clear time out
    Object.entries(views[id]).map(([k, v]) => {

      if (k.includes("-timer")) clearTimeout(v)
    })

    removeChildren({ id })
    delete global["body-click-events"][id]
    Object.keys(view).map(key => delete view[key])
    delete views[id]
  })
}

module.exports = {update, removeChildren}
},{"./clone":42,"./generate":70,"./setElement":107,"./starter":110,"./toArray":116,"./toAwait":117,"./toCode":120,"./toParam":130,"./toView":135}],138:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toCode } = require("./toCode")

const updateSelf = async ({ _window, lookupActions, awaits, id, update = {}, route, __ }) => {

  var views = window.views
  var view = views[id]
  var global = window.global
  var timer = update.timer || 0
  
  if (!view || !view.element) return
  var parent = views[view.parent]
  var index = view.index || 0

  // close droplist
  if (global["__droplistPositioner__"] && view.element.contains(views[global["__droplistPositioner__"]].element)) {
    var closeDroplist = toCode({ _window, lookupActions, awaits, string: "clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, lookupActions, awaits, string: "clearTimer():[actionlistTimer:()];():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }

  // children
  var children = clone(toArray(parent.children[index]))
  if (id === "popup") children = clone([global.data.public[popup]])
  
  // remove children
  removeChildren({ id })

  ////// remove view
  Object.entries(views[id]).map(([k, v]) => {

    if (k.includes("-timer")) clearTimeout(v)
  })
  delete views[id]
  ///////

  var innerHTML = await Promise.all(children.map(async child => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = parent.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = [...view["my-views"]]
    //views[id].style.opacity = "0"
    //if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return await toView({ id, __ })

  }))
  
  innerHTML = innerHTML.join("")
  
  var childrenNodes = [...parent.element.children]
  childrenNodes.map((childNode, i) => {
    var _index = parseInt(childNode.getAttribute("index"))
    if (_index === index) parent.element.removeChild(childrenNodes[i])
  })
  
  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.opacity = "0"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.innerHTML = innerHTML
  var node = lDiv.children[0]
  
  parent.element.insertBefore(node, [...parent.element.children][index])
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))
  
  /*var _children = [...parent.element.children]
  _children.map(childNode => {
    var _index = childNode.getAttribute("index")
    if (_index === index) return childNode
    else return
  }).filter(child => child)*/
  
  if (lDiv) {
    document.body.removeChild(lDiv)
    lDiv = null
  }
  
  view.update = { view: views[node.id], message: "View updated succefully!", success: true }

  // routing
  if (id === "root") {

    document.body.scrollTop = document.documentElement.scrollTop = 0

    var title = route.title || views[views.root.element.children[0].id].title
    var path = route.path || views[views.root.element.children[0].id].path

    history.pushState(null, title, path)
    document.title = title

    if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "none"
  }
}

module.exports = {updateSelf}
},{"./clone":42,"./generate":70,"./setElement":107,"./starter":110,"./toArray":116,"./toCode":120,"./toView":135,"./update":137}],139:[function(require,module,exports){
(function (Buffer){(function (){
const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const readFile = require("./readFile")
const { toArray } = require("./toArray")

module.exports = async ({ _window, lookupActions, awaits, id, req, res, e, __, ...params }) => {
        
  var upload = params.upload, promises = []
  var global = _window ? _window.global : window.global
  var view = _window ? _window.views : window.views[id]
  var alldata = toArray(upload.data || []), uploadedData = [], local = false
  var headers = clone(upload.headers) || {}
  var files = toArray(/*upload.data.file || */upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])
  var collection = upload.collection || "storage"
  if (_window) collection += `-${req.headers["project"]}`
  
  if (!headers.project) headers.project = global.projectId;
  
  promises.push(...([...files]).map(async (f, i) => {

    if (typeof f === "string") f = { file: f, type }

    var upload = {collection}
    var data = alldata[i] || {}
    var file = await readFile(f)
if (!data) return console.log("Data does not exist!");
    upload.doc = f.id || f.doc || docs[i] || generate({ length: 20 })
    data.name = f.name || data.name || generate({ length: 20 })
    
    // get file type
    var type = data.type || f.type
    
    // get regex exp
    var regex = new RegExp(`^data:${type};base64,`, "gi")
    file = file.replace(regex, "")

    // data
    upload.data = clone(data)

    if (_window) {

      var db = req.db
      var storage = req.storage

      // convert base64 to buffer
      var buffer = Buffer.from(file, "base64")
      
      await storage.bucket().file(`${collection}/${upload.doc}`).save(buffer, { contentType: data.type }, async () => {
        url = await storage.bucket().file(`${collection}/${upload.doc}`).getSignedUrl({ action: 'read', expires: '03-09-3000' })
      })
      
      // post api
      data = {
        url: url[0],
        id: upload.doc,
        name: data.name,
        description: data.description || "",
        type: data.type,
        tags: data.tags || [],
        title: data.title || data.type.toUpperCase(),
        "creation-date": parseInt(req.headers.timestamp)
      }

      return await db.collection(collection).doc(upload.doc).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`
        uploadedData.push({ success, message, data })

      }).catch(error => {

        success = false
        message = error
      })

    } else {

      headers["timestamp"] = (new Date()).getTime()
      headers["timezone"] = Math.abs((new Date()).getTimezoneOffset())

      local = true
      delete upload.data.url
      delete upload.data.file
      var {data} = await axios.post(`/storage`, { upload, file }, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })

      uploadedData.push(data)
      return data
    }
  }))

  await Promise.all(promises)
  //if (local) uploadedData = uploadedData.map(({ data }) => data)
  
  view.uploads = []
  global.uploads = []

  uploadedData.map(data => {

    view.upload = clone(data)
    view.uploads.push(clone(data))

    if (files.length > 1) console.log(view.uploads)
    else console.log(view.upload)
    
    global.upload = clone(data)
    global.uploads.push(clone(data))
  })
  
  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req, res, id, e, __: [global.uploads.length === 1 ? global.uploads[0] : global.uploads, ...__], ...params })
}
}).call(this)}).call(this,require("buffer").Buffer)
},{"./clone":42,"./generate":70,"./readFile":95,"./toArray":116,"./toAwait":117,"axios":142,"buffer":173}],140:[function(require,module,exports){
const wait = async ({ id, e, lookupActions, awaits, ...params }) => {

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, lookupActions, awaits, e, params })
}

module.exports = { wait }
},{"./toAwait":117}],141:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")

const watch = ({ _window, lookupActions, awaits, controls, id, __ }) => {

    const { execute } = require("./execute")

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, lookupActions, awaits, id, string: controls.watch })
    watch = toCode({ _window, lookupActions, awaits, string: watch, start: "'", end: "'" })

    var approved = toApproval({ id, lookupActions, awaits, string: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500
        view[`${_watch}-watch`] = clone(toValue({ id, lookupActions, awaits, value: _watch }))
        
        const myFn = async () => {
            
            if (!window.views[id]) return clearInterval(view[`${_watch}-timer`])
            
            var value = toValue({ id, lookupActions, awaits, value: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, lookupActions, awaits, string: watch.split('?')[1], mount: true, __ })

            // break
            if (view["break()"]) delete view["break()"]
            if (view["return()"]) return delete view["return()"]
            
            if (view["once"] || view["once()"]) {

                delete view["once"]
                clearInterval(view[`${_watch}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, lookupActions, awaits, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions || controls.action) await execute({ controls, lookupActions, awaits, id, __ })
                
            // await params
            if (view.await) toParam({ id, lookupActions, awaits, string: view.await.join(';') })
        }

        if (view[`${_watch}-timer`]) clearInterval(view[`${_watch}-timer`])
        view[`${_watch}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }
},{"./clone":42,"./execute":63,"./isEqual":79,"./toApproval":115,"./toCode":120,"./toParam":130,"./toValue":134}],142:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":144}],143:[function(require,module,exports){
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

},{"../core/buildFullPath":150,"../core/createError":151,"./../core/settle":155,"./../helpers/buildURL":159,"./../helpers/cookies":161,"./../helpers/isURLSameOrigin":164,"./../helpers/parseHeaders":166,"./../utils":169}],144:[function(require,module,exports){
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

},{"./cancel/Cancel":145,"./cancel/CancelToken":146,"./cancel/isCancel":147,"./core/Axios":148,"./core/mergeConfig":154,"./defaults":157,"./helpers/bind":158,"./helpers/isAxiosError":163,"./helpers/spread":167,"./utils":169}],145:[function(require,module,exports){
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

},{}],146:[function(require,module,exports){
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

},{"./Cancel":145}],147:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],148:[function(require,module,exports){
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

},{"../helpers/buildURL":159,"../helpers/validator":168,"./../utils":169,"./InterceptorManager":149,"./dispatchRequest":152,"./mergeConfig":154}],149:[function(require,module,exports){
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

},{"./../utils":169}],150:[function(require,module,exports){
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

},{"../helpers/combineURLs":160,"../helpers/isAbsoluteURL":162}],151:[function(require,module,exports){
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

},{"./enhanceError":153}],152:[function(require,module,exports){
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

},{"../cancel/isCancel":147,"../defaults":157,"./../utils":169,"./transformData":156}],153:[function(require,module,exports){
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

},{}],154:[function(require,module,exports){
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

},{"../utils":169}],155:[function(require,module,exports){
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

},{"./createError":151}],156:[function(require,module,exports){
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

},{"./../defaults":157,"./../utils":169}],157:[function(require,module,exports){
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
},{"./adapters/http":143,"./adapters/xhr":143,"./core/enhanceError":153,"./helpers/normalizeHeaderName":165,"./utils":169,"_process":178}],158:[function(require,module,exports){
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

},{}],159:[function(require,module,exports){
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

},{"./../utils":169}],160:[function(require,module,exports){
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

},{}],161:[function(require,module,exports){
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

},{"./../utils":169}],162:[function(require,module,exports){
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

},{}],163:[function(require,module,exports){
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

},{}],164:[function(require,module,exports){
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

},{"./../utils":169}],165:[function(require,module,exports){
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

},{"../utils":169}],166:[function(require,module,exports){
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

},{"./../utils":169}],167:[function(require,module,exports){
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

},{}],168:[function(require,module,exports){
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

},{"./../../package.json":170}],169:[function(require,module,exports){
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

},{"./helpers/bind":158}],170:[function(require,module,exports){
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

},{}],171:[function(require,module,exports){
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

},{}],172:[function(require,module,exports){

},{}],173:[function(require,module,exports){
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
},{"base64-js":171,"buffer":173,"ieee754":176}],174:[function(require,module,exports){
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

},{}],175:[function(require,module,exports){
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

},{}],176:[function(require,module,exports){
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

},{}],177:[function(require,module,exports){
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
},{"_process":178}],178:[function(require,module,exports){
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

},{}],179:[function(require,module,exports){

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

},{"./can-promise":180,"./core/qrcode":196,"./renderer/canvas":203,"./renderer/svg-tag.js":204}],180:[function(require,module,exports){
// can-promise has a crash in some versions of react native that dont have
// standard global objects
// https://github.com/soldair/node-qrcode/issues/157

module.exports = function () {
  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
}

},{}],181:[function(require,module,exports){
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

},{"./utils":200}],182:[function(require,module,exports){
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

},{"./mode":193}],183:[function(require,module,exports){
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

},{}],184:[function(require,module,exports){
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

},{}],185:[function(require,module,exports){
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

},{"./mode":193,"encode-utf8":175}],186:[function(require,module,exports){
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

},{"./error-correction-level":187}],187:[function(require,module,exports){
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

},{}],188:[function(require,module,exports){
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

},{"./utils":200}],189:[function(require,module,exports){
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

},{"./utils":200}],190:[function(require,module,exports){
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

},{}],191:[function(require,module,exports){
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

},{"./mode":193,"./utils":200}],192:[function(require,module,exports){
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

},{}],193:[function(require,module,exports){
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

},{"./regex":198,"./version-check":201}],194:[function(require,module,exports){
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

},{"./mode":193}],195:[function(require,module,exports){
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

},{"./galois-field":190}],196:[function(require,module,exports){
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

},{"./alignment-pattern":181,"./bit-buffer":183,"./bit-matrix":184,"./error-correction-code":186,"./error-correction-level":187,"./finder-pattern":188,"./format-info":189,"./mask-pattern":192,"./mode":193,"./reed-solomon-encoder":197,"./segments":199,"./utils":200,"./version":202}],197:[function(require,module,exports){
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

},{"./polynomial":195}],198:[function(require,module,exports){
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

},{}],199:[function(require,module,exports){
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

},{"./alphanumeric-data":182,"./byte-data":185,"./kanji-data":191,"./mode":193,"./numeric-data":194,"./regex":198,"./utils":200,"dijkstrajs":174}],200:[function(require,module,exports){
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

},{}],201:[function(require,module,exports){
/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValid = function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}

},{}],202:[function(require,module,exports){
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

},{"./error-correction-code":186,"./error-correction-level":187,"./mode":193,"./utils":200,"./version-check":201}],203:[function(require,module,exports){
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

},{"./utils":205}],204:[function(require,module,exports){
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

},{"./utils":205}],205:[function(require,module,exports){
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

},{}],206:[function(require,module,exports){
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

},{"./lib/vCardFormatter":207,"fs":172,"path":177}],207:[function(require,module,exports){
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
},{}]},{},[1]);
