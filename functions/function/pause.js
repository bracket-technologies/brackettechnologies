const pause = ({ id }) => {

  var local = window.value[id]
  clearTimeout(local["note-timer"])
}

module.exports = {pause}
