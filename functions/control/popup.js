module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var styles = toString({ style: controls.style })

  return [{
    event: `click?():popup.style().zIndex=-1;():popup.style().opacity=0;():popup.style().pointerEvents=none;():popup.style().transform=scale(0.5);)(:popup-positioner.delete();)(:popup=${controls.id || id}`,
    actions: [
      `?break?)(:popup-positioner=${id}`,
      `popup:${id}?)(:popup-positioner=${id}`,
      `setStyle:popup?${styles}`,
      `setPosition:popup?():popup.style().zIndex=10;():popup.style().opacity=1;():popup.style().pointerEvents=auto;():popup.style().transform=scale(1);position.positioner=${controls.positioner || id};position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
    ]
  }]
}
