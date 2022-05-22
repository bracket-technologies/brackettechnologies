const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toArray } = require("./toArray")

const toggleView = ({ toggle, id }) => {

  var views = window.views
  var global = window.global
  var togglePage = toggle.page 
  var toggleId = toggle.id
    || togglePage && views.root && views.root.element.children[0] && views.root.element.children[0].id
    || views[id] && views[id].element.children[0] && views[id].element.children[0].id
  var parentId = toggleId ? (toggleId !== "root" ? views[toggleId].parent : toggleId) : id
  var view = {}
  var viewId = toggle.viewId || toggle.view
  
  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  // children
  var children = []
  if (togglePage) {

    global.currentPage = togglePage.split("/")[0]
    var title = global.data.page[global.currentPage].title
    global.path = togglePage = togglePage === "main" ? "/" : togglePage

    history.pushState({}, title, togglePage)
    document.title = title
    view = views.root
    children = global.data.page[global.currentPage]["views"].map(view => global.data.view[view])

  } else {

    children = toArray(global.data.view[viewId])
    view = views[parentId]
  }

  if (!children) return
  if (!view || !view.element) return

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
      views[id].style.transition = toggle.fadein.before.transition || null
      views[id].style.opacity = toggle.fadein.before.opacity || "0"
      views[id].style.transform = toggle.fadein.before.transform || null

      return createElement({ id })

    }).join("")

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
  
    setTimeout(() => {
      idList.filter(id => views[id] && views[id].type === "Icon" && views[id].google).map(id => views[id]).map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
      })
    }, 0)
    
  }, timer)
}

module.exports = { toggleView }