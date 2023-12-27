const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const numbers = "1234567890"

const generate = (params = {}) => {

  var { length = 5, number } = params
  var result = "", chars = number ? numbers : characters

  var charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }

  if (params.timestamp) result += "_" + (new Date()).getTime()
  
  return result
}

module.exports = {generate}
