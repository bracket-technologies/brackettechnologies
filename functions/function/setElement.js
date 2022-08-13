const { controls } = require("./controls")
// const { starter } = require("./starter")
const { toArray } = require("./toArray")

const setElement = ({ id }) => {

    var view = window.views[id]
    if (!view) return console.log("No Element", id)
    
    // before loading event
    var beforeLoadingControls = view.controls && toArray(view.controls).filter(controls => controls.event && toArray(controls.event)[0].split("?")[0].includes("beforeLoading"))
    if (beforeLoadingControls) {

        var currentPage = global.currentPage
        controls({ controls: beforeLoadingControls, id })
        view.controls = toArray(view.controls).filter(controls => controls.event ? !toArray(controls.event)[0].includes("beforeLoading") : true)

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