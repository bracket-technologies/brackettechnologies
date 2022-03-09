const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { focus } = require("./focus")
const { removeChildren } = require("./update")
const { toArray } = require("./toArray")

const toggleView = ({ toggle }) => {

  var value = window.value
  var global = window.global
  var local = value[value[toggle.id].parent]

  toggle.fadein = toggle.fadein || {}
  toggle.fadeout = toggle.fadeout || {}
  
  if (!local || !local.element) return

  // children
  var children = toArray(global.data.view[toggle.view])
  if (!children) return

  // fadeout
  var timer = toggle.timer || toggle.fadeout.timer || 200
  value[toggle.id].element.style.transition = toggle.fadeout.transition || `${timer}ms ease-out`
  value[toggle.id].element.style.transform = toggle.fadeout.transform || "translateX(-10%)"
  value[toggle.id].element.style.opacity = toggle.fadeout.opacity || "0"

  // remove id from VALUE
  removeChildren({ id: toggle.id })
  delete value[toggle.id]

  // reset children for root
  if (toggle.id === "root") children = global.data.page[global.currentPage]["view-id"].map(view => global.data.view[view])
  
  var innerHTML = children
    .map((child, index) => {

      var id = child.id || generate()
      value[id] = clone(child)
      value[id].id = id
      value[id].index = index
      value[id].parent = local.id
      value[id].style = {}
      value[id].style.transition = null
      value[id].style.opacity = "0"
      value[id].style.transform = "translateX(10%)"

      return createElement({ id })

    }).join("")

  // mount innerhtml
  setTimeout(() => {
    
    local.element.innerHTML = innerHTML

    setTimeout(() => {

      var children = [...local.element.children]
      children.map(child => {
  
        var id = child.id
        setElement({ id })
        setTimeout(() => starter({ id }), 0)
        
      })
      
      // fadein
      setTimeout(() => {
  
        var timer = toggle.timer || toggle.fadein.timer || 200
        children[0].style.transition = toggle.fadein.transition || `${timer}ms ease-out`
        children[0].style.transform = toggle.fadein.transform || "translateX(0)"
        children[0].style.opacity = toggle.fadein.opacity || "1"
  
      }, toggle.timer || 200)
      
      focus({ id: local.id })
      
    }, 0)

  }, toggle.timer || 200)
}

module.exports = {toggleView}
