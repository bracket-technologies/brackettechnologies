module.exports = ({ controls, id }) => {

    var view = window.views[id]
    var _id = controls.id || controls.controllerId || id
    if (typeof _id === "object" && _id.id) _id = _id.id
    
    view.hover.default = view.hover.default || { style: {} }
    view.hover.style &&
    Object.keys(view.hover.style).map(key => 
        view.hover.default.style[key] = view.hover.default.style[key] !== undefined ? view.hover.default.style[key] : view.style[key] !== undefined ? view.style[key] : null 
    )
    
    return [{
        "event": `loaded:${_id}?if():[().state=().hover.id]:[[().state]:()=generate()];().hover.style.keys()._():[style()._=().hover.style._]?hover.mount`,
        // "actions": "setStyle?style()=if():[mode:()=default-mode:()]:[().hover.style]:[().mode.[mode:()].hover.style]||_map"
    }, {
        "event": `mouseenter:${_id}?().hover.style.keys()._():[style()._=().hover.style._]?!clicked.disable;!hover.disable`,
        // "actions": "setStyle?style=if():[mode:()=default-mode:()]:[().hover.style]:[().mode.[mode:()].hover.style]||_map"
    }, {
        "event": `mouseleave:${_id}?().hover.default.style.keys()._():[style()._=().hover.default.style._]?!clicked.disable;!hover.disable`,
        // "actions": "setStyle?style=().hover.default.style"
    }]
}