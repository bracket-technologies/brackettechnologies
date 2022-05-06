const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { capitalize } = require("./capitalize")
const { toCode } = require("./toCode")
var _window = { global: {}, children: {} }

var getApi = async ({ req, res, db }) => {
  
  // api/collection?params?conditions
  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var string = req.headers.search, params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search || {},
    doc = search.document || search.doc,
    docs = search.documents || search.docs,
    field = search.field || search.fields,
    limit = search.limit || 25,
    data = {}, success, message,
    ref = db.collection(collection)

  if (search) search.collection = collection
  
  if (search.url) {

    var url = search.url
    delete search.url
    url += `/${toString(search)}`
    if (url.slice(-1) === "/") url = url.slice(0, -1)
    data = await axios.get(url, {
      timeout: 1000 * 10
    })
    data = data.data
    if (typeof data === "string") {
      data = `{ ${data.split("{").slice(1).join("{")}`
      data = JSON.parse(data)
    }
    success = true
    message = `File/s mounted successfuly!`

    return res.send({ data, success, message })
  }

  if (docs) {

    var _docs = [], index = 1, length = Math.floor(search.docs.length / 10) + (search.docs.length % 10 > 0 ? 1 : 0)
    while (index <= length) {
      _docs.push(search.docs.slice((index - 1) * 10, index * 10))
      index += 1
    }

    await Promise.all(
      _docs.map(async docList => {
        await ref.where("id", "in", docList).get().then(docs => {

          success = true
          docs.forEach(doc => data[doc.id] = doc.data())
          message = `Documents mounted successfuly!`

        }).catch(error => {

          success = false
          message = `An error Occured!`
        })
      })
    )

    return res.send({ data, success, message })
  }

  if (doc) {

    await ref.doc(doc.toString()).get().then(doc => {

      success = true
      data = doc.data()
      message = `Document mounted successfuly!`

    }).catch(error => {

      success = false
      message = `An error Occured!`
    })

    return res.send({ data, success, message })
  }

  if (!doc && !field) {

    if (limit) ref = ref.limit(limit)
    
    await ref.get().then(q => {
      
      q.forEach(doc => data[doc.id] = doc.data())

      success = true
      message = `Documents mounted successfuly!`

    }).catch(error => {
      
      success = false
      message = `An error Occured!`
    })

    return res.send({ data, success, message })
  }

  // search field
  if (field) Object.entries(field).map(([key, value]) => {

    var operator = Object.keys(value)[0]
    ref = ref.where(key, toFirebaseOperator(operator), value[operator])
  })

  if (search.orderBy) ref = ref.orderBy(search.orderBy)
  if (search.limit) ref = ref.limit(search.limit)
  if (search.offset) ref = ref.endAt(search.offset)
  if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)

  if (search.startAt) ref = ref.startAt(search.startAt)
  if (search.startAfter) ref = ref.startAfter(search.startAfter)

  if (search.endAt) ref = ref.endAt(search.endAt)
  if (search.endBefore) ref = ref.endBefore(search.endBefore)

  // retrieve data
  await ref.get().then(query => {

    success = true
    query.docs.forEach(doc => data[doc.id] = doc.data())
    message = `Documents mounted successfuly!`

  }).catch(error => {
    
    success = false
    message = `An error Occured!`
  })

  return res.send({ data, success, message })
}

var postApi = async ({ req, res, db }) => {
  // api/collection?params?conditions

  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var data = req.body.data
  var save = req.body.save
  var ref = db.collection(collection)
  var success, message

  await ref.doc(save.doc.toString()).set(data).then(() => {

    success = true
    message = `${capitalize(collection)} saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ data, success, message })
}

var deleteApi = async ({ req, res, db }) => {
  // api/collection?params?conditions

  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var string = req.header.erase, params = {}
  if (string) params = toParam({ _window, string, id: "" })

  var erase = params.erase
  var ref = db.collection(collection)
  var success, message

  await ref.doc(erase.doc.toString()).delete().then(async () => {

    success = true,
      message = `${capitalize(erase.doc)} erased successfuly!`

    // if (erase.type === 'file') await db.storage.child(`images/${erase.id}`).delete()

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ success, message })
}

const uploadApi = async ({ req, res, db, storage }) => {

  var collection = req.url.split("/")[2]
  if (collection !== "_user_" && collection !== "_password_" && collection !== "_project_") collection += `-${req.headers["project"]}`
  var file = req.body.file, url
  var upload = req.body.upload
  var ref = db.collection(collection)

  // file Type
  upload.type = upload.type.split("-").join("/")
  // convert base64 to buffer
  var buffer = Buffer.from(file, "base64")

  await storage.ref().child(`${collection}/${upload.doc}`).put(buffer, { contentType: upload.type })
    .then(async snapshot => {

      url = await snapshot.ref.getDownloadURL()

    }).catch(error => {

      success = false
      message = error
    })

  // post api
  var data = {
    url,
    id: upload.doc,
    name: upload.name,
    description: upload.description || "",
    type: upload.type,
    tags: upload.tags,
    title: upload.title
  }

  await ref.doc(data.id).set(data).then(() => {

    success = true
    message = `${collection} saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ data, success, message })
}

module.exports = {
  getApi,
  postApi,
  deleteApi,
  uploadApi
}