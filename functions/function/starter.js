const control = require("../control/control")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")
const { isArabic } = require("./isArabic")
const { resize } = require("./resize")

const starter = ({ id, once }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")
  const { defaultInputHandler } = require("./defaultInputHandler")

  var local = window.value[id]

  // status
  local.status = "Mounting Functions"

  /* Defaults must start before controls */
  
  // arabic text
  isArabic({ id })
  
  // input handlers
  defaultInputHandler({ id })

  // mouseenter, click, mouseover...
  defaultEventHandler({ id })
  
  // on loaded image
  if (local.type === 'Image') local.element.src = local.src

  /* End of default handlers */

  // element awaiters
  if (local.await) {

    var params = toParam({ id, string: local.await.join(';'), mount: true })
    
    if (params.id) {

      delete Object.assign(window.value, {[params.id]: window.value[id]})[id]
      id = params.id
      local = window.value[id]
    }

    delete local.await
  }

  // resize
  if (local.type === "Input") resize({ id })

  // setStyles
  // if (local.style) setStyle({ id, style: local.style })

  // run starter for children
  var children = [...local.element.children]

  if (!once) children.map(child => {

    var id = child.id
    if (!id) return
    starter({ id })
  })

  // lunch auto controls
  Object.entries(control).map(([type, control]) => {

    if (local[type]) {
      
      local.controls = toArray(local.controls)
      var _controls = control({ id, controls: local[type] })
      _controls && local.controls.push(..._controls)
    }
  })
  
  // execute controls
  if (local.controls) controls({ id })

  local.status = "Mounted"
}

module.exports = { starter }
