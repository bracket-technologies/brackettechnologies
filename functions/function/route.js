const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { search } = require("./search")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { update } = require("./update")
const { toApproval } = require("./toApproval")

module.exports = {
    route: async ({ _window, route = {}, req, res }) => {

        var views = _window ? _window.views : window.views
        var global = _window ? _window.global : window.global
        var path = route.path || global.path
        var currentPage = global.currentPage = route.page || path.split("/")[1] || "main"
        // var notAvailableViews = []

        /*if (!global.data.page[currentPage]) {
            
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
        }*/

        var title = route.title || global.data.page[currentPage].title

        global.currentPage = currentPage
        global.path = route.path ? path : currentPage === "main" ? "/" : currentPage

        if (res) {

          // controls & views
          views.root.controls = clone(global.data.page[currentPage].controls || [])
          views.root.children = clone([global.data.view[global.data.page[currentPage].view]])

          // inherit view name
          views.root["my-views"] = [global.data.page[currentPage].view]

          // controls
          toArray(views.root.controls).map((controls = {}) => {
            var event = toCode({ _window, string: controls.event || "" })
            if (event.split("?")[0].split(";").find(event => event.slice(0, 7) === "beforeLoading") && toApproval({ req, res, _window, string: event.split('?')[2] }))
              toParam({ req, res, _window, string: event.split("?")[1], req, res })
          })

          return
        }

        history.pushState(null, title, global.path)
        document.title = title
        
        document.getElementsByClassName("loader-container")[0].style.display = "flex"

        update({ _window, req, res, id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0
        
        document.getElementsByClassName("loader-container")[0].style.display = "none"
    }
}