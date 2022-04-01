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
  
  local.element.innerHTML = ""
  local.element.innerHTML = innerHTML

  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])

  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))

  var children = [...local.element.children]
  children.map(el => {

    var id = el.id
    value[id].style.transition = value[id].element.style.transition = value[id].reservedStyles.transition || null
    value[id].style.opacity = value[id].element.style.opacity = value[id].reservedStyles.opacity || "1"
    delete value[id].reservedStyles
  })
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

module.exports = { update, removeChildren }