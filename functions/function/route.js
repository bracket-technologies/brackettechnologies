const { search } = require("./search")
const { update } = require("./update")

module.exports = {
    route: async ({ id, route = {} }) => {

        var global = window.global
        var path = route.path || global.path
        var currentPage = route.page || path.split("/")[1] || "main"
        
        if (!global.data.view[currentPage]) await search({ id, search: { collection: "page", doc: currentPage }, await: `data:().page.${currentPage}=().search.data`, asyncer: true })

        var title = route.title || global.data.page[currentPage].title

        if (!global.data.page[currentPage]) return
        global.data.page[currentPage]["views"] = global.data.page[currentPage]["views"] || []
        global.currentPage = currentPage
        global.path = route.path ? path : currentPage === "main" ? "/" : currentPage

        history.pushState(null, title, global.path)
        document.title = title
        
        update({ id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0
    }
}