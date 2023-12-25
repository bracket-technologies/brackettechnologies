const { decode } = require("./decode")
const { generate } = require("./generate")

const stacker = ({ _window, id: viewID, string = "", ...data }) => {

  return {
    ...data,
    id: generate(),
    viewID,
    string: string ? decode({ _window, string }) : "",
    executionStartTime: (new Date()).getTime(), 
    addresses: [], 
    logs: [], 
    returns: []
  }
}

const clearStack = ({ stack }) => {

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack.event)

  stack.terminated = true
  stack.addresses = []
}

module.exports = { stacker, clearStack }