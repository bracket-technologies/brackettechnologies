const { clone } = require("./clone")
const { generate } = require("./generate")

const initView = ({ views, global, id = generate(), doc, children = [], parent, __parent__, __status__ = "Loading", __dataPath__, __controls__ = [], ...data }) => {

    var parentView = (parent || __parent__ ? views[parent || __parent__] : {}) || {}

    views[id] = {
        ...data,
        id,
        children,
        doc: doc || parentView.doc,
        __status__,
        __view__: true,
        __parent__: parent || __parent__,
        __dataPath__: __dataPath__ || [...(parentView.__dataPath__ || [])],
        __indexing__: 0,
        __name__: data.view,
        __controls__,
        __childrenRef__: [],
        __timers__: [],
        __rendered__: false,
        __initialIndex__: parentView.__indexing__ || 0,
        __viewPath__: [...(data.__viewPath__ || [])],
        __lookupViewActions__: [...(data.__lookupViewActions__ || parentView.__lookupViewActions__ || [])],
        __customViewPath__: [...(data.__customViewPath__ || parentView.__customViewPath__ || [])]
    }

    if (parentView.__indexing__ > -1) parentView.__indexing__ += 1

    return { id, view: views[id] }
}

const getViewParams = ({ view }) => {
    
    var { id, doc, data, view, children, __lookupViewActions__, __element__, __dataPath__, __childrenRef__, __index__,
        __viewPath__, __customViewPath__, __indexing__, __childIndex__, __initialIndex__, __customView__, __htmlStyles__,
        __parent__, __controls__, __status__, __rendered__, __timers__, __view__, __name__, __customID__, __interpreted__, __, ...params } = view
        
    return params
}

const removeView = ({ _window, id, stack, self = true, main, insert }) => {
    
    const views = _window ? _window.views : window.views
    var view = views[id] || {}, parent = views[view.__parent__], element = {}
    
    view.__childrenRef__.map(({ id }) => id).map(id => removeView({ _window, id, stack, insert }))

    if (self && view.id) {

        view.__timers__.map(timerID => clearTimeout(timerID))

        var index = parent.__childrenRef__.findIndex(({ id }) => id === view.id)

        if (index >= 0) {
            main && parent.__childrenRef__.slice(index).map(viewRef => {
                
                viewRef.index--
                views[viewRef.id].__index__ = viewRef.index
                views[viewRef.id].__rendered__ && views[viewRef.id].__element__.setAttribute("index", viewRef.index)
            })
            parent.__childrenRef__.splice(index, 1)
        }

        if (main) element = view.__element__
        
        // deepDelete({ obj: global.__events__, key: id })

        blockRelatedAddressesByViewID({ stack, id })

        // Object.keys(view).map(key => delete view[key])

        delete views[id]
    }

    return element
}

const deepDelete = ({ obj, key }) => {

    if (typeof obj !== "object") return obj
    if (typeof obj[key] === "object") 
        Object.keys(obj[key]).map(key => {
            deepDelete({ obj: obj[key], key })
        })

    delete obj[key]
}

const blockRelatedAddressesBynextAddress = ({ stack, index }) => {
    
    var address = stack.addresses[index]
    address.interpreting = false

    // block nextAddress
    if (address.blockable) stack.addresses[index].blocked = true

    // remove child addresses
    var index = stack.addresses.findIndex(({ nextAddressID, blocked, blockable }) => blockable && !blocked && nextAddressID === address.id)
    if (index !== -1) blockRelatedAddressesBynextAddress({ stack, index })
}

const blockRelatedAddressesByViewID = ({ stack, id }) => {

    // delete addresses
    var index = stack.addresses.findIndex(({ viewID, blocked }) => !blocked && viewID === id)
    if (index !== -1) blockRelatedAddressesBynextAddress({ stack, index })
}

module.exports = { initView, getViewParams, removeView }