const { generate } = require("../function/generate");

module.exports = ({ params }) => {

  var controls = params.controls
  var state = generate()

  return [{
    event: "click??!global().mini-window-close",
    actions: [
      `createView:mini-window-view?global().${state}=${controls.Data ? window.global[controls.Data] : '().data()'};():mini-window-view.Data.delete();():mini-window-view.Data=${state}<<().data();view=${controls.view}`,
      "setStyle:mini-window?style.display=flex;style.opacity=1>>25",
    ]
  }]
}
