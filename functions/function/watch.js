const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { toValue } = require("./toValue")
const { isEqual } = require("./isEqual")

const watch = ({ controls, id }) => {

    const { execute } = require("./execute")

    var local = window.value[id]
    if (!local) return

    var watch = controls.watch
    var approved = toApproval({ id, string: watch.split('?')[2] })
    if (!approved) return

    watch.split('?')[0].split(';').map(name => {

        var timer = 500
        local[`${name}-watch`] = clone(toValue({ id, value: name }))

        const myFn = async () => {
            
            if (!window.value[id]) return clearInterval(local[`${name}-timer`])
            
            var value = toValue({ id, value: name })

            if ((value === undefined && local[`${name}-watch`] === undefined) || isEqual(value, local[`${name}-watch`])) return

            local[`${name}-watch`] = clone(value)
            
            // params
            /*params = */toParam({ id, string: watch.split('?')[1], mount: true })
            if (local["once()"]) {

                delete local["once()"]
                clearInterval(local[`${name}-timer`])
            }
            
            // approval
            var approved = toApproval({ id, string: watch.split('?')[2] })
            if (!approved) return
            
            // once
            if (controls.actions) await execute({ controls, id })
                
            // await params
            if (local.await) toParam({ id, string: local.await.join(';'), mount: true })
        }

        if (local[`${name}-timer`]) clearInterval(local[`${name}-timer`])
        local[`${name}-timer`] = setInterval(myFn, timer)

    })
}

module.exports = { watch }