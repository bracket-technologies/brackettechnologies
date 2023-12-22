const { toValue } = require("./action")

module.exports = {
    fileReader : ({ read: { file, reduce }, id, lookupActions }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, lookupActions, stack, data: reduce, e })
        reader.readAsDataURL(file)
    }
}