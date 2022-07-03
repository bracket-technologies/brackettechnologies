module.exports = {
    counter: ({ length = 0, start = 0, end, reset = "daily", timestamp }) => {

        start = parseInt(start)
        var _date = new Date()

        if (reset === "daily") timestamp = (new Date(_date.setHours(0,0,0,0))).getTime()
        else if (reset === "weekly") timestamp = (new Date((new Date(_date.getDate() - _date.getDay() + (_date.getDay() === 0 ? -6 : 1))).setHours(0,0,0,0))).getTime()
        else if (reset === "monthly") timestamp = (new Date(new Date(_date.setMonth(_date.getMonth(), 1)).setHours(0,0,0,0))).getTime()

        var diff = _date.getTime() - timestamp
        if (reset === "daily") reset = 60*60*24*1000 - diff < 0
        else if (reset === "weekly") reset = 7*60*60*24*1000 - diff < 0
        else if (reset === "monthly") reset = ((new Date(_date.getFullYear(), _date.getMonth() + 1, 0)).getDate()*60*60*24*1000) - diff < 0

        if (reset) start = 0
        if (end && end === start) start = 0
        start = start + 1

        var _counter = start + ""
        if (length && (length - _counter.length < 0)) _counter = "1"

        var diff = length - _counter.length
        while (diff > 0) {
            _counter = "0" + _counter
            diff -= 1
        }
console.log(_counter);
        return _counter
    }
}