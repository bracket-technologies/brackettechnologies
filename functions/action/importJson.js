const { clone } = require("./clone")

const getJson = (url) => {

    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", url, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

const importFile = ({ _window, id, e, __, address, ...params }) => {

    var inputEl = document.createElement('input')
    inputEl.style.position = "absolute"
    inputEl.style.top = "-1000px"
    inputEl.style.left = "-1000px"
    inputEl.type = "file"
    inputEl.accept = "application/JSON"
    document.body.appendChild(inputEl)

    /*inputEl.addEventListener("change", (event) => {

        var reader = new FileReader()
        reader.onload = (e) => {

            var data = { data: e.target.result, success: true, message: "Data imported successfully!", file: [...event.target.files][0], files: [...event.target.files] }
            if (params.data.type === "json") data.data = JSON.parse(data.data)

            require("./toAwait").toAwait({ _window, id, e, address, ...params, __, _: data })
        }

        reader.readAsText(event.target.files[0])
    })*/

    inputEl.click()
}

module.exports = { importFile, getJson }