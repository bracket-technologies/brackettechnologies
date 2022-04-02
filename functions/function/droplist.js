const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var value = window.value
  var local = window.value[id]
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
        type: `Text?class=flex align-center pointer;style.minHeight=3.5rem;style.padding=0 1rem 0 2rem;style.borderRadius=.5rem;style.fontSize=1.4rem;hover.style.width=100%;hover.style.backgroundColor=#eee;${toString(local.droplist.item)};caller=${id};text=${item}`,
        controls: [...(local.droplist.controls || []), {
          event: `click??!():${id}.droplist.readonly;global().droplist-positioner=${id}`,
          actions: [
            `resize:${id}?():${input_id}.data()=${item};():${input_id}.text()=${item}?!${local.droplist.isMap}`,
            `update:[():${id}.parent().parent().id]?global().opened-maps.push():[():${id}.derivations.join():-]<<${item}.is():array.or():[${item}.is():map];():${id}.data()=if():[${item}.is():controls.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:event:_string]].elif():[${item}.is():controls]:[_map:event:_string].elif():[${item}.is():children.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:type:_string]].elif():[${item}.is():children]:[_map:type:_string].elif():[${item}.is():string]:_string.elif():[${item}.is():timestamp]:[today().getTime().num()].elif():[${item}.is():number]:0.elif():[${item}.is():boolean]:[true.bool()].elif():[${item}.is():array]:_array.elif():[${item}.is():map]:[_map:_string:_string];():droplist.style().opacity=0;():droplist.style().transform=[scale(0.5)];():droplist.style().pointerEvents=none;():droplist.children().map():[style().pointerEvents=none];global().droplist-positioner.delete();timer():[():droplist.val()=_string]:200?${item}.isnot():[():${id}.data().type()];${local.droplist.isMap}`
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