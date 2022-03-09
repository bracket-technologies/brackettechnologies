const { isArabic } = require("./isArabic")

const setContent = ({ id, content = {} }) => {

  var local = window.value[id]
  var value = content.value || ""

  if (typeof value !== "string" && typeof value !== "number") return

  // not loaded yet
  if (!local.element) return

  if (local.input && local.input.type === "radio" && value) local.element.checked = "checked"
  else if (local.type === "Input" || local.type === "Textarea") local.element.value = value || ""
  else if (local.type === "UploadInput") local.element.value = value || null
  else if (local.type === "Text" || local.type === "Label" || local.type === "Header" ) local.element.innerHTML = value || ""

  isArabic({ id, value })
}

module.exports = {setContent}
