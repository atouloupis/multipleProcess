var mongoDb = require('./mongoDb');

var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var configfile = './config.json';
var jsonfile = require('jsonfile');

jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
    var symbol = obj.symbol;

    var rqstSnapshotTrades = {
        "method": "subscribeTrades",
        "params": {
            "symbol": symbol
        },
        "id": 123
    };
    var rqstAuth = null;

    mongoClient.connect(urlOrderBook, function (err, db) {
        if (err) throw err;
        dbase = db.db("orderBook");

        mongoDb.createCollection(dbase, "tradeHistory", function () {
            mongoDb.dropCollection(dbase, "tradeHistory", function () {

                wsCall.webSocketCall(dbase, rqstSnapshotTrades, rqstAuth);
            });
        });
    });
});