const { clone } = require("./clone");
const { generate } = require("./generate");
const { lineInterpreter } = require("./lineInterpreter");

const addresser = ({ _window, stack = [], args = [], req, res, e, type = "action", status = "Wait", file, data = "", function: func, newLookupActions, headAddressID, headAddress = {}, blockable = true, dataInterpretAction, asynchronous = false, interpreting = false, renderer = false, action, __, id, object, mount, lookupActions, condition }) => {
    
    // find headAddress by headAddressID
    if (headAddressID && !headAddress.id) headAddress = stack.addresses.find(headAddress => headAddress.id === headAddressID)

    // address waits
    if (args[2]) headAddress = addresser({ _window, stack, req, res, e, type: "line", action: action + "::[...]", data: { string: args[2] }, headAddress, blockable, __, id, object, mount, lookupActions, condition }).address

    var address = { id: generate(), stackID: stack.id, viewID: id, type, data, status, file, function: func, hasWaits: args[2] ? true : false, headAddressID: headAddress.id, blockable, index: stack.addresses.length, action, asynchronous, interpreting, renderer, executionStartTime: (new Date()).getTime() }
    var stackLength = stack.addresses.length

    // find and lock the head address
    if (stackLength > 0 && !headAddress.id) {

        var headAddressIndex = 0
        
        // headAddress is interpreting or renderer
        while (headAddressIndex < stackLength && (!stack.addresses[headAddressIndex].interpreting && !stack.addresses[headAddressIndex].renderer)) { headAddressIndex += 1 }
        
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
            holdHeadAddress.hold = true
            headAddressID = holdHeadAddress.stackID === stack.id && holdHeadAddress.headAddressID
        }
    }

    // data
    var { data, executionDuration, action: interpretAction } = lineInterpreter({ _window, lookupActions, stack, req, res, id, e, __, data: { string: args[1] }, action: dataInterpretAction })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, object, mount, lookupActions: newLookupActions || lookupActions, condition }

    // push to stack
    stack.addresses.unshift(address)

    if (action === "search()" || action === "erase()" || action === "save()") address.action += ":" + data.collection
    
    // log
    if (!newLookupActions) stack.logs.push(`${stack.logs.length} ${address.status} ${type.toUpperCase()} ${address.id} ${address.index} ${address.action} => ${headAddress.id || ""} ${headAddress.index || 0} ${headAddress.action || ""}`)

    return { address, data, action: interpretAction, __: [...(data !== undefined ? [data] : []), ...__] }
}

const endAddress = ({ _window, stack, data, req, res, id, e, __, lookupActions }) => {
    
    const { toAwait } = require("./toAwait");
    var global = _window ? _window.global : window.global

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
            var stack = global.__stacks__[currentStackID]
            headAddressID = stack.interpretingAddressID

            while (headAddressID && headAddressID !== starterHeadAddress.id) {

                blockedAddress = stack.addresses.find(address => address.id === headAddressID)
                blockedAddress.blocked = true
                headAddressID = blockedAddress.headAddressID

                stack.blocked = true

                // address coming from different stack
                if (blockedAddress.stackID !== stack.id) stack = global.__stacks__[blockedAddress.stackID]
            }

            toAwait({ req, res, _window, lookupActions, stack, address, id, e, __, _: data })
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
    stack.logs.push(`${stack.logs.length} ${address.status}${address.status === "End" ? (" (" + ((new Date()).getTime() - address.executionStartTime) + ") ") : " "}${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action} => ${headAddress.id || ""} ${headAddress.index || 0} ${headAddress.action || ""}`)
}

module.exports = { addresser, printAddress, endAddress }