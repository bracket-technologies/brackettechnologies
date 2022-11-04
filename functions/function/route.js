const { clone } = require("./clone")
const { toParam } = require("./toParam")
const { search } = require("./search")
const { toArray } = require("./toArray")
const { toCode } = require("./toCode")
const { update } = require("./update")
const { toApproval } = require("./toApproval")
const { createElement } = require("./createElement")

module.exports = {
    route: async ({ id, _window, route = {}, req, res }) => {

        var views = _window ? _window.views : window.views
        var global = _window ? _window.global : window.global
        var currentPage = global.currentPage = route.page || path.split("/")[1] || "main"

        global.currentPage = currentPage
        global.path = route.path ? path : currentPage === "main" ? "/" : (currentPage.charAt(0) === "/" ? currentPage : `/${currentPage}`)
        
        if (res) {
          
          global.updateLocation= true
          views.root.children = clone([global.data.page[currentPage]])
          if (id !== "root") global.innerHTML.root = createElement({ _window, id: "root", req, res })
          return
        }
        
        if (document.getElementsByClassName("loader-container")[0]) 
          document.getElementsByClassName("loader-container")[0].style.display = "flex"

        update({ _window, req, res, id: "root" })
        document.body.scrollTop = document.documentElement.scrollTop = 0

        var title = route.title || views[views.root.element.children[0].id].title
        var path = route.path || views[views.root.element.children[0].id].path

        history.pushState(null, title, path)
        document.title = title
        
        if (document.getElementsByClassName("loader-container")[0]) 
          document.getElementsByClassName("loader-container")[0].style.display = "none"
    }
}