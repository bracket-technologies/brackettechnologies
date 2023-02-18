const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { setElement } = require("./setElement")
const { starter } = require("./starter")
const { search } = require("./search")

const loadViews = async (first) => {

    var global = window.global, views = window.views, promises = []
    if (global.unloadedViews.length === 0) return
    var unloadedViews = clone(global["unloadedViews"])

    // display loader
    document.getElementById("loader-container").style.display = "flex"
    
    // get all views
    if (first) {

      document.getElementById("loader-container").style.display = "flex"
      var docs = (global["lazy-load-views"] || []).filter(doc => !(global["fast-load-views"] || []).includes(doc))
      
      promises.push(search({ id: "root", search: { collection: "page", limit: 100 } }))
      promises.push(search({ id: "public", search: { collection: "view", docs, limit: 100 } }))
      
      await Promise.all(promises)
      
      Object.entries(views.root.search.data).map(([doc, data]) => global.data.page[doc] = data)
      Object.entries(views.public.search.data).map(([doc, data]) => global.data.view[doc] = data)
    }

    await unloadedViews.map(async (unloadedView, i) => {
        
      var { id, parent, view, index } = unloadedView
      
      // view
      global.unloadedViews = global.unloadedViews.filter(unloadedView => unloadedView.view !== view)

      // view doesnot exist
      if (!global.data.view[view]) {
        promises.push(search({ id: "root", search: { collection: "view", doc: view }, await: `data:().view.${view}=().search.data`, asyncer: true }))
        await Promise.all(promises)
      }
      
      if (!views[id] || !views[parent]) return
      views[id] = clone(global.data.view[view])
      views[id].id = id
      views[id].index = index
      views[id].parent = parent

      // create html
      var innerHTML = await createElement({ id })
      
      lDiv = document.createElement("div")
      document.body.appendChild(lDiv)
      lDiv.style.position = "absolute"
      lDiv.style.opacity = "0"
      lDiv.style.left = -1000
      lDiv.style.top = -1000
      lDiv.innerHTML = innerHTML
      var el = lDiv.children[0]

      // append html
      var parentEl = document.getElementById(parent)
      if (index >= parentEl.children.length) parentEl.appendChild(el)
      else parentEl.insertBefore(el, parentEl.children[index])

      var idList = innerHTML.split("id='").slice(1).map(id => id.split("'")[0])

      idList.map(id => setElement({ id }))
      idList.map(id => starter({ id }))
      
      /*setTimeout(() => {
        idList.filter(id => views[id] && views[id].type === "Icon").map(id => views[id]).map(map => {
            
          map.element.style.opacity = map.style.opacity !== undefined ? map.style.opacity : "1"
          map.element.style.transition = map.style.transition !== undefined ? map.style.transition : "none"
        })
      }, 0)*/

      // remove lDiv
      if (lDiv) {
        document.body.removeChild(lDiv)
        lDiv = null
      }

      if (i === unloadedViews.length - 1 && global.unloadedViews.length > 0) loadViews()
    })

    // hide loader
    document.getElementById("loader-container").style.display = "none"
}

module.exports = { loadViews }