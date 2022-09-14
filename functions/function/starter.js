const control = require("../control/control")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const { isArabic } = require("./isArabic")
const { resize } = require("./resize")

const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")
  const { defaultInputHandler } = require("./defaultInputHandler")

  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Functions"

  /* Defaults must start before controls */
  
  // on loaded image
  // if (view.type === 'Image') view.element.src = view.src

  /* End of default handlers */

  // lunch auto controls
  Object.entries(control).map(([type, control]) => {

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
