const isEvent = ({ string }) => {
    if (string.split("?").length > 1) {

        var path = string.split("?")
        var event = path[0].split(";")[0].split(":")[0]
        if (require("./events.json").includes(event)) return true
        else return false

    } else return false
}

module.exports = { isEvent }