const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")

const remove = ({ remove: _remove, id }) => {

  var local = window.children[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(local.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(local.Data)
    keys.unshift("global()")
    keys.push("delete()")

    reducer({ id, path: keys })
  }

  removeChildren({ id })

  if (keys.length === 0) {

    local.element.remove()
    delete window.children[id]
    return
  }

  // reset length and derivations
  var nextSibling = false
  var children = [...window.children[local.parent].element.children]
  var index = local.derivations.length - 1

  children.map((child) => {

    var id = child.id
    window.children[id].length -= 1

    // derivation in array of next siblings must decrease by 1
    if (nextSibling) resetDerivations({ id, index })

    if (id === local.id) {
      nextSibling = true
      local.element.remove()
      delete window.children[id]
    }
  })
}

const resetDerivations = ({ id, index }) => {

  var value = window.children
  var local = value[id]

  if (!local) return
  if (isNaN(local.derivations[index])) return

  local.derivations[index] -= 1

  var children = [...local.element.children]
  children.map((child) => resetDerivations({ id: child.id, index }) )
}

module.exports = { remove }
