const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var views = window.views
  var global = window.global
  var view = window.views[id]
  var dropList = views["droplist"]
  
  // items
  var items = clone(view.droplist.items) || []
  dropList.derivations = clone(view.derivations)
  dropList.Data = view.Data
  
  // path & derivations
  if (view.droplist.path)
  dropList.derivations.push(...view.droplist.path.split("."))

  // input id
  var input_id = view.type === "Input" ? view.id : ""
  if (!input_id) {
    
    input_id = view.element.getElementsByTagName("INPUT")[0]
    if (input_id) input_id = input_id.id
  }
  
  // items
  if (typeof items === "string") items = clone(toValue({ id, e, value: items }))
  
  // searchable
  if (view.droplist.searchable && global["droplist-search-txt"] !== undefined) 
  items = items.filter(item => item.includes(global["droplist-search-txt"]))
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Text?class=flex align-center pointer;style:[minHeight=3.5rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.4rem;width=100%];hover.style.backgroundColor=#eee;${toString(view.droplist.item)};caller=${id};text=${item}`,
        controls: [...(view.droplist.controls || []), {
          event: `click?if():[():${id}.clicked]:[():${id}.clicked.style.keys()._():[():${id}.style()._=():${id}.clicked.style._]]?!():${id}.droplist.preventDefault;)(:droplist-positioner=${id}`,
          actions: [
            `async():[resize:${input_id}]:[isArabic:${input_id}]:[focus:${input_id}]?if():[input():${input_id}]:[():${input_id}.data()=txt();txt():${input_id}=txt()]:[():${id}.data()=txt();():${id}.txt()=txt()]?!():${id}.droplist.isMap`,
            `async():[update:[():${id}.parent().parent().id]]?if():[txt()=array||txt()=map]:[)(:opened-maps.push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:type:_string]].elif():[txt()=children]:[_map:type:_string].elif():[txt()=string]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=array]:_array.elif():[txt()=map]:[_map:_string:_string];)(:parent-id=():${id}.parent().parent().id;async():[)(:break-loop=false;():[)(:parent-id].getInputs()._():[if():[!)(:break-loop;!_.txt()]:[_.focus();)(:break-loop=true]]];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().():[style().pointerEvents=none];)(:droplist-positioner.del()?txt()!=():${id}.data().type();():${id}.droplist.isMap`,
            `droplist:${id};setPosition:droplist?)(:droplist-search-txt=():${id}.getInput().txt();position.positioner=${`():${id}.droplist.positioner` || id};position.placement=${`():${id}.droplist.placement` || "bottom"};position.distance=():${id}.droplist.distance;position.align=():${id}.droplist.align;():${id}.droplist.style.keys()._():[():droplist.style()._=():${id}.droplist.style._]?():${id}.droplist.searchable`
          ]
        }]
      }
    })
    
  } else dropList.children = []

  dropList.positioner = dropList.caller = id
  dropList.unDeriveData = true

  update({ id: "droplist" })
}

module.exports = { droplist }