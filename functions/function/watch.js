const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")
const { generate } = require("qrcode-terminal")

const watch = ({ _window, lookupActions, awaits, controls, id, __ }) => {

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, lookupActions, awaits, id, string: controls.watch })
    watch = toCode({ _window, lookupActions, awaits, string: watch, start: "'", end: "'" })

    var approved = toApproval({ id, lookupActions, awaits, string: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500, watchAddress = { id: generate() }
        view[`${_watch}-watch`] = clone(toValue({ id, lookupActions, awaits, value: _watch }))
        
        const myFn = async () => {
            
            if (!window.views[id]) return clearInterval(view.__timers__[watchAddress.id])
            
            var value = toValue({ id, lookupActions, awaits, value: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, lookupActions, awaits, string: watch.split('?')[1], mount: true, __ })
            
            if (view["once"]) {

                delete view["once"]
                clearInterval(view.__timers__[watchAddress.id])
            }
            
            // approval
            var approved = toApproval({ id, lookupActions, awaits, string: watch.split('?')[2] })
            if (!approved) return
                
            // params
            if (view.await) toParam({ id, lookupActions, awaits, string: view.await.join(';') })
        }

        view.__timers__[watchAddress.id] = setInterval(myFn, timer)
    })
}

module.exports = { watch }