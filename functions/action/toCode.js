const { generate } = require("./generate")
const { replaceNbsps } = require("./replaceNbsps")

const toCode = ({ _window, id, string, e, start = "[", end = "]", subCoding }) => {

  if (typeof string !== "string") return string
  const global = _window ? _window.global : window.global

  // text
  if (start === "'") end = "'"
  
  // do not encode []
  if (!subCoding) string = replaceNbsps(string.replaceAll("[]", "__map__"))

  // init
  var type = start === "'" ? "text" : "code"
  var keys = string.split(start)

  if (keys[1] !== undefined) {

    var key = `@${generate()}`
    var subKey = keys[1].split(end)

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {

      keys[1] += `${start}${keys[2]}`
      if (keys[1].includes(end) && keys[2]) {
        keys[1] = toCode({ _window, id, string: keys[1], e, start, subCoding: true })
      }
      keys.splice(2, 1)
      subKey = keys[1].split(end)
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) return keys.join(start)//.replaceAll("__map__", "[]")

    // text
    if (subKey[0].split("'").length > 1) subKey[0] = toCode({ _window, id, string: subKey[0], start: "'" })

    // reference
    global.__refs__[key] = { id, data: subKey[0].replaceAll("__map__", "[]"), type }

    var value = key
    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join(start) ? `${start}${keys.join(start)}` : ""

    string = `${before}${value}${subKey.join(end)}${after}`
  }

  if (string.split(start)[1] !== undefined && string.split(start).slice(1).join(start).length > 0) string = toCode({ _window, id, string, e, start, subCoding: true })

  if (!subCoding) string = string.replaceAll("__map__", "[]")

  return string
}

module.exports = { toCode }