const { toCode } = require("./toCode")
const { generate } = require("./generate")
const { isCondition } = require("./isCondition")
const { executable } = require("./executable")

const lineInterpreter = ({ _window, lookupActions, stack, headAddressID, address, id, e, data: string, req, res, __, mount, condition, dblExecute, toView, object, _object, index = 0, splitter = "?" }) => {

    require("./toParam")
    require("./toValue")
    require("./toApproval")

    // splitter is for ? or :
    // index is for using name?params?conditions?elseparams

    if (!string) return ({ success: false, message: `No action to execute!`, executionDuration: 0 })

    var global = _window ? _window.global : window.global
    var startTime = (new Date()).getTime(), success = true, data, returnForWaitActionExists = false

    // push address for waits
    if (headAddressID) global.__waitAdds__.unshift(headAddressID)

    string = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    if (string.charAt(0) === "@" && string.length === 6) string = global.__refs__[string].data

    var terminator = ({ data }) => {

        // remove address of waiter
        if (headAddressID) global.__waitAdds__.splice(0, 1)

        if (!address) return data
        
        // execute waits
        if (stack.addresses.findIndex(await => await.id === address.id) === 0)
            require("./toAwait").toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: returnForWaitActionExists ? data.data : undefined })
    
        // return data
        return data
    }

    // subparams
    if (index === 1) {

        // list
        var substring = string.split(splitter)[0]
        if (!substring) return terminator({ data: { success: false, message: `Missing name!`, executionDuration: 0 } })

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // name has subparams => interpret
        if (substring.includes("?")) {

            var data = lineInterpreter({ lookupActions, stack, id, e, data: substring, index: 1, req, res, __, mount, condition, toView, object, _object })
            if (data.conditionsNotApplied) return terminator({ data })
        }
    }

    var stringList = string.split(splitter)
    var conditions = stringList[index + 1]
    var elseParams = stringList[index + 2]
    string = stringList[index + 0]

    var execute = ({ success, message, string, conditionsNotApplied }) => {

        var actionReturnID = generate(), data
        global.__returnAdds__.unshift({ id: actionReturnID })

        // no params
        if (!string) message = "No actions to execute!"

        var action = "toValue"
        if (!dblExecute && (condition || isCondition({ _window, string: data }))) action = "toApproval"
        else if (!dblExecute && mount) action = "toParam"

        data = require(`./${action}`)[action]({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object, _object, toView })

        if (dblExecute && executable({ _window, string: data }))
            data = lineInterpreter({ lookupActions, stack, id, e, data, req, res, __, mount, condition, toView, object, _object }).data

        if (global.__returnAdds__[0].returned) {
            returnForWaitActionExists = true
            data = global.__returnAdds__[0].data
        }

        // remove return address
        global.__returnAdds__.splice(global.__returnAdds__.findIndex(ret => ret.id === actionReturnID), 1)

        return ({ success, message, data, conditionsNotApplied, executionDuration: (new Date()).getTime() - startTime })
    }

    var approved = require("./toApproval").toApproval({ _window, data: conditions || "", id, e, req, res, __, stack, lookupActions, object, _object })

    if (!approved && elseParams) data = execute({ success, string: elseParams, message: "Else actions executed!", conditionsNotApplied: true })
    else if (!approved) data = ({ success, message: `Conditions not applied!`, conditionsNotApplied: true, executionDuration: (new Date()).getTime() - startTime })
    else data = execute({ success, string, message: `Action executed successfully!` })

    return terminator({ data })
}

module.exports = { lineInterpreter }