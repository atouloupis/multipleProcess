

var rqstTicker = {
    "method": "subscribeTicker",
    "params": {
        "symbol": symbol
    },
    "id": 123
};

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;

mongoClient.connect(urlOrderBook, function (err, db) {
    if (err) throw err;
    exports.dbase = db.db("orderBook");

    mongoDb.createCollection("symbol", function () {


        var collectionName = "symbol";
        api.getHitBTC("/api/2/public/symbol", "GET", function (err, symbol) {
            if (err) throw err;
            console.log("wsClient1");
            mongoDb.dropCollection(collectionName, function () {

                mongoDb.insertCollection(collectionName, symbol, function () {

                    mongoDb.createIndex(collectionName, "{id:1}", function () {
                    });
                });
            });
        });


schedule.scheduleJob('*/5 * * * *', function () {
    api.getHitBTC("/api/2/public/symbol", "GET", function (err, symbol) {
        if (err) console.log(err);
        else {
            console.log("wsClient2");
            mongoDb.dropCollection(collectionName, function () {
                mongoDb.insertCollection(collectionName, symbol, function () {
                });
            });
        }
    });
});

webSocketCall(rqstTicker,rqstAuth);
    });
});
function webSocketCall(rqst,rqstAuth){
    ws.onopen = function () {

        ws.onerror = function (evt) {
        };

        ws.onmessage = function (evt) {
            treatment.splitFrame(evt.data);
            if (JSON.parse(evt.data).method=="snapshotOrderbook")
            {
                sendRequest(rqstAuth);
                sendRequest(rqstReport);
            }
            else if (JSON.parse(evt.data).method== "activeOrders") sendRequest(rqstSnapshotTrades);
            else if (JSON.parse(evt.data).method=="snapshotTrades")sendRequest(rqstTicker);
            else {}
        };

        function sendRequest(message) {
            ws.send(JSON.stringify(message));
        }
        sendRequest(rqstOrderBook);
        //update orderbook every 10 sec

    };
}