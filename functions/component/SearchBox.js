const { toComponent } = require("../function/toComponent");

module.exports = (component) => {

  component = toComponent(component)

  return {
    ...component,
    "type": "View?style.flex=1;style.margin=0 1rem;style.height=4.5rem",
    "children": [{
        "type": "View?class=overlay;id=search-mini-page-overlay;style.zIndex=-1;style.transition=.2s;style.display=none;style.after.opacity=1>>50;style.after.display=flex;style.after.zIndex=1",
        "controls": {
            "event": "click",
            "actions": "resetStyles:search-mini-page;resetStyles:search-mini-page-results;setStyle?style.opacity=0;style.display=none>>250"
        }
    }, {
        "type": "View?id=search-mini-page;style.display=flex;style.flexDirection=column;style.backgroundColor=#f0f0f0;style.borderRadius=.75rem;style.flex=1;style.top=1rem;style.position=initial>>200;style.width=60rem;style.after.backgroundColor=#fff;style.after.boxShadow=0 0 6px rgba(33, 33, 33, 0.431);style.after.position=absolute;style.after.zIndex=2",
        "children": [{
            "type": "View?class=flex-start;style.flex=1;style.borderRadius=.75rem;style.height=4.5rem",
            "children": [{
                "type": "Icon?icon.name=bi-search;style.margin=0 1rem;style.color=#888;style.fontSize=1.8rem"
            }, {
                "type": "Input?placeholder=Search for booking, provider, service, category...;style.flex=1;style.height=4.5rem;style.backgroundColor=inherit;style.border=0;style.color=#444;style.fontSize=1.5rem;style.outline=none",
                "controls": [{
                    "event": "focusin",
                    "actions": "mountAfterStyles???search-mini-page-overlay;search-mini-page;search-mini-page-results"
                }, {
                    "event": "input",
                    "actions": "async().search?search.collection=path;search."
                }]
            }]
        }, {
            "type": "View?id=search-mini-page-results;style.width=100%;style.padding=0 1rem;style.transition=.2s;style.height=0;style.opacity=0;style.after.opacity=1;style.after.height=15rem>>25",
            "children": {
                "type": "Text?class=divider;style.margin=0"
            }
        }]
    }]
  }
}
