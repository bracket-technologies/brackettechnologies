module.exports = (view) => {
  var scrollWidth = `[px():[().swiper.scroll]||100]`
  var clickLeft = `():[().swiper.id]._():[clearTimer():[_.mytimer];_.scroll+=[${scrollWidth}-_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll>_.scrollable]:[_.scroll=0];_.style().transform='translateX('+_.scroll+'px)';if():[_.autorun]:[_.mytimer=interval():[_.scroll+=[${scrollWidth}-_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll>_.scrollable]:[_.scroll=0];_.style().transform='translateX('+_.scroll+'px)']:[_.autorun.timer||100]]]`
  var clickRight = `():[().swiper.id]._():[clearTimer():[_.mytimer];_.scroll-=[_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll<0]:[_.scroll=_.scrollable];_.style().transform='translateX('+_.scroll+'px)';if():[_.autorun]:[_.mytimer=interval():[_.scroll+=[${scrollWidth}-_.scroll%${scrollWidth}||${scrollWidth}];if():[_.scroll>_.scrollable]:[_.scroll=0];_.style().transform='translateX('+_.scroll+'px)']:[_.autorun.timer||100]]]`
  return {
    ...view,
    view: `Icon?class='flexbox pointer '+[().class||];name=if():[direction=right]:'bi-chevron-right'.elif():[direction=left]:'bi-chevron-left';style:[fontSize=[().style.fontSize||2.5rem];if():[().direction=left]:[left=[().style.left||0]].elif():[().direction=right]:[right=[().style.right||0]]];click:[if():[direction=left;swiper.id]:[${clickLeft}].elif():[direction=right;swiper.id]:[${clickRight}]]`
  }
}