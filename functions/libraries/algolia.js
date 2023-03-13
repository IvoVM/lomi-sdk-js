const algoliasearch = require('algoliasearch')
const client = algoliasearch('R7PUY5XVQS', 'a2c0594de862699edc3960c307f302e2')

function saveRecordToAlgolia(record){
    record = { ...record, objectID: record.id }
    const index = client.initIndex('name')
    return index.saveObject(record).wait()
}

function updateRecordToAlgolia(record){
    record = { ...record, objectID: record.id }
    const index = client.initIndex('name')
    return index.partialUpdateObject(record).wait()
}


module.exports = {
    saveRecordToAlgolia,
    updateRecordToAlgolia
}