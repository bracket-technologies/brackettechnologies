const { toArray } = require("./toArray");
module.exports = {
  toEvent: ({ _window, id, string: param = "", _ }) => {

      var view = _window ? _window.views[id] : window.views[id]
      var global = _window ? _window.global : window.global
    
      // mouseenter
      if (param.slice(0, 11) === "mouseenter:") {

        param = param.slice(11)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseenter = view.mouseenter || ""
        return view.mouseenter += `${param};`
      }

      // mouseleave
      if (param.slice(0, 11) === "mouseleave:") {

        param = param.slice(11)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseleave = view.mouseleave || ""
        return view.mouseleave += `${param};`
      }

      // mouseover
      if (param.slice(0, 10) === "mouseover:") {

        param = param.slice(10)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseover = view.mouseover || ""
        return view.mouseover += `${param};`
      }

      // mousedown
      if (param.slice(0, 10) === "mousedown:") {

        param = param.slice(10)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mousedown = view.mousedown || ""
        return view.mousedown += `${param};`
      }

      // mouseup
      if (param.slice(0, 8) === "mouseup:") {

        param = param.slice(8)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.mouseup = view.mouseup || ""
        return view.mouseup += `${param};`
      }

      // click
      if (param.slice(0, 6) === "click:") {

        param = param.slice(6)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.click = view.click || ""
        return view.click += `${param};`
      }

      // change
      if (param.slice(0, 7) === "change:") {

        param = param.slice(7)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.change = view.change || ""
        return view.change += `${param};`
      }

      // focus
      if (param.slice(0, 6) === "focus:") {

        param = param.slice(6)
        if (param.slice(0, 6) === "coded()" && param.length === 12) param = global.codes[param]
        view.focus = view.focus || ""
        return view.focus += `${param};`
      }

      // blur
      if (param.slice(0, 5) === "blur:") {

        param = param.slice(5)
        if (param.slice(0, 5) === "coded()" && param.length === 12) param = global.codes[param]
        view.blur = view.blur || ""
        return view.blur += `${param};`
      }

      // keypress
      if (param.slice(0, 9) === "keypress:") {

        param = param.slice(9)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keypress = view.keypress || ""
        return view.keypress += `${param};`
      }

      // keyup
      if (param.slice(0, 6) === "keyup:") {

        param = param.slice(6)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keyup = view.keyup || ""
        return view.keyup += `${param};`
      }

      // keydown
      if (param.slice(0, 8) === "keydown:") {

        param = param.slice(8)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.keydown = view.keydown || ""
        return view.keydown += `${param};`
      }

      // scroll
      if (param.slice(0, 7) === "scroll:") {

        param = param.slice(7)
        if (param.slice(0, 6) === "coded()" && param.length === 12) param = global.codes[param]
        view.scroll = view.scroll || ""
        return view.scroll += `${param};`
      }

      // loaded
      if (param.slice(0, 7) === "loaded:") {

        param = param.slice(7)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.loaded = view.loaded || ""
        return view.loaded += `${param};`
      }

      // beforeLoading
      if (param.slice(0, 14) === "beforeLoading:") {

        param = param.slice(14)
        if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
        view.controls = toArray(view.controls)
        return view.controls.push({ event: `beforeLoading?${param}` })
      }

      // controls
      if (param.slice(0, 9) === "controls:") {

        var _controls = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _controls.push({ event: param })
        })

        view.controls = toArray(view.controls)
        view.controls.unshift(..._controls)
        return //view.controls
      }

      // children
      if (param.slice(0, 9) === "children:") {

        var _children = []
        param = param.slice(9)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ view: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return //view.children
      }

      // children
      if (param.slice(0, 6) === "child:") {

        var _children = []
        param = param.slice(6)
        param.split(":").map(param => {

          if (param.slice(0, 7) === "coded()" && param.length === 12) param = global.codes[param]
          _children.push({ view: param })
        })

        view.children = toArray(view.children)
        view.children.unshift(..._children)
        
        if (_) {
          view._ = _
          view.passToChildren = view.passToChildren || {}
          view.passToChildren._ = _
        }
        return //view.children
      }
  }
}