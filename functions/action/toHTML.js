const { toStyle } = require("./toStyle")
const { toArray } = require("./toArray")
const { labelHandler } = require("./labelHandler")
const { replaceNbsps } = require("./replaceNbsps")
const { toCode } = require("./toCode")
const { initView, getViewParams, removeView } = require("./view")
const { colorize } = require("./colorize")
const cssStyleKeyNames = require("./cssStyleKeyNames")
const { clone } = require("./clone")

const toHTML = ({ _window, id, stack, __ }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id], parent = views[view.__parent__]
  var name = view.__name__, html = ""

  // linkable
  //if (view.link && !view.__linked__) return link({ _window, id, stack, __ })

  // text
  var text = typeof view.text !== "object" && view.text !== undefined ? view.text : ((view.editable || view.__name__ === "Input" || view.__name__ === "Text") && typeof view.data !== "object" && view.data !== undefined) ? view.data : ""

  // replace encoded spaces
  if (text) text = replaceNbsps(text)
  
  // html
  var innerHTML = (view.__childrenRef__.map(({ id }) => views[id].__html__).join("") || text || "") + ""

  // required
  if (view.required && name === "Text") {

    if (typeof view.required === "string") view.required = {}
    name = "View"
    view.style.display = "block"
    innerHTML += `<span style='color:red; font-size:${(view.required.style && view.required.style.fontSize) || "1.6rem"}; padding:${(view.required.style && view.required.style.padding) || "0 0.4rem"}'>*</span>`
  }

  // html attributes
  var atts = Object.entries(view.attribute || {}).map(([key, value]) => `${key}='${value}'`).join(" ")

  // styles
  toStyle({ _window, id })

  // colorize
  if (view.colorize) {

    innerHTML = toCode({ _window, id, string: toCode({ _window, id, string: innerHTML, start: "'" }) })
    innerHTML = colorize({ _window, string: innerHTML, ...(typeof view.colorize === "object" ? view.colorize : {}) })
  }

  if (name === "View") {
    html = `<div ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ''} spellcheck='false' ${view.editable && !view.readonly ? 'contenteditable' : ''} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML || view.text || ''}</div>`
  } else if (name === "Image") {
    html = `<img ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' alt='${view.alt || ''}' id='${view.id}' style='${view.__htmlStyles__}' ${view.src ? `src='${view.src}'` : ""}></img>`
  } else if (name === "Text") {
    if (view.h1) {
      html = `<h1 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h1>`
    } else if (view.h2) {
      html = `<h2 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h2>`
    } else if (view.h3) {
      html = `<h3 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h3>`
    } else if (view.h4) {
      html = `<h4 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h4>`
    } else if (view.h5) {
      html = `<h5 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h5>`
    } else if (view.h6) {
      html = `<h6 ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${innerHTML}</h6>`
    } else {
      html = `<p ${atts} ${view.editable ? "contenteditable " : ""}class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}'>${text}</p>`
    }
  } else if (name === "Icon") {
    html = `<i ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.outlined ? "material-icons-outlined" : (view.symbol.outlined) ? "material-symbols-outlined" : (view.rounded || view.round) ? "material-icons-round" : (view.symbol.rounded || view.symbol.round) ? "material-symbols-round" : view.sharp ? "material-icons-sharp" : view.symbol.sharp ? "material-symbols-sharp" : (view.filled || view.fill) ? "material-icons" : (view.symbol.filled || view.symbol.fill) ? "material-symbols" : view.twoTone ? "material-icons-two-tone" : ""} ${view.class || "" || ""} ${view.icon.name}' id='${view.id}' style='${view.__htmlStyles__}${_window ? "; opacity:0; transition:.2s" : ""}'>${view.google ? view.icon.name : ""}</i>`
  } else if (name === "Textarea") {
    html = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""}>${text || ""}</textarea>`
  } else if (name === "Input") {
    if (view.textarea) {
      html = `<textarea ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' placeholder='${view.placeholder || ""}' ${view.readonly ? "readonly" : ""} ${view.maxlength || ""}>${text}</textarea>`
    } else {
      html = `<input ${atts} ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} ${view.multiple ? "multiple" : ""} ${view["data-date-inline-picker"] ? "data-date-inline-picker='true'" : ""} spellcheck='false' class='${view.class || ""}' id='${view.id}' style='${view.__htmlStyles__}' ${view.input.type ? `type="${view.input.type}"` : ""} ${view.input.accept ? `accept="${view.input.accept}"` : ""} type='${view.input.name || "text"}' ${view.placeholder ? `placeholder="${view.placeholder}"` : ""} ${text !== undefined ? `value="${text}"` : ""} ${view.readonly ? "readonly" : ""} ${view.input.min ? `min="${view.input.min}"` : ""} ${view.input.max ? `max="${view.input.max}"` : ""} ${view.checked ? "checked" : ""} ${view.disabled ? "disabled" : ''}/>`
    }
  } else if (name === "Video") {
    html = `<video ${atts} style='${view.__htmlStyles__}' controls>
      ${toArray(view.src).map(src => typeof src === "string" ? `<source src=${src}>` : typeof src === "object" ? `<source src=${src.src} type=${src.type}>` : "")}
      ${view.alt || view.message || ""}
    </video>`
  } else if (name === "Link" || name === "Meta") {

    name = name.toLowerCase()
    view = getViewParams({ view })
    
    html = `<${name} ${Object.entries(view).map(([key, value]) => key !== "head" && key !== "body" && typeof value === "string" ? `${key}="${value.toString().replace(/\\/g, '')}"` : "").filter(i => i).join(" ")}>`

    // push to tags
    if (view.head) global.__html__.head += html.replace(` head="true"`, "")
    else global.__html__.body += html.replace(` body="true"`, "")

  } else if (name === "Style") {

    name = name.toLowerCase()
    view = getViewParams({ view })

    html = `
      <style>
        ${Object.entries(view).map(([key, value]) => typeof value === "object" && !Array.isArray(value)
      ? `${key}{
          ${Object.entries(value).map(([key, value]) => `${cssStyleKeyNames[key] || key}: ${value.toString().replace(/\\/g, '')}`).join(`;
          `)};
        }` : "").filter(style => style).join(`
        `)}
      </style>`

    // push to tags
    if (view.head) global.__html__.head += html.replace(` head="true"`, "")
    else global.__html__.body += html.replace(` body="true"`, "")

  } else if (name === "A") {
    html = `<a ${view.draggable !== undefined ? `draggable='${view.draggable}'` : ""} id='${id}' href=${view.link} style='${view.__htmlStyles__}'>${innerHTML}</a>`
  } else return removeView({ _window, stack, id })

  // indexing
  var index = indexing({ views, id, view, parent })

  // init element
  view.__element__ = view.__element__ || { text, id, innerHTML, index }
  
  // label
  // if (view.label && !view.__labeled__) html = labelHandler({ _window, id, tag })

  view.__innerHTML__ = innerHTML
  view.__html__ = html
  
  // id list
  view.__idList__ = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])
}

