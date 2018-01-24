var treatment = require('./treatmentFrame');
module.exports.webSocketCall = webSocketCall;

var WebSocket = require('ws');
var ws = new WebSocket("wss://api.hitbtc.com/api/2/ws");
exports.ws = ws;

function webSocketCall(dbase,rqst, rqstAuth,scheduler) {
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