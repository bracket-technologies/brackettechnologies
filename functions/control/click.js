module.exports = ({ controls, id }) => {

    var local = window.value[id]
    var _id = controls.id || id
    
    local.click.sticky = local.click.sticky ? true : false
    local.click.before = local.click.before || {}
    local.click.style &&
    Object.keys(local.click.style).map(key => 
        local.click.before[key] = local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?global().[().state]<<().state=().click.id?().click.mount`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().click.style].else():[().mode.[global().mode].click.style].else():_map"
    }, {
        "event": `mousedown:${_id}??!().click.disable;!().click.sticky`,
        "actions": "setStyle?style=if():[global().mode.is():[global().default-mode]]:[().click.style].else():[().mode.[global().mode].click.style].else():_map"
    }, {
        "event": `mouseup:${_id}??!().click.freeze;!().click.disable;!().click.sticky`,
        "actions": "setStyle?style=().click.before?().click.freeze.not()"
    }, {
        "event": `click:${_id}?().click.mount=if():[().click.mount]:false.else():true?().click.sticky;!().click.disable`,
        "actions": "setStyle?style=if():[().click.mount]:[().click.style].else():[().click.before]"
    }]
}