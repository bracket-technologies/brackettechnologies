const { clone } = require("./clone");
const { generate } = require("./generate");
const { toLine } = require("./toLine");

const addresser = ({ _window, addressID = generate(), index = 0, switchWithAddress, switchWithRunningAddress, stack = [], args = [], req, res, e, type = "action", status = "Wait", file, data = "", waits, hasWaits, params, function: func, newLookupActions, nextAddressID, nextAddress = {}, blocked, blockable = true, dataInterpretAction, asynchronous = false, interpreting = false, renderer = false, action, __, id, object, mount, lookupActions, condition }) => {
    
    if (switchWithAddress) {

        nextAddressID = switchWithAddress.nextAddressID
        hasWaits = switchWithAddress.hasWaits
        switchWithAddress.nextAddressID = addressID
        switchWithAddress.hasWaits = false
        switchWithAddress.interpreting = false
        // switchWithAddress.status = "Wait"

    } else if (switchWithRunningAddress) {

        nextAddressID = switchWithRunningAddress.nextAddressID
        hasWaits = switchWithRunningAddress.hasWaits
        switchWithRunningAddress.nextAddressID = addressID
        switchWithRunningAddress.hasWaits = false
    }

    // find nextAddress by nextAddressID
    if (nextAddressID && !nextAddress.id) nextAddress = stack.addresses.find(nextAddress => nextAddress.id === nextAddressID) || {}
    
    // waits
    waits = waits || args[2], params = params || args[1] || ""

    // address waits
    if (waits) nextAddress = addresser({ _window, stack, req, res, e, type: "waits", action: action + "::[...]", data: { string: waits }, nextAddress, blockable, __, id, object, mount, lookupActions, condition }).address

    var address = { id: addressID, stackID: stack.id, viewID: id, type, data, status, file, function: func, hasWaits: hasWaits !== undefined ? hasWaits : (waits ? true : false), nextAddressID: nextAddress.id, blocked, blockable, index: stack.addresses.length, action, asynchronous, interpreting, renderer, executionStartTime: (new Date()).getTime() }
    var stackLength = stack.addresses.length

    // find and lock the head address
    if (stackLength > 0 && !nextAddress.id) {

        var nextAddressIndex = 0
        
        // nextAddress is interpreting or renderer
        while (nextAddressIndex < stackLength && !stack.addresses[nextAddressIndex].interpreting && !stack.addresses[nextAddressIndex].renderer) { nextAddressIndex += 1 }
        
        // there exist a head address
        if (nextAddressIndex < stackLength) {
            
            address.nextAddressID = stack.addresses[nextAddressIndex].id

            // get head address
            nextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID)
        }
    }

    // set all head addresses asynchronous
    if (asynchronous) {

        var nextAddressID = address.stackID === stack.id && address.nextAddressID
        while (nextAddressID) {
            
            var holdnextAddress = stack.addresses.find(nextAddress => nextAddress.id === nextAddressID)
            if (holdnextAddress) {
                holdnextAddress.hold = true
                nextAddressID = holdnextAddress.stackID === stack.id && holdnextAddress.nextAddressID
            } else nextAddressID = false
        }
    }

    // data
    var { data, executionDuration, action: interpretAction } = toLine({ _window, lookupActions, stack, req, res, id, e, __, data: { string: params }, action: dataInterpretAction })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, object, mount, lookupActions: newLookupActions || lookupActions, condition }

    // push to stack
    if (index) stack.addresses.splice(index, 0, address)
    else stack.addresses.unshift(address)

    if (action === "search()" || action === "erase()" || action === "save()") address.action += ":" + data.collection + (data.doc || "")
    
    // log
    if (address.status !== "Wait") printAddress({ stack, address, nextAddress, newAddress: true })

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

    var starter = false, nextAddressID = stack.interpretingAddressID, currentStackID = stack.id
    var address = stack.addresses.find(address => address.id === nextAddressID)

    var endStarterAddress = ({ address, stack }) => {
        
        address.starter = false

        // get start nextAddress to push data to its underscores
        var starternextAddress = stack.addresses.find(nextAddress => nextAddress.id === address.nextAddressID)
        if (starternextAddress) {

            // start again from the current interpreting address to reach nextAddress to set blocked
            var stack = global.__stacks__[currentStackID], blockedAddress = true
            nextAddressID = stack.interpretingAddressID

            while (blockedAddress && nextAddressID && nextAddressID !== starternextAddress.id) {

                blockedAddress = stack.addresses.find(address => address.id === nextAddressID)
                if (blockedAddress) {
                    blockedAddress.blocked = true
                    nextAddressID = blockedAddress.nextAddressID

                    stack.blocked = true

                    // address coming from different stack
                    if (blockedAddress.stackID !== stack.id) stack = global.__stacks__[blockedAddress.stackID]
                }
            }
            
            toAwait({ req, res, _window, lookupActions, stack: global.__stacks__[starternextAddress.stackID], address, id, e, __, _: data })
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

        while (!starter && nextAddressID && stack) {

            // start from self address (by interpretingAddressID) to reach the start head address
            var address = stack.addresses.find(address => address.id === nextAddressID)
            
            if (address.starter) {

                starter = true
                endStarterAddress({ address, stack })
            }

            // move to head address
            nextAddressID = address.nextAddressID

            // reached index 0 address => check stack if it has nextAddress
            if (address.stackID !== stack.id) stack = global.__stacks__[address.stackID]
        }
    }
}

const printAddress = ({ stack, address, nextAddress = {}, newAddress }) => {

    if (newAddress) stack.logs.push(`${stack.logs.length} ${address.status} ${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action}${nextAddress.id ? ` => ${nextAddress.id || ""} ${nextAddress.index !== undefined ? nextAddress.index : ""} ${nextAddress.type === "function" ? nextAddress.function : nextAddress.action || ""}` : ""}`)
    else stack.logs.push(`${stack.logs.length} ${address.status}${address.status === "End" ? (" (" + ((new Date()).getTime() - address.executionStartTime) + ") ") : " "}${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action}${nextAddress.id ? ` => ${nextAddress.id || ""} ${nextAddress.index !== undefined ? nextAddress.index : ""} ${nextAddress.type === "function" ? nextAddress.function : nextAddress.action || ""}` : ""}`)
    // console.log(stack.logs.at(-1));
}

const resetAddress = ({ address, ...data }) => {
    
    Object.entries(data || {}).map(([key, value]) => {
        address[key] = value
    })
}

module.exports = { addresser, printAddress, endAddress, resetAddress }