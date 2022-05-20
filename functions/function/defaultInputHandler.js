const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")

const defaultInputHandler = ({ id }) => {

  var view = window.views[id]
  var global = window.global

  if (!view) return
  if (view.type !== "Input") return

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
  
  var myFn = async (e) => {
    
    e.preventDefault()
    var value = e.target.value

    // VAR[id] doesnot exist
    if (!window.views[id]) {
      if (e.target) e.target.removeEventListener("input", myFn)
      return 
    }
    
    // map
    if (view.preventDefault || view.input.preventDefault) {
      
      if (e.data === "h" && e.target.selectionStart === 2 && value.charAt(0) === "c") view.element.value = value = "children"
      else if (e.data === "o" && e.target.selectionStart === 2 && value.charAt(0) === "c") view.element.value = value = "controls"
      else if (e.data === "y" && e.target.selectionStart === 2 && value.charAt(0) === "t") view.element.value = value = "type"
      else if (e.data === "v" && e.target.selectionStart === 2 && value.charAt(0) === "e") view.element.value = value = "event"
      else if (e.data === "a" && e.target.selectionStart === 2 && value.charAt(0) === "w") view.element.value = value = "watch"
    }

    if (!view.preventDefault && !view.input.preventDefault) {
      
      // for number inputs, strings are rejected
      if (view.input && view.input.type === "number") {

        if (isNaN(value)) value = value.toString().slice(0, -1)
        if (!value) value = 0
        if (value.toString().charAt(0) === "0" && value.toString().length > 1) value = value.toString().slice(1)
        if (view.input.min && view.input.min > parseFloat(value)) value = view.input.min
        if (view.input.max && view.input.max < parseFloat(value)) value = view.input.max
        
        value = parseFloat(value)
        view.element.value = value.toString()
      }

      // for uploads
      if (view.input.type === "file") return global.upload = e.target.files

      // contentfull
      if (view.input.type === "text") {
        
        if (e.data === "[") {
          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "[]" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length + 1)

        } else if (e.data === "(" && value[e.target.selectionStart - 2] !== ")") {
          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "()" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

        } else if (e.data === ")" && value.slice(e.target.selectionStart - 3, e.target.selectionStart - 1) === "()") {
          var _prev = value.slice(0, e.target.selectionStart - 1)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

        } else if (e.data === "]" && value[e.target.selectionStart - 2] === "[" && value[e.target.selectionStart] === "]") {
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

        } else if (value.slice(e.target.selectionStart - 4, e.target.selectionStart) === "font") {
          var _prev = value.slice(0, e.target.selectionStart - 4)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "fontSize" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)

        } else if (value.slice(e.target.selectionStart - 4, e.target.selectionStart) === "back") {
          var _prev = value.slice(0, e.target.selectionStart - 4)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "backgroundColor" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        
        } else if (value.slice(e.target.selectionStart - 7, e.target.selectionStart) === "borderR") {
          var _prev = value.slice(0, e.target.selectionStart - 7)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "borderRadius" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        
        } else if (value.slice(e.target.selectionStart - 5, e.target.selectionStart) === "gridT") {
          var _prev = value.slice(0, e.target.selectionStart - 5)
          var _next = value.slice(e.target.selectionStart)
          e.target.value = value = _prev + "gridTemplateColumns" + _next
          e.target.selectionStart = e.target.selectionEnd = e.target.selectionEnd - (_next.length)
        }
      }

      if (view.Data && (view.input ? !view.input.preventDefault : true)) setData({ id, data: { value } })
    }

    // resize
    resize({ id })

    // arabic values
    isArabic({ id, value })
    
    console.log(value, global[view.Data], view.derivations)
  }

  view.element.addEventListener("input", myFn)
}

module.exports = { defaultInputHandler }