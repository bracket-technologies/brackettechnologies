const blur = ({ id }) => {

  var local = window.views[id]
  if (!local) return

  var isInput = local.__name__ === "Input" || local.__name__ === "Textarea"
  if (isInput) local.__element__.blur()
  else {
    if (local.__element__) {
      let childElements = local.__element__.getElementsByTagName("INPUT")
      if (childElements.length === 0) {
        childElements = local.__element__.getElementsByTagName("TEXTAREA")
      }
      if (childElements.length > 0) {
        childElements[0].blur()
      }
    }
  }
}

module.exports = {blur}
