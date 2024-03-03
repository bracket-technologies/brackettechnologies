const { printAddress } = require("./addresser")
const { clone } = require("./clone")
const { toLine } = require("./toLine")
const { endStack } = require("./stack")
const { logger } = require("./logger")

const toAwait = ({ _window, req, res, address = {}, addressID, lookupActions, stack, id, e, _, __, action }) => {

  const { toView, toHTML, documenter, update } = require("./toView")

  const global = _window ? _window.global : window.global

  if (addressID && !address.id) address = stack.addresses.find(address => address.id === addressID)
  if (!address.id || stack.terminated || address.hold || address.starter || address.end) return

  // params
  address.params = address.params || {}

  // modify underscores
  var my__ = _ !== undefined ? [_, ...(address.params.__ || __)] : (address.params.__ || __)

  // unblock stack
  if (stack.blocked && !address.blocked) stack.blocked = false

  // address
  var nextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID) || {}

  if (address.blocked || address.status === "Start") {

    address.status = address.blocked ? "Block" : "End"
    address.end = true
    address.interpreting = false
    printAddress({ stack, address, nextAddress })

    // remove address
    var index = stack.addresses.findIndex(waitingAddress => waitingAddress.id === address.id)
    if (index !== -1) stack.addresses.splice(index, 1)

    // pass underscores to waits
    if (address.hasWaits && nextAddress.params) nextAddress.params.__ = my__

    // logger
    if (address.logger && address.logger.end) logger({ _window, data: { key: address.logger.key, end: true } })

  } else if (address.status === "Wait") {

    address.status = "Start"
    address.interpreting = true
    printAddress({ stack, address, nextAddress })

    stack.interpretingAddressID = address.id

    // logger
    if (address.logger && address.logger.start) logger({ _window, data: { key: address.logger.key, start: true } })

    if (address.function) {

      var func = address.function || "toLine"
      var file = address.file || func
      var data = { _window, lookupActions, stack, id, e, req, res, address, nextAddress, ...(address.params || {}), data: address.data, __: my__, action }

      if (func === "toView") toView(data)
      else if (func === "toHTML") toHTML(data)
      else if (func === "update") update(data)
      else if (func === "documenter") documenter(data)
      
      address.interpreting = false

      return !address.asynchronous && toAwait({ _window, lookupActions, stack, address, id, e, req, res, __: my__, action })

    } else if (address.type === "line" || address.type === "waits" || address.type === "action") return toLine({ _window, lookupActions, address, stack, id, e, req, res, ...(address.params || {}), data: address.data, __: my__, action })
  }

  if (stack.terminated) return

  // asynchronous unholds nextAddresses
  if (address.nextAddressID && !nextAddress.interpreting && (nextAddress.stackID || nextAddress.hold || nextAddress.status === "Wait")) {

    var otherWaiting = stack.addresses.findIndex(waitingAddress => waitingAddress.nextAddressID === address.nextAddressID)
    
    if (otherWaiting === -1 || (otherWaiting > -1 && !stack.addresses.find(waitingAddress => waitingAddress.nextAddressID === address.nextAddressID && !address.blocked))) {

      nextAddress.hold = false
      return toAwait({ _window, lookupActions, stack, address: nextAddress, id, req, res, __, action, e })
    }
  }

  endStack({ _window, stack, end: true })

  // address is for another stack
  address.stackID !== stack.id && global.__stacks__[address.stackID] && toAwait({ _window, lookupActions, stack: global.__stacks__[address.stackID], address, id, e, req, res, __, action })
}

module.exports = { toAwait }