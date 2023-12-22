const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { toParam } = require("./toParam")
const { closePublicViews } = require("./closePublicViews")

const toggleView = async ({ _window, toggle = {}, id, res, __, stack, lookupActions }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global
  var togglePage = toggle.page, view = {}
  var viewId = toggle.viewId || toggle.view
  var toggleId = toggle.id || id
  var parentId = toggle.parent
  if (togglePage) parentId = "root"
  if (!toggleId) {
    if (!parentId) parentId = id
    toggleId = views[parentId].element.children[0] && views[parentId].element.children[0].id
  } else if (!parentId) parentId = views[toggleId].parent

  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  document.getElementById("loader-container").style.display = "flex"

  // children
  var children = clone([global.data[views[toggleId].viewType][viewId] || { view: "View" }])
  if (togglePage) {

    global.__prevPage__.push(global.__currentPage__)
    if (global.__prevPage__.length > 5) global.__prevPage__.shift()
    var currentPage = global.__currentPage__ = togglePage.split("/")[0]

    viewId = currentPage

  } else {
    view = views[parentId]

    if (id === "root" && global.data.page[viewId]) {

      var page = global.data.page[viewId]
      var _params = toParam({ data: page.type.split("?")[1] || "" })
      global.__prevPath__.push(global.path)
      if (global.__prevPath__.length > 5) global.__prevPath__.shift()
      global.path = _params.path
      history.pushState({}, _params.title, _params.path)
      document.title = _params.title
    }
  }


  if (children.length === 0) return
  if (!view || !view.element) return

  // close publics
  closePublicViews({ id })

  if (res) return views.root.children = clone([{ ...global.data.page[currentPage], id: currentPage }])

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 0

  var innerHTML = await Promise.all(children.map(async (child, index) => {

    var id = child.id || generate()
    views[id] = clone(child)
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = {}
    views[id]["__mapViewsPath__"] = viewId ? [...view.__mapViewsPath__, viewId] : view.__mapViewsPath__
    views[id].style.transition = toggle.fadein.before.transition || null
    views[id].style.opacity = toggle.fadein.before.opacity || "0"
    views[id].style.transform = toggle.fadein.before.transform || null

    return await toView({ id, __, stack, lookupActions })
  }))

  if (toggleId && views[toggleId] && views[toggleId].element) {

    views[toggleId].element.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
    views[toggleId].element.style.transform = toggle.fadeout.after.transform || null
    views[toggleId].element.style.opacity = toggle.fadeout.after.opacity || "0"

    removeChildren({ id: toggleId })
    delete views[toggleId]
  }

  innerHTML = innerHTML.join("")

  // timer
  var timer = toggle.timer || toggle.fadein.timer || 0
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML

  var __IDList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  __IDList__.map(id => setElement({ id }))
  __IDList__.map(id => starter({ id }))

  // set visible
  setTimeout(async () => {

    var children = [...view.element.children]
    children.map(el => {

      var id = el.id
      views[id].style.transition = el.style.transition = toggle.fadein.after.transition || `${timer}ms ease-out`
      views[id].style.transform = el.style.transform = toggle.fadein.after.transform || null
      views[id].style.opacity = el.style.opacity = toggle.fadein.after.opacity || "1"
    })

    document.getElementById("loader-container").style.display = "none"

  }, timer)
}

module.exports = { toggleView }