const { clone } = require("./clone")
const { decode } = require("./decode")
const { generate } = require("./generate")
const { getDeepChildrenId } = require("./kernel")
const { updateDataPath } = require("./remove")
const { toCode } = require("./toCode")
const { isNumber } = require("./toValue")
const { update } = require("./update")

const insert = async ({ lookupActions, stack, __, address, id, insert }) => {

  var { index, view, path, data, doc, parent, preventDefault } = insert

  var views = window.views
  var global = window.global
  var parent = views[parent]
  var passData = {}
  var __childIndex__

  if (!view) {

    var childrenRef = parent.__childrenRef__.find(({ id: viewID }) => viewID === id || getDeepChildrenId({ id: viewID }).includes(id))

    if (childrenRef) view = views[childrenRef.id]
    else view = views[parent.__childrenRef__[0].id]
    
    id = view.id
    index = (index || view.__index__) + 1
    path = [...(path || view.__dataPath__)]
    doc = doc || view.doc
    __childIndex__ = view.__childIndex__

  } else if (insert.__view__) {

    index += 1
    delete insert.data
    view = insert
    id = view.id
    path = [...__dataPath__]
    __childIndex__ = view.__childIndex__
  }

  // clone
  if (view.__view__) {

    if (!preventDefault) {

      // path
      path = path || []

      // increment data index
      if (isNumber(path[path.length - 1])) path[path.length - 1] += 1

      // increment next views dataPath index
      var itemIndex = view.__dataPath__.length - 1
      if (index < parent.__childrenRef__.length) 
        parent.__childrenRef__.slice(index).map(viewRef => updateDataPath({ id: viewRef.id, index: itemIndex, increment: true }))
      
      // data
      insert.data = insert.data || (typeof view.data === "object" ? {} : "")
      path.reduce((o, k, i) => {

        if (i === itemIndex - 1) o[k].splice(path[itemIndex], 0, insert.data)
        else if (i >= itemIndex) return
        else return o[k]

      }, global[doc])
    }
    
    // inserted view params
    passData = { __: view.__, lookupActions: view.__lookupActions__, __viewPath__: [...view.__viewPath__], __customViewPath__: [...view.__customViewPath__] }
    
    // loop
    if (view.__loop__ && view.__mount__) passData.__ = [insert.data, ...passData.__.slice(1)]

    // inserted view
    view = { view: view.view, children: view.children }

  } else { // new View

    // we need it for nowing path for update
    var genView = generate()
    global.data.view[genView] = clone(view)
    passData = { __viewPath__: [genView], __customViewPath__: [...parent.__customViewPath__, genView] }
  }

  if (typeof view !== "object") return console.log("Missing View!")

  // insert index
  if (index === undefined) index = parent.__element__.children.length

  // remove loop
  if (view.view.charAt(0) === "[") {
    view.view = toCode({ id, string: toCode({ id, string: view.view, start: "'" }) })
    view.view = global.__refs__[view.view.slice(0, 6)].data + "?" + decode({ string: view.view.split("?").slice(1).join("?") })
  }
  
  update({ lookupActions, stack, address, id, __, data: { view: { ...clone(view), __inserted__: true }, id, path, data, doc, __childIndex__, __index__: index, insert: true, __parent__: parent.id, action: "INSERT", ...passData } })
}

module.exports = { insert }