const { toArray } = require("../function/toArray")

module.exports = ({ controls, id }) => {

    var actions = Object.keys(controls.actions)
    id = toArray(controls.id || id)
    
    return [{
        "event": "loaded",
        "actions": id.map(id => `${actions}:${id}`)
    }]
}