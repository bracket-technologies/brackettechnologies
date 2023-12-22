const getType = (value) => {
  const { emptySpaces } = require("./toValue")

  if (typeof value === "boolean" || value === "true" || value === "false") return "boolean"
  if (typeof value === "object" && Array.isArray(value)) return "array"
  if (typeof value === "object") return "map"
  if (typeof value === "function") return "function"
  if (typeof value === "number" || (typeof value === "string" && !isNaN(value) && !emptySpaces(value))) {

    /*if (value.length >= 10 && value.length <= 13 && !isNaN(value) && value.slice(0, 2) !== "0") return "timestamp"
    if (value.length === 8 && value.slice(0, 2) !== "00" && !isNaN(value)) return "time"*/

    if ((value + "").length >= 10 && (value + "").length <= 13 && (value + "").charAt(0) !== "0") return "timestamp"
    //if ((value + "").length === 8 && (value + "").charAt(0) !== "0") return "time"
    if (typeof value === "number") return "number"
    return "string"
  }
  if (typeof value === "string") return "string"
}
module.exports = { getType }