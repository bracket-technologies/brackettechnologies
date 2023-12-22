const { toArray } = require("./toArray")

const controls = ({ _window, lookupActions, stack, controls, id, req, res }) => {

  const { addEventListener } = require("./event")
  const { watch } = require("./watch")

  var view = _window ? _window.views[id] : window.views[id]

  controls = controls || view.controls
  
  toArray(controls).map(controls => {
    
    // watch
    if (controls.watch) watch({ _window, lookupActions, stack, controls, id, req, res })
    // event
    else if (controls.event) addEventListener({ _window, lookupActions, stack, controls, id, req, res })
  })
}

module.exports = { controls }
