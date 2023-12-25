const { generate } = require("./generate")
const { starter } = require("./starter")
const { toArray } = require("./toArray")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { removeChildren } = require("./update")
const { closePublicViews } = require("./closePublicViews")

const updateSelf = async ({ _window, lookupActions, stack, id, update = {}, route, __ }) => {

  var views = window.views
  var view = views[id]
  var global = window.global
  var timer = update.timer || 0
  
  if (!view || !view.element) return
  var parent = views[view.parent]
  var index = view.index || 0
  
  // close publics
  closePublicViews({ id })

  // children
  var children = clone(toArray(parent.children[index]))
  if (id === "popup") children = clone([global.data.public[popup]])
  
  // remove children
  removeChildren({ id })

  ////// remove view
  Object.entries(views[id]).map(([k, v]) => {

    if (k.includes("-timer")) clearTimeout(v)
  })
  delete views[id]
  ///////

  var innerHTML = await Promise.all(children.map(async child => {

    var id = child.id || generate()
    views[id] = child
    views[id].id = id
    views[id].index = index
    views[id].parent = parent.id
    views[id].style = views[id].style || {}
    views[id].__viewsPath__ = [...view.__viewsPath__]
    //views[id].style.opacity = "0"
    //if (timer) views[id].style.transition = `opacity ${timer}ms`
    
    return await toView({ id, __ })

  }))
  
  innerHTML = innerHTML.join("")
  
  var childrenNodes = [...parent.element.children]
  childrenNodes.map((childNode, i) => {
    var _index = parseInt(childNode.getAttribute("index"))
    if (_index === index) parent.element.removeChild(childrenNodes[i])
  })
  
  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.opacity = "0"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.innerHTML = innerHTML
  var node = lDiv.children[0]
  
  parent.element.insertBefore(node, [...parent.element.children][index])
  var __ids__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  __ids__.map(id => starter({ id }))
  
  /*var _children = [...parent.element.children]
  _children.map(childNode => {
    var _index = childNode.getAttribute("index")
    if (_index === index) return childNode
    else return
  }).filter(child => child)*/
  
  if (lDiv) {
    document.body.removeChild(lDiv)
    lDiv = null
  }
  
  view.update = { view: views[node.id], message: "View updated succefully!", success: true }

  // routing
  if (id === "root") {

    document.body.scrollTop = document.documentElement.scrollTop = 0

    var title = route.title || views[views.root.element.children[0].id].title
    var path = route.path || views[views.root.element.children[0].id].path

    history.pushState(null, title, path)
    document.title = title

    if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "none"
  }
}

module.exports = {updateSelf}