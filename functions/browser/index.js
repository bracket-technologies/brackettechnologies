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

views.document = document
views.document.element = document
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

    var global = window.global
    global["clickedElement()"] = global["clicked"] = global["clicked()"] = views[((e || window.event).target||e.currentTarget).id]
    global.clickedElement = (e || window.event).target

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

}, false)

// mousemove
document.body.addEventListener('mousemove', (e) => {
    global.screenX = e.screenX
    global.screenY = e.screenY
    Object.values(window.global["body-mousemove-events"]).flat().map(o => bodyEventListener(o, e))
    currentTime = (new Date()).getTime()
    // if (currentTime - lastVisit > 3600000 && global.data.page[global.currentPage]["recaptcha-required"]) 
    lastVisit = currentTime
}, false)

document.addEventListener("mousedown", (e) => {
    window.global.mousedown = true
    Object.values(window.global["body-mousedown-events"]).flat().map(o => bodyEventListener(o, e))
})

document.addEventListener("mouseup", (e) => {
    window.global.mousedown = false
    Object.values(window.global["body-mouseup-events"]).flat().map(o => bodyEventListener(o, e))
})

document.addEventListener('keydown', e => {
    if (e.ctrlKey) global.ctrlKey = true
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

    // close actionlist
    if (views.actionlist.element.style.pointerEvents === "auto") {

        var closeActionlist = toCode({ string: "if():[!():actionlist.mouseentered]:[():actionlist.mouseleave()]" })
        toParam({ string: closeActionlist, id: "actionlist" })
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
},{"../function/execute":57,"../function/setElement":97,"../function/starter":100,"../function/toApproval":104,"../function/toCode":109,"../function/toParam":118}],2:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

  component = toComponent(component)
  var { icon, style } = component
  icon = icon || {}

  return {
    ...component,
    "type": `View?class=flexbox pointer;style.height=2rem;style.width=2rem;style.borderRadius=.25rem;style.transition=.1s;style.backgroundColor=#fff;style.border=1px solid #ccc;${toString({ style })}`,
    "children": [{
      "type": `Icon?name=bi-check;style.color=#fff;style.fontSize=2rem;style.opacity=0;style.transition=.1s;${toString(icon)}`
    }],
    "controls": [{
      "event": "click?checked()=if():checked():false:true;if():checked():[1stChild().style().opacity=1;data()=true;style().backgroundColor=#2C6ECB;style().border=1px solid #ffffff00]:[1stChild().style().opacity=0;data()=false;style().backgroundColor=#fff;style().border=1px solid #ccc]"
    }]
  }
}
},{"../function/toComponent":110}],3:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')
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
      duplicatable, lang, unit, currency, google, key, minlength , children, container, generator,
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
            "type": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=${component.style.width||"100%"};style.maxWidth=${component.style.maxWidth||"100%"};${toString(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                    "type": `Text?text='${text || "Label"}';style.color=#888;style.fontSize=1.1rem;style.width=fit-content;${toString(label)}`,
                    "controls": [{
                        "event": "click?next().input().click()"
                    }]
                }, Input({ ...component, component: true, labeled: id, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
                ]
            }, {
                "type": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${toString(password)}?${password}`,
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
        var clickedBorder = component.clicked && component.clicked.style.border
        component.controls = component.controls || []

        if (component.clicked) {
          component.clicked.preventDefault = true
          if (component.clicked.style.border) delete component.clicked
        }
        
        delete component.label
        delete component.path
        delete component.id
        delete component.tooltip
        delete label.text
        label.tooltip = tooltip
        
        return {
          id, Data, parent, derivations, required, path, islabel: true, preventDefault,
          "type": `View?class=flex start column;style.gap=.5rem;style.width=${component.style.width ||"100%"};style.maxWidth=${component.style.maxWidth ||"100%"};${toString(container)}`,
          "children": [{
            "type": `Text?id=${id}-label;text='${text || "Label"}';style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${toString(label)}`,
            "controls": [{
                "event": "click?next().input().click()"
            }]
          },
            Input({ ...component, component: true, labeled: id, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
          {
            "type": `View:${id}-required?class=flex gap-1;style:[alignItems=center;opacity=${required && required.style && required.style.opacity || "0"};transition=.2s]?${required ? true : false}`,
            "children": [{
              "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
            }, {
              "type": `Text?text=${required && required.text || "Required blank"};style.color=#D72C0D;style.fontSize=1.3rem;${toString(required)}`
            }]
          }],
          "controls": [{
            "event": `click:1stChild();click:[if():[${duplicatable?true:false}]:[2ndChild().children()]:2ndChild()]?clicked=true;if():[!${duplicatable?true:false}]:[2ndChild().style().border=${clickedBorder}]:[2ndChild().lastChild().style().border=${clickedBorder}]?!mobile();${clickedBorder?true:false}`
          }, {
            "event": `click:body?clicked=false;if():[${duplicatable?true:false}]:[2ndChild().children().():[style().border=${style.border || "1px solid #ccc"}]]:[2ndChild().style().border=${style.border || "1px solid #ccc"}]?${clickedBorder?true:false};!mobile();!contains():[clicked:()];!droplist.contains():[clicked:()]`
          }]
        }
    }

    if (model === 'featured' || password || clearable || removable || duplicatable || copyable || generator) {

      var myView = {
            ...component,
            type: duplicatable ? "[View]" : "View",
            class: `flex align-items-center unselectable ${component.class || ""}`,
            // remove from comp
            controls: [{
                event: `mouseenter?if():[clearable||removable]:[():[${id}+'-clear'].style().opacity=1];if():copyable:[():[${id}+'-copy'].style().opacity=1];if():generator:[():[${id}+'-generate'].style().opacity=1]?!mobile()`
            }, {
                event: `mouseleave?if():[clearable||removable]:[():[${id}+'-clear'].style().opacity=0];if():copyable:[():[${id}+'-copy'].style().opacity=0];if():generator:[():[${id}+'-generate'].style().opacity=0]?!mobile()`
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
                type: `Text?id=${id}-msg;msg=parent().msg;text=parent().msg?parent().msg`,
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontSize: '1.3rem',
                    maxWidth: '95%',
                }
            }, {
                type: `Input`,
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
                    height: "100%",
                    padding: "0.5rem",
                    color: input.type === "number" ? "blue" : '#444',
                    outline: 'none',
                    userSelect: password ? "none" : "initial",
                    ...uploadInputStyle,
                    ...input.style
                },
                controls: [...controls, {
                    event: `clickfocus;keyfocus?if():[labeled]:[if():[!():${labeled}.contains():[clicked:()]]:[if():${duplicatable?true:false}:[e().target.parent().click()]:[2ndChild().click()]]]:[if():[!():${id}.contains():[clicked:()]]:[click():[droplist-positioner:().del();]]]?!preventDefault` // for clicked event
                }, {
                    event: "select;mousedown?preventDefault()"
                }, {
                    event: "keyup?Data():[path=derivations().clone().pullLast().push():[derivations().lastEl().num()+1]]=_string;update():[().parent().parent()]?duplicatable;e().key=Enter",
                }]
            }, {
                type: `Icon?class=pointer;id=${id}-clear;name=bi-x;style:[position=absolute;if():[language:()=ar]:[left=if():[parent().password]:4rem:'0.5rem']:[right=if():[parent().password]:4rem:'0.5rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[parent().clearable;prev().txt();${readonly?false:true}]:[prev().data().del();():${id}-input.txt()=;#():${id}-input.focus()].elif():[parent().clearable;${readonly?false:true}]:[#():${id}-input.focus()].elif():[${readonly?false:true};parent().removable;!():${id}-input.txt();parent().data().len()!=1]:[${readonly?false:true};parent().rem()]]?parent().clearable||parent().removable`,
            }, {
                type: `Text?class=flexbox pointer;id=${id}-generate;text=ID;style:[position=absolute;color=blue;if():[language:()=ar]:[left=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0]:[right=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0];width=3rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;backgroundColor=inherit;borderRadius=.5rem];click:[generated=gen():[parent().generator.length||20];data()=().generated;():${id}-input.txt()=().generated;():${id}-input.focus()]?parent().generator`,
            }, {
                type: `Icon?class=pointer;id=${id}-copy;name=bi-files;style:[backgroundColor=#fff;position=absolute;if():[language:()=ar]:[left=if():[parent().clearable]:[2.5rem]:0]:[right=if():[parent().clearable]:[2.5rem]:0];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;borderRadius=.5rem];click:[if():[():${id}-input.txt()]:[data().copyToClipBoard();#():${id}-input.focus()]];mininote.text='copied!'?parent().copyable`,
            }, {
                type: `View?style.height=100%;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative?parent().password`,
                children: [{
                    type: `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?parent().prev().element.type=text;next().style().display=flex;style().display=none"
                    }]
                }, {
                    type: `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?parent().prev().element.type=password;prev().style().display=flex;style().display=none"
                    }]
                }]
            }]
        }
        
        if (duplicatable) {
          
          return {
            type: "View?if():[data().type()!=array]:[data()=_list];class=vertical;style:[gap=1rem;width=100%]",
            children: [myView]
          }

        } else return myView
    }
    
    if (model === 'classic') {
        
      return {
          ..._component,
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
              event: `clickfocus;keyfocus?if():[labeled]:[if():[!().labeled.contains():[clicked:()]]:[1stChild().click()]]:[if():[!contains():[clicked:()]]:click()]`
          }, {
              event: "input?parent().required.mount=false;parent().click()?parent().required.mount;e().target.value.exist()"
          }]
      }
    }
}

