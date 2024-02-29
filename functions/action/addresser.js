const { clone } = require("./clone");
const { generate } = require("./generate");
const { toLine } = require("./toLine");

const addresser = ({ _window, stack = [], args = [], req, res, e, type = "action", status = "Wait", file, data = "", waits, noHeadAddress, hasWaits, params, function: func, newLookupActions, headAddressID, headAddress = {}, blocked, blockable = true, dataInterpretAction, asynchronous = false, interpreting = false, renderer = false, action, __, id, object, mount, lookupActions, condition }) => {
    
    // find headAddress by headAddressID
    if (headAddressID && !headAddress.id && !noHeadAddress) headAddress = stack.addresses.find(headAddress => headAddress.id === headAddressID)

    // waits
    waits = waits || args[2], params = params || args[1] || ""

    // address waits
    if (waits) headAddress = addresser({ _window, stack, req, res, e, type: "waits", action: action + "::[...]", data: { string: waits }, headAddress, blockable, __, id, object, mount, lookupActions, condition }).address

    var address = { id: generate(), stackID: stack.id, noHeadAddress, viewID: id, type, data, status, file, function: func, hasWaits: hasWaits || (waits ? true : false), headAddressID: headAddress.id, blocked, blockable, index: stack.addresses.length, action, asynchronous, interpreting, renderer, executionStartTime: (new Date()).getTime() }
    var stackLength = stack.addresses.length

    // find and lock the head address
    if (stackLength > 0 && !headAddress.id && !noHeadAddress) {

        var headAddressIndex = 0
        
        // headAddress is interpreting or renderer
        while (headAddressIndex < stackLength && !stack.addresses[headAddressIndex].interpreting && !stack.addresses[headAddressIndex].renderer) { headAddressIndex += 1 }
        
        // there exist a head address
        if (headAddressIndex < stackLength) {
            
            address.headAddressID = stack.addresses[headAddressIndex].id

            // get head address
            headAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID)
        }
    }

    // set all head addresses asynchronous
    if (asynchronous) {

        var headAddressID = address.stackID === stack.id && address.headAddressID
        while (headAddressID) {
            
            var holdHeadAddress = stack.addresses.find(headAddress => headAddress.id === headAddressID)
            if (holdHeadAddress) {
                holdHeadAddress.hold = true
                headAddressID = holdHeadAddress.stackID === stack.id && holdHeadAddress.headAddressID
            } else headAddressID = false
        }
    }

    // data
    var { data, executionDuration, action: interpretAction } = toLine({ _window, lookupActions, stack, req, res, id, e, __, data: { string: params }, action: dataInterpretAction })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, object, mount, lookupActions: newLookupActions || lookupActions, condition }

    // push to stack
    stack.addresses.unshift(address)

    if (action === "search()" || action === "erase()" || action === "save()") address.action += ":" + data.collection
    
    // log
    if (!newLookupActions) stack.logs.push(`${stack.logs.length} ${address.status} ${type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action}${headAddress.id ? ` => ${headAddress.id || ""} ${headAddress.index !== undefined ? headAddress.index : ""} ${headAddress.type === "function" ? headAddress.function : headAddress.action || ""}` : ""}`)

    return { address, data, stack, action: interpretAction, __: [...(data !== undefined ? [data] : []), ...__] }
}

const endAddress = ({ _window, stack, data, req, res, id, e, __, lookupActions }) => {
    
    const { toAwait } = require("./toAwait");
    const global = _window ? _window.global : window.global

    var executionDuration = (new Date()).getTime() - stack.executionStartTime
            
    data.success = data.success !== undefined ? data.success : true
    data.message = data.message || data.msg || "Action ended successfully!"
    data.executionDuration = executionDuration
    delete data.msg

    var starter = false, headAddressID = stack.interpretingAddressID, currentStackID = stack.id
    var address = stack.addresses.find(address => address.id === headAddressID)

    var endStarterAddress = ({ address, stack }) => {
        
        address.starter = false

        // get start headAddress to push data to its underscores
        var starterHeadAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID)
        if (starterHeadAddress) {

            // start again from the current interpreting address to reach headAddress to set blocked
            var stack = global.__stacks__[currentStackID], blockedAddress = true
            headAddressID = stack.interpretingAddressID

            while (blockedAddress && headAddressID && headAddressID !== starterHeadAddress.id) {

                blockedAddress = stack.addresses.find(address => address.id === headAddressID)
                if (blockedAddress) {
                    blockedAddress.blocked = true
                    headAddressID = blockedAddress.headAddressID

                    stack.blocked = true

                    // address coming from different stack
                    if (blockedAddress.stackID !== stack.id) stack = global.__stacks__[blockedAddress.stackID]
                }
            }
            
            toAwait({ req, res, _window, lookupActions, stack: global.__stacks__[starterHeadAddress.stackID], address, id, e, __, _: data })
        }
    }

    if (data.id) {

        if (!global.__startAddresses__[data.id]) return
        var stack = global.__stacks__[global.__startAddresses__[data.id].address.stackID]
        var address = global.__startAddresses__[data.id].address

        delete data.id
        delete global.__startAddresses__[data.id]

        endStarterAddress({ address, stack })

    } else {

        while (!starter && headAddressID && stack) {

            // start from self address (by interpretingAddressID) to reach the start head address
            var address = stack.addresses.find(address => address.id === headAddressID)
            
            if (address.starter) {

                starter = true
                endStarterAddress({ address, stack })
            }

            // move to head address
            headAddressID = address.headAddressID

            // reached index 0 address => check stack if it has headAddress
            if (address.stackID !== stack.id) stack = global.__stacks__[address.stackID]
        }
    }
}

const printAddress = ({ stack, address, headAddress }) => {
    if (!headAddress) headAddress = stack.addresses.find(headAddress => headAddress.id === address.headAddressID) || {}
    stack.logs.push(`${stack.logs.length} ${address.status}${address.status === "End" ? (" (" + ((new Date()).getTime() - address.executionStartTime) + ") ") : " "}${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action}${headAddress.id ? ` => ${headAddress.id || ""} ${headAddress.index !== undefined ? headAddress.index : ""} ${headAddress.type === "function" ? headAddress.function : headAddress.action || ""}` : ""}`)
}

module.exports = { addresser, printAddress, endAddress }