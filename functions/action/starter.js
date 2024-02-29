const { defaultInputHandler } = require("./defaultInputHandler")
const { addEventListener } = require("./event")
const { toArray } = require("./toArray")

const starter = ({ lookupActions, stack, __, address, id }) => {
  
  var view = window.views[id]
  if (!view) return
  
  // status
  view.__status__ = "Mounted"
  view.__rendered__ = true
  
  view.__element__ = document.getElementById(id)
  if (!view.__element__) return delete window.views[id]
  view.__element__.setAttribute("index", view.__index__)

  // default input handlers
  defaultInputHandler({ id })
  
  // status
  //view.__status__ = "Mounting Events"
  
  // lunch auto controls
  Object.entries(require("../event/event")).map(([eventName, events]) => {
    
    if (view[eventName]) view.__controls__.push(...events({ id, data: view[eventName] }))
  })

  //view.__status__ = "Mounted"
  
  // events
  toArray(view.__controls__).map(data => addEventListener({ lookupActions, stack, address, __, id, ...data, event: data.event }))
}

module.exports = { starter }