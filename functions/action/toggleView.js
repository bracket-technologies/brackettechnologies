const { starter } = require("./starter")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { removeView } = require("./view")
const { closePublicViews } = require("./closePublicViews")
const { toHTML } = require("./toHTML")

const toggleView = async ({ _window, toggle = {}, id, req, res, lookupActions, stack, __, address }) => {

  var views = _window ? _window.views : window.views
  
  var viewName = toggle.view
  var toggleId = toggle.id || id

  // parent view
  var view = views[toggle.__parent__ || views[toggleId].__parent__]

  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}

  toggle.fadein.before = toggle.fadein.before || {}
  toggle.fadeout.before = toggle.fadeout.before || {}

  toggle.fadein.after = toggle.fadein.after || {}
  toggle.fadeout.after = toggle.fadeout.after || {}

  document.getElementById("loader-container").style.display = "flex"

  // close publics
  closePublicViews({ _window, id, __, lookupActions })

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 0

  // styles
  var style = { transition: toggle.fadein.before.transition || null, opacity: toggle.fadein.before.opacity || "0", transform: toggle.fadein.before.transform || null }

  // children
  var data = { view: viewName || "View", style }

  // clear children
  view.__childrenRef__ = []
  view.__html__ = ""
  view.__childIndex__ = 0

  await toView({ __parent__: view.id, __: view.__, req, res, stack: address.stack, lookupActions, data: { view: data } })

  // remove prev view
  if (toggleId && views[toggleId] && views[toggleId].__element__) {

    views[toggleId].__element__.style.transition = toggle.fadeout.after.transition || `${timer}ms ease-out`
    views[toggleId].__element__.style.transform = toggle.fadeout.after.transform || null
    views[toggleId].__element__.style.opacity = toggle.fadeout.after.opacity || "0"

    removeView({ id: toggleId, self: false })
  }

  // timer
  var timer = toggle.timer || toggle.fadein.timer || 0

  // html
  toHTML({ _window, lookupActions, stack: address.stack, __, id: view.id })
  var innerHTML = view.__innerHTML__

  view.__element__.innerHTML = ""
  view.__element__.innerHTML = innerHTML

  // start
  view.__idList__.map(id => starter({ _window, lookupActions, stack: address.stack, id }))

  // set visible
  setTimeout(async () => {

    var children = [...view.__element__.children]
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