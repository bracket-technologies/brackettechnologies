const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toParam } = require("./toParam")

const remove = ({ remove: _remove, id }) => {

  var views = window.views
  var view = window.views[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(view.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(view.Data)
    keys.unshift(")(")
    keys.push("delete()")

    reducer({ id, path: keys })
  }

  // close droplist
  if (global["droplist-positioner"] && view.element.contains(views[global["droplist-positioner"]].element)) {
    var closeDroplist = ")(:droplist-timer=timer():[if():[)(:droplist-positioner!=():[)(:droplist-positioner].id]:[():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._]];clearTimer():[)(:droplist-timer];if():[)(:droplist-positioner=():[)(:droplist-positioner].id]:[timer():[():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().map():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()]:0]]:400"
    toParam({ string: closeDroplist, id: "droplist", mount: true, eventParams: true })
    delete global["droplist-positioner"]
  }

  // close actionlist
  if (global["actionlist-caller"] && view.element.contains(views[global["actionlist-caller"]].element)) {
    var closeActionlist = ")(:actionlist-timer=timer():[if():[)(:actionlist-caller!=():[)(:actionlist-caller].id]:[():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._]];clearTimer():[)(:actionlist-timer];if():[)(:actionlist-caller=():[)(:actionlist-caller].id]:[timer():[():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().map():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()]:0]]:400"
    toParam({ string: closeActionlist, id: "actionlist", mount: true, eventParams: true })
    delete global["actionlist-caller"]
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
