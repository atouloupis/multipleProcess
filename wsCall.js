var schedule = require('node-schedule');
var treatment = require('./treatmentFrame');
module.exports.webSocketCall = webSocketCall;
module.exports.sendRequest = sendRequest;
var keyfile = './key.json';
var jsonfile = require('jsonfile');
var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
var date=Date.now();
var a=0;
jsonfile.readFile(keyfile, function(err, obj) {
    if (err) throw err;
    var rqstAuth = {
        "method": "login",
        "params": {
            "algo": "BASIC",
            "pKey": obj.hitbtc.pKey,
            "sKey": obj.hitbtc.sKey
        }
    }
	ws.onopen = function() {
		console.log("CONNECTED");
			ws.onerror = function(evt) {
			console.log("error");
			console.log(evt);
			if (ws.readyState===3) {
			ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
			exports.ws = ws;
			}
			};
			ws.onclose= function(evt){
			console.log("closing");
			console.log(evt);
			ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
			exports.ws = ws;
			};
			ws.onmessage = function(evt) {
				treatment.splitFrame(dbase,evt.data);
			};
			sendRequest(rqstAuth, function() {});
	};
});

function webSocketCall(dbase,rqst,scheduler) {
            for (var i=0;i<rqst.length;i++) {

                sendRequest(rqst[i], function () {});
            }
    
			if (scheduler != null)
		{
			schedule.scheduleJob(scheduler, function () {
            for (var i=0;i<rqst.length;i++) {
                sendRequest(rqst[i], function () {});
        }
			});
		}
	}

function waitForSocketConnection(ws,message, callback){
    setTimeout(
        function () {
            if (Date.now()-date >200 && ws.readyState===1) {
                a=a+1;
			date=Date.now();
			var date1 = new Date().toISOString();
			console.log(date1);
			console.log(a);
			console.log(message);
			ws.send(JSON.stringify(message));
                    callback();
                return;
				}
			else if (ws.readyState===3)
			{
			ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
			exports.ws = ws;
			}
			else {
			waitForSocketConnection(ws,message, function(){});
			}
        }, 30); // wait 5 milisecond for the connection...
    //callback();
	}
function sendRequest(message, callback) {
waitForSocketConnection(ws,message,function(){
    callback();
});
}
