const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { removeChildren } = require("./update")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toAwait } = require("./toAwait")

module.exports = {
  insert: ({ id, insert, ...params }) => {
    
    var { index, value = {}, el, elementId, component, replace, path, data } = insert
    var local = window.value[id], lDiv
    
    if (index === undefined) index = local.element.children.length
    
    if (component || replace) {

      var _local = clone(component || replace)
      if (data) _local.data = data
      if (path) _local.derivations = (Array.isArray(path) ? path : path.split(".")) || []

      var innerHTML = toArray(_local)
      .map((child, index) => {

        var id = child.id || generate()
        window.value[id] = clone(child)
        window.value[id].id = id
        window.value[id].index = index
        window.value[id].parent = local.id

        return createElement({ id })

      }).join("")
      
      lDiv = document.createElement("div")
      document.body.appendChild(lDiv)
      lDiv.style.position = "absolute"
      lDiv.style.opacity = "0"
      lDiv.style.left = -1000
      lDiv.style.top = -1000
      lDiv.innerHTML = innerHTML

      el = lDiv.children[0]
      window.value[el.id].parent = local.id

    } else {
      
      elementId = elementId || value.id || el && el.id
      el = el || value.el || window.value[elementId].el
    }

    if (replace) {

      var _id = replace.id
      removeChildren({ id: _id })
      replace.element.remove()
      delete window.value[_id]
    }

    el.style.opacity = "0"

    if (index >= local.element.children.length) local.element.appendChild(el)
    else local.element.insertBefore(el, local.element.children[index])

    setTimeout(() => {

      setElement({ id: el.id })
      setTimeout(() => starter({ id: el.id }), 0)
      setTimeout(() => el.style.opacity = "1", 0)
      // focus({ id: el.id })

      // await params
      toAwait({ id, params })

    }, 0)
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }
}