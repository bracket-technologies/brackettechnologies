const { removeView } = require("./view")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")
const { lineInterpreter } = require("./lineInterpreter")
const { isNumber } = require("./toValue")

const remove = ({ _window, stack, data = {}, id, __, lookupActions }) => {

  var views = window.views
  var view = window.views[id]

  var path = data.path, __dataPath__ = []

  if (path) __dataPath__ = path
  else __dataPath__ = clone(view.__dataPath__) || []
  
  if (__dataPath__.length > 0 && !data.preventDefault) {

    var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1)
    var parentData = lineInterpreter({ id, data: {string} })

    // remove data
    if (Array.isArray(parentData) && parentData.length === 0) {

      var string = `${view.doc}:().` + __dataPath__.join(".").slice(0, -1) + "=:"
      lineInterpreter({ id, data: {string}, __, lookupActions })

    } else {

      var string = `${view.doc}:().` + __dataPath__.join(".") + ".del()"
      lineInterpreter({ id, data: {string}, __, lookupActions })
    }
  }

  // close publics
  closePublicViews({ _window, id, __, lookupActions })
  
  // no data
  if (__dataPath__.length === 0) return removeView({ id, stack, main: true }).remove()

  // reset length and __dataPath__
  var itemIndex = view.__dataPath__.length - 1
  var parent = views[view.__parent__]
  
  // update data path
  parent.__childrenRef__.slice(view.__index__ + 1).map(({ id }) => updateDataPath({ id, index: itemIndex, decrement: true }))
  removeView({ id, stack, main: true }).remove()
}

const updateDataPath = ({ id, index, decrement, increment }) => {

  var views = window.views
  var view = views[id]
  
  if (!view) return
  if (!isNumber(view.__dataPath__[index])) return

  if (decrement) view.__dataPath__[index] -= 1
  else if (increment) view.__dataPath__[index] += 1

  view.__childrenRef__.map(({ id }) => updateDataPath({ id, index, decrement, increment }) )
}

module.exports = { remove, updateDataPath }
