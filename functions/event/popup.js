module.exports = ({ data, id }) => {
  
  var view = window.views[id]
  
  if (typeof view.popup !== "object") view.popup = {}
  view.popup.id = data.id = id = data.id || id
  if (view.popup.model2) view.popup.model = "model2"
  else if (view.popup.model3) view.popup.model = "model3"
  if (!view.popup.model) view.popup.model = "model1"
  
  return [{
    event: `click?clearTimer():[popup-timer:()];if():[__popupPositioner__:()=${id}]:[timer():[().popup.style.keys()._():[():popup.style().[_]=():popup.style._||null];():popup.():[if():[():${id}.popup.model=model1]:[child().style().transform='scale(0.5)'];style():[opacity=0;pointerEvents=none]];__popupPositioner__:().del()]:0].elif():[__popupPositioner__:()!=${id}]:[__popupPositioner__:()=${id};update():popup;timer():[if():[():${id}.popup.model=model1]:[():popup.position():[positioner=${data.positioner || id};placement=${data.placement || "left"};distance=${data.distance};align=${data.align}]];():popup.():[if():[():${id}.popup.model=model1]:[child().style().transform='scale(1)'];style():[opacity=1;pointerEvents=auto]];().popup.style():[().popup.style]]:50]`
  }]
}