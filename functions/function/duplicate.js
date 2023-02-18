const { reducer } = require("./reducer")
const { update } = require("./update")

module.exports = {
  duplicate: ({ _window, id, _, __, ___ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]

    if (view) {

      var doc = global[view.doc]
      var path = view.derivations

      var myData = reducer({ _window, id, _, __, ___, object: doc, path })
      var parentData = reducer({ _window, id, _, __, ___, object: doc, path: path.slice(0, -1) })

      if (typeof myData === "number") parentData.push(0)
      else if (typeof myData === "string") parentData.push("")
      else if (typeof myData === "object") parentData.push({})

      update({ _window, id: view.parent })
    }
  }
}