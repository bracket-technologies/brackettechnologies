const { decode } = require("./decode")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const stacker = ({ _window, id: viewID, string = "", address = [], ...data }) => {

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
    returns: []
  }

  stack.logs.push(`STACK start ${stack.id} ${stack.event} ${stack.string}`)

  return stack
}

const clearStack = ({ stack }) => {

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack.event)

  stack.terminated = true
  stack.addresses = []
}

const printStack = ({ stack, end }) => {

  if (end && stack.print && !stack.interpreting && !stack.printed && stack.addresses.length === 0) {

    stack.printed = true
    var logs = `%cSTACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.event}`
    stack.logs.push(`STACK end ${(new Date()).getTime() - stack.executionStartTime} ${stack.id} ${stack.event}`)
    console.log(logs, "color: blue", stack.logs)
  }
}

module.exports = { stacker, clearStack, printStack }