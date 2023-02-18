const focus = ({ id }) => {

  var view = window.views[id]
  if (!view) return

  var isInput = view.type === "Input" || view.type === "Textarea"
  if (isInput) view.element.focus()
  else {
    if (view.element) {
      let childElements = view.element.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = view.element.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].focus()

        var _view = window.views[childElements[0].id]
        // focus to the end of input
        var value = _view.element.value
        _view.element.value = ""
        _view.element.value = value

        return
      } else view.element.focus()
    }
  }

  // focus to the end of input
  var value = view.element.value
  view.element.value = ""
  view.element.value = value
}

module.exports = {focus}
