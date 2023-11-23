const nthParent = ({ _window, nth, o }) => {

    if (!o.__view__) return o
    var views = _window ? _window.views : window.views
      
    var n = 0, parent = o.id
    while (n < nth) {
      if (views[parent]) parent = views[parent].parent
      n++
    }
    
    return views[parent]
}

const nthNext = ({ _window, nth, o }) => {

    if (!o.__view__) return o
    var views = _window ? _window.views : window.views
      
    var n = 0, next = o.id
    while (n < nth) {
      if (views[next]) next = views[next].next
      n++
    }
    
    return views[next]
}

const nthPrev = ({ _window, nth, o }) => {

    if (!o.__view__) return o
    var views = _window ? _window.views : window.views
      
    var n = 0, prev = o.id
    while (n < nth) {
      if (views[prev]) prev = views[prev].prev
      n++
    }
    
    return views[prev]
}

const getAllParents = ({ _window, id }) => {

    var views = _window ? _window.views : window.views
    var view = views[id]
    if (!view.parent) return []

    var parentId = view.parent
    var all = [views[parentId]]
    
    all.push(...getAllParents({ _window, id: parentId }))

    return all
}

module.exports = { nthParent, getAllParents, nthNext, nthPrev }