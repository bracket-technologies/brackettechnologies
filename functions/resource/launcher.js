const { starter } = require("../action/starter")
const { toParam } = require("../action/toParam")
const { toCode } = require("../action/toCode")
const { eventAction } = require("../action/event")
const { setElement } = require("../action/setElement")

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
var views = window.views
var global = window.global

//views.document = document
document.element = document
views.body.element = document.body
views.window = { id: "window", element: window, controls: [] }

// download arabic font
var _ar = document.createElement("P")
_ar.innerHTML = "مرحبا"
_ar.classList.add("ar")
_ar.style.position = "absolute"
_ar.style.top = "-1000px"
views.body.element.appendChild(_ar)

window.onfocus = () => {

    views.root.element.click()
    document.activeElement.blur()
    toParam({ id: "root", data: toCode({ id: "root", string: "():mininote.style():[opacity=0;transform=scale(0)]" }) })
}

// clicked element
document.body.addEventListener('click', e => {

    var views = window.views
    var global = window.global
    
    global.clicked = views[((e || window.event).target || e.currentTarget).id]

    // droplist
    if (global.clicked && views.droplist.element.contains(global.clicked.element)) global["droplist-txt"] = global.clicked.element.innerHTML

    // body click events
    Object.values(global.__events__).map(event => event.click && event.click.map(data => eventAction({ ...data, e })))
})

// mousemove
document.body.addEventListener('mousemove', (e) => {

    var global = window.global

    global.mousePosX = e.screenX
    global.mousePosY = e.screenY

    // body mousemove events
    Object.values(global.__events__).map(event => event.mousemove && event.mousemove.map(data => eventAction({ ...data, e })))
})

document.body.addEventListener("mousedown", (e) => {

    var global = window.global

    global.mousedowned = true
    global.clicked = window.views[((e || window.event).target || e.currentTarget).id]

    // body mousedown events
    Object.values(global.__events__).map(event => event.mousedown && event.mousedown.map(data => eventAction({ ...data, e })))
})

document.body.addEventListener("mouseup", (e) => {

    var global = window.global
    global.mousedowned = false

    // body mouseup events
    Object.values(global.__events__).map(event => event.mouseup && event.mouseup.map(data => eventAction({ ...data, e })))
})

document.addEventListener('keydown', e => {

    var global = window.global
    if (global.projectID === "brackettechnologies" && e.ctrlKey && e.key === "s") {
        e.preventDefault();
        toParam({ id: "saveBtn", e, data: "click()" })
    }

    if (global.projectID === "brackettechnologies" && e.ctrlKey && e.shiftKey && e.key === "Delete") {
        e.preventDefault();
    }
})

document.addEventListener('keyup', e => {
    
    var global = window.global
    if (!e.ctrlKey) global.ctrlKey = false
})

global.__IDList__.map(id => setElement({ id }))
global.__IDList__.map(id => starter({ id }))

// show icons
window.onload = () => {
    var icons = global.__IDList__.filter(id => views[id] && views[id].__name__ === "Icon").map(id => views[id])
    icons.map(view => {
        if (view.element) {
            view.element.style.opacity = view.style.opacity !== undefined ? view.style.opacity : "1"
            view.element.style.transition = view.style.transition !== undefined ? view.style.transition : "none"
        }
    })
}

window.onmousedown = (e) => {

    var global = window.global
    var views = window.views
    
    global.clicked = views[(e || window.event).target.id]
}

Object.entries(views).map(([id, views]) => {
    if (views.status === "Loading") delete views[id]
})

document.addEventListener('scroll', () => {

    // close droplist
    if (views.droplist.element.style.pointerEvents === "auto") {
        toParam({ data: toCode({ id: "root", string: "if():[!():droplist.mouseentered]:[():droplist.mouseleave()]" }), id: "droplist" })
    }
}, true)

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