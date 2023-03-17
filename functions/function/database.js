const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { toCode } = require("./toCode")
const { toArray } = require("./toArray")

var getdb = async ({ _window, req, res }) => {
  
  var string = decodeURI(req.headers.search), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search || {}
  var { data, success, message } = await getData({ _window, req, res, search })

  return res.send({ data, success, message })
}

var postdb = async ({ _window, req, res }) => {
  
  var save = req.body.save || {}
  var { data, success, message } = await postData({ _window, req, res, save })

  return res.send({ data, success, message })
}

var deletedb = async ({ _window, req, res }) => {
  
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var erase = params.erase || {}

  var { success, message } = await deleteData({ _window, req, res, erase })
  
  return res.send({ success, message })
}

const getData = async ({ _window, req, res, search }) => {

  var db = req.db
  var collection = search.collection
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${req.headers["project"]}`

  var doc = search.document || search.doc,
    docs = search.documents || search.docs,
    field = search.field || search.fields,
    limit = search.limit || 25,
    data = {}, success, message,
    ref = collection && db.collection(collection),
    promises = [], project
  
  if (search.url) {

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

  if (docs) {

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

  if (doc) {

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
    
    await Promise.all(promises)

    return ({ data, success, message })
  }

  const myPromise = () => new Promise(async (resolve) => {

    // search field
    var multiIN = false, _ref = ref
    if (field) Object.entries(field).map(([key, value]) => {

      var _value = value[Object.keys(value)[0]]
      var operator = toFirebaseOperator(Object.keys(value)[0])
      if (operator === "in" && _value.length > 10) {

        field[key][Object.keys(value)[0]] = [..._value.slice(10)]
        _value = [..._value.slice(0, 10)]
        multiIN = true
      }
      _ref = _ref.where(key, operator, _value)
    })
    
    if (search.orderBy) _ref = _ref.orderBy(search.orderBy)
    if (search.limit || 100) _ref = _ref.limit(search.limit || 100)
    if (search.offset) _ref = _ref.endAt(search.offset)
    if (search.limitToLast) _ref = _ref.limitToLast(search.limitToLast)

    if (search.startAt) _ref = _ref.startAt(search.startAt)
    if (search.startAfter) _ref = _ref.startAfter(search.startAfter)

    if (search.endAt) _ref = _ref.endAt(search.endAt)
    if (search.endBefore) _ref = _ref.endBefore(search.endBefore)

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
  })

  var { data, success, message } = await myPromise()
  return ({ data, success, message })
}

const postData = async ({ _window, req, res, save }) => {

  // collection
  var db = req.db
  var data = req.body.data
  var collection = save.collection, schema
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var ref = db.collection(collection)
  var success, message

  // get schema
  if (save.schematize) {

    await db.collection(`schema-${project}`).doc(save.collection).get().then(doc => {

      success = true
      schema = doc.data()

    }).catch(error => {

      success = false
      message = error
    })

    if (!schema) return
    else schema = schema.schema
    if (Array.isArray(data)) data = data.map(data => schematize({ data, schema }))
    data = schematize({ data, schema })
  }
  
  if (Array.isArray(data)) {

    var idList = toArray(save.idList)
    if (save.idList) {

      var batch = db.batch()
      data.map((data, i) => {

        if (idList[i]) {

          if (!data["creation-date"]) {
            if (req.headers.timestamp) {

              data["creation-date"] = parseInt(req.headers.timestamp)

            } else {

              data["creation-date"] = (new Date()).getTime()
              data.timezone = "GMT"
            }
          }

          batch.set(db.collection(collection).document(idList[i].toString()), data)

          // Commit the batch
          batch.commit().then(() => {

            success = true
            message = `Document saved successfuly!`

          }).catch(error => {
      
            success = false
            message = error
          })
        }
      })
    }

  } else if (save.doc) {

    if (!data.id && !save.doc && !save.id) data.id = generate({ length: 20 })
    if (!data["creation-date"]) {
      if (req.headers.timestamp) {

        data["creation-date"] = parseInt(req.headers.timestamp)

      } else {

        data["creation-date"] = (new Date()).getTime()
        data.timezone = "GMT"
      }
    }

    await ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

      success = true
      message = `Document saved successfuly!`

    }).catch(error => {

      success = false
      message = error
    })
  }

  return ({ data, success, message })
}

const deleteData = async ({ _window, req, res, erase }) => {

  var db = req.db, docs
  var storage = req.storage
  var collection = erase.collection
  if (((_window.global.data.project.datastore || {}).collections || []).includes(collection)) collection = 'collection-' + collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  
  var ref = db.collection(collection)
  var success, message

  if (erase.collection === "storage" && erase.field) {

    var field = erase.field
    const myPromise = () => new Promise(async (resolve, rej) => {

      // search field
      var multiIN = false, _ref = ref
      if (field) Object.entries(field).map(([key, value]) => {
  
        if (typeof value !== "object") value = { equal: value }
        var _value = value[Object.keys(value)[0]]
        var operator = toFirebaseOperator(Object.keys(value)[0])
        if (operator === "in" && _value.length > 10) {
  
          field[key][Object.keys(value)[0]] = [..._value.slice(10)]
          _value = [..._value.slice(0, 10)]
          multiIN = true
        }
        _ref = _ref.where(key, operator, _value)
      })
      
      if (search.orderBy) _ref = _ref.orderBy(search.orderBy)
      if (search.limit || 100) _ref = _ref.limit(search.limit || 100)
      if (search.offset) _ref = _ref.endAt(search.offset)
      if (search.limitToLast) _ref = _ref.limitToLast(search.limitToLast)
  
      if (search.startAt) _ref = _ref.startAt(search.startAt)
      if (search.startAfter) _ref = _ref.startAfter(search.startAfter)
  
      if (search.endAt) _ref = _ref.endAt(search.endAt)
      if (search.endBefore) _ref = _ref.endBefore(search.endBefore)
  
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
    })
  
    var { data, success, message } = await myPromise()
    docs = Object.keys(data)
  }

  docs = erase.docs
  await docs.map(async doc => {
    
    await ref.doc(doc.toString()).delete().then(() => {

      success = true,
      message = `Document erased successfuly!`

    }).catch(error => {

      success = false
      message = error
    })

    if (erase.collection === "storage") {

      var exists = await storage.bucket().file(`${collection}/${doc}`).exists()
      if (exists) await storage.bucket().file(`${collection}/${doc}`).delete()
    }
  })
  
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