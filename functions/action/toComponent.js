const {generate} = require("./generate")
const {toArray} = require("./toArray")

const toComponent = (obj) => {
  // class
  obj.class = obj.class || ""

  // id
  obj.id = obj.id || generate()

  // style
  obj.style = obj.style || {}

  // controls
  obj.controls = toArray(obj.controls)

  // children
  obj.children = toArray(obj.children)

  // model
  if (!obj.model || obj.classic) obj.model = "classic"
  if (obj.featured) obj.model = "featured"

  // component
  obj.component = true

  return obj
}

module.exports = {toComponent}
