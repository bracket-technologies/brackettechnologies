const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")
const { colorize } = require("./colorize")
const { toCode } = require("./toCode")
const { replaceNbsps } = require("./replaceNbsps")

const defaultInputHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global

  if (!view) return
  if (view.__name__ !== "Input" && !view.editable) return

  if (view.preventDefault) return

  // resize input height on loaded
  if (view.__name__ === "Input" && (view.input || view).type === "text") resize({ id })

  // checkbox input
  if ((view.input || view).type === "checkbox") {

    if (view.data === true) view.element.checked = true

    var changeEventHandler = (e) => {

      // view doesnot exist
      if (!window.views[id]) return e.target.removeEventListener("change", myFn)

      var data = e.target.checked
      view.data = data

      if (global[view.doc] && view.derivations[0] !== "") {

        // reset Data
        setData({ id, data })
      }
    }

    return view.element.addEventListener("change", changeEventHandler)
  }

  if ((view.input || view).type === "number")
  view.element.addEventListener("mousewheel", (e) => e.target.blur())

  // readonly
  if (view.readonly) return

  view.element.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !e.shiftKey) e.preventDefault()
  })

  if (view.__name__ === "Input") view.prevValue = view.element.value
  else if (view.editable) view.prevValue = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent
  
  var inputEventHandler = async (e) => {
    
    e.preventDefault()
    var value 
    if (view.__name__ === "Input") value = e.target.value
    else if (view.editable) value = (e.target.textContent===undefined) ? e.target.innerText : e.target.textContent

    // views[id] doesnot exist
    if (!window.views[id]) {
      if (e.target) e.target.removeEventListener("input", myFn)
      return 
    }

    // contentfull
    if ((view.input || view).type === "text") {

      value = replaceNbsps(value.replace('&amp;','&'))
      e.target.value = value
    }
      
    if (view.__name__ === "Input") {

      if (view.input.type === "number") {

        if (e.data !== ".") {

          if (isNaN(value)) value = value.toString().slice(0, -1)
          if (!value) value = 0
          if (value.toString().charAt(0) === "0" && value.toString().length > 1) value = value.toString().slice(1)
          if (view.input.min && view.input.min > parseFloat(value)) value = view.input.min
          if (view.input.max && view.input.max < parseFloat(value)) value = view.input.max
          value = parseFloat(value)
          view.element.value = value.toString()

        } else value = parseFloat(value + ".0")
      }

      // for uploads
      if (view.input.type === "file") {
        global.file = e.target.files[0]
        return global.files = [...e.target.files]
      }
    }

    if (view.doc) setData({ id, data: { value }, __: view.__ })

    // resize
    resize({ id })

    // arabic values
    // isArabic({ id, value })
    
    console.log(value, global[view.doc], view.derivations)

    view.prevValue = value
  }

  var blurEventHandler = (e) => {

    var value
    if (view.__name__ === "Input") value = view.element.value
    else if (view.editable) value = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent
    
    // colorize
    if (view.colorize) {
      
      // removeChildren({ id })
      var _value = toCode({ id, string: toCode({ id, string: value, start: "'" }) })
      if (view.__name__ === "Input") e.target.value = colorize({ string: _value, ...(typeof view.colorize === "object" ? view.colorize : {}) })
      else e.target.innerHTML = colorize({ string: _value, ...(typeof view.colorize === "object" ? view.colorize : {}) })
      
      /*
      var sel = window.getSelection()
      var selected_node = sel.anchorNode
      
      var prevValue = view.prevValue.split("")
      var position = value.split("").findIndex((char, i) => char !== prevValue[i])

      sel.collapse(selected_node, position + 1)
      */
    }

    // 
    if (value !== view.prevContent && global.__ISBRACKET__) {
      global.redo = []
      global.undo.push({
        collection: global["open-collection"],
        doc: global["open-doc"],
        path: view.derivations,
        value: view.prevContent,
        id: view.element.parentNode.parentNode.parentNode.parentNode.id
      })
    }
  }

  var focusEventHandler = (e) => {
    
    var value = ""
    if (view.__name__ === "Input") value = view.element.value
    else if (view.editable) value = (view.element.textContent===undefined) ? view.element.innerText : view.element.textContent

    view.prevContent = value
  }

  view.element.addEventListener("input", inputEventHandler)
  view.element.addEventListener("blur", blurEventHandler)
  view.element.addEventListener("focus", focusEventHandler)
}

const getCaretIndex = (element) => {

  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      console.log(preCaretRange);
      preCaretRange.selectNodeContents(element);
      console.log(preCaretRange);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      console.log(preCaretRange);
      position = preCaretRange.toString().length;
    }
  }
  return position + 1;
}

module.exports = { defaultInputHandler }


/*if (e.data === "[") {
  var _prev = value.slice(0, e.target.selectionStart - 1)
  var _next = value.slice(e.target.selectionStart)
  e.target.value = value = _prev + "[]" + _next
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length + 1)

} else if (e.data === "(" && value[e.target.selectionStart - 2] !== ")") {
  var _prev = value.slice(0, e.target.selectionStart - 1)
  var _next = value.slice(e.target.selectionStart)
  e.target.value = value = _prev + "()" + _next
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

} else */ /*else if (e.data === "]" && value[e.target.selectionStart - 2] === "[" && value[e.target.selectionStart] === "]") {
  var _prev = value.slice(0, e.target.selectionStart)
  var _next = value.slice(e.target.selectionStart + 1)
  e.target.value = value = _prev + _next
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length + 1)

} else if (e.data === "T" && e.target.selectionStart === 1 && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Text?class=flexbox;text=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "c" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Icon?class=flexbox;name=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "n" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Input?style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 1

} else if (e.data === "m" && e.target.selectionStart === 2 && value.charAt(0) === "I" && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "Image?class=flexbox;src=;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 9

} else if (e.data === "V" && e.target.selectionStart === 1 && view.derivations[view.derivations.length - 1] === "type") {
  e.target.value = value = "View?class=vertical;style:[]"
  e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - 1

}*/