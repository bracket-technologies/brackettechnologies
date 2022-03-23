const { toString } = require("../function/toString")

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })
  
  return [{
    event: "click",
    actions: [
      `?():droplist.children().map():[style().pointerEvents.eq():none];():droplist.style().opacity.eq():0;():droplist.style().transform.eq():[scale(0.5)];():droplist.style().pointerEvents.eq():none;global().droplist-positioner.delete();break?():droplist.style().opacity=1;global().droplist-positioner=${id}`,
      `setStyle<<const.${controls.style}:droplist?${styles}`,
      `droplist:${id}?global().droplist-positioner=${id};():droplist.style().opacity.eq():0;():droplist.style().transform.eq():[scale(0.5)];():droplist.style().pointerEvents.eq():none;():droplist.children().map():[style().pointerEvents.eq():none]`,
      `setPosition:droplist?():droplist.children().map():[style().pointerEvents.eq():auto];():droplist.style().opacity=1;():droplist.style().transform=scale(1);():droplist.style().pointerEvents=auto;position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align}`
    ]
  }]
}
