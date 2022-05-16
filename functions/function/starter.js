const control = require("../control/control")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const { isArabic } = require("./isArabic")
const { resize } = require("./resize")

const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")
  const { defaultInputHandler } = require("./defaultInputHandler")

  var local = window.children[id]
  if (!local) return
  
  // status
  local.status = "Mounting Functions"

  /* Defaults must start before controls */
  
  // arabic text
  isArabic({ id })
  
  // input handlers
  defaultInputHandler({ id })
  
  // on loaded image
  // if (local.type === 'Image') local.element.src = local.src

  /* End of default handlers */

  // resize
  if (local.type === "Input") resize({ id })

  // lunch auto controls
  Object.entries(control).map(([type, control]) => {

    if (local[type]) {
      
      local.controls = toArray(local.controls)
      var _controls = control({ id, controls: local[type] })
      _controls && local.controls.push(..._controls)
    }
  })

  // mouseenter, click, mouseover...
  defaultEventHandler({ id })
  
  // execute controls
  if (local.controls) controls({ id })

  local.status = "Mounted"
}

module.exports = { starter }
