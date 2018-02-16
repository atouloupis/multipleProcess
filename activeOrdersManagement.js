module.exports.run = run;
var schedule = require('node-schedule');
var mongoDb = require('./mongoDb');
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var collectionName = "activeOrders";
var api = require('./getRestFull');

var rqstReport = [{
    "method": "subscribeReports",
    "params": {}
}];

function run()
{
	deleteQuery = {};
mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");

    mongoDb.createCollection(dbase,collectionName, function() {
            mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
                var scheduler = null;
                wsCall.webSocketCall(dbase,rqstReport,scheduler);

                var j = schedule.scheduleJob('*/55 * * * * *', function() {
                    api.getHitBTC("/api/2/order", "GET", function(err, activeOrder) {
                        if (err) console.log (err);
                        else if (activeOrder.length != 0) {
                            console.log("newOrder");
							console.log(activeOrder);
							    //mongoDb.createCollection(dbase,collectionName, function() {
                                    mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
                                mongoDb.insertCollection(dbase,collectionName, activeOrder, function() {
                                    mongoDb.createIndex(dbase,collectionName, "{symbol:1,clientOrderId:1}", function() {});
									});
                                });
                            //});
                        }
                    });
                });

            });

        });
    });
}