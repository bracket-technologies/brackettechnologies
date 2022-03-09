const { toComponent } = require("../function/toComponent")
const { toString } = require("../function/toString")

module.exports = (component) => {

  var { icon, pin, controls, style } = toComponent(component)

  pin = pin || {}
  icon = icon || {}
  icon.on = icon.on || {}
  icon.off = icon.off || {}

  return {
    ...component,
    type: `View?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${toString({ style })}`,
    children: [{
      type: `View?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${toString(pin)}`,
      children: [{
          type: `Icon?style.color=red;style.fontSize=1.8rem;style.position=absolute;style.transition=.3s;${toString(icon.off)}?[${icon.off.name}]`
        }, {
          type: `Icon?style.color=blue;style.fontSize=1.3rem;style.position=absolute;style.opacity=0;style.transition=.3s;${toString(icon.on)}?[${icon.on.name}]`
        }]
    }],
    controls: [{
        event: "click?().element.checked=[true].if().[().element.checked.notexist()].else().[false];().checked=().element.checked;().1stChild().element.style.left=[calc(100% - 2.3rem)].if().[().element.checked].else().[0.3rem];().1stChild().1stChild().element.style.opacity=[0].if().[().element.checked].else().[1];().1stChild().2ndChild().element.style.opacity=[1].if().[().element.checked].else().[0]"
      },
      ...controls
    ]
  }
}
