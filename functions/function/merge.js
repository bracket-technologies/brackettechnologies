const { toArray } = require("./toArray")
const { clone } = require("./clone")

const merge = (objects) => {

  objects = clone(objects)
  if (typeof objects !== "object") return objects

  var merged = toArray(objects[0]).flat()

  objects.shift()

  objects.map((obj) => {
    merged.push(...toArray(obj).flat())

    if (!Array.isArray(obj) && typeof obj === "object") {
      Object.entries(obj).map(([key, value]) => {

        if (merged[key]) {

          if (typeof value === "string" || typeof value === "number") {

            merged[key] = toArray(merged[key])
            merged[key].push(value)

          } else if (Array.isArray(value)) {

            merged[key].push(...value)

          } else if (typeof value === "object") {

            merged[key] = merge([value, merged[key]])

          }

        } else merged[key] = value
      })
    }
  })

  return merged
}

const override = (obj1, obj2) => {
  obj1 = obj1 || {}

  Object.entries(obj2).map(([key, value]) => {

    if (obj1[key]) {
      if (!Array.isArray(value) && typeof value === "object") {

        obj1[key] = override(obj1[key], value)

      } else obj1[key] = value

    } else obj1[key] = value

  })

  return obj1
}

module.exports = { merge, override }
