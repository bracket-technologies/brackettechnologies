const { toArray } = require("./toArray")

const controls = ({ _window, lookupActions, awaits, controls, id, req, res }) => {

  const { addEventListener } = require("./event")
  const { watch } = require("./watch")

  var local = _window ? _window.views[id] : window.views[id]

  // controls coming from toControls action
  controls = controls || local.controls
  
  controls && toArray(controls).map(controls => {
    // watch
    if (controls.watch) watch({ _window, lookupActions, awaits, controls, id, req, res })
    // event
    else if (controls.event) addEventListener({ _window, lookupActions, awaits, controls, id, req, res })
  })
}

const setControls = ({ id, params }) => {

  var local = window.views[id]
  if (!local) return

  local.controls = toArray(local.controls)
  local.controls.push(...toArray(params.controls))
}

module.exports = { controls, setControls }
