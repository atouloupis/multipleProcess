var schedule = require('node-schedule');
var treatment = require('./treatmentFrame');
module.exports.webSocketCall = webSocketCall;

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;
var date=Date.now();
var a=0;

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
};
function webSocketCall(dbase,rqst, rqstAuth,scheduler) {
        if (rqstAuth != null)
		{
            for (var j=0;j<rqst.length;j++)
            {
                sendRequest(rqstAuth, function() {
                    sendRequest(rqst[j], function () {});
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
			schedule.scheduleJob(scheduler, function () {
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
