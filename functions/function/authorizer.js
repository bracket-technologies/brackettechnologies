module.exports = {
  authorizer: async ({window, req}) => {

    var ref = req.db.collection("_project_"), 
    promises = [], success, message, error,
    project = req.headers["project"],
    global = window.global
    console.log(req.headers.referer, req.headers.referrer)
    console.log("Authorization started for " + global.host, new Date().getTime() - global.timer)
    
    promises.push(ref.where("domains", "array-contains", global.host).get().then(doc => {
      
      if (doc.docs[0] && doc.docs[0].exists) {
  
        success = true
        global.data.project = project = { ...doc.docs[0].data(), id: doc.docs[0].id }
        global.functions = Object.keys(project.functions || {})
        global.projectId = global.data.project.id
        message = "Project found successfully!"
        console.log("Congrats! You are authorized!");

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
    // console.log("after project", new Date().getTime() - global.timer)
    return {success, message, error, project}
  }
}