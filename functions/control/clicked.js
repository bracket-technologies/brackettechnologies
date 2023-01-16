const { generate } = require("../function/generate");

module.exports = ({ controls, id }) => {
  var view = window.views[id];
  var _id = controls.id || id;
  if (typeof _id === "object" && _id.id) _id = _id.id;

  view.clicked.state = view.clicked.state || generate();
  view.clicked.default = view.clicked.default || { style: {} };
  view.clicked.style &&
    Object.keys(view.clicked.style).map(
      (key) =>
        (view.clicked.default.style[key] =
          view.clicked.default.style[key] !== undefined
            ? view.clicked.default.style[key]
            : view.style[key] !== undefined
            ? view.style[key]
            : null)
    );

  return [
    {
      event: `loaded:${_id}?click()?clicked.mount`,
    },
    {
      event: `click:${_id}?if():[state:().[().clicked.state]]:[():[state:().[().clicked.state]]._():[_.clicked.mount.del();_.clicked.style.keys()._():[__.style()._=[__.style._||null]]]];clicked.mount;clicked.style.keys()._():[():${_id}.style()._=().clicked.style._];state:().[().clicked.state]=${_id}?!required.mount;!clicked.disable`,
    },
    {
      event: `click:body?if():[state:().[().clicked.state]]:[():[state:().[().clicked.state]]._():[_.clicked.mount.del();_.clicked.style.keys()._():[__.style()._=[__.style._||null]]]];state:().[().clicked.state].del()?!required.mount;!clicked.disable;!clicked.sticky`,
    }
  ]
}