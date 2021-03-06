var updtOrders = require('./updateActiveOrders');
var updateTradeHistory = require('./updateTradeHistory');
var checkOrder = require('./checkOrder');
var orderBook = require('./orderBook');
var transfer = require('./transferCoin');

module.exports.splitFrame = splitFrame;

function splitFrame(dbase,jsonFrame) {
 
        jsonFrame = JSON.parse(jsonFrame);
        if (jsonFrame.method == "ticker") {
		// console.time("hasAnOrder");
            checkOrder.hasAnOrder(dbase,jsonFrame,function(){
			// console.timeEnd("hasAnOrder");
			});
        }
        if (jsonFrame.method == "snapshotTrades" | jsonFrame.method == "updateTrades") {
            var tradeHistoryParams = jsonFrame.params;
            if (tradeHistoryParams != "undefined") {
                updateTradeHistory.newTradeHistory(dbase,tradeHistoryParams,jsonFrame.method);
            }
        }
        if (jsonFrame.method == "activeOrders" | jsonFrame.method == "report") {
            var reportsParams = jsonFrame.params;
            if (reportsParams != "undefined") {
			// console.time("newActiveOrders");
                updtOrders.newActiveOrders(dbase,reportsParams,function(){
				// console.timeEnd("newActiveOrders");
				});
            }
        }
        if (jsonFrame.method == "updateOrderbook" | jsonFrame.method == "snapshotOrderbook") {
            var orderBookParams = jsonFrame.params;
			// console.time("updateOrderbook");
            orderBook.updateOrderBook(dbase,orderBookParams, jsonFrame.method, function (termine) {
			// console.timeEnd("updateOrderbook");
            });
			
        }
        if (jsonFrame.id == "tradingBalance") {
            var tradingBalanceResult = jsonFrame.result;
            transfer.checkCoinWithdraw(tradingBalanceResult, function () {
            });
        }
    if (jsonFrame.id == "456") {
console.log(jsonFrame);
    }
}