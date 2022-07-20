const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")

const defaultInputHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global

  if (!view) return
  if (view.type !== "Input" && view.type !== "Entry") return

  // checkbox input
  if (view.input && view.input.type === "checkbox") {

    if (view.data === true) view.element.checked = true

    var myFn = (e) => {

      // view doesnot exist
      if (!window.views[id]) return e.target.removeEventListener("change", myFn)

      var data = e.target.checked
      view.data = data

      if (global[view.Data] && view.derivations[0] !== "") {

        // reset Data
        setData({ id, data })
      }
    }

    return view.element.addEventListener("change", myFn)
  }

  if (view.input && view.input.type === "number")
  view.element.addEventListener("mousewheel", (e) => e.target.blur())

  // readonly
  if (view.readonly) return

  view.element.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !e.shiftKey) e.preventDefault()
  })
  view.contenteditable = true
  var myFn = async (e) => {
    
    e.preventDefault()
    var value 
    if (view.type === "Input") value = e.target.value
    else if (view.type === "Entry") value = e.target.innerHTML

    if (!view.contenteditable) {
      if (view.type === "Input") e.target.value = view.prevValue
      else if (view.type === "Entry") e.target.innerHTML = view.prevValue
      return 
    }

    // views[id] doesnot exist
    if (!window.views[id]) {
      if (e.target) e.target.removeEventListener("input", myFn)
      return 
    }

    if (!view.preventDefault && view.input ? !view.input.preventDefault : view.entry ? !view.entry.preventDefault : false) {
      
      // for number inputs, strings are rejected
      if (view.type === "Input" && view.input) {

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
        if (view.input.type === "file") return global.upload = [...e.target.files]

        // contentfull
        if (view.input.type === "text") {
          
          if (value.includes("&amp;")) {
            value = value.replace('&amp;','&')
            e.target.value = value
          }

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

          } else */if (e.data === ")" && value.slice(e.target.selectionStart - 3, e.target.selectionStart - 1) === "()") {
            var _prev = value.slice(0, e.target.selectionStart - 1)
            var _next = value.slice(e.target.selectionStart)
            e.target.value = value = _prev + _next
            e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

          } /*else if (e.data === "]" && value[e.target.selectionStart - 2] === "[" && value[e.target.selectionStart] === "]") {
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
        }
      }

      if (view.Data && (view.input ? !view.input.preventDefault : view.entry ? !view.entry.preventDefault : true)) setData({ id, data: { value } })
    }

    // resize
    resize({ id })

    // arabic values
    isArabic({ id, value })

    // prevValuew
    view.prevValue = value
    
    console.log(value, global[view.Data], view.derivations)
  }

  view.element.addEventListener("input", myFn)
}

module.exports = { defaultInputHandler }