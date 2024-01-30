const { lineInterpreter } = require("./lineInterpreter")

const closePublicViews = ({ _window, id, __, lookupActions }) => {

    if (_window) return
    
    // close droplist
    if (id !== "droplist")
    lineInterpreter({ id: "droplist", data: { string: "__keyupIndex__:()=0;clearTimer():[__droplistTimer__:()];__droplistMouseenterer__:().del();():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style().[_]=():droplist.style.[_]];clearTimer():[__droplistTimer__:()];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform='scale(0.5)';pointerEvents=none]];__droplistPositioner__:().del()?__droplistPositioner__:();!clicked().contains():[__droplistPositioner__:()]" }, __, lookupActions })

    // close tooltip
    lineInterpreter({ id: "tooltip", data: { string: "clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0" }, __, lookupActions })

    // close mininote
    lineInterpreter({ id: "root", data: { string: "():mininote.style():[opacity=0;transform=scale(0)]" }, __, lookupActions })
}

module.exports = { closePublicViews }