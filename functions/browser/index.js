(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { starter } = require("../function/starter")
const { setElement } = require("../function/setElement")
const { getCookie } = require("../function/cookie")
const { toParam } = require("../function/toParam")
const { toApproval } = require("../function/toApproval")
const { execute } = require("../function/execute")
const { toCode } = require("../function/toCode")

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
var views = window.views
var global = window.global

// access key
global["access-key"] = getCookie({ name: "_key" })
global["body-click-events"] = {}
global["body-mousemove-events"] = {}
global["body-mousedown-events"] = {}
global["body-mouseup-events"] = {}

views.document = document
views.document.element = document
views.body.element = document.body
// views.window = { element: window }

// lunch arabic text
var _ar = document.createElement("P")
_ar.innerHTML = "مرحبا"
_ar.classList.add("ar")
_ar.style.position = "absolute"
_ar.style.top = "-1000px"
views.body.element.appendChild(_ar)

history.pushState(null, global.data.page[global.currentPage].title, global.path)

// clicked element
document.addEventListener('click', e => {

    var global = window.global
    global["clickedElement()"] = views[(e || window.event).target.id]
    global.clickedElement = (e || window.event).target

    // droplist
    if (global.clickedElement.id === "droplist") delete global["droplist-item-clicked"]
    else if (views.droplist.element.contains(global.clickedElement)) {
        global["droplist-item-clicked"] = global["droplist-item"] = global.clickedElement
        global["droplist-item-txt"] = global["droplist-txt"] = global.clickedElement.innerHTML
    }

    // actionlist
    else if (global.clickedElement.id === "actionlist") delete global["actionlist-item-clicked"]
    else if (views.droplist.element.contains(global.clickedElement)) {
        global["actionlist-item-clicked"] = global["actionlist-item"] = global.clickedElement
        global["actionlist-item-txt"] = global["actionlist-txt"] = global.clickedElement.innerHTML
    }
    
    // body event listeners
    Object.values(global["body-click-events"]).flat().map(o => bodyEventListener(o, e))
}, false)

// mousemove
document.body.addEventListener('mousemove', (e) => {
    Object.values(window.global["body-mousemove-events"]).flat().map(o => bodyEventListener(o, e))
}, false)

document.addEventListener("mousedown", (e) => {
    window.global.mousedown = true
    Object.values(window.global["body-mousedown-events"]).flat().map(o => bodyEventListener(o, e))
})

document.addEventListener("mouseup", (e) => {
    window.global.mousedown = false
    Object.values(window.global["body-mouseup-events"]).flat().map(o => bodyEventListener(o, e))
})

// default global mode
global.mode = global["default-mode"] = global["default-mode"] || "Light"
global.idList.map(id => setElement({ id }))
global.idList.map(id => starter({ id }))

var icons = global.idList.filter(id => views[id] && views[id].type === "Icon" && views[id].google).map(id => views[id])
window.onload = () => {
    icons.map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
    })
}

Object.entries(views).map(([id, views]) => {
    if (views.status === "Loading") delete views[id]
})

