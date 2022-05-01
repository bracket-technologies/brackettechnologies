const { generate } = require("./generate")
const { starter } = require("./starter")
const { setElement } = require("./setElement")
const { toArray } = require("./toArray")
const { createElement } = require("./createElement")
const { clone } = require("./clone")
const { controls } = require("./controls")

const update = ({ id, update = {} }) => {

  var value = window.value
  var global = window.global
  var local = value[id]
  var timer = update.timer || 0
  
  if (!local || !local.element) return

  // children
  var children = clone(toArray(local.children))
  
  // remove id from VALUE
  removeChildren({ id })

  // reset children for root
  if (id === "root") children = clone(global.data.page[global.currentPage]["views"].map(view => global.data.view[view]))

  // onloading
  if (id === "root" && global.data.page[global.currentPage].controls) {

    var loadingEventControls = toArray(global.data.page[global.currentPage].controls)
      .find(controls => controls.event.split("?")[0].includes("loading"))
    if (loadingEventControls) controls({ id: "root", controls: loadingEventControls })
  }

  var innerHTML = children
  .map((child, index) => {

    var id = child.id || generate()
    value[id] = child
    value[id].id = id
    value[id].index = index
    value[id].parent = local.id
    value[id].style = value[id].style || {}
    value[id].style.opacity = "0"
    if (timer) value[id].style.transition = `opacity ${timer}ms`
    
    return createElement({ id })

  }).join("")
  
  local.element.innerHTML = ""
  local.element.innerHTML = innerHTML

  var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
  
  idList.map(id => setElement({ id }))
  idList.map(id => starter({ id }))
  
  var children = [...local.element.children]
  if (timer) setTimeout(() => {
      children.map(el => {
        
        value[el.id].style.opacity = value[el.id].element.style.opacity = "1"
      })
    }, 0)
  else children.map(el => {
    
    value[el.id].style.opacity = value[el.id].element.style.opacity = "1"
  })
}

const removeChildren = ({ id }) => {

  var value = window.value
  var local = value[id]

  //if (!local.element && id !== "root") return delete value[id]
  var children = [...local.element.children]

  children.map((child) => {

    var id = child.id
    if (!value[id]) return

    // clear time out
    Object.entries(value[id]).map(([k, v]) => {

      if (k.includes("-timer")) clearTimeout(v)
    })

    removeChildren({ id })
    delete value[id]
  })
}

module.exports = {update, removeChildren}