const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { removeChildren } = require("./update")

const refresh = ({ id, update = {} }) => {

  var value = window.children
  var local = value[id]
  var timer = update.timer || 0
  
  if (!local || !local.element) return
  var parent = value[local.parent]
  var index = local.index

  // children
  var children = clone(toArray(parent.children[index]))
  
  // remove children
  removeChildren({ id })

  ////// remove local
  Object.entries(value[id]).map(([k, v]) => {

    if (k.includes("-timer")) clearTimeout(v)
  })
  delete value[id]
  ///////

  var innerHTML = children
  .map(child => {

    var id = child.id || generate()
    value[id] = child
    value[id].id = id
    value[id].index = index
    value[id].parent = parent.id
    value[id].style = value[id].style || {}
    value[id].style.opacity = "0"
    if (timer) value[id].style.transition = `opacity ${timer}ms`
    
    return createElement({ id })

  }).join("")
  
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

  parent.element.insertBefore(node, parent.element.children[index])
  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))
  
  var _children = [...parent.element.children]
  _children.map(childNode => {
    var _index = childNode.getAttribute("index")
    if (_index === index) return childNode
    else return
  }).filter(child => child)
  
  if (timer) setTimeout(() => _children.map(el => value[el.id].style.opacity = value[el.id].element.style.opacity = "1"), 0)
  else _children.map(el => value[el.id].style.opacity = value[el.id].element.style.opacity = "1")
  
  if (lDiv) {
    document.body.removeChild(lDiv)
    lDiv = null
  }
}

module.exports = {refresh}