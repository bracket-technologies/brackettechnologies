const { decode } = require("./decode")
const { generate } = require("./generate")
const { toArray } = require("./toArray")

const openStack = ({ _window, id: viewID, string = "", headAddress, headStack, ...data }) => {

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
    addresses: toArray(headAddress),
    logs: [],
    returns: []
  }

  if (headStack) stack.headStackID = headStack.id

  stack.logs.push(`# Status TYPE ID Index Action => HeadID HeadIndex HeadAction`)
  stack.logs.push(`1 Start STACK ${stack.id} ${stack.event.toUpperCase()} ${stack.string}`)

  const global = _window ? _window.global : window.global
  global.__stacks__[stack.id] = stack

  return stack
}

const clearStack = ({ stack }) => {

  console.log("STACK", (new Date()).getTime() - stack.executionStartTime, stack.event.toUpperCase())

  stack.terminated = true
  stack.addresses = []
}

const endStack = ({ _window, stack, end }) => {

  if (end && stack.addresses.length === 0) {

    var logs = `%cSTACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.event}`
    stack.logs.push(`${stack.logs.length} End STACK ${(new Date()).getTime() - stack.executionStartTime} ${stack.id} ${stack.event}`)

    // remove stack
    delete (_window ? _window.global : window.global).__stacks__[stack.id]

    // print stack
    stack.print && !stack.printed && console.log(logs, "color: blue", stack.logs)
    stack.printed = true
  }
}

module.exports = { openStack, clearStack, endStack }