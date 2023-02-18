const { clone } = require('../function/clone')
const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')

module.exports = (view) => {

  var path = clone(view.path)
  delete view.path
  view = toComponent(view)
  var { icon, box, label, style, checked, model2, text, value, required, group = {} } = view
  label = label || {}
  icon = icon || {}
  box = box || {}

  if (typeof checked === "string" || typeof checked === "boolean") checked = { checked: true }
  else if (typeof checked !== "object") checked = {}
  box.checked = box.checked || checked.box || {}
  icon.checked = icon.checked || checked.icon || {}
  label.checked = label.checked || checked.label || {}
  if (checked.checked) box.checked.checked = icon.checked.checked = label.checked.checked = true
  if (model2) model2 = true
  else model2 = false

  // text
  if (text !== undefined) label.text = text
  text = label.text || ""
  value = value !== undefined ? value : (label.value !== undefined ? label.value : text)
  delete label.text

  if (typeof group === "string" || typeof group === "number") group = { state: group }
  if (group.id) group.state = group.id
  if (!group.multiple) group.multiple = false
  else group.multiple = true
  if (required) group.required = true
  
  return {
    ...view, path, group,
    "view": `View?class=flex align-center;style:[gap=1.5rem];${toString(style)}`,
    "children": [
      {
        "view": `View:${view.id}-box?${toString(box)};if():[parent().group.state]:[CHECKBOX_STATE:().${group.state}.clicked=_list];if():[${group.multiple};!data()]:[data()=_list];class=flexbox pointer +${box.class||""};style:[height=[().style.height||2rem];width=[().style.width||2rem];position=[().style.position||relative];borderRadius=[().style.borderRadius||.35rem];transition=[().style.transition||.1s]];if():${model2}:[checked.style:[backgroundColor=[().checked.style.backgroundColor||#fff];border=[().checked.style.border||1px solid #ccc]]];style:[backgroundColor=if():[checked.checked]:[().checked.style.backgroundColor||'#2C6ECB']:[().style.backgroundColor||'#fff'];border=if():[checked.checked]:[().checked.style.border||'1px solid #ffffff00']:[().style.border||'1px solid #ccc']]`,
        "children": [{
          "view": `Icon:${view.id}-icon?name=check;google.symbol;${toString(icon)};style:[position=[().style.position||absolute];color=[().style.color||#fff];transition=[().style.transition||.1s]];if():${model2}:[style:[fontSize=[().style.fontSize||3.5rem];left=[().style.left||'-.5rem'];bottom=[().style.bottom||'-.5rem']];checked.style.color=[().checked.style.bottom||blue]]:[style.fontSize=[().style.fontSize||1.8rem]];style:[opacity=if():[checked.checked]:1:0]`
        }],
        "controls": [{
          "event": `click?if():[parent().group.state;${!group.multiple};CHECKBOX_STATE:().${group.state}.clicked.0;if():[parent().required||parent().group.required]:true:[CHECKBOX_STATE:().${group.state}.clicked.0!=().id]]:[clickedItem=CHECKBOX_STATE:().${group.state}.clicked.0;CHECKBOX_STATE:().${group.state}.clicked.pull():0;():[().clickedItem]._():[_.checked.checked=false;_.child()._():[_.style().opacity=0;_.checked.style._():[__.style()._=[__.style._||null]]];if():${!group.multiple}:[_.data().del()]:[_.data().pullItem():[_.next().value]];_.style():[backgroundColor=#fff;border=1px solid #ccc];_.checked.style._():[__.style()._=[__.style._||null]]]];if():[!checked.checked]:[checked.checked=true;if():[parent().group.state]:[CHECKBOX_STATE:().${group.state}.clicked.push():[().id]];child()._():[_.style().opacity=1;_.style():[_.checked.style]];if():${!group.multiple}:[data()=next().value]:[data().replaceItem():[next().value]];style():[backgroundColor=#2C6ECB;border=1px solid #ffffff00];style():[().checked.style]]:[if():[[parent().group.required;data().len()>[parent().group.min||1]]||!parent().group.required]:[checked.checked=false;CHECKBOX_STATE:().${group.state}.clicked.pullItem():[().id];child()._():[_.style().opacity=0;_.checked.style._():[__.style()._=[__.style._||null]]];if():[parent().group.state]:[${!group.multiple}:[data().del()]:[data().pullItem():[next().value]]];style():[backgroundColor=#fff;border=1px solid #ccc];().checked.style._():[style()._=[().style._||null]]]]?parent().group.state`
        },
        {
          "event": `loaded?if():${group.multiple}:[if():[data().inc():[next().value]]:click()]:[if():[[parent().boolean;data()]||data()=next().value]:click()]`
        }, 
        {
          "event": `click?if():[checked.checked=true]:[data()=false;checked.checked=false;child()._():[_.style().opacity=0;_.checked.style._():[__.style()._=[__.style._||null]]];style():[backgroundColor=#fff;border=1px solid #ccc];checked.style._():[__.style()._=[__.style._||null]]]:[data()=true;checked.checked=true;child()._():[_.style().opacity=1;_.style():[_.checked.style]];style():[backgroundColor=#2C6ECB;border=1px solid #ffffff00];style():[().checked.style]]?!parent().group.state;parent().boolean`
        }]
      },
      {
        "view": `Text:${view.id}-label?${toString(label)};style:[fontSize=[().style.fontSize||1.6rem];width=[().style.width||fit-content];cursor=[().style.cursor||pointer]]`,
        text, value,
        "controls": [{
          "event": "click?prev().click()"
        }]
      }
    ]
  }
}