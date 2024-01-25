const { isArabic } = require("./isArabic")

const setContent = ({ id, content = {} }) => {

  var view = window.views[id]
  var value = content.value !== undefined ? content.value : ""

  if (typeof value !== "string" && typeof value !== "number") return

  // not loaded yet
  if (!view.__element__) return

  if (view.input && view.input.type === "radio" && value) view.__element__.checked = "checked"
  else if (view.__name__ === "Input") view.__element__.value = value || ""
  else if (view.__name__ === "Text") view.__element__.innerHTML = value || ""

  isArabic({ id, value })
}

module.exports = {setContent}
