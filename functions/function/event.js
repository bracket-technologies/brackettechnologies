const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const events = [
  "click",
  "mouseenter",
  "mouseleave",
  "mousedown",
  "mouseup",
  "touchstart",
  "touchend"
]

const addEventListener = ({ _window, awaits, controls, id, req, res }) => {
  
  const { execute } = require("./execute")

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var view = views[id]
  var mainID = id

  // 'string'
  var events = toArray(controls.event)[0]
  events = toCode({ _window, id, string: events })
  events = toCode({ _window, id, string: events, start: "'", end: "'" })
  
  events = events.split("?")
  var _idList = id

  // popup
  var popup = (events[1] || "").split(";").find(param => param === "popup()")
  if (popup && view.popup) {
    
    view.popup = typeof view.popup === "object" ? view.popup : {}
    view.popup.controls = view.popup.controls || []

    return view.popup.controls.push({
      event: events.join("?").replace("popup()", ""),
      actions: controls.actions
    })
  }

  events[0].split(";").map(event => {

    // case event is coded
    if (event.slice(0, 6) === "coded@") {
      event = global.__codes__[event]
      if (event.includes("?")) {
        var viewEventIdList = event.split("?")[3]
        var viewEventConditions = event.split("?")[2]
        var viewEventParams = event.split("?")[1]
        event = event.split("?")[0]
      }
    }

    // id
    if (viewEventIdList) mainID = toValue({ _window, lookupActions: controls.lookupActions, awaits, req, res, id, value: viewEventIdList }) || viewEventIdList
    
    var timer = 0, idList, clickEvent, keyEvent
    var once = events[1] && events[1].includes('once')

    // click
    if (event.split(":")[0].slice(0, 5) === "click" && event.split(":")[0].length > 5) {
      clickEvent = "loaded?" + events[1] +  (events[2] ? "?" + events[2] : "")
      clickEvent = clickEvent.split("?")
      event = event.split("click")[1]
    }

    // key
    if (event.split(":")[0].slice(0, 3) === "key" && event.split(":")[0] !== "keydown" && event.split(":")[0] !== "keyup") {
      keyEvent = "loaded?" + events[1] +  (events[2] ? "?" + events[2] : "")
      keyEvent = keyEvent.split("?")
      event = event.split("key")[1]
    }

    // action:id
    var eventid = event.split(":")[1]
    if (eventid) idList = toValue({ _window, lookupActions: controls.lookupActions, awaits, req, res, id, value: eventid })
    else idList = clone(_idList)

    idList = toArray(idList).map(id => {
      if (typeof id === "object" && id.id) return id.id
      else return id
    })

    // timer
    timer = event.split(":")[2] || 0

    // event
    event = event.split(":")[0]

    if (!event || !view) return

    // add event listener
    idList.map(id => {

      var _view = views[id], eventAddress = { id: generate(), targetID: id, event }
      view.__timers__ = view.__timers__ || {}
      view.__eventAddresses__ = view.__eventAddresses__ || {}
      view.__eventAddresses__[eventAddress.id] = eventAddress

      if (!_view && id !== "window") return delete view.__eventAddresses__[eventAddress.id]
      
      var myFn = (e) => {

        view.__timers__[eventAddress.id] = setTimeout(async () => {

          var myView = views[mainID]
          if (!myView) return

          if (view[event] && typeof view[event] === "object" && view[event].disable) return

          // approval
          if (viewEventConditions) {
            var approved = toApproval({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventConditions, e, id: mainID, __: controls.__ || myView.__ })
            if (!approved) return
          }
          
          // approval
          var approved = toApproval({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: events[2], e, id: mainID, __: controls.__ || myView.__ })
          if (!approved) return

          // once
          if (once) e.target.removeEventListener(event, myFn)

          // params
          await toParam({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: events[1], e, id: mainID, mount: true, __: controls.__ || myView.__ })

          // break
          if (view.break) return delete view.break
          
          // approval
          if (viewEventParams) await toParam({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventParams, e, id: mainID, mount: true, __: controls.__ || myView.__ })
          
          // execute
          if (controls.actions || controls.action) await execute({ _window, lookupActions: controls.lookupActions, awaits, req, res, controls, e, id: mainID, __: controls.__ || myView.__ })
        }, timer)
      }
      
      // onload event
      if (event === "loaded") return setTimeout(myFn({ target: _view.element }), 0)
      else if (id === "window") return window.addEventListener(event, myFn)

      // body event
      if (id === "body") {
        
        global[`body-${event}-events`] = global[`body-${event}-events`] || {}
        global[`body-${event}-events`][mainID] = global[`body-${event}-events`][mainID] || []
        var index = global[`body-${event}-events`][mainID].length
        global[`body-${event}-events`][mainID].push({ id: mainID, viewEventConditions, viewEventParams, events, once, controls, index, event })
        return
      }

      var myFn = (e) => {
        
        view.__timers__ = view.__timers__ || {}
        view.__timers__[eventAddress.id] = setTimeout(() => {
          
          if (view[event] && typeof view[event] === "object" && view[event].disable) return
          if (clickEvent) return global["click-events"].push({ id, viewEventConditions, viewEventParams, events: clickEvent, controls })
          if (keyEvent) return global["key-events"].push({ id, viewEventConditions, viewEventParams, events: keyEvent, controls })

          // body
          if (eventid === "droplist" || eventid === "actionlist" || eventid === "popup") id = mainID

          // view doesnot exist
          var __view = views[id]
          if (!__view) return (e.target || {}).removeEventListener(event, myFn)

          if (eventid === "droplist" && !global["__droplistPositioner__"]) return
          if (eventid === "droplist" && !views[global["__droplistPositioner__"]].element.contains(views[id].element)) return
          
          if (eventid === "popup" && (!global["popup-positioner"] || !global["popup-confirmed"])) return
          if (eventid === "popup" && !views[global["popup-positioner"]].element.contains(views[id].element)) return
          
          if (eventid === "actionlist" && !views[global["actionlistCaller"]].element.contains(views[id].element)) return

          if (once) e.target.removeEventListener(event, myFn)

          var _myFn = async () => {

            var myView = views[mainID]
            
            // approval
            var approved = toApproval({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventConditions || "", e, id: mainID, __: controls.__ || myView.__ })
            if (!approved) return
            
            // approval
            var approved = toApproval({ string: events[2], e, id: mainID, __: controls.__ || myView.__ })
            if (!approved) return
            
            // params
            toParam({ string: events[1], lookupActions: controls.lookupActions, e, id: mainID, mount: true, __: controls.__ || myView.__ })
            if (viewEventParams) toParam({ _window, lookupActions: controls.lookupActions, awaits, req, res, string: viewEventParams, e, id: mainID, mount: true, __: controls.__ || myView.__ })
            
            if (controls.actions || controls.action) execute({ controls, e, id: mainID, __: controls.__ || myView.__ })
          }

          if (eventid === "droplist" || eventid === "actionlist" || eventid === "popup") setTimeout(_myFn, 100)
          else _myFn()
          
        }, timer)
      }

      if (!_view.element) return console.log(_view);
      // handler
      if (event.includes("touch") && !('ontouchstart' in window) && !(navigator.maxTouchPoints > 0) && !(navigator.msMaxTouchPoints > 0)) return;
      _view.element.addEventListener(event, myFn)
    })
  })
}

