var schedule = require('node-schedule');
var mongoDb = require('./mongoDb');
var configfile = './config.json';
var jsonfile = require('jsonfile');
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var rqstOrderBook = [];
    mongoClient.connect(urlOrderBook, function (err, db) {
        if (err) throw err;
        dbase = db.db("orderBook");
        mongoDb.createCollection(dbase, "orderBookFrame", function () {
            mongoDb.dropCollection(dbase, "orderBookFrame", function () {

jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
	for (i=0;i<obj.length;i++)
	{
    rqstOrderBook[i] = {
        "method": "subscribeOrderbook",
        "params": {
            "symbol": obj[i].symbol
        },
        "id": 123
    };
    }
	var rqstAuth = null;
	
                var j = schedule.scheduleJob('*/20 * * * * *', function () {
				console.log("scheduled request orderBook");
				console.log(rqstOrderBook);
                    wsCall.webSocketCall(dbase, rqstOrderBook, rqstAuth);
                });
                wsCall.webSocketCall(dbase, rqstOrderBook, rqstAuth);

            });
        });
    });

});