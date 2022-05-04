const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { setContent } = require("./setContent")
const { setData } = require("./setData")

const createData = ({ data, id }) => {

  var local = window.children[id]
  var global = window.global[id]

  local.derivations.reduce((o, k, i) => {

    if (i === local.derivations.length - 1) return o[k] = data
    return o[k]

  }, global[local.Data])
}

const clearData = ({ id, e, clear = {} }) => {

  var local = window.children[id]
  var global = window.global

  if (!global[local.Data]) return
  
  var path = clear.path
  path = path ? path.split(".") : clone(local.derivations)
  path.push('delete()')
  
  reducer({ id, e, path, object: global[local.Data] })

  setContent({ id })
  console.log("data removed", global[local.Data])
}

module.exports = { createData, setData, clearData }
