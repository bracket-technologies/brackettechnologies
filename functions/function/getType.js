module.exports = {
    getType: (value) => {
        if (typeof value === "string") {
            
            if (value.length >= 10 && value.length <=13 && !isNaN(value) && value.slice(0, 2) !== "00") return "timestamp"
            return "string"
        }
        if (typeof value === "number") {
            
            if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").slice(0, 2) !== "00") return "timestamp"
            return "number"
        }
        if (typeof value === "object" && Array.isArray(value)) return "array"
        if (typeof value === "object") return "map"
        if (typeof value === "boolean") return "boolean"
        if (typeof value === "function") return "function"
    }
}