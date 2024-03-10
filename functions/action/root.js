const { clone } = require("./clone")
const { update } = require("./kernel")

module.exports = {
  root: ({ id, _window, root = {}, stack, lookupActions, address, req, res, __ }) => {

    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    // path
    var path = root.path || (root.page.includes("/") ? root.page : global.manifest.path.join("/"))

    // page
    var page = root.page && (root.page.includes("/") ? (!root.page.split("/")[0] ? root.page.split("/")[1] : root.page.split("/")[0]) : root.page) || path.split("/")[1] || "main"

    // recheck path
    path = root.path ? path : page === "main" ? "/" : `/${page}`

    // prevs
    global.__prevPath__.push(global.manifest.path.join("/"))
    global.__prevPage__.push(global.manifest.page)

    // page & path
    global.manifest.page = page
    global.manifest.path = path.split("/")

    // params
    root.path = path
    root.page = page

    update({ _window, id, req, res, stack, lookupActions, address, data: { root, id: "root", action: "ROOT" }, __ })
  }
}