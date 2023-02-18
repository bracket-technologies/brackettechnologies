const {clone} = require("./clone")
const {reducer} = require("./reducer")

const setData = ({ id, data }) => {

  var view = window.views[id]
  var global = window.global

  if (!global[view.Data]) return

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
  var derivations = clone(view.derivations)
  var keys = [...derivations, ...path]
  
  // set value
  reducer({ id, object: global[view.Data], path: keys, value: defValue, key: true })
/*
  view.data = value
  if (view.input && view.input.type === "file") return

  // setContent
  var content = data.content || value
  setContent({ id, content: { value: content } })
*/
}

module.exports = { setData }
