const { isEqual } = require("./isEqual")
const { toArray } = require("./toArray")
const { compare } = require("./compare")
const { toOperator } = require("./toOperator")
const { clone } = require("./clone")

const filter = ({ filter = {}, id, e, ...params }) => {

  var view = window.views[id]
  if (!view) return

  var Data = filter.Data || view.Data
  var options = global[`${Data}-options`]
  if (!options) options = global[`${Data}-options`] = {}

  var path = toArray(filter.path)
  path = path.map(path => path.split("."))

  var backup = filter.backup
  var value = filter.value

  if (!value || isEqual(options.filter, value)) {

    options.filter = clone(value)
    data = backup

  } else {

    // reset backup filter options
    options.filter = clone(value)
    
      // remove spaces
    Object.entries(value).map(([k, v]) => value[k] = v.toString().split(" ").join("").toLowerCase())
    
    var data = []
    data.push(
      ...backup.filter(data => {
        return !Object.entries(value).map(([o, v]) => 
        compare(path
        .map(path => (path
        .reduce((o, k) => o[k], data) || '')
        .toString()
        .toLowerCase()
        .split(" ")
        .join("")
        )
        .join(""),
        toOperator(o), v))
        .join("")
        .includes("false")
      })
    )
  }
  
  global[Data] = data
  view.filter = { success: true, data }
}

module.exports = {filter}
