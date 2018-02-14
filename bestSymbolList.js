var api = require('./getRestFull');

api.getHitBTC("/api/2/public/ticker","get",function (err,allSymbols) {
var diffPerc = 0;
for (var i=0;i<allSymbols.length;i++)
	{
	diffPerc=((allSymbols[i].ask/allSymbols[i].bid)-1)*100;
	var regex = /ETH/;
	if (diffPerc >10 && (allSymbols[i].symbol.search(regex))>-1 && allSymbols[i].volumeQuote>5) 
	{
	// console.log(diffPerc);
	console.log("{'symbol':'"+allSymbols[i].symbol+"'},");
	}
	}
});
