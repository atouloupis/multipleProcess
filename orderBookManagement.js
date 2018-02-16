module.exports.run = run;
var mongoDb = require('./mongoDb');
var urlOrderBook = "mongodb://localhost:27017/orderBook";
var wsCall = require('./wsCall');
var mongoClient = require('mongodb').MongoClient;
var rqstOrderBook = [];
var schedule = require('node-schedule');
var api = require('./getRestFull');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var collectionName="orderBookFrame";
exports.io = io;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

function run(symbol)
{
deleteQuery = {symbol:symbol};
    mongoClient.connect(urlOrderBook, function (err, db) {
        if (err) throw err;
        dbase = db.db("orderBook");
        mongoDb.createCollection(dbase, collectionName, function () {
            mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {

    rqstOrderBook[i] = {
        "method": "subscribeOrderbook",
        "params": {
            "symbol": symbol
        },
        "id": 123
    };

    var scheduler = null;
	//var scheduler = "*/1 * * * *";
                wsCall.webSocketCall(dbase, rqstOrderBook,scheduler);
    var j = schedule.scheduleJob('*/10 * * * * *', function() {
        importRest(symbol);
    });


        });
    });


    function importRest(symbol) {
            api.getHitBTC("/api/2/public/orderbook/"+symbol, "GET", function (err, orderBookFrame) {
                if (err) console.log(err);
                else if (orderBookFrame.ask===undefined)null;
                    else if (orderBookFrame.ask.length < 1 || orderBookFrame.bid.length < 1)null;
                    else {
                        var objAdd = [];
                        for (var i = 0; i < orderBookFrame.ask.length; i++) {
                            objAdd.push({
                                symbol: symbol,
                                way: "ask",
                                params: orderBookFrame.ask[i]
                            });
                        }
                        for (var k = 0; k < orderBookFrame.bid.length; k++) {
                            objAdd.push({
                                symbol: symbol,
                                way: "bid",
                                params: orderBookFrame.bid[k]
                            });
                        }

                        // mongoDb.createCollection(dbase, "orderBookFrame", function () {
                            mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
                                mongoDb.insertCollection(dbase, "orderBookFrame", objAdd, function () {
                                    mongoDb.createIndex(dbase, "orderBookFrame", "{symbol:1,way:-1}", function () {
                                    });
                                });

                            });
                        // });
                    }
            });
        

    }
    });
}
