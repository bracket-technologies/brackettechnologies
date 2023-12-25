const { clone } = require("./clone")
const { colorize } = require("./colorize")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { toHTML } = require("./toHTML")
const { toStyle } = require("./toStyle")
const cssStyleKeyNames = require("./cssStyleKeyNames")

const createHtml = ({ _window, lookupActions, stack, id, req, res, import: _import, __, viewer }) => {

  return new Promise(async resolve => {

    var { toView } = require("./toView")
    
    // views
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], type = view.__name__

    if (view.children) view.children = toArray(view.children)

    var innerHTML = await Promise.all(toArray(view.children).map(async (child, index) => {

      if (!child) return ""

      var _id = child.id || generate()
      delete views[_id]
      views[_id] = clone(child)
      views[_id].id = _id
      views[_id].index = index
      views[_id].parent = view.id

      return await toView({ _window, lookupActions, stack, id: _id, req, res, import: _import, __, viewer })
    }))

    innerHTML = innerHTML.join("")

    // colorize
    if (view.colorize) {

      innerHTML = innerHTML || view.text || (view.editable ? view.data : "")
      innerHTML = toCode({ _window, id, string: toCode({ _window, id, string: innerHTML, start: "'" }) })
      innerHTML = colorize({ _window, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
    }

    if (id === "html") return resolve("")

    var tag = _import ? "" : toHTML({ _window, lookupActions, stack, __, id, innerHTML }) || ""

    if (_import) {

      type = type.toLowerCase()
      delete view.text
      delete view.type
      delete view.view
      delete view.parent
      delete view.__viewsPath__

      if (type === "link" || type === "meta") {

        delete view.id
        delete view.index

        tag = `<${type} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" && typeof value === "string" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>`

      } else if (type === "style") {

        tag = `
          <style>
    
            ${Object.entries(view).map(([key, value]) =>
          typeof value === "object" && !Array.isArray(value)
            ? `${key} {
                ${Object.entries(value).map(([key, value]) => `${cssStyleKeyNames[key] || key}: ${value.toString().replace(/\\/g, '')}`).join(`;
                `)};
                }` : "").filter(style => style).join(`
              `)}
            
          </style>`

      } else tag = `<${type} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" && typeof value === "string" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>${(view.text || "").replace(/\\/g, '')}</${type}>`

      if (view.head) {

        global.__tags__.head += tag.replace(` head="true"`, "")
        return resolve(global.__tags__.head)

      } else {

        global.__tags__.body += tag.replace(` body="true"`, "")
        return resolve(global.__tags__.body)
      }
    }

    // linkable
    if (view.link) {

      var linkID = generate(), style = '', _view, link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.manifest.host)

      _view = { id: linkID, parent: view.id, controls: [{ "event": `click?route():${view.link.path}?${view.link.path};${view.link.preventDafault ? false : true}` }] }
      views[linkID] = _view

      _view.style = view.link.style
      if (_view.style) style = toStyle({ _window, lookupActions, stack, id: linkID })

      tag = `<a ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} id='${linkID}' href=${link} style='${style}' index='${view.index || 0}'>${tag}</a>`
    }

    resolve(tag)
  })
}

module.exports = { createHtml }