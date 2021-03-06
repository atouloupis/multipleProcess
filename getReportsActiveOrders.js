module.exports.getActiveOrders = getActiveOrders;
module.exports.getLastBuyTrade = getLastBuyTrade;
module.exports.getLastTrades = getLastTrades;
var mongoDb = require('./mongoDb');
var api = require('./getRestFull');

function getActiveOrders (dbase,symbol,callback)
{
var collectionName="activeOrders";
var newOrders = [];
mongoDb.findRecords(dbase,collectionName,{"symbol":symbol},{_id: -1},function(allOrders){
    for (var i=0;i<allOrders.length;i++)
		{
		if (allOrders[i].status == "new" || allOrders[i].status == "partiallyFilled")
			{
			newOrders.push(allOrders[i]);
			}
		}
		if (i===allOrders.length) {
		callback (newOrders);
		}
		else if (allOrders.length===0)callback(newOrders);

	});
}


function getLastBuyTrade (dbase,symbol,callback)
{
api.getHitBTC("/api/2/history/trades","get",function (err,allOrders) {

	for (var i=0;i<allOrders.length;i++)
		{
		if (allOrders[i].side == "buy" && allOrders[i].symbol==symbol) 
			{
			// console.log("all order ID");
			// console.log(allOrders[i]);
			callback (allOrders[i]);
			break;
			}
		else if (i==allOrders.length)callback();
		}
    if (allOrders.length==0)callback();
});
}

function getLastTrades (dbase,symbol,number,callback)
{
var lastTrades=[];
var collectionName = "tradeHistory";
mongoDb.findRecords(dbase,collectionName,{"symbol":symbol},{timestamp: -1},function(allTrades){
	if (number>allTrades.length)callback(lastTrades);
	else{
	for (var i=0;i<number;i++)
		{
		if (allTrades[i].side == "sell") 
			{
			lastTrades.push(allTrades[i]);
			}
		}
        if (i==number)callback(lastTrades);
        if (number==0)callback(lastTrades);
	}
	});
}