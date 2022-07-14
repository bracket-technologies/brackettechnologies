module.exports = {
    isParam: ({ _window, string }) => {
        
        if (typeof string !== "string") return false
        var global = _window ? _window.global : window.global
        if (string.slice(0, 7) === "coded()") string = global.codes[string]
// 
        if (string) if (string.includes("=") || string.includes(";") || string.includes("?") || string === "break()" || string.slice(0, 1) === "!" || string.includes(">") || string.includes("<") 
        //|| string.slice(0, 11) === "mouseenter:" || string.slice(0, 11) === "mouseenter." || string.slice(0, 11) === "mouseleave." || string.slice(0, 11) === "mouseleave:"
        //|| string.slice(0, 6) === "keyup:" || string.slice(0, 6) === "keyup." || string.slice(0, 8) === "keydown:" || string.slice(0, 8) === "keydown."
        //|| string.slice(0, 10) === "mousedown:" || string.slice(0, 10) === "mousedown." || string.slice(0, 8) === "mouseup:" || string.slice(0, 8) === "mouseup."
        ) return true
        return false
    }
}