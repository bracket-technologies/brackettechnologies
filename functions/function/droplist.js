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
        type: `Text?class=flex align-center pointer;style.minHeight=3.5rem;style.padding=0 1rem;style.borderRadius=.5rem;style.fontSize=1.4rem;hover.style.width=100%;hover.style.backgroundColor=#eee;${toString(local.droplist.item)};caller=${id};text=${item}`,
        controls: [...(local.droplist.controls || []), {
          event: `click??!():${id}.droplist.readonly;)(:droplist-positioner=${id}`,
          actions: [
            `resize:${id};isArabic:${input_id}?():${input_id}.data()=${item};():${input_id}.text()=${item}?!${local.droplist.isMap}`,
            `update:[():${id}.parent().parent().id]?if():[${item}=array||${item}=map]:[)(:opened-maps.push():[():${id}.derivations.join():-]];():${id}.data()=if():[${item}=controls;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:event:_string]].elif():[${item}=controls]:[_map:event:_string].elif():[${item}=children;():${id}.parent().parent().parent().data().type()=map]:[_array:[_map:type:_string]].elif():[${item}=children]:[_map:type:_string].elif():[${item}=string]:_string.elif():[${item}=timestamp]:[today().getTime().num()].elif():[${item}=number]:0.elif():[${item}=boolean]:true.elif():[${item}=array]:_array.elif():[${item}=map]:[_map:_string:_string];():droplist.style():[opacity=0;transform=scale(0.5);pointerEvents=none];():droplist.children().map():[style().pointerEvents=none];)(:droplist-positioner.del();timer():[():droplist.val()=_string]:200?${item}!=():${id}.data().type();${local.droplist.isMap}`
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