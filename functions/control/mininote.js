module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `click?():mininote-text.element.text()=${text};global().mininote-timer.clearTimeout();():mininote.style().opacity=1;():mininote.style().transform=scale(1);global().mininote-timer=timer().[():mininote.style().opacity.equal():[[0].str()].and():[():mininote.style().transform.equal():[scale(0)]]].3000`,
    actions: "setPosition:mininote?position.positioner=mouse;position.placement=right"
  }]
}