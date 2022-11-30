const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')
const { override } = require('../function/merge')
const { clone } = require('../function/clone')
const { generate } = require('../function/generate')

const Input = (component) => {

    if (component.templated) return component

    component.hover = component.hover || {}
    component.style = component.style || {}
    component.hover.style = component.hover.style || {}
    component.style.after = component.style.after || {}

    // container
    component.container = component.container || {}

    // icon
    component.icon = component.icon || {}
    component.icon.style = component.icon.style || {}
    component.icon.hover = component.icon.hover || {}
    component.icon.hover.style = component.icon.hover.style || {}
    component.icon.style.after = component.icon.style.after || {}

    // input
    component.input = component.input || {}
    component.input.hover = component.input.hover || {}
    component.input.type = component.password && "password" || component.input.type || 'text'
    component.input.style = component.input.style || {}
    component.input.hover.style = component.input.hover.style || {}
    component.input.style.after = component.input.style.after || {}

    // required
    if (component.required) component.required = typeof component.required === "object" ? component.required : {}
    
    component = toComponent(component)

    var {
      id, input, model, droplist, readonly, style, controls, duplicated, duration, required, preventDefault,
      placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, labeled,
      duplicatable, lang, unit, currency, google, key, minlength , children, container, generator,
    } = component
    
    if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
    if (duplicatable) removable = removable || {}
    if (removable && typeof removable !== "object") removable = {}
    if (clearable && typeof clearable !== "object") clearable = {}
    if (generator && typeof generator !== "object") generator = {}

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
      ...component, id, input, model, droplist, readonly, style, controls, duplicated, duration, required, preventDefault,
      placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, labeled,
      duplicatable, lang, unit, currency, google, key, minlength , children, container, generator,
    }
    
    if (label && (label.location === "inside" || label.position === "inside")) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var password = component.password && true
        var text = label.text
        id = id || generate()
        component.controls = component.controls || []
        
        delete component.parent
        delete component.label
        delete component.path
        delete component.id
        delete component.password
        delete component.derivations
        delete label.text

        return {
            id, path, Data, parent, derivations, tooltip: component.tooltip, islabel: true, preventDefault,
            "type": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=${component.style.width||"100%"};style.maxWidth=${component.style.maxWidth||"100%"};${toString(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                    "type": `Text?text='${text || "Label"}';style.color=#888;style.fontSize=1.1rem;style.width=fit-content;${toString(label)}`,
                    "controls": [{
                        "event": "click?next().input().click()"
                    }]
                }, Input({ ...component, component: true, labeled: id, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
                ]
            }, {
                "type": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${toString(password)}?${password}`,
                "children": [{
                    "type": `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?parent().prev().getInput().element.type=text;next().style().display=flex;style().display=none"
                    }]
                }, {
                    "type": `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?parent().prev().getInput().element.type=password;prev().style().display=flex;style().display=none"
                    }]
                }]
            }],
            "controls": [{
                "event": "click:body?style().border=if():[clicked:().outside():[().element]]:[1px solid #ccc]:[2px solid #008060]?!contains():[clicked:()];!droplist.contains():[clicked:()]"
            }, {
                "event": "click?getInput().focus()?!getInput().focus"
            }]
        }
    }
    
    if ((label && (label.location === "outside" || label.position === "outside")) || label) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var tooltip = component.tooltip
        var text = label.text
        id = id || generate()
        var clickedBorder = component.clicked && component.clicked.style.border
        component.controls = component.controls || []

        if (component.clicked) {
          component.clicked.preventDefault = true
          if (component.clicked.style.border) delete component.clicked
        }
        
        delete component.label
        delete component.path
        delete component.id
        delete component.tooltip
        delete label.text
        label.tooltip = tooltip
        
        return {
          id, Data, parent, derivations, required, path, islabel: true, preventDefault,
          "type": `View?class=flex start column;style.gap=.5rem;style.width=${component.style.width ||"100%"};style.maxWidth=${component.style.maxWidth ||"100%"};${toString(container)}`,
          "children": [{
            "type": `Text?id=${id}-label;text='${text || "Label"}';style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${toString(label)}`,
            "controls": [{
                "event": "click?next().input().click()"
            }]
          },
            Input({ ...component, component: true, labeled: id, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
          {
            "type": `View:${id}-required?class=flex gap-1;style:[alignItems=center;opacity=${required && required.style && required.style.opacity || "0"};transition=.2s]?${required ? true : false}`,
            "children": [{
              "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
            }, {
              "type": `Text?text=${required && required.text || "Required blank"};style.color=#D72C0D;style.fontSize=1.3rem;${toString(required)}`
            }]
          }],
          "controls": [{
            "event": `click:1stChild();click:[if():[${duplicatable?true:false}]:[2ndChild().children()]:2ndChild()]?clicked=true;if():[!${duplicatable?true:false}]:[2ndChild().style().border=${clickedBorder}]:[2ndChild().lastChild().style().border=${clickedBorder}]?!mobile();${clickedBorder?true:false}`
          }, {
            "event": `click:body?clicked=false;if():[${duplicatable?true:false}]:[2ndChild().children().():[style().border=${style.border || "1px solid #ccc"}]]:[2ndChild().style().border=${style.border || "1px solid #ccc"}]?${clickedBorder?true:false};!mobile();!contains():[clicked:()];!droplist.contains():[clicked:()]`
          }]
        }
    }

    if (model === 'featured' || password || clearable || removable || duplicatable || copyable || generator) {

      var myView = {
            ...component,
            type: duplicatable ? "[View]" : "View",
            class: `flex align-items-center unselectable ${component.class || ""}`,
            // remove from comp
            controls: [{
                event: `mouseenter?if():[clearable||removable]:[():[${id}+'-clear'].style().opacity=1];if():copyable:[():[${id}+'-copy'].style().opacity=1];if():generator:[():[${id}+'-generate'].style().opacity=1]?!mobile()`
            }, {
                event: `mouseleave?if():[clearable||removable]:[():[${id}+'-clear'].style().opacity=0];if():copyable:[():[${id}+'-copy'].style().opacity=0];if():generator:[():[${id}+'-generate'].style().opacity=0]?!mobile()`
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
            children: [...children, { // message
                type: `Text?id=${id}-msg;msg=parent().msg;text=parent().msg?parent().msg`,
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontSize: '1.3rem',
                    maxWidth: '95%',
                }
            }, {
                type: `Input`,
                id: `${id}-input`,
                class: `${component.class.includes("ar") ? "ar " : ""}${input.class || ""}`,
                input,
                currency, 
                day,
                unit,
                key,
                lang,
                google,
                duration,
                textarea,
                readonly,
                labeled,
                placeholder,
                duplicated,
                disabled,
                duplicatable,
                preventDefault,
                templated: true,
                'placeholder-ar': component['placeholer-ar'],
                /*hover: {
                    ...input.hover,
                    style: {
                        backgroundColor: style.after.backgroundColor,
                        color: style.after.color || style.color,
                        ...input.style.after,
                        ...input.hover.style
                    }
                },*/
                style: {
                    width: password || clearable || removable || copyable || generator ? "100%" : "fit-content",
                    height: 'fit-content',
                    borderRadius: style.borderRadius || '0.25rem',
                    backgroundColor: style.backgroundColor || 'inherit',
                    fontSize: style.fontSize || '1.4rem',
                    maxHeight: style.maxHeight || "initial",
                    border: '0',
                    height: "100%",
                    padding: "0.5rem",
                    color: input.type === "number" ? "blue" : '#444',
                    outline: 'none',
                    userSelect: password ? "none" : "initial",
                    ...uploadInputStyle,
                    ...input.style
                },
                controls: [...controls, {
                    event: `clickfocus;keyfocus?if():[labeled]:[if():[!():${labeled}.contains():[clicked:()]]:[if():${duplicatable?true:false}:[e().target.parent().click()]:[2ndChild().click()]]]:[if():[!():${id}.contains():[clicked:()]]:[click():[droplist-positioner:().del();]]]?!preventDefault` // for clicked event
                }, {
                    event: "select;mousedown?preventDefault()"
                }, {
                    event: "keyup?Data():[path=derivations().clone().pullLast().push():[derivations().lastEl().num()+1]]=_string;update():[().parent().parent()]?duplicatable;e().key=Enter",
                }]
            }, {
                type: `Icon?class=pointer;id=${id}-clear;name=bi-x;style:[position=absolute;if():[language:()=ar]:[left=if():[parent().password]:4rem:'0.5rem']:[right=if():[parent().password]:4rem:'0.5rem'];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=2.5rem;backgroundColor=inherit;borderRadius=.5rem;color=#888];click:[if():[parent().clearable;prev().txt();${readonly?false:true}]:[prev().data().del();prev().txt()=;#prev().focus()].elif():[parent().clearable;${readonly?false:true}]:[#prev().focus()].elif():[${readonly?false:true};parent().removable;!prev().txt();parent().data().len()!=1]:[${readonly?false:true};parent().rem()]]?parent().clearable||parent().removable`,
            }, {
                type: `Text?class=flexbox pointer;id=${id}-generate;text=ID;style:[position=absolute;color=blue;if():[language:()=ar]:[left=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0]:[right=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0];width=3rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;backgroundColor=inherit;borderRadius=.5rem];click:[generated=gen():[parent().generator.length||20];data()=().generated;():${id}-input.txt()=().generated;():${id}-input.focus()]?parent().generator`,
            }, {
                type: `Icon?class=pointer;id=${id}-copy;name=bi-files;style:[backgroundColor=#fff;position=absolute;if():[language:()=ar]:[left=if():[parent().clearable]:[2.5rem]:0]:[right=if():[parent().clearable]:[2.5rem]:0];width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;borderRadius=.5rem];click:[if():[():${id}-input.txt()]:[data().copyToClipBoard();#():${id}-input.focus()]];mininote.text='copied!'?parent().copyable`,
            }, {
                type: `View?style.height=100%;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative?parent().password`,
                children: [{
                    type: `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?parent().prev().element.type=text;next().style().display=flex;style().display=none"
                    }]
                }, {
                    type: `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?parent().prev().element.type=password;prev().style().display=flex;style().display=none"
                    }]
                }]
            }]
        }
        
        if (duplicatable) {
          
          return {
            type: "View?if():[data().type()!=array]:[data()=_list];class=vertical;style:[gap=1rem;width=100%]",
            children: [myView]
          }

        } else return myView
    }
    
    if (model === 'classic') {
        
      return {
          ..._component,
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
          },
          controls: [...controls, {
              event: `clickfocus;keyfocus?if():[labeled]:[if():[!().labeled.contains():[clicked:()]]:[1stChild().click()]]:[if():[!contains():[clicked:()]]:click()]`
          }, {
              event: "input?parent().required.mount=false;parent().click()?parent().required.mount;e().target.value.exist()"
          }]
      }
    }
}

module.exports = Input