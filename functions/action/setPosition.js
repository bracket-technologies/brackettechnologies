const setPosition = ({ position = {}, id, e }) => {

  const views = window.views
  var align = position.align || "center"
  var element = views[position.id || id].__element__
  var mousePos = position.positioner === "mouse"
  var fin = element.getElementsByClassName("fin")[0]
  var positioner = position.positioner || id
  
  if (!views[positioner] && !mousePos) return

  var topPos, bottomPos, rightPos, leftPos, heightPos, widthPos

  if (mousePos) {

    topPos = e.clientY + window.scrollY
    bottomPos = e.clientY + window.scrollY
    rightPos = e.clientX + window.scrollX
    leftPos = e.clientX + window.scrollX
    heightPos = 0
    widthPos = 0
    
  } else {

    positioner = views[positioner].__element__
    topPos = positioner.getBoundingClientRect().top
    bottomPos = positioner.getBoundingClientRect().bottom
    rightPos = positioner.getBoundingClientRect().right
    leftPos = positioner.getBoundingClientRect().left
    heightPos = positioner.clientHeight
    widthPos = positioner.clientWidth

    // set height to fit content
    element.style.height = views[element.id].style.height
  }

  var top 
  var left 
  var bottom 
  var distance 
  var placement
  var height = element.offsetHeight
  var width = element.offsetWidth

  if (position.width === "inherit") {

    width = positioner.offsetWidth
    element.style.width = width + "px"

  } else if (position.height === "inherit") {

    height = positioner.offsetHeight
    element.style.height = height + "px"
  }
  
  placement = position.placement || "bottom"
  distance = parseFloat(element.distance || position.distance || 10)
  
  if (placement === "right") {

    left = rightPos + distance + (position.gapX || 0)
    top = topPos + heightPos / 2 - height / 2 + (position.gapY || 0)
      
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "-0.5rem"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0 0 0.4rem"
    }

  } else if (placement === "left") {
    
    left = leftPos - distance - width + (position.gapX || 0)
    top = topPos + heightPos / 2 - height / 2 + (position.gapY || 0)
    
    if (fin) {
      fin.style.right = "-0.5rem"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }

  } else if (placement === "top") {

    top = topPos - height - distance + (position.gapY || 0)
    left = leftPos + widthPos / 2 - width / 2 + (position.gapX || 0)

    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "unset"
      fin.style.bottom = "-0.5rem"
      fin.style.borderRadius = "0 0 0.4rem 0"
    }

  } else if (placement === "bottom") {

    top = topPos + heightPos + distance + (position.gapY || 0)
    left = leftPos + widthPos / 2 - width / 2 + (position.gapX || 0)
    
    if (fin) {
      fin.style.right = "unset"
      fin.style.left = "unset"
      fin.style.top = "-0.5rem"
      fin.style.bottom = "unset"
      fin.style.borderRadius = "0 0.4rem 0 0"
    }
  }

  // fix height overflow
  bottom = top + height
  if (mousePos && window.scrollY) bottom = top - window.scrollY

  if (top - 10 < 0) {

    if (fin) fin.style.top = height / 2 - 5 - 10 + top + "px"
    
    element.style.top = 10 + 'px'
    
    if (20 + height >= window.innerHeight)
    element.style.height = window.innerHeight - 20 + "px"

  } else if (bottom + 10 > window.innerHeight) {

    if (fin) fin.style.top = height / 2 - (fin ? 5 : 0) + 10 + bottom - window.innerHeight + "px"
    
    element.style.top = (window.innerHeight - 10 - height) + 'px'
    
    if (window.innerHeight - 20 - height <= 0) {
      element.style.top = 10 + "px"
      element.style.height = window.innerHeight - 20 + "px"
    }

  } else element.style.top = top + 'px'

  // fix width overflow
  right = left + width
  var windowWidth = window.innerWidth
  var bodyHeight = document.body.offsetHeight
  if (bodyHeight > window.innerHeight) windowWidth -= 12

  if (mousePos && window.scrollX) right = left - window.scrollX
  
  if (left - 10 < 0) {

    if (fin) fin.style.left = width / 2 - 5 - 10 + left + "px"

    element.style.left = 10 + 'px'
    
    if (20 + width >= windowWidth)
    element.style.width = windowWidth - 20 + "px"

  } else if (right + 10 > windowWidth) {

    if (fin) fin.style.left = width / 2 - (fin ? 5 : 0) + 10 + right - windowWidth + "px"
    
    element.style.left = windowWidth - 10 - width + 'px'
    
    if (windowWidth - 20 - width <= 0) {
      element.style.left = 10 + "px"
      element.style.width = windowWidth - 20 + "px"
    }

  } else element.style.left = left + 'px'
  
  // align
  if (align === "left") element.style.left = leftPos + (position.gapX || 0) + "px"
  else if (align === "top") element.style.top = topPos - height + heightPos + (position.gapY || 0) + "px"
  else if (align === "bottom") element.style.bottom = bottomPos + (position.gapY || 0) + "px"
  else if (align === "right") element.style.left = leftPos - width + widthPos + (position.gapX || 0) + "px"
  
  if (fin) fin.style.left = "unset"
}

module.exports = {setPosition}
