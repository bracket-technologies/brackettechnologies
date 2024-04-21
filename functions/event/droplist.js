module.exports = () => {
  
  return [{ // close droplist
    event: `[keyup:input()??e().key=Escape];[blur??!():droplist.contains():[clicked()]||focused()!=()]?__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()`
  }, { // open droplist on click
    event: `[click??__droplistPositioner__:()!=().id];[focus??__droplistPositioner__:()!=().id]?clearTimer():[__droplistTimer__:()];if():[__droplistPositioner__:()!=().id]:[__keyupIndex__:()=0;__droplistPositioner__:()=().id;droplist()::[().droplist.style.keys()._():[():droplist.style().[_]=().droplist.style.[_]];():droplist.position():[positioner=().id;[().droplist].flat()];():droplist.style():[opacity=1;transform='scale(1)';pointerEvents=auto]]]:[__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()]`,
  }, { // choose item on enter
    event: `keyup?():droplist.children().[__keyupIndex__:()].click()?e().key=Enter`
  }, { // open on hoverin
    event: `mouseenter?clearTimer():[.droplistLeaved];if():[__droplistMouseenterer__:()!=().id]:[click();__droplistMouseenterer__:()=().id]?droplist.hoverable`
  }, { // close on hoverout
    event: `mouseleave?__droplistMouseleaveTimer__:()=0;():droplist.mouseleave()?droplist.hoverable`
  }, { // search droplist
    event: `input:input()?droplist()?input();droplist.searchable`
  }, { // move up/down items
    event: `keydown?():droplist.children().[__keyupIndex__:()||0].mouseleave();__keyupIndex__:()=if():[e().keyCode=40]:[__keyupIndex__:()+1]:[__keyupIndex__:()-1];():droplist.children().[__keyupIndex__:()].mouseenter()?e().keyCode=40||=38;__droplistPositioner__:();if():[e().keyCode=38]:[__keyupIndex__:()>0].elif():[e().keyCode=40]:[__keyupIndex__:()<():droplist.children().len()-1]`
  }]
}