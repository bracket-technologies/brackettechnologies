module.exports = ({ controls, id }) => {
  
  window.views[id].actionlist.id = controls.id = id = controls.id || id
  
  return [{
    event: `click?if():[actionlistCaller:()!=${id}]:[():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._]];clearTimer():[actionlist-timer:()];if():[actionlistCaller:()=${id}]:[():[actionlistCaller:()].actionlist.style.keys()._():[():actionlist.style()._=():actionlist.style._];():actionlist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];actionlistCaller:().del()].elif():[actionlistCaller:()!=${id}]:[().actionlist.undeletable||=_string;():actionlist.Data=().Data;():actionlist.derivations=().derivations;actionlistCaller:()=${id};actionlistCallerId:()=${id};path=${controls.path || ""};update():actionlist;():actionlist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];().actionlist.style.keys()._():[():actionlist.style()._=().actionlist.style._];timer():[():actionlist.position():[positioner=${controls.positioner || id};placement=${controls.placement || "bottom"};distance=${controls.distance};align=${controls.align}]]:100]`
  }]
}