const colors = ["#a35521", "#1E90FF", "#FF4500", "#02ad18", "#5260FF", "#bf9202", "#6b6b6e", "#e649c6"]
const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

const colorize = ({ _window, id, string, start = "[", end = "]", index = 0 }) => {
  
    if (index === 8) index = 1
    var global = _window ? _window.global : window.global
    if (typeof string !== "string") return string

    string = string.replaceAll("<", "&#60;")
    string = string.replaceAll(">", "&#62;")
    //string = string.replaceAll("'", "&apos;")

    while (string.includes("codedS()")) {

      var string0 = string.split("codedS()")[0]
      var key = global.codes["codedS()" + string.split("codedS()")[1].slice(0, 5)]
      /*while (key.includes("coded()")) {
        key = string.split("coded()")[0] + string.split("coded()").slice(1).map(code => colorize({ id, string: "[" + global.codes["coded()" + code.slice(0, 5)] + "]", index: index + 2 }) + code.slice(5)).join("")
      }*/

      key = `<span contenteditable style="background-color:#00000000; color:${colors[index + 1]}; white-space:nowrap">&apos;${key}&apos;</span>`
      // key = colorize({ id, string: "&apos;" + key + "&apos;", index: index + 1 })
      string = string0 + key + string.split("codedS()")[1].slice(5) + (string.split("codedS()").length > 2 ? "codedS()" + string.split("codedS()").slice(2).join("codedS()") : "")
    }

    while (string.includes("coded()")) {

      var string0 = string.split("coded()")[0]
      var key = global.codes["coded()" + string.split("coded()")[1].slice(0, 5)]
      key = colorize({ id, string: start + key + end, index: index + 1 })
      string = string0 + key + string.split("coded()")[1].slice(5) + (string.split("coded()").length > 2 ? "coded()" + string.split("coded()").slice(2).join("coded()") : "")
    }

    // #comments
    /*while (string.includes("?#") || string.includes(";#")) {

      var string0 = ""
      if (string.split("?#")[1]) string0 = string.split("?#")[0]
      else if (string.split(";#")[1]) string0 = string.split(";#")[0]
      key = string.split(string0)[1].split
    }*/

    // equal
    // string = string.split("=").join(`<span style="color:#444">=</span>`)

    // change font for arabic chars
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
    
    if (index !== 0) {
      
      return `<span contenteditable style="background-color:#00000000; color:${colors[index]}; white-space:nowrap">${string}</span>`

    } else {

      // actions
      string = string.split(";").map(string => {
        var _actions = string.split("()")
        string = _actions.map((str, index) => {
          var lastIndex = str.length - 1
          if (str[0] && str[lastIndex] !== ";" && str[lastIndex] !== "+" && str[lastIndex] !== "-" && str[lastIndex] !== "_" && str[lastIndex] !== " " && str[lastIndex] !== "?" && str[lastIndex] !== "!" && str[lastIndex] !== "[" && str[lastIndex] !== "(" && str[lastIndex] !== "=" && str[lastIndex] !== "." && str[lastIndex] !== ":" && index !== _actions.length - 1) {

            var i = lastIndex - 1
            while (str[i] && str[i] !== ";" && str[lastIndex] !== "+" && str[lastIndex] !== "-" && str[i] !== "_" && str[i] !== " " && str[i] !== "?" && str[i] !== "!" && str[i] !== "[" && str[i] !== "(" && str[i] !== "=" && str[i] !== "." && str[i] !== ":") { 
              i--
            }
            return str.slice(0, i+1) + `<span contenteditable class="colorizeActions" >${str.slice(i+1)}()</span>`

          } else return (index !== _actions.length - 1) ? str + "()" : str
        }).join("")
        return string
      }).join(";")

      return string
    }
}

module.exports = { colorize }