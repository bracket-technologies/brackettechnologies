const { toFirebaseOperator } = require("./toFirebaseOperator")
const { toCode } = require("./toCode")
const { toArray } = require("./toArray")
const { lineInterpreter } = require("./lineInterpreter")
const { generate } = require("./generate")

var getdb = async ({ _window, req, res, id }) => {

  var string = decodeURI(req.headers.search), data = {}, timer = (new Date()).getTime()
  string = toCode({ _window, string })

  if (string) data = lineInterpreter({ _window, data: { string }, id }).data
  var search = data.search || {}
  var { data, success, message } = await getData({ _window, req, res, search })

  console.log("SEARCH", search.collection, (new Date()).getTime() - timer);
  return res.send({ data, success, message })
}

var postdb = async ({ _window, req, res }) => {

  var save = req.body.save || {}, timer = (new Date()).getTime()
  var { data, success, message } = await postData({ _window, req, res, save })

  console.log("SAVE", save.collection, (new Date()).getTime() - timer);
  return res.send({ data, success, message })
}

var deletedb = async ({ _window, req, res, id }) => {

  var string = decodeURI(req.headers.erase), data = {}, timer = (new Date()).getTime()
  string = toCode({ _window, string })

  if (string) data = lineInterpreter({ _window, data: { string }, id }).data
  var erase = data.erase || {}

  var { success, message } = await deleteData({ _window, req, res, erase })

  console.log("ERASE", erase.collection, (new Date()).getTime() - timer);
  return res.send({ success, message })
}

