const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")
const { toCode } = require("./toCode")

const watch = ({ controls, id }) => {

    const { execute } = require("./execute")

    var local = window.value[id]
    if (!local) return

    var watch = toCode({ id, string: controls.watch })
    var approved = toApproval({ id, string: watch.split('?')[2] })
    if (!approved || !watch) return

    watch.split('?')[0].split(';').map(_watch => {

        var timer = 500
        local[`${_watch}-watch`] = clone(toValue({ id, value: _watch }))
        
        const myFn = async () => {
            
            if (!window.value[id]) return clearInterval(local[`${_watch}-timer`])
            
            var value = toValue({ id, value: _watch })

            if ((value === undefined && local[`${_watch}-watch`] === undefined) || isEqual(value, local[`${_watch}-watch`])) return

            local[`${_watch}-watch`] = clone(value)
            
            // params
            toParam({ id, string: watch.split('?')[1], mount: true })
            if (local["once"] || local["once()"]) {

                delete local["once"]
                clearInterval(local[`${_watch}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions) await execute({ controls, id })
                
            // await params
            if (local.await) toParam({ id, string: local.await.join(';'), mount: true })
        }

        if (local[`${_watch}-timer`]) clearInterval(local[`${_watch}-timer`])
        local[`${_watch}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }