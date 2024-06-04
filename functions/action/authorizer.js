const { getSession } = require("./kernel")
const { logger } = require("./logger")

// config
require('dotenv').config()

const authorizer = async ({ _window, req, res }) => {

  var global = _window.global, success, message, error

  logger({ _window, data: { key: "authorization", start: true } })

  if (global.manifest.datastore === "bracketDB") {

    var { data, success, message } = await getSession({ _window, req, res })
    global.manifest.session = data

  } else if (global.manifest.datastore === "firebase") {

    var ref = req.datastore.firebaseDB.collection("_project_"),
      success, message, error,
      global = global

    await ref.where("domains", "array-contains", global.manifest.host).get().then(doc => {

      if (doc.docs[0] && doc.docs[0].exists) {

        success = true
        global.data.project = { ...doc.docs[0].data(), id: doc.docs[0].id }
        global.data.collections = global.data.project.datastore.collections
        global.manifest.session = { projectID: global.data.project.id }
        message = "You are authorized!"

      } else {

        success = false
        message = req.headers['x-forwarded-host'] + " project does not exist!"
        error = "You are not authorized!"
      }

    }).catch(err => {

      success = false
      message = "Something went wrong!"
      error = err
      console.log(err);
    })

  } else if (global.manifest.datastore === "mongoDB") {

    var { data, success, message } = await getSession({ _window, req, res })
    global.manifest.session = data
  }

  logger({ _window, data: { key: "authorization", end: true } })

  return { success, message, error }
}

module.exports = { authorizer }