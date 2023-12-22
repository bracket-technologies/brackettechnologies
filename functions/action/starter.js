const starter = ({ id }) => {
  
  const { defaultEventHandler } = require("./event")
  const { controls } = require("./controls")

  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Actions"
  
  // lunch auto controls
  Object.entries(require("../event/event")).map(([type, events]) => {
    
    if (view[type]) view.controls.push(...events({ id, controls: view[type] }))
  })

  // mouseenter, click, mouseover...
  defaultEventHandler({ id })
  
  // execute controls
  if (view.controls) controls({ id })

  view.status = "Mounted"
}

module.exports = { starter }
