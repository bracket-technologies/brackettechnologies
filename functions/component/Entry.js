const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')
const { override } = require('../function/merge')
const { clone } = require('../function/clone')

const Entry = (component) => {

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

    // entry
    component.entry = component.entry || {}
    component.entry.hover = component.entry.hover || {}
    component.entry.type = component.password && "password" || component.entry.type || 'text'
    component.entry.style = component.entry.style || {}
    component.entry.hover.style = component.entry.hover.style || {}
    component.entry.style.after = component.entry.style.after || {}

    // required
    if (component.required) component.required = typeof component.required === "object" ? component.required : {}
    
    component = toComponent(component)

    var { id, entry, droplist, readonly, style, controls, duplicated, duration, required,
        placeholder, textarea, clearable, removable, day, disabled, label, password, copyable, labeled,
        duplicatable, lang, unit, currency, google, key, minlength , children, container, generator
    } = component
    
    if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
    if (clearable && typeof clearable !== "object") clearable = {}
    if (generator && typeof generator !== "object") component.generator = generator = {}

    readonly = readonly ? true : false
    removable = removable !== undefined ? (removable === false ? false : true) : false

    if (duplicatable) removable = true
    if (minlength === undefined) minlength = 1
    if (droplist) droplist.align = droplist.align || "left"
    
    if (label && (label.location === "inside" || label.position === "inside")) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var password = component.password && true
        var text = label.text
        component.controls = component.controls || []
        
        delete component.parent
        delete component.label
        delete component.path
        delete component.id
        delete component.password
        delete component.derivations
        delete label.text

        return {
            id, path, Data, parent, derivations, tooltip: component.tooltip, islabel: true,
            "type": `View?class=flex;style.alignItems=center;style.justifyContent=flex-start;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=100%;${toString(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                    "type": `Text?text='${text || "Label"}';style.color=#888;style.fontSize=1.1rem;style.width=fit-content;${toString(label)}`,
                    "controls": [{
                        "event": "click?next().getEntry().focus()"
                    }]
                }, Entry({ ...component, component: true, labeled: true, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
                ]
            }, {
                "type": `View?style.height=inherit;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative;${toString(password)}?${password}`,
                "children": [{
                    "type": `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?parent().prev().getEntry().element.type=text;next().style().display=flex;style().display=none"
                    }]
                }, {
                    "type": `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    "controls": [{
                        "event": "click?parent().prev().getEntry().element.type=password;prev().style().display=flex;style().display=none"
                    }]
                }]
            }],
            "controls": [{
                "event": "click:body?style().border=if():[clicked:().outside():[().element]]:[1px solid #ccc]:[2px solid #008060]?!contains():[clicked:()];!droplist.contains():[clicked:()]"
            }, {
                "event": "click?getEntry().focus()?!getEntry().focus"
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
        component.clicked = component.clicked || { style: {} }
        clickedBorder = component.clicked.style.border || "2px solid #008060"
        component.clicked.preventDefault = true
        if (component.clicked.style.border) delete component.clicked
        component.controls = component.controls || []
        
        delete component.label
        delete component.path
        delete component.id
        delete component.tooltip
        delete label.text
        label.tooltip = tooltip

        return {
            id, Data, parent, derivations, required, path, islabel: true,
            "type": `View?class=flex start column;style.gap=.5rem;${toString(container)}`,
            "children": [{
                "type": `Text?id=${id}-label;text='${text || "Label"}';style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${toString(label)}`
            }, 
                Entry({ ...component, component: true, labeled: true, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
            {
                "type": "View?class=flex start align-center gap-1;style.alignItems=center;style.display=none",
                "children": [{
                    "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
                }, {
                    "type": `Text?text=Entry is required;style.color=#D72C0D;style.fontSize=1.4rem;${toString(required)}`
                }]
            }],
            "controls": [{
                "event": `click:1stChild();click:2ndChild()?2ndChild().style().border=${clickedBorder}`
            }, {
                "event": `click:body?2ndChild().style().border=${style.border || "1px solid #ccc"}?!contains():[clicked:()];!droplist.contains():[clicked:()]`
            }]
        }
    }
    
    return {
        ...component,
        type: 'View',
        class: 'flexbox unselectable',
        // remove from comp
        controls: [{
            event: `mouseenter?if():[clearable||removable]:[():[${id}+'-clear'].style().opacity=1];if():copyable:[():[${id}+'-copy'].style().opacity=1];if():generator:[():[${id}+'-generate'].style().opacity=1]`
        }, {
            event: `mouseleave?if():[clearable||removable]:[():[${id}+'-clear'].style().opacity=0];if():copyable:[():[${id}+'-copy'].style().opacity=0];if():generator:[():[${id}+'-generate'].style().opacity=0]`
        }],
        style: {
            cursor: readonly ? "pointer" : "text",
            display: "flex",
            width: "fit-content",
            maxWidth: "100%",
            position: "relative",
            backgroundColor: "inherit",
            height: "fit-content",
            borderRadius: "0.25rem",
            overflow: "hidden",
            transition: ".1s",
            alignItems: "center",
            justifyContent: "flex-start",
            border: entry.type === "file" ? "1px dashed #ccc" : "0",
            ...style,
        },
        children: [...children, {
            type: `Entry`,
            id: `${id}-entry`,
            class: `${component.class.includes("ar") ? "ar " : ""}${entry.class}`,
            // droplist,
            entry,
            currency, 
            readonly,
            day,
            unit,
            key,
            lang,
            google,
            duration,
            textarea,
            labeled,
            placeholder,
            duplicated,
            disabled,
            controls,
            templated: true,
            'placeholder-ar': component['placeholer-ar'],
            hover: {
                ...entry.hover,
                style: {
                    backgroundColor: style.after.backgroundColor,
                    color: style.after.color || style.color,
                    ...entry.style.after,
                    ...entry.hover.style
                }
            },
            style: {
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "flex-start",
                textAlign: "left",
                width: password || clearable || removable || copyable || generator ? "100%" : "fit-content",
                flex: "1",
                borderRadius: style.borderRadius || '0.25rem',
                backgroundColor: style.backgroundColor || 'inherit',
                fontSize: style.fontSize || '1.4rem',
                maxHeight: style.maxHeight || "initial",
                border: '0',
                padding: "0.5rem",
                color: entry.type === "number" ? "blue" : '#444',
                outline: 'none',
                userSelect: password ? "none" : "initial",
                ...entry.style
            }
        }, {
            type: `Icon?class=pointer;id=${id}+-clear;name=bi-x-lg;style:[position=absolute;right=if():[parent().password]:4rem:0;width=2.5rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.5rem;backgroundColor=inherit;borderRadius=.5rem];click:[if():[parent().clearable;prev().txt()]:[prev().data().del();():${id}-entry.txt()=;():${id}-entry.focus()].elif():[parent().clearable]:[():${id}-entry.focus()].elif():[parent().removable;!():${id}-entry.txt();parent().data().len()!=1]:[parent().rem()]]?parent().clearable||parent().removable`,
        }, {
            type: `Text?class=flexbox pointer;id=${id}+-generate;text=ID;style:[position=absolute;color=blue;right=if():[parent().clearable;parent().copyable]:[5.5rem].elif():[parent().clearable]:[2.5rem].elif():[parent().copyable]:[3rem]:0;width=3rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;backgroundColor=inherit;borderRadius=.5rem];click:[generated=gen():[parent().generator.length||20];data()=().generated;():${id}-entry.txt()=().generated;():${id}-entry.focus()]?parent().generator`,
        }, {
            type: `Icon?class=pointer;id=${id}+-copy;name=bi-files;style:[position=absolute;right=if():[parent().clearable]:[2.5rem]:0;width=3rem;height=2.5rem;opacity=0;transition=.2s;fontSize=1.4rem;backgroundColor=inherit;borderRadius=.5rem];click:[if():[():${id}-entry.txt()]:[data().copyToClipBoard();():${id}-entry.focus()]];mininote.text='copied!'?parent().copyable`,
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
}

module.exports = Entry