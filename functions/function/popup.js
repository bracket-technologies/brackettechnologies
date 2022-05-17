const {controls} = require("./controls")
const {update} = require("./update")

const popup = ({ id }) => {
  
  var view = window.views[id]
  var popup = window.views["popup"]
  var popUp = view.popup
  var _controls = popUp.controls
  popup.positioner = id

  /*
  popup.Data = view.Data
  popup.derivations = view.derivations
  popup.unDeriveData = true
  */

  update({ id: "popup" })
  
  // eraser
  if (popUp.type === "eraser") {

    _controls = {
      event: "click",
      actions: `resetStyles:popup;await().note;await().setStyle:mini-window;await().remove:[():mini-window-view.element.children.0.id]:220${popUp.update ? `;await().update:${popUp.update}` : ""};async().erase?note.text=${popUp.note || "Data removed successfully"};()::200.style.display=none;style.opacity=0;erase.path=${popUp.path};erase.id=${popUp.id || "().data().id"};await().)(:[().Data]=().Data()._filterById().[${popUp.id ? `any.${popUp.id}` : "().data().id"}.not().[_.id]]`,
    }
  }


  setTimeout(() => {

    // caller
    popup.caller = id
    // window.views["popup-text"].caller = id
    window.views["popup-confirm"].caller = id
    window.views["popup-cancel"].caller = id

    if (popUp.text) window.views["popup-text"].element.innerHTML = popUp.text
    controls({ controls: _controls, id: "popup-confirm" })

  }, 50)
}

module.exports = {popup}
