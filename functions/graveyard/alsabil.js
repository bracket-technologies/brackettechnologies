


/*db.collection("flight-booking-alsabil-tourism").where("issuing-day", ">=", 1668038400000).limit(500).get().then((query) => {
  console.log(query.docs.length)
  query.docs.forEach(doc => {
    var data = doc.data()
    data["issuing-day"] = data["issue-day"]
    delete data["issue-day"]
    db.collection("flight-booking-alsabil-tourism").doc(data.id.toString()).set(data).then(() => console.log("Success"))
  })
})*/

// views
//var projectData = getJsonFiles({ search: { collection: "test", doc: "test" } })
/*var __ids__ = Object.keys(projectData)
var data = Object.values(projectData)*/


//__ids__.map((doc, i) => {
  //db.collection("view-brackettechnologies").doc("sidebar").set(views).then(() => {console.log("sidebar" + " view done!");})
//})

/*var test = async () => {
  var { data, success, message } = await getData({ req: { db, headers: { project: "brackettechnologies" } }, _window: { global: { data: { project: { datastore: [] } } }}, search: { collection: "view" } })
  console.log(data);
  var docs = Object.keys(data)
  docs.map(async doc => {
    if (doc.length === 20) {
      await deleteData({ req: { db, headers: { project: "brackettechnologies" } }, _window: { global: { data: { project: { datastore: [] } } }}, erase: { collection: "view", doc } })
      console.log(doc + " deleted!");
    }
  })
}

test()*/
// pages
/*var views = getJsonFiles({ search: { collection: "page-brackettechnologies" } })
var __ids__ = Object.keys(views)
var data = Object.values(views)

__ids__.map((doc, i) => {
  db.collection("page-brackettechnologies").doc(doc.toString()).set(data[i]).then(() => {console.log(doc + " page done!");})
})*/


/////////////////////////////////////////////  create a project with another id  ///////////////////////////////////////////

/*

var projectData = getJsonFiles({ search: { collection: "test", doc: "test" } })
Object.entries(projectData).map(([key, data]) => {
  
  if (key === "view" || key === "page") {
    Object.entries(data).map(([doc, data]) => {
      db.collection(key + "-acc").doc(doc.toString()).set(data).then(() => {console.log(doc + " " + key + " done!");})
      //console.log(doc + " " + key + " done!")
    })
  }

  if (key === "_account_" || key === "_project_") {
    db.collection(key).doc(data.id.toString()).set(data).then(() => {console.log(key + " done!");})
    //console.log(key + " done!")
  }
  
  if (key === "collections") {
    Object.entries(data).map(([collection, data]) => {
      db.collection("collection-" + collection + "-acc").doc(collection.toString()).delete().then(() => {console.log("Erase done!")})
      Object.entries(data).map(([doc, data]) => {
        db.collection("collection-" + collection + "-acc").doc(doc.toString()).set(data).then(() => {console.log("collection-" + collection + "-acc" + " " + doc + " done!");})
      })
        //console.log("collection-" + doc + "-acc" + " " + key + " done!")
    })
  }
})

db.collection("collection-tt").limit(5000).get().then((query) => {
  console.log(query.docs.length)
  query.docs.forEach(doc => {
    var data = doc.data()
    db.collection("collection-acc").doc(data.id.toString()).set(data).then(() => console.log(data.id + " done!"))
  })
})
*/


///////////////////////////////////////////// end of create a project with another id ///////////////////////////////////////////
/*var projectData = getJsonFiles({ search: { collection: "test", doc: "test" } })
  Object.entries(projectData).map(([key, data]) => {
    if (key === "collections") {
      Object.entries(data).map(([collection, data]) => {
        //db.collection("collection-" + collection + "-acc").doc(collection.toString()).delete().then(() => {console.log("Erase done!")})
        Object.entries(data).map(([doc, data]) => {
          db.collection("collection-" + collection + "-acc").doc(doc.toString()).set(data).then(() => {console.log("collection-" + collection + "-acc" + " " + doc + " done!");})
        })
          //console.log("collection-" + doc + "-acc" + " " + key + " done!")
      })
    }
})*/