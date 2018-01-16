var symbol = 'NETETH';
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var keyfile = './key.json';
var jsonfile = require('jsonfile');

var rqstTicker = {
    "method": "subscribeTicker",
    "params": {
        "symbol": symbol
    },
    "id": 123
};

mongoClient.connect(urlOrderBook, function(err, db) {
    if (err) throw err;
    dbase = db.db("orderBook");
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
    wsCall.webSocketCall(dbase,rqstTicker, rqstAuth);
	
	});
});