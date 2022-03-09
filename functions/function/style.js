const { resize } = require("./resize")
const { toArray } = require("./toArray")

const setStyle = ({ id, style = {} }) => {

  var local = window.value[id]
  local.style = local.style || {}

  Object.entries(style).map(([key, value]) => {

    if (key === "after") return
    var timer = 0
    if (value || value === 0) value = value + ""

    if (value && value.includes(">>")) {
      timer = value.split(">>")[1]
      value = value.split(">>")[0]
    }

    const style = () => {
      // value = width || height
      if (value) {

        if (value === "available-width") {
          var left = local.element.getBoundingClientRect().left
          var tWidth = window.innerWidth
          if (left) {
            value = (tWidth - left) + "px"
          } else {
            key = "flex"
            value = "1"
          }
          
        } else if (value === "width" || value.includes("width/")) {

          var divide = value.split("/")[1]
          value = local.element.clientWidth
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (value === "height" || value.includes("height/")) {

          var divide = value.split("/")[1]
          value = local.element.clientHeight
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (key === "left" && value === "center") {

          var width = local.element.offsetWidth
          var parentWidth = window.value[local.parent].element.clientWidth

          value = parentWidth / 2 - width / 2 + "px"
        }
      }

      if (local.element) local.element.style[key] = value
      else local.style[key] = value
    }

    if (timer) local[`${key}-timer`] = setTimeout(style, timer)
    else style()

    // resize
    if (key === "width") setTimeout(() => resize({ id }), 0)
  })
}

const resetStyles = ({ id, style = {} }) => {

  var local = window.value[id]
  local.afterStylesMounted = false

  Object.entries({...local.style.after, ...(local.hover && local.hover.style || {})}).map(([key]) => {
    if (local.style[key] !== undefined) style[key] = local.style[key]
    else style[key] = null
  })
  
  setStyle({ id, style })
}

const toggleStyles = ({ id }) => {

  var local = window.value[id]
  if (local.afterStylesMounted) resetStyles({ id, style })
  else mountAfterStyles({ id })
}

const mountAfterStyles = ({ id }) => {

  var local = window.value[id]
  if (!local.style || !local.style.after) return

  local.afterStylesMounted = true

  Object.entries(local.style.after).map(([key, value]) => {

    var timer = 0
    value = value + ""
    if (value.includes(">>")) {
      timer = value.split(">>")[1]
      value = value.split(">>")[0]
    }

    var myFn = () => local.element.style[key] = value

    if (timer) local[`${key}-timer`] = setTimeout(myFn, timer)
    else {

      if (local.element) myFn()
      else {
        local.controls = toArray(local.controls)
        local.controls.push({
          event: `loaded?().element.style.${key}=${value}`
        })
      }
    }
  })
}

module.exports = { setStyle, resetStyles, toggleStyles, mountAfterStyles }
