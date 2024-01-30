const { printAddress } = require("./addresser")
const { clone } = require("./clone")
const { lineInterpreter } = require("./lineInterpreter")
const { printStack } = require("./stack")

const toAwait = ({ _window, req, res, address = {}, addressID, lookupActions, stack, id, e, _, __ }) => {

  if (addressID && !address.id) address = stack.addresses.find(address => address.id === addressID)
  if (stack.terminated || address.hold) return

  // params
  address.params = address.params || {}

  // modify underscores
  var my__ = _ !== undefined ? [_, ...(address.params.__ || __)] : (address.params.__ || __)
  
  // address
  var headAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID) || {}
  
  // unbreak action
  stack.returned = false

  if (address.blocked || address.status === "Start") {

    address.status = address.blocked ? "Block" : "End"
    address.interpreting = false
    printAddress({ stack, address, headAddress })
    
    // get await index for splicing
    var index = stack.addresses.findIndex(waitingAddress => waitingAddress.id === address.id)
    if (index !== -1) stack.addresses.splice(index, 1)

    // pass underscores to waits
    if (address.hasWaits && headAddress.params) headAddress.params.__ = my__
    
  } else if (address.status === "Wait") {

    address.status = "Start"
    address.interpreting = true
    printAddress({ stack, address, headAddress })

    stack.interpretingAddressID = address.id
    
    if (address.function) return addressFunctionExecuter({ _window, lookupActions, stack, id, e, req, res, address, headAddress, __: my__ })
    else if (address.type === "line" || address.type === "action") return lineInterpreter({ _window, lookupActions, address, stack, id, e, req, res, ...(address.params || {}), data: address.data, __: my__ })
  }

  if (stack.terminated) return

  // asynchronous unholds headAddresses
  if (address.headAddressID && !headAddress.interpreting && (headAddress.hold || headAddress.status === "Wait")) {
    
    var otherWaiting = stack.addresses.findIndex(waitingAddress => waitingAddress.headAddressID === address.headAddressID)
    
    if (otherWaiting === -1 || (otherWaiting > -1 && otherWaiting.blocked)) {
      
      headAddress.hold = false
      return toAwait({ _window, lookupActions, stack, address: headAddress, id, e, req, res, __ })
    }
  }

  printStack({ stack, end: true })
}

const addressFunctionExecuter = ({ _window, lookupActions, stack, id, e, req, res, address, __ }) => {

  require("./toView")
  require("./toHTML")
  require("./reducer")

  var method = address.function || "lineInterpreter"
  var file = address.file || method
  
  require(`./${file}`)[method]({ _window, lookupActions, stack, id, e, req, res, address, ...(address.params || {}), data: address.data, __ })
  
  address.interpreting = false
  
  !address.asynchronous && toAwait({ _window, lookupActions, stack, address, id, e, req, res, __ })
}

module.exports = { toAwait, addressFunctionExecuter }