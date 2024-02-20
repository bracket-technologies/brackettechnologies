const { logger } = require("./logger")

module.exports = {
  authorizer: async ({ _window, req }) => {

    var ref = req.db.collection("_project_"),
    success, message, error,
    global = _window.global

    logger({ _window, data: { key: "authorization", start: true } })
    
    await ref.where("domains", "array-contains", global.manifest.host).get().then(doc => {
      
      if (doc.docs[0] && doc.docs[0].exists) {
  
        success = true
        global.data.project = { ...doc.docs[0].data(), id: doc.docs[0].id }
        global.data.views = global.data.project.datastore.views
        global.data.collections = global.data.project.datastore.collections
        global.manifest.projectID = global.data.project.id
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
    
    logger({ _window, data: { key: "authorization", end: true } })
    
    return { success, message, error }
  }
}