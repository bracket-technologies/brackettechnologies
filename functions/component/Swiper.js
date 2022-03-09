const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)

    component.style = component.style || {}
    component.hover = component.hover || {}
    component.hover.style = component.hover.style || {}

    // innerbox
    component.innerbox = component.innerbox || {}
    component.innerbox.style = component.innerbox.style || {}
    component.innerbox.hover = component.innerbox.hover || {}
    component.innerbox.hover.style = component.innerbox.hover.style || {}
    
    return {
        ...component,
        type: "View?class=swiper",
        children: [{
            type: "View?style.display=inline-flex;style.alignItems=center;style.height=100%",
            ...component.innerbox,
            children: component.children
        }]
    }
}