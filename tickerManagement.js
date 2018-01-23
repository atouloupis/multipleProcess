var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var keyfile = './key.json';
var configfile = './config.json';
var jsonfile = require('jsonfile');
var rqstTicker;
var symbol=[];
mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");
jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
		for (i=0;i<obj.length;i++)
	{
	console.log(obj.length);
	symbol[i]=obj[i].symbol;
rqstTicker = {
    "method": "subscribeTicker",
    "params": {
        "symbol": symbol[i]
    },
    "id": 123
};
console.log(rqstTicker);
console.log(i);
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
				console.log(rqstTicker);
    wsCall.webSocketCall(dbase,rqstTicker, rqstAuth);
			});
		}
});
});