module.exports = (view) => {
  return {
    ...view,
    view: `View?class='hide-scrollbar '+if():[().class]:[().class]:'';style:[display=if():[().style.display]:[().style.display]:flex;alignItems=if():[().style.alignItems]:[().style.alignItems]:center;position=if():[().style.position]:[().style.position]:relative;overflowX=if():[().style.overflowX]:[().style.overflowX]:hidden]`,
  }
}