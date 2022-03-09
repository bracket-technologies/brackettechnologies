module.exports = ({ controls }) => {

  return [{
    event: `click??().view:${controls.id}!=${controls.view}`,
    actions: [
      `setStyle:${controls.id}?():${controls.id}.style().transition=transform .2s, opacity .2s;style.transform=translateY(-150%);style.opacity=0`,
      `setStyle>>400:${controls.id}?style.transform=translateY(0);style.opacity=1`,
      `createView>>250:${controls.id}?():${controls.id}.element.innerHTML='';():${controls.id}.Data=().data();view=${controls.view}`,
    ]
  }]
}
