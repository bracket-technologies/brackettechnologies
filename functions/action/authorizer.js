module.exports = {
  authorizer: async ({ _window, req }) => {

    var ref = req.db.collection("_project_"), 
    promises = [], success, message, error,
    project = req.headers["project"],
    global = _window.global,
    timer = (new Date()).getTime()
    
    promises.push(ref.where("domains", "array-contains", global.host).get().then(doc => {
      
      if (doc.docs[0] && doc.docs[0].exists) {
  
        success = true
        global.data.project = project = { ...doc.docs[0].data(), id: doc.docs[0].id }
        global.__actions__ = Object.keys(project.functions || {})
        global.projectID = global.data.project.id
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
    }))

    await Promise.all(promises)
    
    console.log("AUTHORIZATION", (new Date()).getTime() - timer)
    return {success, message, error, project}
  }
}