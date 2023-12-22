const { decode } = require("./decode")
const { generate } = require("./generate")

const stacker = ({ _window, event, id, eventID, name, string = "" }) => {

    // init stack
    string = decode({ _window, string })
    var stack = { id: generate(), string, initializer: true, viewID: id, targetID: eventID, event, name: name || event, executionStartTime: (new Date()).getTime(), addresses: [] }
    var views = _window ? _window.views : window.views
    var view = views[id]

    view.__stacks__ = view.__stacks__ || {}
    view.__stacks__[stack.id] = stack

    return stack
}

const clearStack = ({ _window, stack }) => {
  
  var views = _window ? _window.views : window.views
  var view = views[stack.viewID]

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack.event)

  // remove stack
  if (view) delete view.__stacks__[stack.id]

  stack.terminated = true
  stack.addresses = []
}

module.exports = { stacker, clearStack }