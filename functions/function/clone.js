const clone = (obj) => {

  var copy
  if (typeof obj !== "object") copy = obj
  else if (Array.isArray(obj)) copy = [...obj.map(obj => clone(obj))]
  else if (Object.keys(obj).length === 0) copy = {}
  else {
    copy = {}
    Object.entries(obj).map(([key, value]) => {
      if (key !== "element") copy[key] = clone(value)
      else copy[key] = value
    })
  }

  return copy
}

module.exports = {clone}
