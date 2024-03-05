const { reducer } = require("./kernel")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")

const sort = ({ _window, sort = {}, id, e, lookupActions, __, stack }) => {

  var view = _window ? _window.views[id] : window.views[id]
  if (!view) return
  
  // data
  var Data = sort.doc || view.doc
  var options = global[`${Data}-options`] = global[`${Data}-options`] || {}
  var data = sort.data || global[Data]
  var sortBy = options.sortBy || view.sortBy || sort.sortBy || sort.by || "descending"

  if (sort.ascending) sortBy = "ascending"
  else if (sort.descending) sortBy = "descending"
  else if (sort.sortBy || sort.sortby || sort.by) sortBy = sort.sortBy || sort.sortby || sort.by
  options.sortBy = view.sortBy = sortBy

  // path
  var path = sort.path
  if (typeof sort.path === "string") path = toArray(toCode({ _window, id, string: path, e }).split("."))
  if (!path) path = []
  var isDate = false
  
  if (!Array.isArray(data) && typeof data === "object") data = Object.values(data)

  data.sort((a, b) => {
    
    a = reducer({ _window, id, data: { path, object: a }, e, lookupActions, __, stack }) || "!"
    
    if (a !== undefined) a = a.toString()

    b = reducer({ _window, id, data: { path, object: b }, e, lookupActions, __, stack }) || "!"

    if (b !== undefined) b = b.toString()

    if ((!isNaN(a) && b === "!") || (!isNaN(b) && a === "!")) {
      if (a === "!") a = 0
      else if (b === "!") b = 0
    }

    if ((!isNaN(a) && isNaN(b)) || (!isNaN(b) && isNaN(a))) {
      a = a.toString()
      b = b.toString()
    }
    
    if (sortBy === "descending") {
      if (isDate) {
        if (b.year === a.year) {
          if (b.month === a.month) {
            if (a.day === b.day) return 0
            else if (a.day > b.day) return 1
            else return -1
          } else {
            if (a.month > b.month) return 1
            else return -1
          }
        } else {
          if (a.year > b.year) return 1
          else return -1
        }
      }

      if (!isNaN(a) && !isNaN(b)) return b - a

      if (a < b) return -1
      return a > b ? 1 : 0
    } else {
      if (isDate) {
        if (b.year === a.year) {
          if (b.month === a.month) {
            if (a.day === b.day) return 0
            else if (a.day < b.day) return 1
            else return -1
          } else {
            if (a.month < b.month) return 1
            else return -1
          }
        } else {
          if (a.year < b.year) return 1
          else return -1
        }
      }
      
      if (!isNaN(a) && !isNaN(b)) return a - b

      if (b < a) return -1
      return b > a ? 1 : 0
    }
  })
  
  // sort by
  if (sort.reversable || sort.reverse || sort.flip || sort.flipable) options.sortBy = sortBy === "ascending" ? "descending" : "ascending"
  if (Data) global[Data] = data
  return data
}

module.exports = {sort}