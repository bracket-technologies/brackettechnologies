const { isNumber } = require("./toValue")
const toNumber = (string) => {

  if (!string) return string
  if (typeof string === 'number') return string
  if (isNumber(string)) return parseFloat(string)
  return string
}

module.exports = { toNumber }
