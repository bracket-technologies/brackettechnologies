const { generate } = require("./generate")

const toCode = ({ _window, string, e, codes }) => {

  if (typeof string !== "string") return string

  var global = {}
  if (!codes) global = _window ? _window.global : window.global
  var keys = string.split('[')
  
  if (keys.length === 1) return string

  if (keys[1] !== undefined) {

    var key = `coded()${generate()}`
    var subKey = keys[1].split(']')

    // ex. [ [ [] [] ] ]
    while (subKey[0] === keys[1] && keys[2] !== undefined) {
      keys[1] += `${'['}${keys[2]}`
      if (keys[1].includes(']') && keys[2]) keys[1] = toCode({ _window, string: keys[1], e })
      keys.splice(2, 1)
      subKey = keys[1].split(']')
    }

    // ex. 1.2.3.[4.5.6
    if (subKey[0] === keys[1] && keys.length === 2) 
    return keys.join('[')

    if (codes) codes[key] = subKey[0]
    else global.codes[key] = subKey[0]
    var value = key

    var before = keys[0]
    subKey = subKey.slice(1)
    keys = keys.slice(2)
    var after = keys.join('[') ? `${'['}${keys.join('[')}` : ""

    string = `${before}${value}${subKey.join(']')}${after}`
  }

  if (string.split('[')[1] !== undefined && string.split("[").slice(1).join("[").length > 0)
  string = toCode({ _window, string, e })

  return string
}

module.exports = { toCode }
