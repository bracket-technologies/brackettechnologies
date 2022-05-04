const { setData } = require("./data")
const { resize } = require("./resize")
const { isArabic } = require("./isArabic")
// const { generate } = require("./generate")

const defaultInputHandler = ({ id }) => {

  var local = window.children[id]
  var global = window.global

  if (!local) return
  if (local.type !== "Input") return

  // checkbox input
  if (local.input && local.input.type === "checkbox") {

    if (local.data === true) local.element.checked = true

    var myFn = (e) => {

      // local doesnot exist
      if (!window.children[id]) return e.target.removeEventListener("change", myFn)

      var data = e.target.checked
      local.data = data

      if (global[local.Data] && local.derivations[0] !== "") {

        // reset Data
        setData({ id, data })
      }
    }

    return local.element.addEventListener("change", myFn)
  }

  if (local.input && local.input.type === "number")
  local.element.addEventListener("mousewheel", (e) => e.target.blur())

  // readonly
  if (local.readonly) return

  local.element.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !e.shiftKey) e.preventDefault()
  })
  
  var myFn = async (e) => {
    
    e.preventDefault()
    var value = e.target.value

    // VAR[id] doesnot exist
    if (!window.children[id]) return e.target.removeEventListener("input", myFn)
    
    if (!local["preventDefault"]) {
      
      // for number inputs, strings are rejected
      if (local.input && local.input.type === "number") {

        value = parseFloat(value)

        if (isNaN(value) || local.data === "free") return local.input.value = value.slice(0, -1)
        if (local.input.min > value) value = local.input.min
        else if (local.input.max < value) value = local.input.max

        local.input.value = value
      }

      // for uploads
      if (local.input.type === "file") return global.upload = e.target.files
      
      if (local.Data && (local.input ? !local.input.preventDefault : true)) setData({ id, data: { value } })
    }

    // resize
    resize({ id })

    // arabic values
    isArabic({ id, value })
    
    console.log(value, global[local.Data], local.derivations)
  }

  local.element.addEventListener("input", myFn)
}

module.exports = { defaultInputHandler }