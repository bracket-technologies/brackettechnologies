const { controls } = require("./controls")
const { toArray } = require("./toArray")

const setElement = ({ id, main }) => {

    var local = window.value[id]
    if (!local) return delete window.value[id]

    // before loading event
    var beforeLoadingControls = local.controls && toArray(local.controls)
        .filter(control => control.event && control.event.split("?")[0].includes("beforeLoading"))
    if (beforeLoadingControls) {
        controls({ controls: beforeLoadingControls, id })
        local.controls = local.controls.filter(controls => !controls.event.includes("beforeLoading"))
        if (main && window.value.root.mainViewHasBeenRouted) return
    }

    // status
    local.status = "Mounting Element"
    
    local.element = document.getElementById(id)
    if (!local.element) return delete window.value[id]

    // run starter for children
    var children = [...local.element.children]
    
    children.map(el => {

        var id = el.id
        if (!id) return
        setElement({ id })
    })

    // status
    local.status = "Element Loaded"
}
    
module.exports = { setElement }