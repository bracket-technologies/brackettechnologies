const { clearValues } = require("./clearValues")
const { clone } = require("./clone")
const { toArray } = require("./toArray")
const { removeDuplicates } = require("./removeDuplicates")
const { generate } = require("./generate")
const { focus } = require("./focus")

var duplicate = ({ duplicate = {}, id }) => {
  
  const { createElement} = require("./createElement")
  const { starter} = require("./starter")
  const { setElement} = require("./setElement")

  var local = window.value[id]
  var global = window.global

  var localID = id, path = [], language, currency

  if (global[local.Data]) {
    
    var keys = clone(local.derivations)

    if (!Array.isArray(path))
    keys = duplicate.path ? duplicate.path.split(".") : keys

    // last index refers to data index => must be poped
    if (!isNaN(keys[keys.length - 1])) {

      index = keys[keys.length - 1]
      keys.pop()
    }

    keys.reduce((o, k, i) => {

      if (i === keys.length - 1) {

        if (local.currency) {

          var currencies = []
          Object.entries(o[k]).map(([k, v]) => {
            currencies.push(k)
          })

          var random = []
          global.asset.currency.options.map((currency) => {

            if (!currencies.includes(currency.name.en)) {
              random.push(currency.name.en)
            }
          })

          currency = random[0]
          o[k][currency] = ""

        } else if (local.lang) {

          var langs = []
          Object.entries(o[k]).map(([k, v]) => {
            langs.push(k)
          })

          var random = []
          global.asset.language.options.map((lang) => {
            if (!langs.includes(lang.name.en)) random.push(lang.name.en)
          })

          language = random[0]
          o[k][language] = ""

        } else if (local.key) {

          o[k][local.key] = ""

        } else {

          o[k] = toArray(o[k])
          i = o[k].length - 1

          if (isNaN(local.derivations[local.derivations.length - 1])) {

            if (path.length > 0) path.push(0)
            else local.derivations.push(0)

            var index = local.derivations.length - 1
            var children = [...local.element.children]

            // update length
            children.map((child) => window.value[child.id].derivations.splice(index, 0, 0))
          }

          o[k].push(clone(local.pushData || o[k][i] || ""))
          var index = o[k].length - 1
          o[k][index] = removeDuplicates(clearValues(o[k][index]))
        }
      }

      return o[k]
    }, global[local.Data])
  }

  var length = local.length !== undefined ? local.length : 1
  var id = generate()
  var value = window.value

  value[local.parent].children = toArray(value[local.parent].children)
  value[id] = clone(value[local.parent].children[local.index])
  value[id].id = id
  value[id].parent = local.parent
  value[id].duplicatedElement = true
  value[id].index = local.index
  value[id].derivations = (duplicate.path) ? duplicate.path.split('.') : [...local.derivations]

  var local = value[id]
  local.duplicated = true

  if (value[localID].currency) {

    var type = local.type.split("currency=")[0]
    type += local.type.split("currency=")[1].slice(2)
    type += `;currency=${currency}`
    local.type = type

  } else if (value[localID].lang) {

    var type = local.type.split("lang=")[0]
    type += local.type.split("lang=")[1].slice(2)
    type += `;lang=${language}`
    local.type = type

  } else if (value[localID].originalKeys || local.type.includes("originalKeys=")) {

    // remove originalKeys=[]
    var type = local.type.split("originalKeys=")[0]
    if (local.type.split("originalKeys=")[1]) {
      type += local.type
          .split("originalKeys=")[1]
          .split(";")
          .slice(1)
          .join(";")
    }

    local.type = type

  } else if (value[localID].key) {
    // local.key
  } else {

    var lastIndex = local.derivations.length - 1
    if (!isNaN(local.derivations[lastIndex])) local.derivations[lastIndex] = length
    else local.derivations.push(length)

  }

  // [type]
  if (local.type.slice(0, 1) === "[") {

    local.type = local.type.slice(1)
    var type = local.type.split("]")
    local.type = type[0] + local.type.split("]").slice(1).join(']')

  }

  // path
  if (local.type.includes("path=")) {

    var type = local.type.split("path=")
    local.type = type[0]
    type = type[1].split(";").slice(1)
    local.type += type.join(";")

  }
  
  // create element => append child
  var newcontent = document.createElement("div")
  newcontent.innerHTML = createElement({ id })

  while (newcontent.firstChild) {

    id = newcontent.firstChild.id
    value[local.parent].element.appendChild(newcontent.firstChild)

    // starter
    setElement({ id })
    starter({ id })
  }

  // update length
  [...value[local.parent].element.children].map((child) => {

    var id = child.id
    value[id].length = length + 1
  })

  // focus
  focus({ id })
}

var duplicates = ({ data, id }) => {}

module.exports = {duplicate, duplicates}
