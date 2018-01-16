var mongoDb = require('./mongoDb');
module.exports.updateOrderBook = updateOrderBook;

function updateOrderBook(dbase,orderBookFrame, method, callbackMain) {
    var collectionName = "orderBookFrame";
    var symbol = orderBookFrame.symbol;
    //Si methode = snapshotOrderbook, supprime et remplace toutes les valeurs pour ce symbol
    if (method == "snapshotOrderbook") {
        deleteQuery = JSON.parse('{ "symbol" : "' + symbol + '" }');
        mongoDb.deleteRecords(dbase,collectionName, deleteQuery, function() {
            //D�couper la trame pour respecter format
            //D�coupe de ask et enregistrement
            //Appel de la fonction d'ajout des ASK à partir d'un snapshot
            snapshotAddAsk(orderBookFrame, function(log) {
                //console.log(log);
                //D�coupe de bid et enregistrement
                //sendToWeb();
                callbackMain("FINISH1");
            });
        });
    } else {
        // R�cup�rer donn�es dans Mongo

        /////////////////////////////Pour les Bid/ask ////////////////
        insertOrReplace(orderBookFrame, function() {
            // sendToWeb();
            callbackMain("FINISH2");
        });
    }
}

    function snapshotAddAsk(orderBookFrame, callback) {
        if (orderBookFrame.ask.length < 1 || orderBookFrame.bid.length < 1) callback("snapshotFinish1");
        var objAdd = [];

        for (var i = 0; i < orderBookFrame.ask.length; i++) {
            objAdd.push({
                symbol: orderBookFrame.symbol,
                way: "ask",
                params: orderBookFrame.ask[i]
            });
        }
        for (var i = 0; i < orderBookFrame.bid.length; i++) {
            objAdd.push({
                symbol: orderBookFrame.symbol,
                way: "bid",
                params: orderBookFrame.bid[i]
            });
        }
        mongoDb.insertCollection(dbase,collectionName, objAdd, function() {
            mongoDb.createIndex(dbase,collectionName, "{symbol:1,way:-1}", function() {});
            callback("snapshotFinish2");
        });

    }

    function insertOrReplace(orderBookFrame, callback) {

        if (typeof orderBookFrame.bid[0] != "undefined") {
            var queryBid = {
                symbol: orderBookFrame.symbol,
                way: "bid",
                "params.price": orderBookFrame.bid[0].price
            };

            var newEntryBid = {
                $set: {
                    symbol: orderBookFrame.symbol,
                    way: "bid",
                    params: {
                        price: orderBookFrame.bid[0].price,
                        size: orderBookFrame.bid[0].size
                    }
                }
            };
            mongoDb.updateCollection(dbase,collectionName, queryBid, newEntryBid, function() {
                mongoDb.createIndex(dbase,collectionName, "{symbol:1,way:-1}", function() {});
                callback();
            });
        } else if (typeof orderBookFrame.ask[0] != "undefined") {
            var queryAsk = {
                symbol: orderBookFrame.symbol,
                way: "ask",
                "params.price": orderBookFrame.ask[0].price
            };
            var newEntryAsk = {
                $set: {
                    symbol: orderBookFrame.symbol,
                    way: "ask",
                    params: {
                        price: orderBookFrame.ask[0].price,
                        size: orderBookFrame.ask[0].size
                    }
                }
            };
            mongoDb.updateCollection(dbase,collectionName, queryAsk, newEntryAsk, function() {
                mongoDb.createIndex(dbase,collectionName, "{symbol:1,way:-1}", function() {});
                callback();
            });

        } else {
            callback();
        }
    }
	