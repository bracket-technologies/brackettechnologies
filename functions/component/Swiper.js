module.exports = (view) => {

  var AutorunScrollInPixel = `[px():[().autorun.scroll]||100]`
  var toScrollWidth = `[${AutorunScrollInPixel}-().scroll%${AutorunScrollInPixel}||${AutorunScrollInPixel}]`
  var autorunInterval = `mytimer=interval():[().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transform='translateX('+().scroll+'px)']:[().autorun.timer||100]`
  var loadedActions = `loaded:[scrollable=el().scrollWidth-parent().el().clientWidth;if():[autorun]:[${autorunInterval}]]`
  var mouseenterActions = `mouseenter:[clearTimer():[().mytimer]]`
  var mouseleaveActions = `mouseleave:[if():[!mousedn]:[style().transition=[().style.transition||.2s];${autorunInterval}]]`
  var touchstartActions = `touchstart:[clearTimer():[().mytimer];touchst=true;style().transition=null;mouseposition=e().changedTouches.0.screenX;scrollLeft=().scroll]`
  var mousedownActions = `mousedown:[mousedn=true;style().transition=null;mouseposition=e().screenX;scrollLeft=().scroll]`
  var touchmoveActions = `touchmove:[if():[touchst]:[scroll=().scrollLeft+e().changedTouches.0.screenX-().mouseposition;if():[scroll<0]:[().scroll=0].elif():[scroll>().scrollable]:[().scroll=().scrollable];style().transform='translateX('+[().scroll]+'px)']]`
  var bodyMousemoveActions = `():body.mousemove:[if():[mousedn]:[scroll=().scrollLeft+e().screenX-().mouseposition;if():[scroll<0]:[().scroll=0].elif():[scroll>().scrollable]:[().scroll=().scrollable];style().transform='translateX('+[().scroll]+'px)']]`
  var touchendActions = `touchend:[if():[touchst]:[touchst=false;if():[autorun]:[mytimer=interval():[().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)']:[().autorun.timer||100]];().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)';().scrollLeft=().scroll]]`
  var bodyMouseupActions = `():body.mouseup:[if():[mousedn]:[mousedn=false;if():[autorun;!mouseentered]:[mytimer=interval():[().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)']:[().autorun.timer||100]];().scroll+=${toScrollWidth};if():[().scroll>().scrollable]:[().scroll=0];style().transition=[().style.transition||.2s];style().transform='translateX('+().scroll+'px)';().scrollLeft=().scroll]]`
  return {
    ...view,
    view: `View?style:[display=flex;alignItems=if():[().style.alignItems]:[().style.alignItems]:center;if():[vertical]:[flexDirection=column]];scrollLeft=0;scroll=0;${loadedActions};if():[autorun]:[${mouseenterActions};${mouseleaveActions}];${mousedownActions};${bodyMousemoveActions};${bodyMouseupActions};${touchstartActions};${touchmoveActions};${touchendActions}`,
  }
}