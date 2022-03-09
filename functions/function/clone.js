const clone = (obj) => {

  /*if (typeof obj !== "object") return obj
  if (Array.isArray(obj)) return obj.map(obj => clone(obj))
  else { 
    var copy = {}
    Object.assign(copy, obj)
    return copy
  }*/

  var copy
  if (typeof obj !== "object") copy = obj
  else if (Array.isArray(obj)) copy = obj.map((obj) => clone(obj))
  else {
    var element

    if (obj.element) element = obj.element
    copy = JSON.parse(JSON.stringify(obj))

    if (element) copy.element = element
  }

  return copy
}

const isElement = (obj) => {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement
  } catch (e) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have (works on IE7)
    return (
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.style === "object" &&
      typeof obj.ownerDocument === "object"
    )
  }
}

module.exports = {clone}
