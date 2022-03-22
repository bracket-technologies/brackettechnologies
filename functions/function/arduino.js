const axios = require('axios')
const { toAwait } = require("./toAwait")

module.exports = {
    searchArduino: async ({ id, search = {}, ...params }) => {
        
        var local = window.value[id]
        var { data } = await axios.get(`http://192.168.20.234/`)

        local.search = data
        
        console.log(data)

        // await params
        toAwait({ id, params })
    }
}