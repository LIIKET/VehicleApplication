var Gpio = require('onoff').Gpio,
	led = new Gpio(17, 'out');

var on = false;

exports.lightSwitch = function(){
	if(on == false){
		on = true;
			led.writeSync(1); //send 1 to Gpio pin 4
	}
	else{
		on = false;
			led.writeSync(0); //send 1 to Gpio pin 4
	}
}