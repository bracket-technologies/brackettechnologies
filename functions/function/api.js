const { toParam } = require("./toParam")
const { toFirebaseOperator } = require("./toFirebaseOperator")
const { capitalize } = require("./capitalize")
const { toCode } = require("./toCode")

var getApi = async ({ req, res, db }) => {

  // api/collection?params?conditions
  var collection = req.url.split("?")[0].split("/")[2]
  var string = decodeURI(req.url.split("?")[1]), params = {}, _window = { global: {}, value: {} }
  string = toCode({ _window, string })
  
  if (string) params = toParam({ _window, string, id: "" })
  var search = params.search,
  doc = search.document || search.doc, 
  docs = search.documents || search.docs, 
  field = search.field || search.fields,
  limit = search.limit || 25,
  success, message, data

  if (collection) search.collection = collection
  if (search.url) {

    var url = search.url
    delete search.url
    url +=`/${toString(search)}`
    if (url.slice(-1) === "/") url = url.slice(0, -1)
    data = await axios.get(url, {
      timeout: 1000 * 10
    })
    data = data.data
    if (typeof data === "string") {
      data = `{ ${data.split("{").slice(1).join("{")}`
      data = JSON.parse(data)
    }
    success = true
    message = `File/s mounted successfuly!`
      
    return res.send({ data, success, message })
  }

  var data = [], success, message
  var ref = db.collection(collection)

  if (docs) {

    var _docs = [], index = 1, length = Math.floor(search.docs.length / 10) + (search.docs.length % 10 > 0 ? 1 : 0)
    while (index <= length) {
      _docs.push(search.docs.slice((index - 1) * 10, index * 10))
      index += 1
    }
    
    data = {}
    await Promise.all(
      _docs.map(async docList => {
        await ref.where("id", "in", docList).get().then(docs => {

          success = true
          docs.forEach(doc => data[doc.id] = doc.data())
          message = `Documents mounted successfuly!`
          
        }).catch(error => {
      
          success = false
          message = error
          console.log(error);
        })
      })
    )
    
    return res.send({ data, success, message })
  }

  if (doc) {
    
    await ref.doc(doc.toString()).get().then(doc => {

      success = true
      data = doc.data()
      message = `Document mounted successfuly!`
      
    }).catch(error => {
  
      success = false
      message = error 
    })

    return res.send({ data, success, message })
  }

  if (!doc && !field) {

    if (limit) ref = ref.limit(limit)
    var data = {}

    await ref.get().then(q => {
      
      q.forEach(doc => data[doc.id] = doc.data())

      success = true
      message = `Documents mounted successfuly!`
      
    }).catch(error => {
  
      success = false
      message = error 
    })
    
    return res.send({ data, success, message })
  }

  /* if (collection !== 'admin' && !search.field.id) {

    search.limit = !search.limit ? 25 : search.limit
    search.orderBy = !search.orderBy ? "creation-date" : search.orderBy
    if (search.orderBy === "creation-date")
    search.startAfter = !search.startAfter ? 0 : search.startAfter
  } */

  // search field
  if (field) Object.entries(field).map(([key, value]) => {

    var operator = Object.keys(value)[0]
    ref = ref.where(decodeURI(key), toFirebaseOperator(operator), decodeURI(value[operator]))
  })

  if (search.orderBy) ref = ref.orderBy(search.orderBy)
  if (search.limit) ref = ref.limit(search.limit)
  if (search.offset) ref = ref.endAt(search.offset)
  if (search.limitToLast) ref = ref.limitToLast(search.limitToLast)

  if (search.startAt) ref = ref.startAt(search.startAt)
  if (search.startAfter) ref = ref.startAfter(search.startAfter)

  if (search.endAt) ref = ref.endAt(search.endAt)
  if (search.endBefore) ref = ref.endBefore(search.endBefore)

  // retrieve data
  await ref.get().then(query => {

    success = true
    query.docs.forEach(doc => data.push(doc.data()))
    message = `Documents mounted successfuly!`
    
  }).catch(error => {

    success = false
    message = error 
  })
    
  return res.send({ data, success, message })
}

var postApi = async ({ req, res, db }) => {
  // api/collection?params?conditions

  var data = req.body.data
  var path = req.url.split("/")[2].split("?")
  var collection = path[0]
  var save = req.body.save
  var ref = db.collection(collection)
  var success, message

  await ref.doc(save.doc.toString()).set(data).then(() => {

    success = true
    message = `${capitalize(collection)} saved successfuly!`

  }).catch(error => {

    success = false
    message = error 
  })
    
  return res.send({ data, success, message })
}