document.addEventListener('scroll', () => {
    
    // close droplist
    if (views.droplist.element.style.pointerEvents === "auto") {
        
        var closeDroplist = toCode({ string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
        toParam({ string: closeDroplist, id: "droplist" })
    }
  
    // close actionlist
    if (views.actionlist.element.style.pointerEvents === "auto") {

        var closeActionlist = toCode({ string: "clearTimer():[)(:actionlist-timer];():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()" })
        toParam({ string: closeActionlist, id: "actionlist" })
    }
}, true)

        
// body clicked
var bodyEventListener = async ({ id, viewEventConditions, viewEventParams, events, once, controls, index, event }, e) => {
    
    if (!views[id]) return
    e.target = views[id].element
    
    // approval
    if (viewEventConditions) {
        var approved = toApproval({ string: viewEventConditions, id, e })
        if (!approved) return
    }

    // approval
    var approved = toApproval({ string: events[2], id, e })
    if (!approved) return

    // once
    if (once) window.global[`body-${event}-events`][id].splice(index, 1)
    
    // params
    await toParam({ string: events[1], id, mount: true, eventParams: true, e })
    
    // approval
    if (viewEventParams) await toParam({ string: viewEventParams, id, mount: true, eventParams: true, e })
    
    // execute
    if (controls.actions) await execute({ controls, id, e })
}
},{"../function/cookie":40,"../function/execute":53,"../function/setElement":88,"../function/starter":91,"../function/toApproval":95,"../function/toCode":100,"../function/toParam":107}],2:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

  component = toComponent(component)
  var { check, style } = component
  check = check || {}

  return {
    ...component,
    "type": `View?class=flexbox pointer;style.height=2rem;style.width=2rem;style.borderRadius=.25rem;style.transition=.1s;style.backgroundColor=#fff;style.border=1px solid #ccc;click.style.backgroundColor=#2C6ECB;click.style.border=1px solid #ffffff00;click.sticky;${toString({ style })}`,
    "children": [{
      "type": `Icon?name=bi-check;style.color=#fff;style.fontSize=2rem;style.opacity=0;style.transition=.1s;${toString(check)}`
    }],
    "controls": [{
      "event": "click?().element.checked=if():[().element.checked]:false.else():true;().1stChild().element.style.opacity=[1].if().[().element.checked].else().[0];().data()=[true].if().[().element.checked].else().[false]"
    }]
  }
}

},{"../function/toComponent":101}],3:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')
const { override } = require('../function/merge')
const { clone } = require('../function/clone')

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

    var { id, input, model, droplist, readonly, style, controls, duplicated, duration, required,
        placeholder, textarea, clearable, removable, day, disabled, label, password,
        duplicatable, lang, unit, currency, google, key, minlength , children, container
    } = component
    
    if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
    if (clearable && typeof clearable !== "object") clearable = {}

    readonly = readonly ? true : false
    removable = removable !== undefined ? (removable === false ? false : true) : false

    if (duplicatable) removable = true
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
    
    // var path = `${unit ? `path=amount` :  currency ? `path=${currency}` : duration ? `path=${duration}` : day ? `path=${day}` : lang ? `path=${lang}` : google ? `path=name` : key ? `path=${key}` : ''}`

    if (label && (label.location === "inside" || label.position === "inside")) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var password = component.password && true
        component.controls = component.controls || []
        
        delete component.parent
        delete component.label
        delete component.path
        delete component.id
        delete component.password
        delete component.derivations

        return {
            id, path, Data, parent, derivations, tooltip: component.tooltip,
            "type": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=100%;${toString(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                    "type": `Text?text=${label.text || "Label"};style.color=#888;style.fontSize=1.1rem;style.width=fit-content;${toString(label)}`,
                    "controls": [{
                        "event": "click?next().getInput().focus()"
                    }]
                }, Input({ ...component, component: true, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
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
                "event": "click:body?style().border=if():[)(:clickedElement.outside():[().element]]:[1px solid #ccc]:[2px solid #008060]?!contains():[)(:clickedElement];!droplist.contains():[)(:clickedElement]"
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
        var clicked = component.clicked = component.clicked || { style: {} }
        component.clicked.preventDefault = true
        component.controls = component.controls || []
        
        delete component.label
        delete component.path
        delete component.id
        delete component.tooltip
        label.tooltip = tooltip

        return {
            id, Data, parent, derivations, required, path,
            "type": `View?class=flex start column;style.gap=.5rem;${toString(container)}`,
            "children": [{
                "type": `Text?id=${id}-label;text=${label.text || "Label"};style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${toString(label)}`
            }, 
                Input({ ...component, component: true, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
            {
                "type": "View?class=flex start align-center gap-1;style.alignItems=center;style.display=none",
                "children": [{
                    "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
                }, {
                    "type": `Text?text=Input is required;style.color=#D72C0D;style.fontSize=1.4rem;${toString(required)}`
                }]
            }],
            "controls": [{
                "event": `click:[1stChild().id];click:[2ndChild().id]?if():[!getInput().focus]:[getInput().focus()];2ndChild().style().border=${clicked.style.border || "2px solid #008060"}`
            }, {
                "event": `click:body?2ndChild().style().border=${style.border || "1px solid #ccc"}?!contains():[)(:clickedElement];!droplist.contains():[)(:clickedElement]`
            }]
        }
    }

    if (model === 'featured' || password || clearable || removable) {
        
        return {
            ...component,
            type: 'View',
            class: 'flex-box unselectable',
            // remove from comp
            controls: [{
                event: "mouseenter?():[().id+'-clear'].style().opacity=1?clearable||removable"
            }, {
                event: "mouseleave?():[().id+'-clear'].style().opacity=0?clearable||removable"
            }],
            style: {
                display: "inline-flex",
                alignItems: "center",
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
                type: `Text?id=parent().id+-msg;msg=parent().msg;text=parent().msg?parent().msg`,
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
                class: `${input.class} ${component.class.includes("ar") ? "ar" : ""}`,
                // droplist,
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
                placeholder,
                duplicated,
                disabled,
                templated: true,
                'placeholder-ar': component['placeholer-ar'],
                hover: {
                    ...input.hover,
                    style: {
                        backgroundColor: style.after.backgroundColor,
                        color: style.after.color || style.color,
                        ...input.style.after,
                        ...input.hover.style
                    }
                },
                style: {
                    width: password || clearable || removable ? "100%" : "fit-content",
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
                    event: "select;mousedown?e().preventDefault()"
                }/*, {
                    event: "input?parent().parent().required.mount=false;parent().parent().click()?parent().parent().required.mount;e().target.value"
                }*/]
            }, {
                type: "Icon?class=pointer;id=parent().id+-clear;name=bi-x-lg;style:[position=absolute;right=if():[parent().password]:4rem:0;width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.5rem;backgroundColor=#fff;borderRadius=.5rem];click:[if():[parent().clearable;prev().val()]:[prev().data().del();prev().val()=;prev().focus()].elif():[parent().clearable]:[prev().focus()].elif():[parent().removable;!prev().val();parent().data().len()!=1]:[parent().rem()]]?parent().clearable||parent().removable",
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
    }

    if (model === 'classic' && !password) {
        return {
            ...component,
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
                ...input.style,
                ...style,
            },
            controls: [...controls, {
                event: "input?parent().required.mount=false;parent().click()?parent().required.mount;e().target.value.exist()"
            }]
        }
    }
}

module.exports = Input
},{"../function/clone":36,"../function/merge":72,"../function/toComponent":101,"../function/toString":110}],4:[function(require,module,exports){
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

},{"../function/toComponent":101}],5:[function(require,module,exports){
const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)
    
    return {
        ...component,
        type: "View?if():[!)(:opened-maps]:[)(:opened-maps=_array];class=flex-column;style.width=100%;if():[().isField]:[style():[marginLeft=2rem;borderLeft=1px solid #ddd;width=calc(100% - 2rem)]];mode.dark.style.borderLeft=1px solid #888",
        children: [{
            type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem?!parent().isField",
            controls: [{
                event: "click?().opened=1stChild().style().transform.includes():rotate(90deg);parent().children().pull():0.pullLast().():[style().display=if():[().opened]:none.else():flex];1stChild().style().transform=if():[().opened]:rotate(0deg).else():rotate(90deg);1stChild().2ndlast().style().display=if():[().opened]:flex.else():none;lastSibling().style().display=if():[().opened]:none.else():flex;1stChild().3rdlast().style().display=if():[().opened]:flex.else():none?)(:clickedElement.id!=2ndChild().id;)(:clickedElement.id!=3rdChild().id;)(:clickedElement.id!=lastChild().1stChild().id"
            }, {
                event: "mouseenter?lastChild().style().opacity=1"
            }, {
                event: "mouseleave?lastChild().style().opacity=0"
            }],
            children: [{
                type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s"
            }, {
                type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%"
            }, {
                type: "Text?class=pointer;text=...;style.display=none;mode.dark.style.color=#888;style.fontSize=1.4rem"
            }, {
                type: "Text?style.display=none;text=};style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem"
            }, {
                type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                children: [{
                    type: "Icon?mainMap;name=bi-three-dots-vertical;actionlist.undeletable;actionlist.placement=left;mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                }]
            }]
        }, {
            type: "[View]?class=flex column;sort;arrange=parent().arrange;style.marginLeft=if():[!parent().isField]:2rem:0?data().isdefined()",
            children: [{
                type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem?derivations().lastElement()!=id;derivations().lastElement()!=creation-date",
                controls: [{
                    event: "click?():[next().id].style().display=if():[next().style().display=flex]:none.else():flex;():[1stChild().id].style().transform=if():[1stChild().style().transform.includes():rotate(0deg)]:rotate(90deg).else():rotate(0deg);1stChild().2ndlast().style().display=if():[1stChild().2ndlast().style().display=flex]:none.else():flex;next().next().style().display=if():[next().next().style().display=flex]:none.else():flex;1stChild().3rdlast().style().display=if():[1stChild().3rdlast().style().display=flex||data().len()=0]:none.else():flex?data().type()=array||data().type()=map;)(:clickedElement.id!=2ndChild().id;)(:clickedElement.id!=3rdChild().id;)(:clickedElement.id!=lastChild().1stChild().id"
                }, {
                    event: "mouseenter?lastChild().style().opacity=1"
                }, {
                    event: "mouseleave?lastChild().style().opacity=0"
                }],
                children: [{
                    type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s?data().type()=map||data().type()=array"
                }, {
                    type: "View?style.minWidth=2rem;text=?data().type()!=map;data().type()!=array"
                }, {
                    type: "Input?preventDefault;mode.dark.style.color=#8cdcfe;style.height=3.2rem;style.border=1px solid #ffffff00;mode.dark.style.border=1px solid #131313;hover.style.border=1px solid #ddd;input.style.color=blue;input.value=derivations().lastElement();style.borderRadius=.5rem;style.minWidth=fit-content;style.width=fit-content?derivations().lastElement().num().type()!=number",
                    controls: [{
                        event: "input?Data().path():[derivations().clone().pull():[derivations().lastIndex()].push():val()]=data().clone();data().del();parent().parent().deepChildren().():[derivations.[derivations().lastIndex()]=val()]"
                    }, {
                        event: "keyup?if():[)(:droplist-positioner;)(:keyup-index]:[():droplist.children().[)(:keyup-index].click();timer():[)(:keyup-index.del()]:200;().break=true];)(:keyup-index=0;if():[)(:droplist-positioner!=next().id]:[next().click()];timer():[():droplist.children().0.mouseenter()]:200?e().key=Enter"
                    }, {
                        event: "keyup?():droplist.mouseleave()?e().key=Escape"
                    }, {
                        event: "keyup?():droplist.children().[)(:keyup-index].mouseleave();)(:keyup-index=if():[e().keyCode=40]:[)(:keyup-index+1]:[)(:keyup-index-1];():droplist.children().[)(:keyup-index].mouseenter()?e().keyCode=40||e().keyCode=38;)(:droplist-positioner;if():[e().keyCode=38]:[)(:keyup-index>0].elif():[e().keyCode=40]:[)(:keyup-index<next().droplist.items.lastIndex()]"
                    }]
                }, {
                    type: "Text?text=derivations().lastElement();class=flex-box;mode.dark.style.color=#888;style.color=#666;style.fontSize=1.4rem;style.marginRight=.5rem;style.minWidth=3rem;style.minHeight=2rem;style.borderRadius=.5rem;style.border=1px solid #ddd?derivations().lastElement().num().type()=number"
                }, {
                    type: "Text?text=:;class=flex-box pointer;mode.dark.style.color=#888;style.fontSize=1.5rem;style.marginRight=.5rem;style.minWidth=2rem;style.minHeight=2rem;style.paddingBottom=.25rem;style.borderRadius=.5rem;hover.style.backgroundColor=#e6e6e6;droplist.items=_array:children:controls:string:number:boolean:map:array:timestamp:geopoint;droplist.isMap"
                }, {
                    type: `Text?text=";mode.dark.style.color=#c39178;style.color=#a35521;style.marginRight=.3rem;style.fontSize=1.4rem?data().type()=string`
                }, {
                    type: "Text?class=flexbox;text=[;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?data().type()=array"
                }, {
                    type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?data().type()=map"
                }, {
                    type: "View?style.overflow=auto;style.whiteSpace=nowrap?data().type()=string",
                    children: [{
                        type: "View?style.display=inline-flex",
                        children: [{
                            type: "Input?mode.dark.style.color=#c39178;if():[derivations().lastElement()=id]:[input.readonly=true];style.maxHeight=3.2rem;style.height=3.2rem;mode.dark.style.border=1px solid #131313;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;style.borderRadius=.5rem;input.style.color=#a35521",
                            controls: [{
                                event: "keyup?)(:insert-index=parent().parent().parent().parent().parent().children().findIndex():[id=parent().parent().parent().parent().id]+1;if():[parent().parent().parent().parent().parent().data().type()=map]:[parent().parent().parent().parent().parent().data().[_string]=_string];if():[parent().parent().parent().parent().parent().data().type()=array]:[parent().parent().parent().parent().parent().data().splice():_string:[)(:insert-index]];if():[)(:insert-index.less():[parent().parent().parent().parent().parent().data().len()+1];parent().parent().parent().parent().parent().data().type()=array]:[parent().parent().parent().parent().parent().children().slice():[)(:insert-index]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;)(:last-index=_.derivations.lastIndex();)(:el-index=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[)(:last-index]=)(:el-index]]]?e().key=Enter",
                                actions: "async():[insert:[parent().parent().parent().parent().parent().id]]?insert.component=parent().parent().parent().parent().parent().children.1;insert.path=if():[parent().parent().parent().parent().parent().data().type()=array]:[parent().parent().parent().parent().parent().derivations.clone().push():[)(:insert-index]].else():[parent().parent().parent().parent().parent().derivations.clone().push():_string];insert.index=)(:insert-index;async():[().insert.view.getInput().focus()]"
                            }]
                        }]
                    }]
                }, {
                    type: "Input?style.height=3.2rem;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.type=number;input.style.color=olive;style.width=fit-content;style.borderRadius=.5rem?data().type().is():number",
                    controls: [{
                        event: "keyup?if():[parent().parent().parent().data().type()=map]:[)(:insert-index=parent().parent().parent().children().findIndex():[id=parent().parent().id]+1;parent().parent().parent().data().field():_string:_string];if():[parent().parent().parent().data().type()=array]:[parent().parent().parent().data().splice():_string:[)(:insert-index]];if():[)(:insert-index.less():[parent().parent().parent().data().len()+1];parent().parent().parent().data().type()=array]:[parent().parent().parent().children().slice():[)(:insert-index]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;)(:last-index=_.derivations.len()-1;#;)(:el-index=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[)(:last-index]=)(:el-index]]]?e().key=Enter",
                        actions: "insert:[parent().parent().parent().id]?insert.component=parent().parent().parent().children.1;insert.path=if():[parent().parent().parent().data().type()=array]:[parent().parent().parent().derivations.clone().push():[)(:insert-index]].else():[parent().parent().parent().derivations.clone().push():_string];insert.index=)(:insert-index"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;readonly;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.color=purple;style.width=fit-content;style.borderRadius=.5rem;droplist.items=_array:true:false?data().type()=boolean"
                }, {
                    type: "Input?style.height=3.2rem;input.type=datetime-local;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?data().type()=timestamp",
                    controls: [{
                        event: "change?data()=val().date().timestamp()"
                    }, {
                        event: "loaded?val()=data().date().getDateTime()"
                    }]
                }, {
                    type: `Text?text=";mode.dark.style.color=#c39178;style.marginLeft=.3rem;style.color=#a35521;style.fontSize=1.4rem?data().type()=string`
                }, {
                    type: "Text?class=pointer;style.display=none;mode.dark.style.color=#888;text=...;style.fontSize=1.4rem?data().type()=array||data().type()=map;data().len().greater():0"
                }, {
                    type: "Text?style.display=none;text=];style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?data().type()=array"
                }, {
                    type: "Text?style.display=none;text=};style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?data().type()=map"
                }, {
                    type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                    children: [{
                        type: "Icon?actionlist.placement=left;mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;icon.name=bi-three-dots-vertical;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                    }]
                }]
            }, {
                type: "View?arrange=parent().arrange;class=flex-start;style.display=flex;style.transition=.2s?data().type()=map||data().type()=array",
                children: [{
                    type: "Map?arrange=parent().arrange;isField"
                }]
            }, {
                type: "Text?class=flex-box;text=];mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?data().type()=array"
            }, {
                type: "Text?class=flex-box;text=};mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?data().type()=map"
            }]
        }, {
            type: "Text?class=flexbox;style.justifyContent=flex-start;text=};style.marginLeft=2rem;style.paddingBottom=.25rem;style.height=2.5rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?!parent().isField",
        }]
    }
}
},{"../function/toComponent":101}],6:[function(require,module,exports){
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
        type: "View?class=swiper",
        children: [{
            type: "View?style.display=inline-flex;style.alignItems=center;style.height=100%",
            ...component.innerbox,
            children: component.children
        }]
    }
}
},{"../function/toComponent":101}],7:[function(require,module,exports){
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
    type: `View?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${toString({ style })}`,
    children: [{
      type: `View?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${toString(pin)}`,
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

},{"../function/toComponent":101,"../function/toString":110}],8:[function(require,module,exports){
module.exports = {
  Input : require("./Input"),
  Item : require("./Item"),
  Switch : require("./Switch"),
  Checkbox : require("./Checkbox"),
  Map : require("./Map"),
  Swiper : require("./Swiper")
}

},{"./Checkbox":2,"./Input":3,"./Item":4,"./Map":5,"./Swiper":6,"./Switch":7}],9:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  window.views[id].actionlist.id = controls.id = id = controls.id || id
  
  return [{
    event: `click?if():[)(:actionlist-caller!=${id}]:[():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._]];clearTimer():[)(:actionlist-timer];if():[)(:actionlist-caller=${id}]:[timer():[():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()]:0]`,
    actions: `async():[update:actionlist]:[setPosition:actionlist]?().actionlist.undeletable=():actionlist.undeletable||_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;)(:actionlist-caller=${id};)(:actionlist-caller-id=${id};path=${controls.path || ""};():actionlist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align};().actionlist.style.keys()._():[():actionlist.style()._=().actionlist.style._]?)(:actionlist-caller!=().id`
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
module.exports = ({ controls, id }) => {

    var local = window.views[id]
    var _id = controls.id || id
    
    local.clicked.default = local.clicked.default || { style: {} }
    local.clicked.style &&
    Object.keys(local.clicked.style).map(key => 
        local.clicked.default.style[key] = local.clicked.default.style[key] !== undefined ? local.clicked.default.style[key] : local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?clicked.disable=true;if():[)(:mode=)(:default-mode]:[clicked.style.keys()._():[style()._=().clicked.style._]]?clicked.mount||clicked.disable`
    }, {
        "event": `click:${_id}?if():[)(:mode=)(:default-mode]:[clicked.style.keys()._():[style()._=().clicked.style._]]?!required.mount;!parent().required.mount;!clicked.disable`
    }, {
        "event": "click:body?if():[)(:mode=)(:default-mode]:[clicked.style.keys()._():[style()._=().style._||null]]?!required.mount;!parent().required.mount;!clicked.disable;!element.contains():[)(:clickedElement];!():droplist.element.contains():[)(:clickedElement]"
    }]
}
},{}],13:[function(require,module,exports){
module.exports = {
  item: require("./item"),
  list: require("./list"),
  popup: require("./popup"),
  droplist: require("./droplist"),
  actionlist: require("./actionlist"),
  hoverable: require("./hoverable"),
  sorter: require("./sorter"),
  tooltip: require("./tooltip"),
  mininote: require("./mininote"),
  miniWindow: require("./miniWindow"),
  toggler: require("./toggler"),
  touchableOpacity: require("./touchableOpacity"),
  pricable: require("./pricable"),
  hover: require("./hover"),
  click: require("./click"),
  change: require("./change"),
  clicked: require("./clicked"),
  mouseenter: require("./mouseenter"),
  mouseleave: require("./mouseleave"),
  mouseover: require("./mouseover"),
  keyup: require("./keyup"),
  keydown: require("./keydown"),
  loaded: require("./loaded"),
  contentful: require("../function/contentful").contentful
}
},{"../function/contentful":38,"./actionlist":9,"./change":10,"./click":11,"./clicked":12,"./droplist":14,"./hover":15,"./hoverable":16,"./item":17,"./keydown":18,"./keyup":19,"./list":20,"./loaded":21,"./miniWindow":22,"./mininote":23,"./mouseenter":24,"./mouseleave":25,"./mouseover":26,"./popup":27,"./pricable":28,"./sorter":29,"./toggler":30,"./tooltip":31,"./touchableOpacity":32}],14:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  window.views[id].droplist.id = controls.id = id = controls.id || id
  
  return [{
    event: `click?)(:droplist-search-txt.del();if():[getInput().txt()]:[)(:droplist-search-txt=getInput().txt()];clearTimer():[)(:droplist-timer];if():[)(:droplist-positioner!=${id}]:[():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._]];if():[)(:droplist-positioner=${id}]:[timer():[():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()]:0]`,
    actions: `droplist:${id};setPosition:droplist?)(:droplist-positioner=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align};().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]?)(:droplist-positioner!=().id`
  }, {
    event: "input:[getInput().id]?)(:droplist-search-txt=getInput().txt()?().droplist.searchable",
    actions: `droplist:${id};setPosition:droplist?)(:droplist-positioner=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align};().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]`
  }]
}
},{}],15:[function(require,module,exports){
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
        "event": `loaded:${_id}?if():[().state=().hover.id]:[)(:[().state]=generate()]?hover.mount`,
        "actions": "setStyle?style=if():[)(:mode=)(:default-mode]:[().hover.style]:[().mode.[)(:mode].hover.style]||_map"
    }, {
        "event": `mouseenter:${_id}??!clicked.disable;!hover.disable`,
        "actions": "setStyle?style=if():[)(:mode=)(:default-mode]:[().hover.style]:[().mode.[)(:mode].hover.style]||_map"
    }, {
        "event": `mouseleave:${_id}??!clicked.disable;!hover.disable`,
        "actions": "setStyle?style=().hover.default.style"
    }]
}
},{}],16:[function(require,module,exports){
const {toArray} = require("../function/toArray")

module.exports = ({ id, controls }) => {

  controls.id = toArray(controls.id || id)

  return [{
      event: "mouseenter",
      actions: `mountAfterStyles:[${controls.id}]`,
    }, {
      event: "mouseleave",
      actions: `resetStyles:[${controls.id}]??${controls.mountonload ? "!mountonload" : true}`,
    }]
}

},{"../function/toArray":96}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `keydown?${controls}`
    }]
}
},{}],19:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `keyup?${controls}`
    }]
}
},{}],20:[function(require,module,exports){
module.exports = ({ controls }) => {

  return [{
    event: "click",
    actions: [
      `setState?)(:${controls.id}-mouseenter`,
      `mountAfterStyles:${controls.id}`,
      `setPosition?position.positioner=${controls.id};position.placement=${controls.placement || "right"};position.distance=${controls.distance || "15"}`,
    ],
  }, {
    event: "mouseleave",
    actions: [
      `resetStyles>>200:${controls.id}??!mouseenter;!mouseenter:${controls.id};!)(:${controls.id}-mouseenter`,
      `setState?)(:${controls.id}-mouseenter=false`,
    ]
  }]
}

},{}],21:[function(require,module,exports){
const { toString } = require("../function/toString")

module.exports = ({ id }) => {
    
    var params = ""
    var local = window.views[id]
    
    Object.entries(local.loaded).map(([key, val]) => {
        if (key === "style") key = "style()"
        params += `().${toString({ [key]: val })}`
    })
    
    return [{
        "event": `loaded?${params}`
    }]
}
},{"../function/toString":110}],22:[function(require,module,exports){
const { generate } = require("../function/generate");

module.exports = ({ params }) => {

  var controls = params.controls
  var state = generate()

  return [{
    event: "click??!)(:mini-window-close",
    actions: [
      `createView:mini-window-view?)(:${state}=${controls.Data ? window.global[controls.Data] : '().data()'};():mini-window-view.Data.delete();if():data():[():mini-window-view.Data=${state}];view=${controls.view}`,
      "setStyle:mini-window?style.display=flex;style.opacity=1>>25",
    ]
  }]
}

},{"../function/generate":59}],23:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `click?():mininote-text.txt()=${text};)(:mininote-timer.clearTimeout();():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000`,
    actions: "setPosition:mininote?position.positioner=mouse;position.placement=right"
  }]
}
},{}],24:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseenter?${controls}`
    }]
}
},{}],25:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseleave?${controls}`
    }]
}
},{}],26:[function(require,module,exports){
module.exports = ({ controls }) => {
    
    return [{
      event: `mouseover?${controls}`
    }]
}
},{}],27:[function(require,module,exports){
module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })

  return [{
    event: `click?():popup.style().zIndex=-1;():popup.style().opacity=0;():popup.style().pointerEvents=none;():popup.style().transform=scale(0.5);)(:popup-positioner.delete();)(:popup=${controls.id || id}`,
    actions: [
      `?break?)(:popup-positioner=${id}`,
      `popup:${id}?)(:popup-positioner=${id}`,
      `setStyle:popup?${styles}`,
      `setPosition:popup?():popup.style().zIndex=10;():popup.style().opacity=1;():popup.style().pointerEvents=auto;():popup.style().transform=scale(1);position.positioner=${controls.positioner || id};position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
    ]
  }]
}

},{}],28:[function(require,module,exports){
module.exports = ({ id }) => {
    
    var input_id = window.views[id].type === 'Input' ? id : `${id}-input`
    return [{
        "event": `input:${input_id}?():${input_id}.data()=():${input_id}.element.value().toPrice().else().0;():${input_id}.element.value=():${input_id}.data().else().0`
    }]
}
},{}],29:[function(require,module,exports){
const { toArray } = require("../function/toArray");

module.exports = ({ id, controls }) => {
  
  controls.id = toArray(controls.id || id)

  return [{
    event: "click",
    actions: `async():sort:[update:${controls.id}]?sort.path=${controls.path};sort.Data=${controls.Data}?)(:${controls.Data}`
  }]
}

},{"../function/toArray":96}],30:[function(require,module,exports){
module.exports = ({ controls }) => {

  return [{
    event: `click??().view:${controls.id}!=${controls.view}`,
    actions: [
      `setStyle:${controls.id}?():${controls.id}.style().transition=transform .2s, opacity .2s;style.transform=translateY(-150%);style.opacity=0`,
      `setStyle>>400:${controls.id}?style.transform=translateY(0);style.opacity=1`,
      `createView>>250:${controls.id}?():${controls.id}.element.innerHTML='';():${controls.id}.Data=().data();view=${controls.view}`,
    ]
  }]
}

},{}],31:[function(require,module,exports){
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `mousemove?if():[!)(:tooltip-timer]:[)(:tooltip-timer=timer():[():tooltip.style().opacity=1]:500];():tooltip-text.txt()=${text};():tooltip-text.removeClass():ar;if():[${arabic.test(text) && !english.test(text)}]:[():tooltip-text.addClass():ar]`,
    actions: `setPosition:tooltip?position.positioner=mouse;position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
  }, {
    event: "mouseleave?clearTimer():[)(:tooltip-timer];)(:tooltip-timer.del();():tooltip.style().opacity=0"
  }]
}
},{}],32:[function(require,module,exports){
module.exports = ({ id }) => {

  if (window.views[id].element.style.transition) {
    window.views[id].element.style.transition += ", opacity .2s";
  } else window.views[id].element.style.transition = "opacity .2s";

  return [{
    event: `mousedown?():body.element.addClass().unselectable`,
    actions: "setStyle?style.opacity=.5",
  }, {
    event: `mouseup?():body.element.removeClass().unselectable`,
    actions: "setStyle?style.opacity=1",
  }, {
    event: "mouseleave",
    actions: "setStyle?style.opacity=1",
  }, {
    event: "mouseenter",
    actions: "setStyle?style.opacity=1?().mousedown",
  }]
}

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"./clone":36}],36:[function(require,module,exports){
const clone = (obj) => {

  var copy
  if (typeof obj !== "object") copy = obj
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

},{}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
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

},{"./event":52,"./toArray":96,"./watch":116}],40:[function(require,module,exports){
const setCookie = ({ name = "", value, expiry = 360 }) => {

  var d = new Date()
  d.setTime(d.getTime() + (expiry*24*60*60*1000))
  var expires = "expires="+ d.toUTCString()
  document.cookie = name + "=" + value + ";" + expires + ";path=/"
}

const getCookie = ({ name, req }) => {
  
  var cookie = req ? req.headers.cookie : document ? document.cookie : ""
  if (!name || !cookie) return cookie
  name = name + "="
  
  var decodedCookie = decodeURIComponent(cookie)
  var ca = decodedCookie.split(';')
  cookie = ""

  for (var i = 0; i <ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) cookie = c.substring(name.length, c.length)
  }
  
  return cookie
}

const eraseCookie = ({ name }) => {   
  document.cookie = name +'=; Max-Age=-99999999;'  
}

module.exports = {setCookie, getCookie, eraseCookie}
},{}],41:[function(require,module,exports){
const control = require("../control/control")

const createActions = ({ params, id }) => {

  const {execute} = require("./execute")

  if (!params.type) return
  var actions = control[params.type]({ params, id })

  execute({ actions, id })
}

module.exports = {createActions}

},{"../control/control":13,"./execute":53}],42:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")

const component = require("../component/component")
const { toCode } = require("./toCode")

module.exports = {
  createComponent: ({ _window, id, req, res }) => {
    
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], parent = view.parent

    if (!component[view.type]) return
    views[id] = view = component[view.type](view)

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
      
      params = toParam({ _window, string: params, id, req, res, mount: true })
      // views[id] = view = override(view, params)

      if (params.id) {
        
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
      
      if (params.data && (!view.Data || params.Data)) {

        view.Data = view.Data || generate()
        var state = view.Data
        global[state] = clone(view.data || global[state])
        global[`${state}-options`] = global[`${state}-options`] || {}
      }
    }
  }
}

},{"../component/component":8,"./clone":36,"./generate":59,"./toApproval":95,"./toCode":100,"./toParam":107}],43:[function(require,module,exports){
const { createElement } = require("./createElement")
const { toArray } = require("./toArray")
const { controls } = require("./controls")
const { getJsonFiles } = require("./jsonFiles")
const { toApproval } = require("./toApproval")
const { toCode } = require("./toCode")
//
require('dotenv').config()

const createDocument = async ({ req, res, db, realtimedb }) => {

    // Create a cookies object
    var host = req.headers["x-forwarded-host"] || req.headers["host"]
    
    // current page
    var currentPage = req.url.split("/")[1] || ""
    currentPage = currentPage || "main"
    
    var user, page, view, project
    
    // get assets & views
    var global = {
        timer: new Date().getTime(),
        data: {
            user: {},
            view: {},
            page: {},
            editor: {},
            project: {}
        },
        codes: {},
        host,
        currentPage,
        path: req.url,
        device: req.device,
        public: getJsonFiles({ search: { collection: "public" } }),
        os: req.headers["sec-ch-ua-platform"],
        browser: req.headers["sec-ch-ua"],
        country: req.headers["x-country-code"]
    }
    
    var views = {
        body: { 
            id: "body" 
        },
        root: {
            id: "root",
            type: "View",
            parent: "body",
            style: { backgroundColor: "#fff" }
        },
        public: {
            id: "public",
            type: "View",
            parent: "body",
            children: Object.values(global.public)
        }
    }

    var bracketDomains = [ "bracketjs.com", "localhost", "bracket.localhost" ]

    // is brakcet domain
    var isBracket = bracketDomains.includes(host)
    if (!isBracket) {
        isBracket = host.includes(".loca.lt")
        if (isBracket) host = "bracketjs.com"
    }
    
    console.log("Document started loading:");
    
    console.log("before project", new Date().getTime() - global.timer);
    
    // get project
    if (isBracket) global.data.project = project = Object.values(getJsonFiles({ search: { collection: "_project_", fields: { domains: { "array-contains": host } } } }))[0]    
    else {
        // get project data
        project = db
        .collection("_project_").where("domains", "array-contains", host)
        .get().then(doc => {

            if (doc.docs[0] && doc.docs[0].exists)
            global.data.project = project = doc.docs[0].data()
            console.log("after project", new Date().getTime() - global.timer);
        })
    }

    await Promise.resolve(project)
    
    // project not found
    if (!project) return res.send("Project not found!")
    global.projectId = project.id
    
    if (isBracket) {
        
        if (isBracket) {

            console.log("before user", new Date().getTime() - global.timer);
            global.data.user = user = Object.values(getJsonFiles({ search: { collection: "_user_", fields: { projects: { "array-contains": project.id } } } }))[0]
            console.log("after user", new Date().getTime() - global.timer);

        }/* else {

            // get user (for bracket users only)
            console.log("before user / firestore", new Date().getTime() - global.timer);

            user = db
            .collection("_user_").where("projects", "array-contains", project.id)
            .get().then(doc => {
                
                if (doc.docs[0].exists)
                global.data.user = user = doc.docs[0].data()
                console.log("after user", new Date().getTime() - global.timer);
            })
        }*/
        
        console.log("before page", new Date().getTime() - global.timer);

        // get page
        global.data.page = page = getJsonFiles({ search: { collection: `page-${project.id}` } })
        console.log("after page", new Date().getTime() - global.timer);
        
        console.log("before view", new Date().getTime() - global.timer);

        // get view
        global.data.view = view = getJsonFiles({ search: { collection: `view-${project.id}` } })
        console.log("after view", new Date().getTime() - global.timer);
        
    } else {

        // do not send project details
        delete global.data.project

        console.log("before user", new Date().getTime() - global.timer);

        // do not send user details
        console.log("after user", new Date().getTime() - global.timer);
        
        console.log("before page / firestore", new Date().getTime() - global.timer);

        // get page
        /*
        page = realtimedb.ref(`page-${project.id}`).once("value").then(snapshot => {
            global.data.page = snapshot.val()
            console.log("after page", new Date().getTime() - global.timer);
        })
        */
        page = db
        .collection(`page-${project.id}`)
        .get().then(q => {
                q.forEach(doc => {
                global.data.page[doc.id] = doc.data() 
            })
            console.log("after page", new Date().getTime() - global.timer);
        })

        console.log("before view / firestore", new Date().getTime() - global.timer);

        // get view
        /*
        view = realtimedb.ref(`view-${project.id}`).once("value").then(snapshot => {
            global.data.view = snapshot.val()
            console.log("after view", new Date().getTime() - global.timer);
        })
        */
        view = db
        .collection(`view-${project.id}`)
        .get().then(q => {
                q.forEach(doc => {
                global.data.view[doc.id] = doc.data()
            })
            console.log("after view", new Date().getTime() - global.timer);
        })
    }
    
    await Promise.resolve(page)
    await Promise.resolve(view)
    await Promise.resolve(user)
    
    console.log("Document Ready.");
    // realtimedb.ref("view-alsabil-tourism").set(global.data.view)
    // realtimedb.ref("page-alsabil-tourism").set(global.data.page)
    
    // user not found
    if (!global.data.user) return res.send("User not found!")
    user = global.data.user
    
    // page doesnot exist
    if (!global.data.page[currentPage]) return res.send("Page not found!")

    // mount globals
    if (global.data.page[currentPage].global)
    Object.entries(global.data.page[currentPage].global).map(([key, value]) => global[key] = value)
    
    // controls & views
    views.root.controls = global.data.page[currentPage].controls
    views.root.children = global.data.page[currentPage]["views"].map(view => global.data.view[view])

    var _window = { global, views }

    // forward
    if (global.data.page[currentPage].forward) {

        var forward = global.data.page[currentPage].forward
        forward = toCode({ _window, id, string: forward }).split("?")
        var params = forward[1]
        var conditions = forward[2]
        forward = forward[0]

        var approved = toApproval({ _window, string: conditions, id: "root", req, res })
        if (approved) {
            global.path = forward
            global.currentPage = currentPage = global.path.split("/")[1]
        }
    }

    // onloading
    if (global.data.page[currentPage].controls) {
        global.data.page[currentPage].controls = toArray(global.data.page[currentPage].controls)
        var loadingEventControls = global.data.page[currentPage].controls.find(controls => controls.event.split("?")[0].includes("loading"))
        if (loadingEventControls) controls({ _window, id: "root", req, res, controls: loadingEventControls })
    }

    // create html
    var innerHTML = ""
    innerHTML += createElement({ _window, id: "root", req, res })
    innerHTML += createElement({ _window, id: "public", req, res })

    global.idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])

    // meta
    global.data.page[currentPage].meta = global.data.page[currentPage].meta || {}

    // viewport
    var viewport = global.data.page[currentPage].meta.viewport
    viewport = viewport !== undefined ? viewport : "width=device-width, initial-scale=1.0"

    // language
    var language = global.data.page[currentPage].language || "en"
    var direction = (language === "ar" || language === "fa") ? "rtl" : "ltr"

    res.send(
    `<!DOCTYPE html>
    <html lang="${language}" dir="${direction}" class="html">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="${viewport}">
            <meta name="keywords" content="${global.data.page[currentPage].meta.keywords || ""}">
            <meta name="description" content="${global.data.page[currentPage].meta.description || ""}">
            <meta name="title" content="${global.data.page[currentPage].meta.title || ""}">
            <title>${global.data.page[currentPage].title}</title>
            <link rel="stylesheet" href="/resources/index.css"/>
            <link rel="icon" type="image/x-icon" href="${project.favicon || ""}"/>
            <link rel="stylesheet" href="/resources/Tajawal/index.css"/>
            <link rel="stylesheet" href="/resources/Lexend+Deca/index.css"/>
            <link rel="stylesheet" href="/resources/bootstrap-icons/font/bootstrap-icons.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons/material-icons.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-outlined/material-icons-outlined.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-round/material-icons-round.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-sharp/material-icons-sharp.css"/>
            <link rel="stylesheet" href="/resources/google-icons/material-icons-two-tones/material-icons-two-tones.css"/>
        </head>
        <body>
            ${innerHTML}
            <script id="views" type="application/json">${JSON.stringify(views)}</script>
            <script id="global" type="application/json">${JSON.stringify(global)}</script>
            <script src="/index.js"></script>
        </body>
    </html>`)
}

module.exports = { createDocument }
},{"./controls":39,"./createElement":44,"./jsonFiles":69,"./toApproval":95,"./toArray":96,"./toCode":100,"dotenv":147}],44:[function(require,module,exports){
const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")

var createElement = ({ _window, id, req, res }) => {

  var views = _window ? _window.views : window.views
  var view = views[id]
  var global = _window ? _window.global : window.global
  var parent = views[view.parent]
  
  // html
  if (view.html) return view.html

  // merge to another view
  if (view.view && global.data.view[view.view]) view = clone(global.data.view[view.view])

  // view is empty
  if (!view.type) return

  view.type = toCode({ _window, string: view.type })

  // 'string'
  if (view.type.split("'").length > 2) view.type = toCode({ _window, string: view.type, start: "'", end: "'" })

  // destructure type, params, & conditions from type
  
  var type = view.type.split("?")[0]
  var params = view.type.split("?")[1]
  var conditions = view.type.split("?")[2]

  // [type]
  if (!view.duplicatedElement && type.includes("coded()")) view.mapType = true
  type = view.type = toValue({ _window, value: type, id, req, res })

  // style
  view.style = view.style || {}

  // id
  view.id = view.id || generate()
  id = view.id

  // class
  view.class = view.class || ""

  // Data
  view.Data = view.Data || parent.Data

  // derivations
  view.derivations = view.derivations || [...(parent.derivations || [])]

  // controls
  view.controls = view.controls || []

  // status
  view.status = "Loading"

  // first mount of view
  views[id] = view

  // ///////////////// approval & params /////////////////////

  // approval
  var approved = toApproval({ _window, string: conditions, id, req, res })
  if (!approved) return

  // push destructured params from type to view
  if (params) {
    
    params = toParam({ _window, string: params, id, req, res, mount: true })
    
    if (params.id && params.id !== id) {

      delete Object.assign(views, { [params.id]: views[id] })[id]
      id = params.id
    }

    // view
    if (params.view) {

      var _view = clone(global.data.view[view.view])
      if (_view) {

        delete view.type
        delete view.view
        
        views[id] = { ...view, ..._view}
        return createElement({ _window, id, req, res })
      }
    }
  }

  // for droplist
  if (parent.unDeriveData || view.unDeriveData) {

    view.data = view.data || ""
    view.unDeriveData = true

  } else view.data = reducer({ _window, id, path: view.derivations, value: view.data, key: true, object: global[view.Data], req, res })
  
  return createTags({ _window, id, req, res })
}

module.exports = { createElement }

},{"./clone":36,"./createTags":45,"./generate":59,"./reducer":78,"./toApproval":95,"./toCode":100,"./toParam":107,"./toValue":112}],45:[function(require,module,exports){
const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { toHtml } = require("./toHtml")
const { toArray } = require("./toArray")

const createTags = ({ _window, id, req, res }) => {

  const { createElement } = require("./createElement")
  var views = _window ? _window.views : window.views, view = views[id]
  if (!view) return
  
  if (view.mapType) {
  
    // data mapType
    var data = Array.isArray(view.data) ? view.data : (typeof view.data === "object" ? Object.keys(view.data) : [])
    var isObject = view.data && ((Array.isArray(view.data) || typeof view.data === "string") ? false : true)
    var type = views[view.parent].children[view.index].type.replace("[", "").replace("]", "")
    if (type.includes(";data=")) type = type.split(";data=")[0] + ";" + type.split(";data=").slice(1).join("").split(";").slice(1).join(";")
    if (type.includes("?data=")) type = type.split("?data=")[0] + "?" + type.split("?data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";Data=")) type = type.split(";Data=")[0] + ";" + type.split(";Data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?Data=")) type = type.split("?Data=")[0] + "?" + type.split("?Data=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes("?id=")) type = type.split("?id=")[0] + "?" + type.split("?id=").slice(1).join("").split(";").slice(1).join(";") 
    if (type.includes(";id=")) type = type.split(";id=")[0] + "?" + type.split(";id=").slice(1).join("").split(";").slice(1).join(";") 
    view.length = data.length || 1

    // arrange
    if (view.arrange) data = arrange({ data, arrange: view.arrange, id, _window })

    delete views[id]
    delete view.mapType

    if (data.length > 0) {
      
      return data.map((_data, index) => {
        
        var id = generate()
        var mapIndex = index
        var data = isObject ? view.data[_data] : _data
        var derivations = isObject ? [...view.derivations, _data] : [...view.derivations, index]
        var _view = clone({ ...view, id, type, data, mapIndex, derivations })

        views[id] = _view
        return createElement({ _window, id, req, res })

      }).join("")

    } else {
        
      var id = generate()
      var mapIndex = 0
      var derivations = isObject ? [...view.derivations, ""] : [...view.derivations, 0]
      var _view = clone({ ...view, id, type, mapIndex, derivations })

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
    if (view.icon.google || view.google) {
      
      if (view.google.outlined) view.outlined = true
      else if (view.google.filled) view.filled = true
      else if (view.google.rounded) view.rounded = true
      else if (view.google.sharp) view.sharp = true
      else if (view.google.twoTone) view.twoTone = true
      else view.google = true
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

},{"./clone":36,"./createComponent":42,"./createElement":44,"./execute":53,"./generate":59,"./toArray":96,"./toHtml":103}],46:[function(require,module,exports){
const {update} = require("./update")
const {toArray} = require("./toArray")
const {clone} = require("./clone")

const createView = ({ view, id }) => {

  var views = window.views[id]
  var global = window.global

  if (!view) return
  
  views.children = toArray(clone(global.data.view[view]))

  // update
  update({ id })
}

module.exports = {createView}

},{"./clone":36,"./toArray":96,"./update":114}],47:[function(require,module,exports){
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
},{"./clone":36,"./reducer":78,"./setContent":86,"./setData":87}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")

const defaultInputHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global

  if (!view) return
  if (view.type !== "Input") return

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
  
  var myFn = async (e) => {
    
    e.preventDefault()
    var value = e.target.value

    // VAR[id] doesnot exist
    if (!window.views[id]) {
      if (e.target) e.target.removeEventListener("input", myFn)
      return 
    }
    
    // map
    if (view.preventDefault || view.input.preventDefault) {
      
      if (e.data === "h" && e.target.selectionStart === 2 && value.charAt(0) === "c") view.element.value = value = "children"
      else if (e.data === "o" && e.target.selectionStart === 2 && value.charAt(0) === "c") view.element.value = value = "controls"
      else if (e.data === "y" && e.target.selectionStart === 2 && value.charAt(0) === "t") view.element.value = value = "type"
      else if (e.data === "v" && e.target.selectionStart === 2 && value.charAt(0) === "e") view.element.value = value = "event"
      else if (e.data === "a" && e.target.selectionStart === 2 && value.charAt(0) === "w") view.element.value = value = "watch"
    }

    if (!view.preventDefault && !view.input.preventDefault) {
      
      // for number inputs, strings are rejected
      if (view.input && view.input.type === "number") {

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
      if (view.input.type === "file") return global.upload = e.target.files

      // contentfull
      if (view.input.type === "text") {
        
        if (e.data === "[") {
          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "[]" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length + 1)

        } else if (e.data === "(" && value[e.target.selectionStart - 2] !== ")") {
          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "()" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

        } else if (e.data === ")" && value.slice(e.target.selectionStart - 3, e.target.selectionStart - 1) === "()") {
          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

        } else if (e.data === "]" && value[e.target.selectionStart - 2] === "[" && value[e.target.selectionStart] === "]") {
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

        } else if (value.slice(e.target.selectionStart - 4, e.target.selectionStart) === "back") {
          var _prev = value.slice(0, e.target.selectionStart - 4)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "backgroundColor" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        
        } else if (value.slice(e.target.selectionStart - 7, e.target.selectionStart) === "borderR") {
          var _prev = value.slice(0, e.target.selectionStart - 7)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "borderRadius" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        
        } else if (value.slice(e.target.selectionStart - 5, e.target.selectionStart) === "gridT") {
          var _prev = value.slice(0, e.target.selectionStart - 5)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "gridTemplateColumns" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        }
      }

      if (view.Data && (view.input ? !view.input.preventDefault : true)) setData({ id, data: { value } })
    }

    // resize
    resize({ id })

    // arabic values
    isArabic({ id, value })
    
    console.log(value, global[view.Data], view.derivations)
  }

  view.element.addEventListener("input", myFn)
}

module.exports = { defaultInputHandler }
},{"./data":47,"./isArabic":66,"./resize":82}],50:[function(require,module,exports){
const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var views = window.views
  var global = window.global
  var view = window.views[id]
  var dropList = views["droplist"]
  
  // items
  var items = clone(view.droplist.items) || []
  dropList.derivations = clone(view.derivations)
  dropList.Data = view.Data
  
  // path & derivations
  if (view.droplist.path)
  dropList.derivations.push(...view.droplist.path.split("."))

  // input id
  var input_id = view.type === "Input" ? view.id : ""
  if (!input_id) {
    
    input_id = view.element.getElementsByTagName("INPUT")[0]
    if (input_id) input_id = input_id.id
  }
  
  // items
  if (typeof items === "string") items = clone(toValue({ id, e, value: items }))
  
  // searchable
  if (view.droplist.searchable && global["droplist-search-txt"] !== undefined) 
  items = items.filter(item => item.includes(global["droplist-search-txt"]))
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Text?class=flex align-center pointer;style:[minHeight=3.5rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.4rem;width=100%];hover.style.backgroundColor=#eee;${toString(view.droplist.item)};caller=${id};text=${item}`,
        controls: [...(view.droplist.controls || []), {
          event: `click?if():[():${id}.clicked]:[():${id}.clicked.style.keys()._():[():${id}.style()._=():${id}.clicked.style._]]?!():${id}.droplist.preventDefault;)(:droplist-positioner=${id}`,
          actions: [
            `async():[resize:${input_id}]:[isArabic:${input_id}]:[focus:${input_id}]?if():[():${input_id}.getInput()]:[():${input_id}.data()=txt();():${input_id}.txt()=txt()]:[():${id}.data()=txt();():${id}.txt()=txt()]?!():${id}.droplist.isMap`,
            `async():[update:[():${id}.parent().parent().id]]?if():[txt()=array||txt()=map]:[)(:opened-maps.push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:type:_string]].elif():[txt()=children]:[_map:type:_string].elif():[txt()=string]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=array]:_array.elif():[txt()=map]:[_map:_string:_string];)(:parent-id=():${id}.parent().parent().id;async():[)(:break-loop=false;():[)(:parent-id].getInputs()._():[if():[!)(:break-loop;!_.txt()]:[_.focus();)(:break-loop=true]]];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];)(:droplist-positioner.del()?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
            `droplist:${id};setPosition:droplist?)(:droplist-search-txt=():${id}.getInput().txt();position.positioner=${`():${id}.droplist.positioner` || id};position.placement=${`():${id}.droplist.placement` || "bottom"};position.distance=():${id}.droplist.distance;position.align=():${id}.droplist.align;():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable`
          ]
        }]
      }
    })
    
  } else dropList.children = []

  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true

  update({ id: "droplist" })
}

module.exports = { droplist }
},{"./clone":36,"./toString":110,"./toValue":112,"./update":114}],51:[function(require,module,exports){
const axios = require("axios");
const { toString } = require("./toString")
const { toAwait } = require("./toAwait")

const erase = async ({ id, e, ...params }) => {

  var global = window.global
  var erase = params.erase || {}
  var view = window.views[id]
  var collection = erase.collection = erase.collection || erase.path
  var headers = erase.headers || {}
  headers.project = headers.project || global.projectId

  // erase
  headers.erase = encodeURI(toString({ erase }))

  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]
  
  // no id
  if (!erase.id && !erase.doc && !erase.docs) return
  erase.doc = erase.doc || erase.id
  if (erase.doc === undefined) delete erase.doc

  var { data } = await axios.delete(`/database/${collection}`, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  view.erase = data
  console.log(data)

  toAwait({ id, e, params })
}

module.exports = { erase }
},{"./toAwait":97,"./toString":110,"axios":117}],52:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

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

  var events = toCode({ _window, id, string: controls.event })

  // 'string'
  if (events.split("'").length > 2) events = toCode({ _window, string: events, start: "'", end: "'" })
  
  events = events.split("?")
  var _idList = toValue({ id, value: events[3] || id })

  // droplist
  var droplist = (events[1] || "").split(";").find(param => param === "droplist()")
  if (droplist && view.droplist) {
    
    view.droplist.controls = view.droplist.controls || []
    return view.droplist.controls.push({
      event: events.join("?").replace("droplist()", ""),
      actions: controls.actions
    })
  }

  // actionlist
  var actionlist = (events[1] || "").split(";").find(param => param === "actionlist()")
  if (actionlist && view.actionlist) {
    
    view.actionlist.controls = view.actionlist.controls || []
    return view.actionlist.controls.push({
      event: events.join("?").replace("actionlist()", ""),
      actions: controls.actions
    })
  }

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
    if (viewEventIdList) mainID = toValue({ _window, req, res, id, value: viewEventIdList })
    
    var timer = 0, idList
    var once = events[1] && events[1].includes('once')

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
      if (!_view) return

      var myFn = (e) => {

        setTimeout(async () => {
          
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
          await toParam({ _window, req, res, string: events[1], e, id: mainID, mount: true, eventParams: true })
          
          // approval
          if (viewEventParams) await toParam({ _window, req, res, string: viewEventParams, e, id: mainID, mount: true, eventParams: true })
          
          // execute
          if (controls.actions) await execute({ _window, req, res, controls, e, id: mainID })
        }, timer)
      }
      
      // onload event
      if (event === "loaded" || event === "loading" || event === "beforeLoading") return myFn({ target: _view.element })

      // body event
      if (id === "body") {
        
        global[`body-${event}-events`] = global[`body-${event}-events`] || {}
        global[`body-${event}-events`][mainID] = global[`body-${event}-events`][mainID] || []
        var index = global[`body-${event}-events`][mainID].length
        global[`body-${event}-events`][mainID].push({ id: mainID, viewEventConditions, viewEventParams, events, once, controls, index, event })
        return
      }

      var myFn1 = (e) => {
        
        view[`${event}-timer`] = setTimeout(async () => {

          // body
          if (eventid === "droplist" || eventid === "actionlist") id = mainID
          if (eventid === "droplist" && id !== global["droplist-positioner"]) return
          if (eventid === "actionlist" && id !== global["actionlist-caller"]) return
          var __view = views[id]

          if (once) e.target.removeEventListener(event, myFn)

          // VALUE[id] doesnot exist
          if (!__view) {
            if (e.target) e.target.removeEventListener(event, myFn)
            return 
          }
        
          // approval
          if (viewEventConditions) {
            var approved = toApproval({ _window, req, res, string: viewEventConditions, e, id: mainID })
            if (!approved) return
          }
          
          // approval
          var approved = toApproval({ string: events[2], e, id: mainID })
          if (!approved) return

          // params
          await toParam({ string: events[1], e, id: mainID, mount: true, eventParams: true })
        
          // approval
          if (viewEventParams) await toParam({ _window, req, res, string: viewEventParams, e, id: mainID, mount: true, eventParams: true })
          
          if (controls.actions) await execute({ controls, e, id: mainID })
          
        }, timer)
      }
      
      // elements
      _view.element.addEventListener(event, myFn1)
    })
  })
}

const defaultEventHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global

  view.touchstart = false
  view.mouseenter = false
  view.mousedown = false

  if (view.link) view.element.addEventListener("click", (e) => e.preventDefault())

  // input
  if (view.type === "Input") {

    // focus
    var setEventType = (e) => {

      if (!window.views[id]) return e.target.removeEventListener("focus", setEventType)
      view.focus = true
    }

    view.element.addEventListener("focus", setEventType)

    // blur
    var setEventType = (e) => {

      if (!window.views[id]) return e.target.removeEventListener("blur", setEventType)
      view.focus = false
    }

    view.element.addEventListener("blur", setEventType)
  }

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

      } else if (event === "mouseup") view.mousedown = false
      else if (event === "touchstart") view.touchstart = true
      else if (event === "touchend") view.touchstart = false
    }

    view.element.addEventListener(event, setEventType)
  })
}

module.exports = { addEventListener, defaultEventHandler }

},{"./clone":36,"./execute":53,"./toApproval":95,"./toArray":96,"./toCode":100,"./toParam":107,"./toValue":112}],53:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const _method = require("./function")
const { toCode } = require("./toCode")
const { toAwait } = require("./toAwait")
const { toValue } = require("./toValue")

const execute = ({ _window, controls, actions, e, id, params }) => {

  var views = _window ? _window.views : window.views
  var view = views[id] || {}
  var global = window.global
  var _params = params, viewId = id

  if (controls) actions = controls.actions

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
    params = toParam({ _window, string: params, e, id: viewId })
    if (_params) params = {..._params, ...params}

    // break
    view.break = params.break
    delete params.break

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
      
      // action === name:id:timer:condition
      var name = action.split(':')[0]
      var caseCondition = action.split(":")[3]

      params.action = params.action || {}
      
      // timer
      var isInterval = false
      var timer = params.action.timer
      if (timer === undefined || timer === false) timer = action.split(":")[2] || ""
      if (timer.includes("i")) isInterval = params.isInterval = true
      timer = timer.split("i")[0]
      if (timer) timer = parseInt(timer)
      

      var actionid = params.action.id
      actionid = toArray(action.split(":")[1] ? toValue({ _window, value: action.split(":")[1], params, id: viewId, e }) : viewId)
    
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
          
          await _method[name]({ _window, ...params, e, id })
          if (name !== "search" && name !== "save" && name !== "erase" && name !== "importJson" && name !== "upload") toAwait({ id, e, params })
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

},{"./function":58,"./toApproval":95,"./toArray":96,"./toAwait":97,"./toCode":100,"./toParam":107,"./toValue":112}],54:[function(require,module,exports){
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
},{}],55:[function(require,module,exports){
const { toValue } = require("./function")

module.exports = {
    fileReader : ({ read: { file, reduce }, id }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, value: reduce, e })
        reader.readAsDataURL(file)
    }
}
},{"./function":58}],56:[function(require,module,exports){
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
},{"./clone":36,"./compare":37,"./isEqual":67,"./toArray":96,"./toOperator":106}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
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
const {createDocument} = require("./createDocument")
const {toControls} = require("./toControls")
const {toArray} = require("./toArray")
const {generate} = require("./generate")
const {refresh} = require("./refresh")
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
  createDocument,
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
  insert
}
},{"./blur":33,"./capitalize":34,"./clearValues":35,"./clone":36,"./compare":37,"./contentful":38,"./controls":39,"./cookie":40,"./createActions":41,"./createComponent":42,"./createDocument":43,"./createElement":44,"./createView":46,"./data":47,"./decode":48,"./defaultInputHandler":49,"./droplist":50,"./erase":51,"./event":52,"./execute":53,"./exportJson":54,"./fileReader":55,"./filter":56,"./focus":57,"./generate":59,"./getDateTime":60,"./getDaysInMonth":61,"./getParam":62,"./importJson":64,"./insert":65,"./isArabic":66,"./isEqual":67,"./isPath":68,"./jsonFiles":69,"./keys":70,"./log":71,"./merge":72,"./note":73,"./overflow":74,"./popup":75,"./position":76,"./preventDefault":77,"./reducer":78,"./refresh":79,"./reload":80,"./remove":81,"./resize":82,"./route":83,"./save":84,"./search":85,"./setContent":86,"./setData":87,"./setElement":88,"./setPosition":89,"./sort":90,"./starter":91,"./state":92,"./style":93,"./switchMode":94,"./toApproval":95,"./toArray":96,"./toAwait":97,"./toCSV":98,"./toCode":100,"./toComponent":101,"./toControls":102,"./toHtml":103,"./toId":104,"./toNumber":105,"./toOperator":106,"./toParam":107,"./toString":110,"./toStyle":111,"./toValue":112,"./toggleView":113,"./update":114,"./upload":115}],59:[function(require,module,exports){
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

const generate = (length) => {

  var result = ""
  if (!length) length = 5

  var charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result
}

module.exports = {generate}

},{}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
module.exports = {
    getDaysInMonth: (stampTime) => {
        return new Date(stampTime.getFullYear(), stampTime.getMonth() + 1, 0).getDate()
    }
}
},{}],62:[function(require,module,exports){
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

},{"./toParam":107}],63:[function(require,module,exports){
module.exports = {
    getType: (value) => {
        if (typeof value === "string") {
            
            if (value.length >= 10 && value.length <=13 && !isNaN(value) && value.slice(0, 2) !== "00") return "timestamp"
            return "string"
        }
        if (typeof value === "number") {
            
            if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").slice(0, 2) !== "00") return "timestamp"
            return "number"
        }
        if (typeof value === "object" && Array.isArray(value)) return "array"
        if (typeof value === "object") return "map"
        if (typeof value === "boolean") return "boolean"
        if (typeof value === "function") return "function"
    }
}
},{}],64:[function(require,module,exports){
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
},{"./toAwait":97}],65:[function(require,module,exports){
const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")

module.exports = {
  insert: ({ id, insert }) => {
    
    var { index, value = {}, el, elementId, component, replace, path, data } = insert
    var views = window.views
    var view = views[id], lDiv
    
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
        views[id].parent = view.id
        views[id].style = views[id].style || {}
        views[id].reservedStyles = toParam({ id, string: views[id].type.split("?")[1] || "" }).style || {}
        views[id].style.transition = null
        views[id].style.opacity = "0"
        
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

    views[el.id].style.transition = views[el.id].element.style.transition = views[el.id].reservedStyles.transition || null
    views[el.id].style.opacity = views[el.id].element.style.opacity = views[el.id].reservedStyles.opacity || "1"
    delete views[el.id].reservedStyles
    view.insert = { view: views[el.id], message: "Map inserted succefully!", success: true }
    
    setTimeout(() => {
      idList.filter(id => views[id] && views[id].type === "Icon" && views[id].google).map(id => views[id]).map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
      })
    }, 0)
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }
}
},{"./clone":36,"./createElement":44,"./generate":59,"./setElement":88,"./starter":91,"./toArray":96,"./toParam":107}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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
},{"./toArray":96,"./toOperator":106,"fs":146}],70:[function(require,module,exports){
module.exports = {
    keys: (object) => {
        return Object.keys(object)
    }
}
},{}],71:[function(require,module,exports){
const log = ({ log }) => {
  console.log( log || 'here')
}

module.exports = {log}

},{}],72:[function(require,module,exports){
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

},{"./clone":36,"./toArray":96}],73:[function(require,module,exports){
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
  note.element.style.transition = "transform .2s"
  note.element.style.transform = "translateY(0)"

  const myFn = () => note.element.style.transform = "translateY(-200%)"

  note["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = { note }

},{"./isArabic":66}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
const {controls} = require("./controls")
const {update} = require("./update")

const popup = ({ id }) => {
  
  var view = window.views[id]
  var popup = window.views["popup"]
  var popUp = view.popup
  var _controls = popUp.controls
  popup.positioner = id

  update({ id: "popup" })
  
  // eraser
  if (popUp.type === "eraser") {

    _controls = {
      event: "click",
      actions: `resetStyles:popup;await().note;await().setStyle:mini-window;await().remove:[():mini-window-view.element.children.0.id]:220${popUp.update ? `;await().update:${popUp.update}` : ""};async().erase?note.text=${popUp.note || "Data removed successfully"};()::200.style.display=none;style.opacity=0;erase.path=${popUp.path};erase.id=${popUp.id || "().data().id"};await().)(:[().Data]=().Data()._filterById().[${popUp.id ? `any.${popUp.id}` : "().data().id"}.not().[_.id]]`,
    }
  }


  setTimeout(() => {

    // caller
    popup.caller = id
    // window.views["popup-text"].caller = id
    window.views["popup-confirm"].caller = id
    window.views["popup-cancel"].caller = id

    if (popUp.text) window.views["popup-text"].element.innerHTML = popUp.text
    controls({ controls: _controls, id: "popup-confirm" })

  }, 50)
}

module.exports = {popup}

},{"./controls":39,"./update":114}],76:[function(require,module,exports){
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
},{"./resize":82}],77:[function(require,module,exports){
const preventDefault = ({e}) => {
  e.preventDefault();
};

module.exports = {preventDefault};

},{}],78:[function(require,module,exports){
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

const reducer = ({ _window, id, path, value, key, params, object, index = 0, _, e, req, res, mount }) => {
    
    const { remove } = require("./remove")
    const { toValue, calcSubs } = require("./toValue")
    const { execute } = require("./execute")
    const { toParam } = require("./toParam")

    var views = _window ? _window.views : window.views
    var view = views[id], breakRequest, coded, mainId = id
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
            if (!answer) answer = toValue({ _window, value, params, _, id, e, req, res })
        })
        return answer
    }

    if (path.join(".").includes("=") || path.join(".").includes(";")) return toParam({ req, res, _window, id, e, string: path.join("."), _, object, mount })

    // path[0] = path0:args
    var path0 = path[0] ? path[0].toString().split(":")[0] : ""

    // function
    if (path0.slice(-2) === "()" && path0 !== "()" && view && (view[path0.charAt(0) === "_" ? path0.slice(1) : path0] || view[path0])) {
            
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

    // multiplication
    if (path.join(".").includes("*")) {

        var values = path.join(".").split("*").map(value => toValue({ _window, value, params, _, id, e, req, res, object, mount }))
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
            // console.log(args[2], global.codes[args[2]], object);
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
            if (_id) view = views[_id]
            
            path[0] = path0 = "()"
        }
    }
    
    if (path0 === "while()") {
            
        var args = path[0].split(":")
        while (toValue({ req, res, _window, id, value: args[1], params, _, e, object, mount })) {
            toValue({ req, res, _window, id, value: args[2], params, _, e, object, mount })
        }
        path = path.slice(1)
    }

    // initialize by methods
    if (!object && (path0 === "data()" || path0 === "Data()" || path0 === "style()" || path0 === "className()" || path0 === "getChildrenByClassName()" || path0 === "deepChildren()" || path0 === "children()" || path0 === "1stChild()" || path0 === "lastChild()" || path0 === "2ndChild()" || path0 === "3rdChild()" || path0 === "3rdLastChild()" || path0 === "2ndLastChild()" || path0 === "parent()" || path0 === "next()" || path0 === "text()" || path0 === "val()" || path0 === "txt()" || path0 === "element()" || path0 === "el()" || path0 === "prev()" || path0 === "format()" || path0 === "lastSibling()" || path0 === "1stSibling()" || path0 === "derivations()" || path0 === "mouseenter()" || path0 === "copyToClipBoard()" || path0 === "mininote()" || path0 === "note()" || path0 === "tooltip()" || path0 === "update()" || path0 === "refresh()" || path0 === "save()" || path0 === "override()" || path0 === "click()" || path0 === "is()" || path0 === "setPosition()" || path0 === "gen()" || path0 === "generate()" || path0 === "route()" || path0 === "getInput()" || path0 === "toggleView()" || path0 === "clearTimer()" || path0 === "timer()" || path0 === "range()" || path0 === "focus()" || path0 === "siblings()" || path0 === "todayStart()" || path0 === "time()" || path0 === "remove()" || path0 === "rem()" || path0 === "removeChild()" || path0 === "remChild()" || path0 === "getBoundingClientRect()" || path0 === "contains()" || path0 === "contain()" || path0 === "def()" || path0 === "price()")) {
        if (path0 === "getChildrenByClassName()" || path0 === "className()") {

            path.unshift("doc()")
            path0 = "doc()"

        } else {
            path.unshift("()")
            path0 = "()"
        }
    }
    
    object = path0 === "()" ? view
    : path0 === "index()" ? index
    : (path0 === "global()" || path0 === ")(")? _window ? _window.global : window.global
    : path0 === "e()" ? e
    : path0 === "_" ? _
    : (path0 === "document()" || path0 === "doc()") ? document
    : (path0 === "window()" || path0 === "win()") ? _window || window
    : path0 === "history()" ? history
    : (path0 === "navigator()" || path0 === "nav()") ? navigator
    : object

    if (path0 === "()" || path0 === "index()" || path0 === "global()" || path0 === ")(" || path0 === "e()" || path0 === "_" || path0 === "document()" || path0 === "doc()" || path0 === "window()" || path0 === "win()" || path0 === "history()" || path0 === "return()") path = path.slice(1)
        
    if (!object && object !== 0 && object !== false) {

        if (path[0]) {

            if (path0 === "undefined") return undefined
            else if (path0 === "false") return false
            else if (path0 === "true") return true
            else if (path0 === "desktop()") return global.device.type === "desktop"
            else if (path0 === "tablet()") return global.device.type === "tablet"
            else if (path0 === "mobile()" || path0 === "phone()") return global.device.type === "phone"
            else if (path0 === "clickedElement()") object = global["clickedElement()"]

            else if (path0 === "log()") {

                var args = path[0].split(":").slice(1)
                _log = args.map(arg => toValue({ req, res, _window, id, value: arg, params, _, e }))
                console.log(..._log)
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
                object = view
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
            if (path[i + 1][0] === "_") _ = reducer({ req, res, _window, id, path: [k], params, object: o, _, e })
            value = toValue({ req, res, _window, id, _, e, value: args[1], params })
            breakRequest = i + 1
            lastIndex = i
        }
        
        // path[i]._
        /*if (path[i + 1] === "_") {
            
            path[i + 1] = _
            breakRequest = true
            return answer = reducer({ req, res, _window, id, path: path.slice(i), params, object: o, _, e, key, value })
        }*/
        
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

            var __
            if (k0[0] === "_") __ = o
            var _log = args.slice(1).map(arg => toValue({ req, res, _window, id, e, _: __ ? __ : _, value: arg, params }))
            if (_log.length === 0) _log = o !== undefined ? [o] : ["here"]
            console.log(..._log)
            return o
        }

        if (o === undefined) return o

        else if (k0 !== "data()" && k0 !== "Data()" && (path[i + 1] === "delete()" || path[i + 1] === "del()")) {
            
            var el = k
            breakRequest = i + 1
            el = toValue({ req, res, _window, id, e, _, value: k, params })
            if (Array.isArray(o)) {
                if (isNaN(el)) {
                    if (o[0] && o[0][el]) {
                        return delete o[0][el]
                    } else return
                }
                o.splice(el, 1)
            } else delete o[el]
            return
            
        } else if (k0 === "while()") {
            
            var args = k.split(":")
            while (toValue({ req, res, _window, id, value: args[1], params, _, e })) {
                toValue({ req, res, _window, id, value: args[2], params, _, e })
            }
            
        } else if (k0 === "_") {
            
            if (value !== undefined && key && i === lastIndex) answer = o[_] = value
            else if (typeof o === "object") answer = o[_]

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
            /*
            breakRequest = true
            var args = k.split(":").slice(1)
            args = args.map(arg => toValue({ req, res, _window, id, e, value: arg, params, _ }))
            if (args.length > 0) args = args.flat()
            if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, e })
            answer = reducer({ req, res, _window, id, e, value, key, path: [...(o.derivations || []), ...args, ...path.slice(i + 1)], object: global[o.Data], params, _ })
            */
            
            breakRequest = true
            var arg = args.slice(1)[0]
            if (arg) {
                answer = reducer({ req, res, _window, id, value, key: path[i + 1] === undefined ? key : false, path: [...(o.derivations || [])], object: global[o.Data], params, _, e })
                if (arg.slice(0, 7) === "coded()") arg = global.codes[arg]
                reducer({ req, res, _window, id, e, value, key, path: arg, object: answer, params, _ })
            }
            if (path[i + 1] !== undefined) {
                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, e })
                answer = reducer({ req, res, _window, id, e, value, key, path: [...(o.derivations || []), ...path.slice(i + 1)], object: global[o.Data], params, _ })
            } else answer = reducer({ req, res, _window, id, value, key: path[i + 1] === undefined ? key : false, path: [...(o.derivations || [])], object: global[o.Data], params, _, e })

            // delete view["data()"]

        } else if (k0 === "Data()") {

            breakRequest = true
            answer = global[o.Data]
            var arg = k.split(":").slice(1)[0]
            if (arg) {
                if (arg.slice(0, 7) === "coded()") arg = global.codes[arg]
                reducer({ req, res, _window, id, e, value, key, path: arg, object: answer, params, _ })
            }
            if (path[i + 1] !== undefined) {
                if (path[i + 1] && path[i + 1].slice(0, 7) === "coded()") path[i + 1] = toValue({ req, res, _window, id, value: global.codes[path[i + 1]], params, _, e })
                answer = reducer({ req, res, _window, id, e, value, key, path: path.slice(i + 1), object: answer, params, _ })
            }

        } else if (k0 === "removeAttribute()") {

            var args = k.split(":")
            var removed = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            answer = o.removeAttribute(removed)

        } else if (k0 === "parent()") {

            var _view, _parent
            if (args[1]) _view = reducer({ req, res, _window, id, path: args[1], value, key, object: answer, params, index, _, e })
            else _view = o
            
            if (typeof _view === "string") _view = views[_view]    
            if (!_view) return
            if (typeof _view === "object") {

                if (_view.status === "Mounted") _parent = views[_view.element.parentNode.id]
                else _parent = views[_view.parent]
            }
            if (!_parent) return

            if (_parent.templated || _parent.link) return views[_parent.element.parentNode.id]
            else return _parent
            
        } else if (k0 === "siblings()") {
            
            var _parent = views[window.views[o.id].parent]
            answer = [..._parent.element.children].map(el => {
                
                var _id = el.id, _view = views[_id]
                if (!_view) return
                if (_view.component === "Input") {

                    _id = (_view).element.getElementsByTagName("INPUT")[0].id
                    return _view

                } else return _view
            })
            
            answer = answer.filter(comp => comp && comp.id)

        } else if (k0 === "next()" || k0 === "nextSibling()") {

            var element = o.element
            if (o.templated || o.link) element = views[o.parent].element
            
            var nextSibling = element.nextElementSibling
            if (!nextSibling) return
            var _id = nextSibling.id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "nextSiblings()") {

            var nextSiblings = [], nextSibling
            var element = o.element
            if (o.templated || o.link) element = views[o.parent].element

            var nextSibling = element.nextElementSibling
            if (!nextSibling) return
            while (nextSibling) {
                var _id = nextSibling.id
                nextSiblings.push(views[_id])
                nextSibling = (views[_id]).element.nextElementSibling
            }
            answer = nextSiblings

        } else if (k0 === "last()" || k0 === "lastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.views[o.parent].element : window.views[o.parent].element
            var lastSibling = element.parentNode.children[element.parentNode.children.length - 1]
            var _id = lastSibling.id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2ndlast()" || k0 === "2ndLast()" || k0 === "2ndLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.views[o.parent].element : window.views[o.parent].element
            var seclastSibling = element.parentNode.children[element.parentNode.children.length - 2]
            var _id = seclastSibling.id
            answer = views[_id]
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "3rdlast()" || k0 === "3rdLast()" || k0 === "3rdLastSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.views[o.parent].element : window.views[o.parent].element
            var thirdlastSibling = element.parentNode.children[element.parentNode.children.length - 3]
            var _id = thirdlastSibling.id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "1st()" || k0 === "first()" || k0 === "firstSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.views[o.parent].element : window.views[o.parent].element
            var firstSibling = element.parentNode.children[0]
            var _id = firstSibling.id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2nd()" || k0 === "second()" || k0 === "secondSibling()") {

            var element = o.element
            if (o.templated || o.link) element = _window ? _window.views[o.parent].element : window.views[o.parent].element
            var secondSibling = element.parentNode.children[1]
            var _id = secondSibling.id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "prev()" || k0 === "prevSibling()") {

            var element, _el = o.element
            if (o.templated || o.link) _el = _window ? _window.views[o.parent] : window.views[o.parent]
            
            if (!_el) return
            if (_el.nodeType === Node.ELEMENT_NODE) element = _el
            else if (_el) element = _el.element
            else return
            
            var previousSibling = element.previousElementSibling
            if (!previousSibling) return
            var _id = previousSibling.id
            answer = views[_id]
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "1stChild()") {
            
            if (!o.element) return
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[0].id
            if ((views[_id]).component === "Input") 
            _id = (views[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = views[_id]
            
            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2ndChild()") {
            
            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[1] || o.element.children[0]).id
            if ((views[_id]).component === "Input") 
            _id = (views[_id]).element.getElementsByTagName("INPUT")[0].id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "3rdChild()") {

            if (!o.element.children[0]) return undefined
            var _id = (o.element.children[2] || o.element.children[1] || o.element.children[0]).id
            if ((views[_id]).component === "Input")
            _id = (views[_id]).element.getElementsByTagName("INPUT")[0].id
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "3rdlastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 3].id
            if ((views[_id]).component === "Input")
            _id = (views[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "2ndlastChild()" || k0 === "2ndLastChild()") {

            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 2].id
            if ((views[_id]).component === "Input")
            _id = (views[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "lastChild()") {

            if (!o.element) return
            if (!o.element.children[0]) return undefined
            var _id = o.element.children[o.element.children.length - 1].id
            if ((views[_id]).component === "Input")
            _id = (views[_id]).element.getElementsByTagName("INPUT")[0].id
            
            answer = views[_id]

            var args = k.split(":").slice(1)
            if (args.length > 0) args.map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))

        } else if (k0 === "children()") {
            
            if (!o.element) return
            answer = [...o.element.children].map(el => {
                
                var _id = el.id, _view = views[_id]
                if (!_view) return
                
                if (_view.component === "Input") {

                    _id = (_view).element.getElementsByTagName("INPUT")[0].id
                    return _view

                } else return _view
            })
            
        } else if (k0 === "style()") {
            
            if (o.nodeType && o.nodeType === Node.ELEMENT_NODE) answer = o.style
            else if (typeof o === "object") {
                if (o.element) answer = o.element.style
                else answer = o.style
            }
            
            if (args[1]) args.slice(1).map(arg => reducer({ req, res, _window, id, path: arg, value, key, object: answer, params, index, _, e }))
            
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

            answer = [...answer].map(o => window.views[o.id])

        } else if (k0 === "getTag()") {
          
            var args = k.split(":")
            var _tag_name = toValue({ req, res, _window, id, e, _, value: args[1], params }).toUpperCase()
            
            if (o.nodeType === Node.ELEMENT_NODE) answer = o.getElementsByTagName(_tag_name)[0]
            else answer = o.element && o.element.getElementsByTagName(_tag_name)[0]
            answer = window.views[answer.id]

        } else if (k0 === "getInputs()" || k0 === "inputs()") {
            
            var _input, _textarea
            if (o.nodeType === Node.ELEMENT_NODE) {
                _input = o.getElementsByTagName("INPUT")
                _textarea = o.getElementsByTagName("TEXTAREA")
            } else {
                _input = o.element && o.element.getElementsByTagName("INPUT")
                _textarea = o.element && o.element.getElementsByTagName("TEXTAREA")
            }
            answer = [..._input, ..._textarea].map(o => window.views[o.id])

        } else if (k0 === "getInput()") {
            
            if (o.nodeType === Node.ELEMENT_NODE) {
                if (views[o.id].type === "Input") answer = o
                else answer = o.getElementsByTagName("INPUT")[0]
            } else {
                if (o.type === "Input") answer = o
                else answer = o.element && o.element.getElementsByTagName("INPUT")[0]
            }
            
            if (!answer) return
            answer = views[answer.id]

        } else if (k0 === "position()") {

            var args = k.split(":")
            var relativeTo = views["root"].element
            if (args[1]) 
                relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "getBoundingClientRect()") {

            var relativeTo
            if (args[1]) relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            else relativeTo = o
            if (typeof relativeTo === "object") relativeTo = o.element
            answer = relativeTo.getBoundingClientRect()

        } else if (k0 === "relativePosition()") {

            var args = k.split(":")
            var relativeTo = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = position(o, relativeTo)

        } else if (k0 === "getChildrenByClassName()" || k0 === "className()") {

            // map not loaded yet
            if (view.status === "Loading") {
                view.controls = toArray(view.controls)
                view.controls.push({
                    event: `loaded?${key}`
                })
            }
            var args = k.split(":")
            var className = toValue({ req, res, _window, id, e, _, value: args[1], params })
            if (className) {
                if (typeof o === "object" && o.element) answer = [...o.element.getElementsByClassName(className)]
                else if (o.nodeType === Node.ELEMENT_NODE) answer = [...o.element.getElementsByClassName(className)]
            } else answer = []

            answer = answer.map(o => window.views[o.id])

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

            if (args[1]) {
                var _id = toValue({ req, res, _window, id, e, _, value: args[1], params })
                if (typeof _id === "object") focus({ id: _id.id })
            } else focus({ id: o.id })

        } else if (k0 === "getElementById()") {

            var _id = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = o.getElementById(_id)

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
            
            args.slice(1).map(arg => {
                var _timer = toValue({ req, res, _window, id, e, value: arg, params, _ })
                clearTimeout(_timer)
            })
            
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
            
        } else if (k0 === "contains()" || k0 === "contain()") {
            
            var _next = toValue({ req, res, _window, id: mainId, value: args[1], params, _, e })

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
            if (isPrice) answer = answer.tovieweString()
            
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
            if (isPrice) answer = answer.tovieweString()
            
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
            if (isPrice) answer = answer.tovieweString()
            
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
            if (isPrice) answer = answer.tovieweString()
            
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

            if (isPrice) answer = answer.tovieweString()

        } else if (k0 === "mod()") {
            
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
            if (isPrice) answer = answer.tovieweString()
            
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
            
            if (el) {
                if (window.views[el.id].type === "Input") {

                    answer = el.value
                    if (i === lastIndex && key && value !== undefined) el.value = value

                } else {

                    answer = el.innerHTML
                    if (i === lastIndex && key && value !== undefined) el.innerHTML = value
                }
            } else if (view && view.type === "Input") {

                if (i === lastIndex && key && value !== undefined) o[view.element.value] = value
                else return answer = o[view.element.value]

            } else if (view && view.type !== "Input") {

                if (i === lastIndex && key && value !== undefined) o[view.element.innerHTML] = value
                else return answer = o[view.element.innerHTML]
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
            // console.log(clone(o), _value, _index);
            o.splice(parseInt(_index), 0, _value)
            answer = o
            
        } else if (k0 === "remove()" || k0 === "rem()") { // remove child with data

            if (args[1]) {
                var _id = toValue({ req, res, _window, id, value: args[1], params,_ ,e })
                if (!views[_id]) return console.log("Element doesnot exist!")
                return remove({ id: _id })
            }

            var _id = typeof o === "string" ? o : o.id
            if (!views[_id]) return console.log("Element doesnot exist!")
            remove({ id: o.id })

        } else if (k0 === "removeChild()" || k0 === "remChild()") { // remove only child without removing data

            var args = k.split(":")
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

        } else if (k0 === "todayStart()") {

            var now = new Date()
            var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            return todayStart
            
        } else if (k0 === "toClock()") { // dd:hh:mm:ss
            
            var timestamp_ = o, days_ = true, hours_ = true, mins_ = true, secs_ = true
            if (args[1]) days_ = toValue({ req, res, _window, id, e, value: args[1], params, _ })
            if (args[2]) hours_ = toValue({ req, res, _window, id, e, value: args[2], params, _ })
            if (args[3]) mins_ = toValue({ req, res, _window, id, e, value: args[3], params, _ })
            if (args[4]) secs_ = toValue({ req, res, _window, id, e, value: args[4], params, _ })

            answer = toClock({ timestamp: timestamp_, days_, hours_, mins_, secs_  })

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

            if (!isNaN(o) && typeof o === "string") o = parseInt(o)
            answer = new Date(o)

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
            
        } else if (k0 === "time()") {

            var _o
            if (args[1]) _o = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
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
            
            if (o instanceof Date) answer = o.getTime()
            else if (o.length === 5 && o.split(":").length === 2) {
                var _hrs = parseInt(o.split(":")[0]) * 60 * 60 * 1000
                var _mins = parseInt(o.split(":")[1]) * 60 * 1000
                answer = _hrs + _mins
            }
            else if (o.length === 8 && o.split(":").length === 3) {
                var _days = parseInt(o.split(":")[0]) * 24 * 60 * 60 * 1000
                var _hrs = parseInt(o.split(":")[1]) * 60 * 60 * 1000
                var _mins = parseInt(o.split(":")[2]) * 60 * 1000
                answer = _days + _hrs + _mins
            }
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

            if (k[0] === "_") {
                answer = o.filter(o => toValue({ req, res, _window, id, e, _: o, value: args[1], params }))
            } else {
                var _id = toArray(toValue({ req, res, _window, id, e, _, value: args[1], params }))
                answer = o.filter(o => _id.includes(o.id))
            }

        } else if (k0.includes("find()")) {
            
            if (k[0] === "_") answer = toArray(o).find(o => toApproval({ _window, e, string: args[1], id, _: o, req, res }) )
            else answer = toArray(o).find(o => toApproval({ _window, e, string: args[1], id, _, req, res, object: o }) )
            
        } else if (k0.includes("findIndex()")) {
            
            if (k[0] === "_") answer = o.findIndex(o => toApproval({ _window, e, string: args[1], id, _: o, req, res }) )
            else answer = o.findIndex(o => toApproval({ _window, e, string: args[1], id, _, req, res, object: o }) )
            
        } else if (k0.includes("map()") || k0 === "_()" || k0 === "()") {
            
            args.slice(1).map(arg => {

                if (k[0] === "_") answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: arg, value, key, params, index, _: o, e }) )
                else answer = toArray(o).map((o, index) => reducer({ req, res, _window, id, path: arg, object: o, value, key, params, index, _, e }) )
            })

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

        } else if (k0 === "action()") {
            
            answer = o.derivations
            
        } else if (k0 === "action()") {
            
            answer = execute({ _window, id, actions: path[i - 1], params, e })
            
        } else if (k0 === "toPrice()" || k0 === "price()") {
            
            var _price
            if (args[1]) _price = toValue({ req, res, _window, id, e, _, params, value: args[1] })
            else _price = o
            answer = o = toPrice(toNumber(_price))
            
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

        } else if (k0 === "parseFloat()") {
            
            answer = parseFloat(o)

        } else if (k0 === "parseInt()") {
            
            answer = parseInt(o)

        } else if (k0 === "stringify()") {
            
            answer = JSON.stringify(o)

        } else if (k0 === "parse()") {
            
            answer = JSON.parse(o)

        } else if (k0 === "getCookie()") {

            var cname = toValue({ req, res, _window, id, e, _, params, value: args[1] })
            answer = getCookie({ name: cname, req, res })
        
        } else if (k0 === "eraseCookie()") {

            // eraseCookie():name
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
          
            var _id = toValue({ req, res, _window, id, e, value: args[1] || "", params, _ })
            var _view = toValue({ req, res, _window, id, e, value: args[2] || "", params, _ })
            var _page = toValue({ req, res, _window, id, e, value: args[3] || "", params, _ })
            var _timer = toValue({ req, res, _window, id, e, value: args[4] || "", params, _ })
            require("./toggleView").toggleView({ _window, toggle: { id: _id, view: _view, page: _page, timer: _timer }, id })

        } else if (k0 === "preventDefault()") {
            
            answer = o.preventDefault()

        } else if (k0 === "isChildOf()") {
            
            var el = toValue({ req, res, _window, id, e, _, value: args[1], params })
            answer = isEqual(el, o)

        } else if (k0 === "isChildOfId()") {
            
            var _id = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)

        } else if (k0 === "isnotChildOfId()") {
            
            var _id = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var _ids = getDeepChildren({ _window, id: _id }).map(val => val.id)
            answer = _ids.find(_id => _id === o)
            answer = answer ? false : true

        } else if (k0 === "allChildren()" || k0 === "deepChildren()") { 
            // all values of view element and children elements in object formula
            
            answer = getDeepChildren({ _window, id: o.id })
            
        } else if (k0 === "note()") { // note
            
            var text = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var type = toValue({ req, res, _window, id, e, _, value: args[2], params })
            return note({ note: { text, type } })
            
        } else if (k0 === "mininote()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, value: _text, params })
            var mininoteControls = toCode({ string: `():mininote-text.txt()=${_text};clearTimer():[)(:mininote-timer];():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _ })

        } else if (k0 === "tooltip()") {
          
            var _text = k.split(":")[1]
            _text = toValue({ req, res, _window, id, e, _, value: _text, params })
            var mininoteControls = toCode({ string: `():tooltip-text.txt()=${_text};clearTimer():[)(:tooltip-timer];():tooltip.style():[opacity=1;transform=scale(1)];)(:tooltip-timer=timer():[():tooltip.style():[opacity=0;transform=scale(0)]]:500` })
            toParam({ _window, string: mininoteControls, e, id, req, res, _ })

        } else if (k0 === "mouseenter()") {
          
            answer = o.mouseenter

        } else if (k0 === "readonly()") {
          
            if (typeof o === "object") {
                if (key && value !== undefined) answer = o.element.readOnly = value
                answer = o.element.readOnly
            } else if (o.nodeType === Node. ELEMENT_NODE) {
                if (key && value !== undefined) answer = o.readOnly = value
                answer = o.readOnly
            }

        } else if (k0 === "range()") {
          
            var args = k.split(":").slice(1)
            var _index = 0, _range = []
            var _startIndex = toValue({ req, res, _window, id, e, _, value: args[0], params }) || 0
            var _endIndex = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var _steps = toValue({ req, res, _window, id, e, _, value: args[2], params }) || 1
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
            
        } else if (k0 === "update()") {
          
            var _id
            if (args[1]) _id = toValue({ req, res, _window, id, e, _, value: args[1], params }) || id
            else _id = o.id
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
            text = toValue({ req, res, _window, id, e, _, value: text, params })
            
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
            
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.add(_class)
            else answer = o.classList.add(_class)

        } else if (k0 === "removeClass()") {
            
            var _class = toValue({ req, res, _window, id, e, _: o, value: args[1], params })
            if (o.element) answer = o.element.classList.remove(_class)
            else if(o.nodeType) answer = o.classList.remove(_class)

        } else if (k.includes("def()")) {

            var _name = toValue({ req, res, _window, id, e, _, value: args[1], params })
            var _params = global.codes[args[2]] ? global.codes[args[2]] : args[2]
            var _string = toValue({ req, res, _window, id, e, _, value: args[3], params })
            o[`${_name}()`] = {
                name: _name,
                params: _params ? _params.split(":") : [],
                string: _string,
                id, _, e, mount,
                req, res, 
            }
            
        } else if (k0.slice(-2) === "()" && k0 !== "()" && (o[k0.charAt(0) === "_" ? k0.slice(1) : k0] || o[k0])) { // function
            
            var string = decode({ _window, string: o[k0].string }), _params = o[k0].params
            console.log(string, k0);
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
            if (o[k0]) return toParam({ _window, ...o[k0], string, object: o })
            else if (o[k0.slice(1)]) return toParam({ _window, ...o[k0], string, _: o })
            
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
            
            if (Array.isArray(o)) {
                if (isNaN(k)) {
                    if (o.length === 0) o.push({})
                    o = o[0]
                }
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
                }
            }
            answer = o[k]
        }
        
        return answer

    }, object)
    
    return answer
}

