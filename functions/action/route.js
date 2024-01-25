const { clone } = require("./clone")
const { update } = require("./update")
const { toView } = require("./toView")
const { toArray } = require("./toArray")

module.exports = {
    route: async ({ id, _window, route = {}, stack, lookupActions, address, req, res, __ }) => {
      
      var views = _window ? _window.views : window.views
      var global = _window ? _window.global : window.global

      // path
      var path = route.path || (route.page.includes("/") ? route.page : global.manifest.path.join("/"))
      
      // page
      var page = route.page && (route.page.includes("/") ? (!route.page.split("/")[0] ? route.page.split("/")[1] : route.page.split("/")[0]): route.page ) || path.split("/")[1] || "main"
      
      // recheck path
      path = route.path ? path : page === "main" ? "/" : `/${page}`

      // prevs
      global.__prevPath__.push(global.manifest.path.join("/"))
      global.__prevPage__.push(global.manifest.page)

      // page & path
      global.manifest.page = page
      global.manifest.path = path.split("/")

      // params
      route.path = path
      route.page = page
      
      if (_window) {
        
        global.__updateLocation__ = true
        views.root.children = [clone(global.data.view[page])]
        
        if (id !== "root") {

          toArray(global.promises[id]).push(new Promise (async resolve => {
              
              global.__html__ = toView({ _window, __parent__: "body", req, res, lookupActions, stack: stack.address, address, __ })
              global.breaktoView[id] = true
              resolve()
            })
          )
        }

      } else update({ _window, req, res, stack, lookupActions, address, id: "root", data: { route }, __ })
    }
}