module.exports = Input
},{"../function/clone":38,"../function/generate":64,"../function/merge":79,"../function/toComponent":110,"../function/toString":122}],4:[function(require,module,exports){
const { toComponent } = require("../function/toComponent")

module.exports = (component) => {

  component.hover = component.hover || {}
  component.style = component.style || {}
  component.hover.style = component.hover.style || {}
  component.style.after = component.style.after || {}

  component.icon = component.icon || {}
  component.icon.style = component.icon.style || {}
  component.icon.hover = component.icon.hover || {}
  component.icon.hover.style = component.icon.hover.style || {}
  component.icon.style.after = component.icon.style.after || {}

  component.text = component.text || {}
  component.text.text = component.text.text
  component.text.style = component.text.style || {}
  component.text.hover = component.text.hover || {}
  component.text.hover.style = component.text.hover.style || {}
  component.text.style.after = component.text.style.after || {}

  if (component.hover.freeze) {
    component.icon.hover.freeze = true
    component.text.hover.freeze = true
  }

  if (component.hover.mount) {
    component.icon.hover.mount = true
    component.text.hover.mount = true
  }

  component = toComponent(component)

  var {
    id,
    model,
    state,
    style,
    icon,
    text,
    hover,
    tooltip,
    controls,
    readonly,
    borderMarker,
  } = component
  
  borderMarker = borderMarker !== undefined ? borderMarker : true
  readonly = readonly !== undefined ? readonly : false
  var mount = hover.mount ? true : false

  
  if (model === "classic")
    return {
      ...component,
      class: "flex-box item",
      component: "Item",
      type: `View?touchableOpacity`,
      tooltip,
      hover: {
        ...hover,
        id,
        style: {
          backgroundColor: readonly ? "initial" : "#eee",
          ...style.after,
          ...hover.style 
        }
      },
      style: {
        position: "relative",
        justifyContent: text.text !== undefined ? "flex-start" : "center",
        width: "100%",
        minHeight: "3rem",
        cursor: readonly ? "initial" : "pointer",
        marginBottom: "1px",
        borderRadius: "0.5rem",
        padding: "0.9rem",
        borderBottom: readonly ? "1px solid #eee" : "initial",
        pointerEvents: "fill",
        ...style
      },
      children: [{
        type: `Icon?id=${id}-icon?'${icon.name}'`,
        ...icon,
        hover: {
          id,
          mount,
          disable: true,
          ...icon.hover,
          style: {
            color: style.after.color || "#444",
            ...icon.style.after,
            ...icon.hover.style
          }
        },
        style: {
          display: icon ? "flex" : "none",
          color: !readonly ? style.color || "#444" : "#333",
          fontSize: !readonly ? style.fontSize || "1.4rem" : "1.6rem",
          fontWeight: !readonly ? "initial" : "bolder",
          marginRight: text.text !== undefined ? "1rem" : "0",
          ...icon.style,
        }
      }, {
        type: `Text?id=${id}-text;text=${text.text}.str()?[${text.text}]`,
        ...text,
        hover: {
          id,
          mount,
          disable: true,
          ...text.hover,
          style: {
            color: style.after.color || "#444",
            ...text.style.after,
            ...text.hover.style
          }
        },
        style: {
          fontSize: style.fontSize || "1.4rem",
          color: !readonly ? style.color || "#444" : "#333",
          fontWeight: !readonly ? "initial" : "bolder",
          userSelect: "none",
          textAlign: "left",
          ...text.style,
        }
      }],
      controls: [...controls,
      {
        event: `click?():[)(:${state}].hover.freeze=false?)(:${state}.undefined().or():[)(:${state}.0.not():${id}]`,
        actions: [
          `resetStyles:)(:${state}`,
          `mountAfterStyles:[)(:${state}]?)(:${state}=_array:${id}:${id}-icon:${id}-text;():[)(:${state}].hover.freeze`,
        ]
      }]
    }
}

},{"../function/toComponent":110}],5:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)
    
    return {
        ...component,
        type: "View?#if():[!opened-maps:()]:[opened-maps:()=_list];class=flex-column;style.width=100%;if():[().isField]:[style():[marginLeft=2rem;borderLeft=1px solid #ddd;width=calc(100% - 2rem)]]:[line-counter:()=0];#mode.dark.style.borderLeft=1px solid #888",
        children: [{
            type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem;style.position=relative?!parent().isField",
            controls: [{
                event: "click?().opened=1stChild().style().transform.inc():rotate(90deg);parent().children().pull():0.pullLast().():[style().display=if():[().opened]:none:flex];1stChild().style().transform=if():[().opened]:rotate(0deg):rotate(90deg);2ndLastChild().style().display=if():[().opened]:flex:none;lastSibling().style().display=if():[().opened]:none:flex;3rdLastChild().style().display=if():[().opened]:flex:none?clicked:().id!=2ndChild().id;clicked:().id!=3rdChild().id;clicked:().id!=lastChild().1stChild().id"
            }, {
                event: "mouseenter?lastChild().style().opacity=1"
            }, {
                event: "mouseleave?lastChild().style().opacity=0"
            }],
            children: [{
                type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s"
            }, {
                type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;style.color=green;style.fontSize=1.4rem;style.height=100%"
            }, {
                type: "Text?class=pointer;text=...;style.display=none;style.fontSize=1.4rem"
            }, {
                type: "Text?style.display=none;text=};style.paddingBottom=.25rem;style.color=green;style.fontSize=1.4rem"
            }, {
                type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                children: [{
                    type: "Icon?mainMap;name=bi-three-dots-vertical;actionlist.undeletable;actionlist.placement=left;class=flex-box pointer;style.color=#888;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                }]
            }]
        }, {
            type: "[View]?class=flex column;sort;arrange=parent().arrange;style.marginLeft=if():[!parent().isField]:2rem:0;style.position=relative?data().isdefined();data()!=_list;data()!=_map",
            children: [{
                type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem",
                controls: [{
                    event: "click?next().style().display=if():[next().style().display=flex]:none:flex;1stChild().style().transform=if():[1stChild().style().transform.inc():rotate(0deg)]:rotate(90deg):rotate(0deg);2ndLastChild().style().display=if():[2ndLastChild().style().display=flex]:none:flex;3rdLastChild().style().display=if():[3rdLastChild().style().display=flex||data().len()=0]:none:flex;next().next().style().display=if():[next().next().style().display=flex]:none:flex?data().type()=array||data().type()=map;clicked:().id!=2ndChild().id;clicked:().id!=3rdChild().id;clicked:().id!=lastChild().1stChild().id;!clicked:().classlist().inc():[mini-controls]"
                }, {
                    event: "mouseenter?lastChild().style().opacity=1"
                }, {
                    event: "mouseleave?lastChild().style().opacity=0"
                }],
                children: [{
                    type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s?data().type()=map||data().type()=array"
                }, {
                    type: "View?style.minWidth=2rem;text=?data().type()!=map;data().type()!=array"
                }, {
                    type: "View?preventDefault;editable;style:[alignItems=center;width=fit-content;minWidth=fit-content;height=3rem;border=1px solid #ffffff00;borderRadius=.5rem;backgroundColor=#ffffff00;fontSize=1.4rem;padding=.5rem;color=blue];hover.style.border=1px solid #ddd;text=path().lastElement()?2ndParent().parent().data().type()!=array",
                    controls: [{
                        event: "input?Data():[path().clone().replaceLast():val()]=data().clone();data().del();2ndParent().deepChildren().():[derivations.[path().lastIndex()]=val()]?if():[Data():[path().clone().replaceLast():val()]!=undefined]:[note():[text=val()+ field name already exists!;type=danger];false]:true"
                    }, {
                        event: "keyup?if():[)(:droplist-positioner;)(:keyup-index]:[():droplist.children().[)(:keyup-index].click();timer():[)(:keyup-index.del()]:200;().break=true];)(:keyup-index=0;if():[)(:droplist-positioner!=next().id]:[next().click()];timer():[():droplist.children().0.mouseenter()]:200?e().key=Enter;!ctrlKey:()"
                    }, {
                        event: "keyup?():droplist.mouseleave()?e().key=Escape"
                    }, {
                        event: "keyup?():droplist.children().[)(:keyup-index].mouseleave();)(:keyup-index=if():[e().keyCode=40]:[)(:keyup-index+1]:[)(:keyup-index-1];():droplist.children().[)(:keyup-index].mouseenter()?e().keyCode=40||e().keyCode=38;)(:droplist-positioner;if():[e().keyCode=38]:[)(:keyup-index>0].elif():[e().keyCode=40]:[)(:keyup-index<next().droplist.items.lastIndex()]"
                    }, {
                        event: "keyup?insert-index:()=3rdParent().children().findIndex():[id=2ndParent().id]+1;if():[data().type()=string]:[data()=_list];if():[path().lastEl()=children]:[data().push():[_map:type:_string]];if():[path().lastEl()=controls]:[data().push():[_map:event:_string]];update():2ndParent();update:().view.inputs().lastEl().focus()?e().key=Enter;ctrlKey:();path().lastEl()=controls||path().lastEl()=children"
                    }]
                }, {
                    type: "Text?text=path().lastElement();class=flexbox;style.color=#666;style.fontSize=1.4rem;style.marginRight=.5rem;style.minWidth=3rem;style.minHeight=2rem;style.borderRadius=.5rem;style.border=1px solid #ddd?2ndParent().parent().data().type()=array"
                }, {
                    type: "Text?text=:;tooltip.text=set type;class=flex-box pointer;style.fontSize=1.5rem;style.marginRight=.5rem;style.minWidth=2rem;style.minHeight=2rem;style.paddingBottom=.25rem;style.borderRadius=.5rem;hover.style.backgroundColor=#e6e6e6;droplist.items=_list:children:controls:string:number:boolean:map:array:timestamp:geopoint;droplist.isMap"
                }, {
                    type: `Text?text=";#mode.dark.style.color=#c39178;style.color=#a35521;style.marginRight=.3rem;style.fontSize=1.4rem?data().type()=string`
                }, {
                    type: "Text?class=flexbox;text=[;style.paddingBottom=.25rem;style.color=green;style.fontSize=1.4rem;style.height=100%?data().type()=array"
                }, {
                    type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;style.color=green;style.fontSize=1.4rem;style.height=100%?data().type()=map"
                }, {
                    type: "View?class=flexbox mini-controls;style:[height=2rem;overflowY=hidden;borderRadius=.25rem;padding=.5rem;gap=.75rem;zIndex=1;position=absolute;left=[path().len()*(-2.1)]+rem];mouseleave:[2ndChild().style():[opacity=0;pointerEvents=none];3rdChild().style():[opacity=0;pointerEvents=none]]",
                    children: [
                        {
                            type: "Text?line-counter:()++;text=line-counter:();class=flexbox line-counter pointer mini-controls;style:[fontSize=1.2rem];mouseenter:[next().style():[opacity=1;pointerEvents=auto];2ndNext().style():[opacity=1;pointerEvents=auto]]"
                        }, {
                            type: "View?class=flexbox column pointer mini-controls;style:[padding=.5rem;gap=.75rem;opacity=0;pointerEvents=none];mouseleave:[parent().style():[height=2rem;zIndex=1];children().pull():5.():[style():[opacity=0;pointerEvents=none]]]",
                            children: [
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#ffcea3;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#ffcea370;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#c0f5a2;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#c0f5a270;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#fbe692;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#fbe69270;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#fab4d7;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#fab4d770;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#feb1b1;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#feb1b170;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#fff;border=1px solid #bbb];click:[3rdParent().():[style():[backgroundColor=#fff];hover.disable=true]];mouseenter:[2ndParent().style():[zIndex=10;height=fit-content];parent().children().():[style():[opacity=1;pointerEvents=auto]]]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#c4c2ff;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#c4c2ff70;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#9ee1ff;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#9ee1ff70;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#78eba8;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#78eba870;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#ecb4f5;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#ecb4f570;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer mini-controls;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#8cebdb;border=1px solid #bbb;opacity=0;pointerEvents=none];click:[3rdParent().style().backgroundColor=#8cebdb70;3rdParent().hover.disable=true]"
                                }
                            ]
                        }, {
                            type: "Icon?class=flexbox pointer mini-controls;name=bi-eye;style:[fontSize=1.4rem;opacity=0;pointerEvents=none;backgroundColor=#fff]?false"
                        }
                    ]
                }, {
                    type: "View?style.overflow=auto;style.whiteSpace=nowrap?data().type()=string",
                    children: [{
                        type: "View?style.display=inline-flex",
                        children: [{
                            type: "View?class=flex;colorize;editable;#if():[path().lastElement()=id]:[readonly=true];style:[alignItems=center;width=fit-content;minWidth=1rem;minHeight=3rem;maxHeight=3rem;height=3rem;border=1px solid #ffffff00;borderRadius=.5rem;color=#a35521;fontSize=1.4rem;padding=.5rem];hover.style.border=1px solid #ddd;input.style.color=#a35521",
                            controls: [{
                                event: "keyup?insert-index:()=2ndParent().2ndParent().parent().children().findIndex():[id=2ndParent().2ndParent().id]+1;if():[2ndParent().2ndParent().parent().data().type()=map]:[2ndParent().2ndParent().parent().data().[_string]=_string];if():[2ndParent().2ndParent().parent().data().type()=array]:[2ndParent().2ndParent().parent().data().splice():_string:[insert-index:()]];if():[insert-index:().less():[2ndParent().2ndParent().parent().data().len()+1];2ndParent().2ndParent().parent().data().type()=array]:[2ndParent().2ndParent().parent().children().slice():[insert-index:()]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;last-index:()=_.derivations.lastIndex();el-index:()=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[last-index:()]=el-index:()]]]?e().key=Enter;!ctrlKey:()",
                                actions: "wait():[insert:[2ndParent().2ndParent().parent().id]]?insert.component=2ndParent().2ndParent().parent().children.1;insert.path=if():[2ndParent().2ndParent().parent().data().type()=array]:[2ndParent().2ndParent().parent().derivations.clone().push():[insert-index:()]].else():[2ndParent().2ndParent().parent().derivations.clone().push():_string];insert.index=insert-index:();wait():[().insert.view.getInput().focus()]"
                            },
                            {
                                event: "keyup?insert-index:()=2ndParent().2ndParent().2ndParent().2ndParent().children().findIndex():[id=2ndParent().2ndParent().2ndParent().parent().id]+1;2ndParent().2ndParent().2ndParent().2ndParent().data().splice():[if():[path().lastEl()=type]:[_map:type:_string].elif():[path().lastEl()=event||path().lastEl()=actions]:[_map:event:_string]]:[insert-index:()];if():[insert-index:().less():[2ndParent().2ndParent().2ndParent().2ndParent().data().len()+1]]:[2ndParent().2ndParent().2ndParent().2ndParent().children().slice():[insert-index:()]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;last-index:()=_.derivations.lastIndex();el-index:()=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[last-index:()]=el-index:()]]]?e().key=Enter;ctrlKey:();path().lastEl()=type||path().lastEl()=event||path().lastEl()=actions",
                                actions: "wait():[insert:[2ndParent().2ndParent().2ndParent().2ndParent().id]]?insert.component=2ndParent().2ndParent().2ndParent().2ndParent().children.1;insert.path=2ndParent().2ndParent().2ndParent().2ndParent().derivations.clone().push():[insert-index:()];insert.index=insert-index:();wait():[().insert.view.inputs().1.focus()]"
                            }]
                        }]
                    }]
                }, {
                    type: "Input?style.height=3.2rem;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.type=number;input.style.color=olive;style.width=fit-content;style.borderRadius=.5rem?data().type()=number",
                    controls: [{
                        event: "keyup?insert-index:()=2ndParent().parent().children().findIndex():[id=2ndParent().id]+1;if():[2ndParent().parent().data().type()=map]:[2ndParent().parent().data().[_string]=_string];if():[2ndParent().parent().data().type()=array]:[2ndParent().parent().data().splice():_string:[insert-index:()]];if():[insert-index:().less():[2ndParent().parent().data().len()+1];2ndParent().parent().data().type()=array]:[2ndParent().parent().children().slice():[insert-index:()]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;last-index:()=_.derivations.lastIndex();el-index:()=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[last-index:()]=el-index:()]]]?e().key=Enter;!ctrlKey:()",
                        actions: "wait():[insert:[2ndParent().parent().id]]?insert.component=2ndParent().parent().children.1;insert.path=if():[2ndParent().parent().data().type()=array]:[2ndParent().parent().derivations.clone().push():[insert-index:()]]:[2ndParent().parent().derivations.clone().push():_string];insert.index=insert-index:();wait():[().insert.view.input().focus()]"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;readonly;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.color=purple;style.width=fit-content;style.borderRadius=.5rem;droplist.items=_list:true:false?data().type()=boolean"
                }, {
                    type: "Input?style.height=3.2rem;input.type=datetime-local;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?data().type()=timestamp",
                    controls: [{
                        event: "change?data()=date():txt().timestamp()"
                    }, {
                        event: "loaded?txt()=date():data().getDateTime()"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;input.type=time;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?data().type()=time",
                    controls: [{
                        event: "change?data()=data().timestamp()"
                    }, {
                        event: "loaded?txt()=data().toClock():[hr;min]"
                    }]
                }, {
                    type: `Text?text=";#mode.dark.style.color=#c39178;style.marginLeft=.3rem;style.color=#a35521;style.fontSize=1.4rem?data().type()=string`
                }, {
                    type: "Text?class=flexbox pointer;style.display=none;text='...';style.fontSize=1.4rem"
                }, {
                    type: "Text?style.display=none;text=];style.paddingBottom=.25rem;style.color=green;style.fontSize=1.4rem?data().type()=array"
                }, {
                    type: "Text?style.display=none;text=};style.paddingBottom=.25rem;style.color=green;style.fontSize=1.4rem?data().type()=map"
                }, {
                    type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                    children: [{
                        type: "Icon?actionlist.placement=left;class=flex-box pointer;style.color=#888;icon.name=bi-three-dots-vertical;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                    }]
                }]
            }, {
                type: "View?arrange=parent().arrange;class=flex-start;style.display=flex;style.transition=.2s?data().type()=map||data().type()=array",
                children: [{
                    type: "Map?arrange=parent().arrange;isField"
                }]
            }, {
                type: "Text?class=flex-box;text=];style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?data().type()=array"
            }, {
                type: "Text?class=flex-box;text=};style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?data().type()=map"
            }]
        }, {
            type: "Text?class=flexbox;style.justifyContent=flex-start;text=};style.marginLeft=2rem;style.paddingBottom=.25rem;style.height=2.5rem;style.color=green;style.fontSize=1.4rem?!parent().isField",
        }]
    }
}
},{"../function/toComponent":110}],6:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)

    component.style = component.style || {}
    component.hover = component.hover || {}
    component.hover.style = component.hover.style || {}

    // innerbox
    component.innerbox = component.innerbox || {}
    component.innerbox.style = component.innerbox.style || {}
    component.innerbox.hover = component.innerbox.hover || {}
    component.innerbox.hover.style = component.innerbox.hover.style || {}
    
    return {
        ...component,
        type: "Box?class=swiper",
        children: [{
            type: "Box?style.display=inline-flex;style.alignItems=center;style.height=100%",
            ...component.innerbox,
            children: component.children
        }]
    }
}
},{"../function/toComponent":110}],7:[function(require,module,exports){
const { toComponent } = require("../function/toComponent")
const { toString } = require("../function/toString")

module.exports = (component) => {

  var { icon, pin, controls, style } = toComponent(component)

  pin = pin || {}
  icon = icon || {}
  icon.on = icon.on || {}
  icon.off = icon.off || {}

  return {
    ...component,
    type: `Box?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${toString({ style })}`,
    children: [{
      type: `Box?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${toString(pin)}`,
      children: [{
          type: `Icon?style.color=red;style.fontSize=1.8rem;style.position=absolute;style.transition=.3s;${toString(icon.off)}?[${icon.off.name}]`
        }, {
          type: `Icon?style.color=blue;style.fontSize=1.3rem;style.position=absolute;style.opacity=0;style.transition=.3s;${toString(icon.on)}?[${icon.on.name}]`
        }]
    }],
    controls: [{
        event: "click?().element.checked=[true].if().[().element.checked.notexist()].else().[false];().checked=().element.checked;().1stChild().element.style.left=[calc(100% - 2.3rem)].if().[().element.checked].else().[0.3rem];().1stChild().1stChild().element.style.opacity=[0].if().[().element.checked].else().[1];().1stChild().2ndChild().element.style.opacity=[1].if().[().element.checked].else().[0]"
      },
      ...controls
    ]
  }
}

},{"../function/toComponent":110,"../function/toString":122}],8:[function(require,module,exports){
module.exports = {
  Input : require("./Input"),
  Item : require("./Item"),
  Switch : require("./Switch"),
  Checkbox : require("./Checkbox"),
  Map : require("./Map"),
  Swiper : require("./Swiper"),
  // Entry : require("./Entry")
}

},{"./Checkbox":2,"./Input":3,"./Item":4,"./Map":5,"./Swiper":6,"./Switch":7}],9:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  window.views[id].actionlist.id = controls.id = id = controls.id || id
  
  return [{
    event: `click?if():[actionlistCaller:()!=${id}]:[():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._]];clearTimer():[actionlist-timer:()];if():[actionlistCaller:()=${id}]:[timer():[():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()]:0];if():[actionlistCaller:()!=().id]:[().actionlist.undeletable=():actionlist.undeletable||_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;actionlistCaller:()=${id};actionlistCallerId:()=${id};path=${controls.path || ""};():actionlist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];update():actionlist;():actionlist.position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}];().actionlist.style.keys()._():[():actionlist.style()._=().actionlist.style._]]`
  }]
}
},{}],10:[function(require,module,exports){
module.exports = ({ id, controls }) => {
    if (window.views[id].type !== "Input" && !window.views[id].editable) {
      var _input = window.views[id].element.getElementsByTagName("INPUT")
      if (_input.length > 0) id = _input[0].id
    }
    return [{
      event: `blur:${id}?${controls}??${id}`
    }]
}
},{}],11:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `change:[getInput().id]?${controls}??getInput().id`
    }]
}
},{}],12:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `click?${controls}`
    }]
}
},{}],13:[function(require,module,exports){
module.exports = ({ controls, id }) => {

    var local = window.views[id]
    var _id = controls.id || id
    
    local.clicked.default = local.clicked.default || { style: {} }
    local.clicked.style &&
    Object.keys(local.clicked.style).map(key => 
        local.clicked.default.style[key] = local.clicked.default.style[key] !== undefined ? local.clicked.default.style[key] : local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?clicked.disable=true;if():[mode:()=default-mode:()]:[clicked.style.keys()._():[style()._=().clicked.style._]]?clicked.mount||clicked.disable`
    }, {
        "event": `click:${_id}?if():[mode:()=default-mode:()]:[clicked.style.keys()._():[style()._=().clicked.style._]]?!required.mount;!parent().required.mount;!clicked.disable`
    }, {
        "event": "click:body?if():[mode:()=default-mode:()]:[clicked.style.keys()._():[style()._=().style._||null]]?!required.mount;!parent().required.mount;!clicked.disable;!contains():[clicked:()];!droplist.contains():[clicked:()]"
    }]
}
},{}],14:[function(require,module,exports){
module.exports = {
  item: require("./item"),
  list: require("./list"),
  popup: require("./popup"),
  droplist: require("./droplist"),
  actionlist: require("./actionlist"),
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
  keydown: require("./keydown"),
  loaded: require("./loaded"),
  contentful: require("../function/contentful").contentful
}
},{"../function/contentful":41,"./actionlist":9,"./blur":10,"./change":11,"./click":12,"./clicked":13,"./droplist":15,"./focus":16,"./hover":17,"./item":18,"./keydown":19,"./keypress":20,"./keyup":21,"./list":22,"./loaded":23,"./mininote":24,"./mousedown":25,"./mouseenter":26,"./mouseleave":27,"./mouseover":28,"./mouseup":29,"./popup":30,"./pricable":31,"./tooltip":32}],15:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  window.views[id].droplist.id = controls.id = id = controls.id || id
  
  return [{
    event: "keyup:input()?clearTimer():[droplist-timer:()];():[droplist-positioner:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];droplist-positioner:().del()?e().key=Escape"
  }, {
    event: `click?keyup-index:()=0;droplist-search-txt:().del();if():[input().txt()]:[droplist-search-txt:()=input().txt()];clearTimer():[droplist-timer:()];if():[droplist-positioner:()!=${id}]:[().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]];if():[droplist-positioner:()=${id}]:[timer():[().droplist.style.keys()._():[():droplist.style()._=():droplist.style._||null];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];droplist-positioner:().del()]:0];if():[droplist-positioner:()!=().id]:[droplist-positioner:()=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];droplist();().droplist.style.keys()._():[():droplist.style()._=().droplist.style._];():droplist.position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}]]`,
    actions: `droplist:${id}??`
  }, {
    event: "input:input()?droplist-search-txt:()=input().txt()?input();droplist.searchable",
    actions: `droplist:${id}?droplist-positioner:()=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];():droplist.position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}];().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]`
  }, {
    event: `keyup:input()?if():[droplist-positioner:();keyup-index:()]:[():droplist.children().[keyup-index:()].click();().break=true;():droplist.mouseleave()];keyup-index:()=0;if():[droplist-positioner:()!=2ndChild().id]:[2ndChild().click()];timer():[():droplist.children().0.mouseenter()]:200?!():${id}.droplist.preventDefault;e().key=Enter`
  }, {
    event: `keyup:input()?():droplist.children().():mouseleave();keyup-index:()=if():[e().keyCode=40]:[keyup-index:()+1]:[[keyup-index:()]-1];():droplist.children().[keyup-index:()].mouseenter()?!():${id}.droplist.preventDefault;e().keyCode=40||e().keyCode=38;droplist-positioner:();if():[e().keyCode=38]:[keyup-index:()>0].elif():[e().keyCode=40]:[keyup-index:()<():droplist.children.lastIndex()]`
  }]
}
},{}],16:[function(require,module,exports){
module.exports = ({ id, controls }) => {
  if (window.views[id].type !== "Input" && !window.views[id].editable) {
    var _input = window.views[id].element.getElementsByTagName("INPUT")
    if (_input.length > 0) id = _input[0].id
  }
  return [{
    event: `focus:${id}?${controls}??${id}`
  }]
}
},{}],17:[function(require,module,exports){
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
        "event": `loaded:${_id}?if():[state=().hover.id]:[[().state]:()=generate()];hover.style.keys()._():[style()._=().hover.style._]?hover.mount`,
        // "actions": "setStyle?style()=if():[mode:()=default-mode:()]:[().hover.style]:[().mode.[mode:()].hover.style]||_map"
    }, {
        "event": `mouseenter:${_id}?hover.style.keys()._():[style()._=().hover.style._]?!clicked.disable;!hover.disable`,
        // "actions": "setStyle?style=if():[mode:()=default-mode:()]:[().hover.style]:[().mode.[mode:()].hover.style]||_map"
    }, {
        "event": `mouseleave:${_id}?hover.default.style.keys()._():[style()._=().hover.default.style._]?!clicked.disable;!hover.disable`,
        // "actions": "setStyle?style=().hover.default.style"
    }]
}
},{}],18:[function(require,module,exports){
module.exports = ({params}) => [
  "setData?data.value=().text",
  `resetStyles?():[)(:${params.state}.0].mountonload=false??)(:${params.state}`,
  `setState?)(:${params.state}=[${params.id || "().id"},${
    params.id || "().id"
  }++-icon,${params.id || "().id"}++-text,${
    params.id || "().id"
  }++-chevron]`,
  `mountAfterStyles?().mountonload:)(:${params.state}.0??)(:${params.state}`,
];

},{}],19:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `keydown?${controls}`
    }]
}
},{}],20:[function(require,module,exports){
module.exports = ({ controls }) => {
    
  return [{
    event: `keypress?${controls}`
  }]
}
},{}],21:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `keyup?${controls}`
    }]
}
},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
        event: `loaded?${controls}`
    }]
}
},{}],24:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `click?():mininote-text.txt()=${text};)(:mininote-timer.clearTimeout();():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000;():mininote.position():[positioner=mouse;placement=right]`
  }]
}
},{}],25:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mousedown?${controls}`
    }]
}
},{}],26:[function(require,module,exports){
module.exports = ({ controls }) => {
  
    return [{
      event: `mouseenter?${controls}`
    }]
}
},{}],27:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseleave?${controls}`
    }]
}
},{}],28:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseover?${controls}`
    }]
}
},{}],29:[function(require,module,exports){
module.exports = ({ controls }) => {
  
    return [{
      event: `mouseup?${controls}`
    }]
}
},{}],30:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  if (typeof window.views[id].popup !== "object") window.views[id].popup = {}
  window.views[id].popup.id = controls.id = id = controls.id || id

  return [{
    event: `click?clearTimer():[popup-timer:()];if():[popup-positioner:()!=${id}]:[().popup.style.keys()._():[():popup.style()._=().popup.style._]];if():[popup-positioner:()=${id}]:[timer():[().popup.style.keys()._():[():popup.style()._=():popup.style._||null];():popup.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];popup-positioner:().del()]:0].elif():[popup-positioner:()!=${id}]:[popup-positioner:()=${id};():popup.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];update():popup;():popup.position():[positioner=${controls.positioner || id};placement=${controls.placement || "left"};distance=${controls.distance};align=${controls.align}];().popup.style.keys()._():[():popup.style()._=().popup.style._]]`
  }]
}
},{}],31:[function(require,module,exports){
module.exports = ({ id }) => {
    
    var input_id = window.views[id].type === 'Input' ? id : `${id}-input`
    return [{
        "event": `input:${input_id}?():${input_id}.data()=():${input_id}.element.value().toPrice().else().0;():${input_id}.element.value=():${input_id}.data().else().0`
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
module.exports=[
  "data()", "Data()", "doc()", "mail()", "action()", "exec()", "notification()", "notify()", "alert()"
 , "style()", "className()", "getChildrenByClassName()", "erase()", "insert()", "setChild()"
 , "deepChildren()", "children()", "1stChild()", "lastChild()", "2ndChild()", "3rdChild()" 
 , "3rdLastChild()", "2ndLastChild()", "parent()", "next()", "text()", "val()", "txt()" 
 , "element()", "el()", "checked()", "check()", "prev()", "format()", "lastSibling()" 
 , "1stSibling()", "derivations()", "path()", "mouseleave()", "mouseenter()", "mouseup()", "blur()"
 , "mousedown()", "copyToClipBoard()", "mininote()", "note()", "date()", "tooltip()", "update()" 
 , "refresh()", "save()", "search()", "override()", "click()", "is()", "setPosition()" 
 , "gen()", "generate()", "route()", "getInput()", "input()", "getEntry()", "entry()" 
 , "getEntries()", "entries()", "toggleView()", "clearTimer()", "timer()", "range()", "focus()" 
 , "siblings()", "todayStart()", "time()", "remove()", "rem()", "removeChild()", "remChild()" 
 , "getBoundingClientRect()", "contains()", "contain()", "def()", "price()", "clone()", "uuid()" 
 , "timezone()", "timeDifference", "position()", "setPosition()", "classList()", "csvToJson()"
 , "classlist()", "nextSibling()", "2ndNextSibling()", "axios()", "newTab()", "droplist()", "sort()" 
 , "fileReader()", "src()", "addClass()", "removeClass()", "remClass()", "wait()", "print()" 
 , "monthStart()", "monthEnd()", "nextMonthStart()", "nextMonthEnd()", "prevMonthStart()", "prevMonthEnd()"
 , "yearStart()", "month()", "year()", "yearEnd()", "nextYearStart()", "nextYearEnd()", "prevYearStart()" 
 , "prevYearEnd()", "counter()", "exportCSV()", "exportPdf()", "readonly()", "html()", "csvToJson()"
 , "upload()", "timestamp()", "confirmEmail()", "files()", "share()", "return()", "html2pdf()", "dblclick()"
 , "exportExcel()", "2nd()", "2ndPrev()", "3rdPrev()", "2ndParent()", "3rdParent()", "installApp()"
 , "replaceItem()", "findAndReplaceItem()", "grandParent()", "grandChild()", "grandChildren()", "open()", "2ndNext()", "isNaN()"
 , "send()", "removeDuplicates()", "stopWatchers()", "getGeoLocation()", "display()", "hide()", "scrollTo()"
]
},{}],34:[function(require,module,exports){
const { toAwait } = require("./toAwait")

const axios = async ({ id, ...params }) => {

    var view = window.views[id]
    var { method, url, headers, payload } = params, data

    if (method === "get" || method === "search") {
        
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

    toAwait({ id, params })
}

module.exports = { axios }
},{"./toAwait":106,"axios":131}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"./clone":38}],38:[function(require,module,exports){
const clone = (obj) => {

  var copy
  if (!obj || typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") return obj
  else if (Array.isArray(obj)) copy = [...obj.map(obj => clone(obj))]
  else if (Object.keys(obj).length === 0) copy = {}
  else {
    copy = {}
    Object.entries(obj).map(([key, value]) => {
      if (key !== "element") copy[key] = clone(value)
      else copy[key] = value
    })
  }

  return copy
}

module.exports = {clone}

},{}],39:[function(require,module,exports){
const { generate } = require("./generate")
const { toCode } = require("./toCode")
const colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]

const colorize = ({ _window, id, string, start = "[", end = "]", index = 0 }) => {
  
    if (index === 8) index = 1
    var global = _window ? _window.global : window.global
    if (typeof string !== "string") return string

    while (string.includes("coded()")) {

      var string0 = string.split("coded()")[0]
      var key = global.codes["coded()" + string.split("coded()")[1].slice(0, 5)]
      key = colorize({ id, string: start + key + end, index: index + 1 })
      string = string0 + key + string.split("coded()")[1].slice(5) + (string.split("coded()").length > 2 ? "coded()" + string.split("coded()").slice(2).join("coded()") : "")
    }

    while (string.includes("codedS()")) {

      var string0 = string.split("codedS()")[0]
      var key = global.codes["codedS()" + string.split("codedS()")[1].slice(0, 5)]
      key = colorize({ id, string: `'` + key + `'`, index: index + 1 })
      string = string0 + key + string.split("codedS()")[1].slice(5) + (string.split("codedS()").length > 2 ? "codedS()" + string.split("codedS()").slice(2).join("codedS()") : "")
    }

    // equal
    // string = string.split("=").join(`<span style="color:#444">=</span>`)
    
    if (index !== 0) {
      /*
      var views = _window ? _window.view : window.views
      var _id = generate()
      views[_id] = { id: _id, parent: id, colorize: true, editable: true, type: "Span" }
      */
      return `<span contenteditable style="color:${colors[index]}; background-color=#00000000">${string}</span>`
    } else {
      
      // semicolon
      //string = string.split(";").join(`<span contenteditable style="color:#000">;</span>`)

      // actions
      /*var _actions = string.split("()")
      string = _actions.map((str, index) => {
        var lastIndex = str.length - 1
        if (str[lastIndex] !== ":" && index !== _actions.length - 1) {
          var i = lastIndex--
          while (str[i] && str[i] !== ";" && str[i] !== "[" && str[i] !== "(" && str[i] !== "=" && str[i] !== "." && str[i] !== ":") {
            i--
          }
          str = str.slice(0, i + 1) + `<span contenteditable style="color:#e68a00">${str.slice(i + 1)}()</span>`
          return str
        } else return (index !== _actions.length - 1) ? str + "()" : str
      }).join("")*/

      return string
    }
}

module.exports = { colorize }

},{"./generate":64,"./toCode":109}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
const { toArray } = require("./toArray")

const controls = ({ _window, controls, id, req, res }) => {

  const { addEventListener } = require("./event")
  const { watch } = require("./watch")

  var local = _window ? _window.views[id] : window.views[id]

  // controls coming from toControls action
  controls = controls || local.controls
  
  controls && toArray(controls).map(controls => {
    // watch
    if (controls.watch) watch({ _window, controls, id, req, res })
    // event
    else if (controls.event) addEventListener({ _window, controls, id, req, res })
  })
}

const setControls = ({ id, params }) => {

  var local = window.views[id]
  if (!local) return

  local.controls = toArray(local.controls)
  local.controls.push(...toArray(params.controls))
}

module.exports = { controls, setControls }

},{"./event":56,"./toArray":105,"./watch":130}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
module.exports = {
  counter: ({ length = 0, counter = 0, end, reset = "daily", timer }) => {

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
},{}],45:[function(require,module,exports){
const control = require("../control/control")

const createActions = ({ params, id }) => {

  const {execute} = require("./execute")

  if (!params.type) return
  var actions = control[params.type]({ params, id })

  execute({ actions, id })
}

module.exports = {createActions}

},{"../control/control":14,"./execute":57}],46:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")

const component = require("../component/component")
const { toCode } = require("./toCode")

module.exports = {
  createComponent: ({ _window, id, req, res }) => {
    
    var views = _window ? _window.views : window.views
    var view = views[id], parent = view.parent
    
    if (!component[view.type]) return
    views[id] = view = component[view.type](view)

    // my views
    if (!view["my-views"]) view["my-views"] = [...views[view.parent]["my-views"]]

    // destructure type, params, & conditions from type
    view.type = toCode({ _window, id, string: view.type })

    // 'string'
    if (view.type.split("'").length > 2) view.type = toCode({ _window, string: view.type, start: "'", end: "'" })
    
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]

    // type
    view.type = type
    view.parent = parent

    // approval
    var approved = toApproval({ _window, string: conditions, id, req, res })
    if (!approved) return

    // push destructured params from type to view
    if (params) {
      
    params = toParam({ _window, string: params, id, req, res, mount: true/*, createElement: true*/ })

      if (params.id) {
        
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
    }
  }
}

},{"../component/component":8,"./clone":38,"./generate":64,"./toApproval":104,"./toCode":109,"./toParam":118}],47:[function(require,module,exports){
const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")
const { toArray } = require("./toArray")
const { toHtml } = require("./toHtml")
const { override } = require("./merge")

const myViews = [ 
  "View", "Box", "Text", "Icon", "Image", "Input", "Video", "Entry", "Map",
  "Swiper", "Switch", "Checkbox", "Swiper", "List", "Item"
]

const createElement = ({ _window, id, req, res, import: _import, params: inheritedParams }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  
  var view = views[id]
  var parent = views[view.parent] || {}

  // view is empty
  if (!view.type) return ""
  if (!view["my-views"] && !_import) view["my-views"] = [...views[parent]["my-views"]]

  // code []
  view.type = toCode({ _window, string: view.type })
  
  // code ''
  if (view.type.split("'").length > 2) view.type = toCode({ _window, string: view.type, start: "'", end: "'" })
  
  // 
  var type = view.type.split("?")[0]
  var params = view.type.split("?")[1]
  var conditions = view.type.split("?")[2]

  // [type]
  if (!view.duplicatedElement && type.includes("coded()")) view.mapType = true
  type = view.type = toValue({ _window, value: type, id, req, res })

  // id
  var priorityId = false, _id = view.type.split(":")[1]

  if (_id) {

    view.id = _id
    if (!view["creation-date"] && global.data.view[_id]) {
      
      view["my-views"].push(_id)
      views[_id] = { ...view, ...clone(global.data.view[_id]) }
      delete views[id]
      return createElement({ _window, id: _id, req, res })
    }

    priorityId = true
    view.type = view.type.split(":")[0]
  }

  view.id = view.id || generate()
  id = view.id

  // style
  if (!_import) {

    view.style = view.style || {}

    // class
    view.class = view.class || ""
    
    // Data
    view.Data = view.Data || view.doc || parent.Data

    // derivations
    view.derivations = view.derivations || [...(parent.derivations || [])]

    // controls
    view.controls = view.controls || []

    // status
    view.status = "Loading"

    // first mount of view
    views[id] = view

    // approval
    var approved = toApproval({ _window, string: conditions, id, req, res })
    if (!approved) {
      delete views[id]
      return ""
    }
  }

  /////////////////// approval & params /////////////////////

  // push destructured params from type to view
  if (params) {
    
    params = toParam({ _window, string: params, id, req, res, mount: true, createElement: true })

    // break
    if (params["break()"]) delete params["break()"]
    if (params["return()"]) return delete params["return()"]

    if (params.id && params.id !== id/* && !priorityId*/) {

      if (views[params.id] && typeof views[params.id] === "object") {
        
        views[params.id]["id-repetition-counter"] = (views[params.id]["id-repetition-counter"] || 0) + 1
        params.id = params.id + `-${views[params.id]["id-repetition-counter"]}`
      }
      
      delete Object.assign(views, { [params.id]: views[id] })[id]
      id = params.id

    }// else if (priorityId) view.id = id // we have View:id & an id parameter. the priority is for View:id

    // inherited params
    if (inheritedParams) override(view, inheritedParams)

    // pass to children
    if (parent.passToChildren) override(view, parent.passToChildren)

    // view
    if (!_import && (params.view || (!myViews.includes(view.type) && global.data.view[view.type]))) {

      var viewId = params.view || view.type
      delete view.view
      delete params.view
      view["my-views"].push(viewId)
      views[id] = { ...view, ...clone(global.data.view[viewId]) }
      return createElement({ _window, id, req, res, params })
    }

  } else if (!_import && (!myViews.includes(view.type) && global.data.view[view.type])) {
    
    view["my-views"].push(view.type)
    views[id] = { ...view, ...clone(global.data.view[view.type]) }
    return createElement({ _window, id, req, res })
  }

  if (_import) return toHtml({ _window, id, req, res, import: _import })

  // for droplist
  if (parent.unDeriveData || view.unDeriveData) {

    view.data = view.data || ""
    view.unDeriveData = true

  } else view.data = reducer({ _window, id, path: view.derivations, value: view.data, key: true, object: global[view.Data], req, res })
  
  if (view.parent === "root") views.root.child = view.id
  return createTags({ _window, id, req, res })
}

module.exports = { createElement }

},{"./clone":38,"./createTags":48,"./generate":64,"./merge":79,"./reducer":86,"./toApproval":104,"./toArray":105,"./toCode":109,"./toHtml":114,"./toParam":118,"./toValue":124}],48:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { toHtml } = require("./toHtml")
const { toArray } = require("./toArray")

const createTags = ({ _window, id, req, res }) => {

  const { createElement } = require("./createElement")
  var views = _window ? _window.views : window.views, view = views[id]
  if (!view) return

  // null data
  if (view.data === null) view.data = 0

  if (view.mapType) {
    
    // data mapType
    var data = Array.isArray(view.data) ? view.data : (typeof view.data === "object" ? Object.keys(view.data) : [])
    var isObject = (typeof view.data === "object" && !Array.isArray(view.data)) ? true : false
    var type = views[view.parent].children[view.index].type.replace("[", "").replace("]", "")
    if (type.includes("?data=")) type = type.split("?data=")[0] + "?" + type.split("?data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";data=")) type = type.split(";data=")[0] + ";" + type.split(";data=").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes("?Data=")) type = type.split("?Data=")[0] + "?" + type.split("?Data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";Data=")) type = type.split(";Data=")[0] + ";" + type.split(";Data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";Data;")) type = type.split(";Data;")[0] + ";" + type.split(";Data;").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?Data;")) type = type.split("?Data;")[0] + ";" + type.split("?Data;").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes(";Data")) type = type.split(";Data")[0]
    /*if (type.includes("?doc=")) type = type.split("?doc=")[0] + "?" + type.split("?doc=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";doc=")) type = type.split(";doc=")[0] + ";" + type.split(";doc=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";doc;")) type = type.split(";doc;")[0] + ";" + type.split(";doc;").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?doc;")) type = type.split("?doc;")[0] + ";" + type.split("?doc;").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes(";doc")) type = type.split(";doc")[0]
    if (type.includes("child:")) type = type.split("child:")[0] + "" + type.split("child:").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes("children:")) type = type.split("children:")[0] + "" + type.split("children:").slice(1).join("").split(";").slice(1).join(";") 
    */
    if (type.includes("?id=")) type = type.split("?id=")[0] + "?" + type.split("?id=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";id=")) type = type.split(";id=")[0] + ";" + type.split(";id=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?path=")) type = type.split("?path=")[0] + "?" + type.split("?path=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";path=")) type = type.split(";path=")[0] + ";" + type.split(";path=").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes(";arrange=")) type = type.split(";arrange=")[0] + ";" + type.split(";arrange=").slice(1).join("").split(";").slice(1).join(";")
    if (type.split("?")[2]) type = type.split("?").slice(0, 2).join("?")
    view.length = data.length || 1

    // arrange
    if (view.arrange || view.sort) data = arrange({ data, arrange: view.arrange, id, _window })

    delete views[id]
    delete view.mapType
    
    if (data.length > 0) {
      return data.map((_data, index) => {
        
        var id = generate()
        var mapIndex = index
        var lastEl = isObject ? _data : index
        var derivations = clone(view.derivations)
        var data = clone(isObject ? view.data[_data] : _data)
        derivations.push(lastEl)
        
        var _view = clone({ ...view, id, type, data, mapIndex, derivations, children: clone(views[view.parent].children[view.index].children || []) })
        
        views[id] = _view
        return createElement({ _window, id, req, res })

      }).join("")

    } else {
        
      var id = generate()
      var mapIndex = 0
      var lastEl = isObject ? "" : 0
      var derivations = clone(view.derivations)
      var data = clone(view.data ? view.data[lastEl] : view.data)
      derivations.push(lastEl)

      var _view = clone({ ...view, id, type, data, mapIndex, derivations, children: clone(views[view.parent].children[view.index].children || []) })
      
      views[id] = _view
      return createElement({ _window, id, req, res })
    }
  }

  return createTag({ _window, id, req, res })
}

