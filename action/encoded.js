const encoded = (string) => {
    if (typeof string !== "string") return false
    return (string.charAt(0) === "@" && string.length === 6)
}

module.exports = { encoded }