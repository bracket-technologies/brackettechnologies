const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")

const remove = ({ remove: _remove, id }) => {

  var view = window.views[id]

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(view.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(view.Data)
    keys.unshift("global()")
    keys.push("delete()")

    reducer({ id, path: keys })
  }

  removeChildren({ id })

  if (keys.length === 0) {

    view.element.remove()
    delete window.views[id]
    return
  }

  // reset length and derivations
  var nextSibling = false
  var children = [...window.views[view.parent].element.children]
  var index = view.derivations.length - 1

  children.map((child) => {

    var id = child.id
    window.views[id].length -= 1

    // derivation in array of next siblings must decrease by 1
    if (nextSibling) resetDerivations({ id, index })

    if (id === view.id) {
      nextSibling = true
      view.element.remove()
      delete window.views[id]
    }
  })
}

const resetDerivations = ({ id, index }) => {

  var views = window.views
  var view = views[id]

  if (!view) return
  if (isNaN(view.derivations[index])) return

  view.derivations[index] -= 1

  var children = [...view.element.children]
  children.map((child) => resetDerivations({ id: child.id, index }) )
}

module.exports = { remove }
