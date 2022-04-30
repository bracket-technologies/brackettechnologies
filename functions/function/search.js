const axios = require('axios')
const { toString } = require('./toString')
const { toAwait } = require('./toAwait')
const { clone } = require('./clone')

module.exports = {
    search: async ({ id, e, ...params }) => {
        
        var search = params.search || {}
        var local = window.value[id]
        var collection = search.collection || search.path || ""
        var _params = encodeURI(toString({ search }))
        search.headers = search.headers || {}
        
        var { data } = await axios.get(`/api/${collection}?${_params}`, {
            headers: {
                "project": window.global.data.project.id,
                ...search.headers
            }
        })
        local.search = clone(data)
        console.log(data)
        
        // await params
        toAwait({ id, e, params })
    }
}