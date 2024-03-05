const { toAwait } = require("./kernel")

const axios = async ({ id, lookupActions, stack, ...params }) => {

    var view = window.views[id]
    var { method, url, headers, payload } = params, data

    if (method === "get" || method === "SEARCH") {
        
        data = await require("axios").get(url, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })

    } else if (method === "post" || method === "save") {
        
        data = await require("axios").post(url, payload, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })

    } else if (method === "delete" || method === "erase") {
        
        data = await require("axios").delete(url, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })
    }

    // stack
    console.log(data)
    view.axios = data

    toAwait({ id, lookupActions, stack, params })
}

module.exports = { axios }