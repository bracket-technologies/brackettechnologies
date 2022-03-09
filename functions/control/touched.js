const { toArray } = require("../function/toArray")

module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var idlist = toArray(controls.id || id)
    
    local.touched.freeze = local.touched.freeze ? true : false
    local.touched.before = local.touched.before || {}
    local.touched.style &&
    Object.keys(local.touched.style).map(key => 
        local.touched.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:[${idlist}]?().touched.freeze=true?().touched.mount.or():[().touched.freeze]`,
        "actions": "setStyle?style=().touched.style.if().[global().mode.is():[global().default-mode]].else().[().mode.[global().mode].touched.style].else()._map"
    }, {
        "event": `touch:[${idlist}]??!().touched.disable`,
        "actions": "setStyle?style=[().touched.style.if().[global().mode.is():[global().default-mode]].else().[().mode.[global().mode].touched.style].else()._map].if().[().touched.freeze.isfalse()].else().[().touched.before];().touched.freeze=[true].if().[().touched.freeze.isfalse()].else().[false]"
    }]
}