const getDeepChildren = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    var all = [view]
    if (!view) return []
    
    if ([...view.element.children].length > 0) 
    ([...view.element.children]).map(el => {

        var _view = _window ? _window.views[el.id] : window.views[el.id]
        
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
        
        var _view = _window ? _window.views[el.id] : window.views[el.id]

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
},{"./capitalize":34,"./clone":36,"./cookie":40,"./decode":48,"./execute":53,"./exportJson":54,"./focus":57,"./generate":59,"./getDateTime":60,"./getDaysInMonth":61,"./getType":63,"./importJson":64,"./isEqual":67,"./note":73,"./refresh":79,"./remove":81,"./route":83,"./save":84,"./setPosition":89,"./toApproval":95,"./toArray":96,"./toClock":99,"./toCode":100,"./toId":104,"./toNumber":105,"./toParam":107,"./toPrice":108,"./toSimplifiedDate":109,"./toValue":112,"./toggleView":113,"./update":114}],79:[function(require,module,exports){
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
},{"./clone":36,"./createElement":44,"./generate":59,"./setElement":88,"./starter":91,"./toArray":96,"./update":114}],80:[function(require,module,exports){
module.exports = {
    reload: () => {
        document.location.reload(true)
    }
}
},{}],81:[function(require,module,exports){
const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const remove = ({ remove: _remove, id }) => {

  var views = window.views
  var view = window.views[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(view.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(view.Data)
    keys.unshift(")(")
    keys.push("delete()")

    reducer({ id, path: keys })
  }

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlist-caller"] && view.element.contains(views[global["actionlist-caller"]].element)) {
    var closeActionlist = toCode({ string: "clearTimer():[)(:actionlist-timer];():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()" })
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

},{"./clone":36,"./reducer":78,"./toCode":100,"./toParam":107,"./update":114}],82:[function(require,module,exports){
const resize = ({ id }) => {

  var view = window.views[id]
  if (!view) return
  
  if (view.type !== "Input") return

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

  pText = pText.split(" ").join("-")
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

  if (pStyle.width === "100%")
  lDiv.style.width = (view.element ? view.element.clientWidth : lDiv.style.width) + "px"
  
  lDiv.style.width = lDiv.clientWidth + 2 + "px"

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight
  }
  
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

},{}],83:[function(require,module,exports){
const { update } = require("./update")

module.exports = {
    route: ({ route = {} }) => {

        var global = window.global
        var path = route.path || global.path
        var currentPage = route.page || path.split("/")[1].split("?")[0] || "main"
        var title = route.title || global.data.page[currentPage].title
        
        if (!global.data.page[currentPage]) return
        global.data.page[currentPage]["views"] = global.data.page[currentPage]["views"] || []
        global.currentPage = currentPage
        global.path = route.path ? path : currentPage === "main" ? "/" : currentPage

        history.pushState(null, title, global.path)
        document.title = title
        
        update({ id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0
    }
}
},{"./update":114}],84:[function(require,module,exports){
const axios = require("axios")
const { clone } = require("./clone")
const { toAwait } = require("./toAwait")

const save = async ({ id, e, ...params }) => {

  var global = window.global
  var save = params.save || {}
  var local = window.views[id]
  var collection = save.collection = save.collection || save.path
  var _data = clone(save.data)
  var headers = clone(save.headers) || {}
  headers.project = headers.project || global.projectId
  delete save.headers

  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]

  if (!save.doc && !save.id && (!_data || (_data && !_data.id))) return
  save.doc = save.doc || save.id || _data.id
  delete save.data
  
  var { data } = await axios.post(`/database/${collection}`, { save, data: _data }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  local.save = data
  console.log(data)

  // await params
  toAwait({ id, e, params })
}

module.exports = { save }
},{"./clone":36,"./toAwait":97,"axios":117}],85:[function(require,module,exports){
const axios = require('axios')
const { toString } = require('./toString')
const { toAwait } = require('./toAwait')
const { clone } = require('./clone')

module.exports = {
    search: async ({ id, e, ...params }) => {
        
        var global = window.global
        var search = params.search || {}
        var view = window.views[id]
        var collection = search.collection || search.path || ""
        var headers = search.headers || {}
        headers.project = headers.project || global.projectId
        
        if (global["access-key"]) headers["access-key"] = global["access-key"]
        delete search.headers

        // search
        headers.search = encodeURI(toString({ search }))
        
        var { data } = await axios.get(`/database/${collection}`, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })
        view.search = clone(data)
        console.log(data)
        
        // await params
        toAwait({ id, e, params })
    }
}
},{"./clone":36,"./toAwait":97,"./toString":110,"axios":117}],86:[function(require,module,exports){
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

},{"./isArabic":66}],87:[function(require,module,exports){
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

},{"./clone":36,"./reducer":78}],88:[function(require,module,exports){
(function (global){(function (){
const { controls } = require("./controls")
// const { starter } = require("./starter")
const { toArray } = require("./toArray")

const setElement = ({ id }) => {

    var view = window.views[id]
    if (!view) return console.log("No Element", id)
    
    // before loading event
    var beforeLoadingControls = view.controls && toArray(view.controls)
        .filter(control => control.event && control.event.split("?")[0].includes("beforeLoading"))
    if (beforeLoadingControls) {

        var currentPage = global.currentPage
        controls({ controls: beforeLoadingControls, id })
        view.controls = toArray(view.controls).filter(controls => controls.event ? !controls.event.includes("beforeLoading") : true)

        // page routed
        if (currentPage !== global.currentPage) return true
    }

    // status
    view.status = "Mounting Element"
    
    view.element = document.getElementById(id)
    if (!view.element) return delete window.views[id]

    // status
    view.status = "Element Loaded"
}
    
module.exports = { setElement }
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./controls":39,"./toArray":96}],89:[function(require,module,exports){
const setPosition = ({ position, id, e }) => {
  
  var value = window.views
  var leftDeviation = position.left
  var topDeviation = position.top
  var align = position.align
  var element = value[id].element
  var mousePos = position.positioner === "mouse"
  var fin = element.getElementsByClassName("fin")[0]

  if (!value[position.positioner] && !mousePos) return

  var positioner, topPos, bottomPos, rightPos, leftPos, heightPos, widthPos

  if (mousePos) {

    topPos = e.clientY + window.scrollY
    bottomPos = e.clientY + window.scrollY
    rightPos = e.clientX + window.scrollX
    leftPos = e.clientX + window.scrollX
    heightPos = 0
    widthPos = 0
    
  } else {

    positioner = value[position.positioner].element
    topPos = positioner.getBoundingClientRect().top
    bottomPos = positioner.getBoundingClientRect().bottom
    rightPos = positioner.getBoundingClientRect().right
    leftPos = positioner.getBoundingClientRect().left
    heightPos = positioner.clientHeight
    widthPos = positioner.clientWidth

    // set height to fit content
    element.style.height = value[element.id].style.height
  }

  var top 
  var left 
  var bottom 
  var distance 
  var placement
  var height = element.offsetHeight
  var width = element.offsetWidth
  
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

    top = topPos + heightPos + 10
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

},{}],90:[function(require,module,exports){
(function (global){(function (){
const { reducer } = require("./reducer")
const { toArray } = require("./toArray")
const { toNumber } = require("./toNumber")

const sort = ({ sort = {}, id, e }) => {

  var view = window.views[id]
  if (!view) return

  var Data = sort.Data || view.Data
  var options = global[`${Data}-options`] = global[`${Data}-options`] || {}
  var data = sort.data || global[Data]

  options.sort = options.sort === "ascending" ? "descending" : "ascending"
  var path = typeof sort.path === "string" ? (sort.path || "").split(".") : typeof sort.path !== undefined ? toArray(sort.path) : [""]
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

      // number
      else a = toNumber(a)
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

      // number
      else b = toNumber(b)
    }

    if ((!isNaN(a) && b === "!") || (!isNaN(b) && a === "!")) {
      if (a === "!") a = 0
      else if (b === "!") b = 0
    }

    if ((!isNaN(a) && isNaN(b)) || (!isNaN(b) && isNaN(a))) {
      a = a.toString()
      b = b.toString()
    }

    if (options.sort === "ascending") {
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

  global[Data] = data
}

module.exports = {sort}
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./reducer":78,"./toArray":96,"./toNumber":105}],91:[function(require,module,exports){
const control = require("../control/control")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const { isArabic } = require("./isArabic")
const { resize } = require("./resize")

const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")
  const { defaultInputHandler } = require("./defaultInputHandler")

  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Functions"

  /* Defaults must start before controls */
  
  // arabic text
  isArabic({ id })
  
  // input handlers
  defaultInputHandler({ id })
  
  // on loaded image
  // if (view.type === 'Image') view.element.src = view.src

  /* End of default handlers */

  // resize
  if (view.type === "Input") resize({ id })

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

},{"../control/control":13,"./controls":39,"./defaultInputHandler":49,"./event":52,"./isArabic":66,"./resize":82,"./toArray":96,"./toParam":107}],92:[function(require,module,exports){
const setState = ({}) => {}

module.exports = {setState};

},{}],93:[function(require,module,exports){
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
        view.controls.push({
          event: `loaded?().element.style.${key}=${value}`
        })
      }
    }
  })
}

module.exports = { setStyle, resetStyles, toggleStyles, mountAfterStyles }

},{"./resize":82,"./toArray":96}],94:[function(require,module,exports){
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
},{"./capitalize":34,"./clone":36,"./style":93}],95:[function(require,module,exports){
const { isEqual } = require("./isEqual")
const { generate } = require("./generate")

const toApproval = ({ _window, e, string, id, _, req, res, object }) => {

  const { toValue } = require("./toValue")
  const { reducer } = require("./reducer")

  // no string but object exists
  if (!string)
    if (object) return true
    else if (object !== undefined) return false

  // no string
  if (!string || typeof string !== "string") return true

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
    var view = _window ? _window.views[id] : window.views[id] || {}

    if (condition.includes("#()")) {
      view["#"] = toArray(view["#"])
      return view["#"].push(condition.slice(4))
    }

    // or
    if (condition.includes("||")) {
      var conditions = condition.split("||"), _i = 0
      approval = false
      while (!approval && conditions[_i] !== undefined) {
        approval = toApproval({ _window, e, string: conditions[_i], id, _, req, res, object })
        _i += 1
      }
      return approval
    }

    condition = condition.split("=")
    var equalOp = condition.length > 1
    var greaterOp = condition[0].split(">")[1] && true
    if (greaterOp) {
      condition[1] = condition[1] || condition[0].split(">")[1]
      condition[0] = condition[0].split(">")[0]
    }
    var lessOp = condition[0].split("<")[1] && true
    if (lessOp) {
      condition[1] = condition[1] || condition[0].split("<")[1]
      condition[0] = condition[0].split("<")[0]
    }

    var key = condition[0]
    var value = condition[1]
    var notEqual

    // /////////////////// value /////////////////////

    if (value) value = toValue({ _window, id: mainId, value, e, _, req, res })

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
    var keygen = generate()
    var path = typeof key === "string" ? key.split(".") : []

    if (!key && object !== undefined) view[keygen] = object
    else if (key === "false" || key === "undefined") view[keygen] = false
    else if (key === "true") view[keygen] = true
    else if (key === "mobile()" || key === "phone()") view[keygen] = global.device.type === "phone"
    else if (key === "desktop()") view[keygen] = global.device.type === "desktop"
    else if (key === "tablet()") view[keygen] = global.device.type === "tablet"
    else if (key === "_") view[keygen] = _
    else if (object || path[0].includes("()") || path[0].includes(")(") || (path[1] && path[1].includes("()"))) view[keygen] = reducer({ _window, id, path, e, _, req, res, object })
    else view[keygen] = reducer({ _window, id, path, e, _, req, res, object: object ? object : view })
    // else view[keygen] = key

    if (!equalOp && !greaterOp && !lessOp) approval = notEqual ? !view[keygen] : (view[keygen] === 0 ? true : view[keygen])
    else {
      if (equalOp) approval = notEqual ? !isEqual(view[keygen], value) : isEqual(view[keygen], value)
      if (greaterOp && (equalOp ? !approval : true)) approval = notEqual ? !(view[keygen] > value) : (view[keygen] > value)
      if (lessOp && (equalOp ? !approval : true)) approval = notEqual ? !(view[keygen] < value) : (view[keygen] < value)
    }

    delete view[keygen]
  })

  return approval
}

module.exports = { toApproval }

},{"./generate":59,"./isEqual":67,"./reducer":78,"./toValue":112}],96:[function(require,module,exports){
const toArray = (data) => {
  return data !== undefined ? (Array.isArray(data) ? [...data] : [data]) : [];
}

module.exports = {toArray}

},{}],97:[function(require,module,exports){
module.exports = {
  toAwait: ({ id, e, params = {} }) => {

    const { execute } = require("./execute")
    const { toParam } = require("./toParam")

    if (!params.asyncer) return
    var awaiter = params.awaiter, awaits = params.await, _params

    delete params.asyncer
    delete params.awaiter
    delete params.await
    
    // get params
    if (awaits && awaits.length > 0) _params = toParam({ id, e, string: awaits, asyncer: true })
    if (_params && _params.break) return

    // override params
    if (_params) params = { ...params, ..._params }
    if (awaiter) execute({ id, e, actions: awaiter, params })
  }
}

},{"./execute":53,"./toParam":107}],98:[function(require,module,exports){
module.exports = {
    toCSV: ({ file = {} }) => {

        var data = file.data
        var fileName = file.name

        var CSV = ''
        //Set Report title in first row or line

        CSV += fileName + '\r\n\n'

        //This condition will generate the Label/Header
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
        CSV += row + '\r\n'

        //1st loop is to extract each row
        data.map(d => {
            var row = ""

            //2nd loop will extract each column and convert it in string comma-seprated
            keys.map(k => row += '"' + d[k] + '",')

            row = row.slice(0, -1)

            //add a line break after each row
            CSV += row + '\r\n'
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
},{}],99:[function(require,module,exports){
module.exports = {
    toClock: ({ timestamp, days_ = true, hours_ = true, mins_ = true, secs_ = true }) => {

        if (!timestamp) return "00:00"
        var days = Math.floor(timestamp / 86400000) + ""
        var _days = timestamp % 86400000
        var hrs = Math.floor(_days / 3600000) + ""
        var _hrs = _days % 3600000
        var mins = Math.floor(_hrs / 60000) + ""
        var _mins = _hrs % 60000
        var secs = Math.floor(_mins / 1000) + ""

        if (days.length === 1) days = "0" + days
        if (hrs.length === 1) hrs = "0" + hrs
        if (mins.length === 1) mins = "0" + mins
        if (secs.length === 1) secs = "0" + secs

        return (days_ ? days + " : " : "") + (hours_ ? hrs + " : " : "") + (mins_ ? mins : "") + (secs_ ? " : " + secs : "")
    }
}
},{}],100:[function(require,module,exports){
const { generate } = require("./generate")

const toCode = ({ _window, string, e, codes, start = "[", end = "]" }) => {

  if (typeof string !== "string") return string
  var codeName = start === "'" ? "codedS()" : "coded()"

  var global = {}
  if (!codes) global = _window ? _window.global : window.global
  string = string.split("[]").join("_array")
  string = string.split("{}").join("_map")
  
  var keys = string.split(start)
  
  if (keys.length === 1) return string

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
    if (subKey[0] === keys[1] && keys.length === 2) 
    return keys.join(start)

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

  return string
}

module.exports = { toCode }

},{"./generate":59}],101:[function(require,module,exports){
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

},{"./generate":59,"./toArray":96}],102:[function(require,module,exports){
const toControls = ({ id }) => {}

module.exports = {toControls}

},{}],103:[function(require,module,exports){
const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { clone } = require("./clone")

module.exports = {
  toHtml: ({ _window, id, req, res }) => {

    var { createElement } = require("./createElement")

    // views
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]
    
    // innerHTML
    var text = view.text !== undefined ? view.text.toString() : typeof view.data !== "object" ? view.data : ''
    var innerHTML = view.type !== "View" ? text : ""
    var checked = view.input && view.input.type === "radio" && parseFloat(view.data) === parseFloat(view.input.defaultValue)
    
    innerHTML = toArray(view.children).map((child, index) => {

      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      
      return createElement({ _window, id, req, res })
      
    }).join("\n")
    
    var value = (view.input && view.input.value) !== undefined ?
        view.input.value : view.data !== undefined ? view.data : ""

    var tag, style = toStyle({ _window, id })
        
    if (typeof value === 'object') value = ''
    
    if (view.type === "View") {
      tag = `<div class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>\n${innerHTML}\n</div>`
    } else if (view.type === "Image") {
      tag = `<img class='${view.class}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index}' src='${view.src}'>${innerHTML}</img>`
    } else if (view.type === "Table") {
      tag = `<table class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>\n${innerHTML}\n</table>`
    } else if (view.type === "Row") {
      tag = `<tr class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</tr>`
    } else if (view.type === "Header") {
      tag = `<th class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</th>`
    } else if (view.type === "Cell") {
      tag = `<td class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</td>`
    } else if (view.type === "Label") {
      tag = `<label class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index}'>${innerHTML}</label>`
    } else if (view.type === "Span") {
      tag = `<span class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</span>`
    } else if (view.type === "Text") {
      if (view.label) {
        tag = `<label class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index}'>${innerHTML}</label>`
      } else if (view.h1) {
        tag = `<h1 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h1>`
      } else if (view.h2) {
        tag = `<h2 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h2>`
      } else if (view.h3) {
        tag = `<h3 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h3>`
      } else if (view.h4) {
        tag = `<h4 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h4>`
      } else if (view.h5) {
        tag = `<h5 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h5>`
      } else if (view.h6) {
        tag = `<h6 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h6>`
      } else if (view.span) {
        tag = `<span class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</span>`
      } else {
        tag = `<p class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${text}</p>`
      }
    } else if (view.type === "Icon") {
      tag = `<i class='${view.outlined ? "material-icons-outlined" : view.rounded ? "material-icons-round" : view.sharp ? "material-icons-sharp" : view.filled ? "material-icons" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || ""} ${view.icon.name}' id='${view.id}' style='${style}${view.google ? "; opacity:0; transition:.2s" : ""}' index='${view.index}'>${view.google ? view.icon.name : ""}</i>`
    } else if (view.type === "Textarea") {
      tag = `<textarea class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index}'>${view.data || view.input.value || ""}</textarea>`
    } else if (view.type === "Input") {
      if (view.textarea) {
        tag = `<textarea spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index}'>${value}</textarea>`
      } else {
        tag = `<input ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' ${view.input.name ? `name="${view.input.name}"` : ""} ${view.input.accept ? `accept="${view.input.accept}/*"` : ""} type='${view.input.type || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.input.defaultValue ? `defaultValue="${view.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index}'/>`
      }
    } else if (view.type === "Paragraph") {
      tag = `<textarea class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' index='${view.index}'>${text}</textarea>`
    }

    // linkable
    if (view.link) {

      var id = generate(), style = ''
      var _view = views[id]
      views[id] = {}

      _view = { id, parent: view.id }
      _view.style = view.link.style
      views[id] = _view
      if (_view.style) style = toStyle({ _window, id })
      
      tag = `<a id='${id}' href=${view.link.path || global.host} style='${style}' index='${view.index}'>${tag}</a>`
    }

    return tag
  }
}
},{"./clone":36,"./createElement":44,"./generate":59,"./toArray":96,"./toStyle":111}],104:[function(require,module,exports){
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

},{"./generate":59}],105:[function(require,module,exports){
module.exports = {
  toNumber: (string) => {
    
    if (typeof string === 'number') return string
    
    if ((parseFloat(string) || parseFloat(string) === 0)  && (!isNaN(string.charAt(0)) || string.charAt(0) === '-')) {
      if (!isNaN(string.split(",").join(""))) {
        // is Price
        string = parseFloat(string.split(",").join(""));

      } else if (parseFloat(string).length === string.length) parseFloat(string)
    }

    return string
  },
};

},{}],106:[function(require,module,exports){
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
},{}],107:[function(require,module,exports){
const { toValue } = require("./toValue")
const { reducer } = require("./reducer")
const { generate } = require("./generate")
const { decode } = require("./decode")
const { toCode } = require("./toCode")
const { clone } = require("./clone")

const toParam = ({ _window, string, e, id = "", req, res, mount, object, _, asyncer, eventParams }) => {
  const { toApproval } = require("./toApproval")

  var viewId = id, mountDataUsed = false, mountPathUsed = false
  var global = _window ? _window.global : window.global

  if (typeof string !== "string" || !string) return string || {}
  var params = object || {}

  if (string.includes('coded()') && string.length === 12) string = global.codes[string]

  // condition not param
  if (string.includes("==") || string.includes("!=") || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) 
  return toApproval({ id, e, string: string.replace("==", "="), req, res, _window, _, object })

  string.split(";").map(param => {
    
    var key, value, id = viewId
    var view = _window ? _window.views[id] : window.views[id]

    // break
    //if (params.break || view && view.break) return

    if (param.slice(0, 2) === "#:") return
    
    // split
    if (param.includes("=")) {

      var keys = param.split("=")
      key = keys[0]
      value = param.substring(key.length + 1)

    } else key = param

    // await
    if (key.slice(0, 8) === "async():" || key.slice(0, 7) === "wait():") {

      if (eventParams) {

        var asyncers = param.split(":").slice(1)
        var promises = []
        asyncers.map(async asyncer => {
          promises.push(await toParam({ _window, string: asyncer, e, id, req, res, mount }))
          await Promise.all(promises)
        })

        return

      } else {

        var awaiter = param.split(":").slice(1)
        if (asyncer) {
          if (awaiter[0].slice(0, 7) === "coded()") awaiter[0] = global.codes[awaiter[0]]
          var _params = toParam({ _window, string: awaiter[0], e, id, req, res, mount })
          params = { ...params, ..._params }
          awaiter = awaiter.slice(1)
        }

        params.await = params.await || ""
        if (awaiter[0]) return params.await += `wait():${awaiter.join(":")};`
        else if (awaiter.length === 0) return
      }
    }

    // await
    if (key.includes("await().")) {

      var awaiter = param.split("await().")[1]
      params.await = params.await || ""
      return params.await += `${awaiter};`
    }

    // mouseenter
    if (param.slice(0, 10) === "mouseenter") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.mouseenter = view.mouseenter || ""
      return view.mouseenter += `${param};`
    }

    // click
    if (param.slice(0, 6) === "click." || param.slice(0, 6) === "click:") {

      param = param.slice(6)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.click = view.click || ""
      return view.click += `${param};`
    }

    // change
    if (param.slice(0, 6) === "change") {

      param = param.slice(7)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.change = view.change || ""
      return view.change += `${param};`
    }

    // mouseleave
    if (param.slice(0, 10) === "mouseleave") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.mouseleave = view.mouseleave || ""
      return view.mouseleave += `${param};`
    }

    // mouseover
    if (param.slice(0, 10) === "mouseover") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.mouseover = view.mouseover || ""
      return view.mouseover += `${param};`
    }

    // keyup
    if (param.slice(0, 10) === "keyup") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.keyup = view.keyup || ""
      return view.keyup += `${param};`
    }

    // keydown
    if (param.slice(0, 10) === "keydown") {

      param = param.slice(11)
      if (param.slice(0, 7) === "coded()") param = global.codes[param]
      view.keydown = view.keydown || ""
      return view.keydown += `${param};`
    }
    
    if (value === undefined) value = generate()
    else value = toValue({ _window, id, e, value, params, req, res, _ })

    // condition not approved
    if (value === "*return*") return

    id = viewId

    var path = typeof key === "string" ? key.split(".") : [], timer
    var path0 = path[0].split(":")[0]
    var underscored = path0.charAt(0) === "_"

    // implemented function
    if (path0.slice(-2) === "()" && path0 !== "()" && view && (view[underscored ? path0.slice(1) : path0] || view[path0])) {
      
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
      if (view[path0]) return toParam({ _window, ...view[path0], string, object  })
      else if (underscored && view[path0.slice(1)]) return toParam({ _window, ...view[path0], string, _: object })
    }

    // object structure
    if (path.length > 1 || path[0].includes("()") || path[0].includes(")(") || object) {
      
      // mount state & value
      if (path[0].includes("()") || path[0].includes(")(") || path[0].includes("_") || object) {
        
        var _object
        if (path[0].split(":")[0] === "if()") _object = params
        else _object = object

        var myFn = () => reducer({ _window, id, path, value, key, params, e, req, res, _, object, mount })
        if (timer) {
          
          timer = parseInt(timer)
          clearTimeout(view[path.join(".")])
          view[path.join(".")] = setTimeout(myFn, timer)

        } else myFn()

      } else {
        
        if (id && view && mount) reducer({ _window, id, path: ["()", ...path], value, key, params, e, req, res, _, mount })
        reducer({ _window, id, path, value, key, params, e, req, res, _, mount, object: params })
      }
      
    } else if (key) {
      
      if (mount) view[key] = value
      params[key] = value
    }

    /////////////////////////////////////////// Create Element Stuff ///////////////////////////////////////////////

    // mount data directly when found
    if (mount && !mountDataUsed && ((params.data !== undefined && !view.Data) || params.Data || (view && view.data !== undefined && !view.Data))) {

      mountDataUsed = true
      params.Data = view.Data = view.Data || generate()
      params.data = global[view.Data] = view.data = view.data !== undefined ? view.data : (global[view.Data] !== undefined ? global[view.Data] : {})
      
      // duplicated element
      if (view.duplicatedElement) {

        delete view.path
        delete view.data
      }
    }
  
    // mount path directly when found
    if (mount && !mountPathUsed && params.path) {

      mountPathUsed = true

      // path & derivations
      var path = (typeof view.path === "string" || typeof view.path === "number") ? view.path.toString().split(".") : []
          
      if (path.length > 0) {
        if (!view.Data) {

          view.Data = generate()
          global[view.Data] = view.data || {}
        }

        view.derivations.push(...path)
      }
    }
  
    //////////////////////////////////////////////////////// End /////////////////////////////////////////////////////////
  })

  return params
}

module.exports = { toParam }

},{"./clone":36,"./decode":48,"./generate":59,"./reducer":78,"./toApproval":95,"./toCode":100,"./toValue":112}],108:[function(require,module,exports){
module.exports = {
  toPrice: (string) => {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
};

},{}],109:[function(require,module,exports){
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
},{}],110:[function(require,module,exports){
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

},{}],111:[function(require,module,exports){
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
        else if (k === "fontSize") k = "font-size";
        else if (k === "fontStyle") k = "font-style";
        else if (k === "fontWeight") k = "font-weight";
        else if (k === "textDecoration") k = "text-decoration";
        else if (k === "lineHeight") k = "line-height";
        else if (k === "letterSpacing") k = "letter-spacing";
        else if (k === "textOverflow") k = "text-overflow";
        else if (k === "whiteSpace") k = "white-space";
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

},{}],112:[function(require,module,exports){
const { generate } = require("./generate")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")

const toValue = ({ _window, value, params, _, id, e, req, res, object, mount }) => {

  const { toParam } = require("./toParam")

  var view = _window ? _window.views[id] : window.views[id]
  var global = _window ? _window.global : window.global

  // no value
  if (!value) return value

  // coded
  if (value.includes('coded()') && value.length === 12) value = global.codes[value]
  
  // string
  if (value.split("'").length > 1) value = toCode({ _window, string: value, start: "'", end: "'" })
  if (value.includes('codedS()') && value.length === 13) return value = global.codes[value]

  // or
  if (value.includes("||")) {
    var answer
    value.split("||").map(value => {
      if (!answer) answer = toValue({ _window, value, params, _, id, e, req, res, object, mount })
    })
    return answer
  }

  // value is a param it has key=value
  if (value.includes("=") || value.includes(";") || value.includes(">") || value.includes("<")) return toParam({ req, res, _window, id, e, string: value, _, object, mount })

  // multiplication
  if (value.includes("*")) {

    var values = value.split("*").map(value => toValue({ _window, value, params, _, id, e, req, res, object, mount }))
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

  } else if (value.includes("+")) { // addition
    
    var values = value.split("+").map(value => toValue({ _window, value, params, _, id, e, req, res, object, mount }))
    var newVal = values[0]
    values.slice(1).map(val => newVal += val)
    return value = newVal

  } else if (value.includes("-")) { // subtraction

    var _value = calcSubs({ _window, value, params, _, id, e, req, res, object })
    if (_value !== value) return _value
  }

  // return await value
  if (value.split("await().")[1] !== undefined && !value.split("await().")[0]) return value.split("await().")[1]
  
  // string
  // if (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") return value = value.slice(1, -1)

  var path = typeof value === "string" ? value.split(".") : []

  /* value */
  if (value === ")(") value = _window ? _window.global : window.global
  else if (object) value = reducer({ _window, id, object, path, value, params, _, e, req, res, mount })
  else if (value.charAt(0) === "[" && value.charAt(-1) === "]") value = reducer({ _window, id, object, path, value, params, _, e, req, res, mount })
  else if ((path[0].includes("()")) && path.length === 1) {

    var val0 = value.split("coded()")[0]
    if (value.includes('coded()') && !val0.includes("()") && !val0.includes("_map") && !val0.includes("_array") && !val0.includes("_arr")) {

      value.split("coded()").slice(1).map(val => {
        val0 += toValue({ _window, value: global.codes[`coded()${val.slice(0, 5)}`], params, _, id, e, req, res, object, mount })
        val0 += val.slice(5)
      })
      value = val0

    } else value = reducer({ _window, id, e, path, params, object, _, req, res })
  } else if (path[1] || path[0].includes(")(")) value = reducer({ _window, id, object, path, value, params, _, e, req, res, mount })
  else if (path[0].includes("_array") || path[0].includes("_map")) value = reducer({ _window, id, e, path, params, object, _, req, res, mount })
  else if (value === "()") value = view
  else if (typeof value === "boolean") { }
  else if (!isNaN(value) && value !== " ") value = parseFloat(value)
  else if (value === undefined || value === "generate") value = generate()
  else if (value === "undefined") value = undefined
  else if (value === "false") value = false
  else if (value === "true") value = true
  else if (value === "null") value = null
  else if (value === "_") value = _
  else if (value.includes(":") && value.split(":")[1].slice(0, 7) === "coded()") {

    var args = value.split(":")
    var key = args[0]

    value = args.slice(1).map(arg => reducer({ _window, id, params, path: arg, object: key, e, req, res, _, mount }))
  }

  // _string
  else if (value === "_string") return ""
  return value
}

const calcSubs = ({ _window, value, params, _, id, e, req, res, object }) => {
  
  if (value.split("-").length > 1) {

    var allAreNumbers = true
    var values = value.split("-").map(value => {
      if (value.includes(":") && value.split(":")[0] !== ")(") return allAreNumbers = false

      if (allAreNumbers) {
        var num = toValue({ _window, value, params, _, id, e, req, res, object })
        if (typeof num !== "number") allAreNumbers = false
        return num
      }
    })
    
    if (allAreNumbers) {

      value = values[0]
      values.slice(1).map(val => value -= val)
      console.log(value);
      return value

    } else if (value.split("-").length > 2) {

      var allAreNumbers = true
      var _value = value.split("-").slice(0, 2).join("-")
      var _values = value.split("-").slice(2)
      _values.unshift(_value)
      
      var values = _values.map(value => {
        if (value.includes(":") && value.split(":")[0] !== ")(") return allAreNumbers = false

        if (allAreNumbers) {
          var num = toValue({ _window, value, params, _, id, e, req, res, object })
          if (typeof num !== "number") allAreNumbers = false
          return num
        }
      })

      if (allAreNumbers) {

        value = values[0]
        values.slice(1).map(val => value -= val)
        console.log(value);
        return value
  
      } else if (value.split("-").length > 3) {
  
        var allAreNumbers = true
        var _value = value.split("-").slice(0, 3).join("-")
        var _values = value.split("-").slice(3)
        _values.unshift(_value)
        var values = _values.map(value => {
          if (value.includes(":") && value.split(":")[0] !== ")(") return allAreNumbers = false
  
          if (allAreNumbers) {
            var num = toValue({ _window, value, params, _, id, e, req, res, object })
            if (typeof num !== "number") allAreNumbers = false
            return num
          }
        })

        if (allAreNumbers) {

          value = values[0]
          values.slice(1).map(val => value -= val)
          console.log(value);
          return value
    
        }
      }
    }
  }
  return value
}

module.exports = { toValue, calcSubs }

},{"./generate":59,"./reducer":78,"./toCode":100,"./toParam":107}],113:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toArray } = require("./toArray")

const toggleView = ({ toggle, id }) => {

  var views = window.views
  var global = window.global
  var togglePage = toggle.page 
  var toggleId = toggle.id
    || togglePage && views.root && views.root.element.children[0] && views.root.element.children[0].id
    || views[id] && views[id].element.children[0] && views[id].element.children[0].id

  var parentId = toggleId ? (toggleId !== "root" ? views[toggleId].parent : toggleId) : id
  var view = {}
  var viewId = toggle.viewId || toggle.view
  
  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  // children
  var children = []
  if (togglePage) {

    global.currentPage = togglePage.split("/")[0]
    var title = global.data.page[global.currentPage].title
    global.path = togglePage = togglePage === "main" ? "/" : togglePage

    history.pushState({}, title, togglePage)
    document.title = title
    view = views.root
    children = global.data.page[global.currentPage]["views"].map(view => global.data.view[view])

  } else {

    children = toArray(global.data.view[viewId])
    view = views[parentId]
  }

  if (!children) return
  if (!view || !view.element) return

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
  
    setTimeout(() => {
      idList.filter(id => views[id] && views[id].type === "Icon" && views[id].google).map(id => views[id]).map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
      })
    }, 0)
    
  }, timer)
}

