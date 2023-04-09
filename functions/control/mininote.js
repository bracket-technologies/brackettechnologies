module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `click?():mininote-text.txt()=${text};clearTimeout():[mininote-timer:()];():mininote.style():[opacity=1;transform='scale(1)'];mininote-timer:()=():root.timer():[():mininote.style():[opacity=0;transform=scale(0)]]:3000`
  }]
}