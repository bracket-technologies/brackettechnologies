const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { toCode } = require("./toCode")
var _window = { global: {}, views: {} }

var getdb = async ({ req, res }) => {

  var db = req.db
  var string = decodeURI(req.headers.search), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search || {}

  var collection = search.collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${req.headers["project"]}`

  if (false) {

    // developer data => force reload
    var forceReload, developerData
    await db.collection("_developer_").doc(req.headers["project"]).get().then(doc => {
      developerData = doc.data() || {}
      forceReload = developerData.forceReload
    })
    if (forceReload) {
      developerData.forceReload = false
      db.collection("_developer_").doc(req.headers["project"]).set(developerData)
      return res.send({ message: "Force reload!" })
    }
  }

  var doc = search.document || search.doc,
    docs = search.documents || search.docs,
    field = search.field || search.fields,
    limit = search.limit || 25,
    data = {}, success, message,
    ref = collection && db.collection(collection),
    promises = [], project
  
  /////////////////// verify access key ///////////////////// access key is stopped
  // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
  project = { ["accesskey"]: req.headers["accesskey"] }
  
  if (search.url) {

    var url = search.url
    delete search.url

    if (url.slice(-1) === "/") url = url.slice(0, -1)
    
    try {
      data = await require("axios").get(url, { timeout: 1000 * 10 })
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
    /*
    await Promise.all(promises)
    if (project["accesskey"] !== req.headers["accesskey"]) {

      success = false
      message = `Your are not verified!`
      return res.send({ success, message })
    }*/

    return res.send({ data, success, message })
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
    /*
    if (project["accesskey"] !== req.headers["accesskey"]) {

      success = false
      message = `Your are not verified!`
      return res.send({ success, message })
    }
    */
   
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

    await Promise.all(promises)
    if (project["accesskey"] !== req.headers["accesskey"]) {

      success = false
      message = `Your are not verified!`
      return res.send({ success, message })
    }

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
    
    await Promise.all(promises)
    if (project["accesskey"] !== req.headers["accesskey"]) {

      success = false
      message = `Your are not verified!`
      return res.send({ success, message })
    }

    return res.send({ data, success, message })
  }

  const myPromise = () => new Promise(async (resolve, rej) => {

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
    /*setTimeout(() => {
      res("foo")
    }, 10000)*/
  })

  var { data, success, message } = await myPromise()
    
  /*
  await Promise.all(promises)
  if (project["accesskey"] !== req.headers["accesskey"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }
  */
  return res.send({ data, success, message })
}

var postdb = async ({ req, res, db }) => {
  
  var data = req.body.data
  var save = req.body.save || {}

  var collection = save.collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var ref = db.collection(collection)
  var success, message

  /////////////////// verify access key ///////////////////// access key is stopped
  // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
  /*
  project = { ["accesskey"]: req.headers["accesskey"] }

  await Promise.all(promises)
  if (project["accesskey"] !== req.headers["accesskey"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }
*/

  if (Array.isArray(data)) {

    data.map(data => {

      ref.doc(data.id.toString()).set(data).then(() => {

        success = true
        message = `Document saved successfuly!`
  
      }).catch(error => {
  
        success = false
        message = error
      })
    })

  } else if (save.doc) {

    await ref.doc(save.doc.toString() || save.id.toString() || data.id.toString()).set(data).then(() => {

      success = true
      message = `Document saved successfuly!`

    }).catch(error => {

      success = false
      message = error
    })
  }

  return res.send({ data, success, message })
}

var deletedb = async ({ req, res, db, storage }) => {
  
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var erase = params.erase || {}

  var collection = erase.collection
  if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  
  var ref = db.collection(collection)
  var success, message, promises = [], project

  /////////////////// verify access key ///////////////////// access key is stopped
  // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
  project = { ["accesskey"]: req.headers["accesskey"] }
  
  await Promise.all(promises)
  if (project["accesskey"] !== req.headers["accesskey"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }

  await ref.doc(erase.doc.toString()).delete().then(() => {

    success = true,
    message = `Document erased successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  if (erase.collection === "storage") {

    var exists = await storage.bucket().file(`${collection}/${erase.doc}`).exists()
    if (exists) await storage.bucket().file(`${collection}/${erase.doc}`).delete()
  }
    
  await Promise.all(promises)
  if (project["accesskey"] !== req.headers["accesskey"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }
  
  return res.send({ success, message })
}

module.exports = {
  getdb,
  postdb,
  deletedb
}