const { toArray } = require("./toArray")

const toEvent = ({ _window, id, string, __, dots, lookupActions }) => {

  var view = _window ? _window.views[id] : window.views[id]
  toArray(view.__controls__).push({ event: string, __, dots, lookupActions })
  
  return "__event__"
}

module.exports = { toEvent }