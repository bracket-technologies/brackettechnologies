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

const myViews = [ 
  "View", "Box", "Text", "Icon", "Image", "Input", "Video", "Entry", "Map",
  "Swiper", "Switch", "Checkbox", "Swiper", "List", "Item"
]

const createElement = ({ _window, id, req, res, import: _import, params: inheritedParams }) => {

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
    view.type = toCode({ _window, string: view.type })
    view.type = toCode({ _window, string: view.type, start: "'", end: "'" })
    
    // 
    var type = view.type.split("?")[0]
    var params = view.type.split("?")[1]
    var conditions = view.type.split("?")[2]

    // [type]
    if (!view.duplicatedElement && type.includes("coded()")) view.mapType = true
    type = view.type = toValue({ _window, value: type, id, req, res })

    // id
    var priorityId = false, _id = view.type.split(":")[1]

    if (_id) {
      
      if (views[_id] && view.id !== _id) view.id = _id + generate()
      else view.id = id = _id
      
      if (!view["creation-date"] && global.data.view[_id] && id !== _id) {
        
        view["my-views"].push(_id)
        views[_id] = { ...view, ...clone(global.data.view[_id]) }
        delete views[id]
        
        tags = await createElement({ _window, id: _id, req, res })
        return resolve(tags)
      }

      priorityId = true
      type = view.type = view.type.split(":")[0]
    }

    view.id = view.id || generate()
    id = view.id

    // style
    if (!_import) {

      view.style = view.style || {}

      // class
      view.class = view.class || ""
      
      // Data
      view.Data = view.Data || view.doc || parent.Data

      // derivations
      view.derivations = view.derivations || [...(parent.derivations || [])]

      // controls
      view.controls = view.controls || []

      // status
      view.status = "Loading"

      // first mount of view
      views[id] = view

      // approval
      var approved = toApproval({ _window, string: conditions, id, req, res })
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
        var event = toCode({ _window, string: controls.event })
        event = toCode({ _window, string: event, start: "'", end: "'" })

        if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ req, res, _window, id, string: event.split('?')[2] })) {

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
      
      params = toParam({ _window, string: params, id, req, res, mount: true, createElement: true })

      // break
      /*if (params["break()"]) delete params["break()"]
      if (params["return()"]) return delete params["return()"]*/

      if (params.id && params.id !== id) {

        if (views[params.id] && typeof views[params.id] === "object") params.id += generate()
        delete Object.assign(views, { [params.id]: views[id] })[id]
        id = params.id
      }
      
      // name is inherited from mapper as a list
      //if (view.type === "Icon" && view.mapIndex !== undefined && view.data && Array.isArray(view.name)) view.name = view.data

      // inherited params
      if (inheritedParams) override(view, inheritedParams)

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
        
        // console.log(views[id]);
        tags = await createElement({ _window, id, req, res, params })
        return resolve(tags)
      }

    } else if (!_import && (!myViews.includes(view.type) && global.data.view[view.type])) {
      
      var viewId = view.type
      view["my-views"].push(viewId)
      var newView = clone(global.data.view[viewId])
      if (!newView) return resolve("")
      if (newView.id && views[newView.id]) newView.id += generate()
      
      views[id] = { ...view,  ...newView, controls: [...toArray(view.controls), ...toArray(newView.controls)], children: [...toArray(view.children), ...toArray(newView.children)]}

      tags = await createElement({ _window, id, req, res })
      return resolve(tags)
    }
    /*
    // before loading controls
    await new Promise (async resolve => {
      
      toArray(view.controls).map(async (controls = {}) => {

        //
        if (!controls.event) return
        var event = toCode({ _window, string: controls.event })
        event = toCode({ _window, string: event, start: "'", end: "'" })

        if (event.split("?")[0].split(";").find(event => event.slice(0, 13) === "beforeLoading") && toApproval({ req, res, _window, id: "root", string: event.split('?')[2] })) {

          toParam({ req, res, _window, id: "root", string: event.split("?")[1], createElement: true })
          view.controls = view.controls.filter((controls = {}) => !controls.event.split("?")[0].includes("beforeLoading"))
        }
      })

      if (global.promises && global.promises.length > 0) {
        await Promise.all(global.promises)
        await Promise.all(global.promises)
        await Promise.all(global.promises)
        await Promise.all(global.promises)
        global.promises = []
      }

      resolve()
    })

    if (global.breakCreateElement[id]) {
      
      global.breakCreateElement[id] = false
      return resolve()
    }
*/
    if (_import) {

      tags = await createHtml({ _window, id, req, res, import: _import })
      return resolve(tags)
    }

    if (type === "Icon" && Array.isArray(view.name)) {

      view.Data = generate();
      global[view.Data] = clone(view.name)
      delete view.name;
      
    } else if (type === "Image" && Array.isArray(view.src)) {

      view.Data = generate();
      global[view.Data] = clone(view.src)
      delete view.src;

    } else if (type === "Text" && Array.isArray(view.text)) {

      view.Data = generate();
      global[view.Data] = clone(view.text)
      delete view.text;
    }

    // for droplist
    if (parent.unDeriveData || view.unDeriveData) {

      view.data = view.data || ""
      view.unDeriveData = true

    } else view.data = reducer({ _window, id, path: view.derivations, value: view.data, key: true, object: global[view.Data], req, res })
    
    if (view.parent === "root") views.root.child = view.id

    tags = await createTags({ _window, id, req, res })
    resolve(tags)
  })
}

module.exports = { createElement }
