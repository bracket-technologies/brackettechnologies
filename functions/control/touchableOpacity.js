module.exports = ({ id }) => {

  if (window.children[id].element.style.transition) {
    window.children[id].element.style.transition += ", opacity .2s";
  } else window.children[id].element.style.transition = "opacity .2s";

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
