module.exports = {
    isParam: ({ _window, string }) => {
        
        if (typeof string !== "string") return false
        var global = _window ? _window.global : window.global
        if (string.slice(0, 7) === "coded()") string = global.codes[string]

        if (string.includes("=") || string.includes(";") || string.includes("?")) return true
        else return false
    }
}