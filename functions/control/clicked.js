module.exports = ({ controls, id }) => {

    var local = window.children[id]
    var _id = controls.id || id
    
    local.clicked.freeze = local.clicked.freeze ? true : false
    local.clicked.default = local.clicked.default || { style: {} }
    local.clicked.style &&
    Object.keys(local.clicked.style).map(key => 
        local.clicked.default.style[key] = local.clicked.default.style[key] !== undefined ? local.clicked.default.style[key] : local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?().clicked.freeze=true?().clicked.mount.or():[().clicked.freeze]`,
        "actions": "setStyle?style=if().[)(:mode.is():[)(:default-mode]]:[().clicked.style].else():[().mode.[)(:mode].clicked.style].else():_map"
    }, {
        "event": `click??!().required.mount;!().parent().required.mount;!().clicked.disable`,
        "actions": "setStyle?style=if().[)(:mode.is():[)(:default-mode]]:[().clicked.style].else():[().mode.[)(:mode].clicked.style].else():_map;().clicked.freeze=true"
    }, {
        "event": `click:body??!().required.mount;!().parent().required.mount;().clicked.freeze;)(:clickedElement.outside():[().element];!().clicked.disable`,
        "actions": "setStyle?style=().clicked.default.style;().clicked.freeze=false"
    }]
}