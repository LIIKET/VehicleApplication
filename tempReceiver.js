// Read asynchronously from the sensor
var events = require('events');

var eventEmitter = new events.EventEmitter();
exports.eventEmitter = eventEmitter;

var sensor = require('node_dht_sensor');

var sensorType = 11;
var gpioPin = 4;

var count = 0;
var start = 0;
var end = 0;

var iid = setInterval(function() {

  start = new Date().getTime();

  sensor.read(sensorType, gpioPin, function(err, temperature, humidity) {
    end = new Date().getTime();
    if (err) {
      console.warn('' + err);
    } else {
      console.log("temperature: %s°C, humidity: %s%%, time: %dms",
                temperature.toFixed(1), humidity.toFixed(1), end - start);

                var sensorObj = {temperature: temperature.toFixed(1), humidity: humidity.toFixed(1)};
                eventEmitter.emit('received',sensorObj);
    }
  });

}, 3000);
