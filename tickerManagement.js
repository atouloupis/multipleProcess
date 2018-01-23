var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var keyfile = './key.json';
var configfile = './config.json';
var jsonfile = require('jsonfile');
var rqstTicker =[];
mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");
jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
		for (i=0;i<obj.length;i++)
	{
	console.log(obj);
rqstTicker[i] = {
    "method": "subscribeTicker",
    "params": {
        "symbol": obj[i].symbol
    },
    "id": 123
};
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
				console.log(rqstTicker[i]);
    wsCall.webSocketCall(dbase,rqstTicker[i], rqstAuth);
	});
		}
});
});