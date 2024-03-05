const { toArray } = require("./toArray")
const { toAwait } = require("./kernel")

module.exports = {
    fileReader: ({ req, res, _window, lookupActions, stack, address, id, e, __, data }) => {

        // files to read
        data.data = toArray(data.data)
        if (!data.data) return console.log("No data to read!")

        // read type
        var type = data.type
        if (!type && data.url) type = "url"
        else if (!type && data.json) type = "json"
        else if (!type && data.text) type = "text"
        else if (!type && data.buffer) type = "buffer"
        else if (!type && data.binary) type = "binary"
        else if (!type) type = "url"

        // init
        global.__fileReader__ = {
            files: [],
            length: data.data.length,
            count: 0
        };

        data.data.map(file => {

            var reader = new FileReader()
            reader.onload = (e) => {

                global.__fileReader__.count++;

                global.__fileReader__.files.push({
                    type: file.type,
                    lastModified: file.lastModified,
                    name: file.name,
                    size: file.size,
                    url: e.target.result,
                    data: e.target.result
                })

                if (global.__fileReader__.count === global.__fileReader__.length) {

                    var files = global.__fileReader__.files

                    // parse JSON
                    if (type === "json") files.map(file => file.data = JSON.parse(file.data))

                    var data = { success: true, message: "File read successfully!", data: files.length === 1 ? files[0] : files }

                    toAwait({ req, res, _window, lookupActions, stack, address, id, e, __, _: data })
                }
            }

            try {

                if (type === "url" || type === "file") reader.readAsDataURL(file)
                else if (type === "text" || type === "json") reader.readAsText(file)
                else if (type === "binary") reader.readAsBinaryString(file)
                else if (type === "buffer") reader.readAsArrayBuffer(file)

            } catch (er) {
                document.getElementById("loader-container").style.display = "none"
            }
        })
    }
}