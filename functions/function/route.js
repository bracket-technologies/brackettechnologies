const { update } = require("./update")

module.exports = {
    route: ({ route = {} }) => {

        var path = route.path || global.path
        var currentPage = route.page || path.split("/")[1].split("?")[0] || "main"
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