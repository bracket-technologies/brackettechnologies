const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")
const { reducer } = require("./reducer")

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
  if (typeof items === "string") items = clone(toValue({ id, e, value: items }))
  
  // filterable
  if (!view.droplist.preventDefault) {

    if (view.droplist.searchable.filter && global["droplist-search-txt"] !== undefined && global["droplist-search-txt"] !== "") {

      items = items.filter(item => view.droplist.searchable.any 
        ? item.toString().toLowerCase().includes(global["droplist-search-txt"].toString().toLowerCase())
        : item.toString().toLowerCase().slice(0, global["droplist-search-txt"].toString().length) === global["droplist-search-txt"].toString().toLowerCase()
      )

      global["keyup-index"] = 0
    }
  }

  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Text?class=flex align-center pointer;style:[minHeight=3.5rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.4rem;width=100%];hover.style.backgroundColor=#eee;${toString(view.droplist.item)};caller=${id};text=${item}`,
        controls: [...(view.droplist.controls || []), {
          event: `click?if():[():${id}.clicked]:[():${id}.clicked.style.keys()._():[():${id}.style()._=():${id}.clicked.style._]]?!():${id}.droplist.preventDefault;)(:droplist-positioner=${id}`,
          actions: [ // :[focus:${input_id}]
            `async():[resize:${input_id}]:[isArabic:${input_id}]?if():[():${input_id}]:[():${input_id}.data()=txt().replace():'&amp;':'&';if():[():${input_id}.data().type()=boolean]:[():${input_id}.data()=():${input_id}.data().boolean()];():${input_id}.txt()=txt().replace():'&amp;':'&']:[():${id}.data()=txt().replace():'&amp;':'&';():${id}.txt()=txt().replace():'&amp;':'&']?!():${id}.droplist.isMap`,
            `async():[update:[():${id}.parent().parent().id]]?if():[txt()=array||txt()=map]:[)(:opened-maps.push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:type:_string]].elif():[txt()=children]:[_map:type:_string].elif():[txt()=string]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=array]:_array.elif():[txt()=map]:[_map:_string:_string];)(:parent-id=():${id}.parent().parent().id;async():[)(:break-loop=false;():[)(:parent-id].getInputs()._():[if():[!)(:break-loop;!_.txt()||_.txt().num()=0]:[_.focus();)(:break-loop=true]]];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];)(:droplist-positioner.del()?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
            `droplist:${id}?)(:droplist-search-txt=():${id}.getInput().txt();():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable;!():${id}.droplist.preventDefault`
          ]
        }]
      }
    })
    
  } else dropList.children = []
  
  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true
  update({ id: "droplist" })

  // searchable
  var myFn = () => {

    if (!view.droplist.preventDefault && view.droplist.searchable) {

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
    if (!view.droplist.preventDefault) views.droplist.element.children[global["keyup-index"]].dispatchEvent(new Event("mouseenter"))
    // if (input_id) views[input_id].element.focus()
  }

  global.droplistTimer = setTimeout(myFn, 100)
}

module.exports = { droplist }