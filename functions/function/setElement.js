const { controls } = require("./controls")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
// const { starter } = require("./starter")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const setElement = ({ _window, id }) => {

    var view = window.views[id]
    if (!view) return console.log("No Element", id)
    
    // loading controls
    if (view.controls) {
      
      toArray(view.controls).map((controls = {}) => {
        var event = toCode({ _window, string: controls.event || "" })
        if (event.split("?")[0].split(";").find(event => event.slice(0, 7) === "loading") && toApproval({ id, string: controls.event.split('?')[2] })) 
          toParam({ id, string: controls.event.split("?")[1] })
      })
    }

    // status
    view.status = "Mounting Element"
    
    view.element = document.getElementById(id)
    if (!view.element) return delete window.views[id]

    // status
    view.status = "Element Loaded"
}
    
module.exports = { setElement }