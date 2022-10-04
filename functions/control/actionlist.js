module.exports = ({ controls, id }) => {
  
  window.views[id].actionlist.id = controls.id = id = controls.id || id
  
  return [{
    event: `click?if():[)(:actionlist-caller!=${id}]:[():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._]];clearTimer():[)(:actionlist-timer];if():[)(:actionlist-caller=${id}]:[timer():[():[)(:actionlist-caller].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:actionlist-caller.del()]:0];if():[actionlist-caller:()!=().id]:[update():actionlist;().actionlist.undeletable=():actionlist.undeletable||_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;)(:actionlist-caller=${id};)(:actionlist-caller-id=${id};path=${controls.path || ""};():actionlist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}];().actionlist.style.keys()._():[():actionlist.style()._=().actionlist.style._]]`
  }]
}