const { createSession, getSession } = require("./database")
const { logger } = require("./logger")

// config
require('dotenv').config()

const authorizer = async ({ _window, req }) => {

  var global = _window.global

  logger({ _window, data: { key: "authorization", start: true } })

  if (global.manifest.datastore === "bracketdb") {

    var session = getSession({ _window, req })
    if (!session) session = createSession({ _window, req })

    global.data.collections = global.data.project.collections
    global.manifest.session = { projectID: global.data.project.id }

  } else if (global.manifest.session.datastore === "firebase") {

    var ref = req.db.firebaseDB.collection("_project_"),
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

  } else if (global.manifest.session.datastore === "mongoDB") {}

  logger({ _window, data: { key: "authorization", end: true } })

  return { success, message, error }
}

module.exports = { authorizer }