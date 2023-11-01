const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const update = async ({ id, _window, lookupActions, awaits, req, res, update = {}, __, route, mainId, ...params }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.views : window.global
  var view = views[id]
  
  if (!view || !view.element) return

  // close droplist
  if (global["__droplistPositioner__"] && view.element.contains(views[global["__droplistPositioner__"]].element)) {
    var closeDroplist = toCode({ _window, lookupActions, awaits, string: "clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()" })
    toParam({ _window, lookupActions, awaits, req, res, string: closeDroplist, id: "droplist", __ })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, lookupActions, awaits, string: "clearTimer():[actionlistTimer:()];():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()" })
    toParam({ _window, lookupActions, awaits, req, res, string: closeActionlist, id: "actionlist", __ })
  }

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") {
    views.root.children = children = [{ ...clone(global.data.page[global.currentPage]), id: global.currentPage, ["my-views"]: [global.currentPage] }]
  }
  
  var innerHTML = await Promise.all(children.map(async (child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = views[id]["my-views"] || [...view["my-views"]]
    
    return await toView({ _window, lookupActions, awaits, req, res, id, __: view.__ })
  }))

  if (id === "root" && route.currentPage && route.currentPage !== global.currentPage) return
  
  innerHTML = innerHTML.join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML
  
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ _window, lookupActions, awaits, req, res, id }))
  idList.map(id => starter({ _window, lookupActions, awaits, req, res, id }))
  
  view.update = global.update = { view: views[id], message: "View updated successfully!", success: true }

  // routing
  if (id === "root") {

    document.body.scrollTop = document.documentElement.scrollTop = 0
    var title = route.title || views[global.currentPage].title
    var path = route.path || views[global.currentPage].path
    
    history.pushState(null, title, path)
    document.title = title

    if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "none"
  }

  // await params
  if (params.asyncer) require("./toAwait").toAwait({ _window, lookupActions, awaits, req, res, id: mainId || id, __: [global.update, ...__], /*object: global.update.view,*/ ...params })
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

    // clear time out
    Object.entries(views[id]).map(([k, v]) => {

      if (k.includes("-timer")) clearTimeout(v)
    })

    removeChildren({ id })
    delete global["body-click-events"][id]
    Object.keys(view).map(key => delete view[key])
    delete views[id]
  })
}

module.exports = {update, removeChildren}