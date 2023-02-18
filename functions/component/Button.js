const { toString } = require('../function/toString')

module.exports = (view) => {
  var {style, icon, text, chevron} = view
  if (typeof text === "string") text = {text}
  if (typeof icon === "string") icon = {name: icon}
  if (typeof chevron === "string") chevron = {}
  
  return {
    ...view,
    view: `View?style:[position=relative;height=4rem;backgroundColor=#fff;borderRadius=.5rem;padding=0 1rem;gap=1rem;border=1px solid #ddd];${Object.keys(style).length > 0 ? toString({style}) : ""};class=flex align-center pointer ${view.class ? view.class : ""}`,
    children: [{
      view: `Icon?style:[fontSize=2rem];${toString(icon)}?parent().icon`
    }, {
      view: `Text?style:[fontSize=1.5rem];${toString(text)}?parent().text`
    }, {
      view: `Icon?name=if():[parent().direction=ltr]:'bi-chevron-right':'bi-chevron-left';style:[fontSize=1.8rem;transition=.2s;position=absolute;if():[parent().direction=ltr]:[right=1rem]:[left=1rem]];${toString(chevron)};parent().():[mouseenter:[style().transform=if():[parent().direction=ltr]:'translateX(.5rem)':'translateX(-.5rem)'];mouseleave:[style().transform='translateX(0)']]?parent().chevron`
    }]
  }
}