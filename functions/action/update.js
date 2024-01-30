const { starter } = require("./starter")
const { toView } = require("./toView")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")
const { toHTML } = require("./toHTML")
const { removeView } = require("./view")
const { generate } = require("./generate")

const update = ({ _window, id, lookupActions, stack, address, req, res, __, data = {} }) => {

  // address.blockable = false
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[data.id]
  var parent = views[data.__parent__ || view.__parent__]
  
  var __index__ = data.__index__
  var __childIndex__ = data.__childIndex__ !== undefined ? data.__childIndex__ : view.__childIndex__
  var __viewPath__ = [...(data.__viewPath__ || view.__viewPath__)]
  var __customViewPath__ = [...(data.__customViewPath__ || view.__customViewPath__)]
  var my__ = data.__ || view.__
  var myLookupActions = data.__lookupActions__ || lookupActions

  var elements = []
  var timer = (new Date()).getTime()
  
  if (!view) return
  
  // close publics
  closePublicViews({ _window, id, __, lookupActions })

  // get view to be rendered
  var reducedView = { ...(data.view ? data.view : clone(__viewPath__.reduce((o, k) => o[k], global.data.view))), __index__, __childIndex__, __view__: true, __viewPath__, __customViewPath__ }

  // data
  if (data.data) {
    reducedView.data = clone(data.data)
    reducedView.doc = data.doc || parent.doc || generate()
    global[reducedView.doc] = global[reducedView.doc] || reducedView.data
  } else if (data.doc) {
    reducedView.doc = data.doc
    global[reducedView.doc] = global[reducedView.doc] || reducedView.data || {}
  }

  // path
  if (data.path !== undefined) reducedView.__dataPath__ = (Array.isArray(data.path) ? data.path : typeof data.path === "number" ? [data.path] : data.path.split(".")) || []

  // remove views
  if (!data.insert) parent.__childrenRef__.filter(({ childIndex }) => childIndex === __childIndex__).map(({ id }) => elements.push(removeView({ _window, id, stack, main: true, insert: data.insert })))

  // render
  toView({ _window, lookupActions: myLookupActions, stack, req, res, address, __: my__, data: { view: reducedView, parent: parent.id } })

  postUpdate({ _window, lookupActions, stack, __, req, res, address, id, parent, data: { ...data, childIndex: __childIndex__, elements, timer } })
}

const postUpdate = ({ _window, lookupActions, stack, __, req, res, address, id, parent, data: { childIndex, elements, route, timer, ...data } }) => {
  
  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  // tohtml parent
  toHTML({ _window, lookupActions, stack, __, id: parent.id })

  var renderedRefView = parent.__childrenRef__.filter(({ id, childIndex: cdIndex }) => cdIndex === childIndex && !views[id].__rendered__ && views[id])
  var updatedViews = [], idLists = [], innerHTML = ""
  var renderedID

  // insert absolutely
  renderedRefView.map(({ id }) => {

    var { __idList__, __html__ } = views[id]
    renderedID = id

    // push to html
    innerHTML += __html__

    // _.data
    updatedViews.push(views[id])

    // start
    idLists.push(...[id, ...__idList__])
  })

  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.opacity = "0"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.innerHTML = innerHTML
  lDiv.children[0].style.opacity = "0"

  // remove prev elements
  elements.map(element => element.remove())
  
  // innerHTML
  renderedRefView.map(({ index }) => {
    if (index >= parent.__element__.children.length || parent.__element__.children.length === 0) parent.__element__.appendChild(lDiv.children[0])
    else parent.__element__.insertBefore(lDiv.children[0], parent.__element__.children[index])
  })

  idLists.map(id => starter({ _window, lookupActions, stack: address.stack, id }))
  
  // display
  renderedRefView.map(({ id }) => views[id].__element__.style.opacity = "1")

  console.log(data.action || (renderedRefView[0].id === "root" ? "ROUTE" : "UPDATE"), (new Date()).getTime() - timer, renderedRefView[0].id)

  var data = { view: updatedViews.length === 1 ? updatedViews[0] : updatedViews, message: "View updated successfully!", success: true }

  // rout
  if (renderedID === "root") {
    
    document.body.scrollTop = document.documentElement.scrollTop = 0
    var title = route.title || views[global.manifest.page].title
    var path = route.path || views[global.manifest.page].path
    
    history.pushState(null, title, path)
    document.title = title

    if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "none"
  }

  if (lDiv) {

    document.body.removeChild(lDiv)
    lDiv = null
  }

  // await params
  address && require("./toAwait").toAwait({ _window, lookupActions, stack, address, req, res, id: views[id] ? id : renderedID, __, _: data })
}

module.exports = {update}