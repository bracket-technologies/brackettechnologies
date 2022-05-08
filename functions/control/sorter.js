const { toArray } = require("../function/toArray");

module.exports = ({ id, controls }) => {
  
  controls.id = toArray(controls.id || id)

  return [{
    event: "click",
    actions: `async():sort:[update:${controls.id}]?sort.path=${controls.path};sort.Data=${controls.Data}?)(:${controls.Data}`
  }]
}
