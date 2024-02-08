const { toCode } = require("./toCode")
const { stacker, printStack } = require("./stack")
const { lineInterpreter } = require("./lineInterpreter")
const { watch } = require("./watch")
const { clone } = require("./clone")

const addEventListener = ({ event, id, __, lookupActions, eventID: mainEventID }) => {

  var views = window.views
  var global = window.global
  var view = views[id]

  if (!view || !event) return

  // inherit from view
  if (!__) __ = view.__
  if (!lookupActions) lookupActions = view.__lookupActions__

  var mainString = toCode({ id, string: toCode({ id, string: event, start: "'" }) })

  mainString.split("?")[0].split(";").map(substring => {
    
    // decode
    if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

    // event:id
    var { data: eventID } = lineInterpreter({ id, data: { string: substring.split("?")[0].split(":")[1] } })
    if (typeof eventID === "object" && eventID.__view__) eventID = eventID.id
    else eventID = eventID || mainEventID || id

    // modify
    var { event, string } = modifyEvent({ eventID, event: substring, string: mainString })

    // watch
    if (event === "watch") return watch({ lookupActions, __, string, id })
    
    // view doesnot exist
    if (!event || !views[eventID] || !views[id]) return

    // loaded event
    if (event === "loaded") return setTimeout(eventExecuter({ string, event, eventID, id, lookupActions, __ }), 0)
    
    //
    if (id !== eventID) {
      
      global.__events__[id] = global.__events__[id] || {}
      global.__events__[id][event] = global.__events__[id][event] || []
      global.__events__[id][event].push({ string, event, eventID, id, lookupActions, __ })
      
    } else views[eventID].__element__.addEventListener(event, (e) => eventExecuter({ string, event, eventID, id, lookupActions, __, e }))
  })
}

const eventExecuter = ({ event, eventID, id, lookupActions, e, string, __ }) => {

  var views = window.views
  var global = window.global

  var view = views[id]
    
  // view doesnot exist
  if (!view || !views[eventID]) return

  var timerID = setTimeout(() => {
    
    // unlunch unrelated droplists
    if (id !== "droplist" && eventID === "droplist" && (!global.__droplistPositioner__ || !views[global.__droplistPositioner__] || (views[global.__droplistPositioner__] && !views[global.__droplistPositioner__].__element__.contains(view.__element__)))) return
    
    var stack = stacker({ event, id, eventID, string })

    // main params
    var data = lineInterpreter({ lookupActions, stack, id, e, data: {string, action: "toParam"}, __, mount: true })
    
    // line interpreting ended
    stack.interpreting = false

    printStack({ stack, end: true })

    // conditions not applied
    if (data.conditionsNotApplied) return data

  }, 0)
  
  view.__timers__.push(timerID)
}

const defaultEventHandler = ({ id }) => {

  var views = window.views
  var view = views[id]

  view.focused = false
  view.touchstarted = false
  view.mouseentered = false
  view.mousedowned = false

  // linkable
  if (view.link && typeof view.link === "object" && view.link.preventDefault)
    view.__element__.addEventListener("click", (e) => { e.preventDefault() })

  // input
  if (view.__name__ === "Input" || view.editable) {

    defaultInputHandlerByEvent({ views, view, id, event: "focus", keyName: "focused", value: true })
    defaultInputHandlerByEvent({ views, view, id, event: "blur", keyName: "focused", value: false })
  }

  defaultInputHandlerByEvent({ views, view, id, event: "mouseenter", keyName: "mouseentered", value: true })
  defaultInputHandlerByEvent({ views, view, id, event: "mouseleave", keyName: "mouseentered", value: false })

  defaultInputHandlerByEvent({ views, view, id, event: "mousedown", keyName: "mousedowned", value: true })
  defaultInputHandlerByEvent({ views, view, id, event: "mouseup", keyName: "mousedowned", value: false })
}

const defaultInputHandlerByEvent = ({ views, view, id, event, keyName, value }) => {

  // function
  var fn = (e) => {
    if (views[id]) view[keyName] = value
  }

  view.__element__.addEventListener(event, fn)
}

const modifyEvent = ({ eventID, string, event }) => {

  var view = window.views[eventID]
  var subparams = event.split("?")[1] || ""
  var subconditions = event.split("?")[2] || ""
  event = event.split(":")[0]

  string = string.split("?").slice(1)
  var conditions = string[1] || ""
  
  if (event === "change" && (view.editable || view.input.type === "text" || view.input.type === "number")) {
    event = "keyup"
  } else if (event === "entry") {
    event = "input"
  } else if (event === "enter") {

    event = "keyup"
    conditions += "e().key=Enter||e().keyCode=13"

  } else if (event === "ctrl") {

    event = "keydown"
    conditions += "e().ctrlKey"

  } else if (event === "dblclick") {
    
  }
  
  string = `${subparams};${string[0]}?${subconditions};${conditions}?${string[2] || ""}`
  while (string.slice(-1) === "?") string = string.slice(0, -1)
  
  return { string, event }
}

module.exports = { addEventListener, defaultEventHandler, eventExecuter }
