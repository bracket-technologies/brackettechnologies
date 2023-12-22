const { toAwait } = require("./toAwait")

const getJson = (url) => {

    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", url, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

const importJson = ({ _window, id, e, __, ...params }) => {
    
    var global = _window ? _window.global : window.global
    global.import = {}
    var inputEl = document.createElement('input')
    inputEl.style.position = "absolute"
    inputEl.style.top = "-1000px"
    inputEl.style.left = "-1000px"
    inputEl.type = "file"
    inputEl.accept = "application/JSON"
    document.body.appendChild(inputEl)
    setTimeout(() => {

        inputEl.addEventListener("change", (event) => {
            
            var reader = new FileReader()
            reader.onload = (e) => {
                
                global.import.data = JSON.parse(e.target.result)
                toAwait({ _window, id, e, ...params, __: [global.import, ...__] })
            }

            global.import.files = [...event.target.files]
            global.import.file = global.import.files[0]
            
            reader.readAsText(event.target.files[0])
        })

        inputEl.click()
    }, 200)
}

module.exports = {importJson, getJson}