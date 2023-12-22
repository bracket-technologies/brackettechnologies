module.exports = {
  isParam: ({ _window, string }) => {
      
    if (typeof string !== "string") return false
    
    var global = _window ? _window.global : window.global
    if (string.charAt(0) === "@" && string.length === 6) string = global.__refs__[string].data

    // recheck after decoding
    if (typeof string !== "string") return false

    if (string.includes("=") || string.includes(";") || string.includes("?") || string === "return()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<")) return true
    return false
  }
}