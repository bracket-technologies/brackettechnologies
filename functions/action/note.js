const { isArabic } = require("./isArabic")

const note = ({ note: _note }) => {

  var views = window.views
  var note = views["action-note"]
  var type = (_note.type || (_note.danger && "danger") || (_note.info && "info") || (_note.warning && "warning") || "success").toLowerCase()
  var noteText = views["action-note-text"]
  var backgroundColor = type === "success" 
  ? "#2FB886" : type === "danger" 
  ? "#F66358" : type === "info"
  ? "#47A8F5" : type === "warning"
  && "#FFA92B"
  
  if (!_note) return

  clearTimeout(note["note-timer"])

  noteText.__element__.innerHTML = _note.text
  isArabic({ id: "action-note-text" })

  var width = note.__element__.offsetWidth
  note.__element__.style.backgroundColor = backgroundColor
  note.__element__.style.left = `calc(50% - ${width/2}px)`
  note.__element__.style.opacity = "1"
  note.__element__.style.transition = "transform .2s"
  note.__element__.style.transform = "translateY(0)"

  const myFn = () => note.__element__.style.transform = "translateY(-200%)"

  note["note-timer"] = setTimeout(myFn, 5000)
}

module.exports = { note }
