const { controls } = require("./controls")
// const { starter } = require("./starter")
const { toArray } = require("./toArray")

const setElement = ({ id }) => {

    var local = window.children[id]
    var global = window.global
    if (!local) return console.log("No Element", id)
    
    // before loading event
    var beforeLoadingControls = local.controls && toArray(local.controls)
        .filter(control => control.event && control.event.split("?")[0].includes("beforeLoading"))
    if (beforeLoadingControls) {

        var currentPage = global.currentPage
        controls({ controls: beforeLoadingControls, id })
        local.controls = toArray(local.controls).filter(controls => controls.event ? !controls.event.includes("beforeLoading") : true)

        // page routed
        if (currentPage !== global.currentPage) return true
    }

    // status
    local.status = "Mounting Element"
    
    local.element = document.getElementById(id)
    if (!local.element) return delete window.children[id]

    // status
    local.status = "Element Loaded"
}
    
module.exports = { setElement }