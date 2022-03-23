const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

  component = toComponent(component)
  var { check, style } = component
  check = check || {}

  return {
    ...component,
    "type": `View?class=flexbox pointer;style.height=2rem;style.width=2rem;style.borderRadius=.25rem;style.transition=.1s;style.backgroundColor=#fff;style.border=1px solid #ccc;click.style.backgroundColor=#2C6ECB;click.style.border=1px solid #ffffff00;click.sticky;${toString({ style })}`,
    "children": [{
      "type": `Icon?name=bi-check;style.color=#fff;style.fontSize=2rem;style.opacity=0;style.transition=.1s;${toString(check)}`
    }],
    "controls": [{
      "event": "click?().element.checked=if():[().element.checked]:false.else():true;().1stChild().element.style.opacity=[1].if().[().element.checked].else().[0];().data()=[true].if().[().element.checked].else().[false]"
    }]
  }
}
