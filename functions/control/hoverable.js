const {toArray} = require("../function/toArray")

module.exports = ({ id, controls }) => {

  controls.id = toArray(controls.id || id)

  return [{
      event: "mouseenter",
      actions: `mountAfterStyles:[${controls.id}]`,
    }, {
      event: "mouseleave",
      actions: `resetStyles:[${controls.id}]??${controls.mountonload ? "!mountonload" : true}`,
    }]
}