const createTag = ({ _window, id, req, res }) => {

  const {execute} = require("./execute")

  var view = _window ? _window.views[id] : window.views[id]
  
  // components
  componentModifier({ _window, id })
  createComponent({ _window, id, req, res })

  if (view.actions) execute({ _window, actions: view.actions, id, req, res })
  return toHtml({ _window, id, req, res })
}

const componentModifier = ({ _window, id }) => {

  var view = _window ? _window.views[id] : window.views[id]

  // icon
  if (view.type === "Icon") {

    view.icon = view.icon || {}
    view.icon.name = view.name || view.icon.name || ""
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
      
      view.symbol = {}
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

},{"./clone":38,"./createComponent":46,"./createElement":47,"./execute":57,"./generate":64,"./toArray":105,"./toHtml":114}],49:[function(require,module,exports){
const {update} = require("./update")
const {toArray} = require("./toArray")
const {clone} = require("./clone")
const { generate } = require("./generate")

const createView = ({ view, id = generate() }) => {

  var view = window.views[id] || {}
  var global = window.global
  
  view.children = toArray(clone(global.data.view[view]))

  // update
  update({ id })
}

module.exports = {createView}
},{"./clone":38,"./generate":64,"./toArray":105,"./update":126}],50:[function(require,module,exports){
const { toParam } = require("./toParam");

module.exports = {
    csvToJson: ({ id, e, options }) => {
        
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
            window.views[id].file = { data: result, message: "Data converted successfully!" }
            toParam({ id, e, string: options.loaded, mount: true })
        };

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(e.target.files[0]);
    }
}
},{"./toParam":118}],51:[function(require,module,exports){
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

const clearData = ({ id, e, clear = {} }) => {

  var view = window.views[id]

  if (!global[view.Data]) return
  
  var path = clear.path
  path = path ? path.split(".") : clone(view.derivations)
  path.push('delete()')
  
  reducer({ id, e, path, object: global[view.Data] })

  setContent({ id })
  console.log("data removed", global[view.Data])
}

module.exports = { createData, setData, clearData }

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./clone":38,"./reducer":86,"./setContent":95,"./setData":96}],52:[function(require,module,exports){
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

  return string
}

module.exports = {decode}

},{}],53:[function(require,module,exports){
const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")
const { colorize } = require("./colorize")
const { toCode } = require("./toCode")

const defaultInputHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global

  if (!view) return
  if (view.type !== "Input" && view.type !== "Entry" && !view.editable) return

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
        if (view.input.type === "file") return global.files = [...e.target.files]

        // contentfull
        if (view.input.type === "text") {
          
          if (value.includes("&amp;")) {
            value = value.replace('&amp;','&')
            e.target.value = value
          }
        }

        if (e.data === ")" && value.slice(e.target.selectionStart - 3, e.target.selectionStart - 1) === "()") {

          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        }
      }

      if (view.Data && (view.input ? !view.input.preventDefault : view.editable ? !view.preventDefault : true)) setData({ id, data: { value } })

    }
    // resize
    resize({ id })

    // arabic values
    isArabic({ id, value })
    
    console.log(value, global[view.Data], view.derivations)

    view.prevValue = value
  }

  var myFn1 = (e) => {

    var value
    if (view.type === "Input") value = view.element.value
    else if (view.type === "Entry" || view.editable) value = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent
    
    // colorize
    if (view.colorize) {
      
      // removeChildren({ id })
      var _value = toCode({ string: value })
      _value = toCode({ string: _value, start: "'", end: "'"  })
      if (view.type === "Input") e.target.value = colorize({ string: _value })
      else e.target.innerHTML = colorize({ string: _value })
      /*
      var sel = window.getSelection()
      var selected_node = sel.anchorNode
      
      var prevValue = view.prevValue.split("")
      var position = value.split("").findIndex((char, i) => char !== prevValue[i])

      sel.collapse(selected_node, position + 1)
      */
    }
  }

  view.element.addEventListener("input", myFn)
  view.element.addEventListener("blur", myFn1)
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
},{"./colorize":39,"./data":51,"./isArabic":71,"./resize":90,"./toCode":109}],54:[function(require,module,exports){
const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")
const { reducer } = require("./reducer")

const droplist = ({ id, e, droplist: params = {} }) => {
  
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
  if (typeof items === "string") items = clone(toValue({ id, e, value: items }))

  // filterable
  if (!view.droplist.preventDefault) {

    if (view.droplist.searchable.filter && global["droplist-search-txt"] !== undefined && global["droplist-search-txt"] !== "") {

      items = items.filter(item => view.droplist.searchable.any 
        ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
        : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
      )

      global["keyup-index"] = 0
    }
  }

  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Text?class=flex align-center pointer;style:[minHeight=3.5rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.4rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item&&view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item&&view.droplist.item.hover&&view.droplist.item.hover.style.backgroundColor)||"#eee"}];${toString(view.droplist.item)};caller=${id};text=${item}`,
        controls: [...(view.droplist.controls || []), {
          event: `click?if():[():${id}.clicked]:[():${id}.clicked.style.keys()._():[():${id}.style()._=():${id}.clicked.style._]]?!():${id}.droplist.preventDefault`,//;)(:droplist-positioner=${id}
          actions: [ // :[focus:${input_id}]
            `wait():[resize:${input_id}]:[isArabic:${input_id}]?if():${input_id?true:false}:[():${input_id}.data()=txt().replace():'&amp;':'&';if():[():${input_id}.data().type()=boolean]:[():${input_id}.data()=():${input_id}.data().boolean()];():${input_id}.txt()=txt().replace():'&amp;':'&']:[():${id}.data()=txt().replace():'&amp;':'&';():${id}.txt()=txt().replace():'&amp;':'&']?!():${id}.droplist.isMap`,
            `?if():[txt()=array||txt()=map]:[)(:opened-maps.push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;3rdParent():${id}.data().type()=map]:[_list:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;3rdParent():${id}.data().type()=map]:[_list:[_map:type:_string]].elif():[txt()=children]:[_map:type:_string].elif():[txt()=string]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=array]:_list.elif():[txt()=map]:[_map:_string:_string];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];droplist-positioner:().del();my-parent:()=2ndParent():${id};update():[2ndParent():${id}];().quit=false;my-parent:().inputs().():[if():[!().quit;!txt()||txt()=0]:[focus();().quit=true]]?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
            `droplist:${id}?droplist-search-txt:()=():${id}.input().txt();():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable;!():${id}.droplist.preventDefault`
          ]
        }]
      }
    })
    
  } else dropList.children = []
  
  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true
  update({ id: "droplist" })

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
              
              reducer({ id, path: dropList.derivations, value: items[_index], object: global[dropList.Data], key: true })
              
            } else if (view.contenteditable === false || views[input_id].contenteditable === false) {
              
              if (input_id) {

                views[input_id].element.value = items[_index].slice(0, -1)
                views[input_id].contenteditable = true

              } else {

                view.element.innerHTML = items[_index].slice(0, -1)
                view.contenteditable = true
              }

              reducer({ id, path: dropList.derivations, value: items[_index], object: global[dropList.Data], key: true })
            }
            
          }

          global["keyup-index"] = _index
        }
      }
    }

    global["keyup-index"] = global["keyup-index"] || 0
    views.droplist.element.children[global["keyup-index"]].dispatchEvent(new Event("mouseenter"))
    // if (input_id) views[input_id].element.focus()
  }

  if (!view.droplist.preventDefault) global.droplistTimer = setTimeout(myFn, 100)
}

module.exports = { droplist }
},{"./clone":38,"./reducer":86,"./toString":122,"./toValue":124,"./update":126}],55:[function(require,module,exports){
const axios = require("axios");
const { clone } = require("./clone");
const { toArray } = require("./toArray");
const { toString } = require("./toString")

const erase = async ({ _window, req, res, id, e, _, __, ___, ...params }) => {

  var global = window.global
  var erase = params.erase || {}
  var view = window.views[id]
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId
  var store = erase.store || "database"
  
  erase.docs = toArray(erase.doc || erase.docs || erase.id || (erase.data && clone(toArray(erase.data.map(data => data.id)))))
  // if (erase.docs.length === 0) return
  // delete erase.data

  // erase
  headers.erase = encodeURI(toString({ erase }))
  headers.timestamp = (new Date()).getTime()

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  var { data } = await axios.delete(`/${store}`, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  view.erase = global.erase = clone(data)
  if (!_window) console.log(data)

  if (params.asyncer) require("./toAwait").toAwait({ _window, req , res, id, e, _: data, __: _, ___: __, params })
}

module.exports = { erase }
},{"./clone":38,"./toArray":105,"./toAwait":106,"./toString":122,"axios":131}],56:[function(require,module,exports){
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

const addEventListener = ({ _window, controls, id, req, res }) => {
  
  const { execute } = require("./execute")

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id]
  var mainID = id

  // 'string'
  var events = toArray(controls.event), _events = ""
    
  _events = events[0].split("{")[0]
  events[0].split("{").slice(1).map(str => {
    var num = str.split("}")[0]

    if (!isNaN(num) && num !== "" && parseInt(num)) {
      _events += `[${events[parseInt(num)]}]${str.split("}")[1]}`
    }
  })

  events = _events
  events = toCode({ _window, id, string: events })
  // if (events.split("'").length > 2) events = toCode({ _window, string: events, start: "'", end: "'" })
  
  events = events.split("?")
  var _idList = toValue({ id, value: events[3] || id })

  // droplist
  /*var droplist = (events[1] || "").split(";").find(param => param === "droplist()")
  if (droplist && view.droplist) {
    
    view.droplist.controls = view.droplist.controls || []
    return view.droplist.controls.push({
      event: events.join("?").replace("droplist()", ""),
      actions: controls.actions
    })
  }*/

  // actionlist
  /*var actionlist = (events[1] || "").split(";").find(param => param === "actionlist()")
  if (actionlist && view.actionlist) {
    
    view.actionlist.controls = view.actionlist.controls || []
    return view.actionlist.controls.push({
      event: events.join("?").replace("actionlist()", ""),
      actions: controls.actions
    })
  }*/

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
    if (viewEventIdList) mainID = toValue({ _window, req, res, id, value: viewEventIdList }) || viewEventIdList
    
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
    if (eventid) idList = toValue({ _window, req, res, id, value: eventid })
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

          if (view[event] && typeof view[event] === "object" && view[event].disable) return
          // approval
          if (viewEventConditions) {
            var approved = toApproval({ _window, req, res, string: viewEventConditions, e, id: mainID })
            if (!approved) return
          }
          
          // approval
          var approved = toApproval({ _window, req, res, string: events[2], e, id: mainID })
          if (!approved) return

          // once
          if (once) e.target.removeEventListener(event, myFn)
          
          // params
          await toParam({ _window, req, res, string: events[1], e, id: mainID, mount: true })

          // break
          if (view.break) return delete view.break
          
          // approval
          if (viewEventParams) await toParam({ _window, req, res, string: viewEventParams, e, id: mainID, mount: true })
          
          // execute
          if (controls.actions || controls.action) await execute({ _window, req, res, controls, e, id: mainID })
        }, timer)
      }
      
      // onload event
      if (event === "loaded"/* || event === "loading" || event === "beforeLoading"*/) return myFn({ target: _view.element })
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

          if (eventid === "droplist" && !global["droplist-positioner"]) return
          if (eventid === "droplist" && !views[global["droplist-positioner"]].element.contains(views[id].element)) return
          
          if (eventid === "popup" && (!global["popup-positioner"] || !global["popup-confirmed"])) return
          if (eventid === "popup" && !views[global["popup-positioner"]].element.contains(views[id].element)) return
          
          if (eventid === "actionlist" && !views[global["actionlistCaller"]].element.contains(views[id].element)) return

          if (once) e.target.removeEventListener(event, myFn)
        
          // content not editable
          // if (event === "input" && !views[id].contenteditable) return

          var _myFn = async () => {
            
            // approval
            if (viewEventConditions) {
              var approved = toApproval({ _window, req, res, string: viewEventConditions, e, id: mainID })
              if (!approved) return
            }
            
            // approval
            var approved = toApproval({ string: events[2], e, id: mainID })
            if (!approved) return

            // params
            await toParam({ string: events[1], e, id: mainID, mount: true })

            // break
            if (view["break()"]) delete view["break()"]
            if (view["return()"]) return delete view["return()"]
          
            // approval
            if (viewEventParams) await toParam({ _window, req, res, string: viewEventParams, e, id: mainID, mount: true })
            
            if (controls.actions || controls.action) await execute({ controls, e, id: mainID })
          }

          if (eventid === "droplist" || eventid === "actionlist" || eventid === "popup") setTimeout(_myFn, 100)
          else _myFn()
          
        }, timer)
      }
      
      // elements
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

  if (view.link && typeof view.link === "object" && view.link.preventDefault) view.element.addEventListener("click", (e) => { if (!view.link.link) e.preventDefault() })

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
  
  var setEventType = (e) => { views[e.target.id].mouseentered = true }
  view.element.addEventListener("mouseenter", setEventType)

  var setEventType = (e) => { views[e.target.id].mouseentered = false }
  view.element.addEventListener("mouseleave", setEventType)

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

},{"./clone":38,"./execute":57,"./generate":64,"./toApproval":104,"./toArray":105,"./toCode":109,"./toParam":118,"./toValue":124}],57:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const _method = require("./function")
const { toCode } = require("./toCode")
const { toAwait } = require("./toAwait")
const { toValue } = require("./toValue")
const { isParam } = require("./isParam")

const execute = ({ _window, controls, actions, e, id, params }) => {

  var views = _window ? _window.views : window.views
  var view = views[id] || {}
  var global = window.global
  var _params = params, viewId = id

  if (controls) actions = controls.actions || controls.action

  // execute actions
  toArray(actions).map(_action => {
    _action = toCode({ _window, string: _action, e })

    // 'string'
    if (_action.split("'").length > 2) _action = toCode({ _window, string: _action, start: "'", end: "'" })

    var awaiter = ""
    var approved = true
    var actions = _action.split("?")
    var params = actions[1]
    var conditions = actions[2]
    
    actions = actions[0].split(";")

    // approval
    if (conditions) approved = toApproval({ _window, string: conditions, params, id: viewId, e })
    if (!approved) return toAwait({ id, e, params: _params })

    // params
    params = toParam({ _window, string: params, e, id: viewId, executer: true, mount: true })
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
      if (action.slice(0, 7) === "coded()") return execute({ _window, actions: global.codes[action], e, id, params })
      
      var name, caseCondition, timer = "", isInterval = false, actionid, args = action.split(':'), name = args[0], __params = {}

      if (isParam({ _window, string: args[1] }) || (args[2] && isNaN(args[2].split("i")[0]) && !args[3])) { // action:[params]:[conditions]

        __params = toParam({ _window, id: viewId, e, string: args[1], mount: true })

        // break
        if (view["break()"]) delete view["break()"]
        if (view["return()"]) return delete view["return()"]

        actionid = toArray(__params.id || viewId) // id
        if (__params.timer !== undefined) timer = __params.timer.toString() // timer
        if (args[2]) caseCondition = args[2]

      } else { // action:id:timer:condition

        actionid = toArray(args[1] ? toValue({ _window, value: args[1], params, id: viewId, e }) : viewId) // timer
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
        if (caseCondition) approved = toApproval({ _window, string: caseCondition, params, id: viewId, e })
        if (!approved) return toAwait({ id, e, params })
        
        if (_method[name]) actionid.map(async id => {
          
          if (typeof id !== "string") return

          // id = value.path
          if (id.indexOf(".") > -1) id = toValue({ _window, value: id, e, id: viewId })
          
          // component does not exist
          if (!id || !views[id]) return

          if (isAsyncer) {
            params.awaiter = awaiter
            params.asyncer = isAsyncer
          }
          
          await _method[name]({ _window, ...params, ...__params, e, id })
          if (name !== "search" && name !== "save" && name !== "erase" && name !== "importJson" && name !== "upload" && name !== "wait") toAwait({ id, e, params })
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

},{"./function":63,"./isParam":74,"./toApproval":104,"./toArray":105,"./toAwait":106,"./toCode":109,"./toParam":118,"./toValue":124}],58:[function(require,module,exports){
module.exports = {
    exportJson: ({ data, filename }) => {
        
        var dataStr = JSON.stringify(data, null, 2)
        var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

        var exportFileDefaultName = `${filename || `exported-data-${(new Date()).getTime()}`}.json`

        var linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
        // linkElement.delete()
    }
}
},{}],59:[function(require,module,exports){
const { toValue } = require("./function")

module.exports = {
    fileReader : ({ read: { file, reduce }, id }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, value: reduce, e })
        reader.readAsDataURL(file)
    }
}
},{"./function":63}],60:[function(require,module,exports){
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
},{"./clone":38,"./compare":40,"./isEqual":73,"./toArray":105,"./toOperator":117}],61:[function(require,module,exports){
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
      }
    }
  }

  // focus to the end of input
  var value = view.element.value
  view.element.value = ""
  view.element.value = value
}

module.exports = {focus}

},{}],62:[function(require,module,exports){
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { getCookie } = require("./cookie")

const func = async ({ _window, id = "root", req, _, __, ___, res, e, ...params }) => {
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id]
  var func = params.func || {}
  var headers = clone(func.headers || {})
  headers.project = headers.project || global.projectId
  delete func.headers
  if (!_window && getCookie()) func.cookies = getCookie()
  
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (_window) {

    var functions = global.data.project.functions
    if (!functions[func.function]) return
    //if (functions[func.function].includes("send()"))
    //  functions[func.function] = functions[func.function].replace("send():", "func:()=")
    
    var _func = toCode({ _window, string: functions[func.function] })
    _func = toCode({ _window, string: _func, start: "'", end: "'" })
    toParam({ _window, id, string: _func, req, res, _: func.data, __ })
    
    await Promise.all(global.promises)
  
    // await params
    if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res,  _: global.func, __: _, ___: __ }) 

  } else {
    
    var myFn = () => {
      return new Promise (async resolve => {

        var { data } = await require("axios").post(`/action`, func, {
          headers: {
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
            ...headers
          }
        })

        if (view) view.function = view.func = clone(data)
        global.function = global.func = clone(data)
  
        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res,  _: global.func, __: _, ___: __ }) 

        resolve()
      })
    }

    global.promises = global.promises || []
    global.promises.push(myFn())
        
    await Promise.all(global.promises)
  }
  
  console.log(params.func, global.func)

  /*if (data.params) {
    data.params = toCode({ _window, string: data.params, e })
    params = { ...toParam({ _window, id, e, string: data.params, asyncer: true, _: data, __: _, ___: __, req, res }), params }
  }*/
}

