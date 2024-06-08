module.exports = ({ data, id }) => {

    var view = window.views[id]
    var _id = data.id || data.controllerId || id
    if (typeof _id === "object" && _id.id) _id = _id.id
    
    view.hover.default = view.hover.default || { style: {} }
    view.hover.style &&
    Object.keys(view.hover.style).map(key => 
        view.hover.default.style[key] = view.hover.default.style[key] !== undefined ? view.hover.default.style[key] : view.style[key] !== undefined ? view.style[key] : null 
    )
    
    return [{
        "event": `mouseenter:${_id}?hover.style.keys()._():[style().[_]=.hover.style.[_]]?!hover.disable`
    }, {
        "event": `mouseleave:${_id}?hover.default.style.keys()._():[style().[_]=.hover.default.style.[_]]?!hover.disable`
    }]
}