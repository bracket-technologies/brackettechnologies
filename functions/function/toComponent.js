const {generate} = require("./generate")
const {toArray} = require("./toArray")

const toComponent = (obj) => {
  // class
  obj.class = obj.class || ""

  // id
  obj.id = obj.id || generate()

  // style
  obj.style = obj.style || {}
  obj.style.after = obj.style.after || {}

  // controls
  obj.controls = toArray(obj.controls)

  // children
  obj.children = toArray(obj.children)

  // model
  obj.featured = obj.featured && "featured"
  obj.model = obj.model || obj.featured || "classic"

  // component
  obj.component = true

  return obj
}

module.exports = {toComponent}
