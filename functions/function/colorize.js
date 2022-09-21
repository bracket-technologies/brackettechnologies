const { generate } = require("./generate")
const { toCode } = require("./toCode")
const colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9204", "#585859", "#e649c6"]

const colorize = ({ _window, id, string, start = "[", end = "]", index = 0 }) => {
    
    var global = _window ? _window.global : window.global
    if (typeof string !== "string") return string
    while (string.includes("coded()")) {

      var string0 = string.split("coded()")[0]
      var key = global.codes["coded()" + string.split("coded()")[1].slice(0, 5)]
      key = colorize({ id, string: start + key + end, index: index + 1 })
      string = string0 + key + string.split("coded()")[1].slice(5) + (string.split("coded()").length > 2 ? "coded()" + string.split("coded()").slice(2).join("coded()") : "")
    }
    while (string.includes("codedS()")) {

      var string0 = string.split("codedS()")[0]
      var key = global.codes["codedS()" + string.split("codedS()")[1].slice(0, 5)]
      key = colorize({ id, string: `'` + key + `'`, index: index + 1 })
      string = string0 + key + string.split("codedS()")[1].slice(5) + (string.split("codedS()").length > 2 ? "codedS()" + string.split("codedS()").slice(2).join("codedS()") : "")
    }

    // equal
    // string = string.split("=").join(`<span style="color:#444">=</span>`)
    
    if (index !== 0) {
      /*
      var views = _window ? _window.view : window.views
      var _id = generate()
      views[_id] = { id: _id, parent: id, colorize: true, editable: true, type: "Span" }
      */
      return `<span contenteditable style="color:${colors[index]}">${string}</span>`
    } else {
      
      // semicolon
      //string = string.split(";").join(`<span contenteditable style="color:#000">;</span>`)

      // actions
      /*var _actions = string.split("()")
      string = _actions.map((str, index) => {
        var lastIndex = str.length - 1
        if (str[lastIndex] !== ":" && index !== _actions.length - 1) {
          var i = lastIndex--
          while (str[i] && str[i] !== ";" && str[i] !== "[" && str[i] !== "(" && str[i] !== "=" && str[i] !== "." && str[i] !== ":") {
            i--
          }
          str = str.slice(0, i + 1) + `<span contenteditable style="color:#e68a00">${str.slice(i + 1)}()</span>`
          return str
        } else return (index !== _actions.length - 1) ? str + "()" : str
      }).join("")*/

      return string
    }
}

module.exports = { colorize }
