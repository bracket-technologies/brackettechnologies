module.exports = ({ controls, id }) => {
  
  var view = window.views[id]
  
  if (typeof view.popup !== "object") view.popup = {}
  view.popup.id = controls.id = id = controls.id || id
  if (view.popup.model2) view.popup.model = "model2"
  else if (view.popup.model3) view.popup.model = "model3"
  if (!view.popup.model) view.popup.model = "model1"
  
  return [{
    event: `click?clearTimer():[popup-timer:()];if():[popup-positioner:()=${id}]:[timer():[().popup.style.keys()._():[():popup.style()._=():popup.style._||null];():popup.():[if():[():${id}.popup.model=model1]:[child().style().transform='scale(0.5)'];style():[opacity=0;pointerEvents=none]];popup-positioner:().del()]:0].elif():[popup-positioner:()!=${id}]:[popup-positioner:()=${id};update():popup;timer():[if():[():${id}.popup.model=model1]:[():popup.position():[positioner=${controls.positioner || id};placement=${controls.placement || "left"};distance=${controls.distance};align=${controls.align}]];():popup.():[if():[():${id}.popup.model=model1]:[child().style().transform='scale(1)'];style():[opacity=1;pointerEvents=auto]];().popup.style():[().popup.style]]:50]`
  }]
}