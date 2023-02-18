const control = require("../control/control")

const createActions = ({ params, id }) => {

  const {execute} = require("./execute")

  if (!params.type) return
  var actions = control[params.type]({ params, id })

  execute({ actions, id })
}

module.exports = {createActions}
