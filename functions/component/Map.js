const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)
    
    return {
        ...component,
        type: "View?global().opened-maps=[]<<!global().opened-maps;class=flex-column;style.marginLeft=2rem<<().isField;style.width=100%;style.width=calc(100% - 2rem)<<().isField;style.borderLeft=1px solid #ddd<<().isField.isdefined();mode.dark.style.borderLeft=1px solid #888",
        children: [{
            type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem?!().parent().isField",
            controls: [{
                event: "click?().opened=().1stChild().style().transform.includes():rotate(90deg);().parent().children().pull():0.pullLast().map():[style().display.equal():[if():[().opened]:none.else():flex]];().1stChild().style().transform=if():[().opened]:rotate(0deg).else():rotate(90deg);().1stChild().2ndlast().style().display=if():[().opened]:flex.else():none;().lastSibling().style().display=if():[().opened]:none.else():flex;().1stChild().3rdlast().style().display=if():[().opened]:flex.else():none?global().clickedElement.not():[().2ndChild().element].and():[global().clickedElement.not():[().3rdChild().element]].and():[global().clickedElement.id.not():[().lastChild().1stChild().element.id]]"
            }, {
                event: "mouseenter?().lastChild().style().opacity=1"
            }, {
                event: "mouseleave?().lastChild().style().opacity=0"
            }],
            children: [{
                type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s"
            }, {
                type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%"
            }, {
                type: "Text?class=pointer;text=_dots;style.display=none;mode.dark.style.color=#888;style.fontSize=1.4rem"
            }, {
                type: "Text?style.display=none;text=};style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem"
            }, {
                type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                children: [{
                    type: "Icon?mainMap;name=bi-three-dots-vertical;actionlist.undeletable;actionlist.placement=left;mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                }]
            }]
        }, {
            type: "[View]?class=flex column;sort;arrange=().parent().arrange;style.marginLeft=2rem<<!().parent().isField?().data().isdefined()",
            children: [{
                type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem?().derivations.lastIndex().not():id;().derivations.lastIndex().not():creation-date",
                controls: [{
                    event: "click?():[().next().id].style().display=if():[().next().style().display.is():flex]:none.else():flex;():[().1stChild().id].style().transform=if():[().1stChild().style().transform.includes():rotate(0deg)]:rotate(90deg).else():rotate(0deg);().1stChild().2ndlast().style().display=if():[().1stChild().2ndlast().style().display.is():flex]:none.else():flex;().next().next().style().display=if():[().next().next().style().display.is():flex]:none.else():flex;().1stChild().3rdlast().style().display=if():[().1stChild().3rdlast().style().display.is():flex.or():[().data().length().is():0]]:none.else():flex?().data().type().is():array.or():[().data().type().is():map];global().clickedElement.id.not():[().2ndChild().element.id].and():[global().clickedElement.id.not():[().3rdChild().element.id]]:[global().clickedElement.id.not():[().lastChild().1stChild().element.id]]"
                }, {
                    event: "mouseenter?().lastChild().style().opacity=1"
                }, {
                    event: "mouseleave?().lastChild().style().opacity=0"
                }],
                children: [{
                    type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s?().data().type().is():map.or():[().data().type().is():array]"
                }, {
                    type: "View?style.minWidth=2rem;text=?().data().type().not():map.and():[().data().type().not():array]"
                }, {
                    type: "Input?preventDefault;mode.dark.style.color=#8cdcfe;style.height=3.2rem;style.border=1px solid #ffffff00;mode.dark.style.border=1px solid #131313;hover.style.border=1px solid #ddd;input.style.color=blue;input.value=().derivations.lastIndex();style.borderRadius=.5rem;style.minWidth=fit-content;style.width=fit-content?().derivations.lastIndex().num().type().not():number",
                    controls: [{
                        event: "input?global().innerdata=().data().clone();().data().delete();global().element-value=().val();global().derivation-index=().derivations.length().subs():1;().Data().path():[().derivations.clone().pull():[().derivations.length().else():1.subs():1].push():[().val()]].equal():[global().innerdata];().parent().parent().deepChildren().map():[derivations.[global().derivation-index].equal():[global().element-value]]"
                    }, {
                        event: "keyup?():droplist.children().[global().keyup-index].click()<<global().droplist-positioner.and():[global().keyup-index];global().keyup-index=0;().next().click();timer():[():droplist.children().0.mouseenter()]:200?e().key=Enter"
                    }, {
                        event: "keyup?():droplist.children().[global().keyup-index].mouseleave();global().keyup-index.equal():[if():[e().keyCode.is():40]:[global().keyup-index.add():1].else():[global().keyup-index.subs():1]];():droplist.children().[global().keyup-index].mouseenter()?e().keyCode.is():40.or():[e().keyCode.is():38];global().droplist-positioner;if():[e().keyCode.is():38]:[global().keyup-index.isgreater():0].else():[if():[e().keyCode.is():40]:[global().keyup-index.less():[().next().droplist.items.length().subs():1]]]"
                    }]
                }, {
                    type: "Text?text=().derivations.lastIndex();class=flex-box;mode.dark.style.color=#888;style.color=#666;style.fontSize=1.4rem;style.marginRight=.5rem;style.minWidth=3rem;style.minHeight=2rem;style.borderRadius=.5rem;style.border=1px solid #ddd?().derivations.lastIndex().num().type().is():number"
                }, {
                    type: "Text?text=:;class=flex-box pointer;mode.dark.style.color=#888;style.fontSize=1.5rem;style.marginRight=.5rem;style.minWidth=2rem;style.minHeight=2rem;style.paddingBottom=.25rem;style.borderRadius=.5rem;hover.style.backgroundColor=#e6e6e6;droplist.items=_array:children:controls:string:number:boolean:map:array:timestamp:geopoint;droplist.isMap"
                }, {
                    type: "Text?text=_quotations;mode.dark.style.color=#c39178;style.color=#ce743a;style.marginRight=.3rem;style.fontSize=1.4rem?().data().type().is():string"
                }, {
                    type: "Text?class=flexbox;text=[;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?().data().type().is():array"
                }, {
                    type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?().data().type().is():map"
                }, {
                    type: "View?style.overflow=auto;style.whiteSpace=nowrap",
                    children: [{
                        type: "View?style.display=inline-flex",
                        children: [{
                            type: "Input?mode.dark.style.color=#c39178;input.readonly<<().derivations.lastElement().is():id;style.maxHeight=3.2rem;style.height=3.2rem;mode.dark.style.border=1px solid #131313;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;style.borderRadius=.5rem;input.style.color=#ce743a?().data().type().is():string",
                            controls: [{
                                event: "keyup?global().insert-index=().parent().parent().parent().parent().parent().children()._findIndex():[_.id.is():[().parent().parent().parent().parent().id]].add():1;().parent().parent().parent().parent().parent().data().field():_string:_string<<().parent().parent().parent().parent().parent().data().type().is():map;().parent().parent().parent().parent().parent().data().splice():_string:[global().insert-index]<<().parent().parent().parent().parent().parent().data().type().is():array;().parent().parent().parent().parent().parent().children().slice():[global().insert-index]._map():[_.1stChild().2ndChild().text().equal():[_.1stChild().2ndChild().text().num().add():1].then():[global().last-index.equal():[_.derivations.length().subs():1]]:[global().el-index.equal():[_.derivations.lastElement().num().add():1]]:[_.deepChildren().map():[derivations.[global().last-index].equal():[global().el-index]]]]<<global().insert-index.less():[().parent().parent().parent().parent().parent().data().length().add():1].and():[().parent().parent().parent().parent().parent().data().type().is():array]?e().key=Enter",
                                actions: "insert:[().parent().parent().parent().parent().parent().id]?insert.component=().parent().parent().parent().parent().parent().children.1.clone().removeMapping();insert.path=if():[().parent().parent().parent().parent().parent().data().type().is():array]:[().parent().parent().parent().parent().parent().derivations.clone().push():[global().insert-index]].else():[().parent().parent().parent().parent().parent().derivations.clone().push():_string];insert.index=global().insert-index"
                            }]
                        }]
                    }]
                }, {
                    type: "Input?style.height=3.2rem;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.type=number;input.style.color=olive;style.width=fit-content;style.borderRadius=.5rem?().data().type().is():number",
                    controls: [{
                        event: "keyup?global().insert-index=().parent().parent().parent().children()._findIndex():[_.id.is():[().parent().parent().id]].add():1;().parent().parent().parent().data().field():_string:_string<<().parent().parent().parent().data().type().is():map;().parent().parent().parent().data().splice():_string:[global().insert-index]<<().parent().parent().parent().data().type().is():array;().parent().parent().parent().children().slice():[global().insert-index]._map():[_.1stChild().2ndChild().text().equal():[_.1stChild().2ndChild().text().num().add():1].then():[global().last-index.equal():[_.derivations.length().subs():1]]:[global().el-index.equal():[_.derivations.lastElement().num().add():1]]:[_.deepChildren().map():[derivations.[global().last-index].equal():[global().el-index]]]]<<global().insert-index.less():[().parent().parent().parent().data().length().add():1].and():[().parent().parent().parent().data().type().is():array]?e().key=Enter",
                        actions: "insert:[().parent().parent().parent().id]?insert.component=().parent().parent().parent().children.1.clone().removeMapping();insert.path=if():[().parent().parent().parent().data().type().is():array]:[().parent().parent().parent().derivations.clone().push():[global().insert-index]].else():[().parent().parent().parent().derivations.clone().push():_string];insert.index=global().insert-index"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;readonly;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.color=purple;style.width=fit-content;style.borderRadius=.5rem;droplist.items=_array:true:false?().data().type().is():boolean"
                }, {
                    type: "Input?style.height=3.2rem;input.type=datetime-local;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?().data().type().is():timestamp",
                    controls: [{
                        event: "change?().data()=().val().date().timestamp()"
                    }, {
                        event: "loaded?().val()=().data().date().getDateTime()"
                    }]
                }, {
                    type: "Text?text=_quotations;mode.dark.style.color=#c39178;style.marginLeft=.3rem;style.color=#ce743a;style.fontSize=1.4rem?().data().type().is():string"
                }, {
                    type: "Text?class=pointer;style.display=none;mode.dark.style.color=#888;text=_dots;style.fontSize=1.4rem?().data().type().is():array.or():[().data().type().is():map];().data().length().greater():0"
                }, {
                    type: "Text?style.display=none;text=];style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?().data().type().is():array"
                }, {
                    type: "Text?style.display=none;text=};style.paddingBottom=.25rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?().data().type().is():map"
                }, {
                    type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                    children: [{
                        type: "Icon?actionlist.placement=left;mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;icon.name=bi-three-dots-vertical;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                    }]
                }]
            }, {
                type: "View?arrange=().parent().arrange;class=flex-start;style.display=flex;style.transition=.2s?().data().type().is():map.or():[().data().type().is():array]",
                children: [{
                    type: "Map?arrange=().parent().arrange;isField"
                }]
            }, {
                type: "Text?class=flex-box;text=];mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?().data().type().is():array"
            }, {
                type: "Text?class=flex-box;text=};mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?().data().type().is():map"
            }]
        }, {
            type: "Text?class=flexbox;style.justifyContent=flex-start;text=};style.marginLeft=2rem;style.paddingBottom=.25rem;style.height=2.5rem;mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?!().parent().isField",
        }]
    }
}