const { jsonToBracket } = require('../functions/jsonToBracket')
const { override } = require('../functions/merge')
const { clone } = require('../functions/clone')
const { generate } = require('../functions/generate')
const { toArray } = require('../functions/toArray')

const Input = (component) => {

  if (component.__templated__) return component
  component.__templated__ = true

  component.hover = component.hover || {}
  component.style = component.style || {}
  component.hover.style = component.hover.style || {}

  // container
  component.container = component.container || {}

  // icon
  component.icon = component.icon || {}
  component.icon.style = component.icon.style || {}
  component.icon.hover = component.icon.hover || {}
  component.icon.hover.style = component.icon.hover.style || {}

  // input
  component.input = component.input || {}
  component.input.hover = component.input.hover || {}
  component.input.type = component.password && "password" || component.input.type || 'text'
  component.input.style = component.input.style || {}
  component.input.hover.style = component.input.hover.style || {}

  // required
  if (component.required) component.required = typeof component.required === "object" ? component.required : {}

  
  // class
  component.class = component.class || ""

  // id
  component.id = component.id || generate()

  // style
  component.style = component.style || {}

  // controls
  component.controls = toArray(component.controls)

  // children
  component.children = toArray(component.children)

  // model
  if (!component.model || component.classic) component.model = "classic"
  if (component.featured) component.model = "featured"

  // component
  component.component = true

  var {
    id, input, model, droplist, readonly, style, __controls__, duplicated, duration, required, preventDefault,
    placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, __labeled__, __childIndex__,
    duplicatable, lang, unit, currency, google, key, minlength, children, container, generator, __templated__, type, text
  } = component

  if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
  if (duplicatable) removable = removable || {}
  if (removable && typeof removable !== "object") removable = {}
  if (clearable && typeof clearable !== "object") clearable = {}
  if (generator && typeof generator !== "object") generator = {}
  if (label && typeof label !== "object") label = { text: "Label Name" }
  if (label && !label.location) label.location = "outside"

  readonly = readonly ? true : false

  if (minlength === undefined) minlength = 1
  if (droplist) droplist.align = droplist.align || "left"

  // upload input styles
  var uploadInputStyle = input.type === 'file'
    ? {
      position: 'absolute',
      left: '0',
      top: '0',
      opacity: '0',
      cursor: 'pointer',
    } : {}

  var _component = component = {
    ...component, id, input, model, droplist, readonly, style, __controls__, duplicated, duration, required, preventDefault,
    placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, __labeled__, __childIndex__,
    duplicatable, lang, unit, currency, google, key, minlength, children, container, generator, __templated__, type
  }

  // password
  if (password) type = "password"

  if (duplicatable) {
    component.removable = true
    removable = true
  }

  if (label && (label.location === "inside" || label.position === "inside")) {

    var label = clone(component.label)
    var __dataPath__ = clone(component.__dataPath__)
    var path = component.path
    var __parent__ = component.__parent__
    var form = component.form
    var password = component.password && true
    var text = label.text
    id = id || generate()

    delete component.label
    delete component.path
    delete component.id
    delete component.password
    delete component.__dataPath__
    delete component.__parent__
    delete component.__templated__
    delete label.text

    return {
      id, path, form, __parent__, tooltip: component.tooltip, __dataPath__, __islabel__: true, preventDefault, __templated__, __childIndex__,
      "view": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=${component.style.width || "100%"};style.maxWidth=${component.style.maxWidth || "100%"};${jsonToBracket(container)}`,
      "children": [{
        "view": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
        "children": [{
          "view": `Text?id=${id}_label;text='${text || "Label"}';if():[parent().required]:[required=true];style.fontSize=1.1rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)}`,
          "__controls__": [{
            "event": "click?parent().input().focus()"
          }]
        }, Input({ ...component, component: true, __labeled__: id, __parent__: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
        ]
      }, {
        "view": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${jsonToBracket(password)}?${password}`,
        "children": [{
          "view": `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
          "__controls__": [{
            "event": "click?parent().prev().getInput().el().type=text;next().style().display=flex;style().display=none"
          }]
        }, {
          "view": `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem;style.display=none`,
          "__controls__": [{
            "event": "click?parent().prev().getInput().el().type=password;prev().style().display=flex;style().display=none"
          }]
        }]
      }],
      "__controls__": [{
        "event": "click:document?style().border=if():[clicked().outside():[().el()]]:[1px solid #ccc]:[2px solid #008060]?!contains():[clicked()];!droplist.contains():[clicked()]"
      }, {
        "event": "click?getInput().focus()?!getInput().focus"
      }]
    }
  }

  if ((label && (label.location === "outside" || label.position === "outside")) || label) {

    var label = clone(component.label)
    var __dataPath__ = clone(component.__dataPath__)
    var path = component.path
    var __parent__ = component.__parent__
    var form = component.form
    var tooltip = component.tooltip
    var text = label.text
    id = id || generate()

    delete component.label
    delete component.path
    delete component.id
    delete component.tooltip
    delete component.required
    delete component.__parent__
    delete component.__templated__
    delete component.__childIndex__
    delete label.text
    label.tooltip = tooltip

    return {
      id, form, __parent__, __dataPath__, path, __islabel__: true, preventDefault, __controls__: [], __templated__, __childIndex__,
      "view": `View?class=flex start column;style.gap=.5rem;style.width=${component.style.width || "100%"};style.maxWidth=${component.style.maxWidth || "100%"};${jsonToBracket(container)}`,
      "children": [
        {
          "view": `Text?id=${id}_label;text='${text || "Label"}';${required ? "required=true;" : ""}style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${jsonToBracket(label)};[click?parent().input().focus()]`,
        },
        Input({ ...component, component: true, __labeled__: id, __parent__: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
        {
          "view": `View:${id}-required?class=flex gap-1;style:[alignItems=center;opacity=${required && required.style && required.style.opacity || "0"};transition=.2s]?${required ? true : false};false`,
          "children": [{
            "view": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
          }, {
            "view": `Text?text=${required && required.text || "Required blank"};style.color=#D72C0D;style.fontSize=1.3rem;${jsonToBracket(required)}`
          }]
        }
      ]
    }
  }

  if (model === 'featured' || password || clearable || removable || duplicatable || copyable || generator) {

    delete component.type
    delete component.__interpreted__

    return {
      ...component,
      view: `View?class=flex align-items-center unselectable ${component.class || ""}`,
      // remove from comp
      __controls__: [{
        event: `mouseenter?if():[clearable||removable||duplicatable]:[():[${id}+'-clear'].style().opacity=1];if():copyable:[():[${id}+'-copy'].style().opacity=1];if():duplicatable:[():[${id}+'-duplicate'].style().opacity=1]];if():generator:[():[${id}+'-generate'].style().opacity=1]?!mobile()`
      }, {
        event: `mouseleave?if():[clearable||removable||duplicatable]:[():[${id}+'-clear'].style().opacity=0];if():copyable:[():[${id}+'-copy'].style().opacity=0];if():duplicatable:[():[${id}+'-duplicate'].style().opacity=0]];if():generator:[():[${id}+'-generate'].style().opacity=0]?!mobile()`
      }],
      style: {
        cursor: readonly ? "pointer" : "auto",
        display: "inline-flex",
        width: "fit-content",
        maxWidth: "100%",
        position: "relative",
        backgroundColor: "inherit",
        height: "fit-content",
        borderRadius: "0.25rem",
        overflow: "hidden",
        transition: ".1s",
        border: input.type === "file" ? "1px dashed #ccc" : "0",
        ...style,
      },
      children: [{
        view: `Input?id=${id}-input`,
        // id: `${id}-input`,
        class: `${component.class.includes("ar") ? "ar " : ""}${component.class || ""}${readonly?" pointer":""}`,
        input,
        currency,
        day,
        type,
        unit,
        key,
        lang,
        google,
        text,
        duration,
        textarea,
        readonly,
        __labeled__,
        placeholder,
        duplicated,
        disabled,
        duplicatable,
        preventDefault,
        __featured__: true,
        __templated__: true,
        style: {
          width: password || clearable || removable || copyable || generator ? "100%" : "fit-content",
          height: 'fit-content',
          borderRadius: style.borderRadius || '0.25rem',
          backgroundColor: style.backgroundColor || 'inherit',
          fontSize: style.fontSize || '1.4rem',
          maxHeight: style.maxHeight || "initial",
          border: '0',
          height: style.height || "100%",
          padding: "0.5rem",
          color: input.type === "number" ? "blue" : '#444',
          outline: 'none',
          userSelect: password ? "none" : "initial",
          ...uploadInputStyle,
          ...input.style
        },
        __controls__: [...__controls__, {
          event: `focus?if():[__labeled__]:[if():[!():${__labeled__}.contains():[clicked()]]:[if():${duplicatable ? true : false}:[parent().click()]:[2ndChild().click()]]]:[if():[!():${id}.contains():[clicked()]]:[click():[__droplistPositioner__:().del();]]]?!preventDefault`
        }, {
          event: `blur?():document.click()`
        }, {
          event: `keyup?():'${id}-duplicate'.click()?duplicatable;e().key=Enter`
        }]
      }, {
        view: `Icon:${id}-clear?class=pointer;name=bi-x;style:[position=absolute;if():[language:()=ar]:[left=[[6.5?${type==="date"}?4]?parent().password?[2.5?${type==="date"}?0.5]]+'rem']:[right=[[6.5?${type==="date"}?4]?parent().password?[2.5?${type==="date"}?0.5]]+'rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[parent().clearable;prev().txt()]:[prev().data().del();prev().txt()=;#prev().focus()].elif():[parent().removable;if():[parent().clearable]:[!prev().txt()]:true;form():[path=path().slice():0:-1].len()>1]:[parent().rem()]]?parent().clearable||parent().removable||parent().duplicatable`,
      }, {
        view: `Icon:${id}-copy?class=pointer;name=bi-files;style:[backgroundColor=#fff;position=absolute;if():[language:()=ar]:[left=if():[parent().clearable]:[2.5rem]:0]:[right=if():[parent().clearable]:[2.5rem]:0];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;borderRadius=.5rem];click:[if():[():${id}-input.txt()]:[data().copyToClipBoard();#():${id}-input.focus()]];mininote.text='copied!'?parent().copyable`,
      }, {
        view: `View?style.height=100%;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative?parent().password`,
        children: [{
          view: `Icon?name=bi-eye-fill;class=absolute;style:[color=#888;fontSize=1.8rem;height=100%;width=4rem];[click?2ndParent().input().el().type=text;next().display();hide()]`,
        }, {
          view: `Icon?name=bi-eye-slash-fill;class=absolute;style:[color=#888;fontSize=1.8rem;height=100%;width=4rem;display=none];[click?2ndParent().input().el().type=password;prev().display();hide()]`
        }]
      }]
    }
  }

  if (model === 'classic') {

    delete _component.type
    return {
      ..._component,
      view: "Input",
      style: {
        cursor: readonly ? "pointer" : "auto",
        border: "0",
        width: "fit-content",
        padding: '0.5rem',
        color: '#444',
        color: input.type === "number" ? "blue" : '#444',
        backgroundColor: 'inherit',
        height: 'fit-content',
        borderRadius: '0.25rem',
        fontSize: '1.4rem',
        transition: "border .1s",
        ...input.style,
        ...style,
      }
    }
  }
}

module.exports = Input