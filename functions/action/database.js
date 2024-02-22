const { toCode } = require("./toCode")
const { lineInterpreter } = require("./lineInterpreter")
const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { toFirebaseOperator } = require("./toFirebaseOperator")

var database = ({ _window, req, res, id }) => {

  if (req.method === "GET") {

    getdb({ _window, req, res, id })

  } else if (req.method === "POST") {

    postdb({ _window, req, res, id })

  } else if (req.method === "DELETE") {

    deletedb({ _window, req, res, id })
  }
}

var getdb = async ({ _window, req, res, id }) => {

  const { clearActions } = require("./render")
  var string = decodeURI(req.headers.search), data = {}
  string = toCode({ _window, string })

  if (string) data = lineInterpreter({ _window, data: { string }, id }).data
  var search = data.search || {}
  var { data, success, message, searchType } = await getData({ _window, req, res, search })

  // hide secure view
  /*if (search.collection === "view") {

    if (searchType === "byDoc" && data._secure_) {

      data.view = ""
      data.children = []
      clearActions(data.functions)

    } else if (searchType !== "byDoc") {

      Object.values(data).map(data => {
        if (data._secure_) {

          data.view = ""
          data.children = []
          clearActions(data.functions)
        }
      })
    }
  }*/

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

var postdb = async ({ _window, req, res }) => {

  var save = req.body.save || {}, timer = (new Date()).getTime()
  var { data, success, message } = await postData({ _window, req, res, save })

  console.log("SAVE", save.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

var deletedb = async ({ _window, req, res, id }) => {

  var string = decodeURI(req.headers.erase), data = {}, timer = (new Date()).getTime()
  string = toCode({ _window, string })

  if (string) data = lineInterpreter({ _window, data: { string }, id }).data
  var erase = data.erase || {}

  var { success, message } = await deleteData({ _window, req, res, erase })

  console.log("ERASE", erase.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const getData = async ({ _window, req, res, search }) => {

  var timer = (new Date()).getTime()
  var collection = search.collection
  var project = (search.headers || {}).project || _window.global.manifest.session.projectID
  var response = { success: false, message: "Something went wrong!" }

  // no collection
  if (!collection) {
    console.log("SEARCH", search.collection, (new Date()).getTime() - timer);
    return response
  }

  var doc = search.doc,
    docs = search.docs,
    field = search.field || {},
    limit = search.limit || 1000,
    data = {}, success, message

  if (_window.global.__provider__ === "firebase" || true) {
    
    if (_window.global.data.project.datastore.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${project}`

    var ref = req.db.firebaseDB.collection(collection), promises = []

    if ("url" in search) {

      if (!search.url) return ({ data: {}, success: false, message: "Missing Url!" })

      var url = search.url
      delete search.url

      if (url.slice(-1) === "/") url = url.slice(0, -1)

      try {
        data = await require("axios").get(url, { timeout: 1000 * 40 })
          .then(res => res.doesNotExist.throwAnError)
          .catch(err => err)

        data = JSON.parse(data.data)
        success = true
        message = `Document/s mounted successfuly!`

      } catch (err) {
        data = {}
        success = false
        message = `Error!`
      }

      response = { data, success, message, searchType: "byURL" }
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

      response = { data, success, message, searchType: "byDocs" }
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

      response = { data, success, message, searchType: "byDoc" }
    }

    else if (Object.keys(field).length === 0) {

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

      response = { data, success, message, searchType: "byField" }
    }

    // search by field
    else {

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

          resolve({ data, success, message, searchType: "byField" })

        } catch (error) {

          resolve({ data, success: false, message: error, searchType: "byField" })
        }
      })

      response = await myPromise()
    }

  } else if (_window.global.__provider__ === "mongoDB") {

    var collection = search.collection
    var project = _window.global.manifest.session.projectID
    var response = { success: false, message: "Something went wrong!" }

    // no collection
    if (!collection || !project) return response

    var doc = search.doc,
      docs = search.docs,
      field = search.field || {},
      limit = search.limit || 1000,
      data = {}, success, message,
      ref = req.db.mongodb.db(project).collection(collection),
      promises = []

    var db = _window.__db__.mongodb.db.db(project)
    if (!docs && !fields) {
      data = await db.collection(collection).find().limit(limit)
    }
    else if (docs) {
      data = docs.map(async doc => await db.collection(collection).findOne({ id: doc }))
      await Promise.all(data)
    }
    else {

      var searchFields = [], searchOptions = {}, ors = []
      if (fields) Object.entries(fields).map(([key, value]) => {

        if (key === "or") {
          Object.entries(value).map(([key, value]) => {
            mountSearchFields({ searchFields: ors, key, value })
          })
        } else {
          mountSearchFields({ searchFields, key, value })
        }
      })

      if (searchFields.length === 1) searchOptions = searchFields[0]
      else searchOptions = { "$and": searchFields }
      if (ors.length > 0) searchOptions["$or"] = ors

      data = await db.collection(collection).find().limit(limit).skip(search.skip || 0)
    }

    console.log("Documents mounted successfuly!", (new Date()).getTime() - global.timer)

    // select fields
    if (search.select) {
      search.select = toArray(search.select)
      var newData = []
      data.map((data, i) => {
        newData[i] = {}
        search.select.map(key => newData[i][key] = data[key])
      })
      data = newData
    }

    // populate
    if (search.populate) {
      var promises = toArray(search.populate).map(key => {

        return getData({ _window, search })
      })

      await Promise.all(promises)
    }

    if (doc) data = data[0]
    return ({ data, success: true, message: `Documents mounted successfuly!` })
  }

  console.log("SEARCH", search.collection, (new Date()).getTime() - timer);
  return response
}

const postData = async ({ _window, req, res, save }) => {

  if (_window.global.__provider__ === "firebase" || true) {

    // collection
    var doc = save.doc
    var data = save.data
    var field = save.field || {}
    var collection = save.collection
    var project = (save.headers || {}).project || _window.global.manifest.session.projectID

    // save specific fields in by doc
    if (Object.keys(field).length > 0 && doc) {
      var { data: rawData, success, message } = await getData({ _window, req, res, search: { collection, doc } })
      if (!success) return ({ success, message })
      Object.entries(field).map(([key, value]) => rawData[key] = value)
      data = rawData
    }

    if (_window.global.data.project.datastore.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`

    var ref = req.db.firebaseDB.collection(collection)
    var success = false, message = "Missing data!"

    var promises = toArray(data).map(async (data, i) => {

      data.id = data.id || (i === 0 && save.doc) || generate({ length: 60, timestamp: true })

      if (!data["creation-date"] && req.headers.timestamp) data["creation-date"] = parseInt(req.headers.timestamp)

      return await ref.doc((doc && doc.toString()) || data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`

      }).catch(error => {

        success = false
        message = error
      })
    })

    await Promise.all(promises)

    return ({ data, success, message })

  } else if (_window.global.__provider__ === "mongoDB") { }
}

const deleteData = async ({ _window, req, res, erase }) => {

  var project = (erase.headers || {}).project || _window.global.manifest.session.projectID

  if (_window.global.__provider__ === "firebase" || true) {

    var collection = erase.collection, data
    if (_window.global.data.project.datastore.collections.includes(collection)) collection = 'collection-' + collection
    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${project}`

    var success, message
    var docs = erase.docs || [erase.doc]

    var promises = docs.map(async doc => {

      await req.db.firebaseDB.collection(collection).doc(doc.toString()).delete().then(() => {

        success = true,
          message = `Document erased successfuly!`

      }).catch(error => {

        success = false
        message = error
      })

      if (erase.storage && erase.storage.doc) {

        var exists = await req.storage.firebaseStorage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).exists()
        if (exists) {

          await req.storage.firebaseStorage.bucket().file(`storage-${req.headers["project"]}/${erase.storage.doc}`).delete()

          await req.db.firebaseDB.collection(`storage-${req.headers["project"]}`).doc(erase.storage.doc.toString()).delete().then(() => {

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

  } else if (_window.global.__provider__ === "mongoDB") { }
}

module.exports = {
  database,
  getdb,
  getData,
  postdb,
  postData,
  deletedb,
  deleteData
}