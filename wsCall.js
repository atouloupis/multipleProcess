var treatment = require('./treatmentFrame');
module.exports.webSocketCall = webSocketCall;

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;

function webSocketCall(dbase,rqst, rqstAuth) {
    ws.onopen = function() {
	console.log("CONNECTED");
        ws.onerror = function(evt) {};
        ws.onmessage = function(evt) {
            treatment.splitFrame(dbase,evt.data);
        };

        function sendRequest(message, callback) {
            ws.send(JSON.stringify(message));
            callback();
        }
        if (rqstAuth != null) 
		{
		sendRequest(rqstAuth, function() {
		sendRequest(rqst,function(){});
		});
		}
        else sendRequest(rqst,function(){});
    };
}