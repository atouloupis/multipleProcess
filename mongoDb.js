module.exports.insertCollection = insertMongoCollection;
module.exports.deleteRecords = deleteMany;
module.exports.findRecords = find;
module.exports.updateCollection = update;
module.exports.dropCollection=drop;
module.exports.count = count;
module.exports.createIndex = createIndex;
module.exports.createCollection = createCollection;



function createCollection (dbase,collectionName,callback) {
    dbase.createCollection(collectionName, function (err, res) {
        if (err) throw err;
        callback(res);
    });
}

function insertMongoCollection(dbase,collectionName, myObj, callback) {
    console.log(collectionName)
	dbase.collection(collectionName).insertMany(myObj, function(err, res) {
        if (err) throw err;
        callback(res);
    });
}

function deleteMany(dbase,collectioName, query, callback) {
    dbase.collection(collectioName).deleteMany(query, function(err, obj) {
        if (err) throw err;
        callback(obj);
    });

}

function find(dbase,collectionName, query, sort, callback) {
	dbase.collection(collectionName).find(query).sort(sort).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
    });
}


function update(dbase,collectionName, query, newValues, callback) {
	
	dbase.collection(collectionName).updateOne(query, newValues, {upsert:true}, function(err, res) {
        if (err) throw err;
        callback(res);
    });
}

function drop(dbase,collectionName, callback) {
    dbase.dropCollection(collectionName, function(err) {
        if (err) throw err;
        console.log("drop collection name");
        console.log(collectionName);
        callback();
    });
}

function count(dbase,collectionName, callback) {
    dbase.collection(collectionName).count(function(err, res) {
        if (err) throw err;
        callback(res);
    });
}

function createIndex(dbase,collectionName,index, callback){
    dbase.collection(collectionName).ensureIndex(index,function(err,res){
        if (err) throw err;
        callback(res);
    });
}