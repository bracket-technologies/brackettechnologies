const timerLogger = ({ _window: { global }, key, start, end }) => {
    if (!key) return
    if (start) global.__server__[`${key}StartTime`] = (new Date()).getTime()
    else if (end) {
    
        global.__server__[`${key}EndTime`] = (new Date()).getTime()
        global.__server__[`${key}Duration`] = global.__server__[`${key}EndTime`] - global.__server__[`${key}StartTime`]
        console.log(key.toUpperCase(), global.__server__[`${key}Duration`])
    }
}
module.exports = { timerLogger }