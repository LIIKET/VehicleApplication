
var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var events = require('events');

var eventEmitter = new events.EventEmitter();
exports.eventEmitter = eventEmitter;

var client;
function connect(HostName, DeviceId, AccessKey){
	var connectionString = 'HostName=' + HostName + ';DeviceId=' + DeviceId + ';SharedAccessKey=' + AccessKey;
	client = clientFromConnectionString(connectionString);
	client.open(connectCallback);
}
exports.Connect = connect;

function printResultFor(op){
	return function printResult(err, res){
		if(err) {
			console.log(op + ' error: ' + err.toString());
			client.open(connectCallback);
		}
		if(res) console.log(op + ' status: ' + res.constructor.name);
		
	};
}

var connectCallback = function(err){
	if(err){
		console.log('Could not connect: ' + err);
		client.open(connectCallback);		
	}else{
		console.log('Client connected');

     client.on('message', function (msg) {
       console.log('Id: ' + msg.messageId + ' BodLIGHTBITCHy: ' + msg.data);
       client.complete(msg, printResultFor('completed'));
	   eventEmitter.emit('lightSwitch');
     });
	}
};

var send = function sendToCloud(data){
		
			var json = JSON.stringify(data);
			var message = new Message(json);
			console.log("Sending message: " + message.getData());
			client.sendEvent(message, printResultFor('send'));
}

exports.sendToCloud = send;


