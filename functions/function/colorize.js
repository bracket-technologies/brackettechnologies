const { generate } = require("./generate")
const { toCode } = require("./toCode")
const colors = ["#a35521", "#1E90FF", "#B22222", "#FF4500", "#FF1493", "#7FFF00", "#31313D"]

const colorize = ({ _window, string, start = "[", end = "]", index = 0 }) => {
    
    var global = _window ? _window.global : window.global
    if (typeof string !== "string") return string
    while (string.includes("coded()")) {

        var string0 = string.split("coded()")[0]
        var key = global.codes["coded()" + string.split("coded()")[1].slice(0, 5)]
        key = colorize({ string: start + key + end, index: index + 1 })
        string = string0 + key + string.split("coded()")[1].slice(5) + (string.split("coded()").length > 2 ? "coded()" + string.split("coded()").slice(2).join("coded()") : "")
    }

    // equal
    // string = string.split("=").join(`<span style="color:#444">=</span>`)
  
    // semicolon
    string = string.split(";").join(`<span style="color:#000">;</span>`)

    return `<span style="color:${colors[index]}">${string}</span>`
}

module.exports = { colorize }
