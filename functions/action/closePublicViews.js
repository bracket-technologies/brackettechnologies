const { toLine } = require("./toLine")

const closePublicViews = ({ _window, id, __, lookupActions }) => {

    if (_window) return
    
    // close droplist
    if (id !== "droplist")
    toLine({ id: "droplist", data: { string: "__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()" }, __, lookupActions })

    // close tooltip
    toLine({ id: "tooltip", data: { string: "clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0" }, __, lookupActions })

    // close mininote
    toLine({ id: "mininote", data: { string: "():mininote.style():[opacity=0;transform=scale(0)]" }, __, lookupActions })
}

module.exports = { closePublicViews }