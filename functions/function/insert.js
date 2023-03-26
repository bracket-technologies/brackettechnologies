const { clone } = require("./clone")
const { toView } = require("./toView")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")

module.exports = {
  insert: async ({ _window, lookupActions, awaits, id, _, __, ___, ...params }) => {
    
    var insert = params.insert, { index, value = {}, el, elementId, component, view, replace, path, data } = insert
    if (view) component = view

    var views = window.views, global = window.global, appendTo = (insert.id || insert.parent)
    if (appendTo && typeof appendTo === "object") appendTo = appendTo.id
    else if (!appendTo) appendTo = id

    var view = views[appendTo], lDiv
    
    if (index === undefined) {
      if (!view.length) {

        view.length = view.element.children.length || 0
        index = view.length
        view.length = view.length + 1

      } else {
        
        index = view.length
        view.length = view.length + 1
      }
    }
    
    if (component || replace) {

      var children = clone(component || replace)
      children.type = children.type || children.view
      
      // remove mapping
      if (children.type.slice(0, 1) === "[") {
        var _type = children.type.slice(1).split("]")[0]
        children.type = children.view = _type + "?" + children.type.split("?").slice(1).join("?")
      }
      
      // data
      if (data) {
        children.data = clone(data)
        children.Data = views[appendTo].Data || insert.Data || insert.doc || generate()
        global[children.Data] = children.data
      }

      // path
      if (path) children.derivations = (Array.isArray(path) ? path : typeof path === "number" ? [path] : path.split(".")) || []
      
      var innerHTML = await Promise.all(toArray(children).map(async (child, i) => {

        var id = child.id || generate()
        views[id] = child
        views[id].id = id
        views[id].index = i
        views[id].mapIndex = index
        views[id].parent = appendTo
        views[id].style = views[id].style || {}
        views[id].reservedStyles = /*toParam({ id, string: views[id].type.split("?")[1] || "" }).style ||*/ {}
        views[id].style.transition = null
        views[id].style.opacity = "0"
        views[id]["my-views"] = [...views[appendTo]["my-views"]]
        
        return await toView({ id, lookupActions })
      }))
      
      innerHTML = innerHTML.join("")
      
      lDiv = document.createElement("div")
      document.body.appendChild(lDiv)
      lDiv.style.position = "absolute"
      lDiv.style.opacity = "0"
      lDiv.style.left = -1000
      lDiv.style.top = -1000
      lDiv.innerHTML = innerHTML

      el = lDiv.children[0]
      views[el.id].parent = view.id

    } else {
      
      elementId = elementId || value.id || el && el.id
      el = el || value.el || views[elementId].el
    }

    if (index >= view.element.children.length) view.element.appendChild(el)
    else view.element.insertBefore(el, view.element.children[index])

    var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
    idList.map(id => setElement({ id, lookupActions }))
    idList.map(id => starter({ id, lookupActions }))
    
    views[el.id].style.transition = views[el.id].element.style.transition = (views[el.id].reservedStyles && views[el.id].reservedStyles.transition) || null
    views[el.id].style.opacity = views[el.id].element.style.opacity = (views[el.id].reservedStyles && views[el.id].reservedStyles.opacity) || "1"
    delete views[el.id].reservedStyles

    view.insert = global.insert = { view: views[el.id], message: "View inserted succefully!", success: true }
    
    if (lDiv) {

      document.body.removeChild(lDiv)
      lDiv = null
    }

    // await params
    if (params.asyncer) require("./toAwait").toAwait({ id, lookupActions, awaits, _: view.insert, __: _, ___: __, ...params })
  }
}