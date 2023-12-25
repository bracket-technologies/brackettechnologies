const { clone } = require("./clone")
const { update } = require("./update")
const { toView } = require("./toView")
const { toArray } = require("./toArray")

module.exports = {
    route: async ({ id, _window, route = {}, stack, lookupActions, req, res, __ }) => {
      
      var views = _window ? _window.views : window.views
      var global = _window ? _window.global : window.global

      // path
      var path = route.path || (route.page.includes("/") ? route.page : global.manifest.path.join("/"))
      
      // page
      var currentPage = route.page && (route.page.includes("/") ? (!route.page.split("/")[0] ? route.page.split("/")[1] : route.page.split("/")[0]): route.page ) || path.split("/")[1] || "main"
      
      // recheck path
      path = route.path ? path : currentPage === "main" ? "/" : `/${currentPage}`

      // prevs
      global.__prevPath__.push(global.manifest.path.join("/"))
      global.__prevPage__.push(global.manifest.currentPage)

      // update globals
      global.manifest.currentPage = currentPage
      global.manifest.path = path.split("/")
      
      if (_window) {
        
        global.__updateLocation__ = true
        views.root.children = [clone(global.data.view[currentPage])]
        
        if (id !== "root") {

          global.promises[id] = toArray(global.promises[id])

          // change path and title
          views.root.controls.push({ event: "loaded?history().pushState()::[():root.title]:[path:()]"})

          global.promises[id].push(new Promise (async resolve => {
              
              global.__html__ = await toView({ _window, id: "body", req, res, __ })
              global.breaktoView[id] = true
              resolve()
            })
          )
        }

      } else {
        
        route.path = path
        route.currentPage = currentPage
        
        if (document.getElementById("loader-container").style.display === "none") document.getElementById("loader-container").style.display = "flex"
        update({ _window, req, res, stack, lookupActions, id: "root", route, __ })
      }
    }
}