module.exports = { func }
},{"./clone":38,"./cookie":43,"./toAwait":106,"./toCode":109,"./toParam":118,"axios":131}],63:[function(require,module,exports){
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
const {toString} = require("./toString")
const {update, removeChildren} = require("./update")
const {toControls} = require("./toControls")
const {toArray} = require("./toArray")
const {generate} = require("./generate")
const {refresh} = require("./refresh")
const {axios} = require("./axios")
const {wait} = require("./wait")
const {createElement} = require("./createElement")
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
const {toHtml} = require("./toHtml")
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
const {upload} = require("./upload")
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
const {resize, dimensions, converter} = require("./resize")
const {createData, clearData} = require("./data")

module.exports = {
  switchMode,
  refresh,
  nothing,
  getDaysInMonth,
  importJson,
  converter,
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
  toString,
  update,
  execute,
  removeChildren,
  toArray,
  generate,
  createElement,
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
  toHtml,
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
},{"./axios":34,"./blur":35,"./capitalize":36,"./clearValues":37,"./clone":38,"./compare":40,"./contentful":41,"./controls":42,"./cookie":43,"./createActions":45,"./createComponent":46,"./createElement":47,"./createView":49,"./data":51,"./decode":52,"./defaultInputHandler":53,"./droplist":54,"./erase":55,"./event":56,"./execute":57,"./exportJson":58,"./fileReader":59,"./filter":60,"./focus":61,"./generate":64,"./getDateTime":65,"./getDaysInMonth":66,"./getParam":67,"./importJson":69,"./insert":70,"./isArabic":71,"./isEqual":73,"./isPath":75,"./jsonFiles":76,"./keys":77,"./log":78,"./merge":79,"./note":80,"./overflow":81,"./popup":82,"./position":83,"./preventDefault":84,"./reducer":86,"./refresh":87,"./reload":88,"./remove":89,"./resize":90,"./route":91,"./save":92,"./search":94,"./setContent":95,"./setData":96,"./setElement":97,"./setPosition":98,"./sort":99,"./starter":100,"./state":101,"./style":102,"./switchMode":103,"./toApproval":104,"./toArray":105,"./toAwait":106,"./toCSV":107,"./toCode":109,"./toComponent":110,"./toControls":111,"./toHtml":114,"./toId":115,"./toNumber":116,"./toOperator":117,"./toParam":118,"./toString":122,"./toStyle":123,"./toValue":124,"./toggleView":125,"./update":126,"./upload":128,"./wait":129}],64:[function(require,module,exports){
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const numbers = "1234567890"

const generate = (params = {}) => {

  var { length, number } = params
  var result = "", chars = number ? numbers : characters
  if (!length) length = 5

  var charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result
}

module.exports = {generate}

},{}],65:[function(require,module,exports){
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
},{}],66:[function(require,module,exports){
module.exports = {
    getDaysInMonth: (stampTime) => {
        return new Date(stampTime.getFullYear(), stampTime.getMonth() + 1, 0).getDate()
    }
}
},{}],67:[function(require,module,exports){
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

},{"./toParam":118}],68:[function(require,module,exports){
module.exports = {
  getType: (value) => {
    if (typeof value === "boolean" || value === "true" || value === "false") return "boolean"
    if (typeof value === "object" && Array.isArray(value)) return "array"
    if (typeof value === "string") return "string"
    if (typeof value === "object") return "map"
    if (typeof value === "function") return "function"
    if (typeof value === "number" || (!isNaN(value) && value !== "")) {
        
      if (value.length >= 10 && value.length <=13 && !isNaN(value) && value.slice(0, 2) !== "0") return "timestamp"
      if (value.length === 8 && value.slice(0, 2) !== "00" && !isNaN(value)) return "time"
      
      if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").slice(0, 2) !== "0") return "timestamp"
      if ((value + "").length === 8 && (value + "").slice(0, 2) !== "00") return "time"
      return "number"
    }
  }
}
},{}],69:[function(require,module,exports){
(function (global){(function (){
const { toAwait } = require("./toAwait")

const getJson = (url) => {

    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", url, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

const importJson = ({ id, e, ...params }) => {
    
    global.import = {}
    var inputEl = document.createElement('input')
    inputEl.style.position = "absolute"
    inputEl.style.top = "-1000px"
    inputEl.style.left = "-1000px"
    inputEl.type = "file"
    inputEl.accept = "application/JSON"
    document.body.appendChild(inputEl)
    setTimeout(() => {

        inputEl.addEventListener("change", (e) => {
            
            var reader = new FileReader()
            reader.onload = (e) => {
                
                global.import.data = JSON.parse(e.target.result)
                toAwait({ id, e, params })
            }
            reader.readAsText(e.target.files[0])
        })

        inputEl.click()
    }, 200)
}

module.exports = {importJson, getJson}
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./toAwait":106}],70:[function(require,module,exports){
const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")

module.exports = {
  insert: ({ id, ...params }) => {
    
    var insert = params.insert, { index, value = {}, el, elementId, component, view, replace, path, data } = insert
    if (view) component = view
    var views = window.views, global = window.global, appendTo = (insert.id || insert.parent)
    if (appendTo && typeof appendTo === "object") appendTo = appendTo.id
    else if (!appendTo) appendTo = id
    var view = views[appendTo], lDiv
    
    if (index === undefined) index = view.element.children.length
    
    if (component || replace) {

      var _view = clone(component || replace)
      
      // remove mapping
      if (_view.type.slice(0, 1) === "[") {
        var _type = _view.type.slice(1).split("]")[0]
        _view.type = _type + _view.type.split("]").slice(1).join("]")
      }
      
      if (data) _view.data = clone(data)
      if (path) _view.derivations = (Array.isArray(path) ? path : typeof path === "number" ? [path] : path.split(".")) || []
      
      var innerHTML = toArray(_view)
      .map((child, i) => {

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
        
        return createElement({ id })

      }).join("")
      
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
    idList.map(id => setElement({ id }))
    idList.map(id => starter({ id }))
    
    views[el.id].style.transition = views[el.id].element.style.transition = (views[el.id].reservedStyles && views[el.id].reservedStyles.transition) || null
    views[el.id].style.opacity = views[el.id].element.style.opacity = (views[el.id].reservedStyles && views[el.id].reservedStyles.opacity) || "1"
    delete views[el.id].reservedStyles

    view.insert = global.insert = { view: views[el.id], message: "View inserted succefully!", success: true }
    
    if (lDiv) {

      document.body.removeChild(lDiv)
      lDiv = null
    }

    // await params
    if (params.asyncer) require("./toAwait").toAwait({ id, params })
  }
}
},{"./clone":38,"./createElement":47,"./generate":64,"./setElement":97,"./starter":100,"./toArray":105,"./toAwait":106}],71:[function(require,module,exports){
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
    view.element.style.textAlign = "right"
    if (view.type !== "Input") view.element.innerHTML = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    else view.element.value = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    if (view["placeholder-ar"]) view.element.placeholder = view["placeholder-ar"]

  } else {

    if (view.element.className.includes("arabic")) view.element.style.textAlign = "left"
    view.element.classList.remove("arabic")
    if (view["placeholder"]) view.element.placeholder = view["placeholder"]

  }

  return isarabic && !isenglish
}

module.exports = { isArabic }

},{}],72:[function(require,module,exports){
module.exports = {
    isCondition: ({ _window, string }) => {
        
        if (typeof string !== "string") return false
        var global = _window ? _window.global : window.global
        if (string.slice(0, 7) === "coded()") string = global.codes[string]
// 
        if (string) if (string.slice(0, 1) === "!" || string.includes(">") || string.includes("<") || string.includes("in()") || string.includes("inc()") || string.includes("includes()")) return true
        return false
    }
}
},{}],73:[function(require,module,exports){
const isEqual = function(value, other) {
  // if (value === undefined || other === undefined) return false

  if ((value && !other) || (other && !value)) return false

  // string || boolean || number
  if (typeof value !== "object" && typeof other !== "object") {
    return value == other;
  }

  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

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

  // If nothing failed, return true
  return true;
}

module.exports = {isEqual}

},{}],74:[function(require,module,exports){
module.exports = {
  isParam: ({ _window, string }) => {
      
    if (typeof string !== "string") return false
    var global = _window ? _window.global : window.global
    if (string.slice(0, 7) === "coded()") string = global.codes[string]
// 
    if (string) if (string.includes("=") || string.includes(";") || string.includes("?") || string === "break()" || string === "return()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")
    ) return true
    return false
  }
}
},{}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
const fs = require("fs")
const { toArray } = require("./toArray")
const { toOperator } = require("./toOperator")

var getJsonFiles = ({ search = {} }) => {
  
  var data = {},
  collection = search.collection, 
  doc = search.document || search.doc, 
  docs = search.documents || search.docs, 
  fields = search.fields || search.field, 
  limit = search.limit || 25,
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
},{"./toArray":105,"./toOperator":117,"fs":160}],77:[function(require,module,exports){
module.exports = {
    keys: (object) => {
        return Object.keys(object)
    }
}
},{}],78:[function(require,module,exports){
const log = ({ log }) => {
  console.log( log || 'here')
}

module.exports = {log}

},{}],79:[function(require,module,exports){
const { toArray } = require("./toArray")
const { clone } = require("./clone")

const merge = (objects) => {

  objects = clone(objects)
  if (typeof objects !== "object") return objects

  var merged = toArray(objects[0]).flat()

  objects.shift()

  objects.map((obj) => {
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

},{"./clone":38,"./toArray":105}],80:[function(require,module,exports){
const { isArabic } = require("./isArabic")

const note = ({ note: _note }) => {

  var views = window.views
  var note = views["action-note"]
  var type = (_note.type || "success").toLowerCase()
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

},{"./isArabic":71}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
const popup = ({ id }) => {
  
}

module.exports = {popup}

},{}],83:[function(require,module,exports){
const { converter } = require("./resize")

const getPadding = (el) => {
    
    var padding = el.style.padding.split(" ")
    if (padding.length === 1) {
        return padding = {
            top: converter(padding[0]),
            right: converter(padding[0]),
            bottom: converter(padding[0]),
            left: converter(padding[0])
        }
    } else if (padding.length === 2) {
        return padding = {
            top: converter(padding[0]),
            right: converter(padding[1]),
            bottom: converter(padding[0]),
            left: converter(padding[1])
        }
    } else if (padding.length === 4) {
        return padding = {
            top: converter(padding[0]),
            right: converter(padding[1]),
            bottom: converter(padding[2]),
            left: converter(padding[3])
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
},{"./resize":90}],84:[function(require,module,exports){
const preventDefault = ({e}) => {
  e.preventDefault();
};

module.exports = {preventDefault};

},{}],85:[function(require,module,exports){
const { toParam } = require("./toParam")

module.exports = {
    print: async ({ id, options }) => {

        var mediaQueryList = window.matchMedia('print')

        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                // console.log('before print dialog open');
                if (options["before-print"]) toParam({ string: options["before-print"], id, mount: true })
            } else {
                // console.log('after print dialog closed');
                if (options["after-print"]) toParam({ string: options["after-print"], id, mount: true })
            }
        })
        window.print()
    }
}
},{"./toParam":118}],86:[function(require,module,exports){
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
const { isCondition } = require("./isCondition")
const { toAwait } = require("./toAwait")
const actions = require("./actions.json")

const reducer = ({ _window, id = "root", path, value, key, params, object, index = 0, _, __, ___, _i, e, req, res, mount, condition, createElement }) => {
    
    const { remove } = require("./remove")
    const { toValue, calcSubs } = require("./toValue")
    const { execute } = require("./execute")
    const { toParam } = require("./toParam")
    const { insert } = require("./insert")
    var _functions = require("./function")

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
            if (!answer) answer = toValue({ _window, value, params, _, __, ___, _i,id, e, req, res })
        })
        return answer
    }

    // path[0] = path0:args
    var path0 = path[0] ? path[0].toString().split(":")[0] : "", args
    if (path[0]) args = path[0].toString().split(":")
    
    if (isParam({ _window, string: path.join(".") })) return toParam({ req, res, _window, id, e, string: path.join("."), _, __, ___, _i, object, mount })
    
    // function
    /*if (path0.slice(-2) === "()" && path0.slice(0, 2) !== ")(" && args[1] !== "()" && path0 !== "()" && view && (view[path0.charAt(0) === "_" ? path0.slice(1) : path0] || view[path0]) && path0.slice(0, 4) !== "if()") {
            
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
    }*/

    // multiplication
    if (path.join(".").includes("*") && !key) {

        var values = path.join(".").split("*").map(value => toValue({ _window, value, params, _, __, ___, _i,id, e, req, res, object, mount }))
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
    
    var isFn = false, backendFn = false

    // function
    if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

        view && clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })
      
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
        if (isFn) backendFn = true
      }
    }

    if (isFn) {
      var _params = path[0].split(":")[1], args = path[0].split(":")

      if (backendFn) {
        
        if (isParam({ _window, string: args[1] })) {

          var _await = ""
          var _data = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
          var _func = { function: isFn, data: _data }
          if (args[2]) _await = global.codes[args[2]]
          
          return require("./func").func({ _window, id, e, _, __, ___, _i, req, res, func: _func, asyncer: true, await: _await })
        }
        
        var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
        
        return require("./func").func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
      }

      if (_params) {

        if (isParam({ _window, string: _params }))
          _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: _params })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
      }
      
      return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i, createElement, params })
    }

    // addition
    if (path.join(".").includes("+") && !key) {
  
      var values = path.join(".").split("+").map(value => toValue({ _window, value, params, _, __, ___, _i,id, e, req, res, object }))
      var answer = values[0]
      values.slice(1).map(val => answer += val)
      return answer
    }

    // subtraction
    if (path.join(".").includes("-") && !key) {
  
        var _value = calcSubs({ _window, value: path.join("."), params, _, __, ___, _i,id, e, req, res, object })
        if (_value !== path.join(".")) return _value
    }

    // coded
    if (path0.slice(0, 7) === "coded()" && path.length === 1 && object === undefined) {
        
        coded = true
        return toValue({ req, res, _window, object, id, value: global.codes[path[0]], params, _, __, ___, _i,e })
    }

    // codeds (string)
    if (path0.slice(0, 8) === "codedS()") {
        
        _object = global.codes[path[0]]
        path.shift()
        path0 = ""
    }
    
    // if
    if (path0 === "if()") {
        
      var approved = toApproval({ _window, e, string: args[1], id, _, __, ___, _i, req, res, object })

      if (!approved) {
          
        if (args[3]) {
            if (condition) return toApproval({ _window, e, string: args[3], id, _, __, ___, _i, req, res, object })
            return toValue({ req, res, _window, id, value: args[3], params, _, __, ___, _i, e, object, mount, createElement })
        }

        if (path[1] && path[1].includes("else()")) return toValue({ req, res, _window, id, value: path[1].split(":")[1], params, _, __, ___, _i, e, object, mount })

        if (path[1] && (path[1].includes("elseif()") || path[1].includes("elif()"))) {

            var _path = path.slice(2)
            _path.unshift(`if():${path[1].split(":").slice(1).join(":")}`)
            return reducer({ _window, id, value, key, path: _path, params, object, params, _, __, ___, _i, e, req, res, mount })

        } else return 

      } else {
        
        if (condition) return toApproval({ _window, e, string: args[2], id, _, __, ___, _i, req, res, object })
        _object = toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i, e, object, mount, createElement })

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
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, _, __, ___, _i,e, req, res }), _timer)
        }

        var state = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i, object })
        if (state === undefined) state = args[1]
        if (state) path.splice(1, 0, state)
        path0 = path[0] = ")("

    } else if (path0 && args[1] === "()") {
        
        if (args[2]) {

            var _timer = parseInt(args[2])
            path[0] = `${args.slice(0, -1).join(":")}`
            return setTimeout(() => reducer({ _window, id, path, value, key, params, object, _, __, ___, _i,e, req, res }), _timer)
        }

        var state = args[0]
        if (state.slice(0, 7) === "coded()" && state.length === 12) state = toValue({ req, res, _window, id, e, value: state, params, _, __, ___, _i, object })

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
                return setTimeout(() => reducer({ _window, id, path, value, key, params, object, _, __, ___, _i,e, req, res }), _timer)
            }

            // conditions
            if (args[3]) {
                var approved = toApproval({ _window, e, string: args[3], id, _, __, ___, _i,req, res })
                if (!approved) return
            }

            // id
            var _id = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i, object })
            if (_id || args[1]) view = views[_id || args[1]]
            
            path[0] = path0 = "()"
            _object = views[id]
        }
    }

    if (!view) view = views[id]

    // while
    if (path0 === "while()") {
            
      while (!global.return && toApproval({ _window, e, string: args[1], id, _, __, ___, _i, req, res, object })) {
        toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i, e, object, mount, createElement })
      }
      // path = path.slice(1)
      return global.return = false
    }

    // initialize by methods
    if (!object && actions.includes(path0)) {

      if (path0 === "getChildrenByClassName()" || path0 === "className()") {

          path.unshift("document()")
          path0 = "document()"

      } else {
        
          if (view && path0 !== "txt()" && path0 !== "val()" && path0 !== "min()" && path0 !== "max()" && path0 !== "Data()" && path0 !== "doc()" && 
          path0 !== "data()" && path0 !== "derivations()" && path0 !== "readonly()") {

              if (view.labeled && view.templated) path = ["parent()", "parent()", ...path]
              else if ((view.labeled && !view.templated) || view.templated || view.link) path.unshift("parent()")

          } else if (path0 === "txt()" || path0 === "val()" || path0 === "min()" || path0 === "max()") {
              
              if (view.islabel || view.templated || view.link || view.labeled) path.unshift("input()")
          }
          
          path.unshift("()")
          path0 = "()"
      }

    } else if (view && path[0] === "()" && path[1] && path[1].includes("()")) {
        
        /*if (path[1] !== "txt()" && path[1] !== "val()" && path[1] !== "min()" && path[1] !== "max()" && path[1] !== "Data()" && path[1] !== "data()" && path[1] !== "derivations()" && path[1] !== "readonly()") {
            
            if (view.labeled) path = ["()", "parent()", "parent()", ...path.slice(1)]
            else if (view.templated) path = ["()", "parent()", ...path.slice(1)]

            path0 = "()"
        }*/
    }

    _object = path0 === "()" ? view
    : path0 === "index()" ? index
    : (path0 === "global()" || path0 === ")(") ? _window ? _window.global : window.global
    : path0 === "e()" ? e
    : path0 === "_" ? _
    : path0 === "__" ? __
    : path0 === "___" ? ___
    : (path0 === "document()") ? document
    : (path0 === "window()" || path0 === "win()") ? _window || window
    : path0 === "history()" ? history
    : (path0 === "navigator()" || path0 === "nav()") ? navigator
    : _object !== undefined ? _object
    : object

    if (path0 === "()" || path0 === "index()" || path0 === "global()" || path0 === ")(" || path0 === "e()" || path0 === "_" || path0 === "__" || path0 === "document()" 
    || path0 === "window()" || path0 === "win()" || path0 === "history()"/* || path0 === "return()"*/) path = path.slice(1)
        
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
                
                var _log = args.slice(1).map(arg => toValue({ req, res, _window, id, value: arg || "here", params, _, __, ___, _i, e, object }))
                console.log(..._log)
            }

            else if (path0.slice(0, 7) === "coded()") {

                coded = true
                _object = toValue({ req, res, _window, object, id, value: global.codes[path0], params, _, __, ___, _i,e })
            }

            else if (path0 === "getCookie()") {

              // if (_window) return views.root.controls.push({ event: `loading?${path.join(".")}` })

              // getCookie():name
              if (isParam({ _window, string: args[1], req, res })) {
                  var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,params, string: args[1] })
                  return getCookie({ ..._params, req, res, _window })
              }
              var _name = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1] })
              _object = getCookie({ name: _name, req, res, _window })
              if (!_object) return
            } 
            
            else if (path0 === "eraseCookie()") {

              if (_window) return views.root.controls.push({ event: `loading?${path.join(".")}` })

                // getCookie():name
                if (isParam({ _window, req, res, string: args[1] })) {
                    var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,params, string: args[1] })
                    return eraseCookie({ ..._params, req, res, _window })
                }
                var _name = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1] })
                _object = eraseCookie({ name: _name, req, res, _window })
                if (!_object) return
            } 
            
            else if (path0 === "setCookie()") {

              if (_window) return views.root.controls.push({ event: `loading?${path.join(".")}` })
    
                // X setCookie():value:name:expiry-date X // setCookie():[value;name;expiry]
                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,params, string: args[1] })
                return setCookie({ ..._params, req, res, _window })
            } 
            
            else if (path0 === "cookie()") {

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,params, string: args[1] })

                if (_window && params.method === "post" || params.method === "delete") return views.root.controls.push({ event: `loading?${path.join(".")}` })
                if (params.method === "post") return setCookie({ ..._params, req, res, _window })
                if (params.method === "delete") return eraseCookie({ ..._params, req, res, _window })
                if (params.method === "get") return getCookie({ ..._params, req, res, _window })
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
                    el = toValue({ req, res, _window, id, _, __, ___, _i,e, value: el, params })
                    _object.push(el)
                })
            } 
            
            else if (path0 === "_map") {

                _object = {}
                if (isParam({ _window, string: args[1] })) {

                  return args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: _object, e, req, res, _, __, ___, _i, mount }))
                } else {

                  var args = path[0].split(":").slice(1)
                  args.map((arg, i) => {

                      if (i % 2) return
                      var f = toValue({ req, res, _window, id, _, __, ___, _i,e, value: arg, params })
                      var v = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args[i + 1], params })
                      if (v !== undefined) _object[f] = v

                  })
                }
            }
            
            else if (mount) {
                _object = view
                path.unshift("()")
            }
        }

        if (_object || _object === "" || _object === 0 || coded) path = path.slice(1)
        else {

            if (path[1] && path[1].toString().includes("()")) {
                
                _object = path[0]
                path = path.slice(1)

            } else return decode({ _window, string: path.join(".") })
        }
    }
    
    var lastIndex = path.length - 1, k0
    /*path.map((k, i) => {
        k = k.toString()
        var k0 = k.split(":")[0]
        var k1 = k.split(":")[1]
        if (k0 && k1 && !k0.includes("()") && k1 !== "()") {
            path[i] = path[i].split(":").slice(1).join(":")
            path.splice(i, 0, k0)
            console.log(k,path);
        }
    })*/
    
    var answer = path.reduce((o, k, i) => {
        
        if (k === undefined) console.log(view, id, path)

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
        
        if (k0 === "else()" || k0 === "or()") {
            
            var args = k.split(":").slice(1)
            if (o || o === 0 || o === "") answer = o
            else if (args[0]) {
                args.map(arg => {
                    if (!answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, __, ___, _i,e })
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
        if (k === "notexist()" || k === "doesnotexist()" || k === "doesnotExist()" || k === "notExist()" || (k === "not()" && (!path[i + 1] || (path[i + 1].includes("()") && !path[i + 1].includes("coded()"))))) 
        return answer = !o ? true : false

        // log
        if (k0.includes("log()")) {

            var ____
            if (k0[0] === "_") ____ = o
            var _log = args.slice(1).map(arg => toValue({ req, res, _window, id, e, _: ____ ? ____ : _, __, ___, _i, value: arg, params }))
            if (_log.length === 0) _log = o !== undefined ? [o] : ["here"]
            console.log(..._log)
            return o
        }

        if (o === undefined) return o

        else if (k0 !== "data()" && k0 !== "Data()" && k0 !== "doc()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, id, e, _, __, ___, _i,value: k, params })
            
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
            
            while (toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })) {
                toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e })
            }
            
        } else if (k0 === "_") {
          
            if (value !== undefined && key && i === lastIndex) answer = o[_] = value
            else if (typeof o === "object") answer = o[_]

        }else if (k0 === "__") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[__] = value
            else if (typeof o === "object") answer = o[__]

        }  else if (k0 === ")(") {

            var _state = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = global[_state]

        } else if (k0.slice(0, 7) === "coded()" || k0.slice(0, 8) === "codedS()") {
            
            var _coded
            if (k0.slice(0, 7) === "coded()") _coded = toValue({ req, res, _window, id, e, value: global.codes[k], params, _, __, ___, _i })
            else if (k0.slice(0, 8) === "codedS()") _coded = global.codes[k]

            if (i === lastIndex && key && value !== undefined) answer = o[_coded] = value
            else answer = o[_coded]
            /*
            _coded = _coded !== undefined ? [...toArray(_coded), ...path.slice(i + 1)] : path.slice(i + 1)
            answer = reducer({ req, res, _window, id, e, value, key, path: _coded, object: o, params, _, __, ___, _i })
            */
            
        } else if (k0 === "data()") {

            var _o = o.type ? o : view
            var _params = {}
            
            if (!o) return
            if (_o.type) breakRequest = true

            if (args[1]) _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })

            // just get data()
            if (!_o.derivations) {

              var _path = _params.path || views[id].derivations
              var _data 
              if (_params.data) _data = reducer({ req, res, _window, id, e, value, key, path: _params.path || views[id].derivations, object: _params.data || global[views[id].Data], params, _, __, ___ })
              else {
                
                _path.unshift(`${views[id].Data}:()`)
                _data = reducer({ req, res, _window, id, e, value, key, path: _path, object, params, _, __, ___ })
              }
              return answer = _o[_data]
            }

            if (_params.path) return answer = reducer({ req, res, _window, id, e, value, key, path: _params.path, object: _params.data || object, params, _, __, ___ })
            var _derivations = _params.path || _o.derivations || []

            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, __, ___, _i,e })
                var _path = [..._derivations, ...path.slice(i + 1)]
                _path.unshift(`${_o.Data}:()`)
                answer = reducer({ req, res, _window, id, e, value, key, path: _path, object, params, _, __, ___, _i })

            } else {
                var _path = [..._derivations]
                _path.unshift(`${_o.Data}:()`)
                answer = reducer({ req, res, _window, id, value, key: path[i + 1] === undefined ? key : false, path: _path, object, params, _, __, ___, _i,e })
            }
            
        } else if (k0 === "Data()" || k0 === "doc()") {

            var _path = args[1], _Data

            breakRequest = true
            if (o.derivations) _Data = o.Data
            else _Data = views[id].Data

            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: _path })
                    _path = _params.path || _params.derivations || []
                    if (typeof _path === "string") _path = _path.split(".")

                    return answer = reducer({ req, res, _window, id, e, value, key, path: [`${_Data}:()`, ..._path, ...path.slice(i + 1)], object, params, _, __, ___, _i })
                }

                if (_path.slice(0, 7) === "coded()") _path = global.codes[_path]
                _path = toValue({ req, res, _window, id, value: _path, params, _, __, ___, _i, e })
                if (typeof _path === "string") _path = _path.split(".")

                return answer = reducer({ req, res, _window, id, e, value, key, path: [`${_Data}:()`, ..._path, ...path.slice(i + 1)], object, params, _, __, ___, _i })
            }

            if (path[i + 1] !== undefined) {

                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, __, ___, _i,e })
                answer = reducer({ req, res, _window, id, e, value, key, path: [`${_Data}:()`, ...path.slice(i + 1)], object, params, _, __, ___, _i })

            } else answer = global[_Data]

        } else if (k0 === "removeAttribute()") {

            var _o, _params
            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
            else _params = { att: toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] }) }

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

            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
            _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

              if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
              _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

            if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
            _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

                if (isParam({ _window, string: args[1] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.view || _params.id || _params.el || _params.element || toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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
                var _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
                if (typeof _o === "object") _id = _o.id
                else if (typeof _o === "string") _id = _o
            }

            toParam({ req, res, _window, id: _id, e, _, __, ___, _i, string: `style().display=flex` })
            
        } else if (k0 === "hide()") {

            var _i
            if (typeof o === "object") _id = o.id
            else if (typeof o === "string") _id = o

            if (args[1]) {
                var _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
                if (typeof _o === "object") _id = _o.id
                else if (typeof _o === "string") _id = _o
            }

            toParam({ req, res, _window, id: _id, e, _, __, ___, _i, string: `style().display=none` })
            
        } else if (k0 === "style()") { // style():key || style():[key=value;id||el||view||element]
            
            var _o, _params = {}
            if (args[1]) {

              if (isParam({ _window, string: args[1] })) {
                  
                  _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                  _o = _params.view || _params.id || _params.el || _params.element || o

              } else {
                  _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
                  if (isParam({ _window, string: args[2] })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[2] })
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

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

          } else if (k0 === "getTagElement()") {
          
            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]

          } else if (k0 === "getTags()" || k0 === "tags()") {

            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)

            answer = [...answer].map(o => views[o.id])

          } else if (k0 === "getTag()" || k0 === "tag()") {
          
            var _o, _params = {}, _tag_name
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    _tag_name = _params.tag || _params.tagName

                } else _tag_name = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            _tag_name = _tag_name.toUpperCase()
            if (_o.nodeType === Node.ELEMENT_NODE) answer = _o.getElementsByTagName(_tag_name)[0]
            else answer = _o.element && _o.element.getElementsByTagName(_tag_name)[0]
            answer = window.views[answer.id]

        } else if (k0 === "getInputs()" || k0 === "inputs()") {
            
            var _input, _textarea, _editables, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (_o.nodeType === Node.ELEMENT_NODE) {

                _input = _o.getElementsByTagName("INPUT")
                _textarea = _o.getElementsByTagName("TEXTAREA")

            } else {

                _input = _o.element && _o.element.getElementsByTagName("INPUT")
                _textarea = _o.element && _o.element.getElementsByTagName("TEXTAREA")
                _editables = getDeepChildren({ _window, id: _o.id }).filter(view => view.editable)
                if (_o.editable) _editables.push(_o)
            }
            answer = [..._input, ..._textarea, ..._editables].map(o => views[o.id])

        } else if (k0 === "getInput()" || k0 === "input()") {
            
            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            if (_o.nodeType === Node.ELEMENT_NODE) __o = views[_o.id]
            else __o = _o

            if (!__o) return
            if (__o.type !== "Input") {
                if (__o.element.getElementsByTagName("INPUT")[0]) answer = views[__o.element.getElementsByTagName("INPUT")[0].id]
                else if (__o.element.getElementsByTagName("TEXTAREA")[0]) answer = views[__o.element.getElementsByTagName("TEXTAREA")[0].id]
                else {
                    var deepChildren = getDeepChildren({ _window, id:__o.id })
                    if (__o.editable || deepChildren.find(view => view.editable)) {
                        answer = __o.editable ? __o : deepChildren.find(view => view.editable)
                    } else return
                }
            } else answer = __o

        } else if (k0 === "getEntry()" || k0 === "entry()") {
            
            var _o, __o, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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
                relativeTo = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            answer = position(o, relativeTo)

        } */else if (k0 === "getBoundingClientRect()") {

            var relativeTo
            if (args[1]) relativeTo = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            else relativeTo = o
            if (typeof relativeTo === "object") relativeTo = o.element
            answer = relativeTo.getBoundingClientRect()

        } else if (k0 === "relativePosition()") {

            var relativeTo = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "getChildrenByClassName()" || k0 === "className()") {
            
            var className, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    className = _params.className || _params.class

                } else className = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })

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

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            if (typeof _o === "object" && _o.element) answer = [..._o.element.classList]
            else if (_o.nodeType === Node.ELEMENT_NODE) answer = [..._o.classList]
            
        } else if (k0 === "getElementsByClassName()") {

            // map not loaded yet
            if (view.status === "Loading") {
                view.controls = toArray(view.controls)
                return view.controls.push({
                    event: `loaded?${key}`
                })
                return 
            }
            
            var className, _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o
                    className = _params.className || _params.class

                } else className = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

        } else if (k0 === "toInteger()") {

            var integer
            if (args[1]) integer = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            else integer = o
            answer = Math.round(toNumber(integer))

        } else if (k0 === "click()") {
            
          if (_window) return view.controls.push({
            event: `loaded?${path.join(".")}`
          })

          var _params = {}, _o
          if (args[1]) {

              if (isParam({ _window, string: args[1] })) {

                  _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                  _o = _params.view || _params.id || _params.el || _params.element || o

              } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
          } else _o = o
          
          if (typeof _o === "string" && views[_o]) views[_o].element.click()
          else if (_o.nodeType === Node.ELEMENT_NODE) _o.click()
          else if (typeof _o === "object" && _o.element) _o.element.click()

        } else if (k0 === "dblclick()") {
            
          if (_window) return view.controls.push({
            event: `loaded?${path.join(".")}`
          })
            
            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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
            event: `loaded?${path.join(".")}`
          })

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            focus({ id: _o.id })

        } else if (k0 === "blur()") { // blur
            
          if (_window) return view.controls.push({
            event: `loaded?${path.join(".")}`
          })

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.id || _params.el || _params.element || o

                } else _o = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            if (typeof _o === "string" && views[_o]) _o = views[_o]
            
            _o.element.blur()

        } else if (k0 === "axios()") {

            var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
            require("./axios").axios({ id, e, _, __, ___, _i,params: _params })

        } else if (k0 === "getElementById()") {

            var _params = {}, _o, _id
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.element || o
                    _id = _params.id

                } else _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o
            
            answer = _o.getElementById(_id)

        } else if (k0 === "mousedown()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mousedownEvent = new Event("mousedown")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mousedownEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mousedownEvent)

        } else if (k0 === "mouseup()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseupEvent = new Event("mouseup")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseupEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseupEvent)

        } else if (k0 === "mouseenter()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            } else _o = o

            if (typeof _o === "string" && views[_o]) _o = views[_o]

            var mouseenterEvent = new Event("mouseenter")

            if (_o.nodeType === Node.ELEMENT_NODE) _o.dispatchEvent(mouseenterEvent)
            else if (typeof _o === "object" && _o.element) _o.element.dispatchEvent(mouseenterEvent)

        } else if (k0 === "mouseleave()") {

            var _params = {}, _o
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o

                } else _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _timer = _params.timer

                } else {
                    return args.slice(1).map(arg => { 

                        _timer = toValue({ req, res, _window, id, e, _, __, ___, _i,value: arg, params })
                        clearTimeout(_timer)
                    })
                }
            } else _timer = o
            
            clearTimeout(_timer)
            
        } else if (k0 === "clearInterval()") {

            var _params = {}, _o, _interval
            if (args[1]) {

                if (isParam({ _window, string: args[1] })) {

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.view || _params.el || _params.id || _params.element || o
                    _interval = _params.interval

                } else {
                    return args.slice(1).map(arg => { 

                        _timer = toValue({ req, res, _window, id, e, _, __, ___, _i,value: arg, params })
                        clearInterval(_timer)
                    })
                }
            } else _interval = o
            
            answer = clearInterval(_interval)
            
        } else if (k0 === "interval()" || k0 === "setInterval()") {
            
            if (!isNaN(toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e }))) { // interval():params:timer

                var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e }))
                var myFn = () => toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
                answer = setInterval(myFn, _timer)

            } else if (isParam({ _window, string: args[1] }) && !args[2]) { // interval():[params;timer]

                var _params
                _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                var myFn = () => toValue({ req, res, _window, id, value: _params.params || _params.parameters, params, _, __, ___, _i,e })
                answer = setInterval(myFn, _params.timer)
            }

        } else if (k0 === "timer()" || k0 === "setTimeout()") {
            
            if (args[2]) { // timer():params:timer

                var _timer = parseInt(toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e, object }))
                var myFn = () => { toParam({ req, res, _window, id, string: args[1], params, _, __, ___, _i,e, object }) }
                answer = setTimeout(myFn, _timer)

            } else if (isParam({ _window, string: args[1] }) && !args[2]) { // timer():[params;timer]

                var _params
                _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1], object })
                var myFn = () => toValue({ req, res, _window, id, value: _params.params || _params.parameters, params, _, __, ___, _i,e, object })
                answer = setTimeout(myFn, _params.timer)
            }

        } /*else if (k0 === "path()") {

            var _path = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            if (typeof _path === "string") _path = _path.split(".")
            _path = [..._path, ...path.slice(i + 1)]
            answer = reducer({ req, res, _window, id, path: _path, value, key, params, object: o, _, __, ___, _i,e })
            
        } */else if (k0 === "pop()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            else _o = o

            _o.pop()
            answer = _o
            
        } else if (k0 === "shift()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            else _o = o

            _o.shift()
            answer = _o

        } else if (k0 === "slice()") {

            if (!Array.isArray(o) && typeof o !== "string" && typeof o !== "number") return
            if (args[2] || !isNaN(toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i }))) { // slice():start:end

                var _start = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i, object })
                var _end = toValue({ req, res, _window, id, e, value: args[2], params, _, __, ___, _i, object })
                // console.log(o, path, _start, _end, k);
                if (_end !== undefined) answer = o.slice(parseInt(_start), parseInt(_end))
                else answer = o.slice(parseInt(_start))

            } else {

                var _params = {}, _o
                if (args[1]) {

                    if (isParam({ _window, string: args[1] })) {

                        _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
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

                    _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                    _o = _params.object || _params.map || o
                    if (_params.index) return _o.derivations[_index]
                    else return _o.derivations

                } else _index = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
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
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _, __, ___, _i }) || global.data.page[global.currentPage].title
            answer = o.replaceState(null, title, _url)

        } else if (k0 === "pushState()") {

            // pushState():url:title
            var args = k.split(":")
            var _url = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            var title = toValue({ req, res, _window, id, e, value: args[2], params, _, __, ___, _i }) || global.data.page[global.currentPage].title
            answer = o.pushState(null, title, _url)

        } else if (k0 === "_index") {
            
            answer = index

        } else if (k0 === "format()") {
            
            var args = k.split(":")
            answer = global.codes[args[1]]
           
        } else if (k0 === "_array" || k0 === "_list") {
            
            answer = []
            k.split(":").slice(1).map(el => {
                el = toValue({ req, res, _window, id, _, __, ___, _i,e, value: el, params })
                answer.push(el)
            })

        } else if (k0 === "_map") {
            
            answer = {}
            if (isParam({ _window, string: args[1] })) {

              return args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: answer, e, req, res, _, __, ___, _i, mount }))
            } else {

              k.split(":").slice(1).map((el, i) => {

                  if (i % 2) return
                  var f = toValue({ req, res, _window, id, _, __, ___, _i,e, value: el, params })
                  var v = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args[i + 1], params })
                  if (v !== undefined) answer[f] = v
              })
            }

        } else if (k0 === "_semi" || k0 === ";") {
  
            answer = o + ";"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_quest" || k0 === "?") {
            
            answer = o + "?"
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_dot" || k0 === ".") {

            answer = o + "."
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }

        } else if (k0 === "_space" || k0 === " ") {

            answer = o = o + " "
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_equal" || k0 === "=") {
            
            answer = o + "="
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "_comma" || k0 === ",") {
            
            answer = o + ","
            var args = k.split(":").slice(1)
            if (args[0]) {
                var _text = toValue({ req, res, _window, id, _, __, ___, _i,e, value: args.join(":"), params })
                answer = o = o + _text
            }
            
        } else if (k0 === "return()") {

            var isparam = isParam({ _window, string: args[1] })
            if (isparam) toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
            else answer = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
            
            if (params) params["return()"] = true
            view["return()"] = true
            
        } else if (k0 === "reload()") {

            document.location.reload(true)
            
        } else if (k0 === "isSameNode()" || k0 === "isSame()") {

            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next === o
            
        } else if (k0 === "isnotSameNode()" || k0 === "isnotSame()") {

            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e }) || {}
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next !== o
            
        } else if (k0 === "inOrSame()" || k0 === "insideOrSame()") {

            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = _next.contains(o) || _next === o
            
        } else if (k0 === "contains()" || k0 === "contain()") {
            
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
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
            
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
            if (typeof o === "string" || Array.isArray(o) || typeof o === "number") return answer = _next.includes(o)
            else if (typeof o === "object") answer = _next[o] !== undefined
            else if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE) return answer = _next.contains(o)

        } else if (k0 === "out()" || k0 === "outside()" || k0 === "isout()" || k0 === "isoutside()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !_next.contains(o) && _next !== o
            
        } else if (k0 === "doesnotContain()") {

            var args = k.split(":")
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, __, ___, _i,e })
            if (o.nodeType === Node.ELEMENT_NODE && _next.nodeType === Node.ELEMENT_NODE)
            answer = !o.contains(_next)
            
        } else if (k0 === "then()") {

            var args = k.split(":").slice(1)
            
            if (args[0]) {
                args.map(arg => {
                    toValue({ req, res, _window, id: mainId, value: arg, params, _, __, ___, _i,e })
                })
            }
            
        } else if (k0 === "and()") {
            
            if (!o) {
                answer = false
            } else {
                var args = k.split(":").slice(1)
                if (args[0]) {
                    args.map(arg => {
                        if (answer) answer = toValue({ req, res, _window, id: mainId, value: arg, params, _, __, ___, _i,e })
                    })
                }
            }
            
        } else if (k0 === "isEqual()" || k0 === "is()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = isEqual(o, b)
            
        } else if (k0 === "greater()" || k0 === "isgreater()" || k0 === "isgreaterthan()" || k0 === "isGreaterThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = parseFloat(o) > parseFloat(b)
            
        } else if (k0 === "less()" || k0 === "isless()" || k0 === "islessthan()" || k0 === "isLessThan()") {
            
            var args = k.split(":")
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = parseFloat(o) < parseFloat(b)
            
        } else if (k0 === "isNot()" || k0 === "isNotEqual()" || k0 === "not()" || k0 === "isnot()") {
            
            var args = k.split(":")
            var isNot = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
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
                var b = toValue({ req, res, _window, id, value: arg, params, _, __, ___, _i,e })
                
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
                var b = toValue({ req, res, _window, id, value: arg, params, _, __, ___, _i,e })
                
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
                var b = toValue({ req, res, _window, id, value: arg, params, _, __, ___, _i,e })
                
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

                var b = toValue({ req, res, _window, id, value: arg, params, e, _, __, ___, _i })
            
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
            
            var b = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            
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
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
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

        } else if (k0 === "fileReader()" || k0 === "fileReader()") {
            
            // fileReader():file:function
            var _file = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })

            var reader = new FileReader()
            reader.onload = (e) => {
              global.result = e.target.result
              toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e })
            }
            reader.readAsDataURL(_file)

        } else if (k0 === "arr()" || k0 === "list()") {
            
            answer = toArray(o)

        } else if (k0 === "json") {
            
            answer = o + ".json"

        } else if (k0 === "notification()" || k0 === "notify()") {

          var notify = () => {
            if (isParam({ _window, string: args[1] })) {

              var _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
              new Notification(_params.title || "", _params)

            } else {

              var title = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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
            
            var text = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            alert(text)

        } else if (k0 === "clone()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            else _o = o
            answer = clone(_o)

        } else if (k0 === "override()") {
            
            var args = k.split(":"), _obj, _o
            if (args[2]) {

                _o = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
                _obj = toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e })

            } else {

                _o = o
                _obj = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
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
            if (args[1]) _o = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
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
                    
                } else {

                    if (views[el.id].type === "Entry" || views[el.id].editable) answer = (el.textContent===undefined) ? el.innerText : el.textContent
                    else answer = el.innerHTML
                    if (i === lastIndex && key && value !== undefined) answer = el.innerHTML = value
                }
                
            } else if (view && view.type === "Input") {

                if (i === lastIndex && key && value !== undefined) _o[view.element.value] = value
                else return answer = _o[view.element.value]

            } else if (view && view.type !== "Input") {

                if (i === lastIndex && key && value !== undefined) _o[view.element.innerHTML] = value
                else {
                    if (view.type === "Entry" || view.editable) answer = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent
                    else answer = view.element.innerHTML
                }
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
                var f = toValue({ req, res, _window, id, value: field, params, _, __, ___, _i,e })
                var v = toValue({ req, res, _window, id, value: fields[i + 1], params, _, __, ___, _i,e })
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

                    var f = toValue({ req, res, _window, id, value: _fv, params, _, __, ___, _i,e })
                    var v = toValue({ req, res, _window, id, value: fv[_i + 1], params, _, __, ___, _i,e })
                    answer[f] = v
                })
            }
            
        } else if (k0 === "unshift()" || k0 === "pushFirst()" || k0 === "pushStart()") { // push to the begining, push first, push start

          var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e, object })
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
            if (!Array.isArray(o)) return undefined
            
            var _item, _index
            if (k0.charAt(0) === "_") {
                _item = toValue({ req, res, _window, id, value: args[1], params, _: o, __: _, _i,e, object })
                _index = toValue({ req, res, _window, id, value: args[2], params, _: o, __: _, _i,e, object })
            } else {
                _item = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e, object })
                _index = toValue({ req, res, _window, id, value: args[2], params, _, __, ___, _i,e, object })
            }

            if (_index === undefined) _index = o.length
            
            if (Array.isArray(_item)) {
                
                _item.map(_item => {
                    o.splice(_index, 0, _item)
                    _index += 1
                })

            } else if (Array.isArray(o)) o.splice(_index, 0, _item)
            answer = o
            
        } else if (k0 === "pull()") { // pull by index

            // if no it pulls the last element
            var _pull = args[1] !== undefined ? toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i, e, object }) : o.length - 1
            if (_pull === undefined) return undefined
            o.splice(_pull,1)
            answer = o
            
        } else if (k0 === "pullItems()") { // pull by item

            if (isParam({ _window, string: args[1] }) || isCondition({ _window, string: args[1] })) {
            
                var _items
                
                if (k[0] === "_") _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
                else _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, object: o, _i: index, req, res, _, __, ___ }))
                
                _items.map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })
                
                answer = o
                
            } else {

                var _items = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i, e, object })
                
                toArray(_items).map(_item => {
                    var _index = o.findIndex(item => isEqual(item, _item))
                    if (_index !== -1) o.splice(_index, 1)
                })

                answer = o
            }
            
        } else if (k0 === "pullItem()") {

            if (isParam({ _window, string: args[1] }) || isCondition({ _window, string: args[1] })) {

                var _index

                if (k[0] === "_") _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, __: _, _: o, req, res }) )
                else _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, object: o, req, res, _, __, ___ }))

                if (_index !== -1) o.splice(_index , 1)
                answer = o
                
            } else {

                var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i, e, object })
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index,1)
                answer = o
                
            }
            
        } else if (k0 === "pullLastItem()" || k0 === "pullLast()") {
            
            // if no it pulls the last element
            o.splice(o.length - 1, 1)
            answer = o
            
        } else if (k0 === "findItems()") {

            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = o.filter(item => isEqual(item, _item))
            
        } else if (k0 === "findItem()") {

            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = o.find(item => isEqual(item, _item))
            
        } else if (k0 === "findItemIndex()") {

            var _item = toValue({ req, res, _window, id, value: args[1], params, _, __, ___, _i,e })
            answer = o.findIndex(item => isEqual(item, _item))
            
        } else if (k0 === "filterItems()") {
            
            var _items

            if (k[0] === "_") _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
            else _items = o.filter((o, index) => toApproval({ _window, e, string: args[1], id, object: o, _i: index, req, res, _, __, ___ }))
            
            _items.map(_item => {
                var _index = o.findIndex(item => isEqual(item, _item))
                if (_index !== -1) o.splice(_index, 1)
            })

            answer = o

        } else if (k0 === "filterItem()") {

            var _index

            if (k[0] === "_") _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, __: _, _: o, req, res }) )
            else _index = o.findIndex(o => toApproval({ _window, e, string: args[1], id, object: o, req, res, _, __, ___ }))

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
            
            if (args[1] && !isParam({ _window, string: args[1] })) {

                var _id = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
                if (!views[_id]) return console.log("Element doesnot exist!")
                return remove({ id: _id })

            } else if (args[1] && isParam({ _window, string: args[1] })) {

                var params = toParam({ req, res, _window, e, id, string: args[1], _, __, ___, _i, params })
                return remove({ id: params.id || o.id, remove: { onlyChild: params.data === false ? false : true } })
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
            var _index = toValue({ req, res, _window, e, id, value: args[1], _, __, ___, _i,params })
            answer = o.charAt(0)

        } else if (k0 === "scrollTo()") {

          var _x = toValue({ req, res, _window, e, id, value: args[1], _, __, ___, _i, params })
          var _y = toValue({ req, res, _window, e, id, value: args[2], _, __, ___, _i, params })
          window.scrollTo(_x, _y)
          
        } else if (k0 === "droplist()") {
            
            var _params = toParam({ req, res, _window, e, id, string: args[1], _, __, ___, _i,params })
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
            
            var checklist = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params }) || []
            answer = toId({ string: o, checklist })

        } else if (k0 === "generate()" || k0 === "gen()") {
            
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
                _params.length = _params.length || _params.len || 5
                _params.number = _params.number || _params.num
                answer = generate(_params)

            } else {

                var length = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params }) || 5
                answer = generate({ length })
            }

        } else if (k0 === "includes()" || k0 === "inc()") {
          
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            answer = o.includes(_include)
            
        } else if (k0 === "notInclude()" || k0 === "doesnotInclude()") {
            
            var _include = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            answer = !o.includes(_include)
            
        } else if (k0 === "capitalize()") {
            
            answer = capitalize(o)
            
        } else if (k0 === "capitalizeFirst()") {
            
            answer = capitalizeFirst(o)
            
        } else if (k0 === "uncapitalize()") {
            
            answer = capitalize(o, true)
            
        } else if (k0 === "uppercase()" || k0 === "toUpperCase()" || k0 === "touppercase()") {
            
            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            else _o = o
            answer = typeof _o === "string" ? _o.toUpperCase() : _o
            
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
            if (args[1]) days_ = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            if (args[2]) hours_ = toValue({ req, res, _window, id, e, value: args[2], params, _, __, ___, _i })
            if (args[3]) mins_ = toValue({ req, res, _window, id, e, value: args[3], params, _, __, ___, _i })
            if (args[4]) secs_ = toValue({ req, res, _window, id, e, value: args[4], params, _, __, ___, _i })
            */
            var _params = toParam({ req, res, _window, id, e, string: args[1], params, _, __, ___, _i })
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
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })
            else _o = o

            if (!isNaN(_o) && typeof _o === "string") _o = parseInt(_o)
            answer = new Date(_o)

        } else if (k0 === "toDateFormat()") { // returns date for input

            if (isParam({ _window, string: args[1] })) {

                var _options = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
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
                        var utc_days  = Math.floor(serial - 25569);
                        var utc_value = utc_days * 86400;                                        
                        var date_info = new Date(utc_value * 1000);
                     
                        var fractional_day = serial - Math.floor(serial) + 0.0000001;
                     
                        var total_seconds = Math.floor(86400 * fractional_day);
                     
                        var seconds = total_seconds % 60;
                     
                        total_seconds -= seconds;
                     
                        var hours = Math.floor(total_seconds / (60 * 60));
                        var minutes = Math.floor(total_seconds / 60) % 60;
                     
                        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
                    }
                    return ExcelDateToJSDate(o)
                }

            } else {

                if (!isNaN(o) && typeof o === "string") o = parseInt(o)
                var _date = new Date(o)
                var _year = _date.getFullYear()
                var _month = _date.getMonth() + 1
                var _day = _date.getDate()
                var _dayofWeek = _date.getDay()
                var _hour = _date.getHours()
                var _mins = _date.getMinutes()

                var _daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

                return `${_daysofWeek[_dayofWeek]} ${_day.toString().length === 2 ? _day : `0${_day}`}/${_month.toString().length === 2 ? _month : `0${_month}`}/${_year}${args[1] === "time" ? ` ${_hour.toString().length === 2 ? _hour : `0${_hour}`}:${_mins.toString().length === 2 ? _mins : `0${_mins}`}` : ""}`
            }

        } else if (k0 === "toDateInputFormat()") { // returns date for input in format yyyy-mm-dd

            if (isParam({ _window, string: args[1] })) {

                var _options = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
                var format = _options.from, day = 0, month = 0, year = 0, hour = 0, sec = 0, min = 0
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
                console.log(new Date(year, month, day, hour, min, sec));
                return new Date(year, month, day, hour, min, sec)

            } else {

                if (!isNaN(o) && typeof o === "string") o = parseInt(o)
                var _date = new Date(o)
                var _year = _date.getFullYear()
                var _month = _date.getMonth() + 1
                var _day = _date.getDate()
                return `${_year}-${_month.toString().length === 2 ? _month : `0${_month}`}-${_day.toString().length === 2 ? _day : `0${_day}`}`
            }

        } else if (k0 === "toUTCString()") {
            
            if (!isNaN(o) && (parseFloat(o) + "").length === 13) o = new Date(parseFloat(o))
            answer = o.toUTCString()
            
        } else if (k0 === "getGeoLocation") {

          navigator.geolocation.getCurrentPosition((position) => { console.log(position); global.geolocation = position })

        } else if (k0 === "counter()") {
            
          var _options = {}
          if (isParam({ _window, string: args[1] })) _options = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
          else _options = toValue({ req, res, _window, id, e, value: args[1], params, _, __, ___, _i })

          _options.counter = _options.counter || _options.start || _options.count || 0
          _options.length = _options.length || _options.len || _options.maxLength || 0
          _options.end = _options.end || _options.max || _options.maximum || 999999999999
          //_options.timer = _options.timer || (new Date(_date.setHours(0,0,0,0))).getTime()

          answer = require("./counter").counter({ ..._options })

        } else if (k0 === "time()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, ___, _i })
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
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, ___, _i })
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

        } else if (k0 === "stopWatchers()") {
            
            var _view
            if (args[1]) _view = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
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
            
        } else if (k0 === "open()") {
            
          var _url
          if (args[1]) _url = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
          else _url = o
          open(_url)
          
        } else if (k0 === "insert()") {
            
            var _id = id
            if (o.type) _id = o.id
            
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
                if (args[2]) {

                    var _await = global.codes[args[2]]
                    insert({ id: _params.id || _id, insert: _params, asyncer: true, await: _await })

                } else insert({ id: _params.id || _id, insert: _params })
            }

        } else if (k0 === "removeMapping()") {
            
            if (o.type.slice(0, 1) === "[") {
                var _type = o.type.slice(1).split("]")[0]
                o.type = _type + o.type.split("]").slice(1).join("]")
            }
            answer = o
            
        } else if (k0 === "files()") {
            
          answer = [...e.target.files]
          
        } else if (k0 === "replace()") { //replace():prev:new

            var rec0, rec1
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                rec0 = _params["1"]
                rec1 = _params["2"]

            } else {

                rec0 = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
                rec1 = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[2], params })
            }

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

            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                var _path = _params.path, _data = _params.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, id, path: _path || [], value, params, __: _, _: o, e, _i: index, object: item }), reducer({ req, res, _window, id, path: _path || [], value, params, __: _, _: o, e, object: _data })))
                if (_index >= 0) o[_index] = _data
                else o.push(_data)

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
                var _index = o.findIndex(item => item.id === _data.id)
                if (_index >= 0) o[_index] = _data
                else o.push(_data)
            }
            
        } else if (k0 === "findAndReplaceItem()") {

            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                var _path = _params.path, _data = _params.data
                var _index = o.findIndex((item, index) => isEqual(reducer({ req, res, _window, id, path: _path || [], value, params, __: _, _: o, e, _i: index, object: item }), reducer({ req, res, _window, id, path: _path || [], value, params, __: _, _: o, e, object: _data })))
                if (_index >= 0) o[_index] = _data

            } else if (args[1]) {

                var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
                var _index = o.findIndex(item => item.id === _data.id)
                if (_index >= 0) o[_index] = _data
            }
            
        } else if (k0 === "replaceLast()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 1] = _item
                return o
            }
        
        } else if (k0 === "replaceSecondLast()" || k0 === "replace2ndLast()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[o.length - 2] = _item
                return o
            }
        
        } else if (k0 === "replaceFirst()" || k0 === "replace1st()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[0] = _item
                return o
            }
        
        } else if (k0 === "replaceSecond()" || k0 === "replace2nd()") {
        
            var _item = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1] || "", params })
            if (Array.isArray(o)) {

                o[1] = _item
                return o
            }
        
        } else if (k0 === "importJson()") {
        
            answer = importJson()
        
        } else if (k0 === "exportJson()") {
            
            var _name = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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
                else answer = toArray(o).filter((o, index) => toApproval({ _window, e, string: arg, id, object: o, _i: index, req, res, _, __, ___ }))
            })
            
        } /*else if (k0.includes("filterById()")) {

            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } */else if (k0.includes("find()")) {
            

            if (i === lastIndex && key && value !== undefined) {

                var _index
                if (k[0] === "_") _index = toArray(o).findIndex((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
                else _index = toArray(o).findIndex((o, index) => toApproval({ _window, e, string: args[1], id, _, __, ___, _i: index, req, res, object: o }) )
                if (_index !== undefined && _index !== -1) o[_index] = answer = value
                
            } else {

                if (k[0] === "_") answer = toArray(o).find((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
                else answer = toArray(o).find((o, index) => toApproval({ _window, e, string: args[1], id, _, __, ___, _i: index, req, res, object: o }) )
            }
            
        } else if (k0 === "sort()") {
            
            var _array, _params = {}
            if (Array.isArray(o)) _array = o
            if (isParam({ _window, string: args[1] })) {
                
                _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _params.data = _params.data || _params.map || _params.array || _params.object || _params.list || _array

            } else if (args[1]) {
              
              _params.data = _array
              _params.path = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })
            }
            
            answer = require("./sort").sort({ sort: _params, id, e })
            
            return answer

        } else if (k0.includes("findIndex()")) {
            
            if (typeof o !== "object") return
            
            if (k[0] === "_") answer = toArray(o).findIndex((o, index) => toApproval({ _window, e, string: args[1], id, __: _, _: o, _i: index, req, res }) )
            else answer = toArray(o).findIndex((o, index) => toApproval({ _window, e, string: args[1], id, _, __, ___, _i: index, req, res, object: o }) )
            
        } else if (k0.includes("map()") || k0 === "_()" || k0 === "()") {
            
            var notArray = false
            if (args[1] && args[1].slice(0, 7) === "coded()") args[1] = global.codes[args[1]]
            if (typeof o === "object" && !Array.isArray(o)) notArray = true
            if (k[0] === "_") {

                toArray(o).map((o, index) => reducer({ req, res, _window, id, path: args[1] || [], value, params, __: _, _: o, e, _i: index, object }) )
                answer = o
                
            } else {
                answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: args[1] || [], object: o, value, params, _, __, ___, e, _i: index }) )
            }

            if (notArray) return o

        } else if (k0 === "_i") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[_i] = value
            else if (typeof o === "object") answer = o[_i]
            
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

            var _params = {}, _el, once
            if (isParam({ _window, string: args[1] })) {

                _params = toParam({ req, res, _window, id, e, _, string: args[1] })
                _el = _params.element || _params.id || _params.view

            } else if (args[1]) _el = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })
            else if (o) _el = o

            var opt = {
                margin:       [0.1, 0.1],
                filename:     _params.name || generate({ length: 20 }),
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 1.5, dpi: 192 },
                jsPDF:        { unit: 'in', format: _params.size || 'A4', orientation: 'portrait' },
                execludeImages: _params.execludeImages || false
            }
            
            var pages = _params.pages || [_el], _elements = []
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
                                    exportHTMLToPDF(_elements, opt)

                                } else if (pages.length === 1) html2pdf().set(opt).from(_element).toPdf().get('pdf').then(pdf => {
                                    var totalPages = pdf.internal.getNumberOfPages()
                                    
                                    for (i = 1; i <= totalPages; i++) {

                                        pdf.setPage(i)
                                        pdf.setFontSize(9)
                                        pdf.setTextColor(150)
                                        pdf.text('page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() / 1.1), (pdf.internal.pageSize.getHeight() - 0.08))
                                    }
                                    
                                }).save().then(() => {

                                    if (args[2]) toParam({ req, res, _window, id, e, _, string: args[2] })
                                })
                            }
                        })
                    })

                } else html2pdf().set(opt).from(_element).save().then(() => {

                    if (args[2]) toParam({ req, res, _window, id, e, _, string: args[2] })
                })
            })

            document.getElementsByClassName("loader-container")[0].style.display = "none"
            sleep(10)

        } else if (k0 === "share()") {

            if (isParam({ _window, string: args[1] })) { // share():[text;title;url;files]

                var _params = toParam({ req, res, _window, id, e, _, string: args[1] }) || {}, images = []
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
                navigator.share({ url: toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })})
            }

        } else if (k0 === "typeof()" || k0 === "type()") {

            answer = getType(o)

        } else if (k0 === "newTab()") {

            var _params = toParam({ req, res, _window, id, e, _,/* params,*/ __, ___, string: args[1] })
            window.open(_params.url || _params.URL, _params.name, _params.specs || "")

        } else if (k0 === "action()") {
            
            answer = execute({ _window, id, actions: args[1], params, e })
            
        } else if (k0 === "exec()") {
            
            answer = toParam({ req, res, _window, id, e, _, __, ___, string: args[1] })
            
        } else if (k0 === "exportCSV()") {
            
            var _params = toParam({ req, res, _window, id, e, _, __, ___, string: args[1] })
            require("./toCSV").toCSV(_params)
            
        } else if (k0 === "exportExcel()") {
            
            var _params = toParam({ req, res, _window, id, e, _, __, ___, string: args[1] })
            require("./toExcel").toExcel(_params)
            
        } else if (k0 === "exportPdf()") {
            
            var options = toParam({ req, res, _window, id, e, _, __, ___, string: args[1] })
            require("./toPdf").toPdf({ options })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            var _price
            if (args[1]) _price = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })
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
            console.log(answer, o);

        } else if (k0 === "round()") {

            var nth = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] }) || 2
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

            var cname = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })
            answer = getCookie({ name: cname, req, res })
        
        } else if (k0 === "eraseCookie()") {

            // eraseCookie():name
            if (args[1]) _name = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })

            eraseCookie({ name: _name })
            return o
            
        } else if (k0 === "setCookie()") {

            // setCookie:name:expdays
            var args = k.split(":")
            var cvalue = o
            var cname = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[1] })
            var exdays = toValue({ req, res, _window, id, e, _, __, ___, _i,params, value: args[2] })

            setCookie({ name: cname, value: cvalue, expiry: exdays })

        } */else if (k0 === "split()") {
            
            var splited = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            answer = o.split(splited)

        } else if (k0 === "join()") {
            
            if (isParam({ _window, string: args[1] })) { // join():[1=[''];2='']

                var _params = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, ___, _i })
                answer = _params["1"].join(_params["2"])
                
            } else {

                var joiner = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, ___, _i })
                answer = o.join(joiner)
            }

        } else if (k0 === "clean()") {
            
            answer = o.filter(o => o !== undefined && !Number.isNaN(o) && o !== "")
            
        } else if (k0 === "route()") {

            // route():page:path
            if (isParam({ _window, string: args[1] })) {

                var route = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, ___, _i })
                require("./route").route({ _window, req, res, id, route })
                
            } else {
                
                var _page = toValue({ req, res, _window, id, e, value: args[1] || "", params, _, __, ___, _i })
                var _path = toValue({ req, res, _window, id, e, value: args[2] || "", params, _, __, ___, _i })
                require("./route").route({ _window, id, req, res, route: { path: _path, page: _page } })
            }

        } else if (k0 === "toggleView()") {
          
            var toggle = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, ___, _i })
            require("./toggleView").toggleView({ _window, req, res, toggle, id })

        } else if (k0 === "setChild()") {

            var toggle = toParam({ req, res, _window, id, e, string: args[1] || "", params, _, __, ___, _i })
            require("./toggleView").toggleView({ _window, req, res, toggle, id: o.id })

        } else if (k0 === "preventDefault()") {
            
            if (o.target) answer = o.preventDefault()
            else if (e) answer = e.preventDefault()

        } else if (k0 === "stopPropagation()") {
            
            answer = o.stopPropagation()

        } else if (k0 === "isChildOf()") {
            
            var el = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            answer = isEqual(el, o)

        } else if (k0 === "isChildOfId()") {
            
            var _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)

        } else if (k0 === "isnotChildOfId()") {
            
            var _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)
            answer = answer ? false : true

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of view element and children elements in object formula
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0 === "note()") { // note
            
            if (isParam({ _window, string: args[1] })) {
                _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                return note({ note: _params })
            }
            var text = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            var type = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[2], params })
            return note({ note: { text, type } })
            
        } else if (k0 === "mininote()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, __, ___, _i,value: _text, params })
            var mininoteControls = toCode({ _window, string: `():mininote-text.txt()=${_text};clearTimer():[)(:mininote-timer];():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _, __, ___, _i })

        } else if (k0 === "tooltip()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, __, ___, _i,value: _text, params })
            var mininoteControls = toCode({ _window, string: `():tooltip-text.txt()=${_text};clearTimer():[)(:tooltip-timer];():tooltip.style():[opacity=1;transform=scale(1)];)(:tooltip-timer=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _, __, ___, _i })

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
            var _startIndex = args[1] ? toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[0], params }) : 0 || 0
            var _endIndex = args[1] ? toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params }) : toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[0], params })
            var _steps = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[2], params }) || 1
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
          
          var __id, _id, _params, _self
          if (_window) return view.controls.push({
            event: `loaded?${path.join(".")}`
          })
          
          if (isParam({ _window, string: args[1] })) {

            _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
            __id = _params.id || id
            _self = _params.self

          } else if (args[1]) __id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params }) || id

          if (typeof __id === "object" && __id.id) _id = __id.id
          else _id = __id

          if (!_id && o.id) _id = o.id
          
          if (_self) return require("./updateSelf").updateSelf({ _window, req, res, id: _id })
          else return require("./update").update({ _window, req, res, id: _id })

        } else if (k0 === "upload()") {
          
          if (isParam({ _window, string: args[1] })) {

            var _await = ""
            var _upload = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
            if (args[2]) _await = global.codes[args[2]]
            return require("./upload").upload({ _window, req, res, id, e, _, __, ___, _i, upload: _upload, asyncer: true, await: _await })
          }

          return require("./upload").upload({ _window, req, res, id, e, save: { upload: { file: global.upload } }, _, __, ___ })

        } else if (k0 === "confirmEmail()") {
          
          if (isParam({ _window, string: args[1] })) {

            var _await = ""
            var _save = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
            _save.store = "confirmEmail"
            if (args[2]) _await = global.codes[args[2]]
            return require("./save").save({ id, e, _, __, ___, _i, save: _save, asyncer: true, await: _await })
          }

        } else if (k0 === "save()") {
          
          if (isParam({ _window, string: args[1] })) {

            var _await = ""
            var _save = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
            if (args[2]) _await = global.codes[args[2]]
            return require("./save").save({ _window, req, res, id, e, _, __, ___, _i, save: _save, asyncer: true, await: _await })
          }

          var _collection = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
          var _doc = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[2], params })
          var _data = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[3], params })
          var _save = { collection: _collection, doc: _doc, data: _data }

          return require("./save").save({ _window, req, res, id, e, save: _save, _, __, ___ })

        } else if (k0 === "search()") {
            
          if (isParam({ _window, string: args[1] })) {
            
            var _await = ""
            var _search = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
            if (args[2]) _await = global.codes[args[2]]
            
            return require("./search").search({ _window, id, e, _, __, ___, _i, req, res, search: _search, asyncer: true, await: _await })
          }

          var _collection = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
          var _doc = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[2], params })
          var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[3], params })
          var _search = { collection: _collection, doc: _doc, data: _data }

          return require("./search").search({ _window, req, res, id, e, search: _search, _, __ })

        } else if (k0 === "erase()") {
          
            if (isParam({ _window, string: args[1] })) {
  
              var _await = ""
              var _erase = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
              if (args[2]) _await = global.codes[args[2]]
              return require("./erase").erase({ _window, req, res, id, e, _, __, ___, _i, erase: _erase, asyncer: true, await: _await })
            }
  
            var _collection = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            var _doc = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[2], params })
            var _erase = { collection: _collection, doc: _doc }
  
            return require("./erase").erase({ _window, req, res, id, e, save: _erase, _, __, ___ })
  
        } else if (k0 === "send()") {
            
            breakRequest = true
            if (!res || res.headersSent) return
            if (isParam({ _window, string: args[1] })) {
              
              var _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] }), _params_ = {}
              _params_.data = _params.data
              _params_.success = _params.success !== undefined ? _params.success : true
              _params_.message = _params.message || _params.msg || "Action executed successfully!"
              
              res.send(_params_)

            } else {
              
              var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
              res.send({ success: true, message: "Action executed successfully!", data: _data })
            }

        } else if (k0 === "setPosition()" || k0 === "position()") {
          
            // setPosition():toBePositioned:positioner:placement:align
            /*
            var toBePositioned = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            var positioner = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[2], params }) || id
            var placement = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[3], params })
            var align = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[4], params })
            */
            var position = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1], params })
            var _id = id
            if (o.id) _id = o.id

            return require("./setPosition").setPosition({ position, id: _id, e })

        } else if (k0 === "refresh()") {
          
            var _id = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params }) || id
            return require("./refresh").refresh({ id: _id })

        } else if (k0 === "print()") {
          
            var _options = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            if (!_options.id && !_options.view) _options.id = o.id
            if (_options.view) _options.id = _options.view.id

            require("./print").print({ id, options: _options })

        } else if (k0 === "csvToJson()") {
          
            var _options = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            require("./csvToJson").csvToJson({ id, e, options: _options })

        } else if (k0 === "copyToClipBoard()") {
          
            var text 
            if (args[1]) text = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
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

        } else if (k0 === "mail()") {

            if (isParam({ _window, string: args[1] })) {

                var _options = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
                _options.body = _options.body || _options.text || _options.content
                _options.subject = _options.subject || _options.header || _options.title
                // window.open(`mailto:${_options.email}?subject=${_options.subject}&body=${_options.body}`)
                
                try{
                    var theApp = new ActiveXObject("Outlook.Application");
                    var objNS = theApp.GetNameSpace('MAPI');
                    var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
                    theMailItem.to = ('test@gmail.com');
                    theMailItem.Subject = ('test');
                    theMailItem.Body = ('test');
                    // theMailItem.Attachments.Add("C:\\file.txt");
                    theMailItem.display();
                }
                catch (err) {
                    alert(err.message);
                }

            } else {

                var _email = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
                var _subject = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[2], params })
                var _body = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[3], params })
                window.open(`mailto:${_email}?subject=${_subject}&body=${_body}`)
            }

        } else if (k0 === "addClass()") {
            
            var _o, _class
            if (isParam({ _window, string: args[1] })) {

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
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

                var _params = toParam({ req, res, _window, id, e, _, __, ___, _i,string: args[1] })
                _o = _params.element || _params.view || _params.id || o
                _class = _params.class
                
            } else {

                _o = o
                _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            }

            if (typeof _o === "string" && views[_o]) _o = views[_o]
            if (_o.element) answer = _o.element.classList.remove(_class)
            else answer = _o.classList.remove(_class)

        } else if (k === "files" && o && o.nodeType === Node.ELEMENT_NODE) {

          answer = [...o.files]
          
        } else if (k.includes("def()")) {

            var _name = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[1], params })
            var _params = global.codes[args[2]] ? global.codes[args[2]] : args[2]
            var _string = toValue({ req, res, _window, id, e, _, __, ___, _i,value: args[3], params })
            o[`${_name}()`] = {
                name: _name,
                params: _params ? _params.split(":") : [],
                string: _string,
                id, _, __, ___, _i,e, mount,
                req, res, 
            }
            
        } else if (k.includes(":coded()")) {
            
            breakRequest = true
            o[k0] = o[k0] || {}
            answer = reducer({ req, res, _window, id, e, value, key, path: [...args.slice(1), ...path.slice(i + 1)], object: o[k0], params, _, __, ___, _i })

        } else if (key && value !== undefined && i === lastIndex) {

            if (k.includes("coded()")) {

                var _key = k.split("coded()")[0]
                k.split("coded()").slice(1).map(code => {
                    _key += toValue({ _window, value: global.codes[`coded()${code.slice(0, 5)}`], params, _, __, ___, _i,id, e, req, res, object })
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
                _key += toValue({ _window, value: global.codes[`coded()${code.slice(0, 5)}`], params, _, __, ___, _i,id, e, req, res, object })
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

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
const exportHTMLToPDF = async (pages, opt) => {
    
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
}

const toDataURL = url => fetch(url)
.then(response => response.blob())
.then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
}))

const open = (url) => {
  /*
  const downloadLink = document.createElement("a");
  const fileName = "file";

  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();
  */
  window.open(url, "_blank")
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

module.exports = { reducer, getDeepChildren, getDeepChildrenId }
},{"./actions.json":33,"./axios":34,"./capitalize":36,"./clone":38,"./cookie":43,"./counter":44,"./csvToJson":50,"./decode":52,"./droplist":54,"./erase":55,"./execute":57,"./exportJson":58,"./focus":61,"./func":62,"./function":63,"./generate":64,"./getDateTime":65,"./getDaysInMonth":66,"./getType":68,"./importJson":69,"./insert":70,"./isCondition":72,"./isEqual":73,"./isParam":74,"./note":80,"./print":85,"./refresh":87,"./remove":89,"./route":91,"./save":92,"./search":94,"./setPosition":98,"./sort":99,"./toApproval":104,"./toArray":105,"./toAwait":106,"./toCSV":107,"./toClock":108,"./toCode":109,"./toExcel":112,"./toId":115,"./toNumber":116,"./toParam":118,"./toPdf":119,"./toPrice":120,"./toSimplifiedDate":121,"./toValue":124,"./toggleView":125,"./update":126,"./updateSelf":127,"./upload":128}],87:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")

