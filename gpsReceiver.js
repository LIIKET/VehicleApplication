var serialport = require('serialport');
var SerialPort = serialport;
var fs = require('fs');
var events = require('events');

var eventEmitter = new events.EventEmitter();
exports.eventEmitter = eventEmitter;

 

var COMPort;
function startReceiving(portName){
    COMPort = new SerialPort(portName, {
      baudRate: 4800,
      // look for newline
      parser: serialport.parsers.readline("\n")
    });

    COMPort.on('open', showPortOpen);
    COMPort.on('data', handleSerialData);
    COMPort.on('close', showPortClose);
    COMPort.on('error', showError);
    COMPort.on('disconnect', showDisconnect)
}
exports.StartReceiving = startReceiving;



var replayPos = 0;
function startReplay(fileName){

    var interval = setInterval(function() {

      var contents = fs.readFileSync(fileName);    
      obj = JSON.parse(contents); //now it's an object
      var pos = createPositionObject(obj.table[replayPos]);
      replayPos ++;
      eventEmitter.emit('received',pos);
    }, 1000);

}
exports.StartReplay = startReplay;



function handleSerialData(data) {

  //For now only handle GPGGA strings
  if(data.split(",")[0] == "$GPGGA"){

    var pos = createPositionObject(data);
  
    //record route?
    if(process.argv[2] == "record"){
        addPositionToReplay(data);
    }

   eventEmitter.emit('received',pos);
  }
}



function addPositionToReplay(data){
      fs.readFile(process.argv[3], 'utf8', function readFileCallback(err, filedata){
      if (err){
          console.log(err);
          //Create new file if not exists
          filedata = '{"table":[]}';
      } 
      obj = JSON.parse(filedata); //now it an object
      obj.table.push(data); //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile(process.argv[3], json, 'utf8', function(){}); // write it back 
      });
}



function createPositionObject(GPGGA){
    arr = GPGGA.split(",");

    //Calculate Latitude
    var minutesLat = arr[2].substring(arr[2].indexOf(".") - 2);
    var degreesLat = arr[2].substring(0, arr[2].length - minutesLat.length);
    minutesLat = parseFloat(minutesLat.trim());
    degreesLat = parseFloat(degreesLat.trim());   
    var Latitude = degreesLat + minutesLat/60;
    if(arr[3].trim().toUpperCase() == "S")
      Latitude = -Latitude;

    //Calculate Longitude
    var minutesLong = arr[4].substring(arr[4].indexOf(".") - 2);
    var degreesLong = arr[4].substring(0, arr[4].length - minutesLong.length);
    minutesLong = parseFloat(minutesLong.trim());
    degreesLong = parseFloat(degreesLong.trim());   
    var Longitude = degreesLong + minutesLong/60;
    if(arr[3].trim().toUpperCase() == "W")
    Longitude = -Longitude;

    var positionObj = {latitude: Latitude, longitude: Longitude};
    //console.log(positionObj.latitude);

    return positionObj;
}



//Functions that does nothing.
//TODO: IMPLEMENT SOME ERROR HANDLING IN THESE

function showPortOpen() {
   console.log('port open. Data rate: ' + COMPort.options.baudRate);
}

function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
  // Could not connect at application start
  //try and reconnect
   console.log('Serial port error: ' + error);
}

function showDisconnect(){
  console.log('Disconnected');
}

process.on('uncaughtException', function(err) {
  //Try and reconnect
console.log(err + 'asdddddddddd');
});



