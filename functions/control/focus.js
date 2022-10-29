module.exports = ({ id, controls }) => {
  if (window.views[id].type !== "Input" && !window.views[id].editable) {
    var _input = window.views[id].element.getElementsByTagName("INPUT")
    if (_input.length > 0) id = _input[0].id
  }
  return [{
    event: `focus:${id}?${controls}??${id}`
  }]
}