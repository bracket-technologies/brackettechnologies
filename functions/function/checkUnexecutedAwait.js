const checkUnexecutedAwait = ({ _window, id, e, data, address, awaits, __, lookupActions }) => {

    var global = _window ? _window.global : window.global

    if (!awaits || awaits.findIndex(i => i.id === address.id) === 0) {
                
        if (_await) {

            toWait({ _window, lookupActions, id, e, address, awaits, __ })

        } else {

            awaits.splice(awaits.findIndex(i => i.id === address.id), 1)
            console.log({ action: "[...]()", data, success: true, message: "Action executed successfully!", path: (lookupActions || {}).path })
        }
    }
}

module.exports = { checkUnexecutedAwait }