const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { colorize } = require("./colorize")
const { toCode } = require("./toCode")

module.exports = {
  toHtml: ({ _window, id, req, res }) => {

    var { createElement } = require("./createElement")

    // views
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]
    
    // innerHTML
    var text = view.text !== undefined ? view.text.toString() : typeof view.data !== "object" ? view.data : ''
    var innerHTML = view.type !== "View" && view.type !== "Box" ? text : ""
    var checked = view.input && view.input.type === "radio" && parseFloat(view.data) === parseFloat(view.input.defaultValue)
    if (view.children) view.children = toArray(view.children)
    
    innerHTML = toArray(view.children).map((child, index) => {

      if (!child) return
      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      views[id]["my-views"] = [...view["my-views"]]
      
      return createElement({ _window, id, req, res })
      
    }).join("")
    
    var value = ""

    if (view.type === "Input") value = (view.input && view.input.value) !== undefined ?
    view.input.value : view.data !== undefined ? view.data : ""

    var tag, style = toStyle({ _window, id })
    if (typeof value === 'object') value = ''

    // colorize
    if (view.colorize) {

      innerHTML = innerHTML || view.text || (view.editable ? view.data : "")
      innerHTML = toCode({ _window, string: innerHTML })
      innerHTML = colorize({ _window, string: innerHTML })
    }
    
    if (view.type === "View" || view.type === "Box") {
      tag = `<div ${view.draggable ? "draggable='true'" : ""} spellcheck="false" ${view.editable && !view.readonly ? "contenteditable" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML || view.text || ""}</div>`
    } else if (view.type === "Image") {
      tag = `<img ${view.draggable ? "draggable='true'" : ""} class='${view.class}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index || 0}' src='${view.src}'>${innerHTML}</img>`
    } else if (view.type === "Table") {
      tag = `<table ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</table>`
    } else if (view.type === "Row") {
      tag = `<tr ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</tr>`
    } else if (view.type === "Header") {
      tag = `<th ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</th>`
    } else if (view.type === "Cell") {
      tag = `<td ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</td>`
    } else if (view.type === "Label") {
      tag = `<label ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
    } else if (view.type === "Span") {
      tag = `<span ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
    } else if (view.type === "Text") {
      if (view.label) {
        tag = `<label ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
      } else if (view.h1) {
        tag = `<h1 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h1>`
      } else if (view.h2) {
        tag = `<h2 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h2>`
      } else if (view.h3) {
        tag = `<h3 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h3>`
      } else if (view.h4) {
        tag = `<h4 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h4>`
      } else if (view.h5) {
        tag = `<h5 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h5>`
      } else if (view.h6) {
        tag = `<h6 ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h6>`
      } else if (view.span) {
        tag = `<span ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
      } else {
        tag = `<p ${view.editable || view.contenteditable ? "contenteditable ": ""}class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${text}</p>`
      }
    } /*else if (view.type === "Entry") {
      tag = `<div ${view.readonly ? "" : "contenteditable"} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${value}</div>`
    } */else if (view.type === "Icon") {
      tag = `<i ${view.draggable ? "draggable='true'" : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined": (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || ""} ${view.icon.name}' id='${view.id}' style='${style}${_window ? "; opacity:0; transition:.2s" : ""}' index='${view.index || 0}'>${view.google ? view.icon.name : ""}</i>`
    } else if (view.type === "Textarea") {
      tag = `<textarea ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${view.data || view.input.value || ""}</textarea>`
    } else if (view.type === "Input") {
      if (view.textarea) {
        tag = `<textarea ${view.draggable ? "draggable='true'" : ""} spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${value}</textarea>`
      } else {
        tag = `<input ${view.draggable ? "draggable='true'" : ""} ${view.multiple?"multiple":""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' ${view.input.name ? `name="${view.input.name}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.type || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.input.defaultValue ? `defaultValue="${view.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index || 0}'/>`
      }
    } else if (view.type === "Paragraph") {
      tag = `<textarea ${view.draggable ? "draggable='true'" : ""} class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' index='${view.index || 0}'>${text}</textarea>`
    } else if (view.type === "Video") {
      tag = `<video style='${style}' controls>
        ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>`: "")}
        ${view.alt || view.message || ""}
      </video>`
    }

    // linkable
    if (view.link) {

      var id = generate(), style = '', _view

      _view = { id, parent: view.id }
      _view.style = view.link.style
      views[id] = _view
      if (_view.style) style = toStyle({ _window, id })
      
      tag = `<a ${view.draggable ? "draggable='true'" : ""} id='${id}' href=${view.link.path || global.host} style='${style}' index='${view.index || 0}'>${tag}</a>`
    }

    return tag
  }
}