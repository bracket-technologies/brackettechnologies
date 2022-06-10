const { clone } = require("./clone")
const { createElement } = require("./createElement")
const { setElement } = require("./setElement")
const { starter } = require("./starter")
const { search } = require("./search")

const loadViews = async (first) => {

    var global = window.global, views = window.views
    if (global.unloadedViews.length === 0) return
    var unloadedViews = clone(global.unloadedViews)
    
    // get all views
    if (first) {

      document.getElementsByClassName("loader-container")[0].style.display = "flex"
      var view, page, docs = global["lazy-load-views"].filter(doc => !global["fast-load-views"].includes(doc))
      page = await search({ id: "public", search: { collection: "page", limit: 100 } })
      view = await search({ id: "root", search: { collection: "view", docs, limit: 100 } })
      
      // view
      global.data.page = views.public.search.data
      Object.entries(views.root.search.data).map(([id, doc]) => {
        global.data.view[id] = doc
      })
    }

    unloadedViews.map((unloadedView, i) => {
        
        var { id, parent, view, index } = unloadedView
        
        // view
        global.unloadedViews = global.unloadedViews.filter(unloadedView => unloadedView.view !== view)
        console.log(id, global.data.view[view], view);
        views[id] = clone(global.data.view[view])
        views[id].id = id
        views[id].index = index
        views[id].parent = parent

        // create html
        var innerHTML = createElement({ id })
        
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

    if (first) document.getElementsByClassName("loader-container")[0].style.display = "none"
}

module.exports = { loadViews }