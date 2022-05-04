module.exports = ({ controls }) => {

  return [{
    event: "click",
    actions: [
      `setState?)(:${controls.id}-mouseenter`,
      `mountAfterStyles:${controls.id}`,
      `setPosition?position.positioner=${controls.id};position.placement=${controls.placement || "right"};position.distance=${controls.distance || "15"}`,
    ],
  }, {
    event: "mouseleave",
    actions: [
      `resetStyles>>200:${controls.id}??!mouseenter;!mouseenter:${controls.id};!)(:${controls.id}-mouseenter`,
      `setState?)(:${controls.id}-mouseenter=false`,
    ]
  }]
}
