const { update } = require("./update")

module.exports = {
    route: ({ route = {} }) => {

        var global = window.global
        var path = route.path || global.path
        var currentPage = route.page || path.split("/")[1].split("?")[0] || "main"
        var title = route.title || global.data.page[currentPage].title
        
        if (!global.data.page[currentPage]) return
        global.data.page[currentPage]["view-id"] = global.data.page[currentPage]["view-id"] || []
        global.currentPage = currentPage
        global.path = path.split("?").join("/")
        
        history.pushState(null, title, global.path)
        document.title = title
        
        update({ id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0
    }
}