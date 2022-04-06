const { clone } = require("./clone")
const { generate } = require("./generate")
const { createComponent } = require("./createComponent")
const { toHtml } = require("./toHtml")
const { toApproval } = require("./toApproval")
const { toArray } = require("./toArray")

const createTags = ({ _window, id, req, res }) => {

  var value = _window ? _window.value : window.value
  var local = value[id]
  if (!local) return

  local.length = 1
  
  // data mapType
  var data = Array.isArray(local.data) ? local.data : typeof local.data === "object" ? Object.keys(local.data) : []
  var isObject = !Array.isArray(local.data)
  local.length = data.length || 1
  
  if (local.mapType) {
    if (data.length > 0) {

      data = arrange({ data, arrange: local.arrange, id, _window })
      delete value[id]
      
      return data.map((_data, index) => {

        var id = generate()
        var _local = clone(local)

        value[id] = _local

        _local.id = id
        _local.mapIndex = index
        _local.data = isObject ? _local.data[_data] : _data
        _local.derivations = isObject ? [..._local.derivations, _data] : [..._local.derivations, index]

        // check approval again for last time
        var conditions = value[local.parent].children[local.index]
        var approved = toApproval({ _window, string: conditions, id, req, res })
        if (!approved) return

        return createTag({ _window, id, req, res })

      }).join("")

    } else {

      local.mapIndex = 0
      local.data = null
      local.derivations = isObject ? [...local.derivations, ""] : [...local.derivations, 0]
      
      // check approval again for last time
      var conditions = value[local.parent].children[local.index].type.split("?")[2]
      var approved = toApproval({ _window, string: conditions, id, req, res })
      if (!approved) return
      
      return createTag({ _window, id, req, res })
    }
  }
  
  return createTag({ _window, id, req, res })
}

const createTag = ({ _window, id, req, res }) => {

  const {execute} = require("./execute")

  var local = _window ? _window.value[id] : window.value[id]
  
  // components
  componentModifier({ _window, id })
  createComponent({ _window, id, req, res })

  // flicker for inputs
  if (local.flicker) {
    
    local.flicker = { opacity: local.style.opacity || "1" }
    local.style.opacity = "0"
  }

  if (local.actions) execute({ _window, actions: local.actions, id, req, res })
  return toHtml({ _window, id, req, res })
}

const componentModifier = ({ _window, id }) => {

  var local = _window ? _window.value[id] : window.value[id]

  // icon
  if (local.type === "Icon") {

    local.icon = local.icon || {}
    local.icon.name = local.name || local.icon.name || ""
    if (local.icon.google) local.google = true

    if (local.icon.outlined || local.icon.type === "outlined") {
      local.outlined = true
    } else if (local.icon.filled || local.icon.type === "filled") {
      local.filled = true
    } else if (local.icon.rounded || local.icon.type === "rounded") {
      local.rounded = true
    } else if (local.icon.sharp || local.icon.type === "sharp") {
      local.sharp = true
    } else if (local.icon.twoTone || local.icon.type === "twoTone") {
      local.twoTone = true
    }
  }

  // textarea
  else if (local.textarea && !local.templated) {

    local.style = local.style || {}
    local.input = local.input || {}
    local.input.style = local.input.style || {}
    local.input.style.height = "fit-content"
  }

  // input
  else if (local.type === "Input") {

    local.input = local.input || {}
    if (local.value) local.input.value = local.input.value || local.value
    if (local.checked !== undefined) local.input.checked = local.checked
    if (local.max !== undefined) local.input.max = local.max
    if (local.min !== undefined) local.input.min = local.min
    if (local.name !== undefined) local.input.name = local.name
    if (local.input.placeholder) local.placeholder = local.input.placeholder
    
  } else if (local.type === "Item") {

    var parent = _window ? _window.value[local.parent] : window.value[local.parent]

    if (local.index === 0) {

      local.state = generate()
      parent.state = local.state
      
    } else local.state = parent.state
  }
}

const arrange = ({ data, arrange, id, _window }) => {

  var value = _window ? _window.value : window.value
  var local = value[id], index = 0

  if (local) {
    if (local.arrange) toArray(arrange).map(el => {

      var _index = data.findIndex(_el => _el == el)
      if (_index > -1) {

        var _el = data[index]
        data[index] = el
        data[_index] = _el
        index += 1
      }
    })
    
    if (local.sort) {
      
      var _sorted = data.slice(index).sort()
      data = data.slice(0, index)
      data.push(..._sorted)
    }
  }
  return data
}

module.exports = { createTags }
