var mongoDb = require('./mongoDb');

var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var configfile = './config.json';
var jsonfile = require('jsonfile');
var rqstSnapshotTrades=[];
    mongoClient.connect(urlOrderBook, function (err, db) {
        if (err) throw err;
        dbase = db.db("orderBook");

        mongoDb.createCollection(dbase, "tradeHistory", function () {
            mongoDb.dropCollection(dbase, "tradeHistory", function () {

jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
		for (i=0;i<obj.length;i++)
	{
    rqstSnapshotTrades[i] = {
        "method": "subscribeTrades",
        "params": {
            "symbol": obj[i].symbol
        },
        "id": 123
    };
    var rqstAuth = null;
                wsCall.webSocketCall(dbase, rqstSnapshotTrades[i], rqstAuth);
            }
			});
        });
    });

});