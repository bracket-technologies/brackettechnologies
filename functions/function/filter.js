const { isEqual } = require("./isEqual")
const { toArray } = require("./toArray")
const { compare } = require("./compare")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { clone } = require("./clone")

const filter = ({ filter = {}, id, e, ...params }) => {

  var local = window.value[id]
  var global = window.global
  if (!local) return

  var Data = filter.Data || local.Data
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
        toFirebaseOperator(o), v))
        .join("")
        .includes("false")
      })
    )
  }
  
  global[Data] = data
  local.filter = { success: true, data }
}

module.exports = {filter}
