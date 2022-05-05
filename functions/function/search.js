const axios = require('axios')
const { toString } = require('./toString')
const { toAwait } = require('./toAwait')
const { clone } = require('./clone')

module.exports = {
    search: async ({ id, e, ...params }) => {
        
        var search = params.search || {}
        var local = window.children[id]
        var collection = search.collection || search.path || ""
        var headers = clone(search.headers) || {}
        headers.project = headers.project || global.data.project.id
        delete search.headers
        
        var { data } = await axios.get(`/api/${collection}?${encodeURI(toString({ search }))}`, {
            headers: {
                "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
                ...headers
            }
        })
        local.search = clone(data)
        console.log(data)
        
        // await params
        toAwait({ id, e, params })
    }
}