module.exports = { toggleView }
},{"./clone":36,"./createElement":44,"./generate":59,"./setElement":88,"./starter":91,"./toArray":96,"./update":114}],114:[function(require,module,exports){
const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { controls } = require("./controls")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const update = ({ id, update = {} }) => {

  var views = window.views
  var global = window.global
  var view = views[id]
  var timer = update.timer || 0
  
  if (!view || !view.element) return

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlist-caller"] && view.element.contains(views[global["actionlist-caller"]].element)) {
    var closeActionlist = toCode({ string: "clearTimer():[)(:actionlist-timer];():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") children = clone(global.data.page[global.currentPage]["views"].map(view => global.data.view[view]))

  // onloading
  if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadingEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loading"))
    if (loadingEventControls) controls({ id: "root", controls: loadingEventControls })
  }
  
  var innerHTML = children
  .map((child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id].style.opacity = "0"
    if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return createElement({ id })

  }).join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML

  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))
  
  var children = [...view.element.children]
  if (timer) setTimeout(() => {
      children.map(el => {
        
        views[el.id].style.opacity = views[el.id].element.style.opacity = "1"
      })
    }, 0)
  else children.map(el => {
    
    views[el.id].style.opacity = views[el.id].element.style.opacity = "1"
  })
  
  setTimeout(() => {
    idList.filter(id => views[id] && views[id].type === "Icon" && views[id].google).map(id => views[id]).map(map => {
      map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
      map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
    })
  }, 0)
}

