const { generate } = require("./generate")
const { starter } = require("./starter")
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
  var child = clone(global.data.view[viewId] || { view: "View" })
  if (togglePage) {

    global.__prevPage__.push(global.manifest.currentPage)
    if (global.__prevPage__.length > 5) global.__prevPage__.shift()
    var currentPage = global.manifest.currentPage = togglePage.split("/")[0]

    viewId = currentPage

  } else {
    view = views[parentId]

    if (id === "root" && global.data.view[viewId]) {

      var page = global.data.view[viewId]
      var _params = toParam({ data: page.type.split("?")[1] || "" })
      global.__prevPath__.push(global.path)
      if (global.__prevPath__.length > 5) global.__prevPath__.shift()
      global.path = _params.path
      history.pushState({}, _params.title, _params.path)
      document.title = _params.title
    }
  }

  if (!view || !view.element) return

  // close publics
  closePublicViews({ id })

  if (res) return views.root.children = clone([global.data.view[currentPage]])

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 0

  var ID = child.id || generate()
  views[ID] = clone(child)
  views[ID].id = ID
  // views[ID].index = index
  views[ID].parent = view.id
  views[ID].style = {}
  views[ID].__viewsPath__ = viewId ? [...view.__viewsPath__, viewId] : [...view.__viewsPath__]
  views[ID].style.transition = toggle.fadein.before.transition || null
  views[ID].style.opacity = toggle.fadein.before.opacity || "0"
  views[ID].style.transform = toggle.fadein.before.transform || null

  var innerHTML = await toView({ id: ID, __: view.__, stack, lookupActions })

  // remve prev view
  if (toggleId && views[toggleId] && views[toggleId].element) {

    views[toggleId].element.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
    views[toggleId].element.style.transform = toggle.fadeout.after.transform || null
    views[toggleId].element.style.opacity = toggle.fadeout.after.opacity || "0"

    removeChildren({ id: toggleId })
    delete views[toggleId]
  }

  // timer
  var timer = toggle.timer || toggle.fadein.timer || 0
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML

  var __ids__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  __ids__.map(id => starter({ id }))

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