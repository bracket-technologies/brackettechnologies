const { toApproval } = require("./kernel")
const { clone } = require("./clone")
const { toParam } = require("./kernel")
const { toValue } = require("./kernel")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")
const { generate } = require("./generate")

const watch = ({ lookupActions, __, string, id }) => {

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, id, string: toCode({ _window, id, string, start: "'" }) })

    var approved = toApproval({ id, lookupActions, stack, __, data: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500, watchAddress = { id: generate() }
        view[`${_watch}-watch`] = clone(toValue({ id, lookupActions, stack, __, data: _watch }))
        
        const myFn = async () => {
            
            var value = toValue({ id, lookupActions, stack, data: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, lookupActions, stack, data: watch.split('?')[1], mount: true, __ })
            
            // approval
            var approved = toApproval({ id, lookupActions, stack, data: watch.split('?')[2], __ })
            if (!approved) return
                
            // params
            if (view.await) toParam({ id, lookupActions, stack, data: view.await.join(';'), __ })
        }

        view.__timers__.push(setInterval(myFn, timer))
    })
}

module.exports = { watch }