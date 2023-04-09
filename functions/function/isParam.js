module.exports = {
  isParam: ({ _window, string }) => {
      
    if (typeof string !== "string") return false
    var global = _window ? _window.global : window.global
    if (string.slice(0, 7) === "coded()") string = global.codes[string]
// 
    if (string) if (string.includes("=") || string.includes(";") || string.includes("?") || string === "break()" || string === "return()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")
    || string.slice(0, 9) === "controls:" || string.slice(0, 9) === "children:" || string.slice(0, 6) === "child:" || string.slice(0, 9) === "siblings:" || string.slice(0, 8) === "sibling:" || string.slice(0, 12) === "prevSibling:") return true
    return false
  }
}