const refresh = ({ id, update = {} }) => {

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

  var innerHTML = children
  .map(child => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = parent.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = [...view["my-views"]]
    views[id].style.opacity = "0"
    if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return createElement({ id })

  }).join("")
  
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
},{"./clone":38,"./createElement":47,"./generate":64,"./setElement":97,"./starter":100,"./toArray":105,"./update":126}],88:[function(require,module,exports){
module.exports = {
    reload: () => {
        document.location.reload(true)
    }
}
},{}],89:[function(require,module,exports){
const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const remove = ({ _window, remove: _remove, id }) => {

  var views = window.views
  var view = window.views[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(view.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(`${view.Data}:()`)
    // keys.unshift(")(")
    keys.push("delete()")

    reducer({ id, path: keys })
  }

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[)(:actionlist-timer];():[)(:actionlistCaller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlistCaller.del()" })
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

},{"./clone":38,"./reducer":86,"./toCode":109,"./toParam":118,"./update":126}],90:[function(require,module,exports){
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
    lDiv.style.fontFamily = "Tajawal, sans-serif"
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

var converter = (dimension) => {
  
  if (!dimension) return 0
  if (dimension.includes("rem")) return parseFloat(dimension) * 10
  if (dimension.includes("px")) return parseFloat(dimension)
}

module.exports = {resize, dimensions, converter}

},{}],91:[function(require,module,exports){
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { search } = require("./search")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { update } = require("./update")
const { toApproval } = require("./toApproval")
const { createElement } = require("./createElement")

module.exports = {
    route: async ({ id, _window, route = {}, req, res }) => {

        var views = _window ? _window.views : window.views
        var global = _window ? _window.global : window.global
        var currentPage = global.currentPage = route.page || path.split("/")[1] || "main"

        global.currentPage = currentPage
        global.path = route.path ? path : currentPage === "main" ? "/" : (currentPage.charAt(0) === "/" ? currentPage : `/${currentPage}`)
        
        if (res) {
          
          global.updateLocation= true
          views.root.children = clone([global.data.page[currentPage]])
          if (id !== "root") global.innerHTML.root = createElement({ _window, id: "root", req, res })
          return
        }
        
        if (document.getElementsByClassName("loader-container")[0]) 
          document.getElementsByClassName("loader-container")[0].style.display = "flex"

        update({ _window, req, res, id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0

        var title = route.title || views[views.root.element.children[0].id].title
        var path = route.path || views[views.root.element.children[0].id].path

        history.pushState(null, title, path)
        document.title = title
        
        if (document.getElementsByClassName("loader-container")[0]) 
          document.getElementsByClassName("loader-container")[0].style.display = "none"
    }
}
},{"./clone":38,"./createElement":47,"./search":94,"./toApproval":104,"./toArray":105,"./toCode":109,"./toParam":118,"./update":126}],92:[function(require,module,exports){
var { clone } = require("./clone")
const { toParam } = require("./toParam")
const { generate } = require("./generate")
const { schematize } = require("./schematize")

const save = async ({ _window, req, res, id, e, _, __, ___, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var save = params.save || {}
  var view = views[id]
  var _data = clone(save.data)
  var headers = clone(save.headers) || {}
  var store = save.store || "database"

  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

  if (save.doc || save.id || (typeof _data === "object" && !Array.isArray(_data) && _data.id)) save.doc = save.doc || save.id || _data.id
  if (!save.doc && (Array.isArray(_data) ? _data.find(data => !data.id) : false)) return

  // schema
  if (save.schematize && (save.doc || save.schema)) {

    var schema = save.doc ? global[`${save.doc}-schema`] : save.schema
    if (!save.schema) return toParam({ _window, string: "note():[text=Schema does not exist!;type=danger]" })
    if (Array.isArray(_data)) _data = _data.map(data => schematize({ data, schema }))
    else _data = schematize({ data: _data, schema })
  }

  if (_window) {
    
    var collection = save.collection, success, message, project = headers.project || req.headers.project, schema
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

    var ref = req.db.collection(collection)
    if (Array.isArray(save.data)) {

      save.data.map(data => {
        
        if (!data.id) data.id = generate({ length: 20 })
        if (!data["creation-date"]) {
          data["creation-date"] = (new Date()).getTime()
          data.timezone = "GMT"
        }

        global.promises.push(ref.doc(data.id.toString()).set(data).then(() => {

          success = true
          message = `Document saved successfuly!`
    
        }).catch(error => {
    
          success = false
          message = error
        }))
      })

    } else if (save.doc) {

      var data = save.data
      if (!data.id && !save.doc && !save.id) data.id = generate({ length: 20 })
      if (!data["creation-date"]) {
        data["creation-date"] = (new Date()).getTime()
        data.timezone = "GMT"
      }
      
      global.promises.push(ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`

      }).catch(error => {

        success = false
        message = error
      }))
    }
    
    await global.promises[global.promises.length - 1]
    _data = { data: save.data, success, message }

  } else {
    
    delete save.data
    
    headers.timestamp = (new Date()).getTime()
    var { data: _data } = await require("axios").post(`/${store}`, { save, data: _data }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })
  }

  view.save = global.save = _data
  if (store === "confirmEmail") view.confirmEmail = _data

  if (!_window) console.log(_data)

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, _: _data, __: _, ___: __, params })
}

module.exports = { save }
},{"./clone":38,"./generate":64,"./schematize":93,"./toAwait":106,"./toParam":118,"axios":131}],93:[function(require,module,exports){
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
},{}],94:[function(require,module,exports){
const axios = require('axios')
const { toString } = require('./toString')
const { clone } = require('./clone')
const { toFirebaseOperator } = require('./toFirebaseOperator')

module.exports = {
  search: async ({ _window, id = "root", req, res, e, _, __, ___, ...params }) => {
      
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    var view = views[id], _data
    var search = params.search || {}
    var headers = search.headers || {}
    var store = search.store || "database"
    headers.project = headers.project || global.projectId
    search.collection = search.collection || "collection"
    global.promises = global.promises || []
    
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]
    delete search.headers
    
    if (_window) {
      
      var collection = search.collection, project = headers.project || req.headers.project
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
          data = await axios.get(url, { timeout: 1000 * 10 })
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

        global.promises.push(...promises)
        await Promise.all(promises)
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
        
        global.promises.push(ref.doc(doc.toString()).get().then(doc => {
          
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
        
        await global.promises[global.promises.length - 1]
        _data = { data, success, message }
      }

      else if (!doc && !field) {

        if (limit) ref = ref.limit(limit)
        
        global.promises.push(ref.get().then(q => {
          
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

        await global.promises[global.promises.length - 1]
        _data = { data, success, message }
      }

      else {
        const myPromise = () => new Promise(async resolve => {

          // search field
          var multiIN = false, _ref = ref
          if (field) Object.entries(field).map(([key, value]) => {

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

        global.promises.push(myPromise())
        
        await global.promises[global.promises.length - 1]
        _data = { data, success, message }
      }
      
      console.log(_data)
      view.search = global.search = clone(_data)
    
      // await params
      if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res, _: global.search, __: _, ___: __ })

    } else {

      // search
      var myFn
      headers.search = encodeURI(toString({ search }))
      headers.timestamp = (new Date()).getTime()

      if (search.url && !search.secure) {
    
        myFn = () => {
          return new Promise (async resolve => {
    
            var { data: _data } = await axios.get(search.url, {
              headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
              }
            })
    
            console.log(_data)
            view.search = global.search = clone(_data)
    
            // await params
            if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res, _: global.search, __: _, ___: __ })
    
            resolve()
          })
        }

      } else {
    
        myFn = () => {
          return new Promise (async resolve => {
    
            var { data: _data } = await axios.get(`/${store}`, {
              headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
              }
            })
    
            console.log(_data)
            view.search = global.search = clone(_data)
    
            // await params
            if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res, _: global.search, __: _, ___: __ })
    
            resolve()
          })
        }
      }

      global.promises = global.promises || []
      global.promises.push(myFn())
      
      await Promise.all(global.promises)
    }
    
    // if (_data.message === "Force reload!") return location.reload()
  }
}
},{"./clone":38,"./toAwait":106,"./toFirebaseOperator":113,"./toString":122,"axios":131}],95:[function(require,module,exports){
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

},{"./isArabic":71}],96:[function(require,module,exports){
const {clone} = require("./clone")
const {reducer} = require("./reducer")

const setData = ({ id, data }) => {

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
  reducer({ id, object: global[view.Data], path: keys, value: defValue, key: true })
/*
  view.data = value
  if (view.input && view.input.type === "file") return

  // setContent
  var content = data.content || value
  setContent({ id, content: { value: content } })
*/
}

module.exports = { setData }

},{"./clone":38,"./reducer":86}],97:[function(require,module,exports){
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
    isArabic({ id })
    
    //var timer = (new Date()).getTime()
    // resize
    /*setTimeout(() => { */if (view.type === "Input" || view.type === "Entry") resize({ id }) //}, 0)
    /*global.myTimer += (new Date()).getTime() - timer
    timer = (new Date()).getTime()*/

    // status
    view.status = "Element Loaded"
}
    
module.exports = { setElement }
},{"./controls":42,"./defaultInputHandler":53,"./isArabic":71,"./resize":90,"./toApproval":104,"./toArray":105,"./toCode":109,"./toParam":118}],98:[function(require,module,exports){
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

},{}],99:[function(require,module,exports){
(function (global){(function (){
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { toNumber } = require("./toNumber")

const sort = ({ _window, sort = {}, id, e }) => {

  var view = window.views[id]
  if (!view) return

  // data
  var Data = sort.Data || view.Data
  var options = global[`${Data}-options`] = global[`${Data}-options`] || {}
  var data = sort.data || global[Data]
  var sortBy = options.sortBy || view.sortBy || sort.sortBy || sort.by || "ascending"

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
    
    a = reducer({ id, path, object: a, e }) || "!"
    
    if (a !== undefined) {
      a = a.toString()

      // date
      if (a.split("-")[2] && !isNaN(a.split("-")[2].split("T")[0])) {
        var year = parseInt(a.split("-")[2].split("T")[0])
        var month = parseInt(a.split("-")[1])
        var day = parseInt(a.split("-")[0])
        a = {year, month, day}
        isDate = true
      }
    }

    b = reducer({ id, path, object: b, e }) || "!"

    if (b !== undefined) {
      b = b.toString()

      // date
      if (b.split("-")[2] && !isNaN(b.split("-")[2].split("T")[0])) {
        var year = parseInt(b.split("-")[2].split("T")[0])
        var month = parseInt(b.split("-")[1])
        var day = parseInt(b.split("-")[0])
        b = {year, month, day}
        isDate = true
      }
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
},{"./clone":38,"./reducer":86,"./toArray":105,"./toCode":109,"./toNumber":116}],100:[function(require,module,exports){
const control = require("../control/control")
const { toArray } = require("./toArray")

const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")
  const { defaultInputHandler } = require("./defaultInputHandler")

  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Functions"

  /* Defaults must start before controls */
  
  // on loaded image
  // if (view.type === 'Image') view.element.src = view.src

  /* End of default handlers */

  // lunch auto controls
  Object.entries(control).map(([type, control]) => {

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

},{"../control/control":14,"./controls":42,"./defaultInputHandler":53,"./event":56,"./toArray":105}],101:[function(require,module,exports){
const setState = ({}) => {}

module.exports = {setState};

},{}],102:[function(require,module,exports){
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

},{"./resize":90,"./toArray":105}],103:[function(require,module,exports){
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
},{"./capitalize":36,"./clone":38,"./style":102}],104:[function(require,module,exports){
const { isEqual } = require("./isEqual")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { toCode } = require("./toCode")
const actions = require("./actions.json")

const toApproval = ({ _window, e, string, id = "root", _, __, ___, req, res, object, _i }) => {

  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")
  const { toParam } = require("./function")
  var _functions = require("./function")

  // no string but object exists
  if (!string)
    if (object) return true
    else if (object !== undefined) return false

  // no string
  if (!string || typeof string !== "string") return true

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var mainId = id, approval = true

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

    if (condition.charAt(0) === "#") return

    // or
    if (condition.includes("||")) {
      var conditions = condition.split("||"), _i = 0
      approval = false
      while (!approval && conditions[_i] !== undefined) {
        approval = toApproval({ _window, e, string: conditions[_i], id, _, __, ___, req, res, object })
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

    if (value) value = toValue({ _window, id: mainId, value, e, _, __, ___, req, res })

    // /////////////////// key /////////////////////

    if (key && key.includes('coded()') && key.length === 12) key = global.codes[key]

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
    
    // to path
    var keygen = generate(), isFn
    var path = typeof key === "string" ? key.split(".") : [], path0 = path[0].split(":")[0], backendFn = false, isFn = false

    // function
    if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

      clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })

      // backend function
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
        if (isFn) backendFn = true
      }
    }

    if (isFn) {
      var _params = path[0].split(":")[1], args = path[0].split(":")
      if (backendFn) {
        
        if (isParam({ _window, string: args[1] })) {
  
          var _await = ""
          var _data = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
          var _func = { function: isFn, data: _data }
          if (args[2]) _await = global.codes[args[2]]
          
          return require("./func").func({ _window, id, e, _, __, ___, _i, req, res, func: _func, asyncer: true, await: _await })
        }
        
        var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
  
        return require("./func").func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
      }

      if (_params) {
        if (isParam({ _window, string: _params }))
          _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: _params })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
      }
      return approval = toApproval({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i })
    }

    if (!key && object !== undefined) view[keygen] = object
    else if (key === "false" || key === "undefined") view[keygen] = false
    else if (key === "true") view[keygen] = true
    else if (key === "mobile()" || key === "phone()") view[keygen] = global.device.type === "phone"
    else if (key === "desktop()") view[keygen] = global.device.type === "desktop"
    else if (key === "tablet()") view[keygen] = global.device.type === "tablet"
    else if (key === "_") view[keygen] = _
    else if (key === "__") view[keygen] = __
    else if (object || path[0].includes("()") || path[0].includes(")(") || (path[1] && path[1].includes("()"))) view[keygen] = reducer({ _window, id, path, e, _, __, ___, req, res, object, condition: true })
    else view[keygen] = reducer({ _window, id, path, e, _, __, ___, req, res, object: object ? object : view, condition: true })
    // else view[keygen] = key
    
    if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !view[keygen] : (view[keygen] === 0 ? true : view[keygen])
    else {
      if (equalOp) approval = notEqual ? !isEqual(view[keygen], value) : isEqual(view[keygen], value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(view[keygen]) > parseFloat(value)) : (parseFloat(view[keygen]) > parseFloat(value))
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(parseFloat(view[keygen]) < parseFloat(value)) : (parseFloat(view[keygen]) < parseFloat(value))
    }

    delete view[keygen]
  })

  return approval
}

module.exports = { toApproval }

},{"./actions.json":33,"./clone":38,"./func":62,"./function":63,"./generate":64,"./isEqual":73,"./reducer":86,"./toCode":109,"./toValue":124}],105:[function(require,module,exports){
const toArray = (data) => {
  return data !== undefined ? (Array.isArray(data) ? data : [data]) : [];
}

module.exports = {toArray}

},{}],106:[function(require,module,exports){
module.exports = {
  toAwait: ({ _window, id, e, params = {}, req, res, _, __, ___ }) => {

    const { execute } = require("./execute")
    const { toParam } = require("./toParam")
    
    if (!params.asyncer) return
    var awaiter = params.awaiter, awaits = params.await, _params

    delete params.asyncer
    delete params.awaiter
    delete params.await

    // get params
    awaits = require("./toCode").toCode({ _window, string: awaits, e })
    if (awaits && awaits.length > 0) _params = toParam({ _window, id, e, string: awaits, asyncer: true, _, __, ___, req, res })
    if (_params && _params.break) return

    // override params
    if (_params) params = { ...params, ..._params }
    if (awaiter) execute({ _window, id, e, actions: awaiter, params, _, __, ___, req, res})
  }
}
},{"./execute":57,"./toCode":109,"./toParam":118}],107:[function(require,module,exports){
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
},{}],108:[function(require,module,exports){
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
},{}],109:[function(require,module,exports){
const { generate } = require("./generate")

const toCode = ({ _window, string, e, codes, start = "[", end = "]" }) => {

  if (typeof string !== "string") return string
  var codeName = start === "'" ? "codedS()" : "coded()", global = {}
  if (!codes) global = _window ? _window.global : window.global

  // split () & )(
  if (start === "(") string = string.split("()").join("___action___").split(")(").join("___global___")

  var keys = string.split(start)
  
  if (keys.length === 1) return string.split("___action___").join("()").split("___global___").join(")(")

  if (keys[1] !== undefined) {

    var key = `${codeName}${generate()}`
    var subKey = keys[1].split(end)

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {

      keys[1] += `${start}${keys[2]}`
      if (keys[1].includes(end) && keys[2]) keys[1] = toCode({ _window, string: keys[1], e, start, end })
      keys.splice(2, 1)
      subKey = keys[1].split(end)
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) {

      keys = keys.join(start)
      if (start === "(") keys = keys.split("___action___").join("()").split("___global___").join(")(")
      return keys
    }

    if (start === "(") subKey[0] = subKey[0].split("___action___").join("()").split("___global___").join(")(")

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

  if (string.split(start)[1] !== undefined && string.split(start).slice(1).join(start).length > 0)
  string = toCode({ _window, string, e, start, end })

  // 
  if (start === "(") string = string.split("___action___").join("()").split("___global___").join(")(")

  // '...'
  // if (string.split("'").length > 2) string = toCode({ _window, string, codes, e, start: "'", end: "'" })
  return string
}

module.exports = { toCode }

},{"./generate":64}],110:[function(require,module,exports){
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

},{"./generate":64,"./toArray":105}],111:[function(require,module,exports){
const toControls = ({ id }) => {}

module.exports = {toControls}

},{}],112:[function(require,module,exports){
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
},{}],113:[function(require,module,exports){
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
},{}],114:[function(require,module,exports){
const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { colorize } = require("./colorize")
const { toCode } = require("./toCode")

const _imports = [
  "link",
  "meta",
  "title",
  "script"
]

module.exports = {
  toHtml: ({ _window, id, req, res, import: _import }) => {

    var { createElement } = require("./createElement")
    
    // views
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]
    
    // innerHTML
    var text = view.text !== undefined ? view.text.toString() : typeof view.data !== "object" ? view.data : ''
    var innerHTML = view.type !== "View" && view.type !== "Box"? text : ""
    var checked = view.input && view.input.type === "radio" && parseFloat(view.data) === parseFloat(view.input.defaultValue)
    if (view.children) view.children = toArray(view.children)

    innerHTML = toArray(view.children).map((child, index) => {

      if (!child) return ""
      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      if (!_import) views[id]["my-views"] = [...view["my-views"]]
      
      return createElement({ _window, id, req, res, import: _import })
      
    }).join("")
    
    var value = "", type = view.type

    if (view.type === "Input") value = (view.input && view.input.value) !== undefined ?
    view.input.value : view.data !== undefined ? view.data : ""

    var tag, style = toStyle({ _window, id })
    if (typeof value === 'object') value = ''

    // colorize
    if (view.colorize) {

      innerHTML = innerHTML || view.text || (view.editable ? view.data : "")
      innerHTML = toCode({ _window, string: innerHTML })
      innerHTML = toCode({ _window, string: innerHTML, start: "'", end: "'"  })
      innerHTML = colorize({ _window, string: innerHTML })
    }

    if (id === "body") return ""

    if (type === "View" || type === "Box") {
      tag = `<div ${view.draggable ? "draggable='true'" : ""} spellcheck="false" ${view.editable && !view.readonly ? "contenteditable" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML || view.text || ""}</div>`
    } else if (type === "Image") {
      tag = `<img ${view.draggable ? "draggable='true'" : ""} class='${view.class}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index || 0}' src='${view.src}'>${innerHTML}</img>`
    } else if (type === "Table") {
      tag = `<table ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</table>`
    } else if (type === "Row") {
      tag = `<tr ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</tr>`
    } else if (type === "Header") {
      tag = `<th ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</th>`
    } else if (type === "Cell") {
      tag = `<td ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</td>`
    } else if (type === "Label") {
      tag = `<label ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
    } else if (type === "Span") {
      tag = `<span ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
    } else if (type === "Text") {
      if (view.label) {
        tag = `<label ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
      } else if (view.h1) {
        tag = `<h1 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h1>`
      } else if (view.h2) {
        tag = `<h2 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h2>`
      } else if (view.h3) {
        tag = `<h3 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h3>`
      } else if (view.h4) {
        tag = `<h4 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h4>`
      } else if (view.h5) {
        tag = `<h5 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h5>`
      } else if (view.h6) {
        tag = `<h6 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h6>`
      } else if (view.span) {
        tag = `<span ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
      } else {
        tag = `<p ${view.editable || view.contenteditable ? "contenteditable ": ""}class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${text}</p>`
      }
    } /*else if (type === "Entry") {
      tag = `<div ${view.readonly ? "" : "contenteditable"} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${value}</div>`
    } */else if (type === "Icon") {
      tag = `<i ${view.draggable ? "draggable='true'" : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined": (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || ""} ${view.icon.name}' id='${view.id}' style='${style}${_window ? "; opacity:0; transition:.2s" : ""}' index='${view.index || 0}'>${view.google ? view.icon.name : ""}</i>`
    } else if (type === "Textarea") {
      tag = `<textarea ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${view.data || view.input.value || ""}</textarea>`
    } else if (type === "Input") {
      if (view.textarea) {
        tag = `<textarea ${view.draggable ? "draggable='true'" : ""} spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${value}</textarea>`
      } else {
        tag = `<input ${view.draggable ? "draggable='true'" : ""} ${view.multiple?"multiple":""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' ${view.input.name ? `name="${view.input.name}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.type || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.input.defaultValue ? `defaultValue="${view.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index || 0}'/>`
      }
    } else if (type === "Paragraph") {
      tag = `<textarea ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' index='${view.index || 0}'>${text}</textarea>`
    } else if (type === "Video") {

      tag = `<video style='${style}' controls>
        ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>`: "")}
        ${view.alt || view.message || ""}
      </video>`
      
    } else if (_imports.includes(type)) {

      delete view.text
      delete view.type
      delete view.parent
      delete view["my-views"]

      if (view.body) view.body = true
      else view.head = true

      if (type === "link" || type === "meta") {
        tag = `<${type} ${Object.entries(view).map(([key, value]) => `${key}="${value}"`).join(" ")}>`
      } else {
        tag = `<${type} ${Object.entries(view).map(([key, value]) => `${key}="${value}"`).join(" ")}>${text || ""}</${type}>`
      }
      
      if (view.body) return global.children.body += tag.replace(` body="true"`, "")
      else return global.children.head += tag.replace(` head="true"`, "")

    } else return ""

    // linkable
    if (view.link) {

      var id = generate(), style = '', _view, link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.host)

      _view = { id, parent: view.id, controls: [{ "event": `click?route():${view.link.path}?${view.link.path}` }] }
      _view.style = view.link.style
      views[id] = _view
      if (_view.style) style = toStyle({ _window, id })
      
      tag = `<a ${view.draggable ? "draggable='true'" : ""} id='${id}' href=${link} style='${style}' index='${view.index || 0}'>${tag}</a>`
    }

    return tag
  }
}
},{"./clone":38,"./colorize":39,"./createElement":47,"./generate":64,"./toArray":105,"./toCode":109,"./toStyle":123}],115:[function(require,module,exports){
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

},{"./generate":64}],116:[function(require,module,exports){
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

},{}],117:[function(require,module,exports){
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
},{}],118:[function(require,module,exports){
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { decode } = require("./decode")
const { toCode } = require("./toCode")
const { clone } = require("./clone")
const { isParam } = require("./isParam")
const { toArray } = require("./toArray")
const actions = require("./actions.json")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toParam = ({ _window, string, e, id = "root", req, res, mount, object, _, __, ___, _i, asyncer, createElement, params = {}, executer }) => {
  
  const { toApproval } = require("./toApproval")
  var _functions = require("./function")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  params = object || params

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  if (string.includes('codedS()') && string.length === 13) return global.codes[string]

  // condition not param
  if (string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, __, ___, _i, object })
  if (createElement) _ = views[id]._

  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = views[id]
    if (param === "") return
    
    // break
    if (view && (view.break || view.return)) return
    if (view && (view["break()"] || view["return()"])) return

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
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||0`
      value = `coded()${_key}+1`
    }

    // +=
    else if (key && value && key.slice(-1) === "+") {
      key = key.slice(0, -1)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||0`
      value = `coded()${_key}+${value}`
    }

    // -=
    else if (key && value && key.slice(-1) === "-") {
      key = key.slice(0, -1)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||0`
      value = `coded()${_key}-${value}`
    }

    // *=
    else if (key && value && key.slice(-1) === "*") {
      key = key.slice(0, -1)
      var _key = generate()
      global.codes[`coded()${_key}`] = `${key}||0`
      value = `coded()${_key}*${value}`
    }

    // await
    if ((asyncer || executer) && (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():")) {

      var awaiter = param.split(":").slice(1)
      if (asyncer) {
        if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
        var _params = toParam({ _window, string: awaiter[0], e, id, req, res, mount, _, __, ___, })
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

    // events attached to type
    if (createElement) {

      // mouseenter
      if (param.slice(0, 11) === "mouseenter:") {

        param = param.slice(11)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseenter = view.mouseenter || ""
        return view.mouseenter += `${param};`
      }

      // click
      if (param.slice(0, 6) === "click:") {

        param = param.slice(6)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.click = view.click || ""
        return view.click += `${param};`
      }

      // change
      if (param.slice(0, 7) === "change:") {

        param = param.slice(7)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.change = view.change || ""
        return view.change += `${param};`
      }

      // focus
      if (param.slice(0, 6) === "focus:") {

        param = param.slice(6)
        if (param.slice(0, 6) === "coded()" && param.length === 12) param = global.codes[param]
        view.focus = view.focus || ""
        return view.focus += `${param};`
      }

      // blur
      if (param.slice(0, 5) === "blur:") {

        param = param.slice(5)
        if (param.slice(0, 5) === "coded()" && param.length === 12) param = global.codes[param]
        view.blur = view.blur || ""
        return view.blur += `${param};`
      }

      // mouseleave
      if (param.slice(0, 11) === "mouseleave:") {

        param = param.slice(11)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseleave = view.mouseleave || ""
        return view.mouseleave += `${param};`
      }

      // mouseover
      if (param.slice(0, 10) === "mouseover:") {

        param = param.slice(10)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseover = view.mouseover || ""
        return view.mouseover += `${param};`
      }

      // mousedown
      if (param.slice(0, 10) === "mousedown:") {

        param = param.slice(10)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mousedown = view.mousedown || ""
        return view.mousedown += `${param};`
      }

      // mouseup
      if (param.slice(0, 8) === "mouseup:") {

        param = param.slice(8)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseup = view.mouseup || ""
        return view.mouseup += `${param};`
      }

      // keypress
      if (param.slice(0, 9) === "keypress:") {

        param = param.slice(9)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keypress = view.keypress || ""
        return view.keypress += `${param};`
      }

      // keyup
      if (param.slice(0, 6) === "keyup:") {

        param = param.slice(6)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keyup = view.keyup || ""
        return view.keyup += `${param};`
      }

      // keydown
      if (param.slice(0, 8) === "keydown:") {

        param = param.slice(8)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keydown = view.keydown || ""
        return view.keydown += `${param};`
      }

      // loaded
      if (param.slice(0, 7) === "loaded:") {

        param = param.slice(7)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.loaded = view.loaded || ""
        return view.loaded += `${param};`
      }

      // controls
      if (param.slice(0, 9) === "controls:") {

        var _controls = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _controls.push({ event: param })
        })

        view.controls = toArray(view.controls)
        view.controls.unshift(..._controls)
        return //view.controls
      }

      // children
      if (param.slice(0, 9) === "children:") {

        var _children = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ type: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return //view.children
      }

      // children
      if (param.slice(0, 6) === "child:") {

        var _children = []
        param = param.slice(6)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ type: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return //view.children
      }
    }

    // show loader
    if (!_window && param === "loader.show") {
      document.getElementsByClassName("loader-container")[0].style.display = "flex"
      return sleep(10)
    }
    
    // hide loader
    if (!_window && param === "loader.hide") {
      document.getElementsByClassName("loader-container")[0].style.display = "none"
      return sleep(10)
    }

    if (value === undefined) value = generate()
    else value = toValue({ _window, req, res, id, e, value, params, _, __, ___ })

    id = viewId
    
    var path = typeof key === "string" ? key.split(".") : [], timer, isFn = false, backendFn = false, i = path[0].split(":").length - 1, path0 = path[0].split(":")[0], pathi = path[0].split(":")[i]

    // :coded()1asd1
    if (path0 === "") return

    //////////////////////////////////// function /////////////////////////////////////////

    if (path.length === 1 && path0.slice(-2) === "()" && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

      view && clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })
      
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
        if (isFn) backendFn = true
      }

    }

    if (isFn) {

      var _params = path[0].split(":")[1], args = path[0].split(":")
      
      if (backendFn) {
        
        if (isParam({ _window, string: args[1] })) {

          var _await = ""
          var _data = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
          var _func = { function: isFn, data: _data }
          if (args[2]) _await = global.codes[args[2]]
          
          return require("./func").func({ _window, id, e, _, __, ___, _i, req, res, func: _func, asyncer: true, await: _await })
        }
        
        var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
        
        return require("./func").func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
      }

      if (_params) {

        var _key = generate()
        global.codes[`coded()${_key}`] = _params
        if (isParam({ _window, string: _params })) _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: `coded()${_key}` })
        else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
      }
      
      return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i, asyncer, createElement, params, executer })
    }
    
    // field:action()
    if (path[0] && pathi.slice(-2) === "()" && !path0.includes("()") && !_functions[pathi.slice(-2)] && !actions.includes(pathi)) {

      view && clone(view["my-views"] || []).reverse().map(view => {
        if (!isFn) {
          isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === pathi.slice(0, -2))
          if (isFn) isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
        }
      })
      
      if (!isFn) {
        isFn = (global.functions || []).find(fn => fn === pathi.slice(0, -2))
        if (isFn) backendFn = true
      }
    }

    if (isFn) {

      var _field = path[0].split(":")[0]
      var _key = generate()
      global.codes[`coded()${_key}`] = isFn

      // if (backendFn) return require("./func").func({ _window, req, res, id, e, func: `${_field}:coded()${_key}`, _, __, ___, asyncer: true })
      return toParam({ _window, string: `${_field}:coded()${_key}`, e, id, req, res, mount: true, object, _, __, ___, _i, asyncer, createElement, params, executer })
    }

    ////////////////////////////////// end of function /////////////////////////////////////////

    // object structure
    if (path.length > 1 || path[0].includes("()") || path[0].includes(")(") || object) {
      
      // break
      if (key === "break()" && value !== false) return view.break = true
      var _path = clone(params.path)
      delete params.path
      
      // mount state & value
      if ((path[0].includes("()") && (path0.slice(-2) === "()")) || path[0].slice(-3) === ":()"  || path[0].includes(")(") || path[0].includes("_") || object) {
        
        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res, _, __, ___, _i, object, mount, createElement })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(view[path.join(".")])
          view[path.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && view && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, __, ___, _i, mount, object, createElement })
        reducer({ _window, id, path, value, key, params, e, req, res, _, __, ___, _i, mount, object: params, createElement })
      }
      
      if (!params.path && _path !== undefined) params.path = _path
      
    } else if (key) {
      
      if (key === "_" && _) return _ = value
      if (id && view && mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    if (mount && createElement) {
      
      if (view && view.doc) view.Data = view.doc
      if (params.doc) params.Data = params.doc

      // mount data directly when found
      if (!mountDataUsed && ((params.data !== undefined && (!view.Data || !global[view.Data])) || params.Data || (view && view.data !== undefined && !view.Data))) {

        if (params.Data || (params.data !== undefined && !view.Data)) view.derivations = []
        mountDataUsed = true
        params.Data = view.Data = params.Data || view.Data || generate()
        params.data = global[view.Data] = view.data = view.data !== undefined ? view.data : (global[view.Data] !== undefined ? global[view.Data] : {})

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
          // console.log(schema, path,derivations, lastIndex);
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

        // reducer({ _window, id, path: view.derivations, value: view.path, key: true, params, e, req, res, _, __, ___, _i, mount, object: global[`${view.Data}-schema`] })

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

  if (params["return()"]) return params["return()"]
  return params
}

module.exports = { toParam }

},{"./actions.json":33,"./clone":38,"./decode":52,"./func":62,"./function":63,"./generate":64,"./isParam":74,"./reducer":86,"./toApproval":104,"./toArray":105,"./toCode":109,"./toValue":124}],119:[function(require,module,exports){
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
},{}],120:[function(require,module,exports){
module.exports = {
  toPrice: (string) => {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
};

},{}],121:[function(require,module,exports){
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
},{}],122:[function(require,module,exports){
const toString = (object, field) => {

  if (!object) return ""

  var string = ""
  var length = Object.entries(object).length

  Object.entries(object).map(([key, value], index) => {
    if (field) key = `${field}.${key}`

    if (Array.isArray(value)) {

      if (value.length === 0) string += `${key}=_array`
      else string += `${key}=_array:${value.join(":")}`

    } else if (typeof value === "object") {

      if (Object.keys(value).length === 0) string += `${key}=_map`
      else { 
        var path = toString(value).split(";")
        string += path.map(path => `${key}.${path}`).join(";")
      }

    } else string += `${key}=${value}`

    if (index < length - 1) string += ";"
  })

  return string || ""
}

module.exports = {toString}

},{}],123:[function(require,module,exports){
module.exports = {
  toStyle: ({ _window, id }) => {

    var view = _window ? _window.views[id] : window.views[id]
    var style = ""

    if (view.style) {
      Object.entries(view.style).map(([k, v]) => {
        if (k === "after" || k.includes(">>")) return;
        else if (k === "userSelect") k = "user-select";
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
        style += `${k}:${v}; `
      })
    }

    return style
  }
}

},{}],124:[function(require,module,exports){
const { clone } = require("./clone");
const { generate } = require("./generate")
const { isParam } = require("./isParam")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const actions = require("./actions.json")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const toValue = ({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount, asyncer, createElement, executer }) => {

  const { toParam } = require("./toParam")

  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global
  var _functions = require("./function")

  // no value
  if (!value) return value
  
  // break & return
  if (view && (view.break || view.return)) return
  if (view && (view["break()"] || view["return()"])) return
  
  // coded
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  
  // string
  if (value.split("'").length > 1) value = toCode({ _window, string: value, start: "'", end: "'" })
  if (value.includes('codedS()') && value.length === 13) {
    
    if (!object) return global.codes[value]
    else value = global.codes[value]
  }

  // (...)
  var valueParanthes = value.split("()").join("")
  if (valueParanthes.includes("(") && valueParanthes.includes(")") && valueParanthes.split("(").slice(1).find(string => string.split(")")[0] && string.split(")")[0].length > 0 && (string.split(")")[0].includes("-") || string.split(")")[0].includes("+") || string.split(")")[0].includes("*")))) { // (...)
    
    value = toCode({ _window, string: value, e, start: "(", end: ")" })
  }

  // show loader
  if (value === "loader.show") {
    document.getElementsByClassName("loader-container")[0].style.display = "flex"
    return sleep(10)
  }
  
  // hide loader
  if (value === "loader.hide") {
    document.getElementsByClassName("loader-container")[0].style.display = "none"
    return sleep(10)
  }

  // value is a param it has key=value
  if (isParam({ _window, string: value })) return toParam({ req, res, _window, id, e, string: value, _, __, ___, _i, object, mount, params, createElement })

  // or
  if (value.includes("||")) {
    var answer
    value.split("||").map(value => {
      if (!answer) answer = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount })
    })
    return answer
  }
  
  if (value.includes("+")) { // addition

    // increment
    if (value.slice(-2) === "++") {
      
      value = value.slice(0, -2)
      value = `${value}=${value}+1`
      toParam({ req, res, _window, id, e, string: value, _, __, ___, _i, object, mount, params, createElement })

    } else {

      var values = value.split("+").map(value => toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount }))
      var newVal = values[0]
      values.slice(1).map(val => newVal += val)
      return value = newVal
    }
  }
  
  if (value.includes("-")) { // subtraction

    var _value = calcSubs({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
    if (_value !== value) return _value
  }
  
  if (value.includes("*")) { // multiplication

    var values = value.split("*").map(value => toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object, mount }))
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
  
  if (value.includes("/")) { // division

    var _value = calcDivision({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
    if (_value !== value) return _value
  }

  if (value === "()") return view

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  // string
  // if (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") return value = value.slice(1, -1)

  var path = typeof value === "string" ? value.split(".") : [], isFn = false, backendFn = false, path0 = path[0].split(":")[0]
  
  // function
  if (path.length === 1 && path0.slice(-2) === "()" && !path0.includes(":") && !_functions[path0.slice(-2)] && !actions.includes(path0) && path0 !== "if()" && path0 !== "log()" && path0 !== "while()") {

    view && clone(view["my-views"] || []).reverse().map(view => {
      if (!isFn) {
        isFn = Object.keys(global.data.view[view] && global.data.view[view].functions || {}).find(fn => fn === path0.slice(0, -2))
        if (isFn) {
          isFn = toCode({ _window, id, string: (global.data.view[view].functions || {})[isFn] })
          isFn = toCode({ _window, id, string: isFn, start: "'", end: "'" })
        }
      }
    })

    // backend function
    if (!isFn) {
      isFn = (global.functions || []).find(fn => fn === path0.slice(0, -2))
      if (isFn) backendFn = true
    }
  }
  
  if (isFn) {
    var _params = path[0].split(":")[1], args = path[0].split(":")

    if (backendFn) {
      
      if (isParam({ _window, string: args[1] })) {

        var _await = ""
        var _data = toParam({ req, res, _window, id, e, _, __, ___, _i, string: args[1] })
        var _func = { function: isFn, data: _data }
        if (args[2]) _await = global.codes[args[2]]
        
        return require("./func").func({ _window, id, e, _, __, ___, _i, req, res, func: _func, asyncer: true, await: _await })
      }
      
      var _data = toValue({ req, res, _window, id, e, _, __, ___, _i, value: args[1], params })
      var _func = { function: isFn, data: _data }
      if (args[2]) _await = global.codes[args[2]]

      return require("./func").func({ _window, req, res, id, e, func: _func, _, __, ___, asyncer: true, await: _await })
    }

    if (_params) {
      if (isParam({ _window, string: _params }))
        _params = toParam({ req, res, _window, id, e, _, __, ___, _i, string: _params })
      else _params = toValue({ req, res, _window, id, e, _, __, ___, _i, value: _params })
    }
    return toParam({ _window, string: isFn, e, id, req, res, mount, object, _: (_params !== undefined ? _params : _), __: (_params !== undefined ? _ : __), ___: (_params !== undefined ? __ : ___), _i, asyncer, createElement, params, executer })
  }
  // if (isFn) return toParam({ req, res, _window, id, e, string: isFn, _, __, ___, _i, object, mount, params, createElement })

  /* value */
  if (!isNaN(value) && value !== " " && (value.length > 1 ? value.toString().charAt(0) !== "0" : true)) value = parseFloat(value)
  else if (value === " ") return value
  else if (value.slice(3, 10) === "coded()" && value.slice(0, 3) === "min") value = "min(" + global.codes[value.slice(3, 15)] + ")"
  else if (value.slice(3, 10) === "coded()" && value.slice(0, 3) === "max") value = "max(" + global.codes[value.slice(3, 15)] + ")"
  else if (value.slice(4, 11) === "coded()" && value.slice(0, 4) === "calc") value = "calc(" + global.codes[value.slice(4, 16)] + ")"
  else if (value.slice(5, 12) === "coded()" && value.slice(0, 5) === "clamp") value = "clamp(" + global.codes[value.slice(5, 17)] + ")"
  else if (value.slice(5, 12) === "coded()" && value.slice(0, 5) === "scale") value = "scale(" + global.codes[value.slice(5, 17)] + ")"
  else if (value.slice(6, 13) === "coded()" && value.slice(0, 6) === "rotate") value = "rotate(" + global.codes[value.slice(6, 18)] + ")"
  else if (value.slice(9, 16) === "coded()" && value.slice(0, 9) === "translate") value = "translate(" + global.codes[value.slice(9, 21)] + ")"
  else if (value.slice(10, 17) === "coded()" && value.slice(0, 10) === "translateX") value = "translateX(" + global.codes[value.slice(10, 22)] + ")"
  else if (value.slice(10, 17) === "coded()" && value.slice(0, 10) === "translateY") value = "translateY(" + global.codes[value.slice(10, 22)] + ")"
  else if (value.slice(15, 22) === "coded()" && value.slice(0, 15) === "linear-gradient") value = "linear-gradient(" + global.codes[value.slice(15, 27)] + ")"
  else if (object) {
    //value = value + ".clone()"
    value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  } else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  else if (path[0].includes("()") && path.length === 1) {

    var val0 = value.split("coded()")[0]
    if (value.includes('coded()') && !val0.includes("()") && !val0.includes("_map") && !val0.includes("_array") && !val0.includes("_list")) {

      value.split("coded()").slice(1).map(val => {
        val0 += toValue({ _window, value: global.codes[`coded()${val.slice(0, 5)}`], params, _, __, ___, _i, id, e, req, res, object, mount })
        val0 += val.slice(5)
      })
      value = val0

    } else value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  } else if (path[1] || path[0].includes(")(") || path[0].includes("()")) value = reducer({ _window, id, object, path, value, params, _, __, ___, _i, e, req, res, mount })
  else if (path[0].includes("_array") || path[0].includes("_map") || path[0].includes("_list")) value = reducer({ _window, id, e, path, params, object, _, __, ___, _i, req, res, mount })
  else if (value === "()") value = view
  else if (typeof value === "boolean") { }
  else if (value === undefined || value === "generate") value = generate()
  else if (value === "undefined") value = undefined
  else if (value === "false") value = false
  else if (value === "true") value = true
  else if (value === "null") value = null
  else if (value === "_") value = _
  else if (value.includes(":") && value.split(":")[1].slice(0, 7) === "coded()") {

    var args = value.split(":")
    var key = toValue({ _window, value: args[0], params, _, __, ___, _i, id, e, req, res, object, mount })

    value = args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: key, e, req, res, _, __, ___, _i, mount }))
  } 

  // _string
  else if (value === "_string") return ""
  return value
}

