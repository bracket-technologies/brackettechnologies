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
    var store = search.store || "database"
    
    if (global["access-key"]) headers["access-key"] = global["access-key"]
    delete search.headers

    // search
    headers.search = encodeURI(toString({ search }))
    
    var { data } = await axios.get(`/${store}`, {
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
        ...headers
      }
    })
    
    view.search = global.search = clone(data)
    console.log(data)
    if (data.message === "Force reload!") return location.reload()
    
    // await params
    if (params.asyncer) require("./toAwait").toAwait({ id, e, params })
  }
}