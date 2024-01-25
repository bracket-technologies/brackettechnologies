const { decode } = require("./decode")
const { toArray } = require("./toArray")

const _colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const colorize = ({ _window, string, start = "[", end = "]", index = 0, colors = _colors }) => {

  colors = toArray(colors)
  
  if (index === 8) index = 1
  if (typeof string !== "string") return string

  string = string.replaceAll("<", "&#60;")
  string = string.replaceAll(">", "&#62;")

  // comment
  string = colorizeComment({ _window, index, string, colors })

  // arabic
  if (arabic.test(string)) {

    var i = 0, lastIndex = string.length - 1, start = false, newString = ""
    while (i <= lastIndex) {
      if ((arabic.test(string[i]) && !english.test(string[i])) || (start !== false && string[i] === " ")) {
        if (start === false) {
          start = i
          newString += `<span contenteditable class="arabic" style="color:inherit; background-color:#00000000; white-space:nowrap">`
        }
      } else if (start !== false) {
        start = false
        newString += `</span>`
      } else start = false
      newString += string[i]
      i++
    }
    string = newString
  }

  if (index !== 0) string = `<span contenteditable style="background-color:#00000000; color:${colors[index]}; white-space:nowrap">${string}</span>`

  return string
}

const colorizeComment = ({ _window, index, string, colors }) => {

  if (string.charAt(0) === "#" || string.includes("?#") || string.includes(";#") || string.includes("[#")) {

    var string0 = "", operator = ""
    if (string.split("?#")[1]) {

      string0 = string.split("?#")[0]
      operator = "?"

    } else if (string.split(";#")[1]) {

      string0 = string.split(";#")[0]
      operator = ";"

    } else if (string.split("[#")[1]) {

      string0 = string.split("[#")[0]
      operator = "["
    }

    var key = !operator ? string : string.split(string0 + operator).slice(1).join(string0 + operator)
    var comment = key.split("?")[0].split(";")[0]

    comment = (comment || "").replaceAll("[]", "__map__")
    if (comment.split("]")[1] !== undefined) comment = key.split("]")[0]
    comment = (comment || "").replaceAll("__map__", "[]")

    key = key.split(comment).slice(1).join(comment)
    key = colorize({ _window, string: key, index, colors })

    if (string0) string0 = colorizeCoded({ _window, index, string: string0, colors })

    string = string0 + operator + `<span contenteditable style="background-color:#00000000; color: green; white-space:nowrap">${decode({ _window, string: comment })}</span>` + key

  } else string = colorizeCoded({ _window, index, string, colors })

  return string
}

const colorizeCoded = ({ _window, index, string, colors }) => {

  var global = _window ? _window.global : window.global
  var slicer = string.split("@")
  if (slicer.length < 2) return string
  
  var text = ""

  var string0 = slicer[0]
  var string1 = colorize({ _window, index, string: slicer.slice(1).join("@").slice(5), colors })
  var reference = global.__refs__["@" + slicer[1].slice(0, 5)]

  if (typeof reference === "object") {

    var data = ""
    if (reference.type === "code") data = colorize({ _window, string: "[" + reference.data + "]", index: index + 1, colors })
    else data = `<span contenteditable style="background-color:#00000000; color:${colors[index + 1]}; white-space:nowrap">'${reference.data}'</span>`

    text += string0 + data + string1
  }

  return text || string
}

module.exports = { colorize }