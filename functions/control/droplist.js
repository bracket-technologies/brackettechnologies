module.exports = ({ controls, id }) => {
  
  window.views[id].droplist.id = controls.id = id = controls.id || id
  
  return [{
    event: `click?)(:droplist-search-txt.del();if():[getInput().txt()]:[)(:droplist-search-txt=getInput().txt()];clearTimer():[)(:droplist-timer];if():[)(:droplist-positioner!=${id}]:[():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._]];if():[)(:droplist-positioner=${id}]:[timer():[():[)(:droplist-positioner].droplist.style.keys()._():[():droplist.style()._=():droplist.style._];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];)(:droplist-positioner.del()]:0]`,
    actions: `droplist:${id};setPosition:droplist?)(:droplist-positioner=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align};().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]?)(:droplist-positioner!=().id`
  }, {
    event: "input:input()?)(:droplist-search-txt=getInput().txt()?().droplist.searchable",
    actions: `droplist:${id};setPosition:droplist?)(:droplist-positioner=${id};():droplist.():[children().():[style().pointerEvents=auto];style():[opacity=1;transform=scale(1);pointerEvents=auto]];position.positioner=${controls.positioner || id};position.placement=${controls.placement || "bottom"};position.distance=${controls.distance};position.align=${controls.align};().droplist.style.keys()._():[():droplist.style()._=().droplist.style._]`
  }]
}