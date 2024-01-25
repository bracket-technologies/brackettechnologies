const { reducer } = require("./reducer")
const { update } = require("./update")

module.exports = {
  duplicate: ({ _window, id, __ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]

    if (view) {

      var doc = global[view.doc]
      var path = view.__dataPath__

      var myData = reducer({ _window, id, __, data: { path, object: doc }, __ })
      var parentData = reducer({ _window, id, __, data: { path: path.slice(0, -1), object: doc } })

      if (typeof myData === "number") parentData.push(0)
      else if (typeof myData === "string") parentData.push("")
      else if (typeof myData === "object") parentData.push({})

      update({ _window, id: view.__parent__, __ })
    }
  }
}