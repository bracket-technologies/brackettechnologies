const {update} = require("./update")
const {toArray} = require("./toArray")
const {clone} = require("./clone")
const { generate } = require("./generate")

const createView = ({ view, id = generate(), lookupActions }) => {

  var view = window.views[id] || {}
  var global = window.global
  
  view.children = toArray(clone(global.data[view.viewType][view]))

  // update
  update({ id, lookupActions })
}

module.exports = {createView}