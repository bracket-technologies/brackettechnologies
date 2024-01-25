const overflow = ({ id }) => {

  var view = window.views[id]
  var width = view.__element__.clientWidth
  var height = view.__element__.clientHeight
  var text

  if (view.__name__ === "Input" || view.__name__ === "Textarea") {
    text = view.__element__.value
  } else if (
    view.__name__ === "Text" ||
    view.__name__ === "Label" ||
    view.__name__ === "Header"
  ) {
    text = view.__element__.innerHTML
  } else if (view.__name__ === "UploadInput") text = view.__element__.value

  // create a test div
  let lDiv = document.createElement("div")

  document.body.appendChild(lDiv)

  var pStyle = view.__element__.style
  var pText = view.data || view.input.value || ""
  var pFontSize = pStyle.fontSize

  if (pStyle != null) {
    lDiv.style = pStyle
  }

  lDiv.style.fontSize = pFontSize
  lDiv.style.position = "absolute"
  lDiv.style.left = -1000
  lDiv.style.top = -1000
  lDiv.style.padding = pStyle.padding

  lDiv.innerHTML = pText

  var lResult = {
    width: lDiv.clientWidth,
    height: lDiv.clientHeight,
  }

  document.body.removeChild(lDiv)
  lDiv = null

  var overflowX, overflowY
  
  if (width < lResult.width) overflowX = true
  if (height < lResult.height) overflowY = true

  return [overflowX, overflowY]
}

module.exports = {overflow}
