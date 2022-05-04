const { generate } = require("../function/generate");

module.exports = ({ params }) => {

  var controls = params.controls
  var state = generate()

  return [{
    event: "click??!)(:mini-window-close",
    actions: [
      `createView:mini-window-view?)(:${state}=${controls.Data ? window.global[controls.Data] : '().data()'};():mini-window-view.Data.delete();if():data():[():mini-window-view.Data=${state}];view=${controls.view}`,
      "setStyle:mini-window?style.display=flex;style.opacity=1>>25",
    ]
  }]
}
