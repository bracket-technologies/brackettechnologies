const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
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
  if (id === "root") views.root.children = children = [{ ...clone(global.data.page[route.currentPage]), id: route.currentPage, __mapViewsPath__: [route.currentPage] }]
  
  var innerHTML = await Promise.all(children.map(async (child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id]["__mapViewsPath__"] = views[id]["__mapViewsPath__"] || [...view.__mapViewsPath__]
    
    return await toView({ _window, lookupActions, stack, req, res, id, __: view.__ })
  }))
  
  if (id === "root" && route.currentPage && route.currentPage !== global.__currentPage__) return
  
  innerHTML = innerHTML.join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML
  
  var __IDList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  __IDList__.map(id => setElement({ _window, lookupActions, stack, req, res, id }))
  __IDList__.map(id => starter({ _window, lookupActions, stack, req, res, id }))
  
  var data = { view: views[id], message: "View updated successfully!", success: true }

  // routing
  if (id === "root") {

    document.body.scrollTop = document.documentElement.scrollTop = 0
    var title = route.title || views[global.__currentPage__].title
    var path = route.path || views[global.__currentPage__].path
    
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
  var children = [...view.element.children]
  
  children.map((child) => {

    var id = child.id
    var view = views[id]
    if (!views[id]) return
    
    (view.__timers__ || []).map(timerID => clearTimeout(timerID))
    Object.values(view.__stacks__ || {}).map(event => view.element.removeEventListener(event.event, event.function))

    removeChildren({ id })
    Object.keys(view).map(key => delete view[key])

    delete global.__events__[id]
    delete views[id]
  })
}

module.exports = {update, removeChildren}