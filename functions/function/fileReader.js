const { toValue } = require("./function")

module.exports = {
    fileReader : ({ read: { file, reduce }, id }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, value: reduce, e })
        reader.readAsDataURL(file)
    }
}