const { toCode } = require("./toCode")
const { openStack, endStack } = require("./stack")
const { toLine } = require("./toLine")
const { watch } = require("./watch")
const { clone } = require("./clone")
const { decode } = require("./decode")
const { addresser } = require("./addresser")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { toParam } = require("./toParam")

const addEventListener = ({ event, id, __, stack, lookupActions, address, eventID: mainEventID }) => {

  const views = window.views
  const global = window.global
  var view = views[id]

  if (!view || !event) return

  // inherit from view
  if (!__) __ = view.__
  if (!lookupActions) lookupActions = view.__lookupViewActions__

  var mainString = toCode({ id, string: toCode({ id, string: event, start: "'" }) })

  mainString.split("?")[0].split(";").map(substring => {

    // decode
    if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

    // event:id
    var { data: eventID } = toLine({ id, data: { string: substring.split("?")[0].split(":")[1] } })
    eventID = eventID || mainEventID || id

    toArray(eventID).map(eventID => {

      if (typeof eventID === "object" && eventID.__view__) eventID = eventID.id

      // modify
      var { event, string } = modifyEvent({ eventID, event: substring, string: mainString })

      // watch
      if (event === "watch") return watch({ lookupActions, __, stack, address, string, id })

      // view doesnot exist
      if (!event || !views[eventID] || !views[id]) return

      // loaded event
      if (event === "loaded") return eventExecuter({ string, event, eventID, id, address, stack, lookupActions, __ })

      //
      if (id !== eventID) {

        global.__events__[id] = global.__events__[id] || {}
        global.__events__[id][event] = global.__events__[id][event] || []
        global.__events__[id][event].push({ string, event, eventID, id, lookupActions, __ })

      } else views[eventID].__element__.addEventListener(event, (e) => {

        eventExecuter({ string, event, eventID, id, stack, lookupActions, __, address, e })
      })
    })
  })
}

const eventExecuter = ({ event, eventID, id, lookupActions, e, string, stack: headStack, address: headAddress, __ }) => {

  const views = window.views
  const global = window.global

  var view = views[id]

  // view doesnot exist
  if (!view || !views[eventID]) return

  if (event === "click" || event === "mousedown" || event === "mouseup") {
    global.__clicked__ = views[((e || window.event).target || e.currentTarget).id]
  }

  // unlunch unrelated droplists
  if (id !== "droplist" && eventID === "droplist" && (!global.__droplistPositioner__ || !views[global.__droplistPositioner__] || !views[global.__droplistPositioner__].__element__.contains(view.__element__))) return

  // init stack
  var stack = openStack({ event, id, eventID, string, headStack, headAddress, e })

  // address line
  var address = addresser({ stack, id, status: "Start", type: "line", event: "click", interpreting: true, lookupActions, __, headAddress: address }).address

  // main params
  toParam({ lookupActions, stack, id, e, address, data: string, __, mount: true })

  endStack({ stack, end: true })
}

const defaultEventHandler = ({ id }) => {

  const views = window.views
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
  event = event.split("?")[0].split(":")[0]

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