const calcSubs = ({ _window, value, params, _, __, ___, _i, id, e, req, res, object }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
        if (typeof num !== "number" || num === "") allAreNumbers = false
        return num
      }
    })
    
    if (allAreNumbers) {

      value = values[0]
      values.slice(1).map(val => value -= val)
      // console.log(value);
      return value

    } else if (value.split("-").length > 2) {

      var allAreNumbers = true
      var _value = value.split("-").slice(0, 2).join("-")
      var _values = value.split("-").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
          if (typeof num !== "number" || num === "") allAreNumbers = false
          return num
        }
      })

      if (allAreNumbers) {

        value = values[0]
        values.slice(1).map(val => value -= val)
        // console.log(value);
        return value
  
      } else if (value.split("-").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("-").slice(0, 3).join("-")
        var _values = value.split("-").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
            if (typeof num !== "number" || num === "") allAreNumbers = false
            return num
          }
        })

        if (allAreNumbers) {

          value = values[0]
          values.slice(1).map(val => value -= val)
          // console.log(value);
          return value
    
        }
      }
    }
  }
  
  return value
}

const calcDivision = ({ _window, value, params, _, __, ___, _i, id, e, req, res, object }) => {
  
  if (value.split("/").length > 1) {

    var allAreNumbers = true
    var values = value.split("/").map(value => {
      if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? (!value.split(":")[0].includes("()") || !value.split(":")[1].includes("()")) : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

      if (allAreNumbers) {
        
        var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
        if (typeof num !== "number" || num === "") allAreNumbers = false
        return num
      }
    })
    
    if (allAreNumbers) {

      value = values[0]
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
        if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object }))))) return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
          if (typeof num !== "number" || num === "") allAreNumbers = false
          return num
        }
      })

      if (allAreNumbers) {

        value = values[0]
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
          if (value.slice(0, 7) !== "coded()" && value.includes(":") && value.split(":")[0] !== ")(" && (value.split(":")[1] !== "()" ? !value.split(":")[0].includes("()") : (isNaN(toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })))) ) return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, value, params, _, __, ___, _i, id, e, req, res, object })
            if (typeof num !== "number" || num === "") allAreNumbers = false
            return num
          }
        })

        if (allAreNumbers) {

          value = values[0]
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

module.exports = { toValue, calcSubs, calcDivision }

},{"./actions.json":33,"./clone":38,"./func":62,"./function":63,"./generate":64,"./isParam":74,"./reducer":86,"./toCode":109,"./toParam":118}],125:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { search } = require("./search")
const { toCode } = require("./toCode")
const { toParam } = require("./toParam")

