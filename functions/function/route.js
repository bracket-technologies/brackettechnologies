const { search } = require("./search")
const { update } = require("./update")

module.exports = {
    route: async ({ id, route = {} }) => {

        var views = window.views
        var global = window.global
        var path = route.path || global.path
        var currentPage = global.currentPage = route.page || path.split("/")[1] || "main"
        var notAvailableViews = []

        document.getElementsByClassName("loader-container")[0].style.display = "flex"

        if (!global.data.page[currentPage]) {
            
            await search({ id: "root", search: { collection: "page", doc: currentPage } })
            global.data.page[currentPage] = views.root.search.data
            if (!global.data.page[currentPage]) return
        }
        
        // check availability of views
        global.data.page[currentPage].views.map(viewId => {
            if (!global.data.view[viewId]) notAvailableViews.push(viewId)
        })
        
        if (notAvailableViews.length > 0) {

            await search({ id: "root", search: { collection: "view", docs: notAvailableViews, limit: 100 } })
            Object.entries(views.root.search.data).map(([doc, data]) => {
                global.data.view[doc] = data
            })
        }

        var title = route.title || global.data.page[currentPage].title

        global.currentPage = currentPage
        global.path = route.path ? path : currentPage === "main" ? "/" : currentPage

        history.pushState(null, title, global.path)
        document.title = title
        
        update({ id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0
        
        document.getElementsByClassName("loader-container")[0].style.display = "none"
    }
}