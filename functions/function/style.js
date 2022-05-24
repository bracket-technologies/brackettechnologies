const { resize } = require("./resize")
const { toArray } = require("./toArray")

const setStyle = ({ id, style = {} }) => {

  var view = window.views[id]
  view.style = view.style || {}
  
  Object.entries(style).map(([key, value]) => {

    if (key === "after") return
    var timer = 0
    if (value || value === 0) value = value + ""

    const style = () => {
      // value = width || height
      if (value) {

        if (value === "available-width") {
          var left = view.element.getBoundingClientRect().left
          var tWidth = window.innerWidth
          if (left) {
            value = (tWidth - left) + "px"
          } else {
            key = "flex"
            value = "1"
          }
          
        } else if (value === "width" || value.includes("width/")) {

          var divide = value.split("/")[1]
          value = view.element.clientWidth
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (value === "height" || value.includes("height/")) {

          var divide = value.split("/")[1]
          value = view.element.clientHeight
          if (divide) value = value / parseFloat(divide)

          value += "px"

        } else if (key === "left" && value === "center") {

          var width = view.element.offsetWidth
          var parentWidth = window.views[view.parent].element.clientWidth

          value = parentWidth / 2 - width / 2 + "px"
        }
      }

      if (view.element) view.element.style[key] = value
      else view.style[key] = value
    }

    if (timer) view[`${key}-timer`] = setTimeout(style, timer)
    else style()

    // resize
    if (key === "width") setTimeout(() => resize({ id }), 0)
  })
}

const resetStyles = ({ id, style = {} }) => {

  var view = window.views[id]
  view.afterStylesMounted = false

  Object.entries({...view.style.after, ...(view.hover && view.hover.style || {})}).map(([key]) => {
    if (view.style[key] !== undefined) style[key] = view.style[key]
    else style[key] = null
  })
  
  setStyle({ id, style })
}

const toggleStyles = ({ id }) => {

  var view = window.views[id]
  if (view.afterStylesMounted) resetStyles({ id, style })
  else mountAfterStyles({ id })
}

const mountAfterStyles = ({ id }) => {

  var view = window.views[id]
  if (!view.style || !view.style.after) return

  view.afterStylesMounted = true

  Object.entries(view.style.after).map(([key, value]) => {

    var timer = 0
    value = value + ""
    if (value.includes(">>")) {
      timer = value.split(">>")[1]
      value = value.split(">>")[0]
    }

    var myFn = () => view.element.style[key] = value

    if (timer) view[`${key}-timer`] = setTimeout(myFn, timer)
    else {

      if (view.element) myFn()
      else {
        view.controls = toArray(view.controls)
        view.controls.push({
          event: `loaded?().element.style.${key}=${value}`
        })
      }
    }
  })
}

module.exports = { setStyle, resetStyles, toggleStyles, mountAfterStyles }
