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
const { toFunction } = require("./toFunction")
const _imports = [ "link", "meta", "title", "script", "style" ]

const toView = ({ _window, lookupActions, awaits, id, req, res, import: _import, params: inheritedParams = {}, _, __, ___, viewer = "view" }) => {

  return new Promise (async resolve => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global
    var view = views[id], tags = ""
    var parent = views[view.parent] || {}

    // use view instead of type
    if (view.view) view.type = view.view
    view.__ISVIEW__ = true

    // view is empty
    if (!view.type) return resolve("")
    if (!view["my-views"]) view["my-views"] = [...(parent["my-views"] || [])]
    view.viewType = viewer = view.viewType || parent.viewType || viewer
    
    // encode
    view.type = toCode({ _window, string: toCode({ _window, string: view.type }), start: "'", end: "'" })
    var isFn = await toFunction({ _window, lookupActions, awaits, id, req, res, _, __, ___, path: view.type.split("."), path0: view.type.split(".")[0].split(":")[0], isView: true })
    if (isFn !== "__CONTINUE__") return resolve(isFn)
    
    // 
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]
    var subParams = type.split(":")[1]
    type = type.split(":")[0]

    _import = view.id === "html" || (parent.id === "html" && _imports.includes(type.toLowerCase()))
    
    // [type]
    if (/*!view.duplicatedElement && */type.length === 12 && type.includes("coded()")) {

      type = global.codes[type]

      // sub params
      if (subParams) {

        while (subParams.includes('coded()') && subParams.length === 12) { subParams = global.codes[subParams] }
        var _conditions_ = subParams.split("?")[1]
        
        if (_conditions_) {
          var approved = toApproval({ _window, string: _conditions_, id, req, res, _, __, ___ })
          if (!approved) {
            delete views[id]
            return resolve("")
          }
        }
        
        subParams = subParams.split("?")[0]
        
        var _params = {}
        if (isParam({ _window, string: subParams })) _params = toParam({ req, res, _window, id, string: subParams, _, __, ___ })
        else _params.data = toValue({ req, res, _window, id, value: subParams, _, __, ___ })
        if (_params.data === "mount") {
          _params.data = parent.data
          _params.mount = true
        }

        if ((_params.doc || _params.path) && !_params.preventDefault) _params.mount = true
        var loopData = []

        if (_params.path) {
          
          _params.path = Array.isArray(_params.path) ? _params.path : _params.path.split(".")

          if (_params.data) {
          
            _params.Data = _params.doc = _params.doc || _params.Data || generate()
            global[_params.Data] = global[_params.Data] || _params.data || {}
            _params.derivations = [...(_params.derivations || []), ...(_params.path || [])]
            loopData = reducer({ _window, lookupActions, awaits, id, path: _params.derivations, object: global[_params.Data], req, res, _, __, ___ })

          } else {

            _params.Data = _params.doc = _params.doc || _params.Data || view.Data || parent.Data || generate()
            global[_params.Data] = global[_params.Data] || _params.data || {}
            _params.derivations = [...(_params.derivations || _params.derivations || parent.derivations || []), ...(_params.path || [])]
            loopData = _params.data = reducer({ _window, lookupActions, awaits, id, path: _params.derivations, object: global[_params.Data], req, res, _, __, ___ })
          }

        } else if (_params.data) {

          _params.Data = _params.doc = _params.doc || _params.Data || (_params.mount && !_params.preventDefault && parent.Data) || generate()
          global[_params.Data] = global[_params.Data] || _params.data || {}
          _params.derivations = (_params.mount && !_params.preventDefault && !_params.doc && parent.derivations) || _params.derivations || []
          loopData = _params.data
          
        } else if (_params.Data || _params.doc) {

          _params.Data = _params.doc = _params.doc || _params.Data
          global[_params.Data] = global[_params.Data] || {}
          _params.derivations = _params.derivations || []
          loopData = _params.data = reducer({ _window, lookupActions, awaits, id, path: _params.derivations, object: global[_params.Data], req, res, _, __, ___ })
        }
        
        /*if (_params.mount) {

          if (_params.doc) view.doc = view.Data = _params.doc
          else if (_params.data && !_params.doc) view.doc = view.Data = generate()
          view.Data = Data = view.Data || Data
          global[Data] = global[Data] || _params.data || {}
          _params.data = reducer({ _window, lookupActions, awaits, id, path: derivations, object: global[Data], req, res, _, __, ___, key: _params.data !== undefined ? true : false, value: _params.data })
        }*/
        
        var tags = []
        var { Data, doc, data, path, derivations, preventDefault, ...myparams } = _params
        
        if (toArray(loopData).length > 0) {

          tags = await Promise.all(toArray(loopData).map(async (_data, index) => {

            var _id = view.id + "-" + index
            var _type = type + "?" + view.type.split("?").slice(1).join("?")
            var _view = clone({ ...view, ...myparams, id: _id, view: _type, i: index, mapIndex: index })
            if (_params.mount) _view = {..._view, Data, doc, data: _data, derivations: [...(derivations || []), index] }

            if (!_params.preventDefault) {

              if (type === "Chevron") _view.direction = _data
              else if (type === "Icon") _view.name = _data
              else if (type === "Image") _view.src = _data
              else if (type === "Text") _view.text = _data
              else if (type === "Checkbox") _view.label = { text: _data }
            }
            
            views[_id] = _view
            
            return await toView({ _window, lookupActions, awaits, id: _id, req, res, _: _data, __: _, ___: __, viewer })
          }))

        } else {

          var _id = view.id + "-" + 0
          var _type = type + "?" + view.type.split("?").slice(1).join("?")
          var _view = clone({ ...view, ...myparams, id: _id, view: _type, i: 0, mapIndex: 0 })
          if (_params.mount) _view = {..._view, Data, doc, derivations: [...(derivations || []), 0] }

          if (!_params.preventDefault) {

            if (type === "Chevron") _view.direction = "left"
            else if (type === "Icon") _view.name = "icon"
            else if (type === "Text") _view.text = ""
            else if (type === "Checkbox") _view.label = { text: "" }
          }
          
          views[_id] = _view
          var tags = await toView({ _window, lookupActions, awaits, id: _id, req, res, _: "", __: _, ___: __, viewer })
          return resolve(tags)
          
          // return resolve(tags)
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

      if (isParam({ _window, lookupActions, awaits, string: subParams })) {

        inheritedParams = {...inheritedParams, ...toParam({ req, res, _window, id, string: subParams, _, __, ___ })}

      } else {
        
        view.Data = view.Data || view.doc || parent.Data
        view.derivations = view.derivations || [...(parent.derivations || [])]
        var _id = toValue({ _window, lookupActions, awaits, value: subParams, id, req, res, _, __, ___ })
        
        if (views[_id] && view.id !== _id) view.id = _id + generate()
        else view.id = id = _id
        
        if (global.data[viewer][_id] && !view["creation-date"] && id !== _id) {
          
          view["my-views"].push(_id)
          views[_id] = { ...view, ...clone(global.data[viewer][_id]) }
          delete views[id]
          
          tags = await toView({ _window, lookupActions, awaits, id: _id, req, res, _, __, ___, viewer })
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
      view._ = _
      view.__ = __
      view.___ = ___
      views[id] = view
      
      if (global.breaktoView[id]) {

        global.breaktoView[id] = false
        return resolve("")
      }
    }

    // approval (after repeated  views conditions)
    var approved = toApproval({ _window, lookupActions, awaits, string: conditions, id, req, res, _, __, ___ })
    if (!approved) {
      delete views[id]
      return resolve("")
    }

    /////////////////// approval & params /////////////////////

    // push destructured params from type to view
    if (params) {
      
      params = toParam({ _window, lookupActions, awaits, string: params, id, req, res, mount: true, toView: true, _, __, ___ })

      if (params.id && params.id !== id) {

        if (views[params.id] && typeof views[params.id] === "object") params.id += generate()
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
        view = views[id]
      }

      // view
      /*if (!_import && (params.view || (!myViews.includes(view.type) && global.data[viewer][view.type]))) {

        var viewId = params.view || view.type
        delete view.view
        delete params.view
        view["my-views"].push(viewId)
        
        var newView = clone(global.data[viewer][viewId])
        if (!newView) return resolve("")
        if (newView.id && views[newView.id]) newView.id += generate()

        views[id] = { ...view,  ...newView, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)]}
        
        tags = await toView({ _window, lookupActions, awaits, id, req, res, params, _, __, ___, viewer })
        return resolve(tags)
      }*/
    } else params = {}
      
    // inherited params
    if (Object.keys(inheritedParams).length > 0) override(view, inheritedParams)

    // pass to children
    if (parent.passToChildren) override(view, parent.passToChildren)

    // before loading controls
    if (!_import && view.controls.length > 0) {
      await new Promise (async resolve => {
        
        toArray(view.controls).map(async (controls = {}) => {

          //
          if (!controls.event) return
          var event = toCode({ _window, lookupActions, awaits, string: controls.event })
          event = toCode({ _window, lookupActions, awaits, string: event, start: "'", end: "'" })

          if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ req, res, _window, id, string: event.split('?')[2], _, __, ___ })) {

            toParam({ req, res, _window, id, string: event.split("?")[1], toView: true, _, __, ___ })
            view.controls = view.controls.filter((controls = {}) => !controls.event.split("?")[0].includes("beforeLoading"))
          }
        })

        if (global.promises[id] && global.promises[id].length > 0) {
          
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          await Promise.all((global.promises[id] || []))
          
          delete global.promises[id]
        }

        resolve()
      })
    }
    
    if (!_import && (params.view || (!myViews.includes(view.type) && global.data[viewer][view.type]))) {
      
      var viewId = params.view || view.type
      view["my-views"].push(viewId)

      delete view.view
      delete params.view

      var newView = clone(global.data[viewer][viewId])
      if (!newView) return resolve("")
      if (newView.id && views[newView.id]) newView.id += generate()
      
      views[id] = { ...view,  ...newView, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)]}

      tags = await toView({ _window, lookupActions, awaits, id, req, res, _, __, ___, viewer })
      return resolve(tags)
    }

    if (_import) {

      tags = await createHtml({ _window, lookupActions, awaits, id, req, res, import: _import })
      return resolve(tags)
    }

    // for droplist
    if (parent.unDeriveData || view.unDeriveData) {

      view.data = view.data || ""
      view.unDeriveData = true

    } else view.data = reducer({ _window, lookupActions, awaits, id, path: view.derivations, value: view.data, key: true, object: global[view.Data] || {}, req, res, _, __, ___ })
    
    // doc
    if (!global[view.Data] && view.data) global[view.Data] = view.data

    // root
    if (view.parent === "root") views.root.child = view.id
    tags = await createTags({ _window, lookupActions, awaits, id, req, res, _, __, ___, viewer })
    resolve(tags)
  })
}

module.exports = { toView }