const { toComponent } = require("../function/toComponent")

module.exports = (component) => {

  component.hover = component.hover || {}
  component.style = component.style || {}
  component.hover.style = component.hover.style || {}
  component.style.after = component.style.after || {}
  
  component.icon = component.icon || {}
  component.icon.style = component.icon.style || {}
  component.icon.hover = component.icon.hover || {}
  component.icon.hover.style = component.icon.hover.style || {}
  component.icon.style.after = component.icon.style.after || {}
  
  component.text = component.text || {}
  component.text.style = component.text.style || {}
  component.text.hover = component.text.hover || {}
  component.text.hover.style = component.text.hover.style || {}
  component.text.style.after = component.text.style.after || {}

  component = toComponent(component)
  
  var { style, hover, icon, text, id } = component
  
  return {
    ...component,
    type: "View?class=flex-box;touchableOpacity",
    isButton: true,
    hover: {
      style: { border: "1px solid #0d6efd", ...style.after, ...hover.style }
    },
    style: {
      border: "1px solid #e0e0e0",
      borderRadius: ".75rem",
      padding: "0.75rem 1rem",
      margin: "0 0.4rem",
      cursor: "pointer",
      transition: "border 0.1s",
      ...style
    },
    children: [{
      type: `Icon?id=${id}-icon?const.${icon.name}`,
      ...icon,
      hover: {
        id,
        style: { color: "#0d6efd", ...icon.style.after, ...icon.hover.style },
      },
      style: {
        color: style.color || "#444",
        fontSize: style.fontSize || "1.4rem",
        margin: "0 0.4rem",
        transition: "color 0.1s",
        display: "flex",
        alignItems: "center",
        ...icon.style
      }
    }, {
      type: `Text?id=${id}-text;text=${text.text}?const.${text.text}`,
      ...text,
      hover: {
        id,
        style: { color: "#0d6efd", ...text.style.after, ...text.hover.style },
      },
      style: {
        color: style.color || "#444",
        fontSize: style.fontSize || "1.4rem",
        margin: "0 0.4rem",
        transition: "color 0.1s",
        ...text.style
      }
    }]
  }
}
