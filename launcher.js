#!/usr/bin/env node

var configfile = './config.json';
var jsonfile = require('jsonfile');
var activeOrders=require('./activeOrdersManagement');
var orderBook=require('./orderBookManagement');
var symbol=require('./symbolManagement');
var trades=require('./tradesManagement');
var ticker=require('./tickerManagement');

activeOrders.run();
symbol.run();

jsonfile.readFile(configfile, function(err, obj) {
    if (err) throw err;
		for (i=0;i<obj.length;i++)
	{
	orderBook.run(obj[i].symbol);
	trades.run(obj[i].symbol);
	ticker.run(obj[i].symbol);
	}
	});