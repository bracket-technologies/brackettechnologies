module.exports = {
    isCondition: ({ _window, string }) => {
        
        if (typeof string !== "string") return false
        var global = _window ? _window.global : window.global
        if (string.slice(0, 6) === "coded@") string = global.__codes__[string]
// 
        if (string) if (string.slice(0, 1) === "!" || string.includes(">") || string.includes("<") || string.includes("in()") || string.includes("inc()") || string.includes("includes()")) return true
        return false
    }
}