const link = ({ _window, id, stack, __ }) => {

  var views = _window ? _window.views : window.views
  var global = _window ? _window.global : window.global

  var view = views[id]

  var link = typeof view.link === "string" && view.link.includes("http") ? view.link : (view.link.url || view.link.path || global.manifest.host)
  var linkView = typeof view.link === "string" ? { link } : { ...view.link, link, __name__: "A" }

  // link
  var { view: linkView, id: linkID } = initView({ views, global, parent: view.__parent__, ...linkView, __, __controls__: [{ event: `click?route():'${view.link.path}'?${view.link.path || "false"};${view.link.preventDafault ? "false" : "true"}` }] })
  toHTML({ _window, id: linkID, stack, __ })
  
  // view
  view.__parent__ = linkID
  view.__linked__ = true
  toHTML({ _window, id, stack, __ })
}

const indexing = ({ id, views, view, parent }) => {

  if (view.__indexed__) return view.__index__
  
  var index = 0
  
  // find index
  if (!view.__index__) while (parent.__childrenRef__[index] && ((parent.__childrenRef__[index].childIndex < view.__childIndex__) || (!view.__inserted__ && parent.__childrenRef__[index].childIndex === view.__childIndex__ && parent.__childrenRef__[index].initialIndex < view.__initialIndex__))) { index++ }
  else index = view.__index__
  
  // set index
  view.__index__ = index
  
  // increment next children index
  parent.__childrenRef__.slice(index).map(viewRef => {
    viewRef.index++
    views[viewRef.id].__index__ = viewRef.index
    views[viewRef.id].__rendered__ && views[viewRef.id].__element__.setAttribute("index", viewRef.index)
  })
  
  // push id to parent children ids
  parent.__childrenRef__.splice(index, 0, { id, index, childIndex: view.__childIndex__, initialIndex: view.__initialIndex__ })

  view.__indexed__ = true

  return index
}

module.exports = { toHTML }