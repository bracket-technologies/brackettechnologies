const { clone } = require("./clone")

const loadViews = async (res) => {

    var global = window.global, views = window.views
    if (global.unloadedViews.length === 0) return
    var unloadedViews = clone(global.unloadedViews)
    
    await unloadedViews.map(async (unloadedView, i) => {
        
        var { id, parent, view, index } = unloadedView
        await require("./search").search({ id: "root", search: { collection: "view", doc: view } })

        // view
        global.data.view[views.root.search.data.id] = views.root.search.data
        global.unloadedViews = global.unloadedViews.filter(unloadedView => unloadedView.view !== view)
        
        views[id] = clone(views.root.search.data)
        views[id].id = id
        views[id].index = index
        views[id].parent = parent

        // create html
        var innerHTML = require("./createElement").createElement({ id })
        
        // append html
        document.getElementById(parent).innerHTML += innerHTML

        if (i === unloadedViews.length - 1 && global.unloadedViews.length > 0) loadViews(res)
        else if (i === unloadedViews.length - 1) res("")
    })
}

module.exports = { loadViews }