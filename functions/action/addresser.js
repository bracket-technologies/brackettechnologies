const { generate } = require("./generate");
const { lineInterpreter } = require("./lineInterpreter");
//const { stacker } = require("./stack");

const addresser = ({ _window, stack = [], args = [], req, res, e, type = "action", status = "start", file, data = "", function: func, headAddress = {}, interpretByValue = false, asynchronous = false, interpreting = false, renderer = false, requesterID, action, __, id, _object, object, mount, toView, lookupActions, condition }) => {

    var address = { id: generate(), type, data: args[2] || data, status, file, function: func, headAddressID: headAddress.id, headAddressrequesterID: requesterID || id, index: stack.addresses.length, action, asynchronous, interpreting, renderer, executionStartTime: (new Date()).getTime(), hold: true }
    var stackLength = stack.addresses.length

    // find and lock the head address
    if (stackLength > 0 && !headAddress.id) {

        var headAddressIndex = 0
        
        // get the head address by knowing who is being interpreted
        while (headAddressIndex < stackLength && (!stack.addresses[headAddressIndex].interpreting && !stack.addresses[headAddressIndex].renderer)) { headAddressIndex += 1 }

        // there exist a head address
        if (headAddressIndex < stackLength) {
            
            address.headAddressID = stack.addresses[headAddressIndex].id

            // set all head addresses asynchronous
            if (asynchronous) {

                var headAddressID = address.headAddressID
                while (headAddressID) {
                    
                    var headAddress = stack.addresses.find(waitingAddress => waitingAddress.id === headAddressID)
                    headAddress.asynchronous = true
                    headAddressID = headAddress.headAddressID
                }
            }

            // get head address
            headAddress = stack.addresses.find(waitingAddress => waitingAddress.id === address.headAddressID)
        }
    }

    // data
    var { data, executionDuration } = lineInterpreter({ _window, lookupActions, stack, req, res, id, e, action: interpretByValue && "toValue", __, data: args[1], _object, object })
    address.paramsExecutionDuration = executionDuration

    // pass params
    address.params = { __, id, _object, object, mount, toView, lookupActions, condition }

    // push to stack
    stack.addresses.unshift(address)

    // print collection with action name
    if (action === "search()" || action === "save()" || action === "erase()") address.action += " " + data.collection
    
    // log
    stack.logs.push(`${stack.logs.length} ACTION ${type} ${status} ${address.id} ${address.index} ${address.action}${headAddress.id ? ` ${headAddress.id || ""} ${headAddress.index !== undefined ? headAddress.index : ""} ${headAddress.action || ""}` : ""}`)

    return { address, data, __: [...(data !== undefined ? [data] : []), ...__] }
}

module.exports = { addresser }