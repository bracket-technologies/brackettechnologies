const play = ({ id }) => {

  var local = window.value[id]
  var myFn = () => {
    local.element.style.transform = "translateY(-200%)"
  }

  local["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = {play}