const getData = async ({ _window, req, res, search }) => {

  var db = req.db
  var collection = search.collection
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${req.headers.project}`

  var doc = search.doc,
    docs = search.docs,
    field = search.field,
    limit = search.limit || 1000,
    data = {}, success, message,
    ref = collection && db.collection(collection),
    promises = []
    
  if ("url" in search) {

    if (!search.url) return ({ data: {}, success: false, message: "Missing Url!" })

    var url = search.url
    delete search.url

    if (url.slice(-1) === "/") url = url.slice(0, -1)

    try {
      data = await require("axios").get(url, { timeout: 1000 * 40 })
        .then(res => res.doesNotExist.throwAnError)
        .catch(err => err)

      data = data.data
      if (typeof data === "string") {
        data = `{ ${data.split("{").slice(1).join("{")}`
        data = JSON.parse(data)
      }
      success = true
      message = `Document/s mounted successfuly!`

    } catch (err) {
      data = {}
      success = false
      message = `Error!`
    }

    return ({ data, success, message })
  }

  else if ("docs" in search) {

    if (!docs) return ({ data: {}, success: false, message: "Missing Docs!" })

    var _docs = [], index = 1, length = Math.floor(search.docs.length / 10) + (search.docs.length % 10 > 0 ? 1 : 0), promises = []
    while (index <= length) {
      _docs.push(search.docs.slice((index - 1) * 10, index * 10))
      index += 1
    }

    _docs.map(docList => {
      promises.push(ref.where("id", "in", docList).get().then(docs => {

        success = true
        docs.forEach(doc => data[doc.id] = doc.data())
        message = `Documents mounted successfuly!`

      }).catch(error => {

        success = false
        message = `An error Occured!`

      }))
    })

    await Promise.all(promises)

    return ({ data, success, message })
  }

  else if ("doc" in search) {

    if (!doc) return ({ data: {}, success: false, message: "Missing Doc!" })

    await ref.doc(doc.toString()).get().then(doc => {

      success = true
      data = doc.data()
      message = `Document mounted successfuly!`

    }).catch(error => {

      success = false
      message = `An error Occured!`
    })

    await Promise.all(promises)

    return ({ data, success, message })
  }

  else if (!("field" in search)) {

    if (search.orderBy || search.skip) ref = ref.orderBy(...toArray(search.orderBy || "id"))
    if (search.skip) ref = ref.offset(search.skip)
    if (search.orderBy) ref = ref.orderBy(search.orderBy)
    if (search.offset) ref = ref.endAt(search.offset)
    if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)

    if (search.startAt) ref = ref.startAt(search.startAt)
    if (search.startAfter) ref = ref.startAfter(search.startAfter)

    if (search.endAt) ref = ref.endAt(search.endAt)
    if (search.endBefore) ref = ref.endBefore(search.endBefore)
    if (limit) ref = ref.limit(limit)

    await ref.get().then(q => {

      q.forEach(doc => data[doc.id] = doc.data())

      success = true
      message = `Documents mounted successfuly!`

    }).catch(error => {

      success = false
      message = `An error Occured!`
    })

    await Promise.all(promises)

    return ({ data, success, message })
  }

  if (Object.values(field).length === 0) return ({ data: {}, success: false, message: "Missing Field!" })

  const myPromise = () => new Promise(async (resolve) => {
    try {
      // search field
      var multiIN = false, _ref = ref
      if (field) Object.entries(field).map(([key, value]) => {

        if (typeof value !== "object") value = { equal: value }
        var operator = toFirebaseOperator(Object.keys(value)[0])
        var _value = value[Object.keys(value)[0]]
        if (operator === "in" && _value.length > 10) {

          field[key][Object.keys(value)[0]] = [..._value.slice(10)]
          _value = [..._value.slice(0, 10)]
          multiIN = true
        }

        _ref = _ref.where(key, operator, _value)
      })

      if (search.orderBy || search.skip) _ref = _ref.orderBy(...toArray(search.orderBy || "id"))
      if (search.skip) _ref = _ref.offset(search.skip)
      if (search.limitToLast) _ref = _ref.limitToLast(search.limitToLast)

      if (search.startAt) _ref = _ref.startAt(search.startAt)
      if (search.startAfter) _ref = _ref.startAfter(search.startAfter)

      if (search.endAt) _ref = _ref.endAt(search.endAt)
      if (search.endBefore) _ref = _ref.endBefore(search.endBefore)
      if (limit || 100) _ref = _ref.limit(limit || 100)

      // retrieve data
      await _ref.get().then(query => {

        success = true
        query.docs.forEach(doc => data[doc.id] = doc.data())
        message = `Documents mounted successfuly!`

      }).catch(error => {

        success = false
        message = error
      })

      if (multiIN) {

        var { data: _data } = await myPromise()
        data = { ...data, ..._data }
      }

      resolve({ data, success, message })

    } catch (error) {

      resolve({ data, success: false, message: error })
    }
  })

  var { data, success, message } = await myPromise()
  return ({ data, success, message })
}

const postData = async ({ _window, req, res, save }) => {

  // collection
  var db = req.db
  var data = save.data
  var collection = save.collection
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var ref = db.collection(collection)
  var success = false, message = "Missing data!"

  var promises = toArray(data).map(async (data, i) => {

    data.id = data.id || (i === 0 && save.doc) || generate({ length: 60, timestamp: true })

    if (!data["creation-date"] && req.headers.timestamp) data["creation-date"] = parseInt(req.headers.timestamp)

    return await ref.doc(data.id.toString()).set(data).then(() => {

      success = true
      message = `Document saved successfuly!`

    }).catch(error => {

      success = false
      message = error
    })
  })
  //}

  await Promise.all(promises)

  return ({ data, success, message })
}

const deleteData = async ({ _window, req, res, erase }) => {

  var db = req.db, docs
  var storage = req.storage
  var collection = erase.collection, data
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var ref = db.collection(collection)
  var success, message

  docs = erase.docs || [erase.doc]
  var promises = docs.map(async doc => {

    await ref.doc(doc.toString()).delete().then(() => {

      success = true,
        message = `Document erased successfuly!`

    }).catch(error => {

      success = false
      message = error
    })

    if (erase.storage && erase.storage.doc) {

      var exists = await storage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).exists()
      if (exists) {

        await storage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).delete()

        await db.collection(`storage-${req.headers["project"]}`).doc(erase.storage.doc.toString()).delete().then(() => {

          success = true,
            message = `Document erased successfuly!`

        }).catch(error => {

          success = false
          message = error
        })
      }
    }
  })

  Promise.all(promises)
  return ({ data, success, message })
}

module.exports = {
  getdb,
  getData,
  postdb,
  postData,
  deletedb,
  deleteData
}