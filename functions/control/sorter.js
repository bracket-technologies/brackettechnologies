const { toArray } = require("../function/toArray");

module.exports = ({ id, controls }) => {
  
  controls.id = toArray(controls.id || id)

  return [{
    event: "click",
    actions: `await().update:${controls.id};async().sort?sort.path=${controls.path};sort.Data=${controls.Data}?)(:${controls.Data}`
  }]
}
