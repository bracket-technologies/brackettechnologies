const axios = require('axios')
const { toString } = require('./toString')
const { toAwait } = require('./toAwait')
const { clone } = require('./clone')

module.exports = {
    search: async ({ id, e, search, ...params }) => {
        
        var local = window.value[id]
        var collection = search.collection = search.collection || search.path
        
        var { data } = await axios.get(`https://us-central1-bracketjs.cloudfunctions.net/app/api/${collection}?${toString({ search })}`)

        local.search = clone(data)
        
        console.log(data)
        
        // await params
        toAwait({ id, e, params })
    }
}