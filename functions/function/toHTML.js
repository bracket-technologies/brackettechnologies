const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { labelHandler } = require("./labelHandler")

const toHTML = ({ _window, id, innerHTML }) => {

  var views = _window ? _window.views : window.views
  var view = views[id]

  var text = view.text !== undefined && view.text !== null ? view.text.toString() : typeof view.data !== "object" ? view.data : ''
  var checked = view.input && view.input.type === "radio" && parseFloat(view.data) === parseFloat(view.input.defaultValue)
  var value = "", type = view.type
  
  // children IDs
  if (view.parent && views[view.parent]) {
    if(!views[view.parent].__childrenID__) views[view.parent].__childrenID__ = []
    views[view.parent].__childrenID__.push(id)
  }

  if (view.type === "Input") value = (view.input && view.input.value) !== undefined ? view.input.value : view.data !== undefined ? view.data : ""

  // innerhtml
  innerHTML = innerHTML || (view.type !== "View" && view.type !== "Box" ? text : "")

  // required
  if (view.required && view.type === "Text") {
    if (typeof view.required === "string") view.required = {}
    type = "View"
    view.style.display = "block"
    innerHTML += `<span style='color:red; font-size:${(view.required.style && view.required.style.fontSize)||"1.6rem"}; padding:${(view.required.style && view.required.style.padding)||"0 0.4rem"}'>*</span>`
  }
  
  // styles
  var tag, style = toStyle({ _window, id })
  if (typeof value === 'object') value = ''
  if (innerHTML) innerHTML = innerHTML.toString().replace(/\\/g, '');

  // html attributes
  var atts = Object.entries(view.att || view.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

  if (view.editable) view.input = {type: "text"}
  
  if (type === "View" || type === "Box") {
    tag = `<div ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ''} spellcheck='false' ${view.editable && !view.readonly ? 'contenteditable' : ''} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML || view.text || ''}</div>`
  } else if (type === "Image") {
    tag = `<img ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index || 0}' ${view.src ? `src='${view.src}'` : ""}></img>`
  } else if (type === "Tag" && view.tag) {
    tag = `<${view.tag.toLowerCase()} ${atts} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${view.content}</${view.tag.toLowerCase()}>`
  } else if (type === "Text") {
    if (view.label) {
      tag = `<label ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' ${view["aria-label"] ? `aria-label="${view["aria-label"]}"` : ""} ${view.for ? `for="${view.for}"` : ""} index='${view.index || 0}'>${innerHTML}</label>`
    } else if (view.h1) {
      tag = `<h1 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h1>`
    } else if (view.h2) {
      tag = `<h2 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h2>`
    } else if (view.h3) {
      tag = `<h3 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h3>`
    } else if (view.h4) {
      tag = `<h4 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h4>`
    } else if (view.h5) {
      tag = `<h5 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h5>`
    } else if (view.h6) {
      tag = `<h6 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</h6>`
    } else if (view.span) {
      tag = `<span ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML}</span>`
    } else {
      tag = `<p ${atts} ${view.editable || view.contenteditable ? "contenteditable ": ""}class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${text}</p>`
    }
  } else if (type === "Icon") {
    tag = `<i ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined": (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || "" || ""} ${view.icon.name}' id='${view.id}' style='${style}${_window ? "; opacity:0; transition:.2s" : ""}' index='${view.index || 0}'>${view.google ? view.icon.name : ""}</i>`
  } else if (type === "Textarea") {
    tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${view.data || view.value || view.input.value || ""}</textarea>`
  } else if (type === "Input") {
    if (view.textarea) {
      tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${value}</textarea>`
    } else {
      tag = `<input ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} ${view.multiple?"multiple":""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${style}' ${view.input.name ? `name="${view.input.name}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.type || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${value !== undefined ? `value="${value}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.input.defaultValue ? `defaultValue="${view.input.defaultValue}"` : ""} ${checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index || 0}'/>`
    }
  } else if (type === "Video") {

    tag = `<video ${atts} style='${style}' controls>
      ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>`: "")}
      ${view.alt || view.message || ""}
    </video>`
  }

  // label
  if (view.label && !view.labeled) tag = labelHandler({ _window, id, tag })

  return tag
}

module.exports = {toHTML}