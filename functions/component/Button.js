module.exports = (view) => {
  var {style} = view
  return {
    ...view,
    view: `View?class=flexbox;style:[position=relative;flex=1;height=4rem;backgroundColor=#fff;borderRadius=.5rem;border=1px solid #ddd];${toString({style})}`
  }
}