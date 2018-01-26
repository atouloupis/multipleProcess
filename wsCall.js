var schedule = require('node-schedule');
var treatment = require('./treatmentFrame');
module.exports.webSocketCall = webSocketCall;
var keyfile = './key.json';
var jsonfile = require('jsonfile');
var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;
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
    
	ws.onopen = function() {
		console.log("CONNECTED");
			ws.onerror = function(evt) {
			console.log("error");
			console.log(evt);
			};
			ws.onclose= function(evt){
			console.log("closing");
			console.log(evt);
			ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
			};
			ws.onmessage = function(evt) {
				treatment.splitFrame(dbase,evt.data);
			};
			sendRequest(rqstAuth, function() {});
	};
};

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
            if (Date.now()-date >1000 && ws.readyState===1) {
                console.log(message)
			date=Date.now();
			//ws.send(JSON.stringify(message));
                    callback();
                return;
				}
			else {
			waitForSocketConnection(ws,message, function(){});
			}
        }, 1000); // wait 5 milisecond for the connection...
    //callback();
	}
function sendRequest(message, callback) {
waitForSocketConnection(ws,message,function(){
    callback();
});
}
