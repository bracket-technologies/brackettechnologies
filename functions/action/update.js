const { generate } = require("./generate")
const { starter } = require("./starter")
const { toArray } = require("./toArray")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")

const update = async ({ id, _window, lookupActions, stack, req, res, update = {}, __, route = {}, mainId, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.views : window.global
  var view = views[id], timer = (new Date()).getTime()
  
  if (!view || !view.element) return

  // close publics
  closePublicViews({ id })

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") views.root.children = children = [clone(global.data.view[route.currentPage])]

  var innerHTML = await Promise.all(children.map(async (child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id].__viewsPath__ = [...view.__viewsPath__]
    
    return await toView({ _window, lookupActions, stack, req, res, id, __: view.__ })
  }))
  
  if (id === "root" && route.currentPage && route.currentPage !== global.manifest.currentPage) return
  
  innerHTML = innerHTML.join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML
  
  var __ids__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  __ids__.map(id => starter({ _window, lookupActions, stack, req, res, id }))
  
  var data = { view: views[id], message: "View updated successfully!", success: true }

  // routing
  if (id === "root") {

    document.body.scrollTop = document.documentElement.scrollTop = 0
    var title = route.title || views[global.manifest.currentPage].title
    var path = route.path || views[global.manifest.currentPage].path
    
    history.pushState(null, title, path)
    document.title = title

    if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "none"
  }

  console.log(id === "root" ? "ROUTE" : "UPDATE", (new Date()).getTime() - timer, id)

  // await params
  require("./toAwait").toAwait({ _window, lookupActions, stack, req, res, id: mainId || id, ...params, __, _: data })
}

const removeChildren = ({ id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]

  if (!view.element) return
  
  toArray(view.__childrenID__).map(id => {
    
    var view = views[id]
    if (!views[id]) return
    
    (view.__timers__ || []).map(timerID => clearTimeout(timerID))

    removeChildren({ id })
    Object.keys(view).map(key => delete view[key])

    delete global.__events__[id]
    delete views[id]
  })
}

module.exports = {update, removeChildren}