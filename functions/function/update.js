const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { controls } = require("./controls")
const { toParam } = require("./toParam")

const update = ({ id }) => {

  var value = window.value
  var global = window.global
  var local = value[id]
  
  if (!local || !local.element) return

  // children
  var children = toArray(local.children)

  // remove id from VALUE
  removeChildren({ id })

  // reset children for root
  if (id === "root") children = global.data.page[global.currentPage]["view-id"].map(view => global.data.view[view])

  // onloading
  if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadingEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loading"))
    if (loadingEventControls) controls({ id: "root", controls: loadingEventControls })
  }
  
  var innerHTML = children
    .map((child, index) => {

      var id = child.id || generate()
      value[id] = clone(child)
      value[id].flicker
      value[id].id = id
      value[id].index = index
      value[id].parent = local.id
      value[id].style = value[id].style || {}
      value[id].reservedStyles = toParam({ id, string: value[id].type.split("?")[1] || "" }).style || {}
      value[id].style.transition = null
      value[id].style.opacity = "0"

      return createElement({ id })

    }).join("")
    
      
  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)
  lDiv.style.position = "absolute"
  lDiv.style.display = "none"
  lDiv.innerHTML = innerHTML

  // onloaded
  /*if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadedEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loaded"))
    if (loadedEventControls) controls({ id: "root", controls: loadedEventControls })
  }*/
  
  var children = [...lDiv.children]
  children.map(child => {

    var id = child.id
    setElement({ id })
  })

  setTimeout(() => {

    local.element.innerHTML = ""
    children.map(child => {

      var id = child.id

      value[id].element = child
      starter({ id })
      
      value[id].style.transition = value[id].element.style.transition = value[id].reservedStyles.transition || null
      value[id].style.opacity = value[id].element.style.opacity = value[id].reservedStyles.opacity || "1"
      delete value[id].reservedStyles
      
      local.element.appendChild(child)
    })
    
    if (lDiv) {
      document.body.removeChild(lDiv)
      lDiv = null
    }
  }, 0)
}

const removeChildren = ({ id }) => {

  var value = window.value
  var local = value[id]

  if (!local.element && id !== "root") return delete value[id]
  var children = [...local.element.children]

  children.map((child) => {

    var id = child.id
    if (!value[id]) return

    // clear time out
    Object.entries(value[id]).map(([k, v]) => {

      if (k.includes("-timer")) setTimeout(() => clearTimeout(v), 1000)
      if (k.includes("-watch")) clearTimeout(v)
    })

    removeChildren({ id })
    delete value[id]
  })
}

module.exports = {update, removeChildren}