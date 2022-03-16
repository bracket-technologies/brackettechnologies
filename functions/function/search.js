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

/*
const { capitalize } = require("./capitalize")
const { keys } = require("./keys")
const { toFirebaseOperator } = require("./toFirebaseOperator")

module.exports = {
    search: async ({ id, e, search, ...params }) => {
        
        var local = window.value[id]
        var global = window.global

        var collection = search.path
        var ref = global.db.collection(collection)

        if (collection !== 'admin') {

            search.limit = !search.limit ? 25 : search.limit
            search.orderBy = !search.orderBy ? "creation-date" : search.orderBy
            if (search.orderBy === "creation-date")
            search.startAfter = !search.startAfter ? 0 : search.startAfter
        }
        
        // search field
        if (search.field)
        Object.entries(search.field).map(([key, value]) => {
    
            var operator = keys(value)[0]
            ref = ref.where(key, toFirebaseOperator(operator), value[operator])
        })
        
        if (search.orderBy) ref = ref.orderBy(search.orderBy)
        if (search.limit) ref = ref.limit(search.limit)
        if (search.offset) ref = ref.endAt(search.offset)
        if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)
    
        if (search.startAt) ref = ref.startAt(search.startAt)
        if (search.startAfter) ref = ref.startAfter(search.startAfter)
    
        if (search.endAt) ref = ref.endAt(search.endAt)
        if (search.endBefore) ref = ref.endBefore(search.endBefore)

        // push options to global
        global[`${local.Data}-options`] = global[`${local.Data}-options`] || {}
        global[`${local.Data}-options`].search = search
    
        // retrieve data
        // var data = []
        var data = {}
        var snapshot = ref.get()
        
        snapshot.then(query => {
            
            query.forEach(doc => data[doc.id] = doc.data())
            // query.forEach(doc => data.push(doc.data()))
        
            local.search = {
                data,
                success: true,
                message: `${capitalize(search.path)} mounted successfuly!`
            }
            
            console.log(local.search)
                        
            // await params
            toAwait({ id, e, params })
        })
        .catch(error => {
    
            local.search = {
                success: false,
                message: error,
            }
            
            console.log(local.search)
        })
    }
}
*/