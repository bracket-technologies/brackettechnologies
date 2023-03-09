const { clone } = require("./clone")
const { update } = require("./update")
const { createElement } = require("./createElement")
const { toArray } = require("./toArray")

module.exports = {
    route: async ({ id, _window, route = {}, req, res }) => {
      
      var views = _window ? _window.views : window.views
      var global = _window ? _window.global : window.global
      global.prevPath.push(global.path)
      if (global.prevPath.length > 5) global.prevPath.shift()
      var path = route.path || global.path
      global.prevPage.push(global.currentPage)
      if (global.prevPage.length > 5) global.prevPage.shift()
      var currentPage = global.currentPage = route.page || path.split("/")[1] || "main"

      global.currentPage = currentPage
      global.path = route.path ? path : currentPage === "main" ? "/" : (currentPage.charAt(0) === "/" ? currentPage : `/${currentPage}`)
      console.log(global.path);
      if (res) {
        
        global.updateLocation= true
        views.root.children = [{ ...clone(global.data.page[currentPage]), id: currentPage }]
        
        if (id !== "root") {

          global.promises[id] = toArray(global.promises[id])

          var myFn = () => {
            return new Promise (async resolve => {
              
              var innerHTML = await createElement({ _window, id: "root", req, res })
              if (!global.innerHTML.root) global.innerHTML.root = innerHTML
              global.breakCreateElement[id] = true
              resolve()
            })
          }

          global.promises[id].push(myFn())
        }

      } else {
      
        if (document.getElementById("loader-container")) document.getElementById("loader-container").style.display = "flex"
        update({ _window, req, res, id: "root", route })
      }
    }
}