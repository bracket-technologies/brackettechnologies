module.exports = ({ controls, id }) => {
  
  if (typeof window.views[id].popup !== "object") window.views[id].popup = {}
  window.views[id].popup.id = controls.id = id = controls.id || id

  return [{
    event: `click?clearTimer():[popup-timer:()];if():[popup-positioner:()!=${id}]:[().popup.style.keys()._():[():popup.style()._=().popup.style._]];if():[popup-positioner:()=${id}]:[timer():[().popup.style.keys()._():[():popup.style()._=():popup.style._||null];():popup.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];popup-positioner:().del()]:0].elif():[popup-positioner:()!=${id}]:[popup-positioner:()=${id};():popup.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];update():popup;():popup.position():[positioner=${controls.positioner || id};placement=${controls.placement || "left"};distance=${controls.distance};align=${controls.align}];().popup.style.keys()._():[():popup.style()._=().popup.style._]]`
  }]
}