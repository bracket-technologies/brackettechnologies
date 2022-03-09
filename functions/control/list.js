module.exports = ({ controls }) => {

  return [{
    event: "click",
    actions: [
      `setState?global().${controls.id}-mouseenter`,
      `mountAfterStyles:${controls.id}`,
      `setPosition?position.positioner=${controls.id};position.placement=${controls.placement || "right"};position.distance=${controls.distance || "15"}`,
    ],
  }, {
    event: "mouseleave",
    actions: [
      `resetStyles>>200:${controls.id}??!mouseenter;!mouseenter:${controls.id};!global().${controls.id}-mouseenter`,
      `setState?global().${controls.id}-mouseenter=false`,
    ]
  }]
}
