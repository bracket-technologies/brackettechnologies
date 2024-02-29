const { starter } = require("../action/starter")
const { defaultAppEvents } = require("../action/defaultAppEvents")
const { initView } = require("../action/view")

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
const views = window.views
const global = window.global

// app default event listeneres
defaultAppEvents()

// start app
views.document.__idList__.map(id => starter({ id }))
views.document.__element__ = document
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