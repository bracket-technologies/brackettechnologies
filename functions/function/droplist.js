const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var value = window.children
  var local = window.children[id]
  var dropList = value["droplist"]
  
  // items
  var items = clone(local.droplist.items) || []
  dropList.derivations = clone(local.derivations)
  dropList.Data = local.Data
  
  // path & derivations
  if (local.droplist.path)
  dropList.derivations.push(...local.droplist.path.split("."))

  // input id
  var input_id = local.type === "Input" ? local.id : ""
  if (!input_id) {
    
    input_id = local.element.getElementsByTagName("INPUT")[0]
    if (input_id) input_id = input_id.id
  }
  
  // items
  if (typeof items === "string") items = toValue({ id, e, value: items })
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Text?class=flex align-center pointer;style:[minHeight=3.5rem;padding=0 1rem;borderRadius=.5rem;fontSize=1.4rem;width=100%];hover.style.backgroundColor=#eee;${toString(local.droplist.item)};caller=${id};text=${item}`,
        controls: [...(local.droplist.controls || []), {
          event: `click??!():${id}.droplist.preventDefault;)(:droplist-positioner=${id}`,
          actions: [
            `resize:${input_id};isArabic:${input_id}?if():[${input_id}]:[():${input_id}.data()=txt();():${input_id}.txt()=txt()]:[():${id}.data()=txt();():${id}.txt()=txt()]?!${local.droplist.isMap}`,
            `async():[update:[():${id}.parent().parent().id]]?if():[txt()=array||txt()=map]:[)(:opened-maps.push():[():${id}.derivations.join():-]];():${id}.data()=if():[txt()=controls;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:event:_string]].elif():[txt()=controls]:[_map:event:_string].elif():[txt()=children;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:type:_string]].elif():[txt()=children]:[_map:type:_string].elif():[txt()=string]:_string.elif():[txt()=timestamp]:[today().getTime().num()].elif():[txt()=number]:0.elif():[txt()=boolean]:true.elif():[txt()=array]:_array.elif():[txt()=map]:[_map:_string:_string];)(:parent-id=():${id}.parent().parent().id;async():[)(:break-loop=false;():[)(:parent-id].getInputs()._map():[if():[!)(:break-loop;!_.text()]:[_.focus();)(:break-loop=true]]];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().map():[style().pointerEvents=none];)(:droplist-positioner.del()?txt()!=():${id}.data().type();${local.droplist.isMap}`
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