const { toCode } = require("./toCode")
const { generate } = require("./generate")
const { isCondition } = require("./isCondition")
const { executable } = require("./executable")
const { clone } = require("./clone")
const { isEvent } = require("./isEvent")
const { toEvent } = require("./toEvent")
const { isParam } = require("./isParam")

const toLine = ({ _window, lookupActions, stack, address = {}, id, e, data: { string, dblExecute, index: i = 0, splitter = "?" }, req, res, __, mount, condition, object, action }) => {

    require("./toParam")
    require("./toValue")
    require("./toApproval")
    
    const global = _window ? _window.global : window.global
    var view = _window ? _window.views[id] : window.views[id]

    // missing stack or __
    if (!stack) stack = { addresses: [], returns: [] }
    if (!__) __ = view.__

    var startTime = (new Date()).getTime(), success = true, data, returnForWaitActionExists = false, conditionsNotApplied = false, message = ""

    // splitter is for ? or :
    // i is for using name?params?conditions?elseparams

    var terminator = ({ data, order }) => {
        
        if (stack.terminated || !address.id) return data
        
        address.interpreting = false
        
        // execute waits
        require("./toAwait").toAwait({ _window, lookupActions, stack, address, id, e, req, res, __, _: returnForWaitActionExists ? data.data : undefined })

        return data
    }

    if (stack.terminated || stack.broke || stack.blocked) return terminator({ data: { success: false, message: `Action terminated!`, executionDuration: 0 }, order: 0 })
    if (!string) return terminator({ data: { success: true, message: `No action to execute!`, executionDuration: 0 }, order: 1 })

    // encode
    string = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    // decode
    if (string.charAt(0) === "@" && string.length === 6) {

        // data is text
        if (global.__refs__[string].type === "text") 
            return terminator({ data: { data: global.__refs__[string].data, success: true, message: `No action to execute!`, executionDuration: 0 }, order: 2 })
        
        string = global.__refs__[string].data
        if (action) object = {}
    }

    // check event
    if (string.split("?").length > 1 && isEvent({ _window, string })) return toEvent({ _window, string, id, __, lookupActions })

    // subparams
    if (i === 1) {

        // list
        var substring = string.split(splitter)[0]
        if (!substring) return terminator({ data: { success: false, message: `Missing name!`, executionDuration: 0 }, order: 3 })

        // decode
        if (substring.charAt(0) === "@" && substring.length === 6) substring = global.__refs__[substring].data

        // name has subparams => interpret
        if (substring.includes("?")) {

            var data = toLine({ lookupActions, stack, id, e, data: { string: substring, i: 1 }, req, res, __, mount, condition, object })
            if (data.conditionsNotApplied) return terminator({ data, order: 4 })
        }
    }

    var stringList = string.split(splitter)
    var elseIfList = string.split("??")

    if (splitter === "?" && elseIfList[1]) {

        // case: key=value??elseValue (condition is the key)
        if (elseIfList[1] && !elseIfList[0].split("?")[1] && elseIfList[0].split("=")[1]) {

            var key = elseIfList[0].split("=")[0]
            string = toCode({ _window, id, string: key + "=[" + elseIfList[0].split("=").slice(1).join("=") + "?" + key + "?" + elseIfList.slice(1).join("?") + "]" })
        
        // case: key=value?condition??value1?condition1??value2?condition2 (?? is elseif)
        } else if (elseIfList[1] && elseIfList[0].split("?")[1]) {

            string = elseIfList.at(-1)
            elseIfList.slice(0, -1).reverse().map(elseIf => string = elseIf + "?[" + string + "]")
            console.log(string);
            string = toCode({ _window, id, string })
        }

        stringList = string.split("?")
    }

    var conditions = stringList[i + 1]
    var elseParams = stringList[i + 2]
    string = stringList[i + 0]

    var approved = require("./toApproval").toApproval({ _window, data: conditions || "", id, e, req, res, __, stack, lookupActions, object })

    if (!approved && elseParams) {

        string = elseParams
        message = "Else actions executed!"
        conditionsNotApplied = true

    } else if (!approved) return ({ success, message: `Conditions not applied!`, conditionsNotApplied: true, executionDuration: (new Date()).getTime() - startTime })
    else message = `Action executed successfully!`
    
    var actionReturnID = generate(), data
    stack.returns.unshift({ id: actionReturnID })

    // no params
    if (!string) message = "No actions to execute!"

    if (!action || condition) {

        action = "toValue"
        if (!dblExecute && (condition || isCondition({ _window, string: data }))) action = "toApproval"
        else if (!dblExecute && mount) action = "toParam"

    } else if (action === "conditional") {

        if (isParam({ _window, string })) action = "toParam"
        else action = "toValue"
    }
    
    data = require(`./${action}`)[action]({ _window, lookupActions, stack, id, e, data: string, req, res, __, mount, object })

    if (dblExecute && executable({ _window, string: data }))
        data = toLine({ _window, lookupActions, stack, id, e, data: { string: data }, req, res, __, mount, condition, object }).data

    if (stack.returns && stack.returns[0].returned) {
        returnForWaitActionExists = true
        data = stack.returns[0].data
    }

    // remove return address
    stack.returns.splice(stack.returns.findIndex(ret => ret.id === actionReturnID), 1)

    return terminator({ data: { success, message, data, action, conditionsNotApplied, executionDuration: (new Date()).getTime() - startTime }, order: 5 })
}

module.exports = { toLine }