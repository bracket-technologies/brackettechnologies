const { toString } = require("../function/toString")

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })
  
  return [{
    event: "click",
    actions: [
      `resetStyles:actionlist?global().actionlist-caller.delete();break?():actionlist.element.style.opacity=1;global().actionlist-caller=${id}`,
      `setStyle<<const.${controls.style}:actionlist?${styles}`,
      `resetStyles:actionlist;update:actionlist?().actionlist.undeletable=().actionlist.undeletable.or():_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;global().actionlist-caller=${id};global().actionlist-caller-id=${id};path=${controls.path || ""}`,
      `setPosition:actionlist;mountAfterStyles:actionlist?position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance}`
    ]
  }]
}
