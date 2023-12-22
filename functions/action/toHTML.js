const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { labelHandler } = require("./labelHandler")
const { replaceNbsps } = require("./replaceNbsps")
const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const toHTML = ({ _window, id, innerHTML }) => {

  var views = _window ? _window.views : window.views
  var view = views[id], name = view.__name__, tag = ""
  
  toParam({ _window, id, data: toCode({ _window, id, string: "parent().__childrenID__.replace():[.id]" }) })
  
  // text
  var text = (typeof view.text === "boolean" || typeof view.text === "number" || typeof view.text === "string") ? view.text
    : (typeof view.data === "boolean" || typeof view.data === "number" || typeof view.data === "string") ? view.data : ""

  if (text) text = replaceNbsps(text)

  // innerhtml
  innerHTML = innerHTML || (name !== "View" ? text : "")

  // required
  if (view.required && name === "Text") {
    if (typeof view.required === "string") view.required = {}
    name = "View"
    view.style.display = "block"
    innerHTML += `<span style='color:red; font-size:${(view.required.style && view.required.style.fontSize)||"1.6rem"}; padding:${(view.required.style && view.required.style.padding)||"0 0.4rem"}'>*</span>`
  }
  
  // styles
  var style = toStyle({ _window, id })

  // html attributes
  var atts = Object.entries(view.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

  // element
  view.element = { value: text, text, id }
  
  if (name === "View" || name === "Box") {
    tag = `<div ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ''} spellcheck='false' ${view.editable && !view.readonly ? 'contenteditable' : ''} class='${view.class}' id='${view.id}' style='${style}' index='${view.index || 0}'>${innerHTML || view.text || ''}</div>`
  } else if (name === "Image") {
    tag = `<img ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' alt='${view.alt || ''}' id='${view.id}' style='${style}' index='${view.index || 0}' ${view.src ? `src='${view.src}'` : ""}></img>`
  } else if (name === "Tag" && view.tag) {
    tag = `<${view.tag.toLowerCase()} ${atts} class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${view.content}</${view.tag.toLowerCase()}>`
  } else if (name === "Text") {
    if (view.h1) {
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
    } else {
      tag = `<p ${atts} ${view.editable ? "contenteditable ": ""}class='${view.class || ""}' id='${view.id}' style='${style}' index='${view.index || 0}'>${text}</p>`
    }
  } else if (name === "Icon") {
    tag = `<i ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined": (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || "" || ""} ${view.icon.name}' id='${view.id}' style='${style}${_window ? "; opacity:0; transition:.2s" : ""}' index='${view.index || 0}'>${view.google ? view.icon.name : ""}</i>`
  } else if (name === "Textarea") {
    tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${text || ""}</textarea>`
  } else if (name === "Input") {
    if (view.textarea) {
      tag = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${style}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""} index='${view.index || 0}'>${text}</textarea>`
    } else {
      tag = `<input ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} ${view.multiple?"multiple":""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${style}' ${view.input.type ? `type="${view.input.type}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.name || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${text !== undefined ? `value="${text}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.checked ? "checked" : ""} ${view.disabled ? "disabled" : ''} index='${view.index || 0}'/>`
    }
  } else if (name === "Video") {
    tag = `<video ${atts} style='${style}' controls>
      ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>`: "")}
      ${view.alt || view.message || ""}
    </video>`
  }

  // label
  if (view.label && !view.__labeled__) tag = labelHandler({ _window, id, tag })

  return tag
}

module.exports = {toHTML}