const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const remove = ({ _window, remove: _remove, id, __ }) => {

  var views = window.views
  var view = window.views[id]
  var global = window.global

  _remove = _remove || {}
  var path = _remove.path, keys = []

  if (path) keys = path
  else keys = clone(view.derivations) || []
  
  if (!_remove.onlyChild && keys.length > 0 && !_remove.keepData) {

    keys.unshift(`${view.Data}:()`)
    var parentData = reducer({ id, path: keys.slice(0, -1), __ })
    if (Array.isArray(parentData) && parentData.length === 0) {
      reducer({ id, path: keys.slice(0, -1), value: [], key: true, __ })
    } else {
      keys.push("del()")
      reducer({ id, path: keys, __ })
    }
  }

  // close droplist
  if (global["__droplistPositioner__"] && view.element.contains(views[global["__droplistPositioner__"]].element)) {
    var closeDroplist = toCode({ _window, string: "clearTimer():[droplist-timer:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style().[_]=():droplist.style.[_]];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()" })
    toParam({ string: closeDroplist, id: "droplist" })
  }
  
  // close actionlist
  if (global["actionlistCaller"] && view.element.contains(views[global["actionlistCaller"]].element)) {
    var closeActionlist = toCode({ _window, string: "clearTimer():[actionlistTimer:()];():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style().[_]=():actionlist.style.[_]];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()" })
    toParam({ string: closeActionlist, id: "actionlist" })
  }

  removeChildren({ id })

  // NEWWWWWWWWWWWWWWWWWW
  // pull id from parent childrenID
  var childrenID = views[view.parent].__childrenID__
  var index = childrenID.findIndex(childID => childID === view.id)
  childrenID.splice(index, 1)
  // END
  
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
