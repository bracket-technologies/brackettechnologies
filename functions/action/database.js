const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { clone } = require("./clone")
const { toOperator } = require("./toOperator")
const fs = require("fs")

// config
require('dotenv').config()

// project DB
var bracketDB = process.env.BRACKETDB

const database = ({ _window, req, res }) => {

  if (req.body.type === "search") {

    getdb({ _window, req, res })

  } else if (req.body.type === "save") {

    postdb({ _window, req, res })

  } else if (req.body.type === "erase") {

    deletedb({ _window, req, res })
  }
}

const getdb = async ({ _window, req, res }) => {

  var search = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!search.collection && !search.collections) {
    console.log("SEARCH", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { data, success, message } = await getData({ _window, req, res, search })

  console.log("SEARCH", search.collection || search.db, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const postdb = async ({ _window, req, res }) => {

  var save = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!save.collection) {
    console.log("SAVE", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { data, success, message } = await postData({ _window, req, res, save })

  console.log("SAVE", save.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const deletedb = async ({ _window, req, res }) => {

  var erase = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!erase.collection) {
    console.log("ERASE", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { success, message } = await deleteData({ _window, req, res, erase })

  console.log("ERASE", erase.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success, message }))
  res.end()
}

const getData = async ({ _window, req, res, search }) => {

  var global = _window.global
  var datastore = search.datastore || global.manifest.datastore
  var project = (search.headers || {}).project || search.db || global.manifest.session.db
  var response = { success: false, message: "Something went wrong!" }

  var db = search.db || global.manifest.session.db,
    collection = search.collection,
    doc = search.doc,
    docs = search.docs,
    populate = search.populate,
    select = search.select,
    deselect = search.deselect,
    assign = search.assign,
    find = search.find || search.field || {},
    findOne = search.findOne,
    limit = search.limit || 1000,
    skip = search.skip || 0,
    data = {}, success, message


  if ("url" in search) {

    try {

      data = await require("axios").get(search.url, { timeout: 1000 * 40 }).catch(err => err)

      data = data.data
      success = true
      message = `Search done successfuly!`

    } catch (err) {

      data = {}
      success = false
      message = err
    }

    response = { data, success, message }

  } else if (datastore === "bracketDB") {

    if (search.collections) return ({ success: true, message: "Names queried successfully!", data: getCollectionNames(`bracketDB/${db}`) })

    var path = `bracketDB/${db}`
    if (!fs.existsSync(path)) return ({ data, message: "No database!", success: false })

    if (collection) {
      path += `/${collection}`
      if (!fs.existsSync(path)) return ({ data, message: "No collection!", success: false })
    }

    if ("docs" in search) {

      toArray(docs).map(doc => {
        if (fs.existsSync(`${path}/${doc}.json`)) data[doc] = JSON.parse(fs.readFileSync(`${path}/${doc}.json`))
      })
    }

    else if ("doc" in search) {

      if (!fs.existsSync(`${path}/${doc}.json`)) return data
      data = JSON.parse(fs.readFileSync(`${path}/${doc}.json`))
    }

    else if (Object.keys(find).length === 0) {

      if (!collection) {

        getCollectionNames(path).map(collection => {

          var pathi = path + "/" + collection
          var docs = fs.readdirSync(pathi)
          data[collection] = {}

          for (let i = skip; (i < limit) && (i <= docs.length - 1); i++) {

            var doc = docs[i]
            var query = JSON.parse(fs.readFileSync(`${pathi}/${doc}`))
            doc = doc.split(".json")[0]
            data[collection][doc] = query
          }
        })

      } else {

        var docs = fs.readdirSync(path)

        for (let i = skip; (i < limit) && (i <= docs.length - 1); i++) {

          var doc = docs[i]
          var query = JSON.parse(fs.readFileSync(`${path}/${doc}`))
          doc = doc.split(".json")[0]
          data[doc] = query
        }
      }
    }

    // find
    else {

      var docs = fs.readdirSync(path)
      var i = 0

      toArray(find).map(find => {
        while (skip >= 0 && limit > 0 && (i <= docs.length - 1)) {

          var doc = docs[i]
          var query = JSON.parse(fs.readFileSync(`${path}/${doc}`))

          doc = doc.split(".json")[0]
          var push = true

          Object.keys(find).map(key => {
            if (!push) return

            // equal without equal
            if (typeof find[key] !== "object") find[key] = { equal: find[key] }

            Object.entries(find[key]).map(([operator, value]) => {

              if (!(key in query) || !push) return
              operator = toOperator(operator)

              if (operator === "==") {
                if (query[key] === value) push = true
                else push = false
              } else if (operator === "!=") {
                if (query[key] !== value) push = true
                else push = false
              } else if (operator === ">=") {
                if (query[key] >= value) push = true
                else push = false
              } else if (operator === "<=") {
                if (query[key] <= value) push = true
                else push = false
              } else if (operator === "<") {
                if (query[key] < value) push = true
                else push = false
              } else if (operator === ">") {
                if (query[key] > value) push = true
                else push = false
              } else if (operator === "inc") {
                if (query[key].includes(value)) push = true
                else push = false
              } else if (operator === "in") {
                if (value.includes(query[key])) push = true
                else push = false
              }
            })
          })

          if (push) {
            if (skip) skip--;
            else {
              limit--;
              data[doc] = query
            }
          }

          i++;
        }
      })
    }

    response = { data, message: "Data queried successfully!", success: true }

  } else if (datastore === "firebase") {

    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && !search.url) {
      collection = 'collection-' + collection
      collection += `-${project}`
    }

    var ref = req.datastore.firebaseDB.collection(collection), promises = []

    if ("docs" in search) {

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

      response = { data, success, message }
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

      response = { data, success, message }
    }

    else if (Object.keys(find).length === 0) {

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

      response = { data, success, message }
    }

    // search by field
    else {

      const myPromise = () => new Promise(async (resolve) => {
        try {
          // search find
          var multiIN = false, _ref = ref
          if (find) Object.entries(find).map(([key, value]) => {

            if (typeof value !== "object") value = { equal: value }
            var operator = toFirebaseOperator(Object.keys(value)[0])
            var _value = value[Object.keys(value)[0]]
            if (operator === "in" && _value.length > 10) {

              find[key][Object.keys(value)[0]] = [..._value.slice(10)]
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

      response = await myPromise()
    }

  } else if (datastore === "mongoDB") {

    if (search.collections) {

      var collections = await req.datastore.mongoDB.db(db).listCollections().toArray()
      return ({ success: true, message: "Names queried successfully!", data: collections.map(data => data.name) })
    }

    var ref = req.datastore.mongoDB.db(db).collection(collection)

    // docs
    if (docs) data = await ref.find({ "__props__.doc": { $in: docs } }).limit(limit).skip(skip).toArray();

    // doc
    else if (doc) data = await ref.findOne({ "__props__.doc": doc })

    // collection
    else if (!find && !findOne) data = await ref.find().limit(limit).skip(skip).toArray();

    // find
    else data = await ref.find(mongoOptions({ find })).limit(limit).skip(skip).toArray();

    // return data as map
    if (!doc && data[0]) {
      var mapData = {}
      data.map(data => {
        mapData[data.__props__.doc] = data
      })
      data = mapData
    }

    response = { data, message: "Data queried successfully!", success: true }
  }

  // ex: search():[collection=product;docs;populate=:[collection;key;field]] (key is keyname in data, field is the fields to return)
  if ((populate || select || deselect || assign) && success) {

    var data = response.data

    // restructure
    if (doc) data = { [doc]: data }

    if (populate) await populator({ _window, req, res, db, data, populate, search })
    if (select) data = selector({ data, select })
    else if (deselect) data = deselector({ data, deselect })
    else if (assign) data = assigner({ data, assign })

    // restructure
    if (doc) data = data[doc]
    response.data = data
  }

  return response
}

const postData = async ({ _window, req, res, save }) => {

  var global = _window.global
  var collection = save.collection
  var datastore = save.datastore || global.manifest.datastore
  var project = (save.headers || {}).project || save.db || global.manifest.session.db

  // collection
  var db = save.db || global.manifest.session.db
  var doc = save.doc
  var data = save.data
  var update = save.update || {}
  var success = false, message = "Missing data!"

  // update specific fields. ex: update:[name=Goerge;age=28] (it ignores appended data)
  if (Object.keys(update).length > 0 && doc) {

    var { data: rawData, success, message } = await getData({ _window, req, res, search: { collection, doc } })
    if (!success) return ({ success, message })
    Object.entries(update).map(([key, value]) => rawData[key] = value)
    data = rawData
  }

  if (datastore === "bracketDB") {

    // db
    var path = `bracketDB/${db}`, counter
    if (!fs.existsSync(path)) fs.mkdirSync(path)

    // collection
    path += `/${collection}`
    if (!fs.existsSync(path)) fs.mkdirSync(path)

    // get counter
    if (collection !== "settings") {
      var { data: counter } = await getData({ _window, req, res, search: { db: bracketDB, collection: "settings", find: { db } } })
      counter = Object.values(counter)[0]
    }

    toArray(data).map(data => {

      if (!data.__props__) {

        if (!counter.collections[collection]) counter.collections[collection] = 0
        counter.collections[collection]++;

        data.__props__ = {

          id: generate({ unique: true }),
          doc: doc || (collection + counter.collections[collection]),
          creationDate: (new Date()).getTime(),
          active: true,
          createdByUserID: global.manifest.session.userID,
          counter: counter.collections[collection]
        }

        doc = data.__props__.doc

        // set counter
        collection !== "settings" && postData({ _window, req, save: { db: bracketDB, collection: "settings", doc: counter.__props__.doc, data: counter } })

      } else if (doc) data.__props__.doc = doc
      else doc = data.__props__.doc

      fs.writeFileSync(`${path}/${doc}.json`, JSON.stringify(data, null, 2))
    })

    return { success: true, message: "Data saved successfully!", data }

  } else if (datastore === "firebase") {

    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") {
      collection = 'collection-' + collection
      collection += `-${project}`
    }

    var ref = req.datastore.firebaseDB.collection(collection)

    var promises = toArray(data).map(async (data, i) => {

      data.id = data.id || (i === 0 && save.doc) || generate({ length: 60, timestamp: true })

      if (!data["creationDate"] && req.headers.timestamp) data["creationDate"] = parseInt(req.headers.timestamp)

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

  } else if (datastore === "mongoDB") {

    var ref = req.datastore.mongoDB.db(db).collection(collection)

    // get counter
    if (collection !== "settings") {
      var { data: counter } = await getData({ _window, req, res, search: { db: bracketDB, collection: "settings", find: { db } } })
      counter = Object.values(counter)[0]
    }

    promises = toArray(data).map(async data => {

      if (!data.__props__) {

        if (!counter.collections[collection]) counter.collections[collection] = 0
        counter.collections[collection]++;

        data.__props__ = {

          id: generate({ unique: true }),
          doc: doc || (collection + counter.collections[collection]),
          creationDate: (new Date()).getTime(),
          active: true,
          createdByUserID: global.manifest.session.userID,
          counter: counter.collections[collection]
        }

        doc = data.__props__.doc

        // set counter
        collection !== "settings" && postData({ _window, req, save: { db: bracketDB, collection: "settings", doc: counter.__props__.doc, data: counter } })

        return await ref.insertOne(data)

      } else if (doc) data.__props__.doc = doc
      else doc = data.__props__.doc

      var set = {}
      Object.entries(data).map(([key, value]) => { if (key !== "_id") set[key] = value })

      return await ref.updateOne({ "__props__.id": data.__props__.id }, { $set: set }, { upsert: true })
    })

    await Promise.all(promises)

    return { success: true, message: "Data saved successfully!", data }
  }
}

const deleteData = async ({ _window, req, res, erase }) => {

  var global = _window.global
  var collection = erase.collection,
    datastore = erase.datastore || _window.global.manifest.datastore,
    project = (erase.headers || {}).project,
    db = erase.db || global.manifest.session.db,
    success, message,
    docs = toArray(erase.docs || erase.doc),
    find = erase.find

  if (datastore === "bracketDB") {

    // db
    var path = `bracketDB/${db}`
    if (!fs.existsSync(path)) return { success: false }

    // collection
    if (collection) path += `/${collection}`
    if (!fs.existsSync(path)) return { success: false }

    // create folder if it doesnot exist
    if (docs.length === 0) fs.rmSync(`${path}`, { recursive: true, force: true })
    else docs.map(doc => doc && fs.unlinkSync(`${path}/${doc}.json`))

  } else if (datastore === "firebase") {

    if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_") {
      collection = 'collection-' + collection
      collection += `-${project}`
    }

    var promises = docs.map(async doc => {

      await req.datastore.firebaseDB.collection(collection).doc(doc.toString()).delete().then(() => {

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

          await req.datastore.firebaseDB.collection(`storage-${req.headers["project"]}`).doc(erase.storage.doc.toString()).delete().then(() => {

            success = true,
              message = `Document erased successfuly!`

          }).catch(error => {

            success = false
            message = error
          })
        }
      }
    })

    await Promise.all(promises)

  } else if (datastore === "mongoDB") {

    var ref = req.datastore.mongoDB.db(project).collection(collection)

    // erase by docs
    if (docs.length > 0) {
      var promises = docs.map(async doc => await ref.deleteOne({ "__props__.id": doc }))
      await Promise.all(promises)
    }

    // erase by options
    else if (find) {
      await ref.delete(mongoOptions({ find }))
    }
  }

  return ({ success, message })
}

const populator = async ({ _window, req, res, data, db, populate, search }) => {

  var populatedData = {}
  var populates = toArray(populate)

  // get data by IDs
  var responses = populates.map(async (populate, i) => {

    if (typeof populate === "string") populates[i] = populate = { db, collection: populate, field: populate, find: "id", deselect: [] }
    if (!populate.collection) populate.collection = populate.field
    if (!populate.find) populate.find = "id"

    // get values from queried data
    var IDSet = new Set()
    Object.values(data).map(data => IDSet.add(data[populate.field]))

    // add find conditions
    if (populate.find === "doc") {
      populate.docs = Array.from(IDSet)
      delete populate.find
    } else populate.find = { [populate.find]: { in: Array.from(IDSet) } }

    var response = await getData({ _window, req, res, search: populate })
    populatedData = { ...populatedData, ...response.data }
    return response
  })

  await Promise.all(responses)

  // populate
  populates.map(populate => {

    // assign a value to key. ex: name instead of ID
    if (populate.assign) {
      Object.values(data).map(data => {
        if (populatedData[data[populate.find]]) data[populate.find] = populatedData[data[populate.find]][populate.assign]
      })
    }

    // select. return the doc with specific find. (considering data and populatedData are many docs)
    else if (populate.select) data = selector({ data, key: populate.find, select: populate.select, populatedData })

    // select. return the doc with specific find. (considering data and populatedData are many docs)
    else if (populate.deselect) data = deselector({ data, key: populate.find, deselect: populate.deselect, populatedData })
  })

  return data
}

const selector = ({ data, key, select, populatedData }) => {

  // select with populate
  if (key && populatedData) {

    Object.values(data).map(data => {
      var doc = data[key]
      if (populatedData[doc]) {
        data[key] = {}
        toArray(select).map(select => data[key][select] = populatedData[doc][select])
      }
    })

    // select
  } else {

    var clonedData = clone(data)
    data = {}
    Object.keys(clonedData).map(doc => {
      data[doc] = {}
      toArray(select).map(select => data[doc][select] = clonedData[doc][select])
    })
  }

  return data
}

const deselector = ({ data, key, deselect, populatedData }) => {

  // deselect with populate
  if (key && populatedData) {

    Object.values(data).map(data => {
      var doc = data[key]
      if (populatedData[doc]) {
        data[key] = populatedData[data[key]]
        toArray(deselect).map(deselect => delete data[key][deselect])
      }
    })

    // deselect
  } else {

    Object.keys(data).map(doc => {
      toArray(deselect).map(deselect => delete data[doc][deselect])
    })
  }

  return data
}

const assigner = ({ data, assign }) => {
  Object.keys(data).map(doc => data[doc] = data[doc][assign])
}

const mongoOptions = ({ find }) => {

  var options = {}

  if (Array.isArray(find)) {

    // init
    options = { $or: [] }

    find.map(find => options["$or"].push(mongoOptions({ find })))

  } else {

    Object.entries(find).map(([key, valueAndOperator]) => {

      if (typeof valueAndOperator !== "object") valueAndOperator = { equal: valueAndOperator }

      var operator = toOperator(Object.keys(valueAndOperator)[0])
      var value = Object.values(valueAndOperator)[0]

      options[key] = options[key] || {}

      if (operator === "==") options[key]["$eq"] = value
      else if (operator === "!=") options[key]["$ne"] = value
      else if (operator === ">") options[key]["$gt"] = value
      else if (operator === "<") options[key]["$lt"] = value
      else if (operator === ">=") options[key]["$gte"] = value
      else if (operator === "<=") options[key]["$lte"] = value
      else if (operator === "in" && Array.isArray(value)) options[key]["$in"] = value
      else if (operator === "notin" && Array.isArray(value)) options[key]["$nin"] = value
      else if (operator === "regex") options[key]["$regex"] = value
      else if (operator === "inc") options[key] = value
      else if (operator === "incall") options[key]["$all"] = value
      else if (operator === "length") options[key]["$size"] = value
      else if (operator === "find") options[key] = { $elemMatch: mongoOptions({ find: value }) }
    })
  }

  return options
}

const getSession = async ({ _window, req }) => {

  var global = _window.global, session, response

  // get session by sessionID
  if (global.manifest.cookies.__session__) {

    // get session
    response = await getData({ _window, req, search: { db: bracketDB, collection: "session", find: { "__props__.id": global.manifest.cookies.__session__, domain: global.manifest.host } } })
    session = Object.values(response.data)[0]

    // session expired
    if (!session || session.expiryDate < new Date().getTime()) {

      // create session
      response = await createSession({ _window, req, session })
    }

    // extend session
    else {

      session.expiryDate = new Date().getTime() + 86400000
      response = await postData({ _window, req, save: { db: bracketDB, collection: "session", data: session } })
    }

    return response
  }

  // create session
  else return await createSession({ _window, req })
}

const createSession = async ({ _window, req, res, session = {} }) => {

  var global = _window.global, expiredSessionExists = session.accountID
  var promises = [], account, project, counter, subscriptions = [], plugins = []

  // project
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "project", find: { domains: { inc: global.manifest.host } } } }).then(({ data }) => { project = Object.values(data || {})[0] }))
  await Promise.all(promises)

  if (!project) return { message: "Project does not exist!", success: false }

  // clear promises
  var promises = []

  // account
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "account", find: { "__props__.id": { equal: project.accountID } } } }).then(({ data }) => { account = Object.values(data || {})[0] }))

  // counter
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "settings", find: { db: project.db } } }).then(({ data }) => { counter = Object.values(data || {})[0] }))

  // subscriptions
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "subscription", find: { expiryDate: { greater: new Date().getTime() } } } }).then(({ data }) => { subscriptions = Object.values(data || {}) }))
  await Promise.all(promises)

  // clear promises
  var promises = []

  // plugins
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "plugin", find: { "__props__.id": { in: subscriptions.map(subs => subs.pluginID) } } } }).then(({ data }) => { plugins = Object.values(data || {}) }))
  await Promise.all(promises)

  // restructure subscriptions
  subscriptions = subscriptions.map(subs => {
    var plugin = plugins.find(plugin => plugin.__props__.id === subs.pluginID)
    return {
      subscriptionID: subs.__props__.id,
      pluginID: subs.pluginID,
      expiryDate: subs.expiryDate,
      plugins: plugin.plugins
    }
  })

  // counter++
  !expiredSessionExists && counter.collections.session++;

  // erase expired session
  expiredSessionExists && deleteData({ _window, req, res, erase: { db: bracketDB, collection: "session", doc: session.__props__.doc } })

  // session
  session = {

    accountID: session.accountID || account.__props__.id,
    accountName: session.accountName || account.__props__.doc,
    projectID: session.projectID || project.__props__.id,
    projectName: session.projectName || project.__props__.doc,
    userID: null,
    permissionID: null,
    permissions: {},
    domain: global.manifest.host,
    db: session.db || project.db,
    expiryDate: new Date().getTime() + 86400000,
    encryptionKey: generate(),
    subscriptions,
    __props__: {
      id: generate({ unique: true }),
      doc: "session" + counter.collections.session,
      creationDate: new Date().getTime(),
      createdByUserID: "anonymous",
      active: true,
      counter: counter.collections.session
    }
  }

  postData({ _window, req, res, save: { db: bracketDB, collection: "settings", data: counter } })
  postData({ _window, req, res, save: { db: bracketDB, collection: "session", data: session } })

  return { data: session, success: true, message: "Session created successfully!" }
}

const getCollectionNames = path =>
  fs.readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

module.exports = {
  database,
  getdb,
  getData,
  postdb,
  postData,
  deletedb,
  deleteData,
  getSession,
  createSession
}