var deleteApi = async ({ req, res, db }) => {
  // api/collection?params?conditions

  var path = req.url.split("/")[2].split("?")
  var collection = path[0]
  var string = path[1], params = {}
  if (string) params = toParam({ _window: { value: {} }, string, id: "" })

  var erase = params.erase
  var ref = db.collection(collection)
  var success, message
  
  await ref.doc(erase.doc.toString()).delete().then(async () => {

    success = true,
    message = `${capitalize(erase.doc)} erased successfuly!`
    
    // if (erase.type === 'file') await db.storage.child(`images/${erase.id}`).delete()

  }).catch(error => {

    success = false
    message = error 
  })

  return res.send({ success, message })
}

const uploadApi = async ({ req, res, db, storage }) => {
      
  var file = req.body.file, url
  var path = req.url.split("/")[3].split("?")
  var collection = path[0]
  var upload = req.body.upload
  var ref = db.collection(collection)

  // file Type
  upload.type = upload.type.split("-").join("/")
  // convert base64 to buffer
  var buffer = Buffer.from(file, "base64")
  
  await storage.ref().child(`${collection}/${upload.doc}`).put(buffer, { contentType: upload.type })
  .then(async snapshot => {

    url = await snapshot.ref.getDownloadURL()

  }).catch(error => {

    success = false
    message = error
  })
  
  // post api
  var data = {
    url,
    id: upload.doc,
    name : upload.name,
    description: upload.description || "",
    type: upload.type,
    tags: upload.tags,
    title : upload.title
  }

  await ref.doc(data.id).set(data).then(() => {

    success = true
    message = `${collection} saved successfuly!`

  }).catch(error => {

    success = false
    message = error 
  })

  return res.send({ data, success, message })
}

/*
//const db = require("./firebase")
// const { getJsonFiles } = require("./getJsonFiles")
// const fs = require("fs")

var getApi = (req, res) => {
  // api/folder/collection/params?conditions
  var path = req.url.split("/");
  var folder = path[2];
  var collection = path[3];
  var params = path[4];
  if (params) params = toParam({string: params});

  if (folder === "image")
  return res.sendFile(require("path").join(process.cwd(), folder, collection));

  var files = getJsonFiles(folder, collection, params);
  return res.send({
    data: files,
    success: true,
    message: `Data mounted successfuly!`,
  });
};

var postApi = (req, res) => {
  // api/folder/collection/params?conditions
  var file = req.body;
  var path = req.url.split("/");
  var folder = path[2];
  var collection = path[3]
  var fileType = "json";

  // create folder if it doesnot exist
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  if (folder === "image") {
    file = file.file;

    // get data type
    var dataType = file.substring("data:".length, file.indexOf("/"));
    // get file type
    var fileType = file.substring(
        file.indexOf("/") + 1,
        file.indexOf(";base64")
    );
    // get file name
    var collection = file['file-name']
    // Forming regex to extract base64 data of file.
    var regex = new RegExp(`^data:${dataType}\/${fileType};base64,`, "gi");
    // Extract base64 data.
    var base64Data = file.replace(regex, "");
    // file path
    var filePath = `/${folder}/${collection}.${fileType}`;
    var data = {"url": filePath};

    fs.writeFileSync(filePath, base64Data, "base64");
    return res.send({
      data,
      success: true,
      message: `File saved successfuly!`,
    });
  }

  // file path
  var filePath = `./${folder}/${collection}.${fileType}`;

  if (file.id) {
    var files = getJsonFiles(folder, `${collection}.${fileType}`);
    var index = files.findIndex((_file) => _file.id === file.id);
    if (index > -1) files[index] = file;
    else files.push(file);

    fs.writeFileSync(filePath, JSON.stringify(files, null, 2));
  } else fs.writeFileSync(filePath, JSON.stringify(file, null, 2));

  res.send({
    data: file,
    success: true,
    message: `Data edited successfuly!`,
  });
};

var deleteApi = (req, res) => {
  // api/folder/collection/params?conditions

  var path = req.url.split("/");
  var folder = path[2];
  var collection = path[3];
  var params = path[4];
  if (params) params = toParam({string: params});

  if (params.id) {
    var filePath = `./${folder}/${collection}`;
    var data = getJsonFiles(folder, collection) || [];
    data = data.filter((data) => !params.id.find((id) => data.id === id));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return res.send({
      data,
      success: true,
      message: "Data deleted successfuly!",
    });
  }

  fs.unlinkSync(filePath);

  res.send({
    data: file,
    success: true,
    message: `Data deleted successfuly!`,
  });
};
*/

module.exports = {getApi, postApi, deleteApi, uploadApi};

/*
Query operators:
  1. < less than
  2. <= less than or equal to
  3. == equal to
  4. > greater than
  5. >= greater than or equal to
  6. != not equal to
  7. array-contains (search an array by 1 choice)
  8. array-contains-any (search an array by multiple choices)
  9. in (search a string by multiple choices)
  10. not-in (search a string by multiple !choices)

reference: https://firebase.google.com/docs/firestore/query-data/queries
*/

/*
Pagination: ref.orderBy('createdAt').startAfter(x).limit(x)
*/