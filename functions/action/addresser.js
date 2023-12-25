const { encoded } = require("./encoded");
const { generate } = require("./generate");
const { lineInterpreter } = require("./lineInterpreter");

const addresser = ({ _window, stack = [], args = [], req, res, e, asynchronous = false, interpreting = false, requesterID, action, DOMRendering, renderingID, __, id, _object, object, mount, toView, lookupActions, condition }) => {

    var global = _window ? _window.global : window.global
    var await = args[2], address = { id: generate(), requesterID, index: stack.addresses.length, action, asynchronous, interpreting, executionStartTime: (new Date()).getTime(), hold: true, await: "", DOMRendering, renderingID }
    var headAddress = {}

    // lock the head address
    if (stack.addresses.length > 0) {

        var headAddressIndex = 0
        
        // get the head address by knowing who is being interpreted
        while (!stack.addresses[headAddressIndex].interpreting) { headAddressIndex += 1 }
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

    // data params
    var { data, executionDuration } = lineInterpreter({ _window, lookupActions, stack, req, res, id, e, __, data: args[1], _object, object })
    address.dataExecutionDuration = executionDuration

    if (action === "search()") action += " " + data.collection
    
    var log = ["ACTION start", address.id, address.index, action, headAddress.id || "", headAddress.index || "", headAddress.action || ""].join(" ")
    stack.logs.push(log)
    console.log(log);

    // waits
    if (await) {

        if (encoded(await)) await = global.__refs__[await].data
        address = { ...address, await, status: "Start", params: { __, id, _object, object, mount, toView, lookupActions, condition, data } }
    }

    // push to stack
    stack.addresses.unshift(address)

    return { address, data, __: [...(data !== undefined ? [data] : []), ...__] }
}

module.exports = { addresser }