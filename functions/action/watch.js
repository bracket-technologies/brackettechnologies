const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const watch = ({ lookupActions, __, dots, string, id }) => {

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    var approved = toApproval({ id, lookupActions, stack, __, dots, data: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500, watchAddress = { id: generate() }
        view[`${_watch}-watch`] = clone(toValue({ id, lookupActions, stack, __, dots, data: _watch }))
        
        const myFn = async () => {
            
            var value = toValue({ id, lookupActions, stack, data: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, lookupActions, stack, data: watch.split('?')[1], mount: true, __, dots })
            
            // approval
            var approved = toApproval({ id, lookupActions, stack, data: watch.split('?')[2], __, dots })
            if (!approved) return
                
            // params
            if (view.await) toParam({ id, lookupActions, stack, data: view.await.join(';'), __, dots })
        }

        view.__timers__.push(setInterval(myFn, timer))
    })
}

module.exports = { watch }