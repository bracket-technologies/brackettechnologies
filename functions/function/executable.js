const {isParam} = require("./isParam")

module.exports = {
    executable: ({ _window, string }) => {
        return typeof string === "string" && (isParam({ _window, string }) || string.includes("()"))
    }
}