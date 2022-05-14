const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { toParam } = require("./toParam")

module.exports = {
  insert: ({ id, insert }) => {
    
    var { index, value = {}, el, elementId, component, replace, path, data } = insert
    var local = window.children[id], lDiv
    
    if (index === undefined) index = local.element.children.length
    
    if (component || replace) {

      var _local = clone(component || replace)
      
      // remove mapping
      if (_local.type.slice(0, 1) === "[") {
        var _type = _local.type.slice(1).split("]")[0]
        _local.type = _type + _local.type.split("]").slice(1).join("]")
      }
      
      if (data) _local.data = clone(data)
      if (path) _local.derivations = (Array.isArray(path) ? path : typeof path === "number" ? [path] : path.split(".")) || []
      
      var innerHTML = toArray(_local)
      .map((child, index) => {

        var id = child.id || generate()
        window.children[id] = child
        window.children[id].id = id
        window.children[id].index = index
        window.children[id].parent = local.id
        window.children[id].style = window.children[id].style || {}
        window.children[id].reservedStyles = toParam({ id, string: window.children[id].type.split("?")[1] || "" }).style || {}
        window.children[id].style.transition = null
        window.children[id].style.opacity = "0"
        
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
      window.children[el.id].parent = local.id

    } else {
      
      elementId = elementId || value.id || el && el.id
      el = el || value.el || window.children[elementId].el
    }

    if (index >= local.element.children.length) local.element.appendChild(el)
    else local.element.insertBefore(el, local.element.children[index])

    var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
    
    idList.map(id => setElement({ id }))
    idList.map(id => starter({ id }))

    window.children[el.id].style.transition = window.children[el.id].element.style.transition = window.children[el.id].reservedStyles.transition || null
    window.children[el.id].style.opacity = window.children[el.id].element.style.opacity = window.children[el.id].reservedStyles.opacity || "1"
    delete window.children[el.id].reservedStyles
    local.insert = { map: window.children[el.id], message: "Map inserted succefully!", success: true }
    
    setTimeout(() => {
      idList.filter(id => window.children[id].type === "Icon").map(id => window.children[id]).map(map => {
        map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
        map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
      })
    }, 0)
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }
}