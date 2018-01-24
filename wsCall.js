var schedule = require('node-schedule');
var treatment = require('./treatmentFrame');
module.exports.webSocketCall = webSocketCall;

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;

function webSocketCall(dbase,rqst, rqstAuth,scheduler) {
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

        function sendRequest(message, callback) {
		waitForSocketConnection(ws,message,function(){
            
            callback();
        });
		}
		
		
        if (rqstAuth != null)
		{
            for (var i=0;i<rqst.length;i++)
            {
                sendRequest(rqstAuth, function() {
                    sendRequest(rqst[i], function () {});
		});
            }
		}
        else {
            for (var i=0;i<rqst.length;i++) {
                sendRequest(rqst[i], function () {});
            }
        }
    
			if (scheduler != null)
		{                
			var j = schedule.scheduleJob(scheduler, function () {
				if (rqstAuth != null)
		{
            for (var i=0;i<rqst.length;i++)
            {
                sendRequest(rqstAuth, function() {
                    sendRequest(rqst[i], function () {});
		});
            }
		}
        else {
            for (var i=0;i<rqst.length;i++) {
                sendRequest(rqst[i], function () {});
            }
        }
			});
		}
	}
}

function waitForSocketConnection(ws,message, callback){
var date=Date.now();
    setTimeout(
        function () {
            if (Date.now()-date <300) {
			ws.send(JSON.stringify(message));
                    callback();
                return;
				}
			else {
			waitForSocketConnection(ws,message, function(){});
			}    
        }, 300); // wait 5 milisecond for the connection...
}