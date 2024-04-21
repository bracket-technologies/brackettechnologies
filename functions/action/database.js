const { toArray } = require("./toArray")
const { generate } = require("./generate")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { clone } = require("./clone")
const { toOperator } = require("./toOperator")
const fs = require("fs")
const { compress, decompress } = require("compress-json")
const { hideSecured } = require("./kernel")

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

  var { data, success, message } = await getData({ _window, req, res, search })

  console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " SEARCH", search.collection || search.db, (new Date()).getTime() - timer);

  // hide secured
  _window.global.manifest.session.db !== bracketDB && hideSecured(_window.global)

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const postdb = async ({ _window, req, res }) => {

  var save = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!save.collection) {
    console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " SAVE", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { data, success, message } = await postData({ _window, req, res, save })

  console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " SAVE", save.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ data, success, message }))
  res.end()
}

const deletedb = async ({ _window, req, res }) => {

  var erase = req.body.data || {}, timer = (new Date()).getTime()

  // no collection
  if (!erase.collection) {
    console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " ERASE", "No collection!", 0);
    return ({ success: false, message: "No collection exists!" })
  }

  var { success, message } = await deleteData({ _window, req, res, erase })

  console.log((new Date()).getHours() + ":" + (new Date()).getMinutes() + " ERASE", erase.collection, (new Date()).getTime() - timer);

  // respond
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success, message }))
  res.end()
}

