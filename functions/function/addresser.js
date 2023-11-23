const { encoded } = require("./encoded")

const addresser = ({ _window, awaits, await, hold = true, address, requesterID, callerActionName, DOMRendering, renderingID }) => {

    var global = _window ? _window.global : window.global

    if (!await) return 

    if (encoded(await)) await = global.__codes__[await]
    address = toArray(address).unshift({ id: generate(), await, hold, requesterID, callerActionName, creationDate: (new Date()).getTime(), status: "Waiting", DOMRendering, renderingID })
    awaits.unshift(address)

    if (global.__waiters__.length > 0) address.waiter = global.__waiters__[0]

    return address
}

module.exports = { addresser }