const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { clone } = require("./clone")

module.exports = {
  toHtml: ({ _window, id, req, res }) => {

    var { createElement } = require("./createElement")

    // views
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id]
    
    // innerHTML
    var text = view.text !== undefined ? view.text.toString() : typeof view.data !== "object" ? view.data : ''
    var innerHTML = view.type !== "View" ? text : ""
    var checked = view.input && view.input.type === "radio" && parseFloat(view.data) === parseFloat(view.input.defaultValue)
    
    innerHTML = toArray(view.children).map((child, index) => {

      var id = child.id || generate()
      views[id] = clone(child)
      views[id].id = id
      views[id].index = index
      views[id].parent = view.id
      
      return createElement({ _window, id, req, res })
      
    }).join("\n")
    
    var value = (view.input && view.input.value) !== undefined ?
        view.input.value : view.data !== undefined ? view.data : ""

    var tag, style = toStyle({ _window, id })
        
    if (typeof value === 'object') value = ''
    
    if (view.type === "View") {
      tag = `<div class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>\n${innerHTML}\n</div>`
    } else if (view.type === "Image") {
      tag = `<img class='${view.class}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index}' src='${view.src}'>${innerHTML}</img>`
    } else if (view.type === "Table") {
      tag = `<table class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>\n${innerHTML}\n</table>`
    } else if (view.type === "Row") {
      tag = `<tr class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</tr>`
    } else if (view.type === "Header") {
      tag = `<th class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</th>`
    } else if (view.type === "Cell") {
      tag = `<td class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</td>`
    } else if (view.type === "Label") {
      tag = `<label class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index}'>${innerHTML}</label>`
    } else if (view.type === "Span") {
      tag = `<span class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</span>`
    } else if (view.type === "Text") {
      if (view.label) {
        tag = `<label class='${view.class}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index}'>${innerHTML}</label>`
      } else if (view.h1) {
        tag = `<h1 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h1>`
      } else if (view.h2) {
        tag = `<h2 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h2>`
      } else if (view.h3) {
        tag = `<h3 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h3>`
      } else if (view.h4) {
        tag = `<h4 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h4>`
      } else if (view.h5) {
        tag = `<h5 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h5>`
      } else if (view.h6) {
        tag = `<h6 class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</h6>`
      } else if (view.span) {
        tag = `<span class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${innerHTML}</span>`
      } else {
        tag = `<p class='${view.class}' id='${view.id}' style='${style}' index='${view.index}'>${text}</p>`
      }
    } else if (view.type === "Icon") {
      tag = `<i class='${view.outlined ? "material-icons-outlined" : view.rounded ? "material-icons-round" : view.sharp ? "material-icons-sharp" : view.filled ? "material-icons" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || ""} ${view.icon.name}' id='${view.id}' style='${style}; opacity:0; transition:.2s' index='${view.index}'>${view.google ? view.icon.name : ""}</i>`
    } else if (view.type === "Textarea") {
      tag = `<textarea class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index}'>${view.data || view.input.value || ""}</textarea>`
    } else if (view.type === "Input") {
      if (view.textarea) {
        tag = `<textarea spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index}'>${value}</textarea>`
      } else {
        tag = `<input ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class}' id='${view.id}' style='${style}' ${view.input.name ? `name="${view.input.name}"` : ""} ${view.input.accept ? `accept="${view.input.accept}/*"` : ""} type='${view.input.type || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.input.defaultValue ? `defaultValue="${view.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index}'/>`
      }
    } else if (view.type === "Paragraph") {
      tag = `<textarea class='${view.class}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' index='${view.index}'>${text}</textarea>`
    }

    // linkable
    if (view.link) {

      var id = generate(), style = ''
      var _view = views[id]
      views[id] = {}

      _view = { id, parent: view.id }
      _view.style = view.link.style
      views[id] = _view
      if (_view.style) style = toStyle({ _window, id })
      
      tag = `<a id='${id}' href=${view.link.path || global.host} style='${style}' index='${view.index}'>${tag}</a>`
    }

    return tag
  }
}