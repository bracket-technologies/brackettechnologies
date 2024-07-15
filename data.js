const fs = require("fs");
const fse = require("fs-extra");
const { isNumber, getData, postData, deleteData } = require("./functions/kernel");

/*(["01I7C0K8W8X8h720t1U9P123p6", "a1t7U0H8A8y877a0A1t9O05879", "a2c7i1G4e4C800o5J6l377C5Z7"]).map(db => {

    fs.readdirSync(`bracketDB/${db}`).map(collection => {

        if (collection === "__props__") return
        var chunk = {}
        
        fs.readdirSync(`bracketDB/${db}/${collection}`).map(doc => {

            if (doc === "__props__") return
            // get chunk
            chunk[doc.split(".")[0]] = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/${doc}`))
        })

        // sort
        var sort = Object.values(chunk).docs((a, b) => b.__props__.counter - a.__props__.counter).map(data => data.__props__.doc)
        var index1Props = {sort, find: []}, index1 = {}

        // index1
        if (db === "a1t7U0H8A8y877a0A1t9O05879") {

            index1Props.find = [
                {
                    find: ["__props__.id"],
                    doc: "index1"
                }
            ]

            Object.entries(chunk).map(([doc, data]) => {
                index1[doc] = { ["__props__.id"]: data.__props__.id }
            })
        }

        if (!fs.existsSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1`)) fs.mkdirSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1`)
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(index1Props, null, 4))
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/index1.json`, JSON.stringify(index1, null, 4))
    })
})*/

/*var path = "bracketDB/a1t7U0H8A8y877a0A1t9O05879/schema"
var find = {"sections.cards": true}

console.log(indexing);*/

/*fs.readdirSync(`bracketDB/a1t7U0H8A8y877a0A1t9O05879`).map(collection => {

    if (collection === "__props__") return
    var chunkProps = JSON.parse(fs.readFileSync(`bracketDB/a1t7U0H8A8y877a0A1t9O05879/${collection}/collection1/__props__/chunk1/__props__.json`))
    chunkProps.lastIndex = 0
    fs.writeFileSync(`bracketDB/a1t7U0H8A8y877a0A1t9O05879/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(chunkProps, null, 4))
})*/
/*(["01I7C0K8W8X8h720t1U9P123p6", "a1t7U0H8A8y877a0A1t9O05879", "a2c7i1G4e4C800o5J6l377C5Z7"]).map(db => {
    fs.readdirSync(`bracketDB/${db}`).map(collection => {

        if (collection === "__props__" || db === "a1t7U0H8A8y877a0A1t9O05879") return
        var chunkProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`))
        chunkProps.lastIndex = -1
        if (fs.existsSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/index1.json`)) fs.rmSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/index1.json`)
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(chunkProps, null, 4))
    })
})*/
/////////// create chunk query function: create chunk according to search request where chunk is a directory and search keynames are the docname(ex: key1:key2) while the chunk only contains doc:{key1:value,key2:value}
/////////// then read from chunk and return from docs by doc names
/////////// then save to both chunk and docs (push to docs sequence)
/////////// then delete from both chunk and docs
/////////// then ...

