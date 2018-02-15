module.exports.run = run;
var mongoDb = require('./mongoDb');
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var rqstSnapshotTrades=[];

function run(symbol)
{
    mongoClient.connect(urlOrderBook, function (err, db) {
        if (err) throw err;
        dbase = db.db("orderBook");

        mongoDb.createCollection(dbase, "tradeHistory", function () {
            mongoDb.dropCollection(dbase, "tradeHistory", function () {


    rqstSnapshotTrades[i] = {
        "method": "subscribeTrades",
        "params": {
            "symbol": symbol
        },
        "id": 123
    };
    
    var scheduler = null;
    //var scheduler="*/5 * * * *";
                wsCall.webSocketCall(dbase, rqstSnapshotTrades,scheduler);
			});
        });
});
}