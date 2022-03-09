const { toString } = require("../function/toString")

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })
  
  return [{
    event: "click",
    actions: [
      `resetStyles:droplist?global().droplist-positioner.delete();break?():droplist.style().opacity=1;global().droplist-positioner=${id}`,
      `setStyle<<const.${controls.style}:droplist?${styles}`,
      `resetStyles:droplist;droplist:${id}?global().droplist-positioner=${id}`,
      `setPosition:droplist;mountAfterStyles:droplist?position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align}`
    ]
  }]
}
