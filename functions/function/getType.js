module.exports = {
    getType: (value) => {
        if (typeof value === "string" && value !== "true" && value !== "false") {
            
            if (value.length >= 10 && value.length <=13 && !isNaN(value) && value.slice(0, 2) !== "00") return "timestamp"
            return "string"
        }
        if (typeof value === "number") {
            
            if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").slice(0, 2) !== "00") return "timestamp"
            return "number"
        }
        if (typeof value === "object" && Array.isArray(value)) return "array"
        if (typeof value === "object") return "map"
        if (typeof value === "boolean" || value === "true" || value === "false") return "boolean"
        if (typeof value === "function") return "function"
    }
}