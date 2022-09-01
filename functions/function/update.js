const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { controls } = require("./controls")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")
const { toApproval } = require("./toApproval")

const update = ({ id, _window, req, res, update = {} }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.views : window.global
  var view = views[id]
  
  if (!view || !view.element) return

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[)(:droplist-timer];():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()" })
    toParam({ _window, req, res, string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlist-caller"] && view.element.contains(views[global["actionlist-caller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[)(:actionlist-timer];():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()" })
    toParam({ _window, req, res, string: closeActionlist, id: "actionlist" })
  }

  // children
  var children = clone(toArray(view.children))
  
  // remove id from views
  removeChildren({ id })

  // reset children for root
  if (id === "root") {
    views.root.children = children = clone([global.data.view[global.data.page[global.currentPage].view]])
    children.controls = toArray(children.controls)

    // page controls
    if (global.data.page[global.currentPage].controls) children.controls.push(global.data.page[global.currentPage].controls)
  }

  // before loading controls
  if (children.controls) {
    
    toArray(children.controls).map((controls = {}) => {
      var event = toCode({ _window, string: controls.event || "" })
      if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ _window, req, res, id, string: event.split('?')[2] })) 
        toParam({ _window, req, res, id, string: event.split("?")[1] })
    })
  }
  
  var innerHTML = children
  .map((child, index) => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = view.id
    views[id].style = views[id].style || {}
    views[id]["my-views"] = [...view["my-views"]]
    
    return createElement({ _window, req, res, id })

  }).join("")
  
  view.element.innerHTML = ""
  view.element.innerHTML = innerHTML

  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ _window, req, res, id }))
  idList.map(id => starter({ _window, req, res, id }))
  
  /*var children = [...view.element.children]
  if (timer) setTimeout(() => {
      children.map(el => {
        
        views[el.id].style.opacity = views[el.id].element.style.opacity = "1"
      })
    }, 0)
  else children.map(el => {
    
    views[el.id].style.opacity = views[el.id].element.style.opacity = "1"
  })*/
  
  view.update = global.update = { view: views[id], message: "View updated successfully!", success: true }
}

const removeChildren = ({ id }) => {

  var views = window.views
  var global = window.global
  var view = views[id]

  //if (!view.element && id !== "root") return delete views[id]
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