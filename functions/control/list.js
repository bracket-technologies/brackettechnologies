module.exports = ({ controls }) => {

  return [{
    event: "click",
    actions: [
      `setState?)(:${controls.id}-mouseentered`,
      `mountAfterStyles:${controls.id}`,
      `setPosition?position.positioner=${controls.id};position.placement=${controls.placement || "right"};position.distance=${controls.distance || "15"}`,
    ],
  }, {
    event: "mouseleave",
    actions: [
      `resetStyles>>200:${controls.id}??!mouseentered;!mouseentered:${controls.id};!)(:${controls.id}-mouseentered`,
      `setState?)(:${controls.id}-mouseentered=false`,
    ]
  }]
}
