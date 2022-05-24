module.exports = ({ controls, id }) => {

    var local = window.views[id]
    var _id = controls.id || id
    
    local.clicked.default = local.clicked.default || { style: {} }
    local.clicked.style &&
    Object.keys(local.clicked.style).map(key => 
        local.clicked.default.style[key] = local.clicked.default.style[key] !== undefined ? local.clicked.default.style[key] : local.style[key] !== undefined ? local.style[key] : null 
    )

    return [{
        "event": `loaded:${_id}?().clicked.disable=true;if():[)(:mode=)(:default-mode]:[().clicked.style.keys()._():[style()._=().clicked.style._]]?().clicked.mount||().clicked.disable`
    }, {
        "event": `click:${_id}?if():[)(:mode=)(:default-mode]:[().clicked.style.keys()._():[style()._=().clicked.style._]]?!().required.mount;!parent().required.mount;!().clicked.disable`
    }, {
        "event": "click:body?if():[)(:mode=)(:default-mode]:[().clicked.style.keys()._():[style()._=().style._||null]]?!().required.mount;!parent().required.mount;!().clicked.disable;!().element.contains():[)(:clickedElement];!():droplist.element.contains():[)(:clickedElement]"
    }]
}