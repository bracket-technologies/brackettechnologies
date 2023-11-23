const { capitalize } = require("./capitalize")

const formats = [
    "_quest", "_question", "_semi", "_equal", "_excl", "_comma",
    "bold().", "italic().", "highlight().", "thin().", "linethrough().", "strike().", "underline().", 
    "lowercase().", "uppercase().", "capitalize().", "subscript().", "superscript().", "link().", "red()."
]

const textFormating = ({ _window, text, id }) => {

    var view = _window ? _window.views[id] : window.views[id]
    var global = _window ? _window.global : window.global
    var style = view.style || {}
    var _text = text, newText = _text
    var color = style.color
    color = color ? `color:${color}` : ""
    
    formats.map(format => {

        _text.toString().split(format).map((__text, i) => {

        if (i === 0) return
        if (i > 0) newText = newText.split(format).slice(0, i)

        // marks
        if (format === "_comma") return newText += ","
        if (format === "_quest") return newText += "?"
        if (format === "_semi") return newText += ";"
        if (format === "_equal") return newText += "="
        if (format === "_excl") return newText += "!"

        if (format === "bold().") newText += `<strong style="${color}">`
        if (format === "thin().") newText += `<small style="${color}">`
        if (format === "italic().") newText += `<em style="${color}">`
        if (format === "highlight().") newText += `<mark style="${color}">`
        if (format === "strike()." || format === "linethrough().") newText += `<del style="${color}">`
        if (format === "underline().") newText += `<ins style="${color}">`
        if (format === "subscript().") newText += `<sub style="${color}">`
        if (format === "superscript().") newText += `<sup style="${color}">`
        if (format === "red().") newText += `<span style="color:red">`
        if (format === "blue().") newText += `<span style="color:blue">`

        var code = global.__codes__[__text.slice(0, 12)]
        if (format === "lowercase().") newText += code.toLowerCase()
        else if (format === "uppercase().") newText += code.toLowerCase()
        else if (format === "capitalize().") newText += capitalize(code)
        else if (code) newText += textFormating({ _window, text: code, id })

        if (format === "bold().") newText += "</strong>"
        if (format === "thin().") newText += "</small>"
        if (format === "italic().") newText += "</em>"
        if (format === "highlight().") newText += "</mark>"
        if (format === "strike()." || format === "linethrough().") newText += "</del>"
        if (format === "underline().") newText += "</ins>"
        if (format === "subscript().") newText += "</sub>"
        if (format === "superscript().") newText += "</sup>"
        if (format === "red()." || format === "blue().") newText += "</span>"

        newText += __text.slice(12)
        })
    })

    return newText
}

module.exports = { textFormating }