const { toCode } = require("./toCode")
const { generate } = require("./generate")
const { isCondition } = require("./isCondition")
const { executable } = require("./executable")
const { stacker } = require("./stack")

const lineInterpreter = ({ _window, lookupActions, stack, address = {}, id, e, action, event, data: string, req, res, __, mount, condition, dblExecute, toView, object, _object, index = 0, splitter = "?" }) => {

    require("./toParam")
    require("./toValue")
    require("./toApproval")

    var global = _window ? _window.global : window.global
    var view = _window ? _window.views[id] : window.views[id]

    // missing stack or __
    if (!stack) stack = stacker({ _window, event, id, string })
    if (!__) __ = view.__

    var startTime = (new Date()).getTime(), success = true, data, returnForWaitActionExists = false

    // splitter is for ? or :
    // index is for using name?params?conditions?elseparams

    var terminator = ({ data, order }) => {

        // remove address of waiter
        if (address.id) address.interpreting = false

        if (!address.id) return data
        
        // execute waits
        if (stack.addresses.findIndex(await => await.id === address.id) === 0)
            require("./toAwait").toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: returnForWaitActionExists ? data.data : undefined })
        
        // return data
        return data
    }

    if (stack.terminated || stack.broke || stack.returned) return terminator({ data: { success: false, message: `Action terminated!`, executionDuration: 0 }, order: 0 })
    if (!string) return terminator({ data: { success: true, message: `No action to execute!`, executionDuration: 0 }, order: 1 })

    // push address for waits
    if (address.id) address.interpreting = true
    
    // encode
    string = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    // decode
    if (string.charAt(0) === "@" && string.length === 6) {

        // data is text
        if (global.__refs__[string].type === "text") 
            return terminator({ data: { data: global.__refs__[string].data, success: true, message: `No action to execute!`, executionDuration: 0 }, order: 2 })
        
        string = global.__refs__[string].data
    }

    // subparams
    if (index === 1) {

        // list
        var substring = string.split(splitter)[0]
        if (!substring) return terminator({ data: { success: false, message: `Missing name!`, executionDuration: 0 }, order: 3 })

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // name has subparams => interpret
        if (substring.includes("?")) {

            var data = lineInterpreter({ lookupActions, stack, id, e, data: substring, index: 1, req, res, __, mount, condition, toView, object, _object })
            if (data.conditionsNotApplied) return terminator({ data, order: 4 })
        }
    }

    var stringList = string.split(splitter)
    var conditions = stringList[index + 1]
    var elseParams = stringList[index + 2]
    string = stringList[index + 0]

    var execute = ({ success, message, string, conditionsNotApplied }) => {

        var actionReturnID = generate(), data
        stack.returns.unshift({ id: actionReturnID })

        // no params
        if (!string) message = "No actions to execute!"

        if (!action) {
            action = "toValue"
            if (!dblExecute && (condition || isCondition({ _window, string: data }))) action = "toApproval"
            else if (!dblExecute && mount) action = "toParam"
        }
        
        data = require(`./${action}`)[action]({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object, _object, toView })

        if (dblExecute && executable({ _window, string: data }))
            data = lineInterpreter({ _window, lookupActions, stack, id, e, data, req, res, __, mount, condition, toView, object, _object }).data

        if (stack.returns && stack.returns[0].returned) {
            returnForWaitActionExists = true
            data = stack.returns[0].data
        }

        // remove return address
        stack.returns.splice(stack.returns.findIndex(ret => ret.id === actionReturnID), 1)

        return ({ success, message, data, conditionsNotApplied, executionDuration: (new Date()).getTime() - startTime })
    }

    var approved = require("./toApproval").toApproval({ _window, data: conditions || "", id, e, req, res, __, stack, lookupActions, object, _object })

    if (!approved && elseParams) data = execute({ success, string: elseParams, message: "Else actions executed!", conditionsNotApplied: true })
    else if (!approved) data = ({ success, message: `Conditions not applied!`, conditionsNotApplied: true, executionDuration: (new Date()).getTime() - startTime })
    else data = execute({ success, string, message: `Action executed successfully!` })

    return terminator({ data, order: 5 })
}

module.exports = { lineInterpreter }