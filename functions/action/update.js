const { starter } = require("./starter")
const { toView, toHTML } = require("./toView")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")
const { removeView } = require("./view")
const { generate } = require("./generate")
const { addresser } = require("./addresser")
const { toParam } = require("./toParam")
const { decode } = require("./decode")
const { toAwait } = require("./toAwait")

const update = ({ _window, id, lookupActions, stack, address, req, res, __, data = {} }) => {

  // address.blockable = false
  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global

  var view = views[data.id]
  var parent = views[data.__parent__ || view.__parent__]
  
  var __index__ = data.__index__
  var __childIndex__ = data.__childIndex__ !== undefined ? data.__childIndex__ : view.__childIndex__
  var __viewPath__ = [...(data.__viewPath__ || view.__viewPath__)]
  var __customViewPath__ = [...(data.__customViewPath__ || view.__customViewPath__)]
  var __lookupViewActions__ = [...(data.__lookupViewActions__ || view.__lookupViewActions__)]
  var my__ = data.__ || view.__

  var elements = []
  var timer = (new Date()).getTime()
  
  if (!view) return
  
  // close publics
  closePublicViews({ _window, id: data.id, __, stack, lookupActions })

  // get view to be rendered
  var reducedView = {
    ...(data.view ? data.view : clone(__viewPath__.reduce((o, k) => o[k], global.data.view))), 
    __index__, 
    __childIndex__, 
    __view__: true, 
    __viewPath__, 
    __customViewPath__, 
    __lookupViewActions__ 
  }

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
  if (!data.insert && parent.__rendered__) parent.__childrenRef__.filter(({ childIndex }) => childIndex === __childIndex__).map(({ id }) => elements.push(removeView({ _window, id, stack, main: true, insert: data.insert })))
  else if (!parent.__rendered__) removeView({ _window, id: data.id, stack, main: true })

  // address for postUpdate
  var headAddress = addresser({ _window, id, stack, headAddressID: address.headAddressID, hasWaits: address.hasWaits, type: "function", function: "postUpdate", file: "update", __, lookupActions, stack, data: { ...data, childIndex: __childIndex__, elements, timer, parent } }).address
  address.headAddressID = headAddress.id
  address.hasWaits = false
 
  // render
  toView({ _window, lookupActions: __lookupViewActions__, stack, req, res, address, __: my__, data: { view: reducedView, parent: parent.id } })
}

const postUpdate = ({ _window, lookupActions, stack, __, id, address, data: { childIndex, elements, root, timer, parent, ...data } }) => {

  const views = _window ? _window.views : window.views
  const global = _window ? _window.global : window.global

  // tohtml parent
  toHTML({ _window, lookupActions, stack, __, id: parent.id })

  var renderedRefView = parent.__childrenRef__.filter(({ id, childIndex: chdIndex }) => chdIndex === childIndex && !views[id].__rendered__ && views[id])

  var updatedViews = [], idLists = [], innerHTML = ""

  // insert absolutely
  renderedRefView.map(({ id }) => {

    var { __idList__, __html__ } = views[id]

    // push to html
    innerHTML += __html__

    // _.data
    updatedViews.push(views[id])

    // start
    idLists.push(...[id, ...__idList__])
  })

  // browser actions
  if (!_window) {

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

    idLists.map(id => starter({ _window, lookupActions, address, stack, __, id }))
    
    // display
    updatedViews.map(({ id }) => views[id].__element__.style.opacity = "1")

    // rout
    if (updatedViews[0].id === "root") {
      
      document.body.scrollTop = document.documentElement.scrollTop = 0
      var title = root.title || views[global.manifest.page].title
      var path = root.path || views[global.manifest.page].path
      
      history.pushState(null, title, path)
      document.title = title
    }

    if (lDiv) {

      document.body.removeChild(lDiv)
      lDiv = null
    }
  }

  console.log((data.action || "UPDATE") + ":" + updatedViews[0].id, (new Date()).getTime() - timer)

  var data = { view: updatedViews.length === 1 ? updatedViews[0] : updatedViews, message: "View updated successfully!", success: true }

  toParam({ _window, data: "loader.hide" })
  
  if (address) {

    address.params.__ = [data, ...address.params.__]
    address.params.id = views[address.params.id] ? address.params.id : updatedViews[0].id
  }
}

module.exports = { update, postUpdate }