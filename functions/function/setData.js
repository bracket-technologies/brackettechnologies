const {clone} = require("./clone")
const {reducer} = require("./reducer")
const {setContent} = require("./setContent")

const setData = ({ id, data }) => {

  var local = window.value[id]
  var global = window.global

  if (!global[local.Data]) return

  // defualt value
  var defValue = data.value
  if (defValue === undefined) defValue = ""

  // path
  var path = data.path
  if (path) path = path.split(".")
  else path = []

  // convert string numbers paths to num
  path = path.map((k) => {
    if (!isNaN(k)) k = parseFloat(k)
    return k
  })

  // keys
  var derivations = clone(local.derivations)
  var keys = [...derivations, ...path]

  // set value
  var value = reducer({ id, object: global[local.Data], path: keys, value: defValue, key: true })

  local.data = value
  if (local.input && local.input.type === "file") return

  // setContent
  var content = data.content || value
  setContent({ id, content: { value: content } })
}

module.exports = { setData }
