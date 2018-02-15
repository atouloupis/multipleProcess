module.exports.run = run;
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var rqstTicker=[];

function run(symbol)
{

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");
	rqstTicker.push(
	{
    "method": "subscribeTicker",
    "params": {
        "symbol": symbol
    },
    "id": 123
});
var scheduler=null;
wsCall.webSocketCall(dbase,rqstTicker,scheduler);

});
}