const getData = async ({ _window, req, res, search }) => {

  var global = _window.global
  var response = { success: false, message: "Something went wrong!" }

  var datastore = search.datastore || "bracketDB" || global.manifest.datastore,
    db = search.db || global.manifest.session.db,
    collection = search.collection,
    doc = search.doc,
    docs = search.docs,
    populate = search.populate,
    select = search.select,
    deselect = search.deselect,
    assign = search.assign,
    find = search.find || search.field,
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

    var path = `bracketDB/${db}`
    if (!fs.existsSync(path)) return ({ data, message: "No database!", success: false })

    if (collection) {
      path += `/${collection}`
      if (!fs.existsSync(path)) return ({ data, message: "No collection!", success: false })
    }

    // no collection => return collection names
    else {

      var data = getCollectionNames(path)
      /*for (let i = 0; i < collections.length; i++) {

        var collection = collections[i]
        var { data: query } = getData({ search: { datastore, db, collection, skip, limit } })
        limit -= Object.keys(query).length
        data[collection] = query
        if (limit === 0) break
      }*/

      var propsIndex = data.findIndex(coll => coll === "__props__")
      data.splice(propsIndex, 1)

      return ({ data, message: "Collection names sent successfully!", success: true })
    }
    
    // get db & collection props
    var dbProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/__props__/db.json`)))
    var collectionProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/__props__.json`)))
    
    // chunk details
    var chunkIndex = collectionProps.chunks.length - 1
    var chunkName = "chunk" + chunkIndex

    var chunksRunout = false, endSearch = false
    while (!chunksRunout && !endSearch) {
      
      var chunk = decompress(JSON.parse(fs.readFileSync(`${path}/${chunkName}.json`)))

      if ("docs" in search) {

        var foundDocs = []
        toArray(docs).map(doc => {
          if (chunk[doc]) {
            data[doc] = chunk[doc]
            foundDocs.push(doc);
          }
        })

        docs = docs.filter(doc => !foundDocs.includes(doc))
        if (docs.length === 0) {
          endSearch = true
          break;
        }
      }

      else if ("doc" in search) {

        if (chunk[doc]) {

          data = chunk[doc]
          endSearch = true
          break;

          // doc does not exist in collection
        } else if (chunkIndex === 0) data = undefined
      }

      else if (("find" in search) || ("field" in search)) {

        // find=[] & find=[preventDefault] => do not return all data in collection
        if (find.preventDefault && Object.keys(find).length === 1) {
          readProps({ collectionProps, dbProps, data, db, collection })
          return { data: {}, message: "No find conditions exist!", success: false }
        }

        delete find.preventDefault

        var docs = Object.keys(chunk), i = 0
        
        while (limit > 0 && (i <= docs.length - 1)) {

          var doc = docs[i]
          if (doc === "__props__") continue;

          toArray(find).map(find => {

            if (limit === 0) return
            var push = true

            Object.keys(find).map(key => {

              if (!push) return

              // equal without equal
              if (typeof find[key] !== "object") find[key] = { equal: find[key] }

              push && Object.entries(find[key]).map(([operator, value]) => {

                var keyPath = key.split(".")
                var lastIndex = keyPath.length - 1

                keyPath.reduce((o, k, i) => {

                  if (!o || !(k in o) || !push) return push = false

                  if (i !== lastIndex) return o[k]

                  operator = toOperator(operator)

                  if (operator === "==") {
                    if (o[k] === value) push = true
                    else push = false
                  } else if (operator === "!=") {
                    if (o[k] !== value) push = true
                    else push = false
                  } else if (operator === ">=") {
                    if (o[k] >= value) push = true
                    else push = false
                  } else if (operator === "<=") {
                    if (o[k] <= value) push = true
                    else push = false
                  } else if (operator === "<") {
                    if (o[k] < value) push = true
                    else push = false
                  } else if (operator === ">") {
                    if (o[k] > value) push = true
                    else push = false
                  } else if (operator === "inc") {
                    if (o[k].includes(value)) push = true
                    else push = false
                  } else if (operator === "in") {
                    if (value.includes(o[k])) push = true
                    else push = false
                  } else if (operator === "regex") {
                    if (value.test(o[k])) push = true
                    else push = false
                  }

                }, chunk[doc])
              })
            })
            
            if (push && skip) skip--;
            else if (push && limit > 0) {
              limit--;
              data[doc] = chunk[doc]
            }

            if (limit === 0) endSearch = true
            i++;
          })
        }
      }

      else if ("findOne" in search) {

        data = undefined
        find.limit = 1
        var { data: query } = await getData({ search: { datastore, db, collection, find } })
        data = query
        if (data) {
          endSearch = true
          break;
        }
      }

      else if ("findAny" in search) {

        var value = toArray(search.findAny)
        var docs = Object.keys(chunk)

        for (let i = 0; i < docs.length; i++) {


          var doc = docs[i]
          if (doc === "__props__") continue;

          var docData = chunk[doc]
          //var stringDoc = JSON.stringify(docData)

          value.map(value => {

            delete docData.__props__.active
            delete docData.__props__.creationDate
            delete docData.__props__.comments
            delete docData.__props__.collapsed
            delete docData.__props__.createdByUserID
            delete docData.__props__.id
            delete docData.__props__.doc
            delete docData.__props__.counter
            delete docData.__props__.chunk
            delete docData.__props__.version
            delete docData.__props__.dirPath

            if (JSON.stringify(docData).includes(value)) {

              data[doc] = []
              docData = objectToString(docData)

              var list = docData.split(value)
              if (list.length <= 1) return

              list.map((text, i) => {
                if (i === 0) return
                data[doc].push(list[i - 1].split(": ").at(-1).split(",").at(-1).slice(-30) + `<mark>${value}</mark>` + text.split(",")[0])
              })
            }
          })
        }
      }

      else {

        var docs = Object.keys(chunk), i = 0

        while (limit > 0 && (i <= docs.length - 1)) {

          var doc = docs[i]
          if (doc === "__props__") continue;

          data[doc] = chunk[doc]
          if (skip) skip--;
          else limit--;
          i++;
        }

        if (limit === 0) endSearch = true
      }

      if (chunkIndex === 0 || endSearch) chunksRunout = true
      else {
        chunkIndex--;
        chunkName = "chunk" + chunkIndex
      }
    }

    readProps({ collectionProps, dbProps, data, db, collection })

    // mount actions queries
    queries({ global, data, search, db, collection, doc })

    response = { data, message: "Data queried successfully!", success: true }

  } else if (datastore === "firebase") {

    var project = (search.headers || {}).project || search.db || _window.global.manifest.session.db

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

    if (!collection) {

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

  var datastore = save.datastore || "bracketDB" || _window.global.manifest.datastore
  var project = (save.headers || {}).project || save.db

  // collection
  var db = save.db || _window.global.manifest.session.db
  var collection = save.collection
  var doc = save.doc
  var data = save.data
  var find = save.find
  var update = save.update
  var success = false, message = "Missing data!"

  // update specific fields. ex: update:[name=Goerge;age=28] (it ignores appended data)
  if (update) {

    var search = { datastore, db, collection }
    if (doc) search.doc = doc
    else if (find) search.find = find

    var { data: rawData, success, message } = await getData({ search })
    if (!success) return ({ success, message })
    data = rawData

    if (doc) data = { [data.__props__.doc]: data }

    // update values for requested keys
    Object.values(data).map(data => Object.entries(update).map(([key, value]) => key.split(".").reduce((o, k, i) => { if (i === key.split(".").length - 1) { o[k] = value } else return o[k] }, data)))
    data = Object.values(data)
  }

  // find data
  else if (find) {

    var { data: rawData } = await getData({ _window, req, res, search: { db: bracketDB, collection, find } })
    rawData = Object.values(rawData)
    if (rawData.length > 1) return ({ success: false, message: "Incompatible use of find and save!" })
    else if (rawData.length === 1) doc = rawData[0].__props__.doc
  }

  if (datastore === "bracketDB") {

    // db
    var path = `bracketDB/${db}`
    if (!fs.existsSync(path)) fs.mkdirSync(path)

    // create collection
    if (!("data" in save) && !("update" in save)) {

      if (fs.existsSync(path + "/" + collection)) return ({ success: false, message: "Enter data to save!" })

      createCollection({ db, collection })

      return { success: true, message: "Collection created successfully!" }
    }

    // collection
    path += `/${collection}`
    if (!fs.existsSync(path)) createCollection({ db, collection })

    // get db & collection props
    var dbProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/__props__/db.json`)))
    var collectionProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/__props__.json`)))

    // rename collection
    if (save.rename) {
      fs.renameSync(path, `bracketDB/${db}/${save.rename}`)

      // props
      dbProps.writes += 1
      collectionProps.writes += 1
      collectionProps.collection = collection = save.rename

      fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compress(collectionProps)))
      fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compress(dbProps)))

      return { success: true, message: "Collection name changed successfully!" }
    }

    var writesCounter = 0, newDocsLength = 0, payloadIn = 0, newDataSize = 0, chunkName = `chunk${collectionProps.lastChunk}`
    var lastChunk = decompress(JSON.parse(fs.readFileSync(`${path}/${chunkName}.json`))), chunks = { [chunkName]: lastChunk }
    
    toArray(data).map(data => {

      var chunk
      var newData = false
      writesCounter++

      if (!data.__props__) {

        newData = true
        newDocsLength++;
        collectionProps.counter++;

        data.__props__ = {

          id: generate({ unique: true }),
          doc: doc || (collection + collectionProps.counter),
          counter: collectionProps.counter,
          creationDate: (new Date()).getTime(),
          active: true,
          actions: {},
          chunk: chunkName,
          secured: collection === "session" ? true : false,
          collection,
          createdByUserID: (_window.global.manifest.session || {}).userID || null
        }

        doc = data.__props__.doc

        // new project
        createDBprops({ collection, db, data })
      } 
      else if (doc) data.__props__.doc = doc
      else doc = data.__props__.doc

      // reset data
      if (!data.__props__.chunk) data.__props__.chunk = "chunk0"
      data.__props__.collection = collection

      // get related chunk
      if (!chunks[data.__props__.chunk]) {
        chunk = decompress(JSON.parse(fs.readFileSync(`${path}/${data.__props__.chunk}.json`)))
        chunks[data.__props__.chunk] = chunk
      } else chunk = chunks[data.__props__.chunk]

      chunk[doc] = data
      var dataSize = JSON.stringify({ [doc]: data }).length
      payloadIn += dataSize
      if (newData) newDataSize += dataSize
    })
    
    postProps({ db, collection, collectionProps, dbProps, writesCounter, newDocsLength, payloadIn, newDataSize })

    // save chunks
    Object.keys(chunks).map(chunkName => fs.writeFileSync(`${path}/${chunkName}.json`, JSON.stringify(compress(chunks[chunkName]))))

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
    if (collection !== "counters") {
      var { data: counter } = await getData({ _window, req, res, search: { db: bracketDB, collection: "counters", find: { db } } })
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
          createdByUserID: _window.global.manifest.session.userID,
          counter: counter.collections[collection]
        }

        doc = data.__props__.doc

        // set counter
        collection !== "counters" && postData({ _window, req, save: { db: bracketDB, collection: "counters", doc: counter.__props__.doc, data: counter } })

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
    datastore = erase.datastore || "bracketDB" || _window.global.manifest.datastore,
    project = (erase.headers || {}).project,
    db = erase.db || global.manifest.session.db,
    success = true, message = "Documents erased successfully!",
    docs = toArray(erase.docs || erase.doc),
    find = erase.find,
    data = {}

  if (datastore === "bracketDB") {

    // db
    var path = `bracketDB/${db}`
    if (!fs.existsSync(path)) return { success: false, message: "Project does not exist!" }

    // collection
    if (collection) path += `/${collection}`
    if (!fs.existsSync(path)) return { success: false, message: "Collection does not exist!" }

    // get db & collection props
    var dbProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/__props__/db.json`)))
    var collectionProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/__props__.json`)))

    // erase collection
    if (!("docs" in erase) && !("doc" in erase) && !("find" in erase)) {

      fs.rmSync(`${path}`, { recursive: true, force: true })

      dbProps.deletes += 1
      dbProps.collectionsLength -= 1
      dbProps.docsLength -= collectionProps.docsLength
      dbProps.size -= collectionProps.size
      
      fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compress(dbProps)))

      return ({ success: true, message: "Collection erased successfully!" })
    }

    // find
    if (find) {
      find.preventDefault = true
      var { data } = await getData({ _window, search: { datastore, db, collection, find } })
      docs = Object.keys(data)
      docs.map(doc => data[doc] = "erased")
    }

    if (docs.length === 0) {

      message = "No data found!"
      collectionProps.deletes += 1
      dbProps.deletes += 1

    } else {

      var deletedDocsLength = 0, deletedDataSize = 0, chunkName = `chunk${collectionProps.lastChunk}`
      var chunk = decompress(JSON.parse(fs.readFileSync(`${path}/${chunkName}.json`))), chunks = { [chunkName]: chunk }
      // Note: considering erasing is only available on last chunk (for now)

      // remove docs in collection
      docs.map(doc => {
        if (chunk[doc]) {

          // props: length, size
          deletedDocsLength++;
          deletedDataSize += JSON.stringify({ [doc]: chunk[doc] }).length

          delete chunk[doc]
          data[doc] = "erased"
        }
      })

      // props
      collectionProps.docsLength -= deletedDocsLength
      collectionProps.size -= deletedDataSize
      dbProps.docsLength -= deletedDocsLength
      dbProps.size -= deletedDataSize

      // all docs erased => reset counter to 0
      if (fs.existsSync(path) && !collectionProps.docsLength) {
        collectionProps.counter = 0
        message = "All docs has been erased!"
      }
      
      // save chunk
      fs.writeFileSync(`${path}/${chunkName}.json`, JSON.stringify(compress(chunk)))
    }

    // save props
    fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compress(collectionProps)))
    fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compress(dbProps)))

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

  return ({ success, message, data })
}

