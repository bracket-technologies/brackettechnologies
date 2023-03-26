const { clone } = require("./clone")
const { update } = require("./update")
const { toView } = require("./toView")
const { toArray } = require("./toArray")

module.exports = {
    route: async ({ id, _window, route = {}, req, res }) => {
      
      var views = _window ? _window.views : window.views
      var global = _window ? _window.global : window.global
      global.prevPath.push(global.path)
      if (global.prevPath.length > 5) global.prevPath.shift()
      var path = route.path || (route.page.includes("/") ? route.page : global.path)
      global.prevPage.push(global.currentPage)
      if (global.prevPage.length > 5) global.prevPage.shift()
      var currentPage = global.currentPage = route.page && (route.page.includes("/") ? (!route.page.split("/")[0] ? route.page.split("/")[1] : route.page.split("/")[0]): route.page ) || path.split("/")[1] || "main"

      global.currentPage = currentPage
      global.path = route.path ? path : currentPage === "main" ? "/" : (currentPage.charAt(0) === "/" ? currentPage : `/${currentPage}`)
      
      if (res) {
        
        global.updateLocation = true
        views.root.children = [{ ...clone(global.data.page[currentPage]), id: currentPage, ["my-views"]: [currentPage] }]
        
        if (id !== "root") {

          global.promises[id] = toArray(global.promises[id])

          global.promises[id].push(new Promise (async resolve => {
              
              var innerHTML = await toView({ _window, id: "root", req, res })
              if (!global.__INNERHTML__.root) global.__INNERHTML__.root = innerHTML
              global.breaktoView[id] = true
              resolve()
            })
          )
          
        }

      } else {
      
        if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "flex"
        update({ _window, req, res, id: "root", route })
      }
    }
}