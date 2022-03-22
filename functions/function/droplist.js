const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var value = window.value
  var local = window.value[id]

  var dropList = value["droplist"]
  var isButton = local.isButton
  
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
  if (typeof items === "string")
  items = toValue({ id, e, value: items })
  
  // children
  if (items && items.length > 0) {
    
    items = items.filter(item => item !== undefined && item !== '')
    dropList.children = clone(items).map(item => {

      return {
        type: `Item?${toString(local.droplist.item)};caller=${id};text.text=${item}`,
        controls: [...(local.droplist.controls || []), {
          event: `click?():${isButton ? `${id}-text` : id}.val()=${item}<<!${local.droplist.disabled};action.resize:${id};().data()=${item}<<${isButton}?():${id}.droplist.readonly.not();!readonly;global().droplist-positioner=${id}`,
          actions: [
            `?().data()=${item}?!():${id}.lang;!():${id}.currency;!():${id}.day;!():${id}.duration;${!local.droplist.isMap}`,
            // for lang & currency droplists
            `?().data().${item}=():${input_id}.data();():${input_id}.data().delete();():${input_id}.derivations=():${input_id}.derivations.pull():[().derivations.length().subs():1].push():${item}?const.${input_id};():${id}.lang||():${id}.currency||():${id}.duration||():${id}.day;():${input_id}.derivations.lastIndex()!=${item}`,
            `focus:${input_id};click:${input_id}??${input_id}.isdefined()`,
            `update:[():${id}.parent().parent().id]?global().opened-maps.push():[():${id}.derivations.join():-]<<${item}.is():array.or():[${item}.is():map];global().droplist-positioner.delete();():${id}.data()=if():[${item}.is():controls.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:event:_string]].elif():[${item}.is():controls]:[_map:event:_string].elif():[${item}.is():children.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:type:_string]].elif():[${item}.is():children]:[_map:type:_string].elif():[${item}.is():string]:_string.elif():[${item}.is():timestamp]:[today().getTime().num()].elif():[${item}.is():number]:0.elif():[${item}.is():boolean]:[true.bool()].elif():[${item}.is():array]:_array.elif():[${item}.is():map]:[_map:_string:_string];log():[():${id}.data()];():droplist.style().opacity.eq():0;():droplist.style().transform.eq():[scale(0.5)];():droplist.style().pointerEvents.eq():none?${item}.isnot():[():${id}.data().type()]`
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
