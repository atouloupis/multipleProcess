module.exports.newActiveOrders = newActiveOrders;
var mongoDb = require('./mongoDb');

function newActiveOrders(dbase,frame,callback) {
    var collectionName = "activeOrders";

        for (var i = 0; i < frame.length; i++) {
            var queryUpdate = {"clientOrderId": frame[i].clientOrderId};
            var newValue = frame[i];
            mongoDb.updateCollection(dbase,collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(dbase,collectionName,"{symbol:1,clientOrderId:1}",function(){
				callback();
				});
            });
        }
        if (frame.length==undefined)
        {
		console.log("frame.length = undefined");
		console.log(frame);
            var queryUpdate = {"clientOrderId": frame.clientOrderId};
            var newValue = frame;
            mongoDb.updateCollection(dbase,collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(dbase,collectionName,"{symbol:1,clientOrderId:1}",function(){
				callback();
				});
            });
        }
}