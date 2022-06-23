const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { toCode } = require("./toCode")
var _window = { global: {}, views: {} }

var getSrc = async ({ req, res, db }) => {
    var src = req.url

    try {
        data = await require("axios").get(url, {
          timeout: 1000 * 10
        })
        .then(res => res.doesNotExist.throwAnError)
        .catch(err => err);
  
        data = data.data
        if (typeof data === "string") {
          data = `{ ${data.split("{").slice(1).join("{")}`
          data = JSON.parse(data)
        }
        success = true
        message = `Document/s mounted successfuly!`
  
      } catch (err) {
        
        data = {}
        success = false
        message = `Error!`
      }
}

module.exports = { getSrc }