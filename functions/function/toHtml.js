const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { clone } = require("./clone")
const { textFormating } = require("./textFormating")

module.exports = {
  toHtml: ({ _window, id, req, res }) => {

    var { createElement } = require("./createElement")

    var local = _window ? _window.value[id] : window.value[id]
    var global = _window ? _window.global : window.global
    
    // innerHTML
    var text = (local.text !== undefined && local.text.toString()) || (typeof local.data !== "object" && local.data) || ''
    var innerHTML = local.type !== "View" ? text : ""
    var checked = local.input && local.input.type === "radio" && parseFloat(local.data) === parseFloat(local.input.defaultValue)
    
    // value
    var value = _window ? _window.value : window.value

    // format
    // if (text && typeof text === "string") text = textFormating({ _window, text, id })
    
    innerHTML = toArray(local.children).map((child, index) => {

      if (!child || !child.type) return ""

      var id = child.id || generate()
      value[id] = clone(child)
      value[id].id = id
      value[id].index = index
      value[id].parent = local.id

      return createElement({ _window, id, req, res })
      
    }).join("")
    
    var value = (local.input && local.input.value) !== undefined ?
        local.input.value : local.data !== undefined ? local.data : ""

    var tag, style = toStyle({ _window, id })
        
    if (typeof value === 'object') value = ''

    // src
    if (local.type === "Image" && (local.src || local.data)) local.src = textFormating({ _window, text: local.src || local.data || "", id })

    if (local.type === "View") {
      tag = `<div class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</div>`
    } else if (local.type === "Image") {
      tag = `<img class='${local.class}' alt='${local.alt || ''}' id='${local.id}' style='${style}'>${innerHTML}</img>`
    } else if (local.type === "Table") {
      tag = `<table class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</table>`
    } else if (local.type === "Row") {
      tag = `<tr class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</tr>`
    } else if (local.type === "Header") {
      tag = `<th class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</th>`
    } else if (local.type === "Cell") {
      tag = `<td class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</td>`
    } else if (local.type === "Label") {
      tag = `<label class='${local.class}' id='${local.id}' style='${style}' ${local["aria-label"] ? `aria-label="${local["aria-label"]}"` : ""} ${local.for ? `for="${local.for}"` : ""}>${innerHTML}</label>`
    } else if (local.type === "Span") {
      tag = `<span class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</span>`
    } else if (local.type === "Text") {
      if (local.label) {
        tag = `<label class='${local.class}' id='${local.id}' style='${style}' ${local["aria-label"] ? `aria-label="${local["aria-label"]}"` : ""} ${local.for ? `for="${local.for}"` : ""}>${innerHTML}</label>`
      } else if (local.h1) {
        tag = `<h1 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h1>`
      } else if (local.h2) {
        tag = `<h2 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h2>`
      } else if (local.h3) {
        tag = `<h3 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h3>`
      } else if (local.h4) {
        tag = `<h4 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h4>`
      } else if (local.h5) {
        tag = `<h5 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h5>`
      } else if (local.h6) {
        tag = `<h6 class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</h6>`
      } else if (local.span) {
        tag = `<span class='${local.class}' id='${local.id}' style='${style}'>${innerHTML}</span>`
      } else {
        tag = `<p class='${local.class}' id='${local.id}' style='${style}'>${text}</p>`
      }
    } else if (local.type === "Icon") {
      tag = `<i class='${local.outlined ? "material-icons-outlined" : local.rounded ? "material-icons-round" : local.sharp ? "material-icons-sharp" : local.filled ? "material-icons" : local.twoTone ? "material-icons-two-tone" : ""} ${local.class || ""} ${local.icon.name}' id='${local.id}' style='${style}'>${local.google ? local.icon.name : ""}</i>`
    } else if (local.type === "Textarea") {
      tag = `<textarea class='${local.class}' id='${local.id}' style='${style}' placeholder='${local.placeholder || ""}' ${local.readonly ? "readonly" : ""} ${local.maxlength || ""}>${local.data || local.input.value || ""}</textarea>`
    } else if (local.type === "Input") {
      if (local.textarea) {
        tag = `<textarea spellcheck='false' class='${local.class}' id='${local.id}' style='${style}' placeholder='${local.placeholder || ""}' ${local.readonly ? "readonly" : ""} ${local.maxlength || ""}>${value}</textarea>`
      } else {
        tag = `<input ${local["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${local.class}' id='${local.id}' style='${style}' ${local.input.name ? `name="${local.input.name}"` : ""} ${local.input.accept ? `accept="${local.input.accept}/*"` : ""} type='${local.input.type || "text"}' ${local.placeholder ? `placeholder="${local.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${local.readonly ? "readonly" : ""} ${local.input.min ? `min="${local.input.min}"` : ""} ${local.input.max ? `max="${local.input.max}"` : ""} ${local.input.defaultValue ? `defaultValue="${local.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${local.disabled ? "disabled" : ''}/>`
      }
    } else if (local.type === "Paragraph") {
      tag = `<textarea class='${local.class}' id='${local.id}' style='${style}' placeholder='${local.placeholder || ""}'>${text}</textarea>`
    }

    // linkable
    if (local.link) {

      var id = generate(), style = ''
      if (_window) _window.value[id] = {}
      else window.value[id] = {}

      var _local = _window ? _window.value[id] : window.value[id]

      _local = { id, parent: local.id }
      _local.style = local.link.style
      if (_local.style) style = toStyle({ _window, id })

      tag = `<a id='${id}' href=${local.link.path || global.host} style='${style}'>${tag}</a>`
    }

    return tag
  }
}