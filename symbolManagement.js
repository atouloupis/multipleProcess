module.exports.run = run;
var api = require('./getRestFull');
var mongoDb = require('./mongoDb');
var schedule = require('node-schedule');
var collectionName = "symbol";
var mongoClient = require('mongodb').MongoClient;
var urlOrderBook = "mongodb://localhost:27017/orderBook";

function run()
{
deleteQuery = {symbol:symbol};
mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
dbase = db.db("orderBook");
    mongoDb.createCollection(dbase,collectionName, function() {
        api.getHitBTC("/api/2/public/symbol", "GET", function(err, symbol) {
            if (err) throw err;
            mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
                mongoDb.insertCollection(dbase,collectionName, symbol, function() {
                    mongoDb.createIndex(dbase,collectionName, "{id:1}", function() {});
                });
            });
        });
        schedule.scheduleJob('*/5 * * * *', function() {
            api.getHitBTC("/api/2/public/symbol", "GET", function(err, symbol) {
                if (err) console.log(err);
                else {
                    mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
                        mongoDb.insertCollection(dbase,collectionName, symbol, function() {});
                    });
                }
            });
        });

    });
});

}