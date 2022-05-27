const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

  component = toComponent(component)
  var { icon, style } = component
  icon = icon || {}

  return {
    ...component,
    "type": `View?class=flexbox pointer;style.height=2rem;style.width=2rem;style.borderRadius=.25rem;style.transition=.1s;style.backgroundColor=#fff;style.border=1px solid #ccc;clicked.style.backgroundColor=#2C6ECB;clicked.style.border=1px solid #ffffff00;clicked.mount=true;${toString({ style })}`,
    "children": [{
      "type": `Icon?name=bi-check;style.color=#fff;style.fontSize=2rem;style.opacity=0;style.transition=.1s;${toString(icon)}`
    }],
    "controls": [{
      "event": "click?checked()=if():checked():false:true;1stChild().style().opacity=if():checked():1:0;data()=if():checked():true:false"
    }]
  }
}