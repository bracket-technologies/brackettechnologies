const { generate } = require("./generate")
const { toParam } = require("./toParam")
const { toApproval } = require("./toApproval")
const { clone } = require("./clone")
const { createTags } = require("./createTags")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toValue } = require("./toValue")
const { toArray } = require("./toArray")
const { createHtml } = require("./createHtml")
const { override } = require("./merge")
const { isParam } = require("./isParam")

const myViews = require("./views.json")

const createElement = ({ _window, lookupActions, id, req, res, import: _import, params: inheritedParams = {}, _, __, ___ }) => {

  return new Promise (async resolve => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], tags = ""
    var parent = views[view.parent] || {}

    // use view instead of type
    if (view.view) view.type = view.view

    // view is empty
    if (!view.type) return resolve("")
    if (!view["my-views"] && !_import) view["my-views"] = [...parent["my-views"]]
    
    // code ''
    view.type = toCode({ _window, lookupActions, string: view.type })
    view.type = toCode({ _window, lookupActions, string: view.type, start: "'", end: "'" })
    
    // 
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]
    var subParams = type.split(":")[1]
    type = type.split(":")[0]
    
    // [type]
    if (!view.duplicatedElement && type.includes("coded()")) {

      type = global.codes[type]

      // sub params
      if (subParams && isParam({ _window, lookupActions, string: subParams })) {
        
        var _params = {}
        var derivations = view.derivations = clone(view.derivations || [...(parent.derivations || [])])
        var Data = view.Data = view.Data || parent.Data || generate()

        if (isParam({ _window, lookupActions, string: subParams })) {
          
          _params = toParam({ req, res, _window, id, string: subParams, _, __, ___ })
          
        } else _params.data = toValue({ _window, lookupActions, req, res, id, value: subParams, _, __, ___ })

        if (_params.path) {

          _params.path = Array.isArray(_params.path) ? _params.path : _params.path.split(".")
          derivations.push(..._params.path)
          if (_params.data === undefined && global[Data]) _params.data = reducer({ _window, lookupActions, id, path: derivations, object: global[Data], req, res, _, __, ___ })
        } 
        if (_params.doc) _params.mount = true
        if (_params.mount) {

          if (_params.doc) view.doc = view.Data = _params.doc
          else if (_params.data && !_params.doc) view.doc = view.Data = generate()
          view.Data = Data = view.Data || Data
          global[Data] = global[Data] || _params.data || {}
          _params.data = reducer({ _window, lookupActions, id, path: derivations, object: global[Data], req, res, _, __, ___, key: _params.data !== undefined ? true : false, value: _params.data })
        }
        
        var tags = []

        if (toArray(_params.data).length > 0) {

          tags = await Promise.all(toArray(_params.data).map(async (_data, index) => {

            var _id = view.id + generate()
            var _type = type + "?" + view.type.split("?").slice(1).join("?")
            var _view = clone({ ...view, id: _id, view: _type, i: index, mapIndex: index, derivations, _: _data, __: index })

            if (!_params.preventDefault) {

              if (type === "Chevron") _view.direction = _data
              else if (type === "Icon") _view.name = _data
              else if (type === "Image") _view.src = _data
              else if (type === "Text") _view.text = _data
              else if (type === "Checkbox") _view.label = { text: _data }
            }

            if (_params.mount || _params.path) _view.derivations = [...derivations, index]
            
            views[_id] = _view
            return await createElement({ _window, lookupActions, id: _id, req, res, _: _data, __: index, ___: _ })
          }))

        } else {

          var _id = view.id + generate()
          var _type = type + "?" + view.type.split("?").slice(1).join("?")
          var _view = clone({ ...view, id: _id, view: _type, i: 0, mapIndex: 0, derivations, _: "", __: 0 })

          if (!_params.preventDefault) {

            if (type === "Chevron") _view.direction = "left"
            else if (type === "Icon") _view.name = "icon"
            else if (type === "Text") _view.text = ""
            else if (type === "Checkbox") _view.label = { text: "" }
          }

          if (_params.mount || _params.path) _view.derivations = [...derivations, "0"]
          
          views[_id] = _view
          tags = await createElement({ _window, lookupActions, id: _id, req, res, _: "", __: 0, ___: _ })
          
          delete views[view.id]
          return resolve(tags)
        }
        
        delete views[view.id]
        return resolve(tags.join(""))
      }

      view.mapType = ["data"]
    }

    view.type = type

    // events
    if (view.event) {

      view.controls = toArray(view.controls)
      toArray(view.event).map(event => view.controls.push({ event }))
      delete view.event
    }
    
    // id
    if (subParams) {

      if (isParam({ _window, lookupActions, string: subParams })) {

        inheritedParams = {...inheritedParams, ...toParam({ req, res, _window, id, string: subParams, _, __, ___ })}

      } else {
        
        view.Data = view.Data || view.doc || parent.Data
        view.derivations = view.derivations || [...(parent.derivations || [])]
        var _id = toValue({ _window, lookupActions, value: subParams, id, req, res, _, __, ___ })
        
        if (views[_id] && view.id !== _id) view.id = _id + generate()
        else view.id = id = _id
        
        if (global.data.view[_id] && !view["creation-date"] && id !== _id) {
          
          view["my-views"].push(_id)
          views[_id] = { ...view, ...clone(global.data.view[_id]) }
          delete views[id]
          
          tags = await createElement({ _window, lookupActions, id: _id, req, res, _, __, ___ })
          return resolve(tags)
        }
      }
    }

    view.id = id = view.id || generate()

    // style
    if (!_import) {

      view.style = view.style || {}
      view.class = view.class || ""
      view.Data = view.Data || view.doc || parent.Data
      view.derivations = view.derivations || [...(parent.derivations || [])]
      view.controls = view.controls || []
      view.status = "Loading"
      view.childrenID = []
      views[id] = view

      // approval
      var approved = toApproval({ _window, lookupActions, string: conditions, id, req, res, _, __, ___ })
      if (!approved) {
        delete views[id]
        return resolve("")
      }
    }

    // before loading controls
    await new Promise (async resolve => {
      
      toArray(view.controls).map(async (controls = {}) => {

        //
        if (!controls.event) return
        var event = toCode({ _window, lookupActions, string: controls.event })
        event = toCode({ _window, lookupActions, string: event, start: "'", end: "'" })

        if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ req, res, _window, id, string: event.split('?')[2], _, __, ___ })) {

          toParam({ req, res, _window, id, string: event.split("?")[1], createElement: true })
          view.controls = view.controls.filter((controls = {}) => !controls.event.split("?")[0].includes("beforeLoading"))
        }
      })

      if (global.promises[id] && global.promises[id].length > 0) {
        
        await Promise.all((global.promises[id] || []))
        await Promise.all((global.promises[id] || []))
        await Promise.all((global.promises[id] || []))
        await Promise.all((global.promises[id] || []))
        delete global.promises[id]
      }

      resolve()
    })
    
    if (global.breakCreateElement[id]) {

      global.breakCreateElement[id] = false
      return resolve("")
    }

    /////////////////// approval & params /////////////////////

    // push destructured params from type to view
    if (params) {
      
      params = toParam({ _window, lookupActions, string: params, id, req, res, mount: true, createElement: true, _, __, ___ })

      if (params.id && params.id !== id) {

        if (views[params.id] && typeof views[params.id] === "object") params.id += generate()
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
      
      // inherited params
      if (Object.keys(inheritedParams).length > 0) override(view, inheritedParams)

      // pass to children
      if (parent.passToChildren) override(view, parent.passToChildren)

      // view
      if (!_import && (params.view || (!myViews.includes(view.type) && global.data.view[view.type]))) {

        var viewId = params.view || view.type
        delete view.view
        delete params.view
        view["my-views"].push(viewId)
        
        var newView = clone(global.data.view[viewId])
        if (!newView) return resolve("")
        if (newView.id && views[newView.id]) newView.id += generate()

        views[id] = { ...view,  ...newView, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)]}
        
        tags = await createElement({ _window, lookupActions, id, req, res, params, _, __, ___ })
        return resolve(tags)
      }

    } else if (!_import && (!myViews.includes(view.type) && global.data.view[view.type])) {
      
      var viewId = view.type
      view["my-views"].push(viewId)
      var newView = clone(global.data.view[viewId])
      if (!newView) return resolve("")
      if (newView.id && views[newView.id]) newView.id += generate()
      
      views[id] = { ...view,  ...newView, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)]}

      tags = await createElement({ _window, lookupActions, id, req, res, _, __, ___ })
      return resolve(tags)
    }

    if (_import) {

      tags = await createHtml({ _window, lookupActions, id, req, res, import: _import })
      return resolve(tags)
    }

    // for droplist
    if (parent.unDeriveData || view.unDeriveData) {

      view.data = view.data || ""
      view.unDeriveData = true

    } else view.data = reducer({ _window, lookupActions, id, path: view.derivations, value: view.data, key: true, object: global[view.Data] || {}, req, res, _, __, ___ })
    
    // doc
    if (!global[view.Data] && view.data) global[view.Data] = view.data

    // root
    if (view.parent === "root") views.root.child = view.id
    
    tags = await createTags({ _window, lookupActions, id, req, res, _, __, ___ })
    resolve(tags)
  })
}

module.exports = { createElement }