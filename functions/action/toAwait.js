const { lineInterpreter } = require("./lineInterpreter")

const toAwait = ({ _window, lookupActions, stack = {}, address, id, e, req, res, __, _, awaiter }) => {
  
  const { execute } = require("./execute")

  if (stack.terminated) return
  
  var keepGoing = true

  if (address) awaitHandler({ _window, address, req, res, lookupActions, stack, id, e, _, __ })

  // get params
  while (!stack.terminated && stack.addresses.length > 0 && keepGoing) {

    if (stack.terminated) return keepGoing = false

    var address = stack.addresses[0]
    if (keepGoing) keepGoing = !address.hold
    if (keepGoing) awaitHandler({ _window, req, res, address, lookupActions, stack, id, e, __, keepGoing })
  }

  // override params
  if (awaiter) execute({ _window, lookupActions, stack, id, e, actions: awaiter, __, req, res})
}

const awaitHandler = ({ _window, req, res, address, lookupActions, stack, id, e, _, __, keepGoing }) => {

  // passed params
  address.params = address.params || {}

  // modify underscores
  var my__ = _ !== undefined ? [_, ...(address.params.__ || __)] : (address.params.__ || __)

  // address
  var headAddress = stack.addresses.find(waitingAddress => waitingAddress.id === address.headAddressID) || {}

  var log = ["ACTION end", (new Date()).getTime() - address.executionStartTime, address.id, address.index, address.action, headAddress.id || "", headAddress.index || "", headAddress.action || ""].join(" ")
  stack.logs.push(log)
  console.log(log, _ === undefined ? "" : _)

  // get await index for splicing
  var index = stack.addresses.findIndex(waitingAddress => waitingAddress.id === address.id)
  if (index !== -1) stack.addresses.splice(index, 1)
  if (index !== 0) keepGoing = false

  // consider that waits are part of the head action => reset interpreting to true for head action
  if (headAddress.id) headAddress.interpreting = true

  // unbreak action
  stack.returned = false

  // interpret
  lineInterpreter({ _window, lookupActions, stack, id, e, req, res, ...(address.params || {}), data: address.await, __: my__ })

  if (stack.terminated) return

  // unlock head address
  if (address.headAddressID && address.asynchronous) {
    var otherWaiting = stack.addresses.findIndex(waitingAddress => waitingAddress.headAddressID === address.headAddressID)
    if (otherWaiting === -1) stack.addresses.find(waitingAddress => waitingAddress.id === address.headAddressID).hold = false
  }
}

module.exports = { toAwait }