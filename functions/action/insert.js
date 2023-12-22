const { clone } = require("./clone")
const { toView } = require("./toView")
const { starter } = require("./starter")
const { generate } = require("./generate")
const { setElement } = require("./setElement")
const { toCode } = require("./toCode")

module.exports = {
  insert: async ({ lookupActions, stack, id, __, insert, ...params }) => {

    var { index, view: component, path, data } = insert

    var views = window.views, global = window.global, appendTo = (insert.id || insert.parent)

    // append to ID
    if (appendTo && typeof appendTo === "object") appendTo = appendTo.id
    else if (!appendTo) appendTo = id

    var view = views[appendTo]

    // insert index
    if (index === undefined) {
      if (!view.length) {

        view.length = view.element.children.length || 0
        index = view.length
        view.length = view.length + 1

      } else {

        index = view.length
        view.length = view.length + 1
      }
    }

    if (!component) return

    // custom view
    if (typeof component === "string" && global.data.view[component]) component = clone(global.data.view[component])

    var insertView = clone(component)
    insertView.view = toCode({ id, string: toCode({ id, string: insertView.view, start: "'" }) })

    // remove loop
    if (insertView.view.charAt(0) === "@") insertView.view = "View?" + insertView.view.split("?").slice(1).join("?")

    // data
    if (data) {
      insertView.data = clone(data)
      insertView.doc = insert.doc || views[appendTo].doc || generate()
      global[insertView.doc] = global[insertView.doc] || insertView.data
    }

    // path
    if (path) insertView.derivations = (Array.isArray(path) ? path : typeof path === "number" ? [path] : path.split(".")) || []
 
    var _id_ = insertView.id || generate()

    views[_id_] = insertView
    views[_id_].id = _id_
    views[_id_].index = 0
    views[_id_].parent = appendTo

    // smooth display
    views[_id_].style = views[_id_].style || {}
    views[_id_].style.transition = null
    views[_id_].style.opacity = "0"
    
    var innerHTML = await toView({ id: _id_, lookupActions, stack, __: views[appendTo].__ })

    // insert absolutely
    var lDiv = document.createElement("div")
    document.body.appendChild(lDiv)
    lDiv.style.position = "absolute"
    lDiv.style.opacity = "0"
    lDiv.style.left = -1000
    lDiv.style.top = -1000
    lDiv.innerHTML = innerHTML

    var el = lDiv.children[0]
    views[el.id].parent = view.id

    if (index >= view.element.children.length) view.element.appendChild(el)
    else view.element.insertBefore(el, view.element.children[index])

    var __IDList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
    __IDList__.map(id => setElement({ id, lookupActions }))
    __IDList__.map(id => starter({ id, lookupActions }))

    // display after insert
    views[el.id].style.transition = views[el.id].element.style.transition = null
    views[el.id].style.opacity = views[el.id].element.style.opacity = "1"

    var data = { view: views[el.id], message: "View inserted succefully!", success: true }

    if (lDiv) {

      document.body.removeChild(lDiv)
      lDiv = null
    }

    // awaits
    require("./toAwait").toAwait({ id, lookupActions, stack, __, _: data, ...params })
  }
}