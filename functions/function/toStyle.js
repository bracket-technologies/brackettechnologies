const cssStyleKeyNames = require("./cssStyleKeyNames")

module.exports = {
  toStyle: ({ _window, id }) => {

    var view = _window ? _window.views[id] : window.views[id]
    var styles = ""

    if (view.style) {
      Object.entries(view.style).map(([style, value]) => {
        if (style === "after" || style.includes(">>")) return;
        styles += `${cssStyleKeyNames[style] || style}:${value}; `
      })

      styles = styles.slice(0, -2)
    }
    
    return styles
  }
}
