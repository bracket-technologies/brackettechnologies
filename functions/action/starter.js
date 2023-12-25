const { defaultInputHandler } = require("./defaultInputHandler")
const { defaultEventHandler, addEventListener } = require("./event")
const { toArray } = require("./toArray")

const starter = ({ id }) => {
  
  var view = window.views[id]
  if (!view) return
  
  // status
  view.status = "Mounting Element"
    
  view.element = document.getElementById(id)
  if (!view.element) return delete window.views[id]

  // default input handlers
  defaultInputHandler({ id })
  
  // status
  view.status = "Mounting Events"
  
  // lunch auto controls
  Object.entries(require("../event/event")).map(([eventName, events]) => {
    
    if (view[eventName]) view.controls.push(...events({ id, controls: view[eventName] }))
  })

  // deafault event handlers
  defaultEventHandler({ id })
  
  // events
  toArray(view.controls).map(controls => addEventListener({ controls, id }))

  view.status = "Mounted"
}

module.exports = { starter }
