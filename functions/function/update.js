const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { controls } = require("./controls")
const { toParam } = require("./toParam")

const update = ({ id, update = {} }) => {

  var views = window.views
  var global = window.global
  var view = views[id]
  var timer = update.timer || 0
  
  if (!view || !view.element) return

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlist-caller"] && view.element.contains(views[global["actionlist-caller"]].element)) {
    var closeActionlist = toCode({ string: "clearTimer():[)(:actionlist-timer];():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") children = clone(global.data.page[global.currentPage]["views"].map(view => global.data.view[view]))

  // onloading
  if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadingEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loading"))
    if (loadingEventControls) controls({ id: "root", controls: loadingEventControls })
  }
  
  var innerHTML = children
  .map((child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id].style.opacity = "0"
    if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return createElement({ id })

  }).join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML

  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))
  
  var children = [...view.element.children]
  if (timer) setTimeout(() => {
      children.map(el => {
        
        views[el.id].style.opacity = views[el.id].element.style.opacity = "1"
      })
    }, 0)
  else children.map(el => {
    
    views[el.id].style.opacity = views[el.id].element.style.opacity = "1"
  })
  
  setTimeout(() => {
    idList.filter(id => views[id].type === "Icon" && views[id].google).map(id => views[id]).map(map => {
      map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
      map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
    })
  }, 0)
}

const removeChildren = ({ id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]

  //if (!view.element && id !== "root") return delete views[id]
  var children = [...view.element.children]

  children.map((child) => {

    var id = child.id
    if (!views[id]) return

    // clear time out
    Object.entries(views[id]).map(([k, v]) => {

      if (k.includes("-timer")) clearTimeout(v)
    })

    removeChildren({ id })
    delete global["body-click-events"][id]
    delete views[id]
  })
}

module.exports = {update, removeChildren}