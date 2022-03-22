const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `mousemove?global().tooltip-timer=timer():[():tooltip.style().opacity.equal():1]:500<<!global().tooltip-timer;():tooltip-text.text()=${text};():tooltip-text.removeClass():ar;():tooltip-text.addClass():ar<<${arabic.test(text) && !english.test(text)}`,
    actions: `setPosition:tooltip?position.positioner=mouse;position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
  }, {
    event: "mouseleave?global().tooltip-timer.clearTimeout();global().tooltip-timer.delete();():tooltip.style().opacity=0"
  }]
}