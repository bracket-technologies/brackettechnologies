const { toComponent } = require('../function/toComponent')

module.exports = (component) => {

    component = toComponent(component)
    
    return {
        ...component,
        type: "View?if():[!)(:opened-maps]:[)(:opened-maps=_array];class=flex-column;style.width=100%;if():[().isField]:[style():[marginLeft=2rem;borderLeft=1px solid #ddd;width=calc(100% - 2rem)]]:[line-counter:()=0];#mode.dark.style.borderLeft=1px solid #888",
        children: [{
            type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem;style.position=relative?!parent().isField",
            controls: [{
                event: "click?().opened=1stChild().style().transform.inc():rotate(90deg);parent().children().pull():0.pullLast().():[style().display=if():[().opened]:none:flex];1stChild().style().transform=if():[().opened]:rotate(0deg):rotate(90deg);2ndLastChild().style().display=if():[().opened]:flex:none;lastSibling().style().display=if():[().opened]:none:flex;3rdLastChild().style().display=if():[().opened]:flex:none?clicked:().id!=2ndChild().id;clicked:().id!=3rdChild().id;clicked:().id!=lastChild().1stChild().id"
            }, {
                event: "mouseenter?lastChild().style().opacity=1"
            }, {
                event: "mouseleave?lastChild().style().opacity=0"
            }],
            children: [{
                type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;#mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s"
            }, {
                type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%"
            }, {
                type: "Text?class=pointer;text=...;style.display=none;#mode.dark.style.color=#888;style.fontSize=1.4rem"
            }, {
                type: "Text?style.display=none;text=};style.paddingBottom=.25rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem"
            }, {
                type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                children: [{
                    type: "Icon?mainMap;name=bi-three-dots-vertical;actionlist.undeletable;actionlist.placement=left;#mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                }]
            }]
        }, {
            type: "[View]?class=flex column;sort;arrange=parent().arrange;style.marginLeft=if():[!parent().isField]:2rem:0;style.position=relative?data().isdefined();data()!=_array;data()!=_map",
            children: [{
                type: "View?class=flex-start;style.alignItems=center;hover.style.backgroundColor=#f6f6f6;style.minHeight=3rem",
                controls: [{
                    event: "click?next().style().display=if():[next().style().display=flex]:none:flex;1stChild().style().transform=if():[1stChild().style().transform.inc():rotate(0deg)]:rotate(90deg):rotate(0deg);2ndLastChild().style().display=if():[2ndLastChild().style().display=flex]:none:flex;3rdLastChild().style().display=if():[3rdLastChild().style().display=flex||data().len()=0]:none:flex;next().next().style().display=if():[next().next().style().display=flex]:none:flex?data().type()=array||data().type()=map;clicked:().id!=2ndChild().id;clicked:().id!=3rdChild().id;clicked:().id!=lastChild().1stChild().id;!clicked:().classlist().inc():[mini-controls]"
                }, {
                    event: "mouseenter?lastChild().style().opacity=1"
                }, {
                    event: "mouseleave?lastChild().style().opacity=0"
                }],
                children: [{
                    type: "Icon?style.fontSize=1.3rem;name=bi-caret-right-fill;#mode.dark.style.color=#888;style.transform=rotate(90deg);style.width=2rem;class=flex-box pointer;style.transition=transform .2s?data().type()=map||data().type()=array"
                }, {
                    type: "View?style.minWidth=2rem;text=?data().type()!=map;data().type()!=array"
                }, {
                    type: "View?preventDefault;editable;style:[alignItems=center;width=fit-content;minWidth=fit-content;height=3.2rem;border=1px solid #ffffff00;borderRadius=.5rem;color=blue;backgroundColor=#ffffff00;fontSize=1.4rem;padding=.5rem];hover.style.border=1px solid #ddd;text=path().lastElement()?2ndParent().parent().data().type()!=array",
                    controls: [{
                        event: "input?Data():[path().clone().replaceLast():val()]=data().clone();data().del();2ndParent().deepChildren().():[derivations.[path().lastIndex()]=val()]"
                    }, {
                        event: "keyup?if():[)(:droplist-positioner;)(:keyup-index]:[():droplist.children().[)(:keyup-index].click();timer():[)(:keyup-index.del()]:200;().break=true];)(:keyup-index=0;if():[)(:droplist-positioner!=next().id]:[next().click()];timer():[():droplist.children().0.mouseenter()]:200?e().key=Enter;!ctrlKey:()"
                    }, {
                        event: "keyup?():droplist.mouseleave()?e().key=Escape"
                    }, {
                        event: "keyup?():droplist.children().[)(:keyup-index].mouseleave();)(:keyup-index=if():[e().keyCode=40]:[)(:keyup-index+1]:[)(:keyup-index-1];():droplist.children().[)(:keyup-index].mouseenter()?e().keyCode=40||e().keyCode=38;)(:droplist-positioner;if():[e().keyCode=38]:[)(:keyup-index>0].elif():[e().keyCode=40]:[)(:keyup-index<next().droplist.items.lastIndex()]"
                    }, {
                        event: "keyup?insert-index:()=3rdParent().children().findIndex():[id=2ndParent().id]+1;if():[data().type()=string]:[data()=_list];if():[path().lastEl()=children]:[data().push():[_map:type:_string]];if():[path().lastEl()=controls]:[data().push():[_map:event:_string]];update():2ndParent();update:().view.inputs().lastEl().focus()?e().key=Enter;ctrlKey:();path().lastEl()=controls||path().lastEl()=children"
                    }]
                }, {
                    type: "Text?text=path().lastElement();class=flexbox;#mode.dark.style.color=#888;style.color=#666;style.fontSize=1.4rem;style.marginRight=.5rem;style.minWidth=3rem;style.minHeight=2rem;style.borderRadius=.5rem;style.border=1px solid #ddd?2ndParent().parent().data().type()=array"
                }, {
                    type: "Text?text=:;class=flex-box pointer;#mode.dark.style.color=#888;style.fontSize=1.5rem;style.marginRight=.5rem;style.minWidth=2rem;style.minHeight=2rem;style.paddingBottom=.25rem;style.borderRadius=.5rem;hover.style.backgroundColor=#e6e6e6;droplist.items=_array:children:controls:string:number:boolean:map:array:timestamp:geopoint;droplist.isMap"
                }, {
                    type: `Text?text=";#mode.dark.style.color=#c39178;style.color=#a35521;style.marginRight=.3rem;style.fontSize=1.4rem?data().type()=string`
                }, {
                    type: "Text?class=flexbox;text=[;style.paddingBottom=.25rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?data().type()=array"
                }, {
                    type: "Text?class=flexbox;text={;style.paddingBottom=.25rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem;style.height=100%?data().type()=map"
                }, {
                    type: "View?class=flexbox mini-controls;style:[height=2rem;overflowY=hidden;borderRadius=.25rem;padding=.5rem;gap=.75rem;position=absolute;left=path().len()*(-2.1)+rem];mouseleave:[2ndChild().style():[opacity=0;pointerEvents=none];3rdChild().style():[opacity=0;pointerEvents=none]]",
                    children: [
                        {
                            type: "Text?line-counter:()++;text=line-counter:();class=flexbox line-counter pointer mini-controls;style:[fontSize=1.2rem];mouseenter:[next().style():[opacity=1;pointerEvents=auto];2ndNext().style():[opacity=1;pointerEvents=auto]]"
                        }, {
                            type: "View?class=flexbox column pointer mini-controls;style:[padding=.5rem;gap=.75rem;opacity=0;pointerEvents=none];mouseleave:[parent().style():[height=2rem]]",
                            children: [
                                {
                                    type: "View?class=flexbox pointer;color=0;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#ffcea370;border=1px solid #ccc];click:[().color++;if():[color=16]:[().color=1];style().backgroundColor=[_list:#ffffff70:#ffcea370:#c0f5a270:#ffffff70:#fbe69270:#78eba870:#ffffff70:#ecb4f570:#8cebdb70:#ffffff70:#fab4d770:#9ee1ff70:#ffffff70:#feb1b170:#c4c2ff70:#ffffff70].[().color];3rdParent().style().backgroundColor=style().backgroundColor;3rdParent().hover.disable=true]"
                                },
                                {
                                    type: "View?class=flexbox pointer;color=0;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#fff;border=1px solid #ccc];click:[().color++;if():[color=16]:[().color=1];style().backgroundColor=[_list:#ffffff70:#ffcea370:#c0f5a270:#ffffff70:#fbe69270:#78eba870:#ffffff70:#ecb4f570:#8cebdb70:#ffffff70:#fab4d770:#9ee1ff70:#ffffff70:#feb1b170:#c4c2ff70:#ffffff70].[().color];3rdParent().style().backgroundColor=style().backgroundColor;3rdParent().hover.disable=true];mouseenter:[2ndParent().style().height=fit-content]"
                                },
                                {
                                    type: "View?class=flexbox pointer;color=0;style:[height=1.5rem;width=1.5rem;borderRadius=.25rem;backgroundColor=#c0f5a270;border=1px solid #ccc];click:[().color++;if():[color=16]:[().color=1];style().backgroundColor=[_list:#ffffff70:#ffcea370:#c0f5a270:#ffffff70:#fbe69270:#78eba870:#ffffff70:#ecb4f570:#8cebdb70:#ffffff70:#fab4d770:#9ee1ff70:#ffffff70:#feb1b170:#c4c2ff70:#ffffff70].[().color];3rdParent().style().backgroundColor=style().backgroundColor;3rdParent().hover.disable=true]"
                                }
                            ]
                        }, {
                            type: "Icon?class=flexbox pointer mini-controls;name=bi-eye;style:[fontSize=1.4rem;opacity=0;pointerEvents=none;backgroundColor=#fff]"
                        }
                    ]
                }, {
                    type: "View?style.overflow=auto;style.whiteSpace=nowrap?data().type()=string",
                    children: [{
                        type: "View?style.display=inline-flex",
                        children: [{
                            type: "View?class=flex;colorize;editable;#mode.dark.style.color=#c39178;#mode.dark.border=1px solid #131313;if():[path().lastElement()=id]:[readonly=true];style:[alignItems=center;width=fit-content;minWidth=1rem;minHeight=3rem;maxHeight=3rem;height=3rem;border=1px solid #ffffff00;borderRadius=.5rem;color=#a35521;fontSize=1.4rem;padding=.5rem];hover.style.border=1px solid #ddd;input.style.color=#a35521",
                            controls: [{
                                event: "keyup?insert-index:()=2ndParent().2ndParent().parent().children().findIndex():[id=2ndParent().2ndParent().id]+1;if():[2ndParent().2ndParent().parent().data().type()=map]:[2ndParent().2ndParent().parent().data().[_string]=_string];if():[2ndParent().2ndParent().parent().data().type()=array]:[2ndParent().2ndParent().parent().data().splice():_string:[insert-index:()]];if():[insert-index:().less():[2ndParent().2ndParent().parent().data().len()+1];2ndParent().2ndParent().parent().data().type()=array]:[2ndParent().2ndParent().parent().children().slice():[insert-index:()]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;last-index:()=_.derivations.lastIndex();el-index:()=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[last-index:()]=el-index:()]]]?e().key=Enter;!ctrlKey:()",
                                actions: "wait():[insert:[2ndParent().2ndParent().parent().id]]?insert.component=2ndParent().2ndParent().parent().children.1;insert.path=if():[2ndParent().2ndParent().parent().data().type()=array]:[2ndParent().2ndParent().parent().derivations.clone().push():[insert-index:()]].else():[2ndParent().2ndParent().parent().derivations.clone().push():_string];insert.index=insert-index:();wait():[().insert.view.getInput().focus()]"
                            },
                            {
                                event: "keyup?insert-index:()=2ndParent().2ndParent().2ndParent().2ndParent().children().findIndex():[id=2ndParent().2ndParent().2ndParent().parent().id]+1;2ndParent().2ndParent().2ndParent().2ndParent().data().splice():[if():[path().lastEl()=type]:[_map:type:_string].elif():[path().lastEl()=event||path().lastEl()=actions]:[_map:event:_string]]:[insert-index:()];if():[insert-index:().less():[2ndParent().2ndParent().2ndParent().2ndParent().data().len()+1]]:[2ndParent().2ndParent().2ndParent().2ndParent().children().slice():[insert-index:()]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;last-index:()=_.derivations.lastIndex();el-index:()=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[last-index:()]=el-index:()]]]?e().key=Enter;ctrlKey:();path().lastEl()=type||path().lastEl()=event||path().lastEl()=actions",
                                actions: "wait():[insert:[2ndParent().2ndParent().2ndParent().2ndParent().id]]?insert.component=2ndParent().2ndParent().2ndParent().2ndParent().children.1;insert.path=2ndParent().2ndParent().2ndParent().2ndParent().derivations.clone().push():[insert-index:()];insert.index=insert-index:();wait():[().insert.view.inputs().1.focus()]"
                            }]
                        }]
                    }]
                }, {
                    type: "Input?style.height=3.2rem;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.type=number;input.style.color=olive;style.width=fit-content;style.borderRadius=.5rem?data().type()=number",
                    controls: [{
                        event: "keyup?insert-index:()=2ndParent().parent().children().findIndex():[id=2ndParent().id]+1;if():[2ndParent().parent().data().type()=map]:[2ndParent().parent().data().[_string]=_string];if():[2ndParent().parent().data().type()=array]:[2ndParent().parent().data().splice():_string:[insert-index:()]];if():[insert-index:().less():[2ndParent().parent().data().len()+1];2ndParent().parent().data().type()=array]:[2ndParent().parent().children().slice():[insert-index:()]._():[_.1stChild().2ndChild().txt()=_.1stChild().2ndChild().txt().num()+1;last-index:()=_.derivations.lastIndex();el-index:()=_.derivations.lastElement().num()+1;_.deepChildren().():[derivations.[last-index:()]=el-index:()]]]?e().key=Enter;!ctrlKey:()",
                        actions: "wait():[insert:[2ndParent().parent().id]]?insert.component=2ndParent().parent().children.1;insert.path=if():[2ndParent().parent().data().type()=array]:[2ndParent().parent().derivations.clone().push():[insert-index:()]]:[2ndParent().parent().derivations.clone().push():_string];insert.index=insert-index:();wait():[().insert.view.input().focus()]"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;readonly;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.color=purple;style.width=fit-content;style.borderRadius=.5rem;droplist.items=_array:true:false?data().type()=boolean"
                }, {
                    type: "Input?style.height=3.2rem;input.type=datetime-local;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?data().type()=timestamp",
                    controls: [{
                        event: "change?data()=date():txt().timestamp()"
                    }, {
                        event: "loaded?txt()=date():data().getDateTime()"
                    }]
                }, {
                    type: "Input?style.height=3.2rem;input.type=time;style.border=1px solid #ffffff00;hover.style.border=1px solid #ddd;input.style.minWidth=25rem;style.borderRadius=.5rem?data().type()=time",
                    controls: [{
                        event: "change?data()=data().timestamp()"
                    }, {
                        event: "loaded?txt()=data().toClock():[hr;min]"
                    }]
                }, {
                    type: `Text?text=";#mode.dark.style.color=#c39178;style.marginLeft=.3rem;style.color=#a35521;style.fontSize=1.4rem?data().type()=string`
                }, {
                    type: "Text?class=flexbox pointer;style.display=none;#mode.dark.style.color=#888;text='...';style.fontSize=1.4rem"
                }, {
                    type: "Text?style.display=none;text=];style.paddingBottom=.25rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?data().type()=array"
                }, {
                    type: "Text?style.display=none;text=};style.paddingBottom=.25rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?data().type()=map"
                }, {
                    type: "View?class=flex-box;style.gap=.5rem;style.opacity=0;style.flex=1;style.marginRight=.5rem;style.transition=.1s;style.justifyContent=flex-end",
                    children: [{
                        type: "Icon?actionlist.placement=left;#mode.dark.style.color=#888;class=flex-box pointer;style.color=#888;icon.name=bi-three-dots-vertical;style.width=2rem;style.fontSize=2rem;hover.style.color=blue;style.transition=.2s"
                    }]
                }]
            }, {
                type: "View?arrange=parent().arrange;class=flex-start;style.display=flex;style.transition=.2s?data().type()=map||data().type()=array",
                children: [{
                    type: "Map?arrange=parent().arrange;isField"
                }]
            }, {
                type: "Text?class=flex-box;text=];#mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?data().type()=array"
            }, {
                type: "Text?class=flex-box;text=};#mode.dark.style.color=#888;style.height=2.5rem;style.display=flex;style.marginLeft=2rem;style.color=green;style.fontSize=1.4rem;style.width=fit-content?data().type()=map"
            }]
        }, {
            type: "Text?class=flexbox;style.justifyContent=flex-start;text=};style.marginLeft=2rem;style.paddingBottom=.25rem;style.height=2.5rem;#mode.dark.style.color=#888;style.color=green;style.fontSize=1.4rem?!parent().isField",
        }]
    }
}