const populator = async ({ _window, req, res, data, db, populate }) => {

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
  var promises = [], account, project, subscriptions = [], plugins = []

  // project
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "project", find: { domains: { inc: global.manifest.host } } } }).then(({ data }) => { project = Object.values(data || {})[0] }))
  await Promise.all(promises)

  if (!project) return { message: "Project does not exist!", success: false }

  // clear promises
  var promises = []

  // account
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "account", find: { "__props__.id": { equal: project.accountID } } } }).then(({ data }) => { account = Object.values(data || {})[0] }))

  // subscriptions
  promises.push(getData({ _window, req, search: { db: bracketDB, collection: "subscription", find: { expiryDate: { greater: new Date().getTime() }, projectID: project.__props__.id } } }).then(({ data }) => { subscriptions = Object.values(data || {}) }))
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
    /*__props__: {
      id: generate({ unique: true }),
      doc: "session" + collectionProps.counter,
      creationDate: new Date().getTime(),
      createdByUserID: "anonymous",
      active: true,
      counter: collectionProps.counter,
      chunk: `chunk${collectionProps.lastChunk}`
    }*/
  }

  postData({ _window, req, res, save: { db: bracketDB, collection: "session", data: session } })

  // session garbage collector
  deleteData({ _window, req, res, erase: { db: project.db, collection: "session", find: { expiryDate: { "<": (new Date()).getTime() } } } })

  return { data: session, success: true, message: "Session created successfully!" }
}

