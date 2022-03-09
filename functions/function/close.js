const close = ({ id }) => {

  var local = window.value[id]
  clearTimeout(local["note-timer"])
  local.element.style.transform = "translateY(-200%)"

}

module.exports = {close}
