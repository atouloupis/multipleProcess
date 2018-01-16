var schedule = require('node-schedule');
var mongoDb = require('./mongoDb');
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var keyfile = './key.json';
var mongoClient = require('mongodb').MongoClient;
var collectionName = "activeOrders";

var rqstReport = {
    "method": "subscribeReports",
    "params": {}
};

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    exports.dbase = db.db("orderBook");

    mongoDb.createCollection(dbase,collectionName, function() {
        mongoDb.dropCollection(dbase,collectionName, function() {

            jsonfile.readFile(keyfile, function(err, obj) {
                if (err) throw err;
                var rqstAuth = {
                    "method": "login",
                    "params": {
                        "algo": "BASIC",
                        "pKey": obj.hitbtc.pKey,
                        "sKey": obj.hitbtc.sKey
                    }
                };

                wsCall.webSocketCall(rqstReport, rqstAuth);

                var j = schedule.scheduleJob('*/30 * * * * *', function() {
                    get.getHitBTC("/api/2/order", "GET", function(err, activeOrder) {
                        if (err) throw err;
                        if (activeOrder.length != 0) {
                            console.log("newOrder")
                            mongoDb.dropCollection(dbase,collectionName, function() {
                                mongoDb.insertCollection(dbase,collectionName, activeOrder, function() {
                                    mongoDb.createIndex(dbase,collectionName, "{symbol:1}", function() {});
                                });
                            });
                        }
                    });
                });

            });

        });
    });
});