const getCollectionNames = path =>
  fs.readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const flattenObject = (obj, parentKey = '') => {
  let flattened = {};

  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      let nestedObj = flattenObject(obj[key], parentKey + key + ': ');
      flattened = { ...flattened, ...nestedObj };
    } else {
      flattened[parentKey + key] = Array.isArray(obj[key]) ? obj[key].join(', ') : obj[key];
    }
  }

  return flattened;
}

const objectToString = (obj) => {
  let flattenedObj = flattenObject(obj);
  let str = '';

  let usedKeys = {}; // Keep track of used parent keys

  for (let key in flattenedObj) {
    let parts = key.split(': '); // Split the key into parts by ': '
    let parentKey = parts.slice(0, -1).join(': '); // Get the parent key
    let lastKey = parts[parts.length - 1]; // Get the last part of the key

    // Check if the parent key has been used before
    if (!usedKeys[parentKey]) {
      // If not used, add the parent key and the last key with value
      str += parentKey + ': ' + lastKey + ': ' + flattenedObj[key] + ', ';
      usedKeys[parentKey] = true; // Mark the parent key as used
    } else {
      // If used, just add the last key with value
      str += lastKey + ': ' + flattenedObj[key] + ', ';
    }
  }

  // Remove the trailing comma and space
  str = str.slice(0, -2);

  return str;
}

