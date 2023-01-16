module.exports = {
  toStyle: ({ _window, id }) => {

    var view = _window ? _window.views[id] : window.views[id]
    var style = ""

    if (view.style) {
      Object.entries(view.style).map(([k, v]) => {
        if (k === "after" || k.includes(">>")) return;
        k = require("./styleName")(k);
        style += `${k}:${v}; `
      })

      style = style.slice(0, -2)
    }

    return style
  }
}
