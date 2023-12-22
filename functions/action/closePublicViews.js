const { toParam } = require("./toParam")
const { toCode } = require("./toCode")

const closePublicViews = ({ id }) => {

    var views = window.views
    var global = window.global
    
    // close droplist
    if (id !== "droplist" && global.__droplistPositioner__ && !global.clicked.element.contains(views[global.__droplistPositioner__].element)) {
        var closeDroplist = toCode({ id, string: "__keyupIndex__:()=0;clearTimer():[__droplistTimer__:()];__droplistMouseenterer__:().del();():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style().[_]=():droplist.style.[_]];clearTimer():[__droplistTimer__:()];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform='scale(0.5)';pointerEvents=none]];__droplistPositioner__:().del()" })
        toParam({ data: closeDroplist, id: "droplist", __: [] })
    }

    // close tooltip
    var closeTooltip = toCode({ id, string: "clearTimer():[tooltip-timer:()];tooltip-timer:().del();():tooltip.style().opacity=0" })
    toParam({ data: closeTooltip, id: "tooltip", __: [] })

    // close mininote
    toParam({ id: "root", data: toCode({ id, string: "():mininote.style():[opacity=0;transform=scale(0)]" }) })
}

module.exports = { closePublicViews }