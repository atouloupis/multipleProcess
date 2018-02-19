var api = require('./getRestFull');

api.getHitBTC("/api/2/public/ticker","get",function (err,allSymbols) {

var diffPerc = 0;
for (var i=0;i<allSymbols.length;i++)
	{
	var possibleToTrade =undefined;
	tradesTimer(allSymbols[i].symbol,function(possibleToTrade){});
	diffPerc=((allSymbols[i].ask/allSymbols[i].bid)-1)*100;
	var regex = /ETH/;
	if (possibleToTrade!=undefined)
	{
	if (diffPerc >2 && diffPerc<10 && (allSymbols[i].symbol.search(regex))>-1 && allSymbols[i].volumeQuote>5 && possibleToTrade)
	{
	// console.log(diffPerc);
	console.log('{"symbol":"'+allSymbols[i].symbol+'"},');
	}
	}
	}
});


function tradesTimer(symbol,callback){
	    var date = new Date;
    //récupérer les 50 derniers trades en vente
    var somme = 0;
	var lastTrades=[];
	
    api.getHitBTC("/api/2/public/trades/"+symbol+"?sort=DESC","get",function (err,allTrades) {
        //calcul moyenne temps de trade en vente si supérieur à 10 trades
			for (var i=0;i<50;i++)
		{
		if (allTrades[i].side == "sell") 
			{
			lastTrades.push(allTrades[i]);
			}
		}
		
		
		if (lastTrades.length > 10)
		{
        // console.log("lastTrades.length"+lastTrades.length);
        for (var i = 0; i < lastTrades.length - 1; i++) {
            somme += Date.parse(lastTrades[i].timestamp) - Date.parse(lastTrades[i + 1].timestamp);
        }
        var moyenne = somme / lastTrades.length; // moyenne dates de trade
        // console.log ("moyenne"+moyenne);
        //Si entre la date d'aujourd'hui et le dernier trade < 10 min et la moyenne des trades < 5 min et le nombre de trades de vente > 10 sur les 50 derniers
        if (Date.parse(date) - Date.parse(lastTrades[0].timestamp) < 600000 && moyenne < 300000) callback(true);
        else callback(false);
		}
		else callback(false);
    });
}