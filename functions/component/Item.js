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
  component.text.text = component.text.text
  component.text.style = component.text.style || {}
  component.text.hover = component.text.hover || {}
  component.text.hover.style = component.text.hover.style || {}
  component.text.style.after = component.text.style.after || {}

  if (component.hover.freeze) {
    component.icon.hover.freeze = true
    component.text.hover.freeze = true
  }

  if (component.hover.mount) {
    component.icon.hover.mount = true
    component.text.hover.mount = true
  }

  component = toComponent(component)

  var {
    id,
    model,
    state,
    style,
    icon,
    text,
    hover,
    tooltip,
    controls,
    readonly,
    borderMarker,
  } = component
  
  borderMarker = borderMarker !== undefined ? borderMarker : true
  readonly = readonly !== undefined ? readonly : false

  var idlist = [id, text.text !== undefined && `${id}-text`, icon.name && `${id}-icon`].filter(id => id)
  var mount = hover.mount ? true : false

  if (model === "featured")
    return {
      ...component,
      class: "flex-box item",
      component: "Item",
      type: `View?touchableOpacity`,
      tooltip,
      hover: {
        ...hover,
        id,
        style: {
          border: "1px solid #ee384e",
          marginRight: "0",
          marginLeft: "0",
          marginBottom: "1px",
          ...style.after, 
          ...hover.style 
        }
      },
      style: {
        position: "relative",
        justifyContent: text.text !== undefined ? "flex-start" : "center",
        width: "100%",
        height: "4rem",
        cursor: "pointer",
        pointerEvents: "fill",
        marginRight: "1px",
        marginLeft: "1px",
        marginBottom: "1px",
        borderRadius: "0.45rem",
        ...style
      },
      children: [{
        type: `Icon?id=${id}-icon?const.${icon.name}`,
        ...icon,
        hover: {
          id,
          mount,
          disable: true,
          ...icon.hover,
          style: {
            color: style.after.color || "#ee384e",
            ...icon.style.after,
            ...icon.hover.style
          }
        },
        style: {
          width: "4rem",
          color: style.color || "#444",
          fontSize: "1.8rem",
          ...icon.style
        }
      }, {
        type: `Text?text=${text.text};id=${id}-text?[${text.text}]`,
        text,
        hover: {
          id,
          mount,
          disable: true,
          ...text.hover,
          style: {
            color: style.after.color || "#ee384e",
            ...text.style.after,
            ...text.hover.style
          }
        },
        style: {
          fontSize: style.fontSize || "1.4rem",
          color: style.color || "#444",
          userSelect: "none",
          ...text.style
        }
      }],
      controls: [
      ...controls,
      {
        event: `click?():global().${state}.hover.freeze=false?global().${state}.undefined().or():[global().${state}.0.not().${id}]`,
        actions: [
          `resetStyles:global().${state}`,
          `mountAfterStyles?global().${state}=[${id},${id}-icon,${id}-text];():global().${state}.hover.freeze??global().${state}`,
        ]
      }]
    }
    
  if (model === "classic")
    return {
      ...component,
      class: "flex-box item",
      component: "Item",
      type: `View?touchableOpacity`,
      tooltip,
      hover: {
        ...hover,
        id,
        style: {
          backgroundColor: readonly ? "initial" : "#eee",
          ...style.after,
          ...hover.style 
        }
      },
      style: {
        position: "relative",
        justifyContent: text.text !== undefined ? "flex-start" : "center",
        width: "100%",
        minHeight: "3.3rem",
        cursor: readonly ? "initial" : "pointer",
        marginBottom: "1px",
        borderRadius: "0.5rem",
        padding: "0.9rem",
        borderBottom: readonly ? "1px solid #eee" : "initial",
        pointerEvents: "fill",
        ...style
      },
      children: [{
        type: `Icon?id=${id}-icon?[${icon.name}]`,
        ...icon,
        hover: {
          id,
          mount,
          disable: true,
          ...icon.hover,
          style: {
            color: style.after.color || "#444",
            ...icon.style.after,
            ...icon.hover.style
          }
        },
        style: {
          display: icon ? "flex" : "none",
          color: !readonly ? style.color || "#444" : "#333",
          fontSize: !readonly ? style.fontSize || "1.4rem" : "1.6rem",
          fontWeight: !readonly ? "initial" : "bolder",
          marginRight: text.text !== undefined ? "1rem" : "0",
          ...icon.style,
        }
      }, {
        type: `Text?id=${id}-text?[${text.text}]`,
        ...text,
        hover: {
          id,
          mount,
          disable: true,
          ...text.hover,
          style: {
            color: style.after.color || "#444",
            ...text.style.after,
            ...text.hover.style
          }
        },
        style: {
          fontSize: style.fontSize || "1.4rem",
          color: !readonly ? style.color || "#444" : "#333",
          fontWeight: !readonly ? "initial" : "bolder",
          userSelect: "none",
          textAlign: "left",
          ...text.style,
        }
      }],
      controls: [...controls,
      {
        event: `click?():global().${state}.hover.freeze=false?global().${state}.undefined().or():[global().${state}.0.not().${id}]`,
        actions: [
          `resetStyles:global().${state}`,
          `mountAfterStyles:global().${state}?global().${state}=[${id},${id}-icon,${id}-text];():global().${state}.hover.freeze`,
        ]
      }]
    }
}
