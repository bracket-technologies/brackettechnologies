const { toArray } = require("../function/toArray")

module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var idlist = toArray(controls.id || id)
    
    local.touch.before = local.touch.before || {}
    local.touch.style &&
    Object.keys(local.touch.style).map(key => 
        local.touch.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:[${idlist}].arr()?global().[().state]<<value().state=().touch.id?().touch.mount`,
        "actions": "setStyle?style=().touch.style.if().[global().mode.is():[global().default-mode]].else().[().mode.[global().mode].touch.style].else()._map"
    }, {
        "event": `touchstart:[${idlist}].arr()??!().touch.disable`,
        "actions": "setStyle?style=().touch.style.if().[global().mode.is():[global().default-mode]].else().[().mode.[global().mode].touch.style].else()._map"
    }, {
        "event": `touchend:[${idlist}].arr()??!().touch.freeze;!().touch.disable`,
        "actions": "setStyle?style=().touch.before?().touch.freeze.not()"
    }]
}