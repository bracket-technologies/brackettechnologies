module.exports = {
    toClock: ({ timestamp }) => {

        if (!timestamp) return "00:00"
        var days = Math.floor(timestamp / 86400000) + ""
        var _days = timestamp % 86400000
        var hrs = Math.floor(_days / 3600000) + ""
        var _hrs = _days % 3600000
        var mins = Math.floor(_hrs / 60000) + ""
        var _mins = _hrs % 60000
        var secs = Math.floor(_mins / 1000) + ""

        if (days.length === 1) days = "0" + days
        if (hrs.length === 1) hrs = "0" + hrs
        if (mins.length === 1) mins = "0" + mins
        if (secs.length === 1) secs = "0" + secs

        var clock = ""
        if (days !== "00") clock += days + " : "
        if (days === "00" && hrs === "00") {}
        else clock += hrs + " : "
        if (days === "00" && hrs === "00" && mins === "00") {}
        else clock += mins + " : "
        clock += secs

        return clock
    }
}