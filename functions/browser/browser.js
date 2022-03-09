const { starter } = require("../function/starter")
const { setElement } = require("../function/setElement")
const { getCookie } = require("../function/cookie")
const { search } = require("../function/search")

window.value = JSON.parse(document.getElementById("value").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

var value = window.value
var global = window.global

value.document = document
value.document.element = document
value.body.element = document.body
value.window = { element: window }
value.root.element = root

// lunch arabic text
var _ar = document.createElement("P")
_ar.innerHTML = "مرحبا"
_ar.classList.add("ar")
_ar.style.position = "absolute"
_ar.style.top = "-1000px"
value.body.element.appendChild(_ar)

/*
var _firebase = firebase.initializeApp(global.config)
global.db = _firebase.firestore()
global.storage = _firebase.storage().ref()
*/

history.pushState(null, global.data.page[global.currentPage].title, global.path)

// clicked element
document.addEventListener('click', e => {

    global["clickedElement()"] = window.value[(e || window.event).target.id]
    global.clickedElement = (e || window.event).target
    
}, false)

// not auth
if (window.global.currentPage === "developer-editor") {
    var await = [`global().project-auth=().search.data.code;document().body.innerHTML=You are not authenticated!<<global().project-auth.isnot().${getCookie({ name: "project-auth" })}`]
    search({ search: { collection: "authentication", doc: global.data.project.id }, await, asyncer: "search", id: "body" })
}

setElement({ id: "public" })
setElement({ id: "root" })

setTimeout(() => {
    starter({ id: "public" })
    starter({ id: "root" })
}, 0)

Object.entries(window.value).map(([id, value]) => {
    if (value.status === "Loading") delete window.value[id]
})

// default global mode
global.mode = global["default-mode"] = global["default-mode"] || "Light"