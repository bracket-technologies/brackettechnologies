const { generate } = require("./generate")

const toCode = ({ _window, string, e, codes, start = "[", end = "]" }) => {

  if (typeof string !== "string") return string
  var codeName = start === "'" ? "codedS()" : "coded()"

  var global = {}
  if (!codes) global = _window ? _window.global : window.global
  // string = string.split("[]").join("_array")
  // string = string.split("{}").join("_map")
  
  var keys = string.split(start)
  
  if (keys.length === 1) return string

  if (keys[1] !== undefined) {

    var key = `${codeName}${generate()}`
    var subKey = keys[1].split(end)

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {
      keys[1] += `${start}${keys[2]}`
      if (keys[1].includes(end) && keys[2]) keys[1] = toCode({ _window, string: keys[1], e, start, end })
      keys.splice(2, 1)
      subKey = keys[1].split(end)
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) 
    return keys.join(start)

    if (codes) codes[key] = subKey[0]
    else global.codes[key] = subKey[0]
    var value = key

    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join(start) ? `${start}${keys.join(start)}` : ""

    string = `${before}${value}${subKey.join(end)}${after}`
  }

  if (string.split(start)[1] !== undefined && string.split(start).slice(1).join(start).length > 0)
  string = toCode({ _window, string, e, start, end })

  return string
}

module.exports = { toCode }
