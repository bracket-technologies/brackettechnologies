const { eventExecuter } = require("../action/event")
const { lineInterpreter } = require("../action/lineInterpreter")

const defaultAppEvents = () => {

    var views = window.views
    var global = window.global

    // body default event listeners

    // clicked element
    document.addEventListener('click', e => {

        global.__clicked__ = views[((e || window.event).target || e.currentTarget).id]

        // droplist
        if (global.__clicked__ && views.droplist.__element__.contains(global.__clicked__.__element__)) global["droplist-txt"] = global.__clicked__.__element__.innerHTML

        // body click events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.click && event.click.map(data => (global.__clicked__ && (global.__clicked__.id === data.eventID || views[data.eventID].__element__.contains(global.__clicked__.__element__))) && eventExecuter({ ...data, e })))
    })

    // mousemove
    document.addEventListener('mousemove', (e) => {

        global.__mousemoved__ = views[((e || window.event).target || e.currentTarget).id]

        // body mousemove events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mousemove && event.mousemove.map(data => (global.__mousemoved__ && (global.__mousemoved__.id === data.eventID || views[data.eventID].__element__.contains(global.__mousemoved__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener("mousedown", (e) => {

        global.__clicked__ = views[((e || window.event).target || e.currentTarget).id]
        global.__mousedowned__ = views[((e || window.event).target || e.currentTarget).id]

        // body mousedown events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mousedown && event.mousedown.map(data => (global.__mousedowned__ && (global.__mousedowned__.id === data.eventID || views[data.eventID].__element__.contains(global.__mousedowned__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener("mouseup", (e) => {

        global.__mouseuped__ = views[((e || window.event).target || e.currentTarget).id]

        // body mouseup events
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.mouseup && event.mouseup.map(data => (global.__mouseuped__ && (global.__mouseuped__.id === data.eventID || views[data.eventID].__element__.contains(global.__mouseuped__.__element__))) && eventExecuter({ ...data, e })))
    })

    // document default event listeners

    document.addEventListener('keydown', e => {

        global.__keydowned__ = views[((e || window.event).target || e.currentTarget).id]

        if (global.manifest.projectID === "brackettechnologies" && e.ctrlKey && e.key === "s") e.preventDefault()
        
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.keydown && event.keydown.map(data => (data.eventID === "document" || (global.__keydowned__ && (global.__keydowned__.id === data.eventID || views[data.eventID].__element__.contains(global.__keydowned__.__element__)))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener('keyup', e => {

        global.__keyuped__ = views[((e || window.event).target || e.currentTarget).id]
        if (!e.ctrlKey) global.ctrlKey = false
        
        Object.entries(global.__events__).map(([id, event]) => views[id] && event.keyup && event.keyup.map(data => data.eventID === "document" || (global.__keyuped__ && (global.__keyuped__.id === data.eventID || views[data.eventID].__element__.contains(global.__keyuped__.__element__))) && eventExecuter({ ...data, e })))
    })

    document.addEventListener('scroll', (e) => {

        global.__scrolled__ = views[((e || window.event).target || e.currentTarget).id]

        // close droplist
        if (views.droplist.__element__.style.pointerEvents === "auto") {

            var data = "():droplist.mouseleave()?!():droplist.mouseentered"
            lineInterpreter({ id: "body", e, data })
        }

        Object.entries(global.__events__).map(([id, event]) => views[id] && event.scroll && event.scroll.map(data => (global.__scrolled__ && (global.__scrolled__.id === data.eventID || views[data.eventID].__element__.contains(global.__scrolled__.__element__))) && eventExecuter({ ...data, e })))
    }, true)

    // window default event listeners

    window.addEventListener("focus", (e) => {

        views.root.__element__.click()
        document.activeElement.blur()

        var data = "():mininote.style():[opacity=0;transform=scale(0)]"
        lineInterpreter({ id: "window", e, data })
    })

    window.addEventListener("mousedown", (e) => {

        global.__clicked__ = views[(e || window.event).target.id]
    })

    // show icons
    window.addEventListener("load", () => {

        var icons = views.body.__html__.split("id='").slice(1).map((id) => id.split("'")[0]).filter(id => views[id] && views[id].__name__ === "Icon").map(id => views[id])

        icons.map(view => {
            if (view.__element__) {
                view.__element__.style.opacity = view.style.opacity !== undefined ? view.style.opacity : "1"
                view.__element__.style.transition = view.style.transition !== undefined ? view.style.transition : "none"
            }
        })
    })

    window.addEventListener("keydown", function (e) {
        if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
            e.preventDefault()
        }
    }, false)

    window.addEventListener('beforeinstallprompt', function (e) {

        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        console.log('👍', 'beforeinstallprompt', e);

        // Stash the event so it can be triggered later.
        window.global.__installApp__ = e
        //setTimeout(() => { console.log(window.global.__installApp__); window.global.__installApp__.prompt() }, 1000)
    })

    window.addEventListener('appinstalled', () => {
        // Log install to analytics
        console.log('INSTALL: Success')
    })
}

module.exports = { defaultAppEvents }