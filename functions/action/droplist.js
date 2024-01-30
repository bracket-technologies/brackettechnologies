const { update } = require("./update")
const { clone } = require("./clone")
const { jsonToBracket } = require("./jsonToBracket")
const { reducer } = require("./reducer")
const { lineInterpreter } = require("./lineInterpreter")

const droplist = ({ id, e, __, stack, lookupActions, address }) => {
  
  var views = window.views
  var global = window.global
  var view = views[id]

  if (!view.droplist) return
  if (view.droplist.searchable !== false) view.droplist.searchable = {}

  // closedroplist
  var mouseleaveEvent = new Event("mouseleave")
  views.droplist.__element__.dispatchEvent(mouseleaveEvent)
  
  // items
  var items = clone(view.droplist.items) || []
  var __dataPath__ = view.droplist.path !== undefined ? (Array.isArray(view.droplist.path) ? view.droplist.path : view.droplist.path.split(".")) : view.__dataPath__
  var doc = view.droplist.doc || view.doc

  // init droplist
  var droplistView = { ...global.data.view.droplist, children: [], __dataPath__, doc, __parent__: "root", __, __childIndex__: views.droplist.__childIndex__, __viewPath__: ["droplist"], __customViewPath__: ["droplist"] }

  // remove prev droplist
  // clearTimeout(global.__droplistTimer__)

  // input id
  var { data: inputID } = lineInterpreter({ id, data: { string: "input().id||.id" } })
  var text = views[inputID].__element__.value || views[inputID].__element__.innerHTML
  
  // items
  if (typeof items === "string") items = lineInterpreter({ id, data: { string: items }, lookupActions, __: view.__ }).data

  // filterable
  if (!view.droplist.preventDefault) {

    if ((view.droplist.searchable || {}).filter && text) {
      
      items = items.filter(item => view.droplist.searchable.any 
        ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
        : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
      )

      global.__keyupIndex__ = 0
    }
  }
  
  // title
  if (view.droplist.title) {

    var Title
    if (typeof view.droplist.title === "string" || typeof view.droplist.title === "number") Title = clone({ text: view.droplist.title })
    else Title = clone(view.droplist.title)

    if (Title.icon) {

      if (typeof Title.icon === "string") Title.icon = { name: Title.icon }
      var title = clone(Title)

      droplistView.children.push({
        view: `View?style:[minHeight=3rem;height=100%;gap=1rem;cursor=default];${jsonToBracket({ style: view.droplist.item && view.droplist.item.style || {} })};${jsonToBracket(view.droplist.item && view.droplist.item.container || {})};${jsonToBracket(Title.container || {})};class=flex align-items pointer ${(Title.container || {}).class || ""}`,
        children: [{
          view: `View?style:[height=100%;width=fit-content];${jsonToBracket(Title.icon.container || {})};class=flexbox ${(Title.icon.container || {}).class || ""}`,
          children: [{
            view: `Icon?style:[color=#888;fontSize=1.8rem];${jsonToBracket(view.droplist.icon || {})};${jsonToBracket(Title.icon || {})};class=flexbox ${(Title.icon || {}).class || ""}`
          }]
        }, {
          view: `Text?style:[padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%;fontWeight=bold];${jsonToBracket(title)};class=flex align-center ${(title || {}).class || ""}`,
        }]
      })

    } else droplistView.children.push({
      view: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%;fontWeight=bold;cursor=default];${jsonToBracket(view.droplist.item || {})};${jsonToBracket(Title)};class=flex align-center ${(Title || {}).class || ""}`,
    })
  }
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    droplistView.children.push(...clone(items).map(item => {

      if (typeof item === "string" || typeof item === "number") item = { text: item }
      item.text = item.text !== undefined ? `${item.text}` : ""

      if (item.icon) {
  
        if (typeof item.icon === "string") item.icon = { name: item.icon }
        if (typeof item.text === "string") item.text = { text: item.text }
        
        return ({
          view: `View?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;gap=1rem];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item || {})};${jsonToBracket(item || {})};class=flex align-items pointer ${item.class || ""}`,
          children: [{
            view: `View?style:[height=inherit;width=fit-content];${jsonToBracket(item.icon.container || {})};class=flexbox ${(item.icon.container || {}).class || ""}`,
            children: [{
              view: `Icon?style:[color=#666;fontSize=1.7rem];${jsonToBracket(view.droplist.item && view.droplist.item.icon || {})};${jsonToBracket(view.droplist.icon || {})};${jsonToBracket(item.icon || {})};class=flexbox ${(item.icon || {}).class || ""}`
            }]
          }, {
            view: `Text?style:[fontSize=1.3rem;width=100%];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item.text)};class=flex align-center ${(item.text || {}).class || ""};click:[():[__droplistPositioner__:()].():[txt()=txt();data()=txt()]?!():${id}.droplist.preventDefault]?${item.text.text ? true : false}`
          }]
        })
  
      } else {
        
        return ({
          view: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item)};class=flex align-center pointer ${item.class || ""};click:[():[__droplistPositioner__:()].():[txt()=txt();data()=txt()]?!():${id}.droplist.preventDefault]`,
        })
      }
    }))
    
  } else droplistView.children = []
  
  droplistView.positioner = id
  
  update({ stack, lookupActions, __, address, data: { id: "droplist", view: droplistView } })
  droplistView = views.droplist
  
  // searchable
  var mouseEnterItem = () => {

    var _index, onlyOne
    if (view.droplist && view.droplist.searchable) {

      if (text) {
        
        _index = items.findIndex(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
        )

        // fills input value
        onlyOne = items.filter(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(text.toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, text.toString().length) === text.toString().toLowerCase()
        ).length === 1
        
        if (_index !== -1) {
          
          if (onlyOne) {
            
            if (e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward" && e.inputType !== "deleteWordBackward" && e.inputType !== "deleteWordForward") {

              if (inputID) {

                views[inputID].__element__.value = views[inputID].prevValue = items[_index]
                views[inputID].contenteditable = false

              } else {

                view.__element__.innerHTML = view.prevValue = items[_index]
                view.contenteditable = false
              }
              
              
            } else if (view.contenteditable === false || views[inputID].contenteditable === false) {
              
              if (inputID) {

                views[inputID].__element__.value = items[_index].slice(0, -1)
                views[inputID].contenteditable = true

              } else {

                view.__element__.innerHTML = items[_index].slice(0, -1)
                view.contenteditable = true
              }
            }
          }

          reducer({ id, data: { path: droplistView.__dataPath__, object: global[droplistView.doc], key: true, value: items[_index] }, __ })
          global.__keyupIndex__ = _index
        }
      }
    }

    global.__keyupIndex__ = global.__keyupIndex__ || 0
    droplistView.__element__.children[view.droplist.title ? global.__keyupIndex__ + 1 : global.__keyupIndex__].dispatchEvent(new Event("mouseenter"))
  }

  /*if (!view.droplist.preventDefault) */global.__droplistTimer__ = setTimeout(mouseEnterItem, 100)
}

module.exports = { droplist }