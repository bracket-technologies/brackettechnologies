const { clone } = require("./clone")
const { colorize } = require("./colorize")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { toStyle } = require("./toStyle")

const _imports = [ "link", "meta", "title", "script", "style"]

module.exports = {
    createHtml: ({ _window, lookupActions, id: _id, req, res, import: _import, _, __, ___ }) => {
    
    return new Promise (async resolve => {

      var { createElement } = require("./createElement")

      // views
      var views = _window ? _window.views : window.views, id = _id
      var global = _window ? _window.global : window.global
      var view = views[id], type = view.type, siblings = "", prevSiblings = ""
      
      if (view.children) view.children = toArray(view.children)
      
      var innerHTML = await Promise.all(toArray(view.children).map(async (child, index) => {
    
        if (!child) return ""
        var id = child.id
        if (id && views[id]) id += generate()
        else if (!id) id = generate()
        views[id] = clone(child)
        views[id].id = id
        views[id].index = index
        views[id].parent = view.id
        
        return await createElement({ _window, lookupActions, id, req, res, import: _import, _, __, ___ })
      }))

      // siblings
      if (view.sibling || view.siblings) {
        
        var _siblings = await Promise.all(toArray(view.sibling || view.siblings).map(async (child, index) => {
    
          if (!child) return ""
          var id = child.id
          if (id && views[id]) id += generate()
          else if (!id) id = generate()
          views[id] = clone(child)
          views[id].id = id
          views[id].index = view.index + ":" + index
          views[id].parent = view.parent
          
          return await createElement({ _window, lookupActions, id, req, res, _, __, ___ })
        }))

        siblings += _siblings.join("")
      }

      // prev siblings
      if (view.prevSibling || view.prevSiblings) {
        
        var _siblings = await Promise.all(toArray(view.prevSibling || view.prevSiblings).map(async (child, index) => {
    
          if (!child) return ""
          var id = child.id
          if (id && views[id]) id += generate()
          else if (!id) id = generate()
          views[id] = clone(child)
          views[id].id = id
          views[id].index = view.index + ":" + index
          views[id].parent = view.parent
          
          return await createElement({ _window, lookupActions, id, req, res, _, __, ___ })
        }))

        prevSiblings += _siblings.join("")
      }
      
      innerHTML = innerHTML.join("")

      // colorize
      if (view.colorize) {
    
        innerHTML = innerHTML || view.text || (view.editable ? view.data : "")
        innerHTML = toCode({ _window, lookupActions, string: innerHTML  })
        innerHTML = toCode({ _window, lookupActions, string: innerHTML, start: "'", end: "'" })
        innerHTML = colorize({ _window, lookupActions, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
      }

      if (_id === "body") return resolve("")
      
      var tag = _import ? "" : require("./toHTML")({ _window, lookupActions, id: _id, innerHTML }) || ""
      if (prevSiblings) tag = prevSiblings + tag
      if (siblings) tag += siblings
      
      if (!tag && _imports.includes(type.toLowerCase())) {

        type = type.toLowerCase()
        delete view.text
        delete view.type
        delete view.view
        delete view.parent
        delete view["my-views"]
    
        /*if (view.body) view.body = true
        else view.head = true*/
    
        if (type === "link" || type === "meta") {
          
          tag = `<${type} ${Object.entries(view).map(([key, value]) => `${key}="${value.toString().replace(/\\/g, '')}"`).join(" ")}>`
        } else if (type === "style") {
          tag = `
          <style>
    
            ${Object.entries(view).map(([key, value]) => 
              typeof value === "object" && !Array.isArray(value)
                ? `${key} {
                ${Object.entries(value).map(([key, value]) => `${require("./styleName")(key)}: ${value.toString().replace(/\\/g, '')}`).join(`;
                `)};
                }` : "").filter(style => style).join(`
              `)}
            
          </style>`
        } else {
          tag = `<${type} ${Object.entries(view).map(([key, value]) => `${key}="${value.toString().replace(/\\/g, '')}"`).join(" ")}>${(view.text || "").replace(/\\/g, '')}</${type}>`
        }
        
        if (view.body) {
    
          global.children.body += tag.replace(` body="true"`, "")
          return resolve(global.children.body)
    
        } else {
    
          global.children.head += tag.replace(` head="true"`, "")
          return resolve(global.children.head)
        }
    
      }
    
      // linkable
      if (view.link) {
    
        var id = generate(), style = '', _view, link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.host)
    
        _view = { id, parent: view.id, controls: [{ "event": `click?route():${view.link.path}?${view.link.path};${view.link.preventDafault ? false : true}` }] }
        _view.style = view.link.style
        views[id] = _view
        if (_view.style) style = toStyle({ _window, lookupActions, id })
        
        tag = `<a ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} id='${id}' href=${link} style='${style}' index='${view.index || 0}'>${tag}</a>`
      }
      
      resolve(tag)
    })
  }
}