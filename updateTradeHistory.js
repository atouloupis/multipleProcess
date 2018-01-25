module.exports.newTradeHistory = newTradeHistory;
var mongoDb = require('./mongoDb');
var collectionName = "tradeHistory";
var queryInsert=[];

function newTradeHistory(dbase,frame,method) {
if (method == "snapshotTrades") {
	console.log(frame.symbol);
	deleteQuery = {symbol:frame.symbol};
        mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
        for (var i = 0; i < frame.data.length; i++) {
            queryInsert.push({id:frame.data[i].id, price:frame.data[i].price, quantity:frame.data[i].quantity, side:frame.data[i].side, timestamp:frame.data[i].timestamp, symbol:frame.symbol});
        }
		if (i==frame.data.length){
		console.log("insert");
		mongoDb.insertCollection(dbase,collectionName, queryInsert, function() {
		mongoDb.createIndex(dbase,collectionName,"{symbol:1,timestamp:-1}",function(){});
		});
		}
	});
}
else {
console.log("ELSE : "+method)
        for (var i = 0; i < frame.data.length; i++) {
            var queryUpdate = {id:frame.data[i].id, price:frame.data[i].price, quantity:frame.data[i].quantity, side:frame.data[i].side, timestamp:frame.data[i].timestamp, symbol:frame.symbol};
            mongoDb.updateCollection(dbase,collectionName, queryUpdate, {$set:queryUpdate}, function () {});
        }
	}
	
}