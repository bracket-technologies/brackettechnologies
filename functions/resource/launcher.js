const { starter } = require("../action/starter")
const { defaultAppEvents } = require("../action/defaultAppEvents")

window.views = JSON.parse(document.getElementById("views").textContent)
window.global = JSON.parse(document.getElementById("global").textContent)

//
var views = window.views

views.document.__element__ = document

// app default event listeneres
defaultAppEvents()

// start app
views.document.__idList__.map(id => starter({ id }))
views.document.__rendered__ = true

// load arabic font
var arDiv = document.createElement("P")
arDiv.innerHTML = "مرحبا"
arDiv.classList.add("ar")
arDiv.style.position = "absolute"
arDiv.style.top = "-1000px"
views.document.__element__.appendChild(arDiv)