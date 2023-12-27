const { toCode } = require("./toCode")
const { stacker } = require("./stack")
const { lineInterpreter } = require("./lineInterpreter")
const { watch } = require("./watch")

const addEventListener = ({ controls, id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]
  var lookupActions = controls.lookupActions
  var __ = controls.__ || view.__

  if (!view || !controls.event) return

  var mainString = toCode({ id, string: toCode({ id, string: controls.event, start: "'" }) })

  mainString.split("?")[0].split(";").map(substring => {
    
    // decode
    if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

    // event:id
    var { data: eventID } = lineInterpreter({ id, data: substring.split("?")[0].split(":")[1] || id })
    if (typeof eventID === "object" && eventID.__view__) eventID = eventID.id

    // modify
    var { substring, string } = modifyEvent({ eventID, event: substring, string: mainString })

    var event = substring.split("?")[0].split(":")[0]

    // watch
    if (event === "watch") return watch({ lookupActions, __, string, id })
    
    // view doesnot exist
    if (!event || !views[eventID]) return

    // loaded event
    if (event === "loaded") return setTimeout(eventExecuter({ string, event, eventID, controls, id, lookupActions, __ }), 0)
    
    // body event
    if (id === "body") {

      global.__events__[id] = global.__events__[id] || {}
      global.__events__[id][event] = global.__events__[id][event] || []
      global.__events__[id][event].push({ string, event, eventID, controls, id, lookupActions, id, __ })
      return
    }

    const eventHandler = (e) => {

      // view doesnot exist
      if (!views[id] || !views[eventID]) return

      // unlunch unrelated droplists
      if (id !== "droplist" && eventID === "droplist" && (!global.__droplistPositioner__ || !views[global.__droplistPositioner__].element.contains(views[id].element))) return

      // unlunch unrelated popups
      if (id !== "popup" && eventID === "popup" && (!global.__popupPositioner__ || !global.__popupConfirmed__ || !views[global.__popupPositioner__].element.contains(views[id].element))) return

      if (eventID === "droplist" || eventID === "popup") setTimeout(eventExecuter({ string, event, eventID, controls, id, lookupActions, id, __, e }), 100)
      else eventExecuter({ string, event, eventID, controls, id, lookupActions, id, __, e })
    }

    views[eventID].element.addEventListener(event, eventHandler)
  })
}

const eventExecuter = ({ event, eventID, controls, id, lookupActions, e, string, __ }) => {

  const { execute } = require("./execute")

  var views = window.views
  var view = views[id]

  var timerID = setTimeout(() => {

    if (!event || !views[id] || !views[eventID]) return
    
    var stack = stacker({ event, id, eventID, string })
    
    // main params
    var data = lineInterpreter({ lookupActions, stack, id, e, data: string, index: 1, __, mount: true, action: "toParam" })

    // conditions not applied
    if (data.conditionsNotApplied) return data

    // execute
    if (controls.actions) execute({ lookupActions, stack, controls, e, id, __ })

  }, 0)

  view.__timers__ = view.__timers__ || []
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
    view.element.addEventListener("click", (e) => { e.preventDefault() })

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

  view.element.addEventListener(event, fn)
}

const modifyEvent = ({ eventID, string, event }) => {

  var view = window.views[eventID]
  var subparams = event.split(":")[1] || ""
  event = event.split(":")[0]

  string = string.split("?").slice(1)
  var conditions = string[1] || ""
  
  if (event === "change" && (view.input.type === "text" || view.input.type === "number")) {
    event = "keyup"
    conditions += ";e().key"
  } else if (event === "entry") {
    event = "keyup"
    conditions += ";e().key"
  } else if (event === "enter") {

    event = "keyup"
    conditions += "e().key=Enter||e().keyCode=13"

  } else if (event === "ctrl") {

    event = "keydown"
    conditions += "e().ctrlKey"

  } else if (event === "dblclick") {
    
  }
  
  event = subparams ? `${event}:${subparams}` : event

  return { string: `${event}?${string[0]}?${conditions}?${string[2] || ""}`, substring: event }
}

module.exports = { addEventListener, defaultEventHandler, eventExecuter }
