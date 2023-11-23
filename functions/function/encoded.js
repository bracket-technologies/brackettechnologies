const encoded = (string) => {
    if (typeof string !== "string") return false
    return (string.slice(0, 6) === "coded@" && string.length === 11) || (string.slice(0, 7) === "codedT@" && string.length === 12)
}

module.exports = { encoded }