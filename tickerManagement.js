var symbol = 'NETETH';
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;

var rqstTicker = {
    "method": "subscribeTicker",
    "params": {
        "symbol": symbol
    },
    "id": 123
};

var rqstAuth = null;

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    exports.dbase = db.db("orderBook");

    wsCall.webSocketCall(rqstTicker, rqstAuth);
});