var schedule = require('node-schedule');
var mongoDb = require('./mongoDb');
var symbol = 'NETETH';
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;

var rqstOrderBook = {
    "method": "subscribeOrderbook",
    "params": {
        "symbol": symbol
    },
    "id": 123
};
var rqstAuth = null;

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");
    mongoDb.createCollection(dbase,"orderBookFrame", function() {
        mongoDb.dropCollection(dbase,"orderBookFrame", function() {
            var j = schedule.scheduleJob('*/20 * * * * *', function() {
                wsCall.webSocketCall(dbase,rqstOrderBook, rqstAuth);
            });
            wsCall.webSocketCall(dbase,rqstOrderBook, rqstAuth);

        });
    });
});