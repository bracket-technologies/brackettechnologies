const { starter } = require("../function/starter")
const { setElement } = require("../function/setElement")
const { getCookie } = require("../function/cookie")

var views = window.views = JSON.parse(document.getElementById("views").textContent)
var global = window.global = JSON.parse(document.getElementById("global").textContent)

// access key
global["access-key"] = getCookie({ name: "_key" })

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

    global["clickedElement()"] = views[(e || window.event).target.id]
    global.clickedElement = (e || window.event).target
    
}, false)

// default global mode
global.mode = global["default-mode"] = global["default-mode"] || "Light"
global.idList.map(id => setElement({ id }))
global.idList.map(id => starter({ id }))

var icons = global.idList.filter(id => views[id].type === "Icon").map(id => views[id])
window.onload = () => {
    icons.map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
    })
}

Object.entries(views).map(([id, views]) => {
    if (views.status === "Loading") delete views[id]
})