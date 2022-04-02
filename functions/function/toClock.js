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

        return days + " : " + hrs + " : " + mins + " : " + secs
    }
}