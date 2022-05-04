const { toComponent } = require('../function/toComponent')
const { toString } = require('../function/toString')
const { override } = require('../function/merge')
const { clone } = require('../function/clone')

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

    var { id, input, model, droplist, readonly, style, controls, icon, duplicated, duration, required,
        placeholder, textarea, filterable, clearable, removable, msg, day, disabled, label, password,
        duplicatable, lang, unit, currency, google, key, note, edit, minlength , children, container
    } = component
    
    if (duplicatable && typeof duplicatable !== "object") duplicatable = {}
    if (clearable && typeof clearable !== "object") clearable = {}

    readonly = readonly ? true : false
    removable = removable !== undefined ? (removable === false ? false : true) : false

    if (duplicatable) removable = true
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
    
    var path = `${unit ? `path=amount` :  currency ? `path=${currency}` : duration ? `path=${duration}` : day ? `path=${day}` : lang ? `path=${lang}` : google ? `path=name` : key ? `path=${key}` : ''}`

    if (label && (label.location === "inside" || label.position === "inside")) {

        var label = clone(component.label)
        var derivations = clone(component.derivations)
        var path = component.path
        var parent = component.parent
        var Data = component.Data
        var password = component.password && true
        
        delete component.parent
        delete component.label
        delete component.path
        delete component.id
        delete component.password
        delete component.derivations

        return {
            id, path, Data, parent, derivations, tooltip: component.tooltip,
            "type": `View?class=flex;style.transition=.1s;style.cursor=text;style.border=1px solid #ccc;style.borderRadius=.5rem;style.width=100%;${toString(container)}`,
            "children": [{
                "type": "View?style.flex=1;style.padding=.75rem 1rem .5rem 1rem;style.gap=.5rem",
                "children": [{
                    "type": `Text?text=${label.text || "Label"};style.color=#888;style.fontSize=1.1rem;style.width=fit-content;${toString(label)}`,
                    "controls": [{
                        "event": "click?next().getInput().focus()"
                    }]
                }, Input({ ...component, component: true, parent: id, style: override({ backgroundColor: "inherit", height: "3rem", width: "100%", padding: "0", fontSize: "1.5rem" }, style) })
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
                "event": "click:body?style().border=if():[)(:clickedElement.outside():[().element]]:[1px solid #ccc]:[2px solid #008060]"
            }, {
                "event": "click?getInput().focus()"
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
        var clicked = component.clicked || { style: {} }
        
        delete component.label
        delete component.path
        delete component.id
        delete component.tooltip
        label.tooltip = tooltip

        return {
            id, Data, parent, derivations, required, path,
            "type": `View?class=flex start column;style.gap=.5rem;${toString(container)}`,
            "children": [{
                "type": `Text?text=${label.text || "Label"};style.fontSize=1.6rem;style.width=fit-content;style.cursor=pointer;${toString(label)}`,
                "controls": [{
                    "event": `click:body?next().style().border=if():[)(:clickedElement.insideOrSame():[().element]||)(:clickedElement.insideOrSame():[next().element]]:[${clicked.style.border || "2px solid #008060"}]:[${style.border || "1px solid #ccc"}]?parent().required.mount`
                }, {
                    "event": "click?)(:clickedElement=next().getInput().element;next().getInput().focus()"
                }]
            }, 
                Input({ ...component, component: true, parent: id, style: { backgroundColor: "inherit", transition: ".1s", width: "100%", fontSize: "1.5rem", height: "4rem", border: "1px solid #ccc", ...style } }),
            {
                "type": "View?class=flex start align-center gap-1;style.alignItems=center;style.display=none",
                "children": [{
                    "type": `Icon?name=bi-exclamation-circle-fill;style.color=#D72C0D;style.fontSize=1.4rem`
                }, {
                    "type": `Text?text=Input is required;style.color=#D72C0D;style.fontSize=1.4rem;${toString(required)}`
                }]
            }],
            "controls": [{
                "event": "click?().lastChild().style().display=if():[().required.mount]:flex.else():none;().2ndChild().style().backgroundColor=if():[().required.mount]:#FFF4F4.else():[().2ndChild().style.backgroundColor.else():[().2ndChild().style.backgroundColor].else():inherit];().2ndChild().style().border=if():[().required.mount]:[1px solid #d72c0d].else():[().2ndChild().clicked.style.border.else():[().2ndChild().style.border].else():1px solid #ccc]"
            }]
        }
    }
    
    if (model === 'featured' || password) {
        
        return {
            ...component,
            type: 'View',
            class: 'flex-box unselectable',
            // remove from comp
            controls: {},
            droplist: undefined,
            style: {
                display: "inline-flex",
                alignItems: "center",
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
            children: [...children, {
                type: `Icon?id=${id}-icon?${icon.name}`,
                ...icon,
                hover: {
                    ...icon.hover,
                    style: {
                        ...icon.style.after,
                        ...icon.hover.style
                    }
                },
                style: {
                    fontSize: '1.6rem',
                    marginLeft: '1rem',
                    marginRight: '.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    ...icon.style
                }
            }, {
                type: `Text?id=${id}-msg;msg=${msg};text=${msg}?${msg}`,
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
                path: component.path,
                class: `${input.class} ${component.class.includes("ar") ? "ar" : ""}`,
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
                filterable,
                placeholder,
                duplicated,
                disabled,
                droplist,
                templated: true,
                'placeholder-ar': component['placeholer-ar'],
                hover: {
                    ...input.hover,
                    style: {
                        backgroundColor: style.after.backgroundColor,
                        color: style.after.color || style.color,
                        ...input.style.after,
                        ...input.hover.style
                    }
                },
                style: {
                    width: password ? "100%" : "fit-content",
                    height: 'fit-content',
                    borderRadius: style.borderRadius || '0.25rem',
                    backgroundColor: style.backgroundColor || 'inherit',
                    fontSize: style.fontSize || '1.4rem',
                    maxHeight: style.maxHeight || "initial",
                    border: '0',
                    height: "100%",
                    padding: "0.5rem",
                    color: '#444',
                    outline: 'none',
                    userSelect: password ? "none" : "initial",
                    ...uploadInputStyle,
                    ...input.style
                },
                controls: [...controls, {
                    event: `keyup??().data();e().key=Enter;${duplicatable}`,
                    actions: `duplicate:${id}?${duplicatable && duplicatable.path ? `duplicate.path=${duplicatable.path}` : ''}`
                }, {
                    event: "select;mousedown?e().preventDefault()"
                }, {
                    event: "input?().parent().parent().required.mount=false;().parent().parent().click()?().parent().parent().required.mount;e().target.value.exist()"
                }]
            }, {
                type: `View?style.height=100%;style.width=4rem;hover.style.backgroundColor=#eee;class=flexbox pointer relative?[${password}]`,
                children: [{
                    type: `Icon?name=bi-eye-fill;style.color=#888;style.fontSize=1.8rem;class=absolute;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?().parent().prev().element.type=text;().next().style().display=flex;().style().display=none"
                    }]
                }, {
                    type: `Icon?name=bi-eye-slash-fill;style.color=#888;style.fontSize=1.8rem;class=absolute display-none;style.height=100%;style.width=4rem`,
                    controls: [{
                        event: "click?().parent().prev().element.type=password;().prev().style().display=flex;().style().display=none"
                    }]
                }]
            }, {
                type: `View?class=flex-box;style.alignSelf=flex-start;style.minWidth=fit-content;style.height=${style.height || '4rem'}?!().parent().password`,
                children: [{
                    type: `Icon?icon.name=bi-caret-down-fill;style.color=#444;style.fontSize=1.2rem;style.width=1rem;style.marginRight=.5rem?():${id}-input.droplist.items.isdefined()`
                }, {
                    type: `Icon?class=pointer;icon.name=bi-files;style.color=#444;style.fontSize=1.2rem;style.width=1rem;style.marginRight=.5rem;hoverable;style.after.color=#116dff?${duplicatable}`,
                    controls: {
                        event: `click??():${id}-input.data();[${duplicatable}]`,
                        actions: `duplicate:${id}?${duplicatable && duplicatable.path ? `duplicate.path=${duplicatable.path}` : "" }`
                    }
                }, {
                    type: `Text?text=${note};style.color=#666;style.fontSize=1.3rem;style.padding=.5rem?[${note}]`
                }, {
                    type: `Text?id=${id}-key;key=${key};text=${key};droplist.items<<!${readonly}=await()._array:[any.Enter a special key:._param.readonly]:[any.${key}._param.input];hoverable;duplicated=${duplicated}?${key}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    },
                }, {
                    type: `Text?id=${id}-currency;currency=${currency};text=${currency};droplist.items<<!${readonly}=await().)(:asset.findByName():Currency.options.map():name;hoverable;duplicated=${duplicated}?${currency}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    },
                }, {
                    type: `Text?path=unit;id=${id}-unit;droplist.items<<!${readonly}=await().)(:asset.findByName():Unit.options.map():name;hoverable?${unit}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    },
                    actions: `setData?data.value=${unit}?!().data()`
                }, {
                    type: `Text?id=${id}-day;day=${day || 'day'};text=${day};droplist.items<<!${readonly}=await()._array:Monday:Tuesday:Wednesday:Thursday:Friday:Saturday:Sunday;droplist.day;hoverable;duplicated=${duplicated}?${day}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    }
                }, {
                    type: `Text?id=${id}-duration;duration=${duration || 'hr'};text=${duration};droplist.items<<!${readonly}=_array:sec:min:hr:day:week:month:3month:year;droplist.duration;hoverable;duplicated=${duplicated}?${duration}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    }
                }, {
                    type: `Text?id=${id}-language;lang=${lang};text=${lang};droplist.items<<!${readonly}=await().)(:asset.findByName():Language.options.map():name;droplist.lang;hoverable;duplicated=${duplicated}?${lang}`,
                    style: {
                        fontSize: '1.3rem',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '.25rem',
                        borderRadius: '.25rem',
                        transition: 'color .2s',
                        after: { color: '#0d6efd' }
                    }
                }, {
                    type: `Checkbox?id=${id}-google;class=align-center;path=google;style.cursor=pointer;style.margin=0 .25rem?${google}`,
                    controls: [{
                        event: `change;loaded?():${id}-more.style().display=none<<!e().target.checked;():${id}-more.style().display=flex<<e().target.checked`
                    }]
                }, {
                    type: `Icon?id=${id}-more;name=bi-three-dots-vertical;path=type;style.width=1.5rem;style.display=none;style.color=#666;style.cursor=pointer;style.fontSize=2rem;)(:google-items=_array:outlined:rounded:sharp:twoTone;droplist.items=_array:[any.Enter google icon type]:[)(:google-items];hoverable?${google}`,
                }, {
                    type: `Icon?class=align-center;name=bi-x;id=${id}-x;hoverable?${clearable}.or():${removable}`,
                    style: {
                        fontSize: '2rem',
                        color: '#444',
                        cursor: 'pointer',
                        after: { color: 'red' }
                    },
                    controls: [{
                        event: 'click',
                        actions: [
                            // remove element
                            `remove:${id}??${removable};():${id}.length().greater():${minlength};!():${id}-input.data()<<${clearable}`,
                            // clear data
                            `focus;resize?().Data().path():[[():${id}.clearable.path].or():[():${id}-input.derivations]]=_string;():${id}-input.val()=_string?():${id}.clearable.isdefined()?${id}-input`,
                            // for key
                            `focus:${id}-input?():${id}-input.val()=_string;():${edit}-key.element.innerHTML=():${edit}-key.key;():${edit}-input.path=():${edit}-key.key;():${edit}-input.derivations=():${edit}.derivations.push():[${edit}-key.key];().Data().[():${edit}-input.derivations]=():${edit}-input.val()?${edit}`
                        ]
                    }]
                }]
            }]
        }
    }

    if (model === 'classic' && !password) {
        return {
            ...component,
            style: {
                cursor: readonly ? "pointer" : "auto",
                border: "0",
                width: "fit-content",
                padding: '0.5rem',
                color: '#444',
                backgroundColor: 'inherit',
                height: 'fit-content',
                borderRadius: '0.25rem',
                fontSize: '1.4rem',
                ...input.style,
                ...style,
            },
            controls: [...controls, {
                event: "input?().parent().required.mount=false;().parent().click()?().parent().required.mount;e().target.value.exist()"
            }]
        }
    }
}

module.exports = Input