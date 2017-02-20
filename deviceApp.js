
var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);

var config = require('./config.json');

//Initialize lightSwitch if allowed
if(!argv.nolight){
    var lightSwitch = require('./lightSwitch.js');
}

//Initialize Azure client if allowed
if(!argv.noazure){
    var Azure = require('./azureSender.js');
    Azure.Connect(config.HostName, config.DeviceId, config.AccessKey);

    Azure.eventEmitter.on('lightSwitch', function(){
        //Call lightswitch if active
        if(!argv.nolight){
            lightSwitch.lightSwitch();
        }
    });
}

//Initialize GPS if allowed
if(!argv.nogps)
{
    var GPS = require('./gpsReceiver.js');

    if(argv.record != null){
        GPS.EnableRecording(argv.record);
        console.log("Recording to: " + argv.record);
    }

    if(argv.replay == null){

        GPS.StartReceiving(config.PortName);
    }else{

        GPS.StartReplay(argv.replay);
    }

    GPS.eventEmitter.on('received', function(data)
    {
        var jsonToAzure = {messageType: "position", deviceId: config.DeviceId,telemetry: data};  
        //console.log(jsonToAzure);

        if(!argv.noazure){
            Azure.sendToCloud(jsonToAzure);  
        }
    })
}

//Initialize temperature sensor if allowed
if(!argv.notemp)
{
    var Sensor = require('./tempReceiver.js');
    Sensor.eventEmitter.on('received', function(data)
    {
        var jsonToAzure = {messageType: "sensor", deviceId: config.DeviceId, telemetry: data};
        console.log(jsonToAzure);

        if(!argv.noazure){
            Azure.sendToCloud(jsonToAzure);  
        }
    })
}

//Initialize fake obd2 reader if allowed
if(!argv.noobd)
{
    var obdReader = require('./fakeObdReader');
    obdReader.eventEmitter.on('received', function(data)
    {
        var jsonToAzure = {messageType: "obd", deviceId: config.DeviceId, telemetry: data};
        console.log(jsonToAzure);

        if(!argv.noazure){
            Azure.sendToCloud(jsonToAzure);  
        }
    })
}