const toggleView = async ({ _window, toggle, id, res }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var togglePage = toggle.page, view = {}
  var viewId = toggle.viewId || toggle.view
  var toggleId = toggle.id
  var parentId = toggle.parent
  if (togglePage) parentId = "root"
  if (!toggleId) {
    if (!parentId) parentId = id
    toggleId = views[parentId].element.children[0] && views[parentId].element.children[0].id
  } else if (!parentId) parentId = views[toggleId].element.parentNode.id && views[toggleId].element.parentNode.id
  
  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  document.getElementsByClassName("loader-container")[0].style.display = "flex"

  // children
  var children = clone([global.data.view[viewId]])
  if (togglePage) {

    var currentPage = global.currentPage = togglePage.split("/")[0]
    
    viewId = currentPage
    /*global.path = togglePage = togglePage === "main" ? "/" : togglePage

    history.pushState({}, title, togglePage)
    document.title = title
    view = views.root*/

  } else view = views[parentId]

  
  if (children.length === 0) return
  if (!view || !view.element) return

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[)(:actionlist-timer];():[)(:actionlistCaller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlistCaller.del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }
        
  if (res) {
    
    views.root.children = clone([global.data.page[currentPage]])
    return
  }

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 0

  if (toggleId && views[toggleId] && views[toggleId].element) {
    
    views[toggleId].element.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
    views[toggleId].element.style.transform = toggle.fadeout.after.transform || null
    views[toggleId].element.style.opacity = toggle.fadeout.after.opacity || "0"
    
    removeChildren({ id: toggleId })
    delete views[toggleId]
  }
  
  var innerHTML = children
    .map((child, index) => {

      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      views[id].style = {}
      views[id]["my-views"] = [...view["my-views"], viewId]
      views[id].style.transition = toggle.fadein.before.transition || null
      views[id].style.opacity = toggle.fadein.before.opacity || "0"
      views[id].style.transform = toggle.fadein.before.transform || null

      return createElement({ id })

    }).join("")

  // timer
  var timer = toggle.timer || toggle.fadein.timer || 0
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML
  
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))

  // set visible
  setTimeout(() => {
  
    var children = [...view.element.children]
    children.map(el => {

      var id = el.id
      views[id].style.transition = el.style.transition = toggle.fadein.after.transition || `${timer}ms ease-out`
      views[id].style.transform = el.style.transform = toggle.fadein.after.transform || null
      views[id].style.opacity = el.style.opacity = toggle.fadein.after.opacity || "1"
    })
    
    document.getElementsByClassName("loader-container")[0].style.display = "none"
    
  }, timer)
}

