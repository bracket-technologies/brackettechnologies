const schematize = ({ data, schema }) => {
  var _data = {}
  schema.map(schema => {
    if (data[schema.path] !== undefined) {
      
      if (schema.type === "any" || typeof data[schema.path] === schema.type) _data[schema.path] = data[schema.path]
      else if (schema.type === "number" || typeof data[schema.path] === "number") _data[schema.path] = data[schema.path]
      else if (schema.type === "string" || typeof data[schema.path] === "string") _data[schema.path] = data[schema.path]
      else if (schema.type === "boolean" || typeof data[schema.path] === "boolean") _data[schema.path] = data[schema.path]
      else if (Array.isArray(schema.type) || typeof data[schema.path] === "object") {
        if (schema.isArray && Array.isArray(data[schema.path])) _data[schema.path] = data[schema.path].map(data => schematize({ data, schema: schema.type }))
        else if (!Array.isArray(data[schema.path])) _data[schema.path] = schematize({ data, schema: schema.type })
      }
    }
  })
  return _data
}

module.exports = { schematize }