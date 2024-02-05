const {clone} = require("./clone")
const { kernel } = require("./kernel")

const setData = ({ id, data, __, dots, stack = {} }) => {

  var view = window.views[id]
  var global = window.global

  if (!global[view.doc]) return

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
  var __dataPath__ = clone(view.__dataPath__)
  var keys = [...__dataPath__, ...path]
  
  // set value
  kernel({ id, data: { data: global[view.doc], path: keys, value: defValue, key: true }, stack, __, dots })
}

module.exports = { setData }
