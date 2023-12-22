const checkUnexecutedAwait = ({ _window, id, e, data, address, stack, __, lookupActions }) => {

    if (stack.addresses.findIndex(await => await.id === address.id) === 0) {
                
        if (_await) {

            toWait({ _window, lookupActions, id, e, address, stack, __ })

        } else {

            stack.addresses.splice(stack.addresses.findIndex(i => i.id === address.id), 1)
            console.log({ action: "[...]()", data, success: true, message: "Action executed successfully!", path: (lookupActions || {}).path })
        }
    }
}

module.exports = { checkUnexecutedAwait }