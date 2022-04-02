const { clone } = require("./clone")
const { createElement } = require("./createElement")
//const { removeChildren } = require("./update")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")

module.exports = {
  insert: ({ id, insert, ...params }) => {
    
    var { index, value = {}, el, elementId, component, replace, path, data } = insert
    var local = window.value[id], lDiv
    
    if (index === undefined) index = local.element.children.length
    
    if (component || replace) {

      var _local = clone(component || replace)
      if (data) _local.data = clone(data)
      if (path) _local.derivations = (Array.isArray(path) ? path : path.split(".")) || []

      var innerHTML = toArray(_local)
      .map((child, index) => {

        var id = child.id || generate()
        window.value[id] = child
        window.value[id].id = id
        window.value[id].index = index
        window.value[id].parent = local.id
        window.value[id].style = window.value[id].style || {}
        window.value[id].reservedStyles = toParam({ id, string: window.value[id].type.split("?")[1] || "" }).style || {}
        window.value[id].style.transition = null
        window.value[id].style.opacity = "0"
        
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

    if (index >= local.element.children.length) local.element.appendChild(el)
    else local.element.insertBefore(el, local.element.children[index])

    var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
    
    idList.map(id => setElement({ id }))
    idList.map(id => starter({ id }))

    window.value[el.id].style.transition = window.value[el.id].element.style.transition = window.value[el.id].reservedStyles.transition || null
    window.value[el.id].style.opacity = window.value[el.id].element.style.opacity = window.value[el.id].reservedStyles.opacity || "1"
    delete window.value[el.id].reservedStyles
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }
}