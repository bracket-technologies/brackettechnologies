const {update} = require("./update")
const {toArray} = require("./toArray")
const {clone} = require("./clone")

const createView = ({ view, id }) => {

  var local = window.value[id]
  var global = window.global

  if (!view) return
  
  local.children = toArray(clone(global.data.view[view]))

  // update
  update({ id })
}

module.exports = {createView}
