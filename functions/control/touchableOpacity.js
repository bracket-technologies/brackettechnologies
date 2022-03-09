module.exports = ({ id }) => {

  if (window.value[id].element.style.transition) {
    window.value[id].element.style.transition += ", opacity .2s";
  } else window.value[id].element.style.transition = "opacity .2s";

  return [{
    event: `mousedown?():body.element.addClass().unselectable`,
    actions: "setStyle?style.opacity=.5",
  }, {
    event: `mouseup?():body.element.removeClass().unselectable`,
    actions: "setStyle?style.opacity=1",
  }, {
    event: "mouseleave",
    actions: "setStyle?style.opacity=1",
  }, {
    event: "mouseenter",
    actions: "setStyle?style.opacity=1?().mousedown",
  }]
}
