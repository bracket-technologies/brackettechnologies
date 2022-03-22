const { toString } = require("../function/toString")

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })
  
  return [{
    event: "click",
    actions: [
      `?():actionlist.style().opacity.eq():0;():actionlist.style().transform.eq():[scale(0.5)];():actionlist.style().pointerEvents.eq():none;global().actionlist-caller.delete();break?():actionlist.style().opacity=1;global().actionlist-caller=${id}`,
      `setStyle:actionlist<<[${controls.style}]?${styles}`,
      `update:actionlist?().actionlist.undeletable=():actionlist.undeletable.or():_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;global().actionlist-caller=${id};global().actionlist-caller-id=${id};path=${controls.path || ""};():actionlist.style().opacity.eq():0;():actionlist.style().transform.eq():[scale(0.5)];():actionlist.style().pointerEvents.eq():none`,
      `setPosition:actionlist;mountAfterStyles:actionlist?position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance}`
    ]
  }]
}
