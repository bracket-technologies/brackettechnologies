const { clone } = require("./clone")
const { decode } = require("./decode")
const { generate } = require("./generate")
const { kernel } = require("./kernel")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { isNumber } = require("./toValue")
const { update } = require("./update")

const insert = async ({ lookupActions, stack, __, address, id, insert }) => {

  var { index, view, path, data, doc } = insert

  var views = window.views
  var global = window.global
  var parent = views[id]
  var passData = {}

  if (!view) view = views[parent.__childrenRef__[parent.__childrenRef__.length - 1].id]
  else if (insert.__view__) {
    index += 1
    delete insert.data
    view = insert
  }

  // clone
  if (view.__view__) {
    
    path = [...(path || (!doc && view.__dataPath__) || [])]

    // doc
    doc = doc || view.doc

    // update path
    if (isNumber(path[path.length - 1])) {
      path[path.length - 1] = index = index !== undefined ? index : (parseInt(path[path.length - 1]) + 1)
      reducer({ id: view.id, lookupActions, stack, __, mount: true, data: { path: toCode({ string: "myIndex=path().[-1];nextSiblings().():[deepChildren().log().():[path().[().myIndex]=.path().[().myIndex]+1]]" }) } })
    }

    // data
    kernel({ lookupActions, stack, address, id, __, data: { _object: global[doc], path, key: true, value: insert.data || (typeof view.data === "object" ? {} : "") } })

    // inserted view params
    passData = { __: view.__, lookupActions: view.__lookupActions__, __viewPath__: [...view.__viewPath__], __customViewPath__: [...view.__customViewPath__] }
    
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
  
  update({ lookupActions, stack, address, id, __, data: { view: clone(view), path, data, doc, __index__: index, insert: true, __parent__: id, action: "INSERT", ...passData } })
}

module.exports = { insert }