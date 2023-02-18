const _controls_ = require("../control/control")
const { toArray } = require("./toArray")

const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")

  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Functions"

  // lunch auto controls
  Object.entries(_controls_).map(([type, control]) => {

    if (view[type]) {
      
      view.controls = toArray(view.controls)
      var _controls = control({ id, controls: view[type] })
      _controls && view.controls.push(..._controls)
    }
  })

  // mouseenter, click, mouseover...
  defaultEventHandler({ id })
  
  // execute controls
  if (view.controls) controls({ id })

  view.status = "Mounted"
}

module.exports = { starter }
