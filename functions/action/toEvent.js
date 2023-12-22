const { toArray } = require("./toArray")

module.exports = {
  toEvent: ({ _window, id, string, __, lookupActions }) => {

    var view = _window ? _window.views[id] : window.views[id]
    view.controls = toArray(view.controls)

    view.controls.push({ event: string, __, lookupActions })
  }
}