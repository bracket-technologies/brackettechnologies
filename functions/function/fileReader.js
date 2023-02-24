const { toValue } = require("./function")

module.exports = {
    fileReader : ({ read: { file, reduce }, id, lookupActions }) => {

        var reader = new FileReader()
        reader.onload = e => toValue({ id, lookupActions, value: reduce, e })
        reader.readAsDataURL(file)
    }
}