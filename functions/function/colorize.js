const { decode } = require("./decode")

const _colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const colorize = ({ _window, id, string, start = "[", end = "]", index = 0, ...params }) => {

  var { colors = _colors } = params
  if (typeof colors === 'string') colors = [colors]

  if (index === 8) index = 1
  if (typeof string !== "string") return string

  string = string.replaceAll("<", "&#60;")
  string = string.replaceAll(">", "&#62;")

  // comment
  string = colorizeComment({ _window, id, start, end, index, params, string, colors })

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

const colorizeComment = ({ _window, id, start, end, index, params, string, colors }) => {

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
    var comment = key.split(";")[0]
    if (comment.split("]")[1] !== undefined) comment = key.split("]")[0]
    key = key.split(comment).slice(1).join(comment)
    key = colorize({ _window, id, start, end, string: key, index, colors, params })

    if (string0) {
      string0 = colorizeText({ _window, id, start, end, index, params, string: string0, colors })
      string0 = colorizeMap({ _window, id, start, end, index, params, string: string0, colors })
    }
    
    string = string0 + operator + `<span contenteditable style="background-color:#00000000; color: green; white-space:nowrap">${decode({ _window, string: comment })}</span>` + key
  
  } else {
    
    string = colorizeText({ _window, id, start, end, index, params, string: string, colors })
    string = colorizeMap({ _window, id, start, end, index, params, string: string, colors })
  }
  
  return string
}

const colorizeText = ({ _window, id, start, end, index, params, string, colors }) => {
  var global = _window ? _window.global : window.global

  // text
  while (string.includes("codedT@")) {

    var string0 = string.split("codedT@")[0]
    var key = global.__codes__["codedT@" + string.split("codedT@")[1].slice(0, 5)]

    key = `<span contenteditable style="background-color:#00000000; color:${colors[index + 1]}; white-space:nowrap">'${key}'</span>`
    string = string0 + key + string.split("codedT@")[1].slice(5) + (string.split("codedT@").length > 2 ? "codedT@" + string.split("codedT@").slice(2).join("codedT@") : "")
  }

  return string
}

const colorizeMap = ({ _window, id, start, end, index, params, string, colors }) => {
  var global = _window ? _window.global : window.global

  // map
  while (string.includes("coded@")) {

    var string0 = string.split("coded@")[0]
    var key = global.__codes__["coded@" + string.split("coded@")[1].slice(0, 5)]
    key = colorize({ _window, id, string: start + key + end, index: index + 1, ...params })
    string = string0 + key + string.split("coded@")[1].slice(5) + (string.split("coded@").length > 2 ? "coded@" + string.split("coded@").slice(2).join("coded@") : "")
  }

  return string
}

module.exports = { colorize }