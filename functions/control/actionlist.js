module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  
  return [{
    event: "click",
    actions: [
      `?():actionlist.children().map():[style().pointerEvents=none];():actionlist.style().opacity=0;():actionlist.style().transform=scale(0.5);():actionlist.style().pointerEvents=none;global().actionlist-caller.delete();break?():actionlist.style().opacity=1;global().actionlist-caller=${id}`,
      `update:actionlist?().actionlist.undeletable=():actionlist.undeletable.or():_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;global().actionlist-caller=${id};global().actionlist-caller-id=${id};path=${controls.path || ""};():actionlist.style().opacity=0;():actionlist.style().transform=scale(0.5);():actionlist.style().pointerEvents=none;():actionlist.children().map():[style().pointerEvents=none]`,
      `setPosition:actionlist?():actionlist.children().map():[style().pointerEvents=auto];():actionlist.style().opacity=1;():actionlist.style().transform=scale(1);():actionlist.style().pointerEvents=auto;position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance}`
    ]
  }]
}