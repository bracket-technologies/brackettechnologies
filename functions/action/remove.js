const { removeView } = require("./view")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")
const { lineInterpreter } = require("./lineInterpreter")
const { isNumber } = require("./toValue")

const remove = ({ _window, data = {}, id, __, lookupActions }) => {

  var views = window.views
  var view = window.views[id]

  var path = data.path, __dataPath__ = []

  if (path) __dataPath__ = path
  else __dataPath__ = clone(view.__dataPath__) || []
  
  if (__dataPath__.length > 0 && !data.preventDefault) {

    var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1)
    var parentData = lineInterpreter({ id, data: string })

    // remove data
    if (Array.isArray(parentData) && parentData.length === 0) {

      var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1) + "=:"
      lineInterpreter({ id, data: string, __, lookupActions })

    } else {

      var string = `${view.doc}:().` + __dataPath__.join(".") + ".del()"
      lineInterpreter({ id, data: string, __, lookupActions })
    }
  }

  // close publics
  closePublicViews({ _window, id, __, lookupActions })

  removeView({ id, self: false })

  // pull id from parent childrenRef
  var childrenRef = views[view.__parent__].__childrenRef__
  var index = childrenRef.findIndex(({ id }) => id === view.id)
  childrenRef.splice(index, 1)
  // END
  
  // no data
  if (__dataPath__.length === 0) return removeView({ id, main: true }).remove()

  // reset length and __dataPath__
  var nextSibling = false
  var children = [...window.views[view.__parent__].__element__.children]
  var index = view.__dataPath__.length - 1
  
  children.map((child) => {

    var id = child.id
    window.views[id].length -= 1

    // derivation in array of next siblings must decrease by 1
    if (nextSibling) resetDerivations({ id, index })

    if (id === view.id) {
      nextSibling = true
      removeView({ id, main: true }).remove()
    }
  })
}

const resetDerivations = ({ id, index }) => {

  var views = window.views
  var view = views[id]

  if (!view) return
  if (!isNumber(view.__dataPath__[index])) return

  view.__dataPath__[index] -= 1

  var children = [...view.__element__.children]
  children.map((child) => resetDerivations({ id: child.id, index }) )
}

module.exports = { remove }