module.exports = { toggleView }
},{"./clone":38,"./createElement":47,"./generate":64,"./search":94,"./setElement":97,"./starter":100,"./toCode":109,"./toParam":118,"./update":126}],126:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const update = async ({ id, _window, req, res, update = {} }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.views : window.global
  var view = views[id]
  
  if (!view || !view.element) return

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ _window, req, res, string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[)(:actionlist-timer];():[)(:actionlistCaller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlistCaller.del()" })
    toParam({ _window, req, res, string: closeActionlist, id: "actionlist" })
  }

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") views.root.children = children = clone([global.data.page[global.currentPage]])
  
  var innerHTML = children
  .map((child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = [...view["my-views"]]
    
    return createElement({ _window, req, res, id })

  }).join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML

  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ _window, req, res, id }))
  idList.map(id => starter({ _window, req, res, id }))
  
  view.update = global.update = { view: views[id], message: "View updated successfully!", success: true }
}

const removeChildren = ({ id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]
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
},{"./clone":38,"./createElement":47,"./generate":64,"./setElement":97,"./starter":100,"./toArray":105,"./toCode":109,"./toParam":118}],127:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toCode } = require("./toCode")

const updateSelf = ({ _window, id, update = {} }) => {

  var views = window.views
  var view = views[id]
  var global = window.global
  var timer = update.timer || 0
  
  if (!view || !view.element) return
  var parent = views[view.parent]
  var index = view.index || 0

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[)(:actionlist-timer];():[)(:actionlistCaller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlistCaller.del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }

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

  var innerHTML = children
  .map(child => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = parent.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = [...view["my-views"]]
    //views[id].style.opacity = "0"
    //if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return createElement({ id })

  }).join("")
  
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
  
  /*var _children = [...node.children]
  
  if (timer) setTimeout(() => _children.map(el => views[el.id].style.opacity = views[el.id].element.style.opacity = "1"), timer || 0)
  else _children.map(el => views[el.id].element.style.opacity = views[el.id].style.opacity = "1")*/
  
  view.update = { view: views[node.id], message: "View updated succefully!", success: true }
}

module.exports = {updateSelf}
},{"./clone":38,"./createElement":47,"./generate":64,"./setElement":97,"./starter":100,"./toArray":105,"./toCode":109,"./update":126}],128:[function(require,module,exports){
const axios = require("axios")
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const upload = async ({ id, _window, req, res, e, _, __, ___, ...params }) => {
        
  var upload = params.upload, promises = []
  var global = window.global
  var view = window.views[id]
  var alldata = toArray(upload.data || [])
  var headers = clone(upload.headers) || {}
  var files = toArray(upload.file || upload.files)
  var docs = toArray(upload.doc || upload.docs || [])

  upload.collection = upload.collection || "storage"
  headers.project = headers.project || global.projectId

  delete upload.headers

  files.map(async (f, i) => {

    if (upload.file) delete upload.file
    if (upload.files) delete upload.files

    var data = alldata[i] || {}
    var file = await readFile(f)
    upload.doc = docs[i] || generate({ length: 20 })
    data.name = data.name || generate({ length: 20 })

    // get file type
    var type = files[i].type
    data.type = type.split("/").join("-")
    
    // get regex exp
    var regex = new RegExp(`^data:${type};base64,`, "gi")
    file = file.replace(regex, "")
    
    // access key
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]

    // data
    upload.data = clone(data)
    
    if (!view) return
    promises.push(await axios.post(`/storage`, { upload, file }, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    }))

    if (promises.length === files.length) {

      promises.map(({ data }, i) => {

        if (!view) return
        if (i === 0) {
          view.uploads = []
          global.uploads = []
        }
        
        view.uploads.push(clone(data))
        view.upload = clone(data)
        
        global.upload = clone(data)
        global.uploads.push(clone(data))
    
        if (files.length > 1) console.log(view.uploads)
        else console.log(view.upload)
      })
    
      // await params
      if (params.asyncer) require("./toAwait").toAwait({ _window, req, res, id, e, _: data, __: _, ___: __, params })
    }
  })
}

const readFile = (file) => {
  return new Promise(res => {

    if (typeof file === "string" && file.slice(0, 5) === "data:") res(file)
    else { 
      let myReader = new FileReader()
      myReader.onloadend = () => res(myReader.result)
      myReader.readAsDataURL(file)
    }
  })
}

module.exports = { upload }

/* const { capitalize } = require("./capitalize")
const { save } = require("./save")
const { toAwait } = require("./toAwait")

module.exports = {
    upload: async ({ id, e, upload = {}, ...params }) => {

        var global = window.global
        var value = window.views
        var view = value[id]
        var storage = global.storage
        
        upload.save = upload.save !== undefined ? upload.save : true
        
        await storage.child(`images/${view.file.fileName}.${view.file.fileType}`).put(view.file.src)
        await storage.child(`images/${view.file.fileName}.${view.file.fileType}`).getDownloadURL().then(url => view.file.url = url)
        
        view.file.id = `${view.file.fileName}.${view.file.fileType}`
        var _save = { path: "image", data: {
            "creation-date": new Date().getTime() + 10800000 + "", name: `${view.file.fileName}.${view.file.fileType}`, id: `${view.file.fileName}.${view.file.fileType}`, url: view.file.url, description: `${capitalize(view.file.fileName.split('-')[0])} Image`, active: true
        }}

        upload.save && await save({ ...params, save: _save, id, e })

        !upload.save && toAwait({ id, params, e })
    }
}*/
},{"./clone":38,"./generate":64,"./toArray":105,"./toAwait":106,"axios":131}],129:[function(require,module,exports){
const wait = async ({ id, e, ...params }) => {

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ id, e, params })
}

module.exports = { wait }
},{"./toAwait":106}],130:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")

const watch = ({ _window, controls, id }) => {

    const { execute } = require("./execute")

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, id, string: controls.watch })

    // 'string'
    if (watch.split("'").length > 2) watch = toCode({ _window, string: watch, start: "'", end: "'" })

    var approved = toApproval({ id, string: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500
        view[`${_watch}-watch`] = clone(toValue({ id, value: _watch }))
        
        const myFn = async () => {
            
            if (!window.views[id]) return clearInterval(view[`${_watch}-timer`])
            
            var value = toValue({ id, value: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, string: watch.split('?')[1], mount: true })

            // break
            if (view["break()"]) delete view["break()"]
            if (view["return()"]) return delete view["return()"]
            
            if (view["once"] || view["once()"]) {

                delete view["once"]
                clearInterval(view[`${_watch}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions || controls.action) await execute({ controls, id })
                
            // await params
            if (view.await) toParam({ id, string: view.await.join(';') })
        }

        if (view[`${_watch}-timer`]) clearInterval(view[`${_watch}-timer`])
        view[`${_watch}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }
},{"./clone":38,"./execute":57,"./isEqual":73,"./toApproval":104,"./toCode":109,"./toParam":118,"./toValue":124}],131:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":133}],132:[function(require,module,exports){
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

},{"../core/buildFullPath":139,"../core/createError":140,"./../core/settle":144,"./../helpers/buildURL":148,"./../helpers/cookies":150,"./../helpers/isURLSameOrigin":153,"./../helpers/parseHeaders":155,"./../utils":158}],133:[function(require,module,exports){
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

},{"./cancel/Cancel":134,"./cancel/CancelToken":135,"./cancel/isCancel":136,"./core/Axios":137,"./core/mergeConfig":143,"./defaults":146,"./helpers/bind":147,"./helpers/isAxiosError":152,"./helpers/spread":156,"./utils":158}],134:[function(require,module,exports){
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

},{}],135:[function(require,module,exports){
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

},{"./Cancel":134}],136:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],137:[function(require,module,exports){
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

},{"../helpers/buildURL":148,"../helpers/validator":157,"./../utils":158,"./InterceptorManager":138,"./dispatchRequest":141,"./mergeConfig":143}],138:[function(require,module,exports){
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

},{"./../utils":158}],139:[function(require,module,exports){
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

},{"../helpers/combineURLs":149,"../helpers/isAbsoluteURL":151}],140:[function(require,module,exports){
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

},{"./enhanceError":142}],141:[function(require,module,exports){
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

},{"../cancel/isCancel":136,"../defaults":146,"./../utils":158,"./transformData":145}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
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

},{"../utils":158}],144:[function(require,module,exports){
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

},{"./createError":140}],145:[function(require,module,exports){
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

},{"./../defaults":146,"./../utils":158}],146:[function(require,module,exports){
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
},{"./adapters/http":132,"./adapters/xhr":132,"./core/enhanceError":142,"./helpers/normalizeHeaderName":154,"./utils":158,"_process":161}],147:[function(require,module,exports){
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

},{}],148:[function(require,module,exports){
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

},{"./../utils":158}],149:[function(require,module,exports){
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

},{}],150:[function(require,module,exports){
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

},{"./../utils":158}],151:[function(require,module,exports){
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

},{}],152:[function(require,module,exports){
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

},{}],153:[function(require,module,exports){
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

},{"./../utils":158}],154:[function(require,module,exports){
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

},{"../utils":158}],155:[function(require,module,exports){
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

},{"./../utils":158}],156:[function(require,module,exports){
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

},{}],157:[function(require,module,exports){
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

},{"./../../package.json":159}],158:[function(require,module,exports){
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

},{"./helpers/bind":147}],159:[function(require,module,exports){
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

},{}],160:[function(require,module,exports){

},{}],161:[function(require,module,exports){
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

},{}]},{},[1]);
