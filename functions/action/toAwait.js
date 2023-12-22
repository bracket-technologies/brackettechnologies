const { lineInterpreter } = require("./lineInterpreter")

const toAwait = ({ _window, lookupActions, stack, address, id, e, req, res, __, _, awaiter }) => {

  const { execute } = require("./execute")
  
  var keepGoing = true

  if (address) awaitHandler({ _window, address, req, res, lookupActions, stack, id, e, _, __ })

  // get params
  while (!stack.terminated && stack.addresses.length > 0 && keepGoing) {

    var address = stack.addresses[0]
    if (keepGoing) keepGoing = !address.asynchronous
    if (keepGoing) awaitHandler({ _window, req, res, address, lookupActions, stack, id, e, __, keepGoing })
  }

  // override params
  if (awaiter) execute({ _window, lookupActions, stack, id, e, actions: awaiter, __, req, res})
}

const awaitHandler = ({ _window, req, res, address, lookupActions, stack, id, e, _, __, keepGoing }) => {

  if (address.await) {

    // modify underscores
    var my__ = _ !== undefined ? [_, ...(address.params.__ || __)] : (address.params.__ || __)

    // interpret
    var { success, message, data } = lineInterpreter({ _window, lookupActions, stack, headAddressID: address.headAddressID, id, e, req, res, ...(address.params || {}), data: address.await, __: my__ })
    
    console.log("ACTION", (new Date()).getTime() - address.executionStartTime, address.action, { success, message, data })

  } else console.log("ACTION", (new Date()).getTime() - address.executionStartTime, address.action)

  // get await index for splicing
  var index = stack.addresses.findIndex(await => await.id === address.id)
  if (index !== -1) stack.addresses.splice(index, 1)
  if (index !== 0) keepGoing = false
  
  // unlock head address
  if (address.headAddressID) {
    var otherWaiting = stack.addresses.findIndex(await => await.headAddressID === address.headAddressID)
    if (otherWaiting === -1) stack.addresses.find(await => await.id === address.headAddressID).asynchronous = false
  }
}

module.exports = { toAwait }