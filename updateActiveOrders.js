module.exports.newActiveOrders = newActiveOrders;
var mongoDb = require('./mongoDb');
var get = require('./getRestFull')
var date1 = new Date;
var dbase = require('./activeOrdersManagement').dbase

function newActiveOrders(frame,callback) {
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
            var queryUpdate = {"clientOrderId": frame.clientOrderId};
            var newValue = frame;
            mongoDb.updateCollection(dbase,collectionName, queryUpdate, {$set: newValue}, function () {
                mongoDb.createIndex(dbase,collectionName,"{symbol:1,clientOrderId:1}",function(){
				callback();
				});
            });
        }
}