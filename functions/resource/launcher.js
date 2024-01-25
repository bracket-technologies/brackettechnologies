const { starter } = require("../action/starter")
const { initView } = require("../action/view")
const { defaultAppEvents } = require("../action/defaultAppEvents")

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
var views = window.views
var global = window.global

views.body.__element__ = document.body
initView({ views, global, id: "document", __element__: document })
initView({ views, global, id: "window", __element__: window })

// app default event listeneres
defaultAppEvents()

// start app
// starter({ id: "body" })
views.body.__idList__.map(id => starter({ id }))

// load arabic font
var arDiv = document.createElement("P")
arDiv.innerHTML = "مرحبا"
arDiv.classList.add("ar")
arDiv.style.position = "absolute"
arDiv.style.top = "-1000px"
views.body.__element__.appendChild(arDiv)