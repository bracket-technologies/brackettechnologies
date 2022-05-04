module.exports = ({ controls, id }) => {

    var local = window.children[id]
    var _id = controls.id || controls.controllerId || id
    
    local.hover.before = local.hover.before || {}
    local.hover.style &&
    Object.keys(local.hover.style).map(key => 
        local.hover.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )
    
    return [{
        "event": `loaded:${_id}?if():[().state=().hover.id]:[)(:[().state]=generate()]?().hover.mount`,
        "actions": "setStyle?style=if():[)(:mode=)(:default-mode]:[().hover.style].else():[().mode.[)(:mode].hover.style].else():_map"
    }, {
        "event": `mouseenter:${_id}??!().click.mount;!().hover.disable`,
        "actions": "setStyle?style=if():[)(:mode=)(:default-mode]:[().hover.style].else():[().mode.[)(:mode].hover.style].else():_map"
    }, {
        "event": `mouseleave:${_id}??!().click.mount;!().hover.disable`,
        "actions": "setStyle?style=().hover.before"
    }]
}