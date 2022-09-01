const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")

const watch = ({ _window, controls, id }) => {

    const { execute } = require("./execute")

    var view = window.views[id]
    if (!view) return

    var watch = toCode({ _window, id, string: controls.watch })

    // 'string'
    if (watch.split("'").length > 2) watch = toCode({ _window, string: watch, start: "'", end: "'" })

    var approved = toApproval({ id, string: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500
        view[`${_watch}-watch`] = clone(toValue({ id, value: _watch }))
        
        const myFn = async () => {
            
            if (!window.views[id]) return clearInterval(view[`${_watch}-timer`])
            
            var value = toValue({ id, value: _watch })

            if ((value === undefined && view[`${_watch}-watch`] === undefined) || isEqual(value, view[`${_watch}-watch`])) return

            view[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, string: watch.split('?')[1], mount: true })

            // break
            if (view["break()"]) delete view["break()"]
            if (view["return()"]) return delete view["return()"]
            
            if (view["once"] || view["once()"]) {

                delete view["once"]
                clearInterval(view[`${_watch}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions || controls.action) await execute({ controls, id })
                
            // await params
            if (view.await) toParam({ id, string: view.await.join(';') })
        }

        if (view[`${_watch}-timer`]) clearInterval(view[`${_watch}-timer`])
        view[`${_watch}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }