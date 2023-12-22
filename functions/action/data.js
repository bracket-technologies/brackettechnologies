const { clone } = require("./clone")
const { reducer } = require("./reducer")
const { setContent } = require("./setContent")
const { setData } = require("./setData")

const createData = ({ data, id }) => {

  var view = window.views[id]

  view.derivations.reduce((o, k, i) => {

    if (i === view.derivations.length - 1) return o[k] = data
    return o[k]

  }, global[view.doc])
}

const clearData = ({ id, e, clear = {}, __ }) => {

  var view = window.views[id]

  if (!global[view.doc]) return
  
  var path = clear.path
  path = path ? path.split(".") : clone(view.derivations)
  path.push('delete()')
  
  reducer({ id, e, data: path, object: global[view.doc], __ })

  setContent({ id })
  console.log("data removed", global[view.doc])
}

module.exports = { createData, setData, clearData }
