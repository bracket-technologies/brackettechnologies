const { addresser } = require("./addresser")
const { lineInterpreter } = require("./lineInterpreter")
const { printStack } = require("./stack")

const toAwait = ({ _window, lookupActions, stack = {}, address, id, e, req, res, __, _, executer }) => {

  if (stack.terminated) return
  
  var keepGoing = true, executer = executer || (address.id + " " + address.index + " " + address.action)

  if (address) awaitHandler({ _window, address, req, res, lookupActions, stack, id, e, _, __, executer })

  // get params
  while (!stack.terminated && stack.addresses.length > 0 && keepGoing) {

    if (stack.terminated) return keepGoing = false

    var address = stack.addresses[0]
    if (keepGoing) keepGoing = !address.hold && !address.interpreting
    if (keepGoing) awaitHandler({ _window, req, res, address, lookupActions, stack, id, e, __, keepGoing, executer })
  }
  
  printStack({ stack, end: true })
}

const awaitHandler = ({ _window, req, res, address, lookupActions, stack, id, e, _, __, keepGoing, executer }) => {

  // params
  address.params = address.params || {}

  // modify underscores
  var my__ = _ !== undefined ? [_, ...(address.params.__ || __)] : (address.params.__ || __)

  // address
  var headAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID) || {}
  
  // unbreak action
  stack.returned = false

  if (address.status === "start") {
  
    // get await index for splicing
    var index = stack.addresses.findIndex(waitingAddress => waitingAddress.id === address.id)
    if (index !== -1) stack.addresses.splice(index, 1)
    if (index !== 0) keepGoing = false

    address.status = "end"
    address.interpreting = false
    stack.logs.push(`${stack.logs.length} ACTION ${address.type} ${address.status} ${(new Date()).getTime() - address.executionStartTime} ${address.id} ${address.index} ${address.action}${headAddress.id ? ` ${headAddress.id || ""} ${headAddress.index !== undefined ? headAddress.index : ""} ${headAddress.action || ""}` : ""} | executer: ${executer}`)

    if (address.data) {
      
      // address 
      var { address: add } = addresser({ _window, req, res, stack, e, type: "waits", id, ...(address.params || {}), __: my__, asynchronous: address.asynchronous, renderer: address.renderer, interpreting: true, headAddress, requesterID: id, action: address.action + "::[...]" })

      // interpret
      return lineInterpreter({ _window, lookupActions, address: add, stack, id, e, req, res, ...(address.params || {}), data: address.data, __: my__ })
    }

  } else if (address.status === "waiting") {

    return addressFunctionExecuter({ _window, lookupActions, stack, id, e, req, res, address, headAddress, __: my__, executer })

  } else if (address.status === "executing") {
    
    // get await index for splicing
    var index = stack.addresses.findIndex(waitingAddress => waitingAddress.id === address.id)
    if (index !== -1) stack.addresses.splice(index, 1)
    if (index !== 0) keepGoing = false

    address.status = "end"
    stack.logs.push(`${stack.logs.length} ACTION ${address.type} ${address.status} ${(new Date()).getTime() - address.executionStartTime} ${address.id} ${address.index} ${address.action}${headAddress.id ? ` ${headAddress.id || ""} ${headAddress.index !== undefined ? headAddress.index : ""} ${headAddress.action || ""}` : ""} | executer: ${executer}`)
  }

  if (stack.terminated) return
  
  // unlock head address
  if (address.headAddressID && (address.asynchronous || address.renderer)) {
    
    var otherWaiting = stack.addresses.findIndex(waitingAddress => waitingAddress.headAddressID === address.headAddressID)
    var headAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID)

    if (otherWaiting === -1 && headAddress && !headAddress.interpreting) {
      
      headAddress.hold = false
      toAwait({ _window, lookupActions, stack, address: headAddress, id, e, req, res, __, executer })
    }
  }
}

const addressFunctionExecuter = ({ _window, lookupActions, stack, id, e, req, res, address, headAddress, __, executer }) => {

  require("./toView")
  require("./toHTML")
  require("./reducer")

  address.status = "start"
  stack.logs.push(`${stack.logs.length} ACTION ${address.type} ${address.status} ${address.id} ${address.index} ${address.action}${headAddress.id ? ` ${headAddress.id || ""} ${headAddress.index !== undefined ? headAddress.index : ""} ${headAddress.action || ""}` : ""}`)

  address.status = "executing"
  var method = address.function || "lineInterpreter"
  var file = address.file || method
  
  address.interpreting = true
  require(`./${file}`)[method]({ _window, lookupActions, stack, id, e, req, res, address, ...(address.params || {}), data: address.data, __ })
  address.interpreting = false
  
  toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, executer })
}

module.exports = { toAwait }