const removeChildren = ({ id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]

  //if (!view.element && id !== "root") return delete views[id]
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
},{"./clone":36,"./controls":39,"./createElement":44,"./generate":59,"./setElement":88,"./starter":91,"./toArray":96,"./toCode":100,"./toParam":107}],115:[function(require,module,exports){
(function (global){(function (){
const axios = require("axios")
const { toAwait } = require("./toAwait")

const upload = async ({ id, e, ...params }) => {
        
  var upload = params.upload
  var view = window.views[id]
  var collection = upload.collection = upload.collection || upload.path

  var headers = clone(upload.headers) || {}
  headers.project = headers.project || global.projectId
  delete upload.headers
  upload.doc = upload.doc || upload.id
  upload.name = upload.name || global.upload[0].name

  // file
  var file = await readFile(upload.file)
  delete upload.file
  
  // get file type
  var type = file.substring("data:".length, file.indexOf(";base64"))
  upload.type = type.split("/").join("-")

  // get regex exp
  var regex = new RegExp(`^data:${type};base64,`, "gi")
  file = file.replace(regex, "")
  
  // access key
  if (global["access-key"]) headers["access-key"] = global["access-key"]
  
  var { data } = await axios.post(`/storage/${collection}`, { upload, file }, {
    headers: {
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
      ...headers
    }
  })

  view.upload = data
  console.log(data)

  // await params
  toAwait({ id, e, params })
}
  
const readFile = (file) => {
  return new Promise(res => {

    let myReader = new FileReader()
    myReader.onloadend = () => res(myReader.result)
    myReader.readAsDataURL(file)
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
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./toAwait":97,"axios":117}],116:[function(require,module,exports){
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")

const watch = ({ controls, id }) => {

    const { execute } = require("./execute")

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ id, string: controls.watch })

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
            if (view["once"] || view["once()"]) {

                delete view["once"]
                clearInterval(view[`${_watch}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions) await execute({ controls, id })
                
            // await params
            if (view.await) toParam({ id, string: view.await.join(';') })
        }

        if (view[`${_watch}-timer`]) clearInterval(view[`${_watch}-timer`])
        view[`${_watch}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }
},{"./clone":36,"./execute":53,"./isEqual":67,"./toApproval":95,"./toCode":100,"./toParam":107,"./toValue":112}],117:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":119}],118:[function(require,module,exports){
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

},{"../core/buildFullPath":125,"../core/createError":126,"./../core/settle":130,"./../helpers/buildURL":134,"./../helpers/cookies":136,"./../helpers/isURLSameOrigin":139,"./../helpers/parseHeaders":141,"./../utils":144}],119:[function(require,module,exports){
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

},{"./cancel/Cancel":120,"./cancel/CancelToken":121,"./cancel/isCancel":122,"./core/Axios":123,"./core/mergeConfig":129,"./defaults":132,"./helpers/bind":133,"./helpers/isAxiosError":138,"./helpers/spread":142,"./utils":144}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
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

},{"./Cancel":120}],122:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],123:[function(require,module,exports){
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

},{"../helpers/buildURL":134,"../helpers/validator":143,"./../utils":144,"./InterceptorManager":124,"./dispatchRequest":127,"./mergeConfig":129}],124:[function(require,module,exports){
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

},{"./../utils":144}],125:[function(require,module,exports){
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

},{"../helpers/combineURLs":135,"../helpers/isAbsoluteURL":137}],126:[function(require,module,exports){
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

},{"./enhanceError":128}],127:[function(require,module,exports){
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

},{"../cancel/isCancel":122,"../defaults":132,"./../utils":144,"./transformData":131}],128:[function(require,module,exports){
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

},{}],129:[function(require,module,exports){
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

},{"../utils":144}],130:[function(require,module,exports){
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

},{"./createError":126}],131:[function(require,module,exports){
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

},{"./../defaults":132,"./../utils":144}],132:[function(require,module,exports){
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
},{"./adapters/http":118,"./adapters/xhr":118,"./core/enhanceError":128,"./helpers/normalizeHeaderName":140,"./utils":144,"_process":150}],133:[function(require,module,exports){
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

},{}],134:[function(require,module,exports){
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

},{"./../utils":144}],135:[function(require,module,exports){
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

},{}],136:[function(require,module,exports){
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

},{"./../utils":144}],137:[function(require,module,exports){
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

},{}],138:[function(require,module,exports){
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

},{}],139:[function(require,module,exports){
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

},{"./../utils":144}],140:[function(require,module,exports){
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

},{"../utils":144}],141:[function(require,module,exports){
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

},{"./../utils":144}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
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

},{"./../../package.json":145}],144:[function(require,module,exports){
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

},{"./helpers/bind":133}],145:[function(require,module,exports){
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

},{}],146:[function(require,module,exports){

},{}],147:[function(require,module,exports){
(function (process){(function (){
/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = require('fs')
const path = require('path')
const os = require('os')

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\r\n|\n|\r/

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

function resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse

}).call(this)}).call(this,require('_process'))
},{"_process":150,"fs":146,"os":148,"path":149}],148:[function(require,module,exports){
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

},{}],149:[function(require,module,exports){
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
},{"_process":150}],150:[function(require,module,exports){
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
