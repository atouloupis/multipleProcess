var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var configfile = './config.json';
var jsonfile = require('jsonfile');
var rqstTicker=[];

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");
jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
		for (i=0;i<obj.length;i++)
	{
	rqstTicker.push(
	{
    "method": "subscribeTicker",
    "params": {
        "symbol": obj[i].symbol
    },
    "id": 123
});
	}
	if (i===obj.length)
	{
                var scheduler=null;
wsCall.webSocketCall(dbase,rqstTicker,scheduler);
	}
			});
});
});