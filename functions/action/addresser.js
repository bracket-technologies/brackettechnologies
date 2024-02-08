const { generate } = require("./generate");
const { lineInterpreter } = require("./lineInterpreter");
//const { stacker } = require("./stack");

const addresser = ({ _window, stack = [], args = [], req, res, e, type = "action", status = "Wait", file, data = "", function: func, newLookupActions, headAddressID, headAddress = {}, blockable = true, interpretByValue = false, asynchronous = false, interpreting = false, renderer = false, action, __, id, object, mount, toView, lookupActions, condition }) => {

    // find headAddress by headAddressID
    if (headAddressID && !headAddress.id) headAddress = stack.addresses.find(headAddress => headAddress.id === headAddressID)

    // address waits
    if (args[2]) headAddress = addresser({ _window, stack, req, res, e, type: "line", action: action + "::[...]", data: { string: args[2] }, headAddress, blockable, interpretByValue, __, id, object, mount, toView, lookupActions, condition }).address

    var address = { id: generate(), viewID: id, type, data, status, file, function: func, hasWaits: args[2] ? true : false, headAddressID: headAddress.id, blockable, index: stack.addresses.length, action, asynchronous, interpreting, renderer, executionStartTime: (new Date()).getTime() }
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

        var headAddressID = address.headAddressID
        while (headAddressID) {
            
            var holdHeadAddress = stack.addresses.find(headAddress => headAddress.id === headAddressID)
            holdHeadAddress.hold = true
            headAddressID = holdHeadAddress.headAddressID
        }
    }

    // data
    var { data, executionDuration } = lineInterpreter({ _window, lookupActions, stack, req, res, id, e, __, data: { string: args[1] }, action: interpretByValue && "toValue" })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, object, mount, toView, action, lookupActions: newLookupActions || lookupActions, condition }

    // push to stack
    stack.addresses.unshift(address)

    if (action === "search()" || action === "erase()" || action === "save()") address.action += ":" + data.collection
    
    // log
    if (!newLookupActions) stack.logs.push(`${stack.logs.length} ${address.status} ${type.toUpperCase()} ${address.id} ${address.index} ${address.action} => ${headAddress.id || ""} ${headAddress.index || 0} ${headAddress.action || ""}`)

    return { address, data, __: [...(data !== undefined ? [data] : []), ...__] }
}

const printAddress = ({ stack, address, headAddress }) => {
    stack.logs.push(`${stack.logs.length} ${address.status}${address.status === "End" ? (" (" + ((new Date()).getTime() - address.executionStartTime) + ") ") : " "}${address.type.toUpperCase()} ${address.id} ${address.index} ${address.type === "function" ? address.function : address.action} => ${headAddress.id || ""} ${headAddress.index || 0} ${headAddress.action || ""}`)
}

module.exports = { addresser, printAddress }