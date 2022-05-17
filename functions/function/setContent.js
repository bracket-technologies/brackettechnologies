const { isArabic } = require("./isArabic")

const setContent = ({ id, content = {} }) => {

  var view = window.views[id]
  var value = content.value !== undefined ? content.value : ""

  if (typeof value !== "string" && typeof value !== "number") return

  // not loaded yet
  if (!view.element) return

  if (view.input && view.input.type === "radio" && value) view.element.checked = "checked"
  else if (view.type === "Input" || view.type === "Textarea") view.element.value = value || ""
  else if (view.type === "UploadInput") view.element.value = value || null
  else if (view.type === "Text" || view.type === "Label" || view.type === "Header" ) view.element.innerHTML = value || ""

  isArabic({ id, value })
}

module.exports = {setContent}
