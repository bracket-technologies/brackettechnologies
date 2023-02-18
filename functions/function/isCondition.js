module.exports = {
    isCondition: ({ _window, string }) => {
        
        if (typeof string !== "string") return false
        var global = _window ? _window.global : window.global
        if (string.slice(0, 7) === "coded()") string = global.codes[string]
// 
        if (string) if (string.slice(0, 1) === "!" || string.includes(">") || string.includes("<") || string.includes("in()") || string.includes("inc()") || string.includes("includes()")) return true
        return false
    }
}