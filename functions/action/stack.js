const { decode } = require("./decode")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const stacker = ({ _window, id: viewID, path = [], string = "", address = [], ...data }) => {

  var stack = {
    ...data,
    print: false,
    id: generate(),
    viewID,
    terminated: false,
    broke: false,
    returned: false,
    interpreting: true,
    string: string ? decode({ _window, string }) : "",
    executionStartTime: (new Date()).getTime(),
    addresses: toArray(address),
    logs: [],
    returns: [],
    type: path[1] || ""
  }

  stack.logs.push(`# Status (Duration) Type ID Index Action => HeadID HeadIndex HeadAction`)
  stack.logs.push(`0 Start STACK ${stack.id} ${stack.event.toUpperCase()} ${stack.string}`)

  return stack
}

const clearStack = ({ stack }) => {

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack.event.toUpperCase())

  stack.terminated = true
  stack.addresses = []
}

const printStack = ({ stack, end }) => {

  if (end && stack.print && !stack.interpreting && !stack.printed && stack.addresses.length === 0) {

    stack.printed = true
    var logs = `%cSTACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.event}`
    stack.logs.push(`${stack.logs.length} End STACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.id} ${stack.event}`)
    console.log(logs, "color: blue", stack.logs)
  }
}

module.exports = { stacker, clearStack, printStack }