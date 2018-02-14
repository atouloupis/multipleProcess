module.exports.hasAnOrder = hasAnOrder;
var treatmentOnOrder = require('./treatmentOnOrder');
var get = require('./getReportsActiveOrders');
var eligibility = require('./eligibility');
var mongoDb = require('./mongoDb');
var symbolDate = {};


function hasAnOrder(dbase,tickerFrame, callback) {
    var symbol = tickerFrame.params.symbol;
    var date = new Date;
    if (date - symbolDate[symbol] > 5000 || symbolDate[symbol] === undefined) {
        symbolDate[symbol] = new Date;
        get.getActiveOrders(dbase,tickerFrame.params.symbol, function(activeOrder) {
            if (activeOrder.length>0) {
					console.log("activeOrder checkorder.js");
			console.log(activeOrder);
                activeSellOrBuy(activeOrder, tickerFrame.params, function() {
                    callback();
                });
                // console.log("activeOrder status not undefined");
            } else {
                eligibility.eligibilityBuy(dbase,tickerFrame.params, function() {
                    callback();
                });
                // console.log("activeOrder undefined");
            } //vérifier si on lance un ordre d'achat sur cette monnaie
        });
    } else {
        callback();
    }
}

function activeSellOrBuy(order, ticker, callback) {
console.log("order side :"+order.side);
    if (order.side === "sell") {
        var diff = orderThanMarket(order, ticker, "bid");
        orderBookVolumes(order, "ask", function(volume) {
            console.log("orderBookVolumes");
            console.log(order);
            console.log("volume");
            console.log(volume);
            //console.log("diff"+diff)
            //Si la diff entre notre ordre de vente et le ticker d'achat bid est inf 1% alors vendre au prix
            if (diff < -1) {
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                treatmentOnOrder.placeOrder(order.symbol, "sell", "market", "", order.quantity);
                callback();
            }
            //console.log("ticker ask")
            //console.log(ticker.ask)
            //console.log("order price")
            else if (ticker.ask > order.price) {
                callback();
                //stopScript, on continue;
                //console.log(order.price)
                //sinon est ce que le volume de l'orderbook ask inf+orderbook égal a mon ordre est supérieur de 10 fois la quantité de mon ordre
            } else if ((volume.inf + volume.equal) > 10 * order.quantity) {
                //Si oui on annule l'ordre et on appelle l'eligibilité
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                //console.log("order quantity")
                //console.log( order.quantity)
                eligibility.eligibilitySell(dbase,ticker, function() {
                    callback();
                }); //vérifier si on lance un ordre de vente sur cette monnaie
                //Si non, on continue
            } else {
                callback();
            }
        });
    } else if (order.side === "buy") {
        var diff = orderThanMarket(order, ticker, "ask");
		console.log (diff);
        orderBookVolumes(order, "bid", function(volume) {
            //SI diff entre notre ordre d'achat et le ticker de vente ask  inf 1% alors annuler l'ordre
            console.log("tick bid" + ticker.bid + "order price" + order.price);
            console.log("volume inf =" + volume.inf + " volume equal =" + volume.equal + " order quantity =" + order.quantity);

            if (diff < 1) {
			console.log("DIFF < 1");
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                eligibility.eligibilityBuy(dbase,ticker, function() {
				console.log("END OF CANCEL/BUY");
                    callback();
                    return;
                }); //vérifier si on lance un ordre de vente sur cette monnaie
            }
            //Sinon est ce que le ticker d'achat bid est inférieur à mon ordre d'achat
            else if (ticker.bid < (order.price-(0.005*order.price))) {
                console.log("TICKER BID < ORDER PRICE - 5%");
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                eligibility.eligibilityBuy(dbase,ticker, function() {
                    console.log("END OF CANCEL/BUY");
                    callback();
                    return;
                }); //vérifier si on lance un ordre de vente sur cette monnaie
            } //Si oui on continue
            else if (ticker.bid < order.price) {
			console.log("TICK BID < ORDER PRICE");
                callback();
                return;
            } //Si oui on continue
            //Sinon est ce que le volume de l'orderbook bid inf a mon ordre est supérieur de X% au volume total
            else if ((volume.inf + volume.equal) > 10 * order.quantity) {
                //Si oui on annule mon ordre
				console.log("VOLUME INF + VOLUME EQUAL > 10* QUANTITY");
				console.log(volume);
                treatmentOnOrder.cancelOrder(order.clientOrderId);
                eligibility.eligibilityBuy(dbase,ticker, function() {
                    callback();
                    return;
                }); //vérifier si on lance un ordre de vente sur cette monnaie
            }
            //Si non, on continue
            else {
                callback();
            }
        });
    } else {
        callback();
    }
}

//Actual order compared to the market, higher or lower than a specified X%age.
//orderSide = buy or sell, marketSide= ask or bid, gapSide = positive or negative
function orderThanMarket(order, ticker, marketSide) {
    if (marketSide === "bid") var diff = ((ticker.bid / order.price) - 1) * 100;
    else if (marketSide === "ask") var diff = ((ticker.ask / order.price) - 1) * 100;
    else {}
    console.log("diff ask =" + ticker.ask+"/"+order.price);
    return diff;
}

function orderBookVolumes(order, marketSide, callback) {
    //volume orderbook ask devant le order sell superieur a x% du volume orderbook ask global alors cancel le order sell
    var query = {
        symbol: order.symbol,
        way: marketSide
    };
    mongoDb.findRecords(dbase,"orderBookFrame", query, {
        _id: -1
    }, function(message) {
        var totalVolume = 0;
        var volInfOrder = 0;
        var volSupOrder = 0;
        var volEqualOrder = 0;
        for (var i = 0; i < message.length; i++) {
            if (message[i].params.size != 0.00) {
                totalVolume = totalVolume + parseFloat(message[i].params.size);
                if (marketSide==="bid") {
                    if (message[i].params.price > order.price) {
                        volInfOrder += parseFloat(message[i].params.size);
console.log(message[i].params.price)
                       console.log(message[i].params.size)
                    }
                    else if (message[i].params.price === order.price) volEqualOrder += parseFloat(message[i].params.size);
                    else if (message[i].params.price < order.price) volSupOrder += parseFloat(message[i].params.size);
                }
                else if (marketSide==="ask") {
                    if (message[i].params.price < order.price) volInfOrder += parseFloat(message[i].params.size);
                    else if (message[i].params.price === order.price) volEqualOrder += parseFloat(message[i].params.size);
                    else if (message[i].params.price > order.price) volSupOrder += parseFloat(message[i].params.size);
                }
            }
        }
        console.log("totalVolume =" +totalVolume+"volInfOrder"+volInfOrder+"volEqualOrder"+volEqualOrder+"volSupOrder"+volSupOrder);
        callback({
            "total": totalVolume,
            "inf": volInfOrder,
            "equal": volEqualOrder,
            "sup": volSupOrder
        });
    });
}