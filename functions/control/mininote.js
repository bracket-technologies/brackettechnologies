module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `click?():mininote-text.txt()=${text};)(:mininote-timer.clearTimeout();():mininote.style():[opacity=1;transform=scale(1)];)(:mininote-timer=timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000;():mininote.position():[positioner=mouse;placement=right]`
  }]
}