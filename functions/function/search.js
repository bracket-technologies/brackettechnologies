const axios = require('axios')
const { toString } = require('./toString')
const { clone } = require('./clone')

module.exports = {
    search: async ({ id = "", e, ...params }) => {
        
        var global = window.global
        var search = params.search || {}
        var view = window.views[id]
        var headers = search.headers || {}
        headers.project = headers.project || global.projectId
        
        if (global["access-key"]) headers["access-key"] = global["access-key"]
        delete search.headers

        // search
        headers.search = encodeURI(toString({ search }))
        
        var { data } = await axios.get(`/database`, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })
        
        view.search = clone(data)
        console.log(data)
        
        // await params
        require("./toAwait").toAwait({ id, e, params })
    }
}