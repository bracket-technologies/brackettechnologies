const { update } = require("./update")
const { clone } = require("./clone")
const { jsonToBracket } = require("./jsonToBracket")
const { reducer } = require("./reducer")
const { lineInterpreter } = require("./lineInterpreter")

const droplist = ({ id, e, __, stack, lookupActions }) => {
  
  var views = window.views
  var global = window.global
  var view = views[id]
  var droplistView = views.droplist

  if (!view.droplist) return
  if (view.droplist.searchable !== false) view.droplist.searchable = {}
  
  // items
  var items = clone(view.droplist.items) || []
  var derivations = view.droplist.path !== undefined ? (Array.isArray(view.droplist.path) ? view.droplist.path : view.droplist.path.split(".")) : view.derivations
  var doc = view.droplist.doc || view.doc

  // 
  droplistView = { ...droplistView, derivations, doc, __ }
  clearTimeout(global.__droplistTimer__)

  // input id
  var { data: inputID } = lineInterpreter({ id, data: "input().id||.id" })
  var text = views[inputID].element.value || views[inputID].element.innerHTML
  
  // items
  if (typeof items === "string") items = lineInterpreter({ id, data: items, lookupActions, __: view.__ }).data

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

  // init
  droplistView.children = []
  
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
            view: `Text?style:[fontSize=1.3rem;width=100%];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item.text)};class=flex align-center ${(item.text || {}).class || ""}?${item.text.text ? true : false}`,
            controls: [{
              event: `click?():[__droplistPositioner__:()].():[txt()=txt();data()=txt()]?!():${id}.droplist.preventDefault`
            }]
          }]
        })
  
      } else {
        
        return ({
          view: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${jsonToBracket(view.droplist.item && view.droplist.item.text || {})};${jsonToBracket(view.droplist.text || {})};${jsonToBracket(item)};class=flex align-center pointer ${item.class || ""}`,
          controls: [{
            event: `click?():[__droplistPositioner__:()].():[txt()=txt();data()=txt()]?!():${id}.droplist.preventDefault`,
          }]
        })
      }
    }))
    
  } else droplistView.children = []
  
  droplistView.positioner = id
  views.droplist = droplistView

  update({ id: "droplist", stack, lookupActions, __ })
  
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

                views[inputID].element.value = views[inputID].prevValue = items[_index]
                views[inputID].contenteditable = false

              } else {

                view.element.innerHTML = view.prevValue = items[_index]
                view.contenteditable = false
              }
              
              
            } else if (view.contenteditable === false || views[inputID].contenteditable === false) {
              
              if (inputID) {

                views[inputID].element.value = items[_index].slice(0, -1)
                views[inputID].contenteditable = true

              } else {

                view.element.innerHTML = items[_index].slice(0, -1)
                view.contenteditable = true
              }
            }
          }

          reducer({ id, data: droplistView.derivations, value: items[_index], object: global[droplistView.doc], key: true, __ })
          global.__keyupIndex__ = _index
        }
      }
    }

    global.__keyupIndex__ = global.__keyupIndex__ || 0
    droplistView.element.children[view.droplist.title ? global.__keyupIndex__ + 1 : global.__keyupIndex__].dispatchEvent(new Event("mouseenter"))
  }

  if (!view.droplist.preventDefault) global.__droplistTimer__ = setTimeout(mouseEnterItem, 100)
}

module.exports = { droplist }