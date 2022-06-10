const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { capitalize } = require("./capitalize")
const { toCode } = require("./toCode")
var _window = { global: {}, views: {} }

var getdb = async ({ req, res, db }) => {
  
  var string = decodeURI(req.headers.search), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search || {}

  var collection = search.collection
  if (collection !== "_user_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var doc = search.document || search.doc,
    docs = search.documents || search.docs,
    field = search.field || search.fields,
    limit = search.limit || 25,
    data = {}, success, message,
    ref = db.collection(collection),
    promises = [], project

  if (search) search.collection = collection
  
  /////////////////// verify access key ///////////////////// access key is stopped
  // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
  project = { ["access-key"]: req.headers["access-key"] }
  
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
    
    await Promise.all(promises)
    if (project["access-key"] !== req.headers["access-key"]) {

      success = false
      message = `Your are not verified!`
      return res.send({ success, message })
    }

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
    if (project["access-key"] !== req.headers["access-key"]) {

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
    if (project["access-key"] !== req.headers["access-key"]) {

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
    if (project["access-key"] !== req.headers["access-key"]) {

      success = false
      message = `Your are not verified!`
      return res.send({ success, message })
    }

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
    
  await Promise.all(promises)
  if (project["access-key"] !== req.headers["access-key"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }

  return res.send({ data, success, message })
}

var postdb = async ({ req, res, db }) => {
  
  var data = req.body.data
  var save = req.body.save || {}

  var collection = save.collection
  if (collection !== "_user_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`

  var ref = db.collection(collection)
  var success, message, promises = [], project

  /////////////////// verify access key ///////////////////// access key is stopped
  // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
  project = { ["access-key"]: req.headers["access-key"] }

  await Promise.all(promises)
  if (project["access-key"] !== req.headers["access-key"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }

  await ref.doc(save.doc.toString()).set(data).then(() => {

    success = true
    message = `${capitalize(collection)} saved successfuly!`

  }).catch(error => {

    success = false
    message = error
  })

  return res.send({ data, success, message })
}

var deletedb = async ({ req, res, db }) => {
  
  var string = decodeURI(req.headers.erase), params = {}
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var erase = params.erase || {}

  var collection = erase.collection
  if (collection !== "_user_" && collection !== "_project_" && collection !== "_password_") collection += `-${req.headers["project"]}`
  
  var ref = db.collection(collection)
  var success, message, promises = [], project

  /////////////////// verify access key ///////////////////// access key is stopped
  // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
  project = { ["access-key"]: req.headers["access-key"] }
  
  await Promise.all(promises)
  if (project["access-key"] !== req.headers["access-key"]) {

    success = false
    message = `Your are not verified!`
    return res.send({ success, message })
  }

  await ref.doc(erase.doc.toString()).delete().then(async () => {

    success = true,
      message = `${capitalize(erase.doc)} erased successfuly!`

    // if (erase.type === 'file') await db.storage.child(`images/${erase.id}`).delete()

  }).catch(error => {

    success = false
    message = error
  })
    
    await Promise.all(promises)
    if (project["access-key"] !== req.headers["access-key"]) {

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