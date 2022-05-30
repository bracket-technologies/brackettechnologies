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
    global.screenX = e.screenX
    global.screenY = e.screenY
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
        
        var closeDroplist = toCode({ string: "if():[!mouseenter]:[clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()]" })
        toParam({ string: closeDroplist, id: "droplist" })
    }
  
    // close actionlist
    if (views.actionlist.element.style.pointerEvents === "auto") {

        var closeActionlist = toCode({ string: "if():[!mouseenter]:[clearTimer():[)(:actionlist-timer];():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()]" })
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
    if (controls.actions || controls.action) await execute({ controls, id, e })
}