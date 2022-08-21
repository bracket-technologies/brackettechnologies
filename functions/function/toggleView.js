const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { search } = require("./search")
const { toCode } = require("./toCode")
const { toParam } = require("./toParam")

const toggleView = async ({ toggle, id }) => {

  var views = window.views
  var global = window.global
  var togglePage = toggle.page, view = {}
  var viewId = toggle.viewId || toggle.view
  var toggleId = toggle.id
  var parentId = toggle.parent
  if (togglePage) parentId = "root"
  if (!toggleId) {
    if (!parentId) parentId = id
    toggleId = views[parentId].element.children[0] && views[parentId].element.children[0].id
  } else if (!parentId) parentId = views[toggleId].element.parentNode.id && views[toggleId].element.parentNode.id
  
  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  document.getElementsByClassName("loader-container")[0].style.display = "flex"

  // children
  var children = []
  if (togglePage) {

    var currentPage = global.currentPage = togglePage.split("/")[0]
    var notAvailableViews = []

    if (!global.data.page[global.currentPage]) {

      await search({ id: "root", search: { collection: "page", doc: currentPage } })
      global.data.page[currentPage] = views.root.search.data
    }

    viewId = global.data.page[currentPage].view

    // check availability of views
    global.data.page[currentPage].views.map(viewId => {
      if (!global.data.view[viewId]) notAvailableViews.push(viewId)
    })
    
    if (notAvailableViews.length > 0) {

      await search({ id: "root", search: { collection: "view", docs: notAvailableViews, limit: 100 } })
      Object.entries(views.root.search.data).map(([doc, data]) => {
        global.data.view[doc] = data
      })
    }

    var title = global.data.page[global.currentPage].title
    global.path = togglePage = togglePage === "main" ? "/" : togglePage

    history.pushState({}, title, togglePage)
    document.title = title
    view = views.root
    /*
    await global.data.page[global.currentPage]["views"].map(async view => {

    // view doesnot exist? => get from database
      if (!global.data.view[view]) {

        
      }

      children.push(global.data.view[view])
    })
    */

  } else view = views[parentId]

  children = [global.data.view[viewId]]

  if (children.length === 0) return
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

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 0

  if (toggleId && views[toggleId] && views[toggleId].element) {
    
    views[toggleId].element.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
    views[toggleId].element.style.transform = toggle.fadeout.after.transform || null
    views[toggleId].element.style.opacity = toggle.fadeout.after.opacity || "0"
    
    removeChildren({ id: toggleId })
    delete views[toggleId]
  }
  
  var innerHTML = children
    .map((child, index) => {

      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      views[id].style = {}
      views[id]["my-views"] = [...view["my-views"], viewId]
      views[id].style.transition = toggle.fadein.before.transition || null
      views[id].style.opacity = toggle.fadein.before.opacity || "0"
      views[id].style.transform = toggle.fadein.before.transform || null

      return createElement({ id })

    }).join("")
    
  // unloaded views
  // require("../function/loadViews").loadViews()  

  // timer
  var timer = toggle.timer || toggle.fadein.timer || 0
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML
  
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))

  // set visible
  setTimeout(() => {
  
    var children = [...view.element.children]
    children.map(el => {

      var id = el.id
      views[id].style.transition = el.style.transition = toggle.fadein.after.transition || `${timer}ms ease-out`
      views[id].style.transform = el.style.transform = toggle.fadein.after.transform || null
      views[id].style.opacity = el.style.opacity = toggle.fadein.after.opacity || "1"
    })
  
    /*setTimeout(() => {
      idList.filter(id => views[id] && views[id].type === "Icon").map(id => views[id]).map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
      })
    }, 0)*/
    
    document.getElementsByClassName("loader-container")[0].style.display = "none"
    
  }, timer)
}

module.exports = { toggleView }