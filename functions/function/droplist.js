const { update } = require("./update")
const { clone } = require("./clone")
const { toValue } = require("./toValue")
const { toString } = require("./toString")

const droplist = ({ id, e }) => {

  var value = window.value
  var local = window.value[id]

  var dropList = value["droplist"]
  var isButton = local.isButton
  var parent = value[local.parent].parent
  
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
      var readonly = false, input = false, droplist, itemList = []

      if (typeof item === "string" || typeof item === "boolean") {

        item = item.toString()
        item = item.split(">>")
        readonly = item[1] === "readonly"
        input = item[1] === "input"
        item = item[0]

      } else if (Array.isArray(item)) {
        
        itemList = clone(item)
        item = itemList.find(item => !item.includes("readonly"))
        input = true
        droplist = true
      }

      return {
        type: `Item?${toString(local.droplist.item)};caller=${id};text.text=const.${item};readonly=${readonly}`,
        controls: [...(local.droplist.controls || []), {
          event: `click?():${isButton ? `${id}-text` : id}.val()=${item}<<!${local.droplist.disabled};action.resize:${id};().data()=${item}<<${isButton}?():${id}.droplist.readonly.not();!readonly;global().droplist-positioner=${id}`,
          actions: [
            `?().data()=${item}?!():${id}.lang;!():${id}.currency;!():${id}.day;!():${id}.duration;${!local.droplist.isMap}`,
            // for lang & currency droplists
            `?().data().${item}=():${input_id}.data();():${input_id}.data().delete();():${input_id}.derivations=():${input_id}.derivations.pull():[().derivations.length().subs():1].push():${item}?const.${input_id};():${id}.lang||():${id}.currency||():${id}.duration||():${id}.day;():${input_id}.derivations.lastIndex()!=${item}`,
            `focus:${input_id};click:${input_id}??[${input_id}]`,
            `resetStyles:droplist;update:[():${id}.parent().parent().id]?global().opened-maps.push():[():${id}.derivations.join():-]<<${item}.is():array.or():[${item}.is():map];global().droplist-positioner.delete();():${id}.data().equal():[if():[${item}.is():controls.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:event:_string]].else():[if():[${item}.is():controls]:[_map:event:_string].else():[if():[${item}.is():children.and():[():${id}.parent().parent().parent().data().type().is():map]]:[_array:[_map:type:_string]].else():[if():[${item}.is():children]:[_map:type:_string].else():[if():[${item}.is():string]:_string.else():[if():[${item}.is():timestamp]:[today().getTime().num()].else():[if():[${item}.is():number]:[today().getTime().num()].else():[if():[${item}.is():boolean]:[true.bool()].else():[if():[${item}.is():array]:_array.else():[if():[${item}.is():map]:[_map:_string:_string]]]]]]]]]]]?${item}.isnot():[():${id}.data().type()]`
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
