module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var _id = controls.id || controls.controllerId || id
    
    local.hover.before = local.hover.before || {}
    local.hover.style &&
    Object.keys(local.hover.style).map(key => 
        local.hover.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )
    
    return [{
        "event": `loaded:${_id}?global().[().state]<<().state.is():[().hover.id]?().hover.mount`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().hover.style].else():[().mode.[global().mode].hover.style].else():_map"
    }, {
        "event": `mouseenter:${_id}??!().click.mount;!().hover.disable`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().hover.style].else():[().mode.[global().mode].hover.style].else():_map"
    }, {
        "event": `mouseleave:${_id}??!().click.mount;!().hover.disable`,
        "actions": "setStyle?style=().hover.before"
    }]
}