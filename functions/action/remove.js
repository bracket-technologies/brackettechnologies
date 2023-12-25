const { removeChildren } = require("./update")
const { clone } = require("./clone")
const { closePublicViews } = require("./closePublicViews")
const { lineInterpreter } = require("./lineInterpreter")

const remove = ({ data = {}, id, __ }) => {

  var views = window.views
  var view = window.views[id]

  var path = data.path, derivations = []

  if (path) derivations = path
  else derivations = clone(view.derivations) || []
  
  if (derivations.length > 0 && !data.preventDefault) {

    var string = `${view.doc}:().` + derivations.join(".").slice(0, -1)
    var parentData = lineInterpreter({ id, data: string })

    // remove data
    if (Array.isArray(parentData) && parentData.length === 0) {

      var string = `${view.doc}:().` + derivations.join(".").slice(0, -1) + "=:"
      lineInterpreter({ id, data: string })

    } else {

      var string = `${view.doc}:().` + derivations.join(".") + ".del()"
      lineInterpreter({ id, data: string })
    }
  }

  // close publics
  closePublicViews({ id })

  removeChildren({ id })

  // pull id from parent childrenID
  var childrenID = views[view.parent].__childrenID__
  var index = childrenID.findIndex(childID => childID === view.id)
  childrenID.splice(index, 1)
  // END
  
  if (derivations.length === 0) {
    
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
