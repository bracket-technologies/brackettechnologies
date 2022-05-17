const { toString } = require("../function/toString")

module.exports = ({ id }) => {
    
    var params = ""
    var local = window.views[id]
    
    Object.entries(local.loaded).map(([key, val]) => {
        if (key === "style") key = "style()"
        params += `().${toString({ [key]: val })}`
    })
    
    return [{
        "event": `loaded?${params}`
    }]
}