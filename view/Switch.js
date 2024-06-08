const { jsonToBracket } = require("../action/jsonToBracket")

module.exports = (component) => {

  var { icon, pin, controls, style } = component

  pin = pin || {}
  icon = icon || {}
  icon.on = icon.on || {}
  icon.off = icon.off || {}

  return {
    ...component,
    view: `View?class=flexbox pointer;hover.style.backgroundColor=#ddd;style.justifyContent=flex-start;style.width=5rem;style.height=2.4rem;style.position=relative;style.borderRadius=2.2rem;style.backgroundColor=#eee;${jsonToBracket({ style })}`,
    children: [{
      view: `View?class=flexbox;style.transition=.3s;style.width=2rem;style.height=2rem;style.borderRadius=2rem;style.backgroundColor=#fff;style.position=absolute;style.left=0.3rem;${jsonToBracket(pin)}`,
      children: [{
          view: `Icon?style.color=red;style.fontSize=1.8rem;style.position=absolute;style.transition=.3s;${jsonToBracket(icon.off)}?[${icon.off.name}]`
        }, {
          view: `Icon?style.color=blue;style.fontSize=1.3rem;style.position=absolute;style.opacity=0;style.transition=.3s;${jsonToBracket(icon.on)}?[${icon.on.name}]`
        }]
    }],
    __controls__: [{
        event: "click?().el().checked=[true].if().[().el().checked.notexist()].else().[false];().checked=().el().checked;().1stChild().el().style.left=[calc(100% - 2.3rem)].if().[().el().checked].else().[0.3rem];().1stChild().1stChild().el().style.opacity=[0].if().[().el().checked].else().[1];().1stChild().2ndChild().el().style.opacity=[1].if().[().el().checked].else().[0]"
      },
      ...controls
    ]
  }
}
