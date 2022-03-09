const resize = ({ id }) => {

  var local = window.value[id]
  if (!local) return
  
  if (local.type !== "Input") return

  var results = dimensions({ id })
  
  // for width
  var width = local.style.width
  if (width === "fit-content" && local.element) {
    local.element.style.width = results.width + "px"
    local.element.style.minWidth = results.width + "px"
  }

  // for height
  var height = local.style.height
  if (height === "fit-content" && local.element) {
    local.element.style.height = results.height + "px"
    local.element.style.minHeight = results.height + "px"
  }
}

const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const dimensions = ({ id, text }) => {

  var local = window.value[id]
  if (!local) return

  var lDiv = document.createElement("div")
  document.body.appendChild(lDiv)

  var pStyle = local.style
  var pText = text || (local.type === "Input" && local.element && local.element.value) || "A"
  if (pText.includes("<") || pText.includes(">")) pText = pText.split("<").join("&lt;").split(">").join("&gt;")
  
  if (pStyle != null) lDiv.style = pStyle

  pText = pText.split(" ").join("-")
  if (arabic.test(pText) && !english.test(pText)) {
    lDiv.style.fontFamily = "Tajawal, sans-serif"
    lDiv.style.textAlign = "right"
    lDiv.classList.add("arabic")
  }
  lDiv.style.fontSize = pStyle.fontSize || "initial"
  lDiv.style.fontWeight = pStyle.fontWeight || "initial"
  lDiv.style.padding = pStyle.padding || "initial"
  lDiv.style.maxWidth = pStyle.maxWidth || "initial"
  lDiv.style.minWidth = pStyle.minWidth || "initial"
  lDiv.style.width = pStyle.width || "initial"
  lDiv.style.height = pStyle.height || "initial"
  lDiv.style.maxHeight = pStyle.maxHeight || "initial"
  lDiv.style.minHeight = pStyle.minHeight || "initial"
  lDiv.style.transform = pStyle.transform || "initial"
  lDiv.style.whiteSpace = pStyle.whiteSpace || "nowrap"
  lDiv.style.flexWrap = pStyle.flexWrap || "initial"
  lDiv.style.display = "flex"
  lDiv.style.position = "absolute"
  lDiv.style.left = "-1000px"
  lDiv.style.top = "-1000px"
  lDiv.style.opacity = "0"

  lDiv.innerHTML = pText

  if (pStyle.width === "100%")
  lDiv.style.width = (local.element ? local.element.clientWidth : lDiv.style.width) + "px"
  
  lDiv.style.width = lDiv.clientWidth + 1 + "px"

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight
  }
  
  document.body.removeChild(lDiv)
  lDiv = null

  return lResult
}

var converter = (dimension) => {
  
  if (!dimension) return 0
  if (dimension.includes("rem")) return parseFloat(dimension) * 10
  if (dimension.includes("px")) return parseFloat(dimension)
}

module.exports = {resize, dimensions, converter}
