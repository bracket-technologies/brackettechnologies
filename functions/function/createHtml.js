const { clone } = require("./clone")
const { colorize } = require("./colorize")
const { generate } = require("./generate")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { toStyle } = require("./toStyle")

module.exports = {
    createHtml: ({ _window, lookupActions, awaits, id: _id, req, res, import: _import, _, __, ___, viewer }) => {
    
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
        
        return await createElement({ _window, lookupActions, awaits, id, req, res, import: _import, _, __, ___, viewer })
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
          
          return await createElement({ _window, lookupActions, awaits, id, req, res, _, __, ___, viewer })
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
          
          return await createElement({ _window, lookupActions, awaits, id, req, res, _, __, ___, viewer })
        }))

        prevSiblings += _siblings.join("")
      }
      
      innerHTML = innerHTML.join("")

      // colorize
      if (view.colorize) {
    
        innerHTML = innerHTML || view.text || (view.editable ? view.data : "")
        innerHTML = toCode({ _window, lookupActions, awaits, string: innerHTML  })
        innerHTML = toCode({ _window, lookupActions, awaits, string: innerHTML, start: "'", end: "'" })
        innerHTML = colorize({ _window, lookupActions, awaits, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
      }

      if (_id === "html") return resolve("")
      
      var tag = _import ? "" : require("./toHTML")({ _window, lookupActions, awaits, id: _id, innerHTML }) || ""
      if (prevSiblings) tag = prevSiblings + tag
      if (siblings) tag += siblings
      
      if (_import) {

        type = type.toLowerCase()
        delete view.text
        delete view.type
        delete view.view
        delete view.parent
        delete view["my-views"]
        delete view.viewType
    
        /*if (view.body) view.body = true
        else view.head = true*/
    
        if (type === "link" || type === "meta") {
          
          delete view.id
          delete view.index

          tag = `<${type} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>`

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

          tag = `<${type} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>${(view.text || "").replace(/\\/g, '')}</${type}>`
        }
        
        if (view.head) {
    
          global.__TAGS__.head += tag.replace(` head="true"`, "")
          return resolve(global.__TAGS__.head)

        } else {
    
          global.__TAGS__.body += tag.replace(` body="true"`, "")
          return resolve(global.__TAGS__.body)
        }
      }
    
      // linkable
      if (view.link) {
    
        var id = generate(), style = '', _view, link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.host)
    
        _view = { id, parent: view.id, controls: [{ "event": `click?route():${view.link.path}?${view.link.path};${view.link.preventDafault ? false : true}` }] }
        _view.style = view.link.style
        views[id] = _view
        if (_view.style) style = toStyle({ _window, lookupActions, awaits, id })
        
        tag = `<a ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} id='${id}' href=${link} style='${style}' index='${view.index || 0}'>${tag}</a>`
      }
      
      resolve(tag)
    })
  }
}