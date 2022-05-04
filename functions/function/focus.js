const focus = ({ id }) => {

  var local = window.children[id]
  if (!local) return

  var isInput = local.type === "Input" || local.type === "Textarea"
  if (isInput) local.element.focus()
  else {
    if (local.element) {
      let childElements = local.element.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = local.element.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].focus()

        var _local = window.children[childElements[0].id]
        // focus to the end of input
        var value = _local.element.value
        _local.element.value = ""
        _local.element.value = value

        return
      }
    }
  }

  // focus to the end of input
  var value = local.element.value
  local.element.value = ""
  local.element.value = value
}

module.exports = {focus}
