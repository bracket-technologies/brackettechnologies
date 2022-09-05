const axios = require('axios')
const { toString } = require('./toString')
const { clone } = require('./clone')

module.exports = {
  search: async ({ _window, id = "", req, res, e, ...params }) => {
      
    var views = _window ? _window.views : window.views
    var global = _window ? _window.global : window.global

    var view = views[id], _data
    var search = params.search || {}
    var headers = search.headers || {}
    var store = search.store || "database"
    headers.project = headers.project || global.projectId
    
    if (global["accesskey"]) headers["accesskey"] = global["accesskey"]
    delete search.headers
    
    if (_window) {
      
      var collection = search.collection
      if (collection !== "_account_" && collection !== "_project_" && collection !== "_password_" && collection !== "_public_" && !search.url) collection += `-${headers["project"]}`

      var doc = search.document || search.doc,
      docs = search.documents || search.docs,
      field = search.field || search.fields,
      limit = search.limit || 25,
      data = {}, success, message,
      ref = req.db.collection(collection),
      promises = [], project
    
      /////////////////// verify access key ///////////////////// access key is stopped
      // promises.push(db.collection("_project_").doc(req.headers["project"]).get().then(doc => project = doc.data()))
      project = { ["accesskey"]: req.headers["accesskey"] }
      
      if (search.url) {

        var url = search.url
        delete search.url

        if (url.slice(-1) === "/") url = url.slice(0, -1)
        
        try {
          data = await axios.get(url, { timeout: 1000 * 10 })
          .then(res => res.doesNotExist.throwAnError)
          .catch(err => err)

          data = data.data
          //data = JSON.parse(data)
          success = true
          message = `Document/s mounted successfuly!`

        } catch (err) {
          data = {}
          success = false
          message = `Error!`
        }

        _data = { data, success, message }
      }

      else if (docs) {

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
            message = `An error occured!`

          }))
        })

        global.promises.push(...promises)
        await Promise.all(promises)
        /*
        if (project["accesskey"] !== req.headers["accesskey"]) {

          success = false
          message = `Your are not verified!`
          return res.send({ success, message })
        }
        */
      
        _data = { data, success, message }
      }

      else if (doc) {
        
        global.promises.push(ref.doc(doc.toString()).get().then(doc => {
          
          success = true
          data = doc.data()
          message = `Document mounted successfuly!`

        }).catch(error => {

          success = false
          message = `An error Occured!`
        }))
        
        // await Promise.all(promises)
        if (project["accesskey"] !== req.headers["accesskey"]) {

          success = false
          message = `Your are not verified!`
          _data = { success, message }
        }
        
        await global.promises[global.promises.length - 1]
        _data = { data, success, message }
      }

      else if (!doc && !field) {

        if (limit) ref = ref.limit(limit)
        
        global.promises.push(ref.get().then(q => {
          
          q.forEach(doc => data[doc.id] = doc.data())

          success = true
          message = `Documents mounted successfuly!`

        }).catch(error => {
          
          success = false
          message = `An error Occured!`
        }))
        
        // await Promise.all(promises)
        if (project["accesskey"] !== req.headers["accesskey"]) {

          success = false
          message = `Your are not verified!`
          return res.send({ success, message })
        }

        await global.promises[global.promises.length - 1]
        _data = { data, success, message }
      }

      else {
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

        global.promises.push(myPromise())
        
        await global.promises[global.promises.length - 1]
        _data = { data, success, message }
      }

    } else {

      // search
      headers.search = encodeURI(toString({ search }))

      var { data: _data } = await axios.get(`/${store}`, {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
          ...headers
        }
      })
    }
    
    if (!_window) console.log(_data)
    if (_data.message === "Force reload!") return location.reload()
    view.search = global.search = clone(_data)
    
    // await params
    if (params.asyncer) require("./toAwait").toAwait({ _window, id, e, params, req, res })
  }
}