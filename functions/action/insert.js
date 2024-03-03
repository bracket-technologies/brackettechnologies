const { clone } = require("./clone")
const { decode } = require("./decode")
const { generate } = require("./generate")
const { getDeepChildrenId } = require("./kernel")
const { updateDataPath } = require("./remove")
const { toCode } = require("./toCode")
const { isNumber } = require("./toValue")
const { update } = require("./toView")

const insert = async ({ lookupActions, stack, __, address, id, insert }) => {

  var { index, view, path, data, doc, viewPath = [], parent, preventDefault } = insert

  const views = window.views
  const global = window.global
  var parent = views[parent]
  var passData = {}
  var __childIndex__
  
  if (insert.__view__) {

    view = insert
    
  } else if (!view) {

    var childrenRef = parent.__childrenRef__.find(({ id: viewID }) => viewID === id || getDeepChildrenId({ id: viewID }).includes(id))

    if (childrenRef) view = views[childrenRef.id]
    else view = insert = views[parent.__childrenRef__[0].id]
  }

  // clone
  if (view.__view__) {

    // id
    id = view.id

    // childIndex
    __childIndex__ = view.__childIndex__

    // index
    index = index !== undefined ? index : (view.__index__ + 1)

    if (!preventDefault) {
      
      // path
      path = [...(path || view.__dataPath__)]
      doc = doc || view.doc

      // increment data index
      if (isNumber(path[path.length - 1])) path[path.length - 1] += 1

      // increment next views dataPath index
      var itemIndex = view.__dataPath__.length - 1
      if (index < parent.__childrenRef__.length) 
        parent.__childrenRef__.slice(index).map(viewRef => updateDataPath({ id: viewRef.id, index: itemIndex, increment: true }))
      
      // data
      data = insert.__view__ ? (typeof insert.data === "object" ? {} : "") : (insert.view && data !== undefined ? data : undefined)

      path.reduce((o, k, i) => {

        if (i === itemIndex - 1) o[k].splice(path[itemIndex], 0, data)
        else if (i >= itemIndex) return
        else return o[k]

      }, global[doc])
    }
    
    // inserted view params
    passData = {
      __: view.__loop__ ? [data, ...view.__.slice(1)] : view.__,
      __viewPath__: [...view.__viewPath__, ...viewPath], 
      __customViewPath__: [...view.__customViewPath__], 
      __lookupViewActions__: [...view.__lookupViewActions__] 
    }

    // get raw view
    view = clone(([...view.__viewPath__, ...viewPath]).reduce((o, k) => o[k], global.data.view))

  } else { // new View

    var genView = generate()
    if (typeof view !== "string") global.data.view[genView] = clone(view)
    else genView = clone((viewPath).reduce((o, k) => o[k], view))
    
    passData = {
      __viewPath__: [genView, ...viewPath], 
      __customViewPath__: [...parent.__customViewPath__, genView], 
      __lookupViewActions__: [...parent.__lookupViewActions__, { type: "customView", view: genView }] 
    }
  }

  if (typeof view !== "object") return console.log("Missing View!")

  // index
  if (index === undefined) index = parent.__element__.children.length

  // remove loop
  if (view.view.charAt(0) === "[") {
    view.view = toCode({ id, string: toCode({ id, string: view.view, start: "'" }) })
    view.view = global.__refs__[view.view.slice(0, 6)].data + "?" + decode({ string: view.view.split("?").slice(1).join("?") })
  }
  
  update({ lookupActions, stack, address, id, __, data: { view: { ...clone(view), __inserted__: true }, id, path, data, doc, __childIndex__, __index__: index, insert: true, __parent__: parent.id, action: "INSERT", ...passData } })
}

module.exports = { insert }