const defaultEventHandler = ({ id }) => {

  var view = window.views[id]
  var views = window.views
  view.focused = false
  view.touchstarted = false
  view.mouseentered = false
  view.mousedowned = false
  
  view.__eventAddresses__ = view.__eventAddresses__ || {}
  var eventAddress = { id: generate(), event: "click" }
  view.__eventAddresses__[eventAddress.id] = eventAddress

  // linkable
  if (view.link && typeof view.link === "object" && view.link.preventDefault) 
    view.element.addEventListener("click", (e) => { e.preventDefault() })

  // input
  if (view.type === "Input" || view.editable) {
    
    defaultInputHandlerByEvent({ views, view, id, event: "focus", keyName: "focused", value: true })
    defaultInputHandlerByEvent({ views, view, id, event: "blur", keyName: "focused", value: false })
  }
  
  defaultInputHandlerByEvent({ views, view, id, event: "mouseenter", keyName: "mouseentered", value: true })
  defaultInputHandlerByEvent({ views, view, id, event: "mouseleave", keyName: "mouseentered", value: false })
  
  defaultInputHandlerByEvent({ views, view, id, event: "mousedown", keyName: "mousedowned", value: true })
  defaultInputHandlerByEvent({ views, view, id, event: "mouseup", keyName: "mousedowned", value: false })
}

const defaultInputHandlerByEvent = ({ views, view, id, event, keyName, value }) => {

  var eventAddress = { id: generate(), targetID: id, event }
  view.__eventAddresses__[eventAddress.id] = eventAddress

  // function
  eventAddress.function = (e) => { if (views[view.id]) view[keyName] = value }

  view.element.addEventListener(event, eventAddress.function)
}

module.exports = { addEventListener, defaultEventHandler }
