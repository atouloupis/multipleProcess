var schedule = require('node-schedule');
var mongoDb = require('./mongoDb');
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var keyfile = './key.json';
var jsonfile = require('jsonfile');
var mongoClient = require('mongodb').MongoClient;
var collectionName = "activeOrders";
var api = require('./getRestFull');

var rqstReport = {
    "method": "subscribeReports",
    "params": {}
};

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");

    mongoDb.createCollection(dbase,collectionName, function() {
        mongoDb.dropCollection(dbase,collectionName, function() {

            jsonfile.readFile(keyfile, function(err, obj) {
                if (err) throw err;
				console.log(obj);
				console.log(obj.hitbtc.sKey);
                var rqstAuth = {
                    "method": "login",
                    "params": {
                        "algo": "BASIC",
                        "pKey": obj.hitbtc.pKey,
                        "sKey": obj.hitbtc.sKey
                    }
                };

                wsCall.webSocketCall(dbase,rqstReport, rqstAuth);

                var j = schedule.scheduleJob('*/3 * * * * *', function() {
                    api.getHitBTC("/api/2/order", "GET", function(err, activeOrder) {
                        if (err) console.log (err);
                        else if (activeOrder.length != 0) {
                            console.log("newOrder");
							    mongoDb.createCollection(dbase,collectionName, function() {
                            mongoDb.dropCollection(dbase,collectionName, function() {
							console.log(activeOrder);
                                mongoDb.insertCollection(dbase,collectionName, activeOrder, function() {
                                    mongoDb.createIndex(dbase,collectionName, "{symbol:1}", function() {});
									});
                                });
                            });
                        }
                    });
                });

            });

        });
    });
});