const readProps = ({ collectionProps, dbProps, data, db, collection }) => {
  
  var reads = data ? Object.keys(data).length : 1
  var payloadOut = data ? JSON.stringify(data).length : 0

  // save collection props
  collectionProps.reads += reads
  collectionProps.payloadOut += payloadOut
  fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compress(collectionProps)))
  
  // save db props
  dbProps.reads += reads
  dbProps.payloadOut += payloadOut
  fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compress(dbProps)))
}

const postProps = ({ db, collection, collectionProps, dbProps, writesCounter, newDocsLength, payloadIn, newDataSize }) => {

  // writes
  collectionProps.writes += writesCounter
  dbProps.writes += writesCounter
  // docsLength
  collectionProps.docsLength += newDocsLength
  dbProps.docsLength += newDocsLength
  // payloadIn
  collectionProps.payloadIn += payloadIn
  dbProps.payloadIn += payloadIn
  // size
  collectionProps.size += newDataSize
  dbProps.size += newDataSize

  // save
  fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compress(collectionProps)))
  fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compress(dbProps)))
}

const createCollection = ({ db, collection }) => {

  // create collection dir
  if (!fs.existsSync(`bracketDB/${db}/${collection}`)) fs.mkdirSync(`bracketDB/${db}/${collection}`)

  var collectionProps = {
    creationDate: new Date().getTime(),
    collection,
    chunkMaxSizeMB: 20,
    lastChunk: 0,
    docsLength: 0,
    counter: 0,
    reads: 0,
    writes: 1,
    deletes: 0,
    size: 0,
    payloadIn: 0,
    payloadOut: 0,
    chunks: [{ creationDate: new Date().getTime(), size: 0, docsLength: 0 }]
  }

  fs.writeFileSync(`bracketDB/${db}/${collection}/chunk0.json`, JSON.stringify(compress({})))
  fs.writeFileSync(`bracketDB/${db}/${collection}/__props__.json`, JSON.stringify(compress(collectionProps)))

  // db props
  var dbProps = decompress(JSON.parse(fs.readFileSync(`bracketDB/${db}/__props__/db.json`)))
  dbProps.writes += 1
  db.collectionsLength += 1
  fs.writeFileSync(`bracketDB/${db}/__props__/db.json`, JSON.stringify(compress(dbProps)))

  return collectionProps
}

const queries = ({ global, data, search, db, collection, doc }) => {

  global.__queries__[collection] = global.__queries__[collection] || {}
  if (search.doc && data) {
    global.__queries__[collection][doc] = data
  } else if (data && !Array.isArray(data)) {
    Object.entries(data).map(([doc, data]) => {
      if (Array.isArray(data) || typeof data !== "object") return
      global.__queries__[collection][doc] = data
      //if (collection === "view" && db === global.manifest.session.db) 
        //global.data[collection][doc] = data
    })
  }
}

const createDBprops = ({ collection, db, data }) => {
  
  if (collection === "project" && db === bracketDB && data.db) {
    var newProjectProps = {
      creationDate: 0,
      collectionsLength: 0,
      docsLength: 0,
      reads: 0,
      writes: 0,
      deletes: 0,
      size: 0,
      payloadIn: 0,
      payloadOut: 0
    }
    fs.mkdirSync(`bracketDB/${data.db}`)
    fs.mkdirSync(`bracketDB/${data.db}/__props__`)
    fs.writeFileSync(`bracketDB/${data.db}/__props__/db.json`, JSON.stringify(compress(newProjectProps)))
  }
}

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