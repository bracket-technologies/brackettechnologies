const { encoded } = require("./encoded");
const { generate } = require("./generate");
const { lineInterpreter } = require("./lineInterpreter");

const addresser = ({ _window, stack, args = [], req, res, e, asynchronous, requesterID, action, DOMRendering, renderingID, __, id, _object, object, mount, toView, lookupActions, condition }) => {

    var global = _window ? _window.global : window.global
    var await = args[2], address = { id: generate(), requesterID, action, executionStartTime: (new Date()).getTime() }

    // data params
    var { data, executionDuration } = lineInterpreter({ _window, lookupActions, stack, req, res, id, e, __, data: args[1], _object, object })
    address.dataExecutionDuration = executionDuration

    // waits
    if (await) {

        if (encoded(await)) await = global.__refs__[await].data
        address = { ...address, await, asynchronous, status: "Start", DOMRendering, renderingID, params: { __, id, _object, object, mount, toView, lookupActions, condition, data } }
        
        // lock the head address
        if (global.__waitAdds__.length > 0) {
            address.headAddressID = global.__waitAdds__[0]
            stack.addresses.find(add => add.id === address.headAddressID).asynchronous = true
        }
    }

    // push to stack
    stack.addresses.unshift(address)

    return { address, data, __: [...(data !== undefined ? [data] : []), ...__] }
}

module.exports = { addresser }