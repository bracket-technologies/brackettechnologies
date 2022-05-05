const { toApproval } = require("./toApproval")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const events = [
  "click",
  "mouseenter",
  "mouseleave",
  "mousedown",
  "mouseup",
  "touchstart",
  "touchend"
]

const addEventListener = ({ _window, controls, id, req, res }) => {
  
  const { execute } = require("./execute")

  var local = _window ? _window.children[id] : window.children[id]
  var mainID = id

  var events = toCode({ _window, id, string: controls.event })

  // 'string'
  if (events.split("'").length > 2) events = toCode({ _window, string: events, start: "'", end: "'" })
  
  events = events.split("?")
  var _idList = toValue({ id, value: events[3] || id })

  // droplist
  var droplist = (events[1] || "").split(";").find(param => param === "droplist()")
  if (droplist) {
    
    local.droplist.controls = local.droplist.controls || []
    return local.droplist.controls.push({
      event: events.join("?").replace("droplist()", ""),
      actions: controls.actions
    })
  }

  // actionlist
  var actionlist = (events[1] || "").split(";").find(param => param === "actionlist()")
  if (actionlist) {
    
    local.actionlist.controls = local.actionlist.controls || []
    return local.actionlist.controls.push({
      event: events.join("?").replace("actionlist()", ""),
      actions: controls.actions
    })
  }

  // popup
  var popup = (events[1] || "").split(";").find(param => param === "popup()")
  if (popup) {
    
    local.popup = typeof local.popup === "object" ? local.popup : {}
    local.popup.controls = local.popup.controls || []

    return local.popup.controls.push({
      event: events.join("?").replace("popup()", ""),
      actions: controls.actions
    })
  }

  events[0].split(";").map(event => {
    
    var timer = 0, idList
    var once = events[1] && events[1].includes('once')

    // action:id
    var eventid = event.split(":")[1]
    if (eventid) idList = toValue({ _window, req, res, id, value: eventid })
    else idList = clone(_idList)
    
    // timer
    timer = event.split(":")[2] || 0
    
    // event
    event = event.split(":")[0]

    if (!event || !local) return
    clearTimeout(local[`${event}-timer`])

    // add event listener
    toArray(idList).map(id => {

      var _local = _window ? _window.children[id] : window.children[id]
      if (!_local) return

      var myFn = async (e) => {

        // body
        if (id === "body") id = mainID
        var __local = _window ? _window.children[id] : window.children[id]
        
        // VALUE[id] doesnot exist
        if (!__local) return e.target.removeEventListener(event, myFn)
        
        // approval
        var approved = toApproval({ _window, req, res, string: events[2], e, id: mainID })
        if (!approved) return

        // once
        if (once) e.target.removeEventListener(event, myFn)
        
        // params
        toParam({ _window, req, res, string: events[1], e, id: mainID, mount: true })

        // break
        if (local.break) return
        
        // execute
        if (controls.actions) await execute({ _window, req, res, controls, e, id: mainID })

        // awaiters
        if (local.await && local.await.length > 0) 
        toParam({ _window, req, res, id, e, string: local.await.join(";"), mount: true })
      }
      
      // onload event
      if (event === "loaded" || event === "loading" || event === "beforeLoading") return myFn({ target: _local.element })

      var myFn1 = (e) => {
        
        local[`${event}-timer`] = setTimeout(async () => {

          // body
          if (id === "body") id = mainID
          var __local = _window ? _window.children[id] : window.children[id]

          if (once) e.target.removeEventListener(event, myFn)

          // VALUE[id] doesnot exist
          if (!__local) return e.target.removeEventListener(event, myFn)
          
          // approval
          var approved = toApproval({ string: events[2], e, id: mainID })
          if (!approved) return

          // params
          toParam({ string: events[1], e, id: mainID, mount: true })
          
          if (controls.actions) await execute({ controls, e, id: mainID })

          // await params
          if (local.await && local.await.length > 0)
          toParam({ id, e, string: local.await.join(";"), mount: true })

        }, timer)
      }
      
      // elements
      _local.element.addEventListener(event, myFn1)
    })
  })
}

const defaultEventHandler = ({ id }) => {

  var local = window.children[id]
  var global = window.global

  local.touchstart = false
  local.mouseenter = false
  local.mousedown = false

  if (local.link) local.element.addEventListener("click", (e) => e.preventDefault())

  events.map((event) => {

    var setEventType = (e) => {

      if (!window.children[id]) return e.target.removeEventListener(event, setEventType)

      if (event === "mouseenter") local.mouseenter = true
      else if (event === "mouseleave") local.mouseenter = false
      else if (event === "mousedown") {
        
        local.mousedown = true
        window.children["tooltip"].element.style.opacity = "0"
        clearTimeout(global["tooltip-timer"])
        delete global["tooltip-timer"]

      } else if (event === "mouseup") local.mousedown = false
      else if (event === "touchstart") local.touchstart = true
      else if (event === "touchend") local.touchstart = false
    }

    local.element.addEventListener(event, setEventType)
  })
}

module.exports = { addEventListener, defaultEventHandler }
