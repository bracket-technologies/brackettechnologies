const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[a-zA-Z]/

module.exports = ({ data, id }) => {
  
  id = data.id || id
  var text = data.text || ""
  
  return [{
    event: `mousemove?if():[!__tooltipTimer__:()]:[__tooltipTimer__:()=timer():[():tooltip.style().opacity=1?mouseentered]:500];():'tooltip-text'.txt()=[().tooltip.text]();#if():[${arabic.test(text) && !english.test(text)}]:[():tooltip-text.addClass():ar];():tooltip.position():[positioner=mouse;placement=[().tooltip.placement||left];distance=[().tooltip.distance||0]]?mouseentered;[().tooltip.text]()`
  }, {
    event: "mouseleave?mouseentered=false;clearTimer():[__tooltipTimer__:()];__tooltipTimer__:().del();():tooltip.style().opacity=0"
  }, {
    event: "mouseenter?mouseentered=true"
  }]
}