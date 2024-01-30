const { timerLogger } = require("./logger")

module.exports = {
  authorizer: async ({ _window, req }) => {

    var ref = req.db.collection("_project_"),
    success, message, error,
    global = _window.global

    timerLogger({ _window, key: "authorization", start: true })
    
    await ref.where("domains", "array-contains", global.manifest.host).get().then(doc => {
      
      if (doc.docs[0] && doc.docs[0].exists) {
  
        success = true
        global.data.project = { ...doc.docs[0].data(), id: doc.docs[0].id }
        global.__serverActions__ = Object.keys(global.data.project.functions || {})
        global.manifest.projectID = global.data.project.id
        message = "Project found successfully!"

      } else {

        success = false
        message = req.headers['x-forwarded-host'] + " project does not exist!"
        error = "Project was not found!"
      }
  
    }).catch(err => {
  
        success = false
        message = "Something went wrong!"
        error = err
        console.log(err);
    })
    
    timerLogger({ _window, key: "authorization", end: true })
    
    return { success, message, error }
  }
}