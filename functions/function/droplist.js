const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")
const { reducer } = require("./reducer")
const { toCode } = require("./toCode")
const { toParam } = require("./toParam")

const droplist = ({ id, e, droplist: params = {} }) => {
  
  if (params.positioner || params.id) id = params.positioner || params.id
  var views = window.views
  var global = window.global
  var view = window.views[id]
  var dropList = views["droplist"]
  if (!view.droplist) return
  view.droplist.searchable = view.droplist.searchable || view.droplist.search || {}
  if (view.droplist.searchable && typeof view.droplist.searchable !== "object") view.droplist.searchable = {}
  
  // items
  var items = clone(view.droplist.items) || []
  dropList.derivations = clone(view.derivations)
  dropList.Data = view.Data
  clearTimeout(global.droplistTimer)
  
  // path & derivations
  if (view.droplist.path) dropList.derivations.push(...view.droplist.path.split("."))

  // input id
  var input_id = view.type === "Input" ? view.id : ""
  if (!input_id) {
    
    input_id = view.element.getElementsByTagName("INPUT")[0]
    if (input_id) {

      input_id = input_id.id
      global["droplist-search-txt"] = views[input_id].element.value

    } else global["droplist-search-txt"] = views[view.id].element.innerHTML
  }

  // items
  if (typeof items === "string")
    items = clone(toValue({ id, e, value: toCode({ string: toCode({ string: items }), start: "'", end: "'" }) }))

  // filterable
  if (!view.droplist.preventDefault) {

    if ((view.droplist.searchable || {}).filter && global["droplist-search-txt"] !== undefined && global["droplist-search-txt"] !== "") {
      
      items = items.filter(item => view.droplist.searchable.any 
        ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
        : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
      )

      global["keyup-index"] = 0
    }
  }

  // initialize
  dropList.children = []
  
  // title
  if (view.droplist.title) {

    var Title
    if (typeof view.droplist.title === "string" || typeof view.droplist.title === "number") Title = clone({ text: view.droplist.title })
    else Title = clone(view.droplist.title)

    if (Title.icon) {

      if (typeof Title.icon === "string") Title.icon = { name: Title.icon }
      var title = clone(Title)

      delete title.icon
      delete title.container

      dropList.children.push({
        type: `View?style:[minHeight=3rem;height=100%;gap=1rem;cursor=default];${toString({ style: view.droplist.item && view.droplist.item.style || {} })};${toString(view.droplist.item && view.droplist.item.container || {})};${toString(Title.container || {})};class=flex align-items pointer ${(Title.container || {}).class || ""}`,
        children: [{
          type: `View?style:[height=100%;width=fit-content];${toString(Title.icon.container || {})};class=flexbox ${(Title.icon.container || {}).class || ""}`,
          children: [{
            type: `Icon?style:[color=#888;fontSize=1.8rem];${toString(view.droplist.icon || {})};${toString(Title.icon || {})};class=flexbox ${(Title.icon || {}).class || ""}`
          }]
        }, {
          type: `Text?style:[padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%;fontWeight=bold];${toString(title)};class=flex align-center ${(title || {}).class || ""}`,
        }]
      })

    } else dropList.children.push({
      type: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%;fontWeight=bold;cursor=default];${toString(view.droplist.item || {})};${toString(Title)};class=flex align-center ${(Title || {}).class || ""}`,
    })
  }
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children.push(...clone(items).map(item => {

      if (typeof item === "string" || typeof item === "number") item = { text: item }
      item.text = item.text !== undefined ? `'${item.text}'` : ""
      if (item.icon) {
  
        if (typeof item.icon === "string") item.icon = { name: item.icon }
        if (typeof item.text === "string") item.text = { text: item.text }
        
        return ({
          view: `View?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;gap=1rem];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${toString(view.droplist.item || {})};${toString(item || {})};class=flex align-items pointer ${(item || {}).class || ""}`,
          children: [{
            view: `View?style:[height=inherit;width=fit-content];${toString(item.icon.container || {})};class=flexbox ${(item.icon.container || {}).class || ""}`,
            children: [{
              view: `Icon?style:[color=#888;fontSize=1.8rem];${toString(view.droplist.item && view.droplist.item.icon || {})};${toString(view.droplist.icon || {})};${toString(item.icon || {})};class=flexbox ${(item.icon || {}).class || ""}`
            }]
          }, {
            view: `Text?style:[fontSize=1.3rem;width=100%];${toString(view.droplist.item && view.droplist.item.text || {})};${toString(view.droplist.text || {})};${toString(item.text)};class=flex align-center ${(item.text || {}).class || ""};caller=${id}?${item.text.text ? true : false}`,
            controls: [...(view.droplist.controls || []), {
              event: `click??!():${id}.droplist.preventDefault`,
              actions: [ // :[focus:${input_id}]
                `wait():[resize:${input_id}]:[isArabic:${input_id}]?if():${input_id?true:false}:[():${input_id}.data()=txt().replace():'&amp;':'&';if():[():${input_id}.data().type()=boolean]:[():${input_id}.data()=():${input_id}.data().boolean()];():${input_id}.txt()=txt().replace():'&amp;':'&']:[():${id}.data()=txt().replace():'&amp;':'&';():${id}.txt()=txt().replace():'&amp;':'&']?!():${id}.droplist.isMap`,
                `?if():[txt()=list||txt()=map]:[opened-maps:().push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;3rdParent():${id}.data().type()=map]:[_list:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;3rdParent():${id}.data().type()=map]:[_list:[_map:view:_string]].elif():[txt()=children]:[_map:view:_string].elif():[txt()=text]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=list]:[_list:_string].elif():[txt()=map]:[_map:_string:_string];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];droplist-positioner:().del();myParent:()=():${id}.2ndParent();():${id}.2ndParent().update();().quit=false;myParent:().inputs().():[if():[!().quit;!txt()||txt()=0]:[focus();().quit=true]]?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
                `droplist:${id}?droplist-search-txt:()=():${id}.input().txt();():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable;!():${id}.droplist.preventDefault`
              ]
            }]
          }]
        })
  
      } else {
        
        return ({
          view: `Text?style:[minHeight=3rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.3rem;width=100%];mouseenter:[parent().children().():[style().backgroundColor=${view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style && view.droplist.item.style.backgroundColor||null}];style().backgroundColor=${(view.droplist.item && view.droplist.item.hover && view.droplist.item.hover.style.backgroundColor)||"#eee"}];${toString(view.droplist.item && view.droplist.item.text || {})};${toString(view.droplist.text || {})};${toString(item)};class=flex align-center pointer ${(item || {}).class || ""};caller=${id}`,
          controls: [...(view.droplist.controls || []), {
            event: `click??!():${id}.droplist.preventDefault`,
            actions: [ // :[focus:${input_id}]
              `wait():[resize:${input_id}]:[isArabic:${input_id}]?if():${input_id?true:false}:[():${input_id}.data()=txt().replace():'&amp;':'&';if():[():${input_id}.data().type()=boolean]:[():${input_id}.data()=():${input_id}.data().boolean()];():${input_id}.txt()=txt().replace():'&amp;':'&']:[():${id}.data()=txt().replace():'&amp;':'&';():${id}.txt()=txt().replace():'&amp;':'&']?!():${id}.droplist.isMap`,
              `?if():[txt()=list||txt()=map]:[opened-maps:().push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;3rdParent():${id}.data().type()=map]:[_list:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;3rdParent():${id}.data().type()=map]:[_list:[_map:view:_string]].elif():[txt()=children]:[_map:view:_string].elif():[txt()=text]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=list]:[_list:_string].elif():[txt()=map]:[_map:_string:_string];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];droplist-positioner:().del();myParent:()=():${id}.2ndParent();():${id}.2ndParent().update();().quit=false;myParent:().inputs().():[if():[!txt()||txt()=0]:[focus();().quit=true]]?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
              `droplist:${id}?droplist-search-txt:()=():${id}.input().txt();():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable;!():${id}.droplist.preventDefault`
            ]
          }]
        })
      }
    }))
    
  } else dropList.children = []
  
  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true
  update({ id: "droplist" })
  
  // searchable
  var myFn = () => {

    if (view.droplist && view.droplist.searchable) {

      if (global["droplist-search-txt"] !== undefined && global["droplist-search-txt"] !== "") {
        
        var _index = items.findIndex(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
        )

        var onlyOne = items.filter(item => view.droplist.searchable.any 
          ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
          : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
        ).length === 1
        
        if (_index !== -1) {
          
          if (onlyOne) {
            
            if (e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward" && e.inputType !== "deleteWordBackward" && e.inputType !== "deleteWordForward") {

              if (input_id) {

                views[input_id].element.value = views[input_id].prevValue = items[_index]
                views[input_id].contenteditable = false

              } else {

                view.element.innerHTML = view.prevValue = items[_index]
                view.contenteditable = false
              }
              
              reducer({ id, path: dropList.derivations, value: items[_index], object: global[dropList.Data], key: true })
              
            } else if (view.contenteditable === false || views[input_id].contenteditable === false) {
              
              if (input_id) {

                views[input_id].element.value = items[_index].slice(0, -1)
                views[input_id].contenteditable = true

              } else {

                view.element.innerHTML = items[_index].slice(0, -1)
                view.contenteditable = true
              }

              reducer({ id, path: dropList.derivations, value: items[_index], object: global[dropList.Data], key: true })
            }
            
          }

          global["keyup-index"] = _index
        }
      }
    }
    
    global["keyup-index"] = global["keyup-index"] || 0
    views.droplist.element.children[view.droplist.title ? global["keyup-index"] + 1 : global["keyup-index"]].dispatchEvent(new Event("mouseenter"))
  }

  if (!view.droplist.preventDefault) global.droplistTimer = setTimeout(myFn, 100)
}

module.exports = { droplist }