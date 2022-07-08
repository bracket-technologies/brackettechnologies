const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ controls, id }) => {
  
  id = controls.id || id
  var text = controls.text || ""
  
  return [{
    event: `mousemove?if():[!tooltip-timer:()]:[tooltip-timer:()=timer():[():tooltip.style().opacity=1]:500];():tooltip-text.txt()=${text};():tooltip-text.removeClass():ar;if():[${arabic.test(text) && !english.test(text)}]:[():tooltip-text.addClass():ar]`,
    actions: `setPosition:tooltip?position.positioner=mouse;position.placement=${controls.placement || "left"};position.distance=${controls.distance}`
  }, {
    event: "mouseleave?clearTimer():[tooltip-timer:()];tooltip-timer:().del();():tooltip.style().opacity=0"
  }]
}