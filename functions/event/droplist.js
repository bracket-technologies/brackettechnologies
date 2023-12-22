module.exports = () => {
  
  return [{ // close droplist
    event: "[keyup:input()??e().key=Escape];[blur:input()??clicked:().id!=droplist;!():droplist.contains():[clicked:()]]?clearTimer():[__droplistTimer__:()];():[__droplistPositioner__:()].droplist.style.keys()._():[():droplist.style().[_]=():droplist.style.[_]];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(0.5);pointerEvents=none]];__droplistPositioner__:().del()"
  }, { // open droplist on click
    event: `click;[focus:input()??clicked:().id!=.id;!clicked:().contains():[input().id]]?clearTimer():[__droplistTimer__:()];if():[__droplistPositioner__:()!=.id]:[__keyupIndex__:()=0;__droplistPositioner__:()=.id;droplist();():droplist.():[children().():[style().pointerEvents=auto];style():[transition='opacity .1s, transform .1s';opacity=1;transform='scale(1)';pointerEvents=auto]];droplist.style.keys()._():[():droplist.style().[_]=().droplist.style.[_]];timer():[():droplist.position():[positioner=.id;placement=.droplist.placement||bottom;distance=.droplist.distance;align=.droplist.align]]:0]:[droplist.style.keys()._():[():droplist.style().[_]=():droplist.style.[_]||null];():droplist.():[children().():[style().pointerEvents=none];style():[opacity=0;transform=scale(.5);pointerEvents=none]];__droplistPositioner__:().del()]`,
  }, { // open on hoverin
    event: `mouseenter?clearTimer():[().droplistLeaved];if():[__droplistMouseenterer__:()!=().id]:[click();__droplistMouseenterer__:()=().id]?droplist.hoverable`
  }, { // close on hoverout
    event: `mouseleave?droplistLeaved=timer():[if():[!():droplist.mouseentered;__droplistMouseenterer__:()=().id;():droplist.style().opacity='1']:[click();__droplistMouseenterer__:().del()]]:400?droplist.hoverable`
  }, { // search droplist
    event: `input:input()?__droplistSearchTxt__:()=input().txt();droplist()?input();droplist.searchable`
  }, { // open droplist on enter
    event: `[keyup:input()??e().key=Enter]?():droplist.children().[__keyupIndex__:()].click()?!droplist.preventDefault`
  }, { // move up/down
    event: `keyup:input()?():droplist.children().[__keyupIndex__:()||0].mouseleave();__keyupIndex__:()=if():[e().keyCode=40]:[__keyupIndex__:()+1]:[__keyupIndex__:()-1];():droplist.children().[__keyupIndex__:()].mouseenter()?!droplist.preventDefault;e().keyCode=40||e().keyCode=38;__droplistPositioner__:();if():[e().keyCode=38]:[__keyupIndex__:()>0].elif():[e().keyCode=40]:[__keyupIndex__:()<():droplist.children.lastIndex()]`
  }]
}