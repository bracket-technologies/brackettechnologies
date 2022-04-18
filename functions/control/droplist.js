const { toString } = require("../function/toString")

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })
  
  return [{
    event: "click",
    actions: [
      `?():droplist.children().map():[style().pointerEvents=none];():droplist.style().opacity=0;():droplist.style().transform=scale(0.5);():droplist.style().pointerEvents=none;)(:droplist-positioner.delete();break?():droplist.style().opacity=1;)(:droplist-positioner=${id}`,
      `setStyle:droplist?${styles}?[${controls.style}]`,
      `droplist:${id}?)(:droplist-positioner=${id};():droplist.style().opacity=0;():droplist.style().transform=scale(0.5);():droplist.style().pointerEvents=none;():droplist.children().map():[style().pointerEvents=none]`,
      `setPosition:droplist?():droplist.children().map():[style().pointerEvents=auto];():droplist.style().opacity=1;():droplist.style().transform=scale(1);():droplist.style().pointerEvents=auto;position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align}`
    ]
  }]
}