/*(["01I7C0K8W8X8h720t1U9P123p6", "a1t7U0H8A8y877a0A1t9O05879", "a2c7i1G4e4C800o5J6l377C5Z7"]).map(db => {

    fs.readdirSync(`bracketDB/${db}`).map(collection => {

        if (collection === "__props__") return
        
        fs.mkdirSync(`bracketDB/${db}/${collection}//collection1`)
        fs.readdirSync(`bracketDB/${db}/${collection}`).map(doc => {
            if (doc === "/collection1") return
            fse.moveSync(`bracketDB/${db}/${collection}/${doc}`, `bracketDB/${db}/${collection}/collection1/${doc}`)
        })
        fs.mkdirSync(`bracketDB/${db}/${collection}/__props__`)

        var collectionsProps = {
            lastCollection: 0
        }
        fs.writeFileSync(`bracketDB/${db}/${collection}/__props__/__props__.json`, JSON.stringify(collectionsProps))
    })
})*/
/*
(["01I7C0K8W8X8h720t1U9P123p6", "a1t7U0H8A8y877a0A1t9O05879", "a2c7i1G4e4C800o5J6l377C5Z7"]).map(db => {

    fs.readdirSync(`bracketDB/${db}`).map(collection => {

        if (collection === "__props__") return
        var chunkProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`))
        var collectionProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`))
        collectionProps.indexes = chunkProps.indexes
        collectionProps.lastIndex = chunkProps.lastIndex
        chunkProps.indexes = []
        delete chunkProps.lastIndex
        delete collectionProps.chunks

        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps))
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(chunkProps))
        /*
        var docs = fs.readdirSync(`bracketDB/${db}/${collection}/collection1`)
        docs.splice(docs.indexOf("__props__"), 1)
        docs = docs.map(doc => doc.split(".json")[0])
        chunkProps.docs = docs
        chunkProps.indexes = chunkProps.indexes || []
        chunkProps.lastIndex = chunkProps.lastIndex === undefined ? -1 : chunkProps.lastIndex
        chunkProps.docsLength = chunkProps.docs.length
        var size = 0
        for (let index = 0; index < chunkProps.docsLength; index++) {
            var data = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/${chunkProps.docs[index]}.json`))
            size += JSON.stringify(data).length
        }
        chunkProps.size = size
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(chunkProps))*/
        /*if (fs.existsSync(`bracketDB/${db}/${collection}/collection0`)) fse.moveSync(`bracketDB/${db}/${collection}/collection0`, `bracketDB/${db}/${collection}/collection1`)
        //fs.rmSync(`bracketDB/${db}/${collection}/collection0`)
        fse.moveSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk0`, `bracketDB/${db}/${collection}/collection1/__props__/chunk1`)
        //fs.rmSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk0`)*/
        /*var chunkProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`))
        var collectionProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`))
        var collectionsProps = JSON.parse(fs.readFileSync(`bracketDB/${db}/${collection}/__props__/__props__.json`))
        delete chunkProps.lastChunk
        collectionProps.lastChunk = 1
        delete collectionProps.lastCollection
        collectionsProps.lastCollection = 1
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(chunkProps, null, 4))
        fs.writeFileSync(`bracketDB/${db}/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))
        fs.writeFileSync(`bracketDB/${db}/${collection}/__props__/__props__.json`, JSON.stringify(collectionsProps, null, 4))
        if (fs.existsSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/index0.json`)) fse.moveSync(`bracketDB/${db}/${collection}/collection1/__props__/chunk1/index0.json`, `bracketDB/${db}/${collection}/collection1/__props__/chunk1/index1.json`)*/
    /*})
})
*/
/*
var timer = new Date().getTime()
getData({ search: { db: "a1t7U0H8A8y877a0A1t9O05879", collection: "test", find: { '__props__.counter': {lte: 2} }, limit: 10 } }).then(res => console.log(res.data, new Date().getTime() - timer))
*/
/*
const tt = async () => {
for (let index = 0; index < 10000; index++) {
    const data = {
        "port": [
            2080 + index
        ],
        "subdomain": "acc" + index,
        "localhost": "acc.localhost" + index,
        "active": true,
        "private": true,
        "publicID": "1rgwB078m8x8qhgrT5X949d858" + index
    };
    
    await postData({ save: { db: "a1t7U0H8A8y877a0A1t9O05879", collection: "test", data }})
}
}
tt()
*/
/*
var timer = new Date().getTime()
postData({ save: { db: "a1t7U0H8A8y877a0A1t9O05879", collection: "test", data: {
    "port": [
        83
    ],
    "subdomain": "acc",
    "localhost": "acc.localhost",
    "active": true,
    "private": true,
    "publicID": "1rgwB078m8x8qhgrT5X949d858"
} }}).then(() => {console.log(new Date().getTime() - timer);})
*/
/*
var timer = new Date().getTime()
deleteData({ erase: { db: "a1t7U0H8A8y877a0A1t9O05879", collection: "test", doc: "test4" } }).then(res => console.log(res, new Date().getTime() - timer))
*/
/*
fs.readdirSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6`).map(collection => {
    
    if (collection === "__props__") return
    fs.mkdirSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/__props__`)
    fs.mkdirSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/collection1`)
    fs.mkdirSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/collection1/__props__`)
    fs.mkdirSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/collection1/__props__/chunk1`)

    var chunkProps = { docs: [], chunk: "chunk1", docsLength: 0, size: 0 }
    var collectionProps = JSON.parse(fs.readFileSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/__props__.json`))
    delete collectionProps.chunkMaxSizeMB
    delete collectionProps.chunks

    collectionProps = {
        ...collectionProps,
        collection,
        maxSize: 1000,
        lastChunk: 1,
        collection: 1,
        indexes: [],
        lastIndex: 0
    }
    var headProps = {lastCollection: 1}

    // docs
    var data = JSON.parse(fs.readFileSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/chunk0.json`))

    Object.entries(data).map(([doc, data]) => {

        if (collection === "__props__") return
        chunkProps.size += JSON.stringify(data).length
        chunkProps.docsLength += 1
        chunkProps.docs.unshift(doc)

        data.__props__.collection = collection
        data.__props__.chunk = "chunk1"
        fs.writeFileSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/collection1/${doc}.json`, JSON.stringify(data, null, 4))
    })

    // chunk props
    fs.writeFileSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/collection1/__props__/chunk1/__props__.json`, JSON.stringify(chunkProps, null, 4))

    // collection props
    fs.writeFileSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/collection1/__props__/__props__.json`, JSON.stringify(collectionProps, null, 4))

    // head props
    fs.writeFileSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/__props__/__props__.json`, JSON.stringify(headProps, null, 4))

    // remove
    fs.rmSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/__props__.json`)
    fs.rmSync(`bracketDB/01I7C0K8W8X8h720t1U9P123p6/${collection}/chunk0.json`)
})
*/